export const EXPLICIT_ARCHIVE_PATTERN = /\b(?:hentai|porn(?:o|ography)?|xxx|x-rated|adult\s+video|sex\s+tape|hardcore|explicit\s+sex|uncensored\s+sex|erotic\s+massage|blowjob|fellatio|cumshot|creampie|bukkake|gangbang|handjob|deepthroat|anal\s+sex|pussy|milf|barely\s+legal|onlyfans)\b/i;

export const WEEKLY_ARCHIVE_EXCLUDE_TERMS = [
  "hentai",
  "porn",
  "xxx",
  "adult video",
  "sex tape",
  "hardcore",
  "erotic",
  "explicit",
  "uncensored",
  "compilation",
  "deleted videos",
  "gameplay",
  "walkthrough",
  "lets play",
  "reaction",
  "amv",
  "fan edit",
  "trailer only",
  "sample reel",
  "conference",
  "church service",
  "sermon",
  "kevin annett"
];

export const LANGUAGE_LABELS = {
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  hi: "Hindi",
  tr: "Turkish"
};

const LANGUAGE_PATTERNS = [
  { code: "en", pattern: /\b(?:english|eng(?:lish)?\s*(?:dub|audio)?|dubbed\s+in\s+english)\b/i },
  { code: "ja", pattern: /\b(?:japanese|japan(?:ese)?\s*(?:dub|audio)?|nihongo|raw)\b/i },
  { code: "ko", pattern: /\b(?:korean|kor(?:ean)?\s*(?:dub|audio)?|hanguk)\b/i },
  { code: "es", pattern: /(?:spanish|espa(?:n|\u00f1)ol|castellano|latino|doblaje\s+latino|dub(?:bed)?\s+(?:latino|spanish))/i },
  { code: "fr", pattern: /\b(?:french|fran(?:c|\u00e7)ais|dub(?:bed)?\s+french|french\s+dub|\bvf\b|\bvff\b)\b/i },
  { code: "de", pattern: /\b(?:german|deutsch|ger(?:man)?\s*dub|dub(?:bed)?\s+german)\b/i },
  { code: "it", pattern: /\b(?:italian|italiano|ita(?:lian)?\s*dub|dub(?:bed)?\s+italian)\b/i },
  { code: "pt", pattern: /\b(?:portuguese|portugu(?:e|ê)s|brazilian|brasil|dub(?:bed)?\s+portuguese)\b/i },
  { code: "ru", pattern: /\b(?:russian|русский|rus(?:sian)?\s*dub|dub(?:bed)?\s+russian)\b/i },
  { code: "zh", pattern: /\b(?:chinese|mandarin|cantonese|taiwanese|hong\s+kong|dub(?:bed)?\s+chinese)\b/i },
  { code: "hi", pattern: /\b(?:hindi|bollywood|dub(?:bed)?\s+hindi)\b/i },
  { code: "tr", pattern: /\b(?:turkish|türkçe|turkce|dub(?:bed)?\s+turkish)\b/i }
];

const ORIGINAL_LANGUAGE_HINTS = [
  { code: "ja", pattern: /\b(?:anime|manga|ova|japan|japanese|tokyo|osaka|toei|tms|gainax|sunrise|gundam|robotech)\b/i },
  { code: "ko", pattern: /\b(?:korea|korean|seoul|k-drama|kdrama)\b/i },
  { code: "es", pattern: /\b(?:mexico|mexican|spanish-language|telenovela|argentina|argentine|chile|chilean|colombia|colombian|peru|peruvian|spain)\b/i },
  { code: "fr", pattern: /\b(?:france|paris|quebec|qu\u00e9bec|francophone)\b/i },
  { code: "de", pattern: /\b(?:germany|deutschland|berlin|austrian|austria)\b/i },
  { code: "it", pattern: /\b(?:italy|italiano|rome|toei animation.*italian)\b/i },
  { code: "pt", pattern: /\b(?:brazil|brazilian|brasil|portugal|portuguese)\b/i },
  { code: "ru", pattern: /\b(?:russia|russian|soviet|moscow)\b/i },
  { code: "zh", pattern: /\b(?:china|chinese|hong kong|taiwan|taiwanese|mandarin|cantonese)\b/i },
  { code: "hi", pattern: /\b(?:india|indian|hindi|bollywood)\b/i },
  { code: "tr", pattern: /\b(?:turkey|turkish|istanbul)\b/i }
];

const IA_USER_AGENTS = {
  info: "DoinkTV Internet Archive Source Importer",
  search: "DoinkTV Internet Archive Source Search",
  collection: "DoinkTV Internet Archive Collection Importer",
  captions: "DoinkTV Caption Loader",
  ingest: "DoinkTV Authorized Media Discovery"
};

export function normalizeInternetArchiveId(input) {
  const value = String(input || "").trim();
  if (!value) return "";
  if (/^[A-Za-z0-9_.-]{3,120}$/.test(value) && !value.includes("http")) return value;
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    const detailsIndex = parts.indexOf("details");
    if (detailsIndex !== -1 && parts[detailsIndex + 1]) return decodeURIComponent(parts[detailsIndex + 1]);
    const downloadIndex = parts.indexOf("download");
    if (downloadIndex !== -1 && parts[downloadIndex + 1]) return decodeURIComponent(parts[downloadIndex + 1]);
  } catch {
    return "";
  }
  return "";
}

export function encodeArchiveFilePath(fileName) {
  return String(fileName || "").split("/").map(encodeURIComponent).join("/");
}

export function archiveDownloadUrl(identifier, fileName) {
  return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeArchiveFilePath(fileName)}`;
}

export function normalizeSearchQuery(value) {
  return String(value || "")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(ep|episode|official|video|youtube|yt|hd|hq|full|clip)\b/gi, " ")
    .replace(/[#()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export function parseDurationText(text) {
  const parts = String(text || "")
    .trim()
    .split(":")
    .map((part) => Number(part));
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

export async function loadInternetArchiveMetadata(archiveId, { userAgent = IA_USER_AGENTS.info } = {}) {
  const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(archiveId)}`, {
    headers: { "user-agent": userAgent }
  });
  if (!response.ok) throw new Error("Could not load that Internet Archive item.");
  return response.json();
}

export async function getInternetArchiveInfo(input, preferredFileName = "") {
  const archiveId = normalizeInternetArchiveId(input);
  if (!archiveId) throw new Error("Enter an Internet Archive item URL or identifier.");
  const data = await loadInternetArchiveMetadata(archiveId);
  const preferredFile = String(preferredFileName || "").trim();
  const file = preferredFile
    ? (Array.isArray(data.files) ? data.files : []).find((item) => item.name === preferredFile && isInternetArchiveVideoFile(item))
    : chooseInternetArchiveVideoFile(data);
  if (!file) throw new Error("No playable video file was found on that Internet Archive item.");
  const title = preferredFile ? archiveFileTitle(file) : String(data.metadata?.title || archiveId).trim();
  const duration = Math.max(5, Math.round(Number(file.length) || parseDurationText(data.metadata?.runtime) || 300));
  return {
    archiveId,
    archiveFile: file.name,
    fileUrl: archiveDownloadUrl(archiveId, file.name),
    url: `https://archive.org/details/${archiveId}`,
    title,
    duration,
    format: file.format || "",
    size: Number(file.size || 0)
  };
}

export async function searchInternetArchiveSources(query, rows = 10, options = {}) {
  const normalized = normalizeSearchQuery(query);
  const terms = normalized
    .split(/\s+/)
    .filter((term) => /^[a-z0-9][a-z0-9.-]{1,40}$/i.test(term))
    .slice(0, 10);
  if (!terms.length) return [];

  const search = new URL("https://archive.org/advancedsearch.php");
  const fieldQuery = terms
    .map((term) => `(title:${term} OR description:${term} OR subject:${term})`)
    .join(" AND ");
  search.searchParams.set("q", `(${fieldQuery}) AND mediatype:movies`);
  ["identifier", "title", "description", "creator", "date", "year", "downloads", "publicdate"].forEach((field) => {
    search.searchParams.append("fl[]", field);
  });
  search.searchParams.append("fl[]", "subject");
  search.searchParams.set("rows", String(Math.max(1, Math.min(20, Number(rows) || 10))));
  search.searchParams.set("page", "1");
  search.searchParams.set("sort[]", "downloads desc");
  search.searchParams.set("output", "json");

  const response = await fetch(search, {
    headers: { "user-agent": options.userAgent || IA_USER_AGENTS.search }
  });
  if (!response.ok) throw new Error("Could not search Internet Archive right now.");
  const data = await response.json();
  const docs = Array.isArray(data.response?.docs) ? data.response.docs : [];
  const candidates = await Promise.all(docs.map((doc) => internetArchiveSearchResultForDoc(doc).catch(() => null)));
  return candidates.filter(Boolean).filter((candidate) => options.includeUnsafe || !isClearlyPornographicArchiveCandidate(candidate));
}

export async function internetArchiveSearchResultForDoc(doc = {}) {
  const archiveId = String(doc.identifier || "").trim();
  if (!archiveId) return null;
  const metadata = await loadInternetArchiveMetadata(archiveId, { userAgent: IA_USER_AGENTS.search });
  const file = chooseInternetArchiveVideoFile(metadata);
  if (!file) return null;
  const title = String(doc.title || metadata.metadata?.title || archiveId).trim();
  const description = Array.isArray(doc.description) ? doc.description.join(" ") : String(doc.description || "");
  const subject = Array.isArray(doc.subject) ? doc.subject.join(", ") : String(doc.subject || "");
  const result = {
    archiveId,
    archiveFile: file.name,
    fileUrl: archiveDownloadUrl(archiveId, file.name),
    url: `https://archive.org/details/${archiveId}`,
    title,
    fileTitle: archiveFileTitle(file),
    duration: Math.max(5, Math.round(Number(file.length) || parseDurationText(metadata.metadata?.runtime) || 300)),
    format: file.format || "",
    size: Number(file.size || 0),
    creator: Array.isArray(doc.creator) ? doc.creator.join(", ") : String(doc.creator || ""),
    year: String(doc.year || doc.date || "").slice(0, 12),
    downloads: Number(doc.downloads || 0),
    language: normalizeArchiveLanguage(metadata.metadata?.language),
    subject,
    description: description.replace(/\s+/g, " ").trim().slice(0, 220)
  };
  return {
    ...result,
    quality: archiveQualitySignals(result)
  };
}

export function archiveQualitySignals(candidate = {}) {
  const haystack = archiveSafetyHaystack(candidate).toLowerCase();
  let score = 50;
  const flags = [];
  const duration = Number(candidate.duration || 0);
  const size = Number(candidate.size || 0);
  if (duration >= 60 && duration <= 60 * 60 * 4) score += 12;
  if (duration < 30) {
    score -= 22;
    flags.push("very short");
  }
  if (/h\.?264|mpeg4|mp4|512kb|ia\.mp4/i.test(`${candidate.format || ""} ${candidate.archiveFile || ""}`)) score += 14;
  if (size > 25_000_000) score += 8;
  if (Number(candidate.downloads || 0) > 1000) score += 8;
  if (/(english|eng|dubbed|subtitled|closed caption|caption)/i.test(haystack)) {
    score += 8;
    flags.push("english/captions hint");
  }
  if (/(trailer|sample|preview|conference|gameplay|walkthrough)/i.test(haystack)) {
    score -= 14;
    flags.push("low programming fit");
  }
  if (isClearlyPornographicArchiveCandidate(candidate)) {
    score = 0;
    flags.push("explicit filter");
  }
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: normalizedScore,
    label: normalizedScore >= 78 ? "strong" : normalizedScore >= 58 ? "usable" : normalizedScore >= 35 ? "iffy" : "reject",
    flags: flags.slice(0, 3)
  };
}

export function isInternetArchiveVideoFile(file = {}) {
  const name = String(file.name || "");
  const format = String(file.format || "").toLowerCase();
  if (!name || /_thumb|_meta|_files|_archive\.torrent|\.gif$/i.test(name)) return false;
  return /\.(mp4|m4v|webm|ogv|mov|mpg|mpeg|avi|mkv)$/i.test(name)
    || /h\.?264|mpeg4|mpeg-4|matroska|webm|quicktime|ogg video|mpeg|avi/i.test(format);
}

export function chooseInternetArchiveVideoFile(item = {}) {
  return chooseInternetArchiveVideoFiles(item, 1)[0] || null;
}

export function chooseInternetArchiveVideoFiles(item = {}, limit = 50) {
  const files = Array.isArray(item.files) ? item.files : [];
  return files
    .filter((file) => isInternetArchiveVideoFile(file))
    .sort((a, b) => internetArchiveFileScore(b) - internetArchiveFileScore(a))
    .slice(0, Math.max(1, limit));
}

export function internetArchiveFileScore(file = {}) {
  const name = String(file.name || "").toLowerCase();
  const format = String(file.format || "").toLowerCase();
  let score = 0;
  if (name.endsWith(".mp4")) score += 50;
  if (/h\.?264|mpeg4|mpeg-4/.test(format)) score += 35;
  if (/512kb|ia\.mp4/.test(name)) score += 20;
  if (/derivative/.test(String(file.source || "").toLowerCase())) score += 8;
  score += Math.min(20, Number(file.size || 0) / 100_000_000);
  return score;
}

export function archiveFileTitle(file = {}) {
  return String(file.name || "Untitled archive video")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function chooseEnglishCaptionFile(item = {}, archiveFile = "") {
  const files = Array.isArray(item.files) ? item.files : [];
  const videoBase = String(archiveFile || "").replace(/\.[^.]+$/, "").toLowerCase();
  return files
    .filter((file) => isInternetArchiveCaptionFile(file))
    .map((file) => ({ file, score: internetArchiveCaptionScore(file, videoBase) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.file || null;
}

export function isInternetArchiveCaptionFile(file = {}) {
  const name = String(file.name || "");
  const format = String(file.format || "");
  if (!/\.(srt|vtt)$/i.test(name)) return false;
  return /(subrip|subtitle|caption|webvtt|vtt|srt)/i.test(`${format} ${name}`);
}

export function internetArchiveCaptionScore(file = {}, videoBase = "") {
  const name = String(file.name || "");
  const lower = name.toLowerCase();
  let score = /\.(vtt)$/i.test(name) ? 16 : 12;
  if (/(^|[._ -])(en|eng|english|en-us|en_us)([._ -]|$)/i.test(lower)) score += 60;
  if (!/(^|[._ -])(en|eng|english|en-us|en_us)([._ -]|$)/i.test(lower) && /(^|[._ -])(jp|jpn|ja|es|spa|fr|fre|de|ger|ita|pt|rus)([._ -]|$)/i.test(lower)) score -= 80;
  if (videoBase) {
    const captionBase = lower.replace(/\.[^.]+$/, "");
    if (captionBase.includes(videoBase.slice(0, 32)) || videoBase.includes(captionBase.slice(0, 32))) score += 25;
  }
  if (/auto|machine|whisper/i.test(lower)) score -= 8;
  return score;
}

export function srtToWebVtt(text = "") {
  return `WEBVTT\n\n${String(text)
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/^\d+\n(?=\d\d:\d\d:\d\d[,\.]\d{3}\s+-->\s+)/gm, "")
    .replace(/(\d\d:\d\d:\d\d),(\d{3})/g, "$1.$2")
    .trim()}\n`;
}

export function isClearlyPornographicArchiveCandidate(candidate = {}) {
  return EXPLICIT_ARCHIVE_PATTERN.test(archiveSafetyHaystack(candidate));
}

export function archiveSafetyHaystack(candidate = {}) {
  return [
    candidate.title,
    candidate.fileTitle,
    candidate.creator,
    candidate.language,
    candidate.subject,
    candidate.description,
    candidate.archiveId,
    candidate.archiveFile,
    candidate.url
  ].filter(Boolean).join(" ");
}

export function normalizeArchiveLanguage(value = "") {
  const raw = Array.isArray(value) ? value.join(" ") : String(value || "");
  return raw.replace(/\s+/g, " ").trim().slice(0, 120);
}

export function languageCodesFromText(text = "") {
  const value = String(text || "");
  const subtitleOnly = /\b(?:sub|subs|subtitle|subtitled|vostfr|fansub|closed caption|caption)\b/i.test(value)
    && !/\b(?:dub|dubbed|audio|doblaje)\b/i.test(value);
  if (subtitleOnly && !/\b(?:espa(?:n|\u00f1)ol|spanish|french|fran(?:c|\u00e7)ais|german|deutsch|italian|portuguese|russian|korean|japanese)\b/i.test(value.replace(/\b(?:sub|subs|subtitle|subtitled|vostfr|fansub|closed caption|caption)\b/gi, ""))) {
    return [];
  }
  return LANGUAGE_PATTERNS
    .filter(({ pattern }) => pattern.test(value))
    .map(({ code }) => code);
}

export function originalLanguageCodesFromText(text = "") {
  const value = String(text || "");
  return ORIGINAL_LANGUAGE_HINTS
    .filter(({ pattern }) => pattern.test(value))
    .map(({ code }) => code);
}

export function archiveLanguageFit(block = {}, candidate = {}) {
  const haystack = archiveSafetyHaystack(candidate);
  const blockText = [
    block.id,
    block.name,
    block.folderName,
    ...(Array.isArray(block.queries) ? block.queries : []),
    ...(Array.isArray(block.requireAny) ? block.requireAny : [])
  ].join(" ");
  const explicitLanguages = new Set([
    ...languageCodesFromText(haystack),
    ...languageCodesFromText(candidate.language)
  ]);
  if (!explicitLanguages.size) return { ok: true, allowed: ["en"], detected: [], reason: "no explicit language signal" };

  const allowed = new Set([
    "en",
    ...(Array.isArray(block.originalLanguages) ? block.originalLanguages : []),
    ...originalLanguageCodesFromText(blockText),
    ...originalLanguageCodesFromText(haystack)
  ]);
  const rejected = [...explicitLanguages].filter((code) => !allowed.has(code));
  return {
    ok: rejected.length === 0,
    allowed: [...allowed],
    detected: [...explicitLanguages],
    rejected,
    reason: rejected.length
      ? `language mismatch: ${rejected.map((code) => LANGUAGE_LABELS[code] || code).join(", ")} not allowed for this program`
      : "language fits block"
  };
}

export function weeklyArchiveCandidateFitsBlock(block = {}, candidate = {}) {
  const haystack = [
    candidate.title,
    candidate.fileTitle,
    candidate.creator,
    candidate.description,
    candidate.archiveId
  ].join(" ").toLowerCase();
  if (WEEKLY_ARCHIVE_EXCLUDE_TERMS.some((term) => haystack.includes(term))) return false;
  if (isClearlyPornographicArchiveCandidate(candidate)) return false;
  if (!archiveLanguageFit(block, candidate).ok) return false;
  if (Number(candidate.duration || 0) < Number(block.minDuration || 45)) return false;
  if (Number.isFinite(Number(block.maxYear)) && candidateLooksNewerThanBlock(candidate, Number(block.maxYear))) return false;
  if (Array.isArray(block.requireAny) && block.requireAny.length) {
    return block.requireAny.some((term) => haystack.includes(String(term).toLowerCase()));
  }
  return true;
}

export function candidateLooksNewerThanBlock(candidate = {}, maxYear = Infinity) {
  const yearText = [
    candidate.year,
    candidate.title,
    candidate.fileTitle,
    candidate.description,
    candidate.archiveId
  ].join(" ");
  const years = [...yearText.matchAll(/\b(19\d{2}|20\d{2})\b/g)]
    .map((match) => Number(match[1]))
    .filter((year) => Number.isFinite(year));
  return years.length > 0 && years.every((year) => year > maxYear);
}

export function standbyFillerCandidateScore(source = {}, { folderName = "", minSeconds = 8, maxSeconds = 210 } = {}) {
  if (!source || source.type === "youtube") return null;
  const duration = Number(source.duration || 0);
  if (duration < minSeconds || duration > maxSeconds) return null;
  const haystack = `${source.title || ""} ${source.archiveFile || ""} ${folderName || ""}`;
  if (isClearlyPornographicArchiveCandidate({ ...source, title: haystack })) return null;
  const adScore = /(^|[^a-z])(commercials?|ads?|adverts?|advertisements?|promo|psa|bumper|trailer|station\s*(id|ident|break)|ident)([^a-z]|$)/i.test(haystack) ? 80 : 0;
  if (!adScore) return null;
  const shortScore = Math.max(0, maxSeconds - duration) / 8;
  return adScore + shortScore;
}

export function isMovieLikeProgram(live = {}) {
  const source = live.source || {};
  const title = `${live.title || ""} ${source.title || ""}`.toLowerCase();
  return source.type === "internet-archive"
    && Number(live.duration || source.duration || 0) >= 40 * 60
    && !/(episode|ep\.?\s*\d+|cartoon|short|music video|talk show|interview)/i.test(title);
}

export function isShowLikeProgram(live = {}) {
  if (isMovieLikeProgram(live)) return false;
  const source = live.source || {};
  const title = `${live.title || ""} ${source.title || ""} ${source.archiveFile || ""}`.toLowerCase();
  return source.type === "internet-archive"
    && (Number(live.duration || source.duration || 0) < 40 * 60
      || /(episode|ep\.?\s*\d+|cartoon|short|series|show|talk show|interview|ova|serial)/i.test(title));
}

export async function comparableFilmSuggestions(live = {}, { maxOptions = 4 } = {}) {
  const source = live.source || {};
  const query = comparableArchiveQuery(live);
  const candidates = await searchInternetArchiveSources(query, 20);
  const currentKey = `${source.archiveId || ""}:${source.archiveFile || ""}`;
  return candidates
    .filter((candidate) => Number(candidate.duration || 0) >= 40 * 60)
    .filter((candidate) => `${candidate.archiveId}:${candidate.archiveFile}` !== currentKey)
    .filter((candidate) => comparableFilmCandidateFits(live, candidate))
    .filter((candidate) => !isClearlyPornographicArchiveCandidate(candidate))
    .slice(0, Math.max(0, Number(maxOptions) - 2));
}

export function comparableArchiveQuery(live = {}) {
  const block = `${live.weeklyBlockId || ""} ${live.weeklyBlockName || ""}`.toLowerCase();
  if (block.includes("anime")) return "anime ova";
  const title = live.title || live.source?.title || "";
  return String(title || "")
    .replace(/\b(19|20)\d{2}\b/g, "")
    .replace(/\b(vhs|dubbed|english|espanol|spanish|full|movie|film|feature|late|night|anime)\b/gi, " ")
    .replace(/[^a-z0-9 ]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 5)
    .join(" ") || "feature film";
}

export function comparableFilmCandidateFits(live = {}, candidate = {}) {
  const haystack = [
    candidate.title,
    candidate.fileTitle,
    candidate.creator,
    candidate.subject,
    candidate.description,
    candidate.archiveId
  ].join(" ").toLowerCase();
  if (isClearlyPornographicArchiveCandidate(candidate)) return false;
  if (!archiveLanguageFit({ id: live.weeklyBlockId, name: live.weeklyBlockName }, candidate).ok) return false;
  if (/(gamevideoarchive|video game|commercials?|miniseries|episode|newsreel|trailer|sample reel|conference)/i.test(haystack)) return false;
  const block = `${live.weeklyBlockId || ""} ${live.weeklyBlockName || ""}`.toLowerCase();
  if (block.includes("anime")) return /(anime|ova|manga|japan|japanese|toonami|animation)/i.test(haystack);
  return true;
}

export function cleanVoteSuggestions(suggestions = []) {
  const seen = new Set();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.archiveId || ""}:${suggestion.archiveFile || ""}`;
    if (!suggestion.archiveId || !suggestion.archiveFile || seen.has(key)) return false;
    seen.add(key);
    return !isClearlyPornographicArchiveCandidate(suggestion);
  });
}

export async function discoverAuthorizedMediaCandidates(source = {}) {
  const query = normalizeSearchQuery(`${source.title || ""} ${source.url || ""}`);
  if (query.length < 3) return [];
  const archiveCandidates = await searchInternetArchiveCandidates(query).catch(() => []);
  return archiveCandidates.slice(0, 5);
}

export async function searchInternetArchiveCandidates(query) {
  const params = new URLSearchParams({
    q: `mediatype:(movies) AND (${query})`,
    fl: "identifier,title,creator,licenseurl,rights,date,description",
    rows: "6",
    page: "1",
    output: "json"
  });
  const response = await fetch(`https://archive.org/advancedsearch.php?${params}`, {
    headers: { "user-agent": IA_USER_AGENTS.ingest }
  });
  if (!response.ok) return [];
  const data = await response.json();
  const docs = data?.response?.docs || [];
  const candidateGroups = await Promise.all(docs.map((doc) => internetArchiveFilesForDoc(doc).catch(() => [])));
  return candidateGroups.flat().filter((candidate) => !isClearlyPornographicArchiveCandidate({
    title: candidate.title,
    creator: candidate.creator,
    description: candidate.rights,
    archiveId: candidate.identifier,
    archiveFile: candidate.fileName
  }));
}

export async function internetArchiveFilesForDoc(doc = {}) {
  const identifier = String(doc.identifier || "");
  if (!identifier) return [];
  const metadata = await loadInternetArchiveMetadata(identifier, { userAgent: IA_USER_AGENTS.ingest }).catch(() => null);
  if (!metadata) return [];
  const files = Array.isArray(metadata.files) ? metadata.files : [];
  return files
    .filter((file) => playableArchiveFile(file))
    .slice(0, 2)
    .map((file) => ({
      repository: "Internet Archive",
      identifier,
      title: String(doc.title || metadata.metadata?.title || identifier),
      creator: Array.isArray(doc.creator) ? doc.creator.join(", ") : String(doc.creator || metadata.metadata?.creator || ""),
      licenseUrl: Array.isArray(doc.licenseurl) ? doc.licenseurl[0] : String(doc.licenseurl || metadata.metadata?.licenseurl || ""),
      rights: Array.isArray(doc.rights) ? doc.rights.join(", ") : String(doc.rights || metadata.metadata?.rights || ""),
      detailUrl: `https://archive.org/details/${encodeURIComponent(identifier)}`,
      mediaUrl: archiveDownloadUrl(identifier, file.name),
      fileName: file.name,
      format: file.format || "",
      size: Number(file.size || 0)
    }));
}

export function playableArchiveFile(file = {}) {
  const name = String(file.name || "");
  const format = String(file.format || "");
  if (/\.(mp4|m4v|mov|webm)$/i.test(name)) return true;
  return /(mpeg4|h\.264|webm|quicktime)/i.test(format) && !/\.(gif|jpg|png|txt|xml|json)$/i.test(name);
}
