# Stables Technical Specification
**Version**: 2.0  
**Date**: 2026-01-18  
**Status**: Draft for Minima Team Review  
**Purpose**: Complete technical design before implementation

---

## 🎯 DOCUMENT PURPOSE

This document defines the complete technical architecture of Stables before any coding begins. It will be submitted to the Minima team for review and feedback.

**Structure:**
1. Conceptual Overview
2. System Architecture
3. Token Economics
4. Smart Contract Design
5. Oracle Design
6. Stability Mechanisms
7. Governance & Council Handover
8. Security Considerations
9. Open Questions for Minima Team

---

# PART 1: CONCEPTUAL OVERVIEW

## 🌟 What is Stables?

**Stables is a self-custody banking platform built on Minima that enables:**
- Minting stablecoins pegged to real-world currencies
- Leveraged positions without liquidation risk
- Community-created local currencies
- Yield generation from transaction fees
- Circular local economies

**Core Innovation:** No liquidation risk for leveraged positions through a novel rebalancing mechanism using r-Tokens.

---

## 🏗️ High-Level Architecture

### **Three-Layer System:**

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                     │
│  (MiniDapp UI - User Interface)                         │
│  - Wallet management                                    │
│  - Minting/burning                                      │
│  - Payments                                             │
│  - r-Token investing                                    │
│  - Local currency creation                              │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                   SMART CONTRACT LAYER                  │
│  (Business Logic on Minima)                             │
│  - Stablecoin contracts (sUSD, sEUR, etc.)              │
│  - xMinima contract (leveraged position)                │
│  - r-Token contracts (rebalance pools)                  │
│  - Local currency contracts                             │
│  - Governance contract (Council)                        │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                      │
│  (Minima Network)                                       │
│  - Transaction processing                               │
│  - State management                                     │
│  - Consensus                                            │
│  - Node infrastructure                                  │
└─────────────────────────────────────────────────────────┘
```

### **External Dependencies:**

```
┌─────────────────────────────────────────────────────────┐
│                   ORACLE LAYER                          │
│  (Price Feeds)                                          │
│  - Real-time currency prices (USD, EUR, CAD, etc.)      │
│  - Minima price feed                                    │
│  - Manipulation prevention                              │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Token Ecosystem

### **The Token Hierarchy:**

```
MINIMA (Base Currency)
    │
    ├─→ STABLECOINS (Pegged to Fiat)
    │   ├─ sUSD (pegged to USD)
    │   ├─ sEUR (pegged to EUR)
    │   ├─ sCAD (pegged to CAD)
    │   ├─ sGBP (pegged to GBP)
    │   ├─ sJPY (pegged to JPY)
    │   └─ sCNY (pegged to CNY)
    │
    ├─→ xMINIMA (Leveraged Position)
    │   └─ Amplified exposure, NO liquidation
    │
    ├─→ r-TOKENS (Rebalance Pool Tokens)
    │   ├─ rsUSD (sUSD in rebalance pool)
    │   ├─ rsEUR (sEUR in rebalance pool)
    │   ├─ rsCAD (sCAD in rebalance pool)
    │   ├─ rsGBP (sGBP in rebalance pool)
    │   ├─ rsJPY (sJPY in rebalance pool)
    │   └─ rsCNY (sCNY in rebalance pool)
    │
    └─→ LOCAL CURRENCIES (Community-Created)
        ├─ sBerlin (pegged to sEUR)
        ├─ sLagos (pegged to sUSD)
        └─ s[CommunityName] (pegged to any stable)
```

---

## 🔄 Core Mechanisms

### **1. Stablecoin Minting**

**User deposits Minima → Receives stablecoins**

```
Mint sUSD:
1. User deposits Minima
2. Oracle provides USD/Minima price
3. Smart contract calculates collateral ratio
4. sUSD minted (1 sUSD = $1 USD worth of Minima)
5. Minima locked as collateral

Burn sUSD:
1. User returns sUSD
2. Smart contract burns sUSD
3. Minima collateral released
4. User receives Minima back
```

**Peg Maintenance:**
- Over-collateralized (150% collateral ratio)
- Oracle price feeds
- Rebalancing mechanism (via r-Tokens)

---

### **2. xMinima (Leveraged Position, No Liquidation)**

**Core Innovation:** Leveraged exposure WITHOUT liquidation risk

```
Mint xMinima:
1. User deposits Minima
2. Receives xMinima (amplified exposure)
3. When Minima ↑, xMinima ↑↑ (e.g., 2x-3x)
4. When Minima ↓, xMinima ↓↓ (e.g., 2x-3x)
5. NO liquidation threshold

Why no liquidation?
- r-Token holders absorb the risk
- Rebalancing mechanism protects system
- xMinima value can drop very low, but never liquidates
- User never loses position
```

**Risk Distribution:**
- xMinima holders: High volatility, no liquidation
- r-Token holders: Earn yield, absorb rebalancing risk
- Stablecoin holders: Stable value, low risk

---

### **3. r-Tokens (Rebalance Pools)**

**Purpose:** Provide stability buffer for the system

```
Deposit into r-Token pool:
1. User deposits sUSD
2. Receives rsUSD (receipt token)
3. Earns yield from transaction fees
4. Can withdraw anytime (if no rebalancing event)

During normal operation:
- rsUSD earns yield
- Yield = share of transaction fees
- Compounding (reinvested automatically)

During rebalancing event:
- Coverage ratio drops below threshold
- rsUSD progressively converts to xMinima
- User now holds leveraged position
- This stabilizes the system
```

**Yield Source:**
- 100% of transaction fees → r-Token holders
- Real revenue (not inflationary)
- Sustainable (grows with platform usage)

---

### **4. Local Currency Creation**

**Communities create their own pegged currencies**

```
Create "sBerlin" (pegged to sEUR):

1. Community Proposal:
   - Name: sBerlin
   - Peg: sEUR (1:1)
   - Governance: Berlin community
   - Purpose: Local Berlin economy

2. Council Approval:
   - Review proposal
   - Verify community legitimacy
   - Approve parameters
   - Deploy smart contract

3. Currency Deployed:
   - Smart contract created
   - Pegged to sEUR (1 sBerlin = 1 sEUR)
   - Minting permissions granted to community
   - Listed in app

4. Community Governance:
   - Community votes on minting policy
   - Local merchants accept sBerlin
   - Circulates within community
   - Can always convert to sEUR (parent)
```

---

# PART 2: STABILITY MECHANISMS

## 🛡️ How Stables Maintains Stability

### **1. Over-Collateralization**

**Principle:** Always maintain more collateral than debt

```
Target Collateral Ratio: 150%

Example:
- Total Minima collateral: $150,000
- Total stablecoins minted: $100,000
- Coverage Ratio: 150%

If Minima price drops:
- Collateral value decreases
- Coverage ratio drops
- Rebalancing triggered
```

---

### **2. Rebalancing Mechanism**

**Automatic system stabilization**

```
Coverage Ratio Thresholds:

Target: 150% (healthy)
Warning: 130% (monitor)
Rebalance: 120% (trigger rebalancing)
Critical: 110% (emergency measures)

Rebalancing Process:
1. Coverage ratio drops below 120%
2. Pause new stablecoin minting
3. Convert r-Tokens to xMinima (progressively)
4. Reduce system debt
5. Restore coverage ratio to 150%
6. Resume normal operation
```

**Why this works:**
- r-Token holders provide buffer
- They earn yield for taking this risk
- System never becomes under-collateralized
- xMinima holders never liquidated

---

### **3. Oracle Price Feeds**

**Reliable, manipulation-resistant pricing**

**Hybrid Oracle Approach:**
```
Multiple Sources:
├─ CoinGecko API
├─ CoinMarketCap API
├─ Binance API
├─ Kraken API
└─ Community Oracle (Council fallback)

Aggregation:
├─ Collect prices from all sources
├─ Calculate MEDIAN (not average)
├─ Remove outliers (>10% deviation)
└─ Apply TWAP (Time-Weighted Average, 1 hour)

Validation:
├─ Price deviation limit (<10% per hour)
├─ Circuit breaker (pause if extreme volatility)
└─ Community validation (Council can override)

On-Chain Storage:
├─ Store validated price
├─ Update every 5 minutes
└─ Transparent price history
```

**Anti-Manipulation:**
- Multiple independent sources
- MEDIAN (resistant to outliers)
- TWAP (smooths short-term manipulation)
- Price deviation limits
- Community oversight

---

### **4. Fee Structure**

**Minimal fees, sustainable revenue**

```
Transaction Fees:
- Mint stablecoin: 0.1%
- Burn stablecoin: 0.1%
- Mint xMinima: 0.1%
- Burn xMinima: 0.1%
- Send payment: 0.05%
- Cross-currency swap: 0.2%

Fee Distribution:
- 100% to r-Token holders (proportional to holdings)
- Compounding (reinvested automatically)
- Sustainable yield source
```

**Philosophy:**
- Keep fees minimal (accessibility)
- Only charge to prevent arbitrage
- All fees to r-Token holders (alignment)
- Transparent and predictable

---

### **5. Circuit Breakers**

**Emergency protection mechanisms**

```
Trigger Conditions:
├─ Price deviation >10% per hour
├─ Coverage ratio <110%
├─ Oracle failure (all sources down)
└─ Council emergency vote

Actions:
├─ Pause new minting
├─ Pause withdrawals (temporary)
├─ Trigger rebalancing
├─ Alert Council
└─ Community notification

Resolution:
├─ Council reviews situation
├─ Implements fix
├─ Gradually resumes operation
└─ Post-mortem analysis
```

---

# PART 3: GOVERNANCE & COUNCIL HANDOVER

## 🏛️ The Council

### **Purpose**

The Council governs protocol parameters and ensures platform stability. It represents r-Token holders who have skin in the game.

---

### **Voting Power: Quadratic Time-Weighted**

**Formula:**
```
Voting Power = √(r-Token Amount) × Time Held (days)

Example:
Alice: 10,000 rsUSD × 10 days = √10,000 × 10 = 100 × 10 = 1,000 votes
Bob: 100 rsUSD × 100 days = √100 × 100 = 10 × 100 = 1,000 votes

Equal voting power despite 100x difference in holdings!
```

**Why this formula?**
- ✅ **Time matters MORE than money** (linear time vs square root amount)
- ✅ **Rewards long-term commitment** (hold longer = more power)
- ✅ **Reduces whale dominance** (square root dampens large holdings)
- ✅ **Encourages patience** (time is the primary factor)
- ✅ **Aligns incentives** (long-term holders care about platform success)

**Minimum to Vote:**
```
1,000 voting power

Examples:
- 100 rsUSD × 100 days = √100 × 100 = 1,000 ✓
- 10,000 rsUSD × 10 days = √10,000 × 10 = 1,000 ✓
- 1 rsUSD × 1,000 days = √1 × 1,000 = 1,000 ✓
```

---

### **Council Scope**

**What Council Decides:**
- Protocol parameters (fees, collateral ratios, rebalance thresholds)
- New local currency approvals
- Oracle source selection
- Emergency measures (circuit breakers)
- Roadmap priorities
- Treasury management (if applicable)

**What Council Does NOT Decide:**
- Individual transactions
- User funds (non-custodial always)
- Smart contract code (immutable after deployment)

---

### **Decision Process**

```
1. PROPOSAL (Anyone can propose)
   - Submit proposal with details
   - Minimum: 100 voting power to propose
   
2. DISCUSSION (7 days)
   - Community discusses (Telegram, forums)
   - Questions answered
   - Refinements made
   
3. VOTING (7 days)
   - r-Token holders vote
   - Voting power = √(Amount) × Time
   - Options: For / Against / Abstain
   
4. APPROVAL
   - Requires >50% of votes cast
   - Minimum quorum: 10% of total voting power
   
5. TIME-LOCK (7 days)
   - Delay before execution
   - Allows community to react
   - Emergency override if critical issue
   
6. EXECUTION
   - Proposal implemented on-chain
   - Transparent and verifiable
   - Post-execution report
```

---

### **Council Handover Phases**

**Phase 1: Founding Team (Launch → First Cluster)**
```
Governance: Founding team
Decision-making: Centralized
Rationale: Need speed and flexibility during early testing
Duration: Until first geographic cluster established
```

**Phase 2: Hybrid Governance (First Cluster → 5 Clusters)**
```
Governance: Founding team + Early Council
Decision-making: Collaborative
Rationale: Transition to community governance
Council: Top 10 r-Token holders (by voting power)
Founding team: Veto power for security issues only
Duration: Until 5 clusters established
```

**Phase 3: Full Council (5 Clusters → Onward)**
```
Governance: Council only
Decision-making: Decentralized
Rationale: Community-driven platform
Council: All r-Token holders (minimum voting power)
Founding team: No special powers (equal to other holders)
Duration: Permanent
```

**Handover Criteria:**
```
Phase 1 → Phase 2:
✓ First cluster: 50+ users, 10+ merchants
✓ 100+ r-Token holders
✓ System stable for 30+ days
✓ No critical bugs

Phase 2 → Phase 3:
✓ 5 clusters established
✓ 1,000+ r-Token holders
✓ System stable for 90+ days
✓ Council proven effective
✓ Community vote (>66% approval)
```

---

### **Council Evolution**

**As platform grows, Council can evolve:**

**Potential Improvements:**
- Specialized committees (Technical, Economic, Community)
- Elected representatives (term limits)
- Reputation-based weighting
- Delegation (vote on behalf of others)
- Multi-signature execution (security)

**Decided by Council itself through proposals**

---

# PART 4: SMART CONTRACT DESIGN

## 📐 Data Structures

### **User Account**

```javascript
User {
  nodeId: string,              // Minima node ID (identity)
  nodeName: string,            // Minima node name (display)
  walletAddress: string,       // Minima wallet address
  
  balances: {
    minima: number,
    sUSD: number,
    sEUR: number,
    sCAD: number,
    sGBP: number,
    sJPY: number,
    sCNY: number,
    xMinima: number,
    rsUSD: number,
    rsEUR: number,
    rsCAD: number,
    rsGBP: number,
    rsJPY: number,
    rsCNY: number,
    [localCurrency]: number    // Dynamic
  },
  
  rTokenDepositTime: {         // For voting power calculation
    rsUSD: timestamp,
    rsEUR: timestamp,
    // etc.
  },
  
  votingPower: number,         // Calculated: √(amount) × days
  
  transactions: Transaction[],
  achievements: Achievement[]
}
```

### **Stablecoin State**

```javascript
StablecoinState {
  currency: 'sUSD' | 'sEUR' | 'sCAD' | 'sGBP' | 'sJPY' | 'sCNY',
  
  totalSupply: number,          // Total minted
  totalCollateral: number,      // Total Minima locked
  coverageRatio: number,        // Collateral / Supply
  
  oraclePrice: number,          // Current fiat/Minima price
  lastOracleUpdate: timestamp,
  
  rebalanceThreshold: number,   // e.g., 120%
  targetCollateralRatio: number,// e.g., 150%
  
  isPaused: boolean,            // Paused during rebalancing
  rebalanceHistory: RebalanceEvent[]
}
```

### **xMinima State**

```javascript
xMinimaState {
  totalSupply: number,          // Total xMinima minted
  totalCollateral: number,      // Total Minima locked
  
  leverageMultiplier: number,   // e.g., 2x, 3x
  currentValue: number,         // Value per xMinima (in Minima)
  
  // NO liquidation threshold!
}
```

### **r-Token Pool State**

```javascript
rTokenPoolState {
  currency: 'rsUSD' | 'rsEUR' | 'rsCAD' | 'rsGBP' | 'rsJPY' | 'rsCNY',
  
  totalDeposited: number,       // Total stablecoins deposited
  totalShares: number,          // Total r-Token shares issued
  
  accumulatedFees: number,      // Transaction fees collected
  yieldPerShare: number,        // Yield per r-Token share
  
  last30DayYield: number,       // 30-day trailing yield (APY)
  
  rebalanceHistory: RebalanceEvent[]
}
```

---

## 🔧 Smart Contracts

### **Contract 1: Stablecoin Contract**

**State Variables:**
```
totalSupply: number
totalCollateral: number
coverageRatio: number
oracleAddress: address
rebalanceThreshold: number
targetCollateralRatio: number
isPaused: boolean
```

**Functions:**

**mint(amount, currency)**
```
Input: amount (Minima), currency (sUSD, sEUR, etc.)
Process:
  1. Check not paused
  2. Get oracle price for currency
  3. Calculate required collateral (150% ratio)
  4. Lock Minima as collateral
  5. Mint stablecoin
  6. Update totalSupply, totalCollateral
  7. Collect fee (0.1%) → r-Token pool
Output: Minted stablecoin amount
```

**burn(amount, currency)**
```
Input: amount (stablecoin), currency
Process:
  1. Check user has sufficient balance
  2. Burn stablecoin
  3. Calculate Minima to return
  4. Release collateral
  5. Update totalSupply, totalCollateral
  6. Collect fee (0.1%) → r-Token pool
Output: Minima returned
```

**checkRebalance()**
```
Triggered: Every block (or every minute)
Process:
  1. Calculate current coverage ratio
  2. IF ratio < rebalanceThreshold (120%):
     - Pause minting
     - Trigger rebalancing event
     - Call r-Token contract to convert
     - Restore coverage ratio to 150%
  3. ELSE: Continue normal operation
```

---

### **Contract 2: xMinima Contract**

**State Variables:**
```
totalSupply: number
totalCollateral: number
leverageMultiplier: number
currentValue: number
```

**Functions:**

**mint(amount)**
```
Input: amount (Minima)
Process:
  1. Lock Minima as collateral
  2. Calculate xMinima to mint (based on leverage)
  3. Mint xMinima
  4. Update totalSupply, totalCollateral
  5. Collect fee (0.1%) → r-Token pool
Output: xMinima minted
```

**burn(amount)**
```
Input: amount (xMinima)
Process:
  1. Burn xMinima
  2. Calculate Minima to return (based on current value)
  3. Release collateral
  4. Update totalSupply, totalCollateral
  5. Collect fee (0.1%) → r-Token pool
Output: Minima returned
```

**updateValue()**
```
Triggered: Every 5 minutes
Process:
  1. Get current Minima price
  2. Calculate xMinima value (amplified by leverage)
  3. Update currentValue
  4. NO liquidation check!
```

---

### **Contract 3: r-Token Pool Contract**

**State Variables:**
```
totalDeposited: number
totalShares: number
accumulatedFees: number
yieldPerShare: number
```

**Functions:**

**deposit(amount, currency)**
```
Input: amount (stablecoin), currency
Process:
  1. Transfer stablecoin to pool
  2. Calculate shares to mint
  3. Mint r-Token shares
  4. Record deposit time (for voting power)
  5. Update totalDeposited, totalShares
Output: r-Token shares minted
```

**withdraw(shares, currency)**
```
Input: shares (r-Token), currency
Process:
  1. Check no active rebalancing
  2. Calculate stablecoin to return (+ accrued yield)
  3. Burn r-Token shares
  4. Transfer stablecoin to user
  5. Update totalDeposited, totalShares
Output: Stablecoin returned (+ yield)
```

**distributeFees(amount)**
```
Triggered: Every transaction
Input: amount (transaction fees)
Process:
  1. Add fees to accumulatedFees
  2. Calculate yieldPerShare
  3. Update all r-Token holder balances (proportional)
  4. Update last30DayYield (rolling calculation)
```

**rebalance()**
```
Triggered: Stablecoin contract (coverage ratio < threshold)
Process:
  1. Calculate amount to convert
  2. Convert r-Tokens to xMinima (progressively)
  3. Reduce system debt
  4. Restore coverage ratio
  5. Emit rebalancing event
  6. Notify affected users
```

---

### **Contract 4: Local Currency Contract**

**State Variables:**
```
name: string
parentCurrency: string
pegRatio: number
totalSupply: number
communityGovernance: address
```

**Functions:**

**mint(amount)**
```
Input: amount
Process:
  1. Check caller has minting permission
  2. Mint local currency
  3. Update totalSupply
  4. Maintain peg to parent currency
Output: Local currency minted
```

**convertToParent(amount)**
```
Input: amount (local currency)
Process:
  1. Burn local currency
  2. Mint parent currency (1:1 peg)
  3. Transfer to user
Output: Parent currency
```

**convertFromParent(amount)**
```
Input: amount (parent currency)
Process:
  1. Burn parent currency
  2. Mint local currency (1:1 peg)
  3. Transfer to user
Output: Local currency
```

---

### **Contract 5: Council Governance Contract**

**State Variables:**
```
proposals: Proposal[]
votingPowerCache: {address: number}
```

**Functions:**

**createProposal(title, description, parameters)**
```
Input: Proposal details
Process:
  1. Check proposer has minimum voting power (100)
  2. Create proposal
  3. Set discussion period (7 days)
  4. Set voting period (7 days after discussion)
  5. Emit proposal created event
Output: Proposal ID
```

**vote(proposalId, vote)**
```
Input: proposalId, vote ('for' | 'against' | 'abstain')
Process:
  1. Check voting period active
  2. Calculate voter's voting power:
     - Get r-Token holdings
     - Calculate days held
     - Power = √(amount) × days
  3. Record vote
  4. Update vote tallies
Output: Success
```

**executeProposal(proposalId)**
```
Input: proposalId
Process:
  1. Check voting period ended
  2. Check proposal approved (>50% for)
  3. Check quorum met (>10% of total voting power)
  4. Wait for time-lock (7 days)
  5. Execute proposal
  6. Emit execution event
Output: Success
```

---

# PART 5: ORACLE DESIGN

## 🔮 Oracle Architecture

### **Hybrid Multi-Source Oracle**

```
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL PRICE SOURCES                     │
│  - CoinGecko API                                        │
│  - CoinMarketCap API                                    │
│  - Binance API                                          │
│  - Kraken API                                           │
│  - Council Oracle (fallback)                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AGGREGATION LAYER                          │
│  - Collect prices from all sources                      │
│  - Calculate MEDIAN (not average)                       │
│  - Remove outliers (>10% deviation from median)         │
│  - Apply TWAP (1-hour rolling window)                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              VALIDATION LAYER                           │
│  - Price deviation check (<10% per hour)                │
│  - Circuit breaker (pause if extreme)                   │
│  - Council override capability                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              ON-CHAIN STORAGE                           │
│  - Store validated price                                │
│  - Update every 5 minutes                               │
│  - Transparent price history                            │
└─────────────────────────────────────────────────────────┘
```

### **Update Frequency**
- Price collection: Every 5 minutes
- TWAP calculation: Rolling 1-hour window
- Coverage ratio check: Every block (or every minute)

---

# PART 6: SECURITY CONSIDERATIONS

## 🔒 Security Measures

### **1. Smart Contract Security**

**Measures:**
- Follow Minima best practices
- Reentrancy guards on all external calls
- Safe math (overflow/underflow protection)
- Multi-signature for critical functions
- Time-locks on governance changes
- Comprehensive testing before deployment
- Security audit (external)

---

### **2. Oracle Security**

**Measures:**
- Multiple independent sources (5+)
- MEDIAN aggregation (outlier resistant)
- TWAP (manipulation resistant)
- Price deviation limits
- Circuit breakers
- Council override (emergency)

---

### **3. Economic Security**

**Measures:**
- Over-collateralization (150%+)
- Rebalancing mechanism
- Time-weighted voting (prevents flash governance)
- Gradual r-Token conversion
- Transparent monitoring
- Community oversight

---

### **4. User Security**

**Measures:**
- Non-custodial (user controls keys)
- Minima node security (built-in)
- Clear security education
- No central point of failure

---

# PART 7: OPEN QUESTIONS FOR MINIMA TEAM

## ❓ Technical Questions

### **1. Oracle Integration**
- Recommended oracle approach for Minima?
- Existing oracle infrastructure we can leverage?
- How to handle oracle updates on-chain efficiently?
- Gas/fee implications of frequent updates?

### **2. Smart Contract Best Practices**
- Common vulnerabilities in Minima smart contracts?
- Recommended testing framework?
- How to handle contract upgrades (if needed)?
- Gas/fee optimization strategies?

### **3. xMinima Implementation**
- Any technical constraints for leveraged positions?
- How to efficiently track amplified value changes?
- Performance implications of frequent value updates?

### **4. r-Token Rebalancing**
- Best way to implement progressive conversion?
- How to handle partial conversions efficiently?
- Gas/fee implications of rebalancing events?

### **5. Local Currency Contracts**
- Performance implications of many currency contracts?
- Best way to structure parent-child relationships?
- How to handle community governance on-chain?

### **6. Council Governance**
- Recommended governance implementation?
- How to calculate time-weighted voting power efficiently?
- Best way to handle proposal execution with time-locks?

### **7. Transaction Fees**
- How to collect and distribute fees to r-Token holders?
- Fee structure recommendations?
- Gas/fee optimization for high-volume transactions?

### **8. General**
- What are we missing in our design?
- Any Minima-specific constraints we should know about?
- Recommended development approach?
- How can the Minima team support us?

---

## 🚀 NEXT STEPS

1. **Review this document internally**
2. **Submit to Minima team for feedback**
3. **Incorporate Minima team feedback**
4. **Finalize technical design**
5. **Begin implementation**

---

**Built on MINIMA**  
**Money that is truly yours. Secure, Pseudonymous and Unstoppable.**
