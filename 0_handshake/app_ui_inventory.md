# Stables MiniDapp — UI inventory
**Status**: MANDATORY reference when adding/removing screens or sections.  
**Source**: `1_development/stream_1_app/prod_stables_app_v0.2.10/index.html` (+ injected HTML from `assets/routes/activity-contacts.js` where noted).  
**Companion**: `web_component_spec.md` (patterns), `handshake.md` (single executable + this map).

## How to use

| Column / term | Meaning |
|---------------|---------|
| **Page id** | `div.page` root (`id="page-…"`). |
| **Nav** | Where the user opens the screen (bottom tab, More menu, or in-flow only). |
| **Page header** | `header.app-page-header` (icon + title + sub). |
| **Section** | `app-section--caption-bottom` wrapper: `stitle-row` (`.stitle` + `agent-mini-btn`) **or** `pool-section-title` (Invest) **then** card (`app-section-card` / domain card). |
| **In-card title** | `stitle-row--in-card` **inside** a tinted box or `prop-card` (Council). |

**Rule**: Do not add per-page CSS overrides for `.stitle-row` / section stack; change the global rule in `index.html` `<style>` once.

---

## Pages (alphabetical by id)

### `page-activity` — My transactions
| | |
|--|--|
| **Nav** | More / Activity |
| **Page header** | My transactions · Search, filter, and browse my history |
| **Sections** | Filters & history → card (filters, search, `activityList`, pager) |

---

### `page-ambassador` — Ambassador
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **Ambassador** |
| **Page header** | Ambassador (no subline) |
| **Sections** | Agent row (right-aligned `agent-mini-btn` only) → card (copy, 20 Big Mac fee 50/50 protocol/ambassador, Big Mac Index link, 10 Big Mac cashback note) |

---

### `page-chat` — Chat
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Chat · Send private encrypted messages |
| **Extra** | `chatContactLabel` (hidden until contact context) |
| **Sections** | Conversation → card (messages); Send a message → card (input + send) |

---

### `page-contacts` — Contacts
| | |
|--|--|
| **Nav** | Wallet flow / More |
| **Page header** | Contacts · Browse my contacts and notes (+ Back) |
| **Sections** | My contacts → card (search, list); Contact detail → `contactDetailSection` (title row + detail card, toggled by JS) |

---

### `page-council` — Council
| | |
|--|--|
| **Nav** | More |
| **Page header** | Council · Explore council transparency and tools |
| **Extra** | — |
| **Sections** | **Stables Charter** → card; `#councilCharterLink` button → `showStablesCharterComingNotice()` (amber toast: draft on GitHub soon); Council budget → card |
| **In-card / other** | Voting power (tinted box + `stitle-row--in-card`); Current Protocol Decisions (tinted box + in-card title); **Current resolutions** plain heading; `prop-card` items (budget vote, proposals) with in-card titles; **Past resolutions** + closed `prop-card` |

---

### `page-council-comms` — Council communications
| | |
|--|--|
| **Nav** | More |
| **Page header** | Council communications · Read security, updates, and critical notices |
| **Mount** | `#councilCommsPageMount` — HTML from **`activity-contacts.js`** (`buildAppVersionBannerHtml`, `buildCouncilCommunicationsHtml`): each block uses `app-section--caption-bottom` + `stitle-row` + card |

---

### `page-exchange` — Exchange
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **Exchange**; `#exchange` |
| **Page header** | Exchange · Exchange currencies instantly |
| **Sections** | New conversion → `ex-card`; Recent exchanges → card |

---

### `page-faucet` — Get test Winiwa
| | |
|--|--|
| **Nav** | More (test) |
| **Page header** | Get Test Wiwina · Claim test tokens (no real value) |
| **Extra** | Test banner |
| **Sections** | Claim test Winiwa → card; Reset test state → card |

---

### `page-feedback` — Feedback
| | |
|--|--|
| **Nav** | More |
| **Page header** | Feedback · Reach the team on Telegram |
| **Extra** | Hint in `#feedbackApp` |
| **Sections** | Telegram → card (community + link) |

---

### `page-invest` — Invest
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Invest · My holdings, pools, and protocol tools |
| **Sections** | My holdings → `pool-section-title` + gradient `card` (not `app-section-card` on that card); tab row → **Coverage Fund** / **Liquidity Fund** panels (`pool-section-title`: Coverage fund / Liquidity fund) |
| **Panel CF** | `stitle-row` with `pool-section-title` + agent → `cp-card` |
| **Panel LP** | `stitle-row` with `pool-section-title` + agent → `lp-card` |

---

### `page-invoice` — Create Invoice
| | |
|--|--|
| **Nav** | **My shop** → section **Create Invoice**; merchant flow; Receive modal CTA; `#invoice` |
| **Page header** | Create Invoice · Request payment with a merchant QR (+ Merchant Display) |
| **Sections** | Invoice details → card |

---

### `page-mint` — Mint
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Mint · Mint and burn xWiniwa and Wables |
| **Extra** | Tab row xWiniwa / Wables |
| **Sections** | Mint & burn xWiniwa → `xwm-card`; Mint & burn Wables → `card` (panel toggle) |

---

### `page-settings-profile` — My profile
| | |
|--|--|
| **Nav** | Preferences |
| **Page header** | My profile · Council identity and avatar |
| **Extra** | Hint (StablesAgent) |
| **Sections** | Council profile → card (name, role, avatar, NFT fields, save) |

---

### `page-settings-security` — Security
| | |
|--|--|
| **Nav** | Preferences |
| **Page header** | Security · Vault key only: access to my bank |
| **Sections** | Vault key → `card--prose-centered` (seed / Security app CTA) |

---

### `page-settings-updates` — Settings and updates
| | |
|--|--|
| **Nav** | Preferences |
| **Page header** | Settings and updates · Package, theme, display, addresses, sync |
| **Extra** | Vault key hint |
| **Sections** | App updates → card; Appearance & behaviour → card; Display → card; Wallet addresses → card; Sync preferences → card |

---

### `page-my-shop` — My shop
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **My shop**; Shops tab CTA → `my-shop`; legacy hash `#shop-ambassador` → `my-shop` |
| **Page header** | My shop · List your business, invoices, and merchant tools |
| **Sections** | Your shop on Stables → card; **Create Invoice** → card (🧾 row → `invoice`) |

---

### `page-spend` — Shops
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Shops · Merchants accepting Wables |
| **Extra** | Centered CTA · List my shop / Become an ambassador → `my-shop`; search input |
| **Sections** | Cafés & Food → card (merchant rows); Retail → card |

---

### `page-treasury` — Treasury
| | |
|--|--|
| **Nav** | More |
| **Page header** | Treasury · Analyse the community's treasury (chest icon) |
| **Sections** | How the protocol stands → `treasury-snap-card`; **System liability structure** → card (`liabDist*`); Simply ALM + stress test → card (stress slider: Winiwa USD price **above** slider, **MEXC** spot via `refreshWiniwaSpotFromMexc` / `MEXC_TICKER_URL`, `#winiwaSpotPriceSource`; `%` row under slider) |

---

### `page-wallet` — Wallet (home)
| | |
|--|--|
| **Nav** | Bottom tab (default) |
| **Page header** | *None* (hero card is focal) |
| **Sections** | Balance & actions → card (`w-hero`, send/receive); Currencies → card (primary + list + show more); Recent activity → card (`walletRecentList` filled by **`activity-contacts.js`**) |

---

## Pattern quick reference

| Pattern | Classes / markup |
|---------|------------------|
| Section + card + agent | `app-section app-section--caption-bottom` → `stitle-row` → `.stitle` + `agent-mini-btn` → card with `app-section-card` (or domain card class) |
| Invest pool label + agent | Same wrapper; `pool-section-title` inside `stitle-row` instead of `.stitle` |
| Title inside tinted / proposal box | `stitle-row stitle-row--in-card` at **top** of box → `stitle-inline` / `stitle-inline--sm` + `agent-mini-btn` |
| Screen chrome | `app-page-header` / `app-page-header--faucet` |
| Welcome step 0 — showcase notice | `#welcomeShowcaseIntroBody` + class `welcome-modal-showcase-intro` (tokens `--fz-showcase-intro`, `--lh-showcase-intro`, amber `#fbbf24`). Spec: `web_component_spec.md` § showcase preview notice. |
| Welcome — web vs MiniDapp (before currency) | `#welcomeShowcaseCopy` + `welcome-modal-showcase-intro` (amber); `copy.en.showcase`; `goWelcomeFromShowcaseRoute('web'|'node')` → `welcomeStepCurrencies`. |
| Welcome — currency step intro | `#welcomeCurrencyIntro` + `welcome-modal-body-copy` (primary text `var(--t)`); `copy.en.currencySetupIntro`. |

---

## SPA mirror (`stables_spa`)

| Route | Status |
|-------|--------|
| `/` | Dev home |
| `/wallet` | Feature `WalletPage` (sections use `SectionWithCaption`) |
| `/activity`, `/council`, `/settings` | Placeholders |

Keep `SectionWithCaption` and shared CSS aligned with this inventory and `web_component_spec.md`.

---

## Global chrome (not `page-*`)

| Surface | `id` / mechanism | Role |
|---------|------------------|------|
| Floating actions | (FAB `<button>` nodes have **no** stable `id`) | Wallet / scanner — wired in JS |
| More menu | `drawer` (`dback`) | `openMore()` / `closeMore`; **Shops & Exchange**: Ambassador (“Open ambassador program & showcase fees”), My shop, Exchange (3 rows); **Test tools**: single `.drawer-test-faucet-card` (Testing Phase Only + Get Test Wiwina → `navigate('faucet')`); top `drawer-lang-bar` + globe |
| Merchant fullscreen | `merchantDisplay` | Pay display; close sets `display='none'` |
| Portfolio simulator | `simDrawer` (`dback`) | `closeSim`; opened from Invest (JS) |
| Toast | `toast` | `showToast()`; optional `{ prose: true }`; `tone: 'amber'` (charter notice); optional `centerScreen` |

---

## Buttons: every `<button>` with `id`

Sorted by `id`. **Most** primary actions use `<button>` **without** `id` (Send/Receive from hero, FABs, drawer rows, many Council controls). For those, search `index.html` by label or `onclick`, or the relevant `assets/routes/*.js` file.

| `id` | Context | Handler / label (short) |
|------|---------|---------------------------|
| `actCcyFilterEURw` | `page-activity` | `setActivityCcyFilter('EURw')` |
| `actCcyFilterUSDw` | `page-activity` | `setActivityCcyFilter('USDw')` |
| `actFilterAll` | `page-activity` | `resetActivityFilters()` · All |
| `actFilterHidden` | `page-activity` | `setActivityFilter('hidden')` |
| `actFilterIn` | `page-activity` | `setActivityFilter('in')` |
| `actFilterOut` | `page-activity` | `setActivityFilter('out')` |
| `activityMoreBtn` | `page-activity` | `showNextActivityPage()` · See next 25 |
| `activityPrevBtn` | `page-activity` | `showPrevActivityPage()` · ◂ Previous 25 |
| `actSortAmount` | `page-activity` | `setActivitySort('amount_desc')` |
| `actSortDate` | `page-activity` | `setActivitySort('date_desc')` |
| `balHideBtn` | `page-wallet` | `toggleBalHide()` |
| `budgetVoteBtn` | `page-council` | `submitBudgetVote()` (starts disabled) |
| `ccyEditPen` | `page-wallet` | Edit currency order (pen control) |
| `contactShopBtn` | `page-contacts` | `openSelectedContactShop()` · Shop profile |
| `iTabCF` | `page-invest` | `setInvestTab('cf')` · Coverage Fund |
| `iTabLP` | `page-invest` | `setInvestTab('lp')` · Liquidity Fund |
| `privToggle` | `recvModal` | `togglePrivacy()` · 🔒 Auto |
| `shapeBidAsk` | `page-invest` (LP) | `setLpShape('bidask')` |
| `shapeCurve` | `page-invest` (LP) | `setLpShape('curve')` |
| `shapeSpot` | `page-invest` (LP) | `setLpShape('spot')` |
| `showMoreCcy` | `page-wallet` | `toggleMoreCcy()` |
| `tab-invest` | Bottom nav | `navigate('invest')` |
| `tab-mint` | Bottom nav | `navigate('mint')` |
| `tab-more` | Bottom nav | `openMore()` |
| `tab-spend` | Bottom nav | `navigate('spend')` |
| `tab-wallet` | Bottom nav | `navigate('wallet')` |
| `vIssue` | `page-mint` | `setVTab('issue')` · Mint Wables |
| `vXwm` | `page-mint` | `setVTab('xwm')` · Mint xWiniwa |
| `welcomeExploreBtn` | `welcomeSetupModal` | `setWelcomeTourChoice('explore')` · last in tour list |
| `welcomeMerchantBtn` | `welcomeSetupModal` | `setWelcomeUseCase('merchant')` |
| `welcomeNerdTrackFinanceBtn` | `welcomeSetupModal` | `setWelcomeNerdTrack('finance')` |
| `welcomeNerdTrackTechBtn` | `welcomeSetupModal` | `setWelcomeNerdTrack('tech')` |
| `welcomePersonalBtn` | `welcomeSetupModal` | `setWelcomeUseCase('personal')` |
| `welcomeShowcaseHereBtn` | `welcomeSetupModal` | `goWelcomeFromShowcaseRoute('web')` · Keep exploring in this web app |
| `welcomeShowcaseNodeBtn` | `welcomeSetupModal` | `goWelcomeFromShowcaseRoute('node')` · Access MiniDapp package for my node |
| `welcomeTourPersonBtn` | `welcomeSetupModal` | `setWelcomeTourChoice('person')` · 1st in tour list |
| `welcomeTourShopAmbassadorBtn` | `welcomeSetupModal` | `setWelcomeTourChoice('shop_ambassador')` · 2nd in tour list |
| `welcomeTourMerchantBtn` | `welcomeSetupModal` | `setWelcomeTourChoice('merchant')` |
| `welcomeTourNerdBtn` | `welcomeSetupModal` | `setWelcomeTourChoice('nerd')` |
| `welcomeUnderstandBtn` | `welcomeStepShowcaseIntro` (inside `welcomeSetupModal`) | `goWelcomeFromShowcaseIntro()` · I understand |

---

## Modals and overlays (root `id`)

| `id` | Type | Purpose | Typical open | Typical close |
|------|------|---------|--------------|---------------|
| `sendModal` | `mback` | Send payment | Wallet / `openSendModal` (JS) | `closeModal('sendModal')` |
| `recvModal` | `mback` | Receive + address + privacy toggle | `openReceiveModal` / `switchSendReceive` | `closeModal` / leave flow |
| `seedSecurityAppModal` | `mback` | Warn before Minima Security app | `openModal('seedSecurityAppModal')` (Security) | `closeModal('seedSecurityAppModal')` · backdrop |
| `seedSecurityComingModal` | `mback` `z-index:640` | Amber “coming version” notice after **Continue** | `openSeedPhrase()` → `openModal` | **OK** · backdrop |
| `qrModal` | `mback` | Scan to pay (demo) | From send modal QR / scan helpers | `closeModal('qrModal')` |
| `agentActionModal` | `mback` | Activity / transaction detail shell | `openAgentActionModal` (JS) | `closeAgentActionModal()` · backdrop |
| `welcomeSetupModal` | `mback` | Steps: showcase intro → lang/welcome → tour (or nerd sub-step) → **web vs MiniDapp** → **currencies** + Save (`applyWelcomeSetup` closes; node path opens zip after) | Auto-open on load / Help → tours | `closeWelcomeSetup()` · backdrop |
| `seedPhraseSecurityModal` | `mback` | Vault key backup gate | ~300ms after welcome close → **`startVaultSecurityModalCountdown()`** (amber `#vaultSecurityReminderCountdown` + `VAULT_SECURITY_MODAL_DELAY_MS`, default 15s) → `scheduleSeedPhraseSecurityModal()`; `#vaultBackupReminderMeta` explains delay | `closeSeedPhraseSecurityModal()` · backdrop |
| `vaultHelpChoiceModal` | `mback` | Agent vs Telegram security help | `openVaultHelpChooser()` | `closeModal('vaultHelpChoiceModal')` |
| `merchantDisplay` | fullscreen `div` | Merchant pay screen | JS toggles display | Close Display |
| `drawer` | `dback` | More menu | `openMore()` | `closeMore` |
| `simDrawer` | `dback` | Portfolio simulator | Invest (JS) | `closeSim` |
| `toast` | `.toast` / `.toast--prose` / `.toast--center-screen` | Short messages; prose + `centerScreen` = viewport-centred multi-line | `showToast(...)` | implicit timeout |

**Injected UI**: Council comms / wallet activity cards may add markup from `assets/routes/activity-contacts.js` — not in static `index.html`. When that script defines modals or id’d controls, add rows here.

---

## Related: `id` on interactive non-`<button>` controls

| `id` | Location | Role |
|------|----------|------|
| `themeToggle` | Settings (`page-settings`) | `toggleTheme()` |
| `merchantToggle` | Settings | `toggleMerchant()` |
| `privacyToggle` | Settings | `togglePrivacy()` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-19 | Shops & Exchange (was Payments & Trade): `page-ambassador`, `page-my-shop`, `exchange`; Create Invoice section on **My shop**; `#shop-ambassador` → `my-shop`. |
| 2026-03-19 | Welcome language: globe + `appLangMenuWelcome` (no “Language” label); hidden `#welcomeLang` select; drawer top `drawer-lang-bar` + `#drawerLangGlobeBtn`. |
| 2026-03-19 | `welcome-modal-showcase-intro` pattern row; amber + `--fz-showcase-intro` (see `web_component_spec.md` v1.3). |
| 2026-03-19 | Welcome flow: `welcomeStepShowcaseIntro` + `welcomeUnderstandBtn` before `welcomeStepLang`. |
| 2026-03-19 | Showcase step: `#welcomeShowcaseCopy` amber (`welcome-modal-showcase-intro`); action-oriented MiniDapp button + copy; Ambassador page/drawer headlines trimmed. |
| 2026-03-19 | Welcome order: web/MiniDapp choice **before** currency step; `#welcomeCurrencyIntro` (body copy, not amber); `goWelcomeFromShowcaseRoute`; `applyWelcomeSetup` opens zip only when node route was chosen. |
| 2026-03-19 | Vault: Minima Security modal copy uses you/your; `seedSecurityComingModal` (amber, OK + backdrop) replaces toast for “coming version” after Continue. |
| 2026-03-19 | Council: **Stables Charter** section + GitHub link via `STABLES_CHARTER_URL` (`runtime-config.js`); `syncCouncilCharterLink()` on boot and when opening Council. |
| 2026-03-19 | Vault backup modal: `VAULT_SECURITY_MODAL_DELAY_MS` (15s) + `startVaultSecurityModalCountdown` banner + `#vaultBackupReminderMeta` on the modal. |
| 2026-03-19 | Council: drop Treasury hint + liability block (moved to **Treasury**); charter → amber toast (draft soon). Treasury: MEXC spot for stress price (`MEXC_TICKER_URL`, `SIM_Winiwa_PRICE`); simulator copy tweaks. |
| 2026-03-19 | More drawer: `.drawer-test-faucet-card` merges “Testing Phase Only” banner + Get Test Wiwina row into one tappable amber card. |
| 2026-03-19 | Invest tabs: **Liquidity Fund** (was Provide Liquidity); LP panel `pool-section-title` **Liquidity fund**; primary LP CTA **Deposit to Liquidity Fund**. |
| 2026-03-19 | Full tables: every `<button id>`, every modal/overlay root `id`, global chrome, settings toggles. |
| 2026-03-22 | Initial inventory + handshake link to single `<style>` source. |
