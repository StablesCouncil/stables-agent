# Archived: Cursor Welcome Package (merged into README)

**Archived:** 2026-04-08  
**Reason:** Handshake onboarding is **platform-neutral**; content merged into `0_handshake/README.md` and procedure lives in `0_handshake/full_handshake_agent_command.md`. Do not use this copy for new sessions.

---

Below is the **frozen** last version before retirement (Cursor-specific wording retained for history only).

---

# Cursor Welcome Package: The Stables Co-Pilot Protocol

Copy and paste the following block into the **Cursor Composer** or **Cursor Chat (@Codebase)** at the start of your session.

**Single source of truth:** All mandatory rules are defined in **`0_handshake/handshake.md`**. This page is a **session shortcut** only. If any line below differs from `handshake.md`, follow **`handshake.md`**.

**Full handshake review:** Open **`0_handshake/full_handshake_agent_command.md`** and execute the **Instruction block** inside it before any work. That triggers the complete calibration procedure.

---

### **[MANDATORY HANDSHAKE: STABLES CO-PILOT]**

**Objective**: Join the Stables project as a secondary pilot alongside Antigravity.
**Context**: We are building a full on-chain banking system on Minima.

> [!IMPORTANT]
> **PROJECT RELOCATION NOTICE (2026-03-05)**
> The entire Stables project has been consolidated from ~38 scattered playgrounds into a single, permanent workspace.
>
> **Old location**: `C:\Users\Charles\.gemini\antigravity\scratch\Stables` (and various playground folders)
> **New location**: `C:\Users\Charles\Documents\Stables`
>
> All absolute paths in specs and configs now reference the new location. If you encounter any stale paths pointing to `.gemini\antigravity\scratch\`, they are outdated — the canonical root is `C:\Users\Charles\Documents\Stables`.

**Your Required Actions**:
1.  **Full calibration:** Execute every step in **`0_handshake/full_handshake_agent_command.md`** (Instruction block), including Step 0, Step 0c, conditional Step 0b, full **`handshake.md`**, Step 1 masters, Step 2, **`session_map.md`** task matrix for your task, and the confirmation lines at the end of that file.
2.  **When reverting or restoring:** Also read **`0_handshake/restoration_protocol.md`** in addition to what the Instruction block requires for your task.
3.  **Mirror-Stream Enforcement**: NO loose files at the root. All work must occur in `1_development/`, organized by `task_` or `prod_` folders.
4.  **Atomic Restoration Logging**: 
    - Every modification you make must be **Committed to Git**.
    - Every commit must be logged in `2_current/stream_3_governance/prod_project_ledger/ledger.md`.
    - Update the `2_current/stream_3_governance/prod_project_ledger/task.md` to track your progress and coordinate with Antigravity.
5.  **Confirm Alignment**: Use the exact confirmation phrases required at the end of **`full_handshake_agent_command.md`** before starting any work.

---

### **Current Project State**
- **Lead Pilot**: Antigravity (Google DeepMind)
- **Co-Pilot**: Cursor AI (Claude/Anthropic)
- **Authorized model**: Gemini 3 Flash (Antigravity) — Formerly banned, now authorized for all Stables work (revoked 2026-03-28).
- **Shared Brain**: `2_current/stream_3_governance/prod_project_ledger/task.md`
- **Git Root**: `C:\Users\Charles\Documents\Stables`

### **Project Structure**
```
C:\Users\Charles\Documents\Stables\          ← PERMANENT WORKSPACE ROOT
├── 0_handshake/          ← Calibration files (handshake, specs, visual identity)
├── 1_development/        ← Sandbox (AI-driven creation, drafts, task_ and prod_ folders)
├── 2_current/            ← Source of Truth (READ-ONLY for AI — user promotes here)
├── 3_archive/            ← Historical record (never delete, always move here)
└── .agent/workflows/     ← Slash commands (e.g. /handshake)
```

Do you confirm that you have read and locked these protocols into your active state?
