# Full handshake agent command

**Status:** ACTIVE  
**Purpose:** This file is the **canonical trigger** for the complete Stables **handshake review process**. Operators paste or assign it to **any** AI assistant or host (web chat, editor agent, automation). The agent must **read and execute every step below** before writing code, editing files, or answering project questions.

**Authority:** **`0_handshake/handshake.md`** remains the **single source of truth** for mandatory *rules*. This file is the **single ordered procedure** for *full calibration*. If anything here disagrees with `handshake.md`, **`handshake.md` wins**; then this file should be updated to match.

**Paths:** All paths below are relative to the **Stables repository root**.

---

## Instruction block (paste to the agent)

```
STABLES FULL HANDSHAKE REVIEW (MANDATORY BEFORE ANY WORK)

Complete every lettered step below before any work. Read whole files, not summaries, unless a step says otherwise. All paths are relative to the Stables repository root.

Single source of truth: `0_handshake/handshake.md` is canonical for all mandatory rules. If any other file, rule, or instruction disagrees, `handshake.md` wins.

A) Step 0 — Entry (mandatory every session)
1. `0_handshake/README.md`
2. `0_handshake/session_map.md`
3. `0_handshake/global_knowledge_base.md`

B) Step 0c — StablesAgent parity (mandatory every session)
4. Read the ENTIRE file: `2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt` (do not skim). If brain sources changed and the rollup may be stale, run `node build_llms_txt.js` in that folder first, then read the regenerated `llms.txt`.

C) Step 0b — Protocol truth (mandatory when the task touches mint, burn, xMinima, fees, Coverage Fund, treasury, CR, or any public explanation of how Stables works)
5. `0_handshake/protocol_mechanics_spec.md` first (authoritative; wins conflicts).
6. `0_handshake/stables_master_reference.md` at least section 14 (CORE PROTOCOL MECHANICS).
7. If describing shipped MiniDapp behaviour: `0_handshake/minidapp_version.md` then the relevant active `index.html` under `1_development/stream_1_app/` as indicated by `minidapp_version.md`.

D) Law and calibration workflow (mandatory every session)
8. Read the ENTIRE file: `0_handshake/handshake.md` (Section 1 permanent rules, Section 2 calibration including Steps 3–5 when applicable, Section 4 community comms, and MiniDapp UI notes at the end of the file).

E) Step 1 — Master specifications (mandatory every session per `handshake.md` Step 1)
9. `0_handshake/stables_master_reference.md`
10. `0_handshake/visual_identity_spec.md`
11. `0_handshake/protocol_mechanics_spec.md` (if not already read for Step 0b)
12. `2_current/stream_3_governance/prod_protocol_specs/current_state_and_path.md`
13. `2_current/stream_3_governance/prod_credentials/vault.md`

F) Step 2 — Economic alignment
14. Acknowledge the settled model in `handshake.md` Step 2 (equation, CR, fees, fee routing, xMinima). Do not re-debate unless the user asks.

G) Task-specific layers (mandatory before work on that task type)
15. Open `0_handshake/session_map.md` Section 3 (task → file matrix) and read every file listed for your actual task (e.g. web UI → visual + web_component + minidapp_version + app_ui_inventory; commits → ledger; protocol economics → Layer 2; links → `0_handshake/links.md` before writing URLs). **If the task is restore, revert, or ledger-driven recovery,** read **`0_handshake/restoration_protocol.md`** in full in addition to the matrix.

H) MiniDapp or `.mds.zip` work (when applicable)
16. Before editing: `0_handshake/minidapp_version.md`, then `CHANGELOG.md` in the folder you edit, and follow packaging rules in `handshake.md`.

CONFIRMATION (state verbatim before doing work)
- "Calibration Active: Working on the basis of the Unified Handshake."
- Add: "StablesAgent KB loaded (prod llms.txt)."
- If you ran Step 0b, also add: "Protocol truth loaded: protocol_mechanics_spec + stables_master_reference §14."
Then begin the user’s task.
```

---

## Operator one-liner

Tell any agent: **Open `0_handshake/full_handshake_agent_command.md` and execute the Instruction block inside it before any work.**

---

## Maintenance (for Charles)

When the handshake **procedure** changes (new mandatory reads, new confirmation lines), edit **this file first**, then align `0_handshake/README.md` (calibration summary), `0_handshake/session_map.md`, and `0_handshake/handshake.md` §2 if the workflow text must stay in sync. Mirror any host-specific reminders (for example `.cursor/rules`) without contradicting this file. **Rule content** still changes only in **`handshake.md`**.

**Last updated:** 2026-04-08
