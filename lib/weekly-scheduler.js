import crypto from "node:crypto";

export function weeklyBlockStarts(block = {}, {
  now = Date.now(),
  lookaheadDays = 8
} = {}) {
  const starts = [];
  const [hourText, minuteText] = String(block.time || "20:00").split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  for (let offset = 0; offset < lookaheadDays; offset += 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() + offset);
    if (!(block.days || []).includes(date.getDay())) continue;
    date.setHours(Number.isFinite(hour) ? hour : 20, Number.isFinite(minute) ? minute : 0, 0, 0);
    starts.push(date.getTime());
  }
  return starts;
}

export function scheduleSourcesIntoWeeklyBlock(block, sources, startAt, {
  blockBumpDuration = 16,
  hashString = defaultHashString,
  sourceEpisodeKey = (source) => source?.id || source?.title || "",
  createId = () => crypto.randomUUID(),
  createBumpSource = () => null,
  onBumpSource = () => {}
} = {}) {
  const blockMs = block.durationMinutes * 60 * 1000;
  const blockEnd = startAt + blockMs;
  let cursor = startAt;
  let index = Math.abs(hashString(`${block.id}:${new Date(startAt).toDateString()}`)) % sources.length;
  const entries = [];
  let contentCount = 0;
  const usedEpisodes = new Set();

  const addBlockBump = (kind, nextSource = null) => {
    const remaining = Math.round((blockEnd - cursor) / 1000);
    if (remaining < blockBumpDuration + 5) return false;
    const bumpSource = createBumpSource(block, kind, cursor, nextSource, contentCount);
    if (!bumpSource) return false;
    onBumpSource(bumpSource);
    entries.push({
      id: createId(),
      sourceId: bumpSource.id,
      title: bumpSource.title,
      startAt: cursor,
      duration: bumpSource.duration,
      weeklyBlockId: block.id,
      weeklyBlockName: block.name,
      autoBump: true,
      blockBump: true
    });
    cursor += bumpSource.duration * 1000;
    return true;
  };

  addBlockBump("intro", sources[index % sources.length]);
  while (cursor < blockEnd - 5000 && entries.length < 80) {
    const source = nextUnusedBlockSource(sources, index, usedEpisodes, sourceEpisodeKey);
    if (!source) break;
    const remaining = Math.round((blockEnd - cursor) / 1000);
    const duration = Math.max(5, Math.min(Math.round(source.duration), remaining));
    usedEpisodes.add(sourceEpisodeKey(source));
    entries.push({
      id: createId(),
      sourceId: source.id,
      title: `${block.name}: ${source.title}`,
      startAt: cursor,
      duration,
      weeklyBlockId: block.id,
      weeklyBlockName: block.name
    });
    cursor += duration * 1000;
    index += 1;
    contentCount += 1;
    if (contentCount % 2 === 1) addBlockBump("station-id", nextUnusedBlockSource(sources, index, usedEpisodes, sourceEpisodeKey));
  }
  return entries;
}

export function nextUnusedBlockSource(sources = [], startIndex = 0, usedEpisodes = new Set(), sourceEpisodeKey = (source) => source?.id || source?.title || "") {
  if (!sources.length) return null;
  for (let offset = 0; offset < sources.length; offset += 1) {
    const source = sources[(startIndex + offset) % sources.length];
    if (!source || usedEpisodes.has(sourceEpisodeKey(source))) continue;
    return source;
  }
  return null;
}

function defaultHashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(31, hash) + text.charCodeAt(index) | 0;
  }
  return hash;
}
