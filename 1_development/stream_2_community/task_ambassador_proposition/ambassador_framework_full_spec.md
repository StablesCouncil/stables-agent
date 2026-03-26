# Stables Ambassador Program: The 16 Big Mac® Economy

This document defines the core architecture of the Stables Ambassador program, specifically the "16 Big Mac® economy."

## 🎯 1. Objective
Our primary objective is to build a professional, incentivized network of paid Ambassadors to support the growth of the Stables payment accepting merchant network. Ambassadors are the human layer that integrates merchants into the Stables economic loop and ensures a high-quality, trusted directory.

## ⚖️ 2. Constraints
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
    - 8 Big Mac® Active Onboarder (in a mentored hub) or 9 Big Mac® (if direct)
    - 1 Big Mac® Mentor Reward (if the onboarder was themselves mentored)
    - 7 Big Mac® Council Share
- **Treasury Captures:** The Council Treasury captures **7, 8, or 16 Big Mac®** depending on the scenario.
- **Listing Duration:** The 16 Big Mac® entry fee covers a **12-month listing**. Renewals follow the same economic logic.
- **Future Utility:** This same logic applies to merchant publicity campaigns, with a **8/1/7 split** per 16 Big Mac® spent.

---

## 🏗️ 5. Technical Implementation: How the System Distinguishes

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

## 📋 6. Scenario Breakdown

### Scenario 1: The First Entry (The Anchor)
Whether an aspiring Ambassador or a local Merchant, everyone pays the full 16 Big Mac® to be listed for the first time.
- **Action:** User B lists themselves.
- **On-chain Lookup:** B has no mentor yet.
- **Distribution:** 100% (16 Big Mac®) → **Council Treasury**.
- **Result:** B is now listed and can act as an Ambassador for others. Treasury gets the full anchor fee.

### Scenario 2: Standard Mentored Onboarding
Ambassador A (Mentor) onboards a new merchant Shop B.
- **Action:** Shop B is listed by A.
- **On-chain Lookup:** B's mentor is set to A.
- **Distribution:** 7 Big Mac® → **Council Treasury** and 9 Big Mac® → **Ambassador A**.
- **Result:** A is rewarded for the pitch and support. Council gets 7.

### Scenario 3: Hub Expansion (Mentor Reward)
Merchant B (who was onboarded by A) now onboards Shop C.
- **Action:** Shop C is listed by B.
- **On-chain Lookup:** B has a mentor (A).
- **Distribution:** 7 Big Mac® → **Council Treasury**, 8 Big Mac® → **Merchant B (Active)**, and 1 Big Mac® → **Ambassador A (Mentor)**.
- **Result:** Merchant B earns for their active work, and A earns for mentoring B. Council gets 7.

### Scenario 4: Independent Onboarding (The Shield)
Merchant B chooses to bypass Ambassador A and self-onboards to "go independent." Then B onboards Shop C.
- **Action:** Shop C is listed by B.
- **On-chain Lookup:** B has NO mentor (self-listed).
- **Distribution:** 8 Big Mac® → **Council Treasury** and 8 Big Mac® → **Merchant B (Active)**.
- **Result:** Merchant B still only earns 8 Big Mac®. The "unclaimed mentor share" reverts to the Council. This means B has zero financial benefit to bypassing A.

---

## 🎬 7. Summary
This framework demonstrates a "ruled by code" economy that rewards mentorship while protecting the treasury. It turns human competition into a collaborative cells-and-hubs structure where the treasury always grows.
