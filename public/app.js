const frame = document.querySelector("#playerFrame");
const streamPlayer = document.querySelector("#streamPlayer");
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
const shell = document.querySelector(".shell");
const adminToggle = document.querySelector("#adminToggle");
const loginPopover = document.querySelector("#loginPopover");
const adminPanel = document.querySelector("#adminPanel");
const chatPanel = document.querySelector("#chatPanel");
const bumpPanel = document.querySelector("#bumpPanel");
const queuePanel = document.querySelector("#queuePanel");
const chatToggle = document.querySelector("#chatToggle");
const adminRailTabs = document.querySelectorAll("[data-admin-rail-tabs]");
const showBroadcastPanelButtons = [
  document.querySelector("#showBroadcastPanelButton"),
  document.querySelector("#showBroadcastPanelButtonAlt"),
  document.querySelector("#showBroadcastPanelButtonQueue"),
  document.querySelector("#showBroadcastPanelButtonBump")
];
const showQueuePanelButtons = [
  document.querySelector("#showQueuePanelButton"),
  document.querySelector("#showQueuePanelButtonAlt"),
  document.querySelector("#showQueuePanelButtonQueue"),
  document.querySelector("#showQueuePanelButtonBump")
];
const showBumpPanelButtons = [
  document.querySelector("#showBumpPanelButton"),
  document.querySelector("#showBumpPanelButtonAlt"),
  document.querySelector("#showBumpPanelButtonQueue"),
  document.querySelector("#showBumpPanelButtonBump")
];
const showChatPanelButtons = [
  document.querySelector("#showChatPanelButton"),
  document.querySelector("#showChatPanelButtonAlt"),
  document.querySelector("#showChatPanelButtonQueue"),
  document.querySelector("#showChatPanelButtonBump")
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
const sourceForm = document.querySelector("#sourceForm");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduledModeButton = document.querySelector("#scheduledModeButton");
const queueModeButton = document.querySelector("#queueModeButton");
const pickModeButtons = document.querySelectorAll("[data-pick-mode]");
const addQueueButton = document.querySelector("#addQueueButton");
const playNowButton = document.querySelector("#playNowButton");
const sourceFolderMessage = document.querySelector("#sourceFolderMessage");
const playlistImportMessage = document.querySelector("#playlistImportMessage");
const sourceMessage = document.querySelector("#sourceMessage");
const sourceIngestMessage = document.querySelector("#sourceIngestMessage");
const scheduleMessage = document.querySelector("#scheduleMessage");
const queueMessage = document.querySelector("#queueMessage");
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
let audioUnlocked = true;
let playbackUnlocked = false;
let pendingPlaybackUnlock = false;
let viewerVolume = Number(localStorage.getItem("doink_volume") || 70);
if (!Number.isFinite(viewerVolume)) viewerVolume = 70;
viewerVolume = Math.max(0, Math.min(100, viewerVolume));
let hlsPlayer = null;
let hlsLoaded = false;
let hlsLoading = false;

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
  adminRailView = ["broadcast", "queue", "bump", "chat"].includes(view) ? view : "broadcast";
  const showingBroadcast = adminRailView === "broadcast";
  const showingQueue = adminRailView === "queue";
  const showingBump = adminRailView === "bump";
  adminPanel.classList.toggle("hidden", !showingBroadcast);
  queuePanel.classList.toggle("hidden", !showingQueue);
  bumpPanel.classList.toggle("hidden", !showingBump);
  chatPanel.classList.toggle("hidden", showingBroadcast || showingQueue || showingBump);
  chatPanel.classList.remove("collapsed");
  shell.classList.remove("chat-collapsed");
  shell.classList.toggle("bump-workspace", showingBump);
  showBroadcastPanelButtons.forEach((button) => button.classList.toggle("active", showingBroadcast));
  showQueuePanelButtons.forEach((button) => button.classList.toggle("active", showingQueue));
  showBumpPanelButtons.forEach((button) => button.classList.toggle("active", showingBump));
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

function syncSourceFields(shouldFocus = false) {
  const type = sourceTypeSelect.value;
  sourceFieldGroups.forEach((group) => {
    group.classList.toggle("hidden", group.dataset.sourceField !== type);
  });
  sourceYoutubeInput.required = type === "youtube";
  sourcePathInput.required = type === "local";
  if (!shouldFocus) return;
  if (type === "youtube") {
    sourceYoutubeInput.focus();
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

function loadHlsStream() {
  if (hlsLoaded || hlsLoading) return;
  hlsLoading = true;
  waitForStreamManifest()
    .then(attachHlsStream)
    .catch(() => {
      hlsLoading = false;
      setTimeout(loadHlsStream, 1000);
    });
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
  const streamUrl = `/stream/live.m3u8?live=${Date.now()}`;
  if (streamPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    streamPlayer.src = streamUrl;
    streamPlayer.addEventListener("loadedmetadata", () => streamPlayer.play().catch(() => {}), { once: true });
  } else if (window.Hls?.isSupported()) {
    hlsPlayer = new Hls({
      liveSyncDurationCount: 2,
      liveMaxLatencyDurationCount: 5,
      enableWorker: true
    });
    hlsPlayer.loadSource(streamUrl);
    hlsPlayer.attachMedia(streamPlayer);
    hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => streamPlayer.play().catch(() => {}));
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

function pauseHlsStream() {
  streamPlayer.pause();
}

function resumeHlsStream() {
  loadHlsStream();
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

function syncYouTube(live, { force = false, fromGesture = false } = {}) {
  if (!youtubeReady || !live?.source?.youtubeId) return;
  const offset = Math.max(0, Math.min(activeOffset(), live.duration - 0.25));
  const now = Date.now();

  if (force || loadedYouTubeProgramId !== live.id) {
    loadedYouTubeProgramId = live.id;
    lastYouTubeSeekAt = now;
    youtubePlayer.loadVideoById({ videoId: live.source.youtubeId, startSeconds: offset });
    applyViewerVolume();
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

function syncProgram(program) {
  if (!program) return;
  currentProgram = program;
  clockDelta = program.serverTime - Date.now();
  const live = program.live;
  const next = program.next;

  nextTitle.textContent = next ? `${next.title} at ${new Date(next.startAt).toLocaleTimeString()}` : "Unscheduled";

  if (!live) {
    currentProgramId = "";
    nowTitle.textContent = "No active program";
    progressText.textContent = "00:00 / 00:00";
    liveBadge.textContent = "Waiting";
    liveBadge.classList.add("off");
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
  const offset = Math.min(activeOffset(), currentProgram.live.duration);
  progressText.textContent = `${formatDuration(offset)} / ${formatDuration(currentProgram.live.duration)}`;
  if (currentProgram.live.source.type === "youtube") {
    syncYouTube(currentProgram.live);
  } else {
    enforcePlayback();
  }
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

  const folderGroups = [
    { id: "", name: "Unfiled sources" },
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
                <small>${escapeHtml(source.type === "youtube" ? source.url : source.path)} &middot; ${formatDuration(source.duration)}</small>
                <small class="ingest-status" data-status="${escapeHtml(ingest.status || "pending")}">Ingest: ${escapeHtml(ingestStatus)}${ingest.message ? ` &middot; ${escapeHtml(ingest.message)}` : ""}</small>
                ${candidateList}
              </div>
              <div class="edit-actions">
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
          return `
            <div class="folder-group${folderCollapsed ? " collapsed" : ""}">
              <div class="folder-heading">
                <button class="folder-toggle" data-toggle-folder="${escapeHtml(folder.id)}" type="button" aria-expanded="${!folderCollapsed}">
                  <span>${folderCollapsed ? "+" : "-"}</span>
                  <strong>${escapeHtml(folder.name)}</strong>
                </button>
                <span class="folder-count">${folder.sources.length}</span>
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
  streamPlayer.play().catch(() => {});
});

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

clearQueueButton?.addEventListener("click", async () => {
  try {
    await api("/api/queue", { method: "DELETE" });
    setMessage(queueMessage, "Queue cleared.");
    await loadAdmin();
  } catch (error) {
    setMessage(queueMessage, error.message, true);
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
streamPlayer.addEventListener("error", () => {
  hlsPlayer?.destroy();
  hlsPlayer = null;
  hlsLoaded = false;
  hlsLoading = false;
  setTimeout(loadHlsStream, 1000);
});
setInterval(tickProgress, 1000);
setChatCollapsed(false);
applyViewerVolume();
loadHlsStream();
setSchedulePickMode(schedulePickMode);
syncSourceFields();
updateSourceDurationDisplay();
refreshSession().catch(() => setUserState(null));
