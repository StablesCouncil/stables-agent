# STABLES SESSION MAP
**Version**: 1.0  
**Status**: MANDATORY — Read this at the start of every session before any other file.  
**Purpose**: Single-entry navigator. Maps every file the AI must know, what it contains, and when to load it.

---

## HOW TO USE THIS FILE

1. **Full handshake review:** When the operator requires exhaustive calibration, open **`0_handshake/full_handshake_agent_command.md`** and execute its **Instruction block** before any work (canonical ordered procedure). Otherwise, complete **`handshake.md` [Step 0]** every session, in order: **`README.md`** → **`session_map.md`** (this file) → **`global_knowledge_base.md`**, then **[Step 0c]** — read the full **`2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt`** (StablesAgent / public KB parity). No exceptions.
2. Based on the task type (see Section 3), load the required files in order (the KB index in **`global_knowledge_base.md`** summarizes layer priority).
3. Never start work without confirming which files govern the task at hand.
4. **Protocol economics** (mint, burn, xMinima, fees, CR, treasury, protocol copy): follow **`handshake.md` [Step 0b] Protocol Truth Refresh** — read `protocol_mechanics_spec.md` **before** relying on narrative elsewhere; it overrides conflicting prose.

---

## 1. THE FULL FILE MAP

### LAYER 0 — SESSION ENTRY (Always load)

| File | Location | Purpose |
|------|----------|---------|
| `full_handshake_agent_command.md` | `0_handshake/` | **Full calibration trigger:** canonical ordered steps and paste text so any agent runs the complete handshake review. |
| `session_map.md` | `0_handshake/` | **This file.** Master navigator. |
| `global_knowledge_base.md` | `0_handshake/` | **Global KB index:** layer order (Charter → mechanics → master ref → brain → app → comms), tie-breakers, promotion, refresh one-liner. |
| `llms.txt` | `2_current/stream_3_governance/prod_stablesagent-brain-base/` | **Step 0c — full public KB** (rollup of all brain `*.md` here). Same holistic corpus as StablesAgent; rebuild via `build_llms_txt.js` after editing sources. |
| `handshake.md` | `0_handshake/` | Governance rules, directory structure, identity rules, communication principles, Git/server config. The law. |
| `stables_master_reference.md` | `0_handshake/` | Economic model, project state, locked terminology, all platform links, content strategy. The brain. |

### LAYER 1 — VISUAL & UI WORK (Load when building anything visual)

| File | Location | Purpose |
|------|----------|---------|
| `visual_identity_spec.md` | `0_handshake/` | Exact colours, typography, background formulas, image generation prompts. LOCKED. |
| `web_component_spec.md` | `0_handshake/` | Every reusable HTML/CSS component. Buttons, badges, layouts, page shell template. **The UI building law. Read before writing a single line of CSS.** |
| `minidapp_version.md` | `0_handshake/` | **Which `prod_stables_app_*` folder is active**, frozen zip locations, **canonical label `vPM.Pn.TT.DD.SS`**, prod major/minor rules. Read before editing MiniDapp paths or releases. **Agent rule:** `.cursor/rules/stables-handshake.mdc` § Development versioning. |
| `minidapp_version_log.md` | `0_handshake/` | **Shipped vs dev scope** per published label (e.g. what counts as v00.00.02 vs post-cut features). Use before comms. |
| `app_ui_inventory.md` | `0_handshake/` | **MiniDapp UI map**: every `page-*` screen, sections, patterns; plus **every `<button id>`** and **modal/overlay** root `id` in the active `prod_stables_app_*/index.html` (see `minidapp_version.md`). Update when routes or chrome change. |
| `stables.css` | `1_development/stream_3_governance/task_x_agent_node/` | The executable CSS. Tokens extracted from live site 2026-03-11. Never duplicate locally. Never derive tokens from archived presentation files. |
| `prod_brand_masters/` | `2_current/stream_1_app/` | **Brand source of truth**. The ONLY allowed origin for logos/icons/wordmarks. Derive exports into `1_development/` as needed. |

> **Token source of truth**: the live site `https://stablescouncil.github.io/` — not any file in `3_archive/`.
> If you are unsure whether tokens are current, re-fetch the live site CSS before building.

### LAYER 2 — PROTOCOL & ECONOMICS (Load when discussing mechanics)

| File | Location | Purpose |
|------|----------|---------|
| `protocol_mechanics_spec.md` | `0_handshake/` | Mint/burn/redemption rules, CR threshold logic. Do not re-debate. |
| `current_state_and_path.md` | `2_current/stream_3_governance/prod_protocol_specs/` | Strategic north star. Where we are and where we are going. |
| `internal master roadmap v1.md` | `2_current/stream_3_governance/prod_protocol_specs/` | Full project roadmap. |

### LAYER 3 — COMMUNITY & CONTENT (Load when writing for the public)

| File | Location | Purpose |
|------|----------|---------|
| `multi_platform_content_strategy.md` | `2_current/plan/` | Platform hierarchy, tone per channel, posting schedule. |
| `platform_tone_guide.md` | `2_current/plan/` | Per-platform tone rules (Instagram vs X vs Telegram etc.). |
| `links.md` | `0_handshake/` | All official Stables URLs in one place. Reference before writing any link. |
| `handshake.md` §4 | `0_handshake/` | **X/Twitter:** mandatory hashtags (`#BYB #Stablecoin #Minima` + add-ons per §4), no hashtags in Telegram, no em dash (—). Load before drafting X posts or social templates. |

### LAYER 4 — STABLESAGENT BRAIN (Load when working on the agent or its knowledge)

| File | Location | Purpose |
|------|----------|---------|
| `comprehensive_knowledge_base.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | Full public knowledge for the agent. |
| `core_definitions.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | Key terms and definitions. |
| `banking_system_overview.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | How the banking system works. |
| `constitutional_overview.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | Founding rules overview. |
| `website_presentation.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | Content of the public presentation. |
| `README.md` | `1_development/stream_3_governance/task_stablesagent-brain-base/` | Brain sync rules and deployment steps. |

### LAYER 5 — AGENT CODE (Load when modifying the Telegram/web agent)

| File | Location | Purpose |
|------|----------|---------|
| `telegram_agent.js` | `1_development/stream_3_governance/task_x_agent_node/` | Telegram bot logic. |
| `web_agent.js` | `1_development/stream_3_governance/task_x_agent_node/` | Web chat HTTP server. |
| `moltbook_agent.js` | `1_development/stream_3_governance/task_x_agent_node/` | Moltbook heartbeat: posts, replies to comments. StablesAgent at https://www.moltbook.com/u/stablesagent |
| `web_chat.html` | `1_development/stream_3_governance/task_x_agent_node/` | Browser chat console UI. |
| `ingest_knowledge.js` | `1_development/stream_3_governance/task_x_agent_node/` | Rebuilds vector_db.json from brain markdowns. |
| `stables.css` | `1_development/stream_3_governance/task_x_agent_node/` | Shared CSS. Always deploy alongside HTML files. |

### LAYER 6 — APP SOURCE (Load when working on the MiniDapp)

| File | Location | Purpose |
|------|----------|---------|
| `index.html` | `1_development/stream_1_app/prod_stables_app_v00.00.00.00.03/` and `…/prod_stables_app_demo/` | Single-file MiniDapp sources: **showcase** + **demo** trees (`0_handshake/minidapp_version.md`). |
| `stables_spa/` | `1_development/stream_1_app/stables_spa/` | **Vite + React + TypeScript** app shell — components, features, `npm run build` → `dist/`. See `stables_spa/ARCHITECTURE.md`. |

### LAYER 7 — PRESENTATION (Load when working on the public presentation)

| File | Location | Purpose |
|------|----------|---------|
| `index.html` | `2_current/stream_2_community/` *(canonical)* | Live presentation source for stablescouncil.github.io. |
| `index.html` | `3_archive/stream_2_community/prod_old_presentations/Presentation V1.0/public_stage/` | Archive of V1.0 for reference. |
| **`task_stablescouncil_github_io/`** (tree) | `1_development/stream_1_app/task_stablescouncil_github_io/` | **GitHub Pages static site sandbox**. **Authoring:** hand-maintained pages under **`webpages/pages/<slug>/`** (one folder per static route) and **`webpages/dapp/`** (mirrors `/dapp/showcase`, `/dapp/demo`, …). **`npm run sync:site`** runs **`tools/sync-site.mjs`**: merges **`static/`** then **`webpages/`** into **`site/`** only (no duplicate public tree at this folder’s root). Ship **`site/`** contents to the Pages repo root. **Eleventy**: `package.json`, **`.eleventy.js`**, **`src/`**, **`npm run build`**. **Not** a `prod_*` folder. Nested **`git`** for pushes: **`3_archive/.../stablescouncil.github.io/`** (`README.md` there). |

### LAYER 8 — CREDENTIALS & LEDGER (Load when committing or deploying)

| File | Location | Purpose |
|------|----------|---------|
| `vault.md` | `2_current/stream_3_governance/prod_credentials/` | All project accounts, tokens, server access. |
| `ledger.md` | `2_current/stream_3_governance/prod_project_ledger/` | Every change must be logged here with a Point ID after commit. |
| `mysql_readonly_access_procedure.md` | `2_current/stream_3_governance/prod_minima_archive_admin/` | **Minima archive MySQL (read-only analysts, internal):** admin steps, Workbench SSH tunnel, per-user grants, revoke. |
| `mysql_readonly_access_procedure_community.md` | `2_current/stream_3_governance/prod_minima_archive_admin/` | **Same topic, GitHub-safe copy:** generic placeholders, no internal paths; share publicly after testing. |
| `minima_mysql_full_archive_procedure.md` | `2_current/stream_3_governance/prod_minima_archive_admin/` | **Full MySQL parity + continuous updates:** wipe/reload when low blocks missing, `linuxuser`/`sudo` backup, autobackup + `mysqlcoins`, journal checks, `txpow` notes. |

---

## 2. SERVER & DEPLOYMENT REFERENCE (Always available without loading files)

| Resource | Value |
|----------|-------|
| **Vultr server IP** | `140.82.36.166` |
| **SSH user** | `root` |
| **Agent directory** | `/root/stables-agent/` |
| **PM2 Telegram agent** | `pm2 restart stables-telegram-agent` |
| **PM2 Web agent** | `pm2 restart stables-web-agent` |
| **GitHub Pages repo** | `https://github.com/StablesCouncil/StablesCouncil.github.io` |
| **Public presentation** | `https://stablescouncil.github.io/` |
| **Council GitHub token** | In `vault.md` |

---

## 3. TASK → FILE MATRIX (What to load for each task type)

| Task | Load these layers |
|------|-------------------|
| General session start | 0 always |
| Build or edit any web UI | 0 + 1 |
| Write community content / social posts | 0 + 3 |
| Discuss or update protocol economics | 0 + 2 |
| Update StablesAgent brain | 0 + 4, then follow sync steps in brain README |
| Modify Telegram or web agent code | 0 + 5 |
| Work on the MiniDapp | 0 + 6 |
| Work on the public presentation | 0 + 1 + 7 |
| Commit and log a change | 0 + 8 |
| Deploy to Vultr server | 0 + 5 + 8 |
| Configure or run backup to Vultr | 0 + 8, then `task_dev_utils/docs/BACKUP_README.md` |
| Grant read-only MySQL access to Minima archive DB | 0 + 8 + `2_current/stream_3_governance/prod_minima_archive_admin/mysql_readonly_access_procedure.md` |

---

## 4. THE PIPELINE RULE (Never skip this)

```
AI works in 1_development/
        ↓
User reviews and approves
        ↓
User promotes to 2_current/
        ↓
AI commits with Stables Council identity
        ↓
AI logs entry in ledger.md
        ↓
If public-facing: brain sync + pm2 restart
```

---

## 5. FORBIDDEN AT ALL TIMES

- Writing to `2_current/` without explicit user approval.
- Deleting any file (always archive to `3_archive/`).
- Pushing to any StablesCouncil repo without the Council token.
- Building any UI without reading Layer 1 files first.
- Inventing colours, fonts, or layout patterns not in `visual_identity_spec.md` or `web_component_spec.md`.
- Logging a change without a Git commit and a ledger entry.
