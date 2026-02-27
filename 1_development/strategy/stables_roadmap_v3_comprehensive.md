# Stables Comprehensive Roadmap v3
**Version**: 3.0  
**Date**: 2026-02-03  
**Status**: Development Draft  
**Measurement**: Milestone-Based (not time-based)

---

## 🎯 VISION

> **A global network of local circular economies**, where communities create and control their own money, pegged to currencies they trust. Built on MINIMA, governed by the Council, accessible to everyone.

---

## 📋 KEY MILESTONES OVERVIEW

### **M1: Test Version Release (Testing Epochs)**
Multiple quest-based testing epochs to battle-test the platform with real users before full launch.

### **M2: First Fully Functional Version**
Production-ready platform with all core features operational and security-audited.

### **M3: Dedicated Hardware Device**
Physical device running a MINIMA node on chip - the ultimate embodiment of financial sovereignty.

### **M4: Ecosystem Critical Mass**
Sufficient shops accepting Stables and sufficient people paying with it to create sustainable circular economies.

### **M5: Speculator/Holder Engagement**
Active xMinima holders providing liquidity for Stables minting through leveraged positions.

### **M6: Council Transition**
Complete cessation of all assets to the Council - team holds no part of the structure.

### **M7: Governance Framework Lock**
Clear delineation between fixed parameters (immutable) and flexible parameters (Council-governed).

---

## 🗺️ DETAILED ROADMAP PHASES

---

## **PHASE 0: TECHNICAL PLANNING & FOUNDATION**
**Status:** In Progress  
**Completion Criteria:** Technical specification approved by MINIMA team

### **📐 Technical Specification Development**

#### **1. System Architecture**
- Overall system design
- Component interactions
- Data flow diagrams
- Security model
- Oracle integration strategy

#### **2. Oracle Design & Manipulation Prevention**

**The Oracle Problem:**
- Price feeds can be manipulated
- Single point of failure
- Critical for stablecoin pegs

**Proposed Solution (Hybrid Approach):**
- Multiple oracle sources (5+ providers)
- Time-Weighted Average Price (TWAP) over 24 hours
- Community validation layer
- Price deviation limits (max 10% change per hour)
- Circuit breakers for extreme volatility
- Multi-signature oracle updates
- Transparent price history

#### **3. Smart Contract Architecture**

**Core Contracts:**

**A. Stablecoin Minting Contract**
- Winiwa → Stablecoins (sUSD, sEUR, sCAD, sGBP, sJPY, sCNY, sIRT)
- Collateralization ratio
- Minting/burning logic
- Fee structure

**B. xWiniwa Contract (Leveraged Position)**
- No liquidation mechanism (key innovation)
- Risk management through rebalancing
- Speculator incentive structure

**C. r-Token Contract (Rebalance Pools)**
- Deposit/withdrawal logic
- Yield distribution from transaction fees
- Conversion to xWiniwa during rebalancing
- Coverage ratio calculation

**D. Local Currency Contract**
- Community currency creation
- Pegs to existing stables
- Minting permissions
- Community governance

**E. Merchant Payment Contract**
- Payment requests
- Settlement logic
- Fee collection
- Refund mechanism

#### **4. Council Governance Structure**

**What the Council Controls:**
- ✅ Protocol parameters (fees, ratios)
- ✅ New currency approvals
- ✅ Oracle source selection
- ✅ Merchant verification
- ✅ Roadmap priorities
- ✅ Treasury management
- ❌ Individual transactions (censorship-resistant)
- ❌ User funds (non-custodial always)

**What is FIXED (Immutable):**
- Merchant listing fees (set in stone)
- Core protocol logic (code is law)
- Non-custodial architecture
- Censorship resistance
- Open source commitment

**What is FLEXIBLE (Council-Governed):**
- Transaction fee adjustments
- Collateralization ratios (within safe bounds)
- New currency approvals
- Oracle provider selection
- Merchant verification criteria
- Development priorities

#### **5. Merchant Payment API**

**Simple MVP Design:**
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
  "expires_at": "2026-02-03T16:00:00Z"
}
```

**Merchant Directory:**
- Public JSON API
- Verified merchant addresses
- Searchable by location, category
- In-app merchant directory

### **📄 Deliverable: Technical Specification Document**

**Contents:**
1. System architecture
2. Oracle design + manipulation prevention
3. Smart contract specifications
4. Merchant payment API
5. Local currency creation mechanism
6. Council governance structure (fixed vs. flexible)
7. Security considerations
8. Open questions for MINIMA team

**Completion Criteria:**
- ✅ Document complete
- ✅ MINIMA team reviewed
- ✅ Feedback incorporated
- ✅ Technical design approved
- ✅ Community understands the plan

---

## **PHASE 1: COMMUNITY FOUNDATION**
**Trigger:** Technical spec approved  
**Completion Criteria:** First geographic cluster established

### **🌍 Geographic Clustering Strategy**

**Goal:** Build local circular economies, not scattered users

**What is a Cluster?**
- 50+ active users
- 10+ merchants accepting Stables
- Money circulates locally
- Community creates local currency (optional)

**Cluster Development Process:**

1. **Identify Emerging Cluster**
   - Monitor user signups by location
   - Track community engagement
   - Identify local champions
   - Assess merchant interest

2. **Support Cluster Growth**
   - Local community group (Telegram/Facebook)
   - Local language support
   - Local merchant outreach
   - Local events

3. **Enable Local Currency**
   - Community proposes currency (e.g., "sBerlin")
   - Council approves
   - Currency deployed
   - Community governs

4. **Measure Circulation**
   - Transaction volume within cluster
   - Merchant acceptance rate
   - User-to-merchant ratio
   - Currency velocity

**Completion Criteria:**
- ✅ First cluster identified
- ✅ 50+ active users in cluster
- ✅ 10+ merchants accepting Stables
- ✅ Local currency created (optional)
- ✅ 100+ local transactions/week
- ✅ Playbook documented

---

## **PHASE 2: APP DEVELOPMENT & TESTING EPOCHS**
**Trigger:** First cluster established  
**Completion Criteria:** App battle-tested, ready for production

### **🛠️ App Development**

**Core Features (MVP):**

**Wallet:**
- Create/import wallet
- Node name identity (automatic)
- Multi-currency support (sUSD, sEUR, sCAD, sGBP, sJPY, sCNY, sIRT)
- Transaction history

**Minting:**
- Winiwa → Stablecoins
- Winiwa → xWiniwa (leveraged, no liquidation)
- Clear UI (non-crypto language)

**Payments:**
- Send/receive
- QR codes
- Payment requests
- Cross-currency swaps

**r-Tokens (Invest):**
- Deposit stablecoins
- Earn yield from transaction fees
- 30-day yield display (top of app)
- One-click "Invest Now" button
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
- Gamification layer

---

### **🧪 MILESTONE 1: TEST VERSION RELEASE (Testing Epochs)**

**Purpose:** Battle-test the app with real users through multiple quest-based testing epochs

**Structure:**

#### **Testing Epoch 1: Core Functionality**
**Focus:** Basic wallet, minting, and payment features

**Quest Objectives:**
- Create wallet and secure seed phrase
- Mint first stablecoin (sUSD)
- Send/receive payments
- Test cross-currency swaps
- Report bugs and UX issues

**Participants:** 50-100 selected testers  
**Duration:** Milestone-based (not time-based)  
**Rewards:** Bronze Keys, Participant Keys

#### **Testing Epoch 2: Advanced Features**
**Focus:** r-Tokens, xWiniwa, and merchant tools

**Quest Objectives:**
- Deposit into r-Token pools
- Create xWiniwa leveraged position
- Test merchant payment flow
- Attempt oracle manipulation (controlled)
- Stress test smart contracts

**Participants:** 100-200 testers  
**Rewards:** Silver Keys, Hidden Keys

#### **Testing Epoch 3: Local Currencies & Clustering**
**Focus:** Community currency creation and cluster formation

**Quest Objectives:**
- Propose local currency
- Form local cluster (10+ users)
- Establish merchant acceptance
- Create circular economy
- Test governance voting

**Participants:** 200-500 testers  
**Rewards:** Gold Keys, exclusive NFTs

#### **Testing Epoch 4: Security & Adversarial Testing**
**Focus:** Break the system (controlled environment)

**Quest Objectives:**
- Attempt oracle manipulation
- Test smart contract exploits
- Stress test rebalancing mechanism
- Find edge cases
- Security audit participation

**Participants:** 500+ testers + security experts  
**Rewards:** Top Keys, Device pre-orders

**Testing Focus Areas:**
- Oracle manipulation prevention
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
- ✅ Ready for production launch

---

## **PHASE 3: MILESTONE 2 - FIRST FULLY FUNCTIONAL VERSION**
**Trigger:** Testing epochs completed, security audit passed  
**Completion Criteria:** Production-ready platform deployed

### **🚀 Production Launch**

**Launch Components:**
- Real money (transition from test assets)
- Full merchant onboarding
- 24/7 community support
- Educational resources
- Security monitoring

**Production Features:**
- All core features operational
- Security-audited smart contracts
- Robust oracle system
- Merchant payment API live
- Council governance active

**Launch Strategy:**
- Start with first cluster (proven model)
- Expand to emerging clusters
- Support organic growth
- No forced geographic expansion

**Completion Criteria:**
- ✅ Production platform live
- ✅ All security audits passed
- ✅ Zero critical bugs
- ✅ Merchant API operational
- ✅ Council governance active
- ✅ 1,000+ active users
- ✅ 100+ merchants accepting Stables

---

## **PHASE 4: MILESTONE 4 - ECOSYSTEM CRITICAL MASS**
**Trigger:** Production platform stable  
**Completion Criteria:** Self-sustaining circular economies

### **🌐 Cluster Expansion**

**Goal:** 5 thriving clusters with circular economies

**Cluster Examples:**
- Berlin (sBerlin pegged to sEUR)
- Lagos (sLagos pegged to sUSD)
- Buenos Aires (sBuenosAires pegged to sUSD)
- Singapore (sSingapore pegged to sUSD)
- Portland (sPortland pegged to sUSD)

**Each Cluster:**
- 100+ active users
- 20+ merchants
- Local currency circulating
- 500+ local transactions/week
- Self-sustaining community

### **📊 Ecosystem Metrics**

**Sufficient Shops Accepting Stables:**
- 100+ merchants across all clusters
- Diverse categories (food, retail, services)
- Geographic distribution
- Active payment processing

**Sufficient People Paying with Stables:**
- 1,000+ active users
- Daily transaction volume
- Cross-cluster payments
- Merchant-to-user circulation

**Circular Economy Indicators:**
- Money velocity (how fast money moves)
- User-to-merchant ratio (balanced)
- Repeat transactions (loyalty)
- Local currency adoption

**Completion Criteria:**
- ✅ 5 thriving clusters established
- ✅ 1,000+ active users
- ✅ 100+ merchants
- ✅ Circular economies proven
- ✅ Money velocity >2x/month
- ✅ Playbook refined and documented

---

## **PHASE 5: MILESTONE 5 - SPECULATOR/HOLDER ENGAGEMENT**
**Trigger:** Ecosystem critical mass achieved  
**Completion Criteria:** Active speculator market for xWiniwa

### **💰 xMinima Holder Strategy**

**The Key Insight:**
Speculators (xMinima holders) are essential for the system to function. They provide the leveraged positions that enable Stables minting.

**Speculator Value Proposition:**
- Leveraged exposure to Winiwa/MINIMA
- No liquidation risk (key innovation)
- Rebalancing mechanism protects position
- Potential for significant upside
- Participation in ecosystem growth

**Engagement Strategy:**

1. **Education Campaign**
   - Explain xWiniwa mechanics
   - Show risk/reward profile
   - Demonstrate no-liquidation benefit
   - Share success stories

2. **Incentive Structure**
   - Early adopter bonuses
   - Leaderboard recognition
   - Exclusive NFTs for top holders
   - Governance participation rights

3. **Community Building**
   - Dedicated speculator channels
   - Strategy sharing (non-financial advice)
   - Performance analytics
   - Peer learning

4. **Liquidity Provision**
   - Ensure sufficient xWiniwa liquidity
   - Enable easy entry/exit
   - Transparent pricing
   - Fair rebalancing mechanism

**Completion Criteria:**
- ✅ 500+ active xWiniwa holders
- ✅ $1M+ in leveraged positions
- ✅ Healthy liquidity (easy entry/exit)
- ✅ Rebalancing mechanism tested
- ✅ Speculator community active
- ✅ Sufficient backing for Stables minting

---

## **PHASE 6: MILESTONE 3 - DEDICATED HARDWARE DEVICE**
**Trigger:** Ecosystem mature, speculator market active  
**Completion Criteria:** Device launched and distributed

### **🔑 The Device**

**Vision:** Physical embodiment of financial sovereignty

**Technical Specifications:**
- MINIMA node on chip
- Offline transaction capability
- Secure element for key storage
- E-ink display for balance/transactions
- NFC for payments
- USB-C for charging/updates
- Open hardware design

**Development Process:**

1. **Hardware Design**
   - Partner with MINIMA team
   - Design secure chip integration
   - Prototype development
   - Security testing

2. **Manufacturing**
   - Select manufacturing partner
   - Quality control processes
   - Supply chain management
   - Scalable production

3. **Distribution Strategy**
   - Top questers (100+ points from testing)
   - Pre-orders (community)
   - Cluster champions
   - Merchant partners

**Device Features:**
- Full Stables wallet functionality
- Offline payment capability
- Merchant point-of-sale mode
- Hardware key storage
- Tamper-resistant design
- Long battery life (weeks)

**Completion Criteria:**
- ✅ Device designed and prototyped
- ✅ Security audit passed
- ✅ Manufacturing partner secured
- ✅ First batch produced (1,000 units)
- ✅ Distribution to top questers
- ✅ Public pre-orders open
- ✅ Positive user feedback

---

## **PHASE 7: MILESTONE 6 - COUNCIL TRANSITION**
**Trigger:** Ecosystem mature, device launched  
**Completion Criteria:** Complete asset cessation to Council

### **🏛️ Council Transition Framework**

**Objective:** Transfer all control from founding team to the Council

**Asset Cessation Process:**

#### **1. Identify All Assets**
- Smart contract ownership
- Treasury funds (if any)
- Intellectual property
- Social media accounts
- Domain names
- GitHub repositories
- Brand assets

#### **2. Council Structure Formalization**

**Council Composition:**
- Founding members (5 seats, term-limited)
- Elected representatives (10 seats, 2-year terms)
- Merit-based seats (5 seats, earned through contribution)
- Total: 20 Council members

**Council Powers:**
- Protocol parameter adjustments
- New currency approvals
- Oracle provider selection
- Merchant verification
- Treasury management
- Development priorities

**Council Limitations:**
- Cannot censor transactions
- Cannot access user funds
- Cannot modify core protocol logic (requires community vote)
- Cannot override fixed parameters

#### **3. Transition Timeline**

**Month 1-2: Preparation**
- Document all assets
- Formalize Council structure
- Create transition plan
- Community communication

**Month 3-4: Gradual Transfer**
- Transfer non-critical assets
- Test Council governance
- Establish voting mechanisms
- Train Council members

**Month 5-6: Final Transfer**
- Transfer smart contract ownership
- Transfer treasury (if any)
- Transfer social media accounts
- Final team withdrawal

**Post-Transition:**
- Founding team becomes advisors (no voting power)
- Council fully autonomous
- Community-driven development
- Transparent governance

#### **4. Handover Documentation**

**What the Council Receives:**
- All smart contract admin keys
- Treasury funds (if any)
- Social media accounts
- Domain names
- GitHub repositories
- Brand assets
- Technical documentation
- Operational playbooks

**What the Council Controls:**
- Protocol parameters (within bounds)
- New currency approvals
- Oracle provider selection
- Merchant verification
- Development funding
- Marketing budget
- Community initiatives

**What the Council CANNOT Control:**
- Core protocol logic (immutable)
- User funds (non-custodial)
- Individual transactions (censorship-resistant)
- Fixed parameters (merchant fees, etc.)

**Completion Criteria:**
- ✅ All assets documented
- ✅ Council structure formalized
- ✅ Transition plan approved
- ✅ All assets transferred
- ✅ Team holds zero control
- ✅ Council governance operational
- ✅ Community satisfied with transition

---

## **PHASE 8: MILESTONE 7 - GOVERNANCE FRAMEWORK LOCK**
**Trigger:** Council transition complete  
**Completion Criteria:** Clear governance framework established

### **⚖️ Governance Framework**

**Purpose:** Define what can change and what cannot

#### **FIXED PARAMETERS (Immutable - Set in Stone)**

**1. Merchant Listing Fees**
- Fee structure for merchant directory listing
- Set at launch, never changes
- Ensures predictability for businesses
- Prevents Council manipulation

**2. Core Protocol Logic**
- Non-custodial architecture
- Censorship resistance
- Smart contract core functions
- Collateralization mechanics

**3. User Rights**
- Self-custody always
- No transaction censorship
- Privacy protections
- Withdrawal rights

**4. Transparency Commitments**
- Open source code
- Public governance votes
- Transparent treasury
- Auditable transactions

**5. Council Limitations**
- Cannot access user funds
- Cannot censor transactions
- Cannot modify fixed parameters
- Cannot override community votes on core changes

#### **FLEXIBLE PARAMETERS (Council-Governed)**

**1. Transaction Fees**
- Can be adjusted within bounds (0.1% - 2%)
- Requires Council vote
- 7-day implementation delay
- Community notification required

**2. Collateralization Ratios**
- Can be adjusted within safe bounds (120% - 200%)
- Requires supermajority vote (66%)
- Risk assessment required
- Gradual implementation

**3. New Currency Approvals**
- Council approves new local currencies
- Community can propose
- Verification process
- Governance vote

**4. Oracle Provider Selection**
- Council selects oracle providers
- Multiple sources required (minimum 5)
- Performance monitoring
- Can replace underperforming oracles

**5. Merchant Verification Criteria**
- Council sets verification standards
- Community input required
- Transparent process
- Appeal mechanism

**6. Development Priorities**
- Council approves roadmap
- Community proposals considered
- Funding allocation
- Feature prioritization

**7. Treasury Management**
- Council manages treasury (if any)
- Transparent spending
- Community oversight
- Quarterly reports

#### **GOVERNANCE DECISION PROCESS**

**1. Proposal Submission**
- Anyone can propose
- Minimum discussion period (7 days)
- Community feedback

**2. Council Vote**
- Simple majority (>50%) for routine changes
- Supermajority (>66%) for critical changes
- Veto power for security issues
- Public voting records

**3. Implementation**
- 7-day delay for all changes
- Community notification
- Gradual rollout
- Monitoring period

**4. Emergency Actions**
- Security issues only
- Requires unanimous Council vote
- Immediate implementation
- Post-action community review

#### **COMMUNITY PARTICIPATION**

**Participation Levels:**

**Level 1: Users**
- Use the platform
- Provide feedback
- Vote in non-binding polls

**Level 2: Contributors**
- Create content
- Help onboard users
- Report bugs
- Earn recognition

**Level 3: Council Members**
- Vote on proposals
- Represent community
- Steward the protocol
- Term-limited service

**Progression:**
- User → Contributor (through participation)
- Contributor → Council (through election/merit)

**Completion Criteria:**
- ✅ Fixed parameters documented
- ✅ Flexible parameters defined
- ✅ Governance process established
- ✅ Community participation framework
- ✅ Emergency procedures defined
- ✅ Framework published and locked
- ✅ Community consensus achieved

---

## 🎯 SUCCESS METRICS SUMMARY

### **Phase 0: Technical Planning**
- ✅ Technical spec complete
- ✅ MINIMA team approved
- ✅ Community understands plan

### **Phase 1: Community Foundation**
- ✅ First cluster: 50+ users, 10+ merchants
- ✅ Local currency created
- ✅ 100+ local transactions/week

### **Phase 2: Testing Epochs (M1)**
- ✅ 4 testing epochs completed
- ✅ 500+ bugs fixed
- ✅ Security audit passed
- ✅ Community confidence >4.5/5

### **Phase 3: First Fully Functional Version (M2)**
- ✅ Production platform live
- ✅ 1,000+ active users
- ✅ 100+ merchants

### **Phase 4: Ecosystem Critical Mass (M4)**
- ✅ 5 thriving clusters
- ✅ Circular economies proven
- ✅ Money velocity >2x/month

### **Phase 5: Speculator Engagement (M5)**
- ✅ 500+ xWiniwa holders
- ✅ $1M+ in leveraged positions
- ✅ Healthy liquidity

### **Phase 6: Hardware Device (M3)**
- ✅ Device designed and produced
- ✅ First batch distributed
- ✅ Positive user feedback

### **Phase 7: Council Transition (M6)**
- ✅ All assets transferred
- ✅ Team holds zero control
- ✅ Council governance operational

### **Phase 8: Governance Framework (M7)**
- ✅ Fixed parameters locked
- ✅ Flexible parameters defined
- ✅ Framework published

---

## 🚀 IMMEDIATE NEXT STEPS

### **This Week: Technical Specification Completion**

**Day 1-2: Oracle Design**
- [ ] Research oracle solutions
- [ ] Design manipulation prevention
- [ ] Document approach
- [ ] Prepare questions for MINIMA team

**Day 3-4: Smart Contracts**
- [ ] Design core contracts
- [ ] Security considerations
- [ ] Local currency mechanism
- [ ] Document specifications

**Day 5-6: Governance Framework**
- [ ] Define fixed vs. flexible parameters
- [ ] Design Council structure
- [ ] Document transition plan
- [ ] Prepare for community review

**Day 7: Compile & Submit**
- [ ] Compile full technical spec
- [ ] Review for completeness
- [ ] Submit to MINIMA team
- [ ] Announce to community

---

## 📋 OPEN QUESTIONS FOR MINIMA TEAM

### **Oracle:**
1. Best oracle approach for MINIMA blockchain?
2. Existing oracle infrastructure we can leverage?
3. Security considerations for price feeds?
4. Performance implications of multiple sources?

### **Smart Contracts:**
1. Smart contract best practices on MINIMA?
2. Common vulnerabilities to avoid?
3. Gas/fee optimization strategies?
4. Testing framework recommendations?

### **Governance:**
1. Best practices for on-chain governance?
2. Multi-signature wallet recommendations?
3. Time-lock implementation?
4. Council voting mechanisms?

### **Hardware Device:**
1. MINIMA node on chip feasibility?
2. Hardware integration support?
3. Offline transaction capability?
4. Security requirements?

---

## 📝 NOTES

**Key Principles:**
- Security before growth
- Community before profit
- Transparency before convenience
- Sustainability before speed

**Critical Success Factors:**
- MINIMA team collaboration
- Community trust and engagement
- Speculator participation
- Merchant adoption
- Cluster formation
- Council transition

**Risk Mitigation:**
- Gradual rollout
- Extensive testing
- Security audits
- Community feedback
- Transparent governance
- Emergency procedures

---

**This roadmap is a living document. It will evolve based on community feedback, technical discoveries, and real-world results. The milestone-based approach ensures we never rush critical decisions.**

**Built on MINIMA** → https://minima.global
