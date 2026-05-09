const frame = document.querySelector("#playerFrame");
const localPlayer = document.querySelector("#localPlayer");
const liveBadge = document.querySelector("#liveBadge");
const nowTitle = document.querySelector("#nowTitle");
const nextTitle = document.querySelector("#nextTitle");
const progressText = document.querySelector("#progressText");
const youtubeLink = document.querySelector("#youtubeLink");
const shell = document.querySelector(".shell");
const adminToggle = document.querySelector("#adminToggle");
const loginPopover = document.querySelector("#loginPopover");
const adminPanel = document.querySelector("#adminPanel");
const chatPanel = document.querySelector("#chatPanel");
const chatToggle = document.querySelector("#chatToggle");
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
const sourceForm = document.querySelector("#sourceForm");
const scheduleForm = document.querySelector("#scheduleForm");
const playNowButton = document.querySelector("#playNowButton");
const sourceMessage = document.querySelector("#sourceMessage");
const scheduleMessage = document.querySelector("#scheduleMessage");
const sourceSelect = scheduleForm.elements.sourceId;
const sourcesList = document.querySelector("#sourcesList");
const scheduleList = document.querySelector("#scheduleList");

let youtubePlayer;
let youtubeReady = false;
let currentProgramId = "";
let currentProgram = null;
let clockDelta = 0;
let adminAuthenticated = false;
let currentUser = null;
let chatCollapsed = false;

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
};

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const secs = String(safeSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
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
  adminPanel.classList.toggle("hidden", !adminAuthenticated);
  adminTools.classList.toggle("hidden", !adminAuthenticated);
  shell.classList.toggle("admin-open", adminAuthenticated);
  adminToggle.textContent = adminAuthenticated ? "Controls" : user ? "Log Out" : "Log In";
  if (user) adminIdentity.textContent = `Signed in as ${user.username}`;
  chatInput.disabled = !user;
  chatSendButton.disabled = !user;
  chatInput.placeholder = user ? "Message global chat" : "Log in to chat";
  chatStatus.textContent = user ? `Chatting as ${user.username}` : "Log in to join";
}

function setChatCollapsed(isCollapsed) {
  chatCollapsed = isCollapsed;
  chatPanel.classList.toggle("collapsed", isCollapsed);
  shell.classList.toggle("chat-collapsed", isCollapsed);
  chatToggle.textContent = isCollapsed ? "Chat" : "Minimize";
  chatToggle.setAttribute("aria-expanded", String(!isCollapsed));
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

function enforcePlayback() {
  if (!currentProgram?.live) return;
  if (currentProgram.live.source.type === "local") {
    syncLocal(currentProgram.live);
  } else {
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
    if (youtubeReady) youtubePlayer.stopVideo();
    syncLocal(live);
  } else {
    localPlayer.pause();
    syncYouTube(live);
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
  sourceSelect.innerHTML = data.sources
    .map((source) => `<option value="${source.id}">${escapeHtml(source.title)} (${source.type})</option>`)
    .join("");

  sourcesList.innerHTML = data.sources.length
    ? data.sources
        .map(
          (source) => `
            <div class="item">
              <div>
                <strong>${escapeHtml(source.title)}</strong>
                <small>${escapeHtml(source.type === "youtube" ? source.url : source.path)} &middot; ${formatDuration(source.duration)}</small>
              </div>
              <button class="danger" data-delete-source="${source.id}" type="button">Remove</button>
            </div>`
        )
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
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
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
    adminPanel.classList.toggle("hidden");
    shell.classList.toggle("admin-open", !adminPanel.classList.contains("hidden"));
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
chatToggle.addEventListener("click", () => setChatCollapsed(!chatCollapsed));

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

sourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const body = Object.fromEntries(new FormData(sourceForm));
    await api("/api/sources", { method: "POST", body: JSON.stringify(body) });
    sourceForm.reset();
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
  const sourceId = event.target.dataset.deleteSource;
  const scheduleId = event.target.dataset.deleteSchedule;
  try {
    if (sourceId) await api(`/api/sources/${sourceId}`, { method: "DELETE" });
    if (scheduleId) await api(`/api/schedule/${scheduleId}`, { method: "DELETE" });
    if (sourceId || scheduleId) await loadAdmin();
  } catch (error) {
    setMessage(scheduleMessage, error.message, true);
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
refreshSession().catch(() => setUserState(null));
