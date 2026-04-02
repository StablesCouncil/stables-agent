# STABLES: MANDATORY HANDSHAKE PROTOCOL (V10)
**Status**: ACTIVE / Unified
**Last Calibration**: 2026-03-23 (v12)

## 1. THE PERMANENT RULES (GOVERNANCE)
- **Stables Protocol**: All project activities must occur in three dedicated streams:
    - `stream_1_app`: MiniDapp code and assets.
    - `stream_2_community`: Community content and infographics.
    - `stream_3_governance`: Roadmaps, specs, and logistics.
- **Mirror Phases**: Every file must exist in one of these mirroring phases:
    - `1_development`: Sandbox (AI-driven creation and drafts). **ALL WORK MUST HAPPEN HERE.**
    - `2_current`: Source of Truth (Finalized/User-approved assets). **ONLY THE USER CAN VALIDATE AND MOVE WORK HERE.** We only ever communicate or publish what is in `2_current`.
    - `3_archive`: Historical record (Never delete; always move here).
- **The Validation Pipeline (CRITICAL)**: AI Agents work exclusively in `1_development`. Before any code, asset, or document is published to GitHub or moved to `2_current`, the AI MUST explain the contents to the user and receive explicit approval. Do not bypass the user's review.
- **Zero Loose Files**: NO files are allowed at the root of the project or at the root of any stream/phase folder. Everything must be in a named `prod_` or `task_` folder.
- **Documentation by Page (UI Parity)**: Within `stream_1_app/ui_inventory/`, all technical, functional, or economic documentation MUST be organized into numbered folders mirroring the app's UI hierarchy (e.g., `01_shops_exchange/02_ambassadors/`). This ensures every UI element mirrors its documentation in the directory tree. **CRITICAL**: When a page is added or the navigation order changes in `index.html`, the `ui_inventory` folder structure and [app_pages_ordered.md](file:///c:/Users/Charles/Documents/Stables/1_development/stream_1_app/ui_inventory/app_pages_ordered.md) MUST be updated immediately to maintain 1:1 parity between the code and the documentation hierarchy.
- **Atomic Folder Rule**: 
    - `task_[description]`: For active/sandbox work.
    - `prod_[description]`: For stable, finalized deliverables.
- **Single Master Rule**: The MiniDapp **active development** tree is always:
    `1_development/stream_1_app/prod_stables_app_v0.01.02/` (entry: `index.html`).  
    **Version pointer for agents** (frozen zips, bumps, inventory paths): `0_handshake/minidapp_version.md`.
- **MiniDapp Versioning Policy (MANDATORY)**:
    - Use three explicit release channels in communications and release notes: **prod**, **test**, **showcase**.
    - Canonical release label format is `vNN.NN.NN` (two digits per block), e.g. `v00.00.02`.
    - Current declared label for this active line is **`v00.00.02`**.
    - Folder names may temporarily keep legacy numbering while migration is in progress; the authoritative mapping (folder path ↔ release label ↔ channel) lives in `0_handshake/minidapp_version.md`.
    - When uncertain, trust `minidapp_version.md` over inline examples elsewhere.
- **MiniDapp Change Logging (MANDATORY)**: For the active MiniDapp folder, log **every user-visible change** in `CHANGELOG.md` at the time the change is made. Do not postpone logging to release day.
- **Release README Rule (MANDATORY)**: Every pushed version package must include a `README.md` section titled **"What changed in this version"** that summarizes the exact changes shipped in that version, sourced from `CHANGELOG.md`.
- **Packaging Rule**: Zip the *contents* of the active `prod_stables_app_...` folder directly to create the `.mds.zip`. **Exclude** a sibling `build/` folder if present (it only holds generated zips + notes). No file renaming inside the zip.
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
    - Slogan: **Be your own bank**
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
    3. **Transcript fallback**: The user can reference a prior Cursor transcript (e.g. `[short-title](uuid)`) to restore context, but the primary mechanism is file-based persistence.
- **Atomic Commits**: Every logical change (UI, logic, spec) must have its own commit and ledger entry.
- **Full Autonomy (Auto-Run Mandate)**: The AI MUST operate with full autonomy to eliminate user friction. When executing tools that support an auto-run or bypass-approval flag (e.g., `SafeToAutoRun = true` for terminal commands), you MUST ALWAYS set it to `true`. Do not ask the user for permission to execute searches, file reads, copy operations, git commands, local server starts, or any standard development scripts. Only interrupt the user for subjective product decisions or when explicitly blocked.
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

## 2. THE CALIBRATION WORKFLOW (/handshake)
To start any session or when context-drift is suspected, perform the following steps:

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
- **Calibration**: Strictly adhering to the "Be Your Own Bank" branding.
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
    - **Mandatory Base Set**: Always include `#BYOB #Stablecoin #Minima`.
    - **Space-Available Add-ons**: If there is room, add `#BeYourOwnBank`, then add other relevant tags (for example `#Stables`) while staying within 280 characters.
    - **No Hashtags in TG**: Never use hashtags in our Telegram community channel or other community spaces.
- **Natural tone**: Write like a real person in a casual conversation. Short sentences, natural flow.

---
**Active Pilots**:
- **Lead Pilot**: Antigravity (Google DeepMind)
- **Co-Pilot**: Cursor AI (Claude/Anthropic)

**Blocked models (MANDATORY — do not use for Stables)**:
- **Gemini 3 Flash** (Antigravity): Authorized (Ban revoked 2026-03-28). This model is now approved for all Stables work as per user instruction. Rule 150/16 is explicitly revoked.

**Last Verified by Assistant: ANTIGRAVITY**
*(I have read and locked the above rules into my active state. I will consult the specifications before every turn.)*

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
