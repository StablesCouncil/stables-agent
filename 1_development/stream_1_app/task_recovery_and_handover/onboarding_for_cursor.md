# Stables Onboarding Guide for Cursor

Welcome to the team. You are now part of the **Stables** project (formerly "Stables Protocol" - do not use that name).

To assist effectively, you must strictly adhere to the **Stablesworks Protocol**. This document outlines everything you need to know to survive and thrive here.

## 1. The Prime Directive: The Handshake
Before doing ANYTHING in a session, you must establish the ground rules.
**Your First Action**: Always ask to run the `/stablesworks` protocol or confirm you have read the **Master Reference**.
> "Refer to the Stables master reference file and confirm that you are now working on this basis."

---

## 2. The Physics of this World (Architecture)
You may be working in a **separate repository** or **working folder** from the main Stables project. You must adapt.

### Locate the Mothership (The "Stables Reference")
You must find the path to the main **Stablesworks** repository to access the Source of Truth/Assets.
*   **Action**: If you do not see `2_current` in your root, ASK THE USER for the path to the `Stables/2_current` folder.

### `2_current/` (The Global Source of Truth)
*   **Location:** Inside the main Stablesworks repo.
*   **Rule:** This is **READ-ONLY**. You must reference assets here (e.g., logos) via absolute path.
*   **NEVER** copy these files into your local repo unless explicitly told to. Link to them or reference them.

### Your "Sandbox" (Your Current Folder)
*   **Location:** Wherever you are working right now.
*   **Rule:** This is your `1_development`. You can create and edit files here freely.
*   **Promotion:** When your work is done, the User will manually handle the merge/promotion to the main Stables project if necessary.

### `3_archive/`
*   **Location:** Main Stablesworks repo.
*   **Rule:** Archives live in the mothership.

---

## 3. The Golden Set (Vested Assets)
We do not "generate" random logos. We **Extract** and **Composite** from the Master references.
**Location:** `2_current/assets/brand_masters/`

*   **`master_symbol.png`**: The Hi-Res 3D "S". The source of all icons.
*   **`master_wordmark_transparent.png`**: The Verified 3D "STABLES" text.
*   **`master_twitter_header.png`**: official banner.

> **CRITICAL**: If asked for a logo, icon, or favicon, you MUST derive it from these files. Do not create new geometry.

---

## 4. Brand Intelligence (Vocabulary & Voice)
Speak correctly or don't speak at all.

| Term | Status | Usage To Use | Note |
| :--- | :--- | :--- | :--- |
| **"Stables"** | ✅ | "Stables" | Never "Stables Protocol". Always plural. |
| **"Council"** | ✅ | "The Stables Council" | Never "DAO". |
| **"MiniDapp"** | ✅ | "MiniDapp" | We do NOT have a website. We live on Minima. |
| **"Crypto"** | ⚠️ | Hashtags ONLY | Do not use "crypto/DeFi" in copy. Use "Money". |

**Tagline (Strict):**
> "Money that is truly yours. Secure, Pseudonymous and Unstoppable."

**The 3 Pillars:**
1.  **Secure**
2.  **Pseudonymous**
3.  **Unstoppable**

---

## 5. Visual Identity (The Look)
*   **Theme**: Dark Slate (`#0b0f14`) & Neon Cyan (`#67e8f9`).
*   **Style**: Glassmorphism (Translucent panels, blurs).
*   **Typography**: System UI Sans-Serif (Clean, modern).

---

## 6. Context Initialization (Mandatory Request Format)
To minimize friction, **You MUST** include the following context when requesting assistance or handing over work. If the User has not provided this, **ASK FOR IT**.

1.  **Project Overview**: One sentence. What is it, what problem does it solve, who is it for?
2.  **Core Features**: Bullet points. Must-have vs. Nice-to-have.
3.  **Technical Context**:
    *   Stack: (e.g., HTML/JS/CSS, Minima MiniDapp)
    *   Existing repositories or environments.
4.  **Constraints**: Timeline, platforms (MiniDapp Only), any specific budget or file size limits.
5.  **Priorities**: What is the immediate next step or MVP scope?

> **Tip**: Pasting this context allows us to immediately generate a concrete roadmap, propose the tech stack, and start scaffolding files in your workspace.

---

## Summary of Your Workflow
1.  **Initialize**: Read `stables_master_reference.md`.
2.  **Context**: Ensure you have the Project Overview & Constraints defined (Section 6).
3.  **Plan**: Check `2_current` for existing assets/code.
4.  **Build**: Write code/assets in `1_development`.
5.  **Review**: Ask User for approval.
6.  **Hands-off**: Let the User promote to `2_current`.

**You are ready.**

---

## 7. Active Project Context (COPY THIS TO CURSOR)
*Use this block to initialize your session.*

**1. Project Overview**
> **Stables** is a **MiniDapp** running on the Minima network (L1), providing a "Money Platform" for the general public to hold, send, and exchange stable assets (mUSD, mEUR, etc.) privately and without censorship. It solves the problem of digital cash usability and sovereignty.

**2. Core Features (MVP)**
*   **Wallet Interface**: View balances for mUSD, mCAD, mEUR, mIRT.
*   **Send/Receive**: Simple flows using Minima addresses/QR codes.
*   **Exchange**: Swap interface for stable-pairs.
*   **Contacts**: Address book management.
*   **Multilingual**: Native support for EN, FR, DE, FA (RTL).

**3. Technical Context**
*   **Stack**: Vanilla HTML5, CSS3 (Variables-heavy), Vanilla JavaScript (ES6+).
*   **Platform**: **Minima MiniDapp** (Static web app served locally by the Minima node).
*   **No Frameworks**: No React/Vue/Angular. pure DOM manipulation for maximum auditability and zero build-step complexity (unless specified otherwise in `tools/`).
*   **Source of Truth**: `2_current/` directory in the main repo.

**4. Constraints**
*   **Environment**: Strictly isolated. No external API calls (CORS blocked by Minima). All data comes from the Minima JS Bridge (`MDS.js`).
*   **Design**: Strict **Glassmorphism**.
    *   Background: `#0b0f14`
    *   Accent: `#67e8f9`
*   **Brand**: MUST use assets from `brand_masters`.

**5. Priorities**
*   Maintain strict visual consistency (Glassmorphism).
*   Ensure all text is "Stables" (plural) and "Council".
*   Preserve the "Vested Assets" (do not reinvent the logo).
