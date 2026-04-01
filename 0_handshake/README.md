# 0_handshake — The Calibration System

**For**: Charles (project owner) and every AI model working on Stables.  
**Purpose**: This folder is the mandatory starting point of every session. It contains the rules, references, and specifications that keep every AI model aligned with the project vision, structure, and standards — without relying on conversational memory.

---

## Why this folder exists

AI models reset between sessions. Without a fixed calibration system, every new session risks:
- Forgetting established decisions and re-debating them.
- Drifting from the visual identity and build standards.
- Breaking the directory structure or the promotion pipeline.
- Publishing content that contradicts agreed messaging.

This folder solves that. Every model reads it at the start of every session. No exceptions.

---

## How to start a session (for any AI model)

Run this phrase to trigger calibration:

> **"Run `/handshake` and confirm that you are now working on this basis."**

Or paste this directly:

> *"Read `0_handshake/README.md`, `0_handshake/session_map.md`, and `0_handshake/global_knowledge_base.md`; read the full `2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt`; then `0_handshake/handshake.md` (and Step 0b if economics/protocol copy). Confirm calibration + StablesAgent KB loaded."*

The model must acknowledge calibration before doing any work.

---

## File Map (what each file does)

| File | Who reads it | What it contains |
|------|-------------|-----------------|
| **`README.md`** | You + every model | This file. The entry point and orientation guide. |
| **`session_map.md`** | Every model, Step 0 | Master navigator. Maps every file in the project by purpose. Includes the task→file matrix and deployment reference. Read this before anything else. |
| **`global_knowledge_base.md`** | Every model, **Step 0** (with README + session_map) | **Handshake KB index:** how layers stack (Charter → locked mechanics → master reference → brain → MiniDapp → comms), tie-breakers, promotion, one-line “refresh” paste. Agents use it to know **which specs to load**; it does not replace those specs. |
| **`prod_stablesagent-brain-base/llms.txt`** | Every model, **Step 0c** | **Full public KB rollup** (same corpus as StablesAgent after promotion). Read entire file each session; regenerate with `node build_llms_txt.js` in that folder when brain `.md` changes. |
| **`handshake.md`** | Every model, Step 1 | The law. Governance rules, directory structure, identity terminology, communication rules, Git/server config, the calibration workflow. **§4** = community comms: **X requires hashtags** (mandatory base `#BYOB #Stablecoin #Minima`, then add-ons if space); **no hashtags in Telegram**; **no em dash (—)**. Nothing overrides this. |
| **`stables_master_reference.md`** | Every model, Step 1 | The brain. Economic model, project state, locked terminology, all platform links, multi-platform content strategy. The living document that grows with the project. |
| **`visual_identity_spec.md`** | Every model doing visual work | Exact colours, typography, background formula, glassmorphism rules, image generation prompt template. LOCKED. Never generate a visual without reading this first. |
| **`web_component_spec.md`** | Every model doing web/UI work | Every reusable HTML/CSS component. Buttons, badges, layouts, glassmorphism panels, page shell template. The UI building law. Links to `stables.css`. |
| **`app_ui_inventory.md`** | Every model doing MiniDapp UI | Page-by-page map: every `page-*` screen, sections, patterns. Update when screens change. |
| **`minidapp_version.md`** | Every model editing the MiniDapp or shipping `.mds.zip` | Active `prod_stables_app_*` folder, frozen snapshots, zip paths. Prevents agents editing the wrong version. |
| **`protocol_mechanics_spec.md`** | Every model discussing economics | Mint/burn/redemption rules, CR threshold logic, coverage fund mechanics. Settled decisions — do not re-debate. |
| **`restoration_protocol.md`** | Every model, when reverting changes | How to restore any file or the full project using Git and the Project Ledger. Point-in-Time restoration model. |
| **`cursor_welcome_package.md`** | Cursor/Claude specifically | Cursor-specific onboarding. Project relocation notice, confirmation format, co-pilot protocol. |
| **`links.md`** | Every model writing any URL | All official Stables URLs in one place. Read before writing any link, handle, or external reference. |

---

## The calibration order (what models must do, in sequence)

```
Step 0 — Read README.md + session_map.md + global_knowledge_base.md
         Understand the full file landscape, layer order, and which files to load for the task at hand.

Step 0c — StablesAgent parity (every session)
         Read the full file: 2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt
         (same public KB rollup as the in-app agent / external “one URL” ingest). If brain .md files changed, run node build_llms_txt.js in that folder first. See handshake.md Step 0c.

Step 0b — Protocol truth refresh (whenever economics / mint / xMinima / fees / protocol copy)
         Read 0_handshake/protocol_mechanics_spec.md first, then stables_master_reference.md §14.
         If anything conflicts, protocol_mechanics_spec.md wins. See handshake.md Step 0b.

Step 1 — Read handshake.md + stables_master_reference.md
         Lock in the governance rules and project identity.

Step 2 — Verify economic alignment (from handshake Step 2 + stables_master_reference §14)
         Acknowledge the settled model. Do not re-debate.

Step 3 — Index brand masters (if visual work)
         Read visual_identity_spec.md and web_component_spec.md.
         Confirm 2_current/stream_1_app/prod_brand_masters/ is available.

Step 4 — Confirm alignment
         State: "Calibration Active: Working on the basis of the Unified Handshake."
         After Step 0c, add: "StablesAgent KB loaded (prod llms.txt)."
         After Step 0b, add: "Protocol truth loaded: protocol_mechanics_spec + stables_master_reference §14."
         Then begin work.
```

---

## The pipeline (never skip this)

```
AI creates/edits  →  in 1_development/ only
                  ↓
User reviews      →  AI explains what was done and why
                  ↓
User approves     →  explicitly, not assumed
                  ↓
User promotes     →  moves file to 2_current/ (AI never writes to 2_current/)
                  ↓
AI commits        →  using Stables Council Git identity
                  ↓
AI logs entry     →  in 2_current/stream_3_governance/prod_project_ledger/ledger.md
                  ↓
If public-facing  →  brain sync + pm2 restart on Vultr
```

---

## The 5 rules that must never be broken

1. **AI never writes to `2_current/`.** Only the user promotes files there.
2. **AI never deletes any file.** Old files are moved to `3_archive/`.
3. **No loose files at the root** of the project or any stream/phase folder. Everything lives in a `task_` or `prod_` folder.
4. **Every commit must be logged** in the project ledger with a Point ID.
5. **No visual or UI work** without reading `visual_identity_spec.md` and `web_component_spec.md` first.

---

## For Charles: how to maintain this folder

- **When a new architectural decision is finalised**: append it to `stables_master_reference.md` immediately. This prevents re-debating it in future sessions.
- **When a new web component is standardised**: add it to `web_component_spec.md` and `stables.css`.
- **When a new platform or tool is added**: update `session_map.md` with its file location and purpose.
- **When the project structure changes**: update `handshake.md` Section 1 and `session_map.md` Layer tables.
- **This README**: update it whenever a new file is added to this folder.
