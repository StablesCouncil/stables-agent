# MiniDapp version pointer (agents)

**Read this when touching MiniDapp code, zips, or `dapp.conf` / `runtime-config.js`.**

**Published mirror (community, GitHub Pages repo):**  
[github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/MINIDAPP_VERSIONING.md](https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/MINIDAPP_VERSIONING.md)

## Active trees (two folders)

| | |
|--|--|
| **Showcase** | `1_development/stream_1_app/prod_stables_app_v00.00.00.00.03/` |
| **Demo (primary new work)** | `1_development/stream_1_app/prod_stables_app_demo/` |

| Line | Short label | Full label `vPM.Pn.TT.DD.SS` | `APP_STAGE` / `dapp.conf` `stage` | Change log |
|------|-------------|------------------------------|-------------------------------------|------------|
| **Showcase** | **`v00.00.03`** | **`v00.00.00.00.03`** | **`showcase`** | `prod_stables_app_v00.00.00.00.03/CHANGELOG.md` |
| **Demo** | *(use full or `00.00.00.01.00` in files)* | **`v00.00.00.01.00`** | **`demo`** | `prod_stables_app_demo/CHANGELOG.md` |

| | |
|--|--|
| **Executable shell** | Each folder: `index.html` (`<style>` block) |
| **Local shipped vs dev (comms)** | `0_handshake/minidapp_version_log.md` |
| **UI inventory** | `1_development/stream_1_app/ui_inventory/app_ui_inventory.md` (paths for both lines) |
| **Frozen v0.01.01 (Showcase public baseline)** | `3_archive/stream_1_app/prod_stables_app_v0.01.01/` — see `FROZEN.md` inside. |
| **Frozen v0.2.11** | `3_archive/stream_1_app/prod_stables_app_v0.2.11/` |
| **Frozen v0.2.10** | `3_archive/stream_1_app/prod_stables_app_v0.2.10/` + zip `…/build/Stables_v0.2.10.mds.zip` |
| **Dev zip (showcase)** | `prod_stables_app_v00.00.00.00.03/build/Stables_v00.00.00.00.03.mds.zip` |
| **Dev zip (demo)** | `prod_stables_app_demo/build/Stables_v00.00.00.01.00_demo.mds.zip` (see `build/README.md`) |

### Routing (agents)

- **Default:** implement new features in **`prod_stables_app_demo`** unless the task is **showcase-only** (synthetic line, no demo semantics).
- **Both channels:** land the change in **demo** first when it applies to both, then **port** to showcase only if **synthetic-safe** (no demo-only chain or token-truth wiring). Reverse for a showcase hotfix that must not affect demo yet.
- **Config:** `assets/config/runtime-config.js` → **`APP_STAGE`** (`showcase` \| `demo` \| `test` \| `prod`) drives the top bar pill with **`APP_BUILD_VERSION`**. Optional **`stage`** in `dapp.conf` for human-readable channel (hub may ignore unknown keys).

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

- **Two active folders:** showcase **`prod_stables_app_v00.00.00.00.03`**, demo **`prod_stables_app_demo`**. Do not archive either without a Council cut logged in `minidapp_version_log.md`.
- **`2_current`**: only the user promotes; agents do not move trees there without explicit approval.
- **Zip**: contents of the chosen `prod_…` folder only — see `handshake.md` **Packaging Rule**; exclude each folder’s `build/` from the archive.
- **Freeze workflow:** copy folder → `3_archive/stream_1_app/prod_stables_app_vX.Y.Z/`, add `FROZEN.md`, bump new `prod_*` folder + `dapp.conf` / `APP_BUILD_VERSION`, append **Unreleased** section in `CHANGELOG.md`, then remove old active folder (per line).

**Last bumped:** Showcase **2026-04-09** — **SS** advanced to **03** (**`v00.00.03`** / **`v00.00.00.00.03`**); folder **`prod_stables_app_v00.00.00.00.03`**; Pages **`latest-version`** package **`Stables_v00.00.00.00.03.mds.zip`**, prior **`Stables_v00.00.02.mds.zip`** in **`previous-versions`**. **Demo tree:** **v00.00.00.01.00**, **`prod_stables_app_demo`**. **Policy:** five-segment **vPM.Pn.TT.DD.SS** in **handshake.md** and **.cursor/rules/stables-handshake.mdc**.
