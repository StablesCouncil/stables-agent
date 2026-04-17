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

### Discord DJ icon (agent + Stables symbol)

**Script:** `build_discord_dj_icon_agent_symbol.py`  
**Output:** `exports/discord_dj_icon_agent_plus_symbol_1024.png` (1024×1024, Stables tokens `#0b0f14` / cyan / purple)

Uses **`1_symbol_current.png`** when present (same as the Twitter PFP script). Otherwise **`STABLES_LOGO_SYMBOL`**, otherwise the archived Pages **`logo-symbol.png`** in `3_archive/…/brand/assets/`.  
Uses **`2_current/stream_3_governance/task_x_agent_node/bot_assets/stables_agent_avatar.png`** for the StablesAgent face (circular crop, lower-right).

```bash
cd 2_current/stream_1_app/prod_brand_masters
pip install pillow   # once, if needed
python build_discord_dj_icon_agent_symbol.py
```

`1_symbol_current.png` is listed in **`.gitignore`** here so the master symbol is not committed by mistake.

