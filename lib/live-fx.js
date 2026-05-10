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
    presets: instrument.presets || []
  }]));
}

export function fxMaxDuration(id) {
  return fxInstrument(id)?.maxDuration || 30;
}

export function fxDecayMs(id) {
  return fxInstrument(id)?.decayMs || 2500;
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
    safety: fx.safety || { maxDuration: fxMaxDuration(id) },
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
  const expiresAt = fx.expiresAt == null ? null : Math.min(now + 120000, Math.max(Number(fx.expiresAt || now), now) + duration * 1000);
  return normalizeFxEntry({
    ...fx,
    level: CONTINUOUS_FX_IDS.has(fx.id) ? Math.max(1, Number(preset.level || 1)) : Math.min(8, Number(fx.level || preset.level || 1) + 1),
    hits: Number(fx.hits || 1) + 1,
    startedAt: now,
    expiresAt,
    state: expiresAt == null ? "held" : "active",
    decayMs: instrument?.decayMs || fx.decayMs,
    seed: crypto.randomUUID(),
    params: params ? { ...fx.params, ...params } : fx.params || {}
  }, now);
}

export function createFxEntry({ id, label, params = {}, duration = 8, isToggle = false, level = 1, now = Date.now() } = {}) {
  const instrument = fxInstrument(id);
  return normalizeFxEntry({
    id,
    label: label || instrument?.label || id,
    startedAt: now,
    expiresAt: shouldHoldFx(id, params, isToggle) ? null : now + duration * 1000,
    seed: crypto.randomUUID(),
    level: Math.max(1, Number(level || 1)),
    hits: 1,
    params,
    state: shouldHoldFx(id, params, isToggle) ? "held" : "active",
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
