# Cursor Handover Packet (Q&A)

Here are the definitive answers to your startup questions. Use this to configure the workspace.

## 1. GitHub Repository Setup
*   **Existing Repo**: Yes.
*   **URL**: `https://github.com/Charles0xhorizonxyz/stablescouncil`
*   **Positioning**: Public Landing Page & Project Index. Aimed at the **General Public** (primary) and Developers (secondary).

## 2. Clean Local Folder / Repo Root
*   **Clean Root**: `C:\Users\Charles\.gemini\antigravity\scratch\Stables\public_stage`
*   **Status**: This contains a `.git` folder and is separate from the `1_development` sandbox. Use this folder for the final public compilation.

## 3. Master Reference & Brand Files
*   **Master Reference**: `C:\Users\Charles\.gemini\antigravity\scratch\Stables\stables_master_reference.md`
*   **2_current (Source of Truth)**: `C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current`
*   **Rule**: `2_current` is **Read-Only**. Do not duplicate assets if you can reference them, but since `public_stage` is a separate repo, you may need to explicitly "release" (copy) approved assets into `public_stage/assets` when ready.

## 4. Public Narrative & Messaging Constraints
*   **Tagline (Strict)**: "Money that is truly yours. Secure, Pseudonymous and Unstoppable."
*   **Forbidden**:
    *   "Stables Protocol" (Use "Stables").
    *   "DAO" (Use "The Stables Council").
    *   "Crypto" / "DeFi" (Forbidden in copy; allowed in Hashtags only).
*   **Tone**: Accessible, Sovereign, Premium.

## 5. Content Scope for GitHub Index (README)
*   **Audience**: General Public (Non-crypto natives).
*   **Must-Include Sections**:
    *   **What is Stables?**: "The Money Platform".
    *   **The 3 Pillars**: Secure, Pseudonymous, Unstoppable.
    *   **Platform**: "Built on Minima" (Simple explanation: "Runs on your phone/node").
    *   **Call to Action**: "Join the Stables Council".
*   **Avoid**: Tokenomics, complex governance, legal/regulatory guarantees.

## 6. Technical Detail Level
*   **Level**: High-level.
*   **Context**: Explain it is a **MiniDapp**. "Runs locally on your Minima node."
*   **Details**: Keep deep technical docs (architecture, build steps) in a generic `docs/` folder or separate `TECHNICAL_OVERVIEW.md`. The main README is for the public.

## 7. Social Media Presence
*   **Primary**: X (Twitter).
*   **Handle**: `@StablesCouncil`.
*   **Tone**: Professional, Sovereign, Confident.
*   **Constraints**: Pinned post must feature the Tagline.

## 8. Visual & Asset Usage
*   **Avatar**: Square crop of `master_symbol.png` (from `2_current/assets/brand_masters/`).
*   **Banner**: `master_twitter_header.png`.
*   **Favicon**: Resize `master_symbol.png`.
*   **Rule**: **NO NEW LOGOS**. Use the provided Masters only.

## 9. Roadmap & Disclosure
*   **Scope**: Focus on MVP Features (Wallet, Send, Exchange, Contacts).
*   **Timeline**: "Coming 2025" or "In Development". Avoid specific monthly dates unless instructed.

## 10. Legal / Compliance
*   **Disclaimers**: Standard open-source / beta software disclaimers. "Not financial advice." "Experimental software."
*   **Avoid**: "Investment", "Yield", "Bank", "Deposit". Use "Hold", "Balance", "Assets".
