# Stables — Protocol Mechanics Specification
**Version**: 3.0
**Date**: 2026-02-24
**Status**: LOCKED — Core Design Decisions
**Supersedes**: v1.0

---

## 0. Design Principles

1. **No friction, no fees** on mint/burn operations
2. **Speed** = blockchain confirmation speed
3. **Balance sheet health** trumps user convenience — protective rules lock at defined thresholds
4. **Full transparency** — every mechanism is explainable in plain language
5. **Self-correcting** — all rules create natural incentives to restore health

---

## 1. The Balance Sheet (Revised)

```
ASSETS                          LIABILITIES (two tiers)               EQUITY
──────────────────────────────────────────────────────────────────────────────
Minima          =    Pure Stablecoins (Senior)                  +   xMinima
                  +  Coverage Fund Tokens (Junior, convertible)
```

### Liability Tiers — Why Two?

| Tier | Instrument | Nature | Risk |
| :--- | :--- | :--- | :--- |
| **Senior** | USDs, EURs, CADs… (user holdings) | Redeemable 1:1 for Minima at any time | Protected |
| **Junior** | cfUSDs, cfEURs, cfCADs… (Coverage Fund tokens) | Normally redeemable 1:1 + fees, but convertible to xMinima if CR drops | Absorbs first loss |

**Junior liability holders earn all protocol revenue in exchange for accepting conversion risk.**
**xMinima holders earn zero revenue — they hold pure leveraged equity.**

---

## 2. The Coverage Fund

### Purpose
The Coverage Fund is the protocol's shock absorber — a pool of stablecoins deposited by users willing to take on conversion risk in exchange for yield. It is the **buffer between the protocol's equity (xMinima) and its senior liabilities (stablecoins).**

### Fund Tokens (one per stablecoin)
| Deposited | Receive |
| :--- | :--- |
| USDs | USDscf |
| EURs | EURscf |
| CADs | CADscf |
| IRTs | IRTscf |
| etc. | etc. |

### Token Value — Calculated On the Fly
The value of a cf token is **not fixed**. It is calculated in real time from the current pool composition:

```
USDscf value = Total pool value (in USDs equivalent) / Total USDscf supply

Where "Total pool value" =
  (stablecoins in pool × 1.0) + (xMinima in pool × current xMinima price)
```

On entry (first deposit): USDscf = 1.0 USDs
Over time: USDscf > 1.0 as transaction fees accumulate
After a CR trigger: USDscf < 1.0 equivalent in pure stables (but holds some xMinima)

### Revenue Flow — All Fees Go Here

```
User/Merchant Transaction
         ↓
  Transaction Fee (formula-based)
         ↓
  Coverage Fund Pool
         ↓
  USDscf holders (proportional)
```

**xMinima holders receive zero transaction fees. Their upside is purely from Minima price appreciation (leveraged).**

### Transaction Fee Formula (LOCKED)

```
Fee = min($1.00,  amount × 0.01%)
No minimum. No floor.
```

| Transaction | Fee | Effective Rate |
| :--- | :--- | :--- |
| $0.01 | $0.000001 | 0.01% |
| $1.00 | $0.0001 | 0.01% |
| $100 | $0.01 | 0.01% |
| $1,000 | $0.10 | 0.01% |
| $10,000+ | **$1.00 (cap)** | ≤ 0.01% |

**Micropayment positioning**: Stables is viable for content tipping, per-second payment streams, and micro-merchant transactions where no legacy rail can compete. No minimum. For large amounts, the cap makes the effective rate progressively lower.

Flat 0.01% below $10,000, hard $1.00 cap above. Simple, ungameable.

### Fund Composition Rules

| CR | Fund State | What it holds |
| :--- | :--- | :--- |
| > 110% | NORMAL | 100% stablecoins only |
| ≤ 110% | ABSORBING | Stablecoins + xMinima (gradual conversion) |

### Conversion Mechanism (CR ≤ 110%)
When CR drops to or below 110%, the Coverage Fund begins absorbing xMinima:
- The fund exchanges stablecoins it holds for xMinima at the current market price
- This removes stablecoins from circulation → reduces liabilities → restores CR
- The fund now holds a mix; cf token holders bear the xMinima price risk

**Conversion pace**: Gradual — converts incrementally while CR stays below thresholds.

### Redemption
When burning cf tokens:
- **CR > 110%**: Receive proportional stablecoins + accumulated fees (clean exit)
- **CR ≤ 110%** (after trigger): Receive proportional mix of stablecoins + xMinima

Redemption is always settled at the **on-the-fly calculated value** — no fixed rate. No lock-up.

---

## 3. xMinima — The Transparent Position

### What it Is
xMinima is **leveraged equity in the Stables protocol**, economically equivalent to a perpetual long position on Minima — with important differences:

| Feature | Traditional Perp | xMinima |
| :--- | :--- | :--- |
| Funding fees | ✅ Yes (ongoing cost) | ❌ None |
| Liquidation risk | ✅ Yes (forced close) | ❌ None |
| Liquidity risk | Typically low | ⚠️ **Yes** — burn locked if CR ≤ 110% |
| Yield/Revenue | No (position only) | ❌ None — pure position |
| Leverage | Fixed (e.g., 10×) | Variable = 1 / (1 - 1/CR) |

### The Honest Trade-off
> **No funding fees, no liquidation. In exchange: you may not be able to exit when the protocol most needs your capital.**

When CR ≤ 110%, xMinima burning is locked. Holders cannot redeem until CR recovers. This is the explicit, transparent risk — not hidden in fine print.

### xMinima Value Formula
```
xMinima formula price = (Minima Assets - Stablecoin Liabilities) / xMinima Supply
                      = Excess Collateral / xMinima Supply
```

At CR = 150%: strong surplus → xMinima carries healthy value
At CR = 100%: zero surplus → formula price = 0 (all assets exactly cover liabilities)
At CR < 100%: formula price undefined (negative equity)

### xMinima Smart Router
When minting or burning xMinima, the protocol routes through whichever source is best:

**Minting (Minima in → xMinima out):**
```
IF formula_price >= market_price → mint new xMinima (protocol route)
IF market_price > formula_price  → buy xMinima on DEX (no new minting)
```

**Burning (xMinima in → Minima out):**
```
IF formula_price <= market_price → burn xMinima (protocol route)
IF market_price < formula_price  → sell xMinima on DEX

CONSTRAINT: Burn only permitted if resulting CR ≥ 110%
```

---

## 4. Mint & Burn Rules

### Master Table

| Action | CR > 110% | CR ≤ 110% | Rationale |
| :--- | :---: | :---: | :--- |
| **Mint stablecoins** | ✅ Open | ❌ **LOCKED** | Adds liabilities — worsens balance sheet |
| **Burn stablecoins** | ✅ Open | ✅ Open | Reduces liabilities → helps recovery |
| **Mint xMinima** | ✅ Open | ✅ Open | Brings capital → helps recovery |
| **Burn xMinima** | ✅ Open (CR stays ≥ 110%) | ❌ **LOCKED** | Removes equity — worsens balance sheet |
| **Deposit to Coverage Fund** | ✅ Open | ✅ Open | Strengthens buffer |
| **Redeem cf tokens** | ✅ Open | ✅ Open (mixed settlement) | Always redeemable at on-the-fly value |

---

## 5. Secondary Market — Required from Day 1

All tokens must be tradable for Minima. This is a **protocol requirement**, not optional.

### Tradable Pairs
| Token | Pair |
| :--- | :--- |
| USDs, EURs, CADs, IRTs… | ↔ Minima |
| xMinima | ↔ Minima |
| cfUSDs, cfEURs… | ↔ Minima (or parent stable) |

### Why Mandatory
- xMinima smart router requires a DEX to function
- Crisis recovery routes xMinima minting through DEX
- Price discovery for xMinima and cf tokens requires liquidity
- Without it, the self-correcting mechanisms cannot operate

---

## 6. The Full State Machine

### HEALTHY (CR > 110%)
```
Stablecoin minting:    ✅ Open (zero fee, blockchain speed)
Stablecoin burning:    ✅ Open
xMinima minting:       ✅ Smart router active
xMinima burning:       ✅ Smart router — only if CR stays ≥ 110%
Coverage Fund:         100% stablecoins, earning transaction fees
cf token value:        Stables + accumulated yield
```

### GUARDED (100% < CR ≤ 110%)
```
Stablecoin minting:    ❌ LOCKED
Stablecoin burning:    ✅ Open (helps recovery)
xMinima minting:       ✅ Open (brings capital)
xMinima burning:       ❌ LOCKED
Coverage Fund:         Converting stablecoins → xMinima
cf token value:        Mix of stables + xMinima (on-the-fly calc)
```

### CRITICAL (CR ≤ 100%)
```
Stablecoin minting:    ❌ LOCKED
Stablecoin burning:    ✅ Open (helps recovery)
xMinima minting:       ✅ DEX only (formula price = 0)
xMinima burning:       ❌ LOCKED
Coverage Fund:         Active absorption continues
cf token value:        Dominated by xMinima — recovery bet
```

---

## 7. Balance Sheet Structure

| Layer | Instrument | Description |
| :--- | :--- | :--- |
| **Assets** | Minima | Collateral held by the protocol |
| **Liabilities** | USDs, EURs, CADs, IRTs… | Stablecoins issued to users — redeemable 1:1 |
| **Convertible Liabilities** | cfUSDs, cfEURs, cfCADs… | Coverage Fund tokens — earn fees, absorb first loss, redeemable at on-the-fly value |
| **Equity** | xMinima | Leveraged ownership stake — no revenue, no liquidation, liquidity risk below threshold |

## 8. MiniDapp Architecture Note

Stables is **not a wallet** — it is a full financial application. Required sections include at minimum:

- **Wallet** — balances, transaction history, send/receive/QR
- **Mint & Burn** — Minima ↔ stablecoins, Minima ↔ xMinima (extensive section)
- **Coverage Fund** — deposit/redeem cf tokens, live value display, yield tracking
- **Swap** — internal DEX: all stablecoins ↔ Minima, xMinima ↔ Minima
- **Merchant Tools** — payment requests, dashboard
- **Governance** — Council votes, parameter proposals (later)
- **Lending** — personal + commercial loans (future phase)

---

*Built on MINIMA* → https://minima.global
*Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
