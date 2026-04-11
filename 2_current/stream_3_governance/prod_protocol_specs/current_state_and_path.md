# Stables — Current State & Path Forward
**Version**: 1.0
**Date**: 2026-02-24
**Status**: Working Document — Living Reference

---

## THE DESTINATION (Locked)

A full on-chain banking system — personal and commercial loans, stablecoin minting, and a sovereign hardware device running a Minima node on chip — structured on a clean balance sheet:

| Layer | Role | Instrument |
| :--- | :--- | :--- |
| **Assets** | Collateral held by the protocol | **Minima** |
| **Liabilities** | Money issued to users | **Stablecoins** (USDs, EURs, CADs…) |
| **Equity** | Ownership stake in the protocol | **xMinima** |

> **Minima (Assets) = Stablecoins (Liabilities) + xMinima (Equity)**

Revenue flows: transaction fees → Rebalance Pool → xMinima holders
Governance flows: merchant listing fees → Council Treasury

---

## WHERE WE ARE NOW

### What Exists Today ✅

**Strategy & Design (Complete):**
- Balance sheet model locked (Section 13, master reference)
- Economic model designed: CR mechanics, smart router for xMinima, stability pool (pUSDs), crisis state transitions
- Three-stream framework defined (Technical / Community / Governance)
- Ambassador program designed (v3) — flat listing fee, 50/50 split
- Merchant fee structure designed (grandfathered early adopters)
- Council structure designed (5 founding + 10 elected + 5 merit seats)
- Governance token weighting designed (time-weighted: Stables 1x, r-Tokens 2x, xMinima 3x)
- Cluster Challenge mechanics designed (Bronze → Silver → Gold)
- Hardware device vision documented

**Community & Brand (Active):**
- Visual identity locked (`2_current/visual_identity_spec.md`)
- Master brand assets locked (`2_current/assets/brand_masters/`)
- Social media presence established (X, Instagram, Facebook, Telegram, Discord)
- Content strategy in Phase -2 (Foundation: who we are, philosophy, objectives)
- Presentation live at https://stablescouncil.github.io/

**Technical (Not Started):**
- No smart contracts written
- No MiniDapp code beyond the presentation
- No oracle solution finalized
- No Minima team review completed

---

### The Honest Gap

| Area | State |
| :--- | :--- |
| Vision & destination | ✅ Locked |
| Economic model | ✅ Designed, not implemented |
| Community strategy | ✅ Designed, partially active |
| Governance structure | ✅ Designed, not formed |
| Smart contracts | ❌ Not started |
| MiniDapp (app) | ❌ Not started |
| Oracle | ❌ Not decided |
| Hardware device | ❌ Design phase only |
| Lending system | ❌ Not designed yet |
| Financing (treasury) | ❌ NFT collection not launched |

---

## THE PATH FORWARD

Three parallel streams — each independent, each feeding the others.

---

### STREAM 1: TECHNICAL DEVELOPMENT

**Now → M1: Technical Specification**
- Finalize oracle design (hybrid: multi-source + TWAP + community validation)
- Write full smart contract specifications:
  - Stablecoin minting contract (Minima → USDs, EURs, CADs)
  - xMinima contract (smart router, no liquidation)
  - Stability pool contract (pUSDs, fee distribution)
  - Merchant payment contract
  - Lending contract (personal + commercial) ← **needs design**
- Submit to Minima team for review
- Incorporate feedback

**M1 → M2: App Development (MiniDapp)**
- Wallet (multi-currency, pseudonymous)
- Minting UI (Minima → stablecoins, Minima → xMinima)
- Payments (send/receive/QR)
- Stability pool (one-click invest, 30-day yield display)
- Merchant tools (payment requests, dashboard)

**M2 → M3: Testing Epochs**
- Epoch 1: Core functionality (50–100 testers)
- Epoch 2: Advanced features + xMinima mechanics (100–200)
- Epoch 3: Economic stress testing (200–500)
- Epoch 4: Security + adversarial + external audit (500+)

**M3: Production Launch**
- Real Minima collateral, real stablecoins
- Full merchant API live
- 24/7 monitoring

**M4: Hardware Device**
- Dedicated device, Minima node on chip
- Offline transactions, secure element
- First batch: 1,000 units

---

### STREAM 2: COMMUNITY & ECOSYSTEM

**Now (Active): Content Phase -2**
- Philosophy and identity (who Stables is, what it stands for)
- Build audience on Instagram, X, Facebook, Telegram

**Next: Cluster Spark**
- Identify organic early adopter concentrations
- Recruit first cluster champions (ambassadors)
- Launch Cluster Challenge (Bronze → Silver → Gold)
- First target: 1 cluster with 50+ users + 10+ merchants

**Financing Gate: NFT Treasury**
- Launch 3-tier NFT collection (target: $200K)
- Funds: testing rewards + external audit + first hardware batch
- Transparent treasury management

**Ecosystem Critical Mass**
- 5 thriving clusters
- 1,000+ users, 100+ merchants
- Circular economies proven (money velocity >2×/month)
- xMinima holders: 500+

---

### STREAM 3: GOVERNANCE & HANDOVER

**During Testing: Council Formation**
- Form 20-seat Council (5 founding, 10 elected, 5 merit)
- Establish time-weighted voting (xMinima 3× weight)
- Define locked vs. flexible parameters

**After Launch: Council Operations**
- Council treasury funded by merchant listings
- Governance proposals, community votes
- Transparent treasury reporting

**Post-Critical-Mass: Full Handover**
- 6-month gradual handover of all assets
- Founding team holds zero control
- Protocol fully community-governed

---

### FUTURE BANKING LAYER (After Ecosystem Proven)

Once the base economy is stable and the Council is operational:

1. **Personal Lending** — collateral-backed + Integritas income verification
2. **Commercial Lending** — for merchants operating on Stables
3. **Employment Contracts** — smart contract salaries, automatic deductions
4. **Credit Scoring** — on-chain history, portable reputation
5. **Mortgages** — property-backed, instant closing
6. **Full Financial Life** — insurance, investment products, retirement

---

## WHAT NEEDS TO BE DESIGNED NEXT

The gaps that need a decision before work can begin:

| Item | Status | Priority |
| :--- | :--- | :--- |
| Lending contract design (personal + commercial) | ❌ Not designed | 🔴 High |
| Oracle decision (which approach) | ❌ Not finalized | 🔴 High |
| NFT treasury collection design | ❌ Not designed | 🔴 High |
| Integritas integration spec | ❌ Not designed | 🟡 Medium |
| DEX listing strategy for xMinima | ❌ Not designed | 🟡 Medium |
| Cluster Spark campaign launch | ❌ Ready to start | 🟢 Can start now |

---

## Fiat ↔ Stables via USDT bridge (ramp strategy sketch)

**Status:** Working note — 2026-04-06. **Not** a vendor commitment. Confirm every item with current bridge and ramp documentation.

### What “permissionless” can and cannot mean here

- **Fiat on/off is never permissionless** in the strong crypto sense: any regulated ramp that touches bank money will apply **KYC/AML**, **geo-blocks**, and **issuer rules**. That is unavoidable at the paper-money edge.
- What *is* aligned with Stables/Minima values is: **crypto lands in a user-controlled wallet** (or contract the user explicitly approves), **minimal custodial time**, **clear counterparty disclosure**, and **modular providers** so no single company sits on the full path.

### Target canonical path (streamlined)

**On-ramp (cash → Stables):** bank/card/local rail → **USDT** on a ramp-supported network → **Minima USDT bridge** (e.g. optional step already referenced in product copy: **MxUSDT ↔ USDT** via `https://mxusd.global/`) → acquire **MINIMA** on Minima (DEX / venues as today) → **mint Stables** in the app.

**Off-ramp (Stables → cash):** burn Stables → **MINIMA** → **USDT** on Minima side where the bridge supports it → move USDT to a network the ramp accepts → ramp **off** to bank.

The UX win is **one familiar intermediate asset (USDT)** and **documented steps**, not pretending the bank leg is decentralised.

### First-tier ramp partners to evaluate (USDT + wallet payout + SDK)

These are the usual **first calls** for a dapp that wants **USDT out** to a pasted address and a **developer integration**:

| Priority | Provider | Why shortlist |
| :--- | :--- | :--- |
| 1 | **Ramp** | Strong positioning on **direct-to-wallet** flow; broad EU/global footprint; common in self-custody wallets. |
| 1 | **Transak** | Mature **SDK**, wide **asset** and **payment method** coverage; common in DeFi apps. |
| 1 | **MoonPay** | Very high **distribution** and card/bank rails; good when you need **volume and recognition** (trade-off: cost/compliance friction varies by region). |
| 2 | **Coinbase Onramp / Pay** | Strong where **US** trust and compliance matter; check USDT networks and widget terms. |
| 2 | **Banxa** | Useful when you need **explicit licensing narrative** and multi-country coverage. |
| 2 | **Mercuryo** | Another frequent **card→crypto** option; compare spreads and supported chains for USDT. |
| 3 | **Onramper** (or similar) | **Aggregation**: one integration, many backends — good for **coverage** and **fallback** if a single provider blocks a country. |

**Aggregator caveat:** partner programs (e.g. Onramper) apply their **own KYB and restricted-industry lists** before any underlying ramp sees you. **Stablecoin, banking-style, or DeFi infrastructure** labels sometimes fail that first gate even when **direct** ramp relationships could still be possible. If an aggregator blocks you, treat it as **non-fatal**: pursue **direct** contracts with Tier 1 ramps (Ramp, Transak, MoonPay, etc.) and keep the **USDT → bridge → Minima** path unchanged.

**Stripe** (and similar commerce stacks) can matter later for **merchant checkout**, but the **first path** above is usually **USDT-centric B2C ramps** plus your own **in-app copy** for the Minima bridge and DEX.

### Engineering checklist before you pick one

1. **USDT contract + network** the ramp supports must match what the **Minima USDT bridge** expects on the “outside” leg (do not assume Ethereum if the bridge is tied to another chain).
2. **Wallet-only settlement**: ramp pays **USDT to the user’s address** (or in-app embedded wallet flow), not an opaque exchange balance.
3. **Off-ramp**: confirm **USDT sell** to bank/card for your target countries (often **harder** than on-ramp).
4. **Minima does not need to be listed on the ramp** if the path is **fiat → USDT → bridge → MINIMA → Stables**; listing **MINIMA** on ramps is a **separate** win, not required for this route.

---

## THE NORTH STAR SEQUENCE

```
STRATEGY LOCKED
      ↓
Technical Spec → Minima Review
      ↓
NFT Treasury Financed
      ↓
MiniDapp Built
      ↓
Testing Epochs (Quest for The Key)
      ↓
Production Launch + First Clusters
      ↓
Hardware Device
      ↓
Council Handover
      ↓
Lending Layer
      ↓
Full On-Chain Banking
```

---

**Built on MINIMA** → https://minima.global
*Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
