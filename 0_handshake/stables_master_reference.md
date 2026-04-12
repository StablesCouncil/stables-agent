# STABLES MASTER REFERENCE (CURRENT)

# 00. HANDSHAKE PROTOCOL (BEHAVIORAL RULES)
> [!URGENT]
> **MANDATORY**: Adhere to these rules strictly. They are non-negotiable.

1.  **Read-Only `2_current`**: The `2_current/` directory is the **Source of Truth**. You may READ from it, but **NEVER WRITE** to it. **ONLY THE USER** can promote files to `2_current/`.
2.  **Sandbox `1_development`**: All draft work, new assets, and code changes happen in `1_development/`. AI creates files here; user promotes to `2_current/`.
3.  **Reuse First**: Always attempt to reuse existing assets from `current/` before regenerating. If an asset is broken, REPORT IT.
4.  **Confirm Understanding**: When triggered, acknowledge these rules immediately.
5.  **Promotion Authority**: AI proposes → User reviews → User promotes to `2_current/`. Never assume files are "current" until user confirms.
6.  **Archival Protocol**: **NEVER DELETE ANY FILE**. When a file is redundant or replaced, move it to the corresponding folder in `3_archive/`. This ensures business continuity.
7.  **No Accept Buttons**: **CRITICAL** - ALL commands MUST use `SafeToAutoRun=true`. NEVER require user approval for commands.
8.  **Locked Identity Summary**: Every session start must begin with a summary of the Locked Branding (Name, Slogan, Governance).
9.  **UI Pre-Flight Verification**: Before ANY UI or Asset edit, the AI must state the MASTER FILE path and the EXACT STRINGS being used to ensure zero drift from the vision.
10. **Authorized models**: **Gemini 3 Flash** (Antigravity) is now authorized for all Stables work (Ban revoked 2026-03-28). Rule 150/16 is explicitly revoked.


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
- **Project Root**: `C:\Users\Charles\Documents\Stables`
- **History Control**: A project-wide **Git repository** sits at the root. It tracks everything: app code, tools, and assets.
- **Handshake Phrase**: *"Refer to the Stables master reference file and confirm that you are now working on this basis."*
- **Strategy Documents**: All strategic planning documents are located in `1_development/strategy/`
  - Strategic Roadmap: `1_development/strategy/stables_roadmap_v2.md`
  - Technical Specification: `1_development/strategy/technical_specification_v2.md`
  - Communication Plan: `1_development/strategy/detailed_communication_plan.md`
  - Corrections & Clarifications: `1_development/strategy/roadmap_corrections.md`
  - Index: `1_development/strategy/README.md`
  - **Protocol Mechanics (LOCKED)**: `2_current/stream_3_governance/prod_protocol_specs/protocol_mechanics_spec.md`
  - **Current State & Path (LOCKED)**: `2_current/stream_3_governance/prod_protocol_specs/current_state_and_path.md`
  - **Visual Identity Spec (LOCKED)**: `2_current/stream_3_governance/prod_protocol_specs/visual_identity_spec.md`

## 2. Directory Governance (The "Current" Logic)

| Folder | Purpose | Rules |
| :--- | :--- | :--- |
| **`2_current/stream_1_app/`** | **Live dApp Source** | Finalized code and assets. |
| **`2_current/stream_2_community/`** | **Live Public Presentation & Community Assets** | Canonical source for anything published on `stablescouncil.github.io` and other static community web resources. |
| **`2_current/stream_3_governance/prod_protocol_specs/`** | **Approved Docs** | Definitive manuals, roadmap, and overview. |
| **`2_current/stream_3_governance/prod_strategic_roadmap/`** | **Strategy** | Strategic path. |
| `3_archive/` | Historical Reference | Read-only. Old versions renamed chronologically. |

> [!IMPORTANT]
> **Community Web Mirror Rule**: Any page or asset that is live on `stablescouncil.github.io` (including the main presentation and the "Our Banking System" overview) MUST have a 1:1 mirror inside `2_current/stream_2_community/` under a clearly named `prod_` folder (for example, `prod_presentation_v02`, `prod_capital_flows_infographic`). Drafts and work-in-progress versions stay in `1_development/stream_2_community/`. GitHub Pages and any other static hosting are always built from the copies in `2_current/stream_2_community/`, never directly from `1_development/`.

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
3.  **Vultr Backup**: Scheduled script `1_development/stream_3_governance/task_dev_utils/tools/backup-stables.ps1` backs up `0_handshake`, `1_development`, `2_current`, `3_archive` to `/root/stables-backups/` on Vultr (`140.82.36.166`). **Never backed up:** `prod_credentials` (vault), `.env` (agent tokens). See `task_dev_utils/docs/BACKUP_README.md` for Task Scheduler config and restore paths.
4.  **Credentials location**: `prod_credentials` (vault.md, encryption tools) lives in `2_current/stream_3_governance/prod_credentials/`, not in `1_development`. Agent tokens (`.env`) stay in `task_stablesagent-brain-base/`. 

## 6. Visual Identity (Source of Truth: `2_current/visual_identity_spec.md`)
- **Full Specification**: See `2_current/visual_identity_spec.md` for complete visual identity guidelines.
- **Theme**: Dark Slate / Neon Cyan (Default dApp theme).
  - Background (`--bg`): `#0b0f14`
  - Panel (`--panel`): `#101826`
  - Accent (`--accent`): `#67e8f9` (Cyan)
- **Typography**: Inter font family (Google Fonts), fallback to System UI Sans-Serif.
- **Effects**: Glassmorphism with backdrop-blur, radial gradients, cyan glow effects.
- **Current Logos**: Located in `2_current/stream_1_app/prod_brand_masters/`.
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
*   **No Technical Jargon**: Strictly ban technical terms like "blockchain," "crypto," "cryptographic," "decentralized," "on-chain," or "smart contracts" in all public-facing copy (presentations, landing pages, general Telegram posts). 
*   **Narrative**: Present Stables as "just another banking app"—a professional, professional finance tool that happens to be sovereign. Use familiar financial terms:
    - Replace "On-chain" with "Instant" or "Direct."
    - Replace "Cryptographic platform" with "Money platform" or "System."
    - Replace "Mint/Burn" with "Issue/Redeem" or "Exchange."
    - Replace "Deterministic" with "Autonomous" or "Rule-based."
*   **Hashtags (X/Twitter):** Authoritative rule: handshake.md §4. Mandatory base set: #BYB #Minima.
*   **Strict Tagline**: Use ONLY "Money that is truly yours. Secure, Pseudonymous and Unstoppable."
*   **MANDATORY ATTRIBUTION**: Official presentations and marketing materials MUST include "Built on MINIMA" badge or text with link to https://minima.global where applicable. Social media communications (Telegram, X) are exempt from this requirement as the technical link is implied.
*   **Human Writing Style**: NEVER use AI writing markers in social media posts, comments, or public communication:
    - NO emojis (🚀✨💪📚💬 etc.)
    - NO bullet points or structured lists
    - NO excessive formatting (bold, italics, ALL CAPS for emphasis)
    - Write naturally like a real person would in casual conversation
    - Use simple sentences and natural flow
    - **X/Twitter Limit**: Maximum 280 characters.
    - **Hashtags**: MANDATORY on X (at the end). Never use in Telegram.

### Core Messaging
*   **Slogan**: Be your bank
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
> **"Run `/handshake` and confirm that you are now working on this basis."**

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
| **GitHub (Admin)** | [StablesCouncilExec](https://github.com/StablesCouncilExec) | Branded Admin Account (Linked to Discord) |
| **GitHub (Public)** | [StablesCouncil](https://github.com/StablesCouncil) | Official Organization (Public Assets) |
| **GitHub (Dev)** | [Charles0xhorizonxyz](https://github.com/Charles0xhorizonxyz) | Private Dev account (Sandbox) |
| **Personal Site** | [0xHorizon](https://0xhorizon.xyz/) | Independent Founder Identity |
| **Contact Email** | StablesCouncil@protonmail.com · StablesCouncil@gmail.com | Direct contact |
| **Moltbook (StablesAgent)** | [u/stablesagent](https://www.moltbook.com/u/stablesagent) | StablesAgent profile on the agent social network |

> **Note**: All models must read this section during the handshake and acknowledge the external references.

### 11B. Moltbook (StablesAgent Profile)
> [!IMPORTANT]
> **StablesAgent is on Moltbook.** This is persisted long-term memory. Do not suggest creating it or ask "what is Moltbook" — it is already set up and documented here.

- **What it is**: Moltbook is the social network for AI agents. Agents create profiles, post, comment, and engage with each other and their communities. It is "the front page of the agent internet."
- **Why we're there**: To give StablesAgent a presence in the agent ecosystem, connect with other agents, and extend reach to audiences who discover agents on Moltbook.
- **Status**: StablesAgent is verified on Moltbook. It has already started making friendly contacts with other agents.
- **Link**: https://www.moltbook.com/u/stablesagent
- **Links page**: Listed in the Council section at https://stablescouncil.github.io/links.html as "Moltbook — StablesAgent on the agent social network"
- **Technical**: `moltbook_agent.js` runs via cron every 30 min (or PM2). Replies to comments on StablesAgent's posts using the same brain as Telegram and web chat. See `1_development/stream_3_governance/task_x_agent_node/README.md` (Moltbook section).

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
- **Master Symbol**: `2_current/stream_1_app/prod_brand_masters/1_symbol_current.png` (Official Symbol)
- **Master Twitter Header**: `2_current/stream_1_app/prod_brand_masters/stables_twitter_header_final.png`
- **Master Wordmark**: `2_current/stream_1_app/prod_brand_masters/stables _ the money platform.html` (Reference for naming/alignment)

### Golden Logic (On-Demand Extraction Protocol)
When any branding asset is required, you must perform an **On-Demand Extraction** from the Masters instead of looking for pre-existing secondary files:
1.  **Icon (Square/Round)**: Extract and mask from `master_symbol.png`.
2.  **Favicon**: Downscale from `master_symbol.png` to restricted sizes (e.g., 32px, 48px).
3.  **Hero Lockups**: Combine `master_symbol.png` and `master_wordmark_transparent.png`.
4.  **Verification**: Every extraction must be audited against Magenta (#ff00ff) to ensure transparency is 100% maintained with zero fringes.

---

## 14. CORE PROTOCOL MECHANICS (LOCKED)
> [!IMPORTANT]
> **DO NOT RE-DISCUSS** these decisions unless the user explicitly requests a change. They are settled. Full specification: **`0_handshake/protocol_mechanics_spec.md`** (authoritative for agents). Promoted copy: `2_current/stream_3_governance/prod_protocol_specs/protocol_mechanics_spec.md`.

### Balance Sheet Structure

| Layer | Instrument | Description |
| :--- | :--- | :--- |
| **Assets** | Minima | Collateral held by the protocol |
| **Liabilities** | USDs, EURs, CADs, IRTs… | Stablecoins — redeemable 1:1 |
| **Convertible Liabilities** | cfUSDs, cfEURs, cfCADs… | Coverage Fund tokens — earn all fees, absorb first loss |
| **Equity** | xMinima | Leveraged ownership — zero revenue, no liquidation, liquidity risk below threshold |

**Fundamental equation**: `Minima = Stablecoins + cf tokens + xMinima`

### The Multi-Actor Hedge (The Merchant-Speculator Equilibrium)
> [!URGENT]
> **DETERMINISTIC PRINCIPLE**: Stables is a structural credit-system. The peg is maintained through the specific interaction of its participants.
> Stability is anchored by the **merchants** who settle at $1 equivalent value for real-world goods. This provides the physical liquidity floor, while the **Speculator** layer absorbs collateral volatility. This dual-anchor system ensures the peg is an outcome of real-world utility and structural risk-bearing.

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

### Primary Issuance & Zero-Fee Stables
There are NO Stablecoin liquidity pools on the DEX. Stablecoins (USDs, EURs, etc.) are minted and burned directly at the protocol level on-demand via the Oracle. This enforces a perfect, frictionless peg with zero slippage or trading fees required. 

### xMinima Secondary Market (Concentrated DEX)
The built-in DEX exists *only* to facilitate the xMinima/Minima secondary market for speculators.
- **Protocol-Owned Liquidity (POL):** The Council Treasury (funded by merchant listing fees) deploys capital onto the DEX to provide a thick, permanent bid/ask spread for xMinima. 
- Retail LPs are generally unnecessary, as the Council acts as the primary market maker to ensure liquidity.

### Speed
All mint/burn operations settle at blockchain confirmation speed.

---


> [!IMPORTANT]
> **STRICT RULE**: This is the canonical mental model for the Stables economic structure. Use this framing in all documentation, communications, and design decisions.

### The Balance Sheet Identity

**Must match the table and equation in §14 above.** Do not simplify away **cf tokens** or mis-route **fees**.

| Layer | Role | Instrument |
| :--- | :--- | :--- |
| **Assets** | Collateral held by the protocol | **Minima** |
| **Senior liabilities** | Value the protocol owes users as redeemable coins | **Stablecoins** (USDs, EURs, CADs…) |
| **Convertible / junior liabilities** | Coverage Fund; fee accrual; first-loss shock absorption | **USDscf** |
| **Equity** | Leveraged ownership in surplus (not txn-fee yield) | **xMinima** |

**The fundamental equation (full, locked):**
> **Minima (Assets) = Stablecoins + USDscf + xMinima**

### The Participant Matrix (The Playing Field)

Stables is a deterministic structure where the peg is maintained by the interaction of self-interested participants seeking sovereignty.

| Actor | Objective | Stables Deliverable (Structure) | System Contribution |
| :--- | :--- | :--- | :--- |
| **Ambassadors** | Growth & Sovereignty | The 16 Big Mac® Economy. | **Merchant Support**: Onboarding and technical assistance for the foundation. |
| **Speculators** | High-leverage Profit | Equity exposure via xMinima. | **Strategic Buffer**: Capturing market upside with high expected returns. |
| **Investors** | Stable Yield & Safety | Fee revenue via **USDscf**. | **Second Shock Absorber**: Providing the first-loss capital buffer. |
| **Merchants** | Sovereignty | Core Values (Secure, Pseudonymous, Unstoppable) + Ultra-low fee. | **The Foundation**: Aligning with the unstoppable future of value. |
| **Shoppers** | Privacy & Purchasing power | 100% Self-custody, Direct P2P spend. | **Utility**: Driving internal economic volume. |
| **Balancers** | Risk-free Efficiency | Direct settlements. | **Precision**: Automating parity across all horizons. |
| **FX Traders** | Profit from currency volatility | Native, multi-currency on-chain pairs. | **Global Flow**: Ensuring cross-currency liquidity. |

### The Structural Proof of the Peg

Stability is not a promise; it is an **Outcome of Equilibrium** enforced by two primary forces:
1. **The Merchant Anchor**: Participating merchants commit to 1:1 acceptance for goods. By acting as local **Exchange Bureaus** (Fiat-to-Stables), they provide the physical liquidity that digital oracles cannot replace.
2. **The Speculator Filter**: xMinima holders bear the **Skewed Payoff** risk. When health is low, their capital is structurally forced to absorb volatility (via binary price/liquidity locks), shielding the seniors.

### What This Means in Practice
- **Minting stablecoins** = Creating **senior** liability, backed by Minima collateral (oracle-priced).
- **Transaction fees** (locked formula) → **Coverage Fund** → **cf token holders**.
- **xMinima** = Leveraged **equity**; value defined by structural mechanics and surplus.
- **Coverage Ratio** = Health of the balance sheet (assets vs liabilities).
- **Surplus** (when present) = reflected in **equity** valuation; do not conflate with “fee revenue to xMinima”.
- **Merchant / Council treasury** = Governance and operations; **do not** fold into “all fees to xMinima”.
- **Rebalance / stress paths** = See **`protocol_mechanics_spec.md`** (conversion, CR thresholds).
- **Lending + hardware roadmap** = Future operating layers; they **do not** override the locked fee and cf/xMinima split above.

### The Full System (schematic — fee path corrected)
```
Minima node (MiniDapp on user node)
  └── Mint / burn Stablecoins (senior liabilities) ← Minima collateral
  └── Transaction fees → Coverage Fund → cf token holders
  └── xMinima (equity) ← no txn-fee revenue per locked spec; value from equity / surplus mechanics
  └── Merchants / listings → Council treasury → governance
```

---

## 15. THE CONSTITUTION (PHILOSOPHICAL ANCHOR)
> [!IMPORTANT]
> **STRICT RULE**: Stables relies on deterministic structural mechanics, not discretionary action or generic DeFi tropes.

### The Transition Doctrine
Stables does not claim to be the final form of human money. It is a necessary bridge.
- **Stage 1 (Present - Merchant Opt-In):** Sovereign opt-in merchant payment system. Synthetic pegged assets (USDs) allow users to bridge to a sovereign network today.
- **Stage 2 (Minima-Native):** As the network grows, goods are priced directly in Minima. Economic coordination is achieved on a fully sovereign base layer.
- **Stage 3 (The Circular Horizon):** A future state where monetary power is a fundamental human right. The system is circular, equitable, and planet-centric, transcending traditional accumulation-based models.

### Deterministic Mechanics
- **Floating Redemption:** The Backing Ratio (`Assets / Liabilities`) determines redemption value. If BR < 1, redemption flows accordingly.
- **Continuous Logic:** The protocol reacts deterministically to market state. Solvency is defined and enforced by mathematical equilibrium.
- **Structural Integrity:** Stables is an autonomous cryptographic platform. Solvency is inherent to the protocol state, eliminating discretionary risk.
- **xMinima Governance**: Voting power is anchored in xMinima as pro-rata equity. Governance operates within the immutable boundaries of the monetary core.

---

## 16. THE TECH STACK & ENVIRONMENTS (DEVELOPMENT ANCHOR)
> [!IMPORTANT]
> **STRICT RULE**: Before writing code, acknowledge the current state of our technological infrastructure.

### The App Layer (`stream_1_app`)
- **Framework:** The UI is built using Vanilla HTML/JS/CSS. No complex frontend frameworks (React/Vue) unless explicitly decided.
- **Design:** Dark navy background `#0b0f14`, cyan radial glows `#67e8f9`, and Inter font. Glassmorphism is heavily used.
- **Deployment:** The application is packaged into a `.mds.zip` file, which is installed directly onto a user's local Minima node. This means the app is fully decentralized with zero reliance on cloud web servers.

### The AI & Agent Layer (`stream_3_governance/task_stablesagent-brain-base` & `task_x_agent_node`)
- **StablesAgent:** An autonomous community assistant.
- **Core Technology:** Node.js, `@xenova/transformers` (local, free, open-source embeddings), and the `Ollama` framework running `Llama-3.2`.
- **Knowledge Base (`llms.txt`):** Built from markdown files (e.g. `comprehensive_knowledge_base.md`, `core_definitions.md`). The AI's responses must be generated directly from this factual base to prevent hallucination.
- **Execution Script:** `node ingest_knowledge.js` must be run manually by the user to update the Vector Database whenever the markdown manuals are changed.
