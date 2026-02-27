# Stables Economic Model Summary
**Simple, Scalable, Self-Regulating**

---

## 🎯 Core Design Philosophy

**Understand in 5 minutes. Choose your risk. Let the system handle the rest.**

---

## The Three Components

### 1. Stablecoins (USDs, CADs, EURs, IRTs)
**What**: Tokens pegged 1:1 to fiat currencies  
**Use**: Payments, savings, stable value storage  
**Risk**: Zero (protected by protocol)  
**Yield**: None (unless staked)

### 2. xMINIMA
**What**: Leveraged position on MINIMA price  
**Use**: Speculation, amplified MINIMA exposure  
**Risk**: High (can go to zero, but no liquidation)  
**Yield**: Unlimited upside (leverage approaches infinity at CR = 100%)

### 3. Staking
**What**: Lock your stablecoins to earn transaction fees  
**Use**: Generate yield on stable assets  
**Risk**: Medium (conversion to xMINIMA if CR < 100%)  
**Yield**: Transaction fees from all transfers

---

## User Journey (3 Simple Steps)

### Step 1: Deposit MINIMA
User deposits MINIMA into protocol.

### Step 2: Choose Your Risk
**Option A**: Mint stablecoins (USDs, CADs, EURs, IRTs)
- Get stable value
- No volatility
- Safe for payments

**Option B**: Mint xMINIMA
- Get leveraged MINIMA exposure
- High risk, high reward
- Speculative position

### Step 3 (Optional): Stake for Yield
If you minted stablecoins, you can stake them to earn transaction fees.
- Earn yield on your stables
- Risk: Conversion to xMINIMA if CR drops below 100%

**That's it. No other decisions needed.**

---

## How It Works: The 100% Coverage Ratio

### Coverage Ratio (CR) Definition
```
CR = (Total_MINIMA_Treasury_Value) / (Total_Stablecoin_Backing_Needed) × 100%
```

### Example at CR = 200%
```
Protocol Treasury: 1,000,000 MINIMA ($100K at $0.10/MINIMA)
Stablecoins issued: 50,000 USDs (needs $50K backing)

CR = $100K / $50K × 100% = 200%

xMINIMA value: $50K (the buffer above 100%)
```

### The Buffer Mechanism
- **Stablecoins** need 100% backing (always)
- **xMINIMA** gets the residual value (everything above 100%)
- **xMINIMA absorbs 100% of volatility** to protect stablecoin holders

---

## Leverage Dynamics

### How Leverage Changes with CR

| CR | xMINIMA Leverage | Risk Level |
|----|------------------|------------|
| 300% | 1.5x | Low |
| 200% | 2x | Moderate |
| 150% | 3x | Medium |
| 120% | 6x | High |
| 105% | 20x | Extreme |
| 100% | ∞ (infinite) | Maximum |

**Key Insight**: As CR approaches 100%, xMINIMA leverage approaches infinity, creating extreme profit potential with no liquidation risk.

### Positive Skew Payoff
```
Traditional leverage: Can be liquidated, lose more than invested
xMINIMA: Can't go below zero, unlimited upside

Example at CR = 105%:
- MINIMA +20% → xMINIMA +400% (20x leverage)
- MINIMA -5% → xMINIMA → $0 (100% loss, but no debt, no liquidation)
```

---

## Transaction Fees: Progressive Structure

### Fee Formula
```
Progressive fees enable micropayments:

$1 transfer:      0.5% = $0.005
$10 transfer:     0.3% = $0.03
$100 transfer:    0.1% = $0.10 (capped)
$1,000+ transfer: 0.01% = $0.10 (capped at $0.10)
```

### Fee Distribution
- 100% of fees go to stakers (proportional to stake)
- Stakers get 50% discount on their own transfers

### Governance
- Fee parameters adjustable by Council
- Enables optimization as usage patterns evolve

---

## Crisis Resolution: Progressive Conversion

### What Happens When CR < 100%

**Problem**: Protocol is undercollateralized  
**Solution**: Automatic progressive conversion

### Conversion Mechanism
```
IF CR drops below 100%:
  1. Calculate undercollateralization amount
  2. Convert staked stablecoins to xMINIMA (pro-rata)
  3. Stablecoin supply decreases
  4. CR returns to 100%
  5. Non-staked stablecoin holders fully protected
```

### Example
```
CR drops to 95%
Undercollateralization: $2,500

Total staked: 20,000 USDs
Your stake: 1,000 USDs (5%)

Your conversion:
- 125 USDs converted
- Receive 2,500 xMINIMA (at current market price)
- Your remaining stake: 875 USDs

Result:
- You took a loss (125 USDs → xMINIMA worth less)
- But you earned fees leading up to this
- xMINIMA might recover if MINIMA price rebounds
- Non-stakers completely protected
```

---

## xMINIMA Pricing: Formula + Markets

### Primary Market (Protocol)
```
Formula-based pricing:

xMINIMA_value = (Total_Treasury - Stablecoin_Backing) / Total_xMINIMA_Supply

Minting: Deposit MINIMA → Get xMINIMA at formula price
Burning: Burn xMINIMA → Get MINIMA at formula price (if CR >= 100%)
```

### Secondary Market (DEXs)
- xMINIMA trades on external DEXs
- Market price reflects supply/demand
- Arbitrage keeps prices aligned with formula

### Arbitrage Example
```
Formula price: $0.10 per xMINIMA
DEX price: $0.12 per xMINIMA

Arbitrage:
1. Mint xMINIMA from protocol at $0.10
2. Sell on DEX at $0.12
3. Profit: $0.02 per xMINIMA
4. This selling pressure brings DEX price down to $0.10
```

---

## Governance: Time-Weighted Voting

### Who Can Vote
- xMINIMA holders (1.0x weight)
- Staked stablecoin holders (0.5x weight)
- Non-staked holders (no voting power)

### Time Multiplier
```
Voting power increases with hold time:

Day 1:     1.0x
6 months:  1.5x
1 year:    2.0x
2 years:   3.0x
4 years:   4.0x (maximum)
```

### Example
```
Alice: 1,000 xMINIMA held for 2 years
Voting power: 1,000 × 3.0 × 1.0 = 3,000

Bob: 10,000 xMINIMA held for 1 week
Voting power: 10,000 × 1.0 × 1.0 = 10,000

Bob has more tokens, but Alice's long-term commitment gives her significant power.
```

### What Can Be Governed
- Transaction fee parameters
- Protocol upgrades
- Treasury management
- Emergency actions
- Council handover process

---

## Economic Incentives

### For Stablecoin Holders (Non-Staked)
✅ Stable value (zero volatility)  
✅ Protected by xMINIMA buffer  
✅ Safe for payments and savings  
❌ No yield

### For Stakers
✅ Earn transaction fees  
✅ Get fee discounts on transfers  
✅ Voting power (0.5x weight)  
⚠️ Risk conversion to xMINIMA if CR < 100%

### For xMINIMA Holders
✅ Leveraged MINIMA exposure  
✅ Unlimited upside (infinite leverage at CR = 100%)  
✅ No liquidation risk  
✅ Voting power (1.0x weight)  
⚠️ Can go to zero if MINIMA price crashes  
⚠️ Trapped if CR hits 100% (can't redeem)

---

## Why This Works

### 1. Simple
- 3 actions: Mint stables, mint xMINIMA, stake stables
- No complex strategies
- Understand in 5 minutes

### 2. Scalable
- Progressive fees enable micropayments
- Global payment adoption at all scales
- High transaction volume = high staking yields

### 3. Self-Regulating
- No liquidations needed
- Progressive conversion handles crises automatically
- Market forces maintain equilibrium

### 4. Fair
- Time-weighted voting favors long-term believers
- Small wallets can compete with whales if they hold longer
- Risk-weighted governance (xMINIMA holders have most power)

### 5. Capital Efficient
- 100% minimum CR (vs 150%+ in other protocols)
- Maximum utility of collateral
- Positive skew attracts speculators who provide buffer

---

## Attack Resistance

### Attack: Dump MINIMA to Crash System

**Scenario**:
1. Attacker dumps massive MINIMA
2. Price crashes 50%
3. CR drops from 200% to 100%, then below

**Defense**:
1. xMINIMA absorbs loss (value → $0)
2. CR hits 100%
3. **Automatic conversion**: Staked stables → xMINIMA
4. Conversion reduces stablecoin supply
5. CR returns to 100%
6. Non-staked holders fully protected

**Result**: Attacker loses money, xMINIMA holders lose value, stakers converted (might recover), non-stakers safe.

---

## Comparison to Other Protocols

| Feature | Stables | MakerDAO | Liquity | Frax |
|---------|---------|----------|---------|------|
| Min CR | 100% | 150% | 110% | Variable |
| Liquidations | None | Yes | Yes | Partial |
| Complexity | Low | High | High | Medium |
| Crisis Handling | Automatic | Manual | Liquidations | Algorithmic |
| Capital Efficiency | High | Medium | Medium | High |

---

## Next Steps

### Technical Development
1. Smart contract specification
2. Economic simulation and stress testing
3. Security audit preparation
4. Price oracle integration
5. DEX listing preparation

### Governance
1. Initial Council formation
2. Fee parameter optimization
3. Handover timeline definition
4. Community building

### Adoption
1. Merchant onboarding
2. Payment integration
3. Global marketing
4. Ambassador program

---

## Summary

**Stables is a simple, scalable, self-regulating money platform built on three components:**

1. **Stablecoins** - Safe, stable value for everyone
2. **xMINIMA** - Leveraged speculation that creates the buffer
3. **Staking** - Earn fees by taking conversion risk

**No liquidations. No complex options. Understand in 5 minutes.**

**Built on MINIMA.**
