# Stables MiniDapp — Demo channel overview (current build)

*For StablesAgent and external AIs: what the Stables demo is, what works, how to access it, and the safety framing. Current as of demo **v0.0.0.1.0**.*

## What the demo is

The **Demo Channel** (label **v0.0.0.1.0**) is the current Stables MiniDapp build, the channel after the earlier Showcase preview. The Showcase is being phased out; point users to the Demo.

It is an **early testing release**. There may be bugs and unexpected behavior. Users should only connect a wallet holding **funds they are willing to lose**. Using the app at this stage is a **testing contribution to the community**, and it is appreciated. The code is fully open for review at `github.com/StablesCouncil/stablescouncil.github.io`; if in doubt, seek a third party opinion.

## What already works

- **Native Minima send and receive are real and on-chain** when the user's Minima node is connected, exactly like the live network. This includes single and multi-recipient sends.
- **The QR scanner works well**: Receive shows the user's QR; Send scans a code to fill the address instantly. Inside MinimaOS the scanner uses the native camera (a file-input capture) because the in-app WebView can block direct camera access.
- **Stables (Wables like CADw, EURw) are illustrative** in this build, not yet live on the blockchain. Minting and burning flows run as a demo against test Winiwa from the Faucet.

## Two ways to access the demo

1. **MinimaOS install (recommended).** Download the MiniDapp package (`Stables_v0.0.0.1.0.mds.zip`) from the Links page or `stablescouncil.org/dapp/latest-version/` and install it on the node, then open Stables from the hub. Set the MiniDapp to **write mode** for StablesAgent, feedback, and network features.
2. **Web version.** Open `stablescouncil.org/dapp/2-demo/` in a browser and connect it to a running Minima node. This can be easier for the QR code reading function. To connect: accept the node's certificate first, then enter the Node URL and Session UID. Get the Session UID from the node's MDS URL (`uid=` value) on desktop, or by running `mds` in the Minima terminal on mobile. The node must be started with `-rpccors`.

The public website homepage and the Links page both open a first-release disclaimer before launching, with these two options.

## StablesAgent inside the demo

The in-app StablesAgent opens with a short welcome and three paths: **What works right now** (live send/receive and QR), **Set up my bank** (choose display currencies and name your bank), and **Explore the app** (wallet, investing, merchants, technical). Section ⓢ icons give contextual explanations. The flow always offers a next step.

## Merchant and Ambassador features (demo, illustrative)

- **My shop** unlocks via a Merchant toggle at the top of the page. A merchant builds one **Brand** (name, category, specialities, description, contact, links) plus a list of **Locations**, each with its address, hours, delivery toggle, **Merchant Cash Exchange** opt-in, and its own receive address.
- **Links** are auto-detected from a pasted URL (X, Instagram, Facebook, TikTok, YouTube, WhatsApp, Telegram, LinkedIn, Google Business).
- **Ambassadors** onboard merchants under the **16 Big Mac** program (independent listing 16 BM; mentored via an ambassador 15 BM, of which the ambassador earns 8 BM, a mentor 1 BM, the rest to the Council Treasury). A merchant can delegate setup to their ambassador with a secure one-time **onboarding grant** (in production a signed Minima coin over Maxima end-to-end encryption; the shop only goes live after the merchant's own signature).

All merchant, ambassador, and Stables figures in the demo are illustrative. Native Minima transactions are real.
