#!/usr/bin/env python3
"""
1024x1024 Discord-style icon: StablesAgent avatar only, DJ treatment (headphones + Stables glow).

Agent image (fixed path from repo root):
  2_current/stream_3_governance/task_x_agent_node/bot_assets/stables_agent_avatar.png
  Override with STABLES_AGENT_AVATAR if set.

Output:
  ./exports/discord_dj_icon_agent_dj_1024.png
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

BG = (11, 15, 20)
CYAN = (103, 232, 249)
PURPLE = (167, 139, 250)
OUT = 1024


def repo_root(here: Path) -> Path:
    return here.resolve().parents[2]


def resolve_agent(repo: Path) -> Path:
    env = os.environ.get("STABLES_AGENT_AVATAR")
    if env:
        p = Path(env).expanduser().resolve()
        if p.is_file():
            return p
    return (
        repo
        / "2_current"
        / "stream_3_governance"
        / "task_x_agent_node"
        / "bot_assets"
        / "stables_agent_avatar.png"
    ).resolve()


def circular_avatar(img: Image.Image, diameter: int) -> Image.Image:
    img = img.convert("RGBA").resize((diameter, diameter), Image.Resampling.LANCZOS)
    mask = Image.new("L", (diameter, diameter), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, diameter - 1, diameter - 1), fill=255)
    out = Image.new("RGBA", (diameter, diameter), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def glow_ring(size: int, rgba: tuple[int, int, int, int], width: int) -> Image.Image:
    ring = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ring)
    margin = width + 2
    draw.ellipse(
        (margin, margin, size - margin - 1, size - margin - 1),
        outline=rgba,
        width=width,
    )
    return ring.filter(ImageFilter.GaussianBlur(radius=5))


def draw_dj_headphones(
    draw: ImageDraw.ImageDraw,
    cx: int,
    cy: int,
    face_r: int,
) -> None:
    """Over-ear style aligned to the circular face (vector only)."""
    # Headband (wide arc across the top of the head)
    band_w = int(face_r * 1.55)
    band_h = int(face_r * 1.05)
    bbox = (cx - band_w // 2, cy - face_r - int(face_r * 0.35), cx + band_w // 2, cy - face_r + band_h)
    draw.arc(bbox, start=200, end=340, fill=CYAN + (235,), width=14)

    # Ear cups (slightly larger than cheek area, overlap rim)
    cup_rx = int(face_r * 0.42)
    cup_ry = int(face_r * 0.52)
    lx = cx - face_r - int(face_r * 0.08)
    rx = cx + face_r - cup_rx * 2 + int(face_r * 0.08)
    yy = cy - cup_ry // 3

    draw.ellipse(
        (lx, yy, lx + 2 * cup_rx, yy + 2 * cup_ry),
        outline=PURPLE + (240,),
        width=12,
    )
    draw.ellipse(
        (rx, yy, rx + 2 * cup_rx, yy + 2 * cup_ry),
        outline=PURPLE + (240,),
        width=12,
    )
    # Inner pad hint
    pad = 18
    draw.ellipse(
        (lx + pad, yy + pad, lx + 2 * cup_rx - pad, yy + 2 * cup_ry - pad),
        outline=CYAN + (120,),
        width=4,
    )
    draw.ellipse(
        (rx + pad, yy + pad, rx + 2 * cup_rx - pad, yy + 2 * cup_ry - pad),
        outline=CYAN + (120,),
        width=4,
    )


def main() -> None:
    here = Path(__file__).resolve().parent
    repo = repo_root(here)
    agent_path = resolve_agent(repo)
    if not agent_path.is_file():
        print(f"Missing agent avatar: {agent_path}", file=sys.stderr)
        sys.exit(1)

    out_dir = here / "exports"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "discord_dj_icon_agent_dj_1024.png"

    cx, cy = OUT // 2, OUT // 2 + 12
    face_d = 760
    face_r = face_d // 2

    canvas = Image.new("RGBA", (OUT, OUT), BG + (255,))
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle(
        (20, 20, OUT - 21, OUT - 21),
        radius=52,
        outline=CYAN + (70,),
        width=3,
    )

    # Dual halo behind face
    halo_c = glow_ring(face_d + 120, CYAN + (55,), 4)
    canvas.alpha_composite(halo_c, (cx - (face_d + 120) // 2, cy - (face_d + 120) // 2))
    halo_p = glow_ring(face_d + 72, PURPLE + (50,), 3)
    canvas.alpha_composite(halo_p, (cx - (face_d + 72) // 2, cy - (face_d + 72) // 2))

    agent = Image.open(agent_path).convert("RGBA")
    av = circular_avatar(agent, face_d)
    av_ring = glow_ring(face_d + 28, CYAN + (130,), 3)
    ax = cx - face_d // 2
    ay = cy - face_d // 2
    canvas.alpha_composite(av_ring, (ax - 14, ay - 14))
    canvas.alpha_composite(av, (ax, ay))

    draw_dj_headphones(draw, cx, cy, face_r)

    canvas.save(out_path, "PNG")
    print(f"Wrote {out_path}")
    print(f"  agent: {agent_path}")


if __name__ == "__main__":
    main()
