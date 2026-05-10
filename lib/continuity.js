import crypto from "node:crypto";

export function normalizeContinuityLog(log = []) {
  return (Array.isArray(log) ? log : [])
    .map((entry) => ({
      id: String(entry.id || crypto.randomUUID()),
      type: String(entry.type || "station").slice(0, 40),
      title: String(entry.title || "Station event").slice(0, 140),
      detail: String(entry.detail || "").slice(0, 360),
      severity: ["info", "success", "warning", "danger"].includes(entry.severity) ? entry.severity : "info",
      sourceId: String(entry.sourceId || ""),
      entryId: String(entry.entryId || ""),
      suggestionId: String(entry.suggestionId || ""),
      createdAt: Number(entry.createdAt || Date.now())
    }))
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .slice(0, 160);
}

export function recordContinuityEvent(state, event = {}) {
  state.continuityLog = normalizeContinuityLog([
    {
      id: crypto.randomUUID(),
      type: event.type || "station",
      title: event.title || "Station event",
      detail: event.detail || "",
      severity: event.severity || "info",
      sourceId: event.sourceId || "",
      entryId: event.entryId || "",
      suggestionId: event.suggestionId || "",
      createdAt: Date.now()
    },
    ...(state.continuityLog || [])
  ]);
  return state.continuityLog[0];
}

export function publicContinuityLog(state, limit = 24) {
  state.continuityLog = normalizeContinuityLog(state.continuityLog);
  return state.continuityLog.slice(0, Math.max(1, Math.min(80, Number(limit || 24))));
}

function sceneById(scenes = [], id = "pirate") {
  return scenes.find((scene) => scene.id === id) || scenes[0] || {
    id: "pirate",
    label: "Pirate Takeover",
    color: "#ff715f",
    cueId: "identity-hit",
    chaosCeiling: 0.84,
    description: "General station identity, legal-ID flavor, and controlled chaos."
  };
}

export function blockIdentityPackFor(live = null, { blockIdentityPacks = [], performanceScenes = [] } = {}) {
  const blockText = `${live?.weeklyBlockId || ""} ${live?.weeklyBlockName || ""} ${live?.title || ""}`.trim();
  const pack = blockIdentityPacks.find((item) => item.match.test(blockText)) || null;
  const scene = sceneById(performanceScenes, pack?.sceneId || "pirate");
  if (pack) {
    return {
      label: pack.label,
      sceneId: pack.sceneId,
      sceneLabel: scene.label,
      sceneColor: scene.color,
      cueId: pack.cueId,
      chaosCeiling: pack.chaosCeiling,
      bumpPackage: pack.bumpPackage || ["block-bump", "legal-id-bump", "supporter-shoutout-bump"],
      note: scene.description
    };
  }
  return {
    label: "Station Default",
    sceneId: "pirate",
    sceneLabel: scene.label,
    sceneColor: scene.color,
    cueId: "identity-hit",
    chaosCeiling: 0.84,
    bumpPackage: ["legal-id-bump", "manual-bump", "supporter-shoutout-bump"],
    note: "General station identity, legal-ID flavor, and controlled chaos."
  };
}

function latestApprovedSuggestion(state) {
  return [...(state.community?.suggestions || [])]
    .filter((suggestion) => suggestion.status === "approved")
    .sort((a, b) => Number(b.reviewedAt || b.createdAt || 0) - Number(a.reviewedAt || a.createdAt || 0))[0] || null;
}

function activeCrewMoment(state) {
  const approved = latestApprovedSuggestion(state);
  if (approved) {
    return {
      type: "crew-pick",
      title: approved.title,
      username: approved.username || "the crew",
      line: `Crew pick from ${approved.username || "the crew"}: ${approved.title}`
    };
  }
  const message = [...(state.chat || [])]
    .filter((item) => item.role === "admin" || item.supporterTier === "crew" || item.supporterTier === "operator")
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0] || null;
  if (!message) return null;
  return {
    type: "crew-signal",
    title: message.text,
    username: message.username,
    line: `${message.username} is on the signal`
  };
}

function matchingLoreNote(state, pack = {}) {
  const candidates = (state.lore?.entries || [])
    .filter((entry) => entry.status !== "archived")
    .filter((entry) => {
      const haystack = [entry.title, entry.body, ...(entry.tags || [])].join(" ").toLowerCase();
      return haystack.includes(String(pack.sceneId || "").toLowerCase())
        || haystack.includes(String(pack.label || "").toLowerCase().split(" ")[0])
        || haystack.includes("mission")
        || haystack.includes("identity");
    });
  return candidates.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0] || null;
}

function legalIdFor(live = null, carts = [], now = Date.now()) {
  if (!carts.length) return null;
  const key = `${live?.weeklyBlockId || ""}:${live?.weeklyBlockName || ""}:${Math.floor(now / (1000 * 60 * 30))}`;
  let hash = 0;
  for (const char of key) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return carts[Math.abs(hash) % carts.length];
}

function bumpClassById(bumpClasses = [], id = "manual-bump") {
  return bumpClasses.find((item) => item.id === id) || { id, label: id.replace(/-/g, " "), status: "unknown" };
}

function chooseTransition({ state, live, next, pack, bumpClasses, legalId, now }) {
  const packageIds = Array.isArray(pack.bumpPackage) ? pack.bumpPackage : [];
  const communityMoment = activeCrewMoment(state);
  let bumpClass = packageIds.includes("crew-pick-bump") && communityMoment?.type === "crew-pick"
    ? "crew-pick-bump"
    : packageIds.includes("supporter-shoutout-bump") && communityMoment
      ? "supporter-shoutout-bump"
      : packageIds.includes("legal-id-bump")
        ? "legal-id-bump"
        : packageIds.includes("block-bump")
          ? "block-bump"
          : packageIds[0] || "manual-bump";
  let reason = "Keep the station identity audible between moments.";
  if (!live) {
    bumpClass = "auto-bump";
    reason = "No active program, so continuity should hold the signal until the next scheduled item.";
  } else if (live.gapFiller) {
    bumpClass = "auto-bump";
    reason = "Standby filler is airing; use short station-break language.";
  } else if (communityMoment?.type === "crew-pick") {
    reason = "A recent approved crew pick can make the audience influence visible.";
  } else if (bumpClass === "legal-id-bump") {
    reason = "The block identity calls for a station ID flavor.";
  }

  const classInfo = bumpClassById(bumpClasses, bumpClass);
  const nextTitle = next?.title || next?.source?.title || "";
  return {
    bumpClass,
    label: classInfo.label,
    status: classInfo.status,
    reason,
    legalId: legalId ? `${legalId.call} ${legalId.city}` : "",
    nextTitle,
    lines: [
      pack.label || "DoinkTV",
      communityMoment?.line || (legalId ? `${legalId.call} ${legalId.city}` : "Station continuity"),
      nextTitle ? `Next: ${nextTitle}` : "Signal continues shortly"
    ],
    generatedAt: now
  };
}

function stationVoiceFor(pack = {}, loreNote = null) {
  const voices = {
    anime: { id: "cel-drift", label: "Cel drift", tone: "late-night soft signal", slogan: "two frames from another timeline" },
    party: { id: "basement-party", label: "Basement party", tone: "irreverent room noise", slogan: "somebody touched the aux" },
    uhf: { id: "uhf-ghost", label: "UHF ghost", tone: "haunted local access", slogan: "please stand by forever" },
    training: { id: "training-tape", label: "Training tape", tone: "corporate AV unease", slogan: "module four: compliance fog" },
    pirate: { id: "pirate-relay", label: "Pirate relay", tone: "borrowed transmitter swagger", slogan: "nobody saw the paperwork" },
    community: { id: "crew-signal", label: "Crew signal", tone: "audience fingerprints", slogan: "the schedule has fingerprints" }
  };
  const voice = voices[pack.sceneId] || voices.pirate;
  return {
    ...voice,
    loreTitle: loreNote?.title || "",
    loreLine: loreNote?.body ? String(loreNote.body).split(/[.!?]\s/)[0].slice(0, 160) : ""
  };
}

export function continuityBrain(state, {
  live = null,
  next = null,
  blockIdentityPacks = [],
  performanceScenes = [],
  bumpClasses = [],
  legalIdCarts = [],
  now = Date.now()
} = {}) {
  state.continuityLog = normalizeContinuityLog(state.continuityLog);
  const blockPack = blockIdentityPackFor(live, { blockIdentityPacks, performanceScenes });
  const loreNote = matchingLoreNote(state, blockPack);
  const legalId = legalIdFor(live, legalIdCarts, now);
  const recentEvents = state.continuityLog.slice(0, 5);
  const communityMoment = activeCrewMoment(state);
  const stationVoice = stationVoiceFor(blockPack, loreNote);
  const transition = chooseTransition({
    state,
    live,
    next,
    pack: blockPack,
    bumpClasses,
    legalId,
    now
  });
  return {
    blockPack,
    stationVoice,
    transition,
    identity: {
      loreNote: loreNote ? {
        id: loreNote.id,
        type: loreNote.type,
        title: loreNote.title,
        tags: loreNote.tags || []
      } : null,
      communityMoment,
      recentEvents
    },
    legalId,
    bumpPackage: (blockPack.bumpPackage || []).map((id) => bumpClassById(bumpClasses, id)),
    generatedAt: now
  };
}
