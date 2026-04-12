# What could back an unstoppable stablecoin forever?

*A personal research note by Charles, April 2026*

*This started as a community debate and turned into a rabbit hole. I am sharing my thinking here, not as a final answer, but as a contribution to the discussion. I do not pretend to know the truth better than anyone else. We are early. Let's discuss all this together. It is a key element that needs to be addressed before we move to the next phase, the testing phase, because this will be set in stone and made immutable.*

---

## The question

Stables is being built as an unstoppable banking system. The stablecoin inside it is backed by Minima. Recently, people in our community have started asking: should we consider diversifying the asset base?

It is a fair question. Any system backed by a single asset carries concentration risk. If that asset drops in value, the system is under stress.

But here is the harder question underneath that one:

**If we were to add a second asset to the Treasury, what would it have to be to not make the system weaker?**

That is what I set out to answer.

---

## The criteria

Before listing assets, I need to define what I am looking for. For an asset to be added to an unstoppable stablecoin system, it must pass three tests simultaneously.

**Test 1: No Middleman**
The asset must be able to exist and move without requiring a bank, a custodian, a vault, a broker, a lawyer, or any third party to hold or authorise it. The moment you need someone else to hold the asset on your behalf, that person can be pressured, can fail, or can refuse. That is a stop button.

**Test 2: Not Seizable**
The asset must be impossible to freeze, confiscate, or block by any government, court, or regulator. History shows that anything that can be seized will eventually be sought. If there is a stop button, someone will press it.

**Test 3: Autonomous Entry**
The asset must be able to enter and leave the Stables system without a human being making a decision in the middle of that transaction. No oracle committee. No watchdog. No relayer. No multisig. The verification must be purely mathematical.

**A note on the bar: it never comes down.**
If an asset passes two tests and fails one, it does not qualify. There is no partial credit. There is no "good enough." The moment we say "this is probably fine" or "the risk is small," we have introduced a stop button. We prefer to hold Minima only, forever, rather than lower these standards by a single degree.

**One more rule: accepted assets are hard-coded at the protocol level.**
The Council cannot vote to add or remove an asset from the treasury. No governance decision, no proposal, no majority can change the base collateral after launch. This is intentional. Any system where humans can decide to add new collateral types is a system where humans can be pressured into doing so. The assets accepted are embedded in the protocol code, immutable by design. This point matters and I will return to it at the end.

Now let us go through everything.

---

## The full audit

### Category 1: Physical Assets and Energy

**Energy (electricity, heat, mechanical power)**

Energy deserves a serious treatment because it is the most fundamental form of value in the physical universe. Physics tells us that everything material ultimately reduces to it. It powers every transaction, every computation, every human activity. It has a real, measurable price in every market on earth. So the question is serious: could energy serve as collateral for an unstoppable treasury?

The oracle problem is fatal here. To bring energy into a digital treasury, you need to measure it. A kilowatt-hour produced, a joule stored, a unit consumed. That measurement requires a sensor, a meter, a grid connection. Someone builds and maintains that sensor. That person or company is a stop button. They can be pressured to report false numbers, shut down, or legally compelled to freeze a certificate.

Tokenised energy credits exist today. Renewable energy certificates, carbon credits, power purchase agreements. All of them depend on institutional registries and regulator recognition. All fail Test 1 and Test 2.

You also cannot hold energy passively. It dissipates. Storing it requires batteries, flywheels, hydrogen, or other physical infrastructure. That infrastructure requires maintenance, ownership, and physical access. More custodians. More stop buttons.

Some might argue that Proof of Work mining is essentially "energy made digital": miners burn electricity to produce valid computation, and the result is embedded in the chain. This is the most elegant existing bridge between physical energy and digital value. But PoW mining still requires hardware that can be seized or banned, and mining rewards create a targetable professional class. The bridge remains broken.

**Result on Energy: fails Test 1, Test 2, and Test 3.**

**Gold, silver, and precious metals**

Gold is the oldest store of value on earth. Scarce, durable, globally recognised. But it fails Test 1 immediately. You need someone to store it. A vault. An institution. A country. That someone can be raided, sanctioned, or coerced. Tokenised gold moves the problem rather than solving it. The token is only as real as the custody arrangement behind it.

**Real estate and land**

Registered in government databases, taxed by governments, transferred through notaries and courts. Entirely dependent on institutional infrastructure. Fails Test 1 and Test 2.

**Commodities**

Oil, wheat, copper, lithium. Physical commodities require storage, transport, and counterparty arrangements. All intermediaries. All stoppable. Tokenised versions carry the same underlying risk plus a contract layer on top.

**Result on Physical Assets: all fail Test 1 and Test 2.**

---

### Category 2: Institutional Assets

**Fiat currency**

Fiat exists entirely within the banking system. It can be frozen by executive order within hours. It is the most seizable asset in existence. Stablecoins backed purely by fiat inherit all of these risks, plus smart contract risk on top.

**Stocks and equity**

Shares exist in registries controlled by central depositories. They can be suspended, delisted, diluted, or made worthless by executive decision. Tokenised equities add a digital wrapper to a fundamentally seizable underlying.

**Bonds and debt instruments**

Legal contracts enforceable by courts. By definition, they require institutional infrastructure to have any meaning.

**Result on Institutional Assets: all fail Test 2. Most fail Test 1.**

---

### Category 3: Human Assets

**Labor and time**

Human work is arguably the most fundamental form of value alongside energy. Everything material we have ever created started as someone's labor. But to bring human labor into a digital treasury, someone has to verify that the work was done. That verifier makes a decision. That decision is a human in the loop. Until there is a purely mathematical way of verifying human contribution without a trusted intermediary, this category fails Test 3.

**Intellectual property**

Registered, licensed, and enforced by legal systems. Entirely institutional. Fails Test 1 and Test 2.

**Attention and reputation**

These have value in the modern economy but cannot be verified on-chain without an oracle. Fails Test 3.

**Result on Human Assets: fail Test 3. Most also fail Test 1 and Test 2.**

---

### Category 4: Native Blockchains (Layer 1s)

This is where it gets interesting, because digital assets were specifically invented to remove middlemen. But as we will see, most of them have reintroduced intermediaries through the back door. We will start with the base layers, the native blockchains themselves.


**Privacy coins (Monero, Zcash, and similar)**

This is the most important nuance in the entire audit. Privacy coins require a careful distinction between two very different things: seizure of individual funds and seizure of the network itself.

On the first, privacy coins like Monero perform genuinely well. Ring signatures, stealth addresses, and confidential transactions make it extremely difficult to trace who owns what. If you hold Monero and have your seed phrase in your head, proving that you own specific funds is a serious cryptographic challenge for any attacker.

But Test 2 asks whether the network itself can be stopped, not just whether individual coins are traceable. At the network level, privacy coins still have miners, developers, and identifiable contributors. Governments have repeatedly shown they can pressure networks not by seizing coins directly but by targeting infrastructure: exchanges delist under regulatory pressure, miners face legal restrictions, developers face prosecution. Privacy hides the data. It does not stop the network.

Zcash has a further structural problem: formal legal entities control protocol development and receive a portion of the block reward. These entities can be legally compelled to act. The cryptography is impressive. The institutional layer is a stop button.

On Test 3, both Monero and Zcash lack a smart contract layer capable of supporting a trustless bridge. Any integration requires a custodian or a group of signers. This is a hard fail.

**Result on Privacy Coins: pass Test 2 at the individual asset level, fail Test 2 at the network level, fail Test 3.**

**Layer 1 Proof of Work blockchains**

Bitcoin and similar PoW chains have a genuine claim to being unseizable and having no middleman in their core operation. The private key is the only thing that matters. No institution needs to authorise a transfer.

But PoW mining is competitive. Mining rewards create a professional class of miners who are distinct from users and who can be targeted. The history of mining has shown repeatedly that hash power concentrates into pools and industrial operations in specific jurisdictions. A dominant pool is a stop button.

**Bitcoin Layer 2s and sidechains**

The Bitcoin ecosystem has built an entire layer of scaling solutions on top of the base chain: payment channels, sidechains, and hybrid constructions. The question deserves a direct answer: are any of these trustlessly bridged to external chains?

Not yet, as of today.

Payment channel networks are the most trust-minimised approach. They use Bitcoin's own scripting to enforce channel closures mathematically. But routing through multiple channels introduces counterparty risk at each hop, and some form of online monitoring is required to catch fraud. This is a soft dependency.

Most Bitcoin sidechains use a federated peg: a named group of organisations controls a multisig holding the locked Bitcoin. That group can be targeted, pressured, or legally compelled. This fails Test 2.

Newer research approaches aim to replace federations with cryptographic proofs that Bitcoin can verify natively. This is genuinely promising work. As of today, no production-ready, trustless, permissionless Bitcoin bridge to an external chain passes our Test 3. The research is moving in the right direction. It has not arrived.

**Result on PoW and Bitcoin L2s: fail Test 3. PoW fails the "no competitive class" principle.**

**Layer 1 Proof of Stake blockchains**

Proof of Stake replaces the energy race with a capital race. Those who stake the most tokens have the most influence over validation. This directly ties network control to wealth. Over time, staking concentrates into a small number of entities. Many PoS chains have foundations with formal legal addresses that can be legally targeted. Some chains have demonstrated the ability to reverse or block transactions under external pressure. This is not theoretical.

**Result on PoS: fail Test 2.**

**DAG-based networks**

Directed Acyclic Graph architectures attempt to remove sequential block production entirely.

IOTA has evolved through several architectures. Its current form relies on a reputation-based weight system to elect committees for consensus, and it has a formal legal foundation entity. A committee is a group of identifiable entities that can be targeted or pressured. Fails Test 2.

Nano has no miners and no staking rewards. Pure, feeless currency. But Nano has no smart contract layer. No trustless bridge to Minima is possible. Fails Test 3.

Obyte has smart contracts and no mining rewards. Its bridge protocol uses game theory instead of trusted validators, but requires human watchdogs to monitor for fraud and intervene during a challenge period. Watchdogs are humans. Humans can be coerced, bribed, or absent. Fails Test 3.

**Result on DAG networks: fail at Test 2 or Test 3.**

**Fully Homomorphic Encryption (FHE) blockchains**

Fully Homomorphic Encryption (FHE) allows computation to be performed on encrypted data, meaning validators can process transactions without ever seeing the underlying values. This provides extraordinary privacy. Projects in this space are building chains where your balance, your transaction amount, and your counterparty remain encrypted throughout processing.

Does this solve our problem?

It solves the data visibility question. It does not solve the censorship question. FHE chains, as they exist today, still rely on consensus mechanisms to order and include transactions. Validators can still refuse to include specific transactions. They cannot see the data, but they can exclude a transaction from a block based on its origin or other metadata. Privacy does not equal unstoppability.

Additionally, decryption on FHE chains uses a threshold system where a minimum number of validators must cooperate. This is more secure than a single key. But it still relies on a group of humans who can be legally compelled.

The bridges connecting FHE chains to the outside world today are mostly federated or custodial. Trustless bridge research for FHE chains is nascent.

**Result on FHE chains: fail Test 2 and Test 3 as of today.**

**Zero-Knowledge (ZK) evaluation**

Following the audit of DAGs and FHE, I have also reviewed the role of ZK-proofs. While many ZK-Rollups exist today, they fail the Three Hard Tests because they rely on "Sequencers" and "Provers" - centralized infrastructure that can be ordered to stop processing specific users.

The only mechanism that passes our criteria is **Client-Side ZK**, where the mathematical proof of a transaction is generated locally on your own sovereign hardware. Stables will integrate this ZK logic to run directly on your own hardware. By leveraging the local node provided by Minima, we can ensure the mathematical proof of your transaction is calculated locally on your device. This ensures that no middleman or gatekeeper can ever block your capacity to trade, as the power to generate and validate the transaction proof remains entirely within your sovereign node.

**Agent-centric networks**

Holochain takes the most radical approach: no global ledger. Each user maintains their own chain. Validation is local between participants. This makes it extremely difficult to stop. But a stablecoin requires a single, globally agreed-upon state of who owns how much. Holochain's architecture does not support this. Architecturally incompatible.

---

### Category 5: Tokens and Smart Contracts

If a native blockchain fails our tests, could a token built on top of it pass?

The answer is unfortunately no. A token inherits all the vulnerabilities of its host chain, and then adds new ones.

**Tokenised versions of physical, institutional, and human assets**

These are the digital wrapper around every category already listed in Categories 1, 2, and 3. A tokenised asset inherits all the risks of its underlying real-world collateral, plus the risks of its host blockchain, and then adds new risks: the smart contract can be exploited, the issuer can be pressured, and the bridge between the real world and the chain is always a human making a decision. Tokenisation does not remove the stop button. It adds layers to it.

**Meme coins and speculative tokens**

No underlying utility, no scarcity by design, no governance immutability. Most have teams or deployers who retain admin control over supply or contract logic, creating a stop button at Test 1. Most are issued on platforms with identifiable legal entities, failing Test 2. And none have a trustless mechanism to interact with the treasury, failing Test 3. They fail all three tests, not for any other reason.

**NFTs and digital collectibles**

Each NFT has a different value, a different liquidity profile, and cannot be substituted for another. A protocol cannot systematically back a stablecoin against a collection of unique objects because it cannot price them consistently. When a user mints, the protocol needs to know exactly how much collateral backs that position. With NFTs, every unit requires individual appraisal to determine its value. That appraisal requires a human decision-maker. That human is a middleman, and a middleman is a stop button. NFTs fail Test 1 before they fail anything else.

**Synthetic and derivative tokens**

On-chain representations of bets on other assets. DeFi positions, yield tokens, wrapped derivatives. These inherit the risks of the underlying asset and add layers of smart contract complexity. More complexity means more attack surface. There is always an oracle somewhere telling the contract what the underlying asset is worth. That oracle is a human decision-maker. Fails Test 3.

---

## The last candidate standing

After passing every asset class on earth through three tests, the audit produces a very short list.

The only architecture that satisfies all three tests simultaneously is one where:

- Every user is a validator with equal standing.
- There is no competitive reward for validation, so no professional class can form.
- Every node runs on mobile hardware, meaning no hardware infrastructure can be targeted or restricted.
- Assets transfer through purely mathematical mechanisms that require no human decision.
- There is no foundation, no admin key, and no mechanism by which any governance body can modify the protocol.

As of today, **Minima** is the only network I can find that satisfies this definition.

No miners. No stakers. No reward for winning. Every user does a proportional share of work for their own transaction. The network is secured by the aggregate of all users, not by a class of professionals. Every user runs a full validating node on a smartphone. Asset transfers use Hash Timelock Contracts: a purely mathematical mechanism where the chain itself verifies the exchange. No human oracle, no watchdog, no relayer needed. No foundation holds override power. No admin key. No upgrade path that can be weaponised.

---

## The conclusion

The conclusion of this analysis is uncomfortable in its simplicity: **there is currently no other asset in the world that can be added to the Stables Treasury without introducing a stop button somewhere.**

Every class fails at least one test:

| Asset Class | Test 1 (No Middleman) | Test 2 (Not Seizable) | Test 3 (Autonomous Entry) |
| --- | --- | --- | --- |
| Physical assets and energy | Fail | Fail | Fail |
| Institutional assets | Fail | Fail | Fail |
| Human labor | Fail | Conditional | Fail |
| Native Blockchains (L1) | Pass | Conditional or Fail | Fail |
| Tokens and Smart Contracts | Fail | Fail | Fail |
| Minima | Pass | Pass | Pass |

We do not lower the bar. If the conclusion of a rigorous audit is that only one asset qualifies, then only one asset is accepted.

---

## What could change this

If another asset were ever to be integrated, it would need to pass all three tests with a production-ready, audited, and battle-tested trustless bridge to Minima. No speculation. No "this will probably be fine." Full verification.

**But here is what must be understood clearly. That decision cannot happen after launch.**

The accepted assets are hard-coded at the protocol level and are immutable once the protocol enters its test phase. This is not a policy. It is architecture. No Council vote, no community proposal, no majority, no pressure of any kind can add or remove an asset from the list after that point. The code does not accept arguments.

If a second asset ever qualifies, the window to include it closes at the start of the test phase. After that, the original Stables protocol is fixed. A fork of Stables could be created with different collateral rules. The original would remain unchanged. The fork would be a different system, not an evolution of this one.

This is intentional. The value of an immutable system comes precisely from the fact that it cannot be changed, even when someone makes a compelling argument that it should be. The pressure to "just add one more thing" is exactly the mechanism by which unstoppable systems are made stoppable over time.

---

## One more thought

The most philosophically interesting failures in this audit are energy and human labor. They are the two most fundamental forms of value in the physical world. Everything we have ever built required both. And we cannot yet bring either into an unstoppable digital system without a human verifier in the loop.

The day someone solves the mathematical proof of physical energy contribution without a trusted oracle, and the day someone solves the proof of human contribution without a trusted auditor, the rules of this audit change. Those are the frontiers worth watching.

---

*Charles, April 2026*
*Personal research, not an official Stables Council position.*
*All feedback welcome.*
