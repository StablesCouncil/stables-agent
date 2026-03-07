# Governance Token Weighting System

**Version**: 1.0  
**Date**: 2026-02-03  
**Status**: Development Draft

---

## 🎯 Core Principle

**Time-weighted voting power** to give more influence to small holders who hold for a long time, preventing whales from dominating governance.

---

## 🪙 Three Token Types

### **1. Stables (Stablecoins)**
- sUSD, sEUR, sCAD, sGBP, sJPY, sCNY, sIRT
- Used for payments and transactions
- **Governance weight:** 1x base voting power

### **2. r-Tokens (Staked Stables in Coverage Pool)**
- Stables deposited into rebalancing pools
- Earn yield from transaction fees
- Provide coverage for xWiniwa positions
- **Governance weight:** 2x base voting power (because locked/staked)

### **3. xWiniwa (Leveraged Holders)**
- Leveraged position on Winiwa/MINIMA
- No liquidation mechanism
- Provide backing for Stables minting
- **Governance weight:** 3x base voting power (because taking on risk)

---

## ⏰ Time-Weighting Formula

**Base Formula:**
```
Voting Power = Token Amount × Token Multiplier × Time Multiplier
```

**Time Multiplier:**
```
Time Multiplier = 1 + (Hold Duration in Days / 365)

Examples:
- 0 days held: 1.0x
- 30 days held: 1.08x
- 90 days held: 1.25x
- 180 days held: 1.49x
- 365 days held: 2.0x
- 730 days held: 3.0x
```

**Maximum Time Multiplier:** 5.0x (at 4 years)

---

## 📊 Voting Power Examples

### **Example 1: Small Long-Term Holder**
- **Holdings:** 1,000 sUSD (Stables)
- **Hold Duration:** 365 days (1 year)
- **Calculation:**
  - Token Multiplier: 1x (Stables)
  - Time Multiplier: 2.0x (1 year)
  - **Voting Power:** 1,000 × 1 × 2.0 = **2,000 votes**

---

### **Example 2: Large Short-Term Holder**
- **Holdings:** 10,000 sUSD (Stables)
- **Hold Duration:** 7 days
- **Calculation:**
  - Token Multiplier: 1x (Stables)
  - Time Multiplier: 1.02x (7 days)
  - **Voting Power:** 10,000 × 1 × 1.02 = **10,200 votes**

**Result:** Small holder with 1/10th the tokens but 1 year hold time has 20% of the voting power of a whale who just bought in.

---

### **Example 3: r-Token Holder (Staked)**
- **Holdings:** 5,000 sUSD staked as r-Tokens
- **Hold Duration:** 180 days (6 months)
- **Calculation:**
  - Token Multiplier: 2x (r-Tokens)
  - Time Multiplier: 1.49x (180 days)
  - **Voting Power:** 5,000 × 2 × 1.49 = **14,900 votes**

---

### **Example 4: xWiniwa Holder (Speculator)**
- **Holdings:** 2,000 sUSD equivalent in xWiniwa
- **Hold Duration:** 90 days (3 months)
- **Calculation:**
  - Token Multiplier: 3x (xWiniwa)
  - Time Multiplier: 1.25x (90 days)
  - **Voting Power:** 2,000 × 3 × 1.25 = **7,500 votes**

---

### **Example 5: Diversified Long-Term Holder**
- **Holdings:**
  - 3,000 sUSD (Stables) - held 365 days
  - 2,000 sUSD in r-Tokens - held 180 days
  - 1,000 sUSD in xWiniwa - held 90 days
- **Calculation:**
  - Stables: 3,000 × 1 × 2.0 = 6,000 votes
  - r-Tokens: 2,000 × 2 × 1.49 = 5,960 votes
  - xWiniwa: 1,000 × 3 × 1.25 = 3,750 votes
  - **Total Voting Power:** **15,710 votes**

---

## 🎯 Design Goals

### **1. Reward Long-Term Commitment**
- Holders who stick around gain more influence
- Discourages short-term speculation for governance manipulation
- Aligns incentives with protocol health

### **2. Empower Small Holders**
- A small holder with 1,000 tokens held for 2 years (4x multiplier) has same voting power as a whale with 4,000 tokens held for 1 day
- Prevents whale dominance
- Encourages community participation

### **3. Incentivize Risk-Taking**
- xWiniwa holders (speculators) get 3x multiplier because they provide critical liquidity
- r-Token holders (stakers) get 2x multiplier because they lock funds
- Stables holders get 1x (base) because most liquid

### **4. Prevent Gaming**
- Time multiplier is continuous (not step-based)
- Transferring tokens resets hold duration to zero
- Cannot "buy" voting power without time commitment

---

## 🔒 Anti-Gaming Mechanisms

### **1. Transfer Resets Hold Duration**
- If you transfer tokens to another wallet, hold duration resets to zero
- Prevents buying "aged" tokens from others
- Encourages genuine long-term holding

### **2. Snapshot-Based Voting**
- Voting power calculated at snapshot time (when vote is called)
- Cannot buy tokens just before vote to influence outcome
- Requires holding before snapshot

### **3. Minimum Hold Duration for Proposals**
- To submit a governance proposal: Must hold tokens for 30+ days
- Prevents spam proposals from new holders
- Ensures proposers are committed community members

### **4. Quadratic Voting (Optional Enhancement)**
- Instead of 1 token = 1 vote, use square root
- Example: 10,000 tokens = 100 votes (√10,000)
- Further reduces whale influence
- Can be combined with time-weighting

---

## 🏛️ Council Seat Allocation

### **Council Composition (20 Seats Total)**

**1. Founding Members (5 seats)**
- Initial team members
- Term-limited (2 years)
- Gradually rotate out
- Advisory role after term

**2. Elected Representatives (10 seats)**
- Elected by token holders
- Voting power weighted by formula above
- 2-year terms
- Can be re-elected

**3. Merit-Based Seats (5 seats)**
- Earned through contribution
- Cluster champions (Gold status)
- Top contributors (developers, educators)
- Community-nominated, Council-approved

---

## 🗳️ Voting Mechanics

### **Proposal Types**

**Type 1: Routine Changes (Simple Majority >50%)**
- Transaction fee adjustments (within bounds)
- New merchant verifications
- Marketing budget allocation
- Community event approvals

**Type 2: Significant Changes (Supermajority >66%)**
- Collateralization ratio adjustments
- New currency approvals
- Oracle provider changes
- Council seat additions

**Type 3: Critical Changes (Unanimous Council + Community Vote)**
- Core protocol modifications
- Fixed parameter changes
- Emergency security measures
- Council structure changes

---

### **Voting Process**

**1. Proposal Submission**
- Anyone with 30+ day hold duration can propose
- Proposal must include:
  - Clear description
  - Rationale
  - Implementation plan
  - Impact assessment

**2. Discussion Period (7 days minimum)**
- Community discusses on Telegram/Discord
- Feedback incorporated
- Questions answered

**3. Snapshot**
- Voting power calculated at snapshot time
- Prevents last-minute token buying

**4. Voting Period (7 days)**
- Token holders vote (weighted by formula)
- Real-time results visible
- Can change vote during period

**5. Implementation Delay (7 days)**
- If approved, 7-day delay before implementation
- Allows community to prepare
- Emergency override only for security issues

---

## 📊 Governance Dashboard (Future Feature)

**User View:**
```
Your Governance Power

Holdings:
- 5,000 sUSD (Stables) - Held 245 days
  Voting Power: 5,000 × 1 × 1.67 = 8,350 votes

- 2,000 sUSD (r-Tokens) - Held 120 days  
  Voting Power: 2,000 × 2 × 1.33 = 5,320 votes

Total Voting Power: 13,670 votes
Rank: Top 15% of voters

Active Proposals:
1. Adjust transaction fee to 0.15% (Currently 0.2%)
   Your vote: ✅ YES (13,670 votes)
   Current tally: 67% YES, 33% NO

2. Approve "sTokyo" local currency
   Your vote: Not voted yet
   Voting ends: 2026-02-10
```

---

## 🎯 Benefits of This System

### **For Small Holders:**
- Time commitment matters more than wealth
- Can gain significant influence over years
- Encourages participation and loyalty

### **For Large Holders:**
- Still have influence (as they should)
- But can't dominate without time commitment
- Incentivized to hold long-term

### **For Speculators (xWiniwa):**
- Rewarded for providing liquidity
- 3x multiplier recognizes their risk
- Aligned with protocol success

### **For Stakers (r-Tokens):**
- Rewarded for locking funds
- 2x multiplier for providing coverage
- Encouraged to participate in governance

### **For the Protocol:**
- Long-term aligned governance
- Resistant to whale manipulation
- Encourages genuine community participation
- Rewards those who take on risk (xWiniwa, r-Tokens)

---

## 🚨 Edge Cases & Solutions

### **Edge Case 1: Whale Splits Tokens Across Wallets**
- **Problem:** Whale creates 100 wallets, holds small amounts in each for years
- **Solution:** Doesn't help - voting power is still proportional to total holdings. Splitting doesn't increase power, just makes it harder to manage.

### **Edge Case 2: Buying "Aged" Tokens**
- **Problem:** Someone tries to buy tokens from a long-term holder to inherit their time multiplier
- **Solution:** Transfer resets hold duration to zero. Buyer gets no time bonus.

### **Edge Case 3: Flash Loan Attack**
- **Problem:** Borrow massive tokens just before snapshot
- **Solution:** Snapshot is announced 7 days before voting starts. Hold duration must be >7 days to count. Flash loans don't work.

### **Edge Case 4: Sybil Attack (Many Fake Accounts)**
- **Problem:** Create 1,000 accounts with small holdings
- **Solution:** Doesn't help - total voting power is still proportional to total tokens held. More accounts = more complexity, same power.

---

## 📝 Implementation Notes

**Technical Requirements:**
- Track hold duration per wallet per token type
- Calculate time multiplier at snapshot
- Store snapshot data on-chain
- Prevent double-voting

**Smart Contract Functions:**
```
getVotingPower(address wallet, uint256 snapshotId) → uint256
  - Calculates total voting power at snapshot time
  - Includes all token types (Stables, r-Tokens, xWiniwa)
  - Applies time-weighting formula

submitProposal(string description, bytes calldata) → uint256 proposalId
  - Requires 30+ day hold duration
  - Creates new proposal
  - Returns proposal ID

vote(uint256 proposalId, bool support) → bool
  - Records vote with weighted power
  - Can change vote during voting period
  - Emits event for transparency
```

---

## 🎯 Summary

**This governance model:**
- ✅ Empowers small long-term holders
- ✅ Prevents whale dominance
- ✅ Rewards risk-takers (xWiniwa, r-Tokens)
- ✅ Encourages long-term alignment
- ✅ Resistant to gaming
- ✅ Transparent and fair

**The formula is simple:**
```
Voting Power = Amount × Token Type Multiplier × Time Multiplier

Where:
- Token Type: Stables (1x), r-Tokens (2x), xWiniwa (3x)
- Time: 1x + (days held / 365), max 5x at 4 years
```

**Built on MINIMA** → https://minima.global
