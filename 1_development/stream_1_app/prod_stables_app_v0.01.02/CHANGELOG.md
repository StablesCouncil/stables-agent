# Changelog — Stables MiniDapp

**Purpose:** Every change worth telling users, Council, or social channels gets a line here **when you merge the change** into this version. At release, copy the section for that version into release notes, Telegram, and X.

**Format:** [Keep a Changelog](https://keepachangelog.com/) style. Use **Added**, **Changed**, **Fixed**, **Removed**, **Security** as needed. Dates in ISO (`YYYY-MM-DD`).

---

## [0.01.02] — Unreleased

Active development line after freezing **0.01.01** (public Showcase baseline).

### Changed

- Bumped `APP_BUILD_VERSION` / `dapp.conf` to `0.01.02`. `latestPublishedVersion` remains `0.01.01` until a new `.mds.zip` is published to GitHub.
- **Mint xWiniwa** chart: **Leverage** trace is **EMA-smoothed** (less spiky) while the **last point** still matches live effective leverage.

### Added

- **Invest → Maximize** tab: copy and outbound links to stake MINIMA via the official Minima **Maximize** MiniDapp (MiniDapps hub + docs).
- **Mint xWiniwa**: chart **below** the Mint xWiniwa button: **three** traces — **Winiwa · USD** (spot), **xWiniwa · USD** (spot × leverage), **Leverage** (right axis from **CR% / (CR% − 100%)**, e.g. 130% → 130/30); historical leg interpolates **`CR_HIST_DATA`** with **today** = live `#protocolCRBig`; **Current leverage** row + `SIM_XWM` / mint math use same formula. ~365d CoinGecko Winiwa spot; hover/touch tooltip; tighter margins, taller plot.
- **Welcome → currencies**: **Unselect all** next to **Select all**; **Save and continue** applies currencies then offers **optional personalisation** (intro + **Step 1–4 of 4**: bank name, profile picture, contacts onboarding, directory preview) with **I'll do that later** on each step; **Open Contacts** finishes setup and opens the Contacts page; **Finish** saves council profile (name + avatar when set) and closes welcome. Bank name step copy clarifies **private vs on transactions**, changeable anytime in **My profile**.
- **Branding**: MiniDapp **headline** / page **title** / top bar tagline **By Stables on Minima** (replaces “Be your own bank” in those places). **Top bar** shows **My profile** picture and display name (or welcome bank name) when set; subtitle stays **By Stables on Minima**.
- **Amount inputs**: **Available** balance for the relevant asset next to **Exchange** (send + receive balance hint), **Send** / **Receive** modals, **Create invoice**, **Coverage fund** deposit amount, **Burn Wables** (per selected stable); **MAX** fills the field from that balance (where it already existed for mint / LP, unchanged). Labels refresh with **global UI** and currency changes.
- **Send / Receive modals**: currency **dropdown options** show **each enabled wallet currency with its balance** (`Code · amount`, tabular numbers, wider select). Refreshes whenever the wallet UI syncs.

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
