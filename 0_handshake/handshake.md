# STABLES: MANDATORY HANDSHAKE PROTOCOL (V10)
**Status**: ACTIVE / Unified
**Last Calibration**: 2026-04-16 (v15)

## 1. THE PERMANENT RULES (GOVERNANCE)
- **Single source of truth (ALL AGENTS AND OPERATORS):** Mandatory AI behaviour, Council workflow, server references, comms law, and operator notes (including IDE ergonomics such as background shell execution where supported) have **one** canonical home: **`0_handshake/handshake.md`**. Other files (**`0_handshake/README.md`**, **`session_map.md`**, **`global_knowledge_base.md`**, **`full_handshake_agent_command.md`**, **`.cursor/rules/*.mdc`**, host slash-command blurbs) **orient, index, or trigger reads**. **`full_handshake_agent_command.md`** is the **canonical ordered procedure** for the **full handshake review** (what to read, in what order, and how to confirm). It **must not** contradict **`handshake.md`**. If anything disagrees with `handshake.md`, **`handshake.md` wins.** Change the law here first; procedure changes go into **`full_handshake_agent_command.md`** then cross-references here as needed.
- **Stables Protocol**: All project activities must occur in three dedicated streams:
    - `stream_1_app`: MiniDapp code and assets.
    - `stream_2_community`: Community content and infographics.
    - `stream_3_governance`: Roadmaps, specs, and logistics.
- **The three root folders (canonical — this is the whole monorepo rhythm):** Under the repo root there are exactly **three** numbered phase directories. **Infrastructure work is not wasted** when this contract is followed: dev → ship/promote → optional archive. Nothing else defines where work belongs.
    - **`1_development/` — Workshop (where we work).** All **active** authoring: `task_*` sandboxes, GitHub Pages sources (**`task_stablescouncil_github_io/github_pages_root/`**), the on-site MiniDapp tree (**`stream_1_app/dapp/`**), drafts, experiments, tooling you are changing **today**. **Agents and operators perform edits here by default.** You **build** the public site from here (`npm run sync:site`, then push to **`stablescouncil.github.io`**); you **author** the MiniDapp here; you **draft** governance and brain Markdown here before promotion.
    - **`2_current/` — Public-aligned ledger (what the world and operators must trust).** User-validated **`prod_*`** material that **tracks what is public or production-critical**: promoted **GitHub Pages repo-root mirror** (**`prod_stablescouncil_github_pages_root/`**), **StablesAgent** corpus (**`prod_stablesagent-brain-base/`** — ingestion reads **only** here after promotion), protocol specs, brand masters, credentials vault, **`2_current/plan/`** social and content strategy, runbooks for live systems. **Agents do not silently write under `2_current`**; the user **promotes** after validation. **Mnemonic:** if a stranger, a bot, or a server should cite it as “what Stables runs or shows,” the promoted copy belongs here.
    - **`3_archive/` — Warehouse (cold storage, not the product).** **Never permanently delete** Council trees: **move** the whole folder here with a dated name (see **No permanent deletion** below). **Not** a second workshop: **do not** ship from archive, **do not** sync or ingest from archive by default, **do not** treat paths here as current truth. Use for **history, recovery, and forensic reference** only. (Colloquially: the attic — **out of the daily loop**, even though nothing is thrown away.)
- **Publication parity (`1_development` dev ↔ GitHub Pages ↔ public web ↔ `2_current`) — Council target state:** **`1_development`** is **dev** (where all active edits land). The **public site** (e.g. **`stablescouncil.org`**) and the **Pages repository** (**`StablesCouncil/stablescouncil.github.io`**, branch **`main`**) are **online** truth for what visitors pull. After the user **ships** from dev (push to Pages) and **validates** the live result, they **promote** the matching material into **`2_current`** so **local current** reflects **what is actually live**. **Goal:** for a given release, **GitHub (Pages), web, promoted paths under `2_current`, and the shipped slice of dev** describe the **same** Council-approved state (record **commit SHA**, version label, or paths in **`handover_document.md`** as the operator checklist). **`1_development` may advance immediately** on the next task; **`2_current`** updates at **promotion**, not by agent writes without explicit user approval. **Parity** is **logical** (same sources and shipped tree): regenerated **`site/`** under **`task_stablescouncil_github_io`** is produced only by **`npm run sync:site`** from those sources. **Brain ingestion** remains per **Knowledge Base Sync Rule** below: ingest only from **`2_current`** after promotion.
- **No permanent deletion (agents and operators)**: Do **not** permanently erase retired project trees or tracked content ("delete and forget"). To retire a directory, **move the entire folder** under **`3_archive/`**, preserving files and (when present) **`.git`**, using a dated name such as **`3_archive/<stream>/task_archived_<short_reason>_YYYY-MM-DD/`**. This is mandatory even when Git history exists, so bulky or nested-repo trees remain recoverable offline.
- **The Validation Pipeline (CRITICAL)**: AI Agents work exclusively in `1_development`. Before any code, asset, or document is published to GitHub or moved to `2_current`, the AI MUST explain the contents to the user and receive explicit approval. Do not bypass the user's review.
- **Zero Loose Files**: NO files are allowed at the root of the project or at the root of any stream/phase folder. Everything must be in a named `prod_` or `task_` folder. **Naming exception (public site mirror):** the entire live-site tree — including **`dapp/`** — is authored inside **`github_pages_root/`** (see Single Source rule below).
- **Documentation by Page (UI Parity)**: Within `stream_1_app/ui_inventory/`, all technical, functional, or economic documentation MUST be organized into numbered folders mirroring the app's UI hierarchy (e.g., `01_shops_exchange/02_ambassadors/`). This ensures every UI element mirrors its documentation in the directory tree. **CRITICAL**: When a page is added or the navigation order changes in `index.html`, the `ui_inventory` folder structure and [app_pages_ordered.md](file:///c:/Users/Charles/Documents/Stables/1_development/stream_1_app/ui_inventory/app_pages_ordered.md) MUST be updated immediately to maintain 1:1 parity between the code and the documentation hierarchy.
- **Atomic Folder Rule**: 
    - `task_[description]`: For active/sandbox work.
    - `prod_[description]`: For stable, finalized deliverables.
- **GitHub Pages static site (naming exception)**: **Authoring** (HTML, static assets, sync tooling) lives only at **`1_development/stream_1_app/task_stablescouncil_github_io/`** (not under a MiniDapp **`prod_stables_app_*`** product line). **`npm run sync:site`** writes the **flat** publish tree to **`task_stablescouncil_github_io/site/`** (generated; see that folder’s **`README.md`**). **Council target:** after you validate what is **live** online, **promote** that same Pages-root layout into **`2_current/stream_1_app/prod_stablescouncil_github_pages_root/`** so **`2_current`** holds the **promoted** mirror of the GitHub Pages repo root (run **`tools/promote-site-to-current.ps1`** from the task folder after **`sync:site`**, or copy **`site/`** contents manually). **Ship** to GitHub by copying **either** the fresh **`site/`** tree **or** the promoted **`prod_stablescouncil_github_pages_root/`** tree into the **`stablescouncil.github.io`** working copy root. The nested **git** checkout used for **`git push`** to the public Pages repo, when retired from the monorepo, is **moved under `3_archive/`** (not deleted). Operators push from **`git -C "<path-to-archived>/stablescouncil.github.io"`**, a fresh clone, or CI; see **`handover_document.md`**. **Public site pipeline (sources):** Author the static site under **`task_stablescouncil_github_io/github_pages_root/`** (same top-level names as the Pages repo root; see **`CANONICAL_LAYOUT.md`** in that folder). Author the **live `/dapp/`** tree at **`1_development/stream_1_app/dapp/`** (overlaid into **`site/dapp/`** on sync). Legacy **`webpages/pages`** was archived to **`3_archive/stream_1_app/task_archived_webpages_pages_2026-04-16/pages/`**; former **`static/`** ship files now live only under **`github_pages_root/`**. **Eleventy** (`@11ty/eleventy`): templates under **`src/`**; run **`npm run build`** when compiled templates change, then **`npm run sync:site`**. **Playing Field** is **`github_pages_root/playing_field.html`**. Contracts and CSS order: **`0_handshake/web_component_spec.md`** (section *GitHub Pages site — Eleventy*).
- **Page Structure Law for `stablescouncil.org` (HARD RULE — 2026-04-18):** The URL pattern of every page under `github_pages_root/` is governed by this law. **Violation is a structural error; agents must correct it rather than perpetuate it.**
    - **Single-page content → named `.html` file at root.** If a section of the site is a single, standalone HTML page with no sub-pages, it lives directly in `github_pages_root/` as `pagename.html` (e.g. `playing_field.html`, `bankingsystem.html`, `circulareconomy.html`, `links.html`, `ambassadorsprogramdesc.html`, `qr-code.html`). **Never put a single page inside its own folder as `folder/index.html`.**
    - **Multi-page areas → folder with `index.html`.** If a section has sub-pages or sub-routes, it gets a folder (e.g. `devtools/`, `dapp/`). The folder hub is `folder/index.html`; sub-pages are `folder/subpage/index.html` or `folder/subpage.html` per the same rule recursively.
    - **Homepage** is always `index.html` at the root. No exceptions.
    - **Redirect stubs are mandatory at old URLs.** Whenever a page is moved (e.g. `bankingsystem/index.html` → `bankingsystem.html`), the old location **must** retain a minimal HTML meta-refresh + JS redirect to the new canonical URL. This preserves all existing links. Redirect stubs are permanent; never delete them.
    - **`og:url` must reflect the canonical URL** (the new location, not the old). Update it whenever a page moves.
    - **`staticRoot` in the `file://` preview block** must match the page's depth: `"./"` for pages at root, `"../"` for pages one level deep, etc.
    - **Canonical structure as of 2026-04-18:**
      ```
      github_pages_root/
      ├── index.html                    ← homepage
      ├── playing_field.html            ← single page
      ├── bankingsystem.html            ← single page (was bankingsystem/index.html)
      ├── circulareconomy.html          ← single page (was circulareconomy/index.html)
      ├── links.html                    ← single page
      ├── ambassadorsprogramdesc.html   ← single page
      ├── qr-code.html                  ← single page
      ├── devtools/                     ← multi-page area (has sub-pages)
      ├── dapp/                         ← multi-page product
      ├── bankingsystem/index.html      ← REDIRECT STUB ONLY → /bankingsystem.html
      ├── circulareconomy/index.html    ← REDIRECT STUB ONLY → /circulareconomy.html
      ├── assets/
      ├── brand/
      ├── stables.css
      ├── favicon.png
      └── CNAME
      ```
- **`2_current` Structural Parity Law (HARD RULE — 2026-04-18):** `2_current/stream_1_app/prod_stablescouncil_github_pages_root/` **must at all times be a structurally identical mirror of** `1_development/stream_1_app/task_stablescouncil_github_io/github_pages_root/`. Every file, folder, redirect stub, and asset that exists in `github_pages_root/` must have a corresponding copy in `prod_stablescouncil_github_pages_root/`, and vice versa. **Procedure after any structural change to `github_pages_root/`:** immediately copy the changed files into the matching path under `prod_stablescouncil_github_pages_root/`. Agents are authorised to write to `prod_stablescouncil_github_pages_root/` when executing a user-approved structural sync — this is the one explicit exception to the general "agents do not write to `2_current`" rule. The rationale: `2_current` must be publish-ready at all times so the site can be pushed directly from it without re-running a build step.
- **Active MiniDapp trees:** **Showcase** — `1_development/stream_1_app/task_stablescouncil_github_io/github_pages_root/dapp/` ( **`1-showcase/index.html`**, root **`dapp.conf` `web`** = **`1-showcase/index.html`**; root **`index.html`** redirect where present). **Demo (default for new product work)** — `github_pages_root/dapp/2-demo/`. **Version pointer, routing, zips:** `0_handshake/minidapp_version.md`. **Optional porting ledger** (lead vs downstream: prod → test → demo → showcase): `github_pages_root/dapp/PORTING_GAP.md` — Council uses this when tracking what still needs porting without diffing four trees; defaults and agent routing stay in **`minidapp_version.md`**.
- **MiniDapp Versioning Policy (MANDATORY)**:
    - Use four **stages** in communications and release notes: **showcase**, **demo**, **test**, **prod** (see `0_handshake/minidapp_version.md` for on-chain scope per stage).
    - **Canonical full release label:** `vPM.Pn.TT.DD.SS` (five groups, **two digits each**): **Prod major . Prod minor . Test . Demo . Showcase**, read left to right. Example showcase-only line: **`v00.00.00.00.03`**. Legacy four-segment **`v00.00.00.03`** is equivalent to **`v00.00.00.00.03`** (prod pair implicit **`00.00`**).
    - **Prod pair rule:** **`Pn`** (minor) is for **optional** slight / patch increments on the same prod major (**`01.01` → `01.02`**). When **`PM`** (prod major) increments, **`Pn` MUST reset to `00`** (**`01.xx` → `02.00`**, not `02.xx` unless Council explicitly documents an exception).
    - **Legacy short label** `vNN.NN.NN` remains valid as shorthand for showcase-only lines during transition (e.g. **`v00.00.03`** = **`v00.00.00.00.03`**).
    - Every shipped package should declare **stage** explicitly (zip name, `dapp.conf`, `runtime-config.js`, or release notes); the version records which track incremented.
    - **Showcase** line: **`v00.00.03`** / **`v00.00.00.00.03`**. **Demo** line: **`v00.00.00.01.00`** (folder **`dapp/2-demo/`** under **`stream_1_app/dapp/`**). See `minidapp_version.md` for bumps and porting rules.
    - Folder names may temporarily keep legacy numbering while migration is in progress; the authoritative mapping (folder path ↔ release label ↔ stage) lives in `0_handshake/minidapp_version.md`.
    - When uncertain, trust `minidapp_version.md` over inline examples elsewhere.
    - **Editor automation (optional):** `.cursor/rules/stables-handshake.mdc` § **Development versioning** mirrors this policy where Cursor loads that file; all environments use **`minidapp_version.md`** and this **`handshake.md`** section as authority.
- **MiniDapp Change Logging (MANDATORY)**: For **each** active MiniDapp folder you touch (showcase and/or demo), log **every user-visible change** in that folder’s `CHANGELOG.md` at the time the change is made. Do not postpone logging to release day.
- **Release README Rule (MANDATORY)**: Every pushed version package must include a `README.md` section titled **"What changed in this version"** that summarizes the exact changes shipped in that version, sourced from `CHANGELOG.md`.
- **Packaging Rule**: Zip the *contents* of the **chosen** product folder directly to create the `.mds.zip`. **Exclude** that folder’s **`build/`** directory (generated zips + notes). No file renaming inside the zip. **Showcase:** stage an allowlisted copy from **`1_development/stream_1_app/dapp/`** per **`dapp/build/README.md`** ( **`dapp.conf`** with **`web`** = **`1-showcase/index.html`**, sibling **`assets/`**, **`1-showcase/index.html`** only at hub slice, root art, optional root **`index.html`**; **omit** **`2-demo/`**, **`3-test/`**, **`4-prod/`**, **`1-showcase/latest-version/`**, and other non-hub paths). **Demo:** zip **`1_development/stream_1_app/dapp/2-demo/`** (self-contained tree: **`dapp.conf`** with **`web`** = **`index.html`**). See each **`build/README.md`**.
- **Brand Sovereignty**: All visual assets must derive from the official branding masters. NO AI-generated logos or "ad-hoc" modifications to symbols.
- **Visual Identity Enforcement (MANDATORY)**: When generating ANY visual element (images, infographics, social posts, diagrams, presentations), you MUST:
    1. Read `0_handshake/visual_identity_spec.md` FIRST if not already loaded this session.
    2. Use the **Image Generation Prompt Template** from the spec (Section "Quick Reference: Image Generation Prompts").
    3. Include ALL mandatory elements: dark navy background (#0b0f14), cyan radial glow, Inter font, "BUILT ON MINIMA" pill badge.
    4. NEVER generate an image without consulting the spec. There are NO exceptions.
    5. If the spec cannot be followed for a specific visual (e.g., diagrams, charts), state what deviations are being made and get user approval BEFORE generating.
- **Mobile-First Development**: All UI assets (MiniDapp, infographics, presentations) must be designed and tested for mobile (≤ 700px) first. Desktop layouts are additive enhancements. Never sacrifice mobile readability for desktop aesthetics. Every deliverable must render correctly on a single-column mobile viewport before being considered complete.
- **Locked Identity Terminology**:
    - Name: **Stables** (NOT "Stables Protocol")
    - Governance: **Council** (NOT "DAO")
    - Platform: **MiniDapp only** (NO website)
    - Slogan: **Be your bank**
    - Tagline: **Money that is truly yours. Secure, Pseudonymous and Unstoppable.**
- **Aesthetic**: Minimalist, high contrast (black, white, grays), institutional, secure, and modern financial technology.
- **Agent Identity**: The AI agent is StablesAgent. It operates as an evolving, dedicated assistant built to spread awareness, organically grow the community, and provide frictionless access to project knowledge. It is the Council's "first hire."
- **Communication Principles**:
  - **NEVER use the word "doctrine".** Use terms like "official papers," "knowledge base," "architectural rules," or "working papers."
  - **Positive Framing:** Never define Stables by what it is *not* (e.g., do not say "we don't build for you"). Speak only to what Stables *is*.
  - **Core Ethos:** Woven naturally into communications is the philosophy: *We build for all of us.* Growth in numbers is our strength.
- **UI Pre-Flight Verification**: Before ANY UI or Asset edit, the AI must state the MASTER FILE path and the EXACT STRINGS/RECIPES being used.
- **MINIMA Attribution**: Presentations and official documents must include "Built on MINIMA". Social media posts (Telegram, X) do not require explicit attribution as it is implied by the technical context.
- **Perpetual Restoration (The Ledger)**: Every modification must be committed to Git and logged in the Project Ledger (`stream_3_governance/prod_project_ledger/ledger.md`). No change is valid until it is indexed with a Point ID.
- **Knowledge Base Sync Rule (CRITICAL)**: The Agent's knowledge base MUST be maintained in `2_current/stream_3_governance/prod_stablesagent-brain-base/`. This is the brain of all external AIs and the Telegram/X agent. The ingestion process MUST only ever pull from the **Source of Truth** (`2_current`), never the sandbox (`1_development`). The full sync process is:
    1. **Edit in Sandbox**: Update brain markdown files in `1_development/stream_3_governance/task_stablesagent-brain-base/`.
    2. **Audit**: Ensure the sandbox edits reflect everything live on `stablescouncil.github.io` and the latest `2_current` protocol specs.
    3. **Promotion**: Once validated, the user promotes these files to `2_current/stream_3_governance/prod_stablesagent-brain-base/`.
    4. **Ingestion**: Only after promotion, the user runs `node ingest_knowledge.js` from the production deployment folder (`2_current/stream_3_governance/task_x_agent_node/`) to rebuild `vector_db.json` and `llms.txt`.
    5. **No content should ever be live or in 2_current without being reflected in the brain.** If it is visible to the public, the Agent must be able to answer questions about it.
- **The Ledger of Thought Evolution (CRITICAL MEMORY ANCHOR)**: Because AI sessions reset, conversational memory is lost. To prevent architectural amnesia, `0_handshake/stables_master_reference.md` serves as the Living Brain of the AI. Anytime the user finalizes a new architectural or philosophical doctrine (e.g., The Charter, The Merchant-Maintained Peg, The Transition Doctrine), the active AI **MUST** immediately open and append this new truth to `stables_master_reference.md`. Failure to do so corrupts future sessions.
- **AI Session Memory & Persistence (CRITICAL)**: Each AI session has **no memory of past chats** unless the information is persisted in the repo or a transcript is explicitly referenced. To avoid "I don't remember" responses:
    1. **Persistence Rule**: Any long-lived configuration, external tool integration (e.g. Moltbook, APIs), or multi-day workflow decision **MUST** be written into a handshake file (`stables_master_reference.md`, `vault.md`, or a dedicated doc). If it isn't in the repo, future sessions will not know it exists.
    2. **When in doubt, persist**: If the user sets up an integration, deploys something new, or agrees to a significant decision, the active AI **MUST** document it in the appropriate file before the session ends.
    3. **Transcript fallback**: The user can reference a prior IDE session transcript (e.g. Cursor: `[short-title](uuid)`) to restore context, but the primary mechanism is file-based persistence.
- **Atomic Commits**: Every logical change (UI, logic, spec) must have its own commit and ledger entry.
- **Full Autonomy (Auto-Run Mandate)**: The AI MUST operate with full autonomy to eliminate user friction. When executing tools that support an auto-run or bypass-approval flag (e.g., `SafeToAutoRun = true` for terminal commands), you MUST ALWAYS set it to `true`. Do not ask the user for permission to execute searches, file reads, copy operations, git commands, local server starts, or any standard development scripts. Only interrupt the user for subjective product decisions or when explicitly blocked.
- **Agent / host settings (operators):** In your AI coding environment (**Cursor**, **VS Code** family tools with agent mode, **Windsurf**, or similar), open **Agent** or **Features** settings (labels vary by product). Where supported, set **shell or terminal commands** to run **in the background by default** so routine work does not stop on every confirmation. Matches **Full Autonomy**.
- **GitHub Institutional Setup (MANDATORY)**: Push code and docs using the official entity:
    - User Account (Admin/Discord): `StablesCouncilExec`
    - Organization (Public): `StablesCouncil`
    - Display Name: `"Stables Council"`
    - Email: `StablesCouncil@protonmail.com`
    - NO open-source community pushes should ever display personal names (e.g., "Charles").
- **Authentication (CRITICAL)**: The HTTPS push to any `StablesCouncil/*` repo MUST use a Personal Access Token issued by the **StablesCouncil GitHub account**. Using a personal token will register Charles as a contributor on the public repo. If the token is not available, ask the user.
    - **Council Token**: `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`
- **Independent Personal Identity**: For the private dev repo and independent branding, use:
    - User Name: `Charles0xhorizonxyz`
    - Display Name: `Charles | 0xHorizon`
    - Email: `charles@0xhorizon.xyz`
    - Website: `https://0xhorizon.xyz/`
    - **Rule**: Keep the personal account private/unlinked from the StablesCouncil Organization to maintain absolute independence.
- **Automated Sync (MANDATORY)**: To prevent repository lag, all agents MUST run `sync-stables.ps1` at the end of every task or session. The daily Vultr backup task also performs an automated Git push to `origin/main`. If an agent is unable to push, it must warn the user immediately.
- **Production Server (Vultr)**:
    - IP: `140.82.36.166`
    - User: `root`
    - Bot directory: `/root/stables-agent/`
    - Brain path: `/root/stables-agent/task_stablesagent-brain-base/`
    - Agent path: `/root/stables-agent/task_x_agent_node/`
    - Process manager: PM2
    - Apps: `stables-telegram-agent` (Telegram bot), `stables-web-agent` (web chat at agent.stablescouncil.org)
    - To deploy updated brain: `scp` the changed `.md` files and `vector_db.json` to the server, then `pm2 restart stables-telegram-agent`
    - To restart web agent (e.g. after `web_agent.js` update): `pm2 restart stables-web-agent`
- **Minima archive / MySQL read-only access (Council admin):** Canonical runbook for per-person `SELECT`-only users, MySQL Workbench over SSH, analyst password change, and revoke: `2_current/stream_3_governance/prod_minima_archive_admin/mysql_readonly_access_procedure.md`. Also listed in `0_handshake/README.md` (file map) and `session_map.md` (Layer 8 + task matrix).
- **Minima archive / MySQL full parity + continuous export:** Wipe/reload when low blocks are missing, `sudo mysqldump` as `linuxuser`, both autobackups, log checks: `2_current/stream_3_governance/prod_minima_archive_admin/minima_mysql_full_archive_procedure.md`.

## 2. THE CALIBRATION WORKFLOW (/handshake)
To start any session or when context-drift is suspected, perform the following steps:

**Full handshake review (any external or internal agent):** The operator instructs the agent to open **`0_handshake/full_handshake_agent_command.md`** and execute the **Instruction block** in that file end to end before any work. That file is the **single canonical procedure** for full calibration; the subsections below remain the normative breakdown of the same workflow inside **`handshake.md`**.

### [Step 0] Read the Entry Point FIRST (handshake KB — mandatory for every agent)
Before anything else, read these **three** files in order:
- **[README.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/README.md)**: Explains the purpose of this folder, what each file does, and the calibration order. Start here.
- **[session_map.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/session_map.md)**: The master navigator. It maps every file in the project, its purpose, and which files to load for which task. It also contains the server/deployment reference and the full pipeline rule. Without this, the session is not calibrated.
- **[global_knowledge_base.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/global_knowledge_base.md)**: The **handshake knowledge base index** — how layers stack (Charter → locked mechanics → master reference → brain → MiniDapp → comms), tie-breakers, promotion path, and which document wins on conflict. **Does not replace** the specs; use it to decide **which files to open next** for the task. Includes a one-line refresh command for operators.

### [Step 0c] StablesAgent parity — full public knowledge base (mandatory every session)
**Goal:** IDE agents carry the **same holistic picture** as **StablesAgent** in the app/Telegram: the promoted, user-facing knowledge corpus (what RAG retrieves from after ingest, and what external models get from a single file).

**Read the entire file (do not skim):**  
`2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt`

That rollup is built from every knowledge `*.md` in that folder (see `build_llms_txt.js`). If you edited those `.md` files and `llms.txt` looks stale, run **`node build_llms_txt.js`** in that directory, then read the regenerated `llms.txt`.

**Conflict rule:** Public brain prose can be simpler than internal specs. If anything in `llms.txt` disagrees with **`protocol_mechanics_spec.md`**, **`protocol_mechanics_spec.md` wins** once you run **[Step 0b]** — note the drift so the brain sources and `llms.txt` can be corrected on promotion.

### [Step 0b] Protocol Truth Refresh (MANDATORY for economics — reusable every session)
**Run this step whenever the task touches any of:** mint/burn, xMinima, stablecoins, Wables/Winiwa naming in protocol copy, coverage ratio, fees, Coverage Fund / cf tokens, treasury mechanics, correcting canonical docs, or **any public explanation of how Stables works**.

**Read in this order (do not skip, do not reverse):**
1. **`0_handshake/protocol_mechanics_spec.md`** — **Authoritative.** If any other document (including `stables_master_reference.md`) disagrees, **`protocol_mechanics_spec.md` wins.** Flag contradictions for Charles to fix in prose.
2. **`0_handshake/stables_master_reference.md`** — At minimum **§14 CORE PROTOCOL MECHANICS (LOCKED)** end-to-end (tables, equation with **cf tokens**, fee line: xMinima gets **zero** txn fees).
3. **Shipped UI names only if describing the MiniDapp:** **`0_handshake/minidapp_version.md`**, then the active `index.html` for the relevant action (e.g. Mint handlers).

**Charles / operator shortcut (paste at session start or before protocol work):**  
*`Protocol truth refresh per handshake Step 0b`*

**Agent confirmation after Step 0b:**  
*`Protocol truth loaded: protocol_mechanics_spec + stables_master_reference §14`* (add *`+ MiniDapp path`* if step 3 applied).

### [Step 1] Read the Master Specifications
Consult the following files representing the immutable specs of Stables:
- **[stables_master_reference.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/stables_master_reference.md)**: The core economic/technical logic.
- **[visual_identity_spec.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/visual_identity_spec.md)**: Color palettes, glassmorphism, and branding guidelines.
- **[protocol_mechanics_spec.md](file:///C:/Users/Charles/Documents/Stables/0_handshake/protocol_mechanics_spec.md)**: Detailed mint/burn/redemption rules.
- **[current_state_and_path.md](file:///C:/Users/Charles/Documents/Stables/2_current/stream_3_governance/prod_protocol_specs/current_state_and_path.md)**: The strategic North Star.
- **[vault.md](file:///C:/Users/Charles/Documents/Stables/2_current/stream_3_governance/prod_credentials/vault.md)**: Central repository for project accounts and bookmarks.

### [Step 2] Verify Economic Alignment
Acknowledge the settled economic model (Do NOT re-debate unless requested):
- **Equation**: `Minima = Stablecoins + cf tokens + xMinima`
- **CR Threshold**: 110% (Default). Stablecoin minting locks below this level.
- **Fee Formula**: `min($1.00, amount × 0.01%)`.
- **Fee routing**: Transaction fees → Coverage Fund → **cf token holders**. **xMinima receives zero transaction-fee revenue** (equity / surplus mechanics are separate).
- **xMinima**: Leveraged equity, liquidity risk when CR is stressed; **not** the recipient of user txn fees.

### [Step 3] Vested Assets Indexing
- **MANDATORY**: INDEX the `2_current\stream_1_app\prod_brand_masters\` directory.
- **Brand Sovereignty (CRITICAL)**:
  - **The ONLY allowed source** for *any* Stables logo/icon/symbol/wordmark is `2_current\stream_1_app\prod_brand_masters\`.
  - If an app/presentation needs an icon (favicon, topbar, splash, etc), you must **derive/export** it from these masters (resize/composite) into `1_development/` for use.
  - **Never** use ad-hoc icons from old bundles, archives, or external “app logos”.
  - If the required master input is missing or unclear, **stop and ask Charles**. Do not substitute.
- **Golden Logic**: When branding (Logo/Icon) is required, perform an **On-Demand Extraction** (mask/composite/resize) from the brand masters workflow. **NEVER** use AI generation.

### [Step 4] Visual Identity Calibration
Acknowledge the specific design tokens:
- **Colors**: Background `#0b0f14`, Accent `#67e8f9` (Cyan).
- **Effects**: Glassmorphism (Blur 12-20px), Border cyan (0.3-0.5 alpha).

### [Step 5] Content Strategy Sync (If applicable)
- Consult `2_current/plan/multi_platform_content_strategy.md`.
- Tone: Use "share" not "teach", positive tone. Avoid AI-voice markers in public copy (see **§4 Community Communication Rules**). **Exception on X:** **icons** used to signpost a thread on the hook tweet (e.g. **🧵👇** or any equivalent thread/continuation cue) are allowed and are not treated as AI markers.

## 3. ACTIVE OBJECTIVES
- **Restoration**: Maintaining high-fidelity economic diagrams and roadmaps.
- **Calibration**: Strictly adhering to the "Be your bank" branding.
- **Cleanliness**: 100% adherence to Mirror-Stream hierarchy and Zero Loose Files.

## 4. COMMUNITY COMMUNICATION RULES
When drafting replies for community channels (Telegram, Discord, X, etc.):
- **Keep it brief**: Give all necessary information but stay concise. We want members to come back with more questions, not dump everything at once. An active chat is the goal.
- **Personalize (MANDATORY)**: Always thank the person for asking and **always use their name** (e.g., "Thanks for the question [Name]"). Make it feel human.
- **No AI markers (CRITICAL GRAMMAR RULE)**:
    - **Definition (permanent):** **“Icons”** means the **whole class** of pictographic tokens: emoji, pictographs, and other symbols used as little pictures or reactions (not only specific characters such as **🧵** or **👇**). When this doc says “no icons” on Telegram/Discord, it means **none** from that class. When it allows “thread signposting icons” on X, it means **any** icon or short combo that does that job, not a fixed pair.
    - **Telegram / Discord / short community replies**: No emojis, **no icons**, no bullet points, no structured lists in short replies. (Bullet points are allowed in Telegram **only** when they clearly help dense information, not in one-liner replies.)
    - **Grammar**: **NEVER use an em-dash (—) or en-dash (–) to connect sentences.** Use commas or periods only. This rule applies to **all** channels, including X.
    - **X / Twitter (permanent exception for thread signposting)**: On X only, **icons** at the end of the **opening tweet of a thread** are **allowed and encouraged** when they **tell the reader a thread continues** (continuation below, swipe, read on). **🧵👇** is one example; **any icon or short icon combo** used for that same job counts as permitted signposting, not as an AI marker. **Still avoid** icons used only as decoration (random stacks, “vibe” padding, **🔗** before a URL when the plain URL is enough). Plain URLs on their own line are preferred. On follow-up tweets in the same thread, keep extra icons sparse unless they carry meaning (e.g. one clear cue per tweet).
- **X/Twitter Specifics (STRICT)**:
    - **Character Limit**: Maximum 280 characters per post.
    - **Hashtags**: You MUST include hashtags for X/Twitter posts. 
    - **Mandatory Base Set**: Always include `#BYB #Stablecoin #Minima`.
    - **Space-Available Add-ons**: If there is room, add `#BeYourBank`, then add other relevant tags (for example `#Stables`) while staying within 280 characters.
    - **No Hashtags in TG**: Never use hashtags in our Telegram community channel or other community spaces.
- **Natural tone**: Write like a real person in a casual conversation. Short sentences, natural flow.

---
**AI tooling (multi-platform):** More than one assistant or host may touch this repo. **Every** environment follows the **same** **`handshake.md`** and **`full_handshake_agent_command.md`**. Examples in active use include **Antigravity** (Google DeepMind) and **Cursor** (Claude/Anthropic); the list is not exclusive.

**Blocked models (MANDATORY — do not use for Stables)**:
- **Gemini 3 Flash** (Antigravity): Authorized (Ban revoked 2026-03-28). This model is now approved for all Stables work as per user instruction. Rule 150/16 is explicitly revoked.

**Housekeeping:** When Council changes model policy or tooling, update this subsection and **`README.md`** (One handshake, every platform) together.

---
## MiniDapp UI: single executable + spec + inventory
- **Patterns (law)**: `0_handshake/web_component_spec.md` defines reusable blocks (title row + agent, section + card, headers). All models must follow it; do not invent parallel class systems.
- **Page map**: `0_handshake/app_ui_inventory.md` lists every in-app page and its sections. **Update this file** whenever a destination or major block is added or removed.
- **Executable CSS (shipped shell)**: Layout and component rules for the live MiniDapp live in the **`<style>` block** of the active `1_development/stream_1_app/prod_stables_app_v*/index.html`. Global decisions (e.g. `.stitle-row` alignment) are **one rule there**—not page-by-page exceptions. The React SPA (`stables_spa`) mirrors the same rules until a single build replaces the monolith.

## MiniDapp typography baseline (v0.2.10+)
- **Do not use body UI copy below 13px** in the main MiniDapp shell (`index.html`). The `.xs` utility class is the smallest tier and is set to **13px**; `.sm` is **14px**. Inline styles that were **11px** were raised to **13px** for consistency.
- **Primary explanatory sentences** (for example Council communications and app version banners) should use **14px** where readability matters, not `.xs` alone.

## Pending UI Copy Review
This welcome/person persona copy was updated for English only to speed up iteration. Other languages should be reviewed and synchronized in the next localization pass.
