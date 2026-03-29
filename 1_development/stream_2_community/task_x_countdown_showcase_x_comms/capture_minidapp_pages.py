#!/usr/bin/env python3
"""
Capture Mint, Invest, Merchants (Spend) from the active MiniDapp for X comms.
Requires: pip install playwright && python -m playwright install chromium

Outputs under ./screenshots/ next to this script.
"""
from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

TASK_DIR = Path(__file__).resolve().parent
# task → stream_2_community → 1_development → Stables repo root
REPO_ROOT = TASK_DIR.parents[2]
INDEX_HTML = (
    REPO_ROOT
    / "1_development"
    / "stream_1_app"
    / "prod_stables_app_v0.2.11"
    / "index.html"
)
OUT_DIR = TASK_DIR / "screenshots"

# Mobile-first viewport (handshake)
VIEWPORT = {"width": 390, "height": 844}

# (filename_stem, hash route for navigate)
SHOTS = (
    ("x_showcase_mint", "mint"),
    ("x_showcase_invest", "invest"),
    ("x_showcase_merchants", "spend"),
)


def main() -> None:
    if not INDEX_HTML.is_file():
        raise SystemExit(f"Missing MiniDapp index: {INDEX_HTML}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    url_base = INDEX_HTML.as_uri()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport=VIEWPORT,
            device_scale_factor=2,
            color_scheme="dark",
        )
        page = context.new_page()
        for stem, route in SHOTS:
            page.goto(f"{url_base}#{route}", wait_until="networkidle", timeout=60_000)
            page.wait_for_timeout(1200)
            dest = OUT_DIR / f"{stem}.png"
            page.screenshot(path=str(dest), full_page=True)
            print("wrote", dest)
        browser.close()


if __name__ == "__main__":
    main()
