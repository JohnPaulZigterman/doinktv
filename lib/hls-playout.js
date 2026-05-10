import path from "node:path";

export function createHlsPlayoutController({
  hlsDir,
  ffmpegPath,
  spawn,
  mkdir,
  readdir,
  rm,
  stat,
  existsSync,
  argsForProgram,
  publicProgram,
  standbyProgram,
  handoffProgram,
  entryEnd
} = {}) {
  const playout = {
    id: "",
    process: null,
    startedAt: 0,
    handoffFromId: "",
    status: "starting",
    error: ""
  };

  async function sync() {
    const program = publicProgram();
    const live = program.live || standbyProgram(program.serverTime);
    const handoff = handoffProgram(program, playout);
    if (handoff && playout.id !== handoff.id && playout.handoffFromId !== live.id) {
      await start(handoff, { handoffFromId: live.id });
      return;
    }
    if (playout.handoffFromId === live.id && playout.id !== live.id && Date.now() < entryEnd(live) + 500) {
      return;
    }
    if (playout.id === live.id && playout.status === "running" && playout.process && !playout.process.killed) {
      if (Date.now() - playout.startedAt < 12000) return;
      if (await isPlaylistFresh()) return;
      playout.error = "HLS playlist stopped updating; restarting playout.";
    }

    await start(live);
  }

  async function start(live, options = {}) {
    stop();
    playout.id = live.id;
    playout.startedAt = Date.now();
    playout.handoffFromId = options.handoffFromId || live.handoffFromId || "";
    playout.status = "starting";
    playout.error = "";
    await mkdir(hlsDir, { recursive: true });
    await pruneDirectory();

    const args = argsForProgram(live);
    const child = spawn(ffmpegPath, args, { windowsHide: true });
    playout.process = child;
    playout.status = "running";
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString().trim();
      if (text) playout.error = text.slice(-800);
    });
    child.on("error", (error) => {
      if (playout.process === child) playout.process = null;
      playout.status = "error";
      playout.error = `FFmpeg failed: ${error.message}`;
    });
    child.on("exit", (code) => {
      if (playout.process === child) {
        playout.process = null;
        playout.status = code === 0 ? "ended" : "error";
        if (code !== 0 && !playout.error) playout.error = `FFmpeg exited with code ${code}.`;
      }
    });
  }

  async function isPlaylistFresh(maxAgeMs = 10000) {
    try {
      const playlistStat = await stat(path.join(hlsDir, "live.m3u8"));
      return playlistStat.size > 0 && Date.now() - playlistStat.mtimeMs < maxAgeMs;
    } catch {
      return false;
    }
  }

  async function pruneDirectory(maxAgeMs = 1000 * 60 * 5) {
    if (!existsSync(hlsDir)) return;
    const cutoff = Date.now() - maxAgeMs;
    const entries = await readdir(hlsDir, { withFileTypes: true }).catch(() => []);
    await Promise.all(entries
      .filter((entry) => entry.isFile() && entry.name !== "live.m3u8")
      .map(async (entry) => {
        const filePath = path.join(hlsDir, entry.name);
        const fileStat = await stat(filePath).catch(() => null);
        if (fileStat && fileStat.mtimeMs < cutoff) await rm(filePath, { force: true });
      }));
  }

  function stop() {
    if (!playout.process) return;
    const child = playout.process;
    playout.process = null;
    child.kill("SIGTERM");
  }

  function setError(error) {
    playout.status = "error";
    playout.error = error?.message || String(error || "Unknown HLS error.");
  }

  function snapshot() {
    return {
      id: playout.id,
      status: playout.status,
      startedAt: playout.startedAt,
      handoffFromId: playout.handoffFromId,
      running: Boolean(playout.process),
      error: playout.error
    };
  }

  return {
    playout,
    sync,
    start,
    stop,
    isPlaylistFresh,
    pruneDirectory,
    setError,
    snapshot
  };
}
