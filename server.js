import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat, readdir } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, "data");
const MEDIA_DIR = path.join(__dirname, "media");
const BUMP_MUSIC_DIR = path.join(MEDIA_DIR, "bump-music");
const PUBLIC_DIR = path.join(__dirname, "public");
const BUMP_GENERATOR_DIR = path.join(__dirname, "..", "BumpGenerator");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const AUTO_BUMP_INTERVAL_MS = 1000 * 60 * 3;
const AUTO_BUMP_DURATION = 10;

const ADMIN_USER = process.env.ADMIN_USER || "DoinkWizard";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChipTanaka12!@";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const sessions = new Map();
const sseClients = new Set();
const chatClients = new Set();
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
  nowPlaying: null
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v"
};

async function ensureState() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MEDIA_DIR, { recursive: true });
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
  if (username.toLowerCase() === ADMIN_USER.toLowerCase()) throw new Error("That username is reserved.");
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
  const title = String(body.folderName || "").trim() || findPlaylistTitle(initialData) || `YouTube playlist ${playlistId}`;
  const videos = collectPlaylistVideos(initialData);
  const uniqueVideos = [...new Map(videos.map((video) => [video.youtubeId, video])).values()];
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
      url: `https://www.youtube.com/watch?v=${video.youtubeId}`
    });
    imported += 1;
  }

  await saveState();
  broadcastProgram();
  return { folder, imported, skipped };
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

function publicProgram() {
  const now = Date.now();
  const entries = activeBroadcastEntries()
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && Number.isFinite(entry.startAt) && Number.isFinite(entry.duration))
    .sort((a, b) => a.startAt - b.startAt);

  const live = entries.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  const next = entries.find((entry) => entry.startAt > now);

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

function upcomingNormalQueueItems(startAt, count = 3) {
  return state.liveQueue
    .filter((entry) => entry.startAt >= startAt)
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && !isBumpSource(entry.source))
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

function createAutoBumpSource(afterEntryEnd) {
  const upcoming = upcomingNormalQueueItems(afterEntryEnd, 3);
  const lines = upcoming.length
    ? upcoming.map((entry) => ({
        title: entry.title || entry.source.title,
        time: formatEstTime(entry.startAt)
      }))
    : [{ title: "More DoinkTV shortly", time: formatEstTime(afterEntryEnd) }];
  const visuals = randomAutoBumpVisuals();

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
      audio: randomBumpMusicPath()
    },
    generatedAt: Date.now()
  };
  state.sources.push(source);
  return source;
}

function randomBumpMusicPath() {
  return state.bumpMusic?.length ? state.bumpMusic[Math.floor(Math.random() * state.bumpMusic.length)].path : "";
}

async function refreshBumpMusic() {
  await mkdir(BUMP_MUSIC_DIR, { recursive: true });
  const files = await readdir(BUMP_MUSIC_DIR, { withFileTypes: true });
  state.bumpMusic = files
    .filter((file) => file.isFile() && /\.(mp3|wav|ogg|m4a)$/i.test(file.name))
    .map((file) => ({
      name: file.name.replace(/\.[^/.]+$/, ""),
      path: `/media/bump-music/${encodeURIComponent(file.name).replace(/%2F/g, "/")}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function rebuildLiveQueueTimings({ insertAutoBumps = true } = {}) {
  const now = Date.now();
  const queue = state.liveQueue
    .filter((entry) => entry.startAt + entry.duration * 1000 > now || entry.startAt >= now)
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source)
    .sort((a, b) => a.startAt - b.startAt);

  const current = queue.find((entry) => now >= entry.startAt && now < entry.startAt + entry.duration * 1000);
  let cursor = current ? current.startAt + current.duration * 1000 : now;
  let normalSecondsSinceBump = current && !isBumpSource(current.source) ? Math.max(0, (now - current.startAt) / 1000) : 0;
  const rebuilt = current ? [stripQueueSource(current)] : [];
  const pending = queue.filter((entry) => !current || entry.id !== current.id).filter((entry) => entry.startAt + entry.duration * 1000 > now);

  for (const item of pending) {
    if (isBumpSource(item.source)) continue;
    const normalEntry = {
      id: item.id,
      sourceId: item.sourceId,
      title: item.title || "",
      startAt: cursor,
      duration: item.duration,
      queuedAt: item.queuedAt || now
    };
    rebuilt.push(normalEntry);
    cursor += item.duration * 1000;
    normalSecondsSinceBump += item.duration;

    if (insertAutoBumps && normalSecondsSinceBump >= AUTO_BUMP_INTERVAL_MS / 1000) {
      const bumpSource = createAutoBumpSource(cursor);
      rebuilt.push({
        id: crypto.randomUUID(),
        sourceId: bumpSource.id,
        title: bumpSource.title,
        startAt: cursor,
        duration: AUTO_BUMP_DURATION,
        queuedAt: now,
        autoBump: true
      });
      cursor += AUTO_BUMP_DURATION * 1000;
      normalSecondsSinceBump = 0;
    }
  }

  state.liveQueue = rebuilt;
  pruneUnusedBumpSources();
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

function publicChat() {
  return {
    serverTime: Date.now(),
    messages: state.chat.slice(-80)
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
  const type = body.type === "local" ? "local" : "youtube";
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
    duration: Math.round(duration)
  };

  if (type === "youtube") {
    const youtubeId = normalizeYouTubeId(body.youtube || body.url);
    if (!youtubeId) throw new Error("Enter a valid YouTube URL or video ID.");
    source.youtubeId = youtubeId;
    source.url = `https://www.youtube.com/watch?v=${youtubeId}`;
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
    createdAt: Date.now()
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
    createdAt: Date.now()
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

  await saveState();
  broadcastProgram();
  return source;
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
  return entry;
}

async function createQueueLibrary(body) {
  const sources = librarySources(body.folderId);
  if (!sources.length) throw new Error("That source library is empty.");

  const entries = [];
  for (const source of sources) {
    entries.push(await createQueueEntry({ sourceId: source.id, duration: source.duration }, false));
  }
  return { entries };
}

async function clearLiveQueue() {
  state.liveQueue = [];
  pruneUnusedBumpSources();
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
    .filter((entry) => entry.source && !isBumpSource(entry.source))
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
  return { ok: true, moved: true };
}

async function setBroadcastMode(body) {
  const mode = body.mode === "queue" ? "queue" : "scheduled";
  state.broadcastMode = mode;
  await saveState();
  broadcastProgram();
  return { mode };
}

async function removeItem(collection, id) {
  const before = state[collection].length;
  state[collection] = state[collection].filter((item) => item.id !== id);
  if (collection === "sourceFolders") {
    state.sources = state.sources.map((source) => (source.folderId === id ? { ...source, folderId: "" } : source));
  }
  if (collection === "liveQueue") {
    rebuildLiveQueueTimings();
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
    res.writeHead(200, { "content-type": mimeTypes[ext] || "application/octet-stream" });
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
    if (req.method === "GET" && pathname === "/api/program") {
      sendJson(res, 200, publicProgram());
      return;
    }

    if (req.method === "GET" && pathname === "/api/youtube-info") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, await getYouTubeInfo(url.searchParams.get("url")));
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

      if (login === ADMIN_USER && password === ADMIN_PASSWORD) {
        createSession(res, { username: ADMIN_USER, role: "admin" });
        sendJson(res, 200, { ok: true, user: { username: ADMIN_USER, role: "admin" } });
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

    if (req.method === "POST" && pathname === "/api/sources") {
      if (!requireAdmin(req, res)) return;
      const source = await createSource(await readJson(req));
      broadcastProgram();
      sendJson(res, 201, source);
      return;
    }

    const updateSourceMatch = pathname.match(/^\/api\/sources\/([^/]+)$/);
    if (req.method === "PATCH" && updateSourceMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateSource(updateSourceMatch[1], await readJson(req)));
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

    if (req.method === "POST" && pathname === "/api/broadcast-mode") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await setBroadcastMode(await readJson(req)));
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
setInterval(broadcastProgram, 1000);
setInterval(async () => {
  cleanSchedule();
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
  if (url.pathname.startsWith("/media/")) {
    await serveFile(req, res, MEDIA_DIR, "/media");
    return;
  }
  await serveFile(req, res, PUBLIC_DIR);
}).listen(PORT, () => {
  console.log(`DoinkTV is live at http://localhost:${PORT}`);
});
