# Stables — Project Roadmap
**Version**: 3.0
**Date**: 2026-02-24
**Status**: Working Document — Living Reference
**Author**: AI Draft → Pending User Promotion to `2_current/`

> *Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
> *Built on MINIMA* → https://minima.global

---

## WHERE WE STAND TODAY

Before plotting the path forward, here is an honest single-page snapshot:

| Area | State | Blocker |
| :--- | :---: | :--- |
| Vision & destination | ✅ Locked | — |
| Protocol mechanics (balance sheet, CR, fees) | ✅ Locked | — |
| Economic model (xMinima, Coverage Fund, DEX) | ✅ Designed | — |
| Community strategy | ✅ Designed | Cluster Spark not yet launched |
| Visual identity & brand | ✅ Locked | — |
| Social presence | ✅ Active | Phase -2 content ongoing |
| Council structure | ✅ Designed | Not yet formed |
| Oracle solution | ❌ Not finalized | Blocks smart contracts |
| Smart contracts | ❌ Not started | Waiting on oracle + spec |
| MiniDapp (app) | ❌ Not started | Waiting on contracts |
| NFT treasury | ❌ Not launched | Blocks test rewards + audit |
| Lending system design | ❌ Not designed | Post-launch phase |
| Hardware device | ❌ Concept only | Post-launch phase |

**The honest gap**: Everything above the smart-contract line is done. Everything below it needs to be built. The roadmap below is the bridge.

---

## THE NORTH STAR SEQUENCE

```
STRATEGY LOCKED  ←  You are here
      ↓
[M0]  Technical Specification + Oracle Decision + Minima Review
      ↓
[GATE] NFT Treasury Financed  ($200K target)
      ↓
[M1]  MiniDapp Built (Alpha)
      ↓
[M2]  Testing Epochs 1–4  (Quest for The Key)
      ↓
[M3]  Production Launch + First Clusters
      ↓
[M4]  Hardware Device  (Minima Node on Chip)
      ↓
[M5]  Council Handover  (Founding team holds zero control)
      ↓
[M6]  Lending Layer  (Personal + Commercial)
      ↓
[M7]  Full On-Chain Banking
```

---

## THREE PARALLEL STREAMS

The three streams below run **independently**. Progress in any one does not block the others. They converge at Production Launch.

```
STREAM 1: TECHNICAL          STREAM 2: COMMUNITY         STREAM 3: GOVERNANCE
─────────────────────────    ────────────────────────     ────────────────────
Oracle → Spec → Contracts    Phase-2 Content → Clusters   Council Formation
→ MiniDapp → Testing          → NFT Treasury → Ecosystem   → Operations
→ Launch → Hardware                                         → Handover
```

---

## STREAM 1 — TECHNICAL DEVELOPMENT

### M0 — Technical Specification *(Current Sprint)*

**Goal**: A written blueprint that a Minima developer can implement without ambiguity.

| Task | Priority | Status |
| :--- | :---: | :--- |
| Oracle design — choose approach (hybrid: multi-source + TWAP + community validation) | 🔴 Critical | ❌ |
| Smart contract spec: Stablecoin minting (Minima → USDs / EURs / CADs) | 🔴 Critical | ❌ |
| Smart contract spec: xMinima smart router (no liquidation, CR-gated burn) | 🔴 Critical | ❌ |
| Smart contract spec: Coverage Fund (cfTokens, fee distribution, conversion trigger) | 🔴 Critical | ❌ |
| Smart contract spec: DEX (all stablecoins ↔ Minima, xMinima ↔ Minima) | 🔴 Critical | ❌ |
| Smart contract spec: Merchant payment contract | 🟡 High | ❌ |
| Lending contract design (personal + commercial) | 🟡 High | ❌ |
| Submit spec to Minima team for compatibility review | 🔴 Critical | ❌ |
| Incorporate Minima team feedback | 🔴 Critical | ❌ |

**Exit criteria**: Spec submitted to Minima team, feedback received and incorporated.

---

### M1 — MiniDapp (Alpha Build)

**Goal**: A functional MiniDapp covering all core sections. Uses testnet Minima only.

**MiniDapp Sections** (from protocol spec §8):

| Section | Core Features |
| :--- | :--- |
| **Wallet** | Multi-currency balances, transaction history, Send / Receive / QR |
| **Mint & Burn** | Minima ↔ stablecoins; Minima ↔ xMinima (smart router); CR-status display |
| **Coverage Fund** | Deposit / redeem cfTokens; live value (on-the-fly calc); yield tracking |
| **Swap (DEX)** | All stablecoins ↔ Minima; xMinima ↔ Minima; liquidity pool management |
| **Merchant Tools** | Payment request generation; QR codes; dashboard; transaction history |
| **Governance** | Council vote display (read-only at Alpha); parameter view |

**Exit criteria**: All sections functional on testnet; internal review passed.

---

### M2 — Testing Epochs (Quest for The Key)

Four progressive epochs, each double the previous participant count, each adding complexity.

| Epoch | Testers | Focus | Pass Criteria |
| :--- | :---: | :--- | :--- |
| **Epoch 1** | 50–100 | Core: mint, burn, send, receive, wallet | Zero critical bugs in core flows |
| **Epoch 2** | 100–200 | Advanced: xMinima smart router, Coverage Fund, DEX | xMinima mechanics verified under stress |
| **Epoch 3** | 200–500 | Economic stress: CR crisis simulation, coverage fund conversion | Self-correcting mechanics validated |
| **Epoch 4** | 500+ | Security + adversarial + external audit | Audit report received; all criticals resolved |

**Gate requirement before Epoch 4**: NFT treasury must be funded (audit is the largest single cost).

**Exit criteria**: External security audit report. All critical and high findings resolved.

---

### M3 — Production Launch

**Goal**: Real Minima collateral. Real stablecoins. Live merchants.

| Deliverable | Notes |
| :--- | :--- |
| Production smart contracts deployed | After audit sign-off |
| First stablecoins minted (USDs, EURs, CADs) | With real Minima collateral |
| DEX live with initial liquidity | xMinima tradable from day one |
| Merchant API live | First cluster merchants onboarded |
| 24/7 monitoring + incident response | Protocol health dashboard |

**Exit criteria**: First real transaction processed. First merchant live.

---

### M4 — Hardware Device

**Goal**: A dedicated device with a Minima node on chip — offline-capable, secure.

| Phase | Milestone |
| :--- | :--- |
| Hardware design finalized | Minima node on chip; secure element; offline tx capability |
| Prototype | Working unit running Stables MiniDapp |
| First batch | 1,000 units; sold/distributed to xMinima holders and early adopters |

**Timeline**: Hardware development begins in parallel with Testing Epochs. Targets delivery 6 months post production launch.

---

## STREAM 2 — COMMUNITY & ECOSYSTEM

### Now — Content Phase -2 *(Active)*

**Platforms**: Instagram, X, Facebook, Telegram, YouTube
**Content**: Who we are / philosophy / objectives / the 3 pillars (Secure, Pseudonymous, Unstoppable)
**Cadence**: 2 posts/week → scaling to daily by Phase 5

| Content Phase | Timing | Theme |
| :--- | :--- | :--- |
| **Phase -2** | Now | Foundation: who we are, philosophy, 3 pillars |
| **Phase -1** | Week 0, Days 1–3 | Platform structure — where to find Stables |
| **Phase 0** | Week 0, Days 4–7 | Communication plan revealed |
| **Phase 1** | Weeks 1–8 | The 3 Pillars — what users can do |
| **Phase 2** | Weeks 9–16 | General concepts — how it works |
| **Phase 3** | Weeks 17–24 | Structure & approach — how we're building |
| **Phase 4** | Weeks 25–32 | Technical detail — Discord & GitHub launch |
| **Phase 5** | Weeks 33+ | User stories & testimonials |

---

### Cluster Spark *(Ready to Launch — No Technical Blocker)*

**Goal**: Find the first real-world cluster. Prove circular economy works before mainnet.

**Mechanics — Cluster Challenge (Bronze → Silver → Gold)**:

| Level | Requirement | Reward |
| :--- | :--- | :--- |
| **Bronze** | 10+ users + 3+ merchants transacting | Recognition + early access |
| **Silver** | 50+ users + 10+ merchants, money velocity ≥ 2×/month | NFT reward + Epoch 1 slots |
| **Gold** | 200+ users + 30+ merchants, self-sustaining economy | Council seat nomination eligibility |

**Ambassador program** (v3 — locked):
- Flat listing fee structure; 50/50 split Council / Ambassador
- Any user can become an ambassador — natural incentive against gaming
- Revenue share from merchant transactions: perpetual

**Critical mass targets** (before Production Launch):
- 5 thriving clusters
- 1,000+ users
- 100+ merchants
- xMinima holders: 500+

---

### NFT Treasury *(Financing Gate)*

**Goal**: Fund the things that cannot be crowd-sourced — testing rewards, security audit, first hardware batch.

| Tier | Price | Supply | Purpose |
| :--- | :--- | :--- | :--- |
| **Founding Supporter** | TBD | Limited | Early believer access |
| **Council Patron** | TBD | Limited | Governance recognition |
| **Genesis Builder** | TBD | Very limited | Hardware device priority + founding perks |

**Target raise**: $200,000
**Allocation**:
- Testing epoch rewards: 30%
- External security audit: 40%
- First hardware batch (1,000 units): 20%
- Council operations reserve: 10%

**Transparency**: Full on-chain treasury reporting. No anonymous wallets. Minima-native.

---

## STREAM 3 — GOVERNANCE & HANDOVER

### During Testing — Council Formation

**Goal**: 20-seat Council formed and operational before Production Launch.

| Seat Type | Count | Selection |
| :--- | :--- | :--- |
| **Founding** | 5 | Appointed by founding team |
| **Elected** | 10 | Community vote (time-weighted: xMinima 3×, r-Tokens 2×, Stables 1×) |
| **Merit** | 5 | Track record in Cluster Challenge or testing |

**Locked parameters** (Council cannot change):
- Fee formula: `min($1.00, amount × 0.01%)`
- CR hard floor: 100%
- xMinima: no funding fees, no liquidation — ever

**Council-adjustable parameters** (supermajority: 15/20):
- CR threshold (default 110%; floor 100%)
- Stablecoin currencies supported
- Merchant listing fee structure

---

### After Launch — Council Operations

**Revenue flows to Council Treasury**:
- Merchant listing fees (flat fee per merchant onboarded)
- Ambassador program management
- Cluster Challenge administration

**Transparency requirements**:
- Monthly treasury report (on-chain, publicly auditable)
- All governance proposals public with 7-day comment period
- Vote results recorded immutably on Minima

---

### Post-Critical-Mass — Full Handover

**Trigger**: 5 functioning clusters + audit complete + Council 6 months operational

| Phase | Action |
| :--- | :--- |
| Month 1–2 | Transfer all social media credentials to Council |
| Month 3–4 | Transfer all treasury keys and smart contract admin |
| Month 5–6 | Transfer GitHub and MiniDapp signing keys |
| Month 7 | Founding team holds zero control — full decentralization |

---

## FUTURE BANKING LAYER (Post-Ecosystem)

*These are design-phase only. Not started. Sequenced after critical mass is proven.*

| Feature | Mechanism | Dependency |
| :--- | :--- | :--- |
| **Personal Lending** | Collateral-backed + Integritas income verification | Integritas integration spec |
| **Commercial Lending** | For merchants operating on Stables | Merchant track record data |
| **Employment Contracts** | Smart contract salaries, automatic deductions | Employer/employee onboarding |
| **On-Chain Credit Scoring** | Portable pseudonymous reputation — no KYC | Credit scoring spec |
| **Mortgages** | Property-backed, instant closing | Legal structure per jurisdiction |
| **Full Financial Life** | Insurance, investment products, retirement | Regulatory research |

---

## WHAT NEEDS TO BE DESIGNED NEXT

These are the gaps that must be filled before work can begin on the corresponding stream:

| Item | Stream | Priority | Owner |
| :--- | :---: | :---: | :--- |
| Oracle design decision (hybrid TWAP approach) | Technical | 🔴 Critical | Founding team |
| NFT treasury collection design (tiers, pricing, artwork) | Community | 🔴 Critical | Founding team |
| Lending contract design (personal + commercial) | Technical | 🔴 High | Founding team |
| Integritas integration specification | Technical | 🟡 Medium | Post-lending design |
| Cluster Spark campaign launch | Community | 🟢 Start now | Ambassadors |
| DEX listing strategy for xMinima | Technical | 🟡 Medium | Post-M1 |

---

## MILESTONE TIMELINE (Estimated)

This is indicative only. No dates are committed until Minima team review is complete.

```
NOW         M0: Tech Spec + Oracle Decision + Minima Review   ← 2–3 months
            ↕ (running in parallel)
            Community: Phase -2 → Phase 0
            NFT Treasury: Design + Launch

M0+1mo      MiniDapp Alpha Build begins                        ← 3–5 months
            NFT Treasury: Active raise

M1          Alpha complete                                     ← 6 months from now
            Testing Epoch 1 begins
            Cluster Spark: First Bronze clusters

M2          Testing Epochs 2–4                                 ← 9–15 months from now
            External security audit (Epoch 4)
            Council formed

M3          PRODUCTION LAUNCH                                  ← 15–18 months from now
            First real stablecoins minted
            DEX live
            First merchants

M4          Hardware Device (first batch: 1,000 units)         ← 21–24 months from now

M5          Full Council Handover                              ← 24–30 months from now

M6+         Lending Layer, Full On-Chain Banking               ← 30+ months from now
```

---

## GUIDING PRINCIPLES (Never Negotiate These)

1. **Protocol health first** — CR rules protect users even when it is painful
2. **Full transparency** — every mechanism explainable in plain language
3. **No sales ever** — no token pitch, no investment pressure, donation-only
4. **Pseudonymous, not anonymous** — verifiable without identity exposure
5. **No jargon in public communication** — speak to general public, not crypto insiders
6. **Built on MINIMA** — every communication carries this attribution

---

*Built on MINIMA* → https://minima.global
*Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
