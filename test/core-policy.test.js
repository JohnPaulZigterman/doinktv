import test from "node:test";
import assert from "node:assert/strict";

import {
  activeBroadcastEntries,
  planLongformContinuityBreaks,
  planWeatherBumpTargets
} from "../lib/programming-engine.js";
import {
  archiveLanguageFit,
  isClearlyPornographicArchiveCandidate,
  weeklyArchiveCandidateFitsBlock
} from "../lib/media-discovery.js";
import {
  activeBroadcastFx,
  beginAllFxDecay,
  clampFxParams,
  createFxEntry,
  normalizeFxDuration,
  registerFxPresetInstruments
} from "../lib/live-fx.js";
import { scheduleSourcesIntoWeeklyBlock } from "../lib/weekly-scheduler.js";

test("scheduled programming protects the live queue override lane", () => {
  const now = 100000;
  const state = {
    broadcastMode: "queue",
    schedule: [
      { id: "scheduled", sourceId: "s1", startAt: now + 30000, duration: 600 }
    ],
    liveQueue: [
      { id: "override", sourceId: "q1", startAt: now, duration: 90 },
      { id: "hidden", sourceId: "q2", startAt: now + 45000, duration: 90 }
    ]
  };

  const entries = activeBroadcastEntries(state);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].id, "override");
  assert.equal(entries[0].duration, 30);
  assert.equal(entries[0].clippedBySchedule, true);
  assert.equal(entries[1].id, "scheduled");
});

test("longform continuity planner respects first-break, spacing, and end guards", () => {
  const breaks = planLongformContinuityBreaks(
    { id: "movie", startAt: 100000, duration: 7200, sourceOffset: 0 },
    { status: "ready", breakpoints: [300, 900, 1300, 2100, 3900, 6900] },
    {
      now: 100000,
      firstAfterSeconds: 480,
      minSpacingSeconds: 1020,
      endGuardSeconds: 360,
      maxBreaks: 3
    }
  );

  assert.deepEqual(breaks, [900, 2100, 3900]);
});

test("weather bump planner spaces forecast breaks away from each other", () => {
  const now = 100000;
  const targets = planWeatherBumpTargets(
    [
      { id: "show", sourceId: "s1", startAt: now, duration: 7200 },
      { id: "weather", sourceId: "w1", startAt: now + 45 * 60 * 1000, duration: 34, weatherBump: true }
    ],
    {
      now,
      horizonMs: 3 * 60 * 60 * 1000,
      intervalMs: 45 * 60 * 1000,
      minGapMs: 20 * 60 * 1000,
      sourceFor: (entry) => ({ id: entry.sourceId, type: entry.weatherBump ? "bump" : "video" })
    }
  );

  assert.ok(targets.length >= 1);
  assert.ok(targets.every((target) => Math.abs(target - (now + 45 * 60 * 1000)) >= 20 * 60 * 1000));
  for (let index = 1; index < targets.length; index += 1) {
    assert.ok(targets[index] - targets[index - 1] >= 20 * 60 * 1000);
  }
});

test("language policy allows English or original language, but rejects mismatch dubs", () => {
  const animeBlock = { id: "late-night-anime", name: "Late Night Anime", minDuration: 45, requireAny: ["anime", "ova"] };
  assert.equal(archiveLanguageFit(animeBlock, { title: "Classic Anime OVA Japanese Audio", duration: 1200 }).ok, true);
  assert.equal(archiveLanguageFit(animeBlock, { title: "Classic Anime OVA English Dub", duration: 1200 }).ok, true);
  assert.equal(archiveLanguageFit(animeBlock, { title: "Classic Anime OVA French Dub", duration: 1200 }).ok, false);
  assert.equal(weeklyArchiveCandidateFitsBlock(animeBlock, { title: "Classic Anime OVA French Dub", duration: 1200 }), false);

  const mexicanShow = { title: "Mexican television special Espanol", duration: 1200 };
  const mexicanFrenchDub = { title: "Mexican television special French Dub", duration: 1200 };
  assert.equal(archiveLanguageFit({}, mexicanShow).ok, true);
  assert.equal(archiveLanguageFit({}, mexicanFrenchDub).ok, false);
});

test("explicit porn and hentai candidates are excluded", () => {
  assert.equal(isClearlyPornographicArchiveCandidate({ title: "Vintage public access cartoon" }), false);
  assert.equal(isClearlyPornographicArchiveCandidate({ title: "Explicit hentai compilation xxx" }), true);
  assert.equal(weeklyArchiveCandidateFitsBlock({ minDuration: 45 }, { title: "Explicit hentai compilation xxx", duration: 1200 }), false);
});

test("weekly block scheduler does not repeat the same episode key inside one block", () => {
  const block = { id: "retro", name: "RETRO", durationMinutes: 90 };
  const sources = [
    { id: "a", title: "Episode 01 - Archive A", duration: 1200, archiveId: "show", archiveFile: "episode-01.mp4" },
    { id: "b", title: "Episode 01 - Archive B", duration: 1200, archiveId: "show", archiveFile: "episode-01.mp4" },
    { id: "c", title: "Episode 02", duration: 1200, archiveId: "show", archiveFile: "episode-02.mp4" }
  ];
  const entries = scheduleSourcesIntoWeeklyBlock(block, sources, 100000, {
    blockBumpDuration: 16,
    createId: (() => {
      let index = 0;
      return () => `id-${index += 1}`;
    })(),
    sourceEpisodeKey: (source) => `${source.archiveId}:${source.archiveFile}`,
    createBumpSource: (blockInfo, kind, startAt) => ({
      id: `bump-${kind}-${startAt}`,
      title: `${blockInfo.name}: ${kind}`,
      duration: 16
    }),
    onBumpSource: () => {}
  });

  const scheduledSourceIds = entries.filter((entry) => !entry.blockBump).map((entry) => entry.sourceId);
  const scheduledSources = scheduledSourceIds.map((id) => sources.find((source) => source.id === id));
  const keys = scheduledSources.map((source) => `${source.archiveId}:${source.archiveFile}`);
  assert.equal(keys.length, new Set(keys).size);
  assert.equal(keys.includes("show:episode-01.mp4"), true);
  assert.equal(keys.includes("show:episode-02.mp4"), true);
});

test("FX policy clamps dangerous rack params and durations", () => {
  registerFxPresetInstruments({ "ui-css-panic": { label: "CSS panic", duration: 120 } });
  assert.equal(normalizeFxDuration("ui-css-panic", 120), 24);
  assert.deepEqual(clampFxParams("av-warp", { speed: 99, pitch: -4, desync: 80 }), {
    speed: 2,
    pitch: 0.5,
    desync: 4
  });
  assert.equal(clampFxParams("delay", { feedback: 50 }).feedback, 0.88);
  assert.equal(clampFxParams("reverb", { mix: 12 }).mix, 1);
});

test("FX clean return decays held instruments instead of leaving them stuck", () => {
  const now = 100000;
  const state = {
    activeFx: [
      createFxEntry({ id: "delay", params: { enabled: true, feedback: 0.5 }, now }),
      createFxEntry({ id: "signal-loss", isToggle: true, now })
    ]
  };
  assert.equal(state.activeFx.every((fx) => fx.expiresAt == null), true);
  beginAllFxDecay(state, now + 1000);
  assert.equal(state.activeFx.length, 2);
  assert.equal(state.activeFx.every((fx) => fx.state === "decaying"), true);
  assert.equal(state.activeFx.every((fx) => Number.isFinite(fx.expiresAt)), true);
});

test("FX wind down automatically when no admin remains online", () => {
  const now = 100000;
  const state = {
    activeFx: [createFxEntry({ id: "reverb", params: { enabled: true, mix: 0.5 }, now })]
  };
  const result = activeBroadcastFx(state, { adminOnline: false, graceMs: 0, now: now + 1000 });
  assert.equal(result.fx.length, 1);
  assert.equal(result.fx[0].state, "decaying");
  assert.ok(result.fx[0].expiresAt > now + 1000);
});
