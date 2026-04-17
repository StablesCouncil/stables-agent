#!/usr/bin/env python3
"""
Build 1024x1024 Discord Developer Portal icon: official Stables symbol only (no redraw),
centered on handshake token background #0b0f14.

Usage:
  python tools/build_discord_dj_icon.py [path/to/logo-symbol.png]

If omitted, uses STABLES_LOGO_SYMBOL env, else falls back to the archived Pages
tree copy of brand/assets/logo-symbol.png in this monorepo.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from PIL import Image

BG = (11, 15, 20)  # --bg #0b0f14
OUT_SIZE = 1024
MAX_SYMBOL = 880


def default_symbol_path(repo: Path) -> Path:
    return (
        repo
        / "3_archive"
        / "stream_1_app"
        / "task_archived_nested_repo_stablescouncil_github_io_2026-04-12"
        / "stablescouncil.github.io"
        / "brand"
        / "assets"
        / "logo-symbol.png"
    )


def main() -> None:
    here = Path(__file__).resolve()
    task_node = here.parents[1]
    repo = task_node.parents[2]

    if len(sys.argv) > 1:
        sym_path = Path(sys.argv[1]).expanduser().resolve()
    elif os.environ.get("STABLES_LOGO_SYMBOL"):
        sym_path = Path(os.environ["STABLES_LOGO_SYMBOL"]).expanduser().resolve()
    else:
        sym_path = default_symbol_path(repo)

    if not sym_path.is_file():
        print(f"Missing symbol PNG: {sym_path}", file=sys.stderr)
        sys.exit(1)

    out_path = task_node / "assets" / "discord-dj-app-icon-1024.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    symbol = Image.open(sym_path).convert("RGBA")
    w, h = symbol.size
    scale = min(MAX_SYMBOL / w, MAX_SYMBOL / h, 1.0)
    nw = max(1, int(w * scale))
    nh = max(1, int(h * scale))
    symbol = symbol.resize((nw, nh), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (OUT_SIZE, OUT_SIZE), BG + (255,))
    x = (OUT_SIZE - nw) // 2
    y = (OUT_SIZE - nh) // 2
    canvas.paste(symbol, (x, y), symbol)
    canvas.save(out_path, "PNG")
    print(f"Wrote {out_path} from {sym_path}")


if __name__ == "__main__":
    main()
