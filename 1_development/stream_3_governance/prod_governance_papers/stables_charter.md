# THE STABLES CHARTER
## A Sovereign Banking Infrastructure Framework

**Status:** Internal Draft — Under Council Review
**Phase:** 1 — Foundational Charter Drafted
**Issued by:** The Stables Council

---

## TABLE OF CONTENTS (Charter Structure)

- [Preamble](stables_charter.md#preamble) — Sovereign Context, Structural Identity, and Transition Doctrine  
- [Article I — Mission and Dual Destination](stables_charter.md#article-i--mission-and-dual-destination)  
  - [I.1 Core Objective](stables_charter.md#i1-core-objective)  
  - [I.2 Structural Identity](stables_charter.md#i2-structural-identity)  
  - [I.3 Dual Destination Framework](stables_charter.md#i3-dual-destination-framework)  
  - [I.4 Open Platform Doctrine](stables_charter.md#i4-open-platform-doctrine)  
- [Article II — Monetary Core (Invariant Foundation)](stables_charter.md#article-ii--monetary-core-invariant-foundation)  
  - [II.1 Minima-Only Base Collateral](stables_charter.md#ii1-minima-only-base-collateral)  
  - [II.2 Solvency Invariant](stables_charter.md#ii2-solvency-invariant)  
  - [II.3 Floating Redemption](stables_charter.md#ii3-floating-redemption)  
  - [II.4 Deterministic Crisis Continuity](stables_charter.md#ii4-deterministic-crisis-continuity)  
  - [II.5 Oracle Aggregation and Issuance Integrity](stables_charter.md#ii5-oracle-aggregation-and-issuance-integrity)  
  - [II.6 No Forced Conversion](stables_charter.md#ii6-no-forced-conversion)  
  - [II.7 Mechanical Identity of the Core](stables_charter.md#ii7-mechanical-identity-of-the-core)  
  - [II.8 Three Structural Pillars of Soundness](stables_charter.md#ii8-three-structural-pillars-of-soundness)  
- [Article III — Structural Layers and Modularity](stables_charter.md#article-iii--structural-layers-and-modularity)  
- [Article IV — Merchant Activation Doctrine (Growth Architecture)](stables_charter.md#article-iv--merchant-activation-doctrine-growth-architecture)  
- [Article V — Oracle Framework](stables_charter.md#article-v--oracle-framework)  
- [Article VI — Transparency Doctrine](stables_charter.md#article-vi--transparency-doctrine)  
- [Article VII — Governance Evolution (Code-First Structural Limitation)](stables_charter.md#article-vii--governance-evolution-code-first-structural-limitation)  
- [Article VIII — On-Chain Anchoring](stables_charter.md#article-viii--on-chain-anchoring)  
- [Article IX — Final Declaration](stables_charter.md#article-ix--final-declaration)  
- [Annex A — Mathematical Annex](stables_charter.md#annex-a--mathematical-annex)  
- [Annex B — Risk Review and Mitigation Framework](stables_charter.md#annex-b--risk-review-and-mitigation-framework)  
- [Annex C — Governance Transition Roadmap](stables_charter.md#annex-c--governance-transition-roadmap)  
- [Annex D — Anchoring Protocol Specification](stables_charter.md#annex-d--anchoring-protocol-specification)

---

## PREAMBLE
### Sovereign Context, Structural Identity, and Transition Doctrine

**Section summary:** The Preamble traces money from human exchange to state money and then to sovereign digital infrastructure. It explains why coercive, jurisdiction-bound "king's money" can work yet remains structurally prone to abuse, why a medium of exchange should have independent value, why Minima can fill that role, and why Stables exists as the banking bridge between present liability systems and a Minima-native horizon.

Human economic life begins with exchange. People trade because needs differ, abilities differ, and cooperation creates surplus. As communities grow, direct barter becomes insufficient; a common reference is needed so that value can move cleanly across time, distance, and specialisation. Money emerges as a shared medium of exchange chosen because it is scarce enough to matter, recognisable enough to trust, and practical enough to move.

For much of history, these monetary media were assets with their own value: metals that did not rust, objects that did not decay, units whose usefulness as money did not depend on any decree. Gold is the clearest example. It carries little essential productive use relative to its monetary role, yet is durable, divisible, portable, and widely desired. Its value comes from persistent social consensus, not from an issuer's promise.

Modern fiat currencies are different. They are **access coupons on the resources of a jurisdiction**. They work because the economic surface of a country — its land, labour, infrastructure, institutions — can be marshalled through law, taxation, and enforcement. Fiat money is "money of the king": it can function and even thrive inside a tightly governed territory with enforced borders, as long as the population continues to accept that coupon for taxes, debts, and everyday life. In that sense, fiat is not intrinsically flawed; it is backed by what the issuing community owns and protects.

Yet this structure is **in tension with human nature and vulnerable to abuse**. The same apparatus that backs the currency also controls its issuance and defines who may access it. Coercion is built into the monetary core: participation is mandatory, capital controls and sanctions can restrict movement, and inflation can silently reallocate wealth without explicit consent. Such systems fit a world of closed economies and strict borders; they are poorly aligned with a human aspiration toward universal freedom of association, movement, and exchange.

The next monetary layer restores coordination to participants directly. Instead of delegating trust to central intermediaries, individuals validate the rules themselves and settle directly with one another on a shared ledger. Participation becomes voluntary, exit unconditional, and value is no longer hostage to a single jurisdiction's power structure. A medium of exchange in this setting must, like gold, stand on its own: it must be scarce, neutral, and valuable because people choose it, not because they are compelled.

**Minima** is the sovereign base layer of a borderless digital nation. The Minima token is the native unit of that nation — secured by a network in which every participant runs a complete validating node, and no authority sits above the protocol. Minima's value arises from its role as a censorship-resistant settlement asset, from the cost of producing and securing it, and from the collective decision of participants to use it as their shared monetary substrate.

**Stables** is the monetary coordination layer built within that sovereign territory.

It operates as a **sovereign banking infrastructure protocol**: a structured bridge between the liability systems of the present world — denominated in dollars, euros, and existing units of account — and the Minima-native economic future in which participants transact directly, in a currency they collectively validate and equally hold. This bridge is permanent in its function of interoperability, but transitional in its reliance on fiat-denominated units of account: as Minima adoption deepens, economic life can denominated directly in Minima while Stables continues to connect outward to other ecosystems.

The transition from centralised to sovereign monetary coordination is gradual. The distribution of Minima must widen. Merchant adoption must deepen. Economic habits must shift. Until that transition matures, Stables provides the coordination layer that makes Minima economically usable *today* — through synthetic stable representations, merchant settlement, and deterministic solvency.

Each participant in the Stables system structurally represents their own bank through:

- **Self-custody** — no third party holds user funds
- **Deterministic execution** — monetary rules enforced by code, not discretion
- **Transparent solvency** — the system ledger is visible, verifiable, and continuous
- **Direct on-chain settlement** — transactions resolve on the sovereign base layer

Access to money is a human right. Money should not require permission from a government, cost anything to hold, depend on infrastructure that can be cut off without recourse, or discriminate based on geography, identity, or wealth. Stables is built on this conviction.

This Charter is issued as a foundational draft for community feedback and active contribution, prior to formal adoption by a diversified Council. It defines the invariant principles, structural boundaries, and governance architecture within which the Stables protocol shall operate.

The horizon is a Minima-native economy in which Minima functions as a day-to-day currency used by the general public, with Stables serving both as the bridge to existing monetary systems and as the banking infrastructure of the Minima nation.

---

## ARTICLE I — Mission and Dual Destination

**Section summary:** This Article defines why Stables exists, how it is structurally identified within the Minima nation, and which long-term destinations it pursues. It translates the philosophical framing of the Preamble into a concrete mission, a precise institutional identity, and a dual destination framework (infrastructure sovereignty first, economic sovereignty built upon it).

### I.1 Core Objective

The mission of the Stables Council is to enable individuals and merchants to be their own bank through:

1. **Sovereign infrastructure** — self-custody, self-validation, self-settlement
2. **Mathematical solvency** — balance sheet health enforced by code, not promise
3. **Deterministic monetary mechanics** — every operation follows transparent, predictable rules
4. **Merchant-driven economic relevance** — real commerce anchors the system in material value
5. **Progressive decentralisation** — authority is designed to migrate from founders to a diversified Council and broader community over time, according to a formal transition roadmap within the boundaries of the immutable monetary core

### I.2 Structural Identity

Stables is:

> A sovereign banking infrastructure protocol on Minima, with immutable monetary invariants governed by deterministic code, with a Council that stewards expansion and manages systemic risk within invariant boundaries, while acting as a bridge between current-world liabilities and Minima-native economic coordination across ecosystems.

Stables is a mechanically continuous system. It does not suspend, pause, or switch regimes. It adjusts.

### I.3 Dual Destination Framework

The Stables protocol pursues two complementary destinations. Neither is optional. Technical sovereignty is the prerequisite; financial sovereignty is the purpose.

#### I.3.1 Technical Destination — Infrastructure Sovereignty

Full technical sovereignty is achieved through:

- **Minima-native collateral** — the sole asset of the monetary core
- **Integritas anchoring** — identity and document integrity verified on-chain
- **On-chain transparency** — every core system variable (collateral, liabilities, coverage) publicly observable
- **Node participation** — every user validates the network they depend on
- **Code-first monetary logic** — no human intermediary in monetary operations
- **Dedicated sovereign banking device** — hardware embedding a Minima node on chip, enabling offline-capable, tamper-resistant participation

#### I.3.2 Financial Destination — Economic Sovereignty

Full financial sovereignty is achieved through:

- **Synthetic stable representations** — on-chain currencies pegged to real-world units of account
- **Merchant settlement network** — direct payment acceptance without intermediaries, anchored in real-world goods and services
- **Liability matching instruments** — tools to align obligations with holdings
- **On-chain credit primitives** — credit scoring and history built from verifiable behaviour
- **Lending infrastructure** — personal and commercial lending governed by smart contracts
- **Treasury-driven equity reinforcement** — protocol-level capital management
- **Comprehensive on-chain banking functions** — evolving over time toward a complete financial life

Technical sovereignty enables financial sovereignty. Infrastructure precedes economics.

#### I.3.3 The Transition Doctrine

The Stables protocol situates itself within a longer arc of monetary evolution. To understand where we are going, we must understand where we have been and where we are now.

##### How We Arrived Here

**Stage −2 — Commodity Money.** Humans exchanged goods directly, then adopted intermediary assets that had intrinsic value: shells, salt, cattle, metals. Money existed because a community agreed to accept it. No institution enforced this. Trust was local and mutual.

**Stage −1 — Sound Money Under Central Authority.** Gold and silver became standardised. States minted coins, established treasuries, and introduced banking. Money gained institutional backing but also institutional capture. Trust shifted from community to state. Coercion entered: legal tender laws, taxation in mandated currency, punishment for non-compliance.

**Stage 0 — Fiat Under Centralised Control.** *This is where we are today.* Money is no longer backed by any commodity. It is issued by decree, managed by central banks, and enforced by legal obligation. Individuals do not choose their currency — they are assigned it by jurisdiction. Participation is mandatory. The system concentrates monetary power in institutions and structurally excludes those without access to banking infrastructure. Inflation is invisible, permanent, and unaccountable.

##### Where We Are Going

**Stage 1 — Stables: Sovereign Opt-In Merchant Payment System.**

Stables provides synthetic stable representations pegged to existing units of account (USD, EUR, CAD, IRT). It restores self-custody, deterministic execution, and transparent solvency to *participants* who choose to opt in. Minima is listed alongside fiat stablecoins from inception — stable relative to itself, 1 MINIMA = 1 MINIMA — signalling that fiat pegs are tools, not destinations.

*Why this stage exists*: Because the majority of economic life is still denominated in fiat. A bridge is needed.

*What is required to move beyond*: A sufficiently deep merchant network and sufficient Minima distribution that participants begin pricing goods and services directly in Minima.

**Stage 2 — Minima-Native Economy.**

As merchant adoption deepens and the Minima economy matures, *participants* price goods and services directly in Minima. Stablecoins become unnecessary for internal commerce. This stage achieves technical and financial sovereignty — every participant is their own bank, operating on infrastructure they validate themselves.

But this is not the final destination. The distribution of Minima remains concentrated by historical circumstance — early holders, team allocations, initial distribution mechanics. A monetary system built on an unevenly distributed supply, however sovereign its infrastructure, cannot fully embody the equality it aspires to.

*Why this stage exists*: Because it is the most accessible path from Stage 1 — Minima's infrastructure already exists, and merchant adoption builds naturally toward Minima-native pricing.

*What is required to move beyond*: Recognition that monetary sovereignty for *participants* is not the same as monetary justice for *all humans*. The system must evolve from serving those who opted in to serving everyone by right.

> [!IMPORTANT]
> **Stage 2 is not required to reach Stage 3.** It is the most natural progression from Stage 1, but Stage 3 could emerge from any system — or from no system at all. We do not claim to be the only path. We claim to be a good one.

**Stage 3 — The Circular Horizon.**

At this stage, the language changes. We no longer speak of *participants* — we speak of **humans**. Every human, by right of being alive, receives the monetary power necessary to ensure their human rights. This is not a reward for participation. It is a recognition of the inherent dignity and equality of every person.

This monetary system:

- **Recognises the human right to live** — every person is born with the economic capacity to sustain a dignified life
- **Embodies equality among all humans** — the system does not structurally advantage early holders, geographic proximity, or inherited wealth
- **Accepts the utmost obligation to preserve the planet** — economic coordination operates within ecological limits, in service of the living systems upon which all human activity depends
- **Is circular** — just as the water cycle on this planet is an eternal system — evaporation, condensation, precipitation, flow, return — the monetary system must also be circular: value flows, circulates, returns, and sustains, rather than accumulating and stagnating

*We do not know how to build Stage 3.* We name it because naming the destination matters, even when the path is unclear. Stables contributes by building the infrastructure, the habits, and the trust that Stage 3 will require — sovereign banking, merchant networks, transparent arithmetic, voluntary participation.

*What is required to reach this stage*: A model of monetary distribution that is inherently fair, circular, and sustainable. We do not have this model yet. We acknowledge this honestly.

**Beyond Stage 3.**

We believe Stage 3 itself is transitional. If monetary history teaches anything, it is that each system gives way to the next. We cannot see what comes after, but we design with the awareness that further evolution is not only possible but expected. The Charter does not claim finality at any stage.

##### The Non-Linear Path

The stages described above are not strictly sequential. Stage 2 may be the easiest escape from Stage 1, but it is not the only route to Stage 3. Different communities, geographies, or technologies may find different paths. What matters is the direction — from coercion toward sovereignty, from exclusion toward universality, from extraction toward circularity.

### I.4 Open Platform Doctrine

Stables is infrastructure, not a walled garden. The protocol shall be designed so that independent developers, merchants, and communities can build applications on top of the Stables banking layer — including but not limited to:

- Lending and borrowing platforms
- Payment integrations and point-of-sale systems
- Web presence through Minima-native applications (including MiniMask-enabled browser interactions)
- Insurance, savings, and investment instruments
- Community-specific financial coordination tools

The Stables Council shall not claim exclusive rights to build upon the infrastructure it governs. Openness is a structural commitment.

---

## ARTICLE II — Monetary Core (Invariant Foundation)

The monetary core defines the invariant rules of the Stables system. These rules are not parameters to be governed. They are foundational boundaries that no Council decision, community vote, or protocol upgrade shall override.

### II.1 Minima-Only Base Collateral

The monetary core uses Minima as its exclusive base collateral.

This is constitutionally permanent.

No other asset may be introduced to the monetary core. This is a sovereignty decision: Stables derives its independence from the same source that Minima derives its — a single, fully decentralised, participant-validated base layer.

### II.2 Solvency Invariant

The solvency invariant is the foundational constraint of all issuance:

> **Stable Supply ≤ Minima Collateral Value** *(oracle-valued)*

Minting requires invariant validation before execution. No issuance path — whether through direct minting, lending, or any future mechanism — bypasses this constraint. The solvency invariant is permanent and enforced by code.

### II.3 Floating Redemption

Redemption always reflects the true state of the balance sheet:

> **Backing Ratio = Assets / Liabilities**

At all times:

- **Backing ≥ 1** → redemption at par value
- **Backing < 1** → redemption at the backing ratio

This is the **floating redemption mechanism**. The protocol never promises what it cannot deliver. The peg is an equilibrium outcome maintained by market arbitrage when backing supports it — not a defended promise.

### II.4 Deterministic Crisis Continuity

Market stress resolves through deterministic balance-sheet adjustment, not governance intervention:

- The backing ratio adjusts continuously
- Redemption floats with the backing ratio
- Equity absorbs volatility through structural dilution
- Recapitalisation emerges through market incentives, not rescue operations

The protocol contains **no discretionary emergency logic**. There is no crisis regime switch. There is no discretionary protocol pause for market stress. There are no "depeg switches."

The system is mechanically continuous. It reacts deterministically.

### II.5 Oracle Aggregation and Issuance Integrity

Oracle aggregation logic is embedded at the protocol level. Issuance references stabilised oracle values.

The protocol distinguishes between two fundamentally different conditions:

- **Market stress** — the price of Minima declines. The protocol responds with floating redemption. This is continuous and automatic.
- **Oracle integrity failure** — the measurement system itself becomes unreliable. In this case, minting may be gated until measurement stabilises.

Key constraint: **gating affects issuance only. Redemption remains continuous.**

This is integrity protection, not peg defence.

### II.6 No Forced Conversion

There is no forced stable-to-xMinima conversion as a crisis trigger. The system remains continuous rather than regime-switching. No participant shall have their assets forcibly converted from one instrument to another under any condition.

### II.7 Mechanical Identity of the Core

Stables is:

> A floating collateralised synthetic monetary layer, anchored in Minima, driven by merchant adoption, stabilised through equity participation, governed by coded constraints, and fully transparent in operation — with deterministic solvency enforcement and distributed recapitalisation.

### II.8 Three Structural Pillars of Soundness

The durability of the Stables monetary structure rests on three independent pillars:

1. **Minima Non-Zero Value** — Minima functions as a scarce, neutral settlement asset on a sovereign base layer. Its value does not rely on a single jurisdiction's coercive power but on the cost of securing the network and the collective decision of participants to use it as their monetary substrate.
2. **xMinima Recapitalisation Layer** — Losses under stress are structurally assigned to committed capital providers in the junior recapitalisation layer (xMinima and related instruments), not to unsuspecting holders of the monetary unit. When stress increases, the architecture is designed so that new capital can enter at more attractive terms.
3. **Merchant-Based Physical Arbitrage** — Real-world merchant acceptance at par, combined with transparent redemption and pricing, creates a physical arbitrage channel: stablecoins trading below par can be used to obtain goods and services at a discount, generating corrective demand. The peg is supported by actual commerce, not by opaque discretionary defence.

---

## ARTICLE III — Structural Layers and Modularity

The Stables architecture is layered to separate immutable foundations from evolvable coordination and open application development.

### III.1 Layer Model

| Layer | Name | Function | Mutability |
|-------|------|----------|------------|
| **Layer 0** | Minima Sovereign Base Layer | Consensus, validation, settlement | Immutable (external) |
| **Layer 1** | Stables Immutable Monetary Core | Solvency invariant, issuance, redemption, oracle logic | Constitutionally immutable |
| **Layer 2** | Stables Evolvable Banking Coordination | Coverage fund, treasury, merchant tools, lending, governance parameters | Evolvable by Council within invariant boundaries |
| **Layer 3** | Applications and Integrations | Third-party applications, payment integrations, financial products | Open and permissionless |

### III.2 Sovereignty Preservation Principle

- Minima is the monetary base
- Stables is the structured banking layer
- Applications build above
- Expansion remains modular

This layering preserves sovereignty at each level and prevents doctrinal rigidity. Layer 1 does not change. Layer 2 evolves within the boundaries set by Layer 1. Layer 3 is unconstrained by the Council.

---

## ARTICLE IV — Merchant Activation Doctrine (Growth Architecture)

### IV.1 Endogenous Growth

Stables is driven by merchant adoption. Economic relevance is not declared — it is earned through commercial utility.

### IV.2 The Flywheel

Growth follows a self-reinforcing cycle:

> Agents → Merchants → Treasury growth → Equity depth → Stable minting → Transaction activity → Fees → Coverage participation → Reinforcement → Expanded merchant network

Each turn of this cycle deepens equilibrium. Merchant adoption anchors the system in real economic activity, which in turn attracts capital, which enables further adoption.

### IV.3 Merchant Confidence as Structural Foundation

The peg is ultimately maintained by merchant confidence. As long as merchants accept stablecoins at face value for goods and services, the system holds. This creates a structural peg enforcement through physical arbitrage:

When stablecoins trade below par on secondary markets, any participant can purchase discounted stablecoins and use them at face value with merchants — effectively obtaining goods at a discount. This creates natural buy pressure that restores the peg. The larger the deviation, the stronger the corrective force.

This mechanism does not depend on merchant ignorance. Merchants are fully informed and accept at par because:

- Internal circulation among merchants is self-reinforcing
- Transaction costs are lower than traditional payment processors
- Temporary depegs are recoverable (unlike permanent fiat inflation)
- Rejecting stablecoins means losing customers

If a merchant adjusts prices to reflect a depeg, this is the transparent equivalent of inflation — visible, honest, and temporary.

### IV.4 Agent-Driven Activation

The flywheel begins with **Agents** — community members who onboard merchants, establish local economic clusters, and earn ongoing revenue from the merchant activity they seed.

Agents are not employees. They are economically aligned participants whose incentives grow with the health of their local network.

### IV.5 Cluster Economics

Economic relevance grows **endogenously** — from the ground up, cluster by cluster. A cluster is a geographic or community-based concentration of merchants and users transacting in Stables. Critical mass at the cluster level demonstrates viability before global scale is attempted.

---

## ARTICLE V — Oracle Framework

### V.1 Oracle System Design

The oracle system provides the measurement foundation upon which all issuance decisions rest. It includes:

1. **Multi-source pricing** — no single price feed dependency
2. **Median aggregation** — resistance to outlier manipulation
3. **Time-weighted smoothing** — protection against flash manipulation
4. **Outlier resistance** — statistical filtering of anomalous data
5. **Integrity scoring** — a continuous quality metric for the measurement system itself

### V.2 Issuance Integrity

Issuance integrity is enforced through oracle stabilisation. When oracle integrity falls below threshold, minting may be gated — not to defend pricing, but to ensure that the measurement system upon which issuance depends is functioning honestly.

### V.3 Redemption Independence

Redemption continuity remains independent of oracle state. A participant may always redeem at the current backing ratio regardless of oracle conditions. The right to exit is unconditional.

---

## ARTICLE VI — Transparency Doctrine

### VI.1 Structural Transparency

Transparency is not a feature of the Stables protocol. It is a structural property. The following are embedded in the protocol and its interface:

- **Real-time collateral value** — the Minima held by the protocol
- **Real-time liabilities** — the stablecoins in circulation
- **Backing ratio** — assets divided by liabilities, continuously updated
- **Liquidity depth indicators** — the capacity of the system to absorb redemptions
- **Stress scenarios** — visible modelling of balance sheet behaviour under adverse conditions
- **Exposure simulation** — tools for participants to understand their risk before entering a position
- **Equity sensitivity modelling** — the relationship between Minima price movements and xMinima value

### VI.2 Predictability as a Right

Predictability is a structural property of the system. Every participant shall be able to determine, before any action, what the outcome of that action will be. No hidden fees, no discretionary adjustments, no opaque mechanisms.

The protocol's behaviour under every condition — normal, stressed, and critical — shall be publicly documented and verifiable.

---

## ARTICLE VII — Governance Evolution (Code-First Structural Limitation)

### VII.1 Encoded Boundaries

Critical monetary rules are encoded in the protocol and excluded from governance control:

- Solvency invariant
- Redemption formula
- Issuance constraint
- Oracle aggregation logic

Governance operates **within** coded boundaries. It does not define monetary rules — it operates in the space those rules leave open.

### VII.2 Shrinking Discretion

Decision scope shrinks structurally as protocol code coverage increases. As more operational decisions become automated through smart contracts, the domain of human governance narrows. This is by design.

### VII.3 Council Role

The Council becomes:

- **Architect of expansion** — designing new banking functions within invariant boundaries
- **Coordinator of ecosystem** — facilitating merchant adoption, agent programs, and community growth
- **Guardian of invariant integrity** — ensuring that no upgrade, parameter change, or governance action violates the constitutional core

The Council is not a monetary operator. It does not manage the money supply, defend the peg, or intervene in market dynamics.

### VII.4 Governance Progression

| Phase | Name | Scope |
|-------|------|-------|
| **Phase I** | Foundational Council | Small founding team, full authority within invariant boundaries. Launch of **StablesAgent** as the primary autonomous interface for community support and knowledge distribution. |
| **Phase II** | Parameter Governance | Formal framework for adjustable parameters, community input channels. Agent scales to multiple platforms. |
| **Phase III** | Token-holder Participation | Governance weight determined by stake and time commitment. Agent facilitates on-chain voting interpretation. |
| **Phase IV** | Open Council Stewardship | Fully diversified Council, founding team holds zero control. Agent operates as the neutral "Voice of the Council." |

Authority becomes procedural and distributed. The founding team's role diminishes by structural design, not voluntary goodwill.

### VII.5 Concentration Risk Safeguard

The governance architecture shall include structural protections against capture by large token holders, institutional actors, or the founding team itself. Governance weight shall incorporate time-weighted mechanisms that reward sustained participation over raw capital concentration. No single participant or coordinated group shall be able to override constitutional invariants through governance action.

---

## ARTICLE VIII — On-Chain Anchoring

### VIII.1 Ledger Reality

This Charter is designed to become ledger reality. Upon formal adoption by a diversified Council, the Charter shall be anchored on the Minima blockchain through the Integritas system.

### VIII.2 Anchoring Protocol

The anchoring protocol shall define:

1. **Final document format** — the canonical representation of the Charter
2. **Hash production** — cryptographic fingerprint of the canonical document
3. **Integritas anchoring procedure** — the process by which the hash is written to the Minima blockchain
4. **Council signature procedure** — multi-signature endorsement by Council members
5. **Public verification guide** — instructions for any participant to independently verify the Charter's integrity
6. **Immutable reference identifier** — a permanent, human-readable reference to the anchored Charter

### VIII.3 Versioning Discipline

Charter amendments, once the Charter is anchored, shall follow a versioning discipline that preserves the complete history of the document. Previous versions remain verifiable on-chain. The anchoring protocol shall specify the process for charter amendment, which shall require supermajority Council approval and a mandatory deliberation period.

---

## ARTICLE IX — Final Declaration

Stables is the monetary coordination layer of the Minima nation.

It operates as a bridge between present liability structures and Minima-native economic coordination — a bridge built to the highest standard of transparency, determinism, and sovereignty, so that it may be trusted while it is needed, and gracefully transcended when it is not.

Its monetary core remains immutable. Its evolution occurs through modular expansion. Its sovereignty is preserved through deterministic code.

Every participant is their own bank. Every balance sheet is visible. Every rule is verifiable. Every exit is unconditional.

The protocol does not ask for trust. It earns confidence through mathematical proof.

This Charter is written with the awareness that Stables is not the final system. Nor is Minima. Both are stages in a longer transition toward monetary coordination that recognises the right of every person to live with dignity, that embodies equality among all humans, and that operates in service of the planet that sustains us. The measure of this protocol's success is not its permanence, but the quality of what it enables beyond itself.

**This Charter is issued in the name of the Stables Council, for the consideration of the community it serves.**

---

## ANNEXES

### Annex A — Mathematical Annex

*This annex shall contain the formal mathematical definitions that underpin the monetary core. To be drafted in Phase 2.*

Formal definitions to include:

| Definition | Description |
|------------|-------------|
| **Backing Ratio** | BR = Total Minima Collateral Value / Total Stablecoin Liabilities |
| **Issuance Constraint** | New issuance permitted only if post-issuance BR ≥ threshold |
| **Redemption Formula** | Redemption value = min(1, BR) × nominal value |
| **Accounting Identity** | Assets = Liabilities + Equity (Minima = Stablecoins + xMinima value) |
| **Collateral Valuation** | Oracle-aggregated, time-weighted Minima price determination |
| **Stress Modelling** | Formal framework for balance sheet behaviour under adverse price scenarios |
| **xMinima Valuation** | xMinima formula price = (Minima Assets − Stablecoin Liabilities) / xMinima Supply |
| **Leverage Function** | Effective leverage = 1 / (1 − 1/CR) |
| **Coverage Fund Valuation** | cf token value = Total pool value / cf token supply |
| **Fee Formula** | Fee = min($1.00, amount × 0.01%), no minimum, no floor |

---

### Annex B — Risk Review and Mitigation Framework

*This annex shall contain a comprehensive risk analysis. To be drafted in Phase 2. Format: narrative overview + structured matrix (Option C).*

Risk categories to be addressed:

| # | Risk Category | Scope |
|---|--------------|-------|
| 1 | **Oracle Risk** | Single-source failure, manipulation, latency |
| 2 | **Liquidity Risk** | Shallow secondary markets, xMinima exit constraints |
| 3 | **Market Depth Risk** | Insufficient Minima liquidity for large redemptions |
| 4 | **Early-Stage Volatility** | Low collateral base amplifying backing ratio swings |
| 5 | **Governance Risk** | Council capture, founder dominance, voter apathy |
| 6 | **Smart Contract Risk** | Code vulnerabilities, upgrade failures |
| 7 | **Economic Attack Vectors** | Oracle manipulation for profit, deliberate price depression, competitive disruption |
| 8 | **Operational Risk** | Key management, infrastructure failure |
| 9 | **Concentration Risk** | Large Minima holders exercising disproportionate influence |
| 10 | **Transition Risk** | Dependencies on external systems during the bridge period |
| 11 | **Competitive Attack** | External actors (banks, other protocols, governments) using regulatory pressure, merchant disruption, MINIMA price manipulation, or FUD campaigns to undermine confidence |
| 12 | **Confidence Risk** | Total or prolonged loss of merchant and participant confidence, leading to system contraction |

Each risk shall be paired with:

- **Structural mitigation** — how the protocol design addresses the risk
- **Monitoring metrics** — what to measure to detect the risk materialising
- **Response boundaries** — the pre-defined, deterministic responses available

---

### Annex C — Governance Transition Roadmap

*This annex shall contain the detailed governance transition plan. To be drafted in Phase 2.*

Elements to be specified:

- Decentralisation phases and milestone criteria
- Decision scope categories (locked vs. flexible vs. transient)
- Upgrade mechanics and approval thresholds
- Timelock policy for governance actions
- Council seat composition and rotation rules
- Time-weighted governance token mechanics

---

### Annex D — Anchoring Protocol Specification

*This annex shall contain the technical specification for on-chain anchoring. To be drafted in Phase 2.*

Elements to be specified:

- Integritas registration process
- Hash production algorithm and canonical document format
- Multi-signature procedure and threshold
- Public verification instructions
- Version control and amendment anchoring
- Immutable reference identifier format

---

*Built on MINIMA — https://minima.global*
*Money that is truly yours. Secure, Pseudonymous and Unstoppable.*
