# MiniDapp version log (local)

**Purpose:** Single place in this repo to record **what shipped under each published label** versus **what exists only in the active dev tree** after that cut. Use this before writing Telegram/X copy or editing `stablescouncil.github.io/dapp/latest-version/VERSION_HISTORY.md`.

**Public mirror (after push):**  
`https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/latest-version/VERSION_HISTORY.md`

---

## Published: `v00.00.03` / `v00.00.00.00.03` (showcase third drop)

**Stage / channel:** showcase  
**Declared label (short):** `v00.00.03`  
**Declared label (full, five-segment):** `v00.00.00.00.03`  
**Package:** `Stables_v00.00.00.00.03.mds.zip` in **`dapp/latest-version/`** on [stablescouncil.github.io](https://github.com/StablesCouncil/stablescouncil.github.io)  
**Prior showcase zip moved to:** `dapp/previous-versions/Stables_v00.00.02.mds.zip` (second showcase numbered drop)

**Included in this drop (summary):**

- Five-segment versioning and top bar **Showcase · v00.00.00.00.03** aligned with handshake **`minidapp_version.md`**
- Mint xWiniwa chart: fetch timeouts, MDS HTTP status handling, synthetic fallback so the chart does not stick on **Loading…**
- Dev folder **`prod_stables_app_v00.00.00.00.03`** (path matches **SS = 03**)

**Note:** **The Stables Academy** and other post-cut experiments may still be present in the web tree; Council comms should follow **Included / not part of** lists below for older labels when attributing features.

---

## Published: `v00.00.02` (internal shorthand “v2”)

**Stage / channel:** showcase  
**Declared label (short):** `v00.00.02`  
**Declared label (full, stage-aware):** `v00.00.00.00.02` (five-segment; legacy form `v00.00.00.02` = same thing; see `minidapp_version.md`)  
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

## Active dev — showcase line

**Folder:** `1_development/stream_1_app/prod_stables_app_v00.00.00.00.03/` (showcase **SS = 03**; renamed from `prod_stables_app_v00.00.02` then `…00.00.02`)  
**Current `CHANGELOG.md`:** Keep **post–v00.00.00.00.03** showcase items under **`[Unreleased]`** until you bump **SS** again and publish a new showcase zip.

**Rule:** When you publish the next **showcase** zip, add a row to `VERSION_HISTORY.md` (if using Pages), bump `dapp.conf` / `APP_BUILD_VERSION` / pill, and move the matching `CHANGELOG` section from Unreleased to a dated released section.

---

## Active dev — demo line (scaffold, not yet a published zip)

**Folder:** `1_development/stream_1_app/prod_stables_app_demo/`  
**Full label:** `v00.00.00.01.00` · **`stage: demo`** · **`APP_STAGE: demo`** in `runtime-config.js`  
**Origin:** Forked from showcase (`prod_stables_app_v00.00.02`, now **`prod_stables_app_v00.00.00.00.03`**) to start the **demo** channel (see `minidapp_version.md` routing).

**Published:** none yet (no row in `VERSION_HISTORY` until Council ships `Stables_v00.00.00.01.00_demo.mds.zip` or equivalent).  
**`CHANGELOG.md`:** demo-specific and shared work intended for the demo channel.

---

## Quick checklist before calling something “v2” / v00.00.02 in comms

1. Open this file and confirm the feature is listed under **Included** for `v00.00.02`, not under **not part of**.
2. Match `CHANGELOG.md` released section for that label.
3. Match `dapp/latest-version/VERSION_HISTORY.md` on Pages (after push).
