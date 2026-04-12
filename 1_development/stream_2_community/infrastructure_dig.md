# The Infrastructure Dig: Under the Stables Playing Field

> This is the third layer of the Stables Information Cascade. If the Home Page defines the "What" and the Playing Field defines the "How," the Infrastructure Dig defines the "Where."

## 1. The Minima-Native Engine

Stables is built exclusively on **Minima**—the only blockchain where every user runs a full constructing and validating node. 

- **Local Execution**: The Stables logic (Minting, Burning, Coverage triggers) does not run on a centralized cloud server. It runs as a **MiniDapp** directly on your local device.
- **Decentralized Solvency**: Because the code resides on your node, there is no "God Mode" server to hack, pause, or censor. The system is as unstoppable as the network itself.

## 2. The Deterministic Oracle

Stability requires a reference price. Stables uses a **Deterministic State Machine** to manage trust:

1.  **Price Feed**: Oracle prices are pushed to the chain at regular intervals.
2.  **Lag Mitigation**: If the Oracle feed stalls, the protocol enters a **Guarded State**. Redemption remains open at the last known healthy price, but liabilities are capped to prevent arbitrage during data gaps.
3.  **No Discretion**: There is no human "Emergency Committee" to decide the price if things go wrong. The system reacts according to predefined math.

## 3. The Burn/Mint Mechanics (Balance Sheet Health)

The protocol's primary goal is the protection of the **Senior Liabilities** (Stablecoins).

- **Minting USDs**: Requires Assets / Liabilities > 110%. If the protocol's backing drops, minting is locked to prevent further dilution.
- **Liquidity Lock-up**: When system health is low, **xMinima** (Equity) and **USDscf** (Junior Debt) burning is locked. This "Involuntary Insurance" forces the capital to stay in the system when it is needed most, protecting the merchants.
- **Conversion Math**: If the Coverage Ratio (CR) continues to drop, Junior Debt (USDscf) holders are incrementally converted to Equity (xMinima). They absorb the shock so the merchant bedrock remains 1:1.

## 4. The Path Forward: Technical Milestones

- **Phase 1 (Synthetic)**: Pure Minima-backed stablecoins utilizing oracles for price parity.
- **Phase 2 (Liquidity)**: Native on-chain DEX integration to facilitate instant xMinima/Minima exit paths.
- **Phase 3 (Sovereignty)**: A circular economy where goods are priced directly in Minima, rendering the USD-peg unnecessary as a coordination tool.

---

**Stables: Money that is truly yours. Built on Minima.**
