# Stables — Internal Master Roadmap (IMR)

**Version:** v1.0  
**Date:** December 28, 2025  
**Status:** Internal, non-binding, working reference

---

## 1. Purpose of this document

This Internal Master Roadmap (IMR) is the authoritative internal reference for the Stables project. It consolidates all architectural, governance, funding, sequencing, and disclosure decisions agreed upon between the core contributors.

This document is **not public-facing**. It exists to:
- maintain coherence over time,
- prevent scope drift,
- ensure consistency between internal intent and external communication,
- act as a constraint framework for future decisions.

Unless explicitly superseded, this document governs all internal reasoning and planning.

---

## 2. Core objective (non-negotiable)

The ultimate objective of Stables is to **explore, design, and test an algorithmic Stablescoin** through a security-first, adversarial, and staged approach.

Key characteristics:
- algorithmic in nature,
- non-custodial,
- censorship-resistant,
- governed by transparent, verifiable, on-chain rules,
- designed to be owned and operated by its participants.

No shortcut, acceleration, or external pressure overrides this objective.

---

## 3. Foundational principles

These principles apply across all phases:

- **Security before growth**: correctness and resilience always precede adoption.
- **No automatic progression**: every stage is conditional and explicitly validated.
- **Code over discretion**: protocol behavior is enforced by logic, not committees.
- **Transparency by default**: subject to real-world constraints.
- **Separation of concerns**: development, funding, governance, and protocol logic remain distinct.

---

## 4. Phased structure (internal view)

### Phase 0 — Concept & architecture locking (current / completed)

- Define mint / burn / collateral logic
- Define oracle boundaries and attack surfaces
- Identify failure modes and invariants
- Lock terminology and narrative discipline

Output:
- Clear protocol intent
- Initial UI and visual charter
- Internal roadmap (this document)

---

### Phase 1 — Proof of Use Concept (PUC)

Objective: build a **working but isolated system**.

Characteristics:
- Fake / faucet-based assets only
- No economic value
- Minting and burning fully functional
- Oracle inputs teStables and manipulable

Key rule:
> Nothing of value enters the system at this stage.

---

### Phase 2 — Public testing (with caps)

Objective: adversarial testing under controlled constraints.

Features:
- Public access via faucet assets
- Explicit caps on:
  - deposits
  - minting
  - exposure
- Continuous testing encouraged

Funding:
- **Voluntary donations** may be introduced at this stage
- Donations:
  - are optional,
  - are for development only,
  - do not grant protocol rights.

---

### Phase 3 — Public testing (without caps)

Objective: observe system behavior without artificial ceilings.

Features:
- Removal of testing caps
- Stress testing under broader conditions
- Monitoring of emergent behaviors

No guarantee of progression beyond this phase.

---

### Phase 4 — External review & verification

Objective: independent scrutiny.

- Third-party review
- Verification of assumptions
- Security analysis

Funding source:
- NFT treasury (see Section 5)

Progression is **explicitly conditional** on outcomes.

---

### Phase 5 — Restricted production launch

Objective: real-world deployment under strict constraints.

Features:
- Hard caps reintroduced
- Real assets allowed
- Conservative parameters

This is **not** full launch.

---

### Phase 6 — Expanded production

Objective: controlled relaxation.

Features:
- Caps adjusted to long-term intended limits
- Ongoing monitoring
- Governance feedback loops

---

### Phase 7 — Protocol expansion & resilience

Objective: long-term robustness.

Directions:
- Multi-asset support
- Multi-currency support
- Participation across multiple economic contexts
- Risk dispersion

No asset list is pre-committed.

---

## 5. Funding architecture (strict separation)

### 5.1 Donations

- Introduced at Phase 2
- Voluntary
- Intended solely for development support
- No protocol rights attached

---

### 5.2 NFTs (coordination only)

NFTs are introduced at a later stage with **fixed supply**.

Purpose:
- Pay third-party costs (audits, reviews)
- Enable structured community coordination

Rules:
- Development team does not directly touch NFT funds
- All expenses are disclosed where possible
- Remaining funds are:
  - injected into the protocol, and
  - redistributed pro-rata to NFT holders in protocol units, subject to technical constraints

---

## 6. Governance model (internal clarity)

NFT holders:
- form a **coordination committee**,
- validate major development directions,
- approve progression between significant stages.

They:
- do **not** modify protocol logic,
- do **not** override on-chain rules,
- do **not** control funds discretionarily.

Governance is directional, not operational.

---

## 7. Transparency & safeguards

- Expenses are disclosed as transparently as possible
- Records are timestamped using **Integritas** where applicable

In case of project discontinuation:
- remaining funds after expenses are intended to be returned equally via the protocol,
- subject to technical feasibility.

---

## 8. Disclosure discipline

- Internal roadmap ≠ public roadmap
- NFT documentation and DAO charter are communicated later
- No feature is publicly implied before internal validation

---

## 9. Versioning & change control

- This document is frozen as **IMR v1.0**
- Any modification requires:
  - new version number
  - date
  - explicit change description

No silent changes.

---

## 10. Closing note

This document prioritizes patience, correctness, and resilience. Growth is optional. Stability is mandatory.





