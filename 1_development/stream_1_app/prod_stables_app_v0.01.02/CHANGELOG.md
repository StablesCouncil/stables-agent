# Changelog — Stables MiniDapp

**Purpose:** Every change worth telling users, Council, or social channels gets a line here **when you merge the change** into this version. At release, copy the section for that version into release notes, Telegram, and X.

**Format:** [Keep a Changelog](https://keepachangelog.com/) style. Use **Added**, **Changed**, **Fixed**, **Removed**, **Security** as needed. Dates in ISO (`YYYY-MM-DD`).

---

## [0.01.02] — Unreleased

Active development line after freezing **0.01.01** (public Showcase baseline).

### Changed

- Bumped `APP_BUILD_VERSION` / `dapp.conf` to `0.01.02`. `latestPublishedVersion` remains `0.01.01` until a new `.mds.zip` is published to GitHub.

### Added

- **Invest → Maximize** tab: copy and outbound links to stake MINIMA via the official Minima **Maximize** MiniDapp (MiniDapps hub + docs).
- **Mint xWiniwa**: chart **below** the Mint xWiniwa button: **three** traces — **Winiwa · USD** (spot), **xWiniwa · USD** (spot × illustrative leverage), **Leverage** (right axis, **1.02×–1.5×** model from rolling volatility, smoothed); ~365d CoinGecko series as Winiwa spot; not on-chain pricing. Taller plot, tighter side margins; **hover / touch** shows date + values; USD axis clamped so ticks stay non-negative.

---

## [0.01.01] — 2026-03-31 (frozen)

**Frozen snapshot:** `3_archive/stream_1_app/prod_stables_app_v0.01.01/`  
**Public:** Web Showcase at `https://stablescouncil.org/dapp/`; node package `Stables_v0.01.01.mds.zip` in `stablescouncil.github.io` → `dapp/latest-version/`.

### Added

- Full static Showcase app deployed under Pages `/dapp/` (replacing placeholder page).
- Versioned MiniDapp zip for node installs (`Stables_v0.01.01.mds.zip`).
- Structured **More → Feedback** on **web** (POST to Council feedback API); node path uses `MDS.net.POST` where applicable.
- Welcome / showcase copy: write mode vs read mode wording; toast styling for long errors.

### Changed

- Public site CTAs: **Test the showcase** → `stablescouncil.org/dapp/`; hero simplified (single primary CTA).
- Handshake / comms: X hashtag rules surfaced in `global_knowledge_base.md`, `session_map.md`, Cursor rule; `stables_master_reference` aligned with `handshake.md` §4.

### Fixed

- (Node) Feedback delivery still under investigation for some mobile nodes; web feedback path verified working.

### Known

- `latestPublishedVersion` in config tracks last **published** zip on GitHub; bump when shipping a new zip.
