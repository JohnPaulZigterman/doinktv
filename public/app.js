const frame = document.querySelector("#playerFrame");
const stage = document.querySelector(".stage");
const stageAdminTabs = document.querySelector("#stageAdminTabs");
const stageBumpPanel = document.querySelector("#stageBumpPanel");
const stageBumpFrame = document.querySelector("#stageBumpPanel .bump-frame");
const stageTvButton = document.querySelector("#showStageTvButton");
const stageBumpButton = document.querySelector("#showStageBumpButton");
const viewerControls = document.querySelector(".viewer-controls");
const streamPlayer = document.querySelector("#streamPlayer");
const streamLoading = document.querySelector("#streamLoading");
const playOverlayButton = document.querySelector("#playOverlayButton");
const liveBadge = document.querySelector("#liveBadge");
const onlineBadge = document.querySelector("#onlineBadge");
const peaceModeToggle = document.querySelector("#peaceModeToggle");
const nowTitle = document.querySelector("#nowTitle");
const nowBlock = document.querySelector("#nowBlock");
const nowReason = document.querySelector("#nowReason");
const viewerNowTitle = document.querySelector("#viewerNowTitle");
const viewerNowBlock = document.querySelector("#viewerNowBlock");
const nextTitle = document.querySelector("#nextTitle");
const nextBlock = document.querySelector("#nextBlock");
const nextReason = document.querySelector("#nextReason");
const progressText = document.querySelector("#progressText");
const viewerNowProgress = document.querySelector("#viewerNowProgress");
const youtubeLink = document.querySelector("#youtubeLink");
const crtBrand = document.querySelector(".crt-brand");
const volumeSlider = document.querySelector("#volumeSlider");
const volumeValue = document.querySelector("#volumeValue");
const captionsToggle = document.querySelector("#captionsToggle");
const fullscreenButton = document.querySelector("#fullscreenButton");
const themeSelect = document.querySelector("#themeSelect");
const shell = document.querySelector(".shell");
const railResizer = document.querySelector("#railResizer");
const adminToggle = document.querySelector("#adminToggle");
const loginPopover = document.querySelector("#loginPopover");
const adminPanel = document.querySelector("#adminPanel");
const schedulePanel = document.querySelector("#schedulePanel");
const chatPanel = document.querySelector("#chatPanel");
const queuePanel = document.querySelector("#queuePanel");
const soundboardPanel = document.querySelector("#soundboardPanel");
const fxPanel = document.querySelector("#fxPanel");
const lorePanel = document.querySelector("#lorePanel");
const fxOverlay = document.querySelector("#fxOverlay");
const fxAudioLayer = document.querySelector("#fxAudioLayer");
const chatToggle = document.querySelector("#chatToggle");
const adminRailTabs = document.querySelectorAll("[data-admin-rail-tabs]");
const showBroadcastPanelButtons = [
  document.querySelector("#showBroadcastPanelButton"),
  document.querySelector("#showBroadcastPanelButtonAlt"),
  document.querySelector("#showBroadcastPanelButtonSchedule"),
  document.querySelector("#showBroadcastPanelButtonQueue"),
  document.querySelector("#showBroadcastPanelButtonBump"),
  document.querySelector("#showBroadcastPanelButtonSoundboard"),
  document.querySelector("#showBroadcastPanelButtonFx"),
  document.querySelector("#showBroadcastPanelButtonLore")
].filter(Boolean);
const showSchedulePanelButtons = [
  document.querySelector("#showSchedulePanelButton"),
  document.querySelector("#showSchedulePanelButtonAlt"),
  document.querySelector("#showSchedulePanelButtonSchedule"),
  document.querySelector("#showSchedulePanelButtonQueue"),
  document.querySelector("#showSchedulePanelButtonBump"),
  document.querySelector("#showSchedulePanelButtonSoundboard"),
  document.querySelector("#showSchedulePanelButtonFx"),
  document.querySelector("#showSchedulePanelButtonLore")
].filter(Boolean);
const showQueuePanelButtons = [
  document.querySelector("#showQueuePanelButton"),
  document.querySelector("#showQueuePanelButtonAlt"),
  document.querySelector("#showQueuePanelButtonSchedule"),
  document.querySelector("#showQueuePanelButtonQueue"),
  document.querySelector("#showQueuePanelButtonBump"),
  document.querySelector("#showQueuePanelButtonSoundboard"),
  document.querySelector("#showQueuePanelButtonFx"),
  document.querySelector("#showQueuePanelButtonLore")
].filter(Boolean);
const showSoundboardPanelButtons = [
  document.querySelector("#showSoundboardPanelButton"),
  document.querySelector("#showSoundboardPanelButtonAlt"),
  document.querySelector("#showSoundboardPanelButtonSchedule"),
  document.querySelector("#showSoundboardPanelButtonQueue"),
  document.querySelector("#showSoundboardPanelButtonBump"),
  document.querySelector("#showSoundboardPanelButtonSoundboard"),
  document.querySelector("#showSoundboardPanelButtonFx"),
  document.querySelector("#showSoundboardPanelButtonLore")
].filter(Boolean);
const showFxPanelButtons = [
  document.querySelector("#showFxPanelButton"),
  document.querySelector("#showFxPanelButtonAlt"),
  document.querySelector("#showFxPanelButtonSchedule"),
  document.querySelector("#showFxPanelButtonQueue"),
  document.querySelector("#showFxPanelButtonBump"),
  document.querySelector("#showFxPanelButtonSoundboard"),
  document.querySelector("#showFxPanelButtonFx"),
  document.querySelector("#showFxPanelButtonLore")
].filter(Boolean);
const showLorePanelButtons = [
  document.querySelector("#showLorePanelButton"),
  document.querySelector("#showLorePanelButtonAlt"),
  document.querySelector("#showLorePanelButtonSchedule"),
  document.querySelector("#showLorePanelButtonQueue"),
  document.querySelector("#showLorePanelButtonBump"),
  document.querySelector("#showLorePanelButtonSoundboard"),
  document.querySelector("#showLorePanelButtonFx"),
  document.querySelector("#showLorePanelButtonLore")
].filter(Boolean);
const showChatPanelButtons = [
  document.querySelector("#showChatPanelButton"),
  document.querySelector("#showChatPanelButtonAlt"),
  document.querySelector("#showChatPanelButtonSchedule"),
  document.querySelector("#showChatPanelButtonQueue"),
  document.querySelector("#showChatPanelButtonBump"),
  document.querySelector("#showChatPanelButtonSoundboard"),
  document.querySelector("#showChatPanelButtonFx"),
  document.querySelector("#showChatPanelButtonLore")
].filter(Boolean);
const adminCockpitRail = window.DoinkAdminCockpit?.createRailController({
  shell,
  chatPanel,
  panels: {
    broadcast: adminPanel,
    schedule: schedulePanel,
    queue: queuePanel,
    soundboard: soundboardPanel,
    fx: fxPanel,
    lore: lorePanel
  },
  buttons: {
    broadcast: showBroadcastPanelButtons,
    schedule: showSchedulePanelButtons,
    queue: showQueuePanelButtons,
    soundboard: showSoundboardPanelButtons,
    fx: showFxPanelButtons,
    lore: showLorePanelButtons,
    chat: showChatPanelButtons
  },
  onViewChange(view) {
    adminRailView = view;
    applyStoredRailWidth();
  }
});
const chatStatus = document.querySelector("#chatStatus");
const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatSendButton = document.querySelector("#chatSendButton");
const chatEmojiButtons = document.querySelectorAll("[data-chat-emoji]");
const chatMessage = document.querySelector("#chatMessage");
const communityPanel = document.querySelector("#communityPanel");
const communityMode = document.querySelector("#communityMode");
const communitySpotlight = document.querySelector("#communitySpotlight");
const communityGoal = document.querySelector("#communityGoal");
const communityCrewCount = document.querySelector("#communityCrewCount");
const communityPendingCount = document.querySelector("#communityPendingCount");
const communityActiveCrew = document.querySelector("#communityActiveCrew");
const communityApprovedPicks = document.querySelector("#communityApprovedPicks");
const supporterSuggestionForm = document.querySelector("#supporterSuggestionForm");
const supporterSuggestionMessage = document.querySelector("#supporterSuggestionMessage");
const programVotePanel = document.querySelector("#programVotePanel");
const programVoteTitle = document.querySelector("#programVoteTitle");
const programVoteOptions = document.querySelector("#programVoteOptions");
const programVoteMessage = document.querySelector("#programVoteMessage");
const showLoginButton = document.querySelector("#showLoginButton");
const showRegisterButton = document.querySelector("#showRegisterButton");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const registerForm = document.querySelector("#registerForm");
const registerMessage = document.querySelector("#registerMessage");
const logoutButton = document.querySelector("#logoutButton");
const adminIdentity = document.querySelector("#adminIdentity");
const adminTools = document.querySelector("#adminTools");
const hostMacroPanel = document.querySelector("#hostMacroPanel");
const stationHealthStatus = document.querySelector("#stationHealthStatus");
const stationHealthChecks = document.querySelector("#stationHealthChecks");
const stationHealthWarnings = document.querySelector("#stationHealthWarnings");
const projectAuditStamp = document.querySelector("#projectAuditStamp");
const projectMissionHeadline = document.querySelector("#projectMissionHeadline");
const projectMissionStatement = document.querySelector("#projectMissionStatement");
const projectMissionPrinciples = document.querySelector("#projectMissionPrinciples");
const projectAuditMetrics = document.querySelector("#projectAuditMetrics");
const projectNextSteps = document.querySelector("#projectNextSteps");
const continuityLogPanel = document.querySelector("#continuityLogPanel");
const projectAuditFindings = document.querySelector("#projectAuditFindings");
const sourceFolderForm = document.querySelector("#sourceFolderForm");
const playlistImportForm = document.querySelector("#playlistImportForm");
const archiveImportForm = document.querySelector("#archiveImportForm");
const communityAdminForm = document.querySelector("#communityAdminForm");
const communityAdminMessage = document.querySelector("#communityAdminMessage");
const communityAdminSummary = document.querySelector("#communityAdminSummary");
const communityMemberList = document.querySelector("#communityMemberList");
const communitySuggestionList = document.querySelector("#communitySuggestionList");
const loreEntryForm = document.querySelector("#loreEntryForm");
const loreFormResetButton = document.querySelector("#loreFormResetButton");
const loreMessage = document.querySelector("#loreMessage");
const loreSearchInput = document.querySelector("#loreSearchInput");
const loreTypeFilter = document.querySelector("#loreTypeFilter");
const loreStats = document.querySelector("#loreStats");
const loreEntries = document.querySelector("#loreEntries");
const sourceSearchForm = document.querySelector("#sourceSearchForm");
const sourceForm = document.querySelector("#sourceForm");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduledModeButton = document.querySelector("#scheduledModeButton");
const queueModeButton = document.querySelector("#queueModeButton");
const seedWeeklyScheduleButton = document.querySelector("#seedWeeklyScheduleButton");
const pickModeButtons = document.querySelectorAll("[data-pick-mode]");
const addQueueButton = document.querySelector("#addQueueButton");
const playNowButton = document.querySelector("#playNowButton");
const sourceFolderMessage = document.querySelector("#sourceFolderMessage");
const playlistImportMessage = document.querySelector("#playlistImportMessage");
const archiveImportMessage = document.querySelector("#archiveImportMessage");
const sourceSearchMessage = document.querySelector("#sourceSearchMessage");
const sourceSearchResults = document.querySelector("#sourceSearchResults");
const sourceMessage = document.querySelector("#sourceMessage");
const sourceIngestMessage = document.querySelector("#sourceIngestMessage");
const scheduleMessage = document.querySelector("#scheduleMessage");
const queueMessage = document.querySelector("#queueMessage");
const fxMessage = document.querySelector("#fxMessage");
const clearFxButton = document.querySelector("#clearFxButton");
const fxButtons = document.querySelectorAll("[data-fx]");
const djSoundboardGrid = document.querySelector("#djSoundboardGrid");
const soundboardVolumeSlider = document.querySelector("#soundboardVolumeSlider");
const soundboardVolumeValue = document.querySelector("#soundboardVolumeValue");
const performanceBlockPack = document.querySelector("#performanceBlockPack");
const performanceActiveCue = document.querySelector("#performanceActiveCue");
const performanceSceneDetail = document.querySelector("#performanceSceneDetail");
const performanceBumpPackage = document.querySelector("#performanceBumpPackage");
const performanceActiveFx = document.querySelector("#performanceActiveFx");
const performanceIntensitySlider = document.querySelector("#performanceIntensitySlider");
const performanceIntensityValue = document.querySelector("#performanceIntensityValue");
const performanceReactiveToggle = document.querySelector("#performanceReactiveToggle");
const performanceBumpToggle = document.querySelector("#performanceBumpToggle");
const performanceSceneSelect = document.querySelector("#performanceSceneSelect");
const performanceSceneButton = document.querySelector("#performanceSceneButton");
const performancePanicButton = document.querySelector("#performancePanicButton");
const fxSnapshotForm = document.querySelector("#fxSnapshotForm");
const fxSnapshotMessage = document.querySelector("#fxSnapshotMessage");
const fxSnapshotList = document.querySelector("#fxSnapshotList");
const performanceCueGrid = document.querySelector("#performanceCueGrid");
const looperBpmValue = document.querySelector("#looperBpmValue");
const looperBeatLight = document.querySelector("#looperBeatLight");
const looperStatus = document.querySelector("#looperStatus");
const looperPlayToggle = document.querySelector("#looperPlayToggle");
const looperReplayHead = document.querySelector("#looperReplayHead");
const looperWaveform = document.querySelector("#looperWaveform");
const looperLayerStatuses = document.querySelectorAll("[data-looper-layer-status]");
const looperLayerSelect = document.querySelector("#looperLayerSelect");
const looperShapeSelect = document.querySelector("#looperShapeSelect");
const looperMotionSelect = document.querySelector("#looperMotionSelect");
const looperCaptureButton = document.querySelector("#looperCaptureButton");
const looperApplyButton = document.querySelector("#looperApplyButton");
const looperOpacitySlider = document.querySelector("#looperOpacitySlider");
const looperBlendSelect = document.querySelector("#looperBlendSelect");
const looperXSlider = document.querySelector("#looperXSlider");
const looperYSlider = document.querySelector("#looperYSlider");
const looperSizeSlider = document.querySelector("#looperSizeSlider");
const looperZoomSlider = document.querySelector("#looperZoomSlider");
const looperOpacityValue = document.querySelector("#looperOpacityValue");
const looperBlendValue = document.querySelector("#looperBlendValue");
const looperMotionValue = document.querySelector("#looperMotionValue");
const looperXValue = document.querySelector("#looperXValue");
const looperYValue = document.querySelector("#looperYValue");
const looperSizeValue = document.querySelector("#looperSizeValue");
const looperZoomValue = document.querySelector("#looperZoomValue");
const skipperSeedInput = document.querySelector("#skipperSeed");
const skipperDivisionSelect = document.querySelector("#skipperDivision");
const warpSpeedSlider = document.querySelector("#warpSpeedSlider");
const warpPitchSlider = document.querySelector("#warpPitchSlider");
const warpDesyncSlider = document.querySelector("#warpDesyncSlider");
const warpSpeedValue = document.querySelector("#warpSpeedValue");
const warpPitchValue = document.querySelector("#warpPitchValue");
const warpDesyncValue = document.querySelector("#warpDesyncValue");
const warpResetButton = document.querySelector("#warpResetButton");
const visualBrightnessSlider = document.querySelector("#visualBrightnessSlider");
const visualContrastSlider = document.querySelector("#visualContrastSlider");
const visualSaturationSlider = document.querySelector("#visualSaturationSlider");
const visualTearSlider = document.querySelector("#visualTearSlider");
const visualTrackingSlider = document.querySelector("#visualTrackingSlider");
const visualSmearSlider = document.querySelector("#visualSmearSlider");
const visualBrightnessValue = document.querySelector("#visualBrightnessValue");
const visualContrastValue = document.querySelector("#visualContrastValue");
const visualSaturationValue = document.querySelector("#visualSaturationValue");
const visualTearValue = document.querySelector("#visualTearValue");
const visualTrackingValue = document.querySelector("#visualTrackingValue");
const visualSmearValue = document.querySelector("#visualSmearValue");
const visualResetButton = document.querySelector("#visualResetButton");
const delayTimeSlider = document.querySelector("#delayTimeSlider");
const delayFeedbackSlider = document.querySelector("#delayFeedbackSlider");
const delayMixSlider = document.querySelector("#delayMixSlider");
const delayToneSlider = document.querySelector("#delayToneSlider");
const delayTimeValue = document.querySelector("#delayTimeValue");
const delayFeedbackValue = document.querySelector("#delayFeedbackValue");
const delayMixValue = document.querySelector("#delayMixValue");
const delayToneValue = document.querySelector("#delayToneValue");
const delaySyncToggle = document.querySelector("#delaySyncToggle");
const delayDivisionSelect = document.querySelector("#delayDivisionSelect");
const delayRepitchSelect = document.querySelector("#delayRepitchSelect");
const delayTargetSelect = document.querySelector("#delayTargetSelect");
const delayToggleButton = document.querySelector("#delayToggleButton");
const reverbSizeSlider = document.querySelector("#reverbSizeSlider");
const reverbDecaySlider = document.querySelector("#reverbDecaySlider");
const reverbPreDelaySlider = document.querySelector("#reverbPreDelaySlider");
const reverbMixSlider = document.querySelector("#reverbMixSlider");
const reverbToneSlider = document.querySelector("#reverbToneSlider");
const reverbCharacterSelect = document.querySelector("#reverbCharacterSelect");
const reverbSizeValue = document.querySelector("#reverbSizeValue");
const reverbDecayValue = document.querySelector("#reverbDecayValue");
const reverbPreDelayValue = document.querySelector("#reverbPreDelayValue");
const reverbMixValue = document.querySelector("#reverbMixValue");
const reverbToneValue = document.querySelector("#reverbToneValue");
const reverbToggleButton = document.querySelector("#reverbToggleButton");
const overlaySourceSelect = document.querySelector("#overlaySourceSelect");
const overlayBlendSelect = document.querySelector("#overlayBlendSelect");
const overlayCropSelect = document.querySelector("#overlayCropSelect");
const overlayOpacitySlider = document.querySelector("#overlayOpacitySlider");
const overlayScaleSlider = document.querySelector("#overlayScaleSlider");
const overlayDurationSlider = document.querySelector("#overlayDurationSlider");
const overlayOpacityValue = document.querySelector("#overlayOpacityValue");
const overlayScaleValue = document.querySelector("#overlayScaleValue");
const overlayDurationValue = document.querySelector("#overlayDurationValue");
const overlaySourceButton = document.querySelector("#overlaySourceButton");
const scheduleFolderSelect = scheduleForm.elements.folderId;
const sourceSelect = scheduleForm.elements.sourceId;
const timingDurationInput = scheduleForm.elements.duration;
const sourcesList = document.querySelector("#sourcesList");
const ingestAllSourcesButton = document.querySelector("#ingestAllSourcesButton");
const scheduleList = document.querySelector("#scheduleList");
const weeklyScheduleGrid = document.querySelector("#weeklyScheduleGrid");
const weeklyScheduleMessage = document.querySelector("#weeklyScheduleMessage");
const refreshScheduleWeekButton = document.querySelector("#refreshScheduleWeekButton");
const scheduleZoomInput = document.querySelector("#scheduleZoomInput");
const scheduleZoomOutButton = document.querySelector("#scheduleZoomOutButton");
const scheduleZoomInButton = document.querySelector("#scheduleZoomInButton");
const scheduleZoomLabel = document.querySelector("#scheduleZoomLabel");
const queueList = document.querySelector("#queueList");
const clearQueueButton = document.querySelector("#clearQueueButton");
const sourceTypeSelect = sourceForm.elements.type;
const sourceFolderSelect = sourceForm.elements.folderId;
const sourceTitleInput = sourceForm.elements.title;
const sourceDurationInput = sourceForm.elements.duration;
const sourceDurationDisplay = document.querySelector("#sourceDurationDisplay");
const sourceYoutubeInput = sourceForm.elements.youtube;
const sourceArchiveInput = sourceForm.elements.archive;
const sourceArchiveFileInput = sourceForm.elements.archiveFile;
const sourcePathInput = sourceForm.elements.path;
const sourceFieldGroups = document.querySelectorAll("[data-source-field]");

let youtubePlayer;
let youtubeReady = false;
let youtubeMetadataPlayer;
let youtubeMetadataReady = false;
let resolveYoutubeMetadataReady;
const youtubeMetadataReadyPromise = new Promise((resolve) => {
  resolveYoutubeMetadataReady = resolve;
});
let currentProgramId = "";
let currentProgram = null;
let programEvents = null;
let clockDelta = 0;
let loadedYouTubeProgramId = "";
let youtubeSyncTimer = 0;
let lastYouTubeSeekAt = 0;
let adminAuthenticated = false;
let currentUser = null;
let chatCollapsed = false;
let youtubeAutofillTimer;
let broadcastMode = "scheduled";
let adminRailView = "broadcast";
let adminStageView = "tv";
let schedulePickMode = "source";
let draggedQueueId = "";
let draggedSourceId = "";
let adminDataCache = { sourceFolders: [], sources: [] };
let loreCache = { entries: [], counts: {} };
let showControlCache = { scenes: [], cues: [], macros: {}, snapshots: [] };
let programVotePoll = null;
let railResizeDrag = null;
const scheduleZoomLevels = [
  { label: "Fit", hourHeight: 18 },
  { label: "Cozy", hourHeight: 28 },
  { label: "Standard", hourHeight: 42 },
  { label: "Detailed", hourHeight: 62 },
  { label: "Deep", hourHeight: 86 }
];
let scheduleZoomLevel = clamp(Number(localStorage.getItem("doink_schedule_zoom") || 2), 0, scheduleZoomLevels.length - 1);
const expandedSourceFolders = new Set(JSON.parse(localStorage.getItem("doink_expanded_source_folders") || "[]"));
const collapsedFxSections = new Set(JSON.parse(localStorage.getItem("doink_collapsed_fx_sections") || "[]"));
const availableThemeList = ["station", "woodsy", "mountain", "deep-ocean", "rainforest", "frutiger-aero", "aero-lime", "aero-sunset", "candy-static", "terminal-green", "hotdog-stand", "midnight-laundromat", "mall-kiosk"];
const chaosThemeList = ["woodsy", "mountain", "deep-ocean", "rainforest", "frutiger-aero", "aero-lime", "aero-sunset", "candy-static", "terminal-green", "hotdog-stand", "midnight-laundromat", "mall-kiosk"];
const availableThemes = new Set(availableThemeList);
let programVoterId = localStorage.getItem("doink_program_voter_id");
if (!programVoterId) {
  programVoterId = crypto.randomUUID();
  localStorage.setItem("doink_program_voter_id", programVoterId);
}
let currentTheme = localStorage.getItem("doink_theme") || "station";
if (!availableThemes.has(currentTheme)) currentTheme = "station";
const storedPlaybackUnlocked = localStorage.getItem("doink_playback_unlocked") === "true";
let audioUnlocked = true;
let playbackUnlocked = storedPlaybackUnlocked;
let pendingPlaybackUnlock = false;
let viewerVolume = Number(localStorage.getItem("doink_volume") || 70);
let soundboardVolume = Number(localStorage.getItem("doink_soundboard_volume") || 100);
let soundboardCollapsedGroups = loadSoundboardCollapsedGroups();
if (!Number.isFinite(viewerVolume)) viewerVolume = 70;
viewerVolume = Math.max(0, Math.min(100, viewerVolume));
if (!Number.isFinite(soundboardVolume)) soundboardVolume = 100;
soundboardVolume = Math.max(0, Math.min(140, soundboardVolume));
let hlsPlayer = null;
let hlsLoaded = false;
let hlsLoading = false;
let streamLoadingTimer = 0;
let streamBlankSince = 0;
let streamProgressSeenAt = Date.now();
let lastStreamTime = 0;
let hlsResetAt = 0;
let captionsEnabled = localStorage.getItem("doink_captions_enabled") === "true";
let captionProgramId = "";
let captionRequestId = 0;
let currentCaptionInfo = null;
let sourceSearchTimer = 0;
let sourceSearchRequestId = 0;
let sourceSearchCache = [];
let activeCommunityPick = null;
let looperBpm = 120;
let looperBeatTimer = 0;
let looperReplayTimer = 0;
let looperPlaying = true;
let looperAudioTimer = 0;
let looperAudioNodes = null;
let selectedLooperLayer = 1;
let looperDragState = null;
let frozenFrame = { image: "", expiresAt: 0, fallback: false };
let activePlaylistAudioSeed = "";
const looperLayerDefaults = [
  { layer: 1, shape: "full", motion: "still", opacity: 54, blend: "screen", x: 0, y: 0, size: 100, zoom: 100 },
  { layer: 2, shape: "window", motion: "bounce", opacity: 56, blend: "hard-light", x: 18, y: 14, size: 58, zoom: 138 },
  { layer: 3, shape: "strip", motion: "jitter", opacity: 46, blend: "difference", x: -32, y: 0, size: 34, zoom: 118 }
];
const looperLayers = [
  { image: "", ...looperLayerDefaults[0] },
  { image: "", ...looperLayerDefaults[1] },
  { image: "", ...looperLayerDefaults[2] }
];
const handledFxSeeds = new Set();
let seedSkipperTimer = 0;
let activeSeedSkipperKey = "";
let activeSeedSkipperRandom = null;
let avWarpPostTimer = 0;
let avWarpActive = false;
let avWarp = { speed: 1, pitch: 1, desync: 0 };
let avWarpTarget = { speed: 1, pitch: 1, desync: 0 };
let avWarpTweenTimer = 0;
let lastYoutubeWarpRate = 1;
let lastStreamWarpRate = 1;
let lastWarpPitchPreserve = true;
let lastWarpMediaApplyAt = 0;
let activeFxClassSignature = "";
let fxOverlaySignature = "";
let lastBroadcastFx = [];
let visualPostTimer = 0;
const DELAY_DEFAULTS = {
  timeMs: 375,
  feedback: 0.35,
  mix: 0.32,
  tone: 4800,
  sync: true,
  division: "dotted-eighth",
  repitch: "tape",
  target: "both"
};
const DELAY_LIMITS = {
  timeMs: [40, 2000],
  seconds: [0.04, 2.5],
  feedback: [0, 0.88],
  mix: [0, 1],
  tone: [800, 12000],
  visualCaptureMs: [120, 420]
};
const DELAY_VISUAL_FRAME_LIMIT = 8;
const DELAY_VISUAL_RENDER_LIMIT = 5;
const DELAY_VISUAL_CAPTURE_WIDTH = 240;
const DELAY_VISUAL_JPEG_QUALITY = 0.42;
const DELAY_TAPE_MODULATION_MS = 420;
const DELAY_TARGETS = new Set(["audio", "video", "both"]);
const DELAY_REPITCH_MODES = new Set(["digital", "tape", "dub", "slap"]);
const DELAY_DIVISIONS = new Set([
  "sixteenth",
  "sixteenth-triplet",
  "dotted-sixteenth",
  "eighth",
  "eighth-triplet",
  "dotted-eighth",
  "quarter",
  "quarter-triplet",
  "dotted-quarter",
  "half",
  "half-triplet",
  "dotted-half",
  "whole",
  "whole-triplet",
  "dotted-whole"
]);
const REVERB_DEFAULTS = {
  size: 56,
  decay: 2.4,
  preDelayMs: 22,
  mix: 0.28,
  tone: 6200,
  character: "plate"
};
const REVERB_LIMITS = {
  size: [0, 100],
  decay: [0.2, 8],
  preDelayMs: [0, 180],
  mix: [0, 1],
  tone: [900, 14000]
};
const REVERB_CHARACTERS = new Set(["room", "plate", "hall", "tunnel"]);
let delayPostTimer = 0;
let delayRemoteHoldUntil = 0;
let delayActive = false;
let delayNodes = null;
let reverbPostTimer = 0;
let reverbRemoteHoldUntil = 0;
let reverbActive = false;
let reverbImpulseKey = "";
let delayLfoTimer = 0;
let delayVisualTimer = 0;
let delayVisualFrames = [];
let activePageFxSignature = "";
let stingerAudioContext = null;
let broadcastAudioDuck = 1;
let delayState = { ...DELAY_DEFAULTS };
let reverbState = { ...REVERB_DEFAULTS };
let peaceMode = localStorage.getItem("doink_peace_mode") === "true";
const soundboardAudioInstances = new Set();
const DJ_STINGER_FX = new Set([
  "amen-break",
  "radio-sting",
  "legal-id",
  "cart-wall",
  "record-scratch",
  "caller-line",
  "dub-siren",
  "hum",
  "gun",
  "countdown"
]);

window.onYouTubeIframeAPIReady = () => {
  youtubePlayer = new YT.Player("youtubePlayer", {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      cc_load_policy: captionsEnabled ? 1 : 0,
      cc_lang_pref: "en",
      controls: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: location.origin,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: () => {
        youtubeReady = true;
        applyViewerVolume();
        applyCaptionMode();
        applyAvWarpToPlayers();
        if (currentProgram?.live?.source?.type === "youtube") syncYouTube(currentProgram.live, { force: true });
        if (pendingPlaybackUnlock) unlockPlayback();
      },
      onStateChange: () => {
        if (currentProgram?.live?.source?.type === "youtube") syncYouTube(currentProgram.live);
      }
    }
  });

  youtubeMetadataPlayer = new YT.Player("youtubeMetadataPlayer", {
    width: "1",
    height: "1",
    playerVars: {
      controls: 0,
      disablekb: 1,
      playsinline: 1
    },
    events: {
      onReady: () => {
        youtubeMetadataReady = true;
        resolveYoutubeMetadataReady();
      }
    }
  });
};

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const mins = String(Math.floor(safeSeconds / 60));
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateSourceDurationDisplay() {
  sourceDurationDisplay.value = formatDuration(Number(sourceDurationInput.value));
}

function setMessage(node, text, isError = false) {
  node.textContent = text;
  node.classList.toggle("error", isError);
}

function setProgramBlock(node, blockName = "", identity = null) {
  if (!node) return;
  const label = String(identity?.heading || identity?.label || blockName || "").trim();
  node.textContent = label;
  node.title = identity?.taglines?.[0] || label;
  const styleId = String(identity?.styleId || identity?.id || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  if (styleId) node.dataset.blockStyle = styleId;
  else delete node.dataset.blockStyle;
  node.classList.toggle("hidden", !label);
}

function setProgramTitle(node, title = "") {
  if (!node) return;
  node.textContent = title;
  node.title = title;
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function programDisplayTitle(program = {}) {
  let title = String(program.title || program.source?.title || "Untitled").trim();
  const blockName = String(program.weeklyBlockName || "").trim();
  if (blockName) {
    title = title.replace(new RegExp(`^${escapeRegExp(blockName)}\\s*[:|\\-]+\\s*`, "i"), "").trim();
  }
  return title || "Untitled";
}

function refreshTitleMarquees() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".title-marquee").forEach((container) => {
      const title = container.querySelector("strong");
      if (!title) return;
      const distance = Math.ceil(title.scrollWidth - container.clientWidth);
      const shouldScroll = distance > 5;
      container.classList.toggle("is-overflowing", shouldScroll);
      if (shouldScroll) {
        container.style.setProperty("--marquee-distance", `${distance}px`);
        container.style.setProperty("--marquee-duration", `${Math.max(9, Math.min(24, 8 + distance / 18))}s`);
      } else {
        container.style.removeProperty("--marquee-distance");
        container.style.removeProperty("--marquee-duration");
      }
    });
  });
}

function setTheme(theme, { persist = true } = {}) {
  currentTheme = availableThemes.has(theme) ? theme : "station";
  document.body.dataset.theme = currentTheme;
  if (themeSelect) themeSelect.value = currentTheme;
  if (persist) localStorage.setItem("doink_theme", currentTheme);
}

function displayTheme(theme) {
  document.body.dataset.theme = availableThemes.has(theme) ? theme : currentTheme;
}

function railLayoutMetrics() {
  const rect = shell.getBoundingClientRect();
  const style = getComputedStyle(shell);
  const contentWidth = rect.width
    - Number.parseFloat(style.paddingLeft || "0")
    - Number.parseFloat(style.paddingRight || "0");
  const splitterWidth = railResizer?.offsetWidth || 8;
  const gapWidth = Number.parseFloat(style.columnGap || style.gap || "8") || 8;
  return { contentWidth, splitterWidth, gapWidth };
}

function stageWidthBounds() {
  const { contentWidth, splitterWidth, gapWidth } = railLayoutMetrics();
  const minRail = adminAuthenticated ? 330 : 260;
  const controlFloor = Math.max(720, Math.min(820, contentWidth * 0.58));
  const minStage = Math.max(
    controlFloor,
    Math.ceil((stage?.scrollWidth || 0) + 2),
    Math.ceil((frame?.offsetWidth || 0) * 0.72)
  );
  const availableForColumns = contentWidth - splitterWidth - gapWidth * 2;
  const idealStage = Math.max(minStage, availableForColumns - (adminAuthenticated ? 390 : 320));
  const travel = Math.min(96, Math.max(32, availableForColumns - minStage - minRail));
  const min = Math.max(minStage, idealStage - travel);
  const max = Math.min(availableForColumns - minRail, idealStage + travel);
  return { min, max };
}

function railWidthBounds() {
  const { contentWidth, splitterWidth, gapWidth } = railLayoutMetrics();
  const stageBounds = stageWidthBounds();
  const minRail = adminAuthenticated ? 330 : 260;
  const maxRail = contentWidth - stageBounds.min - splitterWidth - gapWidth * 2;
  return { min: minRail, max: Math.max(minRail, maxRail) };
}

function setStageWidth(width, { persist = true } = {}) {
  if (!shell || !Number.isFinite(width)) return;
  const bounds = stageWidthBounds();
  const nextWidth = Math.max(bounds.min, Math.min(bounds.max, Math.round(width)));
  shell.style.setProperty("--stage-width", `${nextWidth}px`);
  railResizer?.setAttribute("aria-valuenow", String(nextWidth));
  railResizer?.setAttribute("aria-valuemin", String(bounds.min));
  railResizer?.setAttribute("aria-valuemax", String(bounds.max));
  if (persist) localStorage.setItem("doink_stage_width", String(nextWidth));
  refreshTitleMarquees();
}

function currentStageWidth() {
  const stored = Number(localStorage.getItem("doink_stage_width"));
  if (Number.isFinite(stored) && stored > 0) return stored;
  const { contentWidth, splitterWidth, gapWidth } = railLayoutMetrics();
  return contentWidth - splitterWidth - gapWidth * 2 - (adminAuthenticated ? 390 : 320);
}

function applyStoredRailWidth() {
  if (!shell || window.matchMedia("(max-width: 1040px)").matches) return;
  setStageWidth(currentStageWidth(), { persist: true });
}

function beginRailResize(event) {
  if (!railResizer || event.button !== 0 || window.matchMedia("(max-width: 1040px)").matches) return;
  railResizeDrag = { startX: event.clientX, startStageWidth: currentStageWidth() };
  document.body.classList.add("rail-resizing");
  railResizer.classList.add("active");
  railResizer.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function moveRailResize(event) {
  if (!railResizeDrag) return;
  setStageWidth(railResizeDrag.startStageWidth + event.clientX - railResizeDrag.startX);
}

function endRailResize(event) {
  if (!railResizeDrag) return;
  railResizeDrag = null;
  document.body.classList.remove("rail-resizing");
  railResizer?.classList.remove("active");
  railResizer?.releasePointerCapture?.(event.pointerId);
}

function setLoginOpen(isOpen) {
  loginPopover.classList.toggle("hidden", !isOpen);
  adminToggle.setAttribute("aria-expanded", String(isOpen));
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  loginForm.classList.toggle("hidden", isRegister);
  registerForm.classList.toggle("hidden", !isRegister);
  showLoginButton.classList.toggle("active", !isRegister);
  showRegisterButton.classList.toggle("active", isRegister);
  setMessage(loginMessage, "");
  setMessage(registerMessage, "");
}

function setAdminStageView(view) {
  const nextView = adminAuthenticated && view === "bump" ? "bump" : "tv";
  const showingBump = nextView === "bump";
  adminStageView = nextView;
  shell.classList.toggle("bump-stage-open", showingBump);
  stage.classList.toggle("stage-bump-open", showingBump);
  frame.classList.toggle("hidden", showingBump);
  viewerControls?.classList.toggle("hidden", showingBump);
  stageBumpPanel?.classList.toggle("hidden", !showingBump);
  if (showingBump && stageBumpFrame && !stageBumpFrame.getAttribute("src")) {
    stageBumpFrame.src = stageBumpFrame.dataset.src || "/bumpgenerator/";
  } else if (!adminAuthenticated) {
    stageBumpFrame?.removeAttribute("src");
  }
  stageTvButton?.classList.toggle("active", !showingBump);
  stageTvButton?.setAttribute("aria-pressed", String(!showingBump));
  stageBumpButton?.classList.toggle("active", showingBump);
  stageBumpButton?.setAttribute("aria-pressed", String(showingBump));
}

function setUserState(user) {
  const previousAdminState = adminAuthenticated;
  currentUser = user;
  adminAuthenticated = user?.role === "admin";
  setLoginOpen(false);
  adminTools.classList.toggle("hidden", !adminAuthenticated);
  shell.classList.toggle("admin-open", adminAuthenticated);
  adminRailTabs.forEach((tabs) => tabs.classList.toggle("hidden", !adminAuthenticated));
  stageAdminTabs?.classList.toggle("hidden", !adminAuthenticated);
  chatPanel.classList.toggle("admin-rail", adminAuthenticated);
  adminToggle.textContent = adminAuthenticated ? "Controls" : user ? "Log Out" : "Log In";
  if (user) adminIdentity.textContent = `Signed in as ${user.username}${user.supporterBadge ? ` / ${user.supporterBadge}` : ""}`;
  chatInput.disabled = !user;
  chatSendButton.disabled = !user;
  chatEmojiButtons.forEach((button) => { button.disabled = !user; });
  chatInput.placeholder = user ? "Message global chat" : "Log in to chat";
  chatStatus.textContent = user ? `Chatting as ${user.username}${user.supporterBadge ? ` / ${user.supporterBadge}` : ""}` : "Log in to join";
  if (adminAuthenticated) {
    setAdminRailView(adminRailView || "broadcast");
    setAdminStageView(adminStageView);
  } else {
    adminCockpitRail?.hideAdminPanels();
    if (!adminCockpitRail) {
      adminPanel.classList.add("hidden");
      schedulePanel.classList.add("hidden");
      queuePanel.classList.add("hidden");
      soundboardPanel.classList.add("hidden");
      fxPanel.classList.add("hidden");
      lorePanel.classList.add("hidden");
    }
    chatPanel.classList.remove("hidden");
    setAdminStageView("tv");
  }
  if (previousAdminState !== adminAuthenticated) reconnectProgramEvents();
  applyStoredRailWidth();
}

function setChatCollapsed(isCollapsed) {
  if (adminAuthenticated) return;
  chatCollapsed = isCollapsed;
  chatPanel.classList.toggle("collapsed", isCollapsed);
  shell.classList.toggle("chat-collapsed", isCollapsed);
  chatToggle.textContent = isCollapsed ? "Chat" : "Minimize";
  chatToggle.setAttribute("aria-expanded", String(!isCollapsed));
  if (!isCollapsed) applyStoredRailWidth();
}

function setAdminRailView(view) {
  if (adminCockpitRail) {
    adminRailView = adminCockpitRail.setView(view);
    return;
  }
  adminRailView = ["broadcast", "schedule", "queue", "soundboard", "fx", "lore", "chat"].includes(view) ? view : "broadcast";
  const showingBroadcast = adminRailView === "broadcast";
  const showingSchedule = adminRailView === "schedule";
  const showingQueue = adminRailView === "queue";
  const showingSoundboard = adminRailView === "soundboard";
  const showingFx = adminRailView === "fx";
  const showingLore = adminRailView === "lore";
  adminPanel.classList.toggle("hidden", !showingBroadcast);
  schedulePanel.classList.toggle("hidden", !showingSchedule);
  queuePanel.classList.toggle("hidden", !showingQueue);
  soundboardPanel.classList.toggle("hidden", !showingSoundboard);
  fxPanel.classList.toggle("hidden", !showingFx);
  lorePanel.classList.toggle("hidden", !showingLore);
  chatPanel.classList.toggle("hidden", showingBroadcast || showingSchedule || showingQueue || showingSoundboard || showingFx || showingLore);
  chatPanel.classList.remove("collapsed");
  shell.classList.remove("chat-collapsed");
  showBroadcastPanelButtons.forEach((button) => button.classList.toggle("active", showingBroadcast));
  showSchedulePanelButtons.forEach((button) => button.classList.toggle("active", showingSchedule));
  showQueuePanelButtons.forEach((button) => button.classList.toggle("active", showingQueue));
  showSoundboardPanelButtons.forEach((button) => button.classList.toggle("active", showingSoundboard));
  showFxPanelButtons.forEach((button) => button.classList.toggle("active", showingFx));
  showLorePanelButtons.forEach((button) => button.classList.toggle("active", showingLore));
  showChatPanelButtons.forEach((button) => button.classList.toggle("active", adminRailView === "chat"));
  applyStoredRailWidth();
}

function setBroadcastModeUI(mode) {
  broadcastMode = mode === "queue" ? "queue" : "scheduled";
  scheduledModeButton.classList.toggle("active", broadcastMode === "scheduled");
  queueModeButton.classList.toggle("active", broadcastMode === "queue");
}

function setSchedulePickMode(mode) {
  schedulePickMode = mode === "library" ? "library" : "source";
  pickModeButtons.forEach((button) => button.classList.toggle("active", button.dataset.pickMode === schedulePickMode));
  sourceSelect.classList.toggle("hidden", schedulePickMode === "library");
  sourceSelect.required = schedulePickMode === "source";
  timingDurationInput.classList.toggle("hidden", schedulePickMode === "library");
}

function fxSectionStorageId(section) {
  const heading = section.querySelector("h3");
  return (heading?.textContent || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `fx-section-${[...section.parentElement.children].indexOf(section)}`;
}

function persistFxSectionState() {
  localStorage.setItem("doink_collapsed_fx_sections", JSON.stringify([...collapsedFxSections]));
}

function setFxSectionCollapsed(section, isCollapsed) {
  const id = section.dataset.fxSection || fxSectionStorageId(section);
  section.dataset.fxSection = id;
  section.classList.toggle("collapsed", isCollapsed);
  const heading = section.querySelector("h3");
  heading?.setAttribute("aria-expanded", String(!isCollapsed));
  if (isCollapsed) {
    collapsedFxSections.add(id);
  } else {
    collapsedFxSections.delete(id);
  }
  persistFxSectionState();
}

function initFxCollapsibles() {
  fxPanel?.querySelectorAll(".fx-board section").forEach((section) => {
    const heading = section.querySelector("h3");
    if (!heading || section.dataset.fxCollapseReady) return;
    const id = section.dataset.fxSection || fxSectionStorageId(section);
    section.dataset.fxSection = id;
    section.id ||= `fx-section-${id}`;
    section.dataset.fxCollapseReady = "true";
    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-controls", section.id);
    const collapsed = collapsedFxSections.has(id);
    section.classList.toggle("collapsed", collapsed);
    heading.setAttribute("aria-expanded", String(!collapsed));
    const toggle = () => setFxSectionCollapsed(section, !section.classList.contains("collapsed"));
    heading.addEventListener("click", toggle);
    heading.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
}

function syncSourceFields(shouldFocus = false) {
  const type = sourceTypeSelect.value;
  sourceFieldGroups.forEach((group) => {
    group.classList.toggle("hidden", group.dataset.sourceField !== type);
  });
  sourceYoutubeInput.required = type === "youtube";
  sourceArchiveInput.required = type === "internet-archive";
  sourcePathInput.required = type === "local";
  if (!shouldFocus) return;
  if (type === "youtube") {
    sourceYoutubeInput.focus();
  } else if (type === "internet-archive") {
    sourceArchiveInput.focus();
  } else {
    sourcePathInput.focus();
  }
}

async function readYouTubeDuration(youtubeId) {
  if (!youtubeMetadataReady) await youtubeMetadataReadyPromise;
  youtubeMetadataPlayer.cueVideoById({ videoId: youtubeId });

  return await new Promise((resolve, reject) => {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const duration = youtubeMetadataPlayer.getDuration?.() || 0;
      if (Number.isFinite(duration) && duration >= 5) {
        clearInterval(timer);
        resolve(Math.round(duration));
      } else if (attempts > 30) {
        clearInterval(timer);
        reject(new Error("Could not detect the YouTube duration."));
      }
    }, 250);
  });
}

async function autofillYouTubeSource() {
  const value = sourceYoutubeInput.value.trim();
  if (!value || sourceTypeSelect.value !== "youtube") return;

  try {
    setMessage(sourceMessage, "Looking up YouTube video...");
    const info = await api(`/api/youtube-info?url=${encodeURIComponent(value)}`);
    if (info.title) {
      sourceTitleInput.value = info.title;
      sourceTitleInput.dataset.autoTitle = info.title;
    }
    const duration = await readYouTubeDuration(info.youtubeId);
    sourceDurationInput.value = String(duration);
    updateSourceDurationDisplay();
    setMessage(sourceMessage, "YouTube title and duration autofilled.");
  } catch (error) {
    setMessage(sourceMessage, error.message, true);
  }
}

async function autofillInternetArchiveSource() {
  const value = sourceArchiveInput.value.trim();
  if (!value || sourceTypeSelect.value !== "internet-archive") return;

  try {
    setMessage(sourceMessage, "Looking up Internet Archive item...");
    const params = new URLSearchParams({ url: value });
    if (sourceArchiveFileInput.value) params.set("file", sourceArchiveFileInput.value);
    const info = await api(`/api/internet-archive-info?${params}`);
    if (info.title) {
      sourceTitleInput.value = info.title;
      sourceTitleInput.dataset.autoTitle = info.title;
    }
    sourceDurationInput.value = String(info.duration);
    updateSourceDurationDisplay();
    setMessage(sourceMessage, `Archive media detected: ${info.archiveFile}.`);
  } catch (error) {
    setMessage(sourceMessage, error.message, true);
  }
}

async function searchInternetArchiveSources({ immediate = false } = {}) {
  const query = sourceSearchForm.elements.query.value.trim();
  clearTimeout(sourceSearchTimer);
  if (!query) {
    sourceSearchCache = [];
    sourceSearchResults.innerHTML = "";
    setMessage(sourceSearchMessage, "");
    return;
  }
  if (!immediate && query.length < 3) {
    setMessage(sourceSearchMessage, "Type at least 3 characters to search.");
    sourceSearchResults.innerHTML = "";
    return;
  }
  const requestId = ++sourceSearchRequestId;
  setMessage(sourceSearchMessage, "Searching Internet Archive...");
  try {
    const data = await api(`/api/internet-archive-search?${new URLSearchParams({ q: query, rows: "10" })}`);
    if (requestId !== sourceSearchRequestId) return;
    sourceSearchCache = data.results || [];
    renderSourceSearchResults(sourceSearchCache);
    setMessage(
      sourceSearchMessage,
      sourceSearchCache.length ? `${sourceSearchCache.length} playable Archive result${sourceSearchCache.length === 1 ? "" : "s"} found.` : "No playable Archive results found."
    );
  } catch (error) {
    if (requestId !== sourceSearchRequestId) return;
    sourceSearchCache = [];
    sourceSearchResults.innerHTML = "";
    setMessage(sourceSearchMessage, error.message, true);
  }
}

function renderSourceSearchResults(results = []) {
  sourceSearchResults.innerHTML = results.length
    ? results.map((result, index) => `
        <article class="search-result">
          <div>
            <strong>${escapeHtml(result.title || result.fileTitle || "Archive result")}</strong>
            <small>${escapeHtml(result.fileTitle || result.archiveFile || "")}</small>
            <small>${formatDuration(result.duration)}${result.year ? ` &middot; ${escapeHtml(result.year)}` : ""}${result.creator ? ` &middot; ${escapeHtml(result.creator)}` : ""}</small>
            ${result.quality ? `<small class="archive-quality" data-quality="${escapeHtml(result.quality.label || "usable")}">Quality: ${escapeHtml(result.quality.label || "usable")} / ${Number(result.quality.score || 0)}${result.quality.flags?.length ? ` &middot; ${escapeHtml(result.quality.flags.join(", "))}` : ""}</small>` : ""}
            ${result.description ? `<p>${escapeHtml(result.description)}</p>` : ""}
          </div>
          <div class="edit-actions">
            <a class="secondary compact button-link" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">Open</a>
            <button class="secondary compact" data-use-archive-result="${index}" type="button">Use</button>
            <button class="secondary compact" data-queue-archive-result="${index}" type="button">Add + Queue</button>
          </div>
        </article>`)
        .join("")
    : "";
}

function archiveSourceBody(result) {
  return {
    type: "internet-archive",
    archive: result.archiveId,
    archiveFile: result.archiveFile || "",
    title: result.fileTitle || result.title || activeCommunityPick?.title || "",
    duration: String(Math.max(5, Math.round(Number(result.duration) || 300))),
    folderId: sourceFolderSelect?.value || ""
  };
}

function useArchiveSearchResult(result) {
  if (!result) return;
  sourceTypeSelect.value = "internet-archive";
  syncSourceFields(true);
  sourceArchiveInput.value = result.archiveId;
  sourceArchiveFileInput.value = result.archiveFile || "";
  sourceTitleInput.value = result.fileTitle || result.title || "";
  sourceDurationInput.value = String(Math.max(5, Math.round(Number(result.duration) || 300)));
  updateSourceDurationDisplay();
  setMessage(sourceMessage, `Archive source loaded: ${result.archiveFile || result.title}.`);
  sourceForm.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

async function addArchiveResultToQueue(result) {
  if (!result) return;
  const source = await api("/api/sources", {
    method: "POST",
    body: JSON.stringify(archiveSourceBody(result))
  });
  const queueEntry = await api("/api/queue", {
    method: "POST",
    body: JSON.stringify({ sourceId: source.id, duration: source.duration })
  });
  if (activeCommunityPick?.id) {
      await adminCockpitApi.community.updateSuggestion({
        id: activeCommunityPick.id,
        status: "approved",
        outcome: {
          type: "queued",
          label: `Queued: ${source.title}`,
          sourceId: source.id,
          queueEntryId: queueEntry.id
        }
      });
  }
  setMessage(
    sourceSearchMessage,
    `${source.title} added to the live queue${activeCommunityPick?.title ? ` from crew pick: ${activeCommunityPick.title}` : ""}.`
  );
  activeCommunityPick = null;
  await loadAdmin();
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

const adminCockpitApi = window.DoinkAdminCockpit?.createApi(api);

function activeOffset(program = currentProgram) {
  if (!program?.live) return 0;
  return Math.max(0, (Date.now() + clockDelta - program.live.startAt) / 1000);
}

function setMode(mode) {
  if (mode) {
    frame.dataset.mode = mode;
  } else {
    delete frame.dataset.mode;
  }
}

function setPlayOverlay(visible, label = "Play broadcast") {
  playOverlayButton.classList.toggle("hidden", !visible);
  playOverlayButton.querySelector("span").textContent = label;
}

function youtubePlayerElement() {
  return document.querySelector("#youtubePlayer");
}

function loadHlsStream() {
  if (hlsLoaded || hlsLoading) return;
  hlsLoading = true;
  scheduleStreamLoading();
  waitForStreamManifest()
    .then(attachHlsStream)
    .catch(() => {
      hlsLoading = false;
      hideStreamLoading();
      setTimeout(loadHlsStream, 1000);
    });
}

function scheduleStreamLoading() {
  clearTimeout(streamLoadingTimer);
  streamLoadingTimer = setTimeout(() => {
    if (currentProgram?.live && currentProgram.live.source.type !== "youtube" && !hasStreamStarted()) {
      streamLoading?.classList.remove("hidden");
    }
  }, 1000);
}

function hideStreamLoading() {
  clearTimeout(streamLoadingTimer);
  streamLoadingTimer = 0;
  streamLoading?.classList.add("hidden");
}

function hasStreamStarted() {
  return streamPlayer.readyState >= 2 && Number(streamPlayer.currentTime || 0) > 0;
}

async function waitForStreamManifest() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`/stream/live.m3u8?wait=${Date.now()}`, { cache: "no-store" }).catch(() => null);
    if (response?.ok) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Stream playlist is not ready.");
}

function attachHlsStream() {
  hlsLoading = false;
  hlsLoaded = true;
  streamBlankSince = 0;
  markStreamProgress();
  const streamUrl = `/stream/live.m3u8?live=${Date.now()}`;
  if (streamPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    streamPlayer.src = streamUrl;
    streamPlayer.addEventListener("loadedmetadata", () => {
      markStreamProgress();
      playStreamPlayer();
    }, { once: true });
  } else if (window.Hls?.isSupported()) {
    hlsPlayer = new Hls({
      liveSyncDurationCount: 2,
      liveMaxLatencyDurationCount: 5,
      maxBufferLength: 18,
      backBufferLength: 18,
      enableWorker: true
    });
    hlsPlayer.loadSource(streamUrl);
    hlsPlayer.attachMedia(streamPlayer);
    hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
      markStreamProgress();
      playStreamPlayer();
    });
    hlsPlayer.on(Hls.Events.FRAG_LOADED, markStreamProgress);
    hlsPlayer.on(Hls.Events.ERROR, (_event, data) => {
      if (data?.fatal) {
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hlsPlayer.recoverMediaError();
          return;
        }
        hlsPlayer.destroy();
        hlsLoaded = false;
        hlsLoading = false;
        hlsPlayer = null;
        setTimeout(loadHlsStream, 1000);
      }
    });
  } else {
    setProgramTitle(nowTitle, "This browser cannot play the HLS stream.");
    refreshTitleMarquees();
  }
}

function markStreamProgress() {
  streamProgressSeenAt = Date.now();
  lastStreamTime = Number(streamPlayer.currentTime || 0);
  if (streamPlayer.readyState >= 2) hideStreamLoading();
}

function resetHlsStream() {
  if (Date.now() - hlsResetAt < 1500) return;
  hlsResetAt = Date.now();
  scheduleStreamLoading();
  hlsPlayer?.destroy();
  hlsPlayer = null;
  hlsLoaded = false;
  hlsLoading = false;
  streamBlankSince = 0;
  streamProgressSeenAt = Date.now();
  if (streamPlayer.src) streamPlayer.removeAttribute("src");
  streamPlayer.load();
  setTimeout(loadHlsStream, 250);
}

function pauseHlsStream() {
  streamPlayer.pause();
}

function resumeHlsStream() {
  loadHlsStream();
  if (!hasStreamStarted()) scheduleStreamLoading();
  applyAvWarpToPlayers();
  playStreamPlayer();
}

function playStreamPlayer({ retry = true } = {}) {
  applyViewerVolume();
  const attempt = streamPlayer.play();
  if (!attempt?.catch) return;
  attempt.catch((error) => {
    if (error?.name === "AbortError" && retry) {
      setTimeout(() => playStreamPlayer({ retry: false }), 300);
      return;
    }
    if (playbackUnlocked) {
      if (error?.name === "NotAllowedError") {
        audioUnlocked = false;
        applyViewerVolume();
        streamPlayer.muted = true;
        streamPlayer.play()
          .then(() => setPlayOverlay(true, "Tap for sound"))
          .catch(() => setPlayOverlay(true, "Play broadcast"));
        return;
      }
      if (retry) {
        setTimeout(() => playStreamPlayer({ retry: false }), 300);
      } else {
        setPlayOverlay(true, "Play broadcast");
      }
      return;
    }
    audioUnlocked = false;
    applyViewerVolume();
    streamPlayer.muted = true;
    streamPlayer.play()
      .then(() => setPlayOverlay(true, "Tap for sound"))
      .catch(() => setPlayOverlay(true, "Play broadcast"));
  });
}

function applyViewerVolume({ unlock = false } = {}) {
  if (unlock) {
    audioUnlocked = true;
    playbackUnlocked = true;
    localStorage.setItem("doink_playback_unlocked", "true");
  }
  const volume = Math.max(0, Math.min(1, viewerVolume / 100)) * broadcastAudioDuck;
  const muted = !audioUnlocked || volume <= 0;

  streamPlayer.volume = volume;
  streamPlayer.muted = muted;
  volumeSlider.value = Math.round(viewerVolume);
  volumeSlider.style.setProperty("--volume-fill", `${Math.round(viewerVolume)}%`);
  volumeValue.textContent = `${Math.round(viewerVolume)}%`;

  if (youtubeReady) {
    youtubePlayer.setVolume?.(Math.round(viewerVolume * broadcastAudioDuck));
    if (muted) {
      youtubePlayer.mute?.();
    } else {
      youtubePlayer.unMute?.();
    }
  }
  applySoundboardVolume();
}

function clearCaptionTracks() {
  streamPlayer.querySelectorAll("track[data-doink-caption]").forEach((track) => track.remove());
  currentCaptionInfo = null;
}

function applyCaptionMode() {
  captionsToggle?.classList.toggle("active", captionsEnabled);
  captionsToggle?.setAttribute("aria-pressed", String(captionsEnabled));
  captionsToggle?.setAttribute("title", currentCaptionInfo?.available
    ? captionsEnabled ? "English captions on" : "English captions available"
    : "No easy English captions found for this video");

  for (const track of streamPlayer.textTracks || []) {
    track.mode = captionsEnabled && currentCaptionInfo?.available ? "showing" : "disabled";
  }

  if (youtubeReady) {
    try {
      if (captionsEnabled) {
        youtubePlayer.setOption?.("captions", "track", { languageCode: "en" });
        youtubePlayer.setOption?.("captions", "reload", true);
      } else {
        youtubePlayer.unloadModule?.("captions");
      }
    } catch {
      // YouTube captions are best-effort and not available for every embed.
    }
  }
}

async function syncCaptions(live) {
  const requestId = ++captionRequestId;
  captionProgramId = live?.id || "";
  clearCaptionTracks();
  captionsToggle.disabled = true;
  applyCaptionMode();
  if (!live?.source) return;

  if (live.source.type === "youtube") {
    currentCaptionInfo = { available: true };
    captionsToggle.disabled = false;
    applyCaptionMode();
    return;
  }

  if (live.source.type !== "internet-archive" || !live.source.id) return;

  try {
    const info = await api(`/api/captions?${new URLSearchParams({ sourceId: live.source.id })}`);
    if (requestId !== captionRequestId || live.id !== captionProgramId) return;
    currentCaptionInfo = info?.available ? info : null;
    captionsToggle.disabled = !currentCaptionInfo;
    if (!currentCaptionInfo) {
      applyCaptionMode();
      return;
    }
    const track = document.createElement("track");
    track.dataset.doinkCaption = "true";
    track.kind = "captions";
    track.label = currentCaptionInfo.label || "English";
    track.srclang = currentCaptionInfo.srclang || "en";
    track.src = currentCaptionInfo.src;
    track.default = captionsEnabled;
    streamPlayer.append(track);
    track.addEventListener("load", applyCaptionMode, { once: true });
    applyCaptionMode();
  } catch {
    if (requestId !== captionRequestId) return;
    clearCaptionTracks();
    captionsToggle.disabled = true;
    applyCaptionMode();
  }
}

function toggleCaptions() {
  captionsEnabled = !captionsEnabled;
  localStorage.setItem("doink_captions_enabled", String(captionsEnabled));
  applyCaptionMode();
  if (currentProgram?.live) syncCaptions(currentProgram.live);
}

function unlockPlayback() {
  pendingPlaybackUnlock = true;
  playbackUnlocked = true;
  audioUnlocked = true;
  localStorage.setItem("doink_playback_unlocked", "true");
  setPlayOverlay(false);
  applyViewerVolume({ unlock: true });
  if (!currentProgram?.live) {
    api("/api/program")
      .then((program) => {
        syncProgram(program);
        unlockPlayback();
      })
      .catch(() => setPlayOverlay(true, "Play broadcast"));
    return;
  }
  if (currentProgram.live.source.type === "youtube") {
    if (!youtubeReady) {
      setPlayOverlay(true, "Loading player");
      return;
    }
    syncYouTube(currentProgram.live, { force: true, fromGesture: true });
    attemptYouTubePlay(0);
  } else {
    resumeHlsStream();
  }
}

function enforcePlayback() {
  applyViewerVolume();
  if (currentProgram?.live?.source?.type === "youtube") {
    syncYouTube(currentProgram.live);
  } else {
    resumeHlsStream();
  }
}

function keepBroadcastVisible() {
  const live = currentProgram?.live;
  if (!live) return;
  setMode(live.source.type === "youtube" ? "youtube" : "stream");
  if (live.source.type === "youtube") {
    if (youtubeReady) {
      const state = youtubePlayer.getPlayerState?.();
      if ([YT.PlayerState.UNSTARTED, YT.PlayerState.CUED, YT.PlayerState.PAUSED].includes(state)) {
        youtubePlayer.mute?.();
        attemptYouTubePlay(0);
      }
    }
    return;
  }
  if (streamPlayer.readyState === 0) {
    streamBlankSince ||= Date.now();
    if (Date.now() - streamBlankSince > 3500 && !hlsLoading) resetHlsStream();
    return;
  }
  streamBlankSince = 0;
  if (streamPlayer.paused) resumeHlsStream();
  const currentTime = Number(streamPlayer.currentTime || 0);
  if (Math.abs(currentTime - lastStreamTime) > 0.05) {
    markStreamProgress();
  } else if (Date.now() - streamProgressSeenAt > 8000) {
    resetHlsStream();
  }
}

function syncYouTube(live, { force = false, fromGesture = false } = {}) {
  if (!youtubeReady || !live?.source?.youtubeId) return;
  const offset = Math.max(0, Math.min(activeOffset(), live.duration - 0.25));
  const now = Date.now();

  if (force || loadedYouTubeProgramId !== live.id) {
    loadedYouTubeProgramId = live.id;
    lastYouTubeSeekAt = now;
    youtubePlayer.loadVideoById({ videoId: live.source.youtubeId, startSeconds: offset });
    applyViewerVolume();
    applyAvWarpToPlayers();
    attemptYouTubePlay(fromGesture ? 0 : 250);
    if (!playbackUnlocked) {
      setTimeout(() => {
        const state = youtubePlayer.getPlayerState?.();
        if ([YT.PlayerState.UNSTARTED, YT.PlayerState.CUED, YT.PlayerState.PAUSED].includes(state)) {
          youtubePlayer.mute?.();
          youtubePlayer.playVideo?.();
        }
      }, 350);
    }
    setTimeout(checkYouTubeBlocked, 900);
    return;
  }

  const playerState = youtubePlayer.getPlayerState?.();
  const playerTime = Number(youtubePlayer.getCurrentTime?.() || 0);
  const drift = Math.abs(playerTime - offset);
  if (drift > 2.5 && now - lastYouTubeSeekAt > 3500) {
    lastYouTubeSeekAt = now;
    youtubePlayer.seekTo(offset, true);
  }
  if ([YT.PlayerState.UNSTARTED, YT.PlayerState.CUED, YT.PlayerState.PAUSED].includes(playerState)) {
    attemptYouTubePlay(fromGesture ? 0 : 250);
    setTimeout(checkYouTubeBlocked, 900);
  }
  applyViewerVolume();
  applyAvWarpToPlayers();
}

function attemptYouTubePlay(delayMs = 0) {
  if (!youtubeReady) return;
  const play = () => {
    if (!playbackUnlocked) youtubePlayer.mute?.();
    youtubePlayer.playVideo?.();
    setTimeout(checkYouTubeBlocked, 900);
  };
  if (delayMs > 0) {
    setTimeout(play, delayMs);
  } else {
    play();
  }
}

function checkYouTubeBlocked() {
  if (currentProgram?.live?.source?.type !== "youtube" || !youtubeReady) return;
  const state = youtubePlayer.getPlayerState?.();
  if ([YT.PlayerState.UNSTARTED, YT.PlayerState.CUED, YT.PlayerState.PAUSED].includes(state)) {
    setPlayOverlay(true, "Play broadcast");
  } else {
    setPlayOverlay(!playbackUnlocked && youtubePlayer.isMuted?.(), "Tap for sound");
  }
}

function unlockPlaybackFromGesture() {
  if (viewerVolume <= 0) return;
  const youtubeMuted = youtubeReady && Boolean(youtubePlayer.isMuted?.());
  if (playbackUnlocked && !streamPlayer.muted && !youtubeMuted) return;
  unlockPlayback();
}

function enterYouTubeMode(live) {
  setMode("youtube");
  pauseHlsStream();
  hideStreamLoading();
  youtubeLink.classList.remove("hidden");
  crtBrand.classList.add("hidden");
  youtubeLink.href = live.source.url || `https://www.youtube.com/watch?v=${live.source.youtubeId}`;
  syncYouTube(live, { force: loadedYouTubeProgramId !== live.id });
  checkYouTubeBlocked();
}

function enterStreamMode() {
  setMode("stream");
  youtubeLink.classList.add("hidden");
  youtubeLink.href = "#";
  crtBrand.classList.remove("hidden");
  loadedYouTubeProgramId = "";
  clearInterval(youtubeSyncTimer);
  youtubeSyncTimer = 0;
  if (youtubeReady && currentProgram?.live?.source?.type !== "youtube") youtubePlayer.stopVideo?.();
  setPlayOverlay(false);
  resumeHlsStream();
}

function setPeaceMode(enabled, { persist = true } = {}) {
  peaceMode = Boolean(enabled);
  document.body.classList.toggle("peace-mode", peaceMode);
  peaceModeToggle?.classList.toggle("active", peaceMode);
  peaceModeToggle?.setAttribute("aria-pressed", String(peaceMode));
  peaceModeToggle?.setAttribute("title", peaceMode ? "Peace mode on: broadcast FX muted for you" : "Peace mode off");
  if (persist) localStorage.setItem("doink_peace_mode", String(peaceMode));
  if (peaceMode) resetChaosForPeace();
  if (currentProgram) applyBroadcastFx(currentProgram.fx || []);
}

function resetChaosForPeace() {
  if (broadcastAudioDuck !== 1) {
    broadcastAudioDuck = 1;
    applyViewerVolume();
  }
  stopSeedSkipper();
  resetAvWarp(false);
  disableDelay(false);
  disableReverb(false);
  syncPlaylistAudio(null);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  for (const audio of soundboardAudioInstances) {
    audio.pause();
    audio.currentTime = 0;
  }
  soundboardAudioInstances.clear();
  activePageFxSignature = "";
  document.body.className = document.body.className
    .split(/\s+/)
    .filter((name) => name && !name.startsWith("page-fx-"))
    .join(" ");
  document.body.style.removeProperty("--page-damage");
  document.body.style.removeProperty("--page-damage-px");
  document.body.style.removeProperty("--page-damage-rot");
  displayTheme(currentTheme);
  streamPlayer.style.filter = "";
  resetAvWarp(false);
  const youtubeElement = youtubePlayerElement();
  if (youtubeElement) youtubeElement.style.filter = "";
  frame.className = frame.className
    .split(/\s+/)
    .filter((name) => name && !name.startsWith("fx-"))
    .join(" ");
  activeFxClassSignature = "";
  fxOverlay.innerHTML = "";
  fxOverlaySignature = "";
  if (fxAudioLayer) fxAudioLayer.innerHTML = "";
  lastBroadcastFx = [];
}

function fxIsActive(fx) {
  const expiresAt = Number(fx.expiresAt);
  return fx.expiresAt == null || !Number.isFinite(expiresAt) || expiresAt > Date.now() + clockDelta;
}

function applyBroadcastFx(effects = []) {
  const active = effects.filter(fxIsActive);
  renderActiveFxRack(active);
  if (peaceMode) {
    updateFxButtonStates(active);
    resetChaosForPeace();
    return;
  }
  lastBroadcastFx = active;
  const nextDuck = active.some((fx) => ["dj-mic", "caller-line"].includes(fx.id)) ? 0.38 : 1;
  if (nextDuck !== broadcastAudioDuck) {
    broadcastAudioDuck = nextDuck;
    applyViewerVolume();
  }
  updateFxButtonStates(active);
  applyPageFx(active);
  handleFxCommands(active);
  if (!active.some((fx) => fx.id === "seed-skip")) stopSeedSkipper();
  if (!active.some((fx) => fx.id === "av-warp")) resetAvWarp(false);
  const hasDelayFx = active.some((fx) => fx.id === "delay");
  if (hasDelayFx) {
    delayRemoteHoldUntil = 0;
  } else if (Date.now() > delayRemoteHoldUntil) {
    disableDelay(false);
  }
  const hasReverbFx = active.some((fx) => fx.id === "reverb");
  if (hasReverbFx) {
    reverbRemoteHoldUntil = 0;
  } else if (Date.now() > reverbRemoteHoldUntil) {
    disableReverb(false);
  }
  syncPlaylistAudio(active.find((fx) => fx.id === "playlist-audio"));
  const totalLevel = active.reduce((level, fx) => level + Number(fx.level || 1), 0);
  const chaos = Math.max(1, totalLevel + Math.max(0, active.length - 1) * 1.25);
  const intensity = Math.min(1.35, 0.16 + chaos * 0.105);
  frame.style.setProperty("--fx-level", String(chaos));
  frame.style.setProperty("--fx-stack-count", String(active.length));
  frame.style.setProperty("--fx-intensity", String(intensity));
  frame.style.setProperty("--fx-noise-opacity", String(Math.min(0.92, intensity * 0.58)));
  frame.style.setProperty("--fx-smear-opacity", String(Math.min(0.74, intensity * 0.46)));
  frame.style.setProperty("--fx-dropout-opacity", String(Math.min(0.78, intensity * 0.6)));
  frame.style.setProperty("--fx-glitch-ms", `${Math.max(0.075, 0.24 - chaos * 0.017)}s`);
  frame.style.setProperty("--fx-vhs-ms", `${Math.max(0.82, 1.5 - chaos * 0.055)}s`);
  frame.style.setProperty("--fx-tape-ms", `${Math.max(0.92, 1.75 - chaos * 0.06)}s`);
  frame.style.setProperty("--fx-dvd-ms", `${Math.max(0.28, 0.86 - chaos * 0.048)}s`);
  frame.style.setProperty("--fx-contrast", String(1.22 + intensity * 0.72));
  frame.style.setProperty("--fx-saturate", String(1.18 + intensity * 0.85));
  frame.style.setProperty("--fx-color-saturate", String(1.5 + intensity * 1.2));
  frame.style.setProperty("--fx-color-overlay", String(Math.min(0.86, 0.22 + intensity * 0.36)));
  frame.style.setProperty("--fx-signal-opacity", String(Math.max(0.18, 0.72 - intensity * 0.48)));
  frame.style.setProperty("--fx-signal-bright", String(Math.max(0.35, 0.9 - intensity * 0.44)));
  frame.style.setProperty("--fx-aspect-x", String(Math.max(0.62, 0.98 - intensity * 0.34)));
  frame.style.setProperty("--fx-aspect-y", String(1.02 + intensity * 0.24));
  frame.style.setProperty("--fx-crop-scale", String(1.06 + intensity * 0.46));
  frame.style.setProperty("--fx-pixel-scale", String(1 + intensity * 0.06));
  frame.style.setProperty("--fx-glass-blur", `${1 + intensity * 4}px`);
  const visualFx = active.find((fx) => fx.id === "visual-adjust");
  const visualRack = normalizedVisualValues(visualFx?.params || {});
  frame.style.setProperty("--fx-manual-tear", visualRack.tear.toFixed(2));
  frame.style.setProperty("--fx-manual-tracking", visualRack.tracking.toFixed(2));
  frame.style.setProperty("--fx-manual-smear", visualRack.smear.toFixed(2));
  applyStackedFxFilter(active, intensity, chaos);
  syncFrameFxClasses(active);
  syncFxOverlay(active);
}

function frameFxClassSignature(active = []) {
  return active.map((fx) => `${fx.id}:${Number(fx.level || 1)}`).join("|");
}

function syncFrameFxClasses(active = []) {
  const signature = frameFxClassSignature(active);
  if (signature === activeFxClassSignature) return;
  activeFxClassSignature = signature;
  frame.className = frame.className
    .split(/\s+/)
    .filter((name) => name && !name.startsWith("fx-"))
    .join(" ");
  for (const fx of active) frame.classList.add(`fx-${fx.id}`);
  if (active.length > 1) frame.classList.add("fx-chaos-stack");
}

function fxOverlayRenderSignature(active = []) {
  const delayFrameStamp = active.some((fx) => fx.id === "delay")
    ? delayVisualFrames.at(-1)?.at || 0
    : 0;
  return `${delayFrameStamp}|${active.map((fx) => `${fx.id}:${fx.seed || ""}:${Number(fx.level || 1)}:${JSON.stringify(fx.params || {})}`).join("|")}`;
}

function syncFxOverlay(active = []) {
  const signature = fxOverlayRenderSignature(active);
  if (signature === fxOverlaySignature) return;
  fxOverlaySignature = signature;
  fxOverlay.innerHTML = active.length
    ? `${renderFxTexture(active)}${active.map(renderFxOverlay).join("")}${renderFrozenFrame()}`
    : "";
  renderLooperLayers();
}

function updateFxButtonStates(active = []) {
  const activeIds = new Set(active.map((fx) => fx.id));
  fxButtons.forEach((button) => {
    const isToggle = button.dataset.fxMode === "toggle";
    const isActive = isToggle && activeIds.has(button.dataset.fx);
    button.classList.toggle("active", isActive);
    if (isToggle) button.setAttribute("aria-pressed", String(isActive));
  });
  overlaySourceButton?.classList.toggle("active", activeIds.has("source-overlay"));
  overlaySourceButton?.setAttribute("aria-pressed", String(activeIds.has("source-overlay")));
}

function applyStackedFxFilter(active = [], intensity = 0, chaos = 1) {
  const youtubeElement = youtubePlayerElement();
  if (!active.length) {
    streamPlayer.style.filter = "";
    if (youtubeElement) youtubeElement.style.filter = "";
    return;
  }
  let hue = 0;
  let saturate = 1 + Math.min(1.8, intensity * 0.72);
  let contrast = 1 + Math.min(1.6, intensity * 0.5);
  let brightness = 1;
  let blur = 0;
  let grayscale = 0;
  let invert = 0;
  let sepia = 0;
  const visualFx = active.find((fx) => fx.id === "visual-adjust");
  if (visualFx) {
    const visual = normalizedVisualValues(visualFx.params);
    brightness *= visual.brightnessFilter;
    contrast *= visual.contrastFilter;
    saturate *= visual.saturationFilter;
    grayscale = Math.min(1, grayscale + visual.grayscale);
    invert = Math.min(1, invert + visual.invert);
    sepia = Math.min(1, sepia + visual.sepia);
    hue += visual.hue;
    blur += visual.blur;
    saturate += visual.smear * 0.25;
    contrast += visual.tear * 0.22 + visual.tracking * 0.15;
    brightness -= visual.tracking * 0.08;
  }

  for (const fx of active) {
    const level = Number(fx.level || 1);
    const amount = Math.min(1, 0.18 + level * 0.16);
    if (fx.id === "invert") invert = Math.min(1, invert + 0.88);
    if (fx.id === "palette-swap") hue += 210;
    if (fx.id === "kaleidoscope") hue += 90;
    if (fx.id === "color-acid") { hue += 80; saturate += 0.55 * amount; }
    if (fx.id === "color-hot") { hue += 290; saturate += 0.62 * amount; }
    if (fx.id === "color-ice") { hue += 165; brightness += 0.08 * amount; saturate += 0.46 * amount; }
    if (fx.id === "signal-loss") { grayscale = Math.min(1, grayscale + 0.7 * amount); brightness -= 0.25 * amount; contrast += 0.35 * amount; }
    if (fx.id === "vhs") { sepia += 0.16 * amount; saturate -= 0.25 * amount; contrast += 0.22 * amount; }
    if (fx.id === "glitch") { contrast += 0.32 * amount; saturate += 0.28 * amount; }
    if (fx.id === "glass") blur += 2.4 * amount;
    if (fx.id === "frozen") grayscale = Math.min(1, grayscale + 0.35 * amount);
    if (fx.id === "frequency-drift") { hue += 18 * chaos; blur += 0.42 * amount; contrast += 0.18 * amount; }
    if (fx.id === "party-damage") { saturate += 0.68 * amount; contrast += 0.3 * amount; brightness += 0.08 * amount; }
    if (fx.id === "caller-line") { grayscale = Math.min(1, grayscale + 0.25); sepia += 0.18; }
    if (fx.id === "dub-siren") { hue += 52; saturate += 0.28 * amount; }
    if (fx.id === "auto-filter-sweep") { hue += 120; contrast += 0.28 * amount; saturate += 0.42 * amount; }
    if (fx.id === "weed") { hue += 85; blur += 0.6 * amount; }
    if (fx.id === "beer") { sepia += 0.55 * amount; saturate += 0.22 * amount; }
    if (fx.id === "lsd") { hue += 36 * chaos; saturate += 0.85 * amount; }
  }

  const filter = [
    `hue-rotate(${Math.round(hue)}deg)`,
    `saturate(${Math.max(0.05, saturate).toFixed(2)})`,
    `contrast(${Math.max(0.2, contrast).toFixed(2)})`,
    `brightness(${Math.max(0.12, brightness).toFixed(2)})`,
    `grayscale(${Math.min(1, grayscale).toFixed(2)})`,
    `invert(${Math.min(1, invert).toFixed(2)})`,
    `sepia(${Math.min(1, sepia).toFixed(2)})`,
    `blur(${Math.min(8, blur).toFixed(2)}px)`
  ].join(" ");
  streamPlayer.style.filter = filter;
  if (youtubeElement) youtubeElement.style.filter = filter;
}

function normalizedVisualValues(params = {}) {
  const rawBrightness = clamp(Number(params.brightness ?? 100), -100, 300);
  const rawContrast = clamp(Number(params.contrast ?? 100), -100, 300);
  const rawSaturation = clamp(Number(params.saturation ?? 100), -100, 300);
  const tear = clamp(Number(params.tear ?? 0), 0, 100) / 100;
  const tracking = clamp(Number(params.tracking ?? 0), 0, 100) / 100;
  const smear = clamp(Number(params.smear ?? 0), 0, 100) / 100;
  const brightnessDamage = Math.max(0, -rawBrightness, rawBrightness - 160) / 100;
  const contrastDamage = Math.max(0, -rawContrast, rawContrast - 170) / 100;
  const saturationDamage = Math.max(0, -rawSaturation, rawSaturation - 180) / 100;
  const damage = Math.min(3.2, brightnessDamage + contrastDamage + saturationDamage + tear * 0.85 + tracking * 0.75 + smear * 0.62);
  return {
    rawBrightness,
    rawContrast,
    rawSaturation,
    tear,
    tracking,
    smear,
    damage,
    brightnessFilter: Math.max(0.02, rawBrightness / 100),
    contrastFilter: Math.max(0.04, rawContrast / 100),
    saturationFilter: Math.max(0, rawSaturation / 100),
    grayscale: rawSaturation < 0 ? Math.min(1, Math.abs(rawSaturation) / 100) : 0,
    invert: Math.max(0, -rawBrightness) / 180,
    sepia: Math.max(0, -rawContrast) / 180,
    hue: rawSaturation < 0 ? rawSaturation * -1.8 : Math.max(0, rawSaturation - 100) * 0.45,
    blur: damage * 0.9
  };
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function applyPageFx(active = []) {
  const pageFxIds = [
    "ui-tilt",
    "ui-shake",
    "ui-melt",
    "page-glare",
    "cursor-party",
    "ui-font-warp",
    "ui-spacing-collapse",
    "ui-panel-drift",
    "ui-low-res",
    "ui-contrast-crush",
    "ui-z-index-slip",
    "ui-scroll-sick",
    "ui-css-panic"
  ];
  const pageFx = active.filter((fx) => pageFxIds.includes(fx.id));
  const pageDamage = pageFx.reduce((sum, fx) => sum + Number(fx.level || 1), 0);
  const signature = pageFx.map((fx) => `${fx.id}:${fx.level || 1}:${fx.seed || ""}`).join("|");
  if (signature !== activePageFxSignature) {
    document.body.className = document.body.className
      .split(/\s+/)
      .filter((name) => name && !name.startsWith("page-fx-"))
      .join(" ");
    for (const fx of pageFx) document.body.classList.add(`page-fx-${fx.id}`);
    activePageFxSignature = signature;
  }
  document.body.style.setProperty("--page-damage", String(Math.min(16, pageDamage)));
  document.body.style.setProperty("--page-damage-px", `${Math.min(28, pageDamage * 2)}px`);
  document.body.style.setProperty("--page-damage-rot", `${Math.min(5, pageDamage * 0.34)}deg`);

  const themeFx = [...active]
    .reverse()
    .find((fx) => ["theme-cycle", "theme-random", "theme-aero-blast"].includes(fx.id));
  if (!themeFx) {
    displayTheme(currentTheme);
    return;
  }
  if (themeFx.id === "theme-cycle") {
    const elapsed = Math.max(0, Date.now() + clockDelta - themeFx.startedAt);
    const offset = Math.floor(seededNumber(themeFx.seed, 0, 5) * chaosThemeList.length);
    const index = (Math.floor(elapsed / 2200) + offset) % chaosThemeList.length;
    displayTheme(chaosThemeList[index]);
    return;
  }
  displayTheme(themeFx.params?.theme || "frutiger-aero");
}

function handleFxCommands(active) {
  for (const fx of active) {
    if (handledFxSeeds.has(fx.seed)) continue;
    handledFxSeeds.add(fx.seed);
    if (handledFxSeeds.size > 80) handledFxSeeds.delete([...handledFxSeeds][0]);
    if (["looper-capture", "looper-layer-1", "looper-layer-2", "looper-layer-3"].includes(fx.id)) {
      captureLooperLayer(Number(fx.params?.layer || fx.id.at(-1) || 1), fx.params || {});
    }
    if (fx.id === "looper-bpm-down") setLooperBpm(looperBpm - 10);
    if (fx.id === "looper-bpm-up") setLooperBpm(looperBpm + 10);
    if (fx.id === "looper-config") {
      applyLooperLayerConfig(fx.params || {});
      renderLooperLayers();
      updateLooperMonitor(`Edited L${Number(fx.params?.layer || selectedLooperLayer)}`);
    }
    if (fx.id === "looper-clear") clearLooperLayers();
    if (fx.id === "seed-skip") startSeedSkipper(fx);
    if (fx.id === "av-warp") applyAvWarp(fx.params);
    if (fx.id === "delay") applyDelayFx(fx.params);
    if (fx.id === "reverb") applyReverbFx(fx.params);
    if (fx.id === "frozen") captureFrozenFrame(fx);
    if (DJ_STINGER_FX.has(fx.id)) triggerAudioStinger(fx);
    if (fx.id === "soundboard-sample") playSoundboardSample(fx);
  }
}

function stingerContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  stingerAudioContext ||= new AudioContextClass();
  stingerAudioContext.resume?.();
  return stingerAudioContext;
}

function stingerGain(context, level = 0.24) {
  const gain = context.createGain();
  gain.gain.value = level * (viewerVolume / 100);
  gain.connect(context.destination);
  return gain;
}

function playTone(context, { frequency = 440, duration = 0.2, type = "square", start = 0, level = 0.2, endFrequency = frequency } = {}) {
  const oscillator = context.createOscillator();
  const gain = stingerGain(context, level);
  const now = context.currentTime + start;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
  gain.gain.setValueAtTime(level * (viewerVolume / 100), now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(gain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playNoise(context, { duration = 0.22, start = 0, level = 0.18, filter = 1800 } = {}) {
  const length = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = context.createBufferSource();
  const tone = context.createBiquadFilter();
  const gain = stingerGain(context, level);
  tone.type = "bandpass";
  tone.frequency.value = filter;
  tone.Q.value = 1.4;
  source.buffer = buffer;
  source.connect(tone);
  tone.connect(gain);
  source.start(context.currentTime + start);
}

function speakFxLine(text, { pitch = 0.8, rate = 1.05, volume = 0.85 } = {}) {
  if (!("speechSynthesis" in window) || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = volume * (viewerVolume / 100);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function playScratch(context, start = 0, level = 0.2) {
  [0, 0.04, 0.08, 0.14, 0.2].forEach((offset, index) => {
    playNoise(context, { start: start + offset, duration: 0.05 + index * 0.012, level: level * (1 - index * 0.08), filter: index % 2 ? 4800 : 2600 });
    playTone(context, { start: start + offset, frequency: 900 - index * 130, endFrequency: 180 + index * 60, duration: 0.055, type: "sawtooth", level: level * 0.42 });
  });
}

function triggerAudioStinger(fx) {
  if (peaceMode) return;
  const context = stingerContext();
  if (!context) return;
  if (fx.id === "amen-break") {
    [0, 0.11, 0.2, 0.28, 0.42, 0.52].forEach((start, index) => {
      playNoise(context, { start, duration: index % 2 ? 0.07 : 0.11, level: 0.18, filter: index % 2 ? 4200 : 900 });
      playTone(context, { start, frequency: index % 2 ? 920 : 140, endFrequency: index % 2 ? 220 : 70, duration: 0.08, type: "triangle", level: 0.08 });
    });
    return;
  }
  if (fx.id === "radio-sting") {
    playNoise(context, { duration: 0.55, level: 0.12, filter: 2600 });
    playTone(context, { frequency: 880, endFrequency: 1320, duration: 0.16, type: "sawtooth", level: 0.09 });
    playTone(context, { frequency: 660, endFrequency: 330, duration: 0.28, start: 0.18, type: "square", level: 0.08 });
    return;
  }
  if (fx.id === "legal-id") {
    const legalId = fx.params?.legalId || "WDOINK Low Power Basement";
    playNoise(context, { duration: 0.24, level: 0.1, filter: 3200 });
    playTone(context, { frequency: 520, endFrequency: 1040, duration: 0.16, type: "triangle", level: 0.1 });
    playTone(context, { frequency: 780, endFrequency: 390, duration: 0.18, start: 0.18, type: "square", level: 0.08 });
    speakFxLine(`${legalId}. You are listening to Doink TV after hours.`, { pitch: 0.65, rate: 0.94, volume: 0.72 });
    return;
  }
  if (fx.id === "cart-wall") {
    const cart = fx.params?.cart || "airhorn";
    playNoise(context, { duration: 0.12, level: 0.14, filter: 3400 });
    if (cart === "rewind") playScratch(context, 0.04, 0.24);
    if (cart === "siren") [0, 0.18, 0.36].forEach((start) => playTone(context, { start, frequency: 580, endFrequency: 980, duration: 0.16, type: "sawtooth", level: 0.1 }));
    if (cart === "needle-drop") playScratch(context, 0.02, 0.16);
    if (cart === "laser") [0, 0.08, 0.16].forEach((start) => playTone(context, { start, frequency: 1680, endFrequency: 420, duration: 0.08, type: "square", level: 0.08 }));
    if (cart === "bad-jingle") [440, 554, 659, 880].forEach((frequency, index) => playTone(context, { start: index * 0.1, frequency, duration: 0.09, type: "triangle", level: 0.08 }));
    if (cart === "panic-button" || cart === "airhorn") [0, 0.12].forEach((start) => playTone(context, { start, frequency: 330, endFrequency: 520, duration: 0.28, type: "sawtooth", level: 0.14 }));
    return;
  }
  if (fx.id === "record-scratch") {
    playScratch(context, 0, 0.28);
    return;
  }
  if (fx.id === "caller-line") {
    playNoise(context, { duration: 0.8, level: 0.06, filter: 1400 });
    playTone(context, { frequency: 440, endFrequency: 440, duration: 0.08, type: "sine", level: 0.08 });
    playTone(context, { frequency: 440, endFrequency: 440, duration: 0.08, start: 0.14, type: "sine", level: 0.08 });
    speakFxLine(`${fx.params?.username || "Caller"} says: ${fx.params?.text || "hello from the chat"}`, { pitch: 0.72, rate: 1.12, volume: 0.72 });
    return;
  }
  if (fx.id === "dub-siren") {
    [0, 0.34, 0.68].forEach((start) => {
      playTone(context, { start, frequency: 360, endFrequency: 980, duration: 0.28, type: "sawtooth", level: 0.14 });
      playNoise(context, { start, duration: 0.22, level: 0.05, filter: 900 });
    });
    return;
  }
  if (fx.id === "hum") {
    playTone(context, { frequency: 60, duration: 1.8, type: "sine", level: 0.18 });
    playTone(context, { frequency: 120, duration: 1.8, type: "sine", level: 0.06 });
    return;
  }
  if (fx.id === "gun") {
    playNoise(context, { duration: 0.18, level: 0.28, filter: 1200 });
    playTone(context, { frequency: 92, endFrequency: 36, duration: 0.24, type: "triangle", level: 0.2 });
    return;
  }
  if (fx.id === "countdown") {
    [0, 0.5, 1].forEach((start) => playTone(context, { start, frequency: 880, duration: 0.08, type: "square", level: 0.12 }));
  }
}

function playSoundboardSample(fx) {
  if (peaceMode) return;
  const src = fx.params?.path;
  if (!src) return;
  const audio = new Audio(src);
  audio.volume = effectiveSoundboardVolume();
  soundboardAudioInstances.add(audio);
  audio.addEventListener("ended", () => soundboardAudioInstances.delete(audio), { once: true });
  audio.addEventListener("error", () => soundboardAudioInstances.delete(audio), { once: true });
  audio.play().catch(() => {});
  showSoundboardToast(fx.params?.label || "Soundboard cart", fx.params?.color || "#f2b84a");
}

function effectiveSoundboardVolume() {
  return clamp((viewerVolume / 100) * (soundboardVolume / 100), 0, 1);
}

function normalizeSoundboardVolume(value) {
  const number = Number(value);
  return clamp(Number.isFinite(number) ? number : 100, 0, 140);
}

function updateSoundboardVolumeUi() {
  soundboardVolume = normalizeSoundboardVolume(soundboardVolume);
  if (soundboardVolumeSlider) {
    const knobLevel = `${Math.round((soundboardVolume / 140) * 100)}%`;
    const knobRotate = `${-135 + (soundboardVolume / 140) * 270}deg`;
    soundboardVolumeSlider.value = String(Math.round(soundboardVolume));
    soundboardVolumeSlider.style.setProperty("--knob-level", knobLevel);
    soundboardVolumeSlider.style.setProperty("--knob-rotate", knobRotate);
    soundboardVolumeSlider.closest(".soundboard-volume")?.style.setProperty("--knob-level", knobLevel);
    soundboardVolumeSlider.closest(".soundboard-volume")?.style.setProperty("--knob-rotate", knobRotate);
  }
  if (soundboardVolumeValue) soundboardVolumeValue.textContent = `${Math.round(soundboardVolume)}%`;
}

function applySoundboardVolume() {
  const volume = effectiveSoundboardVolume();
  for (const audio of soundboardAudioInstances) audio.volume = volume;
}

function loadSoundboardCollapsedGroups() {
  try {
    const raw = JSON.parse(localStorage.getItem("doink_soundboard_collapsed_groups") || "[]");
    return new Set(Array.isArray(raw) ? raw.map(String) : []);
  } catch {
    return new Set();
  }
}

function persistSoundboardCollapsedGroups() {
  localStorage.setItem("doink_soundboard_collapsed_groups", JSON.stringify([...soundboardCollapsedGroups]));
}

function toggleSoundboardGroup(groupId) {
  const id = String(groupId || "");
  if (!id) return;
  if (soundboardCollapsedGroups.has(id)) {
    soundboardCollapsedGroups.delete(id);
  } else {
    soundboardCollapsedGroups.add(id);
  }
  persistSoundboardCollapsedGroups();
  const selectorId = window.CSS?.escape ? CSS.escape(id) : id.replace(/"/g, '\\"');
  const group = djSoundboardGrid?.querySelector(`[data-soundboard-group="${selectorId}"]`);
  const toggle = group?.querySelector("[data-soundboard-group-toggle]");
  const collapsed = soundboardCollapsedGroups.has(id);
  group?.classList.toggle("is-collapsed", collapsed);
  toggle?.setAttribute("aria-expanded", String(!collapsed));
}

function showSoundboardToast(label, color) {
  if (!fxAudioLayer || peaceMode) return;
  const toast = document.createElement("div");
  toast.className = "fx-audio-toast soundboard-toast";
  toast.style.setProperty("--cart-color", color);
  toast.textContent = `Cart: ${label}`;
  fxAudioLayer.append(toast);
  setTimeout(() => toast.remove(), 2400);
}

function syncPlaylistAudio(fx) {
  if (!fxAudioLayer) return;
  if (peaceMode || !fx || fx.expiresAt <= Date.now() + clockDelta) {
    activePlaylistAudioSeed = "";
    fxAudioLayer.innerHTML = "";
    return;
  }
  if (activePlaylistAudioSeed === fx.seed) return;
  const videoId = escapeHtml(fx.params?.youtubeId || "");
  if (!videoId) return;
  activePlaylistAudioSeed = fx.seed;
  const start = Math.max(0, Math.floor(seededNumber(fx.seed, 0, 9) * Math.max(0, Number(fx.params?.duration || 0) - 20)));
  fxAudioLayer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&playsinline=1&start=${start}&rel=0&modestbranding=1"
      allow="autoplay; encrypted-media"
      title="${escapeHtml(fx.params?.title || "Random playlist audio")}"></iframe>
    <div class="fx-audio-toast">Audio: ${escapeHtml(fx.params?.title || "Random playlist audio")}</div>`;
}

function captureCurrentVideoFrame(width = 480, height = 270, quality = 0.72) {
  const video = currentProgram?.live?.source?.type === "youtube" ? null : streamPlayer;
  if (!video?.videoWidth || !video?.videoHeight) return "";
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

function normalizedLooperSettings(values = {}) {
  const layer = Math.max(1, Math.min(3, Number(values.layer || selectedLooperLayer || 1)));
  const defaults = looperLayerDefaults[layer - 1];
  const shape = ["full", "window", "strip", "band", "square"].includes(values.shape) ? values.shape : defaults.shape;
  const motion = ["still", "bounce", "pulse", "jitter", "slide", "spin"].includes(values.motion) ? values.motion : defaults.motion;
  const blend = ["normal", "screen", "overlay", "hard-light", "lighten", "multiply", "difference", "exclusion"].includes(values.blend) ? values.blend : defaults.blend;
  return {
    layer,
    shape,
    motion,
    blend,
    opacity: Math.round(clamp(Number(values.opacity ?? defaults.opacity), 0, 100)),
    x: Math.round(clamp(Number(values.x ?? defaults.x), -50, 50)),
    y: Math.round(clamp(Number(values.y ?? defaults.y), -50, 50)),
    size: Math.round(clamp(Number(values.size ?? defaults.size), 18, 140)),
    zoom: Math.round(clamp(Number(values.zoom ?? defaults.zoom), 80, 240))
  };
}

function readLooperControls() {
  return normalizedLooperSettings({
    layer: looperLayerSelect?.value,
    shape: looperShapeSelect?.value,
    motion: looperMotionSelect?.value,
    opacity: looperOpacitySlider?.value,
    blend: looperBlendSelect?.value,
    x: looperXSlider?.value,
    y: looperYSlider?.value,
    size: looperSizeSlider?.value,
    zoom: looperZoomSlider?.value
  });
}

function applyLooperLayerConfig(values = {}) {
  const settings = normalizedLooperSettings(values);
  const target = looperLayers[settings.layer - 1];
  Object.assign(target, settings);
  return target;
}

function updateLooperControlLabels() {
  const values = readLooperControls();
  if (looperOpacityValue) looperOpacityValue.textContent = `${values.opacity}%`;
  if (looperBlendValue) looperBlendValue.textContent = values.blend.replace("-", " ");
  if (looperMotionValue) looperMotionValue.textContent = values.motion.replace("-", " ");
  if (looperXValue) looperXValue.textContent = String(values.x);
  if (looperYValue) looperYValue.textContent = String(values.y);
  if (looperSizeValue) looperSizeValue.textContent = `${values.size}%`;
  if (looperZoomValue) looperZoomValue.textContent = `${values.zoom}%`;
  looperCaptureButton?.setAttribute("data-layer", String(values.layer));
}

function loadLooperLayerControls(layer = selectedLooperLayer) {
  const target = looperLayers[Math.max(0, Math.min(2, Number(layer) - 1))] || looperLayers[0];
  selectedLooperLayer = target.layer;
  if (looperLayerSelect) looperLayerSelect.value = String(target.layer);
  if (looperShapeSelect) looperShapeSelect.value = target.shape;
  if (looperMotionSelect) looperMotionSelect.value = target.motion;
  if (looperOpacitySlider) looperOpacitySlider.value = String(target.opacity);
  if (looperBlendSelect) looperBlendSelect.value = target.blend;
  if (looperXSlider) looperXSlider.value = String(target.x);
  if (looperYSlider) looperYSlider.value = String(target.y);
  if (looperSizeSlider) looperSizeSlider.value = String(target.size);
  if (looperZoomSlider) looperZoomSlider.value = String(target.zoom);
  updateLooperControlLabels();
  updateLooperMonitor();
}

function syncLooperPositionControls(layer) {
  if (Number(layer.layer) !== selectedLooperLayer) return;
  if (looperXSlider) looperXSlider.value = String(layer.x);
  if (looperYSlider) looperYSlider.value = String(layer.y);
  updateLooperControlLabels();
}

function setLooperLayerPosition(layerNumber, x, y) {
  const target = looperLayers[Math.max(0, Math.min(2, Number(layerNumber) - 1))];
  if (!target) return null;
  target.x = Math.round(clamp(Number(x), -50, 50));
  target.y = Math.round(clamp(Number(y), -50, 50));
  syncLooperPositionControls(target);
  return target;
}

function looperLayerDimensions(layer) {
  const size = Number(layer.size || 100);
  if (layer.shape === "full") return { width: size, height: size };
  if (layer.shape === "strip") return { width: size, height: 100 };
  if (layer.shape === "band") return { width: Math.max(40, size), height: Math.max(14, size * 0.32) };
  if (layer.shape === "square") return { width: size, height: size };
  return { width: size, height: Math.max(18, size * 0.62) };
}

function looperLayerStyle(layer) {
  const dimensions = looperLayerDimensions(layer);
  const image = layer.image ? `background-image:url('${layer.image}');` : "";
  return [
    image,
    `--looper-x:${Number(layer.x || 0)};`,
    `--looper-y:${Number(layer.y || 0)};`,
    `--looper-w:${dimensions.width.toFixed(1)};`,
    `--looper-h:${dimensions.height.toFixed(1)};`,
    `--looper-opacity:${Number(layer.opacity ?? 50) / 100};`,
    `--looper-zoom:${Number(layer.zoom || 100)}%;`,
    `mix-blend-mode:${layer.blend || "screen"};`
  ].join("");
}

async function broadcastLooperConfig(capture = false) {
  const params = readLooperControls();
  applyLooperLayerConfig(params);
  renderLooperLayers();
  try {
    const result = await adminCockpitApi.fx.trigger({ id: capture ? "looper-capture" : "looper-config", duration: 2, params });
    setMessage(fxMessage, `${result.fx.at(-1)?.label || "Signal looper"} fired.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

async function broadcastLooperLayerConfig(layerNumber) {
  const layer = looperLayers[Math.max(0, Math.min(2, Number(layerNumber) - 1))];
  if (!layer) return;
  try {
    await adminCockpitApi.fx.trigger({ id: "looper-config", duration: 2, params: normalizedLooperSettings(layer) });
    updateLooperMonitor(`Moved L${layer.layer}`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

async function refreshLooperLayerCapture(layerNumber) {
  loadLooperLayerControls(layerNumber);
  await broadcastLooperConfig(true);
}

function captureLooperLayer(layer = 1, settings = {}) {
  const index = Math.max(0, Math.min(2, layer - 1));
  const target = looperLayers[index];
  Object.assign(target, normalizedLooperSettings({ ...settings, layer }));
  try {
    target.image = captureCurrentVideoFrame();
  } catch {
    target.image = "";
  }
  target.fallback = !target.image;
  target.capturedAt = Date.now();
  looperPlaying = true;
  ensureLooperAudioMeter();
  startLooperBeat();
  renderLooperLayers();
  if (Number(layer) === selectedLooperLayer) loadLooperLayerControls(layer);
  updateLooperMonitor(`Captured L${target.layer}${target.fallback ? " (sync fallback)" : ""}`);
}

function captureFrozenFrame(fx) {
  try {
    frozenFrame = {
      image: captureCurrentVideoFrame(960, 540, 0.82),
      expiresAt: fx.expiresAt,
      fallback: false
    };
  } catch {
    frozenFrame = { image: "", expiresAt: fx.expiresAt, fallback: true };
  }
  frozenFrame.fallback = !frozenFrame.image;
}

function renderFrozenFrame() {
  if (!frozenFrame.expiresAt || frozenFrame.expiresAt <= Date.now() + clockDelta) return "";
  if (!frozenFrame.image) {
    return `<div class="frozen-frame-capture frozen-frame-fallback"><span>FROZEN FRAME</span></div>`;
  }
  return `<div class="frozen-frame-capture" style="background-image:url('${frozenFrame.image}')"><span>FROZEN FRAME</span></div>`;
}

function setLooperBpm(value) {
  looperBpm = Math.max(40, Math.min(240, value));
  startLooperBeat();
  updateLooperBpmDisplay();
  if (delayActive && delayState.sync) {
    updateDelayLabels(delayState);
    applyDelayToGraph();
  }
}

function startLooperBeat() {
  clearInterval(looperBeatTimer);
  clearInterval(looperReplayTimer);
  const interval = Math.max(120, Math.round(60000 / looperBpm));
  frame.style.setProperty("--looper-beat-ms", `${interval}ms`);
  updateLooperBpmDisplay();
  looperBeatTimer = setInterval(() => {
    if (!looperPlaying) return;
    frame.classList.add("fx-looper-beat");
    looperBeatLight?.classList.add("on");
    setTimeout(() => frame.classList.remove("fx-looper-beat"), Math.min(120, interval * 0.45));
    setTimeout(() => looperBeatLight?.classList.remove("on"), Math.min(120, interval * 0.45));
  }, interval);
  const startedAt = Date.now();
  looperReplayTimer = setInterval(() => {
    const progress = looperPlaying ? ((Date.now() - startedAt) % interval) / interval : 0;
    looperReplayHead?.style.setProperty("--replay-progress", `${Math.round(progress * 100)}%`);
  }, 50);
}

function updateLooperBpmDisplay() {
  if (looperBpmValue) looperBpmValue.textContent = `${looperBpm} BPM`;
}

function clearLooperLayers() {
  looperLayers.forEach((layer) => {
    layer.image = "";
    layer.fallback = false;
  });
  renderLooperLayers();
  updateLooperMonitor("Cleared");
}

function renderLooperLayers() {
  const activeLayers = looperLayers.filter((layer) => layer.image || layer.fallback);
  const existing = fxOverlay.querySelector(".looper-stack");
  existing?.remove();
  if (!activeLayers.length) {
    updateLooperMonitor();
    return;
  }
  const stack = document.createElement("div");
  stack.className = "looper-stack";
  stack.dataset.bpm = String(looperBpm);
  stack.innerHTML = activeLayers.map((layer) => `
    <div class="looper-layer looper-layer-${layer.layer} looper-shape-${escapeHtml(layer.shape || "window")} looper-motion-${escapeHtml(layer.motion || "still")} ${layer.fallback ? "fallback" : ""}" data-looper-layer="${layer.layer}" title="Drag layer ${layer.layer}. Click to recapture." style="${looperLayerStyle(layer)}"></div>
  `).join("");
  fxOverlay.append(stack);
  updateLooperMonitor();
}

function beginLooperLayerDrag(event) {
  const layerNode = event.target.closest(".looper-layer[data-looper-layer]");
  if (!layerNode) return;
  const layerNumber = Number(layerNode.dataset.looperLayer);
  const layer = looperLayers[Math.max(0, Math.min(2, layerNumber - 1))];
  if (!layer) return;
  event.preventDefault();
  loadLooperLayerControls(layerNumber);
  layerNode.setPointerCapture?.(event.pointerId);
  looperDragState = {
    pointerId: event.pointerId,
    node: layerNode,
    layerNumber,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startX: Number(layer.x || 0),
    startY: Number(layer.y || 0),
    moved: false
  };
  frame.classList.add("looper-dragging");
  layerNode.classList.add("dragging");
}

function updateLooperLayerDrag(event) {
  if (!looperDragState || event.pointerId !== looperDragState.pointerId) return;
  const rect = fxOverlay.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dx = ((event.clientX - looperDragState.startClientX) / rect.width) * 100;
  const dy = ((event.clientY - looperDragState.startClientY) / rect.height) * 100;
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) looperDragState.moved = true;
  const layer = setLooperLayerPosition(looperDragState.layerNumber, looperDragState.startX + dx, looperDragState.startY + dy);
  if (!layer) return;
  looperDragState.node.style.setProperty("--looper-x", String(layer.x));
  looperDragState.node.style.setProperty("--looper-y", String(layer.y));
}

async function finishLooperLayerDrag(event) {
  if (!looperDragState || event.pointerId !== looperDragState.pointerId) return;
  const state = looperDragState;
  looperDragState = null;
  state.node.releasePointerCapture?.(event.pointerId);
  state.node.classList.remove("dragging");
  frame.classList.remove("looper-dragging");
  if (state.moved) {
    renderLooperLayers();
    await broadcastLooperLayerConfig(state.layerNumber);
  } else {
    await refreshLooperLayerCapture(state.layerNumber);
  }
}

function updateLooperMonitor(statusText = "") {
  const activeLayers = looperLayers.filter((layer) => layer.image || layer.fallback);
  if (statusText && looperStatus) {
    looperStatus.textContent = statusText;
  } else if (looperStatus) {
    const selected = looperLayers[selectedLooperLayer - 1];
    looperStatus.textContent = activeLayers.length
      ? `${activeLayers.length} layer${activeLayers.length === 1 ? "" : "s"} replaying / L${selectedLooperLayer} ${selected.motion} ${selected.blend} ${selected.opacity}%`
      : "Idle";
  }
  looperLayerStatuses.forEach((node) => {
    const layer = looperLayers.find((item) => item.layer === Number(node.dataset.looperLayerStatus));
    node.classList.toggle("active", Boolean(layer?.image || layer?.fallback));
    node.classList.toggle("fallback", Boolean(layer?.fallback));
    node.classList.toggle("selected", Number(node.dataset.looperLayerStatus) === selectedLooperLayer);
  });
  if (looperPlayToggle) looperPlayToggle.textContent = looperPlaying ? "Pause replay" : "Play replay";
}

function setLooperPlaying(isPlaying) {
  looperPlaying = isPlaying;
  frame.classList.toggle("looper-paused", !looperPlaying);
  updateLooperMonitor(looperPlaying ? "Replay rolling" : "Replay paused");
}

function ensureLooperAudioMeter() {
  if (currentProgram?.live?.source?.type === "youtube") {
    if (!looperAudioTimer) startLooperAudioMeter(true);
    return;
  }
  if (looperAudioNodes) {
    if (!looperAudioTimer) startLooperAudioMeter(false);
    return;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      startLooperAudioMeter(true);
      return;
    }
    const context = delayNodes?.context || new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    let source = delayNodes?.source || null;
    if (!source && streamPlayer.captureStream) {
      const stream = streamPlayer.captureStream();
      if (stream.getAudioTracks().length) source = context.createMediaStreamSource(stream);
    }
    if (!source) {
      startLooperAudioMeter(true);
      return;
    }
    source.connect(analyser);
    looperAudioNodes = { context, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
    context.resume?.();
    startLooperAudioMeter();
  } catch {
    startLooperAudioMeter(true);
  }
}

function startLooperAudioMeter(fallback = false) {
  clearInterval(looperAudioTimer);
  looperAudioTimer = setInterval(() => {
    const values = [];
    if (!fallback && looperAudioNodes?.analyser) {
      looperAudioNodes.analyser.getByteFrequencyData(looperAudioNodes.data);
      for (let index = 0; index < 16; index += 1) values.push(looperAudioNodes.data[index * 2] / 255);
    } else {
      const pulse = (Math.sin(Date.now() / 90) + 1) / 2;
      for (let index = 0; index < 16; index += 1) values.push(Math.max(0.06, Math.abs(Math.sin(Date.now() / 180 + index)) * pulse));
    }
    renderLooperWaveform(values);
  }, 90);
}

function renderLooperWaveform(values) {
  if (!looperWaveform) return;
  looperWaveform.innerHTML = values.map((value) => `<i style="--level:${Math.max(0.06, value).toFixed(2)}"></i>`).join("");
}

function noteDivisionBeats(value) {
  return {
    "sixteenth": 0.25,
    "sixteenth-triplet": 1 / 6,
    "dotted-sixteenth": 0.375,
    "eighth": 0.5,
    "eighth-triplet": 1 / 3,
    "dotted-eighth": 0.75,
    "quarter": 1,
    "quarter-triplet": 2 / 3,
    "dotted-quarter": 1.5,
    "half": 2,
    "half-triplet": 4 / 3,
    "dotted-half": 3,
    "whole": 4,
    "whole-triplet": 8 / 3,
    "dotted-whole": 6
  }[value] || 1;
}

function seededRandom(seed) {
  let hash = 2166136261;
  const text = String(seed || "doink");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += 0x6D2B79F5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function startSeedSkipper(fx) {
  const key = `${fx.seed}:${fx.params?.seed || ""}:${fx.params?.division || ""}:${looperBpm}`;
  if (activeSeedSkipperKey === key && seedSkipperTimer) return;
  stopSeedSkipper();
  activeSeedSkipperKey = key;
  activeSeedSkipperRandom = seededRandom(`${fx.params?.seed || fx.seed}:${currentProgram?.live?.id || ""}`);
  const beatMs = 60000 / looperBpm;
  const interval = Math.max(80, Math.round(beatMs * noteDivisionBeats(fx.params?.division)));
  performSeedSkip();
  seedSkipperTimer = setInterval(performSeedSkip, interval);
}

function stopSeedSkipper() {
  clearInterval(seedSkipperTimer);
  seedSkipperTimer = 0;
  activeSeedSkipperKey = "";
  activeSeedSkipperRandom = null;
}

function performSeedSkip() {
  if (!currentProgram?.live || !activeSeedSkipperRandom) return;
  const duration = Math.max(1, Number(currentProgram.live.duration || 1));
  const target = Math.max(0, Math.min(duration - 0.4, activeSeedSkipperRandom() * duration));
  if (currentProgram.live.source.type === "youtube") {
    if (youtubeReady) {
      youtubePlayer.seekTo?.(target, true);
      youtubePlayer.playVideo?.();
    }
    return;
  }
  if (streamPlayer.seekable?.length) {
    const start = streamPlayer.seekable.start(0);
    const end = streamPlayer.seekable.end(streamPlayer.seekable.length - 1);
    streamPlayer.currentTime = start + activeSeedSkipperRandom() * Math.max(0.2, end - start);
    streamPlayer.play?.().catch(() => {});
  } else if (Number.isFinite(streamPlayer.duration) && streamPlayer.duration > 0) {
    streamPlayer.currentTime = Math.min(streamPlayer.duration - 0.2, target);
    streamPlayer.play?.().catch(() => {});
  }
}

function randomSeedText() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

function renderFxTexture(active = []) {
  const osIds = new Set(["os-popups", "blue-screen", "floppy-prompt", "retro-os", "illegal-operation"]);
  const noisyIds = new Set(["glitch", "signal-loss", "tape-warp", "vhs", "dvd-skip", "frozen", "hum", "radio-sting", "legal-id", "cart-wall", "record-scratch", "dj-mic", "frequency-drift", "caller-line", "party-damage", "dub-siren", "auto-filter-sweep", ...osIds]);
  const colorIds = ["palette-swap", "kaleidoscope", "invert", "color-acid", "color-hot", "color-ice"];
  const hasNoise = active.length > 2 || active.some((fx) => noisyIds.has(fx.id));
  const hasChroma = active.length > 1 || active.some((fx) => ["glitch", "vhs", ...colorIds].includes(fx.id));
  const hasDropout = active.length > 3 || active.some((fx) => ["signal-loss", "dvd-skip", "frozen"].includes(fx.id));
  const hasPixels = active.some((fx) => ["glitch", "dvd-skip", "pixelate", "glass", "melt", "retro-os", "blue-screen"].includes(fx.id)) || active.length > 3;
  const hasMagnetic = active.some((fx) => ["tape-warp", "vhs", "signal-loss", "kaleidoscope", "lsd", "floppy-prompt", "frequency-drift", "dub-siren"].includes(fx.id)) || active.length > 2;
  const hasDegauss = active.some((fx) => ["palette-swap", "color-acid", "color-hot", "color-ice", "invert", "kaleidoscope", "lsd", "party-damage", "auto-filter-sweep"].includes(fx.id));
  const visualRack = normalizedVisualValues(active.find((fx) => fx.id === "visual-adjust")?.params || {});
  const visualDamage = visualRack.damage;
  const hasVisualDamage = visualDamage > 0.08;
  const fillIds = new Set(["fill-water", "fill-shapes", "fill-marbles", "fill-stickers", "fill-confetti", "fill-popups", "fill-bubbles", "fill-static-panels"]);
  const fillLayers = active
    .filter((fx) => fillIds.has(fx.id))
    .map(renderScreenFill)
    .join("");
  const sourceLayers = active
    .filter((fx) => fx.id === "source-overlay")
    .map(renderSourceOverlay)
    .join("");
  const osLayers = active
    .filter((fx) => osIds.has(fx.id))
    .map(renderOsPanic)
    .join("");
  const detailLayers = active
    .map(renderFxDetailLayer)
    .join("");
  const delayFx = active.find((fx) => fx.id === "delay");
  return [
    (hasNoise || hasVisualDamage) ? `<div class="fx-texture fx-fine-noise" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasPixels || visualDamage > 0.28) ? `<div class="fx-texture fx-coarse-pixels" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasMagnetic || visualDamage > 0.62) ? `<div class="fx-texture fx-magnetic-bands" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasDegauss || visualDamage > 0.36) ? `<div class="fx-texture fx-degauss" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasChroma || visualRack.smear > 0.04) ? `<div class="fx-texture fx-chroma-smear" style="--visual-smear:${visualRack.smear.toFixed(2)}"></div>` : "",
    (hasDropout || visualRack.tear > 0.04) ? `<div class="fx-texture fx-dropout" style="--visual-tear:${visualRack.tear.toFixed(2)}"></div>` : "",
    visualRack.tracking > 0.04 ? `<div class="fx-detail fx-vhs-tracking fx-manual-tracking"><i></i><i></i><i></i></div>` : "",
    fillLayers,
    osLayers,
    detailLayers,
    delayFx ? renderDelayTrails(delayFx) : "",
    sourceLayers
  ].join("");
}

function renderDelayTrails(fx) {
  const state = normalizedDelayState(fx.params || delayState);
  if (!delayUsesVideo(state)) return "";
  const frames = delayVisualFrames.filter((frame) => frame.image);
  const mix = Math.max(0.08, Math.min(0.86, state.mix));
  if (!frames.length) return `<div class="fx-detail fx-video-delay fx-video-delay-live" style="--delay-mix:${mix};"><i></i><i></i><i></i></div>`;
  return `<div class="fx-detail fx-video-delay" style="--delay-mix:${mix};">${frames.slice(-DELAY_VISUAL_RENDER_LIMIT).reverse().map((frame, index) =>
    `<img src="${frame.image}" alt="" style="--n:${index};--age:${Math.max(1, Date.now() - frame.at)}ms;">`
  ).join("")}</div>`;
}

function renderFxDetailLayer(fx) {
  const level = Math.max(1, Number(fx.level || 1));
  const seed = String(fx.seed || fx.id);
  if (fx.id === "glitch") {
    return `<div class="fx-detail fx-glitch-tears">${Array.from({ length: Math.min(18, 6 + level * 3) }, (_, index) => `<i style="${tearStyle(seed, index)}"></i>`).join("")}</div>`;
  }
  if (fx.id === "tape-warp") {
    return `<div class="fx-detail fx-tape-curl"><i></i><i></i><i></i></div>`;
  }
  if (fx.id === "vhs") {
    return `<div class="fx-detail fx-vhs-tracking"><i></i><i></i><i></i></div>`;
  }
  if (fx.id === "aspect-bad") {
    return `<div class="fx-detail fx-aspect-guides"><b>4:3</b><span></span><b>16:9?</b></div>`;
  }
  if (fx.id === "crop-bad") {
    return `<div class="fx-detail fx-crop-mattes"><i></i><i></i><i></i><i></i></div>`;
  }
  if (fx.id === "glass") {
    return `<div class="fx-detail fx-glass-tiles">${Array.from({ length: 36 }, (_, index) => `<i style="--n:${index}"></i>`).join("")}</div>`;
  }
  if (fx.id === "melt") {
    return `<div class="fx-detail fx-melt-drips">${Array.from({ length: 9 }, (_, index) => `<i style="${dripStyle(seed, index)}"></i>`).join("")}</div>`;
  }
  if (fx.id === "kaleidoscope") {
    return `<div class="fx-detail fx-kaleido-shards">${Array.from({ length: 8 }, (_, index) => `<i style="--n:${index}"></i>`).join("")}</div>`;
  }
  if (fx.id === "gif-loops") {
    return `<div class="fx-detail fx-gif-storm">${Array.from({ length: Math.min(18, 7 + level * 3) }, (_, index) => screenFillItem(seed, index, ["LOOP", "GIF", "BUFFER", "AGAIN"][index % 4])).join("")}</div>`;
  }
  if (fx.id === "gun") {
    return `<div class="fx-detail fx-screen-hit"><i></i><b>BANG</b></div>`;
  }
  if (fx.id === "legal-id") {
    const legalId = fx.params?.legalId || "WDOINK basement";
    const note = fx.params?.note || "not actually your license";
    return `<div class="fx-detail fx-legal-id"><strong>${escapeHtml(legalId)}</strong><span>${escapeHtml(note)}</span></div>`;
  }
  if (fx.id === "show-cue") {
    const label = fx.params?.label || "SHOW CUE";
    const scene = fx.params?.scene || "DoinkTV";
    const clip = fx.params?.clip || "";
    const color = fx.params?.color || "#68c3b7";
    return `<div class="fx-detail fx-show-cue" style="--cue-color:${escapeHtml(color)}"><small>${escapeHtml(scene)}</small><strong>${escapeHtml(label)}</strong><span>${escapeHtml(clip)}</span></div>`;
  }
  if (fx.id === "cart-wall" || fx.id === "record-scratch" || fx.id === "dub-siren") {
    const label = fx.id === "record-scratch" ? "SCRATCH" : fx.id === "dub-siren" ? "DUB SIREN" : String(fx.params?.cart || "cart").replaceAll("-", " ");
    return `<div class="fx-detail fx-cart-wall">${Array.from({ length: 7 }, (_, index) => `<i style="${cartBurstStyle(seed, index)}">${escapeHtml(label)}</i>`).join("")}</div>`;
  }
  if (fx.id === "dj-mic") {
    return `<div class="fx-detail fx-dj-mic"><strong>MIC LIVE</strong><span>stream ducked - host is probably making it worse</span></div>`;
  }
  if (fx.id === "frequency-drift") {
    return `<div class="fx-detail fx-frequency-drift"><b>88.1</b><i></i><b>107.9</b><span>${Array.from({ length: 18 }, (_, index) => `<em style="--n:${index}"></em>`).join("")}</span></div>`;
  }
  if (fx.id === "caller-line") {
    const username = fx.params?.username || "caller";
    const text = fx.params?.text || "open line";
    return `<div class="fx-detail fx-caller-line"><strong>CALLER: ${escapeHtml(username)}</strong><span>${escapeHtml(text)}</span></div>`;
  }
  if (fx.id === "party-damage") {
    return `<div class="fx-detail fx-party-damage">${Array.from({ length: 26 }, (_, index) => screenFillItem(seed, index, ["DANCE", "SPILL", "LOUD", "ONE MORE", "REDLINE"][index % 5])).join("")}</div>`;
  }
  if (fx.id === "auto-filter-sweep") {
    return `<div class="fx-detail fx-auto-filter-sweep"><i></i><span>FILTER SWEEP</span></div>`;
  }
  return "";
}

function tearStyle(seed, index) {
  const y = Math.round(seededNumber(seed, index, 1) * 92);
  const h = 2 + Math.round(seededNumber(seed, index, 2) * 7);
  const x = Math.round((seededNumber(seed, index, 3) - 0.5) * 16);
  const delay = (seededNumber(seed, index, 4) * -0.9).toFixed(2);
  return `--y:${y}%;--h:${h}px;--x:${x}px;--delay:${delay}s;`;
}

function dripStyle(seed, index) {
  const x = 4 + Math.round(seededNumber(seed, index, 1) * 92);
  const h = 16 + Math.round(seededNumber(seed, index, 2) * 52);
  const delay = (seededNumber(seed, index, 3) * -2).toFixed(2);
  return `--x:${x}%;--h:${h}px;--delay:${delay}s;`;
}

function cartBurstStyle(seed, index) {
  const x = Math.round(seededNumber(seed, index, 1) * 88);
  const y = Math.round(seededNumber(seed, index, 2) * 82);
  const rotate = Math.round((seededNumber(seed, index, 3) - 0.5) * 28);
  const delay = (seededNumber(seed, index, 4) * -0.5).toFixed(2);
  return `--x:${x}%;--y:${y}%;--r:${rotate}deg;--delay:${delay}s;`;
}

function renderSourceOverlay(fx) {
  const source = fx.params?.source;
  if (!source) return "";
  const opacity = Math.max(0.05, Math.min(1, Number(fx.params?.opacity || 0.55)));
  const scale = Math.max(0.35, Math.min(1.8, Number(fx.params?.scale || 1)));
  const blend = escapeHtml(fx.params?.blend || "screen");
  const crop = escapeHtml(fx.params?.crop || "contain");
  const style = `--overlay-opacity:${opacity};--overlay-scale:${scale};--overlay-blend:${blend};`;
  if (source.type === "youtube") {
    const videoId = escapeHtml(source.youtubeId || youtubeIdFromUrl(source.url || ""));
    if (!videoId) return "";
    return `
      <div class="source-overlay source-overlay-${crop}" style="${style}">
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1" allow="autoplay; encrypted-media" title="${escapeHtml(source.title || "Overlay source")}"></iframe>
      </div>`;
  }
  const src = escapeHtml(source.type === "internet-archive" ? source.fileUrl : source.path || "");
  if (!src) return "";
  return `
    <div class="source-overlay source-overlay-${crop}" style="${style}">
      <video src="${src}" autoplay muted loop playsinline></video>
    </div>`;
}

function youtubeIdFromUrl(url = "") {
  const match = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || "";
}

function renderScreenFill(fx) {
  const level = Math.max(1, Number(fx.level || 1));
  const seed = String(fx.seed || fx.id);
  const count = Math.min(72, 14 + level * 8);
  if (fx.id === "fill-water") {
    return `<div class="fx-fill fx-fill-water">${Array.from({ length: 6 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}</div>`;
  }
  if (fx.id === "fill-static-panels") {
    return `<div class="fx-fill fx-fill-static-panels">${Array.from({ length: Math.min(18, 6 + level * 3) }, (_, index) => screenFillItem(seed, index, "STATIC")).join("")}</div>`;
  }
  const labels = {
    "fill-shapes": ["■", "●", "▲", "◆", "✚", "⬡"],
    "fill-marbles": ["", "", "", "", ""],
    "fill-stickers": ["WOW", "NOPE", "LIVE", "YIKES", "DOINK", "OK?"],
    "fill-confetti": ["", "", "", "", "", ""],
    "fill-popups": ["ERROR", "TRY AGAIN", "LOW SIGNAL", "ARE YOU SURE?", "BUFFER?", "ADVERTISEMENT"],
    "fill-bubbles": ["○", "◌", "◎", "◯", "○"]
  }[fx.id] || ["?"];
  return `<div class="fx-fill fx-${fx.id}">${Array.from({ length: count }, (_, index) =>
    screenFillItem(seed, index, labels[index % labels.length])
  ).join("")}</div>`;
}

function screenFillItem(seed, index, label) {
  const a = seededNumber(seed, index, 1);
  const b = seededNumber(seed, index, 2);
  const c = seededNumber(seed, index, 3);
  const d = seededNumber(seed, index, 4);
  const size = 18 + Math.round(c * 74);
  return `<i style="--x:${Math.round(a * 100)}%;--y:${Math.round(b * 100)}%;--s:${size}px;--r:${Math.round((d - 0.5) * 70)}deg;--delay:${(c * -3).toFixed(2)}s">${escapeHtml(label)}</i>`;
}

function renderOsPanic(fx) {
  const seed = String(fx.seed || fx.id);
  const level = Math.max(1, Number(fx.level || 1));
  if (fx.id === "blue-screen") {
    return `
      <div class="fx-os fx-os-bsod">
        <div class="fx-bsod-title">Windows</div>
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD DOINKTV(01).</p>
        <p>The current broadcast will continue. Press any key to be haunted.</p>
        <p class="fx-bsod-foot">Error: STREAM_STILL_VISIBLE</p>
      </div>`;
  }
  if (fx.id === "floppy-prompt") {
    return `
      <div class="fx-os fx-floppy" style="${osWindowStyle(seed, 0)}">
        <b>Drive A:</b>
        <p>Insert floppy disk into drive A:</p>
        <code>AMISH_TV.SYS not found</code>
        <button type="button">Retry</button><button type="button">Cancel</button>
      </div>`;
  }
  if (fx.id === "retro-os") {
    return `
      <div class="fx-os fx-retro-os">
        <div class="fx-retro-title">Program Manager</div>
        <div class="fx-retro-icons">
          <span>Broadcast.exe</span><span>Schedule.ini</span><span>Dialup</span><span>Trash</span>
        </div>
        <pre>C:\\DOINKTV&gt; LOAD HIGH /NOLOGO /CRT
BAD COMMAND OR FILE NAME
C:\\DOINKTV&gt; _</pre>
      </div>`;
  }
  const labels = fx.id === "illegal-operation"
    ? ["This program has performed an illegal operation.", "General protection fault.", "Kernel32.dll is disappointed.", "Stack overflow at AMISH.EXE"]
    : ["Error copying file.", "Cannot find SYSTEM.INI.", "Low memory warning.", "Unknown device detected.", "Explorer has stopped responding.", "Dial-up connection lost."];
  const count = Math.min(12, 4 + level * 2);
  return `<div class="fx-os-popups">${Array.from({ length: count }, (_, index) => renderOsPopup(seed, index, labels[index % labels.length], fx.id)).join("")}</div>`;
}

function renderOsPopup(seed, index, label, id) {
  return `
    <div class="fx-os-window ${id === "illegal-operation" ? "fx-os-illegal" : ""}" style="${osWindowStyle(seed, index)}">
      <div class="fx-os-title"><span>${id === "illegal-operation" ? "Program Error" : "Windows"}</span><b>x</b></div>
      <p>${escapeHtml(label)}</p>
      <div><button type="button">OK</button><button type="button">Details</button></div>
    </div>`;
}

function osWindowStyle(seed, index) {
  const x = 8 + Math.round(seededNumber(seed, index, 1) * 68);
  const y = 6 + Math.round(seededNumber(seed, index, 2) * 68);
  const rotate = Math.round((seededNumber(seed, index, 3) - 0.5) * 6);
  const delay = (seededNumber(seed, index, 4) * -2).toFixed(2);
  return `--x:${x}%;--y:${y}%;--r:${rotate}deg;--delay:${delay}s;`;
}

function seededNumber(seed, index, salt) {
  let hash = 2166136261;
  const text = `${seed}:${index}:${salt}`;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash += 0x6D2B79F5;
  let value = hash;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function readWarpControls() {
  return {
    speed: Number(warpSpeedSlider.value || 1),
    pitch: Number(warpPitchSlider.value || 1),
    desync: Number(warpDesyncSlider.value || 0)
  };
}

function updateWarpLabels(values = readWarpControls()) {
  warpSpeedValue.textContent = `${values.speed.toFixed(2)}x`;
  warpPitchValue.textContent = `${values.pitch.toFixed(2)}x`;
  warpDesyncValue.textContent = `${values.desync.toFixed(1)}s`;
}

function normalizedAvWarp(params = {}) {
  return {
    speed: Math.max(0.25, Math.min(2, Number(params.speed || 1))),
    pitch: Math.max(0.5, Math.min(2, Number(params.pitch || 1))),
    desync: Math.max(-4, Math.min(4, Number(params.desync || 0)))
  };
}

function applyAvWarp(params = {}) {
  avWarpTarget = normalizedAvWarp(params);
  avWarpActive = Math.abs(avWarpTarget.speed - 1) > 0.01 || Math.abs(avWarpTarget.pitch - 1) > 0.01 || Math.abs(avWarpTarget.desync) > 0.05;
  startAvWarpTween();
}

function resetAvWarp(updateControls = true) {
  if (!avWarpActive && avWarp.speed === 1 && avWarp.pitch === 1 && avWarp.desync === 0) return;
  avWarpActive = false;
  avWarp = { speed: 1, pitch: 1, desync: 0 };
  avWarpTarget = { speed: 1, pitch: 1, desync: 0 };
  clearInterval(avWarpTweenTimer);
  avWarpTweenTimer = 0;
  lastYoutubeWarpRate = 1;
  lastStreamWarpRate = Number.NaN;
  lastWarpPitchPreserve = null;
  lastWarpMediaApplyAt = 0;
  if (updateControls) {
    warpSpeedSlider.value = "1";
    warpPitchSlider.value = "1";
    warpDesyncSlider.value = "0";
    updateWarpLabels(avWarp);
  }
  applyAvWarpToPlayers(true);
}

function startAvWarpTween() {
  if (avWarpTweenTimer) return;
  avWarpTweenTimer = setInterval(() => {
    const ease = 0.22;
    avWarp = {
      speed: avWarp.speed + (avWarpTarget.speed - avWarp.speed) * ease,
      pitch: avWarp.pitch + (avWarpTarget.pitch - avWarp.pitch) * ease,
      desync: avWarp.desync + (avWarpTarget.desync - avWarp.desync) * ease
    };
    applyAvWarpToPlayers();
    const settled = Math.abs(avWarp.speed - avWarpTarget.speed) < 0.004
      && Math.abs(avWarp.pitch - avWarpTarget.pitch) < 0.004
      && Math.abs(avWarp.desync - avWarpTarget.desync) < 0.03;
    if (settled) {
      avWarp = { ...avWarpTarget };
      applyAvWarpToPlayers(true);
      clearInterval(avWarpTweenTimer);
      avWarpTweenTimer = 0;
    }
  }, 50);
}

function applyAvWarpToPlayers(force = false) {
  const rate = Math.max(0.35, Math.min(1.75, avWarp.speed * Math.sqrt(avWarp.pitch)));
  const warpAmount = Math.min(1, Math.abs(avWarp.speed - 1) * 0.8 + Math.abs(avWarp.pitch - 1) * 0.45 + Math.abs(avWarp.desync) * 0.12);
  frame.style.setProperty("--av-warp-amount", warpAmount.toFixed(3));
  frame.style.setProperty("--av-warp-shift", `${(avWarp.desync * 2.2).toFixed(2)}px`);
  frame.style.setProperty("--av-warp-skew", `${(((avWarp.speed - 1) * 1.2) + ((avWarp.pitch - 1) * 0.55)).toFixed(2)}deg`);
  frame.style.setProperty("--av-warp-scale", (1 + warpAmount * 0.018).toFixed(3));
  frame.style.setProperty("--av-warp-contrast", (1 + warpAmount * 0.12).toFixed(3));
  frame.style.setProperty("--av-warp-saturate", (1 + warpAmount * 0.18).toFixed(3));
  const now = performance.now();
  const shouldApplyMedia = force
    || Number.isNaN(lastStreamWarpRate)
    || Math.abs(rate - lastStreamWarpRate) > 0.018
    || now - lastWarpMediaApplyAt > 240;
  if (shouldApplyMedia && (force || streamPlayer.readyState >= 1)) {
    streamPlayer.playbackRate = rate;
    streamPlayer.defaultPlaybackRate = rate;
    lastStreamWarpRate = rate;
    lastWarpMediaApplyAt = now;
  }
  const preservePitch = Math.abs(avWarp.pitch - 1) < 0.03;
  if (force || preservePitch !== lastWarpPitchPreserve) {
    if ("preservesPitch" in streamPlayer) streamPlayer.preservesPitch = preservePitch;
    if ("mozPreservesPitch" in streamPlayer) streamPlayer.mozPreservesPitch = preservePitch;
    if ("webkitPreservesPitch" in streamPlayer) streamPlayer.webkitPreservesPitch = preservePitch;
    lastWarpPitchPreserve = preservePitch;
  }
  if (youtubeReady) {
    const youtubeRate = nearestYouTubeRate(rate);
    if (force || Math.abs(youtubeRate - lastYoutubeWarpRate) >= 0.24) {
      lastYoutubeWarpRate = youtubeRate;
      youtubePlayer.setPlaybackRate?.(youtubeRate);
    }
  }
}

function nearestYouTubeRate(rate) {
  return [0.25, 0.5, 1, 1.5, 2].reduce((closest, option) =>
    Math.abs(option - rate) < Math.abs(closest - rate) ? option : closest, 1);
}

async function broadcastAvWarp() {
  const values = readWarpControls();
  updateWarpLabels(values);
  applyAvWarp(values);
  clearTimeout(avWarpPostTimer);
  avWarpPostTimer = setTimeout(async () => {
    try {
      await adminCockpitApi.fx.trigger({ id: "av-warp", duration: 90, params: values });
      setMessage(fxMessage, "A/V warp updated.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 280);
}

function readVisualControls() {
  return {
    brightness: Number(visualBrightnessSlider?.value || 100),
    contrast: Number(visualContrastSlider?.value || 100),
    saturation: Number(visualSaturationSlider?.value || 100),
    tear: Number(visualTearSlider?.value || 0),
    tracking: Number(visualTrackingSlider?.value || 0),
    smear: Number(visualSmearSlider?.value || 0)
  };
}

function updateVisualLabels(values = readVisualControls()) {
  if (visualBrightnessValue) visualBrightnessValue.textContent = `${Math.round(values.brightness)}%`;
  if (visualContrastValue) visualContrastValue.textContent = `${Math.round(values.contrast)}%`;
  if (visualSaturationValue) visualSaturationValue.textContent = `${Math.round(values.saturation)}%`;
  if (visualTearValue) visualTearValue.textContent = `${Math.round(values.tear || 0)}%`;
  if (visualTrackingValue) visualTrackingValue.textContent = `${Math.round(values.tracking || 0)}%`;
  if (visualSmearValue) visualSmearValue.textContent = `${Math.round(values.smear || 0)}%`;
}

async function broadcastVisualAdjust() {
  const values = readVisualControls();
  updateVisualLabels(values);
  clearTimeout(visualPostTimer);
  visualPostTimer = setTimeout(async () => {
    try {
      await adminCockpitApi.fx.trigger({ id: "visual-adjust", duration: 90, params: values });
      setMessage(fxMessage, "Visual abuse updated.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 120);
}

async function resetVisualAdjust() {
  if (visualBrightnessSlider) visualBrightnessSlider.value = "100";
  if (visualContrastSlider) visualContrastSlider.value = "100";
  if (visualSaturationSlider) visualSaturationSlider.value = "100";
  if (visualTearSlider) visualTearSlider.value = "0";
  if (visualTrackingSlider) visualTrackingSlider.value = "0";
  if (visualSmearSlider) visualSmearSlider.value = "0";
  updateVisualLabels();
  await adminCockpitApi.fx.trigger({ id: "visual-adjust", duration: 2, params: readVisualControls() }).catch(() => {});
}

function delayControlNumber(control, fallback) {
  return Number(control?.value ?? fallback);
}

function delayChoice(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function setDelayControlValue(control, value) {
  if (control) control.value = String(value);
}

function clearDelayTimer(timer) {
  clearInterval(timer);
  return 0;
}

function readDelayControls() {
  return normalizedDelayState({
    timeMs: delayControlNumber(delayTimeSlider, DELAY_DEFAULTS.timeMs),
    feedback: delayControlNumber(delayFeedbackSlider, DELAY_DEFAULTS.feedback * 100) / 100,
    mix: delayControlNumber(delayMixSlider, DELAY_DEFAULTS.mix * 100) / 100,
    tone: delayControlNumber(delayToneSlider, DELAY_DEFAULTS.tone),
    sync: delaySyncToggle?.checked ?? DELAY_DEFAULTS.sync,
    division: delayDivisionSelect?.value,
    repitch: delayRepitchSelect?.value,
    target: delayTargetSelect?.value
  }, DELAY_DEFAULTS);
}

function normalizedDelayState(params = {}, fallback = delayState) {
  const base = { ...DELAY_DEFAULTS, ...fallback };
  const division = delayChoice(params.division, DELAY_DIVISIONS, base.division);
  const repitch = delayChoice(params.repitch, DELAY_REPITCH_MODES, base.repitch);
  const target = delayChoice(params.target, DELAY_TARGETS, base.target);
  return {
    timeMs: clamp(Number(params.timeMs ?? base.timeMs), ...DELAY_LIMITS.timeMs),
    feedback: clamp(Number(params.feedback ?? base.feedback), ...DELAY_LIMITS.feedback),
    mix: clamp(Number(params.mix ?? base.mix), ...DELAY_LIMITS.mix),
    tone: clamp(Number(params.tone ?? base.tone), ...DELAY_LIMITS.tone),
    sync: params.sync !== undefined ? Boolean(params.sync) : base.sync,
    division,
    repitch,
    target
  };
}

function syncDelayControls(values = delayState) {
  setDelayControlValue(delayTimeSlider, values.timeMs);
  setDelayControlValue(delayFeedbackSlider, Math.round(values.feedback * 100));
  setDelayControlValue(delayMixSlider, Math.round(values.mix * 100));
  setDelayControlValue(delayToneSlider, values.tone);
  if (delaySyncToggle) delaySyncToggle.checked = values.sync;
  setDelayControlValue(delayDivisionSelect, values.division);
  setDelayControlValue(delayRepitchSelect, values.repitch);
  setDelayControlValue(delayTargetSelect, values.target);
}

function delayUsesAudio(values = delayState) {
  return values.target !== "video";
}

function delayUsesVideo(values = delayState) {
  return values.target !== "audio";
}

function syncedDelaySeconds(values) {
  const bpm = clamp(Number(looperBpm), 40, 240);
  return clamp((60 / bpm) * noteDivisionBeats(values.division), ...DELAY_LIMITS.seconds);
}

function effectiveDelaySeconds(values = delayState) {
  return values.sync ? syncedDelaySeconds(values) : clamp(values.timeMs / 1000, ...DELAY_LIMITS.seconds);
}

function updateDelayLabels(values = readDelayControls()) {
  const state = normalizedDelayState(values);
  const seconds = effectiveDelaySeconds(state);
  if (delayTimeValue) delayTimeValue.textContent = state.sync ? `${state.division.replaceAll("-", " ")} (${Math.round(seconds * 1000)}ms)` : `${Math.round(state.timeMs)}ms`;
  if (delayFeedbackValue) delayFeedbackValue.textContent = `${Math.round(state.feedback * 100)}%`;
  if (delayMixValue) delayMixValue.textContent = `${Math.round(state.mix * 100)}%`;
  if (delayToneValue) delayToneValue.textContent = state.tone >= 1000 ? `${(state.tone / 1000).toFixed(1)}k` : `${Math.round(state.tone)}Hz`;
  updateDelayToggle();
}

function readReverbControls() {
  return normalizedReverbState({
    size: delayControlNumber(reverbSizeSlider, REVERB_DEFAULTS.size),
    decay: delayControlNumber(reverbDecaySlider, REVERB_DEFAULTS.decay),
    preDelayMs: delayControlNumber(reverbPreDelaySlider, REVERB_DEFAULTS.preDelayMs),
    mix: delayControlNumber(reverbMixSlider, REVERB_DEFAULTS.mix * 100) / 100,
    tone: delayControlNumber(reverbToneSlider, REVERB_DEFAULTS.tone),
    character: reverbCharacterSelect?.value
  }, REVERB_DEFAULTS);
}

function normalizedReverbState(params = {}, fallback = reverbState) {
  const base = { ...REVERB_DEFAULTS, ...fallback };
  return {
    size: clamp(Number(params.size ?? base.size), ...REVERB_LIMITS.size),
    decay: clamp(Number(params.decay ?? base.decay), ...REVERB_LIMITS.decay),
    preDelayMs: clamp(Number(params.preDelayMs ?? base.preDelayMs), ...REVERB_LIMITS.preDelayMs),
    mix: clamp(Number(params.mix ?? base.mix), ...REVERB_LIMITS.mix),
    tone: clamp(Number(params.tone ?? base.tone), ...REVERB_LIMITS.tone),
    character: delayChoice(params.character, REVERB_CHARACTERS, base.character)
  };
}

function syncReverbControls(values = reverbState) {
  setDelayControlValue(reverbSizeSlider, Math.round(values.size));
  setDelayControlValue(reverbDecaySlider, values.decay.toFixed(1));
  setDelayControlValue(reverbPreDelaySlider, Math.round(values.preDelayMs));
  setDelayControlValue(reverbMixSlider, Math.round(values.mix * 100));
  setDelayControlValue(reverbToneSlider, values.tone);
  setDelayControlValue(reverbCharacterSelect, values.character);
}

function updateReverbLabels(values = readReverbControls()) {
  const state = normalizedReverbState(values);
  if (reverbSizeValue) reverbSizeValue.textContent = `${Math.round(state.size)}%`;
  if (reverbDecayValue) reverbDecayValue.textContent = `${state.decay.toFixed(1)}s`;
  if (reverbPreDelayValue) reverbPreDelayValue.textContent = `${Math.round(state.preDelayMs)}ms`;
  if (reverbMixValue) reverbMixValue.textContent = `${Math.round(state.mix * 100)}%`;
  if (reverbToneValue) reverbToneValue.textContent = state.tone >= 1000 ? `${(state.tone / 1000).toFixed(1)}k` : `${Math.round(state.tone)}Hz`;
  updateReverbToggle();
}

function updateOverlayLabels() {
  overlayOpacityValue.textContent = `${overlayOpacitySlider.value}%`;
  overlayScaleValue.textContent = `${overlayScaleSlider.value}%`;
  overlayDurationValue.textContent = `${overlayDurationSlider.value}s`;
}

function renderOverlaySourcePicker(data = adminDataCache) {
  const sources = (data.sources || []).filter((source) => source.type !== "bump");
  const current = overlaySourceSelect.value;
  overlaySourceSelect.innerHTML = [
    `<option value="">Choose source...</option>`,
    ...sources.map((source) => {
      const selected = source.id === current ? " selected" : "";
      return `<option value="${source.id}"${selected}>${escapeHtml(source.title)} (${source.type})</option>`;
    })
  ].join("");
}

async function broadcastSourceOverlay() {
  const sourceId = overlaySourceSelect.value;
  if (!sourceId) {
    setMessage(fxMessage, "Choose a source to overlay.", true);
    return;
  }
  const params = {
    sourceId,
    blend: overlayBlendSelect.value,
    crop: overlayCropSelect.value,
    opacity: Number(overlayOpacitySlider.value || 55) / 100,
    scale: Number(overlayScaleSlider.value || 100) / 100
  };
  try {
    const result = await adminCockpitApi.fx.trigger({ id: "source-overlay", duration: Number(overlayDurationSlider.value || 45), params, toggle: true });
    setMessage(fxMessage, `Source overlay ${result.toggledOff ? "off" : "on"}.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

function ensureAudioFxGraph() {
  if (delayNodes) return delayNodes;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  const context = new AudioContextClass();
  const source = context.createMediaElementSource(streamPlayer);
  const dry = context.createGain();
  const wet = context.createGain();
  const delay = context.createDelay(2.5);
  const feedback = context.createGain();
  const tone = context.createBiquadFilter();
  const reverbPreDelay = context.createDelay(0.2);
  const reverb = context.createConvolver();
  const reverbTone = context.createBiquadFilter();
  const reverbWet = context.createGain();
  tone.type = "lowpass";
  reverbTone.type = "lowpass";
  wet.gain.value = 0;
  feedback.gain.value = 0;
  reverbWet.gain.value = 0;
  source.connect(dry);
  dry.connect(context.destination);
  source.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(tone);
  tone.connect(wet);
  wet.connect(context.destination);
  source.connect(reverbPreDelay);
  reverbPreDelay.connect(reverb);
  reverb.connect(reverbTone);
  reverbTone.connect(reverbWet);
  reverbWet.connect(context.destination);
  delayNodes = { context, source, dry, wet, delay, feedback, tone, reverbPreDelay, reverb, reverbTone, reverbWet };
  return delayNodes;
}

function ensureDelayGraph() {
  return ensureAudioFxGraph();
}

function applyDelayFx(params = {}) {
  delayActive = true;
  delayState = normalizedDelayState(params);
  syncDelayControls(delayState);
  updateDelayLabels(delayState);
  applyDelayToGraph();
  updateDelayVisualCapture();
}

function applyDelayToGraph() {
  if (!delayUsesAudio(delayState)) {
    silenceDelayGraph();
    return;
  }
  const nodes = ensureAudioFxGraph();
  if (!nodes) return;
  nodes.context.resume?.();
  const now = nodes.context.currentTime;
  const baseDelay = effectiveDelaySeconds(delayState);
  const delaySeconds = delayState.repitch === "slap" ? Math.min(0.18, baseDelay) : baseDelay;
  const feedback = delayState.repitch === "slap" ? Math.min(delayState.feedback, 0.28) : delayState.feedback;
  const tone = delayState.repitch === "dub" ? Math.min(delayState.tone, 2600) : delayState.tone;
  const dryLevel = Math.max(0.45, 1 - delayState.mix * 0.35);
  nodes.delay.delayTime.cancelScheduledValues(now);
  if (delayState.repitch === "digital") {
    nodes.delay.delayTime.setTargetAtTime(delaySeconds, now, 0.015);
  } else {
    nodes.delay.delayTime.linearRampToValueAtTime(delaySeconds, now + 0.09);
  }
  nodes.feedback.gain.setTargetAtTime(feedback, now, 0.02);
  nodes.wet.gain.setTargetAtTime(delayState.mix, now, 0.02);
  nodes.tone.frequency.setTargetAtTime(tone, now, 0.04);
  updateAudioFxDryLevel(dryLevel);
  startDelayModulation();
}

function silenceDelayGraph() {
  delayLfoTimer = clearDelayTimer(delayLfoTimer);
  if (!delayNodes) return;
  const now = delayNodes.context.currentTime;
  delayNodes.wet.gain.setTargetAtTime(0, now, 0.03);
  delayNodes.feedback.gain.setTargetAtTime(0, now, 0.03);
  updateAudioFxDryLevel();
}

function updateAudioFxDryLevel(delayDryOverride = null) {
  if (!delayNodes) return;
  const now = delayNodes.context.currentTime;
  const delayDry = delayDryOverride ?? (delayActive && delayUsesAudio(delayState) ? Math.max(0.45, 1 - delayState.mix * 0.35) : 1);
  const reverbDry = reverbActive ? Math.max(0.42, 1 - reverbState.mix * 0.26) : 1;
  delayNodes.dry.gain.setTargetAtTime(Math.min(delayDry, reverbDry), now, 0.025);
}

function createReverbImpulse(context, state = reverbState) {
  const characterScale = { room: 0.72, plate: 0.95, hall: 1.22, tunnel: 1.45 }[state.character] || 1;
  const seconds = clamp(state.decay * (0.5 + state.size / 100) * characterScale, 0.18, 9);
  const length = Math.max(1, Math.floor(context.sampleRate * seconds));
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const t = i / length;
      const shaped = state.character === "tunnel"
        ? Math.cos(t * Math.PI * 18) * (1 - t)
        : (Math.random() * 2 - 1);
      const plateBright = state.character === "plate" ? 1 - t * 0.28 : 1;
      data[i] = shaped * Math.pow(1 - t, 1.2 + (100 - state.size) / 90) * plateBright;
    }
  }
  return impulse;
}

function applyReverbFx(params = {}) {
  reverbActive = true;
  reverbState = normalizedReverbState(params);
  syncReverbControls(reverbState);
  updateReverbLabels(reverbState);
  applyReverbToGraph();
}

function applyReverbToGraph() {
  const nodes = ensureAudioFxGraph();
  if (!nodes) return;
  nodes.context.resume?.();
  const now = nodes.context.currentTime;
  const impulseKey = `${Math.round(reverbState.size)}:${reverbState.decay.toFixed(1)}:${reverbState.character}`;
  if (impulseKey !== reverbImpulseKey) {
    reverbImpulseKey = impulseKey;
    nodes.reverb.buffer = createReverbImpulse(nodes.context, reverbState);
  }
  nodes.reverbPreDelay.delayTime.setTargetAtTime(reverbState.preDelayMs / 1000, now, 0.018);
  nodes.reverbWet.gain.setTargetAtTime(reverbState.mix, now, 0.025);
  nodes.reverbTone.frequency.setTargetAtTime(reverbState.tone, now, 0.04);
  updateAudioFxDryLevel();
}

function silenceReverbGraph() {
  if (!delayNodes) return;
  const now = delayNodes.context.currentTime;
  delayNodes.reverbWet.gain.setTargetAtTime(0, now, 0.04);
  updateAudioFxDryLevel();
}

function updateDelayVisualCapture() {
  delayVisualTimer = clearDelayTimer(delayVisualTimer);
  if (!delayActive || !delayUsesVideo(delayState)) {
    delayVisualFrames = [];
    return;
  }
  captureDelayVisualFrame();
  delayVisualTimer = setInterval(
    captureDelayVisualFrame,
    clamp(effectiveDelaySeconds(delayState) * 250, ...DELAY_LIMITS.visualCaptureMs)
  );
}

function captureDelayVisualFrame() {
  if (!delayActive || !delayUsesVideo(delayState)) return;
  if (frame.dataset.mode === "youtube") return;
  if (streamPlayer.readyState < 2 || streamPlayer.videoWidth <= 0 || streamPlayer.videoHeight <= 0) return;
  try {
    const canvas = document.createElement("canvas");
    const width = DELAY_VISUAL_CAPTURE_WIDTH;
    const height = Math.max(1, Math.round(width * (streamPlayer.videoHeight / streamPlayer.videoWidth)));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    context.drawImage(streamPlayer, 0, 0, width, height);
    delayVisualFrames.push({ image: canvas.toDataURL("image/jpeg", DELAY_VISUAL_JPEG_QUALITY), at: Date.now() });
    delayVisualFrames = delayVisualFrames.slice(-DELAY_VISUAL_FRAME_LIMIT);
    syncFxOverlay(lastBroadcastFx);
  } catch {
    delayVisualFrames = [];
  }
}

function startDelayModulation() {
  delayLfoTimer = clearDelayTimer(delayLfoTimer);
  if (!delayActive || delayState.repitch !== "tape" || !delayNodes) return;
  delayLfoTimer = setInterval(() => {
    if (!delayActive || !delayNodes) return;
    const now = delayNodes.context.currentTime;
    const base = effectiveDelaySeconds(delayState);
    delayNodes.delay.delayTime.setTargetAtTime(clamp(base * (0.985 + Math.random() * 0.03), ...DELAY_LIMITS.seconds), now, 0.08);
  }, DELAY_TAPE_MODULATION_MS);
}

function disableDelay(updateControls = true) {
  if (!delayActive && !delayNodes && !delayVisualTimer) return;
  delayActive = false;
  delayLfoTimer = clearDelayTimer(delayLfoTimer);
  delayVisualTimer = clearDelayTimer(delayVisualTimer);
  delayVisualFrames = [];
  silenceDelayGraph();
  if (updateControls) {
    updateDelayLabels(readDelayControls());
  }
  updateDelayToggle();
}

function disableReverb(updateControls = true) {
  if (!reverbActive && !delayNodes) return;
  reverbActive = false;
  silenceReverbGraph();
  if (updateControls) {
    updateReverbLabels(readReverbControls());
  }
  updateReverbToggle();
}

function updateDelayToggle() {
  if (!delayToggleButton) return;
  delayToggleButton.classList.toggle("active", delayActive);
  delayToggleButton.setAttribute("aria-pressed", String(delayActive));
  delayToggleButton.textContent = delayActive ? "Delay on" : "Delay off";
}

async function broadcastDelay() {
  const values = readDelayControls();
  updateDelayLabels(values);
  delayRemoteHoldUntil = Date.now() + 3000;
  applyDelayFx(values);
  clearTimeout(delayPostTimer);
  delayPostTimer = setTimeout(async () => {
    try {
      await adminCockpitApi.fx.trigger({ id: "delay", params: { ...values, enabled: true } });
      setMessage(fxMessage, "Delay on.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 120);
}

async function toggleDelay() {
  if (delayActive) {
    delayRemoteHoldUntil = 0;
    disableDelay(true);
    clearTimeout(delayPostTimer);
    try {
      await adminCockpitApi.fx.trigger({ id: "delay", params: { enabled: false } });
      setMessage(fxMessage, "Delay off.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
    return;
  }
  await broadcastDelay();
}

function updateReverbToggle() {
  if (!reverbToggleButton) return;
  reverbToggleButton.classList.toggle("active", reverbActive);
  reverbToggleButton.setAttribute("aria-pressed", String(reverbActive));
  reverbToggleButton.textContent = reverbActive ? "Reverb on" : "Reverb off";
}

async function broadcastReverb() {
  const values = readReverbControls();
  updateReverbLabels(values);
  reverbRemoteHoldUntil = Date.now() + 3000;
  applyReverbFx(values);
  clearTimeout(reverbPostTimer);
  reverbPostTimer = setTimeout(async () => {
    try {
      await adminCockpitApi.fx.trigger({ id: "reverb", params: { ...values, enabled: true } });
      setMessage(fxMessage, "Reverb on.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 120);
}

async function toggleReverb() {
  if (reverbActive) {
    reverbRemoteHoldUntil = 0;
    disableReverb(true);
    clearTimeout(reverbPostTimer);
    try {
      await adminCockpitApi.fx.trigger({ id: "reverb", params: { enabled: false } });
      setMessage(fxMessage, "Reverb off.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
    return;
  }
  await broadcastReverb();
}

function renderFxOverlay(fx) {
  const text = {
    "signal-loss": "",
    "color-bars": "",
    countdown: String(Math.max(0, Math.ceil((fx.expiresAt - (Date.now() + clockDelta)) / 1000))),
    gun: "BANG",
    "meme-jazz": "you like jazz?",
    "meme-done": "I can't believe you've done this",
    "radio-sting": "WDOINK FM",
    "legal-id": fx.params?.legalId || "LEGAL ID",
    "cart-wall": String(fx.params?.cart || "CART WALL").replaceAll("-", " "),
    "record-scratch": "SKRRT",
    "dj-mic": "MIC LIVE",
    "frequency-drift": "FREQUENCY DRIFT",
    "caller-line": fx.params?.username ? `CALLER: ${fx.params.username}` : "CALLER LINE",
    "party-damage": "PARTY DAMAGE",
    "dub-siren": "DUB SIREN",
    "show-cue": fx.params?.label || "SHOW CUE",
    "auto-filter-sweep": "FILTER SWEEP",
    "amen-break": "AMEN",
    hum: "60Hz",
    weed: "WEED",
    beer: "BEER",
    lsd: "LSD",
    "audio-desync": "A/V SYNC ERROR",
    "gif-loops": "GIF STORM",
    "color-acid": "ACID",
    "color-hot": "MAGENTA",
    "color-ice": "ICE",
    "fill-water": "FLOOD",
    "fill-shapes": "SHAPES",
    "fill-marbles": "MARBLES",
    "fill-stickers": "STICKERS",
    "fill-confetti": "CONFETTI",
    "fill-popups": "POPUPS",
    "fill-bubbles": "BUBBLES",
    "fill-static-panels": "STATIC",
    "source-overlay": "SOURCE",
    "looper-capture": "LOOP 1",
    "looper-layer-1": "LOOP 1",
    "looper-layer-2": "LOOP 2",
    "looper-layer-3": "LOOP 3",
    "looper-bpm-down": "BPM -",
    "looper-bpm-up": "BPM +",
    "looper-config": "LOOP EDIT",
    "looper-clear": "LOOPS CLEARED",
    "seed-skip": "SEED SKIP",
    delay: "DELAY"
  }[fx.id] || "";
  const level = Number(fx.level || 1);
  const style = fx.id === "show-cue" && fx.params?.color ? ` style="--cue-color:${escapeHtml(fx.params.color)}"` : "";
  return text ? `<span class="fx-callout fx-callout-${escapeHtml(fx.id)}"${style}>${escapeHtml(text)}${level > 1 ? ` x${level}` : ""}</span>` : "";
}

function syncProgram(program) {
  if (!program) return;
  currentProgram = program;
  clockDelta = program.serverTime - Date.now();
  updateAudienceBadge(program.audience);
  updatePerformanceUi(program.performance);
  renderProgramVote(program.votePoll);
  applyBroadcastFx(program.fx || []);
  const live = program.live;
  const next = program.next;
  const liveChanged = live?.id !== currentProgramId;

  setProgramBlock(nextBlock, next?.weeklyBlockName, next?.blockIdentity);
  setProgramTitle(nextTitle, next ? `${programDisplayTitle(next)} at ${new Date(next.startAt).toLocaleTimeString()}` : "Unscheduled");
  if (nextReason) nextReason.textContent = next?.reason || "";

  if (!live) {
    currentProgramId = "";
    syncCaptions(null);
    setProgramBlock(nowBlock, "");
    setProgramBlock(viewerNowBlock, "");
    setProgramTitle(nowTitle, "No active program");
    setProgramTitle(viewerNowTitle, "No active program");
    if (nowReason) nowReason.textContent = "";
    progressText.textContent = "00:00 / 00:00";
    viewerNowProgress.textContent = "00:00 / 00:00";
    liveBadge.textContent = "Waiting";
    liveBadge.classList.add("off");
    hideStreamLoading();
    enterStreamMode();
    refreshTitleMarquees();
    return;
  }

  liveBadge.textContent = "Live";
  liveBadge.classList.remove("off");
  setProgramBlock(nowBlock, live.weeklyBlockName, live.blockIdentity);
  setProgramBlock(viewerNowBlock, live.weeklyBlockName, live.blockIdentity);
  setProgramTitle(nowTitle, programDisplayTitle(live));
  setProgramTitle(viewerNowTitle, programDisplayTitle(live));
  if (nowReason) nowReason.textContent = live.reason || "";
  if (live.source.type === "youtube") {
    enterYouTubeMode(live);
    if (!youtubeSyncTimer) youtubeSyncTimer = setInterval(() => {
      if (currentProgram?.live?.source?.type === "youtube") syncYouTube(currentProgram.live);
    }, 2500);
  } else {
    enterStreamMode();
    if (liveChanged && currentProgramId && hlsLoaded) resetHlsStream();
  }

  if (liveChanged) syncCaptions(live);
  currentProgramId = live.id;
  refreshTitleMarquees();
}

function renderProgramVote(poll) {
  programVotePoll = poll || null;
  if (!programVotePanel || !programVoteTitle || !programVoteOptions) return;
  if (!poll) {
    programVotePanel.classList.add("hidden");
    programVoteOptions.innerHTML = "";
    setMessage(programVoteMessage, "");
    return;
  }

  programVotePanel.classList.remove("hidden");
  programVoteTitle.textContent = poll.weeklyBlockName
    ? `${poll.weeklyBlockName}: ${poll.title}`
    : poll.title || "Current program";
  const selected = localVoteOption(poll.id);
  const total = Number(poll.totalVotes || 0);
  const status = poll.isMovie && poll.suggestionsStatus === "loading"
    ? `<p class="program-vote-note">Finding comparable Internet Archive films...</p>`
    : poll.isMovie && poll.suggestionsStatus === "empty"
      ? `<p class="program-vote-note">No clean comparable films turned up yet.</p>`
      : "";
  programVoteOptions.innerHTML = `${status}${(poll.options || []).map((option) => {
    const votes = Number(option.votes || 0);
    const percent = total ? Math.round((votes / total) * 100) : 0;
    const isSelected = selected === option.id;
    return `
      <button class="program-vote-option${isSelected ? " selected" : ""}" data-program-vote="${escapeHtml(option.id)}" type="button">
        <span>
          <strong>${escapeHtml(option.label)}</strong>
          <small>${escapeHtml(option.description || option.type || "")}</small>
        </span>
        <em>${votes}${total ? ` / ${percent}%` : ""}</em>
      </button>`;
  }).join("")}`;
}

function localVoteOption(pollId) {
  try {
    const votes = JSON.parse(localStorage.getItem("doink_program_votes") || "{}");
    return votes[pollId] || "";
  } catch {
    return "";
  }
}

function rememberLocalVote(pollId, optionId) {
  let votes = {};
  try {
    votes = JSON.parse(localStorage.getItem("doink_program_votes") || "{}");
  } catch {
    votes = {};
  }
  votes[pollId] = optionId;
  localStorage.setItem("doink_program_votes", JSON.stringify(votes));
}

function updateAudienceBadge(audience = {}) {
  if (!onlineBadge) return;
  const count = Number(audience.online);
  const displayCount = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  onlineBadge.querySelector("strong").textContent = displayCount ? displayCount.toLocaleString() : "--";
  onlineBadge.classList.toggle("quiet", displayCount <= 0);
}

function tickProgress() {
  if (!currentProgram?.live) return;
  applyBroadcastFx(currentProgram.fx || []);
  keepBroadcastVisible();
  const offset = Math.min(activeOffset(), currentProgram.live.duration);
  const progress = `${formatDuration(offset)} / ${formatDuration(currentProgram.live.duration)}`;
  progressText.textContent = progress;
  viewerNowProgress.textContent = progress;
  if (currentProgram.live.source.type === "youtube") {
    syncYouTube(currentProgram.live);
  } else {
    enforcePlayback();
  }
}

function sourceLocation(source = {}) {
  if (source.type === "youtube") return source.url || "";
  if (source.type === "internet-archive") return source.url || source.fileUrl || source.archiveId || "";
  return source.path || "";
}

function renderPerformanceControl(control = {}) {
  showControlCache = {
    scenes: Array.isArray(control.scenes) ? control.scenes : [],
    cues: Array.isArray(control.cues) ? control.cues : [],
    macros: control.macros || {},
    instruments: control.instruments || {},
    snapshots: Array.isArray(control.snapshots) ? control.snapshots : []
  };
  if (performanceSceneSelect) {
    performanceSceneSelect.innerHTML = showControlCache.scenes.length
      ? showControlCache.scenes
          .map((scene) => `<option value="${escapeHtml(scene.cueId || "")}">${escapeHtml(scene.label || scene.id)}</option>`)
          .join("")
      : `<option value="">No scenes</option>`;
  }
  if (performanceCueGrid) {
    performanceCueGrid.innerHTML = showControlCache.cues.length
      ? showControlCache.cues
          .map((cue) => {
            const scene = showControlCache.scenes.find((item) => item.id === cue.sceneId) || {};
            return `
              <button class="performance-cue-pad" data-performance-cue="${escapeHtml(cue.id)}" style="--cue-color:${escapeHtml(scene.color || "#68c3b7")}" type="button">
                <strong>${escapeHtml(cue.label || cue.id)}</strong>
                <small>${escapeHtml(cue.clip || cue.macro || "")}</small>
              </button>`;
          })
          .join("")
      : `<p class="message">No performance cues loaded.</p>`;
  }
  renderFxSnapshots(showControlCache.snapshots || []);
  updatePerformanceUi(currentProgram?.performance);
}

function renderFxSnapshots(snapshots = []) {
  if (!fxSnapshotList) return;
  fxSnapshotList.innerHTML = snapshots.length
    ? `
      <span>Snapshots</span>
      ${snapshots.slice(0, 8).map((snapshot) => `
        <button class="fx-snapshot-chip" data-launch-fx-snapshot="${escapeHtml(snapshot.id)}" type="button">
          <strong>${escapeHtml(snapshot.name)}</strong>
          <small>${Number(snapshot.fxCount || 0)} FX</small>
        </button>`).join("")}`
    : `<span>Snapshots</span><p class="message">No saved rack states yet.</p>`;
}

function updatePerformanceUi(performance = {}) {
  const pack = performance?.blockPack || {};
  const activeCue = performance?.activeCue || null;
  const continuity = performance?.continuity || currentProgram?.continuity || {};
  if (performanceBlockPack) performanceBlockPack.textContent = pack.label || "Station Default";
  if (performanceActiveCue) {
    const voice = continuity.stationVoice?.label ? ` / ${continuity.stationVoice.label}` : "";
    performanceActiveCue.textContent = activeCue?.label
      ? `${activeCue.label}${activeCue.intensity ? ` / ${activeCue.intensity}%` : ""}${voice}`
      : pack.cueId ? `Suggested: ${cueLabel(pack.cueId)}` : "Ready";
  }
  if (performanceSceneSelect && pack.cueId && !performanceSceneSelect.value) performanceSceneSelect.value = pack.cueId;
  renderPerformanceSceneDetail();
  renderPerformanceBumpPackage(pack);
}

function cueLabel(cueId) {
  return showControlCache.cues.find((cue) => cue.id === cueId)?.label || cueId || "";
}

function selectedPerformanceCue() {
  const cueId = performanceSceneSelect?.value || currentProgram?.performance?.blockPack?.cueId || "identity-hit";
  return showControlCache.cues.find((cue) => cue.id === cueId) || showControlCache.cues.find((cue) => cue.id === "identity-hit") || {};
}

function renderPerformanceSceneDetail() {
  if (!performanceSceneDetail) return;
  const cue = selectedPerformanceCue();
  const scene = showControlCache.scenes.find((item) => item.id === cue.sceneId) || {};
  const pack = currentProgram?.performance?.blockPack || {};
  const continuity = currentProgram?.performance?.continuity || currentProgram?.continuity || {};
  const voice = continuity.stationVoice || {};
  const transition = continuity.transition || {};
  const ceiling = Math.round(Number(pack.chaosCeiling || scene.chaosCeiling || 1) * 100);
  const description = [cue.clip || scene.description || pack.note || "", voice.tone || ""].filter(Boolean).join(" / ");
  const transitionLabel = transition.label ? `${transition.label}` : `${ceiling}% ceiling`;
  performanceSceneDetail.innerHTML = `
    <span style="--scene-color:${escapeHtml(scene.color || pack.sceneColor || "#68c3b7")}"></span>
    <div>
      <strong>${escapeHtml(scene.label || pack.sceneLabel || "Scene")}: ${escapeHtml(cue.label || "Identity Hit")}</strong>
      <small>${escapeHtml(description)}</small>
    </div>
    <em title="${escapeHtml(transition.reason || "")}">${escapeHtml(transitionLabel)}</em>`;
}

function renderPerformanceBumpPackage(pack = {}) {
  if (!performanceBumpPackage) return;
  const continuity = currentProgram?.performance?.continuity || currentProgram?.continuity || {};
  const voice = continuity.stationVoice || {};
  const transition = continuity.transition || {};
  const packageItems = Array.isArray(continuity.bumpPackage) && continuity.bumpPackage.length
    ? continuity.bumpPackage
    : (Array.isArray(pack.bumpPackage) ? pack.bumpPackage : []).map((id) => ({ id, label: id.replace(/-/g, " ") }));
  const chips = [
    transition.bumpClass ? { id: transition.bumpClass, label: transition.label || transition.bumpClass } : null,
    voice.label ? { id: voice.id || "voice", label: voice.label } : null,
    ...packageItems
  ].filter(Boolean);
  performanceBumpPackage.innerHTML = chips.length
    ? `
      <span>Continuity</span>
      <div>${chips.slice(0, 5).map((item) => `<small data-bump-class="${escapeHtml(item.id || "")}">${escapeHtml(item.label || item.id || "")}</small>`).join("")}</div>`
    : "";
}

function renderActiveFxRack(active = lastBroadcastFx) {
  if (!performanceActiveFx) return;
  const items = (active || []).filter(fxIsActive);
  performanceActiveFx.innerHTML = items.length
    ? `
      <span>Active rack</span>
      <div>
        ${items.slice(-8).map((fx) => {
          const remainingSeconds = fx.expiresAt == null ? null : Math.max(0, Math.ceil((Number(fx.expiresAt) - (Date.now() + clockDelta)) / 1000));
          const remaining = fx.expiresAt == null ? "hold" : fx.state === "decaying" ? `decay ${remainingSeconds}s` : `${remainingSeconds}s`;
          const label = fx.instrumentLabel || fx.label || fx.id;
          const kind = fx.instrumentKind && fx.instrumentKind !== "command" ? `${fx.instrumentKind} / ` : "";
          return `<small data-fx-state="${escapeHtml(fx.state || "active")}"><b>${escapeHtml(label)}</b><em>${escapeHtml(kind + remaining)}</em></small>`;
        }).join("")}
      </div>`
    : `<span>Active rack</span><div><small><b>Clean signal</b><em>ready</em></small></div>`;
}

function renderStationHealth(health = {}) {
  if (!stationHealthStatus || !stationHealthChecks || !stationHealthWarnings) return;
  const status = health.status || "checking";
  const label = {
    good: "On air",
    attention: "Needs eyes",
    critical: "Critical",
    checking: "Checking"
  }[status] || "Needs eyes";
  stationHealthStatus.dataset.status = status;
  stationHealthStatus.textContent = label;

  const checks = health.checks || {};
  const checkItems = [
    ["Scheduled 24h", checks.scheduledNext24h],
    ["Broadcast 24h", checks.broadcastItemsNext24h],
    ["Auto bumps", checks.autoBumpsNext24h],
    ["Long gaps", checks.longGapsNext24h],
    ["Missing refs", checks.missingSourceRefs],
    ["Ingest issues", checks.ingestIssues],
    ["HLS", checks.hlsStatus || "idle"]
  ];
  stationHealthChecks.innerHTML = checkItems
    .map(([name, value]) => `
      <span>
        <strong>${escapeHtml(String(value ?? 0))}</strong>
        <small>${escapeHtml(name)}</small>
      </span>`)
    .join("");

  const warnings = Array.isArray(health.warnings) ? health.warnings : [];
  stationHealthWarnings.innerHTML = warnings.length
    ? warnings.slice(0, 4).map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")
    : `<li>Schedule, stream, sources, and bump coverage look ready.</li>`;
}

function renderProjectAudit(audit = {}) {
  if (!projectMissionHeadline || !projectMissionStatement) return;
  const mission = audit.mission || {};
  const metrics = audit.metrics || {};
  const findings = Array.isArray(audit.findings) ? audit.findings : [];
  const nextSteps = Array.isArray(audit.nextSteps) ? audit.nextSteps : [];
  if (projectAuditStamp) {
    projectAuditStamp.textContent = audit.generatedAt
      ? `Audited ${new Date(audit.generatedAt).toLocaleTimeString()}`
      : "Audit pending";
  }
  projectMissionHeadline.textContent = mission.headline || "A live underground station with a playable signal.";
  projectMissionStatement.textContent = mission.statement || "";
  if (projectMissionPrinciples) {
    projectMissionPrinciples.innerHTML = (mission.principles || [])
      .slice(0, 5)
      .map((principle) => `<span>${escapeHtml(principle)}</span>`)
      .join("");
  }
  if (projectAuditMetrics) {
    const lineTotal = (metrics.largeFiles || []).reduce((sum, file) => sum + Number(file.lineCount || 0), 0);
    const metricItems = [
      ["Sources", metrics.sources],
      ["Schedule", metrics.scheduledItems],
      ["Queue", metrics.queueItems],
      ["Blocks", metrics.weeklyBlocks],
      ["Bump classes", metrics.bumpClasses],
      ["Core lines", lineTotal]
    ];
    projectAuditMetrics.innerHTML = metricItems
      .map(([label, value]) => `
        <span>
          <strong>${escapeHtml(String(value ?? 0))}</strong>
          <small>${escapeHtml(label)}</small>
        </span>`)
      .join("");
  }
  if (projectNextSteps) {
    projectNextSteps.innerHTML = `
      <span>Next six</span>
      ${nextSteps.slice(0, 6).map((step, index) => `
        <article>
          <b>${index + 1}</b>
          <div>
            <strong>${escapeHtml(step.label || step.id || "Step")}</strong>
            <small>${escapeHtml(step.whyNow || "")}</small>
          </div>
          <em>${escapeHtml(step.status || "next")}</em>
        </article>`).join("")}`;
  }
  if (projectAuditFindings) {
    projectAuditFindings.innerHTML = `
      <span>Refactor flags</span>
      ${findings.slice(0, 6).map((finding) => `
        <article data-severity="${escapeHtml(finding.severity || "medium")}">
          <strong>${escapeHtml(finding.area || "Maintenance")}</strong>
          <p>${escapeHtml(finding.finding || "")}</p>
          <small>${escapeHtml(finding.refactor || "")}</small>
        </article>`).join("")}`;
  }
}

function renderContinuityLog(events = []) {
  if (!continuityLogPanel) return;
  const list = Array.isArray(events) ? events : [];
  continuityLogPanel.innerHTML = `
    <span>Continuity log</span>
    ${list.length
      ? list.slice(0, 10).map((event) => `
        <article data-severity="${escapeHtml(event.severity || "info")}">
          <time>${escapeHtml(event.createdAt ? new Date(event.createdAt).toLocaleTimeString() : "--")}</time>
          <div>
            <strong>${escapeHtml(event.title || "Station event")}</strong>
            <small>${escapeHtml(event.detail || event.type || "")}</small>
          </div>
          <em>${escapeHtml(event.type || "station")}</em>
        </article>`).join("")
      : `<p class="message">No continuity events yet.</p>`}`;
}

function updatePerformanceIntensityUi() {
  const value = Math.round(Number(performanceIntensitySlider?.value || 0));
  if (performanceIntensityValue) performanceIntensityValue.textContent = `${value}%`;
}

function renderCommunityAdmin(community = {}) {
  if (!communityAdminForm) return;
  communityAdminForm.elements.stationMode.value = community.stationMode || "open-signal";
  communityAdminForm.elements.spotlight.value = community.spotlight || "";
  communityAdminForm.elements.supporterGoal.value = community.supporterGoal || "";
  communityAdminForm.elements.takeoverPolicy.value = community.takeoverPolicy || "";
  const tiers = Array.isArray(community.tiers) ? community.tiers : [];
  const members = Array.isArray(community.members) ? community.members : [];
  const counts = community.suggestionCounts || {};
  if (communityAdminSummary) {
    communityAdminSummary.innerHTML = [
      ["Pending", counts.pending || 0],
      ["Approved", counts.approved || 0],
      ["Archived", counts.archived || 0],
      ["Crew", community.crewCount || 0]
    ].map(([label, value]) => `
      <span>
        <strong>${escapeHtml(String(value))}</strong>
        <small>${escapeHtml(label)}</small>
      </span>`)
      .join("");
  }
  if (communityMemberList) {
    communityMemberList.innerHTML = members.length
      ? members.map((member) => `
          <article class="community-member">
            <div>
              <strong>${escapeHtml(member.username)}</strong>
              <small>${escapeHtml(member.supporterLabel || member.supporterTier || "Viewer")}</small>
            </div>
            <select data-supporter-tier-user="${escapeHtml(member.id)}" aria-label="Supporter tier for ${escapeHtml(member.username)}">
              ${tiers.map((tier) => `<option value="${escapeHtml(tier.id)}"${tier.id === member.supporterTier ? " selected" : ""}>${escapeHtml(tier.label)}</option>`).join("")}
            </select>
          </article>`)
          .join("")
      : `<p class="message">No registered viewers yet.</p>`;
  }
  if (!communitySuggestionList) return;
  const suggestions = Array.isArray(community.suggestions) ? community.suggestions : [];
  communitySuggestionList.innerHTML = suggestions.length
    ? suggestions.slice(0, 12).map((suggestion) => `
        <article class="community-suggestion ${suggestion.status}">
          <strong>${escapeHtml(suggestion.title)}</strong>
          <small>${escapeHtml(suggestion.username)} / ${escapeHtml(suggestion.supporterTier || "viewer")} / ${escapeHtml(suggestion.status)}</small>
          ${suggestion.outcome?.label ? `<small>Outcome / ${escapeHtml(suggestion.outcome.label)}</small>` : ""}
          ${suggestion.note ? `<p>${escapeHtml(suggestion.note)}</p>` : ""}
          <div>
            <button class="secondary compact" data-community-search="${escapeHtml(suggestion.title)}" data-community-pick-id="${escapeHtml(suggestion.id)}" type="button">Search IA</button>
            <button class="secondary compact" data-community-suggestion="${escapeHtml(suggestion.id)}" data-community-status="approved" type="button">Approve</button>
            <button class="secondary compact" data-community-suggestion="${escapeHtml(suggestion.id)}" data-community-status="archived" type="button">Archive</button>
          </div>
        </article>`)
        .join("")
    : `<p class="message">No crew picks yet.</p>`;
}

function loreTypeLabel(type = "lore") {
  return {
    lore: "Lore",
    theme: "Theme",
    errata: "Errata"
  }[type] || "Lore";
}

function resetLoreForm(entry = null) {
  if (!loreEntryForm) return;
  loreEntryForm.reset();
  loreEntryForm.elements.id.value = entry?.id || "";
  loreEntryForm.elements.type.value = entry?.type || "lore";
  loreEntryForm.elements.status.value = entry?.status || "draft";
  loreEntryForm.elements.title.value = entry?.title || "";
  loreEntryForm.elements.tags.value = Array.isArray(entry?.tags) ? entry.tags.join(", ") : "";
  loreEntryForm.elements.body.value = entry?.body || "";
}

function filteredLoreEntries() {
  const query = String(loreSearchInput?.value || "").trim().toLowerCase();
  const type = String(loreTypeFilter?.value || "");
  return (loreCache.entries || []).filter((entry) => {
    if (type && entry.type !== type) return false;
    if (!query) return true;
    return [
      entry.title,
      entry.body,
      entry.status,
      entry.type,
      ...(Array.isArray(entry.tags) ? entry.tags : [])
    ].join(" ").toLowerCase().includes(query);
  });
}

function renderLoreEntries() {
  if (!loreEntries) return;
  const entries = filteredLoreEntries();
  loreEntries.innerHTML = entries.length
    ? entries.map((entry) => {
        const status = entry.status || "draft";
        const nextStatus = status === "archived" ? "draft" : "archived";
        const actionLabel = status === "archived" ? "Restore" : "Archive";
        const tags = Array.isArray(entry.tags) ? entry.tags : [];
        return `
          <article class="lore-entry ${escapeHtml(entry.type || "lore")} ${escapeHtml(status)}">
            <div class="lore-entry-top">
              <span>${escapeHtml(loreTypeLabel(entry.type))}</span>
              <small>${escapeHtml(status)}</small>
            </div>
            <strong>${escapeHtml(entry.title || "Untitled note")}</strong>
            <p>${escapeHtml(entry.body || "")}</p>
            ${tags.length ? `<div class="lore-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
            <div class="lore-entry-actions">
              <small>${escapeHtml(entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : "New")}</small>
              <button class="secondary compact" data-edit-lore-entry="${escapeHtml(entry.id)}" type="button">Edit</button>
              <button class="secondary compact" data-lore-entry-status="${escapeHtml(nextStatus)}" data-lore-entry="${escapeHtml(entry.id)}" type="button">${actionLabel}</button>
            </div>
          </article>`;
      }).join("")
    : `<p class="message">No lore notes match that search.</p>`;
}

function renderLore(lore = {}) {
  loreCache = {
    entries: Array.isArray(lore.entries) ? lore.entries : [],
    counts: lore.counts || {}
  };
  if (loreStats) {
    const counts = loreCache.counts || {};
    loreStats.innerHTML = [
      ["Lore", counts.lore || 0],
      ["Theme", counts.theme || 0],
      ["Errata", counts.errata || 0],
      ["Draft", counts.draft || 0]
    ].map(([label, value]) => `
      <span>
        <strong>${escapeHtml(String(value))}</strong>
        <small>${escapeHtml(label)}</small>
      </span>`)
      .join("");
  }
  renderLoreEntries();
}

async function launchPerformanceCue(cueId) {
  if (!cueId) return;
  const cue = showControlCache.cues.find((item) => item.id === cueId);
  try {
    const result = await api("/api/performance-cue", {
      method: "POST",
      body: JSON.stringify({
        cueId,
        intensity: Number(performanceIntensitySlider?.value || 62) / 100,
        reactive: performanceReactiveToggle?.checked === true,
        queueBump: performanceBumpToggle?.checked === true,
        blockName: currentProgram?.live?.weeklyBlockName || currentProgram?.performance?.blockPack?.label || ""
      })
    });
    const fired = Array.isArray(result.fired) ? result.fired.length : 0;
    const limited = result.limitedByBlock ? ` / capped at ${Math.round(Number(result.intensity || 0) * 100)}% by block` : "";
    setMessage(fxMessage, `${cue?.label || result.cue?.label || "Cue"} launched${fired ? ` / ${fired} clips` : ""}${result.queuedBump ? " / bump queued" : ""}${limited}.`);
    if (result.fx) applyBroadcastFx(result.fx);
    await loadAdmin();
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

function renderAdmin(data) {
  adminDataCache = data;
  renderPerformanceControl(data.showControl || {});
  renderStationHealth(data.stationHealth || {});
  renderProjectAudit(data.projectAudit || {});
  renderContinuityLog(data.continuityLog || []);
  renderCommunityAdmin(data.community || {});
  renderLore(data.lore || {});
  const folders = data.sourceFolders || [];
  setBroadcastModeUI(data.broadcastMode);
  const librarySources = data.sources.filter((source) => source.type !== "bump");
  sourceFolderSelect.innerHTML = [
    `<option value="">Unfiled sources</option>`,
    ...folders.map((folder) => `<option value="${folder.id}">${escapeHtml(folder.name)}</option>`)
  ].join("");

  renderTimingSourcePicker(data);
  renderOverlaySourcePicker(data);
  if (seedWeeklyScheduleButton) {
    seedWeeklyScheduleButton.title = weeklyBlockSummary(data.weeklyBlocks || []);
  }

  const folderGroups = [
    { id: "", name: "Unfiled sources", randomEligible: true },
    ...folders
  ].map((folder) => ({
    ...folder,
    sources: librarySources.filter((source) => (source.folderId || "") === folder.id)
  }));

  sourcesList.innerHTML = librarySources.length || folders.length
    ? folderGroups
        .filter((folder) => folder.sources.length || folder.id)
        .map((folder) => {
          const folderSources = folder.sources.length
            ? folder.sources
                .map(
                  (source) => {
                    const ingest = source.ingest || {};
                    const ingestStatus = ingest.status ? ingest.status.replace("_", " ") : "not ingested";
                    const randomEligible = isRandomEligibleSourceUI(source, folder);
                    const candidates = Array.isArray(ingest.candidates) ? ingest.candidates : [];
                    const candidateList = candidates.length
                      ? `<div class="candidate-list">
                          ${candidates
                            .map((candidate) => `
                              <a href="${escapeHtml(candidate.detailUrl || candidate.mediaUrl)}" target="_blank" rel="noopener noreferrer">
                                <strong>${escapeHtml(candidate.title || candidate.fileName || "Media candidate")}</strong>
                                <span>${escapeHtml(candidate.repository || "Repository")}${candidate.licenseUrl ? " &middot; license noted" : ""}</span>
                              </a>`)
                            .join("")}
                        </div>`
                      : "";
                    return `
            <div class="item source-item" data-source-item="${source.id}" data-source-folder="${folder.id}" draggable="true">
              <span class="drag-handle" aria-hidden="true">Drag</span>
              <div>
                <strong>${escapeHtml(source.title)}</strong>
                <small>${escapeHtml(sourceLocation(source))} &middot; ${formatDuration(source.duration)}</small>
                <small class="random-status" data-eligible="${randomEligible ? "true" : "false"}">Random: ${randomEligible ? "eligible" : "off"}${source.type === "youtube" && source.randomEligible === undefined ? " by default" : ""}</small>
                <small class="ingest-status" data-status="${escapeHtml(ingest.status || "pending")}">Ingest: ${escapeHtml(ingestStatus)}${ingest.message ? ` &middot; ${escapeHtml(ingest.message)}` : ""}</small>
                ${candidateList}
              </div>
              <div class="edit-actions">
                <button class="secondary compact" data-toggle-source-random="${source.id}" data-random-next="${randomEligible ? "false" : "true"}" type="button">${randomEligible ? "Random off" : "Random on"}</button>
                <button class="secondary compact" data-ingest-source="${source.id}" type="button">Ingest</button>
                <button class="secondary compact" data-edit-source="${source.id}" type="button">Edit</button>
                <button class="danger" data-delete-source="${source.id}" type="button">Remove</button>
              </div>
            </div>`;
                  }
                )
                .join("")
            : `<p class="message">No sources in this folder.</p>`;
          const folderCollapsed = isSourceFolderCollapsed(folder.id);
          const folderRandomEligible = folder.randomEligible !== false;
          return `
            <div class="folder-group${folderCollapsed ? " collapsed" : ""}">
              <div class="folder-heading">
                <button class="folder-toggle" data-toggle-folder="${escapeHtml(folder.id)}" type="button" aria-expanded="${!folderCollapsed}">
                  <span>${folderCollapsed ? "+" : "-"}</span>
                  <strong>${escapeHtml(folder.name)}</strong>
                </button>
                <span class="folder-count">${folder.sources.length}</span>
                ${folder.id ? `<button class="secondary compact random-toggle${folderRandomEligible ? " active" : ""}" data-toggle-folder-random="${escapeHtml(folder.id)}" data-random-next="${folderRandomEligible ? "false" : "true"}" type="button">${folderRandomEligible ? "Random on" : "Random off"}</button>` : ""}
                <button class="secondary compact" data-ingest-folder="${escapeHtml(folder.id)}" type="button">Ingest library</button>
                ${folder.id ? `<button class="danger" data-delete-folder="${folder.id}" type="button">Remove</button>` : ""}
              </div>
              <div class="item-list">${folderSources}</div>
            </div>`;
        })
        .join("")
    : `<p class="message">No sources yet.</p>`;

  const upcoming = data.schedule
    .filter((entry) => entry.startAt + entry.duration * 1000 > Date.now() - 1000)
    .sort((a, b) => a.startAt - b.startAt);

  scheduleList.innerHTML = upcoming.length
    ? upcoming
        .map((entry) => {
          const source = data.sources.find((item) => item.id === entry.sourceId);
          return `
            <div class="item">
              <div>
                <strong>${escapeHtml(entry.title || source?.title || "Scheduled source")}</strong>
                <small>${new Date(entry.startAt).toLocaleString()} &middot; ${formatDuration(entry.duration)}</small>
              </div>
              <button class="danger" data-delete-schedule="${entry.id}" type="button">Remove</button>
            </div>`;
        })
        .join("")
    : `<p class="message">No upcoming entries.</p>`;

  renderWeeklySchedule(data);

  const now = Date.now();
  const queueTimeline = queueTimelineEntries(data, now);
  const pendingQueueCount = (data.liveQueue || []).filter((entry) => entry.startAt + entry.duration * 1000 > now - 1000).length;
  const visibleQueueCount = queueTimeline.filter((entry) => entry.queueLane === "queue").length;
  const conflictedQueueCount = Math.max(0, pendingQueueCount - visibleQueueCount);
  const protectedScheduleCount = queueTimeline.filter((entry) => entry.queueLane === "scheduled").length;
  clearQueueButton.textContent = protectedScheduleCount ? "Clear live queue" : "Clear queue";
  clearQueueButton.title = protectedScheduleCount
    ? "Scheduled programming is shown here but protected. This clears only live queue items."
    : "";

  const conflictWarning = conflictedQueueCount
    ? `<p class="message queue-warning">${conflictedQueueCount} live queue item${conflictedQueueCount === 1 ? "" : "s"} hidden because scheduled programming has priority.</p>`
    : "";
  queueList.innerHTML = queueTimeline.length
    ? conflictWarning + queueTimeline
        .map((entry, index) => {
          const source = data.sources.find((item) => item.id === entry.sourceId);
          const isScheduled = entry.queueLane === "scheduled";
          const isBump = source?.type === "bump";
          const isCurrent = now >= entry.startAt && now < entry.startAt + entry.duration * 1000;
          const canMove = !isScheduled && (!isBump || !entry.autoBump) && !isCurrent;
          return `
            <div class="item queue-item${isScheduled ? " queue-scheduled" : ""}" ${isScheduled ? "" : `data-queue-item="${entry.id}"`} draggable="${canMove}">
              <span class="drag-handle" aria-hidden="true">${isScheduled ? "Sched" : canMove ? "Drag" : "Live"}</span>
              <div>
                <strong>${escapeHtml(entry.title || source?.title || (isScheduled ? "Scheduled source" : "Queued source"))}</strong>
                <small>${new Date(entry.startAt).toLocaleTimeString()} &middot; ${formatDuration(entry.duration)}${isCurrent ? " &middot; On air" : ""}${isScheduled ? " &middot; Protected schedule" : ""}${entry.clippedBySchedule ? " &middot; Ends at schedule" : ""}${isBump ? " &middot; Auto bump" : ""}</small>
              </div>
              <div class="queue-actions">
                ${isScheduled ? `<button class="secondary compact" disabled type="button">Protected</button>` : `<button class="danger compact" data-delete-queue="${entry.id}" type="button">Delete</button>`}
              </div>
            </div>`;
        })
        .join("")
    : `<p class="message">Queue is empty${pendingQueueCount ? ", but queued items currently conflict with protected scheduled programming." : "."}</p>`;
}

function queueTimelineEntries(data = adminDataCache, now = Date.now()) {
  const scheduled = (data.schedule || [])
    .filter((entry) => entry.startAt + entry.duration * 1000 > now - 1000)
    .map((entry) => ({ ...entry, queueLane: "scheduled" }));
  const queued = (data.liveQueue || [])
    .filter((entry) => entry.startAt + entry.duration * 1000 > now - 1000)
    .map((entry) => protectQueueEntryUI(entry, scheduled))
    .filter(Boolean)
    .map((entry) => ({ ...entry, queueLane: "queue" }));
  return [...scheduled, ...queued].sort((a, b) => a.startAt - b.startAt);
}

function entriesOverlapUI(first, second) {
  return first.startAt < second.startAt + second.duration * 1000 && second.startAt < first.startAt + first.duration * 1000;
}

function protectQueueEntryUI(entry, scheduled = []) {
  const conflict = scheduled
    .filter((scheduleEntry) => entriesOverlapUI(entry, scheduleEntry))
    .sort((a, b) => a.startAt - b.startAt)[0];
  if (!conflict) return entry;
  if (entry.startAt >= conflict.startAt) return null;
  const duration = Math.floor((conflict.startAt - entry.startAt) / 1000);
  return duration >= 5 ? { ...entry, duration, clippedBySchedule: true } : null;
}

async function loadDjSoundboard() {
  if (!djSoundboardGrid) return;
  try {
    const board = await adminCockpitApi.soundboard.load();
    renderDjSoundboard(board);
  } catch (error) {
    djSoundboardGrid.innerHTML = `<p class="message error">${escapeHtml(error.message || "Could not load soundboard.")}</p>`;
  }
}

function renderDjSoundboard(board = {}) {
  const groups = board.groups || {};
  const sounds = Array.isArray(board.sounds) ? board.sounds : [];
  if (!sounds.length) {
    djSoundboardGrid.innerHTML = `<p class="message">No server carts found.</p>`;
    return;
  }
  const groupOrder = Object.keys(groups).length ? Object.keys(groups) : [...new Set(sounds.map((sound) => sound.group || "misc"))];
  djSoundboardGrid.innerHTML = groupOrder
    .map((groupId) => {
      const groupSounds = sounds.filter((sound) => (sound.group || "misc") === groupId);
      if (!groupSounds.length) return "";
      const group = groups[groupId] || { label: groupId, color: "#f2b84a" };
      const collapsed = soundboardCollapsedGroups.has(String(groupId));
      return `
        <div class="soundboard-group${collapsed ? " is-collapsed" : ""}" data-soundboard-group="${escapeHtml(groupId)}" style="--cart-color:${escapeHtml(group.color || "#f2b84a")}">
          <button class="soundboard-group-toggle" data-soundboard-group-toggle="${escapeHtml(groupId)}" type="button" aria-expanded="${String(!collapsed)}">
            <span>${escapeHtml(group.label || groupId)}</span>
            <small>${groupSounds.length} cart${groupSounds.length === 1 ? "" : "s"}</small>
            <i aria-hidden="true"></i>
          </button>
          <div class="soundboard-pad-grid">
            ${groupSounds.map((sound) => `
              <button class="soundboard-pad" data-soundboard-sound="${escapeHtml(sound.id)}" type="button" title="${escapeHtml(sound.label)} · ${formatDuration(sound.duration || 0)}">
                <strong>${escapeHtml(sound.label)}</strong>
                <small>${formatDuration(sound.duration || 0)}</small>
              </button>`).join("")}
          </div>
        </div>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

function cssToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function folderOptions(selectedId = "") {
  return [
    `<option value="">Unfiled sources</option>`,
    ...(adminDataCache.sourceFolders || []).map((folder) => {
      const selected = folder.id === selectedId ? " selected" : "";
      return `<option value="${folder.id}"${selected}>${escapeHtml(folder.name)}</option>`;
    })
  ].join("");
}

function libraryLabel(folderId, folders) {
  if (!folderId) return "Unfiled sources";
  return folders.find((folder) => folder.id === folderId)?.name || "Unknown library";
}

function sourceRandomBaseEligible(source) {
  return source.randomEligible ?? source.type !== "youtube";
}

function isRandomEligibleSourceUI(source, folder = null) {
  if (!source || source.type === "bump") return false;
  if (!sourceRandomBaseEligible(source)) return false;
  const sourceFolder = folder || (adminDataCache.sourceFolders || []).find((item) => item.id === source.folderId);
  return sourceFolder?.randomEligible !== false;
}

function sourceFolderStorageId(folderId) {
  return folderId || "__unfiled__";
}

function isSourceFolderCollapsed(folderId) {
  return !expandedSourceFolders.has(sourceFolderStorageId(folderId));
}

function persistSourceFolderState() {
  localStorage.setItem("doink_expanded_source_folders", JSON.stringify([...expandedSourceFolders]));
}

function ingestSummaryText(result) {
  if ("total" in result) {
    return `Ingest checked ${result.total} source${result.total === 1 ? "" : "s"}: ${result.ready} ready, ${result.candidatesFound || 0} with candidates, ${result.needsMedia} need media, ${result.missing} missing.`;
  }
  return `${result.title || "Source"}: ${String(result.status || "checked").replace("_", " ")}. ${result.message || ""}`.trim();
}

function renderTimingSourcePicker(data) {
  const folders = data.sourceFolders || [];
  const sources = data.sources.filter((source) => source.type !== "bump");
  const groups = [
    { id: "", name: "Unfiled sources" },
    ...folders
  ].map((folder) => ({
    ...folder,
    sources: sources.filter((source) => (source.folderId || "") === folder.id)
  }));

  const currentFolder = scheduleFolderSelect.value;
  scheduleFolderSelect.innerHTML = groups
    .map((group) => {
      const selected = group.id === currentFolder ? " selected" : "";
      return `<option value="${group.id}"${selected}>${escapeHtml(group.name)} (${group.sources.length})</option>`;
    })
    .join("");

  if (![...scheduleFolderSelect.options].some((option) => option.value === currentFolder)) {
    scheduleFolderSelect.value = groups.find((group) => group.sources.length)?.id || "";
  }

  const selectedGroup = groups.find((group) => group.id === scheduleFolderSelect.value) || groups[0];
  const currentSource = sourceSelect.value;
  sourceSelect.innerHTML = selectedGroup.sources
    .map((source) => {
      const selected = source.id === currentSource ? " selected" : "";
      return `<option value="${source.id}"${selected}>${escapeHtml(source.title)} (${source.type})</option>`;
    })
    .join("");
}

function weeklyBlockSummary(blocks = []) {
  if (!blocks.length) return "";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return blocks
    .filter((block) => block.enabled !== false)
    .map((block) => {
      const days = (block.days || []).map((day) => dayNames[day] || "").filter(Boolean).join("/");
      return `${block.name} ${days} ${block.time}`;
    })
    .join(" | ");
}

function weekStartDate(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function localDatetimeValue(timestamp) {
  const date = new Date(timestamp);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function scheduleTimeLabel(timestamp) {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function scheduleEntryClasses(entry = {}) {
  return [
    "weekly-entry",
    entry.weeklyBlockId ? "weekly-generated" : "",
    entry.blockBump ? "weekly-bump" : "",
    entry.gapFiller ? "weekly-filler" : ""
  ].filter(Boolean).join(" ");
}

function setScheduleZoomLevel(level) {
  scheduleZoomLevel = clamp(Number(level) || 0, 0, scheduleZoomLevels.length - 1);
  localStorage.setItem("doink_schedule_zoom", String(scheduleZoomLevel));
  applyScheduleZoom();
}

function applyScheduleZoom() {
  const level = scheduleZoomLevels[scheduleZoomLevel] || scheduleZoomLevels[2];
  if (weeklyScheduleGrid) {
    weeklyScheduleGrid.style.setProperty("--schedule-hour-height", `${level.hourHeight}px`);
    weeklyScheduleGrid.dataset.zoom = String(scheduleZoomLevel);
  }
  if (scheduleZoomInput) scheduleZoomInput.value = String(scheduleZoomLevel);
  if (scheduleZoomLabel) scheduleZoomLabel.textContent = `${level.label} zoom`;
}

function renderWeeklySchedule(data = adminDataCache) {
  if (!weeklyScheduleGrid) return;
  applyScheduleZoom();
  const start = weekStartDate();
  const end = start.getTime() + 7 * 24 * 60 * 60 * 1000;
  const sources = data.sources || [];
  const entries = (data.schedule || [])
    .filter((entry) => entry.startAt >= start.getTime() && entry.startAt < end)
    .filter((entry) => !entry.gapFiller)
    .sort((a, b) => a.startAt - b.startAt);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, hour) => hour);
  weeklyScheduleGrid.innerHTML = `
    <div class="weekly-timeline">
      <div class="weekly-time-rail" aria-hidden="true">
        <div class="weekly-corner">Time</div>
        <div class="weekly-time-scale">
          ${hours.map((hour) => `<span style="top:${(hour / 24) * 100}%">${hour === 0 ? "12a" : hour < 12 ? `${hour}a` : hour === 12 ? "12p" : `${hour - 12}p`}</span>`).join("")}
        </div>
      </div>
      ${dayNames.map((day, index) => {
    const dayStart = start.getTime() + index * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayEntries = entries.filter((entry) => entry.startAt >= dayStart && entry.startAt < dayEnd);
    return `
      <section class="weekly-day">
        <h3>${day}<span>${new Date(dayStart).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></h3>
        <div class="weekly-day-canvas">
          ${hours.map((hour) => `<span class="weekly-hour-line" style="top:${(hour / 24) * 100}%"></span>`).join("")}
          ${dayEntries.length ? dayEntries.map((entry) => renderWeeklyScheduleEntry(entry, sources, dayStart)).join("") : `<p class="message">No scheduled blocks.</p>`}
        </div>
      </section>`;
  }).join("")}
    </div>`;
}

function renderWeeklyScheduleEntry(entry, sources = [], dayStart = weekStartDate().getTime()) {
  const source = sources.find((item) => item.id === entry.sourceId);
  const minutesFromStart = clamp((entry.startAt - dayStart) / 60000, 0, 24 * 60);
  const durationMinutes = Math.max(5, Number(entry.duration || 0) / 60);
  const top = (minutesFromStart / (24 * 60)) * 100;
  const height = Math.min(100 - top, Math.max(1.2, (durationMinutes / (24 * 60)) * 100));
  const blockName = entry.weeklyBlockName || (entry.blockBump ? "Block bump" : "Manual");
  const sourceTitle = source?.title || "Unknown source";
  return `
    <form class="${scheduleEntryClasses(entry)}" data-weekly-schedule-entry="${entry.id}" style="--entry-top:${top.toFixed(3)}%; --entry-height:${height.toFixed(3)}%;">
      <details>
        <summary>
          <strong>${escapeHtml(blockName)}</strong>
          <span>${scheduleTimeLabel(entry.startAt)} · ${formatDuration(entry.duration)}</span>
          <small>${escapeHtml(sourceTitle)}</small>
        </summary>
        <div class="weekly-entry-editor">
          <input name="title" value="${escapeHtml(entry.title || "")}" placeholder="${escapeHtml(sourceTitle || "Title")}">
          <input name="startAt" type="datetime-local" value="${localDatetimeValue(entry.startAt)}" required>
          <input name="duration" type="number" min="5" step="1" value="${Math.round(entry.duration)}" required>
          <div class="weekly-entry-actions">
            <button class="secondary compact" type="submit">Save</button>
            <button class="danger compact" data-delete-schedule="${entry.id}" type="button">Delete</button>
          </div>
        </div>
      </details>
    </form>`;
}

function renderSourceEditor(sourceId) {
  const source = (adminDataCache.sources || []).find((item) => item.id === sourceId);
  if (!source) return;
  const button = document.querySelector(`[data-edit-source="${sourceId}"]`);
  const item = button?.closest(".item");
  if (!item) return;

  item.innerHTML = `
    <form class="source-edit-form" data-source-edit-form="${source.id}">
      <div class="edit-grid">
        <input name="title" value="${escapeHtml(source.title)}" required>
        <input name="duration" type="number" min="5" step="1" value="${source.duration}" required>
      </div>
      <select name="folderId">${folderOptions(source.folderId || "")}</select>
      <div class="edit-actions">
        <button type="submit">Save</button>
        <button class="secondary" data-cancel-source-edit type="button">Cancel</button>
      </div>
    </form>`;
}

function renderChat(data) {
  const wasNearBottom = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 24;
  renderCommunity(data.community);
  chatMessages.innerHTML = data.messages.length
    ? data.messages
        .map((message) => {
          const nameClass = message.role === "admin" ? "admin-name" : "";
          const badge = message.supporterBadge ? `<span class="chat-badge">${escapeHtml(message.supporterBadge)}</span>` : "";
          return `
            <article class="chat-entry">
              <strong class="${nameClass}">${escapeHtml(message.username)}${badge}</strong>
              <p>${escapeHtml(message.text)}</p>
              <time datetime="${new Date(message.createdAt).toISOString()}">${new Date(message.createdAt).toLocaleTimeString()}</time>
            </article>`;
        })
        .join("")
    : `<p class="message">No messages yet.</p>`;
  if (wasNearBottom) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function communityModeLabel(mode = "open-signal") {
  return {
    "open-signal": "Open Signal",
    "crew-week": "Crew Week",
    "takeover-night": "Takeover Night"
  }[mode] || "Open Signal";
}

function renderCommunity(community = {}) {
  if (!communityPanel) return;
  if (communityMode) communityMode.textContent = communityModeLabel(community.stationMode);
  if (communitySpotlight) communitySpotlight.textContent = community.spotlight || "Supporter picks help steer future programming.";
  if (communityGoal) communityGoal.textContent = community.supporterGoal || "";
  if (communityCrewCount) communityCrewCount.textContent = String(community.crewCount || 0);
  if (communityPendingCount) communityPendingCount.textContent = `${community.pendingSuggestionCount || 0} pick${community.pendingSuggestionCount === 1 ? "" : "s"} pending`;
  if (communityActiveCrew) {
    const crew = Array.isArray(community.activeCrew) ? community.activeCrew : [];
    communityActiveCrew.innerHTML = crew.length
      ? `
        <span>On deck</span>
        ${crew.slice(0, 4).map((member) => `
          <small title="${escapeHtml(member.supporterLabel || "")}">
            <b>${escapeHtml(member.supporterBadge || "CREW")}</b>
            ${escapeHtml(member.username)}
          </small>`).join("")}`
      : "";
  }
  if (communityApprovedPicks) {
    const picks = Array.isArray(community.suggestions) ? community.suggestions : [];
    communityApprovedPicks.innerHTML = picks.length
      ? `
        <span>Crew picks</span>
        ${picks.slice(0, 3).map((pick) => `
          <article>
            <strong>${escapeHtml(pick.title)}</strong>
            <small>${escapeHtml(pick.outcome?.label || pick.username || "crew")}</small>
          </article>`).join("")}`
      : "";
  }
}

function insertChatEmoji(emoji) {
  if (!chatInput || chatInput.disabled || !emoji) return;
  const maxLength = Number(chatInput.maxLength || 280);
  const prefix = chatInput.value && !/\s$/.test(chatInput.value.slice(0, chatInput.selectionStart || 0)) ? " " : "";
  const insertion = `${prefix}${emoji} `;
  const start = chatInput.selectionStart ?? chatInput.value.length;
  const end = chatInput.selectionEnd ?? start;
  const nextLength = chatInput.value.length - (end - start) + insertion.length;
  if (nextLength > maxLength) return;
  chatInput.setRangeText(insertion, start, end, "end");
  chatInput.focus();
}

async function loadAdmin() {
  const data = await adminCockpitApi.admin.load();
  setUserState(data.user);
  renderAdmin(data);
}

async function refreshSession() {
  const data = await api("/api/me");
  if (!data.user) {
    setUserState(null);
    return;
  }
  if (data.user.role === "admin") {
    await loadAdmin();
    return;
  }
  setUserState(data.user);
}

function reconnectProgramEvents() {
  programEvents?.close();
  programEvents = new EventSource("/api/events");
  programEvents.onmessage = (event) => {
    syncProgram(JSON.parse(event.data));
  };
}

adminToggle.addEventListener("click", () => {
  if (adminAuthenticated) {
    const railOpen = shell.classList.contains("admin-open");
    shell.classList.toggle("admin-open", !railOpen);
    if (adminCockpitRail) {
      adminCockpitRail.syncShellOpen(!railOpen);
    } else {
      adminPanel.classList.toggle("hidden", railOpen || adminRailView !== "broadcast");
      schedulePanel.classList.toggle("hidden", railOpen || adminRailView !== "schedule");
      queuePanel.classList.toggle("hidden", railOpen || adminRailView !== "queue");
      soundboardPanel.classList.toggle("hidden", railOpen || adminRailView !== "soundboard");
      fxPanel.classList.toggle("hidden", railOpen || adminRailView !== "fx");
      lorePanel.classList.toggle("hidden", railOpen || adminRailView !== "lore");
      chatPanel.classList.toggle("hidden", railOpen || adminRailView !== "chat");
    }
    if (!railOpen) applyStoredRailWidth();
    return;
  }
  if (currentUser) {
    api("/api/logout", { method: "POST", body: "{}" }).finally(() => setUserState(null));
    return;
  }
  setLoginOpen(loginPopover.classList.contains("hidden"));
  if (!loginPopover.classList.contains("hidden")) {
    loginForm.elements.username.focus();
  }
});

showLoginButton.addEventListener("click", () => setAuthMode("login"));
showRegisterButton.addEventListener("click", () => setAuthMode("register"));
if (adminCockpitRail) {
  adminCockpitRail.bind();
} else {
  showBroadcastPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("broadcast")));
  showSchedulePanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("schedule")));
  showQueuePanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("queue")));
  showSoundboardPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("soundboard")));
  showFxPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("fx")));
  showLorePanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("lore")));
  showChatPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("chat")));
}
hostMacroPanel?.addEventListener("click", async (event) => {
  const jump = event.target.closest("[data-host-jump]");
  if (jump) {
    const view = jump.dataset.hostJump || "broadcast";
    if (adminCockpitRail) {
      adminCockpitRail.setView(view);
    } else {
      setAdminRailView(view);
    }
    applyStoredRailWidth();
    return;
  }

  const action = event.target.closest("[data-host-action]")?.dataset.hostAction || "";
  if (!action) return;
  try {
    if (action === "station-clock") {
      await adminCockpitApi.broadcast.setMode("scheduled");
      setMessage(scheduleMessage, "Station clock restored. Live queue remains saved but will not override.");
      await loadAdmin();
      return;
    }
    if (action === "clean-signal") {
      await adminCockpitApi.fx.clear();
      setMessage(fxMessage, "Signal cleaned. Active FX cleared.");
      await loadAdmin();
    }
  } catch (error) {
    setMessage(action === "clean-signal" ? fxMessage : scheduleMessage, error.message, true);
  }
});
stageTvButton?.addEventListener("click", () => setAdminStageView("tv"));
stageBumpButton?.addEventListener("click", () => setAdminStageView("bump"));
pickModeButtons.forEach((button) => button.addEventListener("click", () => setSchedulePickMode(button.dataset.pickMode)));
chatToggle.addEventListener("click", () => setChatCollapsed(!chatCollapsed));
scheduledModeButton.addEventListener("click", async () => {
  try {
    await adminCockpitApi.broadcast.setMode("scheduled");
    setMessage(scheduleMessage, "Broadcast priority set to scheduled.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

queueModeButton.addEventListener("click", async () => {
  try {
    await adminCockpitApi.broadcast.setMode("queue");
    setMessage(scheduleMessage, "Broadcast priority set to live queue.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

sourceTypeSelect.addEventListener("change", () => {
  setMessage(sourceMessage, "");
  syncSourceFields(true);
});

sourceYoutubeInput.addEventListener("input", () => {
  clearTimeout(youtubeAutofillTimer);
  youtubeAutofillTimer = setTimeout(autofillYouTubeSource, 650);
});

sourceYoutubeInput.addEventListener("blur", () => {
  clearTimeout(youtubeAutofillTimer);
  autofillYouTubeSource();
});

sourceArchiveInput.addEventListener("input", () => {
  clearTimeout(youtubeAutofillTimer);
  sourceArchiveFileInput.value = "";
  youtubeAutofillTimer = setTimeout(autofillInternetArchiveSource, 650);
});

sourceArchiveInput.addEventListener("blur", () => {
  clearTimeout(youtubeAutofillTimer);
  autofillInternetArchiveSource();
});

sourceDurationInput.addEventListener("input", updateSourceDurationDisplay);
scheduleFolderSelect.addEventListener("change", () => renderTimingSourcePicker(adminDataCache));

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const text = chatInput.value.trim();
    if (!text) return;
    await api("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
    chatInput.value = "";
    setMessage(chatMessage, "");
  } catch (error) {
    setMessage(chatMessage, error.message, true);
  }
});

supporterSuggestionForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const form = new FormData(supporterSuggestionForm);
    const title = String(form.get("title") || "").trim();
    const note = String(form.get("note") || "").trim();
    await adminCockpitApi.community.submitSuggestion({ title, note });
    supporterSuggestionForm.reset();
    setMessage(supporterSuggestionMessage, "Crew pick sent for admin review.");
  } catch (error) {
    setMessage(supporterSuggestionMessage, error.message, true);
  }
});

communityAdminForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const form = new FormData(communityAdminForm);
    const community = await adminCockpitApi.community.updateSettings({
      stationMode: form.get("stationMode"),
      spotlight: form.get("spotlight"),
      supporterGoal: form.get("supporterGoal"),
      takeoverPolicy: form.get("takeoverPolicy")
    });
    renderCommunityAdmin(community);
    setMessage(communityAdminMessage, "Community signal saved.");
  } catch (error) {
    setMessage(communityAdminMessage, error.message, true);
  }
});

communitySuggestionList?.addEventListener("click", async (event) => {
  const searchButton = event.target.closest("[data-community-search]");
  if (searchButton) {
    const query = searchButton.dataset.communitySearch || "";
    activeCommunityPick = {
      id: searchButton.dataset.communityPickId || "",
      title: query
    };
    setAdminRailView("broadcast");
    if (sourceSearchForm?.elements?.query) {
      sourceSearchForm.elements.query.value = query;
      sourceSearchForm.scrollIntoView({ block: "start", behavior: "smooth" });
      setMessage(sourceSearchMessage, `Searching Archive for crew pick: ${query}`);
      await searchInternetArchiveSources({ immediate: true });
    }
    return;
  }
  const button = event.target.closest("[data-community-suggestion]");
  if (!button) return;
  try {
    const community = await adminCockpitApi.community.updateSuggestion({ id: button.dataset.communitySuggestion, status: button.dataset.communityStatus });
    renderCommunityAdmin(community);
    setMessage(communityAdminMessage, "Crew pick updated.");
  } catch (error) {
    setMessage(communityAdminMessage, error.message, true);
  }
});

communityMemberList?.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-supporter-tier-user]");
  if (!select) return;
  try {
    const community = await adminCockpitApi.community.updateSupporterTier({ userId: select.dataset.supporterTierUser, supporterTier: select.value });
    renderCommunityAdmin(community);
    setMessage(communityAdminMessage, "Supporter tier updated.");
  } catch (error) {
    setMessage(communityAdminMessage, error.message, true);
    await loadAdmin().catch(() => {});
  }
});

loreEntryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const form = new FormData(loreEntryForm);
    const lore = await adminCockpitApi.lore.upsertEntry({
      id: form.get("id"),
      type: form.get("type"),
      status: form.get("status"),
      title: form.get("title"),
      tags: form.get("tags"),
      body: form.get("body")
    });
    renderLore(lore);
    resetLoreForm();
    setMessage(loreMessage, "Lore note saved.");
  } catch (error) {
    setMessage(loreMessage, error.message, true);
  }
});

loreFormResetButton?.addEventListener("click", () => {
  resetLoreForm();
  setMessage(loreMessage, "");
});

loreSearchInput?.addEventListener("input", renderLoreEntries);
loreTypeFilter?.addEventListener("change", renderLoreEntries);

loreEntries?.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-lore-entry]");
  if (editButton) {
    const entry = (loreCache.entries || []).find((item) => item.id === editButton.dataset.editLoreEntry);
    if (!entry) return;
    resetLoreForm(entry);
    loreEntryForm?.scrollIntoView({ block: "start", behavior: "smooth" });
    setMessage(loreMessage, "Editing lore note.");
    return;
  }

  const statusButton = event.target.closest("[data-lore-entry]");
  if (!statusButton) return;
  try {
    const lore = await adminCockpitApi.lore.upsertEntry({
      id: statusButton.dataset.loreEntry,
      status: statusButton.dataset.loreEntryStatus
    });
    renderLore(lore);
    setMessage(loreMessage, "Lore note updated.");
  } catch (error) {
    setMessage(loreMessage, error.message, true);
  }
});

document.addEventListener("click", (event) => {
  if (
    adminAuthenticated ||
    loginPopover.classList.contains("hidden") ||
    loginPopover.contains(event.target) ||
    adminToggle.contains(event.target)
  ) {
    return;
  }
  setLoginOpen(false);
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(loginForm));
    const result = await api("/api/login", { method: "POST", body: JSON.stringify(body) });
    setMessage(loginMessage, "");
    loginForm.reset();
    if (result.user?.role === "admin") {
      await loadAdmin();
    } else {
      setUserState(result.user);
    }
  } catch (error) {
    setMessage(loginMessage, error.message, true);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(registerForm));
    const result = await api("/api/register", { method: "POST", body: JSON.stringify(body) });
    setMessage(registerMessage, "");
    registerForm.reset();
    setUserState(result.user);
  } catch (error) {
    setMessage(registerMessage, error.message, true);
  }
});

logoutButton.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
  setUserState(null);
});

sourceFolderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(sourceFolderForm));
    await api("/api/source-folders", { method: "POST", body: JSON.stringify(body) });
    sourceFolderForm.reset();
    setMessage(sourceFolderMessage, "Folder created.");
    await loadAdmin();
  } catch (error) {
    setMessage(sourceFolderMessage, error.message, true);
  }
});

programVoteOptions?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-program-vote]");
  if (!button || !programVotePoll) return;
  const optionId = button.dataset.programVote;
  try {
    button.disabled = true;
    const poll = await api("/api/program-vote", {
      method: "POST",
      body: JSON.stringify({ voterId: programVoterId, optionId })
    });
    rememberLocalVote(poll.id, optionId);
    renderProgramVote(poll);
    setMessage(programVoteMessage, "Vote counted.");
  } catch (error) {
    setMessage(programVoteMessage, error.message, true);
  } finally {
    button.disabled = false;
  }
});

playlistImportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(playlistImportForm));
    setMessage(playlistImportMessage, "Importing playlist...");
    const result = await api("/api/import-youtube-playlist", { method: "POST", body: JSON.stringify(body) });
    playlistImportForm.reset();
    setMessage(playlistImportMessage, `Imported ${result.imported} videos into ${result.folder.name}.`);
    await loadAdmin();
  } catch (error) {
    setMessage(playlistImportMessage, error.message, true);
  }
});

archiveImportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(archiveImportForm));
    setMessage(archiveImportMessage, "Importing Internet Archive videos...");
    const result = await api("/api/import-internet-archive-collection", { method: "POST", body: JSON.stringify(body) });
    archiveImportForm.reset();
    const sourceLabel = result.itemImport ? "archive item" : "archive collection";
    setMessage(archiveImportMessage, `Imported ${result.imported} videos from that ${sourceLabel} into ${result.folder.name}. ${result.skipped ? `${result.skipped} skipped.` : ""}`);
    await loadAdmin();
  } catch (error) {
    setMessage(archiveImportMessage, error.message, true);
  }
});

sourceSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchInternetArchiveSources({ immediate: true });
});

sourceSearchForm.elements.query.addEventListener("input", () => {
  clearTimeout(sourceSearchTimer);
  sourceSearchTimer = setTimeout(() => searchInternetArchiveSources(), 500);
});

sourceSearchResults.addEventListener("click", (event) => {
  const useButton = event.target.closest("[data-use-archive-result]");
  if (useButton) {
    useArchiveSearchResult(sourceSearchCache[Number(useButton.dataset.useArchiveResult)]);
    return;
  }
  const queueButton = event.target.closest("[data-queue-archive-result]");
  if (!queueButton) return;
  addArchiveResultToQueue(sourceSearchCache[Number(queueButton.dataset.queueArchiveResult)])
    .catch((error) => setMessage(sourceSearchMessage, error.message, true));
});

sourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(sourceForm));
    await api("/api/sources", { method: "POST", body: JSON.stringify(body) });
    sourceForm.reset();
    syncSourceFields();
    updateSourceDurationDisplay();
    setMessage(sourceMessage, "Source added.");
    await loadAdmin();
  } catch (error) {
    setMessage(sourceMessage, error.message, true);
  }
});

scheduleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(scheduleForm));
    const endpoint = schedulePickMode === "library" ? "/api/schedule-library" : "/api/schedule";
    await api(endpoint, { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, schedulePickMode === "library" ? "Library scheduled." : "Scheduled.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

addQueueButton.addEventListener("click", async () => {
  try {
    const body = Object.fromEntries(new FormData(scheduleForm));
    const endpoint = schedulePickMode === "library" ? "/api/queue-library" : "/api/queue";
    await api(endpoint, { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, schedulePickMode === "library" ? "Library added to live queue." : "Added to live queue.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

playNowButton.addEventListener("click", async () => {
  try {
    const body = Object.fromEntries(new FormData(scheduleForm));
    const endpoint = schedulePickMode === "library" ? "/api/play-now-library" : "/api/play-now";
    await api(endpoint, { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, "Live queue started.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

seedWeeklyScheduleButton?.addEventListener("click", async () => {
  try {
    seedWeeklyScheduleButton.disabled = true;
    setMessage(scheduleMessage, "Querying Internet Archive and building the weekly grid...");
    const result = await api("/api/weekly-schedule/seed", { method: "POST", body: "{}" });
    const imported = result.imports.reduce((total, item) => total + item.imported, 0);
    setMessage(scheduleMessage, `Weekly blocks seeded: ${result.entries.length} entries scheduled, ${imported} new archive sources imported.`);
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  } finally {
    seedWeeklyScheduleButton.disabled = false;
  }
});

refreshScheduleWeekButton?.addEventListener("click", loadAdmin);
scheduleZoomInput?.addEventListener("input", () => setScheduleZoomLevel(scheduleZoomInput.value));
scheduleZoomOutButton?.addEventListener("click", () => setScheduleZoomLevel(scheduleZoomLevel - 1));
scheduleZoomInButton?.addEventListener("click", () => setScheduleZoomLevel(scheduleZoomLevel + 1));

weeklyScheduleGrid?.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-weekly-schedule-entry]");
  if (!form) return;
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(form));
    await api(`/api/schedule/${form.dataset.weeklyScheduleEntry}`, { method: "PATCH", body: JSON.stringify(body) });
    setMessage(weeklyScheduleMessage, "Schedule entry updated.");
    await loadAdmin();
  } catch (error) {
    setMessage(weeklyScheduleMessage, error.message, true);
  }
});

playOverlayButton.addEventListener("click", () => {
  unlockPlayback();
});
playOverlayButton.addEventListener("pointerdown", () => {
  pendingPlaybackUnlock = true;
});
playOverlayButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    unlockPlayback();
  }
});
document.addEventListener("pointerdown", unlockPlaybackFromGesture, { capture: true });
document.addEventListener("keydown", unlockPlaybackFromGesture, { capture: true });

themeSelect?.addEventListener("change", () => {
  setTheme(themeSelect.value);
});

ingestAllSourcesButton?.addEventListener("click", async () => {
  try {
    const result = await api("/api/ingest/all", { method: "POST", body: "{}" });
    setMessage(sourceIngestMessage, ingestSummaryText(result));
    await loadAdmin();
  } catch (error) {
    setMessage(sourceIngestMessage, error.message, true);
  }
});

volumeSlider.addEventListener("input", () => {
  viewerVolume = Number(volumeSlider.value);
  localStorage.setItem("doink_volume", String(viewerVolume));
  applyViewerVolume({ unlock: true });
  delayNodes?.context.resume?.();
  playStreamPlayer();
});

soundboardVolumeSlider?.addEventListener("input", () => {
  soundboardVolume = normalizeSoundboardVolume(soundboardVolumeSlider.value);
  localStorage.setItem("doink_soundboard_volume", String(soundboardVolume));
  updateSoundboardVolumeUi();
  applySoundboardVolume();
});

captionsToggle?.addEventListener("click", toggleCaptions);

[warpSpeedSlider, warpPitchSlider, warpDesyncSlider].forEach((slider) => {
  slider?.addEventListener("input", broadcastAvWarp);
});

warpResetButton?.addEventListener("click", async () => {
  resetAvWarp(true);
  await adminCockpitApi.fx.trigger({ id: "av-warp", duration: 2, params: avWarp }).catch(() => {});
});

[visualBrightnessSlider, visualContrastSlider, visualSaturationSlider, visualTearSlider, visualTrackingSlider, visualSmearSlider].forEach((slider) => {
  slider?.addEventListener("input", broadcastVisualAdjust);
});

visualResetButton?.addEventListener("click", resetVisualAdjust);

[delayTimeSlider, delayFeedbackSlider, delayMixSlider, delayToneSlider, delaySyncToggle, delayDivisionSelect, delayRepitchSelect, delayTargetSelect].forEach((control) => {
  const handleDelayControl = () => {
    updateDelayLabels();
    if (delayActive) broadcastDelay();
  };
  control?.addEventListener("input", handleDelayControl);
  control?.addEventListener("change", handleDelayControl);
});

delayToggleButton?.addEventListener("click", toggleDelay);

[reverbSizeSlider, reverbDecaySlider, reverbPreDelaySlider, reverbMixSlider, reverbToneSlider, reverbCharacterSelect].forEach((control) => {
  const handleReverbControl = () => {
    updateReverbLabels();
    if (reverbActive) broadcastReverb();
  };
  control?.addEventListener("input", handleReverbControl);
  control?.addEventListener("change", handleReverbControl);
});

reverbToggleButton?.addEventListener("click", toggleReverb);

[overlayOpacitySlider, overlayScaleSlider, overlayDurationSlider].forEach((control) => {
  control?.addEventListener("input", updateOverlayLabels);
});
overlaySourceButton?.addEventListener("click", broadcastSourceOverlay);
looperPlayToggle?.addEventListener("click", () => setLooperPlaying(!looperPlaying));
looperLayerStatuses.forEach((node) => node.addEventListener("click", () => loadLooperLayerControls(node.dataset.looperLayerStatus)));
looperLayerSelect?.addEventListener("change", () => loadLooperLayerControls(looperLayerSelect.value));
fxOverlay?.addEventListener("pointerdown", beginLooperLayerDrag);
fxOverlay?.addEventListener("pointermove", updateLooperLayerDrag);
fxOverlay?.addEventListener("pointerup", finishLooperLayerDrag);
fxOverlay?.addEventListener("pointercancel", finishLooperLayerDrag);
[looperShapeSelect, looperMotionSelect, looperOpacitySlider, looperBlendSelect, looperXSlider, looperYSlider, looperSizeSlider, looperZoomSlider].forEach((control) => {
  control?.addEventListener("input", () => {
    updateLooperControlLabels();
    applyLooperLayerConfig(readLooperControls());
    renderLooperLayers();
  });
  control?.addEventListener("change", () => {
    updateLooperControlLabels();
    applyLooperLayerConfig(readLooperControls());
    renderLooperLayers();
  });
});
looperApplyButton?.addEventListener("click", () => broadcastLooperConfig(false));

fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await frame.requestFullscreen();
    }
  } catch {
    fullscreenButton.blur();
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  api("/api/program").then(syncProgram).catch(() => {});
  keepBroadcastVisible();
});

window.addEventListener("online", () => {
  if (currentProgram?.live?.source?.type !== "youtube") resetHlsStream();
  api("/api/program").then(syncProgram).catch(() => {});
});

clearQueueButton?.addEventListener("click", async () => {
  try {
    const protectedCount = queueTimelineEntries(adminDataCache).filter((entry) => entry.queueLane === "scheduled").length;
    if (protectedCount && !confirm(`${protectedCount} scheduled item${protectedCount === 1 ? "" : "s"} are shown in this queue view but will stay protected. Clear only live queue items?`)) return;
    const result = await api("/api/queue", { method: "DELETE" });
    setMessage(queueMessage, result.protectedScheduleCount
      ? `Live queue cleared. ${result.protectedScheduleCount} scheduled item${result.protectedScheduleCount === 1 ? "" : "s"} protected.`
      : "Queue cleared.");
    await loadAdmin();
  } catch (error) {
    setMessage(queueMessage, error.message, true);
  }
});

performanceIntensitySlider?.addEventListener("input", updatePerformanceIntensityUi);
performanceSceneSelect?.addEventListener("change", renderPerformanceSceneDetail);
performanceSceneButton?.addEventListener("click", () => launchPerformanceCue(performanceSceneSelect?.value || currentProgram?.performance?.blockPack?.cueId || "identity-hit"));
performancePanicButton?.addEventListener("click", async () => {
  await launchPerformanceCue("panic-reset");
  disableDelay(true);
  disableReverb(true);
});
fxSnapshotForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const form = new FormData(fxSnapshotForm);
    const result = await adminCockpitApi.fx.saveSnapshot({ name: form.get("name") });
    renderFxSnapshots(result.snapshots || []);
    fxSnapshotForm.reset();
    setMessage(fxSnapshotMessage, "Rack snapshot saved.");
    await loadAdmin();
  } catch (error) {
    setMessage(fxSnapshotMessage, error.message, true);
  }
});
fxSnapshotList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-launch-fx-snapshot]");
  if (!button) return;
  try {
    const result = await adminCockpitApi.fx.launchSnapshot({ id: button.dataset.launchFxSnapshot });
    if (result.fx) applyBroadcastFx(result.fx);
    renderFxSnapshots(result.snapshots || []);
    setMessage(fxSnapshotMessage, `Snapshot launched: ${button.textContent.trim()}.`);
    await loadAdmin();
  } catch (error) {
    setMessage(fxSnapshotMessage, error.message, true);
  }
});
performanceCueGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-performance-cue]");
  if (!button) return;
  launchPerformanceCue(button.dataset.performanceCue);
});

fxButtons.forEach((button) => button.addEventListener("click", async () => {
  try {
    if (button.id === "looperCaptureButton") {
      await broadcastLooperConfig(true);
      return;
    }
    const params = button.dataset.layer ? { layer: Number(button.dataset.layer) } : {};
    if (button.dataset.fx === "seed-skip") {
      const seed = skipperSeedInput.value.trim() || randomSeedText();
      skipperSeedInput.value = seed;
      params.seed = seed;
      params.division = skipperDivisionSelect.value;
    }
    const isToggle = button.dataset.fxMode === "toggle";
    const result = await adminCockpitApi.fx.trigger({ id: button.dataset.fx, params, toggle: isToggle });
    const label = button.textContent.trim() || result.fx.at(-1)?.label || "FX";
    setMessage(fxMessage, isToggle ? `${label} ${result.toggledOff ? "off" : "on"}.` : `${result.fx.at(-1)?.label || "FX"} fired.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}));

djSoundboardGrid?.addEventListener("click", async (event) => {
  const groupToggle = event.target.closest("[data-soundboard-group-toggle]");
  if (groupToggle) {
    toggleSoundboardGroup(groupToggle.dataset.soundboardGroupToggle);
    return;
  }
  const button = event.target.closest("[data-soundboard-sound]");
  if (!button) return;
  try {
    button.disabled = true;
    const result = await adminCockpitApi.soundboard.fire(button.dataset.soundboardSound);
    const label = result.fx.at(-1)?.params?.label || button.textContent.trim() || "cart";
    setMessage(fxMessage, `Cart fired: ${label}.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  } finally {
    button.disabled = false;
  }
});

clearFxButton?.addEventListener("click", async () => {
  try {
    await adminCockpitApi.fx.clear();
    disableDelay(true);
    disableReverb(true);
    setMessage(fxMessage, "FX cleared.");
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
});

queueList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-queue-item]");
  if (!item || item.getAttribute("draggable") !== "true") return;
  draggedQueueId = item.dataset.queueItem;
  item.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedQueueId);
});

queueList.addEventListener("dragover", (event) => {
  if (!draggedQueueId) return;
  const target = event.target.closest("[data-queue-item]");
  if (!target || target.dataset.queueItem === draggedQueueId || target.getAttribute("draggable") !== "true") return;
  event.preventDefault();
  const dragging = queueList.querySelector(".dragging");
  const rect = target.getBoundingClientRect();
  const afterTarget = event.clientY > rect.top + rect.height / 2;
  queueList.insertBefore(dragging, afterTarget ? target.nextSibling : target);
});

queueList.addEventListener("drop", async (event) => {
  if (!draggedQueueId) return;
  event.preventDefault();
  const ids = [...queueList.querySelectorAll("[data-queue-item][draggable='true']")].map((item) => item.dataset.queueItem);
  try {
    await api("/api/queue/reorder", { method: "PATCH", body: JSON.stringify({ ids }) });
    setMessage(queueMessage, "Queue reordered.");
    await loadAdmin();
  } catch (error) {
    setMessage(queueMessage, error.message, true);
    await loadAdmin();
  } finally {
    draggedQueueId = "";
  }
});

queueList.addEventListener("dragend", () => {
  queueList.querySelectorAll(".dragging").forEach((item) => item.classList.remove("dragging"));
  draggedQueueId = "";
});

sourcesList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-source-item]");
  if (!item || item.getAttribute("draggable") !== "true") return;
  draggedSourceId = item.dataset.sourceItem;
  item.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedSourceId);
});

sourcesList.addEventListener("dragover", (event) => {
  if (!draggedSourceId) return;
  const target = event.target.closest("[data-source-item]");
  const dragging = sourcesList.querySelector(".dragging");
  if (!target || !dragging || target.dataset.sourceItem === draggedSourceId) return;
  if (target.dataset.sourceFolder !== dragging.dataset.sourceFolder) return;
  event.preventDefault();
  const rect = target.getBoundingClientRect();
  const afterTarget = event.clientY > rect.top + rect.height / 2;
  target.parentElement.insertBefore(dragging, afterTarget ? target.nextSibling : target);
});

sourcesList.addEventListener("drop", async (event) => {
  if (!draggedSourceId) return;
  event.preventDefault();
  const dragging = sourcesList.querySelector(".dragging");
  const folderId = dragging?.dataset.sourceFolder || "";
  const container = dragging?.closest(".item-list");
  const ids = container ? [...container.querySelectorAll("[data-source-item]")].map((item) => item.dataset.sourceItem) : [];
  try {
    await api("/api/sources/reorder", { method: "PATCH", body: JSON.stringify({ folderId, ids }) });
    setMessage(sourceMessage, "Library reordered.");
    await loadAdmin();
  } catch (error) {
    setMessage(sourceMessage, error.message, true);
    await loadAdmin();
  } finally {
    draggedSourceId = "";
  }
});

sourcesList.addEventListener("dragend", () => {
  sourcesList.querySelectorAll(".dragging").forEach((item) => item.classList.remove("dragging"));
  draggedSourceId = "";
});

document.addEventListener("click", async (event) => {
  const toggleSourceRandom = event.target.closest("[data-toggle-source-random]");
  const toggleFolderRandom = event.target.closest("[data-toggle-folder-random]");
  if (toggleSourceRandom || toggleFolderRandom) {
    try {
      if (toggleSourceRandom) {
        await api(`/api/sources/${toggleSourceRandom.dataset.toggleSourceRandom}`, {
          method: "PATCH",
          body: JSON.stringify({ randomEligible: toggleSourceRandom.dataset.randomNext === "true" })
        });
        setMessage(sourceMessage, "Source random eligibility updated.");
      } else {
        await api(`/api/source-folders/${toggleFolderRandom.dataset.toggleFolderRandom}`, {
          method: "PATCH",
          body: JSON.stringify({ randomEligible: toggleFolderRandom.dataset.randomNext === "true" })
        });
        setMessage(sourceMessage, "Library random eligibility updated.");
      }
      await loadAdmin();
    } catch (error) {
      setMessage(sourceMessage, error.message, true);
    }
    return;
  }

  const ingestSourceId = event.target.closest("[data-ingest-source]")?.dataset.ingestSource;
  const ingestFolderId = event.target.closest("[data-ingest-folder]")?.dataset.ingestFolder;
  if (ingestSourceId || ingestFolderId !== undefined) {
    try {
      const result = ingestSourceId
        ? await api(`/api/ingest/sources/${ingestSourceId}`, { method: "POST", body: "{}" })
        : await api("/api/ingest/library", { method: "POST", body: JSON.stringify({ folderId: ingestFolderId }) });
      setMessage(sourceIngestMessage, ingestSummaryText(result));
      await loadAdmin();
    } catch (error) {
      setMessage(sourceIngestMessage, error.message, true);
    }
    return;
  }

  const toggleFolderId = event.target.closest("[data-toggle-folder]")?.dataset.toggleFolder;
  if (toggleFolderId !== undefined) {
    const storageId = sourceFolderStorageId(toggleFolderId);
    if (expandedSourceFolders.has(storageId)) {
      expandedSourceFolders.delete(storageId);
    } else {
      expandedSourceFolders.add(storageId);
    }
    persistSourceFolderState();
    renderAdmin(adminDataCache);
    return;
  }

  const moveQueueButton = event.target.closest("[data-move-queue]");
  if (moveQueueButton && !moveQueueButton.disabled) {
    try {
      await api(`/api/queue/${moveQueueButton.dataset.moveQueue}/move`, {
        method: "PATCH",
        body: JSON.stringify({ direction: moveQueueButton.dataset.direction })
      });
      await loadAdmin();
    } catch (error) {
      setMessage(scheduleMessage, error.message, true);
    }
    return;
  }

  const editSourceId = event.target.dataset.editSource;
  if (editSourceId) {
    renderSourceEditor(editSourceId);
    return;
  }
  if (event.target.dataset.cancelSourceEdit !== undefined) {
    await loadAdmin();
    return;
  }

  const sourceId = event.target.dataset.deleteSource;
  const scheduleId = event.target.dataset.deleteSchedule;
  const queueId = event.target.dataset.deleteQueue;
  const folderId = event.target.dataset.deleteFolder;
  try {
    if (sourceId) await api(`/api/sources/${sourceId}`, { method: "DELETE" });
    if (scheduleId) await api(`/api/schedule/${scheduleId}`, { method: "DELETE" });
    if (queueId) await api(`/api/queue/${queueId}`, { method: "DELETE" });
    if (folderId) await api(`/api/source-folders/${folderId}`, { method: "DELETE" });
    if (sourceId || scheduleId || queueId || folderId) await loadAdmin();
  } catch (error) {
    const messageTarget = queueId
      ? queueMessage
      : scheduleId && event.target.closest("#weeklyScheduleGrid")
        ? weeklyScheduleMessage
        : scheduleMessage;
    setMessage(messageTarget, error.message, true);
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-source-edit-form]");
  if (!form) return;
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(form));
    await api(`/api/sources/${form.dataset.sourceEditForm}`, { method: "PATCH", body: JSON.stringify(body) });
    setMessage(sourceMessage, "Source updated.");
    await loadAdmin();
  } catch (error) {
    setMessage(sourceMessage, error.message, true);
  }
});

railResizer?.addEventListener("pointerdown", beginRailResize);
railResizer?.addEventListener("pointermove", moveRailResize);
railResizer?.addEventListener("pointerup", endRailResize);
railResizer?.addEventListener("pointercancel", endRailResize);
railResizer?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const bounds = stageWidthBounds();
  const current = currentStageWidth();
  const step = event.shiftKey ? 32 : 10;
  if (event.key === "Home") setStageWidth(bounds.min);
  if (event.key === "End") setStageWidth(bounds.max);
  if (event.key === "ArrowLeft") setStageWidth(current - step);
  if (event.key === "ArrowRight") setStageWidth(current + step);
});
window.addEventListener("resize", () => {
  applyStoredRailWidth();
  refreshTitleMarquees();
});
peaceModeToggle?.addEventListener("click", () => setPeaceMode(!peaceMode));
chatEmojiButtons.forEach((button) => {
  button.addEventListener("click", () => insertChatEmoji(button.dataset.chatEmoji || ""));
});
updatePerformanceIntensityUi();

api("/api/program").then(syncProgram).catch(() => {});

reconnectProgramEvents();

new EventSource("/api/chat/events").onmessage = (event) => {
  renderChat(JSON.parse(event.data));
};

window.addEventListener("message", async (event) => {
  if (event.origin !== location.origin || event.data?.type !== "doinktv:queue-bump") return;
  try {
    await api("/api/queue-bump", {
      method: "POST",
      body: JSON.stringify({ ...event.data.bump, position: event.data.position })
    });
    setMessage(queueMessage, event.data.position === "next" ? "Bump queued next." : "Bump added to queue.");
    event.source?.postMessage({ type: "doinktv:bump-queued", ok: true, position: event.data.position }, event.origin);
    await loadAdmin();
  } catch (error) {
    setMessage(queueMessage, error.message, true);
    event.source?.postMessage({ type: "doinktv:bump-queued", ok: false, error: error.message }, event.origin);
  }
});

streamPlayer.addEventListener("pause", () => setTimeout(enforcePlayback, 100));
streamPlayer.addEventListener("stalled", () => setTimeout(enforcePlayback, 500));
streamPlayer.addEventListener("timeupdate", markStreamProgress);
streamPlayer.addEventListener("playing", markStreamProgress);
streamPlayer.addEventListener("canplay", markStreamProgress);
streamPlayer.addEventListener("canplay", () => {
  if (playbackUnlocked) playStreamPlayer();
});
streamPlayer.addEventListener("loadedmetadata", () => {
  if (playbackUnlocked) playStreamPlayer();
});
streamPlayer.addEventListener("loadeddata", markStreamProgress);
streamPlayer.addEventListener("waiting", () => setTimeout(keepBroadcastVisible, 1000));
streamPlayer.addEventListener("error", () => {
  resetHlsStream();
});
setInterval(tickProgress, 1000);
setTheme(currentTheme);
setPeaceMode(peaceMode, { persist: false });
setChatCollapsed(false);
applyStoredRailWidth();
initFxCollapsibles();
loadDjSoundboard();
applyViewerVolume();
updateSoundboardVolumeUi();
startLooperBeat();
loadLooperLayerControls(1);
updateWarpLabels();
updateVisualLabels();
updateDelayLabels();
updateReverbLabels();
updateOverlayLabels();
updateLooperMonitor();
renderLooperWaveform(Array.from({ length: 16 }, () => 0.08));
loadHlsStream();
setSchedulePickMode(schedulePickMode);
syncSourceFields();
updateSourceDurationDisplay();
refreshSession().catch(() => setUserState(null));
