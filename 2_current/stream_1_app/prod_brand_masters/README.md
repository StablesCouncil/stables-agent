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

### Discord DJ icon (StablesAgent only, DJ look)

**Script:** `build_discord_dj_icon_agent_dj.py`  
**Output:** `exports/discord_dj_icon_agent_dj_1024.png` (1024×1024)

Uses only **`2_current/stream_3_governance/task_x_agent_node/bot_assets/stables_agent_avatar.png`** (or **`STABLES_AGENT_AVATAR`**). Large circular portrait on **`#0b0f14`**, cyan / purple halo, and drawn over-ear **headphones** for a DJ read (no separate logo layer).

```bash
cd 2_current/stream_1_app/prod_brand_masters
pip install pillow   # once, if needed
python build_discord_dj_icon_agent_dj.py
```

`1_symbol_current.png` stays in **`.gitignore`** for the Twitter PFP script inputs only.

