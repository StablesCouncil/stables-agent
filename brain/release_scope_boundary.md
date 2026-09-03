# Stables first community test: what is in scope and what is not

*Authoritative scope boundary for StablesAgent and external AIs. Written 2026-08-01 for the xWiniwa core test (`TV81-P12-XR1`, decisions `TV81-D23` and `TV81-D24`); updated 2026-09-03 when the standalone Android app became the first published artifact. If any other
document in this knowledge base describes a capability as available and this document says it is
deferred, **this document wins.** Every statement below is about what a tester can actually do.*

## The one-line answer

The first Stables community test is the **xWiniwa core**: claim Winiwa from an on-chain faucet, mint
it into xWiniwa at one for one, burn xWiniwa back to Winiwa, and send or receive both. Trading,
stablecoins, investing products and merchant tools are **not part of this test** and are switched off
in the build.

## What a tester can do

- Install the **standalone Stables Android app** (v0.0.11.38); it runs its own Minima node on the phone.
- Claim **Winiwa** from the on-chain faucet covenant.
- **Mint** Winiwa into **xWiniwa** at par, one for one, through the on-chain vault covenant.
- **Burn** xWiniwa back into Winiwa at the same par rate, in whole or in part.
- **Send and receive** Winiwa and xWiniwa using Minima addresses or a QR code.
- Read honest balances, honest transaction states, and an Activity record.
- Use the profile, preferences, security, help, Academy, links and feedback pages.

## What is NOT in this test

None of the following is available to a tester, and none of it can move funds in this build. Each
one is deferred by decision `TV81-D23`, not cancelled.

Each bullet repeats the boundary on purpose, so that no single statement can be read out of context.

- **USDw and every other stablecoin are not part of this test.** You cannot mint USDw, burn USDw, or
  hold it in this release. There is no launch price, no uniform seed and no pooled coverage-ratio
  accounting. USDw is not offered as a wallet asset, a send option, a mint asset or an activity
  filter. It is deferred, not cancelled.
- **The fiat display currencies are not part of this test.** EURw, GBPw, JPYw, CADw, AUDw, CHFw,
  CNYw, VNDw, TRYw and the rest do not exist as tokens, cannot be sent to a friend, cannot be
  received, and are not shown anywhere in the release build. If someone asks to send EURw or GBPw,
  the honest answer is that those currencies are not available in this test at all.
- **Trading of any kind is not part of this test.** There is no Trade page, no Exchange, no Bulk
  Orders, no order book, no liquidity ladders and no market pricing in this release. You cannot
  place an order, fill an order, cancel an order or swap one asset for another. The trading venue is
  deferred to a separate project and a later Council decision.
- **The `xWiniwa/Winiwa` and `USDw/Winiwa` markets are not part of this test.** Neither market is
  reachable in the release build.
- **Coverage Funds are not part of this test.** You cannot deposit into a Coverage Fund, you cannot
  withdraw from one, and it pays nothing to anyone today. The same is true of every other
  stablecoin-dependent investment product. Nothing in this release is a yield or return opportunity.
- **Market-priced xWiniwa issuance and forward minting are not part of this test.** The only rate in
  this release is par, one for one.
- **Merchant tools and the Ambassador program are not part of this test.** You cannot list a shop,
  onboard a merchant, run a campaign, or earn from listings in this release. The Ambassador economy
  is designed and documented, but it is not shipped software and there is nothing to join today. The
  On/Off ramp, Treasury and Council governance surfaces are deferred in the same way.

If a user asks for any of these, say plainly that it is not part of this test release, that the
design work exists and is preserved, and that it returns only through a later Council decision.

## The assets are valueless

**Winiwa and xWiniwa are test tokens with no value.** They are real tokens on Minima mainnet, so the
transactions are real and consume real chain capacity, but the tokens themselves are not money, are
not an investment, and are not redeemable for anything. Nobody should send real value to a
test-token address. A tester needs a small amount of real MINIMA to pay signing fees.

- Winiwa token id: `0xd4f5dd3546f25d327cbf2b6867e193ce5db6491ac9c65bbdcecaca1a6688063f`
- xWiniwa token id: `0xefa53eff58616ddbdf0b6d6dbb4e18f041c4509fb3db3b7e5482b99abc72f127`
- Faucet covenant: `0x5e08c5dcd965b9460c4734dc6113ae747c98dfec31b13feadf5805d464f49930`

## How the app reaches the chain

The first published artifact is the **standalone Stables Android app** (v0.0.11.38, published
2026-09-03). It runs **its own Minima node inside the app**, on the phone.

- Install from **https://stablescouncil.org/payment-app/** (the Download button) or from the GitHub
  release **StablesCouncil/stables-app, tag app-v0.0.11.38**, file `Stables_v0.0.11.38.apk`.
  Verify the SHA-256 published with the release before installing an APK from anywhere else.
- Nothing else has to be installed. There is no pairing step, no RPC address and no RPC password:
  if a user is being asked for one, they are not on the standalone app.
- **The node, the wallet and the keys live inside the Stables app on the device.** Install a new
  version over the old one; **do not uninstall**, the wallet stays on the device. Stables never asks
  for a seed phrase or a vault key. Anyone asking a user for one is attacking them.
- **Network contribution** is a setting in the app: how much the phone helps run Minima while on
  battery (Pause, Minimum, Balanced, Maximum). On the charger the node always runs at full speed.
  The app shows what the phone contributed: TxPoW today and in total, time online, hash rate, and a
  daily chart.
- Because the app runs the node, it holds the Android network permission the node needs.

**Coming soon, not available today:** the MiniDapp package for MinimaOS, the web build, and the
Core-connected Android companion that talks to the separately installed Minima Core app. Say
"coming soon" for these; do not describe them as downloadable.

## Balances tell the truth or say nothing

A figure appears only once the app has proven the exact coins from the chain. Until then it reads
one of four states, and the matching action stays switched off:

- **Syncing** while the app is still reading.
- **Proof unavailable** when the required coins cannot be proven from this node.
- **Ready** when the exact coins are proven.
- **Stale** when the data is older than it should be.

A blank is honest where a zero would be a lie. Send, Claim, Mint and Burn are disabled until the
coins they depend on are proven. If a user reports a missing number, that is usually the app being
truthful about proof, not a bug.

## Status of the release itself

**Stables v0.0.11.38 for Android is published** (2026-09-03): GitHub release
`StablesCouncil/stables-app` tag `app-v0.0.11.38`, and the Download button on
https://stablescouncil.org/payment-app/. It is an early test build for the existing Minima community.
It is **not** a stablecoin launch, not a trading release, not a complete Stables protocol launch, and
not a production-readiness claim. Bugs are expected. Testers should use a wallet holding only value
they are willing to risk. Report problems through the in-app feedback page.

If asked whether the release is out: yes, for the standalone Android app; the MiniDapp package, the
web build and the Core-connected companion follow later. Do not claim anything beyond what the
Council's official channels have announced.
