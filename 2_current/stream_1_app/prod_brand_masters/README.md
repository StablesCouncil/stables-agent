## Brand masters scripts (repo-local paths)

These are repo-local versions of the brand master export scripts from:

`2_current/stream_1_app/prod_brand_masters/`

### What changed

- No `H:\My Drive\...` paths.
- Inputs resolve relative to the script folder (`$PSScriptRoot`).
- Outputs go into this task folder under `exports/` (safe sandbox output).

### Required inputs (place next to the scripts)

- `1_symbol_current.png`

If the input file is missing, the script will error and stop (no substitution).

### Discord DJ icon (agent mark + music, same illustration language)

**Script:** `build_discord_dj_icon_agent_dj.py`

Writes two 1024×1024 PNGs under **`exports/`**:

| File | Meaning |
|------|--------|
| **`discord_dj_icon_agent_plain_1024.png`** | High-quality upscale of **`…/bot_assets/stables_agent_avatar.png`** only (no new style layers). |
| **`discord_dj_icon_agent_dj_1024.png`** | Council **DJ** icon: starts from **`dj_icon_ai_reference.png`** in this folder (full composition in the **same** white plate / circuit style as the agent mark, with a small **music** glyph), letterboxed to a square on **`#0b0f14`**. If the reference file is absent, this file is a copy of the plain export. |

**Refreshing after the agent PNG changes**

1. Regenerate a new wide composition in the **same** 3D tech style as the avatar (music note or bars, same materials), using the current **`stables_agent_avatar.png`** as the visual reference.  
2. Save it as **`dj_icon_ai_reference.png`** here (replace the old file).  
3. Run:

```bash
cd 2_current/stream_1_app/prod_brand_masters
pip install pillow   # once, if needed
python build_discord_dj_icon_agent_dj.py
```

`1_symbol_current.png` stays in **`.gitignore`** for the Twitter PFP script inputs only.

