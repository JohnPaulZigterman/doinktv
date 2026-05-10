export function createProgramVotingController({
  state,
  mediaDiscovery,
  maxOptions = 4,
  sessionSupporterTier = () => ({ id: "viewer", weight: 1 }),
  getSession = () => null,
  currentProgram = () => null,
  saveState = async () => {},
  broadcastProgram = () => {},
  markDirty = () => {}
} = {}) {
  function publicProgramVotePoll(live) {
    if (!live?.id || !live.source) return null;
    if (live.gapFiller) return null;
    if (isClearlyPornographicArchiveCandidate({ ...live.source, title: live.title || live.source.title })) return null;
    const poll = ensureProgramVotePoll(live);
    maybeQueueComparableFilmSuggestions(poll, live);
    return publicVotePoll(poll);
  }

  function ensureProgramVotePoll(live) {
    state.programVotes ||= [];
    const pollId = `program:${live.id}`;
    let poll = state.programVotes.find((item) => item.id === pollId);
    if (!poll) {
      poll = {
        id: pollId,
        programId: live.id,
        sourceId: live.source.id,
        title: live.title || live.source.title || "Current program",
        startAt: live.startAt,
        duration: live.duration,
        weeklyBlockId: live.weeklyBlockId || "",
        weeklyBlockName: live.weeklyBlockName || "",
        isMovie: isMovieLikeProgram(live),
        isShow: isShowLikeProgram(live),
        suggestionsStatus: "idle",
        suggestions: [],
        votes: [],
        createdAt: Date.now()
      };
      state.programVotes.push(poll);
      state.programVotes = state.programVotes
        .filter((item) => Date.now() - Number(item.createdAt || 0) < 1000 * 60 * 60 * 24 * 45)
        .slice(-200);
      markDirty();
    }
    const isMovie = isMovieLikeProgram(live);
    const isShow = isShowLikeProgram(live);
    if (poll.isMovie !== isMovie || poll.isShow !== isShow) {
      poll.isMovie = isMovie;
      poll.isShow = isShow;
      markDirty();
    }
    return poll;
  }

  function publicVotePoll(poll = {}) {
    const options = votePollOptions(poll);
    const counts = Object.fromEntries(options.map((option) => [option.id, 0]));
    for (const vote of poll.votes || []) {
      if (vote?.optionId in counts) counts[vote.optionId] += Math.max(1, Math.min(4, Number(vote.weight || 1)));
    }
    const totalVotes = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return {
      id: poll.id,
      title: poll.title,
      weeklyBlockName: poll.weeklyBlockName,
      isMovie: Boolean(poll.isMovie),
      isShow: Boolean(poll.isShow),
      suggestionsStatus: poll.suggestionsStatus || "idle",
      options: options.map((option) => ({
        ...option,
        votes: counts[option.id] || 0
      })),
      totalVotes,
      totalBallots: (poll.votes || []).length
    };
  }

  function votePollOptions(poll = {}) {
    const options = [
      ...(poll.isShow ? [{
        id: "next-episode",
        type: "slot",
        label: "Next episode",
        description: "Continue"
      }] : []),
      {
        id: "keep-slot",
        type: "slot",
        label: "More like this",
        description: "Same vibe"
      },
      {
        id: "open-slot",
        type: "slot",
        label: "Open slot",
        description: "Change it up"
      }
    ];
    if (poll.isMovie) {
      for (const suggestion of cleanVoteSuggestions(poll.suggestions || [])) {
        options.push({
          id: `archive:${suggestion.archiveId}:${suggestion.archiveFile}`,
          type: "archive-film",
          label: suggestion.title || suggestion.fileTitle || "Comparable film",
          description: [suggestion.year, suggestion.creator].filter(Boolean).join(" - "),
          url: suggestion.url,
          archiveId: suggestion.archiveId,
          archiveFile: suggestion.archiveFile,
          duration: suggestion.duration
        });
      }
    }
    return options.slice(0, maxOptions);
  }

  function maybeQueueComparableFilmSuggestions(poll, live) {
    if (!poll?.isMovie || poll.suggestionsStatus !== "idle" || (poll.suggestions || []).length) return;
    poll.suggestionsStatus = "loading";
    markDirty();
    comparableFilmSuggestions(live)
      .then(async (suggestions) => {
        const current = (state.programVotes || []).find((item) => item.id === poll.id);
        if (!current) return;
        current.suggestions = cleanVoteSuggestions(suggestions);
        current.suggestionsStatus = current.suggestions.length ? "ready" : "empty";
        await saveState();
        broadcastProgram();
      })
      .catch(async () => {
        const current = (state.programVotes || []).find((item) => item.id === poll.id);
        if (!current) return;
        current.suggestions = [];
        current.suggestionsStatus = "error";
        await saveState();
        broadcastProgram();
      });
  }

  async function castProgramVote(req, body = {}) {
    const live = currentProgram()?.live;
    if (!live) throw new Error("There is no live program to vote on.");
    if (isClearlyPornographicArchiveCandidate({ ...live.source, title: live.title || live.source?.title })) {
      throw new Error("Voting is not available for this program.");
    }
    const poll = ensureProgramVotePoll(live);
    const optionId = String(body.optionId || "").trim();
    if (!votePollOptions(poll).some((option) => option.id === optionId)) throw new Error("That vote option is not available.");
    const voterId = String(body.voterId || "").replace(/[^a-z0-9-]/gi, "").slice(0, 80);
    if (!voterId) throw new Error("Missing voter id.");
    const session = getSession(req);
    const tier = sessionSupporterTier(session);
    const voterKey = session ? `user:${session.userId || session.username}` : `anon:${voterId}`;
    poll.votes = (poll.votes || []).filter((vote) => vote.voterId !== voterKey);
    poll.votes.push({
      voterId: voterKey,
      optionId,
      weight: Math.max(1, Math.min(4, Number(tier.weight || 1))),
      supporterTier: tier.id,
      username: session?.username || "",
      createdAt: Date.now()
    });
    await saveState();
    broadcastProgram();
    return publicVotePoll(poll);
  }

  function comparableFilmSuggestions(live = {}) {
    return mediaDiscovery.comparableFilmSuggestions(live, { maxOptions });
  }

  function isMovieLikeProgram(live = {}) {
    return mediaDiscovery.isMovieLikeProgram(live);
  }

  function isShowLikeProgram(live = {}) {
    return mediaDiscovery.isShowLikeProgram(live);
  }

  function cleanVoteSuggestions(suggestions = []) {
    return mediaDiscovery.cleanVoteSuggestions(suggestions);
  }

  function isClearlyPornographicArchiveCandidate(candidate = {}) {
    return mediaDiscovery.isClearlyPornographicArchiveCandidate(candidate);
  }

  return {
    publicProgramVotePoll,
    ensureProgramVotePoll,
    publicVotePoll,
    votePollOptions,
    castProgramVote,
    comparableFilmSuggestions,
    isMovieLikeProgram,
    isShowLikeProgram,
    cleanVoteSuggestions,
    isClearlyPornographicArchiveCandidate
  };
}
