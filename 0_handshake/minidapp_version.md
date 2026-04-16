# MiniDapp version pointer (agents)

**Read this when touching MiniDapp code, zips, or `dapp.conf` / `runtime-config.js`.**

**Published mirror (community, GitHub Pages repo):**  
[github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/MINIDAPP_VERSIONING.md](https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/MINIDAPP_VERSIONING.md)

**Working copy (refresh Pages from here):**  
`1_development/stream_1_app/dapp/MINIDAPP_VERSIONING.md` — keep aligned with this handshake file (including **Channel model**). Run **`npm run sync:site`** in **`task_stablescouncil_github_io/`** so it lands in **`site/dapp/`**; ship **`site/`** to the Pages repo (live path **`dapp/MINIDAPP_VERSIONING.md`**).

**Pages `dapp/` HTML:** showcase shell is **`1_development/stream_1_app/dapp/1-showcase/index.html`**; demo shell is **`1_development/stream_1_app/dapp/2-demo/`** (**authoritative** for new demo work). **Test** and **prod** placeholders: **`dapp/3-test/`**, **`dapp/4-prod/`** (see **`MINIDAPP_VERSIONING.md`**). One shell per channel; no duplicate **`index.html`** under versioned **`dapp/v…/`** paths.

## Active trees (four channels under `dapp/`)

| | |
|--|--|
| **Showcase** | `1_development/stream_1_app/dapp/` (**`1-showcase/`**, root **`assets/`**, **`dapp.conf`**; hub zip per **`dapp/build/README.md`**; zips under **`1-showcase/latest-version/`**) |
| **Demo (primary new work)** | `1_development/stream_1_app/dapp/2-demo/` |
| **Test** | `1_development/stream_1_app/dapp/3-test/` (placeholder until test zip ships) |
| **Prod** | `1_development/stream_1_app/dapp/4-prod/` (placeholder until prod zip ships) |

| Line | Short label | Full label `vPM.Pn.TT.DD.SS` | `APP_STAGE` / `dapp.conf` `stage` | Change log |
|------|-------------|------------------------------|-------------------------------------|------------|
| **Showcase** | **`v00.00.03`** | **`v00.00.00.00.03`** | **`showcase`** | `dapp/CHANGELOG.md` |
| **Demo** | *(use full or `00.00.00.01.00` in files)* | **`v00.00.00.01.00`** | **`demo`** | `dapp/2-demo/CHANGELOG.md` |
| **Test** | *(none shipped yet)* | *(Council-chosen)* | **`test`** | `dapp/3-test/CHANGELOG.md` |
| **Prod** | *(none shipped yet)* | *(Council-chosen)* | **`prod`** | `dapp/4-prod/CHANGELOG.md` |

| | |
|--|--|
| **Executable shell** | Each folder: `index.html` (`<style>` block) |
| **Local shipped vs dev (comms)** | `0_handshake/minidapp_version_log.md` |
| **UI inventory** | `1_development/stream_1_app/ui_inventory/app_ui_inventory.md` (paths for both lines) |
| **Frozen v0.01.01 (Showcase public baseline)** | `3_archive/stream_1_app/prod_stables_app_v0.01.01/` — see `FROZEN.md` inside. |
| **Frozen v0.2.11** | `3_archive/stream_1_app/prod_stables_app_v0.2.11/` |
| **Frozen v0.2.10** | `3_archive/stream_1_app/prod_stables_app_v0.2.10/` + zip `…/build/Stables_v0.2.10.mds.zip` |
| **Dev zip (showcase)** | `dapp/build/Stables_v00.00.00.00.03.mds.zip` (see `dapp/build/README.md`) |
| **Dev zip (demo)** | `dapp/2-demo/build/Stables_v00.00.00.01.00_demo.mds.zip` (see `dapp/2-demo/build/README.md`) |

### Routing (agents)

- **Porting gap ledger (optional but recommended):** `1_development/stream_1_app/dapp/PORTING_GAP.md` — single place to track **lead channel vs downstream** (prod → test → demo → showcase) so you do not diff four trees manually. Set **Declared lead channel** there when strategy shifts (e.g. demo-first today; prod-first when **`4-prod/`** is a full fork).
- **Default:** implement new features in **`dapp/2-demo/`** unless the task is **showcase-only** (synthetic line, no demo semantics).
- **Both channels:** land the change in **demo** first when it applies to both, then **port** to showcase only if **synthetic-safe** (no demo-only chain or token-truth wiring). Reverse for a showcase hotfix that must not affect demo yet.
- **Config:** **`assets/config/runtime-config.js`** under the tree you edit (**`dapp/assets/`** for showcase, **`dapp/2-demo/assets/`** for demo) → **`APP_STAGE`** (`showcase` \| `demo` \| `test` \| `prod`) drives the top bar pill with **`APP_BUILD_VERSION`**. Optional **`stage`** in `dapp.conf` for human-readable channel (hub may ignore unknown keys).

### Channel model (showcase, demo, test, prod)

- **One shell, one UX direction:** the same app routes and design system across stages. **Channels differ by functionality** (what may run: simulation vs demo mint semantics vs real test tokens vs prod), plus the **data and backends** those features require, not by maintaining unrelated product UIs.
- **Showcase** mirrors the **most advanced** experience the Council wants visitors to see, with **rich synthetic / sample data** so the surface reads like a finished product. It stays **synthetic-safe**: port from **demo** only when wiring does not imply chain or token truth that showcase does not have (see **Routing** above).
- **Test** and **prod** use the same stage names in **`APP_STAGE`** and policy. On Pages they have **`dapp/3-test/`** and **`dapp/4-prod/`** trees (**`latest-version/`** when used). Retired **`previous-versions`** documentation for all channels lives only under **`3_archive/stream_1_app/task_archived_dapp_channel_previous_versions_2026-04-16/dapp/`** (not in active **`dapp/`**). Separate **`prod_…` dev folders** in the workspace for full app forks are optional until Council splits codebases. Token and environment truth per stage are summarized under **Five-segment version** (on-chain column) and **Demo vs test** below.
- **Identifiers vs display:** folder names, zips, **`APP_BUILD_VERSION`**, and **`dapp.conf`** use the **canonical two-digit** five-segment form (e.g. **`v00.00.00.00.03`**). Marketing or in-app copy may use a shorter human-readable spelling **only as display**, without changing Council paths or artifact names.

## Five-segment version: `vPM.Pn.TT.DD.SS` (stage-aware)

**Purpose:** One label encodes **prod major + prod minor** plus **test, demo, and showcase** lines so users and Council can see **which maturity track** advanced. Read **left to right**:

| Position | Segment | Stage | On-chain (Stables product scope) |
|:--:|:--:|:--|:--|
| 1 | **PM** | **Prod major** | **Minima + Stables** (Council-declared production stable layer). **`00`** until the first prod-channel ship. |
| 2 | **Pn** | **Prod minor** | **Optional** slight / patch increments **on the same prod major** (e.g. **`01.01` → `01.02`**). Not every prod ship needs a minor bump. **`00`** when unused or when resetting after a major bump. |
| 3 | **TT** | **Test** | **Minima + Winiwa + Wables** as **real on-chain tokens**, **no** (or test-only) value; path toward Stables backed by real Minima |
| 4 | **DD** | **Demo** | **Minima only** for Stables product; **no** Stables-team tokens on-chain. In-app “stables” / xWiniwa mint uses **Winiwa only** and is **not** a blockchain token |
| 5 | **SS** | **Showcase** | **Nothing** on-chain for the Stables product; synthetic UI and local simulation |

**Format:** `v` + **five** groups of **two digits** (leading zeros): showcase example **`v00.00.00.00.03`**; first demo line **`v00.00.00.01.00`**.

**Prod major / prod minor (required rule)**

- **`Pn`** is the place for **small, optional** prod releases while **`PM`** stays fixed (**`v01.02.…` → `v01.03.…`**).
- When **`PM`** increments, **`Pn` MUST reset to `00`**: **`v01.xx.*` → `v02.00.*`** (same idea as semver: new prod major line starts at **`.00`**). Council documents any deliberate exception in `CHANGELOG` + `minidapp_version_log.md`.

**How to know which build you are holding**

1. **Stage** is declared explicitly on the artifact: **zip name**, **`dapp.conf`**, **`runtime-config.js`**, and/or release notes (`stage: showcase | demo | test | prod`). The version alone does not replace that declaration if multiple segments are non-zero.
2. **Segment bump rule (Council default):** When you ship a release for a given **stage**, increment **that stage’s** two-digit group (for prod, choose **minor** vs **major** per the rule above). Leave other groups unchanged unless Council resets them on a promotion cut (document that in `CHANGELOG` + `minidapp_version_log.md`).
3. **Showcase line** still advances **SS** while **`PM.Pn.TT.DD`** stay **`00`** (e.g. next showcase **`v00.00.00.00.03`**). **Demo line** advances **DD** for demo-channel ships (**`v00.00.00.02.00`**, …) while other segments stay at Council-chosen values.

**Legacy four-segment form `vPP.TT.DD.SS`:** Still valid in older docs. Interpret **`PP`** as **`PM.Pn` collapsed only when both are zero**, i.e. **`v00.00.00.02` ≡ `v00.00.00.00.02`**. Once **`PM` or `Pn`** is non-zero, use the **five-segment** spelling (**`v01.00.00.00.00`**, **`v01.01.00.00.00`**, etc.).

**Legacy short form `vNN.NN.NN`:** During transition, **`v00.00.03`** means **`v00.00.00.00.03`** (showcase **SS = 03**, **`PM.Pn.TT.DD` all zero**). New work should prefer the **five-segment** label in docs and, when filenames change, **`Stables_v00.00.00.00.03_showcase.mds.zip`** style names (stage suffix optional but recommended for clarity).

**Demo vs test (token truth)**

- **Demo:** Stables / xWiniwa in the app are **mintable with Winiwa only** and are **not** on-chain tokens.
- **Test:** Winiwa / Wables (and related) are **real chain tokens** with **no official value**; not the same as **prod Stables**.

## Versioning policy (stages + shipping)

- Canonical **full** label: **`vPM.Pn.TT.DD.SS`**. Legacy **four-segment** **`vPP.TT.DD.SS`** and **short** **`vNN.NN.NN`** remain valid where **prod major and minor are both `00`** until Council retires them.
- Every shipped package/release note should include:
  - **Stage** (`showcase`, `demo`, `test`, or `prod`)
  - **Full label** (`vPM.Pn.TT.DD.SS`) and, if used, **short label**
  - **Source folder path** (showcase vs demo folder above)
- Folder path, internal `APP_BUILD_VERSION`, and zip naming should stay aligned with Council policy.

**Rules**

- **Two active product locations:** showcase **`dapp/`** ( **`1-showcase/`** + root **`assets/`** + **`dapp.conf`**; zip per **`dapp/build/README.md`**), demo **`dapp/2-demo/`**. The former **`prod_stables_app_v00.00.00.00.03/`** tree was **moved** to **`3_archive/stream_1_app/task_archived_prod_stables_app_v00_00_00_00_03_2026-04-15/`** (2026-04-15 consolidation); the former **`prod_stables_app_demo/`** folder was **moved** to **`3_archive/stream_1_app/task_archived_prod_stables_app_demo_2026-04-15/`**; nothing was deleted.
- **`2_current`**: only the user promotes; agents do not move trees there without explicit approval.
- **Zip**: **showcase** per **`dapp/build/README.md`** (staging allowlist from **`dapp/`** root; omit **`2-demo/`**, **`3-test/`**, **`4-prod/`**, **`1-showcase/latest-version/`**); **demo** from **`dapp/2-demo/`** — see `handshake.md` **Packaging Rule**; exclude each **`build/`** from the archive.
- **Freeze workflow:** move retired tree → `3_archive/stream_1_app/…`, add `FROZEN.md`, bump active paths + `dapp.conf` / `APP_BUILD_VERSION`, append **Unreleased** section in `CHANGELOG.md` (never permanently delete project files).

**Last bumped:** **2026-04-16** — **Channel folders** on disk and on Pages: **`1-showcase/`**, **`2-demo/`**, **`3-test/`**, **`4-prod/`** (ordered labels; URLs e.g. **`/dapp/1-showcase/`**). Showcase **2026-04-09** — **SS** advanced to **03** (**`v00.00.03`** / **`v00.00.00.00.03`**); active hub path **`dapp/`**; Pages showcase package **`Stables_v00.00.00.00.03.mds.zip`** under **`dapp/1-showcase/latest-version/`**. Older showcase **`.mds.zip`** files: **`3_archive/stream_1_app/task_archived_dapp_showcase_previous_mds_2026-04-16/`**. Per-channel **previous-versions** documentation: **`3_archive/stream_1_app/task_archived_dapp_channel_previous_versions_2026-04-16/dapp/`** only (removed from active **`dapp/`** **2026-04-16** cleanup). **Parity indexes:** **`2_current/stream_1_app/dapp/`**, **`3_archive/stream_1_app/dapp/`** (four channel READMEs). Former root **`dapp/latest-version/`** and **`dapp/previous-versions/`** redirect stubs **retired 2026-04-16** → **`3_archive/stream_1_app/task_archived_dapp_root_redirect_stubs_2026-04-16/`**. **Demo tree:** **v00.00.00.01.00**, **`dapp/2-demo/`**. **Test** / **prod** shells: **`dapp/3-test/`**, **`dapp/4-prod/`**. **Council cuts 2026-04-15:** **`prod_stables_app_demo/`** and **`prod_stables_app_v00.00.00.00.03/`** **moved** to **`3_archive/stream_1_app/`** ( **`FROZEN.md`** ). **Policy:** five-segment **vPM.Pn.TT.DD.SS** in **handshake.md** and **.cursor/rules/stables-handshake.mdc**.
