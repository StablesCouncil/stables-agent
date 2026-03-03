# STABLES: MANDATORY HANDSHAKE PROTOCOL (V9)
**Status**: ACTIVE / Unified
**Last Calibration**: 2026-03-03

## 1. THE PERMANENT RULES (GOVERNANCE)
- **Mirror-Stream Governance**: All project activities must occur in three dedicated streams:
    - `stream_1_app`: MiniDapp code and assets.
    - `stream_2_community`: Community content and infographics.
    - `stream_3_governance`: Roadmaps, specs, and logistics.
- **Mirror Phases**: Every file must exist in one of these mirroring phases:
    - `1_development`: Sandbox (AI-driven creation and drafts).
    - `2_current`: Source of Truth (Finalized/User-approved assets).
    - `3_archive`: Historical record (Never delete; always move here).
- **Zero Loose Files**: NO files are allowed at the root of the project or at the root of any stream/phase folder. Everything must be in a named `prod_` or `task_` folder.
- **Atomic Folder Rule**: 
    - `task_[description]`: For active/sandbox work.
    - `prod_[description]`: For stable, finalized deliverables.
- **Single Master Rule**: The MiniDapp source of truth is always:
    `C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_1_app\prod_stables_app_v0.2.9\index.html`
- **Packaging Rule**: Zip the *contents* of the active `prod_stables_app_...` folder directly to create the `.mds.zip`. No file renaming.
- **Brand Sovereignty**: All visual assets must derive from the official branding masters. NO AI-generated logos or "ad-hoc" modifications to symbols.
- **Locked Identity Terminology**:
    - Name: **Stables** (NOT "Stables Protocol")
    - Governance: **Council** (NOT "DAO")
    - Platform: **MiniDapp only** (NO website)
    - Slogan: **Be your own bank**
    - Tagline: **Money that is truly yours. Secure, Pseudonymous and Unstoppable.**
- **UI Pre-Flight Verification**: Before ANY UI or Asset edit, the AI must state the MASTER FILE path and the EXACT STRINGS/RECIPES being used.
- **MINIMA Attribution**: Every communication must include "Built on MINIMA".
- **Perpetual Restoration (The Ledger)**: Every modification must be committed to Git and logged in the Project Ledger (`stream_3_governance/prod_project_ledger/ledger.md`). No change is valid until it is indexed with a Point ID.
- **Atomic Commits**: Every logical change (UI, logic, spec) must have its own commit and ledger entry.

## 2. THE CALIBRATION WORKFLOW (/handshake)
To start any session or when context-drift is suspected, perform the following steps:

### [Step 1] Read the Master Specifications
Consult the following files representing the immutable specs of Stables:
- **[stables_master_reference.md](file:///C:/Users/Charles/.gemini/antigravity/scratch/Stables/0_handshake/stables_master_reference.md)**: The core economic/technical logic.
- **[visual_identity_spec.md](file:///C:/Users/Charles/.gemini/antigravity/scratch/Stables/0_handshake/visual_identity_spec.md)**: Color palettes, glassmorphism, and branding guidelines.
- **[protocol_mechanics_spec.md](file:///C:/Users/Charles/.gemini/antigravity/scratch/Stables/0_handshake/protocol_mechanics_spec.md)**: Detailed mint/burn/redemption rules.
- **[current_state_and_path.md](file:///C:/Users/Charles/.gemini/antigravity/scratch/Stables/2_current/stream_3_governance/prod_protocol_specs/current_state_and_path.md)**: The strategic North Star.

### [Step 2] Verify Economic Alignment
Acknowledge the settled economic model (Do NOT re-debate unless requested):
- **Equation**: `Minima = Stablecoins + cf tokens + xMinima`
- **CR Threshold**: 110% (Default). Stablecoin minting locks below this level.
- **Fee Formula**: `min($1.00, amount × 0.01%)`.
- **xMinima**: Leveraged equity, no fees, liquidity risk below threshold.

### [Step 3] Vested Assets Indexing
- **MANDATORY**: INDEX the `2_current\stream_1_app\prod_brand_masters\` directory.
- **Golden Logic**: When branding (Logo/Icon) is required, perform an **On-Demand Extraction** (mask/composite/resize) from these masters. **NEVER** use AI generation.

### [Step 4] Visual Identity Calibration
Acknowledge the specific design tokens:
- **Colors**: Background `#0b0f14`, Accent `#67e8f9` (Cyan).
- **Effects**: Glassmorphism (Blur 12-20px), Border cyan (0.3-0.5 alpha).

### [Step 5] Content Strategy Sync (If applicable)
- Consult `2_current/plan/multi_platform_content_strategy.md`.
- Tone: Use "share" not "teach", positive tone, no AI markers (no emojis/bullets for socials).

## 3. ACTIVE OBJECTIVES
- **Restoration**: Maintaining high-fidelity economic diagrams and roadmaps.
- **Calibration**: Strictly adhering to the "Be Your Own Bank" branding.
- **Cleanliness**: 100% adherence to Mirror-Stream hierarchy and Zero Loose Files.

---
**Last Verified by Assistant: ANTIGRAVITY**
*(I have read and locked the above rules into my active state. I will consult the specifications before every turn.)*
