# Stables Ambassador Program: The 16 Big Mac® Economy

This document defines the core architecture of the Stables Ambassador program, specifically the "16 Big Mac® economy."

## 🎯 1. Objective
Our primary objective is to build a professional, incentivized network of paid Ambassadors to support the growth of the Stables payment accepting merchant network. Ambassadors are the human layer that integrates merchants into the Stables economic loop and ensures a high-quality, trusted directory.

## 💎 2. The Ecosystem: Involved Parties

To ensure the system remains balanced and professional, we define five primary roles:

1.  **The Community (Users):** Citizens and customers who spend Stables at verified locations. They provide the fundamental demand for the merchant network.
2.  **The Merchants:** Business owners who accept Stables. They pay the 16 Big Mac® fee to be "Verified" and listed in the official directory.
3.  **The Independent Participant:** A merchant or future ambassador who registers directly through the app without an external pitch. They are anchored to the protocol via the **Universal Anchor**.
4.  **The Direct Ambassador (Active):** The participant who performs the actual onboarding or pitch for another merchant.
5.  **The Second Level Ambassador (Mentor):** The participant who successfully onboarded and trained a Direct Ambassador.
6.  **The Council & Treasury:** The autonomous heart of the protocol. It collects the anchor fees and arbitrage yield to fund community-voted growth.

---

## ⚖️ 3. Constraints
- **Fully Open:** We have a fully open structure where everyone can become an Ambassador.
- **Fair & Global:** All fees are pegged to the Big Mac Index to remain globally fair.
  Reference: [Big Mac Index by Country](https://worldpopulationreview.com/country-rankings/big-mac-index-by-country)

## 🛑 3. The Problem: Self-Onboarding Bypass
How do we make sure that the merchants don't have a financial incentive to onboard themselves and capture the Ambassador pay? 

In an open system, there is a risk that a merchant might try to bypass the Ambassador who pitched them to "self-capture" the onboarding reward.

## 💡 4. Our Solution: The 16 Big Mac® Economy
We solve this by ensuring the entry cost and the active reward are decoupled, and by making the Treasury the default mentor.

### **Economic Core:**
- **Universal Anchor Fee:** **16 Big Mac®** (Sunk cost for Independent Registration).
- **Mentored Registration Fee:** **15 Big Mac®** (1 Big Mac® Discount for being mentored by an Ambassador).
- **Active Reward:** **8 Big Mac®** (Fixed for the Direct Ambassador).
- **Mentor Reward:** **1 Big Mac®** (For the Second Level Ambassador).
- **Council Share:** **6-16 Big Mac®** (Standard: 6; plus any unclaimed mentor/premium shares).
- **Listing Duration:** The fee covers a **12-month registration**. Renewals follow the same economic logic.
- **Future Utility:** This same logic applies to merchant publicity campaigns, with a tiered split per 15-16 Big Mac® spent.

---

## 🏗️ 5. Scenario Breakdown

### **Scenario 1: Independent Registration (The Universal Anchor)**
This is the starting point for every participant. Whether you are an aspiring Ambassador or a local Merchant, choosing to join via a **Direct-to-Protocol Registration** (without an external pitch) makes you an **Independent Participant**.
- **Fee Paid:** **16 Big Mac®** (Standard Anchor Price).
- **On-chain Lookup:** The `mentor` field is empty (NULL), defaulting to the Universal Anchor.
- **Distribution:** 100% (16 Big Mac®) → **Council Treasury**.
- **Result:** The participant is now "Verified" and anchored to the protocol. They can now list their shop in the app and act as a Direct Ambassador for others.

### **Scenario 2: Mentored Registration (Direct Pitch)**
A Direct Ambassador (A) onboards a new merchant (B).
- **Fee Paid:** **15 Big Mac®** (Includes 1 Big Mac® Mentorship Discount).
- **Condition:** Ambassador A has no mentor (they are an Independent Participant).
- **Distribution:** 7 Big Mac® → **Council Treasury** and 8 Big Mac® → **Ambassador A**.
- **Result:** The merchant saves 1 Big Mac® compared to self-onboarding. Ambassador A earns the fixed active reward (8).

### **Scenario 3: Hub Registration (Deep Expansion)**
A Direct Ambassador (B) onboards a new merchant (C).
- **Fee Paid:** **15 Big Mac®** (Mentorship Discount).
- **Condition:** Ambassador B was themselves mentored by Ambassador A.
- **Distribution:** 6 Big Mac® → **Council Treasury**, 8 Big Mac® → **Ambassador B (Active)**, and 1 Big Mac® → **Ambassador A (Mentor)**.
- **Result:** The hub grows. Both the active worker and the trainer are rewarded.

---

### **🛡️ The Shield Principle (Neutrality)**
The economic model is designed so that bypassing a mentor provides **zero financial advantage**. Whether an Ambassador is independent (Scenario 2) or part of a hub (Scenario 3), their active reward for onboarding a new shop is **always exactly 8 Big Mac®**. The extra 1 Big Mac® (the second-level share) is never "captured" by the active worker; it simply defaults to the Council Treasury if no mentor exists.

---

## 🛠️ 6. The Ambassador's Service Lifecycle

The relationship between an Ambassador and a Merchant is not a one-time transaction; it is a professional partnership built on three pillars of service:

1.  **Phase 1: Expert Setup & Verification:**
    -   Walking the merchant through the 15 Big Mac® registration.
    -   Configuring the merchant's Minima node and Stables wallet.
    -   Ensuring the shop is correctly geolocated and categorized on the global map.
    -   Providing physical signage (stickers/QR codes) to signal "Stables Accepted Here."
2.  **Phase 2: Continued Technical Support:**
    -   Acting as the first point of contact for technical issues or ledger updates.
    -   Training staff on how to accept payments and handle refunds.
    -   Providing periodic health checks on the merchant's listing and node connectivity.
3.  **Phase 3: Marketing & Ads Campaign Management:**
    -   Helping the merchant launch protocol-wide publicity campaigns using the 8/1/6 split.
    -   Analyzing customer review data and responding to feedback.
    -   Strategizing on local promotions to increase Stables spending at the location.

---

## 📅 7. The Annual Renewal Cycle: Sustaining Value

To ensure merchants choose to maintain their listing with their original Ambassador (rather than going "independent" on renewal), the protocol enforces a persistent incentive:

-   **The Renewal Discount:** Merchants who renew via their Ambassador keep the **15 Big Mac®** mentored price.
-   **Service Continuity:** Moving to an independent listing (Universal Anchor) results in a **16 Big Mac®** fee and the loss of the dedicated Ambassador support layer.
-   **Long-term Hub Integrity:** The protocol recognizes the value of the trainer (Second Level Ambassador) by maintaining the 1 Big Mac® mentor share on all renewals, ensuring the original hub that grew the network is rewarded for its stability.

---

## 💻 8. Stables Platform: Supporting the Ambassador

The Stables platform is built to empower Ambassadors with professional-grade tools to manage their "Hub" like a business:

1.  **Ambassador Dashboard (CRM):** A specialized view in the app to track all mentored merchants, their status, renewal dates, and performance.
2.  **Merchant Communication Tools:** Integrated messaging to broadcast updates, tips, or promotion ideas to the entire hub.
3.  **Campaign Templates:** Pre-built marketing assets (posters, social media kits, and ad templates) that Ambassadors can customize for their local merchants.
4.  **Training Resources:** A library of educational content and "Pitch Decks" to help Ambassadors close more deals and train their mentored merchants effectively.

---

## 🌟 9. The Merchant's Choice: Why Stables? Why an Ambassador?

### **Why Stables?**
-   **Zero Middleman Fees:** Accept payments directly on-chain with no bank fees or card processor cuts.
-   **Global Professional Network:** Be visible to a growing world of Stables users looking for verified real-world utility.
-   **Full Sovereignty:** You own your node, your keys, and your customer relationships.

### **Why use an Ambassador?**
-   **Instant Discount:** Save 1 Big Mac® immediately compared to self-onboarding.
-   **Expert Deployment:** Avoid technical hurdles; get it right the first time with a dedicated professional.
-   **Peace of Mind:** Have a local human contact who is financially incentivized to see your business grow.

---

## ⚙️ 10. Technical Implementation: How the System Distinguishes

The Stables ledger tracks an optional `mentor` address for every listed participant. This `mentor` is set only during the very first listing (Scenario 1) and can never be changed.

- **Self-Onboarded Merchant**: The `mentor` field is NULL.
- **Mentored Merchant**: The `mentor` field is set to the Ambassador who performed the onboarding.

When an Ambassador (B) registers a new merchant (C), the code checks **B’s record**:
1. Does B have a mentor?
   - **Yes (A mentored B):** B is part of a Hub. Split is **8 to B, 1 to A, 6 to Council** (Total 15).
   - **No (B is independent):** B is solo. Split is **8 to B, 7 to Council** (The 1 mentor share reverts to Treasury. Total 15).
2. The active reward for B is **always 8 Big Mac®**. This fixed reward ensures B has no financial incentive to bypass their original mentor.

### **No-Cost Payment Acceptance**
Stables is built on open protocol technology. Any merchant can accept Stables payments immediately and without incurring any cost simply by generating a Minima address. Accepting payments is free and permissionless.

### **The Advantages of Being Listed**
Choosing to pay the 16 Big Mac® entry fee to be listed in the official Stables app provides critical advantages:
- **Visibility:** Featured on the global Stables map and in the merchant directory.
- **Trust & Verification:** Listing provides a "Verified" status, showing the merchant is part of the official community.
- **Discoverability:** Customers looking to spend Stables can find the merchant based on categories and geolocation.
- **Network Growth:** Access to local Ambassador support and future protocol-wide marketing campaigns.

### **Ambassadors as Specialized Merchants**
Ambassadors are themselves listed as a type of merchant within the app. This allows them to present their services and be found by other merchants based on geolocation and other criteria. A merchant can search for an Ambassador nearby to receive training, onboarding help, or technical support.

### **Side Letter Agreements**
The Stables protocol defines the standard on-chain distribution of fees. However, we anticipate that Ambassadors and Merchants may enter into "Side Letter Agreements" to share commissions.
- **On-chain Transparency:** These parameters can be agreed upon directly within the onboarding contract, making the kickback terms visible on-chain to anyone.
- **Private Flexibility:** Alternatively, these agreements can be made independently as a private second step outside the primary listing protocol.
While the protocol default is the 7/8/16 split, these side letters allow for bespoke commercial relationships while the 16 Big Mac® anchor always protects the Treasury's baseline.

### **Future Publicity Campaigns**
The mentorship logic established here is not limited to the initial onboarding. The same mechanism will apply to future publicity campaigns run by listed merchants. When a merchant pays to launch a network-wide promotion or campaign, the reward follows the hub model: 8 Big Mac® to the active Ambassador, 1 Big Mac® to the Mentor, and 7 Big Mac® to the Council Treasury.

### **On-chain Review & Rating System**
To ensure the quality of the Stables merchant network, the app includes a star review and comment system.
- **On-chain Verification:** Every review is tied to an on-chain transaction, proving that the reviewer is a true customer.
- **Anti-Spam Mechanism:** To maintain high-integrity feedback, a review is only published if the customer has spent a **minimum threshold amount** at the merchant's shop.
- **Ambassador Moderation:** Ambassadors play a key role in monitoring these reviews to support their mentored merchants.

---

## 💎 11. Council Treasury: The Autonomous Protocol Heart

The Stables Council Treasury is the protocol's economic engine, designed around the following core principles:

-   **Code-Based Ownership:** The treasury is owned by no one. It is fully governed by the protocol's code and rules to support the long-term growth of the ecosystem.
-   **Free Economic Agent:** The treasury acts as an autonomous economic agent. It actively seeks financial opportunities to grow its base, primarily through arbitrage opportunities across the network and linked markets.
-   **Budget Governance:** While the treasury is automated, its growth budget is allocated via community governance.
-   **Time-Weighted Voting:** Community votes on the budget are held periodically. Voting power is determined on a **time-weighted token holding basis**, rewarding those who have committed their "skin-in-the-game" to the protocol for the longest duration.

---

## 🎬 12. Summary
This framework demonstrates a "ruled by code" economy that rewards mentorship while protecting the treasury. It turns human competition into a collaborative cells-and-hubs structure where the treasury always grows.
