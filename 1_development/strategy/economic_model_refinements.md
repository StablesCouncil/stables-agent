# Economic Model Refinements & Edge Cases
**Addendum to Coverage Ratio Specification**

---

## 1. Stability Pool Shares (pUSDs)

### Concept
When users stake stablecoins, they receive **pool share tokens** (pUSDs, pCADs, pEURs, pIRTs) representing their proportional ownership of the stability pool.

### Mechanism
```
User stakes: 1,000 USDs
Receives: 1,000 pUSDs (1:1 initially)

Pool composition over time:
- Day 1:  100% USDs
- Day 30: 102% USDs (fees accumulated)
- Day 60: 95% USDs + 5% xMINIMA (if conversion happened)

User unstakes 1,000 pUSDs:
- Burns pUSDs
- Receives proportional share of pool
- Could be: 950 USDs + 50 xMINIMA + 20 USDs (fees)
```

### Wallet Display
```
Your Staked Position:
1,000 pUSDs

Current Value:
- 950 USDs
- 50 xMINIMA (~$50)
- 20 USDs (accumulated fees)
Total: ~$1,020
```

---

## 2. xMINIMA Smart Router: Protocol-Level Arbitrage

### Core Concept

The protocol is a **smart router** — when a user mints or burns xMINIMA, the protocol checks both the formula price and the DEX market price, then **actually routes the trade** through whichever source is more efficient for the treasury.

This is not just a price check — it is a real trade.

### Minting Logic

```
User deposits MINIMA to mint xMINIMA:

IF formula_price >= market_price:
  → Protocol mints new xMINIMA directly (formula)
  → New xMINIMA enters circulation
  → User receives xMINIMA at formula price

IF market_price > formula_price:
  → Protocol takes user's MINIMA
  → Buys xMINIMA on DEX with that MINIMA
  → Sends purchased xMINIMA to user
  → No new xMINIMA minted (DEX supply reduced)
  → Any surplus MINIMA stays in treasury
```

### Burning Logic

```
User burns xMINIMA to receive MINIMA:

IF formula_price <= market_price:
  → Protocol burns xMINIMA directly (formula)
  → User receives MINIMA at formula price

IF market_price < formula_price:
  → Protocol takes user's xMINIMA
  → Sells xMINIMA on DEX for MINIMA
  → Sends MINIMA to user
  → xMINIMA sold on market (not burned)
  → Any surplus MINIMA stays in treasury
```

### Example: Minting When Market Price > Formula

```
CR = 150%
Formula price: $0.05 per xMINIMA
Market price:  $0.07 per xMINIMA (speculative premium)

Alice deposits 1,000 MINIMA ($100):

Route: DEX (market price > formula price)
- Protocol buys xMINIMA on DEX with $100
- Gets: $100 / $0.07 = 1,429 xMINIMA
- Sends 1,429 xMINIMA to Alice
- No new xMINIMA minted

Effect:
- Alice gets same xMINIMA she would have gotten at formula price
- DEX supply of xMINIMA reduced by 1,429
- Existing xMINIMA holders benefit (less supply, same treasury value)
- Protocol treasury unchanged (MINIMA went to DEX sellers)
```

### Example: Minting When Formula Price > Market

```
CR = 150%
Formula price: $0.07 per xMINIMA
Market price:  $0.05 per xMINIMA (market discount)

Alice deposits 1,000 MINIMA ($100):

Route: Protocol (formula price >= market price)
- Protocol mints new xMINIMA directly
- Gets: $100 / $0.07 = 1,429 xMINIMA
- Sends 1,429 xMINIMA to Alice
- New xMINIMA enters circulation

Effect:
- Alice gets xMINIMA at formula price (correct backing)
- Protocol treasury increases by $100 MINIMA
- CR maintained correctly
```

### Side Effects of Smart Routing

**When market price > formula price (DEX route)**:
- ✅ No new xMINIMA minted → deflationary pressure
- ✅ Existing xMINIMA holders benefit (same treasury, less supply)
- ✅ DEX price pressure downward (buying from DEX)
- ✅ Prices converge naturally

**When formula price > market price (protocol route)**:
- ✅ New xMINIMA minted at correct backing
- ✅ Treasury grows correctly
- ✅ DEX price pressure upward (users prefer protocol)
- ✅ Prices converge naturally

**Result**: The smart router acts as a **continuous arbitrage mechanism** that keeps DEX price aligned with formula price, while benefiting the protocol treasury or existing xMINIMA holders depending on direction.

---

## 3. Crisis Recovery: Minting Always Open

### Key Principle
**xMINIMA minting is ALWAYS enabled** — even at CR ≤ 100%.

New capital injection is exactly what the protocol needs during a crisis. Blocking minting would prevent recovery.

### Minting Rules
```
CR > 100%:  Smart router: formula vs DEX (as above)
CR ≤ 100%:  Route through DEX only (formula price = 0)
```

### Burning Rules
```
CR > 100%:  Smart router: formula vs DEX
             Constraint: CR after burn must stay ≥ 100%
CR ≤ 100%:  DISABLED (would break stablecoin backing)
```

### Recovery Scenario

```
Day 1: CR = 95%
├─ Formula price: $0 (undefined)
├─ Market price: $0.002 (speculators pricing in recovery)
├─ xMINIMA minting: ✅ OPEN — routed through DEX at $0.002
└─ xMINIMA burning: ❌ Disabled

Day 2: Alice deposits 10,000 MINIMA ($1,000)
├─ Protocol buys xMINIMA on DEX at $0.002
├─ Alice receives: 500,000 xMINIMA
├─ Treasury: +$1,000 MINIMA (from Alice)
├─ CR: 95% → 100%
└─ Alice brought critical new capital!

Day 3: MINIMA price recovers +10%
├─ CR: 100% → 110%
├─ Formula price: $0.008 (now positive)
├─ Market price: $0.009
├─ Minting route: DEX (market > formula)
│   → Protocol buys on DEX, no new xMINIMA minted
└─ Burning route: Protocol (formula < market)
    → Burns at formula price, treasury grows
```

---

## 4. Complete State Transitions

### Normal Operations (CR > 100%)
```
Protocol State: NORMAL
├─ Stablecoin minting:  ✅ Enabled
├─ Stablecoin burning:  ✅ Enabled
├─ xMINIMA minting:     ✅ Smart router (formula vs DEX)
├─ xMINIMA burning:     ✅ Smart router (formula vs DEX)
│                          Constraint: CR after burn ≥ 100%
└─ Continuous arbitrage keeps DEX price aligned with formula
```

### Crisis State (CR ≤ 100%)
```
Protocol State: CRISIS
├─ Stablecoin minting:  ❌ Disabled
├─ Stablecoin burning:  ✅ Enabled (helps recovery)
├─ xMINIMA minting:     ✅ OPEN — routed through DEX at market price
├─ xMINIMA burning:     ❌ Disabled (would break backing)
└─ Staked stables:      🔄 Converting to xMINIMA (pro-rata)
```

---

## 5. Leverage Vaults (Phase 2 — Limited Utility)

### Limitation
**You CANNOT create higher leverage than xMINIMA's natural leverage at current CR.**

```
CR = 200% → xMINIMA has 2x leverage (MAXIMUM)
CR = 120% → xMINIMA has 6x leverage (MAXIMUM)

Vault can only REDUCE leverage by mixing:
- 100% xMINIMA = Full leverage (e.g., 2x at CR=200%)
- 50% xMINIMA + 50% USDs = Half leverage (1x)
- 0% xMINIMA + 100% USDs = Zero leverage (stable)
```

**Recommendation**: Skip for Phase 1. Users can manually allocate between USDs and xMINIMA.

---

## Summary of Design Decisions

| Parameter | Decision |
|-----------|----------|
| Stability pool tokens | pUSDs, pCADs, pEURs, pIRTs |
| xMINIMA mint routing | Smart router: DEX if market > formula, else protocol |
| xMINIMA burn routing | Smart router: DEX if market < formula, else protocol |
| Minting at CR ≤ 100% | ✅ Enabled — routed through DEX at market price |
| Burning at CR ≤ 100% | ❌ Disabled |
| DEX listing | Required from day 1 (essential for routing and crisis recovery) |
| Leverage vaults | Phase 2 (limited utility — can only reduce leverage) |
