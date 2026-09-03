# Stables MiniDapp, Test channel overview (active development line)

*For StablesAgent and external AIs: what the Stables test channel is, what works on-chain today, how
a tester reaches it, and how it relates to the frozen demo and to future production. Rewritten 2026-08-01 for the xWiniwa core test; updated 2026-09-03 for the published standalone Android app (v0.0.11.38). The binding scope statement is
**`release_scope_boundary.md`**; where this document and that one disagree, that one wins.*

## What the test channel is

The **Test channel** (`dapp/3-test/`, stage `test`) is the **sole active Stables MiniDapp
development line**. The earlier Demo channel (`dapp/2-demo/`) is frozen. Production, meaning real
Minima collateral and real stablecoin issuance, is a future phase that begins only after the test
work is proven.

In the test channel:

- **Winiwa** is a practice stand-in for Minima: a real token on Minima mainnet with **no value**.
- **xWiniwa** is the equity-side test token, also real on mainnet and also with **no value**.
- The flows that ship are **fully on-chain and trustless**. The issuer created the tokens and seeded
  the covenant pools; it does not sign user transactions and does not need to be online.

It is an **early testing release**. There may be bugs and unexpected behaviour. Testers should use a
dedicated test wallet, or one holding only funds they are willing to risk. Using the app at this
stage is a testing contribution to the community and it is appreciated. The code is open for review
at `github.com/StablesCouncil/stablescouncil.github.io`; if in doubt, seek a third-party opinion.

## What ships in the first community test

- **Own node on the phone.** The standalone Stables Android app runs its own Minima node inside
  the app. Nothing else has to be installed and there is no pairing step. The **Network
  contribution** setting decides how much the phone helps run Minima on battery (Pause, Minimum,
  Balanced, Maximum); on the charger the node runs at full speed.
- **Winiwa faucet, trustless and covenant-based.** Any synced wallet with a small MINIMA signing fee
  can claim Winiwa from the on-chain faucet covenant. There is a cooldown between claims. The whole
  supply sits in the permissionless pool: there is no issuer to ask and no refill step.
- **xWiniwa mint and burn at par, trustless and covenant-based.** The user's Core node builds and
  signs an atomic transaction against the vault covenant. One Winiwa becomes one xWiniwa, and one
  xWiniwa becomes one Winiwa, in either direction. The contract enforces the rate; the app does not.
  Burns may be partial, and the remainder can be burned later.
- **Winiwa and xWiniwa send and receive**, on-chain, using native sends with the test token ids,
  including QR.
- **Honest balances and Activity.** Four proof states (Syncing, Proof unavailable, Ready, Stale),
  actions disabled until the required coins are proven, and no simulated success anywhere.
- **Support surfaces:** profile, preferences, security, help, Academy, links and feedback.

## What is deferred out of this test

Deferred means switched off in the build and unable to move funds, not cancelled:

- USDw and every other stablecoin, including all minting, burning and coverage-ratio accounting;
- the fiat display currencies (EURw, GBPw, JPYw and the rest), which have no tokens;
- trading of any kind: Trade, Exchange, Bulk Orders, order books, liquidity ladders, market pricing;
- Coverage Funds and other stablecoin-dependent investment products;
- market-priced xWiniwa issuance and forward minting, since the only rate here is par;
- merchant tools, the Ambassador program, the On/Off ramp, Treasury and Council governance surfaces.

The trading venue is owned by a separate project and returns to the Stables release only through a
later Council decision and a completed handover.

## How to access the test channel

1. **Standalone Android app, v0.0.11.38, published 2026-09-03.** Install from
   https://stablescouncil.org/payment-app/ (the Download button) or from the GitHub release
   `StablesCouncil/stables-app`, tag `app-v0.0.11.38`, file `Stables_v0.0.11.38.apk`; verify
   the SHA-256 published with the release. Install a new version over the old one and never
   uninstall: the wallet stays on the device.
2. **Coming soon:** the MiniDapp package for MinimaOS, the web build, and the Core-connected Android
   companion (for people who already run the Minima Core app). Say "coming soon"; none of these is
   downloadable today.
3. **Local development web preview.** From the repo, serve the website tree and open
   `http://localhost:8080/dapp/3-test/`. This path is for developers, not testers.

## What is new in v0.0.11.38

- **Network contribution:** choose how much the phone helps run Minima on battery (Pause, Minimum,
  Balanced, Maximum), the charger always at full speed. The app shows what the phone contributed:
  TxPoW today and in total, time online, hash rate, and a daily chart.
- The open app uses about a third of the battery it did.
- **Your notes, in your hands:** on Wallet management, each token has Manage. See the exact notes
  (the coins) behind a balance, pick the ones to combine or split, choose how many notes to end
  with, and see the transaction size against the network limit before sending.
- **Errors in plain words:** a transaction that is too large says so in kilobytes and offers Manage
  notes on the spot.
- One place for every action; a sheet closes with its Back; burn confirmations are red.
- Security page: Payment protection and Confirmation policy as two sections.
- Every step of a payment shows when it completed. Broadcasted is its own step: the receiver sees a
  payment the moment it is on the network.

## StablesAgent inside the test channel

The in-app StablesAgent opens with a short guided series covering **What works right now** (the
faucet, par mint and burn, send and receive), **Set up my bank**, and **Explore the app**. That
series is local to the app and works offline.

Free-text questions are answered by the agent on the web (https://agent.stablescouncil.org and the
Telegram bot). If no answer can be reached, the app says so rather than leaving a question
unanswered in silence.

## Relationship to Demo and Production

| Channel | Status | Token mapping | What it proves |
|---------|--------|---------------|----------------|
| **Showcase** | Legacy preview | Simulated | First UX shell |
| **Demo** | **Frozen** | Simulated Winiwa and Wables | Hardened wallet, payment protection, themes |
| **Test** | **Active development** | Real Winiwa and xWiniwa on mainnet, no value | Trustless faucet, covenant par mint and burn, on-chain sends, honest proof states |
| **Production** | Future phase | Real Minima and real stablecoins | Real value, full protocol economics |

## Safety framing for users

- Winiwa and xWiniwa have **no value**. Nothing here is money and nothing here is an investment.
- The test channel runs on **Minima mainnet**, so transactions consume real on-chain capacity and
  require a small MINIMA balance for signing fees.
- Do not send real value to test-token addresses.
- **The node, the wallet and the keys live inside the Stables app on the device. Stables never asks
  for a seed phrase or a vault key.** Anyone who asks a user for one is attacking them. Never
  uninstall the app to update it; install the new version over the old one.
- Report bugs and regressions through the in-app feedback page.
