const canvas = document.querySelector("#stage");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".stage");
const textLines = document.querySelector("#textLines");
const addLineBtn = document.querySelector("#addLineBtn");
const imageInput = document.querySelector("#imageInput");
const songInput = document.querySelector("#songInput");
const serverSongSelect = document.querySelector("#serverSongSelect");
const serverBackgroundSelect = document.querySelector("#serverBackgroundSelect");
const audioStart = document.querySelector("#audioStart");
const audioStartValue = document.querySelector("#audioStartValue");
const creditText = document.querySelector("#creditText");
const creditPosition = document.querySelector("#creditPosition");
const creditFont = document.querySelector("#creditFont");
const creditSize = document.querySelector("#creditSize");
const creditSizeValue = document.querySelector("#creditSizeValue");
const secondsPerLineInput = document.querySelector("#secondsPerLine");
const secondsPerLineValue = document.querySelector("#secondsPerLineValue");
const fontSizeInput = document.querySelector("#fontSize");
const fontSizeValue = document.querySelector("#fontSizeValue");
const formatInput = document.querySelector("#format");
const toneInput = document.querySelector("#tone");
const tintStrength = document.querySelector("#tintStrength");
const tintStrengthValue = document.querySelector("#tintStrengthValue");
const productionStyle = document.querySelector("#productionStyle");
const productionAccent = document.querySelector("#productionAccent");
const productionBadge = document.querySelector("#productionBadge");
const productionKicker = document.querySelector("#productionKicker");
const effectToggles = [...document.querySelectorAll(".effect-toggle")];
const effectIntensity = document.querySelector("#effectIntensity");
const effectIntensityValue = document.querySelector("#effectIntensityValue");
const previewBtn = document.querySelector("#previewBtn");
const renderBtn = document.querySelector("#renderBtn");
const queueBumpBtn = document.querySelector("#queueBumpBtn");
const playNextBumpBtn = document.querySelector("#playNextBumpBtn");
const downloadLink = document.querySelector("#downloadLink");
const outputVideo = document.querySelector("#outputVideo");
const status = document.querySelector("#status");
const bumpSummary = document.querySelector("#bumpSummary");
const summaryPreset = document.querySelector("#summaryPreset");
const summaryMedia = document.querySelector("#summaryMedia");
const summaryEffects = document.querySelector("#summaryEffects");
const previewSummary = document.querySelector("#previewSummary");
const previewDuration = document.querySelector("#previewDuration");
const previewCanvas = document.querySelector("#previewCanvas");
const previewAudioBadge = document.querySelector("#previewAudio");
const progress = document.querySelector("#progress");
const timeLabel = document.querySelector("#timeLabel");
const durationLabel = document.querySelector("#durationLabel");
const wallpaperShapes = document.querySelector("#wallpaperShapes");
const wallpaperScheme = document.querySelector("#wallpaperScheme");
const wallpaperSpacing = document.querySelector("#wallpaperSpacing");
const wallpaperSpacingValue = document.querySelector("#wallpaperSpacingValue");
const wallpaperPreview = document.querySelector("#wallpaperPreview");
const wallpaperPreviewCtx = wallpaperPreview.getContext("2d");
const randomizeWallpaperBtn = document.querySelector("#randomizeWallpaperBtn");
const useWallpaperBtn = document.querySelector("#useWallpaperBtn");
const presetButtons = [...document.querySelectorAll("[data-bump-preset]")];
const audioStartField = document.querySelector("[data-audio-start-field]");
const effectIntensityField = document.querySelector("[data-effect-intensity-field]");

let backgroundImage = null;
let backgroundVideo = null;
let backgroundUrl = "";
let outputUrl = "";
let animationId = 0;
let previewStart = performance.now();
let wallpaperSeed = Math.floor(Math.random() * 100000);
let creditWasAutoFilled = true;
let audioProbeUrl = "";
let previewAudio = null;
let selectedServerAudio = null;
let selectedServerBackground = null;
let activePresetName = "block";
const effectCanvas = document.createElement("canvas");
const effectCtx = effectCanvas.getContext("2d");

const state = {
  rendering: false,
  previewing: true,
  usingWallpaper: false,
  previewAudioEnabled: false,
};

const bumpPresets = {
  block: {
    label: "Block bump",
    lines: ["we now return to the scheduled weirdness."],
    secondsPerLine: 4,
    fontSize: 46,
    placement: "middle",
    alignment: "left",
    tone: "caption",
    tintStrength: 62,
    wallpaperShapes: "memphis",
    wallpaperScheme: "arcade",
    wallpaperSpacing: 86,
    useWallpaper: true,
    productionStyle: "promo-card",
    productionAccent: "signal",
    productionBadge: "DOINKTV",
    productionKicker: "block signal",
    effects: ["vhs", "scanlines", "chromatic"],
    effectIntensity: 38,
  },
  station: {
    label: "Station ID",
    lines: ["DOINK TV", "broadcasting from somewhere nearby."],
    secondsPerLine: 3,
    fontSize: 60,
    placement: "middle",
    alignment: "center",
    tone: "classic",
    tintStrength: 52,
    wallpaperShapes: "starburst",
    wallpaperScheme: "broadcast",
    wallpaperSpacing: 72,
    useWallpaper: true,
    productionStyle: "promo-card",
    productionAccent: "hot",
    productionBadge: "LEGAL ID",
    productionKicker: "station identification",
    effects: ["noise", "scanlines", "flicker"],
    effectIntensity: 34,
  },
  ad: {
    label: "Ad break",
    lines: ["a brief word from whoever paid us in cash."],
    secondsPerLine: 5,
    fontSize: 44,
    placement: "bottom",
    alignment: "left",
    tone: "washed",
    tintStrength: 70,
    wallpaperShapes: "checkerboard",
    wallpaperScheme: "warning",
    wallpaperSpacing: 94,
    useWallpaper: true,
    productionStyle: "split-card",
    productionAccent: "hot",
    productionBadge: "AD BREAK",
    productionKicker: "paid for in weird favors",
    effects: ["vhs", "dvd", "scanlines"],
    effectIntensity: 42,
  },
  next: {
    label: "Next up",
    lines: ["next up", "something else entirely."],
    secondsPerLine: 3,
    fontSize: 52,
    placement: "bottom",
    alignment: "left",
    tone: "caption",
    tintStrength: 60,
    wallpaperShapes: "stripes",
    wallpaperScheme: "miami",
    wallpaperSpacing: 78,
    useWallpaper: true,
    productionStyle: "schedule-card",
    productionAccent: "cool",
    productionBadge: "NEXT",
    productionKicker: "coming up",
    effects: ["chromatic", "scanlines"],
    effectIntensity: 30,
  },
  music: {
    label: "Music bump",
    lines: ["full song bump", "please enjoy the moving picture part."],
    secondsPerLine: 5,
    fontSize: 44,
    placement: "middle",
    alignment: "left",
    tone: "washed",
    tintStrength: 48,
    wallpaperShapes: "argyle",
    wallpaperScheme: "pool",
    wallpaperSpacing: 90,
    useWallpaper: true,
    productionStyle: "lower-third",
    productionAccent: "signal",
    productionBadge: "MUSIC",
    productionKicker: "full song bump",
    effects: ["flicker", "chromatic"],
    effectIntensity: 26,
  },
  emergency: {
    label: "Emergency nonsense",
    lines: ["technical difficulties", "remain unreasonable."],
    secondsPerLine: 2,
    fontSize: 58,
    placement: "middle",
    alignment: "center",
    tone: "classic",
    tintStrength: 84,
    wallpaperShapes: "stripes",
    wallpaperScheme: "warning",
    wallpaperSpacing: 58,
    useWallpaper: true,
    productionStyle: "promo-card",
    productionAccent: "hot",
    productionBadge: "SIGNAL",
    productionKicker: "technical interruption",
    effects: ["noise", "vhs", "dvd", "warp", "chromatic", "flicker", "scanlines"],
    effectIntensity: 78,
  },
  silent: {
    label: "Silent card",
    lines: ["please stand by."],
    secondsPerLine: 6,
    fontSize: 48,
    placement: "middle",
    alignment: "center",
    tone: "classic",
    tintStrength: 35,
    wallpaperShapes: "mixed",
    wallpaperScheme: "mono",
    wallpaperSpacing: 110,
    useWallpaper: false,
    productionStyle: "standard",
    productionAccent: "mono",
    productionBadge: "DOINKTV",
    productionKicker: "",
    effects: [],
    effectIntensity: 0,
    clearAudio: true,
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function selectedPlacement() {
  return document.querySelector("input[name='placement']:checked").value;
}

function selectedAlignment() {
  return document.querySelector("input[name='alignment']:checked").value;
}

function setRadioValue(name, value) {
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function secondsPerLine() {
  return clamp(Number(secondsPerLineInput.value) || 5, 1, 12);
}

function textLineValues() {
  const lines = [...textLines.querySelectorAll(".line-input")]
    .map((input) => input.value.trim())
    .filter(Boolean);
  return lines.length ? lines : [" "];
}

function durationSeconds() {
  return textLineValues().length * secondsPerLine();
}

function activePresetLabel() {
  return bumpPresets[activePresetName]?.label || "Custom bump";
}

function canvasLabel() {
  return { landscape: "16:9", square: "1:1", vertical: "9:16" }[formatInput.value] || "16:9";
}

function audioLabel() {
  if (songInput.files[0]) return songInput.files[0].name.replace(/\.[^/.]+$/, "");
  if (selectedServerAudio?.name) return selectedServerAudio.name;
  return "Audio off";
}

function backgroundLabel() {
  if (imageInput.files[0]) return imageInput.files[0].name.replace(/\.[^/.]+$/, "");
  if (selectedServerBackground?.name || selectedServerBackground?.fileName) return selectedServerBackground.name || selectedServerBackground.fileName;
  return state.usingWallpaper ? "Wallpaper" : "Fallback";
}

function updateWorkspaceSummary() {
  const lines = textLineValues();
  const duration = durationSeconds();
  const effects = selectedEffects();
  const audio = audioLabel();
  const background = backgroundLabel();
  const durationText = `${duration.toFixed(1)}s`;
  if (bumpSummary) bumpSummary.textContent = `${durationText} / ${lines.length} line${lines.length === 1 ? "" : "s"} / ${audio}`;
  if (summaryPreset) summaryPreset.textContent = activePresetLabel();
  if (summaryMedia) summaryMedia.textContent = `${audio} + ${background}`;
  if (summaryEffects) summaryEffects.textContent = effects.length ? `${effects.length} FX / ${effectIntensity.value}%` : "Clean";
  if (previewSummary) previewSummary.textContent = `${activePresetLabel()} / ${lines[0] || "blank card"}`;
  if (previewDuration) previewDuration.textContent = durationText;
  if (previewCanvas) previewCanvas.textContent = canvasLabel();
  if (previewAudioBadge) previewAudioBadge.textContent = audio;
}

function activeText(time) {
  const lines = textLineValues();
  const index = Math.min(lines.length - 1, Math.floor(time / secondsPerLine()));
  return lines[index] || " ";
}

function formatTimecode(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remaining = String(total % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function updateAudioStartReadout() {
  const current = Number(audioStart.value) || 0;
  const max = Number(audioStart.max) || 0;
  audioStartValue.textContent = max > 0 ? `${formatTimecode(current)} / ${formatTimecode(max)}` : "0:00";
}

function updateAdaptiveControls() {
  audioStartField?.classList.toggle("is-hidden", audioStart.disabled);
  effectIntensityField?.classList.toggle("is-hidden", selectedEffects().length === 0);
}

function stopPreviewAudio() {
  state.previewAudioEnabled = false;
  if (previewAudio) {
    previewAudio.pause();
  }
}

function resetAudioStart() {
  stopPreviewAudio();
  audioStart.value = "0";
  audioStart.max = "0";
  audioStart.disabled = true;
  updateAudioStartReadout();
  updateAdaptiveControls();
}

function clearAudioProbeUrl() {
  if (audioProbeUrl && audioProbeUrl.startsWith("blob:")) URL.revokeObjectURL(audioProbeUrl);
  audioProbeUrl = "";
}

function configureAudioStart(file) {
  stopPreviewAudio();
  clearAudioProbeUrl();
  resetAudioStart();
  if (!file) return;

  audioProbeUrl = URL.createObjectURL(file);
  previewAudio = new Audio(audioProbeUrl);
  previewAudio.loop = true;
  previewAudio.volume = 0.82;
  const probe = new Audio();
  probe.preload = "metadata";
  probe.src = audioProbeUrl;
  probe.onloadedmetadata = () => {
    const max = Math.max(0, probe.duration || 0);
    audioStart.max = String(max.toFixed(1));
    audioStart.disabled = max === 0;
    updateAudioStartReadout();
    updateAdaptiveControls();
  };
  probe.onerror = resetAudioStart;
}

function configureServerAudio(asset) {
  stopPreviewAudio();
  clearAudioProbeUrl();
  resetAudioStart();
  selectedServerAudio = asset || null;
  if (!asset?.path) return;

  audioProbeUrl = asset.path;
  previewAudio = new Audio(audioProbeUrl);
  previewAudio.loop = true;
  previewAudio.volume = 0.82;
  const max = Math.max(0, Number(asset.duration || 0));
  if (max > 0) {
    audioStart.max = String(max.toFixed(1));
    audioStart.disabled = false;
    updateAudioStartReadout();
    updateAdaptiveControls();
  } else {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = audioProbeUrl;
    probe.onloadedmetadata = () => {
      const duration = Math.max(0, probe.duration || 0);
      audioStart.max = String(duration.toFixed(1));
      audioStart.disabled = duration === 0;
      updateAudioStartReadout();
      updateAdaptiveControls();
    };
    probe.onerror = resetAudioStart;
  }
}

function synchsafeToInt(bytes) {
  return ((bytes[0] & 0x7f) << 21) | ((bytes[1] & 0x7f) << 14) | ((bytes[2] & 0x7f) << 7) | (bytes[3] & 0x7f);
}

function readUint32(bytes, synchsafe = false) {
  if (synchsafe) return synchsafeToInt(bytes);
  return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
}

function decodeUtf16(bytes, littleEndian) {
  const values = [];
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    const code = littleEndian ? bytes[index] | (bytes[index + 1] << 8) : (bytes[index] << 8) | bytes[index + 1];
    if (code === 0) break;
    values.push(code);
  }
  return String.fromCharCode(...values);
}

function decodeId3Text(bytes) {
  if (!bytes.length) return "";
  const encoding = bytes[0];
  const payload = bytes.slice(1);

  if (encoding === 0) return new TextDecoder("latin1").decode(payload).replace(/\0+$/g, "").trim();
  if (encoding === 3) return new TextDecoder("utf-8").decode(payload).replace(/\0+$/g, "").trim();
  if (encoding === 1) {
    if (payload[0] === 0xff && payload[1] === 0xfe) return decodeUtf16(payload.slice(2), true).trim();
    if (payload[0] === 0xfe && payload[1] === 0xff) return decodeUtf16(payload.slice(2), false).trim();
    return decodeUtf16(payload, false).trim();
  }
  if (encoding === 2) return decodeUtf16(payload, false).trim();

  return new TextDecoder("utf-8").decode(payload).replace(/\0+$/g, "").trim();
}

async function readAudioMetadata(file) {
  const headerBuffer = await file.slice(0, Math.min(file.size, 512 * 1024)).arrayBuffer();
  const bytes = new Uint8Array(headerBuffer);
  const tags = {};

  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return tags;

  const majorVersion = bytes[3];
  const tagSize = synchsafeToInt(bytes.slice(6, 10));
  let offset = 10;
  const end = Math.min(bytes.length, 10 + tagSize);

  while (offset + 10 <= end) {
    const frameId = new TextDecoder("latin1").decode(bytes.slice(offset, offset + 4));
    if (!/^[A-Z0-9]{4}$/.test(frameId)) break;
    const frameSize = readUint32(bytes.slice(offset + 4, offset + 8), majorVersion === 4);
    if (!frameSize) break;
    const frameStart = offset + 10;
    const frameEnd = Math.min(frameStart + frameSize, end);
    const frameData = bytes.slice(frameStart, frameEnd);

    if (frameId === "TPE1") tags.artist = decodeId3Text(frameData);
    if (frameId === "TIT2") tags.title = decodeId3Text(frameData);
    if (frameId === "TALB") tags.album = decodeId3Text(frameData);

    offset = frameEnd;
  }

  return tags;
}

async function autofillCreditFromAudio(file) {
  if (!file || (!creditWasAutoFilled && creditText.value.trim())) return;

  try {
    const metadata = await readAudioMetadata(file);
    const fallbackName = file.name.replace(/\.[^/.]+$/, "");
    const song = metadata.title || fallbackName;
    const artist = metadata.artist || "Unknown artist";
    const text = `${song}\n${artist}`;

    creditText.value = text;
    creditWasAutoFilled = true;
    restartPreview();
  } catch (error) {
    console.warn("Could not read audio metadata", error);
    creditText.value = `${file.name.replace(/\.[^/.]+$/, "")}\nUnknown artist`;
    creditWasAutoFilled = true;
    restartPreview();
  }
}

function autofillCreditFromServerAudio(asset) {
  if (!asset || (!creditWasAutoFilled && creditText.value.trim())) return;
  creditText.value = `${asset.name || "Server audio"}\n${asset.artist || "Doink Wizard"}`;
  creditWasAutoFilled = true;
  restartPreview();
}

function tintAlpha() {
  return clamp(Number(tintStrength.value) || 0, 0, 100) / 100;
}

function selectedEffects() {
  return effectToggles.filter((input) => input.checked).map((input) => input.value);
}

function effectAmount() {
  return clamp(Number(effectIntensity.value) || 0, 0, 100) / 100;
}

function wallpaperConfig() {
  return {
    shapes: wallpaperShapes.value,
    scheme: wallpaperScheme.value,
    spacing: Number(wallpaperSpacing.value),
    seed: wallpaperSeed,
  };
}

function doinkQueuePayload() {
  const payload = {
    title: "Manual bump",
    heading: "bump",
    lines: textLineValues(),
    duration: durationSeconds(),
    secondsPerLine: secondsPerLine(),
    fontSize: Number(fontSizeInput.value) || 58,
    placement: selectedPlacement(),
    alignment: selectedAlignment(),
    tone: toneInput.value,
    tintStrength: Number(tintStrength.value) || 0,
    creditText: creditText.value.trim(),
    creditPosition: creditPosition.value,
    creditFont: creditFont.value,
    creditSize: Number(creditSize.value) || 24,
    format: formatInput.value,
    wallpaper: wallpaperConfig(),
    productionStyle: productionStyle.value,
    productionAccent: productionAccent.value,
    productionBadge: productionBadge.value.trim(),
    productionKicker: productionKicker.value.trim(),
    effects: selectedEffects(),
    effectIntensity: Number(effectIntensity.value) || 0
  };
  if (selectedServerAudio?.path) {
    payload.audio = selectedServerAudio.path;
    payload.audioStart = Number(audioStart.value) || 0;
  }
  if (selectedServerBackground?.path) {
    payload.background = selectedServerBackground.path;
    payload.backgroundType = selectedServerBackground.type;
  }
  return payload;
}

function sendBumpToDoinkTV(position) {
  if (!window.parent || window.parent === window) {
    status.textContent = "Open inside DoinkTV to queue bumps.";
    return;
  }
  window.parent.postMessage(
    {
      type: "doinktv:queue-bump",
      position,
      bump: doinkQueuePayload()
    },
    window.location.origin
  );
  status.textContent = position === "next" ? "Sending bump to play next..." : "Sending bump to queue...";
}

function setCanvasFormat() {
  const format = formatInput.value;
  const sizes = {
    landscape: [1280, 720],
    square: [1080, 1080],
    vertical: [1080, 1920],
  };
  const [width, height] = sizes[format];
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function clearBackgroundMedia() {
  if (backgroundUrl && backgroundUrl.startsWith("blob:")) URL.revokeObjectURL(backgroundUrl);
  if (backgroundVideo) {
    backgroundVideo.pause();
    backgroundVideo.removeAttribute("src");
    backgroundVideo.load();
  }
  backgroundImage = null;
  backgroundVideo = null;
  backgroundUrl = "";
}

function loadImageBackground(file) {
  clearBackgroundMedia();
  backgroundImage = new Image();
  backgroundUrl = URL.createObjectURL(file);
  backgroundImage.src = backgroundUrl;
  backgroundImage.onload = drawFrame;
  backgroundImage.onerror = () => {
    backgroundImage = null;
    status.textContent = "That image could not be loaded.";
    drawFrame();
  };
}

function loadImageBackgroundUrl(asset) {
  clearBackgroundMedia();
  selectedServerBackground = asset || null;
  if (!asset?.path) return;
  state.usingWallpaper = false;
  backgroundImage = new Image();
  backgroundImage.crossOrigin = "anonymous";
  backgroundUrl = asset.path;
  backgroundImage.src = backgroundUrl;
  backgroundImage.onload = drawFrame;
  backgroundImage.onerror = () => {
    backgroundImage = null;
    selectedServerBackground = null;
    status.textContent = "That server image could not be loaded.";
    drawFrame();
  };
  updateWorkspaceSummary();
}

function loadVideoBackground(file) {
  clearBackgroundMedia();
  backgroundVideo = document.createElement("video");
  backgroundUrl = URL.createObjectURL(file);
  backgroundVideo.src = backgroundUrl;
  backgroundVideo.muted = true;
  backgroundVideo.loop = true;
  backgroundVideo.playsInline = true;
  backgroundVideo.preload = "auto";
  backgroundVideo.onloadeddata = () => {
    backgroundVideo.play().catch(() => {});
    drawFrame();
  };
  backgroundVideo.onerror = () => {
    backgroundVideo = null;
    status.textContent = "That video could not be loaded.";
    drawFrame();
  };
  backgroundVideo.load();
}

function loadVideoBackgroundUrl(asset) {
  clearBackgroundMedia();
  selectedServerBackground = asset || null;
  if (!asset?.path) return;
  state.usingWallpaper = false;
  backgroundVideo = document.createElement("video");
  backgroundUrl = asset.path;
  backgroundVideo.src = backgroundUrl;
  backgroundVideo.crossOrigin = "anonymous";
  backgroundVideo.muted = true;
  backgroundVideo.loop = true;
  backgroundVideo.playsInline = true;
  backgroundVideo.preload = "auto";
  backgroundVideo.onloadeddata = () => {
    backgroundVideo.play().catch(() => {});
    drawFrame();
  };
  backgroundVideo.onerror = () => {
    backgroundVideo = null;
    selectedServerBackground = null;
    status.textContent = "That server video could not be loaded.";
    drawFrame();
  };
  backgroundVideo.load();
  updateWorkspaceSummary();
}

function loadBackground(file) {
  state.usingWallpaper = false;
  selectedServerBackground = null;
  updateWorkspaceSummary();
  if (file.type.startsWith("video/")) {
    loadVideoBackground(file);
  } else {
    loadImageBackground(file);
  }
}

function loadServerBackground(asset) {
  if (!asset) return;
  if (asset.type === "video") {
    loadVideoBackgroundUrl(asset);
  } else {
    loadImageBackgroundUrl(asset);
  }
  status.textContent = `Using server background: ${asset.name || asset.fileName || "Untitled"}.`;
  updateWorkspaceSummary();
  restartPreview();
}

function seededUnit(seed, x, y, salt = 0) {
  const value = Math.sin(seed * 12.9898 + x * 78.233 + y * 37.719 + salt * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

function drawPolygon(target, x, y, radius, sides, rotation) {
  target.beginPath();
  for (let index = 0; index < sides; index += 1) {
    const angle = rotation + (Math.PI * 2 * index) / sides;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (index === 0) {
      target.moveTo(px, py);
    } else {
      target.lineTo(px, py);
    }
  }
  target.closePath();
}

function wallpaperPalette(name) {
  const palettes = {
    midnight: {
      bg: ["#02030a", "#07111f", "#220b33"],
      shape: ["#fff8d7", "#ffe15a", "#36c8ff", "#ff4f7b"],
    },
    pool: {
      bg: ["#00150f", "#013f35", "#06294f"],
      shape: ["#eafff8", "#42ffb0", "#ffdd4a", "#ff6f59"],
    },
    candy: {
      bg: ["#19001f", "#3a0066", "#001b54"],
      shape: ["#ff4fd8", "#00e5ff", "#fff35c", "#6dff8b"],
    },
    paper: {
      bg: ["#241a09", "#7a5b21", "#f2d778"],
      shape: ["#17100a", "#fff7d6", "#0f6f78", "#d12626"],
    },
    mono: {
      bg: ["#000000", "#121212", "#303030"],
      shape: ["#ffffff", "#d0d0d0", "#8c8c8c", "#f2f2f2"],
    },
    arcade: {
      bg: ["#090018", "#1b0045", "#00143f"],
      shape: ["#ff2bd6", "#00ffea", "#faff00", "#ff6b00"],
    },
    warning: {
      bg: ["#080600", "#1f1600", "#453000"],
      shape: ["#ffd400", "#111111", "#ff5a00", "#fff5b5"],
    },
    citrus: {
      bg: ["#102000", "#2f7d00", "#f7db00"],
      shape: ["#ffffff", "#ff4d00", "#00e676", "#111111"],
    },
    broadcast: {
      bg: ["#050505", "#1c1c1c", "#050505"],
      shape: ["#ffffff", "#ff003c", "#00f0ff", "#ffe600"],
    },
    miami: {
      bg: ["#090022", "#24115e", "#ff3f81"],
      shape: ["#00f5ff", "#ffef5a", "#ff7ad9", "#ffffff"],
    },
    mint: {
      bg: ["#001f24", "#005d55", "#d8ff4f"],
      shape: ["#f8fff2", "#00ff94", "#ff2e63", "#173bff"],
    },
    ruby: {
      bg: ["#100006", "#3a0014", "#7f001f"],
      shape: ["#ffccd5", "#ff1744", "#ffb000", "#ffffff"],
    },
    blueprint: {
      bg: ["#00152e", "#003e7a", "#006dc1"],
      shape: ["#ffffff", "#7bd8ff", "#ffec8b", "#00152e"],
    },
  };
  return palettes[name] || palettes.midnight;
}

function drawWallpaperShape(target, shape, x, y, size, rotation) {
  if (["potleaf", "cats", "birds", "penguins", "dinosaurs"].includes(shape)) {
    drawNoveltyShape(target, shape, x, y, size, rotation);
    return;
  }

  if (shape === "circles") {
    target.beginPath();
    target.arc(x, y, size * 0.44, 0, Math.PI * 2);
    target.fill();
    return;
  }

  if (shape === "diamonds") {
    drawPolygon(target, x, y, size * 0.5, 4, rotation + Math.PI / 4);
    target.fill();
    return;
  }

  if (shape === "triangles") {
    drawPolygon(target, x, y, size * 0.56, 3, rotation - Math.PI / 2);
    target.fill();
    return;
  }

  if (shape === "lines") {
    target.save();
    target.translate(x, y);
    target.rotate(rotation);
    target.lineWidth = Math.max(2, size * 0.09);
    target.lineCap = "round";
    target.beginPath();
    target.moveTo(-size * 0.48, 0);
    target.lineTo(size * 0.48, 0);
    target.stroke();
    target.restore();
    return;
  }

  drawPolygon(target, x, y, size * 0.46, 6, rotation);
  target.fill();
}

function drawNoveltyShape(target, shape, x, y, size, rotation) {
  target.save();
  target.translate(x, y);
  target.rotate(rotation);
  target.scale(size / 72, size / 72);
  target.beginPath();

  if (shape === "potleaf") drawPotLeaf(target);
  if (shape === "cats") drawCat(target);
  if (shape === "birds") drawWeirdBird(target);
  if (shape === "penguins") drawPenguin(target);
  if (shape === "dinosaurs") drawDinosaur(target);

  target.fill();
  target.restore();
}

function drawPotLeaf(target) {
  const leaf = (angle, length, width) => {
    target.save();
    target.rotate(angle);
    target.moveTo(0, 0);
    target.bezierCurveTo(width, -length * 0.36, width * 0.45, -length * 0.88, 0, -length);
    target.bezierCurveTo(-width * 0.45, -length * 0.88, -width, -length * 0.36, 0, 0);
    target.restore();
  };
  [-0.82, -0.42, 0, 0.42, 0.82].forEach((angle, index) => leaf(angle, 58 - Math.abs(index - 2) * 8, 16));
  target.rect(-3, -2, 6, 34);
}

function drawCat(target) {
  target.moveTo(-30, 12);
  target.quadraticCurveTo(-24, -18, -6, -24);
  target.lineTo(-18, -42);
  target.lineTo(2, -30);
  target.lineTo(20, -42);
  target.lineTo(15, -22);
  target.quadraticCurveTo(34, -10, 28, 14);
  target.quadraticCurveTo(10, 28, -12, 24);
  target.quadraticCurveTo(-24, 20, -30, 12);
  target.moveTo(23, 12);
  target.quadraticCurveTo(45, 8, 44, -14);
  target.quadraticCurveTo(38, -4, 30, 0);
}

function drawWeirdBird(target) {
  target.moveTo(-34, 14);
  target.quadraticCurveTo(-22, -28, 14, -18);
  target.lineTo(40, -30);
  target.lineTo(30, -5);
  target.quadraticCurveTo(40, 18, 8, 28);
  target.quadraticCurveTo(-20, 34, -34, 14);
  target.moveTo(-8, 26);
  target.lineTo(-18, 44);
  target.lineTo(-4, 34);
  target.lineTo(6, 46);
  target.lineTo(8, 30);
}

function drawPenguin(target) {
  target.moveTo(0, -42);
  target.quadraticCurveTo(30, -36, 28, 12);
  target.quadraticCurveTo(22, 44, 0, 48);
  target.quadraticCurveTo(-24, 44, -28, 12);
  target.quadraticCurveTo(-30, -36, 0, -42);
  target.moveTo(-5, -34);
  target.lineTo(22, -24);
  target.lineTo(2, -18);
  target.moveTo(-18, 44);
  target.lineTo(-34, 54);
  target.lineTo(-4, 50);
  target.moveTo(18, 44);
  target.lineTo(34, 54);
  target.lineTo(4, 50);
}

function drawDinosaur(target) {
  target.moveTo(-38, 16);
  target.quadraticCurveTo(-20, -16, 18, -10);
  target.quadraticCurveTo(34, -30, 52, -20);
  target.lineTo(44, -6);
  target.quadraticCurveTo(55, 0, 40, 8);
  target.quadraticCurveTo(20, 34, -10, 24);
  target.lineTo(-16, 48);
  target.lineTo(-28, 48);
  target.lineTo(-24, 20);
  target.lineTo(-42, 36);
  target.lineTo(-52, 30);
  target.quadraticCurveTo(-44, 20, -38, 16);
  target.moveTo(4, 24);
  target.lineTo(12, 48);
  target.lineTo(0, 48);
  target.lineTo(-8, 26);
}

function drawStripePattern(target, width, height, time, config, palette) {
  const spacing = config.spacing;
  const diagonal = Math.hypot(width, height);
  target.save();
  target.translate(width / 2, height / 2);
  target.rotate(-Math.PI / 8);
  target.globalAlpha = 0.86;
  for (let x = -diagonal; x < diagonal; x += spacing) {
    const color = palette.shape[Math.abs(Math.floor(x / spacing)) % palette.shape.length];
    target.fillStyle = color;
    target.fillRect(x + (time * 18) % spacing, -diagonal, spacing * 0.48, diagonal * 2);
  }
  target.restore();
}

function drawPolkaPattern(target, width, height, time, config, palette) {
  const spacing = config.spacing;
  target.save();
  target.globalCompositeOperation = "screen";
  for (let y = -spacing; y < height + spacing; y += spacing) {
    for (let x = -spacing; x < width + spacing; x += spacing) {
      const cellX = Math.round(x / spacing);
      const cellY = Math.round(y / spacing);
      const radius = spacing * (0.22 + seededUnit(config.seed, cellX, cellY, 4) * 0.12);
      const offset = (cellY % 2) * spacing * 0.5;
      const pulse = Math.sin(time + cellX * 0.7 + cellY) * spacing * 0.025;
      target.globalAlpha = 0.72;
      target.fillStyle = palette.shape[Math.abs(cellX + cellY) % palette.shape.length];
      target.beginPath();
      target.arc(x + offset, y + pulse, radius, 0, Math.PI * 2);
      target.fill();
    }
  }
  target.restore();
}

function drawPlaidPattern(target, width, height, time, config, palette, tartan = false) {
  const spacing = config.spacing;
  const bands = tartan
    ? [0.14, 0.24, 0.05, 0.42, 0.07]
    : [0.18, 0.34, 0.1];

  target.save();
  target.globalCompositeOperation = "screen";
  bands.forEach((band, index) => {
    const step = spacing * (index + 1.05);
    const size = Math.max(3, spacing * band);
    target.fillStyle = palette.shape[index % palette.shape.length];
    target.globalAlpha = tartan ? 0.48 : 0.36;
    for (let x = -step; x < width + step; x += step) {
      target.fillRect(x + (time * 4) % step, 0, size, height);
    }
    for (let y = -step; y < height + step; y += step) {
      target.fillRect(0, y - (time * 3) % step, width, size);
    }
  });
  target.restore();
}

function drawArgylePattern(target, width, height, time, config, palette) {
  const spacing = config.spacing;
  target.save();
  target.globalCompositeOperation = "screen";
  for (let y = -spacing; y < height + spacing * 2; y += spacing * 0.9) {
    for (let x = -spacing; x < width + spacing * 2; x += spacing) {
      const cellX = Math.round(x / spacing);
      const cellY = Math.round(y / spacing);
      const cx = x + (cellY % 2) * spacing * 0.5;
      const cy = y + Math.sin(time * 0.35 + cellX) * spacing * 0.04;
      target.globalAlpha = 0.58;
      target.fillStyle = palette.shape[Math.abs(cellX + cellY) % palette.shape.length];
      drawPolygon(target, cx, cy, spacing * 0.46, 4, Math.PI / 4);
      target.fill();
    }
  }

  target.globalAlpha = 0.52;
  target.strokeStyle = palette.shape[0];
  target.lineWidth = Math.max(1, spacing * 0.035);
  for (let x = -width; x < width * 2; x += spacing) {
    target.beginPath();
    target.moveTo(x, -spacing);
    target.lineTo(x + height, height + spacing);
    target.stroke();
    target.beginPath();
    target.moveTo(x, height + spacing);
    target.lineTo(x + height, -spacing);
    target.stroke();
  }
  target.restore();
}

function drawMondrianPattern(target, width, height, time, config, palette) {
  const spacing = config.spacing;
  const lineWidth = Math.max(7, spacing * 0.11);
  target.save();
  target.globalAlpha = 0.96;
  target.fillStyle = palette.bg[0];
  target.fillRect(0, 0, width, height);

  let y = 0;
  let row = 0;
  while (y < height) {
    const rowHeight = spacing * (0.8 + seededUnit(config.seed, row, 0, 1) * 1.5);
    let x = 0;
    let col = 0;
    while (x < width) {
      const colWidth = spacing * (0.8 + seededUnit(config.seed, col, row, 2) * 1.8);
      const colorRoll = seededUnit(config.seed, col, row, 3);
      target.fillStyle = colorRoll < 0.28 ? palette.shape[Math.floor(colorRoll * palette.shape.length * 3) % palette.shape.length] : "#f6f1df";
      target.fillRect(x, y, colWidth, rowHeight);
      x += colWidth;
      col += 1;
    }
    y += rowHeight;
    row += 1;
  }

  target.strokeStyle = "#090909";
  target.lineWidth = lineWidth;
  target.strokeRect(-lineWidth / 2, -lineWidth / 2, width + lineWidth, height + lineWidth);
  for (let x = spacing; x < width; x += spacing * (1.1 + seededUnit(config.seed, x, 0, 4))) {
    target.beginPath();
    target.moveTo(x + Math.sin(time * 0.2) * 2, 0);
    target.lineTo(x, height);
    target.stroke();
  }
  for (let yLine = spacing; yLine < height; yLine += spacing * (1.1 + seededUnit(config.seed, 0, yLine, 5))) {
    target.beginPath();
    target.moveTo(0, yLine);
    target.lineTo(width, yLine + Math.cos(time * 0.2) * 2);
    target.stroke();
  }
  target.restore();
}

function drawCheckerboardPattern(target, width, height, time, config, palette) {
  const spacing = config.spacing * 0.72;
  target.save();
  for (let y = 0; y < height + spacing; y += spacing) {
    for (let x = 0; x < width + spacing; x += spacing) {
      const index = (Math.floor(x / spacing) + Math.floor(y / spacing)) % 2;
      target.globalAlpha = 0.78;
      target.fillStyle = index ? palette.shape[0] : palette.shape[2 % palette.shape.length];
      target.fillRect(x + Math.sin(time * 0.25) * 3, y, spacing, spacing);
    }
  }
  target.restore();
}

function drawTerrazzoPattern(target, width, height, time, config, palette) {
  const spacing = config.spacing;
  target.save();
  target.globalCompositeOperation = "screen";
  for (let y = -spacing; y < height + spacing; y += spacing * 0.55) {
    for (let x = -spacing; x < width + spacing; x += spacing * 0.55) {
      const cellX = Math.round(x / spacing);
      const cellY = Math.round(y / spacing);
      if (seededUnit(config.seed, cellX, cellY, 1) < 0.34) continue;
      const sides = 3 + Math.floor(seededUnit(config.seed, cellX, cellY, 2) * 4);
      const size = spacing * (0.12 + seededUnit(config.seed, cellX, cellY, 3) * 0.18);
      target.globalAlpha = 0.62;
      target.fillStyle = palette.shape[Math.floor(seededUnit(config.seed, cellX, cellY, 4) * palette.shape.length)];
      drawPolygon(target, x, y + Math.sin(time * 0.4 + cellX) * 2, size, sides, seededUnit(config.seed, cellX, cellY, 5) * Math.PI);
      target.fill();
    }
  }
  target.restore();
}

function drawStarburstPattern(target, width, height, time, config, palette) {
  const rays = Math.max(18, Math.floor(360 / Math.max(8, config.spacing * 0.22)));
  const radius = Math.hypot(width, height);
  const cx = width * (0.5 + Math.sin(config.seed) * 0.08);
  const cy = height * (0.5 + Math.cos(config.seed) * 0.08);
  target.save();
  target.globalAlpha = 0.82;
  for (let index = 0; index < rays; index += 1) {
    const angle = (Math.PI * 2 * index) / rays + time * 0.02;
    target.fillStyle = palette.shape[index % palette.shape.length];
    target.beginPath();
    target.moveTo(cx, cy);
    target.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    target.lineTo(cx + Math.cos(angle + Math.PI / rays) * radius, cy + Math.sin(angle + Math.PI / rays) * radius);
    target.closePath();
    target.fill();
  }
  target.restore();
}

function drawMemphisPattern(target, width, height, time, config, palette) {
  drawPolkaPattern(target, width, height, time, config, palette);
  target.save();
  target.globalCompositeOperation = "screen";
  target.globalAlpha = 0.78;
  for (let y = -config.spacing; y < height + config.spacing; y += config.spacing * 1.25) {
    for (let x = -config.spacing; x < width + config.spacing; x += config.spacing * 1.25) {
      const cellX = Math.round(x / config.spacing);
      const cellY = Math.round(y / config.spacing);
      const shape = ["triangles", "lines", "diamonds"][Math.floor(seededUnit(config.seed, cellX, cellY, 9) * 3)];
      target.fillStyle = palette.shape[Math.floor(seededUnit(config.seed, cellX, cellY, 10) * palette.shape.length)];
      target.strokeStyle = target.fillStyle;
      drawWallpaperShape(target, shape, x, y, config.spacing * 0.5, seededUnit(config.seed, cellX, cellY, 11) * Math.PI);
    }
  }
  target.restore();
}

function drawFullCanvasPattern(target, width, height, time, config, palette) {
  if (config.shapes === "stripes") drawStripePattern(target, width, height, time, config, palette);
  if (config.shapes === "polka") drawPolkaPattern(target, width, height, time, config, palette);
  if (config.shapes === "plaid") drawPlaidPattern(target, width, height, time, config, palette);
  if (config.shapes === "tartan") drawPlaidPattern(target, width, height, time, config, palette, true);
  if (config.shapes === "argyle") drawArgylePattern(target, width, height, time, config, palette);
  if (config.shapes === "mondrian") drawMondrianPattern(target, width, height, time, config, palette);
  if (config.shapes === "checkerboard") drawCheckerboardPattern(target, width, height, time, config, palette);
  if (config.shapes === "terrazzo") drawTerrazzoPattern(target, width, height, time, config, palette);
  if (config.shapes === "memphis") drawMemphisPattern(target, width, height, time, config, palette);
  if (config.shapes === "starburst") drawStarburstPattern(target, width, height, time, config, palette);
}

function drawWallpaperBackground(target, width, height, time, config) {
  const palette = wallpaperPalette(config.scheme);
  const gradient = target.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.bg[0]);
  gradient.addColorStop(0.55, palette.bg[1]);
  gradient.addColorStop(1, palette.bg[2]);
  target.fillStyle = gradient;
  target.fillRect(0, 0, width, height);

  const fullPatternModes = ["stripes", "polka", "plaid", "tartan", "argyle", "mondrian", "checkerboard", "terrazzo", "memphis", "starburst"];
  if (fullPatternModes.includes(config.shapes)) {
    drawFullCanvasPattern(target, width, height, time, config, palette);
    return;
  }

  const spacing = config.spacing;
  const diagonal = Math.hypot(width, height);
  const parallax = time * spacing * 0.08;
  const startX = -spacing * 2;
  const startY = -spacing * 2;
  const endX = width + spacing * 2;
  const endY = height + spacing * 2;
  const noveltyShapes = ["potleaf", "cats", "birds", "penguins", "dinosaurs"];
  const shapeChoices = config.shapes === "mixed"
    ? ["circles", "diamonds", "triangles", "lines"]
    : config.shapes === "novelty"
      ? noveltyShapes
      : [config.shapes];

  target.save();
  target.globalCompositeOperation = "screen";
  for (let y = startY; y < endY; y += spacing) {
    for (let x = startX; x < endX; x += spacing) {
      const cellX = Math.round(x / spacing);
      const cellY = Math.round(y / spacing);
      const jitterX = (seededUnit(config.seed, cellX, cellY, 1) - 0.5) * spacing * 0.46;
      const jitterY = (seededUnit(config.seed, cellX, cellY, 2) - 0.5) * spacing * 0.46;
      const pulse = Math.sin(time * 0.9 + seededUnit(config.seed, cellX, cellY, 3) * Math.PI * 2) * spacing * 0.05;
      const drawX = x + jitterX + Math.sin(time * 0.18 + cellY) * spacing * 0.08;
      const drawY = y + jitterY + parallax;
      const wrappedY = ((drawY + spacing * 2) % (height + spacing * 4)) - spacing * 2;
      const size = spacing * (0.34 + seededUnit(config.seed, cellX, cellY, 4) * 0.42) + pulse;
      const colorIndex = Math.floor(seededUnit(config.seed, cellX, cellY, 5) * palette.shape.length);
      const alpha = 0.3 + seededUnit(config.seed, cellX, cellY, 6) * 0.42;
      const shapeIndex = Math.floor(seededUnit(config.seed, cellX, cellY, 7) * shapeChoices.length);
      const rotation = seededUnit(config.seed, cellX, cellY, 8) * Math.PI * 2 + time * 0.08;

      target.fillStyle = palette.shape[colorIndex];
      target.strokeStyle = palette.shape[colorIndex];
      target.globalAlpha = alpha;
      drawWallpaperShape(target, shapeChoices[shapeIndex], drawX, wrappedY, size, rotation);
    }
  }
  target.restore();

  target.save();
  target.globalAlpha = 0.08;
  target.strokeStyle = palette.shape[1];
  target.lineWidth = Math.max(1, diagonal / 900);
  const stripeGap = spacing * 1.35;
  for (let offset = -diagonal; offset < diagonal; offset += stripeGap) {
    target.beginPath();
    target.moveTo(offset + time * 10, 0);
    target.lineTo(offset + width * 0.4 + time * 10, height);
    target.stroke();
  }
  target.restore();
}

function renderWallpaperPreview() {
  drawWallpaperBackground(wallpaperPreviewCtx, wallpaperPreview.width, wallpaperPreview.height, 0.8, wallpaperConfig());
}

function drawCoverMedia(media, x, y, width, height) {
  const sourceWidth = media.videoWidth || media.naturalWidth;
  const sourceHeight = media.videoHeight || media.naturalHeight;
  if (!sourceWidth || !sourceHeight) return;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(media, drawX, drawY, drawWidth, drawHeight);
}

function drawFallbackBackground(width, height, time) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#080808");
  gradient.addColorStop(0.52, "#15191f");
  gradient.addColorStop(1, "#2a2316");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  const gap = Math.max(38, width / 24);
  const offset = (time * 18) % gap;
  for (let x = -gap; x < width + gap; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x - width * 0.2 + offset, height);
    ctx.stroke();
  }
  ctx.restore();
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const rawLines = text.split(/\n/);
  const lines = [];

  function pushWord(line, word) {
    if (ctx.measureText(word).width <= maxWidth) {
      return word;
    }

    let chunk = "";
    for (const char of word) {
      const test = chunk + char;
      if (ctx.measureText(test).width > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk = test;
      }
    }
    return chunk;
  }

  rawLines.forEach((rawLine) => {
    const words = rawLine.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth || !line) {
        line = line ? test : pushWord(line, word);
      } else {
        lines.push(line);
        line = pushWord("", word);
      }
    });
    lines.push(line);
  });
  return lines.slice(0, 12);
}

function drawTextBlock(width, height, time) {
  const layout = productionStyle.value;
  const text = ["schedule-card", "split-card"].includes(layout) ? textLineValues().join("\n") : activeText(time);
  const fontSize = Number(fontSizeInput.value);
  const lineHeight = fontSize * 1.28;
  const pad = Math.round(Math.min(width, height) * 0.075);
  const font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
  const textWidth = Math.min(width - pad * 2, Math.round(width * 0.62), fontSize * 16);
  const lines = wrapText(text, textWidth, font);
  const blockHeight = lines.length * lineHeight;
  const placement = selectedPlacement();
  const alignment = selectedAlignment();
  const tone = toneInput.value;
  const drift = Math.sin(time * 0.9) * 3;
  if (layout !== "standard") {
    drawProductionChrome(width, height, layout, fontSize);
  }
  const textXByAlignment = {
    left: pad,
    center: width / 2,
    right: width - pad,
  };
  const cardXByAlignment = {
    left: pad,
    center: width / 2 - textWidth / 2,
    right: width - pad - textWidth,
  };
  const textX = textXByAlignment[alignment];
  const cardX = cardXByAlignment[alignment];

  let y = height / 2 - blockHeight / 2;
  if (layout === "lower-third") y = height - pad - blockHeight - fontSize * 1.6;
  else if (layout === "promo-card") y = Math.max(pad * 1.9, height / 2 - blockHeight / 2);
  else if (layout === "schedule-card") y = Math.max(pad * 2.25, height / 2 - blockHeight / 2);
  else if (placement === "top") y = pad;
  else if (placement === "bottom") y = height - pad - blockHeight;

  if (tone === "classic") {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${tintAlpha()})`;
    ctx.fillRect(-2, -2, width + 4, height + 4);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(0, drift);

  if (tone === "caption" && layout === "standard") {
    const cardPad = fontSize * 0.72;
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(cardX - cardPad, y - cardPad * 0.7, textWidth + cardPad * 2, blockHeight + cardPad * 1.25);
  }

  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f4f0e8";
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = tone === "classic" ? 0 : 14;
  ctx.shadowOffsetY = tone === "classic" ? 0 : 3;

  lines.forEach((line, index) => {
    ctx.fillText(line, textX, y + index * lineHeight);
  });

  ctx.restore();
}

function productionColor(width) {
  const palette = wallpaperPalette(wallpaperScheme.value);
  const accent = productionAccent.value;
  if (accent === "hot") return "#ff4f7b";
  if (accent === "cool") return "#36c8ff";
  if (accent === "signal") return "#ffe066";
  if (accent === "mono") return "#f4f0e8";
  return cssColorFromHex(palette.shape[Math.abs(wallpaperSeed) % palette.shape.length] || "0xffe066");
}

function cssColorFromHex(value) {
  return `#${String(value).replace(/^0x/i, "").padStart(6, "0").slice(-6)}`;
}

function drawProductionChrome(width, height, layout, fontSize) {
  const pad = Math.round(Math.min(width, height) * 0.045);
  const accent = productionColor(width);
  const badge = productionBadge.value.trim() || "DOINKTV";
  const kicker = productionKicker.value.trim();
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
  if (layout === "lower-third") {
    ctx.fillRect(pad, height - pad - fontSize * 3.4, width - pad * 2, fontSize * 2.9);
  } else if (layout === "split-card") {
    ctx.fillRect(pad, pad * 1.7, width * 0.58, height - pad * 3.2);
    ctx.fillStyle = "rgba(244, 240, 232, 0.12)";
    ctx.fillRect(width * 0.66, pad * 1.7, width * 0.26, height - pad * 3.2);
  } else {
    ctx.fillRect(pad, pad * 1.65, width * 0.68, height - pad * 3.15);
  }
  ctx.fillStyle = accent;
  ctx.fillRect(pad, pad * 1.65, Math.max(7, fontSize * 0.15), height - pad * 3.15);
  ctx.fillRect(pad, pad, Math.min(width * 0.3, badge.length * fontSize * 0.42 + pad * 1.4), fontSize * 0.9);
  ctx.fillStyle = "#090b10";
  ctx.font = `800 ${Math.max(12, fontSize * 0.32)}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(badge.toUpperCase(), pad * 1.4, pad + fontSize * 0.45);
  if (kicker) {
    ctx.fillStyle = "rgba(244, 240, 232, 0.86)";
    ctx.font = `700 ${Math.max(12, fontSize * 0.3)}px Arial, Helvetica, sans-serif`;
    ctx.fillText(kicker.toUpperCase(), pad, height - pad * 1.15);
  }
  ctx.restore();
}

function drawCreditBlock(width, height) {
  const text = creditText.value.trim();
  if (!text) return;

  const size = Number(creditSize.value);
  const pad = Math.round(Math.min(width, height) * 0.04);
  const maxWidth = Math.min(width * 0.42, size * 28);
  const lines = wrapText(text, maxWidth, `700 ${size}px ${creditFont.value}`);
  const lineHeight = size * 1.26;
  const blockHeight = lines.length * lineHeight;
  const position = creditPosition.value;
  const [vertical, horizontal = "center"] = position.split("-");

  const align = horizontal === "left" ? "left" : horizontal === "right" ? "right" : "center";
  const xByAlign = {
    left: pad,
    center: width / 2,
    right: width - pad,
  };
  const yByPosition = {
    top: pad,
    center: height / 2 - blockHeight / 2,
    bottom: height - pad - blockHeight,
  };

  ctx.save();
  ctx.font = `700 ${size}px ${creditFont.value}`;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244, 240, 232, 0.88)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = Math.max(6, size * 0.45);
  ctx.shadowOffsetY = Math.max(1, size * 0.12);

  lines.forEach((line, index) => {
    ctx.fillText(line, xByAlign[align], yByPosition[vertical] + index * lineHeight);
  });

  ctx.restore();
}

function syncEffectCanvas(width, height) {
  if (effectCanvas.width !== width || effectCanvas.height !== height) {
    effectCanvas.width = width;
    effectCanvas.height = height;
  }
}

function copyCanvasToEffect(width, height) {
  syncEffectCanvas(width, height);
  effectCtx.clearRect(0, 0, width, height);
  effectCtx.drawImage(canvas, 0, 0);
}

function applyWarpEffect(width, height, time, amount) {
  copyCanvasToEffect(width, height);
  ctx.clearRect(0, 0, width, height);
  const sliceWidth = Math.max(8, Math.round(width / 90));
  const maxOffset = amount * width * 0.018;
  for (let x = 0; x < width; x += sliceWidth) {
    const offset = Math.sin(time * 3.2 + x * 0.026) * maxOffset;
    ctx.drawImage(effectCanvas, x, 0, sliceWidth, height, x + offset, 0, sliceWidth + 1, height);
  }
}

function applyDvdSkipEffect(width, height, time, amount) {
  copyCanvasToEffect(width, height);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(effectCanvas, 0, 0);
  const jump = Math.sin(time * 12.5) > 0.72 ? 1 : 0;
  if (!jump) return;
  const slices = 3 + Math.round(amount * 5);
  for (let index = 0; index < slices; index += 1) {
    const y = Math.floor(seededUnit(7, index, Math.floor(time * 8), 2) * height);
    const h = Math.max(8, Math.floor(height * (0.018 + amount * 0.025)));
    const offset = (seededUnit(11, index, Math.floor(time * 10), 3) - 0.5) * width * amount * 0.18;
    ctx.drawImage(effectCanvas, 0, y, width, h, offset, y, width, h);
  }
}

function applyFisheyeEffect(width, height, amount) {
  copyCanvasToEffect(width, height);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(effectCanvas, 0, 0);
  const tile = Math.max(18, Math.round(Math.min(width, height) / 36));
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.52;
  for (let y = Math.max(0, cy - radius); y < Math.min(height, cy + radius); y += tile) {
    for (let x = Math.max(0, cx - radius); x < Math.min(width, cx + radius); x += tile) {
      const dx = x + tile / 2 - cx;
      const dy = y + tile / 2 - cy;
      const distance = Math.hypot(dx, dy) / radius;
      if (distance > 1) continue;
      const scale = 1 + amount * 0.55 * (1 - distance) * (1 - distance);
      const drawSize = tile * scale;
      ctx.drawImage(effectCanvas, x, y, tile, tile, x + tile / 2 - drawSize / 2, y + tile / 2 - drawSize / 2, drawSize, drawSize);
    }
  }

  const lens = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius);
  lens.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  lens.addColorStop(0.68, "rgba(255, 255, 255, 0)");
  lens.addColorStop(1, `rgba(0, 0, 0, ${0.2 * amount})`);
  ctx.fillStyle = lens;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawNoiseOverlay(width, height, time, amount) {
  const density = Math.floor(width * height * (0.00035 + amount * 0.0015));
  ctx.save();
  ctx.globalAlpha = 0.22 + amount * 0.38;
  for (let index = 0; index < density; index += 1) {
    const x = seededUnit(97, index, Math.floor(time * 30), 1) * width;
    const y = seededUnit(113, index, Math.floor(time * 30), 2) * height;
    const light = seededUnit(131, index, Math.floor(time * 30), 3) > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgb(${light}, ${light}, ${light})`;
    ctx.fillRect(x, y, 1 + amount * 2, 1 + amount * 2);
  }
  ctx.restore();
}

function drawVhsOverlay(width, height, time, amount) {
  ctx.save();
  ctx.globalAlpha = 0.18 + amount * 0.22;
  for (let y = 0; y < height; y += Math.max(3, Math.round(8 - amount * 4))) {
    const roll = seededUnit(211, Math.floor(y), Math.floor(time * 18), 4);
    if (roll < 0.55) continue;
    ctx.fillStyle = roll > 0.86 ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.9)";
    ctx.fillRect(0, y, width, 1 + amount * 2);
  }
  const tearY = (time * height * 0.45) % height;
  ctx.fillStyle = `rgba(255,255,255,${0.12 + amount * 0.12})`;
  ctx.fillRect(0, tearY, width, 2 + amount * 7);
  ctx.restore();
}

function drawScanlines(width, height, amount) {
  ctx.save();
  ctx.globalAlpha = 0.14 + amount * 0.22;
  ctx.fillStyle = "#000";
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1);
  }
  ctx.restore();
}

function drawChromaticBleed(width, height, time, amount) {
  copyCanvasToEffect(width, height);
  const offset = 2 + amount * 7 + Math.sin(time * 4) * amount * 2;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.18 + amount * 0.22;
  ctx.drawImage(effectCanvas, offset, 0);
  ctx.fillStyle = "rgba(255,0,80,0.25)";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(effectCanvas, -offset, 0);
  ctx.fillStyle = "rgba(0,190,255,0.2)";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawFlicker(width, height, time, amount) {
  const flicker = (Math.sin(time * 18) + seededUnit(41, Math.floor(time * 24), 0, 1) - 0.5) * amount;
  ctx.save();
  ctx.fillStyle = flicker > 0 ? `rgba(255,255,255,${flicker * 0.12})` : `rgba(0,0,0,${Math.abs(flicker) * 0.18})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawLetterbox(width, height, amount) {
  const bar = height * (0.055 + amount * 0.07);
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, bar);
  ctx.fillRect(0, height - bar, width, bar);
  ctx.restore();
}

function applySelectedEffects(width, height, time) {
  const effects = selectedEffects();
  if (!effects.length) return;
  const amount = effectAmount();

  if (effects.includes("warp")) applyWarpEffect(width, height, time, amount);
  if (effects.includes("dvd")) applyDvdSkipEffect(width, height, time, amount);
  if (effects.includes("fisheye")) applyFisheyeEffect(width, height, amount);
  if (effects.includes("chromatic")) drawChromaticBleed(width, height, time, amount);
  if (effects.includes("flicker")) drawFlicker(width, height, time, amount);
  if (effects.includes("vhs")) drawVhsOverlay(width, height, time, amount);
  if (effects.includes("scanlines")) drawScanlines(width, height, amount);
  if (effects.includes("noise")) drawNoiseOverlay(width, height, time, amount);
  if (effects.includes("letterbox")) drawLetterbox(width, height, amount);
}

function drawFrame(time = 0) {
  setCanvasFormat();
  const width = canvas.width;
  const height = canvas.height;
  const tone = toneInput.value;

  ctx.clearRect(0, 0, width, height);
  if (state.usingWallpaper) {
    drawWallpaperBackground(ctx, width, height, time, wallpaperConfig());
  } else if (backgroundImage && backgroundImage.complete && backgroundImage.naturalWidth) {
    drawCoverMedia(backgroundImage, 0, 0, width, height);
  } else if (backgroundVideo && backgroundVideo.readyState >= 2) {
    drawCoverMedia(backgroundVideo, 0, 0, width, height);
  } else {
    drawFallbackBackground(width, height, time);
  }

  if (tone === "washed") {
    ctx.fillStyle = "rgba(244, 240, 232, 0.34)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
    ctx.fillRect(0, 0, width, height);
  }

  const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.72);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  drawTextBlock(width, height, time);
  drawCreditBlock(width, height);
  applySelectedEffects(width, height, time);
}

function previewLoop(now) {
  if (!state.previewing) return;
  const duration = durationSeconds();
  const elapsed = ((now - previewStart) / 1000) % duration;
  drawFrame(elapsed);
  syncPreviewAudio(elapsed);
  timeLabel.textContent = `${elapsed.toFixed(1)}s`;
  durationLabel.textContent = `${duration.toFixed(1)}s`;
  progress.style.width = `${(elapsed / duration) * 100}%`;
  animationId = requestAnimationFrame(previewLoop);
}

function syncPreviewAudio(elapsed, force = false) {
  if (!state.previewAudioEnabled || !previewAudio || !Number.isFinite(previewAudio.duration) || previewAudio.duration === 0) return;

  const start = Number(audioStart.value) || 0;
  let target = start + elapsed;
  while (target >= previewAudio.duration) target -= previewAudio.duration;

  if (force || Math.abs(previewAudio.currentTime - target) > 0.35) {
    previewAudio.currentTime = target;
  }
}

function restartPreview() {
  updateWorkspaceSummary();
  stopPreviewAudio();
  stage.classList.remove("hide");
  outputVideo.classList.add("hide");
  state.previewing = true;
  previewStart = performance.now();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(previewLoop);
}

async function startPreviewWithAudio() {
  restartPreview();
  if (!previewAudio || audioStart.disabled) return;

  state.previewAudioEnabled = true;
  syncPreviewAudio(0, true);
  try {
    await previewAudio.play();
    status.textContent = "Previewing with audio.";
  } catch (error) {
    state.previewAudioEnabled = false;
    status.textContent = "Preview started without audio.";
  }
}

function keepOutputPreviewLive() {
  stage.classList.add("hide");
  outputVideo.classList.remove("hide");
  state.previewing = true;
  previewStart = performance.now();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(previewLoop);
}

function selectedAudioSourceUrl() {
  if (songInput.files[0]) return URL.createObjectURL(songInput.files[0]);
  return selectedServerAudio?.path || "";
}

function seekVideo(video, time) {
  return new Promise((resolve) => {
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) {
      resolve();
      return;
    }

    const target = Math.min(time, Math.max(0, video.duration - 0.05));
    const finish = () => {
      video.removeEventListener("seeked", finish);
      resolve();
    };
    video.addEventListener("seeked", finish, { once: true });
    video.currentTime = target;
    setTimeout(finish, 700);
  });
}

function bestMimeType() {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function renderVideo() {
  if (!window.MediaRecorder || !canvas.captureStream) {
    status.textContent = "This browser cannot export video from canvas.";
    return;
  }

  stopPreviewAudio();
  state.rendering = true;
  state.previewing = false;
  renderBtn.disabled = true;
  previewBtn.disabled = true;
  downloadLink.setAttribute("aria-disabled", "true");
  stage.classList.remove("hide");
  outputVideo.classList.add("hide");
  status.textContent = "Generating...";
  cancelAnimationFrame(animationId);

  const duration = durationSeconds();
  const fps = 30;
  const stream = canvas.captureStream(fps);
  let audioContext = null;
  let audioElement = null;
  let audioUrl = "";
  let generatedVideo = false;

  try {
    const selectedAudioUrl = selectedAudioSourceUrl();
    if (selectedAudioUrl) {
      audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      audioElement = new Audio(selectedAudioUrl);
      audioElement.crossOrigin = "anonymous";
      audioElement.loop = true;
      audioElement.volume = 0.82;
      audioUrl = audioElement.src;
      audioElement.currentTime = Math.min(Number(audioStart.value) || 0, Number(audioStart.max) || 0);
      const source = audioContext.createMediaElementSource(audioElement);
      const gain = audioContext.createGain();
      gain.gain.value = 0.9;
      source.connect(gain).connect(destination);
      destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
      await audioContext.resume();
    }

    const mimeType = bestMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };

    const done = new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    if (backgroundVideo) {
      await seekVideo(backgroundVideo, 0);
      await backgroundVideo.play().catch(() => {});
    }

    drawFrame(0);
    timeLabel.textContent = "0.0s";
    durationLabel.textContent = `${duration.toFixed(1)}s`;
    progress.style.width = "0%";

    recorder.start();
    if (audioElement) await audioElement.play();

    const started = performance.now();
    await new Promise((resolve) => {
      function frame(now) {
        const elapsed = Math.min((now - started) / 1000, duration);
        drawFrame(elapsed);
        timeLabel.textContent = `${elapsed.toFixed(1)}s`;
        durationLabel.textContent = `${duration.toFixed(1)}s`;
        progress.style.width = `${(elapsed / duration) * 100}%`;
        if (elapsed < duration) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });

    recorder.stop();
    await done;
    stream.getTracks().forEach((track) => track.stop());
    if (audioElement) {
      audioElement.pause();
      if (audioUrl.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    }
    if (audioContext) await audioContext.close();

    const blob = new Blob(chunks, { type: mimeType || "video/webm" });
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = URL.createObjectURL(blob);
    outputVideo.src = outputUrl;
    stage.classList.add("hide");
    outputVideo.classList.remove("hide");
    downloadLink.href = outputUrl;
    downloadLink.download = `bump-${Date.now()}.webm`;
    downloadLink.removeAttribute("aria-disabled");
    status.textContent = "Video ready.";
    generatedVideo = true;
  } catch (error) {
    console.error(error);
    status.textContent = "Export failed. Try a shorter clip or different audio file.";
    if (audioElement) audioElement.pause();
    if (audioUrl?.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    if (audioContext && audioContext.state !== "closed") await audioContext.close();
    stream.getTracks().forEach((track) => track.stop());
  } finally {
    state.rendering = false;
    renderBtn.disabled = false;
    previewBtn.disabled = false;
    if (generatedVideo) {
      keepOutputPreviewLive();
    } else {
      restartPreview();
    }
  }
}

function updateLineRemoveButtons() {
  const rows = [...textLines.querySelectorAll(".text-line")];
  rows.forEach((row) => {
    const button = row.querySelector(".remove-line");
    button.disabled = rows.length === 1;
  });
}

function bindTextLine(row) {
  const input = row.querySelector(".line-input");
  const removeButton = row.querySelector(".remove-line");

  input.addEventListener("input", () => {
    activePresetName = "custom";
    restartPreview();
  });
  removeButton.addEventListener("click", () => {
    const rows = [...textLines.querySelectorAll(".text-line")];
    if (rows.length === 1) {
      input.value = "";
    } else {
      row.remove();
    }
    updateLineLabels();
    restartPreview();
  });
}

function updateLineLabels() {
  [...textLines.querySelectorAll(".text-line")].forEach((row, index) => {
    row.querySelector(".line-input").setAttribute("aria-label", `Text line ${index + 1}`);
  });
  updateLineRemoveButtons();
}

function addTextLine(value = "", options = {}) {
  const { focus = true, restart = true } = options;
  const row = document.createElement("div");
  row.className = "text-line";
  row.innerHTML = `
    <input class="line-input" type="text" value="" aria-label="Text line">
    <button class="icon-button remove-line" type="button" aria-label="Remove line" title="Remove line">x</button>
  `;
  row.querySelector(".line-input").value = value;
  textLines.append(row);
  bindTextLine(row);
  updateLineLabels();
  if (focus) row.querySelector(".line-input").focus();
  if (restart) {
    activePresetName = "custom";
    restartPreview();
  }
}

function setTextLineValues(lines) {
  textLines.innerHTML = "";
  const values = Array.isArray(lines) && lines.length ? lines : [""];
  values.forEach((line) => addTextLine(line, { focus: false, restart: false }));
  updateLineLabels();
}

function syncControlReadouts() {
  secondsPerLineValue.textContent = `${secondsPerLineInput.value}s`;
  fontSizeValue.textContent = fontSizeInput.value;
  tintStrengthValue.textContent = `${tintStrength.value}%`;
  effectIntensityValue.textContent = `${effectIntensity.value}%`;
  wallpaperSpacingValue.textContent = wallpaperSpacing.value;
  updateAudioStartReadout();
  updateAdaptiveControls();
  updateWorkspaceSummary();
}

function applyBumpPreset(name) {
  const preset = bumpPresets[name];
  if (!preset) return;
  activePresetName = name;

  presetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.bumpPreset === name);
  });

  setTextLineValues(preset.lines);
  secondsPerLineInput.value = String(preset.secondsPerLine);
  fontSizeInput.value = String(preset.fontSize);
  setRadioValue("placement", preset.placement);
  setRadioValue("alignment", preset.alignment);
  formatInput.value = preset.format || "landscape";
  toneInput.value = preset.tone;
  tintStrength.value = String(preset.tintStrength);
  productionStyle.value = preset.productionStyle || "standard";
  productionAccent.value = preset.productionAccent || "auto";
  productionBadge.value = preset.productionBadge || "DOINKTV";
  productionKicker.value = preset.productionKicker || "";
  wallpaperShapes.value = preset.wallpaperShapes;
  wallpaperScheme.value = preset.wallpaperScheme;
  wallpaperSpacing.value = String(preset.wallpaperSpacing);
  state.usingWallpaper = Boolean(preset.useWallpaper);
  effectToggles.forEach((toggle) => {
    toggle.checked = preset.effects.includes(toggle.value);
  });
  effectIntensity.value = String(preset.effectIntensity);
  if (preset.clearAudio) {
    selectedServerAudio = null;
    serverSongSelect.value = "";
    songInput.value = "";
    clearAudioProbeUrl();
    previewAudio = null;
    creditText.value = "";
    creditWasAutoFilled = true;
    resetAudioStart();
  }

  renderWallpaperPreview();
  syncControlReadouts();
  setCanvasFormat();
  restartPreview();
  status.textContent = `${preset.label} preset loaded.`;
  updateWorkspaceSummary();
}

function optionLabel(asset) {
  if (!asset) return "";
  const duration = Number(asset.duration || 0);
  return duration > 0 ? `${asset.name} (${formatTimecode(duration)})` : asset.name || asset.fileName || asset.path;
}

function populateAssetSelect(select, assets, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  assets.forEach((asset, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = optionLabel(asset);
    select.append(option);
  });
}

async function loadServerAssets() {
  try {
    if (summaryMedia) summaryMedia.textContent = "Loading server media";
    const response = await fetch("/api/bump-assets");
    if (!response.ok) throw new Error("Server assets unavailable.");
    const assets = await response.json();
    const music = Array.isArray(assets.music) ? assets.music : [];
    const backgrounds = Array.isArray(assets.backgrounds) ? assets.backgrounds : [];

    populateAssetSelect(serverSongSelect, music, music.length ? "Use server song..." : "No server songs found");
    populateAssetSelect(serverBackgroundSelect, backgrounds, backgrounds.length ? "Use server background..." : "No server backgrounds found");
    serverSongSelect._assets = music;
    serverBackgroundSelect._assets = backgrounds;

    if (music.length && !songInput.files[0]) {
      serverSongSelect.value = "0";
      configureServerAudio(music[0]);
      autofillCreditFromServerAudio(music[0]);
      status.textContent = `Loaded server song: ${music[0].name}.`;
      updateWorkspaceSummary();
    }
    if (backgrounds.length && !imageInput.files[0]) {
      serverBackgroundSelect.value = "0";
      loadServerBackground(backgrounds[0]);
    }
    updateWorkspaceSummary();
  } catch (error) {
    console.warn("Could not load server bump assets", error);
    if (summaryMedia) summaryMedia.textContent = "Server media unavailable";
  }
}

imageInput.addEventListener("change", () => {
  if (imageInput.files[0]) {
    activePresetName = "custom";
    serverBackgroundSelect.value = "";
    loadBackground(imageInput.files[0]);
  }
});

songInput.addEventListener("change", () => {
  if (songInput.files[0]) {
    activePresetName = "custom";
    selectedServerAudio = null;
    serverSongSelect.value = "";
    configureAudioStart(songInput.files[0]);
    autofillCreditFromAudio(songInput.files[0]);
  } else {
    resetAudioStart();
    clearAudioProbeUrl();
    previewAudio = null;
  }
  updateWorkspaceSummary();
});

serverSongSelect.addEventListener("change", () => {
  const asset = serverSongSelect._assets?.[Number(serverSongSelect.value)];
  activePresetName = "custom";
  if (!asset) {
    selectedServerAudio = null;
    resetAudioStart();
    return;
  }
  songInput.value = "";
  configureServerAudio(asset);
  autofillCreditFromServerAudio(asset);
  status.textContent = `Using server song: ${asset.name}.`;
  updateWorkspaceSummary();
});

serverBackgroundSelect.addEventListener("change", () => {
  const asset = serverBackgroundSelect._assets?.[Number(serverBackgroundSelect.value)];
  activePresetName = "custom";
  if (!asset) {
    selectedServerBackground = null;
    return;
  }
  imageInput.value = "";
  loadServerBackground(asset);
  updateWorkspaceSummary();
});

wallpaperSpacing.addEventListener("input", () => {
  activePresetName = "custom";
  wallpaperSpacingValue.textContent = wallpaperSpacing.value;
  renderWallpaperPreview();
  if (state.usingWallpaper) restartPreview();
});

[wallpaperShapes, wallpaperScheme].forEach((input) => {
  input.addEventListener("input", () => {
    activePresetName = "custom";
    renderWallpaperPreview();
    if (state.usingWallpaper) restartPreview();
  });
});

randomizeWallpaperBtn.addEventListener("click", () => {
  activePresetName = "custom";
  wallpaperSeed = Math.floor(Math.random() * 100000);
  renderWallpaperPreview();
  if (state.usingWallpaper) restartPreview();
});

useWallpaperBtn.addEventListener("click", () => {
  activePresetName = "custom";
  state.usingWallpaper = true;
  status.textContent = "Using generated wallpaper.";
  selectedServerBackground = null;
  serverBackgroundSelect.value = "";
  imageInput.value = "";
  updateWorkspaceSummary();
  restartPreview();
});

fontSizeInput.addEventListener("input", () => {
  activePresetName = "custom";
  fontSizeValue.textContent = fontSizeInput.value;
  drawFrame();
});

tintStrength.addEventListener("input", () => {
  activePresetName = "custom";
  tintStrengthValue.textContent = `${tintStrength.value}%`;
  drawFrame();
});

effectIntensity.addEventListener("input", () => {
  activePresetName = "custom";
  effectIntensityValue.textContent = `${effectIntensity.value}%`;
  drawFrame();
});

audioStart.addEventListener("input", () => {
  updateAudioStartReadout();
  syncPreviewAudio(0, true);
});

secondsPerLineInput.addEventListener("input", () => {
  activePresetName = "custom";
  secondsPerLineValue.textContent = `${secondsPerLineInput.value}s`;
});

creditText.addEventListener("input", () => {
  activePresetName = "custom";
  creditWasAutoFilled = false;
  restartPreview();
});

creditSize.addEventListener("input", () => {
  activePresetName = "custom";
  creditSizeValue.textContent = creditSize.value;
  drawFrame();
});

addLineBtn.addEventListener("click", () => addTextLine());
presetButtons.forEach((button) => {
  button.addEventListener("click", () => applyBumpPreset(button.dataset.bumpPreset));
});

[...textLines.querySelectorAll(".text-line")].forEach(bindTextLine);
updateLineLabels();

[secondsPerLineInput, formatInput, toneInput, tintStrength, productionStyle, productionAccent, productionBadge, productionKicker, effectIntensity, ...effectToggles, creditPosition, creditFont, creditSize, ...document.querySelectorAll("input[name='placement'], input[name='alignment']")]
  .forEach((input) => input.addEventListener("input", () => {
    activePresetName = "custom";
    restartPreview();
  }));
effectToggles.forEach((input) => input.addEventListener("input", () => {
  activePresetName = "custom";
  updateAdaptiveControls();
  updateWorkspaceSummary();
}));

previewBtn.addEventListener("click", startPreviewWithAudio);
renderBtn.addEventListener("click", renderVideo);
queueBumpBtn.addEventListener("click", () => sendBumpToDoinkTV("tail"));
playNextBumpBtn.addEventListener("click", () => sendBumpToDoinkTV("next"));

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "doinktv:bump-queued") return;
  status.textContent = event.data.ok
    ? event.data.position === "next"
      ? "Bump queued to play next."
      : "Bump added to queue."
    : event.data.error || "DoinkTV could not queue that bump.";
});

durationLabel.textContent = `${durationSeconds().toFixed(1)}s`;
renderWallpaperPreview();
syncControlReadouts();
applyBumpPreset("block");
loadServerAssets();
