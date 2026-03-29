#!/usr/bin/env python3
"""
X thread post 1 graphic — visual_identity_spec.md aligned.
Official logo-symbol + logo-wordmark only (no AI logo recreation).
Uses Inter from ./fonts/Inter-4.1/extras/ttf/ when present (see README in fonts/).

Outputs:
  x_thread_post1_reaching_out_v2.png
  x_thread_post1_reaching_out.png (same pixels, canonical name for posting)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 675
BG = (11, 15, 20)  # #0b0f14
CYAN = (103, 232, 249)
PURPLE = (167, 139, 250)  # #a78bfa
PANEL = (15, 23, 42)
MUTED = (159, 176, 192)  # #9fb0c0
LIGHT = (230, 237, 243)  # #e6edf3

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
BRAND = (
    REPO
    / "1_development"
    / "stream_2_community"
    / "prod_stablescouncil_github_io"
    / "brand"
    / "assets"
)
INTER_TTF = ROOT / "fonts" / "Inter-4.1" / "extras" / "ttf"
OUT_V2 = ROOT / "x_thread_post1_reaching_out_v2.png"
OUT_CANON = ROOT / "x_thread_post1_reaching_out.png"


def inter_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    p = INTER_TTF / name
    if p.is_file():
        return ImageFont.truetype(str(p), size)
    raise FileNotFoundError(name)


def load_font(size: int, weight: str) -> ImageFont.FreeTypeFont:
    """weight: regular | medium | semibold | bold | extrabold"""
    inter_map = {
        "regular": "Inter-Regular.ttf",
        "medium": "Inter-Medium.ttf",
        "semibold": "Inter-SemiBold.ttf",
        "bold": "Inter-Bold.ttf",
        "extrabold": "Inter-ExtraBold.ttf",
    }
    try:
        return inter_font(inter_map[weight], size)
    except (FileNotFoundError, KeyError):
        pass
    if weight in ("bold", "extrabold", "semibold"):
        for path in (
            r"C:\Windows\Fonts\segoeuib.ttf",
            r"C:\Windows\Fonts\arialbd.ttf",
        ):
            if Path(path).is_file():
                return ImageFont.truetype(path, size)
    for path in (r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"):
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def add_background_glow(base: Image.Image) -> None:
    """Spec radial: rgba(103, 232, 249, 0.18) from top + very soft purple depth."""
    layers = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dr = ImageDraw.Draw(layers)
    cx = W // 2
    dr.ellipse([cx - 950, -480, cx + 950, 560], fill=(103, 232, 249, 55))
    layers = layers.filter(ImageFilter.GaussianBlur(88))
    base.alpha_composite(layers)
    # faint purple lower corner (gradient accent only, spec)
    p2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(p2)
    d2.ellipse([W - 520, H - 80, W + 200, H + 420], fill=(167, 139, 250, 22))
    p2 = p2.filter(ImageFilter.GaussianBlur(70))
    base.alpha_composite(p2)


def draw_decorative_arcs(target: Image.Image) -> None:
    """Subtle cyan arcs behind lockup (no new colours)."""
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dr = ImageDraw.Draw(ov)
    cx, cy = W // 2, 210
    for i, (rw, rh, a) in enumerate([(380, 320, 40), (440, 380, 28), (500, 440, 18)]):
        bbox = [cx - rw, cy - rh, cx + rw, cy + rh]
        dr.arc(bbox, start=200, end=340, fill=(*CYAN, a), width=2)
    target.alpha_composite(ov)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(
        [0, 0, size[0], size[1]], radius=radius, fill=255
    )
    return m


def draw_pill(
    target: Image.Image, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont
) -> None:
    dr = ImageDraw.Draw(target)
    bbox = dr.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 18, 9
    rw, rh = tw + pad_x * 2, th + pad_y * 2
    x, y = xy
    body = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
    fill = Image.new("RGBA", (rw, rh), (*PANEL, 200))
    mask = rounded_mask((rw, rh), 999)
    body = Image.composite(fill, body, mask)
    glow = Image.new("RGBA", (rw + 10, rh + 10), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle(
        [3, 3, rw + 7, rh + 7], radius=999, outline=(*CYAN, 140), width=1
    )
    glow = glow.filter(ImageFilter.GaussianBlur(3))
    target.alpha_composite(glow, dest=(x - 5, y - 5))
    target.alpha_composite(body, dest=(x, y))
    dr = ImageDraw.Draw(target)
    dr.text((x + pad_x, y + pad_y + 1), text, font=font, fill=CYAN)


def scale_rgba(im: Image.Image, max_h: int) -> Image.Image:
    im = im.convert("RGBA")
    w0, h0 = im.size
    if h0 <= max_h:
        return im
    nh = max_h
    nw = max(1, int(w0 * (nh / h0)))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def wrap_line(text: str, font: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    if not words:
        return []
    lines: list[str] = []
    cur = words[0]
    dr = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    for w in words[1:]:
        trial = cur + " " + w
        bbox = dr.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def paste_glass_card(
    target: Image.Image,
    cx: int,
    cy: int,
    card_w: int,
    card_h: int,
) -> None:
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    fill = Image.new("RGBA", (card_w, card_h), (*PANEL, 165))
    mask = rounded_mask((card_w, card_h), 22)
    card = Image.composite(fill, card, mask)
    border = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    ImageDraw.Draw(border).rounded_rectangle(
        [0, 0, card_w - 1, card_h - 1],
        radius=22,
        outline=(*CYAN, 100),
        width=1,
    )
    card = Image.alpha_composite(card, border)
    glow = Image.new("RGBA", (card_w + 24, card_h + 24), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle(
        [2, 2, card_w + 21, card_h + 21],
        radius=24,
        outline=(*CYAN, 35),
        width=2,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    x0 = cx - card_w // 2
    y0 = cy - card_h // 2
    target.alpha_composite(glow, dest=(x0 - 12, y0 - 12))
    target.alpha_composite(card, dest=(x0, y0))


def main() -> None:
    sym_path = BRAND / "logo-symbol.png"
    wm_path = BRAND / "logo-wordmark.png"
    if not sym_path.is_file() or not wm_path.is_file():
        raise SystemExit(f"Missing brand assets under {BRAND}")

    img = Image.new("RGBA", (W, H), (*BG, 255))
    add_background_glow(img)
    draw_decorative_arcs(img)

    font_badge = load_font(11, "semibold")
    font_line1 = load_font(36, "bold")
    font_line2 = load_font(40, "extrabold")
    font_sub = load_font(21, "regular")

    badge_text = "BUILT ON MINIMA"
    dr0 = ImageDraw.Draw(img)
    bb = dr0.textbbox((0, 0), badge_text, font=font_badge)
    bw = bb[2] - bb[0]
    draw_pill(img, ((W - bw - 36) // 2, 36), badge_text, font_badge)

    sym = scale_rgba(Image.open(sym_path), 92)
    wm = scale_rgba(Image.open(wm_path), 56)
    gap = 20
    lock_w = sym.width + gap + wm.width
    lock_h = max(sym.height, wm.height)
    lx = (W - lock_w) // 2
    ly = 118

    paste_glass_card(img, W // 2, ly + lock_h // 2, lock_w + 72, lock_h + 56)

    img.alpha_composite(sym, dest=(lx, ly))
    img.alpha_composite(
        wm, dest=(lx + sym.width + gap, ly + (sym.height - wm.height) // 2)
    )

    dr = ImageDraw.Draw(img)
    y = ly + sym.height + 44

    line1 = "Stables is Minima's"
    line2 = "outstretched hand."
    b1 = dr.textbbox((0, 0), line1, font=font_line1)
    b2 = dr.textbbox((0, 0), line2, font=font_line2)
    w1, h1 = b1[2] - b1[0], b1[3] - b1[1]
    w2, h2 = b2[2] - b2[0], b2[3] - b2[1]
    dr.text(((W - w1) // 2, y), line1, font=font_line1, fill=LIGHT)
    y += h1 + 6
    dr.text(((W - w2) // 2, y), line2, font=font_line2, fill=CYAN)
    y += h2 + 22

    sub = "In plain terms, Minima reaching out to the world."
    max_tw = W - 140
    for line in wrap_line(sub, font_sub, max_tw):
        bs = dr.textbbox((0, 0), line, font=font_sub)
        sw = bs[2] - bs[0]
        sh = bs[3] - bs[1]
        dr.text(((W - sw) // 2, y), line, font=font_sub, fill=MUTED)
        y += sh + 8

    rgb = img.convert("RGB")
    rgb.save(OUT_V2, "PNG", optimize=True)
    rgb.save(OUT_CANON, "PNG", optimize=True)
    print(f"Wrote {OUT_V2}\nWrote {OUT_CANON}")


if __name__ == "__main__":
    main()
