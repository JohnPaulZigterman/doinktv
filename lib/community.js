import crypto from "node:crypto";

export const SUPPORTER_TIERS = [
  { id: "viewer", label: "Viewer", badge: "VIEWER", weight: 1, description: "Watching the free signal." },
  { id: "crew", label: "Station Crew", badge: "CREW", weight: 2, description: "Patreon supporter with programming influence and chat recognition." },
  { id: "operator", label: "Signal Operator", badge: "OP", weight: 3, description: "Higher-support crew with deeper station influence hooks." }
];

export const COMMUNITY_MODES = new Set(["open-signal", "crew-week", "takeover-night"]);

export const COMMUNITY_DEFAULTS = {
  stationMode: "open-signal",
  supporterGoal: "Fund stranger blocks, cleaner continuity, and bigger live takeover nights.",
  spotlight: "Supporter picks help steer future programming.",
  takeoverPolicy: "Supporters can suggest chaos; admins still perform the takeover live.",
  suggestions: []
};

export function supporterTierById(id = "viewer") {
  return SUPPORTER_TIERS.find((tier) => tier.id === id) || SUPPORTER_TIERS[0];
}

export function sessionSupporterTier(state, session = null) {
  if (!session) return supporterTierById("viewer");
  if (session.role === "admin") return { id: "host", label: "Station Host", badge: "HOST", weight: 4 };
  const user = state.users.find((item) => item.id === session.userId || item.username === session.username);
  return supporterTierById(user?.supporterTier || "viewer");
}

export function normalizeCommunityState(community = {}) {
  const suggestions = Array.isArray(community.suggestions) ? community.suggestions : [];
  return {
    ...COMMUNITY_DEFAULTS,
    ...community,
    stationMode: COMMUNITY_MODES.has(community.stationMode) ? community.stationMode : COMMUNITY_DEFAULTS.stationMode,
    supporterGoal: String(community.supporterGoal || COMMUNITY_DEFAULTS.supporterGoal).slice(0, 180),
    spotlight: String(community.spotlight || COMMUNITY_DEFAULTS.spotlight).slice(0, 160),
    takeoverPolicy: String(community.takeoverPolicy || COMMUNITY_DEFAULTS.takeoverPolicy).slice(0, 180),
    suggestions: suggestions
      .map((suggestion) => ({
        id: String(suggestion.id || crypto.randomUUID()),
        title: String(suggestion.title || "").trim().slice(0, 120),
        note: String(suggestion.note || "").trim().slice(0, 320),
        username: String(suggestion.username || "viewer").slice(0, 32),
        supporterTier: String(suggestion.supporterTier || "viewer"),
        status: ["pending", "approved", "archived"].includes(suggestion.status) ? suggestion.status : "pending",
        createdAt: Number(suggestion.createdAt || Date.now()),
        reviewedAt: suggestion.reviewedAt ? Number(suggestion.reviewedAt) : 0,
        outcome: suggestion.outcome && typeof suggestion.outcome === "object"
          ? {
            type: String(suggestion.outcome.type || "").slice(0, 40),
            label: String(suggestion.outcome.label || "").slice(0, 140),
            sourceId: String(suggestion.outcome.sourceId || ""),
            queueEntryId: String(suggestion.outcome.queueEntryId || ""),
            scheduleEntryId: String(suggestion.outcome.scheduleEntryId || ""),
            at: Number(suggestion.outcome.at || Date.now())
          }
          : null
      }))
      .filter((suggestion) => suggestion.title)
      .slice(-120)
  };
}

export function activeCommunityCrew(state) {
  const byName = new Map();
  const remember = ({ username, supporterTier, activity, createdAt }) => {
    if (!username) return;
    const tier = supporterTier === "host"
      ? { id: "host", label: "Station Host", badge: "HOST", weight: 4 }
      : supporterTierById(supporterTier || "viewer");
    if (tier.id === "viewer" && supporterTier !== "host") return;
    const key = username.toLowerCase();
    const current = byName.get(key);
    if (current && Number(current.createdAt || 0) >= Number(createdAt || 0)) return;
    byName.set(key, {
      username,
      supporterTier: tier.id,
      supporterLabel: tier.label,
      supporterBadge: tier.badge,
      activity,
      createdAt: Number(createdAt || 0)
    });
  };

  for (const message of state.chat || []) {
    remember({
      username: message.username,
      supporterTier: message.role === "admin" ? "host" : message.supporterTier,
      activity: "chat",
      createdAt: message.createdAt
    });
  }
  for (const suggestion of state.community.suggestions || []) {
    remember({
      username: suggestion.username,
      supporterTier: suggestion.supporterTier,
      activity: suggestion.status === "approved" ? "pick approved" : "pick sent",
      createdAt: suggestion.reviewedAt || suggestion.createdAt
    });
  }

  return [...byName.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
}

export function publicCommunity(state, { admin = false } = {}) {
  state.community = normalizeCommunityState(state.community);
  const crewCount = state.users.filter((user) => ["crew", "operator"].includes(user.supporterTier)).length;
  const pendingSuggestions = state.community.suggestions.filter((suggestion) => suggestion.status === "pending");
  const approvedSuggestions = state.community.suggestions.filter((suggestion) => suggestion.status === "approved").slice(-6).reverse();
  const suggestionCounts = state.community.suggestions.reduce((counts, suggestion) => {
    counts[suggestion.status] = (counts[suggestion.status] || 0) + 1;
    return counts;
  }, { pending: 0, approved: 0, archived: 0 });
  const members = admin
    ? state.users
        .map((user) => {
          const tier = supporterTierById(user.supporterTier || "viewer");
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            supporterTier: tier.id,
            supporterLabel: tier.label,
            supporterBadge: tier.badge,
            createdAt: user.createdAt || 0
          };
        })
        .sort((a, b) => String(a.username).localeCompare(String(b.username)))
    : [];
  return {
    stationMode: state.community.stationMode,
    supporterGoal: state.community.supporterGoal,
    spotlight: state.community.spotlight,
    takeoverPolicy: state.community.takeoverPolicy,
    tiers: SUPPORTER_TIERS,
    crewCount,
    pendingSuggestionCount: pendingSuggestions.length,
    suggestionCounts,
    activeCrew: activeCommunityCrew(state),
    suggestions: admin ? [...state.community.suggestions].reverse() : approvedSuggestions,
    recentOutcomes: state.community.suggestions
      .filter((suggestion) => suggestion.outcome)
      .sort((a, b) => Number(b.outcome?.at || b.reviewedAt || b.createdAt || 0) - Number(a.outcome?.at || a.reviewedAt || a.createdAt || 0))
      .slice(0, admin ? 12 : 4),
    members
  };
}

export async function createCommunitySuggestion({ state, session, body = {}, saveState, broadcastChat, recordContinuityEvent }) {
  if (!session) throw new Error("Log in to suggest programming.");
  const title = String(body.title || "").replace(/\s+/g, " ").trim().slice(0, 120);
  const note = String(body.note || "").replace(/\s+/g, " ").trim().slice(0, 320);
  if (title.length < 3) throw new Error("Give the suggestion a title.");
  const tier = sessionSupporterTier(state, session);
  state.community = normalizeCommunityState(state.community);
  const suggestion = {
    id: crypto.randomUUID(),
    title,
    note,
    username: session.username,
    supporterTier: tier.id,
    status: "pending",
    createdAt: Date.now()
  };
  state.community.suggestions.push(suggestion);
  state.community.suggestions = state.community.suggestions.slice(-120);
  recordContinuityEvent({
    type: "community",
    title: "Crew pick submitted",
    detail: `${session.username} suggested ${title}.`,
    suggestionId: suggestion.id
  });
  await saveState();
  broadcastChat();
  return suggestion;
}

export async function updateCommunitySettings({ state, body = {}, saveState, broadcastChat }) {
  state.community = normalizeCommunityState({
    ...state.community,
    stationMode: COMMUNITY_MODES.has(body.stationMode) ? body.stationMode : state.community.stationMode,
    supporterGoal: body.supporterGoal ?? state.community.supporterGoal,
    spotlight: body.spotlight ?? state.community.spotlight,
    takeoverPolicy: body.takeoverPolicy ?? state.community.takeoverPolicy
  });
  await saveState();
  broadcastChat();
  return publicCommunity(state, { admin: true });
}

export async function updateCommunitySuggestion({ state, body = {}, saveState, broadcastChat, recordContinuityEvent }) {
  const id = String(body.id || "");
  const status = ["pending", "approved", "archived"].includes(body.status) ? body.status : "";
  if (!id || !status) throw new Error("Choose a valid suggestion action.");
  state.community = normalizeCommunityState(state.community);
  const suggestion = state.community.suggestions.find((item) => item.id === id);
  if (!suggestion) throw new Error("Suggestion not found.");
  suggestion.status = status;
  suggestion.reviewedAt = Date.now();
  if (body.outcome && typeof body.outcome === "object") {
    suggestion.outcome = {
      type: String(body.outcome.type || status).slice(0, 40),
      label: String(body.outcome.label || suggestion.title).slice(0, 140),
      sourceId: String(body.outcome.sourceId || ""),
      queueEntryId: String(body.outcome.queueEntryId || ""),
      scheduleEntryId: String(body.outcome.scheduleEntryId || ""),
      at: Date.now()
    };
  }
  recordContinuityEvent({
    type: "community",
    title: `Crew pick ${status}`,
    detail: `${suggestion.title}${suggestion.outcome?.label ? ` -> ${suggestion.outcome.label}` : ""}`,
    severity: status === "approved" ? "success" : status === "archived" ? "warning" : "info",
    suggestionId: suggestion.id,
    sourceId: suggestion.outcome?.sourceId || "",
    entryId: suggestion.outcome?.queueEntryId || suggestion.outcome?.scheduleEntryId || ""
  });
  await saveState();
  broadcastChat();
  return publicCommunity(state, { admin: true });
}

export async function updateSupporterTier({ state, body = {}, saveState, broadcastChat }) {
  const userId = String(body.userId || "");
  const tier = supporterTierById(body.supporterTier || "viewer");
  const user = state.users.find((item) => item.id === userId);
  if (!user) throw new Error("User not found.");
  user.supporterTier = tier.id;
  user.supporterUpdatedAt = Date.now();
  await saveState();
  broadcastChat();
  return publicCommunity(state, { admin: true });
}
