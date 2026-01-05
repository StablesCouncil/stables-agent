# STABLES MASTER REFERENCE (CURRENT)

# 00. HANDSHAKE PROTOCOL (BEHAVIORAL RULES)
> [!URGENT]
> **MANDATORY**: Adhere to these rules strictly. They are non-negotiable.

1.  **Read-Only `2_current`**: The `2_current/` directory is the **Source of Truth**. You may READ from it, but **NEVER WRITE** to it. **ONLY THE USER** can promote files to `2_current/`.
2.  **Sandbox `1_development`**: All draft work, new assets, and code changes happen in `1_development/`. AI creates files here; user promotes to `2_current/`.
3.  **Reuse First**: Always attempt to composite/reuse existing assets from `2_current` before regenerating. If an asset is broken, REPORT IT.
4.  **Confirm Understanding**: When triggered, acknowledge these rules immediately.
5.  **Promotion Authority**: AI proposes → User reviews → User promotes to `2_current/`. Never assume files are "current" until user confirms.


# 01. ASSET LIFECYCLE PROTOCOL (PROMOTION & ARCHIVING)
> [!IMPORTANT]
> **Strict Rule**: No file enters `current/` without this process.

1.  **Development Phase**:
    *   Work in `assets/development/`.
    *   Iterate until user gives **Explicit Approval**.
2.  **Promotion Phase** (Triggered by User Approval):
    *   **Archive**: Check `current/` for the existing asset. Move it to `archive/assets/`, renaming it with a version suffix (e.g., `_v04.png`).
    *   **Promote**: Move the new approved file from `development/` to `current/`.
    *   **Tag**: Ensure the new file in `current/` uses the standard naming convention (typically ending in `_current` or a specific version like `_v05`).
3.  **Sanity Check**:
    *   Verify the new asset works in context (e.g., check transparency) immediately after promotion.

> [!IMPORTANT]
> **AI INSTRUCTION**: Read this file at the start of **EVERY** new conversation. It is your only map to the project's logic and history.

## 0. Document Versioning
- **Current Version**: v4
- **Archive Path**: `archive/master_reference/`
- **Policy**: When this document is significantly updated, move the previous version to the archive with a version suffix (e.g., `v3.md`).

## 1. The Global Anchor
- **Project Root**: `c:\Users\Charles\.gemini\antigravity\scratch\Stables`
- **History Control**: A project-wide **Git repository** sits at the root. It tracks everything: app code, tools, and assets.
- **Handshake Phrase**: *"Refer to the Stables master reference file and confirm that you are now working on this basis."*

## 2. Directory Governance (The "Current" Logic)

| Folder | Purpose | Rules |
| :--- | :--- | :--- |
| **`assets/current/`** | **Approved Visuals** | Only use files tagged with `_current`. |
| **`current/app/`** | **Live dApp Source** | The core code of the Stables MiniDapp. |
| **`current/docs/`** | **Approved Content** | Definitive manuals, roadmap, and overview. |
| **`current/tools/`** | **Building Machinery** | Scripts to compile and package the app. |
| `archive/` | Historical Reference | Read-only. Old versions renamed chronologically. |

### 3. Archiving Rule (Chronological)
When a `_current` asset is replaced:
1.  Move the old `_current` file to `archive/assets/`.
2.  Rename it with its next version number (e.g., if `v10` exists, rename to `logo_v11.png`).
3.  Identify the new version in `assets/current/` as the new `_current`.

## 4. History Control & Safety (Git)
- **The Ledger**: A project-wide **Git repository** sits at the root. It tracks every single change.
- **Recovery**: If a file is accidentally deleted or broken, Git can restore it instantly.

## 5. Business Continuity Plan (BCP)
To protect your work against hardware failure (a "glass of water"):
1.  **Cloud Sync**: Keep this `Stables` folder inside a cloud-synced directory (Google Drive, Dropbox, or OneDrive).
2.  **Off-site Repository**: We will set up a **Private GitHub Repository**. 

## 6. Visual Identity (Source of Truth: `current/app/assets/styles.css`)
- **Theme**: Dark Slate / Neon Cyan (Default dApp theme).
  - Background (`--bg`): `#0b0f14`
  - Panel (`--panel`): `#101826`
  - Accent (`--accent`): `#67e8f9` (Cyan)
- **Typography**: System UI Sans-Serif (Standard modern stack).
- **Current Logos**: Located in `current/app/assets/` (`stables_logo.png`).
- **Currency Ticker**: Always prefix with lowercase 'm' followed by uppercase ticker. 
  - English (Global): `mUSD`
  - Bilingual (French): `mCAD`
  - Bilingual (Farsi): `mIRT` (Value = EN x 1,000,000)
  - Bilingual (German): `mEUR`
- **File Naming**: Use `v0X` suffix for versioning (e.g., `Stables - Presentation v01.html`).

## 7. Design Constraints
*   **Uniform Button Sizing**: All buttons appearing side-by-side (or within the same functional group) MUST be the exact same size. This applies to the dApp, presentations, and all visual documentation.
*   **Hero Layout**: Brand elements (Symbol/Logo) should generally anchor the left, with messaging anchoring the right for better visual flow in standard scrollytelling.

## 8. Messaging & Copy (Source of Truth)
> [!IMPORTANT]
> **STRICT RULE**: You may ONLY use the following phrases. Do not invent or substitute ANY other words.

### Brand Name & Terminology
*   **Name**: **Stables** (Always plural, with an 's'). Never "Stables".
*   **NEVER SAY**: "Stables Protocol" - Always just **"Stables"**
*   **Governance**: Use **"Council"** - NEVER use "DAO"
*   **Platform**: **MiniDapp only** - We have NO website. Only the Minima MiniDapp.

### Messaging Rules (Set in Stone)
*   **Target**: General public worldwide.
*   **No Jargon**: Do NOT use crypto or DeFi-specific terms like "decentralized" in any external communication or copy for the general public. These terms do not resonate with our target audience.
*   **Hashtags Exception**: Technical terms (e.g., #decentralized, #defi, #crypto) are permitted ONLY as hashtags on platforms like X/Twitter for community reach and discovery.
*   **Strict Tagline**: Use ONLY **"Money that is truly yours. Secure, Pseudonymous and Unstoppable."**
*   **Target**: General public worldwide.

### Core Messaging
*   **Slogan**: Money Platform
*   **Tagline**: Money that is truly yours. Secure, Pseudonymous and Unstoppable.
*   **The 3 Defining Pillars**:
    1.  **Secure**
    2.  **Pseudonymous**
    3.  **Unstoppable**

### Target Audience
*   **Primary**: General public worldwide (not just crypto users)
*   **Vision**: Payment option of choice for the whole world
*   **Positioning**: Accessible, universal money platform


## 9. Operational Rules (The Cleanup)
- **Strict Scope**: Ignore all elements outside of the `current/` folder unless explicitly directed to archive them.
- **Rule of Thumb**: If it's not in `current/`, it doesn't exist for the purpose of active development.
- **Research Persistence**: Any significant architectural or design decision must be summarized and added to this document immediately to prevent re-research.

---
## 10. The Handshake (Magic Sentence)
To start any new session, use this exact phrase:
> **"Run `/stablesworks` and confirm that you are now working on this basis."**

## 11. External Platforms & Contact
- **X (Twitter) Profile**: https://x.com/StablesCouncil
- **Private GitHub Repository (Dev)**: https://github.com/Charles0xhorizonxyz/stablesworks.git
- **Public GitHub Repository (Release)**: https://github.com/Charles0xhorizonxyz/stablescouncil
- **Contact Email**: StablesCouncil@protonmail.com

> **Note**: All models must read this section during the handshake and acknowledge the external references.



