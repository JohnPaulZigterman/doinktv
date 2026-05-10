import crypto from "node:crypto";

export function createWeeklyBlockBumpSource(block, kind, startAt, nextSource = null, bumpIndex = 0, {
  blockBumpDuration = 16,
  weeklyBlockIdentity,
  randomBumpMusic,
  hashString = defaultHashString,
  generatedBumpPresentation = () => ({})
} = {}) {
  const identity = weeklyBlockIdentity(block);
  const tagline = identity.taglines[Math.abs(hashString(`${block.id}:${kind}:${startAt}:${bumpIndex}`)) % identity.taglines.length];
  const music = randomBumpMusic(blockBumpDuration);
  const seed = Math.abs(hashString(`${block.id}:${startAt}:${kind}:${bumpIndex}`)) % 100000;
  const nextLine = nextSource?.title ? `NEXT: ${nextSource.title}` : "MORE STRANGE PROGRAMMING SHORTLY";
  return {
    id: crypto.randomUUID(),
    type: "bump",
    title: `${block.name}: ${kind === "intro" ? "block intro" : "block bump"}`,
    duration: blockBumpDuration,
    randomEligible: false,
    weeklyBlockId: block.id,
    bump: {
      kind: "block-bump",
      blockId: block.id,
      blockName: block.name,
      bumpClass: kind,
      heading: identity.heading,
      lines: [
        identity.heading,
        tagline,
        nextLine
      ],
      placement: identity.placement,
      alignment: identity.alignment,
      tone: identity.tone,
      fontSize: identity.fontSize,
      secondsPerLine: 1.65,
      tintStrength: kind === "intro" ? 18 : 28,
      creditText: music.creditText,
      creditSize: 19,
      creditPosition: "bottom-right",
      effects: identity.effects,
      effectIntensity: kind === "intro" ? 26 : 20,
      intentionalGlitch: false,
      presentation: generatedBumpPresentation(false),
      productionStyle: kind === "intro" ? "promo-card" : "lower-third",
      productionAccent: "signal",
      productionBadge: block.name,
      productionKicker: kind === "intro" ? "block premiere" : "station identification",
      format: "landscape",
      seed,
      wallpaper: {
        shapes: identity.shapes,
        scheme: identity.scheme,
        spacing: kind === "intro" ? 76 : 108,
        seed
      },
      audio: music.path,
      audioStart: music.start
    }
  };
}

function defaultHashString(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(31, hash) + text.charCodeAt(index) | 0;
  }
  return hash;
}
