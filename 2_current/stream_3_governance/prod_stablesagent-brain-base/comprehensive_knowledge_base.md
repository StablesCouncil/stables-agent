# Stables Comprehensive Knowledge Base
**Version: Foundation & Philosophy (Public)**

This document synthesizes all public Stables documentation, community discussions, and architectural decisions into a single, comprehensive source of truth. It represents the deepest level of understanding of the Stables protocol, explicitly refined for precision.

## 1. The Core Philosophy: Why Minima?
Stables is not another "crypto project." It is a decentralized banking system built exclusively on the **Minima blockchain**. 
Minima was chosen because it is the only network where every user runs a full validating and constructing node on their local device (phone or PC). This architecture eliminates miners, delegators, and centralized infrastructure providers, resulting in true censorship-resistance and absolute decentralization.
"Stables exists because Minima exists, not the other way around. Minima's decentralization is not just a feature, it is a prerequisite for sovereign money."

## 2. The Four Pillars of True Stable Money (The Grok Challenge)
A resilient stablecoin must achieve four nearly impossible feats. Stables is designed explicitly to survive these exact challenges:
1. **Perfect Economics:** Flawless peg stability and incentive design. Stables achieves this without fractional reserves by using massive over-collateralization of native Minima, backed by a 3-layer risk absorption structure.
2. **Battle-Tested Code:** Secure, audited, exploit-resistant software. Stables will heavily stress-test its MiniDapp on a testnet (using the test asset "Winiwa") before any real value is introduced.
3. **Massive Adoption:** Stablecoins need deep liquidity. Stables circumvents the "retail crypto" adoption hurdle by targeting Web2, non-crypto users—specifically merchants—as the entry point.
4. **Surviving Regulation & Crashes:** By building a 100% on-chain, non-custodial, decentralized structure governed by code without a corporate issuer, Stables minimizes regulatory attack vectors while remaining mathematically robust against flash crashes.

## 3. The Sovereign Monetary Architecture
Stables is not a traditional DeFi project. It is a **floating collateralized synthetic monetary layer** built on Minima. It is designed with deterministic solvency, distributed equity absorption, and no discretionary emergency logic.

### A. Stablecoins (Floating, Not Defended)
- **The Core Mechanic:** Stables does not "defend a peg" using centralized treasuries. It uses Floating Redemption. At all times, the backing ratio is visible: `Available Minima Assets / Stablecoin Liabilities`.
- **The Merchant Peg:** If the backing ratio dips below 1, redemption floats with it. However, the system's stability relies on **The Merchant Network**. As long as local merchants continue to accept 1 USDs for $1 worth of real-world goods—because it guarantees them zero transaction fees and instant settlement—the network retains its utility value regardless of secondary market fluctuations in the Minima collateral. 

### B. xMinima (Equity Absorption)
- **The Structural Buffer:** xMinima represents the equity layer. The holders of xMinima voluntarily absorb the volatility of the Minima collateral. They provide the structural foundation that keeps the Stablecoin backing ratio robust in exchange for leveraged exposure to Minima's native growth.
- **Proportional Voting:** Power resides with those who assume this structural risk: **1 xMinima token = 1 vote**. No tiers, no admin keys, no quadratic voting.

## 4. The Transition Doctrine (The Arc of Money)
Stables does not claim to be the final form of human money. It is a necessary bridge from the centralised present to a sovereign future. We view monetary history as a sequence of stages:

- **Stage −2 (Commodity Money):** Direct exchange and intermediary assets with intrinsic value (shells, salt, metals). Trust was local and mutual.
- **Stage −1 (Sound Money/State Capture):** Standardisation of gold/silver coins. Trust shifted from community to state. Coercion entered via legal tender and mandated taxation.
- **Stage 0 (Fiat/Centralised Control):** The current world. Money is issued by decree and managed by central banks. Individuals are assigned a currency by jurisdiction. Participation is mandatory; exclusion is common.
- **Stage 1 (Stables - Sovereign Opt-In):** The current phase. Stables provides synthetic pegged assets (USDs, EURs, CADs, IRTs) so participants can opt-in to a sovereign network today while maintaining familiar pricing. Minima is listed alongside these as the native destination.
- **Stage 2 (Minima-Native Economy):** As adoption deepens, participants begin pricing goods and services directly in Minima. The reliance on fiat-pegged bridges fades. Everyone becomes their own bank on infrastructure they validate themselves.
- **Stage 3 (The Circular Horizon):** A future state where monetary power is a fundamental human right. It recognises the right of every human to live with dignity and operates in service of the planet.

**The StablesAgent's Role:** The Agent exists to facilitate Stage 1, guiding users and merchants across the bridge from Stage 0 to Stage 2. 

### Communication & Pitch
- **Target Audience:** Your mother, your uncle, the local shop owner.
- **The Pitch:** We never use the words blockchain, crypto, or web3 in consumer marketing. We sell: "A better alternative to cash." "Zero transaction fees." "Instant settlement." "No chargebacks."
- **Privacy:** In a world of centralized data leaks, Stables provides pseudonymous, safe financial dignity.

## 5. Funding & Community Rewards
- **Zero VCs:** There will be no venture capital raises, no private sales, and no dedicated "Project Token" sold to extract value.
- **The Core Team:** The initiators of the project are just kickstarting the protocol to eventually hand control completely to the decentralized Stables Council. The team will never touch protocol money.
- **Airdrops & NFTs (Winiwa Testnet):** To heavily stress-test the system, Stables will run an epoch-based competition on its testnet. Users will start with "Winiwa" (fake Minima) and compete to end the epoch with the highest portfolio value. Winners and active questers will be rewarded with commemorative NFTs. These NFTs hold no protocol utility and grant no special rights; they are purely an attestation of early support.
- **Socials Strategy:** Stables targets Web2 platforms aggressively (Instagram, Facebook) to reach normal users who feel disenfranchised by the traditional banking system.

## 6. Architecture Precedents
Stables is not inventing novel, untested mechanics. It is taking battle-tested economic models (such as those pioneered by MoneyOnChain on RSK) and executing them on a superior base-layer (Minima) with a superior UI/UX, pushing it fully into retail utility instead of keeping it in the DeFi niche.

## 7. The Stables Banking System: How the Mechanic Works

This section gives the Agent a clean, step‑by‑step description of how the Stables banking system works in practice, mirroring the public "Our Own Banking System" presentation.

### 7.1 The Three Main Actors
- **People:** Buyers, savers and senders who hold and use Stables day‑to‑day.
- **Merchants:** Sellers, providers and recipients of payments who agree to accept Stables at a 1:1 value with local pricing (for example, 1 USDs for 1 dollar worth of goods).
- **The Protocol:** The on‑chain logic that mints and burns stablecoins, manages the Coverage Fund and Liquidity Fund and routes fees.

### 7.2 The Money Layer (Stablecoins)
- **Stables:** USDs, EURs, JPYs and other synthetic currencies that are designed to hold a stable value and be used as everyday money.
- **Financial Entry (Mint / Burn):** People can lock Minima into the protocol to mint new stablecoins, and they can burn stablecoins to redeem Minima. This is the financial on‑ramp into the system.
- **Work Entry (Earn):** People and merchants can also earn Stables directly by providing goods and services or by onboarding other merchants. This is the work‑based on‑ramp.

In both cases, the result is the same: more users and merchants hold and use Stables as their money, and payments move directly between them with zero transaction fees.

### 7.3 The Internal Protocol Mechanics
- **Coverage Fund:** All transaction fees generated by the network flow into the Coverage Fund. It is the yield‑bearing buffer that strengthens the backing of the stablecoins and rewards the holders of the coverage fund tokens. When coverage is high, it can hold mostly stablecoins. When coverage is stressed, it can gradually tilt toward xMinima to absorb volatility while keeping the system solvent.
- **Liquidity Fund (xMinima / Minima):** A dedicated pool that provides deep, continuous liquidity between xMinima and Minima. It ensures that participants who take the equity side (xMinima) can always enter and exit positions without destabilizing the money layer that normal users rely on.
- **xMinima (Equity Layer):** The equity token of the protocol. xMinima holders voluntarily absorb price swings in the Minima collateral in exchange for long‑term upside and a direct role in governance. They sit structurally “behind” the stablecoin holders, taking the first hit when the market moves against the collateral but benefiting most when the network grows.
- **Council Treasury:** Funded by merchant listing and related protocol fees. The Treasury can be used to seed and maintain Liquidity Fund positions so that there is always a healthy bid and ask for xMinima without depending on external market makers.

### 7.4 How a Typical Flow Works
1. A user locks Minima into the protocol and mints USDs.
2. The user pays a merchant in USDs for real‑world goods and services. The merchant can either keep the USDs as savings or burn them to redeem Minima.
3. Every payment generates tiny fees that flow automatically to the Coverage Fund instead of to banks or card networks.
4. The Coverage Fund strengthens the overall balance sheet and rewards its token holders, while the Council Treasury builds up resources from merchant listing fees.
5. The Treasury and Liquidity Fund together ensure that xMinima remains liquid so that equity‑side participants can come and go, while ordinary users just experience instant, fee‑less payments in money that holds its value.

The core mechanic is therefore simple: **People and merchants use Stables as day‑to‑day money, while the Coverage Fund, Liquidity Fund and xMinima layer quietly absorb volatility and route fees in the background so that the system stays solvent and resilient over time.**
