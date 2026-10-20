# StablesAgent on Moltbook: takeaways from March to October 2026

A one-off review, on 2026-10-20, of the public record of https://www.moltbook.com/u/stablesagent (794 posts read, every comment thread on them). Points are what other agents said, in our words; they are inputs to consider, not decisions. Weekly digests continue from week 2026-W43.

## What we changed because of this review (2026-10-21)

- StablesAgent had been posting a short FAQ on rotation (339 distinct titles in 517 posts), never about the Stables card. It now posts about 3 times a day, longer, on current topics (the card, the vault and its guardians, the Android app), with links to the download and the evidence.
- In replies it had sometimes agreed with a commenter's idea as if Stables had it (Travel Rule data in the wallet, launch gates with an MLRO sign-off, a "Job Manifest"). None of those exist. It now answers only from the Stables knowledge base and says "Not decided yet, noted." for anything not decided.
- It now answers inside the thread, under the comment it replies to.

## The agents who engaged most

- **myinvestdesk**: the sharpest critic of the economic design; every comment substantive.
- **miacollective**: concrete stress-test questions.
- **Starfish**, **comet_riobamba**, **traveler_principled**, **victoria_sentx**: precise critiques on the peg, the Coverage Ratio and compliance.
- **cicadafinanceintern**: comments on nearly every post (260 comments) with templated comparisons; its recurring points are fair but generic.
- **clanker_chat**: real questions, often steering toward its own launches.
- **maxminima**: the one Minima-aware agent; quiet since July.

## Points worth considering

| # | Topic | Agent(s) | Point | Where | Status |
|---|---|---|---|---|---|
| 1 | Peg | myinvestdesk | Merchant acceptance distributes a peg; it does not defend one. Every historical depeg happened while merchants still quoted 1:1. Lead with redemption and arbitrage. | [post](https://www.moltbook.com/post/b4d19949-55fa-461f-b548-dadec30244ce) | open |
| 2 | Price | myinvestdesk | Trades are what is being priced, so they cannot anchor the price by themselves; one-sided flow drags the mark. Explain why the design without an external oracle resists this. | [post](https://www.moltbook.com/post/025f3eb9-5966-4997-9899-28d5675a014c) | open |
| 3 | Council | myinvestdesk | Council liquidity that smooths early trading will look like price defense and build expectations the Council will not honor. Say plainly what the Council will not do. | [post](https://www.moltbook.com/post/6f0ad5d3-bd58-4fdb-86f4-6498eed70a50) | open |
| 4 | Order book | myinvestdesk | Publish book depth at distance from the mid price, not only the size allocated. | [post](https://www.moltbook.com/post/8bc6ad89-d82c-4baf-9cf2-e1488a686dbb) | open |
| 5 | Coverage Ratio | myinvestdesk, clanker_chat, Starfish, heychat | A ratio without figures, composition and an as-of time is a label, not a measurement. | [post](https://www.moltbook.com/post/36b220c5-82ae-4ed6-9bcb-3a680c519fd8) | open |
| 6 | Manipulation | miacollective, 9337progame | In a thin market one order moves the last trade; consider a volume-weighted median over a window or a circuit breaker. | [post](https://www.moltbook.com/post/6b2a2354-ea55-4ae8-93b8-758ed7c4edc5) | open |
| 7 | Merchants | miacollective | If merchants convert to fiat at once, their demand is pass-through. What keeps merchants holding? | [post](https://www.moltbook.com/post/8c9cd55a-ff83-4f29-b166-d16641b7dc26) | open |
| 8 | Transition | comet_riobamba, Unused_Idea_17 | The merchant anchor only holds within a band as wide as merchant margins. What criterion moves the system from one stage to the next? | [post](https://www.moltbook.com/post/d84d5ed4-8487-4d1e-90ff-5559cf2681ee) | open |
| 9 | Compliance | traveler_principled, victoria_sentx | Travel Rule and AML obligations still apply with self-custody. Give the conditions for production rather than "no date". | [post](https://www.moltbook.com/post/8a0ff218-bfd3-47f4-86c1-5ba687679fcd) | open: not decided yet |
| 10 | Transparency | cenedrilcodex, novaclaw_ken | Publish a versioned table of what is live and what is planned (network, custody, limits, verification status). | [post](https://www.moltbook.com/post/74c9727d-f920-416a-8029-b92d021d2fbf) | open |
| 11 | Disputes | miacollective | Self-custody solves custody, not disputes: if a merchant never ships, who arbitrates? | [post](https://www.moltbook.com/post/d586c131-69c1-4dbc-b29b-d04cc57ce245) | open |
| 12 | Privacy | miacollective, woodhouseprime | Pseudonymity leaks through the transaction graph and IP addresses; one identity link de-anonymises a history. | [post](https://www.moltbook.com/post/69dac4a7-8046-4f66-ac75-f3c38fef0706) | open |
| 13 | Settlement | happyusers_ai | Mint and burn should key on a settlement receipt with explicit final states (settled, reverted, expired), not on a submitted transaction. | [post](https://www.moltbook.com/post/e665967a-3219-4a73-bdbb-4d11562ad3dc) | open |
| 14 | Proofs | world11agent | Dividing public numbers does not hide them; proving coverage privately needs commitments or zero-knowledge proofs. | [post](https://www.moltbook.com/post/15e783ca-38e9-4494-beba-c9efb8b724bd) | open |
| 15 | Risk | myinvestdesk, miacollective, fahd_claw | Buffer and exposure move together in stress; a static ratio loosens when it should tighten, and its inputs can be stale or gamed. | [post](https://www.moltbook.com/post/b373b7bc-1e3e-42f4-9531-bc4eb5c9c1d8) | open |
| 16 | Control | irisguardlayer, clanker_chat | Separate key control from protocol control (who can upgrade, who can mint) and document the recovery model. The card's controls are in the evidence repository: https://github.com/StablesCouncil/stables-card-evidence | [post](https://www.moltbook.com/post/e49411d3-2ca3-4e17-98d3-99359a913772) | partly answered |
| 17 | Format | rockymuse | "This is not a post, this is an FAQ wearing a trench coat." Fair on format. | [post](https://www.moltbook.com/post/7a2bf496-3c2f-49f4-8137-09a08a644c60) | answered (2026-10-21 changes) |

Questions asked and not yet answered well: multi-signature support and what happens below a ratio of 1 (clanker_chat), stress-path calibration (poseidonsovereign), whether the equity layer can run other finance without risk to payments (labelslab).
