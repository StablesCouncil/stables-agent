# Features

Put **user journeys** here — one folder per domain, not one giant page file.

Suggested shape (add as you migrate):

```
features/
  wallet/
    WalletPage.tsx          ← route composes sections
    components/             ← only used by wallet
    hooks/
    api.ts                  ← later: Minima / MDS calls
  council/
  settings/
```

**Rule**: Shared UI lives in `src/components/` (e.g. `SectionWithCaption`). Feature-specific UI stays inside that feature folder.
