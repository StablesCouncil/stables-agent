# Stables — Global knowledge base (how we assemble truth)

**Purpose:** One map so people and models read the **same layers in the same order**. This file does not replace the specs; it **points** to them.

**Handshake binding:** Every agent running **`handshake.md`** must read this file in **Step 0**, immediately after **`README.md`** and **`session_map.md`**. Use it as the **routing table** for which canonical documents to open next.

**StablesAgent parity (Step 0c):** Immediately after this index, read the **entire** **`2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt`** so the session has the **same holistic public corpus** as the in-app / Telegram agent (rollup of all promoted brain `*.md`). Then load **`handshake.md`**, task-specific layers from **`session_map.md`**, and **Step 0b** when economics or protocol copy apply. If `llms.txt` disagrees with **`protocol_mechanics_spec.md`**, the spec wins — fix the brain markdown and regenerate `llms.txt`.

**Full handshake review:** When the operator requires exhaustive calibration in one pass, the agent follows **`0_handshake/full_handshake_agent_command.md`** (Instruction block) before work. That file is the canonical procedure; this index still applies for layer routing after Step 0.

---

## Layers (bottom = most durable governance, top = fastest iteration)

| Layer | Role | Canonical locations (examples) |
|------|------|--------------------------------|
| **1. Charter** | Why we exist, rights and limits of the Council, plain-language north star | Draft/work: `1_development/stream_3_governance/prod_governance_papers/stables_charter.md` (+ companion). Promoted: `2_current/stream_3_governance/prod_stables_charter/`. Brain mirror: `charter_overview.md` in brain folders. |
| **2. Locked mechanics** | Mint/burn, CR, Coverage Fund, cf, xMinima, fees (settled math and rules) | **`0_handshake/protocol_mechanics_spec.md` — wins any conflict.** Promoted mirror: `2_current/stream_3_governance/prod_protocol_specs/protocol_mechanics_spec.md`. |
| **3. Master reference** | Terminology, links, economics summary, §14 locked mechanics recap | `0_handshake/stables_master_reference.md` (keep aligned with layer 2). |
| **4. Agent brain** | Searchable knowledge for Telegram / web / external agents | **Source of truth after promotion:** `2_current/stream_3_governance/prod_stablesagent-brain-base/`. Sandbox drafts: `1_development/stream_3_governance/task_stablesagent-brain-base/`. Rebuild vectors: `ingest_knowledge.js` in `task_x_agent_node` (see brain `README.md`). |
| **5. Shipped product** | What users actually see | Active MiniDapps: **showcase** `prod_stables_app_v00.00.00.00.03/`, **demo** `prod_stables_app_demo/` (`minidapp_version.md`). **Dev version rule:** `vPM.Pn.TT.DD.SS` (Cursor: `stables-handshake.mdc` § Development versioning). Inventory: `app_ui_inventory.md`. |
| **6. Comms & links** | URLs, tone, campaigns | `0_handshake/links.md`, `2_current/plan/` tone and strategy docs. |

---

## Rules models must follow

1. **Tie-breaker:** If any narrative disagrees with **`protocol_mechanics_spec.md`**, the spec wins. Fix the prose, do not improvise economics.
2. **Charter vs mechanics:** Charter sets **intent and governance**; mechanics spec sets **exact protocol behaviour**. Public copy can follow the Charter’s simplicity; internal and agent answers must still match mechanics.
3. **Handshake Step 0b:** For anything touching mint, burn, xMinima, Stables, fees, CR, treasury, or protocol explanations, run **`handshake.md` [Step 0b]** before writing.
4. **Promotion:** Draft in `1_development` → you review → you promote to `2_current` → brain ingest when the brain must quote it.
5. **X (Twitter) copy (mandatory):** Before drafting or editing **any** X post, read **`handshake.md` §4** (*Community Communication Rules* → *X/Twitter Specifics (STRICT)*). **Hashtags are required on every X post.** **Mandatory base set:** `#BYB #Stablecoin #Minima`. **If space remains** within 280 characters, add `#BeYourBank`, then other relevant tags (e.g. `#Stables`). **Never** use hashtags in Telegram community posts. **Never** use an em dash (—) in public copy (same section). If `stables_master_reference.md` messaging bullets disagree on hashtag wording, **`handshake.md` §4 wins.**

---

## How to “refresh” any model in one message

**Full handshake review (exhaustive):** Tell the agent to read and execute **`0_handshake/full_handshake_agent_command.md`** (Instruction block) before any work.

**Protocol-only refresh (economics tasks):**

> Read `0_handshake/global_knowledge_base.md`, the full `2_current/stream_3_governance/prod_stablesagent-brain-base/llms.txt`, then `handshake.md` Step 0b; answer from Charter (intent) + `protocol_mechanics_spec.md` (facts).

---

## Maintenance (for Charles)

- When the **Charter** changes meaningfully: update promoted copy under `2_current/.../prod_stables_charter/`, then brain files, run **`node build_llms_txt.js`** in `prod_stablesagent-brain-base/`, and **ingest** if the Telegram/web agent should quote it.
- When **mechanics** change: edit `0_handshake/protocol_mechanics_spec.md` first, mirror to `2_current` when promoted, reconcile `stables_master_reference.md` §14, then brain + ingest.
- When the **app** changes: bump `minidapp_version.md` if needed, update `app_ui_inventory.md`, and add entries to the active MiniDapp **`CHANGELOG.md`** (`prod_stables_app_*/CHANGELOG.md`) for anything worth communicating on release.

**Last updated:** 2026-03-31 (Rule 5: X hashtag mandate points to `handshake.md` §4.)
