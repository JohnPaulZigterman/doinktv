from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

BG = (7, 10, 12)
BG2 = (17, 22, 23)
TEXT = (244, 240, 232)
MUTED = (184, 190, 176)
TEAL = (104, 195, 183)
GOLD = (240, 184, 75)
RED = (125, 45, 63)
GLASS = (5, 20, 19)


def font(size, bold=False, black=False):
    candidates = [
        "C:/Windows/Fonts/ariblk.ttf" if black else "",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def lerp(a, b, t):
    return int(a + (b - a) * t)


def gradient(size):
    w, h = size
    img = Image.new("RGB", size, BG)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(1, w - 1)) * 0.65 + (y / max(1, h - 1)) * 0.35
            px[x, y] = (
                lerp(BG[0], BG2[0], t),
                lerp(BG[1], BG2[1], t),
                lerp(BG[2], BG2[2], t),
            )
    return img


def add_static(draw, size, seed=4, density=1800, alpha=36):
    rng = Random(seed)
    w, h = size
    for _ in range(density):
        x = rng.randrange(w)
        y = rng.randrange(h)
        color = TEAL if rng.random() < 0.55 else GOLD
        a = rng.randrange(10, alpha)
        draw.point((x, y), fill=(*color, a))


def add_scanlines(draw, size, step=6, opacity=26):
    w, h = size
    for y in range(0, h, step):
        draw.rectangle((0, y, w, y + 1), fill=(0, 0, 0, opacity))


def rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_label(draw, xy, label, value, scale=1):
    x, y = xy
    draw.text((x, y), label.upper(), font=font(int(22 * scale), bold=True), fill=MUTED)
    draw.text((x, y + int(23 * scale)), value, font=font(int(40 * scale), black=True), fill=TEAL)


def draw_tv(draw, x, y, w, h, label="DOINKTV"):
    body = (x, y, x + w, y + h)
    rounded_rect(draw, body, int(w * 0.08), fill=(25, 27, 24), outline=(74, 72, 57), width=max(2, w // 95))
    rounded_rect(draw, (x + int(w * 0.035), y + int(h * 0.04), x + int(w * 0.965), y + int(h * 0.96)), int(w * 0.07), fill=(12, 16, 15), outline=(47, 53, 48), width=max(2, w // 135))
    screen = (x + int(w * 0.075), y + int(h * 0.09), x + int(w * 0.89), y + int(h * 0.87))
    rounded_rect(draw, screen, int(w * 0.045), fill=GLASS, outline=(29, 48, 43), width=max(2, w // 160))

    sx1, sy1, sx2, sy2 = screen
    for yy in range(sy1, sy2, max(4, h // 55)):
        draw.line((sx1, yy, sx2, yy), fill=(0, 0, 0, 60), width=1)
    for xx in range(sx1 + 18, sx2, max(42, w // 14)):
        draw.rectangle((xx, sy1 + 18, xx + max(8, w // 42), sy1 + max(46, h // 10)), fill=(GOLD[0], GOLD[1], GOLD[2], 54))
        draw.rectangle((xx + max(24, w // 22), sy1 + 18, xx + max(34, w // 18), sy1 + max(46, h // 10)), fill=(RED[0], RED[1], RED[2], 64))

    title_font = font(max(34, w // 10), black=True)
    tw = draw.textlength(label, font=title_font)
    tx = sx1 + (sx2 - sx1 - tw) / 2
    ty = sy1 + (sy2 - sy1) * 0.43
    draw.text((tx + 4, ty), label, font=title_font, fill=RED)
    draw.text((tx - 4, ty), label, font=title_font, fill=TEAL)
    draw.text((tx, ty), label, font=title_font, fill=TEXT)
    draw.text((sx1 + 35, sy2 - 58), "VIEWER-SUPPORTED SIGNAL", font=font(max(14, w // 34), bold=True), fill=GOLD)

    knob_r = max(7, w // 54)
    draw.ellipse((x + int(w * 0.9), y + int(h * 0.79), x + int(w * 0.9) + knob_r * 2, y + int(h * 0.79) + knob_r * 2), fill=(103, 93, 67), outline=(25, 19, 12), width=2)
    draw.ellipse((x + int(w * 0.935), y + int(h * 0.79), x + int(w * 0.935) + knob_r * 2, y + int(h * 0.79) + knob_r * 2), fill=(103, 93, 67), outline=(25, 19, 12), width=2)


def cover():
    size = (2500, 1000)
    img = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")
    add_static(draw, size, seed=9, density=3600)

    for x in range(-120, size[0] + 200, 118):
        draw.line((x, -50, x + 360, size[1] + 80), fill=(104, 195, 183, 18), width=3)
    for y in range(80, size[1], 118):
        draw.line((0, y, size[0], y), fill=(255, 243, 215, 13), width=1)

    draw.rectangle((0, size[1] - 14, size[0], size[1]), fill=GOLD + (170,))
    draw.rectangle((0, size[1] - 8, size[0], size[1]), fill=TEAL + (150,))

    draw_label(draw, (135, 120), "DoinkWizard presents", "DOINKTV", scale=1.32)
    draw.text((138, 250), "a weird little internet TV station", font=font(54, bold=True), fill=TEXT)
    draw.text((142, 318), "cartoons, archive oddities, music blocks, station breaks, viewer chaos", font=font(30, bold=True), fill=MUTED)

    rounded_rect(draw, (140, 760, 790, 842), 14, fill=(255, 243, 215, 14), outline=TEAL + (84,), width=3)
    draw.text((168, 783), "PATREON KEEPS THE SIGNAL WARM", font=font(30, black=True), fill=GOLD)

    draw_tv(draw, 1280, 135, 1030, 705)
    add_scanlines(draw, size, step=5, opacity=25)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=3))
    img.convert("RGB").save(ASSETS / "doinktv-patreon-cover.png", quality=94)


def avatar():
    size = (1024, 1024)
    img = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")
    add_static(draw, size, seed=12, density=1700)
    draw_tv(draw, 96, 148, 832, 620, label="DTV")
    draw.text((120, 800), "DOINKWIZARD", font=font(62, black=True), fill=TEXT)
    draw.text((124, 866), "SIGNAL CLUB", font=font(36, bold=True), fill=GOLD)
    add_scanlines(draw, size, step=6, opacity=28)
    img.convert("RGB").save(ASSETS / "doinktv-patreon-avatar.png", quality=94)


def post_card():
    size = (1600, 900)
    img = gradient(size).convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")
    add_static(draw, size, seed=21, density=2200)
    rounded_rect(draw, (84, 82, 1516, 818), 30, fill=(7, 11, 12, 214), outline=TEAL + (90,), width=4)
    draw_tv(draw, 1010, 174, 420, 315, label="DTV")
    draw.text((150, 155), "SIGNAL UPDATE", font=font(48, black=True), fill=GOLD)
    draw.text((150, 235), "new blocks,", font=font(76, black=True), fill=TEXT)
    draw.text((150, 318), "new bumps,", font=font(76, black=True), fill=TEXT)
    draw.text((150, 401), "same bad decisions", font=font(76, black=True), fill=TEXT)
    draw.text((154, 548), "Behind-the-scenes notes from the DoinkTV control room.", font=font(31, bold=True), fill=MUTED)
    rounded_rect(draw, (150, 665, 720, 735), 10, fill=(7, 11, 12, 160), outline=TEAL + (150,), width=2)
    draw.text((178, 685), "THANKS FOR KEEPING IT ON AIR", font=font(24, black=True), fill=GOLD)
    add_scanlines(draw, size, step=5, opacity=24)
    img.convert("RGB").save(ASSETS / "doinktv-patreon-post-card.png", quality=94)


if __name__ == "__main__":
    cover()
    avatar()
    post_card()
    print(f"Wrote assets to {ASSETS}")
