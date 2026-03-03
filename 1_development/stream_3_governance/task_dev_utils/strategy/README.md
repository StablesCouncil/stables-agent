# Stables Strategy Documents
**Last Updated:** 2026-02-24
**Location:** `1_development/strategy/`

---

## 🔒 TIER 1 — LOCKED & SETTLED
> These documents contain final decisions. Do not re-discuss unless the user explicitly requests a change.
> The master reference is the single entry point — read it first.

### **[ROOT] Master Reference** ← START HERE
**File:** [`stables_master_reference.md`](../../stables_master_reference.md) *(project root)*
**Contains:** Handshake protocol, brand rules, visual identity, and all locked economic decisions
- Section 13: Financial Architecture (balance sheet)
- Section 14: Core Protocol Mechanics (CR rules, fees, coverage fund, xMinima)

### **Protocol Mechanics Specification**
**File:** [`protocol_mechanics_spec.md`](./protocol_mechanics_spec.md)
**Purpose:** Full detailed specification of all protocol mechanics
**Use this for:** Smart contract design, DEX implementation, coverage fund mechanics, fee logic
**Status:** 🔒 LOCKED (v3.0 — 2026-02-24)

### **Current State & Path Forward**
**File:** [`current_state_and_path.md`](./current_state_and_path.md)
**Purpose:** Honest baseline of where the project is and the north star sequence to get there
**Use this for:** Orientation, prioritisation, onboarding new contributors
**Status:** 🔒 LOCKED (v1.0 — 2026-02-24)

---

## 📋 TIER 2 — DEVELOPMENT DOCUMENTS
> Working documents. Subject to revision.

| Document | Purpose | Status |
|---|---|---|
| [`stables_roadmap_v2.md`](./stables_roadmap_v2.md) | Phase-by-phase roadmap | Development |
| [`technical_specification_v2.md`](./technical_specification_v2.md) | Technical architecture for Minima team | Pending review |
| [`economic_model_refinements.md`](./economic_model_refinements.md) | Edge cases, smart router, crisis recovery | Superseded by protocol_mechanics_spec |
| [`ambassador_program_v3.md`](./ambassador_program_v3.md) | Ambassador/merchant onboarding model | Development |
| [`governance_token_weighting.md`](./governance_token_weighting.md) | Time-weighted voting system | Development |
| [`cluster_challenge_detailed.md`](./cluster_challenge_detailed.md) | Gamified cluster formation | Development |
| [`merchant_fee_structure.md`](./merchant_fee_structure.md) | Merchant listing fees | Development |
| [`detailed_communication_plan.md`](./detailed_communication_plan.md) | Content strategy, 90+ post titles | Development |
| [`complete_vision_summary.md`](./complete_vision_summary.md) | Long-form vision (Phases 0–13+) | Reference |

---

## 📁 FOLDER STRUCTURE

```
Stables/
├── stables_master_reference.md    ← THE ANCHOR. Read at every session.
│
├── 1_development/
│   └── strategy/                  ← YOU ARE HERE
│       ├── README.md              (this file)
│       ├── protocol_mechanics_spec.md   ← LOCKED
│       ├── current_state_and_path.md    ← LOCKED
│       └── [other development docs]
│
├── 2_current/                     (Approved production files — read-only for AI)
│   ├── visual_identity_spec.md
│   ├── plan/
│   └── assets/brand_masters/
│
└── 3_archive/                     (Historical versions)
```

---

**Built on MINIMA** → https://minima.global
*Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
