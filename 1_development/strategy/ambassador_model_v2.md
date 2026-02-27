# Ambassador Model v2 - Redesigned

**Version**: 2.0  
**Date**: 2026-02-13  
**Status**: Development Draft  
**Purpose**: Fix the economic model to make sense

---

## 🚨 PROBLEMS WITH V1

### **Problem 1: Why Pay Ambassador?**
- Merchant can list themselves for free in the app
- Why would they pay ambassador $100?
- Ambassador adds no technical value
- Model doesn't make sense

### **Problem 2: Artificial Friction**
- Locking Merchant/Ambassador modes is unnecessary friction
- Everyone should be able to receive payments (Merchant mode = Receive)
- Everyone should be able to build their cluster (Ambassador mode)
- Modes should be open, not locked

### **Problem 3: QR Code Already Exists**
- QR code generator is just "Receive" functionality
- Every user already has this
- Not a special merchant feature

---

## ✅ THE SOLUTION: FREE LISTING + VALUE-BASED AMBASSADOR ROLE

### **Core Principle: Remove All Friction**

**Merchant Listing:**
- ❌ **OLD**: Pay $100 to get listed
- ✅ **NEW**: **FREE** self-service listing for everyone

**Merchant Mode:**
- ❌ **OLD**: Locked until listed by ambassador
- ✅ **NEW**: Just "Receive" with business profile (always available)

**Ambassador Mode:**
- ❌ **OLD**: Locked until certified
- ✅ **NEW**: Open to everyone who wants to build their cluster

---

## 🎯 REDESIGNED MODEL

### **1. FREE MERCHANT LISTING (Self-Service)**

**Anyone can list their business:**
```
User → Settings → "I Accept Stables"
     → Fill business info (name, category, location, hours)
     → Upload photo (optional)
     → Toggle "Show in Merchant Directory" ON
     → Listed immediately (FREE)
```

**No payment required. No ambassador needed. Zero friction.**

---

### **2. MERCHANT MODE = ENHANCED RECEIVE**

**Everyone has "Receive" functionality:**
- Generate payment QR code
- Set amount or leave variable
- Add description
- Share link

**Business Profile (optional enhancement):**
- Business name
- Category
- Location
- Operating hours
- Show in directory

**No separate "mode" - just enhanced profile settings.**

---

### **3. AMBASSADOR ROLE = CLUSTER BUILDER (Unpaid Initially)**

**What Ambassadors Actually Do:**

**NOT:**
- ❌ List merchants (merchants list themselves)
- ❌ Generate QR codes (everyone can do this)
- ❌ Technical services (app does this)

**YES:**
- ✅ **Recruit users** to join Stables
- ✅ **Onboard merchants** (teach them how to use app)
- ✅ **Build community** (organize meetups, events)
- ✅ **Create circulation** (establish daily use cases)
- ✅ **Evangelize** (word of mouth, local marketing)

**This is REAL value that can't be automated.**

---

## 💰 NEW REVENUE MODEL: PERFORMANCE-BASED

### **Ambassadors Earn Based on Cluster Success**

**Tier 1: Bronze Cluster**
- 50+ active users
- 10+ merchants
- 100+ tx/week
- **Reward**: $500 bonus (one-time)

**Tier 2: Silver Cluster**
- 100+ active users
- 20+ merchants
- 500+ tx/week
- Local currency deployed
- **Reward**: $1,500 bonus + Council nomination

**Tier 3: Gold Cluster**
- 200+ active users
- 50+ merchants
- 1,000+ tx/week
- Self-sustaining
- **Reward**: $3,000 bonus + Council seat + Hardware device

**Total Potential**: $5,000 for building a Gold cluster

---

### **Where Does Ambassador Funding Come From?**

**Option A: Transaction Fee Pool**
```
Every transaction: 0.1% fee
├─ 50% → r-Token holders (yield)
├─ 30% → Council treasury (development)
└─ 20% → Ambassador reward pool
```

**Option B: Council Treasury Allocation**
```
Council allocates budget for cluster growth
- $25,000 for first 5 Gold clusters
- $5,000 per cluster
- Funded by donations, NFT sales, or future revenue
```

**Option C: Hybrid**
```
Initial: Council treasury (bootstrap)
Long-term: Transaction fee pool (sustainable)
```

---

## 🎮 GAMIFICATION: CLUSTER CHALLENGE REMAINS

**The Competition:**
- First 5 clusters to reach Gold win
- Public leaderboard
- Milestone bonuses
- Recognition and status

**But Now:**
- Merchants list themselves (free, easy)
- Ambassadors focus on community building
- Rewards based on actual cluster success
- Economics make sense

---

## 📱 APP STRUCTURE SIMPLIFIED

### **No More "Modes" - Just Features**

**Main App:**
```
┌─────────────────────────────────┐
│  STABLES                    ≡   │
├─────────────────────────────────┤
│  Balance: 1,247.50 sUSD         │
├─────────────────────────────────┤
│  [Send]  [Receive]  [Merchants] │
├─────────────────────────────────┤
│  Recent Transactions            │
└─────────────────────────────────┘
```

**Settings → Profile:**
```
┌─────────────────────────────────┐
│  PROFILE SETTINGS               │
├─────────────────────────────────┤
│  □ I Accept Stables             │ ← Toggle ON to list as merchant
│                                 │
│  Business Name: ____________    │
│  Category: [Select]             │
│  Location: [Auto-detect]        │
│  Hours: [Set]                   │
│  Photo: [Upload]                │
│                                 │
│  □ Show in Merchant Directory   │
├─────────────────────────────────┤
│  □ I'm Building a Cluster       │ ← Toggle ON for ambassador features
│                                 │
│  Cluster: Berlin                │
│  Dashboard: [View]              │
│  Leaderboard: [View]            │
└─────────────────────────────────┘
```

**No locked modes. Just opt-in features.**

---

## 🔑 WHAT AMBASSADORS ACTUALLY PROVIDE

### **Real Value That Justifies Rewards:**

**1. User Acquisition**
- Recruit 200+ users (can't automate this)
- Word of mouth marketing
- Local events and meetups
- Community building

**2. Merchant Onboarding**
- Teach merchants how to use app
- Help set up business profiles
- Explain benefits
- Provide support

**3. Circulation Creation**
- Establish daily use cases (coffee, lunch)
- Create merchant-to-merchant loops
- Organize community spending
- Build local economy

**4. Community Management**
- Local Telegram/WhatsApp group
- Answer questions
- Resolve issues
- Maintain engagement

**5. Local Marketing**
- Flyers, posters, stickers
- Social media content
- Local press outreach
- Word of mouth

**This is REAL work that deserves compensation.**

---

## 📊 ECONOMICS COMPARISON

### **V1 Model (Broken):**
```
Ambassador lists 50 merchants × $50 = $2,500
Problem: Why would merchants pay when listing is free?
Answer: They wouldn't. Model broken.
```

### **V2 Model (Fixed):**
```
Ambassador builds Gold cluster:
- Recruits 200+ users
- Onboards 50+ merchants (teaches them)
- Creates circulation (1,000+ tx/week)
- Earns: $5,000 (performance-based)

Merchants list themselves: FREE
Users join: FREE
Ambassador earns: Based on actual value created
```

---

## 🚀 IMPLEMENTATION CHANGES

### **What Changes:**

**1. Remove Shop Listing Fee**
- Merchants list themselves for free
- Self-service in app settings
- No payment required

**2. Remove Mode Locking**
- Everyone can receive payments (business profile optional)
- Everyone can build clusters (opt-in)
- No artificial barriers

**3. Add Performance-Based Rewards**
- Bronze: $500
- Silver: $1,500
- Gold: $3,000
- Based on cluster metrics

**4. Simplify App**
- No mode switching
- Just opt-in features
- Cleaner UX

### **What Stays:**

**1. Cluster Challenge**
- First 5 to Gold win
- Public leaderboard
- Competition drives growth

**2. Ambassador Role**
- Community builders
- Cluster champions
- Council members (at Gold)

**3. Merchant Directory**
- Free listings
- Filter by category
- Map view
- Ratings

**4. QR Code Generator**
- Part of "Receive"
- Everyone has it
- Business profile enhances it

---

## 💡 WHY THIS WORKS

### **1. Removes Friction**
- Anyone can list their business (free)
- Anyone can receive payments (core feature)
- Anyone can build a cluster (opt-in)

### **2. Aligns Incentives**
- Ambassadors earn based on actual cluster success
- Not based on artificial gatekeeping
- Rewards real community building

### **3. Scales Globally**
- Clusters are just the start
- Eventually covers whole planet
- No artificial limitations

### **4. Makes Economic Sense**
- Merchants don't pay for something they can do themselves
- Ambassadors get paid for real value (community building)
- Council funds sustainable growth

### **5. Fair and Transparent**
- Clear metrics (users, merchants, transactions)
- Public leaderboard
- Performance-based rewards
- No gatekeeping

---

## 🎯 AMBASSADOR JOURNEY (REVISED)

**Week 1-2: Seed**
- Recruit 10-15 founding circle
- Teach them to use app
- Help 3-5 merchants set up profiles (free)
- First transactions

**Week 3-6: Loop**
- Recruit 50+ users
- Onboard 10+ merchants
- Establish daily use case
- Create circulation loops
- **Earn Bronze**: $500

**Week 7-12: Network**
- Recruit 100+ users
- Onboard 20+ merchants
- Launch local currency
- 500+ tx/week
- **Earn Silver**: $1,500 (total: $2,000)

**Week 13-24: Gold**
- Recruit 200+ users
- Onboard 50+ merchants
- Self-sustaining cluster
- 1,000+ tx/week
- **Earn Gold**: $3,000 (total: $5,000)
- **Plus**: Council seat + Hardware device

---

## 📋 SUMMARY

**OLD MODEL:**
- Merchant pays $100 to ambassador for listing
- Problem: Why pay when you can list yourself?
- Broken economics

**NEW MODEL:**
- Merchant lists themselves (FREE)
- Ambassador builds community (REAL VALUE)
- Ambassador earns based on cluster success ($5,000 for Gold)
- Economics make sense

**Key Changes:**
1. ✅ Free merchant listing (self-service)
2. ✅ No mode locking (remove friction)
3. ✅ Performance-based ambassador rewards
4. ✅ QR code = part of Receive (everyone has it)
5. ✅ Simplified app (no mode switching)

**Built on MINIMA** → https://minima.global
