const frame = document.querySelector("#playerFrame");
const streamPlayer = document.querySelector("#streamPlayer");
const streamLoading = document.querySelector("#streamLoading");
const playOverlayButton = document.querySelector("#playOverlayButton");
const liveBadge = document.querySelector("#liveBadge");
const nowTitle = document.querySelector("#nowTitle");
const nextTitle = document.querySelector("#nextTitle");
const progressText = document.querySelector("#progressText");
const youtubeLink = document.querySelector("#youtubeLink");
const crtBrand = document.querySelector(".crt-brand");
const volumeSlider = document.querySelector("#volumeSlider");
const volumeValue = document.querySelector("#volumeValue");
const fullscreenButton = document.querySelector("#fullscreenButton");
const themeSelect = document.querySelector("#themeSelect");
const shell = document.querySelector(".shell");
const adminToggle = document.querySelector("#adminToggle");
const loginPopover = document.querySelector("#loginPopover");
const adminPanel = document.querySelector("#adminPanel");
const chatPanel = document.querySelector("#chatPanel");
const bumpPanel = document.querySelector("#bumpPanel");
const queuePanel = document.querySelector("#queuePanel");
const fxPanel = document.querySelector("#fxPanel");
const fxOverlay = document.querySelector("#fxOverlay");
const fxAudioLayer = document.querySelector("#fxAudioLayer");
const chatToggle = document.querySelector("#chatToggle");
const adminRailTabs = document.querySelectorAll("[data-admin-rail-tabs]");
const showBroadcastPanelButtons = [
  document.querySelector("#showBroadcastPanelButton"),
  document.querySelector("#showBroadcastPanelButtonAlt"),
  document.querySelector("#showBroadcastPanelButtonQueue"),
  document.querySelector("#showBroadcastPanelButtonBump"),
  document.querySelector("#showBroadcastPanelButtonFx")
];
const showQueuePanelButtons = [
  document.querySelector("#showQueuePanelButton"),
  document.querySelector("#showQueuePanelButtonAlt"),
  document.querySelector("#showQueuePanelButtonQueue"),
  document.querySelector("#showQueuePanelButtonBump"),
  document.querySelector("#showQueuePanelButtonFx")
];
const showBumpPanelButtons = [
  document.querySelector("#showBumpPanelButton"),
  document.querySelector("#showBumpPanelButtonAlt"),
  document.querySelector("#showBumpPanelButtonQueue"),
  document.querySelector("#showBumpPanelButtonBump"),
  document.querySelector("#showBumpPanelButtonFx")
];
const showFxPanelButtons = [
  document.querySelector("#showFxPanelButton"),
  document.querySelector("#showFxPanelButtonAlt"),
  document.querySelector("#showFxPanelButtonQueue"),
  document.querySelector("#showFxPanelButtonBump"),
  document.querySelector("#showFxPanelButtonFx")
];
const showChatPanelButtons = [
  document.querySelector("#showChatPanelButton"),
  document.querySelector("#showChatPanelButtonAlt"),
  document.querySelector("#showChatPanelButtonQueue"),
  document.querySelector("#showChatPanelButtonBump"),
  document.querySelector("#showChatPanelButtonFx")
];
const chatStatus = document.querySelector("#chatStatus");
const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatSendButton = document.querySelector("#chatSendButton");
const chatMessage = document.querySelector("#chatMessage");
const showLoginButton = document.querySelector("#showLoginButton");
const showRegisterButton = document.querySelector("#showRegisterButton");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const registerForm = document.querySelector("#registerForm");
const registerMessage = document.querySelector("#registerMessage");
const logoutButton = document.querySelector("#logoutButton");
const adminIdentity = document.querySelector("#adminIdentity");
const adminTools = document.querySelector("#adminTools");
const sourceFolderForm = document.querySelector("#sourceFolderForm");
const playlistImportForm = document.querySelector("#playlistImportForm");
const archiveImportForm = document.querySelector("#archiveImportForm");
const sourceSearchForm = document.querySelector("#sourceSearchForm");
const sourceForm = document.querySelector("#sourceForm");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduledModeButton = document.querySelector("#scheduledModeButton");
const queueModeButton = document.querySelector("#queueModeButton");
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
const visualBrightnessValue = document.querySelector("#visualBrightnessValue");
const visualContrastValue = document.querySelector("#visualContrastValue");
const visualSaturationValue = document.querySelector("#visualSaturationValue");
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
const delayToggleButton = document.querySelector("#delayToggleButton");
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
let schedulePickMode = "source";
let draggedQueueId = "";
let draggedSourceId = "";
let adminDataCache = { sourceFolders: [], sources: [] };
const expandedSourceFolders = new Set(JSON.parse(localStorage.getItem("doink_expanded_source_folders") || "[]"));
const collapsedFxSections = new Set(JSON.parse(localStorage.getItem("doink_collapsed_fx_sections") || "[]"));
const availableThemeList = ["station", "woodsy", "mountain", "deep-ocean", "rainforest", "frutiger-aero", "aero-lime", "aero-sunset", "candy-static", "terminal-green", "hotdog-stand", "midnight-laundromat", "mall-kiosk"];
const chaosThemeList = ["woodsy", "mountain", "deep-ocean", "rainforest", "frutiger-aero", "aero-lime", "aero-sunset", "candy-static", "terminal-green", "hotdog-stand", "midnight-laundromat", "mall-kiosk"];
const availableThemes = new Set(availableThemeList);
let currentTheme = localStorage.getItem("doink_theme") || "station";
if (!availableThemes.has(currentTheme)) currentTheme = "station";
let audioUnlocked = true;
let playbackUnlocked = false;
let pendingPlaybackUnlock = false;
let viewerVolume = Number(localStorage.getItem("doink_volume") || 70);
if (!Number.isFinite(viewerVolume)) viewerVolume = 70;
viewerVolume = Math.max(0, Math.min(100, viewerVolume));
let hlsPlayer = null;
let hlsLoaded = false;
let hlsLoading = false;
let streamLoadingTimer = 0;
let streamBlankSince = 0;
let streamProgressSeenAt = Date.now();
let lastStreamTime = 0;
let hlsResetAt = 0;
let sourceSearchTimer = 0;
let sourceSearchRequestId = 0;
let sourceSearchCache = [];
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
let visualPostTimer = 0;
let delayPostTimer = 0;
let delayActive = false;
let delayNodes = null;
let delayLfoTimer = 0;
let activePageFxSignature = "";
let delayState = {
  timeMs: 375,
  feedback: 0.35,
  mix: 0.32,
  tone: 4800,
  sync: true,
  division: "dotted-eighth",
  repitch: "tape"
};

window.onYouTubeIframeAPIReady = () => {
  youtubePlayer = new YT.Player("youtubePlayer", {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      cc_load_policy: 0,
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

function setTheme(theme, { persist = true } = {}) {
  currentTheme = availableThemes.has(theme) ? theme : "station";
  document.body.dataset.theme = currentTheme;
  if (themeSelect) themeSelect.value = currentTheme;
  if (persist) localStorage.setItem("doink_theme", currentTheme);
}

function displayTheme(theme) {
  document.body.dataset.theme = availableThemes.has(theme) ? theme : currentTheme;
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

function setUserState(user) {
  currentUser = user;
  adminAuthenticated = user?.role === "admin";
  setLoginOpen(false);
  adminTools.classList.toggle("hidden", !adminAuthenticated);
  shell.classList.toggle("admin-open", adminAuthenticated);
  adminRailTabs.forEach((tabs) => tabs.classList.toggle("hidden", !adminAuthenticated));
  chatPanel.classList.toggle("admin-rail", adminAuthenticated);
  adminToggle.textContent = adminAuthenticated ? "Controls" : user ? "Log Out" : "Log In";
  if (user) adminIdentity.textContent = `Signed in as ${user.username}`;
  chatInput.disabled = !user;
  chatSendButton.disabled = !user;
  chatInput.placeholder = user ? "Message global chat" : "Log in to chat";
  chatStatus.textContent = user ? `Chatting as ${user.username}` : "Log in to join";
  if (adminAuthenticated) {
    setAdminRailView(adminRailView || "broadcast");
  } else {
    adminPanel.classList.add("hidden");
    queuePanel.classList.add("hidden");
    bumpPanel.classList.add("hidden");
    fxPanel.classList.add("hidden");
    chatPanel.classList.remove("hidden");
    shell.classList.remove("bump-workspace");
  }
}

function setChatCollapsed(isCollapsed) {
  if (adminAuthenticated) return;
  chatCollapsed = isCollapsed;
  chatPanel.classList.toggle("collapsed", isCollapsed);
  shell.classList.toggle("chat-collapsed", isCollapsed);
  chatToggle.textContent = isCollapsed ? "Chat" : "Minimize";
  chatToggle.setAttribute("aria-expanded", String(!isCollapsed));
}

function setAdminRailView(view) {
  adminRailView = ["broadcast", "queue", "bump", "fx", "chat"].includes(view) ? view : "broadcast";
  const showingBroadcast = adminRailView === "broadcast";
  const showingQueue = adminRailView === "queue";
  const showingBump = adminRailView === "bump";
  const showingFx = adminRailView === "fx";
  adminPanel.classList.toggle("hidden", !showingBroadcast);
  queuePanel.classList.toggle("hidden", !showingQueue);
  bumpPanel.classList.toggle("hidden", !showingBump);
  fxPanel.classList.toggle("hidden", !showingFx);
  chatPanel.classList.toggle("hidden", showingBroadcast || showingQueue || showingBump || showingFx);
  chatPanel.classList.remove("collapsed");
  shell.classList.remove("chat-collapsed");
  shell.classList.toggle("bump-workspace", showingBump);
  showBroadcastPanelButtons.forEach((button) => button.classList.toggle("active", showingBroadcast));
  showQueuePanelButtons.forEach((button) => button.classList.toggle("active", showingQueue));
  showBumpPanelButtons.forEach((button) => button.classList.toggle("active", showingBump));
  showFxPanelButtons.forEach((button) => button.classList.toggle("active", showingFx));
  showChatPanelButtons.forEach((button) => button.classList.toggle("active", adminRailView === "chat"));
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
    const id = fxSectionStorageId(section);
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
            ${result.description ? `<p>${escapeHtml(result.description)}</p>` : ""}
          </div>
          <div class="edit-actions">
            <a class="secondary compact button-link" href="${escapeHtml(result.url)}" target="_blank" rel="noopener noreferrer">Open</a>
            <button class="secondary compact" data-use-archive-result="${index}" type="button">Use</button>
          </div>
        </article>`)
        .join("")
    : "";
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

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

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
      streamPlayer.play().catch(() => {});
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
      streamPlayer.play().catch(() => {});
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
    nowTitle.textContent = "This browser cannot play the HLS stream.";
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
  streamPlayer.play().catch(() => {});
}

function applyViewerVolume({ unlock = false } = {}) {
  if (unlock) {
    audioUnlocked = true;
    playbackUnlocked = true;
  }
  const volume = Math.max(0, Math.min(1, viewerVolume / 100));
  const muted = !audioUnlocked || volume <= 0;

  streamPlayer.volume = volume;
  streamPlayer.muted = muted;
  volumeSlider.value = Math.round(viewerVolume);
  volumeSlider.style.setProperty("--volume-fill", `${Math.round(viewerVolume)}%`);
  volumeValue.textContent = `${Math.round(viewerVolume)}%`;

  if (youtubeReady) {
    youtubePlayer.setVolume?.(Math.round(viewerVolume));
    if (muted) {
      youtubePlayer.mute?.();
    } else {
      youtubePlayer.unMute?.();
    }
  }
}

function unlockPlayback() {
  pendingPlaybackUnlock = true;
  playbackUnlocked = true;
  audioUnlocked = true;
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

function fxIsActive(fx) {
  return !Number.isFinite(Number(fx.expiresAt)) || fx.expiresAt > Date.now() + clockDelta;
}

function applyBroadcastFx(effects = []) {
  const active = effects.filter(fxIsActive);
  applyPageFx(active);
  handleFxCommands(active);
  if (!active.some((fx) => fx.id === "seed-skip")) stopSeedSkipper();
  if (!active.some((fx) => fx.id === "av-warp")) resetAvWarp(false);
  if (!active.some((fx) => fx.id === "delay")) disableDelay(false);
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
  frame.style.setProperty("--fx-vhs-ms", `${Math.max(0.44, 1.28 - chaos * 0.075)}s`);
  frame.style.setProperty("--fx-tape-ms", `${Math.max(0.42, 1.12 - chaos * 0.055)}s`);
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
  applyStackedFxFilter(active, intensity, chaos);
  frame.className = frame.className
    .split(/\s+/)
    .filter((name) => name && !name.startsWith("fx-"))
    .join(" ");
  for (const fx of active) frame.classList.add(`fx-${fx.id}`);
  if (active.length > 1) frame.classList.add("fx-chaos-stack");
  fxOverlay.innerHTML = `${renderFxTexture(active)}${active.map(renderFxOverlay).join("")}${renderFrozenFrame()}`;
  renderLooperLayers();
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
  const brightnessDamage = Math.max(0, -rawBrightness, rawBrightness - 160) / 100;
  const contrastDamage = Math.max(0, -rawContrast, rawContrast - 170) / 100;
  const saturationDamage = Math.max(0, -rawSaturation, rawSaturation - 180) / 100;
  const damage = Math.min(2.6, brightnessDamage + contrastDamage + saturationDamage);
  return {
    rawBrightness,
    rawContrast,
    rawSaturation,
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
    if (fx.id === "frozen") captureFrozenFrame(fx);
  }
}

function syncPlaylistAudio(fx) {
  if (!fxAudioLayer) return;
  if (!fx || fx.expiresAt <= Date.now() + clockDelta) {
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
    const result = await api("/api/fx", {
      method: "POST",
      body: JSON.stringify({ id: capture ? "looper-capture" : "looper-config", duration: 2, params })
    });
    setMessage(fxMessage, `${result.fx.at(-1)?.label || "Signal looper"} fired.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

async function broadcastLooperLayerConfig(layerNumber) {
  const layer = looperLayers[Math.max(0, Math.min(2, Number(layerNumber) - 1))];
  if (!layer) return;
  try {
    await api("/api/fx", {
      method: "POST",
      body: JSON.stringify({ id: "looper-config", duration: 2, params: normalizedLooperSettings(layer) })
    });
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
  const noisyIds = new Set(["glitch", "signal-loss", "tape-warp", "vhs", "dvd-skip", "frozen", "hum", "radio-sting", ...osIds]);
  const colorIds = ["palette-swap", "kaleidoscope", "invert", "color-acid", "color-hot", "color-ice"];
  const hasNoise = active.length > 2 || active.some((fx) => noisyIds.has(fx.id));
  const hasChroma = active.length > 1 || active.some((fx) => ["glitch", "vhs", ...colorIds].includes(fx.id));
  const hasDropout = active.length > 3 || active.some((fx) => ["signal-loss", "dvd-skip", "frozen"].includes(fx.id));
  const hasPixels = active.some((fx) => ["glitch", "dvd-skip", "pixelate", "glass", "melt", "retro-os", "blue-screen"].includes(fx.id)) || active.length > 3;
  const hasMagnetic = active.some((fx) => ["tape-warp", "vhs", "signal-loss", "kaleidoscope", "lsd", "floppy-prompt"].includes(fx.id)) || active.length > 2;
  const hasDegauss = active.some((fx) => ["palette-swap", "color-acid", "color-hot", "color-ice", "invert", "kaleidoscope", "lsd"].includes(fx.id));
  const visualDamage = normalizedVisualValues(active.find((fx) => fx.id === "visual-adjust")?.params || {}).damage;
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
  return [
    (hasNoise || hasVisualDamage) ? `<div class="fx-texture fx-fine-noise" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasPixels || visualDamage > 0.28) ? `<div class="fx-texture fx-coarse-pixels" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasMagnetic || visualDamage > 0.62) ? `<div class="fx-texture fx-magnetic-bands" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    (hasDegauss || visualDamage > 0.36) ? `<div class="fx-texture fx-degauss" style="--visual-damage:${visualDamage.toFixed(2)}"></div>` : "",
    hasChroma ? `<div class="fx-texture fx-chroma-smear"></div>` : "",
    hasDropout ? `<div class="fx-texture fx-dropout"></div>` : "",
    fillLayers,
    osLayers,
    sourceLayers
  ].join("");
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
  if (updateControls) {
    warpSpeedSlider.value = "1";
    warpPitchSlider.value = "1";
    warpDesyncSlider.value = "0";
    updateWarpLabels(avWarp);
  }
  applyAvWarpToPlayers();
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
      applyAvWarpToPlayers();
      clearInterval(avWarpTweenTimer);
      avWarpTweenTimer = 0;
    }
  }, 50);
}

function applyAvWarpToPlayers() {
  const rate = Math.max(0.25, Math.min(2, avWarp.speed * avWarp.pitch));
  streamPlayer.playbackRate = rate;
  streamPlayer.defaultPlaybackRate = rate;
  if ("preservesPitch" in streamPlayer) streamPlayer.preservesPitch = Math.abs(avWarp.pitch - 1) < 0.03;
  if ("mozPreservesPitch" in streamPlayer) streamPlayer.mozPreservesPitch = Math.abs(avWarp.pitch - 1) < 0.03;
  if ("webkitPreservesPitch" in streamPlayer) streamPlayer.webkitPreservesPitch = Math.abs(avWarp.pitch - 1) < 0.03;
  if (youtubeReady) {
    const youtubeRate = nearestYouTubeRate(rate);
    if (Math.abs(youtubeRate - lastYoutubeWarpRate) >= 0.24) {
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
      await api("/api/fx", { method: "POST", body: JSON.stringify({ id: "av-warp", duration: 90, params: values }) });
      setMessage(fxMessage, "A/V warp updated.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 120);
}

function readVisualControls() {
  return {
    brightness: Number(visualBrightnessSlider?.value || 100),
    contrast: Number(visualContrastSlider?.value || 100),
    saturation: Number(visualSaturationSlider?.value || 100)
  };
}

function updateVisualLabels(values = readVisualControls()) {
  if (visualBrightnessValue) visualBrightnessValue.textContent = `${Math.round(values.brightness)}%`;
  if (visualContrastValue) visualContrastValue.textContent = `${Math.round(values.contrast)}%`;
  if (visualSaturationValue) visualSaturationValue.textContent = `${Math.round(values.saturation)}%`;
}

async function broadcastVisualAdjust() {
  const values = readVisualControls();
  updateVisualLabels(values);
  clearTimeout(visualPostTimer);
  visualPostTimer = setTimeout(async () => {
    try {
      await api("/api/fx", { method: "POST", body: JSON.stringify({ id: "visual-adjust", duration: 90, params: values }) });
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
  updateVisualLabels();
  await api("/api/fx", {
    method: "POST",
    body: JSON.stringify({ id: "visual-adjust", duration: 2, params: readVisualControls() })
  }).catch(() => {});
}

function readDelayControls() {
  return {
    timeMs: Number(delayTimeSlider.value || 375),
    feedback: Number(delayFeedbackSlider.value || 35) / 100,
    mix: Number(delayMixSlider.value || 32) / 100,
    tone: Number(delayToneSlider.value || 4800),
    sync: delaySyncToggle.checked,
    division: delayDivisionSelect.value,
    repitch: delayRepitchSelect.value
  };
}

function syncedDelaySeconds(values) {
  return Math.max(0.04, Math.min(2.5, (60 / looperBpm) * noteDivisionBeats(values.division)));
}

function effectiveDelaySeconds(values = delayState) {
  return values.sync ? syncedDelaySeconds(values) : Math.max(0.04, Math.min(2.5, values.timeMs / 1000));
}

function updateDelayLabels(values = readDelayControls()) {
  const seconds = effectiveDelaySeconds(values);
  delayTimeValue.textContent = values.sync ? `${values.division.replaceAll("-", " ")} (${Math.round(seconds * 1000)}ms)` : `${Math.round(values.timeMs)}ms`;
  delayFeedbackValue.textContent = `${Math.round(values.feedback * 100)}%`;
  delayMixValue.textContent = `${Math.round(values.mix * 100)}%`;
  delayToneValue.textContent = values.tone >= 1000 ? `${(values.tone / 1000).toFixed(1)}k` : `${Math.round(values.tone)}Hz`;
  updateDelayToggle();
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
    const result = await api("/api/fx", {
      method: "POST",
      body: JSON.stringify({ id: "source-overlay", duration: Number(overlayDurationSlider.value || 45), params })
    });
    setMessage(fxMessage, `${result.fx.at(-1)?.label || "Source overlay"} fired.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}

function ensureDelayGraph() {
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
  tone.type = "lowpass";
  wet.gain.value = 0;
  feedback.gain.value = 0;
  source.connect(dry);
  dry.connect(context.destination);
  source.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(tone);
  tone.connect(wet);
  wet.connect(context.destination);
  delayNodes = { context, source, dry, wet, delay, feedback, tone };
  return delayNodes;
}

function applyDelayFx(params = {}) {
  delayActive = true;
  delayState = {
    timeMs: Math.max(40, Math.min(2000, Number(params.timeMs || delayState.timeMs || 375))),
    feedback: Math.max(0, Math.min(0.88, Number(params.feedback ?? delayState.feedback ?? 0.35))),
    mix: Math.max(0, Math.min(1, Number(params.mix ?? delayState.mix ?? 0.32))),
    tone: Math.max(800, Math.min(12000, Number(params.tone || delayState.tone || 4800))),
    sync: params.sync !== undefined ? Boolean(params.sync) : delayState.sync,
    division: params.division || delayState.division || "dotted-eighth",
    repitch: params.repitch || delayState.repitch || "tape"
  };
  delayTimeSlider.value = String(delayState.timeMs);
  delayFeedbackSlider.value = String(Math.round(delayState.feedback * 100));
  delayMixSlider.value = String(Math.round(delayState.mix * 100));
  delayToneSlider.value = String(delayState.tone);
  delaySyncToggle.checked = delayState.sync;
  delayDivisionSelect.value = delayState.division;
  delayRepitchSelect.value = delayState.repitch;
  updateDelayLabels(delayState);
  applyDelayToGraph();
}

function applyDelayToGraph() {
  const nodes = ensureDelayGraph();
  if (!nodes) return;
  nodes.context.resume?.();
  const now = nodes.context.currentTime;
  const baseDelay = effectiveDelaySeconds(delayState);
  const delaySeconds = delayState.repitch === "slap" ? Math.min(0.18, baseDelay) : baseDelay;
  const feedback = delayState.repitch === "slap" ? Math.min(delayState.feedback, 0.28) : delayState.feedback;
  const tone = delayState.repitch === "dub" ? Math.min(delayState.tone, 2600) : delayState.tone;
  nodes.delay.delayTime.cancelScheduledValues(now);
  if (delayState.repitch === "digital") {
    nodes.delay.delayTime.setTargetAtTime(delaySeconds, now, 0.015);
  } else {
    nodes.delay.delayTime.linearRampToValueAtTime(delaySeconds, now + 0.09);
  }
  nodes.feedback.gain.setTargetAtTime(feedback, now, 0.02);
  nodes.wet.gain.setTargetAtTime(delayState.mix, now, 0.02);
  nodes.dry.gain.setTargetAtTime(Math.max(0.45, 1 - delayState.mix * 0.35), now, 0.02);
  nodes.tone.frequency.setTargetAtTime(tone, now, 0.04);
  startDelayModulation();
}

function startDelayModulation() {
  clearInterval(delayLfoTimer);
  if (!delayActive || delayState.repitch !== "tape" || !delayNodes) return;
  delayLfoTimer = setInterval(() => {
    if (!delayActive || !delayNodes) return;
    const now = delayNodes.context.currentTime;
    const base = effectiveDelaySeconds(delayState);
    delayNodes.delay.delayTime.setTargetAtTime(Math.max(0.04, Math.min(2.5, base * (0.985 + Math.random() * 0.03))), now, 0.08);
  }, 420);
}

function disableDelay(updateControls = true) {
  if (!delayActive && !delayNodes) return;
  delayActive = false;
  clearInterval(delayLfoTimer);
  delayLfoTimer = 0;
  if (delayNodes) {
    const now = delayNodes.context.currentTime;
    delayNodes.wet.gain.setTargetAtTime(0, now, 0.03);
    delayNodes.feedback.gain.setTargetAtTime(0, now, 0.03);
    delayNodes.dry.gain.setTargetAtTime(1, now, 0.03);
  }
  if (updateControls) {
    updateDelayLabels(readDelayControls());
  }
  updateDelayToggle();
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
  applyDelayFx(values);
  clearTimeout(delayPostTimer);
  delayPostTimer = setTimeout(async () => {
    try {
      await api("/api/fx", { method: "POST", body: JSON.stringify({ id: "delay", params: { ...values, enabled: true } }) });
      setMessage(fxMessage, "Delay on.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
  }, 120);
}

async function toggleDelay() {
  if (delayActive) {
    disableDelay(true);
    clearTimeout(delayPostTimer);
    try {
      await api("/api/fx", { method: "POST", body: JSON.stringify({ id: "delay", params: { enabled: false } }) });
      setMessage(fxMessage, "Delay off.");
    } catch (error) {
      setMessage(fxMessage, error.message, true);
    }
    return;
  }
  await broadcastDelay();
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
  return text ? `<span class="fx-callout fx-callout-${escapeHtml(fx.id)}">${escapeHtml(text)}${level > 1 ? ` x${level}` : ""}</span>` : "";
}

function syncProgram(program) {
  if (!program) return;
  currentProgram = program;
  clockDelta = program.serverTime - Date.now();
  applyBroadcastFx(program.fx || []);
  const live = program.live;
  const next = program.next;

  nextTitle.textContent = next ? `${next.title} at ${new Date(next.startAt).toLocaleTimeString()}` : "Unscheduled";

  if (!live) {
    currentProgramId = "";
    nowTitle.textContent = "No active program";
    progressText.textContent = "00:00 / 00:00";
    liveBadge.textContent = "Waiting";
    liveBadge.classList.add("off");
    hideStreamLoading();
    enterStreamMode();
    return;
  }

  liveBadge.textContent = "Live";
  liveBadge.classList.remove("off");
  nowTitle.textContent = live.title;
  if (live.source.type === "youtube") {
    enterYouTubeMode(live);
    if (!youtubeSyncTimer) youtubeSyncTimer = setInterval(() => {
      if (currentProgram?.live?.source?.type === "youtube") syncYouTube(currentProgram.live);
    }, 2500);
  } else {
    enterStreamMode();
  }

  currentProgramId = live.id;
}

function tickProgress() {
  if (!currentProgram?.live) return;
  applyBroadcastFx(currentProgram.fx || []);
  keepBroadcastVisible();
  const offset = Math.min(activeOffset(), currentProgram.live.duration);
  progressText.textContent = `${formatDuration(offset)} / ${formatDuration(currentProgram.live.duration)}`;
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

function renderAdmin(data) {
  adminDataCache = data;
  const folders = data.sourceFolders || [];
  setBroadcastModeUI(data.broadcastMode);
  const librarySources = data.sources.filter((source) => source.type !== "bump");
  sourceFolderSelect.innerHTML = [
    `<option value="">Unfiled sources</option>`,
    ...folders.map((folder) => `<option value="${folder.id}">${escapeHtml(folder.name)}</option>`)
  ].join("");

  renderTimingSourcePicker(data);
  renderOverlaySourcePicker(data);

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

  const liveQueue = (data.liveQueue || [])
    .filter((entry) => entry.startAt + entry.duration * 1000 > Date.now() - 1000)
    .sort((a, b) => a.startAt - b.startAt);

  queueList.innerHTML = liveQueue.length
    ? liveQueue
        .map((entry, index) => {
          const source = data.sources.find((item) => item.id === entry.sourceId);
          const isBump = source?.type === "bump";
          const isCurrent = Date.now() >= entry.startAt && Date.now() < entry.startAt + entry.duration * 1000;
          const canMove = (!isBump || !entry.autoBump) && !isCurrent;
          return `
            <div class="item queue-item" data-queue-item="${entry.id}" draggable="${canMove}">
              <span class="drag-handle" aria-hidden="true">${canMove ? "Drag" : "Live"}</span>
              <div>
                <strong>${escapeHtml(entry.title || source?.title || "Queued source")}</strong>
                <small>${new Date(entry.startAt).toLocaleTimeString()} &middot; ${formatDuration(entry.duration)}${isCurrent ? " &middot; On air" : ""}${isBump ? " &middot; Auto bump" : ""}</small>
              </div>
              <div class="queue-actions">
                <button class="danger compact" data-delete-queue="${entry.id}" type="button">Delete</button>
              </div>
            </div>`;
        })
        .join("")
    : `<p class="message">Queue is empty.</p>`;
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
  chatMessages.innerHTML = data.messages.length
    ? data.messages
        .map((message) => {
          const nameClass = message.role === "admin" ? "admin-name" : "";
          return `
            <article class="chat-entry">
              <strong class="${nameClass}">${escapeHtml(message.username)}</strong>
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

async function loadAdmin() {
  const data = await api("/api/admin");
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

adminToggle.addEventListener("click", () => {
  if (adminAuthenticated) {
    const railOpen = shell.classList.contains("admin-open");
    shell.classList.toggle("admin-open", !railOpen);
    adminPanel.classList.toggle("hidden", railOpen || adminRailView !== "broadcast");
    queuePanel.classList.toggle("hidden", railOpen || adminRailView !== "queue");
    bumpPanel.classList.toggle("hidden", railOpen || adminRailView !== "bump");
    chatPanel.classList.toggle("hidden", railOpen || adminRailView !== "chat");
    shell.classList.toggle("bump-workspace", !railOpen && adminRailView === "bump");
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
showBroadcastPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("broadcast")));
showQueuePanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("queue")));
showBumpPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("bump")));
showFxPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("fx")));
showChatPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("chat")));
pickModeButtons.forEach((button) => button.addEventListener("click", () => setSchedulePickMode(button.dataset.pickMode)));
chatToggle.addEventListener("click", () => setChatCollapsed(!chatCollapsed));
scheduledModeButton.addEventListener("click", async () => {
  try {
    await api("/api/broadcast-mode", { method: "POST", body: JSON.stringify({ mode: "scheduled" }) });
    setMessage(scheduleMessage, "Broadcast priority set to scheduled.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

queueModeButton.addEventListener("click", async () => {
  try {
    await api("/api/broadcast-mode", { method: "POST", body: JSON.stringify({ mode: "queue" }) });
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
  const button = event.target.closest("[data-use-archive-result]");
  if (!button) return;
  useArchiveSearchResult(sourceSearchCache[Number(button.dataset.useArchiveResult)]);
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
  streamPlayer.play().catch(() => {});
});

[warpSpeedSlider, warpPitchSlider, warpDesyncSlider].forEach((slider) => {
  slider?.addEventListener("input", broadcastAvWarp);
});

warpResetButton?.addEventListener("click", async () => {
  resetAvWarp(true);
  await api("/api/fx", { method: "POST", body: JSON.stringify({ id: "av-warp", duration: 2, params: avWarp }) }).catch(() => {});
});

[visualBrightnessSlider, visualContrastSlider, visualSaturationSlider].forEach((slider) => {
  slider?.addEventListener("input", broadcastVisualAdjust);
});

visualResetButton?.addEventListener("click", resetVisualAdjust);

[delayTimeSlider, delayFeedbackSlider, delayMixSlider, delayToneSlider, delaySyncToggle, delayDivisionSelect, delayRepitchSelect].forEach((control) => {
  const handleDelayControl = () => {
    updateDelayLabels();
    if (delayActive) broadcastDelay();
  };
  control?.addEventListener("input", handleDelayControl);
  control?.addEventListener("change", handleDelayControl);
});

delayToggleButton?.addEventListener("click", toggleDelay);

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
    await api("/api/queue", { method: "DELETE" });
    setMessage(queueMessage, "Queue cleared.");
    await loadAdmin();
  } catch (error) {
    setMessage(queueMessage, error.message, true);
  }
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
    const result = await api("/api/fx", { method: "POST", body: JSON.stringify({ id: button.dataset.fx, params }) });
    setMessage(fxMessage, `${result.fx.at(-1)?.label || "FX"} fired.`);
  } catch (error) {
    setMessage(fxMessage, error.message, true);
  }
}));

clearFxButton?.addEventListener("click", async () => {
  try {
    await api("/api/fx", { method: "DELETE" });
    disableDelay(true);
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
    setMessage(queueId ? queueMessage : scheduleMessage, error.message, true);
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

api("/api/program").then(syncProgram).catch(() => {});

new EventSource("/api/events").onmessage = (event) => {
  syncProgram(JSON.parse(event.data));
};

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
streamPlayer.addEventListener("loadeddata", markStreamProgress);
streamPlayer.addEventListener("waiting", () => setTimeout(keepBroadcastVisible, 1000));
streamPlayer.addEventListener("error", () => {
  resetHlsStream();
});
setInterval(tickProgress, 1000);
setTheme(currentTheme);
setChatCollapsed(false);
initFxCollapsibles();
applyViewerVolume();
startLooperBeat();
loadLooperLayerControls(1);
updateWarpLabels();
updateVisualLabels();
updateDelayLabels();
updateOverlayLabels();
updateLooperMonitor();
renderLooperWaveform(Array.from({ length: 16 }, () => 0.08));
loadHlsStream();
setSchedulePickMode(schedulePickMode);
syncSourceFields();
updateSourceDurationDisplay();
refreshSession().catch(() => setUserState(null));
