# Features

Put **user journeys** here — one folder per domain, not one giant page file.

## Wallet (started)

- `wallet/WalletPage.tsx` — Balance & actions, Currencies, Recent activity (`SectionWithCaption` ×3).
- `wallet/demoData.ts` — static balances / tx rows until vault + activity modules exist.
- `wallet/wallet.css` — styles ported from legacy `index.html` (scoped under `.wallet-page`).

Suggested shape for other features:

```
features/
  council/
    CouncilPage.tsx
    components/
    hooks/
```

**Rule**: Shared UI lives in `src/components/` (e.g. `SectionWithCaption`). Feature-specific UI stays inside that feature folder.
