# Coverage Ratio & Three-Component Economic Model
**USDs Stablecoins + xMINIMA Leveraged Position + Staking Mechanism**

---

## Core Principle

**Minimum Coverage Ratio: 100%**

The protocol maintains a three-component system:
1. **Stablecoins (USDs, CADs, EURs, IRTs)** → Stable value, can be staked for fees
2. **xMINIMA** → Leveraged MINIMA position, absorbs ALL protocol volatility
3. **Staking** → Staked stables earn transaction fees, progressively convert to xMINIMA if CR < 100%

---

## The Three-Component System

### Component 1: Stablecoins (USDs, CADs, EURs, IRTs)
- **Value**: Pegged 1:1 to fiat currencies
- **Volatility**: Zero (protected by protocol)
- **Backing**: Guaranteed by protocol treasury
- **Use case**: Payments, savings, stable value storage
- **Staking**: Can be staked to earn transaction fees

### Component 2: xMINIMA
- **Value**: Market-priced leveraged position on MINIMA
- **Volatility**: Absorbs 100% of protocol treasury value changes
- **Backing**: Residual value after stablecoin backing
- **Use case**: Speculation, leveraged MINIMA exposure
- **Payoff**: Positively skewed (unlimited upside, no liquidation downside)

### Component 3: Staking Mechanism
- **Stake stablecoins** → Earn transaction fees from all transfers
- **Progressive conversion** → If CR drops below 100%, staked stables convert to xMINIMA
- **Risk/Reward**: Earn yield, but take on conversion risk in crisis

---

## xMINIMA Leverage Ratios at Different CR Levels

### Understanding Leverage

**Leverage Ratio** = How much xMINIMA value changes for a 1% change in MINIMA price

### Examples with Leverage Calculations

#### CR = 300% (High Buffer)
```
Total Treasury: $150K (1M MINIMA at $0.15)
Stablecoin Backing: $50K
xMINIMA Value: $100K

Leverage Ratio: 1.5x
- MINIMA price +10% → Treasury +$15K → xMINIMA +$15K (+15%)
- MINIMA price -10% → Treasury -$15K → xMINIMA -$15K (-15%)
```

#### CR = 200% (Equilibrium)
```
Total Treasury: $100K (1M MINIMA at $0.10)
Stablecoin Backing: $50K
xMINIMA Value: $50K

Leverage Ratio: 2x
- MINIMA price +10% → Treasury +$10K → xMINIMA +$10K (+20%)
- MINIMA price -10% → Treasury -$10K → xMINIMA -$10K (-20%)
```

#### CR = 150% (Moderate Buffer)
```
Total Treasury: $75K (1M MINIMA at $0.075)
Stablecoin Backing: $50K
xMINIMA Value: $25K

Leverage Ratio: 3x
- MINIMA price +10% → Treasury +$7.5K → xMINIMA +$7.5K (+30%)
- MINIMA price -10% → Treasury -$7.5K → xMINIMA -$7.5K (-30%)
```

#### CR = 120% (Low Buffer)
```
Total Treasury: $60K (1M MINIMA at $0.06)
Stablecoin Backing: $50K
xMINIMA Value: $10K

Leverage Ratio: 6x
- MINIMA price +10% → Treasury +$6K → xMINIMA +$6K (+60%)
- MINIMA price -10% → Treasury -$6K → xMINIMA -$6K (-60%)
```

#### CR = 105% (Critical Zone)
```
Total Treasury: $52.5K (1M MINIMA at $0.0525)
Stablecoin Backing: $50K
xMINIMA Value: $2.5K

Leverage Ratio: 20x
- MINIMA price +10% → Treasury +$5.25K → xMINIMA +$5.25K (+210%)
- MINIMA price -5% → Treasury -$2.625K → xMINIMA → $0 (CR hits 100%)
```

#### CR = 100% (Emergency State)
```
Total Treasury: $50K (1M MINIMA at $0.05)
Stablecoin Backing: $50K
xMINIMA Value: $0

Leverage Ratio: Infinite (approaching)
- MINIMA price +1% → Treasury +$500 → xMINIMA +$500 (from $0 = infinite %)
- MINIMA price -1% → Impossible (CR can't go below 100% due to conversion mechanism)
```

**Key Insight**: As CR approaches 100%, leverage approaches infinity. This creates extreme volatility but also extreme upside potential with NO liquidation risk.

---

## Positive Skew Payoff Profile

### Traditional Leveraged Position (with liquidation)
```
Upside: Limited by liquidation risk
Downside: Total loss at liquidation threshold
Risk: Symmetric
```

### xMINIMA Payoff (no liquidation)
```
Upside: UNLIMITED (infinite leverage at CR = 100%)
Downside: Limited to xMINIMA value → $0 (can't go negative)
Risk: POSITIVELY SKEWED

Example:
- At CR = 105%, xMINIMA worth $2.5K
- MINIMA price +20% → xMINIMA worth $22.5K (9x return)
- MINIMA price -5% → xMINIMA worth $0 (100% loss, but no liquidation, no debt)
```

**Why this matters**: xMINIMA holders have asymmetric payoff. Small MINIMA price increases near CR = 100% create massive xMINIMA gains. Downside is capped at losing the xMINIMA value (no liquidation, no debt).

---

## Market-Based xMINIMA Pricing

### xMINIMA Has a Market Price

**Key principle**: xMINIMA trades on markets with its own price discovery.

**xMINIMA/MINIMA Ratio**: The market-determined exchange rate

### Minting xMINIMA

**Process**:
1. User deposits MINIMA
2. Protocol calculates current xMINIMA/MINIMA market ratio
3. User receives: `xMINIMA_amount = MINIMA_deposited × (xMINIMA/MINIMA ratio)`

**Example at CR = 200%**:
```
xMINIMA market price: $0.10
MINIMA price: $0.10
xMINIMA/MINIMA ratio: 1:1

User deposits 1,000 MINIMA
Gets: 1,000 xMINIMA
```

**Example at CR = 120%** (high leverage, risky):
```
xMINIMA market price: $0.06 (discounted due to risk)
MINIMA price: $0.06
xMINIMA/MINIMA ratio: 1:1 (but both are cheaper)

User deposits 1,000 MINIMA
Gets: 1,000 xMINIMA
But xMINIMA is riskier (6x leverage vs 2x at CR = 200%)
```

### Burning xMINIMA

**Process**:
1. User burns xMINIMA
2. Protocol calculates redemption value based on treasury
3. User receives MINIMA based on xMINIMA/MINIMA ratio
4. **Constraint**: Cannot push CR below 100%

**Formula**:
```
MINIMA_redeemed = (Total_Treasury_Value - Stablecoin_Backing) / Total_xMINIMA_Supply × xMINIMA_burned / MINIMA_price

Subject to: CR_after >= 100%
```

---

## Staking Mechanism

### Staking Stablecoins for Transaction Fees

**How it works**:
1. Users stake USDs, CADs, EURs, or IRTs
2. All stablecoin transfers incur small fee (e.g., 0.1-0.3%)
3. Fees distributed proportionally to stakers
4. Stakers earn yield on their stables

**Example**:
```
Total staked: 100K USDs
Your stake: 1K USDs (1%)
Daily transfer volume: 500K USDs
Fee rate: 0.2%
Daily fees collected: 500K × 0.2% = 1K USDs
Your daily earnings: 1K × 1% = 10 USDs
Annual yield: ~365% (if volume stays constant)
```

### Progressive Conversion to xMINIMA (CR < 100% Protection)

**The Crisis Mechanism**:

When CR drops below 100%, the protocol is undercollateralized. To protect non-staked stablecoin holders, **staked stables progressively convert to xMINIMA**.

**Why this works**:
- Stakers earned fees for taking on this risk
- Conversion reduces stablecoin supply → CR increases
- xMINIMA absorbs the undercollateralization
- Non-staked stablecoin holders remain protected

**Conversion Formula**:
```
IF CR < 100% THEN
  Undercollateralization = Stablecoin_Backing - Total_Treasury_Value
  
  Staked_USDs_to_convert = Undercollateralization × (Staked_USDs / Total_Staked_Stables)
  
  xMINIMA_received = Staked_USDs_to_convert / xMINIMA_market_price
  
  Update: 
  - Burn converted USDs
  - Mint xMINIMA to stakers
  - CR returns to 100%
END IF
```

**Example**:
```
CR drops to 95%
Total Treasury: $47.5K
Stablecoin Backing: $50K
Undercollateralization: $2.5K

Total staked: 20K USDs (40% of supply)
Your stake: 1K USDs (5% of staked)

Conversion:
- Total staked USDs to convert: $2.5K (to bring CR back to 100%)
- Your USDs converted: $2.5K × 5% = $125
- xMINIMA received: $125 / $0.05 (xMINIMA price) = 2,500 xMINIMA

Result:
- You lost 125 USDs
- You gained 2,500 xMINIMA (currently worth $125, but has upside if MINIMA recovers)
- CR restored to 100%
- Non-stakers protected
```

**Risk/Reward for Stakers**:
- ✅ Earn transaction fees (potentially high yield)
- ⚠️ Risk conversion to xMINIMA if CR < 100%
- ⚠️ xMINIMA received might recover value if MINIMA price rebounds
- ⚠️ Or xMINIMA might stay near zero if crisis persists

---

## Complete Economic Flow

### High CR Scenario (e.g., CR = 250%)

**State**:
- Lots of buffer
- xMINIMA has low leverage (~1.6x)
- Safe to mint stables
- Staking yields moderate fees

**Actions**:
- Users mint more USDs (reduces CR)
- Users mint xMINIMA (adds buffer)
- Stakers earn fees with low risk
- System moves toward equilibrium

### Equilibrium (CR = 150-200%)

**State**:
- Healthy buffer
- xMINIMA has moderate leverage (2-3x)
- Normal operations
- Staking yields good fees with moderate risk

**Actions**:
- Balanced minting of stables and xMINIMA
- Stakers earn fees
- System stable

### Low CR (CR = 110-120%)

**State**:
- Small buffer
- xMINIMA has high leverage (5-10x)
- Risky to mint stables
- Staking yields high fees but high conversion risk

**Actions**:
- Stablecoin minting slows
- xMINIMA becomes very volatile
- Stakers nervous (conversion risk rising)
- Arbitrageurs might burn USDs to increase CR

### Crisis (CR < 100%)

**State**:
- Undercollateralized
- xMINIMA value = $0
- Staked stables convert to xMINIMA
- Non-staked stables protected

**Actions**:
- **Automatic**: Staked USDs convert to xMINIMA
- Conversion reduces USDs supply
- CR returns to 100%
- xMINIMA holders (including converted stakers) wait for recovery

**Recovery**:
- MINIMA price increases → CR > 100%
- xMINIMA gains value (infinite leverage from zero)
- Converted stakers might profit if MINIMA recovers enough
- System rebalances

---

## Why This Three-Component System Works

### 1. Multiple Yield Sources
- **Stakers**: Earn transaction fees
- **xMINIMA holders**: Earn leveraged MINIMA exposure
- **Non-staked stablecoin holders**: Safe stable value

### 2. Risk Stratification
- **Lowest risk**: Non-staked stables (no conversion risk)
- **Medium risk**: Staked stables (earn fees, risk conversion)
- **Highest risk**: xMINIMA (extreme leverage, can go to zero)

### 3. Automatic Crisis Resolution
- CR < 100% → Staked stables convert to xMINIMA
- Conversion reduces stablecoin supply
- CR returns to 100% automatically
- No liquidations, no manual intervention

### 4. Positive Skew Incentives
- xMINIMA has unlimited upside, limited downside
- Attracts speculators even at high risk
- Speculators provide buffer for stablecoin holders
- Everyone benefits from their risk-taking

---

## Attack Resistance

### Attack: Dump MINIMA to crash CR below 100%

**Scenario**:
1. Attacker dumps MINIMA
2. Price crashes 50%
3. CR drops from 200% to 100%, then below

**Defense**:
1. xMINIMA absorbs initial loss (value → $0)
2. CR hits 100%
3. **Automatic conversion**: Staked USDs convert to xMINIMA
4. Conversion reduces USDs supply
5. CR returns to 100%
6. Non-staked USDs holders fully protected

**Result**: 
- Attacker loses money dumping MINIMA
- xMINIMA holders lose value
- Stakers converted to xMINIMA (might recover if MINIMA rebounds)
- Non-stakers completely protected

---

## Finalized Design Parameters

### 1. Transaction Fees: Progressive Structure for Micropayments

**Design Goal**: Enable micropayments while generating sustainable yield for stakers.

**Fee Structure**:
```
Progressive fee based on transfer amount:
- Percentage decreases as amount increases
- Hard cap at $0.10 maximum fee

Example:
$1 transfer:    0.5% = $0.005
$10 transfer:   0.3% = $0.03
$100 transfer:  0.1% = $0.10 (capped)
$1,000 transfer: 0.01% = $0.10 (capped)
$10,000 transfer: 0.001% = $0.10 (capped)
```

**Rationale**:
- Enables true micropayments (coffee, tips, small purchases)
- Larger transfers still generate meaningful fees
- Cap prevents excessive fees on large transactions
- Supports global payment adoption at all scales

**Governance**: Fee parameters (percentages and cap) adjustable by Council

**Staker Benefit**: Stakers get transaction fee discount (e.g., 50% off)
- Incentivizes staking
- Rewards those taking conversion risk

---

### 2. Unstaking: Instant

**Decision**: No time locks, no waiting periods

**Rationale**:
- Maximum simplicity
- User freedom
- Aligns with "understand in 5 minutes" design goal

**Risk Mitigation**:
- Market forces: Stakers who stay earn more as others leave
- Progressive conversion protects non-stakers regardless
- Simplicity > forced lock-ins

---

### 3. Conversion Priority: Pro-Rata

**Decision**: When CR < 100%, all stakers convert proportionally

**Formula**:
```
Your_conversion = Total_conversion_needed × (Your_stake / Total_staked)
```

**Rationale**:
- Most fair
- Most predictable
- No gaming (FIFO/LIFO can be gamed)
- Simple to understand

---

### 4. xMINIMA Pricing: Formula-Based + Secondary Markets

**Primary Market** (Protocol minting/burning):
```
Formula-based pricing:

xMINIMA_value_per_token = (Total_Treasury_Value - Stablecoin_Backing) / Total_xMINIMA_Supply

Minting:
- User deposits MINIMA
- Receives xMINIMA at formula price

Burning:
- User burns xMINIMA
- Receives MINIMA at formula price
- Constraint: CR must stay >= 100%
```

**Secondary Market** (DEX trading):
- xMINIMA can trade on external DEXs
- Market price may differ from formula price
- **Arbitrage opportunity** if prices diverge:
  - If market price > formula price → Mint from protocol, sell on DEX
  - If market price < formula price → Buy on DEX, burn to protocol
- This creates efficient price discovery

**Benefits**:
- ✅ Formula ensures protocol solvency
- ✅ Secondary markets provide liquidity
- ✅ Arbitrage keeps prices aligned
- ✅ Best of both worlds

---

### 5. Governance: Time-Weighted, No Separate Token

**Voting Power Formula**:
```
Voting_Power = (xMINIMA_balance × xMINIMA_time_multiplier × 1.0) 
             + (Staked_USDs_balance × Staked_time_multiplier × 0.5)

Time Multiplier (logarithmic):
- Day 1: 1.0x
- 6 months: 1.5x
- 1 year: 2.0x
- 2 years: 3.0x
- 4 years: 4.0x (max)
```

**Weights**:
- xMINIMA: 1.0x (full weight - highest risk, most skin in game)
- Staked USDs: 0.5x (half weight - medium risk)
- Non-staked stables: 0x (no voting - no risk, no governance)

**Rationale**:
- Time-weighting favors long-term believers over short-term speculators
- Gives small wallets a chance if they hold long-term
- Prevents governance attacks (attacker must hold for time to gain power)
- No separate governance token (simpler, fewer tokens to manage)
- Weighted by risk (xMINIMA holders have most to lose/gain)

**Governance Scope**:
- Transaction fee parameters
- Protocol upgrades
- Treasury management
- Emergency actions
- Council handover process (per roadmap)

---

## Technical Implementation Notes

### Additional State Variables
```javascript
struct ProtocolState {
  // ... existing variables ...
  
  uint256 totalStakedUSDs;
  uint256 totalStakedCADs;
  uint256 totalStakedEURs;
  uint256 totalStakedIRTs;
  
  uint256 accumulatedFees;
  uint256 xMINIMAmarketPrice;  // Oracle or AMM price
}
```

### Staking Function
```javascript
function stakeUSDs(uint256 amount) {
  USDs.transferFrom(msg.sender, address(this), amount);
  stakedBalance[msg.sender] += amount;
  totalStakedUSDs += amount;
}
```

### Progressive Conversion (Triggered when CR < 100%)
```javascript
function triggerConversion() {
  require(getCoverageRatio() < 100, "CR must be < 100%");
  
  uint256 totalValue = totalMINIMA * MINIMAprice;
  uint256 stablecoinBacking = totalUSDs + totalCADs + totalEURs + (totalIRTs / 100000);
  uint256 undercollateralization = stablecoinBacking - totalValue;
  
  // Convert staked USDs proportionally
  uint256 USDsToConvert = undercollateralization * totalStakedUSDs / stablecoinBacking;
  
  // Mint xMINIMA to stakers
  uint256 xMINIMAtoMint = USDsToConvert / xMINIMAmarketPrice;
  
  // Update state
  totalUSDs -= USDsToConvert;
  totalStakedUSDs -= USDsToConvert;
  totalxMINIMA += xMINIMAtoMint;
  
  // Distribute xMINIMA to stakers proportionally
  // ... (iterate through stakers)
}
```

---

## Summary

**Three-Component Economic Model**:
- ✅ Stablecoins - stable value, can be staked for fees
- ✅ xMINIMA - leveraged position with positive skew (unlimited upside, no liquidation)
- ✅ Staking - earn fees, risk conversion to xMINIMA if CR < 100%

**Key Innovations**:
- Market-based xMINIMA pricing (xMINIMA/MINIMA ratio)
- Leverage approaches infinity as CR → 100%
- Positive skew payoff (no liquidation downside)
- Progressive conversion protects non-stakers
- Transaction fees reward stakers for taking conversion risk

**Next Steps**:
1. Define transaction fee rate and distribution
2. Specify staking lock/unlock mechanics
3. Design conversion priority mechanism
4. Determine xMINIMA price discovery method
5. Design governance structure
6. Build smart contract prototype
7. Economic simulation with all three components
