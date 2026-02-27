# Ambassador Program Toolkit

**Version**: 1.0  
**Date**: 2026-02-13  
**Status**: Development Draft  
**Purpose**: Complete toolkit for ambassadors to create and manage clusters

---

## 🎯 AMBASSADOR PROGRAM OVERVIEW

**What is an Ambassador?**
- Local cluster champion who builds Stables economy in their area
- Earns commission from merchant onboarding
- Gets tools to manage their cluster
- Represents their cluster in the Council (if qualified)

**Revenue Model:**
```
Shop Listing Fee: $100
├─ $50 → Council Treasury (platform sustainability)
└─ $50 → Ambassador (cluster builder incentive)
```

**Ambassador Benefits:**
- 50% commission on every shop listing
- Priority hardware device access
- Council nomination (Silver+ clusters)
- Guaranteed Council seat (Gold clusters)
- Recognition and featured profiles
- Direct support from core team

---

## 🛠️ AMBASSADOR TOOLKIT (What We Need to Provide)

### **1. MERCHANT ONBOARDING SYSTEM**

#### **A. Shop Listing Portal (In the App - Ambassador Mode)**

**How to Access:**
- Open Stables MiniDapp
- Toggle to "Ambassador Mode"
- Tap "Add Merchant" button

**Merchant Information Form:**
- Business name
- Category (coffee, food, services, retail, etc.)
- Address (with map pin - uses device location)
- Contact info (phone, email)
- Operating hours
- Photo upload (camera or gallery)
- Stables payment address (auto-generated or merchant's existing address)
  
**Payment Flow:**
```
Ambassador → Opens app → Ambassador Mode → "Add Merchant"
           → Fills merchant info
           → Reviews listing preview
           → Pays 100 Stables (any currency: sUSD/sEUR/local)
           → Smart contract auto-splits:
              - 50 Stables → Council Treasury
              - 50 Stables → Ambassador's wallet (instant)
           → Merchant listing goes LIVE immediately
           → Merchant gets notification to install app
           → Ambassador sees confirmation in dashboard
```

**Smart Contract Logic:**
```solidity
function listMerchant(
    string merchantName,
    string category,
    string location,
    address merchantPaymentAddress
) payable {
    require(msg.value == 100 * STABLE_UNIT, "Must pay 100 Stables");
    
    // Split payment
    councilTreasury.transfer(50 * STABLE_UNIT);
    ambassadors[msg.sender].transfer(50 * STABLE_UNIT);
    
    // Create listing
    merchants[merchantId] = Merchant({
        name: merchantName,
        category: category,
        location: location,
        paymentAddress: merchantPaymentAddress,
        listedBy: msg.sender,
        listedAt: block.timestamp,
        verified: false
    });
    
    // Track ambassador stats
    ambassadorStats[msg.sender].merchantsListed++;
    ambassadorStats[msg.sender].totalEarnings += 50 * STABLE_UNIT;
    
    emit MerchantListed(merchantId, msg.sender);
}
```

---

#### **B. QR Code Generator**

**Purpose**: Generate payment QR codes for merchants instantly

**Features:**
- **Merchant selects from their dashboard**:
  - Amount (fixed or variable)
  - Currency (sUSD, sEUR, sCAD, or local currency)
  - Description (optional)
  
- **QR Code generated**:
  - Contains: merchant address, amount, currency, description
  - Downloadable as PNG (high-res for printing)
  - Printable template (A4 size with "Pay Here in Stables" branding)
  - Shareable link

**Example QR Code Data:**
```json
{
  "merchant": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amount": 5.00,
  "currency": "sUSD",
  "description": "Coffee purchase",
  "merchantName": "Berlin Coffee Co."
}
```

**Templates Provided:**
- **Counter Display** (10cm x 10cm QR code)
- **Table Tent** (folded A5 with QR code)
- **Window Sticker** (A4 with "We Accept Stables" + QR)
- **Receipt Footer** (small QR for printed receipts)

---

#### **C. Merchant Verification System**

**Why Verification?**
- Prevent fake listings
- Ensure quality
- Build trust
- Protect ambassadors from scams

**Verification Process:**

**Level 1: Auto-Verified (Instant)**
- Ambassador lists merchant
- Merchant appears in app immediately
- Tagged as "New Listing"
- Ambassador vouches for legitimacy

**Level 2: Community-Verified (7 days)**
- 3+ users make successful payments
- Users can rate merchant (1-5 stars)
- Merchant gets "Verified" badge
- Appears higher in search results

**Level 3: Council-Verified (Manual)**
- Ambassador or community requests verification
- Council member physically visits (optional)
- Council votes to verify
- Merchant gets "Council Verified" badge
- Featured in marketing materials

**Fraud Protection:**
- If merchant is reported as fake/closed:
  - Listing removed
  - Ambassador loses commission for that listing
  - Ambassador gets warning (3 strikes = suspended)
  - Users who paid get refund from ambassador's bond

**Ambassador Bond:**
- Ambassadors deposit $500 bond (in Stables)
- Used to cover fraudulent listings
- Returned when ambassador reaches Gold status
- Incentivizes quality over quantity

---

### **2. AMBASSADOR DASHBOARD**

#### **A. Cluster Metrics (Real-Time)**

**Overview Panel:**
```
Berlin Cluster Dashboard
Ambassador: Anna Schmidt

Cluster Status: 🥈 Silver
Progress to Gold: ████████░░ 78%

Users: 127 active (↑12 this week)
Merchants: 23 verified (↑2 this week)
Transactions: 847/week (↑156 this week)
Money Velocity: 2.3x/month

Local Currency: sBerlin (deployed)
Your Earnings: $1,150 (23 merchants × $50)
```

**Detailed Metrics:**
- **User Growth Chart** (daily/weekly/monthly)
- **Transaction Volume** (by day, by merchant category)
- **Top Merchants** (by transaction count)
- **Top Users** (by transaction count)
- **Circulation Loops** (money moving between users/merchants)
- **Geographic Heatmap** (where users/merchants are located)

---

#### **B. Merchant Management**

**My Merchants List:**
```
Merchant Name       | Category  | Listed   | Tx/Week | Status
--------------------|-----------|----------|---------|------------------
Berlin Coffee Co.   | Coffee    | Jan 15   | 47      | ✓ Verified
Hans Barber Shop    | Services  | Jan 18   | 23      | ✓ Verified
Lisa Freelance      | Services  | Jan 22   | 31      | ✓ Verified
Tech Repair Berlin  | Services  | Feb 1    | 12      | ⏳ Pending (4 days)
Bakery Schmidt      | Food      | Feb 5    | 8       | 🆕 New Listing
```

**Actions:**
- **View Details** (merchant info, transaction history)
- **Edit Listing** (update info, hours, photo)
- **Generate QR Code** (new QR for merchant)
- **Request Verification** (submit for Council review)
- **Remove Listing** (if merchant closed/requested)

---

#### **C. Earnings Tracker**

**Earnings Summary:**
```
Total Earnings: $1,150
├─ Merchant Listings: $1,150 (23 merchants × $50)
├─ Bonuses: $200 (Silver status bonus)
└─ Pending: $100 (2 merchants pending verification)

Withdrawal Options:
- Keep in Stables (earn yield in r-Tokens)
- Convert to local currency
- Withdraw to bank (future feature)
```

**Earnings History:**
```
Date       | Merchant Listed      | Amount | Status
-----------|----------------------|--------|----------
Feb 5      | Bakery Schmidt       | $50    | ✓ Paid
Feb 1      | Tech Repair Berlin   | $50    | ✓ Paid
Jan 22     | Lisa Freelance       | $50    | ✓ Paid
Jan 18     | Hans Barber Shop     | $50    | ✓ Paid
Jan 15     | Berlin Coffee Co.    | $50    | ✓ Paid
```

---

#### **D. Cluster Leaderboard**

**Global Cluster Rankings:**
```
Rank | Cluster        | Ambassador      | Users | Merchants | Tx/Week | Status
-----|----------------|-----------------|-------|-----------|---------|--------
1    | Berlin         | Anna Schmidt    | 127   | 23        | 847     | 🥈 Silver
2    | Lagos          | Chidi Okafor    | 89    | 18        | 612     | 🥉 Bronze
3    | Buenos Aires   | Maria Lopez     | 76    | 15        | 423     | 🥉 Bronze
4    | Singapore      | Wei Chen        | 64    | 12        | 289     | 🥉 Bronze
5    | Portland       | Sarah Johnson   | 52    | 11        | 156     | 🥉 Bronze
```

**Ambassador Leaderboard:**
```
Top Ambassadors This Month
1. Anna Schmidt (Berlin) - 23 merchants, $1,150 earned
2. Chidi Okafor (Lagos) - 18 merchants, $900 earned
3. Maria Lopez (Buenos Aires) - 15 merchants, $750 earned
```

---

### **3. MERCHANT TOOLS (What Merchants Get)**

#### **A. Merchant Mode (In the App)**

**How to Access:**
- Merchant installs Stables MiniDapp
- Toggles to "Merchant Mode" in app
- Unlocked when listed by ambassador

**Features:**
- **Payment Request Generator**
  - Enter amount
  - Select currency (sUSD, sEUR, sCAD, or local)
  - Add description (optional)
  - Generate QR code instantly
  
- **Transaction History**
  - Date, amount, customer (pseudonymous)
  - Filter by date, currency
  - Real-time updates
  
- **Earnings Summary**
  - Total received (by currency)
  - Average transaction size
  - Busiest days/times
  - Charts and graphs
  
- **QR Code Library**
  - Save favorite QR codes
  - Generate printable templates
  - Share via link or image

---

#### **B. Point-of-Sale (POS) Integration**

**Simple POS Flow:**
```
Customer: "I'll pay in Stables"
Merchant: Opens dashboard → Enters amount → Shows QR code
Customer: Scans QR → Confirms payment
Merchant: Sees instant confirmation → Transaction complete
```

**Advanced POS (Future):**
- Tablet app for merchants
- Inventory integration
- Receipt printing
- Multi-currency support
- Staff accounts

---

### **4. AMBASSADOR ONBOARDING FLOW**

#### **Step 1: Application**

**Ambassador applies:**
- Name, location, contact info
- Why do you want to be an ambassador?
- Do you have merchant connections?
- Commit to listing 10+ merchants in 3 months?

**Review:**
- Auto-approved if cluster doesn't exist yet
- Manual review if cluster already has ambassador
- Can have multiple ambassadors per cluster (they compete)

---

#### **Step 2: Training**

**Ambassador Training Module:**
1. **Watch video**: "How to Build a Cluster" (10 min)
2. **Read playbook**: Spark-Start Strategy (30 min)
3. **Quiz**: 10 questions on cluster building (must pass 80%)
4. **Practice**: List a test merchant (sandbox mode)

**Completion:**
- Ambassador gets certified
- Receives ambassador badge (NFT)
- Dashboard access unlocked

---

#### **Step 3: Bond Deposit**

**Ambassador deposits $500 bond:**
- Protects against fraudulent listings
- Returned at Gold status
- Can be paid in installments ($100 upfront, $100/month for 4 months)

**Alternative:**
- Waived for cluster champions from testing epochs
- Waived for Council members
- Reduced to $250 for early adopters

---

#### **Step 4: First Merchant**

**Ambassador lists first merchant:**
- Pays $100 (earns $50 immediately)
- Merchant goes live
- Ambassador dashboard activated
- Cluster officially started

---

### **5. AMBASSADOR SUPPORT TOOLS**

#### **A. Merchant Pitch Kit**

**Provided to ambassadors:**

**1. One-Pager (Printable PDF)**
- "Accept Stables at Your Business"
- Benefits: Instant payments, no fees, new customers
- How it works: 3 simple steps
- QR code to sign up

**2. Pitch Script**
```
"Hi [Merchant Name], I'm [Ambassador Name] with Stables. 

We're building a local payment network in [City]. 
I already have [X] people ready to spend money at businesses 
that accept Stables.

Benefits for you:
- Get paid instantly (no waiting days for bank transfers)
- Zero transaction fees (keep 100% of your money)
- Attract new customers (our community supports local businesses)

It costs $100 to get listed in our app, which gives you:
- Your business featured to all Stables users in [City]
- QR code for easy payments
- Dashboard to track earnings
- Support from our team

Want to try it? I can get you set up in 10 minutes."
```

**3. FAQ Document**
- What is Stables?
- How do I get paid?
- What if I want to convert to regular money?
- What are the fees?
- Is it legal?
- What if I have technical issues?

---

#### **B. Community Building Guide**

**How to Build Your Cluster:**

**Week 1-2: The Seed**
- Recruit 10-15 founding circle members
- List 3-5 easiest merchants (coffee, freelancers)
- Organize first transactions
- Create local Telegram/WhatsApp group

**Week 3-6: The Loop**
- Expand to 50 users
- List 10+ merchants
- Establish daily use case (morning coffee, lunch, etc.)
- Create circulation loops (merchants spending their earnings)

**Week 7+: The Network**
- Reach 100+ users
- List 20+ merchants
- Launch local currency
- Achieve Bronze/Silver/Gold status

---

#### **C. Marketing Templates**

**Social Media Templates:**
- Instagram posts (editable Canva templates)
- Facebook event pages
- X/Twitter threads
- Telegram announcements

**Physical Materials:**
- Flyers (A5, printable)
- Posters (A4, for merchant windows)
- Business cards (ambassador contact info)
- Stickers ("We Accept Stables")

**Content Examples:**
- "Meet [Merchant Name] - Now Accepting Stables!"
- "5 Reasons to Use Stables in [City]"
- "[City] Cluster Update: 50 Users, 10 Merchants!"

---

### **6. TECHNICAL IMPLEMENTATION**

#### **A. Everything in the MiniDapp**

> [!IMPORTANT]
> **Platform**: MiniDapp only (NO website, NO separate web portal)
> 
> All ambassador tools, merchant tools, and user features are integrated into the **Stables MiniDapp**.

**Tech Stack:**
- Platform: Minima MiniDapp
- Frontend: HTML/CSS/JavaScript (MiniDapp framework)
- Backend: Minima blockchain + smart contracts
- Storage: Local (MiniDapp) + on-chain (transactions, listings)
- Smart Contracts: Minima Script (payment splitting, verification)

**App Sections:**
1. **User Mode** (default) - Send, receive, pay merchants
2. **Merchant Mode** (toggle) - Accept payments, view earnings, QR codes
3. **Ambassador Mode** (toggle) - List merchants, dashboard, earnings
4. **Council Mode** (toggle, if member) - Governance, verification, treasury

---

#### **B. App Navigation Structure**

**Main Screen (User Mode):**
```
┌─────────────────────────────────┐
│  STABLES                    ≡   │ ← Menu (switch modes)
├─────────────────────────────────┤
│  Balance: 1,247.50 sUSD         │
│  ≈ $1,247.50                    │
├─────────────────────────────────┤
│  [Send]  [Receive]  [Merchants] │
├─────────────────────────────────┤
│  Recent Transactions            │
│  • Coffee - 5.00 sUSD           │
│  • Received - 50.00 sUSD        │
│  • Lunch - 12.50 sUSD           │
└─────────────────────────────────┘
```

**Menu (Mode Switcher):**
```
┌─────────────────────────────────┐
│  👤 User Mode          [Active] │
│  🏪 Merchant Mode               │ ← Unlocked when listed
│  🌟 Ambassador Mode             │ ← Unlocked when certified
│  🏛️ Council Mode                │ ← Unlocked when elected
├─────────────────────────────────┤
│  Settings                       │
│  Help & Support                 │
│  About                          │
└─────────────────────────────────┘
```

**Ambassador Mode Screen:**
```
┌─────────────────────────────────┐
│  AMBASSADOR MODE           ≡    │
├─────────────────────────────────┤
│  Berlin Cluster - 🥈 Silver     │
│  Progress to Gold: ████░░ 78%   │
├─────────────────────────────────┤
│  Users: 127  Merchants: 23      │
│  Tx/Week: 847  Earnings: $1,150 │
├─────────────────────────────────┤
│  [Add Merchant]                 │
├─────────────────────────────────┤
│  My Merchants (23)              │
│  • Berlin Coffee Co. ✓          │
│  • Hans Barber Shop ✓           │
│  • Lisa Freelance ✓             │
│                                 │
│  [Dashboard] [Leaderboard]      │
└─────────────────────────────────┘
```

**Merchant Mode Screen:**
```
┌─────────────────────────────────┐
│  MERCHANT MODE             ≡    │
├─────────────────────────────────┤
│  Berlin Coffee Co.              │
│  Today's Earnings: 235.50 sUSD  │
├─────────────────────────────────┤
│  [Create Payment Request]       │
├─────────────────────────────────┤
│  Quick Amounts:                 │
│  [5.00] [10.00] [Custom]        │
├─────────────────────────────────┤
│  Recent Payments                │
│  • 5.00 sUSD - 2 min ago        │
│  • 7.50 sUSD - 15 min ago       │
│  • 5.00 sUSD - 23 min ago       │
│                                 │
│  [QR Codes] [History]           │
└─────────────────────────────────┘
```

---

#### **C. Smart Contract Functions**

**Core Functions:**

```javascript
// List new merchant (ambassador pays 100 Stables)
listMerchant(merchantData) → splits payment → creates listing → unlocks merchant mode

// Verify merchant (community or Council)
verifyMerchant(merchantId) → updates status → awards badge

// Remove merchant (ambassador or Council)
removeMerchant(merchantId) → refunds if fraudulent → updates stats

// Withdraw earnings (ambassador)
withdrawEarnings(amount) → transfers from contract → updates balance

// Track transaction (merchant receives payment)
recordTransaction(merchantId, amount) → updates metrics → awards points

// Mode unlocking
unlockMerchantMode(address) → called when merchant listed
unlockAmbassadorMode(address) → called when ambassador certified
unlockCouncilMode(address) → called when elected to Council

// Access control
isMerchant(address) → returns true if merchant mode unlocked
isAmbassador(address) → returns true if ambassador certified
isCouncilMember(address) → returns true if Council member
```

---

#### **D. Merchant Directory (In User Mode)**

**Access:**
- User Mode → Tap "Merchants" button
- Shows merchants in your cluster (based on location)
- Auto-detects cluster from device location

**Directory View:**
```
┌─────────────────────────────────┐
│  MERCHANTS NEAR YOU        🔍   │
│  Berlin Cluster                 │
├─────────────────────────────────┤
│  [All] [Coffee] [Food] [More]   │
├─────────────────────────────────┤
│  ☕ Berlin Coffee Co. ✓          │
│  0.3 km • Open now              │
│  ⭐⭐⭐⭐⭐ (47 payments)          │
│                                 │
│  💇 Hans Barber Shop ✓          │
│  0.5 km • Closes at 18:00       │
│  ⭐⭐⭐⭐⭐ (23 payments)          │
│                                 │
│  💻 Lisa Freelance ✓            │
│  0.8 km • Available             │
│  ⭐⭐⭐⭐⭐ (31 payments)          │
├─────────────────────────────────┤
│  [List View] [Map View]         │
└─────────────────────────────────┘
```

**Features:**
- Filter by category (coffee, food, services, retail)
- Sort by distance, rating, verified status
- Map view (shows all merchants on map)
- Tap merchant → Details (hours, address, description, QR code)
- Navigate button (opens device maps app)
- Pay button (generates payment to merchant)

---

### **7. REVENUE MODEL BREAKDOWN**

#### **Ambassador Economics**

**Scenario: Successful Ambassador (Gold Cluster)**

**Merchants Listed:** 50
**Earnings:** 50 × $50 = **$2,500**

**Bonuses:**
- Silver status: $200
- Gold status: $500
- Top ambassador: $300

**Total Earnings:** $3,500

**Time Investment:**
- 6 months to Gold
- ~10 hours/week average
- ~260 hours total

**Hourly Rate:** $3,500 / 260 = **$13.46/hour**

**Plus Non-Monetary Benefits:**
- Council seat (governance power)
- Priority hardware device
- Recognition and status
- Community impact

---

#### **Council Economics**

**Revenue from Shop Listings:**

**5 Gold Clusters × 50 merchants = 250 merchants**
**250 × $50 = $12,500 to Council Treasury**

**Use of Funds:**
- Platform development: 40% ($5,000)
- Security audits: 20% ($2,500)
- Marketing: 20% ($2,500)
- Community events: 10% ($1,250)
- Reserve: 10% ($1,250)

**Transparency:**
- All spending publicly tracked
- Quarterly reports
- Community vote on major expenses

---

### **8. FRAUD PREVENTION**

#### **Ambassador Safeguards**

**1. Bond Requirement**
- $500 deposit (returned at Gold)
- Covers fraudulent listings
- Incentivizes quality

**2. Strike System**
- 1st fake listing: Warning
- 2nd fake listing: $250 penalty from bond
- 3rd fake listing: Suspended, bond forfeited

**3. Verification Requirements**
- Community verification (3+ successful payments)
- Council verification (optional, for featured merchants)
- Photo proof (storefront photo required)

**4. Transaction Monitoring**
- Merchants with 0 transactions after 30 days: Flagged
- Ambassador contacted to verify
- Listing removed if merchant closed

---

#### **Merchant Safeguards**

**1. Listing Ownership**
- Only ambassador who listed can edit
- Merchant can request removal
- Council can remove if fraudulent

**2. Payment Protection**
- Payments go directly to merchant wallet
- No intermediary holding funds
- Instant settlement

**3. Dispute Resolution**
- User reports issue → Ambassador investigates
- If unresolved → Council arbitration
- Merchant can appeal

---

## 🎯 SUMMARY: WHAT AMBASSADORS GET

### **Tools:**
1. ✅ **Shop Listing Portal** - Add merchants, earn $50/listing
2. ✅ **QR Code Generator** - Instant payment QR codes for merchants
3. ✅ **Ambassador Dashboard** - Real-time cluster metrics, earnings, leaderboard
4. ✅ **Merchant Management** - Edit, verify, track all your merchants
5. ✅ **Marketing Templates** - Social media, flyers, posters
6. ✅ **Pitch Kit** - Scripts, one-pagers, FAQs
7. ✅ **Community Guide** - Step-by-step cluster building playbook
8. ✅ **Support System** - Videos, docs, direct team contact

### **Incentives:**
1. ✅ **50% Commission** - $50 per merchant listing
2. ✅ **Status Bonuses** - $200 (Silver), $500 (Gold)
3. ✅ **Council Seat** - Governance power at Gold status
4. ✅ **Hardware Device** - Priority access for top ambassadors
5. ✅ **Recognition** - Featured profiles, case studies
6. ✅ **Community** - Network of ambassadors globally

### **Support:**
1. ✅ **Training** - Videos, playbook, quiz
2. ✅ **Resources** - Templates, scripts, guides
3. ✅ **Direct Help** - Team support, ambassador community
4. ✅ **Playbook** - Proven spark-start strategy

---

**This ambassador program turns cluster building from a volunteer effort into a paid profession. Ambassadors earn real money while building their local economy, and the Council gets sustainable revenue to fund platform development.**

**Built on MINIMA** → https://minima.global
