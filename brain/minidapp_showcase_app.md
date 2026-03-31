# Stables MiniDapp — Showcase build (v0.01.01)

*Last updated: 2026-03-31 — aligns with active development in `prod_stables_app_v0.01.01`.*

This section is for StablesAgent and external AIs when users ask about the **current Stables app preview** (Showcase / MiniDapp), how to open it, and how feedback works.

## 1. What it is

- **Stables v0.01.01** is the **active Showcase / development** MiniDapp: wallet-style UI, demos, StablesAgent hooks, and **More → Feedback** (structured public submissions). It is a **preview**: copy and flows evolve quickly; not a final production release.
- **Frozen older UIs** (for example v0.2.x) live in archive folders in the repo; **do not** describe them as the current app unless the user explicitly asks about history.

## 2. Where to open it

- **Web (Showcase):** The public site **https://stablescouncil.org/** promotes **Test the showcase**, which opens **https://stablescouncil.org/dapp/** (Showcase entry). The GitHub Pages site may also host the same build under the Council’s `stablescouncil.github.io` tree when published.
- **Minima node (phone or desktop):** Install the MiniDapp package **`Stables_v0.01.01.mds.zip`** (version in the filename matches the build). The zip contains the **contents** of the app folder at the root (not a nested folder), per the packaging rule in the repo `build/README.md`.

## 3. MiniDapp list: write mode vs read mode

- On a **Minima node**, each MiniDapp can run in **read mode** or **write mode**.
- For Stables Showcase, **write mode** is required for features that use the node network: **StablesAgent**, **structured feedback** (HTTP POST via the node), and similar. If the user only sees failures for those features, ask them to set Stables to **write mode** (not read mode) in the MiniDapp list.

## 4. Structured feedback (More → Feedback)

- The form posts **public** JSON to the Council feedback API (default **`https://agent.stablescouncil.org/api/feedback`**, configurable via app `FEEDBACK_SUBMIT_URL` / `runtime-config`). Submissions are intended for a **public GitHub ledger**; the UI requires **consent** and warns against secrets.
- **On a normal browser (no Minima):** the app may use **`fetch`** to that URL.
- **On a Minima node (MiniDapp):** the app uses **`MDS.net.POST`** so the request goes through the **node** (avoids browser CORS limits). The node must be **online** and the MiniDapp in **write mode**.
- **Community alternatives (always valid):** **Telegram** — **https://t.me/stablescommunity** — and the **public GitHub feedback folder** linked from the app for “see what others sent.”

## 5. Known issues (Showcase)

- **Structured feedback on some mobile nodes:** As of late March 2026, **some users report that structured feedback does not complete** on the node even when messages/errors display correctly (toast text was improved to wrap on small screens). **Workaround:** use **Telegram** or GitHub for urgent feedback; engineering is **continuing to debug** node/API delivery.
- Do **not** promise a fixed date in chat unless the Council has published one.

## 6. StablesAgent inside the app

- When **`MDS`** (Minima) is present, opening StablesAgent may use the **system browser** for the chat URL configured in the app; behaviour matches the Showcase build notes in `runtime-config` / in-app copy.

## 7. One-line answers for users

- **“Where is the Showcase?”** → **https://stablescouncil.org/dapp/** (and the **Test the showcase** button on stablescouncil.org).
- **“Which zip for my node?”** → **`Stables_v0.01.01.mds.zip`** (current dev Showcase).
- **“Feedback won’t send on my phone node.”** → Set MiniDapp to **write mode**, stay **online**; if it still fails, use **Telegram** (**t.me/stablescommunity**) until the next fix ships.
