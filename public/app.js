const frame = document.querySelector("#playerFrame");
const localPlayer = document.querySelector("#localPlayer");
const liveBadge = document.querySelector("#liveBadge");
const nowTitle = document.querySelector("#nowTitle");
const nextTitle = document.querySelector("#nextTitle");
const progressText = document.querySelector("#progressText");
const youtubeLink = document.querySelector("#youtubeLink");
const bumpPlayer = document.querySelector("#bumpPlayer");
const bumpAudio = document.querySelector("#bumpAudio");
const shell = document.querySelector(".shell");
const adminToggle = document.querySelector("#adminToggle");
const loginPopover = document.querySelector("#loginPopover");
const adminPanel = document.querySelector("#adminPanel");
const chatPanel = document.querySelector("#chatPanel");
const bumpPanel = document.querySelector("#bumpPanel");
const chatToggle = document.querySelector("#chatToggle");
const adminRailTabs = document.querySelectorAll("[data-admin-rail-tabs]");
const showBroadcastPanelButtons = [
  document.querySelector("#showBroadcastPanelButton"),
  document.querySelector("#showBroadcastPanelButtonAlt"),
  document.querySelector("#showBroadcastPanelButtonBump")
];
const showBumpPanelButtons = [
  document.querySelector("#showBumpPanelButton"),
  document.querySelector("#showBumpPanelButtonAlt"),
  document.querySelector("#showBumpPanelButtonBump")
];
const showChatPanelButtons = [
  document.querySelector("#showChatPanelButton"),
  document.querySelector("#showChatPanelButtonAlt"),
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
const addQueueButton = document.querySelector("#addQueueButton");
const playNowButton = document.querySelector("#playNowButton");
const sourceFolderMessage = document.querySelector("#sourceFolderMessage");
const playlistImportMessage = document.querySelector("#playlistImportMessage");
const sourceMessage = document.querySelector("#sourceMessage");
const scheduleMessage = document.querySelector("#scheduleMessage");
const sourceSelect = scheduleForm.elements.sourceId;
const sourcesList = document.querySelector("#sourcesList");
const scheduleList = document.querySelector("#scheduleList");
const queueList = document.querySelector("#queueList");
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
let adminAuthenticated = false;
let currentUser = null;
let chatCollapsed = false;
let youtubeAutofillTimer;
let broadcastMode = "scheduled";
let adminRailView = "broadcast";
let adminDataCache = { sourceFolders: [], sources: [] };

window.onYouTubeIframeAPIReady = () => {
  youtubePlayer = new YT.Player("youtubePlayer", {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: () => {
        youtubeReady = true;
        syncProgram(currentProgram);
      },
      onStateChange: () => enforcePlayback()
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
    bumpPanel.classList.add("hidden");
    chatPanel.classList.remove("hidden");
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
  adminRailView = ["broadcast", "bump", "chat"].includes(view) ? view : "broadcast";
  const showingBroadcast = adminRailView === "broadcast";
  const showingBump = adminRailView === "bump";
  adminPanel.classList.toggle("hidden", !showingBroadcast);
  bumpPanel.classList.toggle("hidden", !showingBump);
  chatPanel.classList.toggle("hidden", showingBroadcast || showingBump);
  chatPanel.classList.remove("collapsed");
  shell.classList.remove("chat-collapsed");
  showBroadcastPanelButtons.forEach((button) => button.classList.toggle("active", showingBroadcast));
  showBumpPanelButtons.forEach((button) => button.classList.toggle("active", showingBump));
  showChatPanelButtons.forEach((button) => button.classList.toggle("active", adminRailView === "chat"));
}

function setBroadcastModeUI(mode) {
  broadcastMode = mode === "queue" ? "queue" : "scheduled";
  scheduledModeButton.classList.toggle("active", broadcastMode === "scheduled");
  queueModeButton.classList.toggle("active", broadcastMode === "queue");
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

function syncLocal(live) {
  if (localPlayer.src !== new URL(live.source.path, location.origin).href) {
    localPlayer.src = live.source.path;
  }
  localPlayer.muted = true;
  localPlayer.controls = false;
  localPlayer.playbackRate = 1;
  const offset = activeOffset();
  if (Number.isFinite(offset) && Math.abs(localPlayer.currentTime - offset) > 0.75) {
    localPlayer.currentTime = Math.min(offset, live.duration - 0.2);
  }
  localPlayer.play().catch(() => {});
}

function syncYouTube(live) {
  if (!youtubeReady) return;
  const offset = Math.min(activeOffset(), live.duration - 0.2);
  if (currentProgramId !== live.id) {
    youtubePlayer.loadVideoById({ videoId: live.source.youtubeId, startSeconds: Math.max(0, offset) });
  } else {
    const ytTime = youtubePlayer.getCurrentTime?.() || 0;
    if (Math.abs(ytTime - offset) > 1.25) {
      youtubePlayer.seekTo(Math.max(0, offset), true);
    }
    youtubePlayer.playVideo();
  }
  youtubePlayer.mute();
}

function renderBump(live) {
  const bump = live.source.bump || { heading: "coming up", lines: [] };
  bumpPlayer.innerHTML = `
    <div class="bump-card">
      <h2>${escapeHtml(bump.heading || live.title || "coming up")}</h2>
      <ul>
        ${(bump.lines || [])
          .map(
            (line) => `
              <li>
                <time>${escapeHtml(line.time || "")}</time>
                <span>${escapeHtml(line.title || "")}</span>
              </li>`
          )
          .join("")}
      </ul>
    </div>`;
  const audioPath = bump.audio || "";
  if (audioPath && bumpAudio.src !== new URL(audioPath, location.origin).href) {
    bumpAudio.src = audioPath;
  }
  if (audioPath) {
    bumpAudio.currentTime = Math.min(activeOffset(), 1);
    bumpAudio.volume = 0.82;
    bumpAudio.play().catch(() => {});
  }
}

function enforcePlayback() {
  if (!currentProgram?.live) return;
  if (currentProgram.live.source.type === "local") {
    syncLocal(currentProgram.live);
  } else if (currentProgram.live.source.type === "youtube") {
    syncYouTube(currentProgram.live);
  }
}

function syncProgram(program) {
  if (!program) return;
  currentProgram = program;
  clockDelta = program.serverTime - Date.now();
  const live = program.live;
  const next = program.next;

  nextTitle.textContent = next ? `${next.title} at ${new Date(next.startAt).toLocaleTimeString()}` : "Unscheduled";

  if (!live) {
    setMode("");
    currentProgramId = "";
    nowTitle.textContent = "No active program";
    progressText.textContent = "00:00 / 00:00";
    youtubeLink.classList.add("hidden");
    youtubeLink.href = "#";
    liveBadge.textContent = "Waiting";
    liveBadge.classList.add("off");
    localPlayer.pause();
    bumpAudio.pause();
    if (youtubeReady) youtubePlayer.stopVideo();
    return;
  }

  liveBadge.textContent = "Live";
  liveBadge.classList.remove("off");
  nowTitle.textContent = live.title;
  setMode(live.source.type);
  youtubeLink.classList.toggle("hidden", live.source.type !== "youtube");
  youtubeLink.href = live.source.type === "youtube" ? live.source.url : "#";

  if (live.source.type === "local") {
    bumpAudio.pause();
    if (youtubeReady) youtubePlayer.stopVideo();
    syncLocal(live);
  } else if (live.source.type === "youtube") {
    bumpAudio.pause();
    localPlayer.pause();
    syncYouTube(live);
  } else if (live.source.type === "bump") {
    localPlayer.pause();
    if (youtubeReady) youtubePlayer.stopVideo();
    renderBump(live);
  }

  currentProgramId = live.id;
}

function tickProgress() {
  if (!currentProgram?.live) return;
  const offset = Math.min(activeOffset(), currentProgram.live.duration);
  progressText.textContent = `${formatDuration(offset)} / ${formatDuration(currentProgram.live.duration)}`;
  enforcePlayback();
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

  sourceSelect.innerHTML = librarySources
    .map((source) => {
      const folder = folders.find((item) => item.id === (source.folderId || ""));
      const folderName = folder?.name || "Unfiled";
      return `<option value="${source.id}">${escapeHtml(folderName)} / ${escapeHtml(source.title)} (${source.type})</option>`;
    })
    .join("");

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
                  (source) => `
            <div class="item">
              <div>
                <strong>${escapeHtml(source.title)}</strong>
                <small>${escapeHtml(source.type === "youtube" ? source.url : source.path)} &middot; ${formatDuration(source.duration)}</small>
              </div>
              <div class="edit-actions">
                <button class="secondary compact" data-edit-source="${source.id}" type="button">Edit</button>
                <button class="danger" data-delete-source="${source.id}" type="button">Remove</button>
              </div>
            </div>`
                )
                .join("")
            : `<p class="message">No sources in this folder.</p>`;
          return `
            <div class="folder-group">
              <div class="folder-heading">
                <strong>${escapeHtml(folder.name)}</strong>
                <span class="folder-count">${folder.sources.length}</span>
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
        .map((entry) => {
          const source = data.sources.find((item) => item.id === entry.sourceId);
          return `
            <div class="item">
              <div>
                <strong>${escapeHtml(entry.title || source?.title || "Queued source")}</strong>
                <small>${new Date(entry.startAt).toLocaleTimeString()} &middot; ${formatDuration(entry.duration)}</small>
              </div>
              <button class="danger" data-delete-queue="${entry.id}" type="button">Remove</button>
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

function folderOptions(selectedId = "") {
  return [
    `<option value="">Unfiled sources</option>`,
    ...(adminDataCache.sourceFolders || []).map((folder) => {
      const selected = folder.id === selectedId ? " selected" : "";
      return `<option value="${folder.id}"${selected}>${escapeHtml(folder.name)}</option>`;
    })
  ].join("");
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
    bumpPanel.classList.toggle("hidden", railOpen || adminRailView !== "bump");
    chatPanel.classList.toggle("hidden", railOpen || adminRailView !== "chat");
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
showBumpPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("bump")));
showChatPanelButtons.forEach((button) => button.addEventListener("click", () => setAdminRailView("chat")));
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
    await api("/api/schedule", { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, "Scheduled.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

addQueueButton.addEventListener("click", async () => {
  try {
    const body = Object.fromEntries(new FormData(scheduleForm));
    await api("/api/queue", { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, "Added to live queue.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

playNowButton.addEventListener("click", async () => {
  try {
    const body = Object.fromEntries(new FormData(scheduleForm));
    await api("/api/play-now", { method: "POST", body: JSON.stringify(body) });
    setMessage(scheduleMessage, "Broadcast updated.");
    await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
  }
});

document.addEventListener("click", async (event) => {
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
    setMessage(scheduleMessage, error.message, true);
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

new EventSource("/api/events").onmessage = (event) => {
  syncProgram(JSON.parse(event.data));
};

new EventSource("/api/chat/events").onmessage = (event) => {
  renderChat(JSON.parse(event.data));
};

localPlayer.addEventListener("pause", () => setTimeout(enforcePlayback, 100));
localPlayer.addEventListener("seeking", () => setTimeout(enforcePlayback, 100));
setInterval(tickProgress, 1000);
setChatCollapsed(false);
syncSourceFields();
updateSourceDurationDisplay();
refreshSession().catch(() => setUserState(null));
