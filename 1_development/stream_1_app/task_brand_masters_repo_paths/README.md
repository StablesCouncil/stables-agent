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

