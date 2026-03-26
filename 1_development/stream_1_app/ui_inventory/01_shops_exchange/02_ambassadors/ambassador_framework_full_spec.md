# Stables Ambassador Program: The 16 Big Mac® Economy

This document defines the core architecture of the Stables Ambassador program, specifically the "16 Big Mac® economy."

## 🎯 1. Objective
Our primary objective is to build a professional, incentivized network of paid Ambassadors to support the growth of the Stables payment accepting merchant network. Ambassadors are the human layer that integrates merchants into the Stables economic loop and ensures a high-quality, trusted directory.

## 💎 2. The Ecosystem: Involved Parties

To ensure the system remains balanced and professional, we define five primary roles:

1.  **The Community (Users):** Citizens and customers who spend Stables at verified locations. They provide the fundamental demand for the merchant network.
2.  **The Merchants:** Business owners who accept Stables. They pay the 16 Big Mac® fee to be "Verified" and listed in the official directory.
3.  **The Direct Ambassador (Active):** The participant who performs the actual onboarding or pitch. They are the primary human layer of growth.
4.  **The Second Level Ambassador (Mentor):** The participant who successfully onboarded and trained a Direct Ambassador. They receive a reward for the performance of their "cells" (mentored hub).
5.  **The Council & Treasury:** The autonomous heart of the protocol. It collects the anchor fees and arbitrage yield to fund community-voted growth.

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
- **Entry Fee:** 16 Big Mac® is a sunk cost for everyone (Merchants and Ambassadors alike).
- **Onboarding Split:** 
    - 8 Big Mac® **Direct Ambassador** (in a mentored hub) or 9 Big Mac® (if direct)
    - 1 Big Mac® **Second Level Ambassador** Reward (if the direct one was themselves mentored)
    - 7 Big Mac® Council Share
- **Treasury Captures:** The Council Treasury captures **7, 8, or 16 Big Mac®** depending on the scenario.
- **Listing Duration:** The 16 Big Mac® entry fee covers a **12-month listing**. Renewals follow the same economic logic.
- **Future Utility:** This same logic applies to merchant publicity campaigns, with a **8/1/7 split** per 16 Big Mac® spent.

---

## 🏗️ 5. Scenario Breakdown

### **Scenario 1: The Universal Anchor (Self-Onboarding)**
This is the starting point for every participant. Whether you are an aspiring Ambassador or a local Merchant choosing to perform an **Independent Registration** without an external pitch, your first entry into the official directory is the **Universal Anchor**.
- **Action:** Merchant B completes an **Independent Registration** directly through the app.
- **On-chain Lookup:** The `mentor` field for B is empty (NULL).
- **Distribution:** 100% (16 Big Mac®) → **Council Treasury**.
- **Result:** B is now a "Verified" registered participant. By choosing to self-onboard, B has paid the full anchor fee to the Treasury, establishing the base value of the network. B can now act as an Ambassador for others.

### **Scenario 2: Standard Mentored Onboarding**
Ambassador A (Mentor) onboards a new merchant Shop B.
- **Action:** Shop B is registered by A.
- **On-chain Lookup:** B's mentor is set to A.
- **Distribution:** 7 Big Mac® → **Council Treasury** and 9 Big Mac® → **Ambassador A**.
- **Result:** A is rewarded for the pitch and support. Council gets 7.

### **Scenario 3: Hub Expansion (Mentor Reward)**
Merchant B (who was onboarded by A) now onboards Shop C.
- **Action:** Shop C is registered by B.
- **On-chain Lookup:** B has a mentor (A).
- **Distribution:** 7 Big Mac® → **Council Treasury**, 8 Big Mac® → **Merchant B (Direct Ambassador)**, and 1 Big Mac® → **Ambassador A (Second Level Ambassador)**.
- **Result:** Merchant B earns for their active work, and A earns for mentoring B. Council gets 7.

### **Scenario 4: Independent Onboarding (The Shield)**
Merchant B chooses to bypass Ambassador A and self-onboards to "go independent." Then B onboards Shop C.
- **Action:** Shop C is registered by B.
- **On-chain Lookup:** B has NO mentor (self-listed).
- **Distribution:** 8 Big Mac® → **Council Treasury** and 8 Big Mac® → **Merchant B (Direct Ambassador)**.
- **Result:** Merchant B still only earns 8 Big Mac®. The "unclaimed second-level share" reverts to the Council. This means B has zero financial benefit to bypassing A.

---

## ⚙️ 6. Technical Implementation: How the System Distinguishes

The Stables ledger tracks an optional `mentor` address for every listed participant. This `mentor` is set only during the very first listing (Scenario 1) and can never be changed.

- **Self-Onboarded Merchant**: The `mentor` field is NULL.
- **Mentored Merchant**: The `mentor` field is set to the Ambassador who performed the onboarding.

When a participant (B) onboards a new merchant (C), the code checks **B’s record**:
1. Does B have a mentor?
   - **Yes (A mentored B):** B is part of a Hub. Split is **8 to B, 1 to A, 7 to Council**.
   - **No (B is independent):** B is solo. Split is **8 to B, 8 to Council** (the mentor unit reverts to Treasury).
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

## 💎 7. Council Treasury: The Autonomous Protocol Heart

The Stables Council Treasury is the protocol's economic engine, designed around the following core principles:

- **Code-Based Ownership:** The treasury is owned by no one. It is fully governed by the protocol's code and rules to support the long-term growth of the ecosystem.
- **Free Economic Agent:** The treasury acts as an autonomous economic agent. It actively seeks financial opportunities to grow its base, primarily through arbitrage opportunities across the network and linked markets.
- **Budget Governance:** While the treasury is automated, its growth budget is allocated via community governance.
- **Time-Weighted Voting:** Community votes on the budget are held periodically. Voting power is determined on a **time-weighted token holding basis**, rewarding those who have committed their "skin-in-the-game" to the protocol for the longest duration.

---

## 🎬 8. Summary
This framework demonstrates a "ruled by code" economy that rewards mentorship while protecting the treasury. It turns human competition into a collaborative cells-and-hubs structure where the treasury always grows.
