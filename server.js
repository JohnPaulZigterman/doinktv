import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat, readdir, rm } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DOINK_DATA_DIR || path.join(__dirname, "data");
const MEDIA_DIR = process.env.DOINK_MEDIA_DIR || path.join(__dirname, "media");
const BUMP_MUSIC_DIR = path.join(MEDIA_DIR, "bump-music");
const HLS_DIR = process.env.DOINK_HLS_DIR || path.join(DATA_DIR, "hls");
const PUBLIC_DIR = path.join(__dirname, "public");
const VENDORED_BUMP_GENERATOR_DIR = path.join(__dirname, "vendor", "BumpGenerator");
const BUMP_GENERATOR_DIR = process.env.BUMP_GENERATOR_DIR
  || (existsSync(VENDORED_BUMP_GENERATOR_DIR) ? VENDORED_BUMP_GENERATOR_DIR : path.join(__dirname, "..", "BumpGenerator"));
const STATE_PATH = path.join(DATA_DIR, "state.json");
const AUTO_BUMP_INTERVAL_MS = 1000 * 60 * 3;
const AUTO_BUMP_DURATION = 20;
const MIN_QUEUE_VIDEO_ITEMS = 5;
const CHAOS_AUDIO_PLAYLIST_ID = "PLWL3FzHaRRMkQqUhks8Y9l35rqY_kKCto";

const ADMIN_USER = process.env.ADMIN_USER || "DoinkWizard";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChipTanaka12!@";
const ADMIN_ACCOUNTS = [
  { username: ADMIN_USER, password: ADMIN_PASSWORD },
  { username: "ChillNeil", password: "ChillyBilly12!@" }
];
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const FX_PRESETS = {
  glitch: { label: "Glitch", duration: 8 },
  "signal-loss": { label: "Signal loss", duration: 10 },
  "tape-warp": { label: "Tape warp", duration: 12 },
  vhs: { label: "VHS distortion", duration: 14 },
  "dvd-skip": { label: "DVD skipping", duration: 8 },
  frozen: { label: "Frozen frame", duration: 6 },
  "color-bars": { label: "Color bars", duration: 8 },
  "aspect-bad": { label: "Wrong aspect", duration: 14 },
  "crop-bad": { label: "Bad crop", duration: 12 },
  invert: { label: "Invert colors", duration: 10 },
  kaleidoscope: { label: "Kaleidoscope", duration: 12 },
  pixelate: { label: "Pixelate", duration: 10 },
  glass: { label: "Glass block", duration: 12 },
  melt: { label: "Melt", duration: 10 },
  "palette-swap": { label: "Palette swap", duration: 12 },
  "color-acid": { label: "Acid green", duration: 12 },
  "color-hot": { label: "Hot magenta", duration: 12 },
  "color-ice": { label: "Ice cyan", duration: 12 },
  "fill-water": { label: "Water flood", duration: 14 },
  "fill-shapes": { label: "Shape storm", duration: 14 },
  "fill-marbles": { label: "Marbles", duration: 14 },
  "fill-stickers": { label: "Sticker slap", duration: 12 },
  "fill-confetti": { label: "Confetti junk", duration: 12 },
  "fill-popups": { label: "Popup mess", duration: 12 },
  "fill-bubbles": { label: "Bubble wrap", duration: 14 },
  "fill-static-panels": { label: "Static panels", duration: 12 },
  "os-popups": { label: "Windows error popups", duration: 12 },
  "blue-screen": { label: "Blue screen", duration: 8 },
  "floppy-prompt": { label: "Insert floppy disk", duration: 10 },
  "retro-os": { label: "Antiquated OS", duration: 12 },
  "illegal-operation": { label: "Illegal operation", duration: 10 },
  "playlist-audio": { label: "Random playlist audio", duration: 90 },
  "visual-adjust": { label: "Visual abuse", duration: 90 },
  "source-overlay": { label: "Source overlay", duration: 45 },
  "audio-desync": { label: "Audio desync", duration: 10 },
  "amen-break": { label: "Amen break", duration: 6 },
  "radio-sting": { label: "FM morning radio", duration: 7 },
  hum: { label: "Audio hum", duration: 10 },
  countdown: { label: "Random countdown", duration: 10 },
  gun: { label: "Shoot the stream", duration: 4 },
  "gif-loops": { label: "GIF loops", duration: 12 },
  "looper-capture": { label: "Capture loop", duration: 18 },
  "looper-layer-1": { label: "Loop layer 1", duration: 18 },
  "looper-layer-2": { label: "Loop layer 2", duration: 18 },
  "looper-layer-3": { label: "Loop layer 3", duration: 18 },
  "looper-bpm-down": { label: "Looper BPM down", duration: 2 },
  "looper-bpm-up": { label: "Looper BPM up", duration: 2 },
  "looper-config": { label: "Looper layer edit", duration: 2 },
  "looper-clear": { label: "Clear looper", duration: 2 },
  "seed-skip": { label: "Seed skipper", duration: 30 },
  "av-warp": { label: "A/V warp", duration: 90 },
  delay: { label: "Delay", duration: 90 },
  "theme-cycle": { label: "Theme cycle", duration: 45 },
  "theme-random": { label: "Random theme shove", duration: 24 },
  "theme-aero-blast": { label: "Aero blast", duration: 30 },
  "ui-tilt": { label: "Room tilt", duration: 12 },
  "ui-shake": { label: "Page shake", duration: 10 },
  "ui-melt": { label: "Interface melt", duration: 12 },
  "page-glare": { label: "Windshield glare", duration: 14 },
  "cursor-party": { label: "Pointer trails", duration: 16 },
  "ui-font-warp": { label: "Font rot", duration: 14, level: 1 },
  "ui-spacing-collapse": { label: "Spacing collapse", duration: 14, level: 2 },
  "ui-panel-drift": { label: "Panel drift", duration: 16, level: 2 },
  "ui-low-res": { label: "Low-res interface", duration: 16, level: 3 },
  "ui-contrast-crush": { label: "Contrast crush", duration: 16, level: 3 },
  "ui-z-index-slip": { label: "Stacking slip", duration: 18, level: 4 },
  "ui-scroll-sick": { label: "Scroll sickness", duration: 18, level: 4 },
  "ui-css-panic": { label: "CSS panic", duration: 20, level: 5 },
  "meme-jazz": { label: "You like jazz?", duration: 5 },
  "meme-done": { label: "I can't believe you've done this", duration: 5 },
  weed: { label: "Weed button", duration: 12 },
  beer: { label: "Beer button", duration: 10 },
  lsd: { label: "LSD button", duration: 12 }
};

const sessions = new Map();
const sseClients = new Set();
const chatClients = new Set();
let timelineSaveNeeded = false;
const autoIngestQueue = [];
const autoIngestQueued = new Set();
const autoIngestInFlight = new Set();
let autoIngestPumpActive = false;
const ffmpegPath = process.env.FFMPEG_PATH || ffmpegInstaller.path || "ffmpeg";
let hlsPlayout = {
  id: "",
  process: null,
  startedAt: 0,
  status: "starting",
  error: ""
};
let state = {
  sources: [],
  sourceFolders: [],
  schedule: [],
  liveQueue: [],
  broadcastMode: "scheduled",
  lastAutoBumpAt: 0,
  bumpMusic: [],
  users: [],
  chat: [],
  nowPlaying: null,
  activeFx: []
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v"
};

async function ensureState() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MEDIA_DIR, { recursive: true });
  await mkdir(HLS_DIR, { recursive: true });
  if (!existsSync(STATE_PATH)) {
    await saveState();
  } else {
    state = JSON.parse(await readFile(STATE_PATH, "utf8"));
    state.sources ||= [];
    state.sourceFolders ||= [];
    state.schedule ||= [];
    state.liveQueue ||= [];
    state.broadcastMode = state.broadcastMode === "queue" ? "queue" : "scheduled";
    state.lastAutoBumpAt ||= 0;
    state.bumpMusic ||= [];
    state.users ||= [];
    state.chat ||= [];
    state.nowPlaying ||= null;
    state.activeFx ||= [];
    state.sourceFolders = state.sourceFolders.map((folder) => ({
      ...folder,
      randomEligible: folder.randomEligible !== false
    }));
    state.sources = state.sources.map((source) => ({
      ...source,
      randomEligible: source.randomEligible ?? source.type !== "youtube"
    }));
  }
}

async function saveState() {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(json)
  });
  res.end(json);
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...rest] = cookie.split("=");
        return [name, decodeURIComponent(rest.join("="))];
      })
  );
}

function isAdmin(req) {
  return getSession(req)?.role === "admin";
}

function getSession(req) {
  const token = parseCookies(req).doink_session;
  const session = token && sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return session;
}

function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  sendJson(res, 401, { error: "Admin login required." });
  return false;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, passwordHash) {
  const candidate = hashPassword(password, passwordHash.salt).hash;
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(passwordHash.hash, "hex"));
}

function publicUser(session) {
  if (!session) return null;
  return {
    username: session.username,
    role: session.role
  };
}

function requireSession(req, res) {
  const session = getSession(req);
  if (session) return session;
  sendJson(res, 401, { error: "Log in to chat." });
  return null;
}

function createSession(res, { username, role, userId = null }) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    userId,
    username,
    role,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  res.setHeader("set-cookie", `doink_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`);
}

function validateRegistration(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const confirmation = String(body.passwordConfirmation || body.confirmPassword || "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    throw new Error("Usernames must be 3-24 characters and use letters, numbers, or underscores.");
  }
  if (ADMIN_ACCOUNTS.some((admin) => username.toLowerCase() === admin.username.toLowerCase())) {
    throw new Error("That username is reserved.");
  }
  if (password.length < 8) throw new Error("Passwords must be at least 8 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");
  if (state.users.some((user) => user.email === email)) throw new Error("That email is already registered.");
  if (state.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("That username is already registered.");
  }

  return { email, username, password };
}

async function registerUser(body) {
  const { email, username, password } = validateRegistration(body);
  const user = {
    id: crypto.randomUUID(),
    email,
    username,
    passwordHash: hashPassword(password),
    role: "user",
    createdAt: Date.now()
  };
  state.users.push(user);
  await saveState();
  return user;
}

function normalizeYouTubeId(input) {
  const value = String(input || "").trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1, 12);
    if (url.searchParams.has("v")) return url.searchParams.get("v");
    const embed = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embed) return embed[1];
  } catch {
    return "";
  }
  return "";
}

function normalizeYouTubePlaylistId(input) {
  const value = String(input || "").trim();
  if (/^[a-zA-Z0-9_-]{10,}$/.test(value) && !value.includes("http")) return value;
  try {
    const url = new URL(value);
    return url.searchParams.get("list") || "";
  } catch {
    return "";
  }
}

function normalizeInternetArchiveId(input) {
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

function archiveDownloadUrl(identifier, fileName) {
  return `https://archive.org/download/${encodeURIComponent(identifier)}/${String(fileName || "").split("/").map(encodeURIComponent).join("/")}`;
}

function normalizeSearchQuery(value) {
  return String(value || "")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(ep|episode|official|video|youtube|yt|hd|hq|full|clip)\b/gi, " ")
    .replace(/[#()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function parseDurationText(text) {
  const parts = String(text || "")
    .trim()
    .split(":")
    .map((part) => Number(part));
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function extractInitialData(html) {
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("Could not read playlist metadata from YouTube.");
  const jsonStart = start + marker.length;
  const end = html.indexOf(";</script>", jsonStart);
  if (end === -1) throw new Error("Could not read playlist metadata from YouTube.");
  return JSON.parse(html.slice(jsonStart, end));
}

function collectPlaylistVideos(node, videos = []) {
  if (!node || typeof node !== "object") return videos;
  if (node.playlistVideoRenderer?.videoId) {
    const item = node.playlistVideoRenderer;
    const title = item.title?.runs?.map((run) => run.text).join("") || item.title?.simpleText || "Untitled YouTube video";
    const duration =
      Number(item.lengthSeconds) ||
      parseDurationText(item.lengthText?.simpleText || item.lengthText?.runs?.map((run) => run.text).join(""));
    videos.push({
      youtubeId: item.videoId,
      title,
      duration: Math.max(5, Math.round(duration || 300))
    });
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => collectPlaylistVideos(item, videos));
    else if (value && typeof value === "object") collectPlaylistVideos(value, videos);
  }
  return videos;
}

function findPlaylistTitle(node) {
  if (!node || typeof node !== "object") return "";
  if (node.playlistMetadataRenderer?.title) return String(node.playlistMetadataRenderer.title).trim();
  if (node.title?.simpleText && node.playlistHeaderRenderer) return String(node.title.simpleText).trim();
  for (const value of Object.values(node)) {
    const title = Array.isArray(value)
      ? value.map(findPlaylistTitle).find(Boolean)
      : value && typeof value === "object"
        ? findPlaylistTitle(value)
        : "";
    if (title) return title;
  }
  return "";
}

async function importYouTubePlaylist(body) {
  const playlistId = normalizeYouTubePlaylistId(body.url || body.playlist || body.playlistId);
  if (!playlistId) throw new Error("Enter a valid YouTube playlist URL.");

  const { title, videos: uniqueVideos } = await loadYouTubePlaylist(playlistId, body.folderName);
  if (!uniqueVideos.length) throw new Error("No public videos were found in that playlist.");
  const folder = await createUniqueSourceFolder(title);
  let imported = 0;
  let skipped = 0;

  for (const video of uniqueVideos) {
    const alreadyExists = state.sources.some((source) => source.youtubeId === video.youtubeId && source.folderId === folder.id);
    if (alreadyExists) {
      skipped += 1;
      continue;
    }
    state.sources.push({
      id: crypto.randomUUID(),
      type: "youtube",
      title: video.title,
      folderId: folder.id,
      duration: video.duration,
      youtubeId: video.youtubeId,
      url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
      randomEligible: false
    });
    imported += 1;
  }

  await saveState();
  broadcastProgram();
  return { folder, imported, skipped };
}

async function loadYouTubePlaylist(playlistId, fallbackTitle = "") {
  const playlistUrl = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
  const response = await fetch(playlistUrl, {
    headers: {
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0 DoinkTV Playlist Importer"
    }
  });
  if (!response.ok) throw new Error("Could not load that YouTube playlist.");

  const html = await response.text();
  const initialData = extractInitialData(html);
  const title = String(fallbackTitle || "").trim() || findPlaylistTitle(initialData) || `YouTube playlist ${playlistId}`;
  const videos = collectPlaylistVideos(initialData);
  const uniqueVideos = [...new Map(videos.map((video) => [video.youtubeId, video])).values()];
  return { title, videos: uniqueVideos };
}

async function getYouTubeInfo(input) {
  const youtubeId = normalizeYouTubeId(input);
  if (!youtubeId) throw new Error("Enter a valid YouTube URL or video ID.");

  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  let title = "";
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (response.ok) {
      const data = await response.json();
      title = String(data.title || "").trim();
    }
  } catch {
    title = "";
  }

  return { youtubeId, url, title };
}

async function getInternetArchiveInfo(input, preferredFileName = "") {
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

async function searchInternetArchiveSources(query, rows = 10) {
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
  search.searchParams.set("rows", String(Math.max(1, Math.min(20, Number(rows) || 10))));
  search.searchParams.set("page", "1");
  search.searchParams.set("sort[]", "downloads desc");
  search.searchParams.set("output", "json");

  const response = await fetch(search, {
    headers: { "user-agent": "DoinkTV Internet Archive Source Search" }
  });
  if (!response.ok) throw new Error("Could not search Internet Archive right now.");
  const data = await response.json();
  const docs = Array.isArray(data.response?.docs) ? data.response.docs : [];
  const candidates = await Promise.all(docs.map((doc) => internetArchiveSearchResultForDoc(doc).catch(() => null)));
  return candidates.filter(Boolean);
}

async function internetArchiveSearchResultForDoc(doc = {}) {
  const archiveId = String(doc.identifier || "").trim();
  if (!archiveId) return null;
  const metadata = await loadInternetArchiveMetadata(archiveId);
  const file = chooseInternetArchiveVideoFile(metadata);
  if (!file) return null;
  const title = String(doc.title || metadata.metadata?.title || archiveId).trim();
  const description = Array.isArray(doc.description) ? doc.description.join(" ") : String(doc.description || "");
  return {
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
    description: description.replace(/\s+/g, " ").trim().slice(0, 220)
  };
}

async function loadInternetArchiveMetadata(archiveId) {
  const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(archiveId)}`, {
    headers: { "user-agent": "DoinkTV Internet Archive Source Importer" }
  });
  if (!response.ok) throw new Error("Could not load that Internet Archive item.");
  return response.json();
}

function chooseInternetArchiveVideoFile(item = {}) {
  return chooseInternetArchiveVideoFiles(item, 1)[0] || null;
}

function chooseInternetArchiveVideoFiles(item = {}, limit = 50) {
  const files = Array.isArray(item.files) ? item.files : [];
  return files
    .filter((file) => isInternetArchiveVideoFile(file))
    .sort((a, b) => internetArchiveFileScore(b) - internetArchiveFileScore(a))
    .slice(0, Math.max(1, limit));
}

function isInternetArchiveVideoFile(file = {}) {
  const name = String(file.name || "");
  const format = String(file.format || "").toLowerCase();
  if (!name || /_thumb|_meta|_files|_archive\.torrent|\.gif$/i.test(name)) return false;
  return /\.(mp4|m4v|webm|ogv|mov|mpg|mpeg|avi|mkv)$/i.test(name)
    || /h\.?264|mpeg4|mpeg-4|matroska|webm|quicktime|ogg video|mpeg|avi/i.test(format);
}

function internetArchiveFileScore(file = {}) {
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

function archiveFileTitle(file = {}) {
  return String(file.name || "Untitled archive video")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function importInternetArchiveCollection(body = {}) {
  const collectionId = normalizeInternetArchiveId(body.url || body.collection || body.collectionId);
  if (!collectionId) throw new Error("Enter an Internet Archive collection or item URL.");
  const rows = Math.max(1, Math.min(100, Number(body.rows || 50)));
  const search = new URL("https://archive.org/advancedsearch.php");
  search.searchParams.set("q", `collection:${collectionId} AND mediatype:movies`);
  search.searchParams.set("fl[]", "identifier");
  search.searchParams.append("fl[]", "title");
  search.searchParams.set("rows", String(rows));
  search.searchParams.set("page", "1");
  search.searchParams.set("output", "json");
  const response = await fetch(search, {
    headers: { "user-agent": "DoinkTV Internet Archive Collection Importer" }
  });
  if (!response.ok) throw new Error("Could not search that Internet Archive collection.");
  const data = await response.json();
  const docs = data.response?.docs || [];
  if (!docs.length) return importInternetArchiveItemFiles(collectionId, body, rows);
  const folder = await createUniqueSourceFolder(String(body.folderName || "").trim() || collectionId);
  let imported = 0;
  let skipped = 0;
  for (const doc of docs) {
    try {
      const info = await getInternetArchiveInfo(doc.identifier);
      const exists = state.sources.some((source) => source.type === "internet-archive" && source.archiveId === info.archiveId && source.archiveFile === info.archiveFile && source.folderId === folder.id);
      if (exists) {
        skipped += 1;
        continue;
      }
      state.sources.push({
        id: crypto.randomUUID(),
        type: "internet-archive",
        title: info.title || doc.title || info.archiveId,
        folderId: folder.id,
        duration: info.duration,
        archiveId: info.archiveId,
        archiveFile: info.archiveFile,
        fileUrl: info.fileUrl,
        url: info.url,
        randomEligible: true
      });
      imported += 1;
    } catch {
      skipped += 1;
    }
  }
  await saveState();
  broadcastProgram();
  return { folder, imported, skipped };
}

async function importInternetArchiveItemFiles(archiveId, body = {}, limit = 50) {
  const metadata = await loadInternetArchiveMetadata(archiveId);
  const files = chooseInternetArchiveVideoFiles(metadata, limit);
  if (!files.length) throw new Error("No playable video files were found on that Internet Archive item.");
  const folderName = String(body.folderName || "").trim() || String(metadata.metadata?.title || archiveId).trim();
  const folder = await createUniqueSourceFolder(folderName);
  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const exists = state.sources.some((source) => source.type === "internet-archive" && source.archiveId === archiveId && source.archiveFile === file.name && source.folderId === folder.id);
    if (exists) {
      skipped += 1;
      continue;
    }
    state.sources.push({
      id: crypto.randomUUID(),
      type: "internet-archive",
      title: archiveFileTitle(file),
      folderId: folder.id,
      duration: Math.max(5, Math.round(Number(file.length) || parseDurationText(metadata.metadata?.runtime) || 300)),
      archiveId,
      archiveFile: file.name,
      fileUrl: archiveDownloadUrl(archiveId, file.name),
      url: `https://archive.org/details/${archiveId}`,
      randomEligible: true
    });
    imported += 1;
  }

  await saveState();
  broadcastProgram();
  return { folder, imported, skipped, itemImport: true };
}

function publicProgram() {
  maintainBroadcastTimeline();
  const program = programSnapshot();
  return {
    ...program,
    fx: activeBroadcastFx(),
    stream: {
      url: "/stream/live.m3u8",
      status: hlsPlayout.status,
      error: hlsPlayout.error
    }
  };
}

function activeBroadcastFx() {
  const now = Date.now();
  state.activeFx = (state.activeFx || []).filter((fx) => !Number.isFinite(Number(fx.expiresAt)) || fx.expiresAt > now);
  return state.activeFx;
}

function programSnapshot() {
  const now = Date.now();
  const entries = activeBroadcastEntries()
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && Number.isFinite(entry.startAt) && Number.isFinite(entry.duration))
    .sort((a, b) => a.startAt - b.startAt);

  const live = entries.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  const next = entries.find((entry) => entry.startAt > now && isAudienceScheduleEntry(entry));

  return {
    serverTime: now,
    mode: state.broadcastMode,
    live: live
      ? {
          id: live.id,
          title: live.title || live.source.title,
        startAt: live.startAt,
        duration: live.duration,
        offset: Math.max(0, (now - live.startAt) / 1000),
        source: live.source
        }
      : null,
    next: next
      ? {
          id: next.id,
          title: next.title || next.source.title,
          startAt: next.startAt,
          duration: next.duration,
          source: next.source
        }
      : null
  };
}

function isAudienceScheduleEntry(entry) {
  return entry?.source && !entry.autoBump && !isBumpSource(entry.source);
}

function isBumpSource(source) {
  return source?.type === "bump";
}

function formatEstTime(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function queueEntriesWithSources(entries = state.liveQueue) {
  return entries
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source);
}

function upcomingNormalQueueItems(startAt, count = 3, entries = state.liveQueue) {
  return queueEntriesWithSources(entries)
    .filter((entry) => entry.startAt >= startAt && !isBumpSource(entry.source))
    .sort((a, b) => a.startAt - b.startAt)
    .slice(0, count);
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function sampleMany(array, count) {
  const choices = [...array];
  const selected = [];
  while (selected.length < count && choices.length) {
    const index = Math.floor(Math.random() * choices.length);
    selected.push(choices.splice(index, 1)[0]);
  }
  return selected;
}

function randomAutoBumpVisuals() {
  const effectCount = Math.floor(Math.random() * 3);
  return {
    wallpaper: {
      shapes: sample([
        "mixed",
        "circles",
        "diamonds",
        "triangles",
        "lines",
        "stripes",
        "polka",
        "plaid",
        "tartan",
        "argyle",
        "mondrian",
        "checkerboard",
        "terrazzo",
        "memphis",
        "starburst"
      ]),
      scheme: sample([
        "midnight",
        "pool",
        "candy",
        "paper",
        "mono",
        "arcade",
        "warning",
        "citrus",
        "broadcast",
        "miami",
        "mint",
        "ruby",
        "blueprint"
      ]),
      spacing: 34 + Math.floor(Math.random() * 137),
      seed: Math.floor(Math.random() * 100000)
    },
    effects: sampleMany(["noise", "vhs", "dvd", "warp", "fisheye", "scanlines", "chromatic", "flicker", "letterbox"], effectCount),
    effectIntensity: 25 + Math.floor(Math.random() * 51)
  };
}

function createAutoBumpSource(afterEntryEnd, upcomingEntries = null) {
  const upcoming = upcomingEntries || upcomingNormalQueueItems(afterEntryEnd, 3);
  const lines = autoBumpLines(afterEntryEnd, upcoming);
  const visuals = randomAutoBumpVisuals();
  const audio = randomBumpMusic(AUTO_BUMP_DURATION);

  const source = {
    id: crypto.randomUUID(),
    type: "bump",
    title: "Schedule bump",
    folderId: "",
    duration: AUTO_BUMP_DURATION,
    bump: {
      heading: "coming up",
      lines,
      alignment: "left",
      placement: ["top", "middle", "bottom"][Math.floor(Math.random() * 3)],
      tone: ["classic", "caption", "washed"][Math.floor(Math.random() * 3)],
      seed: visuals.wallpaper.seed,
      wallpaper: visuals.wallpaper,
      effects: visuals.effects,
      effectIntensity: visuals.effectIntensity,
      audio: audio.path,
      audioStart: audio.start
    },
    generatedAt: Date.now()
  };
  state.sources.push(source);
  return source;
}

function autoBumpLines(afterEntryEnd, upcoming) {
  return upcoming.length
    ? upcoming.map((entry) => ({
        title: entry.title || entry.source.title,
        time: formatEstTime(entry.startAt)
      }))
    : [{ title: "More DoinkTV shortly", time: formatEstTime(afterEntryEnd) }];
}

function createManualBumpSource(body = {}) {
  const duration = Number(body.duration || AUTO_BUMP_DURATION);
  if (!Number.isFinite(duration) || duration < 3 || duration > 120) {
    throw new Error("Bump duration must be between 3 and 120 seconds.");
  }

  const lines = Array.isArray(body.lines)
    ? body.lines
        .map((line) => (typeof line === "string" ? { time: "", title: line } : { time: String(line.time || ""), title: String(line.title || "") }))
        .filter((line) => line.title.trim())
        .slice(0, 8)
    : [];

  const audio = body.audio
    ? { path: String(body.audio), start: Math.max(0, Number(body.audioStart) || 0) }
    : randomBumpMusic(Math.round(duration));

  const source = {
    id: crypto.randomUUID(),
    type: "bump",
    title: String(body.title || "Manual bump").trim() || "Manual bump",
    folderId: "",
    duration: Math.round(duration),
    bump: {
      heading: String(body.heading || "bump").trim() || "bump",
      lines: lines.length ? lines : [{ time: "", title: "DoinkTV continues shortly" }],
      secondsPerLine: Math.max(0.5, Math.min(30, Number(body.secondsPerLine) || Math.max(1, duration / Math.max(1, lines.length || 1)))),
      fontSize: Math.max(18, Math.min(120, Number(body.fontSize) || 58)),
      alignment: ["left", "center", "right"].includes(body.alignment) ? body.alignment : "left",
      placement: ["top", "middle", "bottom"].includes(body.placement) ? body.placement : "middle",
      tone: ["classic", "caption", "washed"].includes(body.tone) ? body.tone : "classic",
      tintStrength: Math.max(0, Math.min(100, Number(body.tintStrength) || 0)),
      creditText: String(body.creditText || "").trim(),
      creditPosition: String(body.creditPosition || "bottom-right"),
      creditFont: String(body.creditFont || "Arial, Helvetica, sans-serif"),
      creditSize: Math.max(10, Math.min(72, Number(body.creditSize) || 24)),
      format: String(body.format || "landscape"),
      seed: Number(body.wallpaper?.seed || body.seed || Math.floor(Math.random() * 100000)),
      wallpaper: body.wallpaper || randomAutoBumpVisuals().wallpaper,
      effects: Array.isArray(body.effects) ? body.effects.slice(0, 2) : [],
      effectIntensity: Math.max(0, Math.min(100, Number(body.effectIntensity) || 0)),
      audio: audio.path,
      audioStart: audio.start
    },
    generatedAt: Date.now()
  };
  state.sources.push(source);
  return source;
}

function randomBumpMusic(requiredSeconds = AUTO_BUMP_DURATION) {
  const music = state.bumpMusic?.length ? state.bumpMusic[Math.floor(Math.random() * state.bumpMusic.length)] : null;
  if (!music) return { path: "", start: 0 };
  return randomBumpMusicClip(music, requiredSeconds);
}

function randomBumpMusicClip(music, requiredSeconds = AUTO_BUMP_DURATION) {
  const duration = Number(music.duration || 0);
  const safeRequiredSeconds = Math.max(0, Number(requiredSeconds) || 0);
  const maxStart = Math.max(0, duration - safeRequiredSeconds);
  return {
    path: music.path,
    start: maxStart > 0 ? Math.round(Math.random() * maxStart * 10) / 10 : 0
  };
}

function ensureAutoBumpAudioStarts() {
  let changed = false;
  const autoBumpSourceIds = new Set(state.liveQueue.filter((entry) => entry.autoBump).map((entry) => entry.sourceId));
  for (const source of state.sources) {
    if (!autoBumpSourceIds.has(source.id) || !source.bump) continue;
    if (Number.isFinite(Number(source.bump.audioStart))) continue;
    const music = state.bumpMusic.find((item) => item.path === source.bump.audio) || state.bumpMusic[0];
    const clip = music ? randomBumpMusicClip(music, source.duration || AUTO_BUMP_DURATION) : { path: source.bump.audio || "", start: 0 };
    source.bump.audio = clip.path;
    source.bump.audioStart = clip.start;
    changed = true;
  }
  return changed;
}

async function refreshBumpMusic() {
  await mkdir(BUMP_MUSIC_DIR, { recursive: true });
  const files = await readdir(BUMP_MUSIC_DIR, { withFileTypes: true });
  const musicFiles = files
    .filter((file) => file.isFile() && /\.(mp3|wav|ogg|m4a)$/i.test(file.name))
    .map((file) => file.name);
  state.bumpMusic = (await Promise.all(musicFiles.map(async (fileName) => ({
    name: fileName.replace(/\.[^/.]+$/, ""),
    path: `/media/bump-music/${encodeURIComponent(fileName).replace(/%2F/g, "/")}`,
    duration: await readAudioDuration(path.join(BUMP_MUSIC_DIR, fileName))
  }))))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function readAudioDuration(filePath) {
  if (/\.mp3$/i.test(filePath)) return readMp3Duration(filePath);
  return 0;
}

async function readMp3Duration(filePath) {
  const buffer = await readFile(filePath);
  let offset = 0;
  if (buffer.toString("latin1", 0, 3) === "ID3" && buffer.length >= 10) {
    offset = 10 + ((buffer[6] & 0x7f) << 21) + ((buffer[7] & 0x7f) << 14) + ((buffer[8] & 0x7f) << 7) + (buffer[9] & 0x7f);
  }

  const bitrateTable = {
    V1L1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    V1L2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    V1L3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
    V2L1: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    V2L2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    V2L3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
  };
  const sampleRateTable = {
    3: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    0: [11025, 12000, 8000]
  };

  let duration = 0;
  let frames = 0;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff || (buffer[offset + 1] & 0xe0) !== 0xe0) {
      offset += 1;
      continue;
    }

    const versionBits = (buffer[offset + 1] >> 3) & 0x03;
    const layerBits = (buffer[offset + 1] >> 1) & 0x03;
    const bitrateIndex = (buffer[offset + 2] >> 4) & 0x0f;
    const sampleRateIndex = (buffer[offset + 2] >> 2) & 0x03;
    const padding = (buffer[offset + 2] >> 1) & 0x01;
    if (versionBits === 1 || layerBits === 0 || bitrateIndex === 0 || bitrateIndex === 15 || sampleRateIndex === 3) {
      offset += 1;
      continue;
    }

    const versionKey = versionBits === 3 ? "V1" : "V2";
    const layerKey = `L${4 - layerBits}`;
    const bitrate = bitrateTable[`${versionKey}${layerKey}`]?.[bitrateIndex] * 1000;
    const sampleRate = sampleRateTable[versionBits]?.[sampleRateIndex];
    if (!bitrate || !sampleRate) {
      offset += 1;
      continue;
    }

    const samples = layerBits === 3 ? 384 : versionBits === 3 || layerBits === 2 ? 1152 : 576;
    const frameLength = layerBits === 3
      ? Math.floor((12 * bitrate) / sampleRate + padding) * 4
      : Math.floor(((versionBits === 3 ? 144 : 72) * bitrate) / sampleRate + padding);
    if (!frameLength || offset + frameLength > buffer.length + 1) break;
    duration += samples / sampleRate;
    frames += 1;
    offset += frameLength;
  }
  return frames ? Math.round(duration * 10) / 10 : 0;
}

function queueEntryFromItem(item, startAt, now = Date.now()) {
  return {
    id: item.id,
    sourceId: item.sourceId,
    title: item.title || "",
    startAt,
    duration: item.duration,
    queuedAt: item.queuedAt || now,
    autoQueued: item.autoQueued
  };
}

function insertAutoBumpAt(rebuilt, cursor, now, sourceEntries = rebuilt) {
  const upcoming = upcomingNormalQueueItems(cursor, 3, sourceEntries);
  const bumpSource = createAutoBumpSource(cursor, upcoming);
  const entry = {
    id: crypto.randomUUID(),
    sourceId: bumpSource.id,
    title: bumpSource.title,
    startAt: cursor,
    duration: AUTO_BUMP_DURATION,
    queuedAt: now,
    autoBump: true
  };
  rebuilt.push(entry);
  return cursor + AUTO_BUMP_DURATION * 1000;
}

function refreshAutoBumpLines(entries = state.liveQueue) {
  for (const entry of entries) {
    if (!entry.autoBump) continue;
    const source = state.sources.find((item) => item.id === entry.sourceId);
    if (!source?.bump) continue;
    const afterBump = entry.startAt + entry.duration * 1000;
    source.bump.lines = autoBumpLines(afterBump, upcomingNormalQueueItems(afterBump, 3, entries));
  }
}

function rebuildLiveQueueTimings({ insertAutoBumps = true, leadingAutoBump = false } = {}) {
  const now = Date.now();
  const queue = state.liveQueue
    .filter((entry) => entry.startAt + entry.duration * 1000 > now || entry.startAt >= now)
    .map((entry) => ({ ...entry, source: state.sources.find((source) => source.id === entry.sourceId) }))
    .filter((entry) => entry.source)
    .sort((a, b) => a.startAt - b.startAt);

  const current = queue.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  let cursor = current ? current.startAt + current.duration * 1000 : now;
  let normalSecondsSinceBump = current && !isBumpSource(current.source) ? Math.max(0, (now - current.startAt) / 1000) : 0;
  const rebuilt = current ? [stripQueueSource(current)] : [];
  const pending = queue
    .filter((entry) => !current || entry.id !== current.id)
    .filter((entry) => entry.startAt + entry.duration * 1000 > now)
    .filter((entry) => !isBumpSource(entry.source) || !entry.autoBump);

  for (const item of pending) {
    rebuilt.push(queueEntryFromItem(item, cursor, now));
    cursor += item.duration * 1000;
  }

  cursor = current ? current.startAt + current.duration * 1000 : now;
  normalSecondsSinceBump = current && !isBumpSource(current.source) ? Math.max(0, (now - current.startAt) / 1000) : 0;
  const currentPrefix = current ? 1 : 0;
  const timeline = current ? [rebuilt[0]] : [];

  if (insertAutoBumps && leadingAutoBump && !current && rebuilt.some((entry) => {
    const source = state.sources.find((item) => item.id === entry.sourceId);
    return source && !isBumpSource(source);
  })) {
    cursor = insertAutoBumpAt(timeline, cursor, now, rebuilt);
  }

  for (const item of rebuilt.slice(currentPrefix)) {
    const source = state.sources.find((entrySource) => entrySource.id === item.sourceId);
    if (!source) continue;
    const normalEntry = queueEntryFromItem(item, cursor, now);
    timeline.push(normalEntry);
    cursor += item.duration * 1000;
    if (isBumpSource(source)) continue;
    normalSecondsSinceBump += item.duration;

    if (insertAutoBumps && normalSecondsSinceBump >= AUTO_BUMP_INTERVAL_MS / 1000) {
      cursor = insertAutoBumpAt(timeline, cursor, now, rebuilt);
      normalSecondsSinceBump = 0;
    }
  }

  state.liveQueue = timeline;
  refreshAutoBumpLines(state.liveQueue);
  pruneUnusedBumpSources();
}

function queueStandaloneScheduleBump() {
  const now = Date.now();
  const bumpSource = createAutoBumpSource(now, []);
  state.liveQueue.unshift({
    id: crypto.randomUUID(),
    sourceId: bumpSource.id,
    title: bumpSource.title,
    startAt: now,
    duration: AUTO_BUMP_DURATION,
    queuedAt: now,
    autoBump: true
  });
  refreshAutoBumpLines(state.liveQueue);
  pruneUnusedBumpSources();
  return true;
}

function isRandomEligibleSource(source) {
  if (!source || source.type === "bump") return false;
  if (source.randomEligible === false) return false;
  if (source.randomEligible === undefined && source.type === "youtube") return false;
  const folderId = source.folderId || "";
  if (!folderId) return true;
  const folder = state.sourceFolders.find((item) => item.id === folderId);
  return folder?.randomEligible !== false;
}

function backfillLiveQueue(minItems = MIN_QUEUE_VIDEO_ITEMS, { leadingAutoBump = false } = {}) {
  if (state.broadcastMode !== "queue") return false;
  const now = Date.now();
  const playableSources = state.sources.filter(isRandomEligibleSource);
  if (!playableSources.length) return false;

  const activeOrFuture = state.liveQueue
    .filter((entry) => entry.startAt + entry.duration * 1000 > now)
    .sort((a, b) => a.startAt - b.startAt);
  const queuedVideos = activeOrFuture
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && !isBumpSource(entry.source) && !entry.autoBump);
  const needed = Math.max(0, minItems - queuedVideos.length);
  if (!needed) return false;

  const recentIds = queuedVideos.slice(-playableSources.length).map((entry) => entry.sourceId);
  const additions = [];
  let cursor = activeOrFuture.reduce((latest, entry) => Math.max(latest, entry.startAt + entry.duration * 1000), now);
  for (let index = 0; index < needed; index += 1) {
    const source = randomQueueSource(playableSources, recentIds);
    if (!source) break;
    recentIds.push(source.id);
    additions.push({
      id: crypto.randomUUID(),
      sourceId: source.id,
      title: "",
      startAt: cursor,
      duration: source.duration,
      queuedAt: now,
      autoQueued: true
    });
    cursor += source.duration * 1000;
  }

  state.liveQueue = [...activeOrFuture, ...additions].sort((a, b) => a.startAt - b.startAt);
  rebuildLiveQueueTimings({ leadingAutoBump });
  queueAutoIngestSourceIds(additions.map((entry) => entry.sourceId), "automatic queue backfill", { force: true });
  return additions.length > 0;
}

function randomQueueSource(sources, recentIds = []) {
  const recent = new Set(recentIds);
  const fresh = sources.filter((source) => !recent.has(source.id));
  const pool = fresh.length ? fresh : sources;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

function stripQueueSource(entry) {
  const { source, ...rest } = entry;
  return rest;
}

function pruneUnusedBumpSources() {
  const queuedSourceIds = new Set(state.liveQueue.map((entry) => entry.sourceId));
  state.sources = state.sources.filter((source) => !isBumpSource(source) || queuedSourceIds.has(source.id));
}

function activeBroadcastEntries() {
  return state.broadcastMode === "queue" ? state.liveQueue : state.schedule;
}

function broadcastProgram() {
  const payload = `data: ${JSON.stringify(publicProgram())}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function maintainBroadcastTimeline() {
  if (state.broadcastMode !== "queue") return false;
  const changed = maintainLiveQueueContinuity();
  const backfilled = backfillLiveQueue();
  if (changed || backfilled) timelineSaveNeeded = true;
  return changed || backfilled;
}

function maintainLiveQueueContinuity() {
  const now = Date.now();
  const queue = state.liveQueue
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && entry.startAt + entry.duration * 1000 > now)
    .sort((a, b) => a.startAt - b.startAt);

  const bumpSourceCount = state.sources.filter((source) => isBumpSource(source)).length;
  let changed = queue.length !== state.liveQueue.length;
  const current = queue.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);

  if (!current && queue.length && queue[0].startAt > now) {
    const firstStart = queue[0].startAt;
    for (const entry of queue) {
      entry.startAt = now + (entry.startAt - firstStart);
    }
    changed = true;
  }

  state.liveQueue = queue.map(stripQueueSource);
  refreshAutoBumpLines(state.liveQueue);
  pruneUnusedBumpSources();
  if (state.sources.filter((source) => isBumpSource(source)).length !== bumpSourceCount) changed = true;
  return changed;
}

async function flushTimelineSave() {
  if (!timelineSaveNeeded) return;
  timelineSaveNeeded = false;
  await saveState();
}

async function syncHlsPlayout() {
  const program = publicProgram();
  const live = program.live || standbyProgram(program.serverTime);
  if (hlsPlayout.id === live.id && hlsPlayout.status === "running" && hlsPlayout.process && !hlsPlayout.process.killed) {
    if (Date.now() - hlsPlayout.startedAt < 12000) return;
    if (await isHlsPlaylistFresh()) return;
    hlsPlayout.error = "HLS playlist stopped updating; restarting playout.";
  }

  await startHlsPlayout(live);
}

async function isHlsPlaylistFresh(maxAgeMs = 10000) {
  try {
    const playlistStat = await stat(path.join(HLS_DIR, "live.m3u8"));
    return playlistStat.size > 0 && Date.now() - playlistStat.mtimeMs < maxAgeMs;
  } catch {
    return false;
  }
}

function standbyProgram(now = Date.now()) {
  return {
    id: "standby",
    title: "Stand by",
    startAt: now,
    duration: 3600,
    offset: 0,
    source: {
      id: "standby",
      type: "slate",
      title: "Stand by"
    }
  };
}

async function startHlsPlayout(live) {
  stopHlsPlayout();
  hlsPlayout.id = live.id;
  hlsPlayout.startedAt = Date.now();
  hlsPlayout.status = "starting";
  hlsPlayout.error = "";
  await mkdir(HLS_DIR, { recursive: true });
  await pruneHlsDirectory();

  const args = hlsArgsForProgram(live);
  const child = spawn(ffmpegPath, args, { windowsHide: true });
  hlsPlayout.process = child;
  hlsPlayout.status = "running";
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text) hlsPlayout.error = text.slice(-800);
  });
  child.on("error", (error) => {
    if (hlsPlayout.process === child) hlsPlayout.process = null;
    hlsPlayout.status = "error";
    hlsPlayout.error = `FFmpeg failed: ${error.message}`;
  });
  child.on("exit", (code) => {
    if (hlsPlayout.process === child) {
      hlsPlayout.process = null;
      hlsPlayout.status = code === 0 ? "ended" : "error";
      if (code !== 0 && !hlsPlayout.error) hlsPlayout.error = `FFmpeg exited with code ${code}.`;
    }
  });
}

async function pruneHlsDirectory(maxAgeMs = 1000 * 60 * 5) {
  if (!existsSync(HLS_DIR)) return;
  const cutoff = Date.now() - maxAgeMs;
  const entries = await readdir(HLS_DIR, { withFileTypes: true }).catch(() => []);
  await Promise.all(entries
    .filter((entry) => entry.isFile() && entry.name !== "live.m3u8")
    .map(async (entry) => {
      const filePath = path.join(HLS_DIR, entry.name);
      const fileStat = await stat(filePath).catch(() => null);
      if (fileStat && fileStat.mtimeMs < cutoff) await rm(filePath, { force: true });
    }));
}

function stopHlsPlayout() {
  if (!hlsPlayout.process) return;
  const child = hlsPlayout.process;
  hlsPlayout.process = null;
  child.kill("SIGTERM");
}

function hlsArgsForProgram(live) {
  const id = live.id.replace(/[^a-zA-Z0-9_-]/g, "");
  const remaining = Math.max(1, Math.ceil((live.duration || 3600) - (live.offset || 0)));
  const segmentPattern = path.join(HLS_DIR, `${id}_%05d.ts`);
  const playlist = path.join(HLS_DIR, "live.m3u8");

  const source = live.source || {};
  if (source.type === "local" || source.type === "internet-archive") {
    const inputPath = source.type === "internet-archive" ? source.fileUrl : mediaPathFromSource(source.path);
    if (inputPath && (source.type === "internet-archive" || existsSync(inputPath))) {
      const networkInputArgs = source.type === "internet-archive"
        ? ["-reconnect", "1", "-reconnect_streamed", "1", "-reconnect_delay_max", "5", "-rw_timeout", "15000000"]
        : [];
      return [
        "-hide_banner",
        "-loglevel", "warning",
        "-re",
        ...networkInputArgs,
        "-ss", String(Math.max(0, live.offset || 0)),
        "-i", inputPath,
        "-t", String(remaining),
        "-map", "0:v:0",
        "-map", "0:a:0?",
        "-vf", videoFilter(),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-tune", "zerolatency",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-g", "60",
        "-sc_threshold", "0",
        "-c:a", "aac",
        "-ar", "48000",
        "-b:a", "128k",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "6",
        "-hls_flags", "delete_segments+omit_endlist+independent_segments",
        "-hls_segment_filename", segmentPattern,
        playlist
      ];
    }
  }

  if (source.type === "bump") {
    return hlsSlateArgs(live, remaining, segmentPattern, playlist);
  }

  const title = source.type === "youtube"
    ? "YouTube source queued"
    : live.title || "Stand by";
  const subtitle = source.type === "youtube"
    ? "Ingest this video as a server file to include it in the shared broadcast feed."
    : "The broadcast will continue shortly.";
  return hlsSlateArgs({ ...live, title, slateSubtitle: subtitle }, remaining, segmentPattern, playlist);
}

function hlsSlateArgs(live, remaining, segmentPattern, playlist) {
  const source = live.source || {};
  const bump = source.bump || {};
  const audioPath = bump.audio ? mediaPathFromSource(bump.audio) : "";
  const audioArgs = audioPath && existsSync(audioPath)
    ? ["-stream_loop", "-1", "-ss", String(Math.max(0, Number(bump.audioStart) || 0)), "-i", audioPath]
    : ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"];
  const lines = Array.isArray(bump.lines) && bump.lines.length
    ? bump.lines.map((line) => (typeof line === "string" ? line : `${line.time ? `${line.time}  ` : ""}${line.title}`)).slice(0, 8)
    : [live.slateSubtitle || ""].filter(Boolean);
  const filter = isManualBump(bump)
    ? manualBumpVideoFilter(lines, bump)
    : slateVideoFilter(live.title || source.title || "DoinkTV", lines, bump);
  return [
    "-hide_banner",
    "-loglevel", "warning",
    "-f", "lavfi",
    "-re",
    "-i", "color=c=0x090b10:s=1280x720:r=30",
    ...audioArgs,
    "-t", String(remaining),
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-vf", filter,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-tune", "zerolatency",
    "-pix_fmt", "yuv420p",
    "-r", "30",
    "-g", "60",
    "-sc_threshold", "0",
    "-c:a", "aac",
    "-ar", "48000",
    "-b:a", "128k",
    "-f", "hls",
    "-hls_time", "2",
    "-hls_list_size", "6",
    "-hls_flags", "delete_segments+omit_endlist+independent_segments",
    "-hls_segment_filename", segmentPattern,
    playlist
  ];
}

function isManualBump(bump = {}) {
  return Boolean(bump.secondsPerLine || bump.fontSize || bump.creditText || bump.tintStrength || bump.format);
}

function mediaPathFromSource(sourcePath = "") {
  const relativePath = decodeURIComponent(String(sourcePath).replace(/^\/?media\//, ""));
  if (!relativePath || relativePath.includes("..")) return "";
  return path.join(MEDIA_DIR, relativePath);
}

function videoFilter() {
  return "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p";
}

function manualBumpVideoFilter(lines = [], bump = {}) {
  const font = drawTextEscape(fontFilePath());
  const wallpaper = bump.wallpaper || {};
  const palette = bumpPalette(wallpaper.scheme);
  const placement = ["top", "middle", "bottom"].includes(bump.placement) ? bump.placement : "middle";
  const alignment = ["left", "center", "right"].includes(bump.alignment) ? bump.alignment : "left";
  const tone = ["classic", "caption", "washed"].includes(bump.tone) ? bump.tone : "classic";
  const fontSize = Math.max(18, Math.min(120, Number(bump.fontSize) || 58));
  const lineHeight = Math.round(fontSize * 1.28);
  const pad = Math.round(720 * 0.075);
  const textWidth = Math.min(1280 - pad * 2, Math.round(1280 * 0.62), fontSize * 16);
  const textX = alignment === "right" ? 1280 - pad : alignment === "center" ? 640 : pad;
  const textXExpr = textXExpression(textX, alignment);
  const cardX = alignment === "right" ? 1280 - pad - textWidth : alignment === "center" ? 640 - textWidth / 2 : pad;
  const secondsPerLine = Math.max(0.5, Number(bump.secondsPerLine) || 2.5);
  const safeLines = lines.map((line) => String(line || " ")).filter((line) => line.trim()).length ? lines : [" "];
  const maxWrapped = 4;
  const creditLines = String(bump.creditText || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 4);
  const filters = [
    "format=yuv420p",
    `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[0]}@1:t=fill`,
    `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[1]}@0.36:t=fill`,
    ...wallpaperFilters(wallpaper, palette)
  ];

  if (tone === "classic") filters.push(`drawbox=x=0:y=0:w=1280:h=720:color=black@${Math.max(0, Math.min(1, Number(bump.tintStrength || 0) / 100))}:t=fill`);
  if (tone === "washed") filters.push("drawbox=x=0:y=0:w=1280:h=720:color=white@0.08:t=fill");

  safeLines.forEach((rawLine, index) => {
    const sourceLine = typeof rawLine === "string" ? rawLine : rawLine?.title || " ";
    const enable = `between(mod(t\\,${secondsPerLine * safeLines.length})\\,${index * secondsPerLine}\\,${(index + 1) * secondsPerLine})`;
    const wrapped = wrapDrawTextLine(sourceLine, Math.max(8, Math.floor(textWidth / (fontSize * 0.56)))).slice(0, maxWrapped);
    const blockHeight = wrapped.length * lineHeight;
    const y = placement === "top" ? pad : placement === "bottom" ? 720 - pad - blockHeight : Math.round(360 - blockHeight / 2);
    if (tone === "caption") {
      const cardPad = Math.round(fontSize * 0.72);
      filters.push(`drawbox=x=${Math.round(cardX - cardPad)}:y=${Math.round(y - cardPad * 0.7)}:w=${Math.round(textWidth + cardPad * 2)}:h=${Math.round(blockHeight + cardPad * 1.25)}:color=black@0.68:t=fill:enable='${enable}'`);
    }
    wrapped.forEach((line, lineIndex) => {
      filters.push(`drawtext=fontfile='${font}':text='${drawTextEscape(line)}':fontcolor=0xf4f0e8:fontsize=${fontSize}:x=${textXExpr}:y=${Math.round(y + lineIndex * lineHeight)}+sin(t*0.9)*3:shadowcolor=black@0.75:shadowx=0:shadowy=3:enable='${enable}'`);
    });
  });

  if (creditLines.length) {
    const size = Math.max(10, Math.min(72, Number(bump.creditSize) || 24));
    const lineHeightCredit = Math.round(size * 1.26);
    const position = String(bump.creditPosition || "bottom-right");
    const [, horizontal = "right"] = position.split("-");
    const vertical = position.split("-")[0] || "bottom";
    const align = horizontal === "left" ? "left" : horizontal === "center" ? "center" : "right";
    const x = align === "left" ? 29 : align === "center" ? 640 : 1251;
    const y = vertical === "top" ? 29 : vertical === "center" ? Math.round(360 - (creditLines.length * lineHeightCredit) / 2) : Math.round(720 - 29 - creditLines.length * lineHeightCredit);
    creditLines.forEach((line, index) => {
      filters.push(`drawtext=fontfile='${font}':text='${drawTextEscape(line)}':fontcolor=0xf4f0e8@0.88:fontsize=${size}:x=${textXExpression(x, align)}:y=${y + index * lineHeightCredit}:shadowcolor=black@0.85:shadowx=0:shadowy=2`);
    });
  }

  filters.push(...effectFilters(bump.effects, Math.max(0, Math.min(1, Number(bump.effectIntensity || 0) / 100))));
  return filters.join(",");
}

function wrapDrawTextLine(text, maxChars) {
  const words = String(text || " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [" "];
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length <= maxChars || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function slateVideoFilter(title, lines = [], bump = {}) {
  const font = drawTextEscape(fontFilePath());
  const wallpaper = bump.wallpaper || {};
  const palette = bumpPalette(wallpaper.scheme);
  const placement = ["top", "middle", "bottom"].includes(bump.placement) ? bump.placement : "middle";
  const alignment = ["left", "center", "right"].includes(bump.alignment) ? bump.alignment : "left";
  const tone = ["classic", "caption", "washed"].includes(bump.tone) ? bump.tone : "classic";
  const intensity = Math.max(0, Math.min(1, Number(bump.effectIntensity || 45) / 100));
  const textLines = [title, ...lines].filter(Boolean).slice(0, 6);
  const fontSize = textLines.length > 4 ? 34 : 42;
  const lineHeight = Math.round(fontSize * 1.35);
  const blockHeight = textLines.length * lineHeight;
  const y = placement === "top" ? 90 : placement === "bottom" ? Math.max(90, 630 - blockHeight) : Math.round((720 - blockHeight) / 2);
  const x = alignment === "right" ? 1188 : alignment === "center" ? 640 : 78;
  const align = alignment;
  const filters = [
    "format=yuv420p",
    `colorchannelmixer=rr=0.4:gg=0.4:bb=0.4`,
    `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[0]}@1:t=fill`,
    `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[1]}@0.42:t=fill`
  ];

  filters.push(...wallpaperFilters(wallpaper, palette));
  if (tone === "classic") filters.push("drawbox=x=0:y=0:w=1280:h=720:color=black@0.24:t=fill");
  if (tone === "caption") filters.push(`drawbox=x=${alignment === "right" ? 622 : alignment === "center" ? 290 : 48}:y=${Math.max(54, y - 22)}:w=610:h=${blockHeight + 42}:color=black@0.62:t=fill`);
  if (tone === "washed") filters.push("drawbox=x=0:y=0:w=1280:h=720:color=white@0.08:t=fill");

  textLines.forEach((line, index) => {
    const color = index === 0 ? "0xffe066" : "white";
    const size = index === 0 ? fontSize + 8 : fontSize;
    filters.push(`drawtext=fontfile='${font}':text='${drawTextEscape(line)}':fontcolor=${color}:fontsize=${size}:x=${textXExpression(x, align)}:y=${y + index * lineHeight}:shadowcolor=black@0.75:shadowx=2:shadowy=2`);
  });

  filters.push(...effectFilters(bump.effects, intensity));
  return filters.join(",");
}

function bumpPalette(name) {
  const palettes = {
    midnight: { bg: ["0x02030a", "0x07111f", "0x220b33"], shape: ["0xfff8d7", "0xffe15a", "0x36c8ff", "0xff4f7b"] },
    pool: { bg: ["0x00150f", "0x013f35", "0x06294f"], shape: ["0xeafff8", "0x42ffb0", "0xffdd4a", "0xff6f59"] },
    candy: { bg: ["0x19001f", "0x3a0066", "0x001b54"], shape: ["0xff4fd8", "0x00e5ff", "0xfff35c", "0x6dff8b"] },
    paper: { bg: ["0x241a09", "0x7a5b21", "0xf2d778"], shape: ["0x17100a", "0xfff7d6", "0x0f6f78", "0xd12626"] },
    mono: { bg: ["0x000000", "0x121212", "0x303030"], shape: ["0xffffff", "0xd0d0d0", "0x8c8c8c", "0xf2f2f2"] },
    arcade: { bg: ["0x090018", "0x1b0045", "0x00143f"], shape: ["0xff2bd6", "0x00ffea", "0xfaff00", "0xff6b00"] },
    warning: { bg: ["0x080600", "0x1f1600", "0x453000"], shape: ["0xffd400", "0x111111", "0xff5a00", "0xfff5b5"] },
    citrus: { bg: ["0x102000", "0x2f7d00", "0xf7db00"], shape: ["0xffffff", "0xff4d00", "0x00e676", "0x111111"] },
    broadcast: { bg: ["0x050505", "0x1c1c1c", "0x050505"], shape: ["0xffffff", "0xff003c", "0x00f0ff", "0xffe600"] },
    miami: { bg: ["0x090022", "0x24115e", "0xff3f81"], shape: ["0x00f5ff", "0xffef5a", "0xff7ad9", "0xffffff"] },
    mint: { bg: ["0x001f24", "0x005d55", "0xd8ff4f"], shape: ["0xf8fff2", "0x00ff94", "0xff2e63", "0x173bff"] },
    ruby: { bg: ["0x100006", "0x3a0014", "0x7f001f"], shape: ["0xffccd5", "0xff1744", "0xffb000", "0xffffff"] },
    blueprint: { bg: ["0x00152e", "0x003e7a", "0x006dc1"], shape: ["0xffffff", "0x7bd8ff", "0xffec8b", "0x00152e"] }
  };
  return palettes[name] || palettes.midnight;
}

function wallpaperFilters(wallpaper, palette) {
  const novelty = ["novelty", "potleaf", "cats", "birds", "penguins", "dinosaurs"];
  const shape = novelty.includes(wallpaper.shapes) ? "novelty" : wallpaper.shapes || "mixed";
  const spacing = Math.max(42, Math.min(190, Number(wallpaper.spacing) || 86));
  const filters = [];
  for (let y = -spacing; y < 820; y += spacing) {
    for (let x = -spacing; x < 1380; x += spacing) {
      const index = Math.abs(Math.floor((x * 13 + y * 7 + Number(wallpaper.seed || 1)) % palette.shape.length));
      const color = palette.shape[index];
      const alpha = 0.12 + (index * 0.035);
      if (shape === "novelty") {
        filters.push(...noveltyShapeFilters(x, y, spacing, color, alpha, index));
      } else if (shape === "lines" || shape === "stripes") {
        filters.push(`drawbox=x=${Math.round(x)}:y=${Math.round(y)}:w=${Math.round(spacing * 0.72)}:h=5:color=${color}@${alpha}:t=fill`);
      } else if (shape === "diamonds" || shape === "triangles" || shape === "argyle") {
        filters.push(`drawbox=x=${Math.round(x)}:y=${Math.round(y)}:w=${Math.round(spacing * 0.45)}:h=${Math.round(spacing * 0.45)}:color=${color}@${alpha}:t=4`);
      } else {
        filters.push(`drawbox=x=${Math.round(x)}:y=${Math.round(y)}:w=${Math.round(spacing * 0.42)}:h=${Math.round(spacing * 0.42)}:color=${color}@${alpha}:t=fill`);
      }
    }
  }
  return filters.slice(0, 90);
}

function noveltyShapeFilters(x, y, spacing, color, alpha, index) {
  const px = Math.round(x);
  const py = Math.round(y);
  const unit = Math.round(spacing * 0.16);
  const mode = index % 5;
  if (mode === 0) {
    return [
      `drawbox=x=${px}:y=${py + unit}:w=${unit * 3}:h=${unit * 2}:color=${color}@${alpha}:t=fill`,
      `drawbox=x=${px + unit}:y=${py}:w=${unit}:h=${unit * 4}:color=${color}@${alpha}:t=fill`
    ];
  }
  if (mode === 1) {
    return [
      `drawbox=x=${px}:y=${py + unit}:w=${unit * 4}:h=${unit * 3}:color=${color}@${alpha}:t=4`,
      `drawbox=x=${px}:y=${py}:w=${unit}:h=${unit}:color=${color}@${alpha}:t=fill`,
      `drawbox=x=${px + unit * 3}:y=${py}:w=${unit}:h=${unit}:color=${color}@${alpha}:t=fill`
    ];
  }
  if (mode === 2) {
    return [
      `drawbox=x=${px}:y=${py + unit}:w=${unit * 5}:h=${unit * 2}:color=${color}@${alpha}:t=fill`,
      `drawbox=x=${px + unit * 4}:y=${py}:w=${unit * 2}:h=${unit}:color=${color}@${alpha}:t=fill`
    ];
  }
  if (mode === 3) {
    return [
      `drawbox=x=${px + unit}:y=${py}:w=${unit * 2}:h=${unit * 5}:color=${color}@${alpha}:t=fill`,
      `drawbox=x=${px}:y=${py + unit * 4}:w=${unit}:h=${unit}:color=${color}@${alpha}:t=fill`,
      `drawbox=x=${px + unit * 3}:y=${py + unit * 4}:w=${unit}:h=${unit}:color=${color}@${alpha}:t=fill`
    ];
  }
  return [
    `drawbox=x=${px}:y=${py + unit}:w=${unit * 5}:h=${unit * 3}:color=${color}@${alpha}:t=fill`,
    `drawbox=x=${px + unit * 4}:y=${py}:w=${unit * 2}:h=${unit * 2}:color=${color}@${alpha}:t=fill`,
    `drawbox=x=${px + unit}:y=${py + unit * 3}:w=${unit}:h=${unit * 2}:color=${color}@${alpha}:t=fill`
  ];
}

function effectFilters(effects = [], intensity = 0.45) {
  const selected = Array.isArray(effects) ? effects : [];
  const filters = [];
  if (selected.includes("scanlines") || selected.includes("vhs")) {
    filters.push(`drawbox=x=0:y=0:w=1280:h=720:color=black@${0.08 + intensity * 0.12}:t=2`);
  }
  if (selected.includes("letterbox")) {
    filters.push(`drawbox=x=0:y=0:w=1280:h=${Math.round(38 + intensity * 36)}:color=black@0.82:t=fill`);
    filters.push(`drawbox=x=0:y=${Math.round(682 - intensity * 36)}:w=1280:h=${Math.round(38 + intensity * 36)}:color=black@0.82:t=fill`);
  }
  if (selected.includes("noise") || selected.includes("flicker")) {
    filters.push(`noise=alls=${Math.round(5 + intensity * 18)}:allf=t`);
  }
  if (selected.includes("chromatic")) {
    filters.push("eq=saturation=1.25:contrast=1.08");
  }
  return filters;
}

function textXExpression(x, align) {
  if (align === "center") return `(w-text_w)/2`;
  if (align === "right") return `${x}-text_w`;
  return String(x);
}

function fontFilePath() {
  const candidates = [
    process.env.DOINK_FONT_FILE,
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) || candidates[0];
}

function drawTextEscape(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(":", "\\:")
    .replaceAll("'", "\\'")
    .replaceAll("%", "\\%")
    .replace(/[\r\n]+/g, " ")
    .slice(0, 96);
}

function publicChat() {
  return {
    serverTime: Date.now(),
    messages: state.chat.slice(-80)
  };
}

async function streamDebug() {
  const files = existsSync(HLS_DIR)
    ? await Promise.all((await readdir(HLS_DIR, { withFileTypes: true }))
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const filePath = path.join(HLS_DIR, entry.name);
          const fileStat = await stat(filePath);
          return {
            name: entry.name,
            size: fileStat.size,
            modifiedAt: fileStat.mtimeMs
          };
        }))
    : [];
  const playlistPath = path.join(HLS_DIR, "live.m3u8");
  return {
    serverTime: Date.now(),
    hlsDir: HLS_DIR,
    playout: {
      id: hlsPlayout.id,
      status: hlsPlayout.status,
      startedAt: hlsPlayout.startedAt,
      running: Boolean(hlsPlayout.process),
      error: hlsPlayout.error
    },
    files: files.sort((a, b) => a.name.localeCompare(b.name)),
    playlist: existsSync(playlistPath) ? await readFile(playlistPath, "utf8") : ""
  };
}

function broadcastChat() {
  const payload = `data: ${JSON.stringify(publicChat())}\n\n`;
  for (const client of chatClients) {
    client.write(payload);
  }
}

async function createChatMessage(req, body) {
  const session = getSession(req);
  if (!session) throw new Error("Log in to chat.");
  const text = String(body.text || "").replace(/\s+/g, " ").trim();
  if (!text) throw new Error("Enter a message first.");
  if (text.length > 280) throw new Error("Messages must be 280 characters or less.");

  const message = {
    id: crypto.randomUUID(),
    username: session.username,
    role: session.role,
    text,
    createdAt: Date.now()
  };
  state.chat.push(message);
  state.chat = state.chat.slice(-200);
  await saveState();
  broadcastChat();
  return message;
}

function cleanSchedule() {
  const cutoff = Date.now() - 1000 * 60 * 60 * 12;
  state.schedule = state.schedule.filter((entry) => entry.startAt + entry.duration * 1000 > cutoff);
  state.liveQueue = state.liveQueue.filter((entry) => entry.startAt + entry.duration * 1000 > cutoff);
}

async function createSource(body) {
  const type = ["local", "internet-archive"].includes(body.type) ? body.type : "youtube";
  const title = String(body.title || "").trim() || "Untitled source";
  const duration = Number(body.duration);
  if (!Number.isFinite(duration) || duration < 5) {
    throw new Error("Duration must be at least 5 seconds.");
  }

  const source = {
    id: crypto.randomUUID(),
    type,
    title,
    folderId: normalizeFolderId(body.folderId),
    duration: Math.round(duration),
    randomEligible: type !== "youtube"
  };

  if (type === "youtube") {
    const youtubeId = normalizeYouTubeId(body.youtube || body.url);
    if (!youtubeId) throw new Error("Enter a valid YouTube URL or video ID.");
    source.youtubeId = youtubeId;
    source.url = `https://www.youtube.com/watch?v=${youtubeId}`;
  } else if (type === "internet-archive") {
    const info = await getInternetArchiveInfo(body.archive || body.url || body.archiveId, body.archiveFile);
    source.archiveId = info.archiveId;
    source.archiveFile = info.archiveFile;
    source.fileUrl = info.fileUrl;
    source.url = info.url;
    if (!String(body.title || "").trim()) source.title = info.title;
    if (!Number.isFinite(duration) || !body.duration) source.duration = info.duration;
  } else {
    const rawPath = String(body.path || "").trim().replaceAll("\\", "/");
    if (!rawPath) throw new Error("Enter a server media path.");
    if (rawPath.includes("..")) throw new Error("Media paths cannot traverse directories.");
    const relativePath = rawPath.replace(/^\/?media\//, "");
    const filePath = path.join(MEDIA_DIR, relativePath);
    if (!existsSync(filePath)) throw new Error(`No file exists at media/${relativePath}.`);
    source.path = `/media/${relativePath}`;
  }

  state.sources.push(source);
  await saveState();
  return source;
}

function normalizeFolderId(folderId) {
  const id = String(folderId || "").trim();
  if (!id) return "";
  if (!state.sourceFolders.some((folder) => folder.id === id)) {
    throw new Error("Unknown source folder.");
  }
  return id;
}

async function createSourceFolder(body) {
  const name = String(body.name || "").replace(/\s+/g, " ").trim();
  if (name.length < 2) throw new Error("Folder names must be at least 2 characters.");
  if (name.length > 48) throw new Error("Folder names must be 48 characters or less.");
  if (state.sourceFolders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("A source folder with that name already exists.");
  }

  const folder = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    randomEligible: true
  };
  state.sourceFolders.push(folder);
  state.sourceFolders.sort((a, b) => a.name.localeCompare(b.name));
  await saveState();
  return folder;
}

async function createUniqueSourceFolder(baseName) {
  let name = String(baseName || "Imported playlist").replace(/\s+/g, " ").trim().slice(0, 48);
  if (name.length < 2) name = "Imported playlist";
  const original = name;
  let suffix = 2;
  while (state.sourceFolders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) {
    const tail = ` ${suffix}`;
    name = `${original.slice(0, 48 - tail.length)}${tail}`;
    suffix += 1;
  }
  const folder = {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    randomEligible: true
  };
  state.sourceFolders.push(folder);
  state.sourceFolders.sort((a, b) => a.name.localeCompare(b.name));
  return folder;
}

async function updateSource(id, body) {
  const source = state.sources.find((item) => item.id === id);
  if (!source) throw new Error("Unknown source.");

  if ("title" in body) {
    const title = String(body.title || "").trim();
    if (!title) throw new Error("Title is required.");
    source.title = title;
  }
  if ("duration" in body) {
    const duration = Number(body.duration);
    if (!Number.isFinite(duration) || duration < 5) throw new Error("Duration must be at least 5 seconds.");
    source.duration = Math.round(duration);
  }
  if ("folderId" in body) {
    source.folderId = normalizeFolderId(body.folderId);
  }
  if ("randomEligible" in body) {
    source.randomEligible = Boolean(body.randomEligible);
  }

  await saveState();
  broadcastProgram();
  return source;
}

async function updateSourceFolder(id, body) {
  const folder = state.sourceFolders.find((item) => item.id === id);
  if (!folder) throw new Error("Unknown source folder.");
  if ("name" in body) {
    const name = String(body.name || "").replace(/\s+/g, " ").trim();
    if (name.length < 2) throw new Error("Folder names must be at least 2 characters.");
    if (name.length > 48) throw new Error("Folder names must be 48 characters or less.");
    if (state.sourceFolders.some((item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase())) {
      throw new Error("A source folder with that name already exists.");
    }
    folder.name = name;
  }
  if ("randomEligible" in body) {
    folder.randomEligible = Boolean(body.randomEligible);
  }
  await saveState();
  broadcastProgram();
  return folder;
}

async function createScheduleEntry(body, immediate = false) {
  const source = state.sources.find((item) => item.id === body.sourceId);
  if (!source) throw new Error("Unknown source.");

  const duration = Number(body.duration || source.duration);
  if (!Number.isFinite(duration) || duration < 5) {
    throw new Error("Duration must be at least 5 seconds.");
  }

  const startAt = immediate ? Date.now() : Date.parse(body.startAt);
  if (!Number.isFinite(startAt)) throw new Error("Enter a valid start time.");

  const entry = {
    id: crypto.randomUUID(),
    sourceId: source.id,
    title: String(body.title || "").trim(),
    startAt,
    duration: Math.round(duration)
  };

  if (immediate) {
    state.schedule = state.schedule.filter((item) => Date.now() >= item.startAt + item.duration * 1000);
  }

  state.schedule.push(entry);
  state.schedule.sort((a, b) => a.startAt - b.startAt);
  cleanSchedule();
  await saveState();
  broadcastProgram();
  return entry;
}

function librarySources(folderId) {
  const id = String(folderId || "").trim();
  if (id && !state.sourceFolders.some((folder) => folder.id === id)) throw new Error("Unknown source folder.");
  return state.sources
    .filter((source) => source.type !== "bump" && (source.folderId || "") === id)
    .sort((a, b) => state.sources.indexOf(a) - state.sources.indexOf(b));
}

async function reorderLibrarySources(body) {
  const folderId = normalizeFolderId(body.folderId);
  const sources = librarySources(folderId);
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const ordered = (Array.isArray(body.ids) ? body.ids : [])
    .map(String)
    .filter((id) => sourceById.has(id))
    .map((id) => sourceById.get(id));

  for (const source of sources) {
    if (!ordered.some((item) => item.id === source.id)) ordered.push(source);
  }

  const nextOrder = [...ordered];
  state.sources = state.sources.map((source) => {
    if (source.type === "bump" || (source.folderId || "") !== folderId) return source;
    return nextOrder.shift() || source;
  });

  await saveState();
  broadcastProgram();
  return { ok: true };
}

async function ingestSource(source) {
  if (!source || source.type === "bump") {
    return { id: source?.id || "", title: source?.title || "", status: "skipped", message: "Bumps are generated directly by the broadcaster." };
  }

  const updatedAt = Date.now();
  if (source.type === "local") {
    const filePath = mediaPathFromSource(source.path);
    const ready = Boolean(filePath && existsSync(filePath));
    source.ingest = {
      status: ready ? "ready" : "missing",
      message: ready ? "Server media verified for shared HLS playout." : `File not found: ${source.path || "unknown path"}`,
      path: ready ? source.path : "",
      updatedAt
    };
    return { id: source.id, title: source.title, type: source.type, ...source.ingest };
  }
  if (source.type === "internet-archive") {
    source.ingest = {
      status: source.fileUrl ? "ready" : "missing",
      message: source.fileUrl ? "Internet Archive media URL is ready for shared HLS playout." : "No playable Internet Archive file URL is attached.",
      path: source.fileUrl || "",
      updatedAt
    };
    return { id: source.id, title: source.title, type: source.type, ...source.ingest };
  }

  const candidates = await discoverAuthorizedMediaCandidates(source);
  source.ingest = {
    status: candidates.length ? "candidates_found" : "needs_media",
    message: candidates.length
      ? `Found ${candidates.length} possible public repository media candidate${candidates.length === 1 ? "" : "s"} for admin review.`
      : "No public repository media candidates found. Provide an authorized server media file before this source can be included in the shared broadcast feed.",
    path: "",
    candidates,
    updatedAt
  };
  return { id: source.id, title: source.title, type: source.type, ...source.ingest };
}

function shouldAutoIngestSource(source, options = {}) {
  if (!source || source.type === "bump") return false;
  const status = source.ingest?.status || "";
  if (status === "ready") return false;
  const updatedAt = Number(source.ingest?.updatedAt || 0);
  if (options.force && status !== "queued" && status !== "checking") return true;
  if (status === "queued" || status === "checking") {
    return !updatedAt || Date.now() - updatedAt > 30000;
  }
  let retryAfter = 0;
  if (status === "missing" || status === "needs_media" || status === "candidates_found") retryAfter = 1000 * 60 * 20;
  if (status === "error") retryAfter = 1000 * 60 * 5;
  return !updatedAt || Date.now() - updatedAt > retryAfter;
}

function queueAutoIngestSourceIds(sourceIds = [], reason = "live queue", options = {}) {
  const now = Date.now();
  let queued = 0;
  for (const sourceId of sourceIds) {
    const source = state.sources.find((item) => item.id === sourceId);
    if (!shouldAutoIngestSource(source, options)) continue;
    if (autoIngestQueued.has(source.id) || autoIngestInFlight.has(source.id)) continue;
    source.ingest = {
      ...(source.ingest || {}),
      status: "queued",
      message: `Queued for automatic ingest from ${reason}.`,
      updatedAt: now
    };
    autoIngestQueued.add(source.id);
    autoIngestQueue.push(source.id);
    queued += 1;
  }
  if (queued) {
    saveState().then(broadcastProgram).catch((error) => console.error("Auto-ingest save failed:", error));
    pumpAutoIngestQueue().catch((error) => console.error("Auto-ingest pump failed:", error));
  }
  return queued;
}

function queueAutoIngestForLiveQueue(reason = "live queue") {
  const now = Date.now();
  const sourceIds = state.liveQueue
    .filter((entry) => entry.startAt + entry.duration * 1000 > now)
    .sort((a, b) => a.startAt - b.startAt)
    .map((entry) => entry.sourceId);
  return queueAutoIngestSourceIds(sourceIds, reason);
}

function pruneAutoIngestQueueToLiveQueue() {
  const now = Date.now();
  const liveSourceIds = new Set(
    state.liveQueue
      .filter((entry) => entry.startAt + entry.duration * 1000 > now)
      .map((entry) => entry.sourceId)
  );
  for (let index = autoIngestQueue.length - 1; index >= 0; index -= 1) {
    if (!liveSourceIds.has(autoIngestQueue[index])) {
      autoIngestQueued.delete(autoIngestQueue[index]);
      autoIngestQueue.splice(index, 1);
    }
  }
}

async function pumpAutoIngestQueue() {
  if (autoIngestPumpActive) return;
  autoIngestPumpActive = true;
  try {
    while (autoIngestInFlight.size < 2 && autoIngestQueue.length) {
      const sourceId = autoIngestQueue.shift();
      autoIngestQueued.delete(sourceId);
      const source = state.sources.find((item) => item.id === sourceId);
      if (!source || source.type === "bump" || source.ingest?.status === "ready") continue;
      autoIngestInFlight.add(sourceId);
      runAutoIngest(sourceId).finally(() => {
        autoIngestInFlight.delete(sourceId);
        pumpAutoIngestQueue().catch((error) => console.error("Auto-ingest pump failed:", error));
      });
    }
  } finally {
    autoIngestPumpActive = false;
  }
}

async function runAutoIngest(sourceId) {
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source || source.type === "bump") return;
  source.ingest = {
    ...(source.ingest || {}),
    status: "checking",
    message: "Automatic ingest is checking this queued source.",
    updatedAt: Date.now()
  };
  await saveState();
  broadcastProgram();
  try {
    await ingestSource(source);
  } catch (error) {
    source.ingest = {
      ...(source.ingest || {}),
      status: "error",
      message: `Automatic ingest failed: ${error.message || "Unknown error."}`,
      updatedAt: Date.now()
    };
  }
  await saveState();
  broadcastProgram();
}

async function ingestSourceById(sourceId) {
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source) throw new Error("Unknown source.");
  const result = await ingestSource(source);
  await saveState();
  broadcastProgram();
  return result;
}

async function ingestSourceLibrary(body) {
  const sources = librarySources(body.folderId);
  const results = await Promise.all(sources.map(ingestSource));
  await saveState();
  broadcastProgram();
  return ingestSummary(results);
}

async function ingestAllSources() {
  const results = await Promise.all(state.sources.filter((source) => source.type !== "bump").map(ingestSource));
  await saveState();
  broadcastProgram();
  return ingestSummary(results);
}

function ingestSummary(results) {
  return {
    ok: true,
    total: results.length,
    ready: results.filter((item) => item.status === "ready").length,
    needsMedia: results.filter((item) => item.status === "needs_media").length,
    candidatesFound: results.filter((item) => item.status === "candidates_found").length,
    missing: results.filter((item) => item.status === "missing").length,
    skipped: results.filter((item) => item.status === "skipped").length,
    results
  };
}

async function discoverAuthorizedMediaCandidates(source) {
  const query = normalizeSearchQuery(`${source.title || ""} ${source.url || ""}`);
  if (query.length < 3) return [];
  const archiveCandidates = await searchInternetArchiveCandidates(query).catch(() => []);
  return archiveCandidates.slice(0, 5);
}

async function searchInternetArchiveCandidates(query) {
  const params = new URLSearchParams({
    q: `mediatype:(movies) AND (${query})`,
    fl: "identifier,title,creator,licenseurl,rights,date,description",
    rows: "6",
    page: "1",
    output: "json"
  });
  const response = await fetch(`https://archive.org/advancedsearch.php?${params}`);
  if (!response.ok) return [];
  const data = await response.json();
  const docs = data?.response?.docs || [];
  const candidateGroups = await Promise.all(docs.map((doc) => internetArchiveFilesForDoc(doc).catch(() => [])));
  return candidateGroups.flat();
}

async function internetArchiveFilesForDoc(doc) {
  const identifier = String(doc.identifier || "");
  if (!identifier) return [];
  const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
  if (!response.ok) return [];
  const metadata = await response.json();
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
      mediaUrl: `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeArchiveFilePath(file.name)}`,
      fileName: file.name,
      format: file.format || "",
      size: Number(file.size || 0)
    }));
}

function playableArchiveFile(file) {
  const name = String(file.name || "");
  const format = String(file.format || "");
  if (/\.(mp4|m4v|mov|webm)$/i.test(name)) return true;
  return /(mpeg4|h\.264|webm|quicktime)/i.test(format) && !/\.(gif|jpg|png|txt|xml|json)$/i.test(name);
}

function encodeArchiveFilePath(fileName) {
  return String(fileName || "").split("/").map((part) => encodeURIComponent(part)).join("/");
}

async function createScheduleLibrary(body) {
  const sources = librarySources(body.folderId);
  if (!sources.length) throw new Error("That source library is empty.");

  let startAt = Date.parse(body.startAt);
  if (!Number.isFinite(startAt)) throw new Error("Enter a valid start time.");

  const entries = [];
  for (const source of sources) {
    const entry = {
      id: crypto.randomUUID(),
      sourceId: source.id,
      title: "",
      startAt,
      duration: source.duration
    };
    entries.push(entry);
    state.schedule.push(entry);
    startAt += source.duration * 1000;
  }
  state.schedule.sort((a, b) => a.startAt - b.startAt);
  cleanSchedule();
  await saveState();
  broadcastProgram();
  return { entries };
}

async function createQueueEntry(body, immediate = false) {
  const source = state.sources.find((item) => item.id === body.sourceId);
  if (!source) throw new Error("Unknown source.");

  const duration = Number(body.duration || source.duration);
  if (!Number.isFinite(duration) || duration < 5) {
    throw new Error("Duration must be at least 5 seconds.");
  }

  const now = Date.now();
  const activeOrFuture = state.liveQueue
    .filter((item) => item.startAt + item.duration * 1000 > now)
    .sort((a, b) => a.startAt - b.startAt);
  const tailEnd = activeOrFuture.reduce((latest, item) => {
    return Math.max(latest, item.startAt + item.duration * 1000);
  }, now);

  const entry = {
    id: crypto.randomUUID(),
    sourceId: source.id,
    title: String(body.title || "").trim(),
    startAt: immediate ? now : tailEnd,
    duration: Math.round(duration),
    queuedAt: now
  };

  state.liveQueue = immediate ? [] : activeOrFuture;
  state.liveQueue.push(entry);
  state.liveQueue.sort((a, b) => a.startAt - b.startAt);
  rebuildLiveQueueTimings();
  await saveState();
  broadcastProgram();
  queueAutoIngestSourceIds([source.id], immediate ? "play immediately" : "live queue", { force: true });
  return entry;
}

async function createQueueLibrary(body) {
  const sources = librarySources(body.folderId);
  if (!sources.length) throw new Error("That source library is empty.");

  const now = Date.now();
  const activeOrFuture = body.immediate
    ? []
    : state.liveQueue
      .filter((item) => item.startAt + item.duration * 1000 > now)
      .sort((a, b) => a.startAt - b.startAt);
  let cursor = activeOrFuture.reduce((latest, item) => {
    return Math.max(latest, item.startAt + item.duration * 1000);
  }, now);
  const entries = [];
  for (const source of sources) {
    const duration = Number(source.duration);
    if (!Number.isFinite(duration) || duration < 5) continue;
    const entry = {
      id: crypto.randomUUID(),
      sourceId: source.id,
      title: "",
      startAt: cursor,
      duration: Math.round(duration),
      queuedAt: now
    };
    entries.push(entry);
    cursor += entry.duration * 1000;
  }
  if (!entries.length) throw new Error("That source library has no playable sources.");

  state.liveQueue = [...activeOrFuture, ...entries].sort((a, b) => a.startAt - b.startAt);
  rebuildLiveQueueTimings();
  await saveState();
  broadcastProgram();
  queueAutoIngestSourceIds(entries.map((entry) => entry.sourceId), body.immediate ? "play-now library" : "queued library", { force: true });
  return { entries };
}

async function queueManualBump(body = {}) {
  const source = createManualBumpSource(body);
  const now = Date.now();
  const activeOrFuture = state.liveQueue
    .filter((item) => item.startAt + item.duration * 1000 > now)
    .sort((a, b) => a.startAt - b.startAt);
  const current = activeOrFuture.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  const tailEnd = activeOrFuture.reduce((latest, item) => Math.max(latest, item.startAt + item.duration * 1000), now);
  const insertAt = body.position === "next" && current ? current.startAt + current.duration * 1000 : tailEnd;
  const entry = {
    id: crypto.randomUUID(),
    sourceId: source.id,
    title: source.title,
    startAt: insertAt,
    duration: source.duration,
    queuedAt: now
  };

  if (body.position === "next") {
    const beforeInsert = activeOrFuture.filter((item) => item.startAt < insertAt);
    const afterInsert = activeOrFuture.filter((item) => item.startAt >= insertAt);
    state.liveQueue = [...beforeInsert, entry, ...afterInsert];
    let cursor = current ? current.startAt + current.duration * 1000 : now;
    state.liveQueue = state.liveQueue.map((item) => {
      if (current && item.id === current.id) return item;
      const updated = { ...item, startAt: cursor };
      cursor += item.duration * 1000;
      return updated;
    });
  } else {
    state.liveQueue = [...activeOrFuture, entry].sort((a, b) => a.startAt - b.startAt);
  }

  state.broadcastMode = "queue";
  rebuildLiveQueueTimings();
  await saveState();
  broadcastProgram();
  return { source, entry };
}

async function clearLiveQueue() {
  state.liveQueue = [];
  state.broadcastMode = "queue";
  pruneAutoIngestQueueToLiveQueue();
  pruneUnusedBumpSources();
  if (!backfillLiveQueue(MIN_QUEUE_VIDEO_ITEMS, { leadingAutoBump: true })) {
    queueStandaloneScheduleBump();
  }
  await saveState();
  broadcastProgram();
  return { ok: true };
}

async function moveQueueEntry(id, direction) {
  const now = Date.now();
  const current = state.liveQueue.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  const pending = state.liveQueue
    .filter((entry) => (!current || entry.id !== current.id) && entry.startAt + entry.duration * 1000 > now)
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && (!isBumpSource(entry.source) || !entry.autoBump))
    .sort((a, b) => a.startAt - b.startAt);

  const index = pending.findIndex((entry) => entry.id === id);
  if (index === -1) throw new Error("That queue item cannot be moved.");

  const offset = direction === "up" ? -1 : direction === "down" ? 1 : 0;
  const targetIndex = index + offset;
  if (!offset || targetIndex < 0 || targetIndex >= pending.length) {
    return { ok: true, moved: false };
  }

  [pending[index], pending[targetIndex]] = [pending[targetIndex], pending[index]];

  let cursor = current ? current.startAt + current.duration * 1000 : now;
  const reordered = current ? [current] : [];
  for (const item of pending) {
    reordered.push({
      id: item.id,
      sourceId: item.sourceId,
      title: item.title || "",
      startAt: cursor,
      duration: item.duration,
      queuedAt: item.queuedAt || now
    });
    cursor += item.duration * 1000;
  }

  state.liveQueue = reordered;
  rebuildLiveQueueTimings();
  await saveState();
  broadcastProgram();
  queueAutoIngestForLiveQueue("queue reorder");
  return { ok: true, moved: true };
}

async function reorderLiveQueue(body) {
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
  const now = Date.now();
  const current = state.liveQueue.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  const pending = state.liveQueue
    .filter((entry) => (!current || entry.id !== current.id) && entry.startAt + entry.duration * 1000 > now)
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && !isBumpSource(entry.source))
    .sort((a, b) => a.startAt - b.startAt);

  const pendingById = new Map(pending.map((entry) => [entry.id, entry]));
  const ordered = ids.filter((id) => pendingById.has(id)).map((id) => pendingById.get(id));
  for (const entry of pending) {
    if (!ordered.some((item) => item.id === entry.id)) ordered.push(entry);
  }

  let cursor = current ? current.startAt + current.duration * 1000 : now;
  const reordered = current ? [current] : [];
  for (const item of ordered) {
    reordered.push({
      id: item.id,
      sourceId: item.sourceId,
      title: item.title || "",
      startAt: cursor,
      duration: item.duration,
      queuedAt: item.queuedAt || now
    });
    cursor += item.duration * 1000;
  }

  state.liveQueue = reordered;
  rebuildLiveQueueTimings();
  await saveState();
  broadcastProgram();
  queueAutoIngestForLiveQueue("queue reorder");
  return { ok: true };
}

async function setBroadcastMode(body) {
  const mode = body.mode === "queue" ? "queue" : "scheduled";
  state.broadcastMode = mode;
  await saveState();
  broadcastProgram();
  if (mode === "queue") queueAutoIngestForLiveQueue("broadcast mode switch");
  return { mode };
}

async function triggerBroadcastFx(body = {}) {
  const id = String(body.id || "").trim();
  const preset = FX_PRESETS[id];
  if (!preset) throw new Error("Unknown FX button.");
  const maxDuration = ["av-warp", "delay", "source-overlay", "playlist-audio", "visual-adjust", "theme-cycle"].includes(id) ? 180 : 30;
  const duration = Math.max(2, Math.min(maxDuration, Number(body.duration || preset.duration)));
  const now = Date.now();
  const commandFx = new Set([
    "looper-capture",
    "looper-layer-1",
    "looper-layer-2",
    "looper-layer-3",
    "looper-bpm-down",
    "looper-bpm-up",
    "looper-config",
    "looper-clear",
    "seed-skip",
    "delay",
    "source-overlay",
    "playlist-audio",
    "visual-adjust",
    "theme-random"
  ]);
  const active = activeBroadcastFx();
  let params = typeof body.params === "object" && body.params ? body.params : {};
  if (id === "source-overlay") {
    const source = state.sources.find((item) => item.id === params.sourceId);
    if (!source || source.type === "bump") throw new Error("Choose a valid source to overlay.");
    params = {
      ...params,
      source: {
        id: source.id,
        title: source.title,
        type: source.type,
        url: source.url,
        youtubeId: source.youtubeId,
        archiveId: source.archiveId,
        archiveFile: source.archiveFile,
        fileUrl: source.fileUrl,
        path: source.path,
        duration: source.duration
      }
    };
  }
  if (id === "playlist-audio") {
    const playlist = await loadYouTubePlaylist(CHAOS_AUDIO_PLAYLIST_ID);
    if (!playlist.videos.length) throw new Error("No public videos were found in that audio playlist.");
    const video = playlist.videos[Math.floor(Math.random() * playlist.videos.length)];
    params = {
      playlistId: CHAOS_AUDIO_PLAYLIST_ID,
      youtubeId: video.youtubeId,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
      duration: video.duration
    };
  }
  if (id === "theme-random") {
    const themes = ["woodsy", "mountain", "deep-ocean", "rainforest", "frutiger-aero", "aero-lime", "aero-sunset", "candy-static", "terminal-green", "hotdog-stand", "midnight-laundromat", "mall-kiosk"];
    params = { ...params, theme: themes[Math.floor(Math.random() * themes.length)] };
  }
  if (id === "theme-aero-blast") {
    params = { ...params, theme: "frutiger-aero" };
  }
  if (id === "delay" && params.enabled === false) {
    state.activeFx = active.filter((item) => item.id !== "delay");
    await saveState();
    broadcastProgram();
    return { ok: true, fx: state.activeFx };
  }
  const existing = commandFx.has(id) ? null : active.find((item) => item.id === id);
  if (existing) {
    const continuousFx = new Set(["av-warp", "delay", "visual-adjust"]);
    existing.level = continuousFx.has(id) ? Math.max(1, Number(preset.level || 1)) : Math.min(8, Number(existing.level || preset.level || 1) + 1);
    existing.hits = Number(existing.hits || 1) + 1;
    existing.startedAt = now;
    existing.expiresAt = Math.min(now + 120000, Math.max(existing.expiresAt, now) + duration * 1000);
    existing.seed = crypto.randomUUID();
    existing.params = params ? { ...existing.params, ...params } : existing.params || {};
    await saveState();
    broadcastProgram();
    return { ok: true, fx: state.activeFx };
  }
  const fx = {
    id,
    label: preset.label,
    startedAt: now,
    expiresAt: id === "delay" && params.enabled === true ? null : now + duration * 1000,
    seed: crypto.randomUUID(),
    level: Math.max(1, Number(preset.level || 1)),
    hits: 1,
    params
  };
  state.activeFx = [...active.filter((item) => item.id !== id), fx].slice(-8);
  await saveState();
  broadcastProgram();
  return { ok: true, fx: state.activeFx };
}

async function clearBroadcastFx() {
  state.activeFx = [];
  await saveState();
  broadcastProgram();
  return { ok: true };
}

async function removeItem(collection, id) {
  const before = state[collection].length;
  state[collection] = state[collection].filter((item) => item.id !== id);
  if (collection === "sourceFolders") {
    state.sources = state.sources.map((source) => (source.folderId === id ? { ...source, folderId: "" } : source));
  }
  if (collection === "liveQueue") {
    rebuildLiveQueueTimings();
    pruneAutoIngestQueueToLiveQueue();
  }
  await saveState();
  broadcastProgram();
  return before !== state[collection].length;
}

async function serveFile(req, res, baseDir, urlPrefix = "") {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const decoded = decodeURIComponent(url.pathname.slice(urlPrefix.length));
  const requested = decoded === "/" || decoded === "" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(baseDir, requested));
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      ...(baseDir === HLS_DIR || [".html", ".js", ".css"].includes(ext)
        ? { "cache-control": "no-cache, no-store, must-revalidate" }
        : {})
    });
    createReadStream(filePath).pipe(res);
  } catch {
    if (baseDir === PUBLIC_DIR) {
      const indexPath = path.join(PUBLIC_DIR, "index.html");
      res.writeHead(200, { "content-type": mimeTypes[".html"] });
      createReadStream(indexPath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
  }
}

async function handleApi(req, res, pathname) {
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        serverTime: Date.now(),
        mode: state.broadcastMode,
        queueLength: state.liveQueue.length,
        scheduleLength: state.schedule.length,
        stream: {
          url: "/stream/live.m3u8",
          status: hlsPlayout.status,
          error: hlsPlayout.error
        }
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/stream-debug") {
      sendJson(res, 200, await streamDebug());
      return;
    }

    if (req.method === "GET" && pathname === "/api/program") {
      sendJson(res, 200, publicProgram());
      return;
    }

    if (req.method === "GET" && pathname === "/api/youtube-info") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, await getYouTubeInfo(url.searchParams.get("url")));
      return;
    }

    if (req.method === "GET" && pathname === "/api/internet-archive-info") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, await getInternetArchiveInfo(url.searchParams.get("url"), url.searchParams.get("file")));
      return;
    }

    if (req.method === "GET" && pathname === "/api/internet-archive-search") {
      if (!requireAdmin(req, res)) return;
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, {
        results: await searchInternetArchiveSources(url.searchParams.get("q"), url.searchParams.get("rows"))
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive"
      });
      res.write(`data: ${JSON.stringify(publicProgram())}\n\n`);
      sseClients.add(res);
      req.on("close", () => sseClients.delete(res));
      return;
    }

    if (req.method === "GET" && pathname === "/api/chat") {
      sendJson(res, 200, publicChat());
      return;
    }

    if (req.method === "GET" && pathname === "/api/chat/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive"
      });
      res.write(`data: ${JSON.stringify(publicChat())}\n\n`);
      chatClients.add(res);
      req.on("close", () => chatClients.delete(res));
      return;
    }

    if (req.method === "POST" && pathname === "/api/chat") {
      const session = requireSession(req, res);
      if (!session) return;
      const message = await createChatMessage(req, await readJson(req));
      sendJson(res, 201, message);
      return;
    }

    if (req.method === "POST" && pathname === "/api/login") {
      const body = await readJson(req);
      const login = String(body.username || "").trim();
      const password = String(body.password || "");

      const admin = ADMIN_ACCOUNTS.find((account) => login === account.username && password === account.password);
      if (admin) {
        createSession(res, { username: admin.username, role: "admin" });
        sendJson(res, 200, { ok: true, user: { username: admin.username, role: "admin" } });
        return;
      }

      const user = state.users.find(
        (item) => item.username.toLowerCase() === login.toLowerCase() || item.email === login.toLowerCase()
      );
      if (!user || !verifyPassword(password, user.passwordHash)) {
        sendJson(res, 401, { error: "Invalid username, email, or password." });
        return;
      }
      createSession(res, { username: user.username, role: user.role, userId: user.id });
      sendJson(res, 200, { ok: true, user: { username: user.username, role: user.role } });
      return;
    }

    if (req.method === "POST" && pathname === "/api/register") {
      const user = await registerUser(await readJson(req));
      createSession(res, { username: user.username, role: user.role, userId: user.id });
      sendJson(res, 201, { ok: true, user: { username: user.username, role: user.role } });
      return;
    }

    if (req.method === "GET" && pathname === "/api/me") {
      sendJson(res, 200, { user: publicUser(getSession(req)) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/logout") {
      const token = parseCookies(req).doink_session;
      if (token) sessions.delete(token);
      res.setHeader("set-cookie", "doink_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, {
        user: publicUser(getSession(req)),
        sourceFolders: state.sourceFolders,
        sources: state.sources,
        schedule: state.schedule,
        liveQueue: state.liveQueue,
        broadcastMode: state.broadcastMode,
        bumpMusic: state.bumpMusic
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/source-folders") {
      if (!requireAdmin(req, res)) return;
      const folder = await createSourceFolder(await readJson(req));
      sendJson(res, 201, folder);
      return;
    }

    if (req.method === "POST" && pathname === "/api/import-youtube-playlist") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await importYouTubePlaylist(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/import-internet-archive-collection") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await importInternetArchiveCollection(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/sources") {
      if (!requireAdmin(req, res)) return;
      const source = await createSource(await readJson(req));
      broadcastProgram();
      sendJson(res, 201, source);
      return;
    }

    if (req.method === "PATCH" && pathname === "/api/sources/reorder") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await reorderLibrarySources(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/ingest/all") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await ingestAllSources());
      return;
    }

    if (req.method === "POST" && pathname === "/api/ingest/library") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await ingestSourceLibrary(await readJson(req)));
      return;
    }

    const ingestSourceMatch = pathname.match(/^\/api\/ingest\/sources\/([^/]+)$/);
    if (req.method === "POST" && ingestSourceMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await ingestSourceById(ingestSourceMatch[1]));
      return;
    }

    const updateSourceMatch = pathname.match(/^\/api\/sources\/([^/]+)$/);
    if (req.method === "PATCH" && updateSourceMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateSource(updateSourceMatch[1], await readJson(req)));
      return;
    }

    const updateSourceFolderMatch = pathname.match(/^\/api\/source-folders\/([^/]+)$/);
    if (req.method === "PATCH" && updateSourceFolderMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateSourceFolder(updateSourceFolderMatch[1], await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/schedule") {
      if (!requireAdmin(req, res)) return;
      const entry = await createScheduleEntry(await readJson(req), false);
      sendJson(res, 201, entry);
      return;
    }

    if (req.method === "POST" && pathname === "/api/schedule-library") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await createScheduleLibrary(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/play-now") {
      if (!requireAdmin(req, res)) return;
      const body = await readJson(req);
      state.broadcastMode = "queue";
      const entry = await createQueueEntry(body, true);
      sendJson(res, 201, entry);
      return;
    }

    if (req.method === "POST" && pathname === "/api/play-now-library") {
      if (!requireAdmin(req, res)) return;
      state.broadcastMode = "queue";
      sendJson(res, 201, await createQueueLibrary({ ...(await readJson(req)), immediate: true }));
      return;
    }

    if (req.method === "POST" && pathname === "/api/queue") {
      if (!requireAdmin(req, res)) return;
      const entry = await createQueueEntry(await readJson(req), false);
      sendJson(res, 201, entry);
      return;
    }

    if (req.method === "POST" && pathname === "/api/queue-library") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await createQueueLibrary(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/queue-bump") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await queueManualBump(await readJson(req)));
      return;
    }

    if (req.method === "DELETE" && pathname === "/api/queue") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await clearLiveQueue());
      return;
    }

    const moveQueueMatch = pathname.match(/^\/api\/queue\/([^/]+)\/move$/);
    if (req.method === "PATCH" && moveQueueMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await moveQueueEntry(moveQueueMatch[1], (await readJson(req)).direction));
      return;
    }

    if (req.method === "PATCH" && pathname === "/api/queue/reorder") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await reorderLiveQueue(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/broadcast-mode") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await setBroadcastMode(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/fx") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await triggerBroadcastFx(await readJson(req)));
      return;
    }

    if (req.method === "DELETE" && pathname === "/api/fx") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await clearBroadcastFx());
      return;
    }

    const deleteMatch = pathname.match(/^\/api\/(sources|schedule|queue|source-folders)\/([^/]+)$/);
    if (req.method === "DELETE" && deleteMatch) {
      if (!requireAdmin(req, res)) return;
      const [, type, id] = deleteMatch;
      const collection = type === "source-folders" ? "sourceFolders" : type === "queue" ? "liveQueue" : type;
      const removed = await removeItem(collection, id);
      sendJson(res, removed ? 200 : 404, { ok: removed });
      return;
    }

    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Request failed." });
  }
}

await ensureState();
await refreshBumpMusic();
if (ensureAutoBumpAudioStarts()) await saveState();
queueAutoIngestForLiveQueue("server startup");
syncHlsPlayout().catch((error) => {
  hlsPlayout.status = "error";
  hlsPlayout.error = error.message;
});
setInterval(broadcastProgram, 1000);
setInterval(() => syncHlsPlayout().catch((error) => {
  hlsPlayout.status = "error";
  hlsPlayout.error = error.message;
}), 1000);
setInterval(flushTimelineSave, 1000);
setInterval(() => {
  queueAutoIngestForLiveQueue("live queue maintenance");
}, 15000);
setInterval(async () => {
  cleanSchedule();
  maintainBroadcastTimeline();
  queueAutoIngestForLiveQueue("live queue maintenance");
  await pruneHlsDirectory();
  await flushTimelineSave();
  await saveState();
}, 1000 * 60 * 5);

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url.pathname);
    return;
  }
  if (url.pathname.startsWith("/bumpgenerator")) {
    await serveFile(req, res, BUMP_GENERATOR_DIR, "/bumpgenerator");
    return;
  }
  if (url.pathname.startsWith("/stream/")) {
    await serveFile(req, res, HLS_DIR, "/stream");
    return;
  }
  if (url.pathname.startsWith("/media/")) {
    await serveFile(req, res, MEDIA_DIR, "/media");
    return;
  }
  await serveFile(req, res, PUBLIC_DIR);
}).listen(PORT, () => {
  console.log(`DoinkTV is live at http://localhost:${PORT}`);
});
