# Stables SPA — architecture

## Stack

- **Vite** — dev server, fast HMR, production build (`dist/`).
- **React 19 + TypeScript** — components, state, ecosystem.
- **React Router** — client-side routes (tabs / deep links later).

## Directories

| Path | Role |
|------|------|
| `src/styles/tokens.css` | Design tokens (keep aligned with `0_handshake/`). |
| `src/styles/global.css` | Base layout, typography, utilities. |
| `src/components/` | Reusable UI: layout shell, section patterns, buttons. |
| `src/pages/` | Thin route targets (often just compose features). |
| `src/features/` | Domain modules (wallet, council, …). |
| `src/app/` | App root: router, providers (theme, query client, … later). |
| `public/` | Static assets copied as-is (`agent.png`, icons). |

## Migration from `prod_stables_app_v0.2.x`

1. Keep the legacy MiniDapp as **shipping** until the SPA reaches parity.
2. Move one screen at a time: extract HTML → React components, port JS logic into hooks or `features/*/`.
3. **Wallet** is the first migrated screen (`src/features/wallet/`). Send/Receive modals, drag-sort currencies, and live activity remain to be wired.
3. Share **tokens** and patterns with the handshake spec; avoid new one-off colours.
4. When ready for Minima again: `npm run build` and serve `dist/` inside the MDS package (base path may need `vite.config` `base`).

## Commands

```bash
npm run dev      # local development
npm run build    # production bundle → dist/
npm run preview  # serve dist locally
npm run lint     # ESLint
```
