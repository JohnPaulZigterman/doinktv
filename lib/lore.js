import crypto from "node:crypto";

export const LORE_ENTRY_TYPES = new Set(["lore", "theme", "errata"]);
export const LORE_ENTRY_STATUSES = new Set(["draft", "active", "archived"]);
const LORE_SEED_AT = Date.UTC(2026, 4, 10);

export const LORE_DEFAULTS = {
  entries: [
    {
      id: "station-spine",
      type: "lore",
      status: "active",
      title: "Station spine",
      tags: ["mission", "identity"],
      body: "DoinkTV is a Patreon-backed underground TV station performed like a live instrument: schedule, queue, Archive finds, community picks, bumps, and live FX all feeding one broadcast personality.",
      createdAt: LORE_SEED_AT,
      updatedAt: LORE_SEED_AT
    },
    {
      id: "chaos-rule",
      type: "theme",
      status: "active",
      title: "Chaos rule",
      tags: ["fx", "performance"],
      body: "Chaos should feel smooth, intentional, reversible, and worth watching. The station can get wild, but the operator should always feel in control of the signal.",
      createdAt: LORE_SEED_AT,
      updatedAt: LORE_SEED_AT
    },
    {
      id: "deployment-errata",
      type: "errata",
      status: "active",
      title: "Deployment errata",
      tags: ["security", "ops"],
      body: "Default local admin credentials are convenient for the prototype. Set ADMIN_USER and ADMIN_PASSWORD before any public deployment.",
      createdAt: LORE_SEED_AT,
      updatedAt: LORE_SEED_AT
    }
  ]
};

function normalizeLoreTags(value = []) {
  const rawTags = Array.isArray(value)
    ? value
    : String(value || "").split(",");
  return rawTags
    .map((tag) => String(tag || "").trim().toLowerCase().replace(/[^a-z0-9 -]/g, ""))
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeLoreEntry(entry = {}) {
  const now = Date.now();
  return {
    id: String(entry.id || crypto.randomUUID()),
    type: LORE_ENTRY_TYPES.has(entry.type) ? entry.type : "lore",
    status: LORE_ENTRY_STATUSES.has(entry.status) ? entry.status : "draft",
    title: String(entry.title || "").trim().slice(0, 120),
    tags: normalizeLoreTags(entry.tags),
    body: String(entry.body || "").trim().slice(0, 3000),
    createdAt: Number(entry.createdAt || now),
    updatedAt: Number(entry.updatedAt || entry.createdAt || now)
  };
}

export function normalizeLoreState(lore = {}) {
  const existingEntries = Array.isArray(lore.entries) ? lore.entries : [];
  const needsSeeds = existingEntries.length === 0;
  const byId = new Map();
  [...(needsSeeds ? LORE_DEFAULTS.entries : []), ...existingEntries]
    .map(normalizeLoreEntry)
    .filter((entry) => entry.title && entry.body)
    .forEach((entry) => {
      byId.set(entry.id, entry);
    });
  return {
    ...LORE_DEFAULTS,
    ...lore,
    entries: [...byId.values()]
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .slice(0, 240)
  };
}

export function publicLore(state, { query = "" } = {}) {
  state.lore = normalizeLoreState(state.lore);
  const cleanQuery = String(query || "").trim().toLowerCase();
  const entries = state.lore.entries.filter((entry) => {
    if (!cleanQuery) return true;
    return [
      entry.title,
      entry.body,
      entry.status,
      entry.type,
      ...(Array.isArray(entry.tags) ? entry.tags : [])
    ].join(" ").toLowerCase().includes(cleanQuery);
  });
  const counts = state.lore.entries.reduce((summary, entry) => {
    summary[entry.type] = (summary[entry.type] || 0) + 1;
    summary[entry.status] = (summary[entry.status] || 0) + 1;
    return summary;
  }, { lore: 0, theme: 0, errata: 0, draft: 0, active: 0, archived: 0 });
  return {
    types: [...LORE_ENTRY_TYPES],
    statuses: [...LORE_ENTRY_STATUSES],
    counts,
    entries
  };
}

export async function upsertLoreEntry({ state, body = {}, saveState, recordContinuityEvent }) {
  state.lore = normalizeLoreState(state.lore);
  const id = String(body.id || "").trim();
  const existing = id ? state.lore.entries.find((entry) => entry.id === id) : null;
  const nextEntry = normalizeLoreEntry({
    ...(existing || {}),
    id: existing?.id || id || crypto.randomUUID(),
    type: body.type ?? existing?.type,
    status: body.status ?? existing?.status,
    title: body.title ?? existing?.title,
    tags: body.tags ?? existing?.tags,
    body: body.body ?? existing?.body,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now()
  });
  if (!nextEntry.title || !nextEntry.body) {
    throw new Error("Lore notes need a title and body.");
  }
  state.lore.entries = [
    nextEntry,
    ...state.lore.entries.filter((entry) => entry.id !== nextEntry.id)
  ];
  state.lore = normalizeLoreState(state.lore);
  recordContinuityEvent({
    type: "lore",
    title: existing ? "Lore note updated" : "Lore note added",
    detail: `${loreTypeLabel(nextEntry.type)} / ${nextEntry.title}`,
    severity: nextEntry.type === "errata" ? "warning" : "info"
  });
  await saveState();
  return publicLore(state);
}

export function loreTypeLabel(type = "lore") {
  return {
    lore: "Lore",
    theme: "Theme",
    errata: "Errata"
  }[type] || "Lore";
}
