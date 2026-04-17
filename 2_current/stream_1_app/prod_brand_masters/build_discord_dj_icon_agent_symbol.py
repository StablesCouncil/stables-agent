#!/usr/bin/env python3
"""
1024x1024 Discord-style icon: StablesAgent avatar + official Stables symbol, Stables tokens (#0b0f14, cyan, purple).

Inputs (first match wins for symbol):
  1) ./1_symbol_current.png next to this script (Council brand master)
  2) $STABLES_LOGO_SYMBOL
  3) Archived Pages brand copy in monorepo (see DEFAULT_SYMBOL_REL)

Agent image:
  ../../../stream_3_governance/task_x_agent_node/bot_assets/stables_agent_avatar.png
  (from repo root: 2_current/stream_3_governance/task_x_agent_node/bot_assets/…)

Output:
  ./exports/discord_dj_icon_agent_plus_symbol_1024.png
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
    # here = .../Stables/2_current/stream_1_app/prod_brand_masters (folder)
    # parents[0]=stream_1_app, [1]=2_current, [2]=Stables repo root
    return here.resolve().parents[2]


def resolve_symbol(here: Path, repo: Path) -> Path:
    local = here / "1_symbol_current.png"
    if local.is_file():
        return local
    env = os.environ.get("STABLES_LOGO_SYMBOL")
    if env:
        p = Path(env).expanduser().resolve()
        if p.is_file():
            return p
    rel = (
        Path("3_archive")
        / "stream_1_app"
        / "task_archived_nested_repo_stablescouncil_github_io_2026-04-12"
        / "stablescouncil.github.io"
        / "brand"
        / "assets"
        / "logo-symbol.png"
    )
    return (repo / rel).resolve()


def resolve_agent(repo: Path) -> Path:
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
    return ring.filter(ImageFilter.GaussianBlur(radius=4))


def draw_headphones_hint(draw: ImageDraw.ImageDraw, cx: int, cy: int, w: int, h: int) -> None:
    """Minimal DJ cue: thin headband + ear pads outline (does not touch logo pixels)."""
    # headband arc
    draw.arc(
        (cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2),
        start=200,
        end=340,
        fill=CYAN + (200,),
        width=6,
    )
    # ear cups
    r = h // 5
    draw.ellipse(
        (cx - w // 2 - r, cy - r, cx - w // 2 + r, cy + r),
        outline=PURPLE + (210,),
        width=5,
    )
    draw.ellipse(
        (cx + w // 2 - r, cy - r, cx + w // 2 + r, cy + r),
        outline=PURPLE + (210,),
        width=5,
    )


def main() -> None:
    here = Path(__file__).resolve().parent
    repo = repo_root(here)
    sym_path = resolve_symbol(here, repo)
    agent_path = resolve_agent(repo)
    if not sym_path.is_file():
        print(f"Missing symbol PNG: {sym_path}", file=sys.stderr)
        sys.exit(1)
    if not agent_path.is_file():
        print(f"Missing agent avatar: {agent_path}", file=sys.stderr)
        sys.exit(1)

    out_dir = here / "exports"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "discord_dj_icon_agent_plus_symbol_1024.png"

    canvas = Image.new("RGBA", (OUT, OUT), BG + (255,))
    draw = ImageDraw.Draw(canvas)

    # light frame (token spirit, stays out of the logo centre)
    draw.rounded_rectangle(
        (24, 24, OUT - 25, OUT - 25),
        radius=48,
        outline=CYAN + (55,),
        width=2,
    )

    symbol = Image.open(sym_path).convert("RGBA")
    sw, sh = symbol.size
    sym_max = 560
    sc = min(sym_max / sw, sym_max / sh, 1.0)
    sw2, sh2 = max(1, int(sw * sc)), max(1, int(sh * sc))
    symbol = symbol.resize((sw2, sh2), Image.Resampling.LANCZOS)

    # Symbol: upper-center
    sx = (OUT - sw2) // 2
    sy = 110
    ring = glow_ring(sw2 + 48, CYAN + (90,), 3)
    canvas.alpha_composite(ring, (sx - 24, sy - 24))
    canvas.paste(symbol, (sx, sy), symbol)

    agent = Image.open(agent_path).convert("RGBA")
    av = circular_avatar(agent, 340)
    av_ring = glow_ring(340 + 36, PURPLE + (100,), 3)
    ax = OUT - 340 - 72
    ay = OUT - 340 - 64
    canvas.alpha_composite(av_ring, (ax - 18, ay - 18))
    canvas.alpha_composite(av, (ax, ay))

    # Subtle headphone hint below symbol (pure graphic, not on logo)
    hx, hy = OUT // 2, sy + sh2 + 70
    draw_headphones_hint(draw, hx, hy, 420, 160)

    canvas.save(out_path, "PNG")
    print(f"Wrote {out_path}")
    print(f"  symbol: {sym_path}")
    print(f"  agent:  {agent_path}")


if __name__ == "__main__":
    main()
