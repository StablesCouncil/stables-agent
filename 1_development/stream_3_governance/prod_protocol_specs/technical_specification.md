# Stables Technical Specification
**Version**: 1.0  
**Date**: 2026-01-18  
**Status**: Draft for Minima Team Review  
**Purpose**: Complete technical design before implementation

---

## 🎯 DOCUMENT PURPOSE

This document defines the complete technical architecture of Stables before any coding begins. It will be submitted to the Minima team for review and feedback.

**Structure:**
1. Conceptual Overview (high-level)
2. System Architecture
3. Token Economics
4. Smart Contract Design
5. Oracle Design
6. Data Structures
7. User Flows
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

**Core Innovation:** No liquidation risk for leveraged positions (xWiniwa) through a novel rebalancing mechanism using r-Tokens.

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
│  - xWiniwa contract (leveraged position)                │
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

## 💰 Token Ecosystem (Conceptual)

### **The Token Hierarchy:**

```
WINIWA (Base Currency)
    │
    ├─→ STABLECOINS (Pegged to Fiat)
    │   ├─ sUSD (pegged to USD)
    │   ├─ sEUR (pegged to EUR)
    │   ├─ sCAD (pegged to CAD)
    │   ├─ sGBP (pegged to GBP)
    │   ├─ sJPY (pegged to JPY)
    │   └─ sCNY (pegged to CNY)
    │
    ├─→ xWINIWA (Leveraged Position)
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

## 🔄 Core Mechanisms (Conceptual)

### **1. The Winiwa Split**

**User Journey:**
```
User receives: 1,000 Winiwa

User can split into:
├─ Option A: 100% Stablecoins (e.g., 1,000 sUSD)
├─ Option B: 100% xWiniwa (leveraged exposure)
└─ Option C: Mixed (e.g., 500 sUSD + 500 xWiniwa)

Result: User controls allocation strategy
```

**Key Principle:** User decides risk/reward profile

---

### **2. Stablecoin Pegging**

**Mechanism:**
```
Mint sUSD:
1. User deposits Winiwa
2. Oracle provides USD/Minima price
3. Smart contract calculates collateral ratio
4. sUSD minted (1 sUSD = $1 USD worth of Minima)
5. Winiwa locked as collateral

Burn sUSD:
1. User returns sUSD
2. Smart contract burns sUSD
3. Winiwa collateral released
4. User receives Winiwa back
```

**Peg Maintenance:**
- Over-collateralized (e.g., 150% collateral ratio)
- Oracle price feeds
- Rebalancing mechanism (via r-Tokens)

---

### **3. xWiniwa (Leveraged Position, No Liquidation)**

**Core Innovation:** Leveraged exposure WITHOUT liquidation risk

**How it works:**
```
Mint xWiniwa:
1. User deposits Winiwa
2. Receives xWiniwa (amplified exposure)
3. When Winiwa ↑, xWiniwa ↑↑ (e.g., 2x-3x)
4. When Winiwa ↓, xWiniwa ↓↓ (e.g., 2x-3x)
5. NO liquidation threshold (key innovation!)

Why no liquidation?
- r-Token holders absorb the risk
- Rebalancing mechanism protects system
- xWiniwa value can go very low, but never liquidates
- User never loses position
```

**Risk Distribution:**
- xWiniwa holders: High volatility, no liquidation
- r-Token holders: Earn yield, absorb rebalancing risk
- Stablecoin holders: Stable value, low risk

---

### **4. r-Tokens (Rebalance Pools)**

**Purpose:** Provide stability buffer for the system

**Mechanism:**
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
- rsUSD progressively converts to xWiniwa
- User now holds leveraged position
- This stabilizes the system
```

**Yield Source:**
- 100% of transaction fees → r-Token holders
- Real revenue (not inflationary)
- Sustainable (grows with platform usage)

---

### **5. Rebalancing Mechanism**

**Coverage Ratio:**
```
Coverage Ratio = Total Collateral Value / Total Stablecoin Debt

Example:
- Total Winiwa collateral: $150,000 (in Minima)
- Total sUSD minted: $100,000
- Coverage Ratio: 150%
```

**Rebalancing Trigger:**
```
IF Coverage Ratio < Rebalance Threshold (e.g., 120%)
THEN:
  1. Pause new minting
  2. Convert r-Tokens to xWiniwa (progressively)
  3. Reduce system debt
  4. Restore coverage ratio
  5. Resume normal operation
```

**Why this works:**
- r-Token holders provide buffer
- They earn yield for taking this risk
- System never becomes under-collateralized
- xWiniwa holders never liquidated

---

### **6. Local Currency Creation**

**Concept:** Communities create their own pegged currencies

**Mechanism:**
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

**Benefits:**
- Local economic sovereignty
- Community ownership
- Circular economy incentives
- Cultural identity

**Safeguards:**
- Pegged to parent currency (sEUR, sUSD, etc.)
- Council oversight
- Transparent minting rules
- Community voting

---

## 👥 Governance (Conceptual)

### **The Council**

**Who:** r-Token holders (skin in the game)

**Voting Power:**
```
Voting Power = r-Token Amount × Days Held (dollar-days)

Example:
- Alice: 1,000 rsUSD × 100 days = 100,000 dollar-days
- Bob: 500 rsUSD × 300 days = 150,000 dollar-days
- Bob has more voting power (longer commitment)
```

**What Council Decides:**
- Protocol parameters (fees, collateral ratios, etc.)
- New local currency approvals
- Oracle source selection
- Merchant verification (optional)
- Roadmap priorities

**What Council Does NOT Decide:**
- Individual transactions (no censorship)
- User funds (non-custodial always)

**Decision Process:**
1. Proposal (anyone can propose)
2. Discussion (7 days)
3. Voting (7 days, r-Token holders)
4. Execution (if >50% approval)
5. Time-lock (7 days before execution)

---

# PART 2: SYSTEM ARCHITECTURE

## 🗂️ Data Structures

### **User Account Structure**

```javascript
User {
  nodeId: string,              // Minima node ID (identity)
  nodeName: string,            // Minima node name (display name)
  walletAddress: string,       // Minima wallet address
  
  balances: {
    winiwa: number,
    sUSD: number,
    sEUR: number,
    sCAD: number,
    sGBP: number,
    sJPY: number,
    sCNY: number,
    xWiniwa: number,
    rsUSD: number,
    rsEUR: number,
    rsCAD: number,
    rsGBP: number,
    rsJPY: number,
    rsCNY: number,
    // Local currencies (dynamic)
    [localCurrency]: number
  },
  
  transactions: Transaction[],
  achievements: Achievement[],  // Hidden keys
  councilVotingPower: number    // Calculated from r-Token holdings
}
```

### **Transaction Structure**

```javascript
Transaction {
  txId: string,
  timestamp: number,
  type: 'mint' | 'burn' | 'send' | 'receive' | 'invest' | 'withdraw',
  from: string,                 // Wallet address
  to: string,                   // Wallet address
  amount: number,
  currency: string,             // 'sUSD', 'xWiniwa', etc.
  fee: number,
  status: 'pending' | 'confirmed' | 'failed',
  blockHeight: number
}
```

### **Stablecoin State**

```javascript
StablecoinState {
  currency: 'sUSD' | 'sEUR' | 'sCAD' | 'sGBP' | 'sJPY' | 'sCNY',
  
  totalSupply: number,          // Total minted
  totalCollateral: number,      // Total Winiwa locked
  coverageRatio: number,        // Collateral / Supply
  
  oraclePrice: number,          // Current fiat/Minima price
  lastOracleUpdate: number,     // Timestamp
  
  rebalanceThreshold: number,   // e.g., 120%
  targetCollateralRatio: number,// e.g., 150%
  
  isPaused: boolean             // Paused during rebalancing
}
```

### **xWiniwa State**

```javascript
xWiniwaState {
  totalSupply: number,          // Total xWiniwa minted
  totalCollateral: number,      // Total Winiwa locked
  
  leverageMultiplier: number,   // e.g., 2x, 3x
  currentValue: number,         // Value per xWiniwa (in Minima)
  
  // NO liquidation threshold (key innovation!)
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

### **Local Currency State**

```javascript
LocalCurrencyState {
  name: string,                 // e.g., "sBerlin"
  symbol: string,               // e.g., "sBER"
  parentCurrency: string,       // e.g., "sEUR"
  pegRatio: number,             // e.g., 1.0 (1:1 peg)
  
  communityId: string,          // Community identifier
  governanceAddress: string,    // Community governance contract
  
  totalSupply: number,
  mintingPolicy: MintingPolicy,
  
  approvedBy: string,           // Council approval tx
  createdAt: number,
  
  merchants: Merchant[],        // Local merchants accepting this currency
  isActive: boolean
}
```

### **Council Proposal Structure**

```javascript
Proposal {
  proposalId: string,
  proposer: string,             // Wallet address
  
  type: 'parameter' | 'currency' | 'oracle' | 'other',
  title: string,
  description: string,
  
  parameters: {
    [key]: value                // Specific to proposal type
  },
  
  discussionPeriodEnd: number,  // Timestamp
  votingPeriodEnd: number,      // Timestamp
  executionTime: number,        // Timestamp (after time-lock)
  
  votes: {
    for: number,                // Total voting power FOR
    against: number,            // Total voting power AGAINST
    abstain: number
  },
  
  voters: {
    [address]: {
      vote: 'for' | 'against' | 'abstain',
      votingPower: number       // dollar-days at time of vote
    }
  },
  
  status: 'discussion' | 'voting' | 'approved' | 'rejected' | 'executed',
  executionTxId: string         // If executed
}
```

---

## 🔐 Smart Contract Design

### **Contract 1: Stablecoin Contract**

**Purpose:** Mint and burn stablecoins pegged to fiat currencies

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
Input: amount (Winiwa), currency (sUSD, sEUR, etc.)
Process:
  1. Check not paused
  2. Get oracle price for currency
  3. Calculate required collateral
  4. Lock Winiwa as collateral
  5. Mint stablecoin
  6. Update totalSupply, totalCollateral
  7. Collect fee (to r-Token pool)
Output: Minted stablecoin amount
```

**burn(amount, currency)**
```
Input: amount (stablecoin), currency
Process:
  1. Check user has sufficient balance
  2. Burn stablecoin
  3. Calculate Winiwa to return
  4. Release collateral
  5. Update totalSupply, totalCollateral
  6. Collect fee (to r-Token pool)
Output: Winiwa returned
```

**checkRebalance()**
```
Process:
  1. Calculate current coverage ratio
  2. IF ratio < rebalanceThreshold:
     - Pause minting
     - Trigger rebalancing event
     - Convert r-Tokens to xWiniwa
     - Restore coverage ratio
  3. ELSE: Continue normal operation
```

---

### **Contract 2: xWiniwa Contract**

**Purpose:** Leveraged position without liquidation

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
Input: amount (Winiwa)
Process:
  1. Lock Winiwa as collateral
  2. Calculate xWiniwa to mint (based on leverage)
  3. Mint xWiniwa
  4. Update totalSupply, totalCollateral
  5. Collect fee (to r-Token pool)
Output: xWiniwa minted
```

**burn(amount)**
```
Input: amount (xWiniwa)
Process:
  1. Burn xWiniwa
  2. Calculate Winiwa to return (based on current value)
  3. Release collateral
  4. Update totalSupply, totalCollateral
  5. Collect fee (to r-Token pool)
Output: Winiwa returned
```

**updateValue()**
```
Process:
  1. Get current Winiwa price
  2. Calculate xWiniwa value (amplified)
  3. Update currentValue
  4. NO liquidation check (key innovation!)
```

**Key Innovation:** No liquidation function! Value can drop very low, but position never liquidated.

---

### **Contract 3: r-Token Pool Contract**

**Purpose:** Rebalance pool for stability, yield generation

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
  4. Update totalDeposited, totalShares
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
Input: amount (transaction fees)
Process:
  1. Add fees to accumulatedFees
  2. Calculate yieldPerShare
  3. Update all r-Token holder balances (proportional)
```

**rebalance()**
```
Triggered by: Stablecoin contract (coverage ratio < threshold)
Process:
  1. Calculate amount to convert
  2. Convert r-Tokens to xWiniwa (progressively)
  3. Reduce system debt
  4. Restore coverage ratio
  5. Emit rebalancing event
```

---

### **Contract 4: Local Currency Contract**

**Purpose:** Community-created pegged currencies

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
  1. Check caller has minting permission (community governance)
  2. Mint local currency
  3. Update totalSupply
  4. Maintain peg to parent currency
Output: Local currency minted
```

**burn(amount)**
```
Input: amount
Process:
  1. Burn local currency
  2. Update totalSupply
Output: Success
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

**Purpose:** Decentralized governance by r-Token holders

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
  1. Create proposal
  2. Set discussion period (7 days)
  3. Set voting period (7 days after discussion)
  4. Emit proposal created event
Output: Proposal ID
```

**vote(proposalId, vote)**
```
Input: proposalId, vote ('for' | 'against' | 'abstain')
Process:
  1. Check voting period active
  2. Calculate voter's voting power (r-Token dollar-days)
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
  3. Wait for time-lock (7 days)
  4. Execute proposal (update parameters, deploy currency, etc.)
  5. Emit execution event
Output: Success
```

---

## 🔮 Oracle Design

### **Purpose:**
Provide reliable, manipulation-resistant price feeds for:
- Fiat currencies (USD, EUR, CAD, GBP, JPY, CNY) vs Minima
- Minima price (for portfolio valuation)

### **Oracle Architecture:**

**Hybrid Approach (Recommended):**
```
┌─────────────────────────────────────────────────────────┐
│              MULTIPLE ORACLE SOURCES                    │
│  - Source 1: CoinGecko API                              │
│  - Source 2: CoinMarketCap API                          │
│  - Source 3: Binance API                                │
│  - Source 4: Kraken API                                 │
│  - Source 5: Community Oracle (Council members)         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              AGGREGATION LAYER                          │
│  - Collect prices from all sources                      │
│  - Calculate MEDIAN (not average)                       │
│  - Detect outliers (remove if >10% deviation)           │
│  - Apply TWAP (Time-Weighted Average Price, 1 hour)     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              VALIDATION LAYER                           │
│  - Check price deviation (<10% change per hour)         │
│  - Circuit breaker (pause if extreme volatility)        │
│  - Community validation (Council can override)          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              SMART CONTRACT ORACLE                      │
│  - Store validated price on-chain                       │
│  - Update every 5 minutes                               │
│  - Transparent price history                            │
└─────────────────────────────────────────────────────────┘
```

### **Anti-Manipulation Measures:**

**1. Multiple Sources**
- Aggregate from 5+ independent sources
- Use MEDIAN (not average) to resist outliers
- Remove outliers (>10% deviation from median)

**2. Time-Weighted Average (TWAP)**
- Average price over 1 hour
- Smooths out short-term manipulation
- Trade-off: Slight delay in price updates

**3. Price Deviation Limits**
- Maximum 10% price change per hour
- If exceeded, pause minting and trigger review
- Circuit breaker for extreme volatility

**4. Community Validation**
- Council members can submit prices
- If API sources fail, use community oracle
- Consensus mechanism (median of Council submissions)

**5. Transparent History**
- All price updates on-chain
- Community can monitor for anomalies
- Appeals process if manipulation detected

### **Oracle Update Frequency:**
- Price updates: Every 5 minutes
- TWAP calculation: Rolling 1-hour window
- Coverage ratio check: Every block (or every minute)

---

## 📊 User Flows

### **Flow 1: Mint Stablecoin**

```
User Journey:
1. User opens app
2. Sees Winiwa balance: 1,000
3. Clicks "Mint Stablecoin"
4. Selects currency: sUSD
5. Enters amount: 500 Winiwa
6. App shows:
   - Oracle price: 1 Minima = $0.50 USD
   - Will receive: ~250 sUSD (minus fee)
   - Fee: 0.1% = 0.5 Winiwa
7. User confirms
8. Smart contract:
   - Locks 500 Winiwa as collateral
   - Mints 250 sUSD
   - Collects 0.5 Winiwa fee → r-Token pool
9. User receives 250 sUSD
10. Balance updated:
    - Winiwa: 500 (locked as collateral)
    - sUSD: 250
```

### **Flow 2: Invest in r-Tokens**

```
User Journey:
1. User opens app
2. Sees banner at top:
   "💰 r-Token 30-Day Yield: 12.5% APY"
   "[Invest Now]"
3. User clicks "Invest Now"
4. Modal opens:
   - Select currency: sUSD
   - Enter amount: 100 sUSD
   - Shows:
     * Current yield: 12.5% APY
     * Estimated earnings: ~12.5 sUSD/year
     * Risk: May convert to xWiniwa during rebalancing
5. User confirms
6. Smart contract:
   - Transfers 100 sUSD to r-Token pool
   - Calculates shares to mint
   - Mints rsUSD shares
7. User receives rsUSD
8. Starts earning yield immediately
9. Balance updated:
   - sUSD: 150
   - rsUSD: 100 (+ accruing yield)
```

### **Flow 3: Create Local Currency**

```
Community Journey:
1. Community member opens "Create Currency" page
2. Fills out proposal:
   - Name: sBerlin
   - Symbol: sBER
   - Parent: sEUR
   - Peg: 1:1
   - Purpose: Berlin local economy
   - Governance: Berlin community multisig
3. Submits proposal to Council
4. Council discussion (7 days):
   - Community discusses in Telegram
   - Council members review
   - Questions answered
5. Council voting (7 days):
   - r-Token holders vote
   - Voting power = dollar-days
6. If approved (>50%):
   - Time-lock (7 days)
   - Smart contract deployed
   - sBerlin listed in app
7. Berlin community can now:
   - Mint sBerlin (governance controlled)
   - Accept sBerlin at local merchants
   - Convert sBerlin ↔ sEUR (1:1)
   - Build local circular economy
```

---

## 🔒 Security Considerations

### **1. Smart Contract Security**

**Risks:**
- Reentrancy attacks
- Integer overflow/underflow
- Access control vulnerabilities
- Upgrade mechanism exploits

**Mitigations:**
- Follow Minima smart contract best practices
- Reentrancy guards on all external calls
- Use safe math libraries
- Multi-signature for critical functions
- Time-locks on governance changes
- Comprehensive testing
- Security audit before launch

### **2. Oracle Manipulation**

**Risks:**
- Price feed manipulation
- API failures
- Flash loan attacks (if applicable)

**Mitigations:**
- Multiple oracle sources (5+)
- MEDIAN aggregation (not average)
- TWAP (1-hour window)
- Price deviation limits (10% per hour)
- Circuit breakers
- Community validation fallback

### **3. Economic Attacks**

**Risks:**
- Bank run on r-Tokens
- Collateral ratio manipulation
- Governance capture

**Mitigations:**
- Over-collateralization (150%+)
- Rebalancing mechanism
- Time-weighted voting (prevents flash governance)
- Gradual r-Token conversion (not instant)
- Transparent monitoring

### **4. User Security**

**Risks:**
- Private key loss
- Phishing attacks
- Social engineering

**Mitigations:**
- Non-custodial (user controls keys)
- Clear security education
- Minima node security (built-in)
- No central point of failure

---

## ❓ OPEN QUESTIONS FOR MINIMA TEAM

### **1. Oracle Integration**
- What is the recommended oracle approach for Minima?
- Is there existing oracle infrastructure we can use?
- How do we handle oracle updates on-chain efficiently?
- What are the gas/fee implications of frequent oracle updates?

### **2. Smart Contract Best Practices**
- What are common vulnerabilities in Minima smart contracts?
- Recommended testing framework?
- How to handle contract upgrades (if needed)?
- Gas/fee optimization strategies?

### **3. xWiniwa Implementation**
- Any technical constraints for implementing leveraged positions?
- How to efficiently track amplified value changes?
- Performance implications of frequent value updates?

### **4. r-Token Rebalancing**
- Best way to implement progressive conversion (r-Token → xWiniwa)?
- How to handle partial conversions efficiently?
- Gas/fee implications of rebalancing events?

### **5. Local Currency Contracts**
- Performance implications of many currency contracts?
- Best way to structure parent-child currency relationships?
- How to handle community governance on-chain?

### **6. Council Governance**
- Recommended governance implementation on Minima?
- How to calculate time-weighted voting power efficiently?
- Best way to handle proposal execution with time-locks?

### **7. Transaction Fees**
- How to collect and distribute transaction fees to r-Token holders?
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
