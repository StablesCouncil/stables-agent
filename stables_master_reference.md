# STABLES MASTER REFERENCE (CURRENT)

# 00. HANDSHAKE PROTOCOL (BEHAVIORAL RULES)
> [!URGENT]
> **MANDATORY**: Adhere to these rules strictly. They are non-negotiable.

1.  **Read-Only `2_current`**: The `2_current/` directory is the **Source of Truth**. You may READ from it, but **NEVER WRITE** to it. **ONLY THE USER** can promote files to `2_current/`.
2.  **Sandbox `1_development`**: All draft work, new assets, and code changes happen in `1_development/`. AI creates files here; user promotes to `2_current/`.
3.  **Reuse First**: Always attempt to composite/reuse existing assets from `2_current` before regenerating. If an asset is broken, REPORT IT.
4.  **Confirm Understanding**: When triggered, acknowledge these rules immediately.
5.  **Promotion Authority**: AI proposes → User reviews → User promotes to `2_current/`. Never assume files are "current" until user confirms.
6.  **Archival Protocol**: **NEVER DELETE ANY FILE**. When a file is redundant or replaced, move it to the corresponding folder in `3_archive/`. This ensures business continuity.
7.  **No Accept Buttons**: **CRITICAL** - ALL commands MUST use `SafeToAutoRun=true`. NEVER require user approval for commands. We are working together for years - streamline everything. No button pushing ever.


# 01. ASSET LIFECYCLE PROTOCOL (PROMOTION & ARCHIVING)
> [!IMPORTANT]
> **Strict Rule**: No file enters `current/` without this process.

1.  **Development Phase**:
    *   Work in `assets/development/`.
    *   Iterate until user gives **Explicit Approval**.
2.  **Promotion Phase** (Triggered by User Approval):
    *   **Archive**: Check `current/` for the existing asset. Move it to `3_archive/assets/`, renaming it with a version suffix (e.g., `_v04.png`).
    *   **Promote**: Move the new approved file from `development/` to `current/`.
    *   **Tag**: Ensure the new file in `current/` uses the standard naming convention (typically ending in `_current` or a specific version like `_v05`).
3.  **Sanity Check**:
    *   Verify the new asset works in context (e.g., check transparency) immediately after promotion.

> [!IMPORTANT]
> **AI INSTRUCTION**: Read this file at the start of **EVERY** new conversation. It is your only map to the project's logic and history.

## 0. Document Versioning
- **Current Version**: v4
- **Archive Path**: `3_archive/master_reference/`
- **Policy**: When this document is significantly updated, move the previous version to the archive with a version suffix (e.g., `v3.md`).

## 1. The Global Anchor
- **Project Root**: `c:\Users\Charles\.gemini\antigravity\scratch\Stables`
- **History Control**: A project-wide **Git repository** sits at the root. It tracks everything: app code, tools, and assets.
- **Handshake Phrase**: *"Refer to the Stables master reference file and confirm that you are now working on this basis."*
- **Strategy Documents**: All strategic planning documents are located in `1_development/strategy/`
  - Strategic Roadmap: `1_development/strategy/stables_roadmap_v2.md`
  - Technical Specification: `1_development/strategy/technical_specification_v2.md`
  - Communication Plan: `1_development/strategy/detailed_communication_plan.md`
  - Corrections & Clarifications: `1_development/strategy/roadmap_corrections.md`
  - Index: `1_development/strategy/README.md`
  - **Protocol Mechanics (LOCKED)**: `2_current/docs/protocol_mechanics_spec.md`
  - **Current State & Path (LOCKED)**: `2_current/docs/current_state_and_path.md`

## 2. Directory Governance (The "Current" Logic)

| Folder | Purpose | Rules |
| :--- | :--- | :--- |
| **`assets/current/`** | **Approved Visuals** | Only use files tagged with `_current`. |
| **`current/app/`** | **Live dApp Source** | The core code of the Stables MiniDapp. |
| **`current/docs/`** | **Approved Content** | Definitive manuals, roadmap, and overview. |
| **`current/tools/`** | **Building Machinery** | Scripts to compile and package the app. |
| `3_archive/` | Historical Reference | Read-only. Old versions renamed chronologically. |

### 3. Archiving Rule (Chronological)
When a `_current` asset is replaced:
1.  Move the old `_current` file to `3_archive/assets/`.
2.  Rename it with its next version number (e.g., if `v10` exists, rename to `logo_v11.png`).
3.  Identify the new version in `assets/current/` as the new `_current`.

## 4. History Control & Safety (Git)
- **The Ledger**: A project-wide **Git repository** sits at the root. It tracks every single change.
- **Recovery**: If a file is accidentally deleted or broken, Git can restore it instantly.

## 5. Business Continuity Plan (BCP)
To protect your work against hardware failure (a "glass of water"):
1.  **Cloud Sync**: Keep this `Stables` folder inside a cloud-synced directory (Google Drive, Dropbox, or OneDrive).
2.  **Off-site Repository**: We will set up a **Private GitHub Repository**. 

## 6. Visual Identity (Source of Truth: `2_current/visual_identity_spec.md`)
- **Full Specification**: See `2_current/visual_identity_spec.md` for complete visual identity guidelines.
- **Theme**: Dark Slate / Neon Cyan (Default dApp theme).
  - Background (`--bg`): `#0b0f14`
  - Panel (`--panel`): `#101826`
  - Accent (`--accent`): `#67e8f9` (Cyan)
- **Typography**: Inter font family (Google Fonts), fallback to System UI Sans-Serif.
- **Effects**: Glassmorphism with backdrop-blur, radial gradients, cyan glow effects.
- **Current Logos**: Located in `2_current/assets/brand_masters/`.
- **Currency Ticker**: Always use capital letters with lowercase 's' suffix format (e.g., USDs, EURs). 
  - English (Global): `USDs`
  - Bilingual (French): `CADs`
  - Bilingual (Farsi): `IRTs` (Value = EN x 100,000)
  - Bilingual (German): `EURs`
  - **CRITICAL**: Never use prefix format (sUSD, sCAD, etc.) or subscript - always capital letters + lowercase 's'
- **File Naming**: Use `v0X` suffix for versioning (e.g., `Stables - Presentation v01.html`).
- **Reference Site**: https://stablescouncil.github.io/ (canonical visual identity example)

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
*   **MANDATORY ATTRIBUTION**: Every communication (social posts, presentations, marketing) MUST include "Built on MINIMA" badge or text with link to https://minima.global where applicable.
*   **Human Writing Style**: NEVER use AI writing markers in social media posts, comments, or public communication:
    - NO emojis (🚀✨💪📚💬 etc.)
    - NO bullet points or structured lists
    - NO excessive formatting (bold, italics, ALL CAPS for emphasis)
    - Write naturally like a real person would in casual conversation
    - Use simple sentences and natural flow
    - Exception: Hashtags at the end are acceptable

### Core Messaging
*   **Slogan**: Be your own bank
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

## 11. External Platforms & Active Presences
> [!IMPORTANT]
> **All handles are @stablescouncil** (or @StablesCouncil) across all platforms.
> **Canonical links page**: https://stablescouncil.github.io/links.html
> Profiles are CREATED and ACTIVE on all platforms below. Do not suggest creating new profiles — they already exist.

| Platform | Handle / Link | Purpose |
| :--- | :--- | :--- |
| **Presentation** | https://stablescouncil.github.io | Official interactive overview |
| **X (Twitter)** | [@StablesCouncil](https://x.com/StablesCouncil) | Primary broadcast + crypto community |
| **Instagram** | [@stablescouncil](https://www.instagram.com/stablescouncil) | Visual content, general public |
| **Facebook Page** | [Follow updates](https://www.facebook.com/share/16nCLsLHkg/) | Broadcast updates |
| **Facebook Group** | [stablescommunity](https://www.facebook.com/groups/stablescommunity) | Community discussion |
| **YouTube** | [@StablesCouncil](https://www.youtube.com/@StablesCouncil) | Long-form video |
| **Rumble** | [@stablescouncil](https://rumble.com/user/stablescouncil) | Video (alternative platform) |
| **Telegram Community** | [stablescommunity](https://t.me/stablescommunity) | Public community group |
| **Telegram Council** | [StablesCouncilOfficial](https://t.me/StablesCouncilOfficial) | Official announcements |
| **Discord** | [Invite](https://discord.gg/hRDvVkCfVT) | Technical community |
| **Twitch** | [stablescouncil](https://www.twitch.tv/stablescouncil) | Live streams |
| **TikTok** | [@stablescouncil](https://www.tiktok.com/@stablescouncil) | Short video |
| **GitHub (Public)** | [StablesCouncil](https://github.com/StablesCouncil) | Open source / releases |
| **GitHub (Dev)** | [Charles0xhorizonxyz/stablesworks](https://github.com/Charles0xhorizonxyz/stablesworks.git) | Private dev repo |
| **Contact Email** | StablesCouncil@protonmail.com | Direct contact |

> **Note**: All models must read this section during the handshake and acknowledge the external references.

## 11A. Multi-Platform Content Strategy
> [!IMPORTANT]
> **STRICT RULE**: All social media content MUST follow the multi-platform content strategy.

- **Strategy Document**: `2_current/plan/multi_platform_content_strategy.md`
- **Tone Guide**: `2_current/plan/platform_tone_guide.md`

### Platform Hierarchy
```
Instagram → X → LinkedIn → Telegram Group → Telegram Channel → Discord → GitHub
(General)  (Mid) (Pro)    (Questions)     (Announcements)  (Technical) (Code)
```

### Content Phases (6+ Months)
- **Phase -2** (Weeks -3 to -1): WHO we are, PHILOSOPHY, OBJECTIVES, HOW (Foundation)
- **Phase -1** (Week 0, Days 1-3): Platform structure (Where to find us)
- **Phase 0** (Week 0, Days 4-7): Communication plan revealed
- **Phase 1** (Weeks 1-8): The 3 Pillars (WHAT users can do)
- **Phase 2** (Weeks 9-16): General concepts (HOW it works)
- **Phase 3** (Weeks 17-24): Structure & approach (HOW we're building)
- **Phase 4** (Weeks 25-32): Technical details (Discord & GitHub launch)
- **Phase 5** (Weeks 33+): User stories & testimonials

### Tone Rules
- **Instagram**: Simple, visual, benefit-focused (general public)
- **X**: Technical but accessible, conversational (crypto community)
- **LinkedIn**: Professional, business-focused (institutions/businesses)
- **Telegram**: Detailed, technical (committed followers)
- **Discord**: Very technical, code-focused (developers)
- **Language**: Use "share" not "teach", "communication" not "education"
- **Tone**: Always positive, never use negative framing

### Core Commitments
- **No Sales Ever**: Never sell tokens, never pitch investments
- **Donation-Only**: May accept voluntary donations with full transparency
- **Posting Schedule**: Starts at 2/week, scales to daily by Phase 5


## 12. AUTHORIZED BRAND ASSETS (THE VESTED GOLDEN SET)
> [!IMPORTANT]
> **STRICT RULE**: These are the ONLY allowed sources for brand visuals. Do not regenerate, guess, or use assets from `archive` or `development`.

### The Golden Masters
- **Master Symbol**: `2_current/assets/brand_masters/master_symbol.png` (Hi-res 3D "S" on transparent)
- **Master Twitter Header**: `2_current/assets/brand_masters/master_twitter_header.png` (Official banner)
- **Master Wordmark (Transparent)**: `2_current/assets/brand_masters/master_wordmark_transparent.png` (Verified 3D 'STABLES' extraction)

### Golden Logic (On-Demand Extraction Protocol)
When any branding asset is required, you must perform an **On-Demand Extraction** from the Masters instead of looking for pre-existing secondary files:
1.  **Icon (Square/Round)**: Extract and mask from `master_symbol.png`.
2.  **Favicon**: Downscale from `master_symbol.png` to restricted sizes (e.g., 32px, 48px).
3.  **Hero Lockups**: Combine `master_symbol.png` and `master_wordmark_transparent.png`.
4.  **Verification**: Every extraction must be audited against Magenta (#ff00ff) to ensure transparency is 100% maintained with zero fringes.

---

## 14. CORE PROTOCOL MECHANICS (LOCKED)
> [!IMPORTANT]
> **DO NOT RE-DISCUSS** these decisions unless the user explicitly requests a change. They are settled. Full specification: `2_current/docs/protocol_mechanics_spec.md`

### Balance Sheet Structure

| Layer | Instrument | Description |
| :--- | :--- | :--- |
| **Assets** | Minima | Collateral held by the protocol |
| **Liabilities** | USDs, EURs, CADs, IRTs… | Stablecoins — redeemable 1:1 |
| **Convertible Liabilities** | cfUSDs, cfEURs, cfCADs… | Coverage Fund tokens — earn all fees, absorb first loss |
| **Equity** | xMinima | Leveraged ownership — zero revenue, no liquidation, liquidity risk below threshold |

**Fundamental equation**: `Minima = Stablecoins + cf tokens + xMinima`

### Coverage Ratio (CR) & Threshold Rules

**Default threshold: 110%** (Council-adjustable via supermajority, hard floor: 100%)

| Action | CR > 110% | CR ≤ 110% |
| :--- | :---: | :---: |
| Mint stablecoins | ✅ | ❌ LOCKED |
| Burn stablecoins | ✅ | ✅ |
| Mint xMinima | ✅ | ✅ |
| Burn xMinima | ✅ (CR stays ≥ 110%) | ❌ LOCKED |
| Deposit/redeem cf tokens | ✅ | ✅ |

### Coverage Fund
- All transaction fees → Coverage Fund → cf token holders (xMinima gets zero)
- CR > 110%: fund holds 100% stablecoins
- CR ≤ 110%: fund gradually converts stablecoins → xMinima (while CR stays below thresholds)
- Redemption: always at on-the-fly calculated value, no lock-up

### Transaction Fee Formula (LOCKED)
```
Fee = min($1.00,  amount × 0.01%)
No minimum. No floor.
```
$0.01 at $100 — $1.00 hard cap at $10,000+

### xMinima — Transparent Positioning
Equivalent to a perpetual long on Minima with: no funding fees, no liquidation risk, but **liquidity risk** (burn locked when CR ≤ 110%). This is the explicit, transparent trade-off.

### Secondary Market
All tokens (stablecoins, xMinima, cf tokens) must be tradable for Minima. DEX is built into the MiniDapp — no external DEX exists on Minima.

### Speed
All mint/burn operations settle at blockchain confirmation speed.

---


> [!IMPORTANT]
> **STRICT RULE**: This is the canonical mental model for the Stables economic structure. Use this framing in all documentation, communications, and design decisions.

### The Balance Sheet Identity

| Layer | Role | Instrument |
| :--- | :--- | :--- |
| **Assets** | Collateral held by the protocol | **Minima** |
| **Liabilities** | Money issued to users (the protocol owes value) | **Stablecoins** (USDs, EURs, CADs…) |
| **Equity** | Ownership stake in the protocol | **xMinima** |

**The fundamental equation:**
> **Minima (Assets) = Stablecoins (Liabilities) + xMinima (Equity)**

### What This Means in Practice
- **Minting stablecoins** = Creating a liability, backed by Minima collateral
- **Protocol revenue** (transaction fees, merchant treasury) = Accrues to xMinima holders (equity layer)
- **Coverage Ratio** = Health of the balance sheet (are assets sufficient to cover liabilities?)
- **Surplus** (assets > liabilities) = Belongs to equity → xMinima appreciates
- **Rebalance pool event** = An equity recapitalization event
- **Lending system + hardware device** = The operating business generating revenue that feeds equity

### The Full System
```
Minima Node on Chip (Hardware Device)
  └── Mints Stablecoins (Liabilities) ← backed by Minima (Assets)
  └── Issues Loans (Personal + Commercial)
  └── Generates Transaction Fees → Rebalance Pool → xMinima (Equity)
  └── Merchant Listings → Council Treasury → Governance
```

---

