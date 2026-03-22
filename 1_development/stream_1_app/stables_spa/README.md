# Stables SPA (`stables_spa`)

Modern **React + TypeScript + Vite** shell for Stables UI. Use this for new development; the legacy single-file MiniDapp in `prod_stables_app_v0.2.x` remains the reference until features are ported.

## Quick start

```bash
cd 1_development/stream_1_app/stables_spa
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Docs

- **`ARCHITECTURE.md`** — folder layout, migration notes, build output.
- **`src/features/README.md`** — how to add wallet / council / settings modules.

## Design rules

Follow **`0_handshake/web_component_spec.md`** and tokens in **`src/styles/tokens.css`**. Link **`stables.css`** from the live site when building marketing or static pages that must match GitHub Pages exactly; this SPA uses the same token *values* for the app shell.
