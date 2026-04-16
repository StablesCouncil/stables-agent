# MiniDapp version log (local)

**Purpose:** Single place in this repo to record **what shipped under each published label** versus **what exists only in the active dev tree** after that cut. Use this before writing Telegram/X copy or editing `stablescouncil.github.io/dapp/1-showcase/latest-version/VERSION_HISTORY.md`.

**Public mirror (after push):**  
`https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/dapp/1-showcase/latest-version/VERSION_HISTORY.md`

---

## Published: `v00.00.03` / `v00.00.00.00.03` (showcase third drop)

**Stage / channel:** showcase  
**Declared label (short):** `v00.00.03`  
**Declared label (full, five-segment):** `v00.00.00.00.03`  
**Package:** `Stables_v00.00.00.00.03.mds.zip` in **`dapp/1-showcase/latest-version/`** on [stablescouncil.github.io](https://github.com/StablesCouncil/stablescouncil.github.io)  
**Prior showcase zip archived:** `3_archive/stream_1_app/task_archived_dapp_showcase_previous_mds_2026-04-16/Stables_v00.00.02.mds.zip` (second showcase numbered drop; was under **`dapp/1-showcase/previous-versions/`** before **2026-04-16**)

**Included in this drop (summary):**

- Five-segment versioning and top bar **Showcase · v00.00.00.00.03** aligned with handshake **`minidapp_version.md`**
- Mint xWiniwa chart: fetch timeouts, MDS HTTP status handling, synthetic fallback so the chart does not stick on **Loading…**
- Dev tree **`dapp/`** (showcase hub slice; former **`prod_stables_app_v00.00.00.00.03/`** archived **2026-04-15**)

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

**Folder:** `1_development/stream_1_app/dapp/` (**`1-showcase/`**, root **`assets/`**, **`dapp.conf`**; hub zip **`dapp/build/README.md`**)  
**Council cut (2026-04-15):** Former parallel dev folder **`prod_stables_app_v00.00.00.00.03/`** **moved** to **`3_archive/stream_1_app/task_archived_prod_stables_app_v00_00_00_00_03_2026-04-15/prod_stables_app_v00.00.00.00.03/`** with **`FROZEN.md`**.  
**Current `CHANGELOG.md`:** **`dapp/CHANGELOG.md`** — keep **post–v00.00.00.00.03** showcase items under **`[Unreleased]`** until you bump **SS** again and publish a new showcase zip.

**Rule:** When you publish the next **showcase** zip, add a row to `VERSION_HISTORY.md` (if using Pages), bump `dapp.conf` / `APP_BUILD_VERSION` / pill, and move the matching `CHANGELOG` section from Unreleased to a dated released section.

---

## Active dev — demo line (scaffold, not yet a published zip)

**Folder:** `1_development/stream_1_app/dapp/2-demo/`  
**Full label:** `v00.00.00.01.00` · **`stage: demo`** · **`APP_STAGE: demo`** in `runtime-config.js`  
**Origin:** Forked from showcase (legacy **`prod_stables_app_v00.00.02`**, then **`prod_stables_app_v00.00.00.00.03`**, now **`dapp/`** + **`dapp/1-showcase/`**) to start the **demo** channel (see `minidapp_version.md` routing).

**Council cut (2026-04-15):** The former parallel dev folder **`prod_stables_app_demo/`** was **moved** (not deleted) to **`3_archive/stream_1_app/task_archived_prod_stables_app_demo_2026-04-15/prod_stables_app_demo/`** with **`FROZEN.md`**. Active demo edits and demo **`.mds.zip`** packaging use **`dapp/2-demo/`** only.

**Published:** none yet (no row in `VERSION_HISTORY` until Council ships `Stables_v00.00.00.01.00_demo.mds.zip` or equivalent).  
**`CHANGELOG.md`:** `dapp/2-demo/CHANGELOG.md` for demo-specific and shared work intended for the demo channel.

---

## Quick checklist before calling something “v2” / v00.00.02 in comms

1. Open this file and confirm the feature is listed under **Included** for `v00.00.02`, not under **not part of**.
2. Match `CHANGELOG.md` released section for that label.
3. Match `dapp/1-showcase/latest-version/VERSION_HISTORY.md` on Pages (after push).
