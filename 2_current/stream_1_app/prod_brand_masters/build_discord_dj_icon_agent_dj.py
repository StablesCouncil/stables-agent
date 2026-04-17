#!/usr/bin/env python3
"""
Discord DJ / agent icon exports (1024x1024).

1) Plain upscale of the official agent mark (no new art style):
   -> exports/discord_dj_icon_agent_plain_1024.png

2) DJ mark: optional handoff image `dj_icon_ai_reference.png` in this folder
   (same 3D plate / circuit language as the agent mark, with a small music
   glyph). Letterboxed to 1024 square on #0b0f14 without cropping the art.
   -> exports/discord_dj_icon_agent_dj_1024.png
   If the reference file is missing, `discord_dj_icon_agent_dj_1024.png` is
   a copy of the plain export.

Agent source:
  2_current/stream_3_governance/task_x_agent_node/bot_assets/stables_agent_avatar.png
  Override with STABLES_AGENT_AVATAR.
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

from PIL import Image

BG = (11, 15, 20)
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


def fit_contain_square(img: Image.Image, size: int) -> Image.Image:
    """Scale uniformly, center on size x size, pad with BG."""
    img = img.convert("RGBA")
    w, h = img.size
    scale = min(size / w, size / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), BG + (255,))
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def plain_upscale_square(agent_path: Path, size: int) -> Image.Image:
    """Direct upscale of square agent asset (preserves original look)."""
    img = Image.open(agent_path).convert("RGBA")
    w, h = img.size
    if w != h:
        return fit_contain_square(img, size)
    return img.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    here = Path(__file__).resolve().parent
    repo = repo_root(here)
    agent_path = resolve_agent(repo)
    if not agent_path.is_file():
        print(f"Missing agent avatar: {agent_path}", file=sys.stderr)
        sys.exit(1)

    out_dir = here / "exports"
    out_dir.mkdir(parents=True, exist_ok=True)
    plain_path = out_dir / "discord_dj_icon_agent_plain_1024.png"
    dj_path = out_dir / "discord_dj_icon_agent_dj_1024.png"
    ref_path = here / "dj_icon_ai_reference.png"

    plain = plain_upscale_square(agent_path, OUT)
    plain.save(plain_path, "PNG")
    print(f"Wrote {plain_path} (from {agent_path})")

    if ref_path.is_file():
        ref = Image.open(ref_path).convert("RGBA")
        dj = fit_contain_square(ref, OUT)
        dj.save(dj_path, "PNG")
        print(f"Wrote {dj_path} (from {ref_path}, letterboxed)")
    else:
        shutil.copyfile(plain_path, dj_path)
        print(f"Wrote {dj_path} (copy of plain; add dj_icon_ai_reference.png for DJ variant)")


if __name__ == "__main__":
    main()
