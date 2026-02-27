# Stables App — Navigation Architecture

**Version**: 1.1 | **Date**: 2026-02-25 | **Status**: Updated after review

---

## Top Bar (Sticky, always visible)

| Element | Label | Detail |
|---|---|---|
| Left | Stables logo + wordmark | Taps → Home (Wallet) |
| Centre | _(empty)_ | — |
| Right | 🟢 Synced `·1,234,567` | Green dot + number, no "block" word. Taps → connection details modal |
| Right (testing) | 🧪 `Test Mode` pill | Amber pill when in test mode. Taps → Faucet shortcut |

> No price pill, no wallet address in top bar — these live inside the Wallet page.

### 📷 Floating QR Scan Button
- Persistent camera icon (bottom-right, above nav bar) visible on **every screen**
- Tap → open camera/QR input
- Scans merchant payment request → jumps straight to Send confirmation with amount pre-filled
- This makes paying at a merchant: **scan → confirm = 2 taps from anywhere**

---

## Bottom Navigation (5 tabs, fixed)

```
[ 💼 Invest ] [ 🔄 Exchange ] [ 💳 Wallet ] [ 🏭 Factory ] [ ⋯ More ]
```

Wallet is the default landing tab (centre).

---

## Page Roles & Contents

### 💳 Wallet ← DEFAULT HOME
**Role**: Daily driver. Everything you need to pay, receive, and check your money.

**Contents**:
- Total balance (in user's default currency)
- Currency breakdown list (USDs, EURs, CADs, GBPs…) — tap row → detail
- **3 primary action buttons**: `Send` · `Receive` · `Exchange` (shortcut to Exchange tab)
- Recent transactions feed
- Wallet address (tap to copy — labelled "My Account ID", expandable)

---

### 💼 Invest
**Role**: Put money to work. Earn yield or hold a growth position.

**Contents**:
- **Savings Pools** (Coverage Fund tokens): deposit USDs/EURs → earn transaction fee yield. Shown as: "Pool Share · 3.2% APY (30-day)"
- **Growth Position** (xMINIMA): no liquidation risk. Framed as: "Leveraged exposure to Minima. Your position can't be liquidated — but liquidity may vary."
- Pool balances + projected earnings
- Deposit / Withdraw actions per pool
- Progressive disclosure: "How does this work?" → expandable explainer

---

### 🔄 Exchange
**Role**: Convert between currencies. Primary use: swap USDs ↔ EURs before travelling.

**Contents**:
- From / To currency selectors (all available stablecoins + MINIMA)
- Amount input + live rate display (e.g. "1 USD = 0.918 EUR")
- Fee indicator (tiny, non-scary)
- `Exchange Now` CTA
- Rate history (small sparkline)
- Recent exchanges list

---

### 🏭 Factory
**Role**: Create or remove your own money. Convert MINIMA reserve → stablecoins and back.

**Contents**:
- **Issue** tab: "Turn your MINIMA into spending money" → select currency, enter amount, see how much you get, confirm
- **Reclaim** tab: "Convert back to MINIMA" → burn stablecoins
- **Reserve Strength** bar (Coverage Ratio, not labelled as such): shown as a percentage fill bar. States:
  - 🟢 **Fully Backed** — >150% CR 
  - 🟡 **Well Backed** — 110–150%
  - 🔴 **Issuance Paused** — <110% (no negative connotation, just a system gate)
- Progressive disclosure: "What is this?" → explainer
- MINIMA balance shown clearly

---

### ⋯ More
**Role**: Everything else. Discovery, community, technical depth.

**Behaviour**: Tapping More expands into a full-screen navigation panel showing ALL sections — not just a list page. Think: an app drawer that reveals everything.

**Sections (vertical list with icons)**:
1. 🗺️ **Where to Spend** → Merchant directory (searchable, map/list view)
2. 💬 **Chat** → P2P encrypted messaging over the Minima network (private, no server)
3. 👥 **Contacts** → Address book (web2 names map to account IDs behind the scenes)
4. 🏛️ **Council** → Governance proposals, vote
5. ℹ️ **About Stables** → Protocol info, "Built on MINIMA", links
6. 📝 **Feedback** → Bug reports, suggestions
7. ─────────────────────────────────
8. 🧪 **Test Tools** ← isolated below hard divider + amber **TESTING PHASE ONLY** banner
   - **Get Test Funds** (Faucet)
   - Reset test balances

---

## Task Analysis — Minimum Click Paths

**UX rule**: count from any screen. Bottom nav = 1 tap to reach that tab.

| Task | Steps | Clicks |
|---|---|---|
| **Send money** | Wallet → `Send` → enter address/scan → amount → Confirm | **3** |
| **Receive money** | Wallet → `Receive` → share QR | **2** |
| **Check balance** | Tap Wallet tab | **1** |
| **Exchange currencies** | Exchange tab → set from/to → amount → `Exchange Now` | **3** |
| **Find a merchant** | More → Where to Spend → search/browse | **2** |
| **Pay at merchant** | Scan QR (from any screen) → confirm amount → Send | **2** (QR shortcut) |
| **Deposit to Savings Pool** | Invest tab → select pool → amount → `Deposit` | **3** |
| **Issue new stablecoins** | Factory tab → Issue tab → amount → Confirm | **3** |
| **Reclaim MINIMA** | Factory tab → Reclaim tab → amount → Confirm | **3** |
| **See wallet address** | Wallet → tap "My Account ID" → copy | **2** |
| **Get test funds** | More → Test Tools → `Get Test Funds` | **2** |
| **Vote on governance** | More → Council → open proposal → vote | **3** |

---

## Language Rules (Web2 only in primary UI)

| ❌ Avoid | ✅ Use |
|---|---|
| Blockchain / on-chain | _(omit)_ |
| Smart contract | _(omit from primary UI)_ |
| Coverage Ratio | System Health |
| Mint / Burn | Issue / Reclaim |
| xMINIMA leverage | Growth Position |
| r-Token / cfToken | Savings Pool Share |
| Coverage Ratio | Reserve Strength |
| System Health | Reserve Strength |
| Wallet address | My Account ID |
| Block number | _(just a number next to sync dot, no label)_ |
| Faucet | Get Test Funds |
| Swap | Exchange |
| Stablecoin | _(just the currency name: "USDs")_ |

---

## Progressive Disclosure Principle

Every advanced feature has a "How does this work?" tap → modal with full explanation.  
Deep technical data (wallet address, tx hash, block height) is always accessible — just one tap away, never in the way.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Coverage Ratio label | **Reserve Strength** (Fully Backed / Well Backed / Issuance Paused) |
| More tab behaviour | Full-screen nav drawer showing all sections |
| QR scan shortcut | ✅ Floating button, visible on all screens |
| Chat | P2P encrypted, over Minima network, no server |
| Where to Spend | Inside More (full drawer makes it equally accessible) |
| Factory label | **TBD** — options below |

## Factory Tab Name — Options

| Option | Vibe | Notes |
|---|---|---|
| **Vault** | Premium, secure | Implies "where your MINIMA is stored" — turn it into money |
| **Reserve** | Banking, formal | Matches "Reserve Strength" language |
| **Forge** | Craft, create | Slightly technical but memorable |
| **Convert** | Neutral, web2 | Risk of confusion with Exchange |
| **Issue** | Banking, precise | Clean but dry |
| **Open** | Simple, action | "Open a position" — very web2 but vague |

→ **Recommendation**: **Vault** — it implies security, ownership, and the act of unlocking value. A Vault is where your MINIMA lives; you open it to issue stablecoins.

---

## Open Questions for Charles

1. Should **Where to Spend** be a standalone 6th tab, or is it fine inside More? (Could argue it's important enough to be primary nav)
2. **QR scan shortcut** — should there be a camera/scan button in the top bar or floating, so paying at a merchant is instant from any screen?
3. **Chat** — is this P2P encrypted messaging within the Stables network, or something else?
4. **Factory label** — "Factory" is technically correct but slightly jargony. Would "Issue" work as the tab label, or keep Factory?
