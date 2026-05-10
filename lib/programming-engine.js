export const PROGRAMMING_LANES = {
  SCHEDULED: "scheduled",
  OVERRIDE: "queue"
};

export function entryEnd(entry = {}) {
  return Number(entry.startAt || 0) + Number(entry.duration || 0) * 1000;
}

export function entriesOverlap(first = {}, second = {}) {
  return Number(first.startAt || 0) < entryEnd(second) && Number(second.startAt || 0) < entryEnd(first);
}

export function sourceForEntry(state = {}, entry = {}) {
  return (state.sources || []).find((source) => source.id === entry.sourceId) || null;
}

export function isBumpSource(source = {}) {
  return source?.type === "bump";
}

export function isAudienceScheduleEntry(entry = {}) {
  return entry?.source && !entry.gapFiller && !entry.autoBump && !isBumpSource(entry.source);
}

export function protectOverrideEntryAgainstSchedule(entry = {}, scheduled = []) {
  const conflict = scheduled
    .filter((scheduleEntry) => entriesOverlap(entry, scheduleEntry))
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0))[0];
  if (!conflict) return entry;
  if (Number(entry.startAt || 0) >= Number(conflict.startAt || 0)) return null;
  const duration = Math.floor((Number(conflict.startAt || 0) - Number(entry.startAt || 0)) / 1000);
  return duration >= 5 ? { ...entry, duration, clippedBySchedule: true } : null;
}

export function activeBroadcastEntries(state = {}) {
  const scheduled = (state.schedule || []).map((entry) => ({
    ...entry,
    broadcastLane: PROGRAMMING_LANES.SCHEDULED,
    programmingRole: "scheduled-programming"
  }));
  if (state.broadcastMode !== PROGRAMMING_LANES.OVERRIDE) {
    return scheduled.sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
  }

  const protectedOverrides = (state.liveQueue || [])
    .map((entry) => protectOverrideEntryAgainstSchedule(entry, scheduled))
    .filter(Boolean)
    .map((entry) => ({
      ...entry,
      broadcastLane: PROGRAMMING_LANES.OVERRIDE,
      programmingRole: "live-override"
    }));

  return [...scheduled, ...protectedOverrides]
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
}

export function entryReason(entry = {}) {
  if (entry.gapFiller) return "Standby filler until scheduled programming resumes.";
  if (entry.autoBump || entry.source?.type === "bump") return "Station continuity bump.";
  if (entry.broadcastLane === PROGRAMMING_LANES.OVERRIDE) return "Live override selected by admin.";
  if (entry.weeklyBlockName) return `Scheduled block: ${entry.weeklyBlockName}.`;
  return "Scheduled programming.";
}

export function publicEntry(entry = {}, {
  now = Date.now(),
  includeOffset = false,
  blockIdentityForEntry = () => null
} = {}) {
  const source = entry.source || {};
  const payload = {
    id: entry.id,
    title: entry.title || source.title,
    startAt: entry.startAt,
    duration: entry.duration,
    sourceOffset: Math.max(0, Number(entry.sourceOffset || 0)),
    lane: entry.broadcastLane || PROGRAMMING_LANES.SCHEDULED,
    programmingRole: entry.programmingRole || (entry.broadcastLane === PROGRAMMING_LANES.OVERRIDE ? "live-override" : "scheduled-programming"),
    weeklyBlockId: entry.weeklyBlockId || "",
    weeklyBlockName: entry.weeklyBlockName || "",
    blockIdentity: blockIdentityForEntry(entry),
    gapFiller: Boolean(entry.gapFiller),
    reason: entryReason(entry),
    source
  };
  if (includeOffset) payload.offset = Math.max(0, (now - Number(entry.startAt || now)) / 1000);
  return payload;
}

export function resolveBroadcastTimeline(state = {}, {
  now = Date.now(),
  blockIdentityForEntry = () => null
} = {}) {
  const entries = activeBroadcastEntries(state)
    .map((entry) => ({
      ...entry,
      source: sourceForEntry(state, entry)
    }))
    .filter((entry) => entry.source && Number.isFinite(entry.startAt) && Number.isFinite(entry.duration))
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));

  const live = entries.find((entry) => now >= Number(entry.startAt || 0) && now < entryEnd(entry));
  const next = entries.find((entry) => Number(entry.startAt || 0) > now && isAudienceScheduleEntry(entry));

  return {
    serverTime: now,
    mode: state.broadcastMode === PROGRAMMING_LANES.OVERRIDE ? PROGRAMMING_LANES.OVERRIDE : PROGRAMMING_LANES.SCHEDULED,
    operatingSystem: "programming-engine",
    live: live ? publicEntry(live, { now, includeOffset: true, blockIdentityForEntry }) : null,
    next: next ? publicEntry(next, { now, blockIdentityForEntry }) : null
  };
}

export function nextPlayoutProgram(state = {}, live = null, {
  now = Date.now(),
  blockIdentityForEntry = () => null
} = {}) {
  if (!live?.id) return null;
  const next = activeBroadcastEntries(state)
    .map((entry) => ({
      ...entry,
      source: sourceForEntry(state, entry)
    }))
    .filter((entry) => entry.source && Number.isFinite(entry.startAt) && Number.isFinite(entry.duration))
    .filter((entry) => entry.id !== live.id && Number(entry.startAt || 0) >= now - 500)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0))[0];
  if (!next) return null;
  return {
    ...publicEntry(next, { now, blockIdentityForEntry }),
    offset: 0
  };
}

export function queueProtectionSummary(state = {}, now = Date.now()) {
  const scheduled = (state.schedule || [])
    .filter((entry) => entryEnd(entry) > now)
    .map((entry) => ({ ...entry, broadcastLane: PROGRAMMING_LANES.SCHEDULED }));
  const liveQueue = (state.liveQueue || []).filter((entry) => entryEnd(entry) > now);
  const hidden = liveQueue.filter((entry) => !protectOverrideEntryAgainstSchedule(entry, scheduled)).length;
  const clipped = liveQueue.filter((entry) => {
    const protectedEntry = protectOverrideEntryAgainstSchedule(entry, scheduled);
    return protectedEntry && protectedEntry.clippedBySchedule;
  }).length;
  return {
    scheduled: scheduled.length,
    overrides: liveQueue.length,
    hidden,
    clipped,
    protectedSchedule: scheduled.length
  };
}

export function plannedGapFillWindow(schedule = [], {
  now = Date.now(),
  version = 1,
  lookaheadMs = 1000 * 60 * 90,
  minGapSeconds = 20
} = {}) {
  const realSchedule = (schedule || [])
    .filter((entry) => !entry.gapFiller)
    .filter((entry) => entryEnd(entry) > now - 1000 * 60)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
  const currentReal = realSchedule.find((entry) => now >= Number(entry.startAt || 0) && now < entryEnd(entry));
  const nextReal = realSchedule.find((entry) => Number(entry.startAt || 0) > now);
  const prunedSchedule = (schedule || []).filter((entry) => {
    if (!entry.gapFiller) return true;
    if (entry.gapFillerVersion !== version) return false;
    if (entryEnd(entry) < now - 1000 * 30) return false;
    if (!nextReal || currentReal) return entryEnd(entry) < now + 1000 * 5;
    if (Number(entry.startAt || 0) >= Number(nextReal.startAt || 0)) return false;
    return !realSchedule.some((realEntry) => entriesOverlap(entry, realEntry));
  });

  if (currentReal || !nextReal) {
    return {
      schedule: prunedSchedule,
      currentReal,
      nextReal,
      shouldFill: false,
      fillUntil: 0,
      cursor: now,
      existingFillers: [],
      changed: prunedSchedule.length !== (schedule || []).length
    };
  }

  const fillUntil = Math.min(Number(nextReal.startAt || 0), now + lookaheadMs);
  if ((fillUntil - now) / 1000 < minGapSeconds) {
    return {
      schedule: prunedSchedule,
      currentReal,
      nextReal,
      shouldFill: false,
      fillUntil,
      cursor: now,
      existingFillers: [],
      changed: prunedSchedule.length !== (schedule || []).length
    };
  }

  const existingFillers = prunedSchedule
    .filter((entry) => entry.gapFiller && entryEnd(entry) > now - 1000 && Number(entry.startAt || 0) < fillUntil)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
  const cursor = existingFillers.reduce((latest, entry) => Math.max(latest, entryEnd(entry)), now);

  return {
    schedule: prunedSchedule,
    currentReal,
    nextReal,
    shouldFill: cursor < fillUntil - minGapSeconds * 1000,
    fillUntil,
    cursor,
    existingFillers,
    changed: prunedSchedule.length !== (schedule || []).length
  };
}

export function shouldUseGapFillerBump(index = 0, remainingSeconds = 0, minSourceSeconds = 8) {
  return index % 3 !== 2 || remainingSeconds < minSourceSeconds + 4;
}

export function weatherBumpEntries(entries = [], { sourceFor = () => null } = {}) {
  return (entries || [])
    .map((entry) => ({
      ...entry,
      source: entry.source || sourceFor(entry)
    }))
    .filter((entry) => entry.weatherBump || entry.source?.bump?.kind === "weather-bump")
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
}

export function planWeatherBumpTargets(entries = [], {
  now = Date.now(),
  horizonMs = 1000 * 60 * 60 * 5,
  intervalMs = 1000 * 60 * 45,
  minGapMs = 1000 * 60 * 20,
  sourceFor = () => null
} = {}) {
  const horizon = now + horizonMs;
  const active = (entries || [])
    .filter((entry) => entryEnd(entry) > now && Number(entry.startAt || 0) < horizon)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
  const hasRealProgram = active.some((entry) => {
    const source = entry.source || sourceFor(entry);
    return source && !isBumpSource(source);
  });
  if (!hasRealProgram) return [];

  const targets = [];
  let weatherEntries = weatherBumpEntries(active, { sourceFor });
  let lastWeatherAt = weatherEntries.filter((entry) => Number(entry.startAt || 0) <= now).at(-1)?.startAt || now - intervalMs;
  let target = Math.max(Number(lastWeatherAt) + intervalMs, now + 1000 * 60 * 2);

  while (target < horizon) {
    const existing = weatherEntries.find((entry) => Number(entry.startAt || 0) >= Number(lastWeatherAt) + minGapMs && Number(entry.startAt || 0) <= target);
    if (existing) {
      lastWeatherAt = Number(existing.startAt || 0);
      target = lastWeatherAt + intervalMs;
      continue;
    }

    target = Math.max(target, Number(lastWeatherAt) + minGapMs, now + 1000 * 60 * 2);
    const tooClose = weatherEntries.some((entry) => Math.abs(Number(entry.startAt || 0) - target) < minGapMs);
    if (!tooClose) {
      targets.push(target);
      weatherEntries = [...weatherEntries, { startAt: target, duration: 0, weatherBump: true }]
        .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
      lastWeatherAt = target;
    } else {
      lastWeatherAt = target;
    }
    target = Number(lastWeatherAt) + intervalMs;
  }
  return targets;
}

export function planTimedBumpInsertion(entries = [], {
  targetStartAt = Date.now(),
  duration = 30,
  now = Date.now(),
  minSegmentSeconds = 8 * 60,
  sourceFor = () => null
} = {}) {
  const sorted = (entries || [])
    .filter((entry) => entryEnd(entry) > now)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0));
  const durationMs = Number(duration || 0) * 1000;
  const containing = sorted.find((entry) => targetStartAt > Number(entry.startAt || 0) && targetStartAt + durationMs < entryEnd(entry));
  const overlapping = sorted.filter((entry) => targetStartAt < entryEnd(entry) && Number(entry.startAt || 0) < targetStartAt + durationMs);

  const before = sorted.filter((entry) => entryEnd(entry) <= targetStartAt);
  const after = sorted.filter((entry) => Number(entry.startAt || 0) >= targetStartAt + durationMs);
  const previousEnd = before.length ? entryEnd(before.at(-1)) : now;
  const nextStart = after.length ? Number(after[0].startAt || 0) : Infinity;
  if (!overlapping.length && targetStartAt >= previousEnd && targetStartAt + durationMs <= nextStart) {
    return { mode: "gap" };
  }

  if (!containing) return { mode: "none" };
  const source = sourceFor(containing);
  if (!source || isBumpSource(source) || containing.autoBump || containing.blockBump || containing.fadeBreakBump || containing.weatherBump) {
    return { mode: "none", containing };
  }

  const firstDuration = Math.floor((targetStartAt - Number(containing.startAt || 0)) / 1000);
  const resumeDuration = Math.floor((entryEnd(containing) - targetStartAt - durationMs) / 1000);
  if (firstDuration < minSegmentSeconds || resumeDuration < minSegmentSeconds) {
    return { mode: "none", containing };
  }

  return {
    mode: "split",
    containing,
    firstDuration,
    resumeDuration,
    resumeStartAt: targetStartAt + durationMs,
    resumeSourceOffset: Math.max(0, Number(containing.sourceOffset || 0) + firstDuration)
  };
}

export function longformBreakCountForDuration(duration = 0, {
  maxBreaks = 3
} = {}) {
  const minutes = Number(duration || 0) / 60;
  if (minutes >= 95) return maxBreaks;
  if (minutes >= 58) return Math.min(2, maxBreaks);
  if (minutes >= 24) return Math.min(1, maxBreaks);
  return 0;
}

export function planLongformContinuityBreaks(entry = {}, cached = {}, {
  now = Date.now(),
  firstAfterSeconds = 60 * 8,
  minSpacingSeconds = 60 * 17,
  endGuardSeconds = 60 * 6,
  maxBreaks = 3
} = {}) {
  if (cached?.status !== "ready") return [];
  const rawBreakpoints = Array.isArray(cached.breakpoints) && cached.breakpoints.length
    ? cached.breakpoints
    : [cached.breakAt].filter(Boolean);
  const sourceOffset = Math.max(0, Number(entry.sourceOffset || 0));
  const entryDuration = Math.max(0, Number(entry.duration || 0));
  const entryEndOffset = sourceOffset + entryDuration;
  const latestBreak = entryEndOffset - endGuardSeconds;
  const breakLimit = longformBreakCountForDuration(entryDuration, { maxBreaks });
  const accepted = [];
  for (const raw of rawBreakpoints.map(Number).filter(Number.isFinite).sort((a, b) => a - b)) {
    if (raw <= sourceOffset + firstAfterSeconds) continue;
    if (raw >= latestBreak) continue;
    const breakStartAt = Number(entry.startAt || 0) + (raw - sourceOffset) * 1000;
    if (breakStartAt <= now + 10000) continue;
    if (accepted.length && raw - accepted.at(-1) < minSpacingSeconds) continue;
    accepted.push(Math.round(raw));
    if (accepted.length >= breakLimit) break;
  }
  return accepted;
}
