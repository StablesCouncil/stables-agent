# Stables Strategic Roadmap v2
**Version**: 2.0  
**Date**: 2026-01-18  
**Status**: Development Draft  
**Measurement**: Community Growth Milestones (not time-based)

---

## 🎯 VISION

> **A global network of local circular economies**, where communities create and control their own money, pegged to currencies they trust. Built on Minima, governed by the Council, accessible to everyone.

---

## 📋 STRATEGIC PILLARS

### **1. Community Clustering**
Build **geographic clusters** with circulating economies, not just scattered users.

**Success = Local economies where:**
- People earn Stables
- Merchants accept Stables
- Money circulates locally
- Community creates value

### **2. Technical Foundation**
Proper planning → Minima review → Secure implementation

**Critical Components:**
- Oracle manipulation prevention
- Smart contract security
- Merchant payment API
- Local currency creation mechanism

### **3. Council Governance**
Define how the Council actually works

**Key Questions:**
- Who makes decisions?
- How are decisions made?
- What does the Council control?
- How do community members participate?

### **4. Local Currency Creation**
Revolutionary feature: **Let communities create their own pegged currencies**

**Example:**
- "sBerlin" (pegged to sEUR)
- "sLagos" (pegged to sUSD)
- "sLocal" (pegged to any stable)
- Community-controlled, locally circulating

---

## 🗺️ ROADMAP PHASES (Milestone-Based)

---

## **PHASE 0: TECHNICAL PLANNING**
**Trigger:** NOW  
**Completion Criteria:** Minima team approves technical design

### **📐 Technical Specification Document**

**Purpose:** Complete technical plan BEFORE any coding

**Document Sections:**

#### **1. System Architecture**
- Overall system design
- Component interactions
- Data flow diagrams
- Security model

#### **2. Oracle Design & Manipulation Prevention**

**The Oracle Problem:**
- Price feeds can be manipulated
- Single point of failure
- Critical for stablecoin pegs
- Must be robust and decentralized

**Proposed Solutions (for Minima review):**

**Option A: Multiple Oracle Sources**
- Aggregate from 5+ sources
- Median price (not average)
- Outlier detection
- Fallback mechanisms

**Option B: Time-Weighted Average Price (TWAP)**
- Average price over 24 hours
- Harder to manipulate short-term
- Smooth out volatility
- Delay in price updates (trade-off)

**Option C: Community Oracle**
- Council members submit prices
- Consensus mechanism
- Incentivized accuracy
- Decentralized but slower

**Option D: Hybrid**
- Multiple sources + TWAP + Community validation
- Most robust but complex
- Recommended approach

**Anti-Manipulation Measures:**
- Price deviation limits (max 10% change per hour)
- Circuit breakers (pause if extreme volatility)
- Multi-signature oracle updates
- Transparent price history
- Community monitoring

**Questions for Minima Team:**
- Best oracle approach for Minima?
- Existing oracle infrastructure we can use?
- Security considerations we're missing?
- Performance implications?

---

#### **3. Smart Contract Design**

**Core Contracts:**

**A. Stablecoin Minting Contract**
- Winiwa → Stablecoin (sUSD, sEUR, etc.)
- Collateralization ratio
- Minting/burning logic
- Fee structure

**B. xWiniwa Contract (Leveraged Position)**
- No liquidation mechanism (key innovation!)
- How does this work without liquidation?
- Risk management
- Rebalancing triggers

**C. r-Token Contract (Rebalance Pools)**
- Deposit/withdrawal logic
- Yield distribution (from transaction fees)
- Conversion to xWiniwa (during rebalancing)
- Coverage ratio calculation

**D. Local Currency Contract**
- Community creates new currency
- Pegs to existing stable (sUSD, sEUR, etc.)
- Minting permissions (who can mint?)
- Governance (community-controlled)

**E. Merchant Payment Contract**
- Payment requests
- Settlement logic
- Fee collection
- Refund mechanism

**Security Considerations:**
- Reentrancy protection
- Integer overflow/underflow
- Access control
- Upgrade mechanism (if needed)

**Questions for Minima Team:**
- Smart contract best practices on Minima?
- Common vulnerabilities to avoid?
- Gas/fee optimization?
- Testing framework recommendations?

---

#### **4. Merchant Payment API**

**Simple Design:**

```
API Endpoint: /merchant/payment

Request:
{
  "merchant_address": "0x...",
  "amount": 100,
  "currency": "sUSD",
  "description": "Coffee purchase",
  "callback_url": "https://merchant.com/webhook"
}

Response:
{
  "payment_id": "abc123",
  "qr_code": "data:image/png;base64,...",
  "payment_address": "0x...",
  "expires_at": "2026-01-18T16:00:00Z"
}
```

**Merchant Address List:**
- Simple JSON file or API endpoint
- List of verified merchant addresses
- Merchant name, category, location
- Public and queryable

**Is this enough?**
- Yes for MVP
- Can enhance later (webhooks, confirmations, etc.)
- Keep it simple initially

**Questions for Minima Team:**
- Best way to handle payment notifications?
- Transaction confirmation speed?
- Fee structure for merchants?

---

#### **5. Local Currency Creation Mechanism**

**Revolutionary Feature:** Let communities create their own money

**How It Works:**

**Step 1: Community Proposes Currency**
- Name: "sBerlin"
- Peg: sEUR (1:1)
- Purpose: Local Berlin economy
- Governance: Berlin community members

**Step 2: Council Approves**
- Review proposal
- Verify community legitimacy
- Approve or reject
- Set parameters

**Step 3: Currency Deployed**
- Smart contract created
- Pegged to parent currency (sEUR)
- Minting permissions granted to community
- Listed in app

**Step 4: Community Governs**
- Community decides minting policy
- Local merchants accept sBerlin
- Circulates within community
- Can always convert to sEUR (parent)

**Benefits:**
- ✅ Local economic sovereignty
- ✅ Community ownership
- ✅ Circular economy incentives
- ✅ Cultural identity (sBerlin, sLagos, etc.)
- ✅ Viral growth (communities compete)

**Risks:**
- ⚠️ Over-minting (inflation)
- ⚠️ Governance capture
- ⚠️ Complexity for users

**Safeguards:**
- Peg to stable parent currency
- Transparent minting rules
- Council oversight
- Community voting

**Questions for Minima Team:**
- Technical feasibility on Minima?
- Performance implications (many currencies)?
- Security considerations?
- Best governance model?

---

#### **6. Council Governance Structure**

**What is the Council?**

**NOT a DAO** (we don't use that term)  
**IS a Council** (community governance body)

**Key Questions to Answer:**

**Q1: Who is on the Council?**

**Option A: Founding Members**
- Initial team
- Trusted community members
- Gradually expand

**Option B: Elected Representatives**
- Community votes
- Term limits
- Rotating seats

**Option C: Meritocratic**
- Top contributors
- Earned through participation
- Reputation-based

**Option D: Hybrid**
- Founding members + Elected + Merit-based
- Recommended approach

**Q2: What does the Council decide?**

**Governance Scope:**
- ✅ Protocol parameters (fees, ratios, etc.)
- ✅ New currency approvals (local currencies)
- ✅ Oracle source selection
- ✅ Merchant verification
- ✅ Roadmap priorities
- ✅ Treasury management (if donations)
- ❌ Individual transactions (not censorship)
- ❌ User funds (non-custodial always)

**Q3: How are decisions made?**

**Decision Process:**
1. **Proposal:** Anyone can propose
2. **Discussion:** Community discusses (Telegram, forums)
3. **Council Vote:** Council members vote
4. **Execution:** If approved, implemented
5. **Transparency:** All votes public

**Voting Mechanisms:**
- Simple majority (>50%)
- Supermajority (>66%) for critical changes
- Veto power (for security issues)
- Time-locked execution (7-day delay)

**Q4: How do community members participate?**

**Participation Levels:**

**Level 1: Users**
- Use the app
- Provide feedback
- Vote in polls (non-binding)

**Level 2: Contributors**
- Create content
- Help onboard users
- Report bugs
- Earn recognition

**Level 3: Council Members**
- Vote on proposals
- Represent community
- Steward the protocol

**Progression:**
- User → Contributor (through participation)
- Contributor → Council (through election/merit)

---

### **📄 Deliverable: Technical Specification Document**

**Contents:**
1. System architecture
2. Oracle design + manipulation prevention
3. Smart contract specifications
4. Merchant payment API
5. Local currency creation mechanism
6. Council governance structure
7. Security considerations
8. Open questions for Minima team

**Next Step:**
- Submit to Minima team for review
- Incorporate feedback
- Iterate until approved
- THEN start coding

**Completion Criteria:**
- ✅ Document complete
- ✅ Minima team reviewed
- ✅ Feedback incorporated
- ✅ Technical design approved
- ✅ Community understands the plan

---

## **PHASE 1: COMMUNITY FOUNDATION**
**Trigger:** Technical spec approved  
**Completion Criteria:** First geographic cluster established

### **🌍 Geographic Clustering Strategy**

**Goal:** Build **local circular economies**, not just scattered users

**What is a Cluster?**

A geographic area where:
- 50+ active users
- 10+ merchants accepting Stables
- Money circulates locally (users → merchants → users)
- Community creates local currency (optional)

**Why Clusters?**

**Scattered Users (Bad):**
```
User A (New York) → User B (London) → User C (Tokyo)
↓
No local economy
No merchant acceptance
No circulation
```

**Clustered Users (Good):**
```
Berlin Cluster:
User A → Café → User B → Freelancer → User C → Restaurant → User A
↓
Local circular economy
Merchants accept sBerlin
Money circulates
Community thrives
```

**Cluster Selection Criteria:**

**We don't target markets - we go where it sticks**

**Indicators of "Stickiness":**
- Early adopter concentration (where are our first users?)
- Merchant interest (who's asking to accept Stables?)
- Community engagement (where are discussions happening?)
- Local champions (who's evangelizing?)
- Regulatory friendliness (where is it legal/easy?)

**Cluster Development Process:**

**Step 1: Identify Emerging Cluster**
- Monitor user signups by location
- Track community engagement by geography
- Identify local champions
- Assess merchant interest

**Step 2: Support Cluster Growth**
- Local community group (Telegram/Facebook)
- Local language support (if needed)
- Local merchant outreach
- Local events (virtual or in-person)

**Step 3: Enable Local Currency**
- Community proposes local currency (e.g., "sBerlin")
- Council approves
- Currency deployed
- Community governs

**Step 4: Measure Circulation**
- Transaction volume within cluster
- Merchant acceptance rate
- User-to-merchant ratio
- Currency velocity (how fast money moves)

**Step 5: Replicate**
- Document what worked
- Share playbook with other emerging clusters
- Support new clusters
- Scale organically

**First Cluster Target:**
- **Where:** Wherever it emerges organically (don't force)
- **Size:** 50+ users, 10+ merchants
- **Currency:** Local currency created and circulating
- **Circulation:** 100+ local transactions/week

**Completion Criteria:**
- ✅ First cluster identified
- ✅ 50+ active users in cluster
- ✅ 10+ merchants accepting Stables
- ✅ Local currency created (optional but ideal)
- ✅ Money circulating locally (100+ tx/week)
- ✅ Playbook documented for replication

---

### **📱 Platform Growth (During Cluster Building)**

**Primary Platforms:**
- **Facebook** (Page + Group)
- **Instagram** (Visual storytelling)
- **Telegram** (Community HQ)

**Content Focus:**
- Educational (how Stables works)
- Cluster highlights (success stories)
- Merchant spotlights
- User testimonials
- Council updates

**Growth Metrics:**
- Total followers: 5,000+
- Engagement rate: >5%
- Geographic concentration: Clusters forming
- User-generated content: 50+ posts

**NOT measured by:**
- ❌ Absolute follower count (vanity metric)
- ❌ Global reach (we want clusters, not scatter)

**Measured by:**
- ✅ Cluster formation (concentrated users)
- ✅ Local engagement (community activity)
- ✅ Merchant adoption (acceptance rate)
- ✅ Transaction circulation (money moving)

---

## **PHASE 2: APP DEVELOPMENT & TESTING**
**Trigger:** First cluster established  
**Completion Criteria:** App battle-tested, ready for public launch

### **🛠️ App Development**

**Development Approach:**
1. **Build based on approved technical spec**
2. **Minima team consultation throughout**
3. **Security-first mindset**
4. **Iterative development**
5. **Community feedback loops**

**Core Features (MVP):**

**Wallet:**
- Create/import wallet
- Node name identity (automatic)
- Multi-currency support
- Transaction history

**Minting:**
- Winiwa → Stablecoins (sUSD, sEUR, sCAD, sGBP, sJPY, sCNY)
- Winiwa → xWiniwa (leveraged, no liquidation)
- Clear UI (non-crypto language)

**Payments:**
- Send/receive
- QR codes
- Payment requests
- Cross-currency

**r-Tokens (Invest):**
- Deposit stablecoins
- Earn yield from transaction fees
- **30-day yield display** (top of app)
- **One-click "Invest Now" button**
- Withdraw anytime

**Local Currencies:**
- Browse available local currencies
- Mint local currency (if in community)
- Convert to parent currency
- See local merchants

**Merchant Tools:**
- Payment request generator
- QR code for point-of-sale
- Transaction notifications
- Simple dashboard

**Hidden Achievements:**
- Discoverable keys
- Mintable as NFTs
- Unlock app features
- Gamification

**Real Minima Integration:**
- Live price feeds (via oracle)
- Portfolio value in Minima
- Real transaction fees
- Actual blockchain transactions

---

### **🧪 Testing Program (Quest for The Key)**

**Purpose:** Battle-test the app with real users

**Structure:**
- Milestone-based missions (not time-based)
- Test specific features each mission
- Gamified with keys (Gold/Silver/Bronze/Participant/Hidden)
- ROI-based leaderboards
- Community feedback

**Testing Focus:**
- Oracle manipulation attempts
- Smart contract security
- r-Token yield accuracy
- Local currency creation
- Merchant payment flow
- Edge cases and exploits

**Completion Criteria:**
- ✅ All features tested under real conditions
- ✅ Security audit passed
- ✅ Oracle manipulation prevented
- ✅ 500+ bugs found and fixed
- ✅ Community confidence >4.5/5
- ✅ Ready for public launch

---

## **PHASE 3: PUBLIC LAUNCH & CLUSTER EXPANSION**
**Trigger:** App battle-tested  
**Completion Criteria:** 5 thriving clusters

### **🚀 Public Launch**

**Launch Strategy:**
- Start with first cluster (proven model)
- Expand to emerging clusters
- Support organic growth
- Don't force geographic expansion

**Launch Components:**
- Real money (transition from Winiwa)
- Merchant onboarding (simple API)
- Community support (24/7)
- Educational resources

**Merchant Payment API (Simple):**

```
Merchant Dashboard:
- Generate payment request
- Get QR code
- Monitor transactions
- Settle to bank (future) or keep in Stables

API Endpoint:
- /merchant/create_payment
- /merchant/check_status
- /merchant/list_transactions

Address List:
- Public JSON: List of verified merchants
- Searchable by location, category
- In-app merchant directory
```

**Is this enough for MVP?**
- Yes - keep it simple
- Merchants can accept payments
- Users can find merchants
- Enhance later based on feedback

---

### **🌐 Cluster Expansion**

**Goal:** 5 thriving clusters (not 5 countries, 5 communities)

**Cluster Replication:**
1. Identify emerging cluster (organic interest)
2. Apply playbook from first cluster
3. Support local champion
4. Enable local currency
5. Measure circulation
6. Document learnings

**Cluster Examples:**
- Berlin (sBerlin pegged to sEUR)
- Lagos (sLagos pegged to sUSD)
- Buenos Aires (sBuenosAires pegged to sUSD)
- Singapore (sSingapore pegged to sUSD)
- Portland (sPortland pegged to sUSD)

**Each cluster:**
- 100+ active users
- 20+ merchants
- Local currency circulating
- 500+ local transactions/week
- Self-sustaining community

**Completion Criteria:**
- ✅ 5 thriving clusters established
- ✅ Each cluster self-sustaining
- ✅ Playbook refined and documented
- ✅ Total users: 1,000+
- ✅ Total merchants: 100+
- ✅ Circulating economies proven

---

## **PHASE 4: SCALE & THE DEVICE**
**Trigger:** 5 thriving clusters  
**Completion Criteria:** 50 clusters, The Device launched

### **📈 Scaling Strategy**

**Organic Expansion:**
- Clusters replicate naturally
- Community-driven growth
- No forced geographic targeting
- Support where interest emerges

**Platform Maturity:**
- All platforms active and engaged
- User-generated content dominates
- Community self-sufficient
- Council fully operational

**Feature Expansion:**
- Advanced r-Token strategies
- Enhanced merchant tools
- Cross-cluster payments
- Governance voting in-app

---

### **🔑 The Device**

**Development:**
- Hardware design (Minima node on chip)
- Offline functionality
- Security features
- Manufacturing partnerships

**Distribution:**
- Top questers (100+ points from testing)
- Pre-orders (community)
- Cluster champions
- Merchant partners

**Goal:**
- Physical embodiment of financial freedom
- Ultimate reward for early adopters
- Marketing tool (tangible product)
- Long-term vision realized

---

## 🎯 SUCCESS METRICS (Milestone-Based)

### **Phase 0: Technical Planning**
- ✅ Technical spec complete
- ✅ Minima team approved
- ✅ Community understands plan

### **Phase 1: Community Foundation**
- ✅ First cluster: 50+ users, 10+ merchants
- ✅ Local currency created
- ✅ 100+ local transactions/week
- ✅ Playbook documented

### **Phase 2: App Development & Testing**
- ✅ App complete and tested
- ✅ Security audit passed
- ✅ 500+ bugs fixed
- ✅ Community confidence >4.5/5

### **Phase 3: Public Launch & Expansion**
- ✅ 5 thriving clusters
- ✅ 1,000+ users
- ✅ 100+ merchants
- ✅ Circulating economies proven

### **Phase 4: Scale & The Device**
- ✅ 50 clusters
- ✅ 10,000+ users
- ✅ 1,000+ merchants
- ✅ The Device launched

---

## 🚀 IMMEDIATE NEXT STEPS

### **This Week: Technical Specification**

**Day 1-2: Oracle Design**
- [ ] Research oracle solutions
- [ ] Design manipulation prevention
- [ ] Document approach
- [ ] Prepare questions for Minima team

**Day 3-4: Smart Contracts**
- [ ] Design core contracts
- [ ] Security considerations
- [ ] Local currency mechanism
- [ ] Document specifications

**Day 5-6: Merchant API & Council**
- [ ] Design merchant payment API
- [ ] Define Council governance
- [ ] Document both
- [ ] Prepare for Minima review

**Day 7: Compile & Submit**
- [ ] Compile full technical spec
- [ ] Review for completeness
- [ ] Submit to Minima team
- [ ] Announce to community (transparency)

---

## 📋 OPEN QUESTIONS FOR MINIMA TEAM

### **Oracle:**
1. Best oracle approach for Minima blockchain?
2. Existing oracle infrastructure we can leverage?
3. How to prevent manipulation?
4. Performance implications of multiple sources?

### **Smart Contracts:**
1. Best practices for Minima smart contracts?
2. Common vulnerabilities to avoid?
3. Testing framework recommendations?
4. Gas/fee optimization strategies?

### **xWiniwa (No Liquidation):**
1. How to implement leveraged position without liquidation?
2. Is this technically feasible on Minima?
3. What are the risks we're not seeing?
4. Alternative approaches?

### **Local Currency Creation:**
1. Technical feasibility of many currencies?
2. Performance implications?
3. Security considerations?
4. Best governance model?

### **General:**
1. What are we missing in our design?
2. Any Minima-specific constraints?
3. Recommended development approach?
4. How can Minima team support us?

---

**Built on MINIMA**  
**Money that is truly yours. Secure, Pseudonymous and Unstoppable.**
