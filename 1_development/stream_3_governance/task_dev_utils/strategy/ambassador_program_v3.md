# Stables Ambassador Program — Final

**Version**: 4.0 (Final)
**Date**: 2026-02-18
**Status**: Development Draft
**Supersedes**: All previous ambassador model documents

---

## The Mission

Stables needs merchants. Without merchants there is nowhere to spend USDs or other Stables. Without somewhere to spend them there is no reason to hold them.

We cannot hire a sales force. We cannot run paid ads. We need a self-sustaining network of people who go out, find merchants, onboard them, and then keep them active — rewarded fairly for doing so.

The ambassador program builds that network.

---

## Core Design Principles

1. **Fully pseudonymous** — no KYC, no off-chain verification, ever
2. **No discounts** — all merchants pay the same price
3. **No transaction fee share** — that would reveal merchant turnover (financial surveillance)
4. **Simple** — one flat fee, one yearly renewal, one mandatory field
5. **Self-sustaining** — ambassadors are motivated to recruit users, not just list merchants

---

## The Complete Model

### The Listing Fee

Every merchant pays **100 USDs** to be listed on Stables. No exceptions. No tiers.

The listing form has one mandatory field: **the ambassador's address.**

The ambassador fills in this form on behalf of the merchant — this is their job. The merchant pays 100 USDs to the Protocol. The Protocol automatically splits and distributes:

| Merchant number | Council | Ambassador |
|---|---|---|
| 1st merchant listed by this ambassador | 100 USDs | 0 USDs |
| 2nd merchant onward | 50 USDs | 50 USDs |

The first merchant listed by any ambassador always goes 100% to the Council. This is the anti-gaming rule — it makes self-listing as an ambassador economically pointless (you pay 100 USDs and get 0 back).

From the second merchant onward, the ambassador earns 50 USDs per listing, automatically, on-chain.

---

### The Yearly Renewal

Every merchant pays **100 USDs per year** to maintain their listing in Stables. Same split as the original listing:

| Renewal | Council | Ambassador |
|---|---|---|
| Every year | 50 USDs | 50 USDs |

The renewal uses the same ambassador address recorded at the original listing. The Protocol handles the split automatically.

**This is the engine of the ambassador's long-term income.** A portfolio of 50 active merchants renewing each year = 2,500 USDs/year — but this requires active work all year long. Merchants only renew if Stables is working for them, which means the ambassador must continuously recruit users, support merchants, and keep the local network alive.

---

### Why the Ambassador Recruits Users

The renewal is the key insight. A merchant only renews if Stables is worth it to them. Stables is only worth it if their customers are paying with it. So the ambassador must bring users to the merchants they onboard — or lose the renewal income.

This creates a natural, self-sustaining incentive:

```
Ambassador onboards merchants
↓
Ambassador recruits users in the same neighbourhood
(flyers, QR codes, word of mouth, community channels)
↓
Users pay at those merchants
↓
Merchants see value → renew their listing
↓
Ambassador earns 50 USDs per renewal, every year
```

No transaction tracking. No turnover disclosure. Just a flat yearly fee that the merchant pays willingly because the platform works.

---

## The Council Treasury and the Coverage Ratio

The Council's 50 USDs share from every listing and renewal does not sit idle. It is held as Minima in the Council treasury and used to actively maintain the Coverage Ratio (CR) above 100%.

The CR is the ratio of total Minima in the protocol treasury to the total value of all Stables in circulation:

```
CR = Total Minima Treasury Value / Total Stables Backing Required × 100%
```

The Council uses its treasury holdings to stabilise the CR:

- **When CR falls toward 100%**: The Council mints xMINIMA by depositing Minima into the protocol, increasing the treasury and pushing CR back up
- **When CR is comfortably above 100%**: The Council may burn xMINIMA to recover Minima, managing the treasury efficiently

This means every listing fee and every renewal fee collected by the Council directly strengthens the protocol's stability. The more merchants onboarded, the more revenue flows to the Council treasury, the more resilient the CR becomes. Ambassador activity and protocol health are directly linked.

---

## The Technical Mechanism (HD Wallet)

The ambassador never reuses the same address. For each merchant they onboard, they generate a fresh child address from their master key using standard HD (Hierarchical Deterministic) wallet derivation — the same technology used in every modern crypto wallet.

**How it works:**

```
Ambassador master key
├── Child address 1 → used for Merchant A
├── Child address 2 → used for Merchant B
├── Child address 3 → used for Merchant C
└── ...infinite addresses, all derived from one key
```

The Ambassador page in the MiniDapp generates a new child address each time the ambassador opens a new merchant registration. The ambassador gives this address to no one — it goes directly into the mandatory ambassador field of the listing form.

**Proof of ownership:**

When the Protocol needs to verify that Child Address 2 belongs to Ambassador X, the ambassador signs a message with their master key that mathematically proves the derivation. This is verified on-chain. No trust required. No human review. Fully pseudonymous — no one outside can link Child Address 1 to Child Address 2.

**The ambassador's dashboard** shows all their merchants, all their child addresses, total earnings, and renewal calendar — privately, on their own device.

---

## Economics at Scale

### Ambassador Portfolio

| Merchants | Year 1 (listings) | Year 2+ (renewals/year) |
|---|---|---|
| 10 merchants | 9 × 50 = 450 USDs | 10 × 50 = 500 USDs |
| 50 merchants | 49 × 50 = 2,450 USDs | 50 × 50 = 2,500 USDs |
| 200 merchants | 199 × 50 = 9,950 USDs | 200 × 50 = 10,000 USDs |

### Council Revenue

| Merchants | Year 1 | Year 2+ (renewals/year) |
|---|---|---|
| 1,000 merchants | 1,000 × 50 = 50,000 USDs | 1,000 × 50 = 50,000 USDs |
| 10,000 merchants | 10,000 × 50 = 500,000 USDs | 10,000 × 50 = 500,000 USDs |

---

## Interest Alignment: The Full Picture

| Stakeholder | Incentive | Aligned with |
|---|---|---|
| **Ambassador** | Earn 50 USDs per listing + 50 USDs per renewal per year | Getting merchants listed AND keeping them active |
| **Council** | Earn 50 USDs per listing + 50 USDs per renewal per year — held as Minima to maintain CR | Same as ambassador |
| **Token Holders (xMINIMA)** | More merchants → stronger Council treasury → stronger CR → xMINIMA value protected | Same as ambassador |
| **Merchant** | Access to Stables users, instant settlement, no chargebacks | Staying active on the platform |

Everyone wins when a merchant is active and renewing. There is no conflict of interest.

---

## The Self-Ambassador Problem (Resolved)

**Can a merchant register themselves as their own ambassador?**

Yes. They fill in their own address in the mandatory ambassador field.

**Does it matter?**

- Their first listing: 100% goes to Council. They get 0 back. No incentive.
- If they list a second merchant (a real one): they earn 50 USDs. But now they are a real ambassador.
- Their own renewal: 50 USDs goes back to them. Council still gets 50 USDs.

The self-ambassador scenario either earns nothing (first listing) or turns the merchant into a genuine ambassador (subsequent listings). In both cases the outcome is acceptable. The Council always receives its 50 USDs.

---

## The Ambassador Workflow

**To onboard a merchant:**

1. Open the Ambassador page in the MiniDapp
2. Generate a fresh child address for this merchant
3. Fill in the merchant listing form (business name, category, location description — no personal data)
4. Enter the child address in the mandatory ambassador field
5. Merchant pays 100 USDs to the Protocol
6. Protocol splits automatically: 50 USDs Council + 50 USDs to child address (from 2nd merchant onward)
7. Listing goes live

**To recruit users:**

1. Print a simple card or flyer with a QR code linking to the Stables MiniDapp download
2. Leave them at the merchant's counter, window, or local community boards
3. Tell the merchant: "Every customer who pays with Stables is one more reason to renew next year"
4. No tracking. No invite links. No on-chain mechanism. Just word of mouth and physical presence.

---

## Launch Strategy

### Phase 1 — Founding Ambassadors
- Recruit the first ambassadors from the existing Stables community (Telegram, Discord)
- Target: 500 merchants listed in 90 days
- Founding ambassadors receive a permanent on-chain badge (non-transferable NFT on Minima)

### Phase 2 — Open to All
- Ambassador page available to any wallet in the MiniDapp
- No application, no approval, no bond required
- First merchant always goes 100% to Council (built-in anti-gaming)

---

## Summary

The Stables ambassador program is built on one simple mechanism:

> **Merchant pays 100 USDs to the Protocol. Protocol sends 50 USDs to the ambassador's address. Repeated every year.**

- No discounts
- No transaction tracking
- No turnover disclosure
- No KYC
- Fully pseudonymous
- Fully on-chain

The ambassador earns by building a portfolio of active merchants. They keep those merchants active by recruiting users in the same neighbourhood. This is active, ongoing work — not a set-and-forget arrangement. The yearly renewal is the incentive that keeps ambassadors engaged all year long.

The Council's share of every fee is held as Minima and used to maintain the Coverage Ratio above 100%, directly strengthening the protocol that ambassadors are building.

---

**Built on MINIMA** → https://minima.global
