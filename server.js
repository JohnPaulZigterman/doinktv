import { createServer } from "node:http";
import { readFile, mkdir, stat, readdir, rm } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import {
  COMMUNITY_DEFAULTS,
  activeCommunityCrew as domainActiveCommunityCrew,
  createCommunitySuggestion as domainCreateCommunitySuggestion,
  normalizeCommunityState,
  publicCommunity as domainPublicCommunity,
  sessionSupporterTier as domainSessionSupporterTier,
  supporterTierById as domainSupporterTierById,
  updateCommunitySettings as domainUpdateCommunitySettings,
  updateCommunitySuggestion as domainUpdateCommunitySuggestion,
  updateSupporterTier as domainUpdateSupporterTier
} from "./lib/community.js";
import { createWeeklyBlockBumpSource as factoryCreateWeeklyBlockBumpSource } from "./lib/bump-factory.js";
import {
  blockIdentityPackFor as domainBlockIdentityPackFor,
  continuityBrain as domainContinuityBrain,
  normalizeContinuityLog,
  publicContinuityLog as domainPublicContinuityLog,
  recordContinuityEvent as domainRecordContinuityEvent
} from "./lib/continuity.js";
import {
  normalizeLoreState,
  publicLore as domainPublicLore,
  upsertLoreEntry as domainUpsertLoreEntry
} from "./lib/lore.js";
import { createHlsPlayoutController } from "./lib/hls-playout.js";
import * as mediaDiscovery from "./lib/media-discovery.js";
import { createProgramVotingController } from "./lib/program-voting.js";
import {
  loadStationState,
  programmingDomainView,
  saveStationState,
  stationStateDefaults
} from "./lib/station-state.js";
import {
  activeBroadcastEntries as engineActiveBroadcastEntries,
  entriesOverlap as engineEntriesOverlap,
  entryEnd as engineEntryEnd,
  entryReason as engineEntryReason,
  isAudienceScheduleEntry as engineIsAudienceScheduleEntry,
  isBumpSource as engineIsBumpSource,
  nextPlayoutProgram as engineNextPlayoutProgram,
  plannedGapFillWindow,
  planLongformContinuityBreaks,
  planTimedBumpInsertion,
  planWeatherBumpTargets,
  protectOverrideEntryAgainstSchedule,
  queueProtectionSummary,
  resolveBroadcastTimeline,
  shouldUseGapFillerBump,
  weatherBumpEntries as engineWeatherBumpEntries
} from "./lib/programming-engine.js";
import {
  activeBroadcastFx as domainActiveBroadcastFx,
  beginFxDecay,
  createFxEntry,
  fxInstrument,
  fxMaxDuration,
  intensifyFxEntry,
  isFxCommand,
  isFxToggle,
  normalizeFxSnapshots,
  publicFxInstruments
} from "./lib/live-fx.js";
import {
  scheduleSourcesIntoWeeklyBlock,
  weeklyBlockStarts as domainWeeklyBlockStarts
} from "./lib/weekly-scheduler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DOINK_DATA_DIR || path.join(__dirname, "data");
const MEDIA_DIR = process.env.DOINK_MEDIA_DIR || path.join(__dirname, "media");
const BUMP_MUSIC_DIR = path.join(MEDIA_DIR, "bump-music");
const DJ_SOUNDBOARD_DIR = path.join(MEDIA_DIR, "dj-soundboard");
const DJ_SOUNDBOARD_MANIFEST = path.join(DJ_SOUNDBOARD_DIR, "manifest.json");
const BUMP_BACKGROUND_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp|mp4|mov|m4v|webm)$/i;
const BUMP_PREVIEW_VIDEO_EXTENSIONS = /\.(mp4|mov|m4v|webm|mkv|avi|ogv|ogg)$/i;
const HLS_DIR = process.env.DOINK_HLS_DIR || path.join(DATA_DIR, "hls");
const PUBLIC_DIR = path.join(__dirname, "public");
const VENDORED_BUMP_GENERATOR_DIR = path.join(__dirname, "vendor", "BumpGenerator");
const BUMP_GENERATOR_DIR = process.env.BUMP_GENERATOR_DIR
  || (existsSync(VENDORED_BUMP_GENERATOR_DIR) ? VENDORED_BUMP_GENERATOR_DIR : path.join(__dirname, "..", "BumpGenerator"));
const STARTER_STATE_PATH = path.join(DATA_DIR, "state.json");
const STATE_PATH = process.env.DOINK_STATE_PATH || path.join(DATA_DIR, "runtime", "state.json");
const HLS_HANDOFF_LEAD_MS = 2400;
const AUTO_BUMP_INTERVAL_MS = 1000 * 60 * 3;
const AUTO_BUMP_DURATION = 20;
const WEATHER_BUMP_INTERVAL_MS = 1000 * 60 * 45;
const WEATHER_BUMP_MIN_GAP_MS = 1000 * 60 * 20;
const WEATHER_BUMP_LOOKAHEAD_MS = 1000 * 60 * 60 * 5;
const WEATHER_BUMP_DURATION = 34;
const WEATHER_BUMP_VERSION = 2;
const BLOCK_BUMP_DURATION = 16;
const GAP_FILLER_MIN_GAP_SECONDS = 20;
const GAP_FILLER_LOOKAHEAD_MS = 1000 * 60 * 90;
const GAP_FILLER_MIN_SOURCE_SECONDS = 8;
const GAP_FILLER_MAX_SOURCE_SECONDS = 210;
const GAP_FILLER_BUMP_DURATION = 42;
const GAP_FILLER_PROMO_DURATION = 30;
const GAP_FILLER_PROMO_LINEUP_COUNT = 4;
const GAP_FILLER_MAX_ENTRIES = 48;
const GAP_FILLER_BLOCK_NAME = "STATION BREAK";
const GAP_FILLER_VERSION = 9;
const FADE_BREAK_MIN_SECONDS = 60 * 5.5;
const FADE_BREAK_MIN_SOURCE_DURATION = 60 * 12;
const FADE_BREAK_MIN_REMAINING_SECONDS = 60 * 4;
const FADE_BREAK_SCAN_SECONDS = 60 * 58;
const FADE_BREAK_BUMP_DURATION = 18;
const FADE_BREAK_MAX_CONCURRENT_PROBES = 2;
const LONGFORM_BREAK_MIN_PROGRAM_SECONDS = 60 * 24;
const LONGFORM_BREAK_FIRST_AFTER_SECONDS = 60 * 8;
const LONGFORM_BREAK_MIN_SPACING_SECONDS = 60 * 17;
const LONGFORM_BREAK_END_GUARD_SECONDS = 60 * 6;
const LONGFORM_BREAK_MAX_PER_ENTRY = 3;
const LONGFORM_BREAK_CLUSTER_MAX_SECONDS = 44;
const LONGFORM_BREAK_PLAN_VERSION = 2;
const BUMP_SUPPORTED_EFFECTS = new Set(["noise", "vhs", "scanlines", "chromatic", "flicker", "letterbox"]);
const BUMP_GLITCH_EFFECTS = new Set(["noise", "flicker"]);
const BUMP_CLEAN_EFFECTS = ["scanlines", "letterbox", "vhs", "chromatic"];
const BUMP_INTENTIONAL_GLITCH_EFFECTS = ["noise", "vhs", "scanlines", "chromatic", "flicker", "letterbox"];
const BUMP_MUSIC_ARTIST = "Doink Wizard";
const BUMP_PRODUCTION_STYLES = new Set(["standard", "promo-card", "schedule-card", "lower-third", "split-card"]);
const BUMP_PRODUCTION_ACCENTS = new Set(["auto", "hot", "cool", "signal", "mono"]);
const MIN_QUEUE_VIDEO_ITEMS = 5;
const CHAOS_AUDIO_PLAYLIST_ID = "PLWL3FzHaRRMkQqUhks8Y9l35rqY_kKCto";
const WEEKLY_SCHEDULE_LOOKAHEAD_DAYS = 8;
const WEEKLY_ARCHIVE_IMPORT_LIMIT = 12;
const WEEKLY_BLOCKS = [
  {
    id: "the-fridge",
    name: "THE FRIDGE",
    folderName: "Weekly - THE FRIDGE",
    days: [1, 2, 3, 4],
    time: "20:00",
    durationMinutes: 180,
    minDuration: 45,
    queries: [
      "independent animation cartoon sketch comedy",
      "animated short comedy cartoon",
      "internet animation anthology cartoon",
      "public access comedy sketch animation"
    ]
  },
  {
    id: "retro-block",
    name: "RETRO BLOCK",
    folderName: "Weekly - RETRO BLOCK",
    days: [5],
    time: "20:00",
    durationMinutes: 180,
    minDuration: 120,
    queries: [
      "classic animation public domain cartoon",
      "looney tunes public domain cartoon",
      "popeye public domain cartoon",
      "retro science fiction television movie"
    ]
  },
  {
    id: "saturday-morning-cartoons",
    name: "SATURDAY MORNING CARTOONS",
    folderName: "Weekly - SATURDAY MORNING CARTOONS",
    days: [6],
    time: "08:00",
    durationMinutes: 240,
    minDuration: 45,
    queries: [
      "saturday morning cartoons public domain",
      "classic cartoons public domain",
      "cartoon anthology animation",
      "vintage animation children television"
    ]
  },
  {
    id: "sunday-morning-cartoons",
    name: "SUNDAY MORNING CARTOONS",
    folderName: "Weekly - SUNDAY MORNING CARTOONS",
    days: [0],
    time: "08:00",
    durationMinutes: 180,
    minDuration: 45,
    queries: [
      "sunday morning cartoons public domain",
      "classic cartoon collection public domain",
      "vintage animation cartoon anthology",
      "family cartoons animation archive"
    ]
  },
  {
    id: "de-coffeeschoop",
    name: "DE COFFEESCHOOP",
    folderName: "Weekly - DE COFFEESCHOOP",
    days: [0],
    time: "11:00",
    durationMinutes: 180,
    minDuration: 90,
    queries: [
      "public domain music video",
      "creative commons music video",
      "live music performance archive",
      "full album video creative commons"
    ]
  },
  {
    id: "toonski",
    name: "TOONSKI",
    folderName: "Weekly - TOONSKI",
    days: [0],
    time: "18:00",
    durationMinutes: 240,
    minDuration: 600,
    requireAny: ["anime", "animation", "animated", "action", "sci-fi", "space", "robot", "mecha", "toonami"],
    queries: [
      "90s action anime ova",
      "classic anime action sci fi",
      "retro mecha anime ova",
      "space adventure animation anime",
      "animated action anthology"
    ]
  },
  {
    id: "music-box",
    name: "MUSIC BOX",
    folderName: "Weekly - MUSIC BOX",
    days: [1, 3, 5],
    time: "16:00",
    durationMinutes: 120,
    minDuration: 90,
    requireAny: ["music", "song", "band", "live", "concert", "performance", "video", "album"],
    queries: [
      "music video creative commons",
      "independent music video",
      "public access music performance",
      "experimental music video"
    ]
  },
  {
    id: "daytime-talk-shows",
    name: "DAYTIME TALK SHOWS",
    folderName: "Weekly - DAYTIME TALK SHOWS",
    days: [1, 2, 3, 4, 5],
    time: "13:00",
    durationMinutes: 90,
    minDuration: 600,
    requireAny: ["talk", "interview", "show", "conversation", "episode"],
    queries: [
      "public access talk show",
      "community television interview",
      "local access television talk",
      "archive talk show interview"
    ]
  },
  {
    id: "late-night-talk-shows",
    name: "LATE NIGHT TALK SHOWS",
    folderName: "Weekly - LATE NIGHT TALK SHOWS",
    days: [1, 2, 3, 4, 5],
    time: "23:30",
    durationMinutes: 120,
    minDuration: 600,
    requireAny: ["talk", "show", "comedy", "interview", "space ghost", "cartoon planet"],
    queries: [
      "late night talk show public access",
      "space ghost coast to coast",
      "public access comedy talk show",
      "weird talk show archive"
    ]
  },
  {
    id: "late-night-anime",
    name: "LATE NIGHT ANIME",
    folderName: "Weekly - LATE NIGHT ANIME",
    days: [0, 1, 2, 3, 4, 5, 6],
    time: "02:00",
    durationMinutes: 180,
    minDuration: 600,
    requireAny: ["anime", "animation", "animated", "ova", "cel", "manga"],
    queries: [
      "1990s anime ova cel animation",
      "90s anime cel animation",
      "classic anime ova 1990s",
      "retro anime cel animation"
    ]
  },
  {
    id: "cereal-ova-club",
    name: "CEREAL OVA CLUB",
    folderName: "Weekly - CEREAL OVA CLUB",
    days: [1, 2, 3, 4, 5],
    time: "06:00",
    durationMinutes: 180,
    minDuration: 600,
    maxYear: 1993,
    requireAny: ["anime", "animation", "animated", "ova", "manga", "japan", "japanese"],
    queries: [
      "classic anime ova 1980s",
      "vintage anime ova",
      "early 90s anime ova",
      "retro japanese animation"
    ]
  }
];

const WEEKLY_BLOCK_IDENTITIES = {
  "station-break": {
    heading: "STATION BREAK",
    taglines: ["no dead air, only strange air", "the schedule is changing reels", "do not adjust the house"],
    scheme: "warning",
    shapes: "stripes",
    effects: ["scanlines", "letterbox"],
    alignment: "left",
    placement: "middle",
    tone: "caption",
    fontSize: 50,
    creditText: "DOINKTV CONTINUITY DEPT."
  },
  "the-fridge": {
    heading: "THE FRIDGE",
    taglines: ["prime time cartoons, sketches, and questionable leftovers", "open the door, lose the plot", "cold cuts from the animated shelf"],
    scheme: "candy",
    shapes: "memphis",
    effects: ["vhs", "chromatic", "flicker"],
    alignment: "left",
    placement: "middle",
    tone: "caption",
    fontSize: 54,
    creditText: "DOINKTV AFTER-DINNER STATIC"
  },
  "retro-block": {
    heading: "RETRO BLOCK",
    taglines: ["old reels, weird signals, familiar dust", "broadcast fossils reanimated", "yesterday's future, badly tuned"],
    scheme: "broadcast",
    shapes: "checkerboard",
    effects: ["scanlines", "vhs", "letterbox"],
    alignment: "center",
    placement: "middle",
    tone: "classic",
    fontSize: 58,
    creditText: "ARCHIVE FEED / STAND BY"
  },
  "saturday-morning-cartoons": {
    heading: "SATURDAY MORNING CARTOONS",
    taglines: ["cereal voltage rising", "remote lost under the couch", "all pajamas, no supervision"],
    scheme: "citrus",
    shapes: "starburst",
    effects: ["flicker", "chromatic"],
    alignment: "left",
    placement: "top",
    tone: "caption",
    fontSize: 48,
    creditText: "SAT AM CARTOON RELAY"
  },
  "sunday-morning-cartoons": {
    heading: "SUNDAY MORNING CARTOONS",
    taglines: ["blanket fort broadcast", "cartoons before the coffee kicks in", "soft static, hard cereal"],
    scheme: "mint",
    shapes: "polka",
    effects: ["scanlines", "chromatic"],
    alignment: "left",
    placement: "middle",
    tone: "caption",
    fontSize: 48,
    creditText: "SUN AM CARTOON RELAY"
  },
  "de-coffeeschoop": {
    heading: "DE COFFEESCHOOP",
    taglines: ["three hours of full-song bump energy", "steam, static, and long grooves", "no rush, just signal"],
    scheme: "mint",
    shapes: "plaid",
    effects: ["noise", "scanlines"],
    alignment: "right",
    placement: "middle",
    tone: "washed",
    fontSize: 52,
    creditText: "FULL SONG BUMPS EVENTUALLY"
  },
  toonski: {
    heading: "TOONSKI",
    taglines: ["four hours from the orbiting tape deck", "after-dinner action transmission", "robot sunset, couch locked"],
    scheme: "blueprint",
    shapes: "starburst",
    effects: ["vhs", "scanlines", "chromatic"],
    alignment: "right",
    placement: "middle",
    tone: "caption",
    fontSize: 60,
    creditText: "SUNDAY ACTION SIGNAL"
  },
  "music-box": {
    heading: "MUSIC BOX",
    taglines: ["music television from the wrong alley", "request line melted, videos remain", "all hooks, no chaperone"],
    scheme: "miami",
    shapes: "diamonds",
    effects: ["chromatic", "flicker"],
    alignment: "center",
    placement: "bottom",
    tone: "caption",
    fontSize: 56,
    creditText: "MUSIC BOX / VIDEO CARTS"
  },
  "daytime-talk-shows": {
    heading: "DAYTIME TALK SHOWS",
    taglines: ["chairs, callers, strong opinions", "local access at lunch volume", "the sofa has the floor"],
    scheme: "paper",
    shapes: "lines",
    effects: ["scanlines"],
    alignment: "left",
    placement: "middle",
    tone: "caption",
    fontSize: 48,
    creditText: "PUBLIC ACCESS NERVE CENTER"
  },
  "late-night-talk-shows": {
    heading: "LATE NIGHT TALK SHOWS",
    taglines: ["desk lights after midnight", "monologue fumes and orbiting callers", "the guest is lost backstage"],
    scheme: "midnight",
    shapes: "terrazzo",
    effects: ["noise", "vhs", "letterbox"],
    alignment: "left",
    placement: "bottom",
    tone: "classic",
    fontSize: 52,
    creditText: "AFTER HOURS CALL-IN STATIC"
  },
  "late-night-anime": {
    heading: "LATE NIGHT ANIME",
    taglines: ["cel shade after 2AM", "OVA hour, tracking unstable", "subbed, dubbed, half-awake"],
    scheme: "arcade",
    shapes: "argyle",
    effects: ["vhs", "chromatic", "scanlines"],
    alignment: "right",
    placement: "middle",
    tone: "caption",
    fontSize: 54,
    creditText: "2AM CEL-SHADED TRANSMISSION"
  },
  "cereal-ova-club": {
    heading: "CEREAL OVA CLUB",
    taglines: ["rice puffs and tape hiss", "weekday morning OVA milk", "before school, after the future"],
    scheme: "paper",
    shapes: "polka",
    effects: ["scanlines", "vhs"],
    alignment: "left",
    placement: "bottom",
    tone: "caption",
    fontSize: 52,
    creditText: "6AM VINTAGE ANIME FEED"
  }
};

const BUMP_CLASSES = [
  {
    id: "auto-bump",
    label: "Auto Schedule Bump",
    status: "active",
    description: "Short generated queue filler that previews upcoming programming."
  },
  {
    id: "manual-bump",
    label: "Manual Bump",
    status: "active",
    description: "Operator-built bump from the bump generator."
  },
  {
    id: "block-bump",
    label: "Block Bump",
    status: "active",
    description: "Short identity bump attached to a weekly programming block."
  },
  {
    id: "block-promo-bump",
    label: "Block Promo Bump",
    status: "active",
    description: "Generated station-break ad for upcoming blocks and programs, optionally backed by a short preview clip."
  },
  {
    id: "fade-break-bump",
    label: "Fade Break Bump",
    status: "active",
    description: "Best-effort TV-style interstitial inserted at detected fade-outs in longer programs."
  },
  {
    id: "full-song-bump",
    label: "Full Song Bump",
    status: "planned",
    description: "Planned long-form music/video bump class for music-heavy blocks; not inserted automatically yet."
  },
  {
    id: "legal-id-bump",
    label: "Legal ID Bump",
    status: "active",
    description: "Station identity break class for call-sign, frequency, and legal-ID flavored continuity."
  },
  {
    id: "call-in-bump",
    label: "Call-In Bump",
    status: "planned",
    description: "Planned break class for viewer, chat, and caller material once caller ingest is formalized."
  },
  {
    id: "supporter-shoutout-bump",
    label: "Supporter Shoutout Bump",
    status: "active",
    description: "Short credit bumper for Patreon crew influence, accepted picks, and live supporter moments."
  },
  {
    id: "crew-pick-bump",
    label: "Crew Pick Handoff",
    status: "active",
    description: "Interstitial that turns an accepted viewer or supporter pick into on-air station punctuation."
  },
  {
    id: "weather-bump",
    label: "Weather Bump",
    status: "active",
    description: "One-week forecast card for a random reasonably sized city somewhere around the world."
  }
];

const PROGRAM_VOTE_MAX_OPTIONS = 4;

const ADMIN_USER = process.env.ADMIN_USER || "DoinkWizard";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChipTanaka12!@";
const ADMIN_ACCOUNTS = [
  { username: ADMIN_USER, password: ADMIN_PASSWORD },
  { username: "ChillNeil", password: "ChillyBilly12!@" }
];
const WEATHER_CITIES = [
  { name: "Accra", country: "Ghana", latitude: 5.56, longitude: -0.2 },
  { name: "Amsterdam", country: "Netherlands", latitude: 52.37, longitude: 4.9 },
  { name: "Auckland", country: "New Zealand", latitude: -36.85, longitude: 174.76 },
  { name: "Bangkok", country: "Thailand", latitude: 13.75, longitude: 100.5 },
  { name: "Barcelona", country: "Spain", latitude: 41.39, longitude: 2.17 },
  { name: "Bogota", country: "Colombia", latitude: 4.71, longitude: -74.07 },
  { name: "Buenos Aires", country: "Argentina", latitude: -34.61, longitude: -58.38 },
  { name: "Cairo", country: "Egypt", latitude: 30.04, longitude: 31.24 },
  { name: "Cape Town", country: "South Africa", latitude: -33.92, longitude: 18.42 },
  { name: "Chicago", country: "United States", latitude: 41.88, longitude: -87.63 },
  { name: "Copenhagen", country: "Denmark", latitude: 55.68, longitude: 12.57 },
  { name: "Dakar", country: "Senegal", latitude: 14.69, longitude: -17.45 },
  { name: "Hanoi", country: "Vietnam", latitude: 21.03, longitude: 105.85 },
  { name: "Helsinki", country: "Finland", latitude: 60.17, longitude: 24.94 },
  { name: "Istanbul", country: "Turkey", latitude: 41.01, longitude: 28.98 },
  { name: "Jakarta", country: "Indonesia", latitude: -6.21, longitude: 106.85 },
  { name: "Lagos", country: "Nigeria", latitude: 6.52, longitude: 3.38 },
  { name: "Lisbon", country: "Portugal", latitude: 38.72, longitude: -9.14 },
  { name: "Melbourne", country: "Australia", latitude: -37.81, longitude: 144.96 },
  { name: "Mexico City", country: "Mexico", latitude: 19.43, longitude: -99.13 },
  { name: "Montreal", country: "Canada", latitude: 45.5, longitude: -73.57 },
  { name: "Nairobi", country: "Kenya", latitude: -1.29, longitude: 36.82 },
  { name: "Osaka", country: "Japan", latitude: 34.69, longitude: 135.5 },
  { name: "Prague", country: "Czechia", latitude: 50.08, longitude: 14.44 },
  { name: "Reykjavik", country: "Iceland", latitude: 64.15, longitude: -21.94 },
  { name: "Santiago", country: "Chile", latitude: -33.45, longitude: -70.66 },
  { name: "Seoul", country: "South Korea", latitude: 37.57, longitude: 126.98 },
  { name: "Stockholm", country: "Sweden", latitude: 59.33, longitude: 18.07 },
  { name: "Taipei", country: "Taiwan", latitude: 25.03, longitude: 121.56 },
  { name: "Toronto", country: "Canada", latitude: 43.65, longitude: -79.38 },
  { name: "Valparaiso", country: "Chile", latitude: -33.05, longitude: -71.62 },
  { name: "Warsaw", country: "Poland", latitude: 52.23, longitude: 21.01 }
];
const PROJECT_MISSION = {
  headline: "A Patreon-backed underground TV station performed like a live instrument.",
  statement: "DoinkTV should feel like a real community channel that admins can play in real time: scheduled programming, supporter influence, block identity, generated bumps, and Ableton-style live FX all feeding one coherent broadcast experience.",
  principles: [
    "The admin performs the channel, not just the controls.",
    "Community input should visibly change what airs.",
    "Every block should feel like a distinct channel inside the channel.",
    "Chaos should be smooth, intentional, reversible, and worth watching.",
    "Continuity should make the station feel alive even when nobody is touching it."
  ]
};
const DEVELOPMENT_SPINE = [
  {
    id: "performance-rack-core",
    label: "Performance rack core",
    status: "active",
    whyNow: "The FX system is the project’s differentiator, but it needs macros, scenes, confidence tools, and block-aware limits to feel playable instead of button-heavy.",
    nextAction: "Keep turning FX into rack units with macro mappings, active/decay state, undo, and scene snapshots."
  },
  {
    id: "continuity-engine",
    label: "Continuity engine",
    status: "next",
    whyNow: "The schedule, queue, fade breaks, and standby filler already exist; a continuity log and clearer rules would make the station trustworthy.",
    nextAction: "Add an admin continuity log that explains why each item played and what will play next."
  },
  {
    id: "block-identity-system",
    label: "Block identity system",
    status: "next",
    whyNow: "Weekly blocks are now performance presets, so block bump packages, colors, FX ceilings, and recurring rituals can compound quickly.",
    nextAction: "Give each weekly block editable identity presets and generated bump packages."
  },
  {
    id: "community-programming-loop",
    label: "Community programming loop",
    status: "next",
    whyNow: "Patreon/crew picks, voting, and admin curation are present but need outcome history so participation feels consequential.",
    nextAction: "Track pick outcomes: accepted, queued, aired, credited, and revisited next week."
  },
  {
    id: "media-quality-safety",
    label: "Media quality and safety",
    status: "foundation",
    whyNow: "Internet Archive discovery powers the station, but low-quality, broken, or inappropriate candidates can poison automation.",
    nextAction: "Centralize Archive scoring, content filters, language/caption signals, duration rules, and rejection memory."
  },
  {
    id: "codebase-operability",
    label: "Codebase operability",
    status: "foundation",
    whyNow: "The feature set is outgrowing two monolithic files and syntax-only checks; future speed depends on cleaner boundaries.",
    nextAction: "Split server/client domains into modules and add behavioral smoke tests around scheduling, FX, chat, and Archive search."
  }
];
const MAINTENANCE_FINDINGS = [
  {
    severity: "high",
    area: "Code organization",
    finding: "server.js and public/app.js are large all-in-one files containing routing, state mutation, media discovery, scheduling, FX, chat, and admin UI glue.",
    impact: "Feature work is still possible, but coupling is rising and regressions will get harder to predict.",
    refactor: "Split by domain: schedule/queue, FX/performance, community, media/Archive, bumps, and HTTP routes."
  },
  {
    severity: "high",
    area: "Operational data",
    finding: "Runtime state now writes to ignored data/runtime/state.json, seeded from checked-in data/state.json when needed.",
    impact: "Generated schedule/filler churn is less likely to leak into commits, but deployments still need persistent storage.",
    refactor: "Keep data/state.json as starter state, set DOINK_STATE_PATH to persistent storage in production, and avoid committing runtime cache churn."
  },
  {
    severity: "high",
    area: "Security",
    finding: "Fallback admin credentials exist in code for local convenience.",
    impact: "Fine for a private local prototype, dangerous if deployed without env overrides.",
    refactor: "Require ADMIN_USER and ADMIN_PASSWORD outside development and surface a health warning when defaults are active."
  },
  {
    severity: "medium",
    area: "Tests",
    finding: "Core policy tests now cover schedule priority, longform breaks, weather spacing, language fit, porn filtering, and weekly repeats.",
    impact: "The most load-bearing programming rules have regression coverage, while UI and FX browser smoke tests are still missing.",
    refactor: "Add a lightweight browser smoke script for critical admin and viewer flows."
  },
  {
    severity: "medium",
    area: "Feature ownership",
    finding: "Bumps, block identity, performance cues, and community moments now overlap by design but still live as separate implementation islands.",
    impact: "The product vision is converging faster than the architecture.",
    refactor: "Create a single station identity/continuity layer that owns block packs, bump packages, supporter moments, and cue suggestions."
  },
  {
    severity: "medium",
    area: "Admin confidence",
    finding: "Powerful live controls exist, but undo, audit trails, and explanations are still thin.",
    impact: "Admins can wow people, but may hesitate to push the rig hard during a live show.",
    refactor: "Add continuity/performance logs, undo for destructive admin actions, and clear active/decaying state for all live systems."
  }
];
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const ADMIN_FX_GRACE_MS = 30000;
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
  "auto-filter-sweep": { label: "Auto filter sweep", duration: 12 },
  "source-overlay": { label: "Source overlay", duration: 45 },
  "audio-desync": { label: "Audio desync", duration: 10 },
  "amen-break": { label: "Amen break", duration: 6 },
  "radio-sting": { label: "FM morning radio", duration: 7 },
  "legal-id": { label: "Legal ID cart", duration: 8 },
  "cart-wall": { label: "Cart wall", duration: 6 },
  "record-scratch": { label: "Record scratch", duration: 4 },
  "dj-mic": { label: "DJ mic live", duration: 60 },
  "frequency-drift": { label: "Frequency drift", duration: 60 },
  "caller-line": { label: "Caller line", duration: 14 },
  "party-damage": { label: "Party damage", duration: 60 },
  "dub-siren": { label: "Dub siren", duration: 8 },
  "show-cue": { label: "Show cue", duration: 8 },
  "soundboard-sample": { label: "Soundboard cart", duration: 8 },
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
  reverb: { label: "Reverb", duration: 90 },
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
const LEGAL_ID_CARTS = [
  { call: "KDKA", city: "Pittsburgh", note: "historic AM pioneer" },
  { call: "WBCN", city: "Boston", note: "former Boston rock call sign" },
  { call: "WLIR", city: "Garden City", note: "former Long Island new-wave call sign" },
  { call: "WNEW-FM", city: "New York", note: "former progressive rock identity" },
  { call: "WJZ", city: "New York", note: "former New York AM call sign" },
  { call: "WYNY", city: "New York", note: "defunct New York country identity" }
];
const CART_WALL_PRESETS = [
  "airhorn",
  "rewind",
  "laser",
  "siren",
  "needle-drop",
  "bad-jingle",
  "panic-button"
];

const PERFORMANCE_SCENES = [
  { id: "pirate", label: "Pirate Takeover", color: "#ff715f", cueId: "pirate-takeover", macroLabel: "Hijack", chaosCeiling: 0.96, description: "Borrowed transmitter energy, IDs, drift, and dub siren damage." },
  { id: "party", label: "Basement Party", color: "#f2b84a", cueId: "basement-party", macroLabel: "Rhythm", chaosCeiling: 0.9, description: "Cart wall, scratches, room slap, and sticky-floor motion." },
  { id: "uhf", label: "Haunted UHF", color: "#68c3b7", cueId: "haunted-uhf", macroLabel: "Ghost", chaosCeiling: 0.78, description: "Signal loss, tape curl, hum, and cold channel ghosts." },
  { id: "anime", label: "Anime Drift", color: "#7db7ff", cueId: "anime-drift", macroLabel: "Drift", chaosCeiling: 0.68, description: "Late-night cel smear, ice color, delay trails, and soft tape instability." },
  { id: "training", label: "Training Tape", color: "#8fd06d", cueId: "training-tape", macroLabel: "AV Room", chaosCeiling: 0.62, description: "VHS, color bars, corporate AV prompts, and instructional unease." },
  { id: "panic", label: "Public Access Panic", color: "#c968ff", cueId: "public-access-panic", macroLabel: "Damage", chaosCeiling: 1, description: "Switcher meltdown, UI distress, popups, and visible live trouble." },
  { id: "community", label: "Crew Signal", color: "#ffd166", cueId: "crew-pick-handoff", macroLabel: "Community", chaosCeiling: 0.72, description: "Supporter credits, accepted picks, and station-audience handoffs." }
];

const PERFORMANCE_CUES = [
  {
    id: "pirate-takeover",
    sceneId: "pirate",
    label: "Pirate Takeover",
    clip: "signal hijack + station ID",
    macro: "hijack",
    bumpClass: "legal-id-bump",
    bumpLines: ["unauthorized relay", "tower light blinking", "call sign borrowed for educational misuse"],
    fx: ["show-cue", "legal-id", "frequency-drift", "visual-adjust", "av-warp", "delay", "dub-siren"]
  },
  {
    id: "basement-party",
    sceneId: "party",
    label: "Basement Party",
    clip: "sound system pushed past good judgment",
    macro: "party",
    bumpClass: "call-in-bump",
    bumpLines: ["cart wall armed", "floor sticky", "somebody touched the aux"],
    fx: ["show-cue", "party-damage", "cart-wall", "record-scratch", "visual-adjust", "reverb"]
  },
  {
    id: "haunted-uhf",
    sceneId: "uhf",
    label: "Haunted UHF",
    clip: "cold signal, hot ghosts",
    macro: "haunted",
    bumpClass: "block-bump",
    bumpLines: ["channel within a channel", "tracking has opinions", "please stand by forever"],
    fx: ["show-cue", "signal-loss", "tape-warp", "hum", "visual-adjust", "reverb"]
  },
  {
    id: "anime-drift",
    sceneId: "anime",
    label: "Anime Drift",
    clip: "late-night smear + ice color",
    macro: "drift",
    bumpClass: "block-bump",
    bumpLines: ["cel shade after hours", "two frames from another timeline", "subcarrier moonlight"],
    fx: ["show-cue", "color-ice", "kaleidoscope", "visual-adjust", "delay", "reverb"]
  },
  {
    id: "training-tape",
    sceneId: "training",
    label: "Training Tape",
    clip: "corporate AV room collapse",
    macro: "training",
    bumpClass: "weather-bump",
    bumpLines: ["module four: compliance fog", "please rewind the workplace", "quiz follows eventually"],
    fx: ["show-cue", "vhs", "color-bars", "floppy-prompt", "visual-adjust", "radio-sting"]
  },
  {
    id: "public-access-panic",
    sceneId: "panic",
    label: "Public Access Panic",
    clip: "the switcher is melting",
    macro: "panic",
    bumpClass: "manual-bump",
    bumpLines: ["wrong button, great button", "lower third escaped", "viewer discretion is improvising"],
    fx: ["show-cue", "os-popups", "ui-css-panic", "fill-popups", "visual-adjust", "cart-wall"]
  },
  {
    id: "crew-pick-handoff",
    sceneId: "community",
    label: "Crew Pick Handoff",
    clip: "supporter pick enters the signal",
    macro: "community",
    bumpClass: "crew-pick-bump",
    bumpLines: ["crew pick accepted", "audience fingerprints on the schedule", "next program came through the side door"],
    fx: ["show-cue", "radio-sting", "visual-adjust", "record-scratch"]
  },
  {
    id: "supporter-shoutout",
    sceneId: "community",
    label: "Supporter Shoutout",
    clip: "Patreon crew credit sting",
    macro: "community",
    bumpClass: "supporter-shoutout-bump",
    bumpLines: ["station crew kept the lights wrong", "Patreon signal boost", "thanks for funding the weird part"],
    fx: ["show-cue", "radio-sting", "cart-wall", "reverb"]
  },
  {
    id: "identity-hit",
    sceneId: "pirate",
    label: "Identity Hit",
    clip: "quick ID + sting",
    macro: "identity",
    bumpClass: "legal-id-bump",
    bumpLines: ["station ID", "back to the program", "nobody saw the paperwork"],
    fx: ["show-cue", "legal-id", "radio-sting"]
  },
  {
    id: "panic-reset",
    sceneId: "training",
    label: "Panic Reset",
    clip: "clear the rack",
    macro: "reset",
    bumpClass: "manual-bump",
    bumpLines: ["resetting the room", "stand by", "all knobs to survivable"],
    fx: []
  }
];

const PERFORMANCE_MACROS = {
  hijack: { damage: 0.72, drift: 0.36, space: 0.22, rhythm: 0.42, page: 0.22 },
  party: { damage: 0.44, drift: 0.18, space: 0.34, rhythm: 0.72, page: 0.28 },
  haunted: { damage: 0.58, drift: 0.48, space: 0.78, rhythm: 0.18, page: 0.12 },
  drift: { damage: 0.34, drift: 0.74, space: 0.58, rhythm: 0.36, page: 0.08 },
  training: { damage: 0.5, drift: 0.18, space: 0.12, rhythm: 0.16, page: 0.32 },
  panic: { damage: 0.82, drift: 0.28, space: 0.18, rhythm: 0.5, page: 0.78 },
  community: { damage: 0.38, drift: 0.16, space: 0.24, rhythm: 0.52, page: 0.1 },
  identity: { damage: 0.22, drift: 0.1, space: 0.08, rhythm: 0.36, page: 0.04 },
  reset: { damage: 0, drift: 0, space: 0, rhythm: 0, page: 0 }
};

const BLOCK_IDENTITY_PACKS = [
  { match: /anime|ova|cel|toonami|midnight/i, sceneId: "anime", cueId: "anime-drift", label: "Cel Drift", chaosCeiling: 0.68, bumpPackage: ["block-bump", "fade-break-bump", "supporter-shoutout-bump"] },
  { match: /fridge|sketch|cartoon|sunday|saturday/i, sceneId: "party", cueId: "basement-party", label: "Cartoon Party", chaosCeiling: 0.88, bumpPackage: ["block-bump", "crew-pick-bump", "call-in-bump"] },
  { match: /retro|uhf|fish|lexx|robot|popeye|looney/i, sceneId: "uhf", cueId: "haunted-uhf", label: "UHF Ghost", chaosCeiling: 0.78, bumpPackage: ["legal-id-bump", "block-bump", "fade-break-bump"] },
  { match: /coffee|music|mtv|bump|song/i, sceneId: "party", cueId: "identity-hit", label: "Music ID", chaosCeiling: 0.82, bumpPackage: ["full-song-bump", "legal-id-bump", "supporter-shoutout-bump"] },
  { match: /talk|space ghost|chill|hank/i, sceneId: "training", cueId: "training-tape", label: "Talk Show Tape", chaosCeiling: 0.62, bumpPackage: ["call-in-bump", "legal-id-bump", "supporter-shoutout-bump"] }
];

const sessions = new Map();
const sseClients = new Set();
const adminSseClients = new Set();
const chatClients = new Set();
let timelineSaveNeeded = false;
let programVoting = null;
let adminActivityUntil = 0;
const autoIngestQueue = [];
const autoIngestQueued = new Set();
const autoIngestInFlight = new Set();
const fadeBreakDetectionInFlight = new Set();
const weatherForecastCache = new Map();
let autoIngestPumpActive = false;
const ffmpegPath = process.env.FFMPEG_PATH || ffmpegInstaller.path || "ffmpeg";
let state = stationStateDefaults({ communityDefaults: COMMUNITY_DEFAULTS });
const hlsController = createHlsPlayoutController({
  hlsDir: HLS_DIR,
  ffmpegPath,
  spawn,
  mkdir,
  readdir,
  rm,
  stat,
  existsSync,
  argsForProgram: hlsArgsForProgram,
  publicProgram,
  standbyProgram,
  handoffProgram: hlsHandoffProgram,
  entryEnd
});
const hlsPlayout = hlsController.playout;

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
  const loadedState = await loadStationState({
    statePath: STATE_PATH,
    seedPath: STARTER_STATE_PATH,
    defaultState: stationStateDefaults({ communityDefaults: COMMUNITY_DEFAULTS }),
    normalizers: {
      normalizeCommunityState,
      normalizeLoreState,
      normalizeContinuityLog,
      normalizeFxSnapshots
    }
  });
  state = loadedState.state;
  programVoting = createProgramVotingController({
    state,
    mediaDiscovery,
    maxOptions: PROGRAM_VOTE_MAX_OPTIONS,
    sessionSupporterTier,
    getSession,
    currentProgram: () => programSnapshot(),
    saveState,
    broadcastProgram,
    markDirty: () => {
      timelineSaveNeeded = true;
    }
  });
  const normalizedBumps = normalizeGeneratedBumpsInState();
  const syncedBlocks = syncWeeklyBlockTemplates();
  if (loadedState.created || normalizedBumps || syncedBlocks) await saveState();
}

function publicShowControl() {
  return {
    scenes: PERFORMANCE_SCENES,
    cues: PERFORMANCE_CUES.map(({ id, sceneId, label, clip, macro, bumpClass, fx }) => ({ id, sceneId, label, clip, macro, bumpClass, fxCount: Array.isArray(fx) ? fx.length : 0 })),
    macros: Object.fromEntries(Object.entries(PERFORMANCE_MACROS).map(([id, macro]) => [id, { ...macro }])),
    instruments: publicFxInstruments(),
    snapshots: publicFxSnapshots()
  };
}

function publicFxSnapshots() {
  state.fxSnapshots = normalizeFxSnapshots(state.fxSnapshots);
  return state.fxSnapshots.map((snapshot) => ({
    id: snapshot.id,
    name: snapshot.name,
    note: snapshot.note,
    fxCount: snapshot.fx.length,
    createdAt: snapshot.createdAt,
    updatedAt: snapshot.updatedAt
  }));
}

function recordContinuityEvent(event = {}) {
  return domainRecordContinuityEvent(state, event);
}

function publicContinuityLog(limit = 24) {
  return domainPublicContinuityLog(state, limit);
}

function blockIdentityPackFor(live = null) {
  return domainBlockIdentityPackFor(live, {
    blockIdentityPacks: BLOCK_IDENTITY_PACKS,
    performanceScenes: PERFORMANCE_SCENES
  });
}

function stationContinuityBrain(live = null, next = null) {
  return domainContinuityBrain(state, {
    live,
    next,
    blockIdentityPacks: BLOCK_IDENTITY_PACKS,
    performanceScenes: PERFORMANCE_SCENES,
    bumpClasses: BUMP_CLASSES,
    legalIdCarts: LEGAL_ID_CARTS
  });
}

async function saveState() {
  await saveStationState({ statePath: STATE_PATH, state });
}

function syncWeeklyBlockTemplates() {
  const before = JSON.stringify(state.weeklyBlocks || []);
  const existing = new Map((state.weeklyBlocks || []).map((block) => [block.id, block]));
  state.weeklyBlocks = WEEKLY_BLOCKS.map((template) => ({
    ...template,
    ...(existing.get(template.id) || {}),
    identity: weeklyBlockIdentity(template),
    enabled: existing.get(template.id)?.enabled !== false,
    folderName: template.folderName,
    queries: template.queries
  }));
  return JSON.stringify(state.weeklyBlocks || []) !== before;
}

function weeklyBlockIdentity(block = {}) {
  const identity = WEEKLY_BLOCK_IDENTITIES[block.id] || {};
  return {
    id: block.id || "station",
    label: block.name || identity.heading || "DoinkTV",
    styleId: block.id || "station",
    heading: identity.heading || block.name || "DOINKTV",
    taglines: Array.isArray(identity.taglines) && identity.taglines.length ? identity.taglines : ["more strange programming shortly"],
    scheme: identity.scheme || "broadcast",
    shapes: identity.shapes || "mixed",
    effects: Array.isArray(identity.effects) ? identity.effects : ["scanlines"],
    alignment: identity.alignment || "left",
    placement: identity.placement || "middle",
    tone: identity.tone || "caption",
    fontSize: identity.fontSize || 52,
    creditText: identity.creditText || "DOINKTV BLOCK BUMP"
  };
}

function blockIdentityForEntry(entry = {}) {
  const blockId = entry.gapFiller ? "station-break" : String(entry.weeklyBlockId || "").trim();
  const blockName = entry.gapFiller ? GAP_FILLER_BLOCK_NAME : String(entry.weeklyBlockName || "").trim();
  if (blockId || blockName) {
    return weeklyBlockIdentity({
      id: blockId || blockName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: blockName || blockId
    });
  }
  return null;
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

function markAdminActivity() {
  adminActivityUntil = Date.now() + ADMIN_FX_GRACE_MS;
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
  if (isAdmin(req)) {
    markAdminActivity();
    return true;
  }
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
  const tier = sessionSupporterTier(session);
  return {
    username: session.username,
    role: session.role,
    supporterTier: tier.id,
    supporterLabel: tier.label,
    supporterBadge: tier.badge,
    voteWeight: tier.weight
  };
}

function requireSession(req, res) {
  const session = getSession(req);
  if (session) return session;
  sendJson(res, 401, { error: "Log in to chat." });
  return null;
}

function publicCommunity({ admin = false } = {}) {
  return domainPublicCommunity(state, { admin });
}

function publicLore({ query = "" } = {}) {
  return domainPublicLore(state, { query });
}

async function upsertLoreEntry(body = {}) {
  return domainUpsertLoreEntry({ state, body, saveState, recordContinuityEvent });
}

function activeCommunityCrew() {
  return domainActiveCommunityCrew(state);
}

function supporterTierById(id = "viewer") {
  return domainSupporterTierById(id);
}

function sessionSupporterTier(session = null) {
  return domainSessionSupporterTier(state, session);
}

function stationHealthSummary() {
  const now = Date.now();
  const horizon = now + 1000 * 60 * 60 * 24;
  const sourceIds = new Set((state.sources || []).map((source) => source.id));
  const missingRefs = [...(state.schedule || []), ...(state.liveQueue || [])]
    .filter((entry) => entry.sourceId && !sourceIds.has(entry.sourceId));
  const scheduledNextDay = (state.schedule || [])
    .filter((entry) => Number(entry.startAt || 0) < horizon && entryEnd(entry) > now)
    .sort((a, b) => a.startAt - b.startAt);
  const broadcastNextDay = activeBroadcastEntries()
    .filter((entry) => Number(entry.startAt || 0) < horizon && entryEnd(entry) > now)
    .sort((a, b) => a.startAt - b.startAt);
  const autoBumps = broadcastNextDay.filter((entry) => entry.autoBump || isBumpSource(state.sources.find((source) => source.id === entry.sourceId)));
  const ingestIssues = (state.sources || []).filter((source) => ["error", "failed"].includes(source.ingest?.status));
  const gaps = [];
  for (let index = 0; index < scheduledNextDay.length - 1; index += 1) {
    const gapSeconds = Math.round((Number(scheduledNextDay[index + 1].startAt || 0) - entryEnd(scheduledNextDay[index])) / 1000);
    if (gapSeconds > 60 * 10) {
      gaps.push({
        after: scheduledNextDay[index].title,
        before: scheduledNextDay[index + 1].title,
        seconds: gapSeconds
      });
    }
  }
  const warnings = [];
  if (!scheduledNextDay.length) warnings.push("No scheduled programming in the next 24 hours.");
  if (missingRefs.length) warnings.push(`${missingRefs.length} queue or schedule item${missingRefs.length === 1 ? "" : "s"} reference missing sources.`);
  if (ingestIssues.length) warnings.push(`${ingestIssues.length} source${ingestIssues.length === 1 ? "" : "s"} need ingest attention.`);
  if (scheduledNextDay.length > 2 && !autoBumps.length) warnings.push("No automatic bumps found around upcoming programming.");
  if (gaps.length) warnings.push(`${gaps.length} schedule gap${gaps.length === 1 ? "" : "s"} over 10 minutes in the next 24 hours.`);
  if (hlsPlayout.status === "error") warnings.push(`HLS playout error: ${hlsPlayout.error || "unknown"}.`);
  if (ADMIN_USER === "DoinkWizard" || ADMIN_PASSWORD === "ChipTanaka12!@") warnings.push("Default admin credentials are active; set ADMIN_USER and ADMIN_PASSWORD before public deployment.");
  return {
    status: warnings.length ? (missingRefs.length || hlsPlayout.status === "error" ? "critical" : "attention") : "good",
    generatedAt: now,
    warnings,
    checks: {
      scheduledNext24h: scheduledNextDay.length,
      broadcastItemsNext24h: broadcastNextDay.length,
      autoBumpsNext24h: autoBumps.length,
      longGapsNext24h: gaps.length,
      missingSourceRefs: missingRefs.length,
      ingestIssues: ingestIssues.length,
      hlsStatus: hlsPlayout.status
    },
    gaps: gaps.slice(0, 5)
  };
}

async function projectAuditSummary() {
  const bumpClassCounts = (BUMP_CLASSES || []).reduce((counts, item) => {
    counts[item.status || "unknown"] = (counts[item.status || "unknown"] || 0) + 1;
    return counts;
  }, {});
  const largeFiles = await Promise.all([
    codebaseFileMetric("server.js", "high"),
    codebaseFileMetric("public/app.js", "high"),
    codebaseFileMetric("public/styles.css", "medium")
  ]);
  return {
    generatedAt: Date.now(),
    mission: PROJECT_MISSION,
    nextSteps: DEVELOPMENT_SPINE,
    findings: MAINTENANCE_FINDINGS,
    metrics: {
      sources: (state.sources || []).length,
      scheduledItems: (state.schedule || []).length,
      queueItems: (state.liveQueue || []).length,
      weeklyBlocks: (state.weeklyBlocks || []).length,
      activeFx: activeBroadcastFx().length,
      users: (state.users || []).length,
      communitySuggestions: state.community?.suggestions?.length || 0,
      loreEntries: state.lore?.entries?.length || 0,
      continuityEvents: (state.continuityLog || []).length,
      fxSnapshots: (state.fxSnapshots || []).length,
      bumpClasses: BUMP_CLASSES.length,
      bumpClassCounts,
      largeFiles,
      defaultAdminCredentialsActive: ADMIN_USER === "DoinkWizard" || ADMIN_PASSWORD === "ChipTanaka12!@"
    }
  };
}

async function codebaseFileMetric(relativePath, risk) {
  const text = await readFile(path.join(__dirname, relativePath), "utf8").catch(() => "");
  return {
    path: relativePath,
    lineCount: text ? text.split(/\r?\n/).length : 0,
    risk
  };
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
    supporterTier: "viewer",
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
  return mediaDiscovery.normalizeInternetArchiveId(input);
}

function archiveDownloadUrl(identifier, fileName) {
  return mediaDiscovery.archiveDownloadUrl(identifier, fileName);
}

function encodeArchiveFilePath(fileName) {
  return mediaDiscovery.encodeArchiveFilePath(fileName);
}

function normalizeSearchQuery(value) {
  return mediaDiscovery.normalizeSearchQuery(value);
}

function parseDurationText(text) {
  return mediaDiscovery.parseDurationText(text);
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
  return mediaDiscovery.getInternetArchiveInfo(input, preferredFileName);
}

async function searchInternetArchiveSources(query, rows = 10) {
  return mediaDiscovery.searchInternetArchiveSources(query, rows);
}

async function internetArchiveSearchResultForDoc(doc = {}) {
  return mediaDiscovery.internetArchiveSearchResultForDoc(doc);
}

function archiveQualitySignals(candidate = {}) {
  return mediaDiscovery.archiveQualitySignals(candidate);
}

async function loadInternetArchiveMetadata(archiveId) {
  return mediaDiscovery.loadInternetArchiveMetadata(archiveId);
}

function chooseInternetArchiveVideoFile(item = {}) {
  return mediaDiscovery.chooseInternetArchiveVideoFile(item);
}

function chooseInternetArchiveVideoFiles(item = {}, limit = 50) {
  return mediaDiscovery.chooseInternetArchiveVideoFiles(item, limit);
}

function chooseEnglishCaptionFile(item = {}, archiveFile = "") {
  return mediaDiscovery.chooseEnglishCaptionFile(item, archiveFile);
}

function isInternetArchiveCaptionFile(file = {}) {
  return mediaDiscovery.isInternetArchiveCaptionFile(file);
}

function internetArchiveCaptionScore(file = {}, videoBase = "") {
  return mediaDiscovery.internetArchiveCaptionScore(file, videoBase);
}

function srtToWebVtt(text = "") {
  return mediaDiscovery.srtToWebVtt(text);
}

async function captionInfoForSourceId(sourceId = "") {
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source || source.type !== "internet-archive" || !source.archiveId) return { available: false };
  const metadata = await loadInternetArchiveMetadata(source.archiveId);
  const file = chooseEnglishCaptionFile(metadata, source.archiveFile);
  if (!file) return { available: false };
  const params = new URLSearchParams({ sourceId: source.id, file: file.name });
  return {
    available: true,
    label: "English",
    srclang: "en",
    file: file.name,
    src: `/api/captions/file?${params}`
  };
}

async function captionFileForRequest(sourceId = "", captionFile = "") {
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source || source.type !== "internet-archive" || !source.archiveId) throw new Error("No caption source is available.");
  const metadata = await loadInternetArchiveMetadata(source.archiveId);
  const file = chooseEnglishCaptionFile(metadata, source.archiveFile);
  if (!file || file.name !== captionFile) throw new Error("That caption file is not available.");
  const response = await fetch(archiveDownloadUrl(source.archiveId, file.name), {
    headers: { "user-agent": "DoinkTV Caption Loader" }
  });
  if (!response.ok) throw new Error("Could not load captions.");
  const text = await response.text();
  return /\.vtt$/i.test(file.name) && /^\s*WEBVTT/i.test(text) ? text : srtToWebVtt(text);
}

function isInternetArchiveVideoFile(file = {}) {
  return mediaDiscovery.isInternetArchiveVideoFile(file);
}

function internetArchiveFileScore(file = {}) {
  return mediaDiscovery.internetArchiveFileScore(file);
}

function archiveFileTitle(file = {}) {
  return mediaDiscovery.archiveFileTitle(file);
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
  applyDetectedFadeBreaks();
  const program = programSnapshot();
  const fx = activeBroadcastFx();
  const continuity = stationContinuityBrain(program.live, program.next);
  queueFadeBreakDetectionForProgram(program);
  return {
    ...program,
    audience: publicAudience(),
    performance: {
      blockPack: continuity.blockPack,
      activeCue: fx.find((item) => item.id === "show-cue")?.params || null,
      continuity
    },
    continuity,
    votePoll: publicProgramVotePoll(program.live),
    fx,
    stream: {
      url: "/stream/live.m3u8",
      status: hlsPlayout.status,
      error: hlsPlayout.error
    }
  };
}

function publicProgramVotePoll(live) {
  return programVoting.publicProgramVotePoll(live);
}

function isClearlyPornographicArchiveCandidate(candidate = {}) {
  return programVoting.isClearlyPornographicArchiveCandidate(candidate);
}

async function castProgramVote(req, body = {}) {
  return programVoting.castProgramVote(req, body);
}

function publicAudience() {
  return {
    online: friendlyOnlineCount()
  };
}

function friendlyOnlineCount() {
  const realConnections = sseClients.size;
  const windowSeed = Math.floor(Date.now() / (1000 * 60 * 5));
  const vibeByte = crypto
    .createHash("sha1")
    .update(`doinktv:${windowSeed}`)
    .digest()[0];
  const houseBoost = 4 + (vibeByte % 5);
  return realConnections + houseBoost;
}

function hasAdminOnline() {
  return adminSseClients.size > 0 || Date.now() < adminActivityUntil;
}

function activeBroadcastFx() {
  const result = domainActiveBroadcastFx(state, {
    adminOnline: hasAdminOnline(),
    graceMs: ADMIN_FX_GRACE_MS
  });
  if (result.changed) timelineSaveNeeded = true;
  return result.fx;
}

function programSnapshot() {
  return resolveBroadcastTimeline(state, {
    now: Date.now(),
    blockIdentityForEntry
  });
}

function programEntryReason(entry = {}) {
  return engineEntryReason(entry);
}

function isAudienceScheduleEntry(entry) {
  return engineIsAudienceScheduleEntry(entry);
}

function isBumpSource(source) {
  return engineIsBumpSource(source);
}

function maintainScheduledGapFillers() {
  const now = Date.now();
  const plan = plannedGapFillWindow(state.schedule, {
    now,
    version: GAP_FILLER_VERSION,
    lookaheadMs: GAP_FILLER_LOOKAHEAD_MS,
    minGapSeconds: GAP_FILLER_MIN_GAP_SECONDS
  });
  state.schedule = plan.schedule;
  let changed = plan.changed;
  if (!plan.shouldFill) {
    if (changed) pruneUnusedBumpSources();
    return changed;
  }

  const candidates = gapFillerCandidates();
  let cursor = plan.cursor;
  let index = plan.existingFillers.length;
  while (cursor < plan.fillUntil - GAP_FILLER_MIN_GAP_SECONDS * 1000 && index < GAP_FILLER_MAX_ENTRIES) {
    const remaining = Math.floor((plan.fillUntil - cursor) / 1000);
    const useBump = shouldUseGapFillerBump(index, remaining, GAP_FILLER_MIN_SOURCE_SECONDS);
    const entry = useBump
      ? createGapFillerBumpEntry(cursor, plan.nextReal, index, remaining)
      : createGapFillerSourceEntry(cursor, plan.nextReal, candidates, index, remaining);
    if (!entry) break;
    state.schedule.push(entry);
    cursor = entryEnd(entry);
    index += 1;
    changed = true;
  }

  if (changed) {
    state.schedule.sort((a, b) => a.startAt - b.startAt);
    pruneUnusedBumpSources();
  }
  return changed;
}

function gapFillerCandidates() {
  const folders = new Map((state.sourceFolders || []).map((folder) => [folder.id, folder.name || ""]));
  const scored = [];
  for (const source of state.sources || []) {
    if (!source || isBumpSource(source) || source.type === "youtube") continue;
    const score = mediaDiscovery.standbyFillerCandidateScore(source, {
      folderName: folders.get(source.folderId) || "",
      minSeconds: GAP_FILLER_MIN_SOURCE_SECONDS,
      maxSeconds: GAP_FILLER_MAX_SOURCE_SECONDS
    });
    if (!score) continue;
    scored.push({ source, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.source.title.localeCompare(b.source.title))
    .map((item) => item.source);
}

function createGapFillerSourceEntry(cursor, nextReal, candidates = [], index = 0, remaining = 0) {
  const pool = candidates.filter((source) => Number(source.duration || 0) <= remaining - 3);
  if (!pool.length) return createGapFillerBumpEntry(cursor, nextReal, index, remaining);
  const seed = Math.abs(hashString(`${new Date(cursor).toDateString()}:${index}:${nextReal.id || nextReal.startAt}`));
  const source = pool[seed % pool.length];
  return {
    id: crypto.randomUUID(),
    sourceId: source.id,
    title: `${GAP_FILLER_BLOCK_NAME}: ${source.title}`,
    startAt: cursor,
    duration: Math.round(source.duration),
    queuedAt: Date.now(),
    gapFiller: true,
    gapFillerVersion: GAP_FILLER_VERSION,
    weeklyBlockId: "station-break",
    weeklyBlockName: GAP_FILLER_BLOCK_NAME
  };
}

function createGapFillerBumpEntry(cursor, nextReal, index = 0, remaining = GAP_FILLER_BUMP_DURATION) {
  const promo = Boolean(nextReal?.sourceId) && index % 3 === 1;
  const targetDuration = promo ? GAP_FILLER_PROMO_DURATION : GAP_FILLER_BUMP_DURATION;
  const duration = Math.max(GAP_FILLER_MIN_GAP_SECONDS, Math.min(targetDuration, Math.floor(remaining)));
  const bumpSource = promo
    ? createGapFillerPromoBumpSource(nextReal, cursor, index, duration)
    : createGapFillerBumpSource(nextReal, cursor, index, duration);
  state.sources.push(bumpSource);
  return {
    id: crypto.randomUUID(),
    sourceId: bumpSource.id,
    title: bumpSource.title,
    startAt: cursor,
    duration: bumpSource.duration,
    queuedAt: Date.now(),
    autoBump: true,
    gapFiller: true,
    gapFillerVersion: GAP_FILLER_VERSION,
    weeklyBlockId: "station-break",
    weeklyBlockName: GAP_FILLER_BLOCK_NAME
  };
}

function createGapFillerBumpSource(nextReal = {}, cursor = Date.now(), index = 0, duration = GAP_FILLER_BUMP_DURATION) {
  const seed = Math.abs(hashString(`gap:${nextReal.id || nextReal.startAt}:${cursor}:${index}`)) % 100000;
  const deliberateGlitch = seed % 7 === 3;
  const music = randomBumpMusic(duration);
  const promoTarget = gapFillerPromoTarget(nextReal);
  return {
    id: crypto.randomUUID(),
    type: "bump",
    title: `${GAP_FILLER_BLOCK_NAME}: stand by bump`,
    duration,
    randomEligible: false,
    bump: {
      kind: "gap-filler-bump",
      bumpClass: "station-break",
      heading: sample(["more shortly", "station break", "please stand by", "back to program soon"]),
      lines: [
        GAP_FILLER_BLOCK_NAME,
        promoTarget?.title ? `NEXT: ${promoTarget.title}` : nextReal?.title ? `NEXT: ${nextReal.title}` : "PROGRAMMING RESUMES SHORTLY",
        nextReal?.startAt ? formatEstTime(nextReal.startAt) : ""
      ].filter(Boolean),
      alignment: deliberateGlitch ? sample(["left", "center", "right"]) : sample(["left", "center"]),
      placement: deliberateGlitch ? sample(["top", "middle", "bottom"]) : sample(["middle", "bottom"]),
      tone: deliberateGlitch ? sample(["classic", "caption", "washed"]) : sample(["caption", "washed"]),
      secondsPerLine: Math.max(4, Math.round((duration / 3) * 10) / 10),
      tintStrength: deliberateGlitch ? 28 : 16,
      creditText: music.creditText,
      creditSize: 18,
      creditPosition: "bottom-right",
      wallpaper: {
        shapes: deliberateGlitch
          ? sample(["checkerboard", "stripes", "memphis", "diamonds", "starburst"])
          : sample(["lines", "polka", "argyle", "terrazzo", "mondrian"]),
        scheme: deliberateGlitch
          ? sample(["broadcast", "warning", "arcade", "miami"])
          : sample(["midnight", "pool", "paper", "broadcast", "blueprint"]),
        spacing: deliberateGlitch ? 62 + Math.floor(Math.random() * 74) : 92 + Math.floor(Math.random() * 70),
        seed
      },
      effects: deliberateGlitch ? sampleMany(BUMP_INTENTIONAL_GLITCH_EFFECTS, 2) : sampleMany(BUMP_CLEAN_EFFECTS, 1),
      effectIntensity: deliberateGlitch ? 38 : 18,
      intentionalGlitch: deliberateGlitch,
      presentation: generatedBumpPresentation(deliberateGlitch),
      productionStyle: deliberateGlitch ? "standard" : "lower-third",
      productionAccent: "signal",
      productionBadge: "STATION BREAK",
      productionKicker: promoTarget?.title ? "coming up after this" : "continuity filler",
      audio: music.path,
      audioStart: music.start
    }
  };
}

function createGapFillerPromoBumpSource(nextReal = {}, cursor = Date.now(), index = 0, duration = GAP_FILLER_PROMO_DURATION) {
  const lineup = gapFillerPromoLineup(nextReal);
  const target = lineup[0] || gapFillerPromoTarget(nextReal);
  const source = sourceForEntry(target);
  const seed = Math.abs(hashString(`promo:${nextReal.id || nextReal.startAt}:${cursor}:${index}`)) % 100000;
  const music = randomBumpMusic(duration);
  const identity = blockIdentityForEntry(target) || blockIdentityForEntry(nextReal) || weeklyBlockIdentity({ id: "station-break", name: GAP_FILLER_BLOCK_NAME });
  const blockName = String(identity.heading || target.weeklyBlockName || nextReal.weeklyBlockName || "DoinkTV").trim();
  const preview = bumpPreviewBackgroundForEntry(target, duration, seed);
  const when = nextReal.startAt ? formatEstTime(nextReal.startAt) : "shortly";
  const heading = sample([
    `tonight on ${blockName}`,
    `next on ${blockName}`,
    `${blockName} promo`,
    "do not leave the frequency"
  ]);
  const lineupLines = lineup
    .slice(0, GAP_FILLER_PROMO_LINEUP_COUNT)
    .map((entry) => {
      const entrySource = sourceForEntry(entry);
      const title = promoProgramTitle(entry, entrySource);
      return title ? `${formatEstTime(entry.startAt)}  ${title}` : "";
    })
    .filter(Boolean);
  const lines = [
    `${blockName} lineup`,
    ...(lineupLines.length ? lineupLines : ["Programming resumes shortly"]),
    `Starts ${when}`
  ].slice(0, 6);

  return {
    id: crypto.randomUUID(),
    type: "bump",
    title: `${blockName}: promo bump`,
    duration,
    randomEligible: false,
    weeklyBlockId: target.weeklyBlockId || nextReal.weeklyBlockId || identity.id || "station-break",
    bump: {
      kind: "gap-filler-promo-bump",
      blockId: target.weeklyBlockId || nextReal.weeklyBlockId || identity.id || "",
      blockName,
      blockStyleId: identity.styleId || "",
      bumpClass: "block-promo-bump",
      heading,
      lines,
      secondsPerLine: Math.max(3.2, Math.round((duration / Math.max(1, lines.length)) * 10) / 10),
      fontSize: preview ? 42 : 52,
      alignment: preview ? sample(["left", "right"]) : sample(["left", "center"]),
      placement: sample(["top", "middle", "bottom"]),
      tone: preview ? "caption" : sample(["caption", "washed"]),
      tintStrength: preview ? 42 : 20,
      creditText: music.creditText,
      creditSize: 17,
      creditPosition: "bottom-right",
      wallpaper: {
        shapes: identity.shapes || sample(["lines", "stripes", "checkerboard", "starburst", "mondrian"]),
        scheme: identity.scheme || sample(["broadcast", "blueprint", "miami", "arcade", "pool"]),
        spacing: 78 + (seed % 72),
        seed
      },
      effects: preview ? sampleMany(identity.effects || BUMP_CLEAN_EFFECTS, 1) : sampleMany(identity.effects || BUMP_CLEAN_EFFECTS, 2),
      effectIntensity: preview ? 10 : 18,
      intentionalGlitch: false,
      presentation: generatedBumpPresentation(false),
      productionStyle: preview ? "split-card" : "schedule-card",
      productionAccent: identity.scheme === "warning" ? "hot" : "cool",
      productionBadge: blockName,
      productionKicker: `starts ${when}`,
      format: "landscape",
      audio: music.path,
      audioStart: music.start,
      ...(preview || {})
    }
  };
}

function gapFillerPromoTarget(nextReal = {}) {
  const source = sourceForEntry(nextReal);
  if (source && !isBumpSource(source)) return nextReal;
  return state.schedule
    .filter((entry) => !entry.gapFiller)
    .filter((entry) => Number(entry.startAt || 0) >= Number(nextReal.startAt || Date.now()))
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0))
    .find((entry) => {
      const entrySource = sourceForEntry(entry);
      return entrySource && !isBumpSource(entrySource);
    }) || nextReal;
}

function gapFillerPromoLineup(nextReal = {}, count = GAP_FILLER_PROMO_LINEUP_COUNT) {
  const target = gapFillerPromoTarget(nextReal);
  const from = Number(nextReal.startAt || target.startAt || Date.now());
  const blockId = target.weeklyBlockId || nextReal.weeklyBlockId || "";
  const seen = new Set();
  const lineup = [];
  for (const entry of state.schedule
    .filter((item) => !item.gapFiller)
    .filter((item) => Number(item.startAt || 0) >= from - 1000)
    .filter((item) => !blockId || item.weeklyBlockId === blockId)
    .sort((a, b) => Number(a.startAt || 0) - Number(b.startAt || 0))) {
    const entrySource = sourceForEntry(entry);
    if (!entrySource || isBumpSource(entrySource)) continue;
    const key = sourceEpisodeKey(entrySource);
    if (seen.has(key)) continue;
    seen.add(key);
    lineup.push({ ...entry, source: entrySource });
    if (lineup.length >= count) break;
  }
  if (!lineup.length && target?.sourceId) {
    const targetSource = sourceForEntry(target);
    if (targetSource && !isBumpSource(targetSource)) lineup.push({ ...target, source: targetSource });
  }
  return lineup;
}

function sourceForEntry(entry = {}) {
  return entry?.source || state.sources.find((source) => source.id === entry?.sourceId) || null;
}

function sourceEpisodeKey(source = {}) {
  return [
    source.archiveId || source.youtubeId || source.id || "",
    source.archiveFile || source.path || source.title || ""
  ].join(":");
}

function promoProgramTitle(entry = {}, source = null) {
  const raw = String(source?.title || entry.title || "").trim();
  const blockName = String(entry.weeklyBlockName || "").trim();
  if (!raw) return "";
  return blockName ? raw.replace(new RegExp(`^${escapeRegExp(blockName)}\\s*:\\s*`, "i"), "").trim() : raw;
}

function bumpPreviewBackgroundForEntry(entry = {}, duration = GAP_FILLER_PROMO_DURATION, seed = 0) {
  const source = sourceForEntry(entry);
  if (!source || isBumpSource(source) || source.type === "youtube") return null;
  if (isClearlyPornographicArchiveCandidate(source)) return null;
  const sourceDuration = Math.max(0, Number(source.duration || entry.duration || 0));
  const windowEnd = Math.max(0, sourceDuration - Math.max(4, duration + 4));
  const start = windowEnd > 12 ? 4 + (seed % Math.floor(windowEnd - 4)) : 0;
  if (source.type === "local") {
    const filePath = mediaPathFromSource(source.path);
    if (source.path && BUMP_PREVIEW_VIDEO_EXTENSIONS.test(source.path) && filePath && existsSync(filePath)) {
      return {
        background: source.path,
        backgroundStart: start
      };
    }
  }
  if (source.type === "internet-archive") {
    const fileUrl = source.fileUrl || (source.archiveId && source.archiveFile ? archiveDownloadUrl(source.archiveId, source.archiveFile) : "");
    if (fileUrl && /^https?:\/\//i.test(fileUrl) && BUMP_PREVIEW_VIDEO_EXTENSIONS.test(fileUrl.split("?")[0])) {
      return {
        backgroundUrl: fileUrl,
        backgroundStart: start
      };
    }
  }
  return null;
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

function generatedBumpPresentation(intentionalGlitch = false) {
  return {
    renderMode: "server-slate",
    cleanDefault: !intentionalGlitch,
    intentionalGlitch: Boolean(intentionalGlitch)
  };
}

function intentionalBumpGlitch(bump = {}) {
  return bump.intentionalGlitch === true || bump.presentation?.intentionalGlitch === true;
}

function sanitizedBumpEffects(effects = [], intentionalGlitch = false) {
  const selected = (Array.isArray(effects) ? effects : [])
    .map(String)
    .filter((effect) => BUMP_SUPPORTED_EFFECTS.has(effect));
  return selected.filter((effect) => intentionalGlitch || !BUMP_GLITCH_EFFECTS.has(effect)).slice(0, intentionalGlitch ? 3 : 2);
}

function normalizedGeneratedBumpIntensity(value, intentionalGlitch = false) {
  const fallback = intentionalGlitch ? 36 : 18;
  const number = Number.isFinite(Number(value)) ? Number(value) : fallback;
  return Math.max(0, Math.min(intentionalGlitch ? 56 : 28, number));
}

function randomAutoBumpVisuals() {
  const deliberateGlitch = Math.random() < 0.14;
  const effectPool = deliberateGlitch ? BUMP_INTENTIONAL_GLITCH_EFFECTS : BUMP_CLEAN_EFFECTS;
  const effectCount = deliberateGlitch ? 2 : Math.floor(Math.random() * 2);
  return {
    intentionalGlitch: deliberateGlitch,
    wallpaper: {
      shapes: sample([
        "circles",
        "diamonds",
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
        "mint",
        "blueprint"
      ]),
      spacing: deliberateGlitch ? 58 + Math.floor(Math.random() * 82) : 86 + Math.floor(Math.random() * 82),
      seed: Math.floor(Math.random() * 100000)
    },
    effects: sampleMany(effectPool, effectCount),
    effectIntensity: deliberateGlitch ? 30 + Math.floor(Math.random() * 15) : 10 + Math.floor(Math.random() * 12)
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
      kind: "auto-bump",
      heading: "coming up",
      lines,
      alignment: "left",
      placement: ["top", "middle", "bottom"][Math.floor(Math.random() * 3)],
      tone: ["classic", "caption", "washed"][Math.floor(Math.random() * 3)],
      seed: visuals.wallpaper.seed,
      wallpaper: visuals.wallpaper,
      effects: visuals.effects,
      effectIntensity: visuals.effectIntensity,
      intentionalGlitch: visuals.intentionalGlitch,
      presentation: generatedBumpPresentation(visuals.intentionalGlitch),
      productionStyle: visuals.intentionalGlitch ? "standard" : "schedule-card",
      productionAccent: "signal",
      productionBadge: "NEXT",
      productionKicker: "coming up",
      creditText: audio.creditText,
      creditPosition: "bottom-right",
      creditSize: 18,
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

function weatherCityForTime(timestamp = Date.now()) {
  const bucket = Math.floor(Number(timestamp || Date.now()) / WEATHER_BUMP_INTERVAL_MS);
  return WEATHER_CITIES[Math.abs(hashString(`weather:${bucket}`)) % WEATHER_CITIES.length];
}

function weatherCodeLabel(code) {
  const labels = {
    0: "clear",
    1: "mostly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "rime fog",
    51: "light drizzle",
    53: "drizzle",
    55: "heavy drizzle",
    61: "light rain",
    63: "rain",
    65: "heavy rain",
    71: "light snow",
    73: "snow",
    75: "heavy snow",
    80: "rain showers",
    81: "showers",
    82: "heavy showers",
    95: "thunderstorms"
  };
  return labels[Number(code)] || "mixed skies";
}

async function weatherForecastForCity(city = WEATHER_CITIES[0]) {
  const cacheKey = `${city.name}:${new Date().toISOString().slice(0, 10)}`;
  const cached = weatherForecastCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < 1000 * 60 * 60 * 6) return cached.forecast;

  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    temperature_unit: "fahrenheit",
    timezone: "auto",
    forecast_days: "7"
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: AbortSignal.timeout(6500) });
    if (!response.ok) throw new Error(`weather ${response.status}`);
    const data = await response.json();
    const daily = data.daily || {};
    const forecast = (daily.time || []).slice(0, 7).map((date, index) => ({
      date,
      label: weatherCodeLabel(daily.weather_code?.[index]),
      high: Math.round(Number(daily.temperature_2m_max?.[index])),
      low: Math.round(Number(daily.temperature_2m_min?.[index])),
      rain: Math.max(0, Math.min(100, Math.round(Number(daily.precipitation_probability_max?.[index] || 0))))
    })).filter((day) => Number.isFinite(day.high) && Number.isFinite(day.low));
    if (!forecast.length) throw new Error("empty forecast");
    weatherForecastCache.set(cacheKey, { cachedAt: Date.now(), forecast });
    return forecast;
  } catch {
    return [];
  }
}

function weatherDayLabel(dateText = "") {
  const date = new Date(`${dateText}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return "Soon";
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function weatherForecastLine(day = {}) {
  const rain = Number(day.rain || 0);
  const wet = rain >= 55 ? `${rain}% rain` : rain >= 20 ? `${rain}% wet` : "mostly dry";
  return `${weatherDayLabel(day.date)}  ${day.high}/${day.low}F  ${String(day.label || "mixed skies").toUpperCase()}  ${wet}`;
}

function weatherForecastSummary(forecast = []) {
  if (!forecast.length) return "FORECAST SIGNAL TEMPORARILY FUZZY";
  const highs = forecast.map((day) => Number(day.high)).filter(Number.isFinite);
  const wettest = forecast.reduce((best, day) => Number(day.rain || 0) > Number(best.rain || 0) ? day : best, forecast[0]);
  const highText = highs.length ? `HIGHS ${Math.min(...highs)}-${Math.max(...highs)}F` : "TEMPERATURES WANDERING";
  return `${highText} / WETTEST: ${weatherDayLabel(wettest.date).toUpperCase()} ${Math.round(Number(wettest.rain || 0))}%`;
}

async function createWeatherBumpSource(startAt = Date.now()) {
  const city = weatherCityForTime(startAt);
  const forecast = await weatherForecastForCity(city);
  const music = randomBumpMusic(WEATHER_BUMP_DURATION);
  const seed = Math.abs(hashString(`weather:${city.name}:${Math.floor(startAt / WEATHER_BUMP_INTERVAL_MS)}`)) % 100000;
  const lines = forecast.length
    ? [
        `${city.name}, ${city.country}`,
        weatherForecastSummary(forecast),
        ...forecast.slice(0, 4).map(weatherForecastLine)
      ]
    : [
        `${city.name}, ${city.country}`,
        "FORECAST SIGNAL TEMPORARILY FUZZY",
        "WEATHER DEPARTMENT WILL TRY AGAIN SHORTLY",
        "KEEP ONE EYE ON THE SKY ANYWAY"
      ];
  return {
    id: crypto.randomUUID(),
    type: "bump",
    title: `Weather: ${city.name}`,
    folderId: "",
    duration: WEATHER_BUMP_DURATION,
    randomEligible: false,
    weatherBumpVersion: WEATHER_BUMP_VERSION,
    bump: {
      kind: "weather-bump",
      bumpClass: "weather-bump",
      heading: "world weather relay",
      lines,
      secondsPerLine: Math.max(3.2, Math.round((WEATHER_BUMP_DURATION / Math.max(1, lines.length)) * 10) / 10),
      fontSize: forecast.length ? 35 : 42,
      alignment: "left",
      placement: "middle",
      tone: "caption",
      tintStrength: 14,
      creditText: music.creditText,
      creditPosition: "bottom-right",
      creditSize: 22,
      wallpaper: {
        shapes: sample(["lines", "argyle", "terrazzo", "mondrian"]),
        scheme: sample(["blueprint", "pool", "mint", "broadcast"]),
        spacing: 84 + (seed % 66),
        seed
      },
      effects: sampleMany(["scanlines", "letterbox", "vhs", "chromatic"], 2),
      effectIntensity: 12,
      intentionalGlitch: false,
      presentation: generatedBumpPresentation(false),
      productionStyle: "schedule-card",
      productionAccent: "cool",
      productionBadge: "WORLD WEATHER",
      productionKicker: `${city.country} / one-week outlook`,
      audio: music.path,
      audioStart: music.start
    },
    weatherCity: city.name,
    generatedAt: Date.now()
  };
}

function queueFadeBreakDetectionForProgram(program = {}) {
  const now = Date.now();
  const entries = activeBroadcastEntries()
    .map((entry) => ({
      ...entry,
      source: state.sources.find((source) => source.id === entry.sourceId)
    }))
    .filter((entry) => entry.source && entryEnd(entry) > now)
    .filter((entry) => fadeBreakEntryEligible(entry, entry.source))
    .slice(0, 3);

  if (program.live?.source && fadeBreakEntryEligible(program.live, program.live.source)) {
    entries.unshift(program.live);
  }
  if (program.next?.source && fadeBreakEntryEligible(program.next, program.next.source)) {
    entries.push(program.next);
  }

  const seen = new Set();
  for (const entry of entries) {
    const source = entry.source;
    if (!source?.id || seen.has(source.id)) continue;
    seen.add(source.id);
    const cached = state.fadeBreaks?.[source.id];
    if (cached?.status === "ready" && Number(cached.planVersion || 0) >= LONGFORM_BREAK_PLAN_VERSION) continue;
    if (cached?.status === "none" && Number(cached.planVersion || 0) >= LONGFORM_BREAK_PLAN_VERSION) continue;
    if (cached?.status === "pending" && fadeBreakDetectionInFlight.has(source.id)) continue;
    if (fadeBreakDetectionInFlight.size >= FADE_BREAK_MAX_CONCURRENT_PROBES) break;
    startFadeBreakDetection(source);
  }
}

function fadeBreakEntryEligible(entry = {}, source = {}) {
  if (!source || isBumpSource(source) || source.type === "youtube") return false;
  if (!["local", "internet-archive"].includes(source.type)) return false;
  if (entry.autoBump || entry.blockBump || entry.fadeBreakBump || entry.fadeBreakResume || entry.fadeBreakSplit) return false;
  const sourceDuration = Number(source.duration || entry.duration || 0);
  const entryDuration = Number(entry.duration || 0);
  if (sourceDuration < LONGFORM_BREAK_MIN_PROGRAM_SECONDS || entryDuration < LONGFORM_BREAK_MIN_PROGRAM_SECONDS) return false;
  const sourceOffset = Number(entry.sourceOffset || 0);
  return sourceOffset < sourceDuration - FADE_BREAK_MIN_REMAINING_SECONDS;
}

function startFadeBreakDetection(source = {}) {
  if (!source.id || fadeBreakDetectionInFlight.has(source.id)) return;
  if (fadeBreakDetectionInFlight.size >= FADE_BREAK_MAX_CONCURRENT_PROBES) return;
  fadeBreakDetectionInFlight.add(source.id);
  state.fadeBreaks ||= {};
  state.fadeBreaks[source.id] = {
    status: "pending",
    planVersion: LONGFORM_BREAK_PLAN_VERSION,
    updatedAt: Date.now()
  };
  timelineSaveNeeded = true;

  detectSourceFadeBreak(source)
    .then(async (breakpoints) => {
      state.fadeBreaks[source.id] = breakpoints.length
        ? { status: "ready", breakAt: breakpoints[0], breakpoints, planVersion: LONGFORM_BREAK_PLAN_VERSION, updatedAt: Date.now() }
        : { status: "none", planVersion: LONGFORM_BREAK_PLAN_VERSION, updatedAt: Date.now() };
      fadeBreakDetectionInFlight.delete(source.id);
      applyDetectedFadeBreaks();
      await saveState();
      broadcastProgram();
    })
    .catch(async (error) => {
      state.fadeBreaks[source.id] = {
        status: "error",
        planVersion: LONGFORM_BREAK_PLAN_VERSION,
        message: String(error.message || "Fade detection failed.").slice(0, 180),
        updatedAt: Date.now()
      };
      fadeBreakDetectionInFlight.delete(source.id);
      await saveState();
    });
}

async function detectSourceFadeBreak(source = {}) {
  const inputPath = fadeBreakInputPath(source);
  if (!inputPath) return null;
  const duration = Number(source.duration || 0);
  const scanStart = FADE_BREAK_MIN_SECONDS;
  const scanDuration = Math.min(FADE_BREAK_SCAN_SECONDS, Math.max(0, duration - scanStart - FADE_BREAK_MIN_REMAINING_SECONDS));
  if (scanDuration < 45) return null;
  const networkInputArgs = source.type === "internet-archive"
    ? ["-reconnect", "1", "-reconnect_streamed", "1", "-reconnect_delay_max", "5", "-rw_timeout", "15000000"]
    : [];
  const stderr = await runFadeBreakProbe([
    "-hide_banner",
    "-nostdin",
    "-loglevel", "info",
    ...networkInputArgs,
    "-ss", String(scanStart),
    "-i", inputPath,
    "-t", String(scanDuration),
    "-an",
    "-vf", "blackdetect=d=0.22:pix_th=0.10",
    "-f", "null",
    "-"
  ], 1000 * 90);
  return parseFadeBreakProbe(stderr, scanStart, duration);
}

function fadeBreakInputPath(source = {}) {
  if (source.type === "internet-archive") return source.fileUrl || (source.archiveId && source.archiveFile ? archiveDownloadUrl(source.archiveId, source.archiveFile) : "");
  if (source.type === "local") {
    const filePath = mediaPathFromSource(source.path);
    return filePath && existsSync(filePath) ? filePath : "";
  }
  return "";
}

function runFadeBreakProbe(args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { windowsHide: true });
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      resolve(stderr);
    }, timeoutMs);
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 20000) stderr = stderr.slice(-20000);
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("exit", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(stderr);
    });
  });
}

function parseFadeBreakProbe(stderr = "", scanStart = FADE_BREAK_MIN_SECONDS, duration = 0) {
  const matches = [...String(stderr).matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)];
  const breakpoints = [];
  let lastAccepted = 0;
  for (const match of matches) {
    const rawStart = Number(match[1]);
    const rawEnd = Number(match[2]);
    const blackDuration = Number(match[3]);
    if (!Number.isFinite(rawEnd) || !Number.isFinite(blackDuration) || blackDuration < 0.18) continue;
    const absoluteEnd = rawEnd < scanStart - 1 ? rawEnd + scanStart : rawEnd;
    if (absoluteEnd < LONGFORM_BREAK_FIRST_AFTER_SECONDS) continue;
    if (duration && absoluteEnd > duration - LONGFORM_BREAK_END_GUARD_SECONDS) continue;
    if (lastAccepted && absoluteEnd - lastAccepted < LONGFORM_BREAK_MIN_SPACING_SECONDS) continue;
    breakpoints.push(Math.round(absoluteEnd));
    lastAccepted = absoluteEnd;
    if (breakpoints.length >= LONGFORM_BREAK_MAX_PER_ENTRY) break;
  }
  return breakpoints;
}

function applyDetectedFadeBreaks() {
  state.fadeBreaks ||= {};
  const changed = applyDetectedFadeBreaksToCollection("schedule") || applyDetectedFadeBreaksToCollection("liveQueue");
  if (!changed) return false;
  timelineSaveNeeded = true;
  refreshAutoBumpLines(state.liveQueue);
  return true;
}

function applyDetectedFadeBreaksToCollection(collectionName) {
  const entries = Array.isArray(state[collectionName]) ? state[collectionName] : [];
  let changed = false;
  const rebuilt = [];
  let timelineShiftMs = 0;
  const now = Date.now();

  for (const originalEntry of entries.sort((a, b) => a.startAt - b.startAt)) {
    const entry = {
      ...originalEntry,
      startAt: Number(originalEntry.startAt || 0) + timelineShiftMs
    };
    const source = state.sources.find((item) => item.id === entry.sourceId);
    const cached = source?.id ? state.fadeBreaks[source.id] : null;
    const plannedBreaks = longformContinuityBreaksForEntry(entry, source, cached, now);
    if (!plannedBreaks.length || !fadeBreakEntryEligible(entry, source)) {
      rebuilt.push(entry);
      continue;
    }

    const sourceOffset = Math.max(0, Number(entry.sourceOffset || 0));
    const entryDuration = Math.max(0, Number(entry.duration || 0));
    let segmentStartOffset = sourceOffset;
    let segmentStartAt = Number(entry.startAt || 0);
    let insertedBreaks = 0;

    for (const breakAt of plannedBreaks) {
      const segmentDuration = Math.round(breakAt - segmentStartOffset);
      const breakStartAt = segmentStartAt + segmentDuration * 1000;
      if (segmentDuration < FADE_BREAK_MIN_SECONDS || breakStartAt <= now + 10000) continue;

      rebuilt.push({
        ...entry,
        id: insertedBreaks ? crypto.randomUUID() : entry.id,
        startAt: segmentStartAt,
        duration: segmentDuration,
        sourceOffset: segmentStartOffset,
        fadeBreakSplit: true,
        fadeBreakAt: breakAt,
        longformContinuityBreak: true
      });

      const cluster = createLongformContinuityBreakCluster(source, entry, {
        breakAt,
        breakIndex: insertedBreaks,
        startAt: breakStartAt
      });
      state.sources.push(...cluster.sources);
      rebuilt.push(...cluster.entries);
      segmentStartOffset = breakAt;
      segmentStartAt = breakStartAt + cluster.duration * 1000;
      timelineShiftMs += cluster.duration * 1000;
      insertedBreaks += 1;
    }

    if (insertedBreaks) {
      rebuilt.push({
        ...entry,
        id: crypto.randomUUID(),
        startAt: segmentStartAt,
        duration: Math.max(5, Math.round(sourceOffset + entryDuration - segmentStartOffset)),
        sourceOffset: segmentStartOffset,
        fadeBreakResume: true,
        fadeBreakOf: entry.id
      });
      changed = true;
    } else {
      rebuilt.push(entry);
    }
  }

  if (changed) state[collectionName] = rebuilt.sort((a, b) => a.startAt - b.startAt);
  return changed;
}

function longformContinuityBreaksForEntry(entry = {}, source = {}, cached = {}, now = Date.now()) {
  return planLongformContinuityBreaks(entry, cached, {
    now,
    firstAfterSeconds: LONGFORM_BREAK_FIRST_AFTER_SECONDS,
    minSpacingSeconds: LONGFORM_BREAK_MIN_SPACING_SECONDS,
    endGuardSeconds: LONGFORM_BREAK_END_GUARD_SECONDS,
    maxBreaks: LONGFORM_BREAK_MAX_PER_ENTRY
  });
}

function createFadeBreakBumpSource(source = {}, entry = {}) {
  return createLongformContinuityBumpSource(source, entry, {
    duration: FADE_BREAK_BUMP_DURATION,
    phase: "identity",
    breakIndex: 0
  });
}

function createLongformContinuityBreakCluster(source = {}, entry = {}, options = {}) {
  const blockIdentity = blockIdentityForEntry(entry) || weeklyBlockIdentity({ id: "station", name: "DoinkTV" });
  const phases = [
    { phase: "out", duration: 6 },
    { phase: "identity", duration: Math.min(FADE_BREAK_BUMP_DURATION + 6, LONGFORM_BREAK_CLUSTER_MAX_SECONDS - 12) },
    { phase: "return", duration: 6 }
  ];
  const sources = phases.map((phaseOptions) => createLongformContinuityBumpSource(source, entry, {
    ...phaseOptions,
    breakIndex: options.breakIndex || 0,
    breakAt: options.breakAt,
    blockIdentity
  }));
  const entries = [];
  let cursor = Number(options.startAt || Date.now());
  for (const bumpSource of sources) {
    entries.push({
      id: crypto.randomUUID(),
      sourceId: bumpSource.id,
      title: bumpSource.title,
      startAt: cursor,
      duration: bumpSource.duration,
      queuedAt: Date.now(),
      autoBump: true,
      fadeBreakBump: true,
      longformContinuityBreak: true,
      fadeBreakOf: entry.id,
      weeklyBlockId: entry.weeklyBlockId || "",
      weeklyBlockName: entry.weeklyBlockName || ""
    });
    cursor += bumpSource.duration * 1000;
  }
  return {
    sources,
    entries,
    duration: sources.reduce((sum, bumpSource) => sum + Number(bumpSource.duration || 0), 0)
  };
}

function createLongformContinuityBumpSource(source = {}, entry = {}, options = {}) {
  const duration = Math.max(4, Math.min(36, Math.round(Number(options.duration || FADE_BREAK_BUMP_DURATION))));
  const music = randomBumpMusic(duration);
  const blockName = entry.weeklyBlockName || "";
  const identity = options.blockIdentity || blockIdentityForEntry(entry) || weeklyBlockIdentity({ id: "station", name: "DoinkTV" });
  const continuity = stationContinuityBrain({ ...entry, source, title: entry.title || source.title }, null);
  const returnLine = source.title ? `WE RETURN TO: ${source.title}` : "WE NOW RETURN TO THE PROGRAM";
  const phase = options.phase || "identity";
  const phaseCopy = longformContinuityPhaseCopy(phase, { source, entry, identity, continuity, returnLine });
  const seed = Math.abs(hashString(`longform:${source.id}:${entry.id}:${phase}:${options.breakAt || 0}:${options.breakIndex || 0}`)) % 100000;
  return {
    id: crypto.randomUUID(),
    type: "bump",
    title: `${identity.heading || blockName || "DoinkTV"}: ${phaseCopy.title}`,
    duration,
    randomEligible: false,
    weeklyBlockId: entry.weeklyBlockId || "",
    bump: {
      kind: "fade-break-bump",
      bumpClass: "fade-break",
      heading: phaseCopy.heading,
      lines: phaseCopy.lines,
      alignment: identity.alignment || sample(["left", "center", "right"]),
      placement: phase === "return" ? "middle" : identity.placement || sample(["top", "middle", "bottom"]),
      tone: identity.tone || sample(["classic", "caption", "washed"]),
      fontSize: phase === "identity" ? Math.max(38, Number(identity.fontSize || 52) - 8) : 42,
      secondsPerLine: Math.max(1.3, Math.round((duration / Math.max(1, phaseCopy.lines.length)) * 10) / 10),
      tintStrength: phase === "identity" ? 26 : 18,
      creditText: music.creditText,
      creditSize: 18,
      creditPosition: "bottom-right",
      wallpaper: {
        shapes: identity.shapes || sample(["lines", "stripes", "starburst", "diamonds", "argyle"]),
        scheme: identity.scheme || sample(["broadcast", "warning", "midnight", "blueprint", "ruby"]),
        spacing: 82 + (seed % 62),
        seed
      },
      effects: sampleMany(identity.effects?.length ? identity.effects : ["vhs", "scanlines", "chromatic", "letterbox"], phase === "identity" ? 2 : 1),
      effectIntensity: phase === "identity" ? 22 : 12,
      intentionalGlitch: false,
      presentation: generatedBumpPresentation(false),
      productionStyle: phase === "identity" ? "promo-card" : "lower-third",
      productionAccent: "signal",
      productionBadge: identity.heading || blockName || "DOINKTV",
      productionKicker: phaseCopy.kicker,
      audio: music.path,
      audioStart: music.start
    }
  };
}

function longformContinuityPhaseCopy(phase, { source = {}, identity = {}, continuity = {}, returnLine = "" } = {}) {
  const blockHeading = identity.heading || continuity.blockPack?.label || "DOINKTV";
  const tagline = identity.taglines?.length ? sample(identity.taglines) : continuity.stationVoice?.slogan || "STATION CONTINUITY";
  if (phase === "out") {
    return {
      title: "break out",
      heading: sample(["signal break", "quick station break", "hold that tape"]),
      kicker: "break begins",
      lines: [blockHeading, tagline].filter(Boolean)
    };
  }
  if (phase === "return") {
    return {
      title: "return sting",
      heading: sample(["we now return", "back to the tape", "program resumes"]),
      kicker: "clean return",
      lines: [returnLine, blockHeading].filter(Boolean)
    };
  }
  return {
    title: "continuity break",
    heading: continuity.stationVoice?.label || sample(["doinktv continuity", "station identity", "still on this frequency"]),
    kicker: "longform continuity",
    lines: [
      blockHeading,
      tagline,
      source.title ? `NOW PLAYING: ${source.title}` : "",
      returnLine
    ].filter(Boolean).slice(0, 5)
  };
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
  const background = normalizeBumpBackground(body.background);
  const bumpKind = BUMP_CLASSES.some((item) => item.id === body.bumpClass) ? body.bumpClass : "manual-bump";
  const intentionalGlitch = body.intentionalGlitch === true || body.presentation?.intentionalGlitch === true;

  const source = {
    id: crypto.randomUUID(),
    type: "bump",
    title: String(body.title || "Manual bump").trim() || "Manual bump",
    folderId: "",
    duration: Math.round(duration),
    bump: {
      kind: bumpKind,
      heading: String(body.heading || "bump").trim() || "bump",
      lines: lines.length ? lines : [{ time: "", title: "DoinkTV continues shortly" }],
      secondsPerLine: Math.max(0.5, Math.min(30, Number(body.secondsPerLine) || Math.max(1, duration / Math.max(1, lines.length || 1)))),
      fontSize: Math.max(18, Math.min(120, Number(body.fontSize) || 58)),
      alignment: ["left", "center", "right"].includes(body.alignment) ? body.alignment : "left",
      placement: ["top", "middle", "bottom"].includes(body.placement) ? body.placement : "middle",
      tone: ["classic", "caption", "washed"].includes(body.tone) ? body.tone : "classic",
      tintStrength: Math.max(0, Math.min(100, Number(body.tintStrength) || 0)),
      creditText: normalizeBumpCreditText(body.creditText, audio.path, !body.audio),
      creditPosition: String(body.creditPosition || "bottom-right"),
      creditFont: String(body.creditFont || "Arial, Helvetica, sans-serif"),
      creditSize: Math.max(10, Math.min(72, Number(body.creditSize) || 24)),
      format: String(body.format || "landscape"),
      seed: Number(body.wallpaper?.seed || body.seed || Math.floor(Math.random() * 100000)),
      wallpaper: body.wallpaper || randomAutoBumpVisuals().wallpaper,
      effects: Array.isArray(body.effects) ? body.effects.slice(0, 2) : [],
      effectIntensity: Math.max(0, Math.min(100, Number(body.effectIntensity) || 0)),
      intentionalGlitch,
      presentation: body.presentation || generatedBumpPresentation(intentionalGlitch),
      productionStyle: BUMP_PRODUCTION_STYLES.has(body.productionStyle) ? body.productionStyle : "standard",
      productionAccent: BUMP_PRODUCTION_ACCENTS.has(body.productionAccent) ? body.productionAccent : "auto",
      productionBadge: String(body.productionBadge || "").trim().slice(0, 32),
      productionKicker: String(body.productionKicker || "").trim().slice(0, 80),
      audio: audio.path,
      audioStart: audio.start,
      background,
      performanceCueId: String(body.performanceCueId || ""),
      performanceSceneId: String(body.performanceSceneId || "")
    },
    generatedAt: Date.now()
  };
  state.sources.push(source);
  return source;
}

function normalizeBumpBackground(backgroundPath = "") {
  const value = String(backgroundPath || "").trim();
  if (!value || !BUMP_BACKGROUND_EXTENSIONS.test(value)) return "";
  const filePath = mediaPathFromSource(value);
  return filePath && existsSync(filePath) ? value : "";
}

function randomBumpMusic(requiredSeconds = AUTO_BUMP_DURATION) {
  const music = state.bumpMusic?.length ? state.bumpMusic[Math.floor(Math.random() * state.bumpMusic.length)] : null;
  if (!music) return { path: "", start: 0, title: "", artist: "", creditText: "" };
  return randomBumpMusicClip(music, requiredSeconds);
}

function randomBumpMusicClip(music, requiredSeconds = AUTO_BUMP_DURATION) {
  const duration = Number(music.duration || 0);
  const safeRequiredSeconds = Math.max(0, Number(requiredSeconds) || 0);
  const maxStart = Math.max(0, duration - safeRequiredSeconds);
  return {
    path: music.path,
    start: maxStart > 0 ? Math.round(Math.random() * maxStart * 10) / 10 : 0,
    title: bumpMusicTitle(music),
    artist: BUMP_MUSIC_ARTIST,
    creditText: bumpMusicCredit(music)
  };
}

function bumpMusicTitle(music = {}) {
  const raw = String(music.title || music.name || "Doink Wizard").replace(/\.[^/.]+$/, "").trim();
  const parts = raw.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
  const withoutArtist = parts[0]?.toLowerCase() === BUMP_MUSIC_ARTIST.toLowerCase() ? parts.slice(1) : parts;
  const likelyTitle = withoutArtist.length > 1 ? withoutArtist[withoutArtist.length - 1] : withoutArtist[0] || raw;
  return likelyTitle
    .replace(/[_-]+/g, " ")
    .replace(/^\d+\s+/, "")
    .replace(/\s*\[(?:cl|clean|clip)\]\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bumpMusicCredit(music = {}) {
  const title = bumpMusicTitle(music);
  return title ? `${title}\n${BUMP_MUSIC_ARTIST}` : "";
}

function bumpMusicForPath(audioPath = "") {
  const value = String(audioPath || "");
  if (!value) return null;
  return (state.bumpMusic || []).find((music) => music.path === value) || null;
}

function bumpMusicCreditForPath(audioPath = "") {
  const music = bumpMusicForPath(audioPath);
  return music ? bumpMusicCredit(music) : "";
}

function normalizeBumpCreditText(creditText = "", audioPath = "", forceServerMusicCredit = false) {
  const text = String(creditText || "").trim();
  const musicCredit = bumpMusicCreditForPath(audioPath);
  if (!musicCredit) return text;
  if (forceServerMusicCredit) return musicCredit;
  if (!text || /server library|unknown artist|^song:/im.test(text)) return musicCredit;
  return text;
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
    source.bump.creditText = clip.creditText || source.bump.creditText || "";
    source.bump.creditPosition = "bottom-right";
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
    artist: BUMP_MUSIC_ARTIST,
    path: `/media/bump-music/${encodeURIComponent(fileName).replace(/%2F/g, "/")}`,
    duration: await readAudioDuration(path.join(BUMP_MUSIC_DIR, fileName))
  }))))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function bumpGeneratorAssets() {
  await refreshBumpMusic();
  return {
    classes: BUMP_CLASSES,
    music: state.bumpMusic,
    backgrounds: await listBumpBackgroundAssets()
  };
}

async function loadDjSoundboardManifest() {
  try {
    const manifest = JSON.parse(await readFile(DJ_SOUNDBOARD_MANIFEST, "utf8"));
    manifest.sounds = Array.isArray(manifest.sounds) ? manifest.sounds : [];
    manifest.groups = manifest.groups || {};
    return manifest;
  } catch {
    return await buildDjSoundboardManifestFromFiles();
  }
}

async function buildDjSoundboardManifestFromFiles() {
  const groups = {
    quotes: { label: "Quotes", color: "#f2b84a" },
    radio: { label: "Radio Dirt", color: "#68c3b7" },
    crowd: { label: "Crowd", color: "#d68a37" },
    scratches: { label: "Scratches", color: "#c968ff" },
    sfx: { label: "SFX", color: "#7db7ff" },
    sirens: { label: "Sirens", color: "#ff715f" },
    stings: { label: "Stings", color: "#8fd06d" },
    misc: { label: "Misc", color: "#a9b4bd" }
  };
  try {
    const files = await readdir(DJ_SOUNDBOARD_DIR, { withFileTypes: true });
    const sounds = files
      .filter((entry) => entry.isFile() && /\.(wav|mp3|m4a|ogg|flac)$/i.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => {
        const base = entry.name.replace(/\.[^.]+$/, "");
        const clean = base.replace(/^\d+[-_ ]*/, "");
        const [maybeGroup, ...labelParts] = clean.split(/[-_]+/);
        const group = groups[maybeGroup] ? maybeGroup : "misc";
        const labelSource = group === "misc" ? clean : labelParts.join(" ");
        return {
          id: clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || base,
          label: titleCase(labelSource || clean),
          group,
          path: `/media/dj-soundboard/${encodeURIComponent(entry.name)}`,
          duration: 8
        };
      });
    return { version: 1, groups, sounds };
  } catch {
    return { version: 1, groups, sounds: [] };
  }
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function djSoundboardSample(soundId) {
  const manifest = await loadDjSoundboardManifest();
  const sound = manifest.sounds.find((item) => item.id === soundId);
  if (!sound) throw new Error("Unknown soundboard sound.");
  const soundPath = String(sound.path || "");
  if (!soundPath.startsWith("/media/dj-soundboard/")) throw new Error("Invalid soundboard path.");
  const filePath = mediaPathFromSource(soundPath);
  if (!filePath || !existsSync(filePath)) throw new Error("Soundboard file is missing.");
  const group = manifest.groups[sound.group] || {};
  return {
    id: sound.id,
    label: sound.label || sound.id,
    group: sound.group || "misc",
    groupLabel: group.label || sound.group || "Misc",
    color: group.color || "#f2b84a",
    path: soundPath,
    duration: Math.max(1, Math.min(60, Number(sound.duration || 8)))
  };
}

async function listBumpBackgroundAssets() {
  await mkdir(MEDIA_DIR, { recursive: true });
  const assets = [];
  await collectBumpBackgroundAssets(MEDIA_DIR, "", assets);
  return assets.sort((a, b) => a.name.localeCompare(b.name));
}

async function collectBumpBackgroundAssets(directory, relativeDirectory, assets) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      if (relativeDirectory === "" && entry.name === "bump-music") continue;
      await collectBumpBackgroundAssets(path.join(directory, entry.name), path.join(relativeDirectory, entry.name), assets);
      continue;
    }
    if (!entry.isFile() || !BUMP_BACKGROUND_EXTENSIONS.test(entry.name)) continue;
    const relativePath = path.join(relativeDirectory, entry.name).replace(/\\/g, "/");
    assets.push({
      name: entry.name.replace(/\.[^/.]+$/, ""),
      fileName: entry.name,
      path: `/media/${encodeMediaPath(relativePath)}`,
      type: /\.(mp4|mov|m4v|webm)$/i.test(entry.name) ? "video" : "image"
    });
  }
}

function encodeMediaPath(relativePath) {
  return String(relativePath)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
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
    sourceOffset: Math.max(0, Number(item.sourceOffset || 0)),
    queuedAt: item.queuedAt || now,
    autoQueued: item.autoQueued,
    weatherBump: item.weatherBump,
    weatherBumpSplit: item.weatherBumpSplit,
    weatherBumpResume: item.weatherBumpResume,
    weatherBumpOf: item.weatherBumpOf,
    fadeBreakSplit: item.fadeBreakSplit,
    fadeBreakResume: item.fadeBreakResume,
    fadeBreakOf: item.fadeBreakOf,
    fadeBreakAt: item.fadeBreakAt
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

function weatherBumpEntries(entries = []) {
  return engineWeatherBumpEntries(entries, {
    sourceFor: (entry) => state.sources.find((source) => source.id === entry.sourceId)
  });
}

async function createWeatherBumpEntry(startAt = Date.now(), now = Date.now()) {
  const bumpSource = await createWeatherBumpSource(startAt);
  state.sources.push(bumpSource);
  return {
    id: crypto.randomUUID(),
    sourceId: bumpSource.id,
    title: bumpSource.title,
    startAt,
    duration: WEATHER_BUMP_DURATION,
    queuedAt: now,
    autoBump: true,
    weatherBump: true
  };
}

async function ensureWeatherBumps() {
  const prunedSchedule = pruneOutdatedWeatherBumpsInCollection("schedule");
  const prunedQueue = pruneOutdatedWeatherBumpsInCollection("liveQueue");
  const scheduleChanged = await ensureWeatherBumpsInCollection("schedule");
  const queueChanged = state.broadcastMode === "queue" ? await ensureWeatherBumpsInCollection("liveQueue") : false;
  if (scheduleChanged || queueChanged || prunedSchedule || prunedQueue) {
    state.schedule.sort((a, b) => a.startAt - b.startAt);
    state.liveQueue.sort((a, b) => a.startAt - b.startAt);
    pruneUnusedBumpSources();
  }
  return scheduleChanged || queueChanged || prunedSchedule || prunedQueue;
}

function pruneOutdatedWeatherBumpsInCollection(collectionName) {
  const entries = Array.isArray(state[collectionName]) ? state[collectionName] : [];
  const before = entries.length;
  const now = Date.now();
  state[collectionName] = entries.filter((entry) => {
    if (!entry.weatherBump || entryEnd(entry) <= now - 30000) return true;
    const source = state.sources.find((item) => item.id === entry.sourceId);
    return Number(source?.weatherBumpVersion || 0) >= WEATHER_BUMP_VERSION;
  });
  return state[collectionName].length !== before;
}

async function ensureWeatherBumpsInCollection(collectionName) {
  const now = Date.now();
  let changed = false;
  const targets = planWeatherBumpTargets(state[collectionName], {
    now,
    horizonMs: WEATHER_BUMP_LOOKAHEAD_MS,
    intervalMs: WEATHER_BUMP_INTERVAL_MS,
    minGapMs: WEATHER_BUMP_MIN_GAP_MS,
    sourceFor: (entry) => state.sources.find((source) => source.id === entry.sourceId)
  });
  for (const target of targets) {
    if (await insertWeatherBumpInCollection(collectionName, target, now)) {
      changed = true;
    }
  }
  return changed;
}

async function insertWeatherBumpInCollection(collectionName, targetStartAt, now = Date.now()) {
  const entries = state[collectionName]
    .filter((entry) => entryEnd(entry) > now)
    .sort((a, b) => a.startAt - b.startAt);
  const bumpEntry = await createWeatherBumpEntry(targetStartAt, now);
  const plan = planTimedBumpInsertion(entries, {
    targetStartAt,
    duration: WEATHER_BUMP_DURATION,
    now,
    minSegmentSeconds: 8 * 60,
    sourceFor: (entry) => state.sources.find((source) => source.id === entry.sourceId)
  });
  if (plan.mode === "gap") {
    state[collectionName].push(bumpEntry);
    return true;
  }

  if (plan.mode !== "split") {
    state.sources = state.sources.filter((item) => item.id !== bumpEntry.sourceId);
    return false;
  }

  const firstEntry = {
    ...plan.containing,
    duration: plan.firstDuration,
    weatherBumpSplit: true
  };
  const resumeEntry = {
    ...plan.containing,
    id: crypto.randomUUID(),
    startAt: plan.resumeStartAt,
    duration: plan.resumeDuration,
    sourceOffset: plan.resumeSourceOffset,
    weatherBumpResume: true,
    weatherBumpOf: plan.containing.id
  };
  state[collectionName] = state[collectionName]
    .filter((entry) => entry.id !== plan.containing.id)
    .concat(firstEntry, bumpEntry, resumeEntry)
    .sort((a, b) => a.startAt - b.startAt);
  return true;
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
  const queuedSourceIds = new Set([...state.liveQueue, ...state.schedule].map((entry) => entry.sourceId));
  state.sources = state.sources.filter((source) => !isBumpSource(source) || queuedSourceIds.has(source.id));
}

function entryEnd(entry) {
  return engineEntryEnd(entry);
}

function entriesOverlap(first, second) {
  return engineEntriesOverlap(first, second);
}

function protectQueueEntryAgainstSchedule(entry, scheduled = state.schedule) {
  return protectOverrideEntryAgainstSchedule(entry, scheduled);
}

function activeBroadcastEntries() {
  return engineActiveBroadcastEntries(state);
}

function broadcastProgram() {
  const payload = `data: ${JSON.stringify(publicProgram())}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function maintainBroadcastTimeline() {
  const gapFilled = maintainScheduledGapFillers();
  if (state.broadcastMode !== "queue") {
    if (gapFilled) timelineSaveNeeded = true;
    return gapFilled;
  }
  const changed = maintainLiveQueueContinuity();
  const backfilled = backfillLiveQueue();
  if (gapFilled) timelineSaveNeeded = true;
  if (changed || backfilled) timelineSaveNeeded = true;
  return gapFilled || changed || backfilled;
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
  return hlsController.sync();
}

function hlsHandoffProgram(program = {}, playout = hlsPlayout) {
  const live = program.live;
  const next = hlsNextPlayoutProgram(live);
  if (!live || !next || !next.source) return null;
  if (playout.id !== live.id) return null;
  const remainingMs = entryEnd(live) - Date.now();
  if (remainingMs < -250 || remainingMs > HLS_HANDOFF_LEAD_MS) return null;
  return {
    ...next,
    startAt: Date.now(),
    offset: 0,
    sourceOffset: Math.max(0, Number(next.sourceOffset || 0)),
    earlyHandoff: true,
    handoffFromId: live.id
  };
}

function hlsNextPlayoutProgram(live = null) {
  return engineNextPlayoutProgram(state, live, {
    now: Date.now(),
    blockIdentityForEntry
  });
}

async function isHlsPlaylistFresh(maxAgeMs = 10000) {
  return hlsController.isPlaylistFresh(maxAgeMs);
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

async function startHlsPlayout(live, options = {}) {
  return hlsController.start(live, options);
}

async function pruneHlsDirectory(maxAgeMs = 1000 * 60 * 5) {
  return hlsController.pruneDirectory(maxAgeMs);
}

function stopHlsPlayout() {
  return hlsController.stop();
}

function hlsArgsForProgram(live) {
  const id = live.id.replace(/[^a-zA-Z0-9_-]/g, "");
  const remaining = Math.max(1, Math.ceil((live.duration || 3600) - (live.offset || 0)));
  const mediaOffset = Math.max(0, Number(live.sourceOffset || 0) + Number(live.offset || 0));
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
        "-ss", String(mediaOffset),
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
  const bump = normalizedBumpForRender(source.bump || {});
  const videoArgs = bumpBackgroundInputArgs(bump);
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
    ...videoArgs,
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

function bumpBackgroundInputArgs(bump = {}) {
  const backgroundStart = String(Math.max(0, Number(bump.backgroundStart) || 0));
  const backgroundPath = bump.background ? mediaPathFromSource(bump.background) : "";
  if (backgroundPath && existsSync(backgroundPath) && BUMP_BACKGROUND_EXTENSIONS.test(backgroundPath)) {
    return /\.(mp4|mov|m4v|webm)$/i.test(backgroundPath)
      ? ["-stream_loop", "-1", "-ss", backgroundStart, "-re", "-i", backgroundPath]
      : ["-loop", "1", "-framerate", "30", "-re", "-i", backgroundPath];
  }
  const backgroundUrl = String(bump.backgroundUrl || "");
  if (/^https?:\/\//i.test(backgroundUrl) && BUMP_PREVIEW_VIDEO_EXTENSIONS.test(backgroundUrl.split("?")[0])) {
    return [
      "-reconnect", "1",
      "-reconnect_streamed", "1",
      "-reconnect_delay_max", "5",
      "-rw_timeout", "15000000",
      "-ss", backgroundStart,
      "-re",
      "-i", backgroundUrl
    ];
  }
  return ["-f", "lavfi", "-re", "-i", "color=c=0x090b10:s=1280x720:r=30"];
}

function normalizedBumpForRender(bump = {}) {
  const manual = bump.kind === "manual-bump";
  if (manual) return bump;
  const intentionalGlitch = intentionalBumpGlitch(bump);
  return {
    ...bump,
    creditText: bumpMusicCreditForPath(bump.audio) || bump.creditText || "",
    creditPosition: "bottom-right",
    productionStyle: BUMP_PRODUCTION_STYLES.has(bump.productionStyle) ? bump.productionStyle : defaultProductionStyleForBump(bump),
    productionAccent: BUMP_PRODUCTION_ACCENTS.has(bump.productionAccent) ? bump.productionAccent : "auto",
    productionBadge: String(bump.productionBadge || defaultProductionBadgeForBump(bump)).trim().slice(0, 32),
    productionKicker: String(bump.productionKicker || defaultProductionKickerForBump(bump)).trim().slice(0, 80),
    effects: sanitizedBumpEffects(bump.effects, intentionalGlitch),
    effectIntensity: normalizedGeneratedBumpIntensity(bump.effectIntensity, intentionalGlitch),
    presentation: {
      ...(bump.presentation || {}),
      ...generatedBumpPresentation(intentionalGlitch)
    }
  };
}

function defaultProductionStyleForBump(bump = {}) {
  if (bump.kind === "gap-filler-promo-bump") return bump.background || bump.backgroundUrl ? "split-card" : "schedule-card";
  if (bump.kind === "auto-bump") return "schedule-card";
  if (bump.kind === "block-bump") return bump.bumpClass === "intro" ? "promo-card" : "lower-third";
  if (bump.kind === "fade-break-bump") return "promo-card";
  return "standard";
}

function defaultProductionBadgeForBump(bump = {}) {
  if (bump.kind === "gap-filler-promo-bump") return bump.blockName || "PROMO";
  if (bump.kind === "auto-bump") return "NEXT";
  if (bump.kind === "block-bump") return bump.blockName || "DOINKTV";
  if (bump.kind === "fade-break-bump") return bump.blockName || "DOINKTV";
  return "";
}

function defaultProductionKickerForBump(bump = {}) {
  if (bump.kind === "gap-filler-promo-bump") return "station promo";
  if (bump.kind === "auto-bump") return "coming up";
  if (bump.kind === "block-bump") return bump.bumpClass === "intro" ? "block premiere" : "station identification";
  if (bump.kind === "fade-break-bump") return "program resumes after this";
  return "";
}

function normalizeGeneratedBumpsInState() {
  let changed = false;
  for (const source of state.sources || []) {
    if (source.type !== "bump" || !source.bump) continue;
    const credit = bumpMusicCreditForPath(source.bump.audio);
    if (credit && shouldReplaceBumpCredit(source.bump)) {
      source.bump.creditText = credit;
      source.bump.creditPosition = "bottom-right";
      changed = true;
    }
    if (source.bump.kind === "manual-bump") continue;
    const normalized = normalizedBumpForRender(source.bump);
    if (String(source.bump.creditText || "") !== String(normalized.creditText || "")) {
      source.bump.creditText = normalized.creditText;
      changed = true;
    }
    if (source.bump.creditPosition !== "bottom-right") {
      source.bump.creditPosition = "bottom-right";
      changed = true;
    }
    for (const key of ["productionStyle", "productionAccent", "productionBadge", "productionKicker"]) {
      if (String(source.bump[key] || "") !== String(normalized[key] || "")) {
        source.bump[key] = normalized[key];
        changed = true;
      }
    }
    if (JSON.stringify(source.bump.effects || []) !== JSON.stringify(normalized.effects || [])) {
      source.bump.effects = normalized.effects;
      changed = true;
    }
    if (Number(source.bump.effectIntensity || 0) !== Number(normalized.effectIntensity || 0)) {
      source.bump.effectIntensity = normalized.effectIntensity;
      changed = true;
    }
    const presentation = JSON.stringify(source.bump.presentation || {});
    const nextPresentation = JSON.stringify(normalized.presentation || {});
    if (presentation !== nextPresentation) {
      source.bump.presentation = normalized.presentation;
      changed = true;
    }
    if (source.bump.intentionalGlitch !== normalized.presentation.intentionalGlitch) {
      source.bump.intentionalGlitch = normalized.presentation.intentionalGlitch;
      changed = true;
    }
  }
  return changed;
}

function shouldReplaceBumpCredit(bump = {}) {
  if (bump.kind !== "manual-bump") return true;
  if (bump.performanceCueId || bump.performanceSceneId) return true;
  const text = String(bump.creditText || "").trim();
  if (!text) return true;
  return /server library|unknown artist|standby filler|no dead air|block promo|preview clip|signal will resume|continuity dept|cartoon relay|archive feed|station id|block start/i.test(text);
}

function isManualBump(bump = {}) {
  return Boolean(bump.secondsPerLine || bump.fontSize || bump.creditText || bump.tintStrength || bump.format || bump.background || bump.backgroundUrl);
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
  const productionStyle = BUMP_PRODUCTION_STYLES.has(bump.productionStyle) ? bump.productionStyle : "standard";
  const fontSize = Math.max(18, Math.min(120, Number(bump.fontSize) || 58));
  const lineHeight = Math.round(fontSize * 1.28);
  const pad = Math.round(720 * 0.075);
  const textWidth = productionStyle === "standard"
    ? Math.min(1280 - pad * 2, Math.round(1280 * 0.62), fontSize * 16)
    : Math.min(760, 1280 - pad * 4, fontSize * 18);
  const textX = productionStyle !== "standard" && alignment === "left"
    ? pad + 42
    : alignment === "right" ? 1280 - pad : alignment === "center" ? 640 : pad;
  const textXExpr = textXExpression(textX, alignment);
  const cardX = alignment === "right" ? 1280 - pad - textWidth : alignment === "center" ? 640 - textWidth / 2 : pad;
  const textMotion = intentionalBumpGlitch(bump) ? "+sin(t*0.9)*3" : "";
  const secondsPerLine = Math.max(0.5, Number(bump.secondsPerLine) || 2.5);
  const safeLines = lines.map((line) => String(line || " ")).filter((line) => line.trim()).length ? lines : [" "];
  const staticProductionLines = ["schedule-card", "split-card"].includes(productionStyle);
  const renderedLines = staticProductionLines ? safeLines.slice(0, 6) : safeLines;
  const maxWrapped = 4;
  const creditLines = String(bump.creditText || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 4);
  const hasBackground = Boolean(bump.background || bump.backgroundUrl);
  const filters = hasBackground
    ? [
        "scale=1280:720:force_original_aspect_ratio=increase",
        "crop=1280:720",
        "format=yuv420p",
        "drawbox=x=0:y=0:w=1280:h=720:color=black@0.18:t=fill"
      ]
    : [
        "format=yuv420p",
        `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[0]}@1:t=fill`,
        `drawbox=x=0:y=0:w=1280:h=720:color=${palette.bg[1]}@0.36:t=fill`,
        ...wallpaperFilters(wallpaper, palette)
      ];

  if (tone === "classic") filters.push(`drawbox=x=0:y=0:w=1280:h=720:color=black@${Math.max(0, Math.min(1, Number(bump.tintStrength || 0) / 100))}:t=fill`);
  if (tone === "washed") filters.push("drawbox=x=0:y=0:w=1280:h=720:color=white@0.08:t=fill");
  if (productionStyle !== "standard") filters.push(...productionChromeFilters(bump, { font, palette, fontSize }));

  renderedLines.forEach((rawLine, index) => {
    const sourceLine = typeof rawLine === "string" ? rawLine : rawLine?.title || " ";
    const enable = staticProductionLines ? "" : `:enable='between(mod(t\\,${secondsPerLine * safeLines.length})\\,${index * secondsPerLine}\\,${(index + 1) * secondsPerLine})'`;
    const wrapped = wrapDrawTextLine(sourceLine, Math.max(8, Math.floor(textWidth / (fontSize * 0.56)))).slice(0, maxWrapped);
    const blockHeight = wrapped.length * lineHeight;
    const productionY = productionStyle === "lower-third"
      ? 720 - pad - Math.round(fontSize * 2.4)
      : productionStyle === "promo-card"
        ? Math.max(132, Math.round(360 - blockHeight / 2))
        : productionStyle === "schedule-card" || productionStyle === "split-card"
          ? 150 + index * Math.round(lineHeight * 1.08)
          : null;
    const y = productionY ?? (placement === "top" ? pad : placement === "bottom" ? 720 - pad - blockHeight : Math.round(360 - blockHeight / 2));
    if (tone === "caption" && productionStyle === "standard") {
      const cardPad = Math.round(fontSize * 0.72);
      filters.push(`drawbox=x=${Math.round(cardX - cardPad)}:y=${Math.round(y - cardPad * 0.7)}:w=${Math.round(textWidth + cardPad * 2)}:h=${Math.round(blockHeight + cardPad * 1.25)}:color=black@0.68:t=fill${enable}`);
    }
    wrapped.forEach((line, lineIndex) => {
      const lineSize = staticProductionLines && index === 0 ? Math.round(fontSize * 1.1) : fontSize;
      const lineColor = staticProductionLines && index === 0 ? productionAccentColor(bump, palette) : "0xf4f0e8";
      filters.push(`drawtext=fontfile='${font}':text='${drawTextEscape(line)}':fontcolor=${lineColor}:fontsize=${lineSize}:x=${textXExpr}:y=${Math.round(y + lineIndex * lineHeight)}${textMotion}:shadowcolor=black@0.75:shadowx=0:shadowy=3${enable}`);
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

function productionAccentColor(bump = {}, palette = bumpPalette("broadcast")) {
  const accent = BUMP_PRODUCTION_ACCENTS.has(bump.productionAccent) ? bump.productionAccent : "auto";
  if (accent === "hot") return "0xff4f7b";
  if (accent === "cool") return "0x36c8ff";
  if (accent === "signal") return "0xffe066";
  if (accent === "mono") return "0xf4f0e8";
  return palette.shape[Math.abs(Number(bump.seed || bump.wallpaper?.seed || 0)) % palette.shape.length] || "0xffe066";
}

function productionChromeFilters(bump = {}, { font, palette, fontSize }) {
  const style = BUMP_PRODUCTION_STYLES.has(bump.productionStyle) ? bump.productionStyle : "standard";
  const accent = productionAccentColor(bump, palette);
  const badge = String(bump.productionBadge || bump.blockName || "DOINKTV").trim().slice(0, 32).toUpperCase();
  const kicker = String(bump.productionKicker || "").trim().slice(0, 80).toUpperCase();
  const badgeWidth = Math.max(132, Math.min(480, badge.length * Math.round(fontSize * 0.36) + 78));
  const panel = style === "lower-third"
    ? "drawbox=x=54:y=526:w=1172:h=118:color=black@0.58:t=fill"
    : style === "split-card"
      ? "drawbox=x=54:y=110:w=742:h=500:color=black@0.62:t=fill,drawbox=x=866:y=110:w=282:h=500:color=white@0.10:t=fill"
      : "drawbox=x=54:y=112:w=812:h=494:color=black@0.62:t=fill";
  const filters = [
    "drawbox=x=54:y=54:w=1172:h=612:color=white@0.10:t=2",
    panel,
    `drawbox=x=54:y=112:w=9:h=${style === "lower-third" ? 118 : 494}:color=${accent}@0.96:t=fill`,
    `drawbox=x=54:y=42:w=${badgeWidth}:h=43:color=${accent}@0.94:t=fill`,
    `drawtext=fontfile='${font}':text='${drawTextEscape(badge)}':fontcolor=0x090b10:fontsize=${Math.max(16, Math.round(fontSize * 0.34))}:x=76:y=54:shadowcolor=white@0.0:shadowx=0:shadowy=0`
  ];
  if (kicker) {
    filters.push(`drawtext=fontfile='${font}':text='${drawTextEscape(kicker)}':fontcolor=0xf4f0e8@0.86:fontsize=${Math.max(14, Math.round(fontSize * 0.3))}:x=54:y=650:shadowcolor=black@0.85:shadowx=0:shadowy=2`);
  }
  return filters;
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
  const intensity = Math.max(0, Math.min(1, Number(bump.effectIntensity ?? 45) / 100));
  const textLines = slateTextLines(title, lines);
  const fontSize = textLines.length > 6 ? 29 : textLines.length > 4 ? 34 : 42;
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

function slateTextLines(title, lines = []) {
  const raw = [title, ...lines]
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .slice(0, 6);
  const wrapped = raw.flatMap((line, index) => wrapDrawTextLine(line, index === 0 ? 28 : 34));
  return (wrapped.length ? wrapped : ["DoinkTV"]).slice(0, 8);
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
    messages: state.chat.slice(-80),
    community: publicCommunity()
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
      handoffFromId: hlsPlayout.handoffFromId,
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
  const tier = sessionSupporterTier(session);

  const message = {
    id: crypto.randomUUID(),
    username: session.username,
    role: session.role,
    supporterTier: tier.id,
    supporterBadge: tier.badge,
    text,
    createdAt: Date.now()
  };
  state.chat.push(message);
  state.chat = state.chat.slice(-200);
  await saveState();
  broadcastChat();
  return message;
}

async function createCommunitySuggestion(req, body = {}) {
  return domainCreateCommunitySuggestion({
    state,
    session: getSession(req),
    body,
    saveState,
    broadcastChat,
    recordContinuityEvent
  });
}

async function updateCommunitySettings(body = {}) {
  return domainUpdateCommunitySettings({ state, body, saveState, broadcastChat });
}

async function updateCommunitySuggestion(body = {}) {
  return domainUpdateCommunitySuggestion({ state, body, saveState, broadcastChat, recordContinuityEvent });
}

async function updateSupporterTier(body = {}) {
  return domainUpdateSupporterTier({ state, body, saveState, broadcastChat });
}

function cleanSchedule() {
  const cutoff = Date.now() - 1000 * 60 * 60 * 12;
  const gapCutoff = Date.now() - 1000 * 60 * 5;
  state.schedule = state.schedule.filter((entry) => entry.startAt + entry.duration * 1000 > (entry.gapFiller ? gapCutoff : cutoff));
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

async function findOrCreateSourceFolder(baseName) {
  const name = String(baseName || "Weekly block").replace(/\s+/g, " ").trim().slice(0, 48);
  const existing = state.sourceFolders.find((folder) => folder.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.randomEligible = true;
    return existing;
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
  recordContinuityEvent({
    type: "schedule",
    title: immediate ? "Immediate schedule override" : "Program scheduled",
    detail: `${entry.title || source.title} at ${new Date(entry.startAt).toLocaleString()}.`,
    severity: immediate ? "warning" : "info",
    sourceId: source.id,
    entryId: entry.id
  });
  await saveState();
  broadcastProgram();
  return entry;
}

async function updateScheduleEntry(id, body = {}) {
  const entry = state.schedule.find((item) => item.id === id);
  if (!entry) throw new Error("Unknown schedule entry.");
  if ("title" in body) {
    entry.title = String(body.title || "").trim();
  }
  if ("startAt" in body) {
    const startAt = Date.parse(body.startAt);
    if (!Number.isFinite(startAt)) throw new Error("Enter a valid start time.");
    entry.startAt = startAt;
  }
  if ("duration" in body) {
    const duration = Number(body.duration);
    if (!Number.isFinite(duration) || duration < 5) throw new Error("Duration must be at least 5 seconds.");
    entry.duration = Math.round(duration);
  }
  state.schedule.sort((a, b) => a.startAt - b.startAt);
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

function weeklyBlockTemplates() {
  syncWeeklyBlockTemplates();
  return state.weeklyBlocks.filter((block) => block.enabled !== false);
}

async function seedWeeklyArchiveSchedule(options = {}) {
  syncWeeklyBlockTemplates();
  const blockIds = Array.isArray(options.blockIds) ? new Set(options.blockIds.map(String)) : null;
  const blocks = weeklyBlockTemplates().filter((block) => !blockIds || blockIds.has(block.id));
  resetWeeklyGeneratedContent(blockIds);
  const imports = [];
  for (const block of blocks) {
    const folder = await findOrCreateSourceFolder(block.folderName);
    const existingCount = state.sources.filter((source) => source.folderId === folder.id && source.type !== "bump").length;
    let imported = 0;
    let skipped = 0;
    const seen = new Set(
      state.sources
        .filter((source) => source.folderId === folder.id)
        .map((source) => `${source.archiveId || source.youtubeId || source.title}:${source.archiveFile || ""}`)
    );

    for (const query of block.queries || []) {
      if (existingCount + imported >= WEEKLY_ARCHIVE_IMPORT_LIMIT) break;
      const candidates = await searchInternetArchiveSources(query, 8).catch(() => []);
      for (const candidate of candidates) {
        if (existingCount + imported >= WEEKLY_ARCHIVE_IMPORT_LIMIT) break;
        if (!weeklyArchiveCandidateFitsBlock(block, candidate)) {
          skipped += 1;
          continue;
        }
        const key = `${candidate.archiveId}:${candidate.archiveFile}`;
        if (seen.has(key)) {
          skipped += 1;
          continue;
        }
        seen.add(key);
        state.sources.push({
          id: crypto.randomUUID(),
          type: "internet-archive",
          title: candidate.title || candidate.fileTitle || candidate.archiveId,
          folderId: folder.id,
          duration: candidate.duration,
          archiveId: candidate.archiveId,
          archiveFile: candidate.archiveFile,
          fileUrl: candidate.fileUrl,
          url: candidate.url,
          language: candidate.language || "",
          randomEligible: true,
          weeklyBlockId: block.id
        });
        imported += 1;
      }
    }
    imports.push({ blockId: block.id, name: block.name, folder, imported, skipped, total: existingCount + imported });
  }

  const materialized = materializeWeeklySchedule();
  state.broadcastMode = "scheduled";
  cleanSchedule();
  await ensureWeatherBumps();
  await saveState();
  broadcastProgram();
  queueAutoIngestSourceIds(materialized.entries.map((entry) => entry.sourceId), "weekly schedule seed", { force: true });
  return { imports, ...materialized };
}

async function materializeWeeklyScheduleFromExisting(options = {}) {
  syncWeeklyBlockTemplates();
  const blockIds = Array.isArray(options.blockIds) ? new Set(options.blockIds.map(String)) : null;
  resetWeeklyGeneratedContent(blockIds);
  const materialized = materializeWeeklySchedule();
  state.broadcastMode = "scheduled";
  cleanSchedule();
  await ensureWeatherBumps();
  await saveState();
  broadcastProgram();
  queueAutoIngestSourceIds(materialized.entries.map((entry) => entry.sourceId), "weekly schedule materialize", { force: false });
  return { imports: [], ...materialized };
}

function resetWeeklyGeneratedContent(blockIds = null) {
  const selectedBlockIds = blockIds || new Set(weeklyBlockTemplates().map((block) => block.id));
  const generatedSourceIds = new Set(
    state.sources
      .filter((source) => source.type === "bump" && selectedBlockIds.has(source.weeklyBlockId))
      .map((source) => source.id)
  );
  state.sources = state.sources.filter((source) => !generatedSourceIds.has(source.id));
  state.schedule = state.schedule.filter((entry) => !selectedBlockIds.has(entry.weeklyBlockId) && !generatedSourceIds.has(entry.sourceId));
}

function weeklyArchiveCandidateFitsBlock(block, candidate = {}) {
  return mediaDiscovery.weeklyArchiveCandidateFitsBlock(block, candidate);
}

function candidateLooksNewerThanBlock(candidate = {}, maxYear = Infinity) {
  return mediaDiscovery.candidateLooksNewerThanBlock(candidate, maxYear);
}

function materializeWeeklySchedule({ lookaheadDays = WEEKLY_SCHEDULE_LOOKAHEAD_DAYS } = {}) {
  syncWeeklyBlockTemplates();
  const now = Date.now();
  const horizon = now + lookaheadDays * 24 * 60 * 60 * 1000;
  state.schedule = state.schedule.filter((entry) => {
    if (!entry.weeklyBlockId) return true;
    return entry.startAt < now - 12 * 60 * 60 * 1000 || entry.startAt > horizon;
  });

  const entries = [];
  for (const block of weeklyBlockTemplates()) {
    const folder = state.sourceFolders.find((item) => item.name === block.folderName);
    const sources = folder
      ? librarySources(folder.id)
          .filter((source) => source.duration >= 5)
          .filter((source) => weeklyArchiveCandidateFitsBlock(block, source))
      : [];
    if (!sources.length) continue;
    for (const startAt of weeklyBlockStartTimes(block, lookaheadDays)) {
      if (startAt + block.durationMinutes * 60 * 1000 <= now) continue;
      const blockEntries = scheduleSourcesIntoBlock(block, sources, startAt);
      entries.push(...blockEntries);
    }
  }
  state.schedule.push(...entries);
  state.schedule.sort((a, b) => a.startAt - b.startAt);
  return { entries, scheduledBlocks: new Set(entries.map((entry) => entry.weeklyBlockId)).size };
}

function weeklyBlockStartTimes(block, lookaheadDays) {
  return domainWeeklyBlockStarts(block, { lookaheadDays });
}

function scheduleSourcesIntoBlock(block, sources, startAt) {
  return scheduleSourcesIntoWeeklyBlock(block, sources, startAt, {
    blockBumpDuration: BLOCK_BUMP_DURATION,
    hashString,
    sourceEpisodeKey,
    createId: () => crypto.randomUUID(),
    createBumpSource: createWeeklyBlockBumpSource,
    onBumpSource: (bumpSource) => state.sources.push(bumpSource)
  });
}

function createWeeklyBlockBumpSource(block, kind, startAt, nextSource = null, bumpIndex = 0) {
  return factoryCreateWeeklyBlockBumpSource(block, kind, startAt, nextSource, bumpIndex, {
    blockBumpDuration: BLOCK_BUMP_DURATION,
    weeklyBlockIdentity,
    randomBumpMusic,
    hashString,
    generatedBumpPresentation
  });
}

function hashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(31, hash) + text.charCodeAt(index) | 0;
  }
  return hash;
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
  return mediaDiscovery.discoverAuthorizedMediaCandidates(source);
}

async function searchInternetArchiveCandidates(query) {
  return mediaDiscovery.searchInternetArchiveCandidates(query);
}

async function internetArchiveFilesForDoc(doc) {
  return mediaDiscovery.internetArchiveFilesForDoc(doc);
}

function playableArchiveFile(file) {
  return mediaDiscovery.playableArchiveFile(file);
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
  recordContinuityEvent({
    type: immediate ? "play-now" : "queue",
    title: immediate ? "Live queue started" : "Program queued",
    detail: `${entry.title || source.title} ${immediate ? "started immediately" : "added to the live queue"}.`,
    severity: immediate ? "success" : "info",
    sourceId: source.id,
    entryId: entry.id
  });
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
  recordContinuityEvent({
    type: body.immediate ? "play-now" : "queue",
    title: body.immediate ? "Library started" : "Library queued",
    detail: `${entries.length} source${entries.length === 1 ? "" : "s"} from ${sources[0]?.folderId ? state.sourceFolders.find((folder) => folder.id === sources[0].folderId)?.name || "library" : "library"}.`,
    severity: body.immediate ? "success" : "info",
    entryId: entries[0]?.id || ""
  });
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
  recordContinuityEvent({
    type: "bump",
    title: "Bump queued",
    detail: `${source.title} queued ${body.position === "next" ? "next" : "at queue tail"}.`,
    severity: "success",
    sourceId: source.id,
    entryId: entry.id
  });
  await saveState();
  broadcastProgram();
  return { source, entry };
}

async function clearLiveQueue() {
  const now = Date.now();
  const removed = state.liveQueue.length;
  const protectedScheduleCount = state.schedule.filter((entry) => entryEnd(entry) > now).length;
  state.liveQueue = [];
  state.broadcastMode = "scheduled";
  pruneAutoIngestQueueToLiveQueue();
  pruneUnusedBumpSources();
  recordContinuityEvent({
    type: "queue",
    title: "Live queue cleared",
    detail: `${removed} queue item${removed === 1 ? "" : "s"} removed; ${protectedScheduleCount} scheduled item${protectedScheduleCount === 1 ? "" : "s"} protected.`,
    severity: protectedScheduleCount ? "warning" : "info"
  });
  await saveState();
  broadcastProgram();
  return { ok: true, removed, protectedScheduleCount, mode: state.broadcastMode };
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
    reordered.push(queueEntryFromItem(item, cursor, now));
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
    reordered.push(queueEntryFromItem(item, cursor, now));
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
  recordContinuityEvent({
    type: "mode",
    title: "Broadcast mode changed",
    detail: `Station switched to ${mode === "queue" ? "live queue" : "scheduled programming"} priority.`,
    severity: mode === "queue" ? "warning" : "success"
  });
  await saveState();
  broadcastProgram();
  if (mode === "queue") queueAutoIngestForLiveQueue("broadcast mode switch");
  return { mode };
}

async function triggerBroadcastFx(body = {}) {
  markAdminActivity();
  const id = String(body.id || "").trim();
  const preset = FX_PRESETS[id];
  if (!preset) throw new Error("Unknown FX button.");
  const instrument = fxInstrument(id);
  const isToggle = isFxToggle(id, body);
  const maxDuration = fxMaxDuration(id);
  let duration = Math.max(2, Math.min(maxDuration, Number(body.duration || preset.duration)));
  const now = Date.now();
  const active = activeBroadcastFx();
  let params = typeof body.params === "object" && body.params ? body.params : {};
  if (id === "soundboard-sample") {
    params = await djSoundboardSample(String(params.soundId || params.id || ""));
    duration = Math.max(2, Math.min(maxDuration, params.duration || duration));
  }
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
  if (id === "legal-id") {
    const brain = stationContinuityBrain(programSnapshot().live, programSnapshot().next);
    const cart = brain.legalId || LEGAL_ID_CARTS[Math.floor(Math.random() * LEGAL_ID_CARTS.length)];
    params = { ...params, ...cart, legalId: `${cart.call} ${cart.city}` };
  }
  if (id === "cart-wall") {
    params = { ...params, cart: params.cart || CART_WALL_PRESETS[Math.floor(Math.random() * CART_WALL_PRESETS.length)] };
  }
  if (id === "caller-line") {
    const message = [...state.chat].reverse().find((item) => item.text && item.username);
    if (!message) throw new Error("No chat messages available for the caller line.");
    params = {
      ...params,
      username: message.username,
      text: message.text,
      role: message.role,
      createdAt: message.createdAt
    };
  }
  if (id === "delay" && params.enabled === false) {
    beginFxDecay(state, "delay", now);
    recordContinuityEvent({ type: "fx", title: "Delay rack decaying", detail: "Delay was switched off and is winding down.", severity: "info" });
    await saveState();
    broadcastProgram();
    return { ok: true, fx: state.activeFx };
  }
  if (id === "reverb" && params.enabled === false) {
    beginFxDecay(state, "reverb", now);
    recordContinuityEvent({ type: "fx", title: "Reverb rack decaying", detail: "Reverb was switched off and is winding down.", severity: "info" });
    await saveState();
    broadcastProgram();
    return { ok: true, fx: state.activeFx };
  }
  if (isToggle && active.some((item) => item.id === id)) {
    beginFxDecay(state, id, now);
    recordContinuityEvent({ type: "fx", title: `${preset.label} winding down`, detail: "Rack state changed from admin control.", severity: "info" });
    await saveState();
    broadcastProgram();
    return { ok: true, toggledOff: true, fx: state.activeFx };
  }
  const existing = isFxCommand(id) ? null : active.find((item) => item.id === id);
  if (existing) {
    const intensified = intensifyFxEntry(existing, { preset, params, duration, now });
    state.activeFx = active.map((item) => (item.id === id ? intensified : item));
    recordContinuityEvent({
      type: "fx",
      title: `${preset.label} intensified`,
      detail: `Hit ${intensified.hits}; ${intensified.expiresAt == null ? "held as a rack instrument" : `expires in about ${Math.ceil((intensified.expiresAt - now) / 1000)}s`}.`,
      severity: "warning"
    });
    await saveState();
    broadcastProgram();
    return { ok: true, fx: state.activeFx };
  }
  const fx = createFxEntry({
    id,
    label: preset.label,
    params,
    duration,
    isToggle,
    level: preset.level,
    now
  });
  state.activeFx = [...active.filter((item) => item.id !== id), fx].slice(-8);
  recordContinuityEvent({
    type: "fx",
    title: `${preset.label} ${fx.expiresAt == null ? "held" : "active"}`,
    detail: fx.expiresAt == null
      ? `Held as ${instrument?.kind || "live"} instrument until cleared or toggled.`
      : `Expires in about ${duration}s${instrument ? ` with ${Math.round(fx.decayMs / 1000)}s decay` : ""}.`,
    severity: isToggle ? "warning" : "info"
  });
  await saveState();
  broadcastProgram();
  return { ok: true, fx: state.activeFx };
}

function performanceCueById(id) {
  return PERFORMANCE_CUES.find((cue) => cue.id === id) || PERFORMANCE_CUES.find((cue) => cue.id === "identity-hit");
}

function performanceSceneById(id) {
  return PERFORMANCE_SCENES.find((scene) => scene.id === id) || PERFORMANCE_SCENES[0];
}

function performanceIntensity(value) {
  const number = Number(value);
  return Math.max(0, Math.min(1, Number.isFinite(number) ? number : 0.62));
}

function scaleMacroValue(macro = {}, key, intensity, minimum = 0) {
  return Math.max(minimum, Math.min(1, Number(macro[key] || 0) * (0.35 + intensity * 1.05)));
}

function fxBodyForPerformanceStep(stepId, cue, intensity, options = {}) {
  const macro = PERFORMANCE_MACROS[cue.macro] || PERFORMANCE_MACROS.identity;
  const damage = scaleMacroValue(macro, "damage", intensity);
  const drift = scaleMacroValue(macro, "drift", intensity);
  const space = scaleMacroValue(macro, "space", intensity);
  const rhythm = scaleMacroValue(macro, "rhythm", intensity);
  const page = scaleMacroValue(macro, "page", intensity);
  const scene = performanceSceneById(cue.sceneId);
  const duration = Math.round(8 + intensity * 42);
  if (stepId === "show-cue") {
    return {
      id: "show-cue",
      duration: Math.max(6, Math.min(14, Math.round(6 + intensity * 8))),
      params: {
        label: cue.label,
        scene: scene.label,
        clip: cue.clip,
        color: scene.color,
        intensity: Math.round(intensity * 100),
        blockPack: options.blockPack?.label || ""
      }
    };
  }
  if (stepId === "visual-adjust") {
    return {
      id: "visual-adjust",
      duration: Math.max(30, duration + 38),
      params: {
        brightness: Math.round(100 + damage * 42 - space * 10),
        contrast: Math.round(100 + damage * 96),
        saturation: Math.round(100 + drift * 84 + rhythm * 28),
        tear: Math.round(damage * 86),
        tracking: Math.round((damage * 0.58 + drift * 0.52) * 100),
        smear: Math.round((drift * 0.72 + space * 0.28) * 100)
      }
    };
  }
  if (stepId === "av-warp") {
    return {
      id: "av-warp",
      duration: Math.max(18, duration),
      params: {
        speed: Math.round((1 + (rhythm - drift) * 0.18) * 100) / 100,
        pitch: Math.round((1 - drift * 0.12 + rhythm * 0.06) * 100) / 100,
        desync: Math.round((drift * 1.8 - damage * 0.4) * 10) / 10
      }
    };
  }
  if (stepId === "delay") {
    return {
      id: "delay",
      duration: Math.max(45, duration + 34),
      params: {
        enabled: true,
        sync: true,
        division: rhythm > 0.55 ? "eighth" : "dotted-eighth",
        repitch: damage > 0.64 ? "dub" : drift > 0.55 ? "tape" : "digital",
        target: "both",
        timeMs: 330,
        feedback: Math.round((0.18 + damage * 0.52) * 100) / 100,
        mix: Math.round((0.16 + rhythm * 0.28 + drift * 0.12) * 100) / 100,
        tone: Math.round(7800 - damage * 5200)
      }
    };
  }
  if (stepId === "reverb") {
    return {
      id: "reverb",
      duration: Math.max(45, duration + 30),
      params: {
        enabled: true,
        size: Math.round(28 + space * 72),
        decay: Math.round((0.8 + space * 5.4) * 10) / 10,
        preDelayMs: Math.round(8 + drift * 92),
        mix: Math.round((0.12 + space * 0.42) * 100) / 100,
        tone: Math.round(9200 - damage * 4200),
        character: space > 0.66 ? "tunnel" : drift > 0.52 ? "hall" : "plate"
      }
    };
  }
  if (stepId === "frequency-drift" || stepId === "party-damage" || stepId === "signal-loss" || stepId === "tape-warp") {
    return { id: stepId, duration: Math.max(24, duration), force: true };
  }
  if (stepId === "ui-css-panic" || stepId === "fill-popups" || stepId === "os-popups") {
    return { id: stepId, duration: Math.max(8, Math.round(8 + page * 18)) };
  }
  if (["vhs", "color-bars", "kaleidoscope", "floppy-prompt"].includes(stepId)) {
    return { id: stepId, duration: Math.max(8, Math.min(30, duration)), force: true };
  }
  return { id: stepId, duration: Math.max(4, Math.min(30, duration)) };
}

function performanceBumpBody(cue, intensity, options = {}) {
  const scene = performanceSceneById(cue.sceneId);
  const blockName = String(options.blockName || options.blockPack?.label || cue.label || "DoinkTV").trim();
  const brain = options.continuity || stationContinuityBrain(programSnapshot().live, programSnapshot().next);
  const transitionClass = brain.transition?.bumpClass || "";
  const requestedBumpClass = cue.bumpClass || transitionClass;
  const bumpKind = BUMP_CLASSES.some((item) => item.id === requestedBumpClass) ? requestedBumpClass : "manual-bump";
  const intentionalGlitch = cue.sceneId !== "anime" && cue.sceneId !== "uhf" && intensity > 0.54;
  const momentLines = communityMomentLines(cue);
  const brainLines = Array.isArray(brain.transition?.lines) ? brain.transition.lines : [];
  const voiceLine = brain.stationVoice?.slogan ? [brain.stationVoice.slogan] : [];
  const lines = (momentLines.length ? momentLines : brainLines.length ? brainLines : [...(cue.bumpLines || []), ...voiceLine])
    .filter(Boolean)
    .slice(0, 5)
    .map((title) => ({ time: "", title }));
  return {
    title: `${cue.label} bump`,
    heading: blockName.toUpperCase(),
    duration: Math.round(12 + intensity * 18),
    lines,
    bumpClass: bumpKind,
    secondsPerLine: 2.2,
    fontSize: Math.round(46 + intensity * 22),
    alignment: intensity > 0.7 ? "right" : "left",
    placement: intensity > 0.58 ? "middle" : "bottom",
    tone: intensity > 0.65 ? "caption" : "classic",
    tintStrength: Math.round(18 + intensity * 54),
    creditText: `${brain.stationVoice?.label || scene.label} / ${cue.label}`,
    wallpaper: {
      scheme: cue.sceneId === "anime" ? "blueprint" : cue.sceneId === "party" ? "miami" : cue.sceneId === "uhf" ? "mono" : "broadcast",
      shapes: cue.sceneId === "training" ? "checkerboard" : intensity > 0.7 ? "memphis" : "stripes",
      spacing: Math.round(54 + intensity * 54),
      seed: Math.floor(Math.random() * 100000)
    },
    effects: cue.sceneId === "uhf" ? ["vhs", "scanlines"] : cue.sceneId === "anime" ? ["chromatic", "scanlines"] : intentionalGlitch ? ["noise", "flicker"] : ["scanlines"],
    effectIntensity: Math.round(26 + intensity * 58),
    intentionalGlitch,
    presentation: generatedBumpPresentation(intentionalGlitch),
    position: options.position || "next",
    performanceCueId: cue.id,
    performanceSceneId: cue.sceneId
  };
}

function communityMomentLines(cue) {
  if (!["crew-pick-handoff", "supporter-shoutout"].includes(cue.id)) return [];
  state.community = normalizeCommunityState(state.community);
  const approvedPick = [...(state.community.suggestions || [])]
    .filter((suggestion) => suggestion.status === "approved")
    .sort((a, b) => Number(b.reviewedAt || b.createdAt || 0) - Number(a.reviewedAt || a.createdAt || 0))[0];
  const crew = activeCommunityCrew()[0];
  if (cue.id === "crew-pick-handoff" && approvedPick) {
    return [
      `CREW PICK: ${approvedPick.title}`,
      `suggested by ${approvedPick.username || "the crew"}`,
      "audience fingerprints on the schedule"
    ];
  }
  if (crew) {
    return [
      `${crew.supporterBadge || "CREW"}: ${crew.username}`,
      crew.activity || "on the signal",
      "Patreon-backed underground TV"
    ];
  }
  return [];
}

async function triggerPerformanceCue(body = {}) {
  const cue = performanceCueById(body.cueId || body.id);
  const program = programSnapshot();
  const continuity = stationContinuityBrain(program.live, program.next);
  const blockPack = continuity.blockPack;
  const requestedIntensity = performanceIntensity(body.intensity);
  const blockCeiling = Number(blockPack.chaosCeiling || 1);
  const intensity = cue.id === "panic-reset" ? 0 : Math.min(requestedIntensity, Math.max(0.2, Math.min(1, blockCeiling)));
  if (cue.id === "panic-reset") {
    await clearBroadcastFx();
    recordContinuityEvent({
      type: "performance",
      title: "Panic reset fired",
      detail: "Admin launched the clean-signal scene.",
      severity: "success"
    });
    await saveState();
    return { ok: true, cue, intensity, fired: [], queuedBump: null, blockPack, limitedByBlock: false };
  }
  const fired = [];
  for (const stepId of cue.fx || []) {
    const fxBody = fxBodyForPerformanceStep(stepId, cue, intensity, { blockPack });
    await triggerBroadcastFx(fxBody);
    fired.push(fxBody.id);
  }
  if (body.reactive === true) {
    const recentChat = state.chat.filter((message) => Date.now() - Number(message.createdAt || 0) < 1000 * 60 * 8);
    if (recentChat.length) {
      await triggerBroadcastFx({ id: "caller-line", duration: 12 });
      fired.push("caller-line");
    }
    if (publicAudience().online >= 9) {
      await triggerBroadcastFx({ id: "party-damage", duration: Math.round(20 + intensity * 36), toggle: false });
      fired.push("party-damage");
    }
  }
  const queuedBump = body.queueBump
    ? await queueManualBump(performanceBumpBody(cue, intensity, { blockPack, blockName: body.blockName, continuity }))
    : null;
  recordContinuityEvent({
    type: "performance",
    title: `${cue.label} launched`,
    detail: `${fired.length} FX fired${queuedBump ? "; bump queued" : ""}${intensity < requestedIntensity ? "; capped by block identity" : ""}.`,
    severity: cue.sceneId === "panic" ? "warning" : "success",
    entryId: queuedBump?.entry?.id || "",
    sourceId: queuedBump?.source?.id || ""
  });
  await saveState();
  return { ok: true, cue, intensity, requestedIntensity, limitedByBlock: intensity < requestedIntensity, fired, queuedBump, blockPack, fx: activeBroadcastFx() };
}

async function clearBroadcastFx() {
  const removed = (state.activeFx || []).length;
  state.activeFx = [];
  recordContinuityEvent({
    type: "fx",
    title: "Clean signal restored",
    detail: `${removed} active FX ${removed === 1 ? "entry" : "entries"} cleared.`,
    severity: "success"
  });
  await saveState();
  broadcastProgram();
  return { ok: true };
}

async function saveFxSnapshot(body = {}) {
  const name = String(body.name || "").replace(/\s+/g, " ").trim().slice(0, 80) || `Snapshot ${new Date().toLocaleTimeString()}`;
  const note = String(body.note || "").replace(/\s+/g, " ").trim().slice(0, 180);
  const active = activeBroadcastFx().map((fx) => ({
    ...fx,
    snapshotSavedAt: Date.now()
  }));
  if (!active.length) throw new Error("There are no active FX to save.");
  const existing = state.fxSnapshots.find((snapshot) => snapshot.name.toLowerCase() === name.toLowerCase());
  const snapshot = {
    id: existing?.id || crypto.randomUUID(),
    name,
    note,
    fx: active,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  state.fxSnapshots = normalizeFxSnapshots([
    snapshot,
    ...state.fxSnapshots.filter((item) => item.id !== snapshot.id)
  ]);
  recordContinuityEvent({
    type: "fx",
    title: "FX snapshot saved",
    detail: `${name} captured ${active.length} active FX ${active.length === 1 ? "entry" : "entries"}.`,
    severity: "success"
  });
  await saveState();
  return { ok: true, snapshot, snapshots: publicFxSnapshots() };
}

async function launchFxSnapshot(body = {}) {
  const id = String(body.id || "");
  const snapshot = state.fxSnapshots.find((item) => item.id === id);
  if (!snapshot) throw new Error("FX snapshot not found.");
  const now = Date.now();
  state.activeFx = snapshot.fx.map((fx) => {
    const originalDuration = fx.expiresAt == null ? null : Math.max(8, Math.round((Number(fx.expiresAt) - Number(fx.startedAt || now)) / 1000));
    return {
      ...fx,
      startedAt: now,
      expiresAt: originalDuration == null ? null : now + originalDuration * 1000,
      seed: crypto.randomUUID()
    };
  }).slice(-8);
  recordContinuityEvent({
    type: "fx",
    title: "FX snapshot launched",
    detail: `${snapshot.name} recalled ${state.activeFx.length} FX ${state.activeFx.length === 1 ? "entry" : "entries"}.`,
    severity: "success"
  });
  await saveState();
  broadcastProgram();
  return { ok: true, snapshot: { ...snapshot, fx: undefined }, fx: activeBroadcastFx(), snapshots: publicFxSnapshots() };
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
      const programming = programmingDomainView(state);
      sendJson(res, 200, {
        ok: true,
        serverTime: Date.now(),
        mode: programming.broadcastMode,
        programmingEngine: "programming-engine",
        queueLength: programming.liveQueue.length,
        scheduleLength: programming.schedule.length,
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

    if (req.method === "GET" && pathname === "/api/captions") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, await captionInfoForSourceId(url.searchParams.get("sourceId")));
      return;
    }

    if (req.method === "GET" && pathname === "/api/captions/file") {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const text = await captionFileForRequest(url.searchParams.get("sourceId"), url.searchParams.get("file"));
      res.writeHead(200, {
        "content-type": "text/vtt; charset=utf-8",
        "cache-control": "public, max-age=3600"
      });
      res.end(text);
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
      const isAdminClient = isAdmin(req);
      if (isAdminClient) markAdminActivity();
      sseClients.add(res);
      if (isAdminClient) adminSseClients.add(res);
      res.write(`data: ${JSON.stringify(publicProgram())}\n\n`);
      broadcastProgram();
      req.on("close", () => {
        sseClients.delete(res);
        if (isAdminClient) adminSseClients.delete(res);
        broadcastProgram();
      });
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

    if (req.method === "POST" && pathname === "/api/program-vote") {
      sendJson(res, 200, await castProgramVote(req, await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/chat") {
      const session = requireSession(req, res);
      if (!session) return;
      const message = await createChatMessage(req, await readJson(req));
      sendJson(res, 201, message);
      return;
    }

    if (req.method === "POST" && pathname === "/api/community-suggestions") {
      const session = requireSession(req, res);
      if (!session) return;
      sendJson(res, 201, await createCommunitySuggestion(req, await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/login") {
      const body = await readJson(req);
      const login = String(body.username || "").trim();
      const password = String(body.password || "");

      const admin = ADMIN_ACCOUNTS.find((account) => login === account.username && password === account.password);
      if (admin) {
        createSession(res, { username: admin.username, role: "admin" });
        sendJson(res, 200, { ok: true, user: publicUser({ username: admin.username, role: "admin" }) });
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
      sendJson(res, 200, { ok: true, user: publicUser({ username: user.username, role: user.role, userId: user.id }) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/register") {
      const user = await registerUser(await readJson(req));
      createSession(res, { username: user.username, role: user.role, userId: user.id });
      sendJson(res, 201, { ok: true, user: publicUser({ username: user.username, role: user.role, userId: user.id }) });
      return;
    }

    if (req.method === "GET" && pathname === "/api/me") {
      sendJson(res, 200, { user: publicUser(getSession(req)) });
      return;
    }

    if (req.method === "GET" && pathname === "/api/bump-assets") {
      sendJson(res, 200, await bumpGeneratorAssets());
      return;
    }

    if (req.method === "GET" && pathname === "/api/dj-soundboard") {
      sendJson(res, 200, await loadDjSoundboardManifest());
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
        weeklyBlocks: state.weeklyBlocks,
        bumpClasses: BUMP_CLASSES,
        community: publicCommunity({ admin: true }),
        lore: publicLore(),
        stationHealth: stationHealthSummary(),
        projectAudit: await projectAuditSummary(),
        continuityLog: publicContinuityLog(32),
        showControl: publicShowControl(),
        liveQueue: state.liveQueue,
        broadcastMode: state.broadcastMode,
        programmingEngine: {
          operatingSystem: true,
          queueRole: "live-override",
          scheduleRole: "station-clock",
          protection: queueProtectionSummary(state)
        },
        bumpMusic: state.bumpMusic
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/project-audit") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await projectAuditSummary());
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/continuity-log") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, { events: publicContinuityLog(80) });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/continuity-brain") {
      if (!requireAdmin(req, res)) return;
      const program = programSnapshot();
      sendJson(res, 200, stationContinuityBrain(program.live, program.next));
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/lore") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, publicLore({ query: url.searchParams.get("q") || "" }));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/lore-entry") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await upsertLoreEntry(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/community") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateCommunitySettings(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/community-suggestion") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateCommunitySuggestion(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/supporter-tier") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateSupporterTier(await readJson(req)));
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

    if (req.method === "POST" && pathname === "/api/weekly-schedule/seed") {
      if (!requireAdmin(req, res)) return;
      const body = await readJson(req);
      const blockIds = body.blockId ? [body.blockId] : body.blockIds;
      sendJson(res, 201, await seedWeeklyArchiveSchedule({ blockIds }));
      return;
    }

    if (req.method === "POST" && pathname === "/api/weekly-schedule/materialize-existing") {
      if (!requireAdmin(req, res)) return;
      const body = await readJson(req);
      const blockIds = body.blockId ? [body.blockId] : body.blockIds;
      sendJson(res, 201, await materializeWeeklyScheduleFromExisting({ blockIds }));
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

    const updateScheduleMatch = pathname.match(/^\/api\/schedule\/([^/]+)$/);
    if (req.method === "PATCH" && updateScheduleMatch) {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await updateScheduleEntry(updateScheduleMatch[1], await readJson(req)));
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

    if (req.method === "POST" && pathname === "/api/performance-cue") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await triggerPerformanceCue(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/fx-snapshots") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 201, await saveFxSnapshot(await readJson(req)));
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/fx-snapshots/launch") {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await launchFxSnapshot(await readJson(req)));
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
if (await ensureWeatherBumps()) await saveState();
queueAutoIngestForLiveQueue("server startup");
syncHlsPlayout().catch((error) => {
  hlsController.setError(error);
});
setInterval(broadcastProgram, 1000);
setInterval(() => syncHlsPlayout().catch((error) => {
  hlsController.setError(error);
}), 1000);
setInterval(() => flushTimelineSave().catch((error) => {
  console.error("Timeline save failed:", error);
}), 1000);
setInterval(() => {
  queueAutoIngestForLiveQueue("live queue maintenance");
}, 15000);
setInterval(async () => {
  try {
    cleanSchedule();
    maintainBroadcastTimeline();
    await ensureWeatherBumps();
    queueAutoIngestForLiveQueue("live queue maintenance");
    await pruneHlsDirectory();
    await flushTimelineSave();
    await saveState();
  } catch (error) {
    console.error("Scheduled maintenance failed:", error);
  }
}, 1000 * 60 * 5);

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url.pathname);
    return;
  }
  if (url.pathname.startsWith("/bumpgenerator")) {
    if (!requireAdmin(req, res)) return;
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
