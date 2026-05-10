import crypto from "node:crypto";

export const FX_INSTRUMENTS = {
  "av-warp": {
    label: "A/V Warp",
    kind: "rack",
    decayMs: 7000,
    maxDuration: 180,
    macroMap: { drift: "desync", rhythm: "speed", damage: "pitch" },
    presets: ["clean nudge", "tape shove", "late-night drag"]
  },
  delay: {
    label: "Delay",
    kind: "rack",
    decayMs: 10000,
    maxDuration: 180,
    macroMap: { rhythm: "time", damage: "feedback", drift: "repitch", space: "mix" },
    presets: ["digital clean", "tape repitch", "dub darken", "slapback"]
  },
  reverb: {
    label: "Reverb",
    kind: "rack",
    decayMs: 12000,
    maxDuration: 180,
    macroMap: { space: "size", drift: "preDelay", damage: "tone" },
    presets: ["room", "plate", "hall", "tunnel"]
  },
  "visual-adjust": {
    label: "Visual Abuse",
    kind: "rack",
    decayMs: 6500,
    maxDuration: 180,
    macroMap: { damage: "contrast", drift: "smear", page: "tracking" },
    presets: ["broadcast trim", "tracking tear", "color crush"]
  },
  "source-overlay": {
    label: "Source Overlay",
    kind: "rack",
    decayMs: 6500,
    maxDuration: 180,
    macroMap: { rhythm: "opacity", space: "blend", damage: "crop" },
    presets: ["screen wash", "hard cut-in", "ghost source"]
  },
  "playlist-audio": {
    label: "Playlist Audio",
    kind: "rack",
    decayMs: 5000,
    maxDuration: 180,
    macroMap: { rhythm: "hit", damage: "ducking" },
    presets: ["bed", "drop-in", "interrupt"]
  },
  "signal-loss": { label: "Signal Loss", kind: "toggle", decayMs: 6000, maxDuration: 30 },
  "tape-warp": { label: "Tape Warp", kind: "toggle", decayMs: 6000, maxDuration: 30 },
  vhs: { label: "VHS Distortion", kind: "toggle", decayMs: 6000, maxDuration: 30 },
  "theme-cycle": { label: "Theme Cycle", kind: "page-rack", decayMs: 4500, maxDuration: 180 },
  "dj-mic": { label: "DJ Mic", kind: "audio-rack", decayMs: 5000, maxDuration: 180 },
  "frequency-drift": { label: "Frequency Drift", kind: "rack", decayMs: 7000, maxDuration: 180 },
  "party-damage": { label: "Party Damage", kind: "rack", decayMs: 6500, maxDuration: 180 },
  "soundboard-sample": { label: "Soundboard Cart", kind: "command", decayMs: 1200, maxDuration: 60 }
};

const FX_INSTRUMENT_FALLBACKS = {
  glitch: { kind: "momentary-video", decayMs: 3800, maxDuration: 12 },
  "dvd-skip": { kind: "momentary-video", decayMs: 2200, maxDuration: 10 },
  frozen: { kind: "momentary-video", decayMs: 2400, maxDuration: 8 },
  "color-bars": { kind: "toggle", decayMs: 3500, maxDuration: 30 },
  "aspect-bad": { kind: "toggle", decayMs: 3500, maxDuration: 45 },
  "crop-bad": { kind: "toggle", decayMs: 3500, maxDuration: 45 },
  invert: { kind: "momentary-video", decayMs: 2600, maxDuration: 12 },
  kaleidoscope: { kind: "momentary-video", decayMs: 4200, maxDuration: 18 },
  pixelate: { kind: "toggle", decayMs: 4200, maxDuration: 45 },
  glass: { kind: "toggle", decayMs: 4200, maxDuration: 45 },
  melt: { kind: "momentary-video", decayMs: 4200, maxDuration: 14 },
  "palette-swap": { kind: "momentary-video", decayMs: 3000, maxDuration: 16 },
  "color-acid": { kind: "momentary-video", decayMs: 3200, maxDuration: 16 },
  "color-hot": { kind: "momentary-video", decayMs: 3200, maxDuration: 16 },
  "color-ice": { kind: "momentary-video", decayMs: 3200, maxDuration: 16 },
  "fill-water": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-shapes": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-marbles": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-stickers": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-confetti": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-popups": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-bubbles": { kind: "screen-fill", decayMs: 3000, maxDuration: 18 },
  "fill-static-panels": { kind: "screen-fill", decayMs: 2600, maxDuration: 18 },
  "os-popups": { kind: "page-rack", decayMs: 2800, maxDuration: 18 },
  "blue-screen": { kind: "momentary-video", decayMs: 2600, maxDuration: 10 },
  "floppy-prompt": { kind: "momentary-video", decayMs: 2600, maxDuration: 14 },
  "retro-os": { kind: "page-rack", decayMs: 2800, maxDuration: 18 },
  "illegal-operation": { kind: "page-rack", decayMs: 2400, maxDuration: 12 },
  "auto-filter-sweep": { kind: "momentary-video", decayMs: 3000, maxDuration: 18 },
  "audio-desync": { kind: "momentary-video", decayMs: 2600, maxDuration: 12 },
  "amen-break": { kind: "audio-cart", decayMs: 1200, maxDuration: 8 },
  "radio-sting": { kind: "audio-cart", decayMs: 1200, maxDuration: 9 },
  "legal-id": { kind: "station-cart", decayMs: 1600, maxDuration: 10 },
  "cart-wall": { kind: "audio-cart", decayMs: 1400, maxDuration: 8 },
  "record-scratch": { kind: "audio-cart", decayMs: 900, maxDuration: 5 },
  "caller-line": { kind: "station-cart", decayMs: 1800, maxDuration: 18 },
  "dub-siren": { kind: "audio-cart", decayMs: 1800, maxDuration: 10 },
  "show-cue": { kind: "station-cart", decayMs: 1600, maxDuration: 12 },
  hum: { kind: "audio-cart", decayMs: 2200, maxDuration: 12 },
  countdown: { kind: "station-cart", decayMs: 1800, maxDuration: 12 },
  gun: { kind: "momentary-video", decayMs: 900, maxDuration: 5 },
  "gif-loops": { kind: "screen-fill", decayMs: 2600, maxDuration: 16 },
  "looper-capture": { kind: "looper", decayMs: 2000, maxDuration: 24 },
  "looper-layer-1": { kind: "looper", decayMs: 2000, maxDuration: 24 },
  "looper-layer-2": { kind: "looper", decayMs: 2000, maxDuration: 24 },
  "looper-layer-3": { kind: "looper", decayMs: 2000, maxDuration: 24 },
  "looper-bpm-down": { kind: "looper-command", decayMs: 700, maxDuration: 3 },
  "looper-bpm-up": { kind: "looper-command", decayMs: 700, maxDuration: 3 },
  "looper-config": { kind: "looper-command", decayMs: 700, maxDuration: 3 },
  "looper-clear": { kind: "looper-command", decayMs: 700, maxDuration: 3 },
  "seed-skip": { kind: "beat-repeat", decayMs: 2500, maxDuration: 45 },
  "theme-random": { kind: "page-rack", decayMs: 2400, maxDuration: 30 },
  "theme-aero-blast": { kind: "page-rack", decayMs: 2400, maxDuration: 30 },
  "ui-tilt": { kind: "page-rack", decayMs: 2500, maxDuration: 16 },
  "ui-shake": { kind: "page-rack", decayMs: 2500, maxDuration: 14 },
  "ui-melt": { kind: "page-rack", decayMs: 3000, maxDuration: 16 },
  "page-glare": { kind: "page-rack", decayMs: 2800, maxDuration: 18 },
  "cursor-party": { kind: "page-rack", decayMs: 2500, maxDuration: 20 },
  "ui-font-warp": { kind: "page-rack", decayMs: 2800, maxDuration: 18 },
  "ui-spacing-collapse": { kind: "page-rack", decayMs: 3000, maxDuration: 18 },
  "ui-panel-drift": { kind: "page-rack", decayMs: 3000, maxDuration: 20 },
  "ui-low-res": { kind: "page-rack", decayMs: 3000, maxDuration: 20 },
  "ui-contrast-crush": { kind: "page-rack", decayMs: 3000, maxDuration: 20 },
  "ui-z-index-slip": { kind: "page-rack", decayMs: 3200, maxDuration: 20 },
  "ui-scroll-sick": { kind: "page-rack", decayMs: 3200, maxDuration: 20 },
  "ui-css-panic": { kind: "page-rack", decayMs: 3500, maxDuration: 24 },
  "meme-jazz": { kind: "audio-cart", decayMs: 1200, maxDuration: 6 },
  "meme-done": { kind: "audio-cart", decayMs: 1200, maxDuration: 6 },
  weed: { kind: "momentary-video", decayMs: 3000, maxDuration: 16 },
  beer: { kind: "momentary-video", decayMs: 2600, maxDuration: 14 },
  lsd: { kind: "momentary-video", decayMs: 3600, maxDuration: 16 }
};

export function registerFxPresetInstruments(presets = {}) {
  for (const [id, preset] of Object.entries(presets || {})) {
    if (FX_INSTRUMENTS[id]) continue;
    const fallback = FX_INSTRUMENT_FALLBACKS[id] || {};
    FX_INSTRUMENTS[id] = {
      label: preset.label || id,
      kind: fallback.kind || "momentary",
      decayMs: fallback.decayMs || 2500,
      maxDuration: fallback.maxDuration || Math.max(2, Math.min(30, Number(preset.duration || 8)))
    };
  }
}

export const TOGGLE_FX_IDS = new Set([
  "signal-loss",
  "tape-warp",
  "vhs",
  "color-bars",
  "aspect-bad",
  "crop-bad",
  "pixelate",
  "glass",
  "source-overlay",
  "playlist-audio",
  "theme-cycle",
  "dj-mic",
  "frequency-drift",
  "party-damage"
]);

export const COMMAND_FX_IDS = new Set([
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
  "reverb",
  "source-overlay",
  "playlist-audio",
  "visual-adjust",
  "theme-random",
  "legal-id",
  "cart-wall",
  "record-scratch",
  "caller-line",
  "dub-siren",
  "soundboard-sample"
]);

export const CONTINUOUS_FX_IDS = new Set(["av-warp", "delay", "reverb", "visual-adjust"]);

export function fxInstrument(id) {
  return FX_INSTRUMENTS[id] || null;
}

export function publicFxInstruments() {
  return Object.fromEntries(Object.entries(FX_INSTRUMENTS).map(([id, instrument]) => [id, {
    id,
    label: instrument.label,
    kind: instrument.kind,
    maxDuration: instrument.maxDuration,
    decayMs: instrument.decayMs,
    macroMap: instrument.macroMap || null,
    presets: instrument.presets || [],
    safety: {
      maxDuration: instrument.maxDuration,
      decayMs: instrument.decayMs,
      cleanReturn: true,
      peaceModeMuted: true,
      adminOfflineDecay: instrument.kind !== "command" && instrument.kind !== "audio-cart"
    }
  }]));
}

export function fxMaxDuration(id) {
  return fxInstrument(id)?.maxDuration || 30;
}

export function fxDecayMs(id) {
  return fxInstrument(id)?.decayMs || 2500;
}

export function normalizeFxDuration(id, duration = fxMaxDuration(id)) {
  const maxDuration = fxMaxDuration(id);
  const value = Number(duration);
  return Math.max(2, Math.min(maxDuration, Number.isFinite(value) ? value : maxDuration));
}

export function clampFxParams(id, params = {}) {
  const input = params && typeof params === "object" ? params : {};
  if (id === "av-warp") {
    return {
      ...input,
      speed: Math.max(0.25, Math.min(2, Number(input.speed ?? 1))),
      pitch: Math.max(0.5, Math.min(2, Number(input.pitch ?? 1))),
      desync: Math.max(-4, Math.min(4, Number(input.desync ?? 0)))
    };
  }
  if (id === "delay") {
    return {
      ...input,
      timeMs: Math.max(40, Math.min(2000, Number(input.timeMs ?? 375))),
      feedback: Math.max(0, Math.min(0.88, Number(input.feedback ?? 0.35))),
      mix: Math.max(0, Math.min(1, Number(input.mix ?? 0.32))),
      tone: Math.max(800, Math.min(12000, Number(input.tone ?? 4800)))
    };
  }
  if (id === "reverb") {
    return {
      ...input,
      size: Math.max(0, Math.min(100, Number(input.size ?? 56))),
      decay: Math.max(0.2, Math.min(8, Number(input.decay ?? 2.4))),
      preDelayMs: Math.max(0, Math.min(180, Number(input.preDelayMs ?? 22))),
      mix: Math.max(0, Math.min(1, Number(input.mix ?? 0.28))),
      tone: Math.max(900, Math.min(14000, Number(input.tone ?? 6200)))
    };
  }
  if (id === "visual-adjust") {
    return {
      ...input,
      brightness: Math.max(-100, Math.min(300, Number(input.brightness ?? 100))),
      contrast: Math.max(-100, Math.min(300, Number(input.contrast ?? 100))),
      saturation: Math.max(-100, Math.min(300, Number(input.saturation ?? 100))),
      tear: Math.max(0, Math.min(100, Number(input.tear ?? 0))),
      tracking: Math.max(0, Math.min(100, Number(input.tracking ?? 0))),
      smear: Math.max(0, Math.min(100, Number(input.smear ?? 0)))
    };
  }
  if (id === "source-overlay") {
    return {
      ...input,
      opacity: Math.max(0.05, Math.min(1, Number(input.opacity ?? 0.55))),
      scale: Math.max(0.35, Math.min(1.8, Number(input.scale ?? 1)))
    };
  }
  return input;
}

export function isFxToggle(id, body = {}) {
  return body.force === true ? false : body.toggle === true || body.mode === "toggle" || TOGGLE_FX_IDS.has(id);
}

export function isFxCommand(id) {
  return COMMAND_FX_IDS.has(id);
}

export function shouldHoldFx(id, params = {}, isToggle = false) {
  return (["delay", "reverb"].includes(id) && params.enabled === true) || isToggle;
}

export function normalizeFxSnapshots(snapshots = []) {
  return (Array.isArray(snapshots) ? snapshots : [])
    .map((snapshot) => ({
      id: String(snapshot.id || crypto.randomUUID()),
      name: String(snapshot.name || "FX snapshot").slice(0, 80),
      note: String(snapshot.note || "").slice(0, 180),
      fx: Array.isArray(snapshot.fx) ? snapshot.fx.slice(0, 8).map((fx) => normalizeFxEntry(fx)) : [],
      createdAt: Number(snapshot.createdAt || Date.now()),
      updatedAt: Number(snapshot.updatedAt || snapshot.createdAt || Date.now())
    }))
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .slice(0, 24);
}

export function normalizeFxEntry(fx = {}, now = Date.now()) {
  const id = String(fx.id || "");
  const instrument = fxInstrument(id);
  const expiresAt = fx.expiresAt == null ? null : Number(fx.expiresAt);
  const decayMs = Number(fx.decayMs || instrument?.decayMs || fxDecayMs(id));
  const startedAt = Number(fx.startedAt || now);
  let state = fx.state || (expiresAt == null ? "held" : "active");
  if (expiresAt != null && Number.isFinite(expiresAt) && expiresAt - now <= decayMs) {
    state = "decaying";
  }
  return {
    ...fx,
    id,
    label: String(fx.label || instrument?.label || id),
    instrumentKind: String(fx.instrumentKind || instrument?.kind || "command"),
    instrumentLabel: String(fx.instrumentLabel || instrument?.label || fx.label || id),
    macroMap: fx.macroMap || instrument?.macroMap || null,
    safety: fx.safety || {
      maxDuration: fxMaxDuration(id),
      decayMs,
      cleanReturn: true,
      peaceModeMuted: true,
      adminOfflineDecay: true
    },
    decayMs,
    state,
    startedAt,
    expiresAt,
    seed: fx.seed || crypto.randomUUID(),
    level: Math.max(1, Number(fx.level || 1)),
    hits: Math.max(1, Number(fx.hits || 1)),
    params: fx.params && typeof fx.params === "object" ? fx.params : {}
  };
}

export function activeBroadcastFx(state, { adminOnline = false, graceMs = 30000, now = Date.now() } = {}) {
  const before = JSON.stringify(state.activeFx || []);
  state.activeFx = (state.activeFx || [])
    .map((fx) => normalizeFxEntry(fx, now))
    .map((fx) => {
      const recentlyFiredByAdmin = now - Number(fx.startedAt || 0) < graceMs;
      if (
        !adminOnline
        && !recentlyFiredByAdmin
        && (fx.expiresAt == null || !Number.isFinite(Number(fx.expiresAt)) || Number(fx.expiresAt) - now > fx.decayMs)
      ) {
        return {
          ...fx,
          state: "decaying",
          decayStartedAt: fx.decayStartedAt || now,
          expiresAt: now + fx.decayMs
        };
      }
      if (fx.expiresAt != null && Number.isFinite(Number(fx.expiresAt)) && Number(fx.expiresAt) - now <= fx.decayMs) {
        return {
          ...fx,
          state: "decaying",
          decayStartedAt: fx.decayStartedAt || now
        };
      }
      return fx;
    })
    .filter((fx) => fx.expiresAt == null || !Number.isFinite(Number(fx.expiresAt)) || Number(fx.expiresAt) > now)
    .slice(-8);
  return {
    fx: state.activeFx,
    changed: before !== JSON.stringify(state.activeFx || [])
  };
}

export function intensifyFxEntry(existing, { preset = {}, params = {}, duration = 8, now = Date.now() } = {}) {
  const fx = normalizeFxEntry(existing, now);
  const instrument = fxInstrument(fx.id);
  const safeDuration = normalizeFxDuration(fx.id, duration);
  const expiresAt = fx.expiresAt == null ? null : Math.min(now + fxMaxDuration(fx.id) * 1000, Math.max(Number(fx.expiresAt || now), now) + safeDuration * 1000);
  return normalizeFxEntry({
    ...fx,
    level: CONTINUOUS_FX_IDS.has(fx.id) ? Math.max(1, Number(preset.level || 1)) : Math.min(8, Number(fx.level || preset.level || 1) + 1),
    hits: Number(fx.hits || 1) + 1,
    startedAt: now,
    expiresAt,
    state: expiresAt == null ? "held" : "active",
    decayMs: instrument?.decayMs || fx.decayMs,
    seed: crypto.randomUUID(),
    params: clampFxParams(fx.id, params ? { ...fx.params, ...params } : fx.params || {})
  }, now);
}

export function createFxEntry({ id, label, params = {}, duration = 8, isToggle = false, level = 1, now = Date.now() } = {}) {
  const instrument = fxInstrument(id);
  const safeDuration = normalizeFxDuration(id, duration);
  const safeParams = clampFxParams(id, params);
  const held = shouldHoldFx(id, safeParams, isToggle);
  return normalizeFxEntry({
    id,
    label: label || instrument?.label || id,
    startedAt: now,
    expiresAt: held ? null : now + safeDuration * 1000,
    seed: crypto.randomUUID(),
    level: Math.max(1, Number(level || 1)),
    hits: 1,
    params: safeParams,
    state: held ? "held" : "active",
    instrumentKind: instrument?.kind || "command",
    instrumentLabel: instrument?.label || label || id,
    macroMap: instrument?.macroMap || null,
    safety: { maxDuration: fxMaxDuration(id) },
    decayMs: instrument?.decayMs || fxDecayMs(id)
  }, now);
}

export function beginFxDecay(state, id, now = Date.now()) {
  const before = state.activeFx || [];
  state.activeFx = before
    .map((fx) => {
      if (fx.id !== id) return normalizeFxEntry(fx, now);
      const normalized = normalizeFxEntry(fx, now);
      return {
        ...normalized,
        state: "decaying",
        decayStartedAt: normalized.decayStartedAt || now,
        expiresAt: now + normalized.decayMs
      };
    })
    .filter((fx) => fx.id !== id || Number(fx.expiresAt || 0) > now);
  return state.activeFx.length !== before.length || JSON.stringify(state.activeFx) !== JSON.stringify(before);
}

export function beginAllFxDecay(state, now = Date.now()) {
  const before = state.activeFx || [];
  state.activeFx = before
    .map((fx) => {
      const normalized = normalizeFxEntry(fx, now);
      return {
        ...normalized,
        state: "decaying",
        decayStartedAt: normalized.decayStartedAt || now,
        expiresAt: now + normalized.decayMs
      };
    })
    .filter((fx) => Number(fx.expiresAt || 0) > now)
    .slice(-8);
  return state.activeFx.length !== before.length || JSON.stringify(state.activeFx) !== JSON.stringify(before);
}
