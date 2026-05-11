import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const STATION_STATE_DOMAINS = {
  mediaLibrary: ["sources", "sourceFolders", "bumpMusic"],
  programming: ["schedule", "weeklyBlocks", "liveQueue", "broadcastMode", "nowPlaying", "lastAutoBumpAt", "fadeBreaks"],
  audience: ["users", "chat"],
  voting: ["programVotes"],
  identity: ["community", "lore"],
  performance: ["activeFx", "fxSnapshots", "continuityLog"]
};

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function passthroughArray(value) {
  return Array.isArray(value) ? value : [];
}

function passthroughObject(value) {
  return isRecord(value) ? value : {};
}

export function stationStateDefaults({ communityDefaults = {} } = {}) {
  return {
    sources: [],
    sourceFolders: [],
    schedule: [],
    weeklyBlocks: [],
    liveQueue: [],
    broadcastMode: "scheduled",
    lastAutoBumpAt: 0,
    bumpMusic: [],
    users: [],
    chat: [],
    programVotes: [],
    community: { ...communityDefaults },
    lore: { entries: [] },
    nowPlaying: null,
    activeFx: [],
    fxSnapshots: [],
    fadeBreaks: {},
    continuityLog: []
  };
}

export function normalizeStationState(raw = {}, {
  defaultState = stationStateDefaults(),
  normalizers = {}
} = {}) {
  const base = cloneJson(defaultState);
  const incoming = isRecord(raw) ? raw : {};
  const state = {
    ...base,
    ...incoming
  };

  return normalizePerformanceDomain(
    normalizeIdentityDomain(
      normalizeVotingDomain(
        normalizeAudienceDomain(
          normalizeProgrammingDomain(
            normalizeMediaLibraryDomain(state)
          )
        )
      ),
      normalizers
    ),
    normalizers
  );
}

export function normalizeMediaLibraryDomain(state) {
  state.sources = passthroughArray(state.sources)
    .filter(isRecord)
    .map((source) => ({
      ...source,
      randomEligible: source.randomEligible ?? source.type !== "youtube"
    }));
  state.sourceFolders = passthroughArray(state.sourceFolders)
    .filter(isRecord)
    .map((folder) => ({
      ...folder,
      randomEligible: folder.randomEligible !== false
    }));
  state.bumpMusic = passthroughArray(state.bumpMusic);
  return state;
}

export function normalizeProgrammingDomain(state) {
  state.schedule = passthroughArray(state.schedule);
  state.weeklyBlocks = passthroughArray(state.weeklyBlocks);
  state.liveQueue = passthroughArray(state.liveQueue);
  state.broadcastMode = state.broadcastMode === "queue" ? "queue" : "scheduled";
  state.lastAutoBumpAt = Number(state.lastAutoBumpAt || 0);
  state.nowPlaying = state.nowPlaying || null;
  state.fadeBreaks = passthroughObject(state.fadeBreaks);
  return state;
}

export function normalizeAudienceDomain(state) {
  state.users = passthroughArray(state.users)
    .filter(isRecord)
    .map((user) => ({
      ...user,
      status: user.status === "disabled" ? "disabled" : "active"
    }));
  state.chat = passthroughArray(state.chat);
  return state;
}

export function normalizeVotingDomain(state) {
  state.programVotes = passthroughArray(state.programVotes);
  return state;
}

export function normalizeIdentityDomain(state, normalizers = {}) {
  const normalizeCommunityState = normalizers.normalizeCommunityState || passthroughObject;
  const normalizeLoreState = normalizers.normalizeLoreState || passthroughObject;
  state.community = normalizeCommunityState(state.community);
  state.lore = normalizeLoreState(state.lore);
  return state;
}

export function normalizePerformanceDomain(state, normalizers = {}) {
  const normalizeContinuityLog = normalizers.normalizeContinuityLog || passthroughArray;
  const normalizeFxSnapshots = normalizers.normalizeFxSnapshots || passthroughArray;
  state.activeFx = passthroughArray(state.activeFx);
  state.fxSnapshots = normalizeFxSnapshots(state.fxSnapshots);
  state.continuityLog = normalizeContinuityLog(state.continuityLog);
  return state;
}

export function stationDomainView(state = {}, domain = "") {
  const keys = STATION_STATE_DOMAINS[domain] || [];
  return Object.fromEntries(keys.map((key) => [key, state[key]]));
}

export function programmingDomainView(state = {}) {
  return stationDomainView(state, "programming");
}

export async function loadStationState({ statePath, seedPath = "", defaultState = stationStateDefaults(), normalizers = {} }) {
  await mkdir(path.dirname(statePath), { recursive: true });
  const readPath = existsSync(statePath) ? statePath : seedPath && existsSync(seedPath) ? seedPath : "";
  if (!readPath) {
    return {
      state: normalizeStationState(defaultState, { defaultState, normalizers }),
      created: true
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(await readFile(readPath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read station state JSON at ${readPath}: ${error.message}`);
  }

  return {
    state: normalizeStationState(parsed, { defaultState, normalizers }),
    created: readPath !== statePath
  };
}

export async function saveStationState({ statePath, state, retries = 4 }) {
  await mkdir(path.dirname(statePath), { recursive: true });
  const payload = `${JSON.stringify(state, null, 2)}\n`;
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await writeFile(statePath, payload);
      return;
    } catch (error) {
      lastError = error;
      await wait(75 * attempt);
    }
  }
  throw lastError;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
