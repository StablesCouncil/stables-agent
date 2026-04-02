# MiniDapp version log (local)

**Purpose:** Single place in this repo to record **what shipped under each published label** versus **what exists only in the active dev tree** after that cut. Use this before writing Telegram/X copy or editing `stablescouncil.github.io/dapp/latest-version/VERSION_HISTORY.md`.

**Public mirror (after push):**  
`https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/latest-version/VERSION_HISTORY.md`

---

## Published: `v00.00.02` (internal shorthand “v2”)

**Channel:** showcase  
**Declared label:** `v00.00.02`  
**Package (when published):** `Stables_v00.00.02.mds.zip`  
**Pages reference commit (initial v00.00.02 drop):** `076c4ce` (subsequent Pages commits may add docs only; **do not** attribute post-cut app features to v00.00.02 without a new row in `VERSION_HISTORY.md` and a new zip label).

**Included in v00.00.02 scope (summary):**

- On/off ramp rebuild (Paper ↔ Stables), Mint deep links, legal/privacy and Minima dependencies copy
- Welcome flow adjustments (intro helper, contacts “later stage”, personalisation tweaks)
- Versioning alignment (`vNN.NN.NN`), showcase pill / runtime pointers
- Mint xWiniwa chart and related Mint UI work as logged for that release
- Invest → Maximize tab, welcome currencies/personalisation, branding/top bar behaviour **as shipped for that release**
- Amount inputs / Send–Receive modal balance hints **as shipped for that release**

**Explicitly not part of v00.00.02:**

- **The Stables Academy** (Help → Academy, Security questionnaire, demographics, certificate, share). That is **post–v00.00.02** development; it ships only under a **new** release label (e.g. `v00.00.03`) with matching zip + `VERSION_HISTORY` row + `CHANGELOG` section.

---

## Active dev (same folder, next label TBD)

**Folder:** `1_development/stream_1_app/prod_stables_app_v00.00.02/`  
**Current `CHANGELOG.md`:** Keep **Academy and any other post–v00.00.02** items under **`[Unreleased]`** (or `[00.00.03] — Unreleased`) until you bump version and publish.

**Rule:** When you publish the next zip, add a row to `VERSION_HISTORY.md`, bump `dapp.conf` / `APP_BUILD_VERSION`, and move the matching `CHANGELOG` section from Unreleased to a dated released section.

---

## Quick checklist before calling something “v2” / v00.00.02 in comms

1. Open this file and confirm the feature is listed under **Included** for `v00.00.02`, not under **not part of**.
2. Match `CHANGELOG.md` released section for that label.
3. Match `dapp/latest-version/VERSION_HISTORY.md` on Pages (after push).
