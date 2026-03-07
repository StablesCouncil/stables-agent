# Stables: Financial Soundness Analysis
**Structural soundness, philosophy, and what holds the peg**

> [!NOTE]
> Working paper feeding into the Constitutional Charter. Reflects design discussions as of March 2026.
> **Constitutional precedence**: Charter Article II.6 prohibits forced conversion. This document has been updated to align with the Charter's floating redemption approach.

---

## 1. What Are We Building?

**A sovereign opt-in merchant payment system.**

Not a DeFi protocol. Not a speculative platform. A payment system where:
- Merchants opt in voluntarily
- No authority enforces acceptance
- The peg holds because merchants **choose** to honor it
- The system's soundness is a consequence of that collective choice

As long as the merchant network has confidence and accepts stablecoins at par, the system holds. When confidence goes, the system contracts. When confidence returns, it expands. Just like every monetary system in history — except **without coercion**.

### How This Differs From Every Existing System

In a nation-state:
- You MUST use the local currency (legal tender laws)
- You MUST pay taxes in it (state coercion)
- Non-compliance → fines → prison → physical force
- You are a currency slave — you work for pesos, dollars, euros not because you choose to, but because the state requires it

In Stables:
- You choose to accept USDs
- You choose to hold USDs
- You choose to leave at any time
- No one is punished for not participating

**This means our system must be MORE robust than fiat, not less.** We can't fall back on "the government forces people to use it." We can only fall back on **"it's in your interest to use it."**

### The Exit Strategy: Transition Doctrine

Stables is a **bridge**, not a destination — and so is Minima. The full arc:

- **Stage −2**: Commodity money (community-based, no coercion)
- **Stage −1**: Sound money under central authority (coercion enters)
- **Stage 0**: Fiat under centralised control (**today** — mandatory, unaccountable)
- **Stage 1 — Stables**: Sovereign opt-in merchant payment system. *Participants* choose to join.
- **Stage 2 — Minima-native**: Merchants price in MINIMA. 1 MINIMA = 1 MINIMA. Sovereignty achieved but limited by concentration. **Not required to reach Stage 3.**
- **Stage 3 — Circular horizon**: Language shifts from *participants* to **humans**. Every human receives monetary power by right of being alive. System is circular — like the water cycle. We don't know how to build this yet.
- **Beyond**: Further evolution expected. No stage is final.

MINIMA is listed alongside USDs, EURs, CADs, IRTs from inception — stable relative to itself. The fiat pegs are tools. Minima is a stepping stone. The measure of Stables' success is not its permanence, but the quality of what it enables beyond itself.

---

## 2. The Three Pillars of Peg Soundness

The peg is maintained by three independent forces. No coverage ratio threshold is imposed — equilibrium emerges from incentives alone.

### Pillar 1: MINIMA Has Permanent Nonzero Value

**Argument**: Minima's chain requires no token to run and no infrastructure to maintain. It runs on user devices — no mining costs, no staking requirements, no server infrastructure, no foundation expenses. The chain survives as long as people run the app on their phones. The token has value because it's the unit of account on a living, permissionless, censorship-resistant network.

MINIMA's properties as money:

| Property | Gold | US Dollar | Bitcoin | MINIMA |
|----------|------|-----------|---------|--------|
| Limited supply | ✅ (mined) | ❌ (printed) | ✅ (21M cap) | ✅ (fixed supply) |
| Liquidity | Medium | High | Medium | High (every node is a DEX) |
| Storage cost | High (vaults) | Low (banks) | Low (wallets) | **Zero** (on your phone) |
| Transport cost | High | Medium (SWIFT) | Low (fees) | **Zero** (peer-to-peer) |
| Usage cost | High (assaying) | Low | Medium (gas) | **Zero** (no gas) |
| Infrastructure cost | Mining ops | Central banks, military | Miners ($B/yr) | **Zero** (phones) |
| Coercion required | No | **Yes** (legal tender) | No | **No** |

**Counter-arguments addressed**:
- *"Survival ≠ value"*: True, but the protocol self-adjusts. At very low MINIMA prices, stablecoin supply has already contracted via burns and conversions. The system right-sizes itself — it needs the ratio to work, not the absolute price.
- *"Death spiral"*: Unlike chains that need revenue to pay validators, Minima survives any spiral. There's no "shutdown threshold." Dead chains are ones that can be turned off. Minima cannot be turned off.
- *"Nonzero could mean $0.00001"*: At that price, the system is dormant but solvent — waiting for recovery, not broken. The protocol doesn't break — it hibernates.

**Verdict**: This pillar guarantees **protocol survival**, not protocol prosperity. The system can never permanently break, even if it becomes small.

### Pillar 2: xMINIMA's Asymmetric Payoff Attracts Re-capitalization

**Argument**: At CR near 100%, xMINIMA is structurally a free perpetual call option — near-zero cost, infinite upside, zero downside (no liquidation, no debt, no expiry, no funding rate). Historical precedent: distressed debt markets always attract vulture capital.

**Counter-arguments addressed**:
- *"Bear markets kill risk appetite"*: This is a timing argument, not a structural one. The option doesn't expire. Eventually, some speculator takes it.
- *"Catching a falling knife"*: Each further drop makes the asymmetry MORE extreme. Market bottoms are built by the slow trickle of opportunists who can't resist the math.
- *"DEX illiquidity"*: On Minima, DEXs are peer-to-peer. One trade per day at $50 still contributes to recovery.
- *"The Japan scenario (34 years of depression)"*: Japanese companies had operating costs, debt, employees — they needed the economy to function. Minima needs nothing. It can sit dormant at $0.001 for decades and spring back the moment utility emerges. The carrying cost is exactly $0.

**Verdict**: This pillar guarantees **eventual recovery**, not fast recovery. Combined with Pillar 1, the system always heals — on its own timeline.

### Pillar 3: Physical Arbitrage Through Merchant Acceptance

**Argument**: As long as merchants accept USDs at face value, any depeg creates real-world profit:

```
USDs on DEX: $0.90
USDs at merchant: $1.00

→ Buy 100 USDs on DEX for $90
→ Buy $100 of goods
→ Effective 10% discount on real goods
```

This doesn't require financial sophistication — any consumer can do it. The bigger the depeg, the bigger the discount, the stronger the correction. This is the same force that makes fiat work: money has value because you can buy things with it.

**On merchant awareness (settled)**: We reject any peg mechanism that depends on merchant ignorance. Merchants KNOW the DEX price. They accept USDs at par because:
1. They buy supplies from other merchants who also accept at par (self-reinforcing circulation)
2. They believe the depeg is temporary
3. Rejecting USDs means losing sales
4. Transaction fees are lower than credit card fees — even a 5% depeg risk competes with Visa's 2.5% + chargebacks
5. They can hedge by converting some USDs to MINIMA or fiat

**If a merchant raises USDs prices to reflect the depeg — that's perfectly rational.** That IS the depeg showing up in the real economy, exactly like inflation in fiat. But transparent, visible, and temporary — unlike fiat inflation which is invisible, gradual, and permanent.

**Verdict**: This pillar provides **ground-level peg enforcement** through real-world demand. It's the foundation the other two pillars sit on.

---

## 3. Mechanics at CR ≤ 100%

### Constitutional Approach: Floating Redemption (No Forced Conversion)

Per Charter Article II.6, there is **no forced conversion** of any participant's assets. The system is mechanically continuous — no regime switching, no crisis triggers.

**Floating redemption**: Redemption always reflects the true backing ratio:
- Backing ≥ 1 → redemption at par
- Backing < 1 → redemption at the backing ratio (pro-rata)

At CR = 85.7%, burning 1 USDs returns $0.857 of MINIMA. This is honest, not par.

**Why floating redemption works**: Each burn improves CR because supply drops by $1 while treasury only drains by the backing ratio. The system heals through voluntary participant actions, not forced conversions.

**"Bad debt" market**: Because every burn improves CR, discounted stables have predictable convergence value. This creates a secondary market — investors buy stables below par knowing the math guarantees CR improvement with every burn.

**Equity absorption**: xMINIMA absorbs all volatility structurally as the residual claim (Assets − Liabilities). Recapitalization happens through market dynamics — speculators voluntarily enter the asymmetric xMINIMA bet.

### The Circular Logic (Resolved)

MINIMA CAN crash. The protocol doesn't prevent that. The circle resolves at: **the protocol survives any crash and heals afterward**.

```
MINIMA crashes → backing ratio drops below 1
→ redemption floats to backing ratio (pro-rata)
→ each burn improves backing ratio
→ stables temporarily below par → bad debt investors buy (profit)
→ physical arbitrage (discounted goods) → supply shrinks
→ MINIMA still > 0 → xMINIMA asymmetric bet → speculators enter
→ new capital → backing ratio climbs above 1 → system heals
```

### State Transitions

| State | Stable Minting | Stable Burning | xMINIMA Minting | xMINIMA Burning |
|-------|---------------|---------------|-----------------|-----------------|
| Backing ≥ 1 | ✅ Enabled | ✅ At par | ✅ Smart router | ✅ Smart router (backing ≥ 1 after) |
| Backing < 1 | ❌ Disabled | ✅ Pro-rata | ✅ DEX route only | ❌ Disabled |

---

## 4. Who Profits From Restoring the Peg?

The infrastructure must ensure that **every rational actor profits by restoring the peg**, regardless of sophistication or capital.

| Actor | Skill Required | Capital Required | Action | Profit Source |
|-------|---------------|-----------------|--------|--------------|
| Consumer | Zero | Grocery money | Buy goods at discount during depeg | Real goods at below-market effective price |
| Trader | Low | Small | Buy cheap stables, burn at protocol | Pro-rata MINIMA (above market USDs price) |
| Speculator | Medium | Medium | Buy xMINIMA at near-zero | Asymmetric upside on recovery |
| Bad debt investor | Medium | Medium | Buy discounted stables, hold for convergence | CR improvement guarantees value approaches par |
| Merchant | Zero | Zero | Continue accepting stables (fully informed) | Retain customers, lower fees than cards |

**Every tier has a converging incentive. You don't engineer a specific staking ratio — you build the arena and let the actors play.**

---

## 5. Confidence and Coercion

**Confidence is the only existential risk.** But this is true of all money. The key differences:

| | Fiat | Stables |
|---|---|---|
| Survives confidence crisis via | **Coercion** (legal tender laws, prison) | **Intrinsic attractiveness** (opt-in) |
| Depeg visibility | Hidden (inflation, CPI manipulation) | **Transparent** (DEX price, on-chain CR) |
| Depeg reversibility | **Never** (prices don't fall) | **Recoverable** (peg can restore) |
| Accountability | None | Structural (math is public) |

We accept that if confidence vanishes completely, the system contracts toward irrelevance. **This is by design.** The system doesn't fight gravity — it waits, at zero cost, for confidence to return. And when it does, the system is ready.

Our confidence requirement is the narrowest possible: **trust math and see that the chain is running.** Not "trust the government." Not "trust the company."

---

## 6. Attack Resistance

Complex systems fail. Our defense is **simplicity**.

| Attack Vector | Method | Defense |
|--------------|--------|---------|
| Price crash | Dump MINIMA | Floating redemption (pro-rata), xMINIMA re-cap through market incentives. Attacker loses their MINIMA. |
| Merchant disruption | Regulatory pressure | No central point to regulate. No "Stables Inc." to shut down. Every merchant is independent. |
| Oracle manipulation | False price data | Multiple oracle sources, on-chain verification. **Real engineering risk — needs robust design.** |
| DEX liquidity drain | Remove all liquidity | P2P DEXs — no pool to drain. Every node can be a market maker. |
| FUD | Confidence attack | Radical transparency. CR is public. Treasury is on-chain. Truth is the defense. |
| Regulatory ban | Outlaw stablecoins | Infrastructure-independent. Can't raid a phone app running on 10M devices. |

The logistics must be:
- **Simple enough** that anyone can understand them
- **Transparent enough** that anyone can verify them
- **Automatic enough** that they don't depend on human intervention
- **Costless enough** that they run forever without funding

**The Council and Coverage Fund act only as market participants** — arbitrageurs, speculators, investors. The structure must be solid enough without them. They can help, but they are not structural.

---

## 7. Can Minima Fail?

**Momentarily**: Possible in extreme network partition (global internet outage). But every user is a full node, and the network heals when connectivity returns. A pause, not a failure.

**Permanently**: Requires destroying every device running a node — phones, tablets, laptops worldwide. Physically impossible short of civilizational collapse.

**Full nodes only (archive/MMR nodes destroyed)**: Yes, the chain survives. Full nodes are the backbone. Archive and MMR nodes are convenience layers for faster sync. The chain data is distributed across all full nodes.

> [!NOTE]
> Technical survival specifics should be validated with the Minima team for edge cases.

---

## 8. The WHY

> "Life is a right, happiness is a right, access to what is needed for that is a right, whoever you are."

If access to money is a right, then:
- Money shouldn't require permission from a government
- Money shouldn't cost anything to hold
- Money shouldn't require infrastructure that can be cut off
- Money shouldn't discriminate based on geography, identity, or wealth

MINIMA satisfies all four. Stables extends this to people who still need to interface with the fiat world. Together: **universal access to money as a human right, not a privilege granted by states.**

---

## Summary

| Question | Answer |
|----------|--------|
| What is Stables? | A sovereign opt-in merchant payment system |
| What maintains the peg? | Merchant confidence + arbitrage incentives + transparent arithmetic |
| Can it depeg? | Yes, temporarily — honest and acceptable |
| Can it permanently break? | Only if MINIMA = 0 (requires destroying every node) |
| What protects holders? | Infrastructure guarantees every peg-restoring action is profitable |
| What's the exit strategy? | MINIMA becomes the stable — 1 MINIMA = 1 MINIMA |
| What's the ethical standard? | Full information symmetry, opt-in only, no coercion |
| What's the defense? | Simple, transparent, automatic, costless logistics that run on math |
| What's the only existential risk? | Total loss of confidence (true of all money) |
