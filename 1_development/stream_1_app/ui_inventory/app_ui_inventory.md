# Stables MiniDapp — UI inventory
**Status**: MANDATORY reference when adding/removing screens or sections.  
**Source**: **Showcase** **`dapp/1-showcase/index.html`** (with **`dapp/assets/`**) · **Demo** **`dapp/2-demo/index.html`** (+ injected HTML from `assets/routes/activity-contacts.js` where noted). **Default for new UI:** demo tree unless the change is showcase-only. **Router:** `0_handshake/minidapp_version.md`.  
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

### `page-ambassador` — Ambassadors
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **Ambassadors** |
| **Page header** | Ambassadors (no subline) |
| **Sections** | Agent row → card: simplified listing model; shop listing **16 Big Mac®** + listing for Ambassadors **16 Big Mac®**; retrocession split when listed Ambassadors perform onboarding; CTA button **Become an ambassador** → plain welcome message + Telegram join button **Join the discussion** |

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
| **Sections** | **Stables Charter** (📜 scroll icon in `stitle--with-emoji`) → card; `#councilCharterLink` button → `showStablesCharterComingNotice()` → `stablesCharterComingModal` (amber sheet; 📜 + title, no brand eyebrow); Council budget → card |
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
| **Sections** | New conversion → `ex-card` (+ **Provide liquidity** CTA to `invest` LP panel); **Recent exchanges** → `#exchangeRecentList` filled by **`activity-contacts.js`** (`DEMO_EXCHANGES`); rows open **`openExchangeDetail`** → `agentActionModal` (same pattern as transaction details; **Use same pair** → `repeatExchangeFromDetail`) |

---

### `page-onoff-ramp` — On/Off Ramp
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **On/Off Ramp** |
| **Page header** | On/Off Ramp · Paper money to Stables, and back |
| **Sections** | **Where MINIMA trades** → card (MEXC, BitMart, XT.COM + Minima DEX on-chain); **On-ramp (paper money → Stables)** → 4-step flow + inline Bridge/DEX route (`mxusd.global` + `minimask.org/dex/public`); **Off-ramp (Stables → paper money)** → 4-step flow + inline Bridge/DEX route |

---

### `page-faucet` — Get Winiwa
| | |
|--|--|
| **Nav** | More |
| **Page header** | Get Winiwa · Acquire Winiwa to mint Wables tokens |
| **Extra** | None (testing copy removed) |
| **Sections** | Claim Winiwa → card; Reset balances → card |

---

### `page-feedback` — Feedback
| | |
|--|--|
| **Nav** | More |
| **Page header** | Feedback · Structured public feedback & Telegram (`app-page-header__sub`) |
| **More drawer (Help → Feedback)** | `ddesc`: same subtitle as page header (Structured public feedback & Telegram) |
| **Extra** | `#feedbackApp` filled by `assets/routes/feedback.js` (`renderFeedbackPage`) |
| **Sections** | **Public feedback (GitHub)** → amber disclaimer; structured fields; optional Minima + contact; consent; **Send** → `POST` target from `getFeedbackSubmitUrl()` (localhost/`127.0.0.1` → `http://127.0.0.1:8788/api/feedback` unless `FEEDBACK_SKIP_LOCAL_SUBMIT`; else `FEEDBACK_SUBMIT_URL`, default `https://agent.stablescouncil.org/api/feedback`). Success `#feedbackSubmitResult`. **See what others sent** → `FEEDBACK_PUBLIC_DB_URL`. **Telegram** → `#feedbackTelegramMain`. |
| **Schema** | `assets/data/feedback_submission.v1.schema.json` (v1 payload shape for public repo) |

---

### `page-invest` — Invest
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Invest · My holdings, pools, and protocol tools |
| **Sections** | Tab row → **My investment** / **Coverage fund** / **Liquidity funds** / **Maximize** (`iTabMI` / `iTabCF` / `iTabLP` / `iTabMX`). **My investment**: portfolio summary + **My available balances**. **Maximize** (`panelMX`): stake MINIMA via official Minima MiniDapp; outbound links. **Coverage fund** (`pool-section-title`): **Last 30 days perf** (30d metrics + `cfMonthChart` / `cfNavLineOverlay` + `cfDaySlider`; under-chart `cfFeesDay` / `cfYieldDay` only); **Historical performance** (`cfHistChart` / `cfHistNavOverlay`, `cfHistFoot`); **Fund composition** + token/NAV grid; deposit/withdraw. **Liquidity funds** LP panel: **current liquidity by bucket**, **Add liquidity**, CTA to Exchange. Top **My holdings** removed (simulator drawer). |
| **Panel CF** | `stitle-row` with `pool-section-title` + agent → `cp-card` |
| **Panel LP** | `stitle-row` with `pool-section-title` + agent → `lp-card` |
| **Panel MX** | `stitle-row` **Stake MINIMA** + agent → `cp-card` (Maximize / hub links) |

---

### `page-invoice` — Create Invoice
| | |
|--|--|
| **Nav** | **My shop** → **Create Invoice** + **Webshop linking & QR**, **Merchant API kit** (webhooks block hidden for now); merchant flow; Receive modal CTA; `#invoice` |
| **Page header** | Create Invoice · Request payment with a merchant QR (+ Merchant Display) |
| **Sections** | Invoice details → card |

---

### `page-mint` — Mint
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Mint · Mint and burn xWiniwa and Wables |
| **Extra** | Tab row xWiniwa / Wables |
| **Sections** | **Mint xWiniwa** panel: Mint & burn xWiniwa → `xwm-card`; under **Mint xWiniwa** button, `xwmLeverageChart*` (Winiwa USD, xWiniwa USD, Leverage ×); Mint & burn Wables → `card` (panel toggle) |

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
| **Page header** | Security · `app-page-header__sub`: Vault key: only access to your funds |
| **More drawer (Preferences → Security row)** | `ddesc`: Vault key: the only access to your bank |
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

### `page-settings-legal` — Legal & notices
| | |
|--|--|
| **Nav** | **Community** (More drawer) · ⚖️ **Legal & notices** |
| **Page header** | Legal & notices · Terms, privacy, data, security · Council property |
| **Sections** | Terms of Service (summary): Council IP, reproduction must credit **StablesCouncil** as original author; Price oracles (Winiwa + Wables demo); Privacy (summary); Data use (summary); Security (summary) + CTA → `settings-security`. Official Council properties moved to **Help → All links** (`help-links`). |

---

### `page-help-links` — All links
| | |
|--|--|
| **Nav** | **Help** (More drawer) · 🔗 **All links** |
| **Page header** | All links · Official Council properties |
| **Sections** | Official Council properties: domains (**stablescouncil.org**, `stablescouncil.github.io`, `agent.stablescouncil.org`), GitHub orgs, emails (**StablesCouncil@protonmail.com**, **StablesCouncil@gmail.com**), social/telegram/discord list + link to `stablescouncil.github.io/links.html` |

### `page-my-shop` — My shop
| | |
|--|--|
| **Nav** | More / Shops & Exchange · **My shop**; Shops tab CTA → `my-shop`; legacy hash `#shop-ambassador` → `my-shop` |
| **Page header** | My shop · List your business, invoices, and merchant tools |
| **Sections** | Your shop on Stables → card (regional **Ambassador** for listing help; **fully listed** → same privileges as Ambassador + onboard others; pointer to Ambassador page for registration paths); **Create Invoice** → card (🧾 row → `invoice`); **Webshop linking & QR** → card (QR/payment link payload: address, amount, currency, order ref; demo QR box; StablesAgent mini); **Merchant API kit** → card (integration kit copy + **StablesCouncil** GitHub link; preview, no live API); **Pay in Stables sticker** → printable card (asset `shop_sticker_minimal_v0.0.01.png`); **Webhooks & callbacks** → in `index.html` but **hidden** (`display:none` on section) until merchant settings; re-enable by removing that style |

---

### `page-spend` — Shops
| | |
|--|--|
| **Nav** | Bottom tab |
| **Page header** | Shops · Merchants accepting Wables |
| **Extra** | Two CTAs · **List my shop** → `my-shop` · **Become an ambassador** → `ambassador`; search input |
| **Sections** | Cafés & Food → card (merchant rows); Retail → card |

---

### `page-treasury` — Treasury
| | |
|--|--|
| **Nav** | More |
| **Page header** | Treasury · Analyse the community's treasury (chest icon) |
| **Sections** | How the protocol stands → `treasury-snap-card`; **System liability structure** → card (`liabDist*`); **Concentration & trading depth** → card (`treasuryConc*` xWiniwa / Winiwa / `treasuryVol*` MEXC 24h); Simply ALM + stress test → card (stress: **Winiwa price (USD)** `#minimaPriceNow` → `#minimaPriceSim` (6 dp) + `#winiwaSpotPriceSource`; **Price change (slider)** line only (no side `%`); row `#treasuryPriceAtMin30` / `#treasuryPriceAtZero` / `#treasuryPriceAtPlus30` **above** the track; `#treasurySliderThumbPrice` **above** thumb on track, `#treasurySliderThumbPct` **below**; `.treasury-slider-pct-row` (‑30% / 0 / +30%) **below** track; `#protocolSlider` in `.treasury-slider-input-shell`; `calcSlider` uses `priceSlider` \|\| `protocolSlider`; live spot + optional 24h volume via `refreshWiniwaSpotFromMexc` / `MEXC_TICKER_URL` (24hr ticker) / config) |

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
| Top bar sync pill | `#syncNum` inside `.sync-pill` | **MDS**: `MDS.init` → `MDS.cmd('status')` every ~2.2s → `response.response.chain.block` (real height); `.sync-pill--placeholder` removed. **No MDS** (after short wait): text **Only in node** (no fake height); `.sync-pill--placeholder` (muted, no green dot). Tooltip explains MiniDapp host. |
| Floating actions | (FAB `<button>` nodes have **no** stable `id`) | Wallet / scanner — wired in JS |
| More menu | `drawer` (`dback`) | `openMore()` / `closeMore`; **Shops & Exchange**: Ambassador, My shop, Exchange, On/Off Ramp; **Messages & Contacts**: Chat, Contacts, Council communications; **Community**: Council, **Legal & notices** ⚖️ (`settings-legal`), Treasury; **Preferences**: My profile, Settings and updates, Security; **Help**: Guided tours, StablesAgent, Feedback; **Faucet**: `.drawer-test-faucet-card` (Get Winiwa → `faucet`); top `drawer-lang-bar` + globe |
| Merchant fullscreen | `merchantDisplay` | Pay display; close sets `display='none'` |
| Portfolio simulator | `simDrawer` (`dback`) | `closeSim`; opened from Invest (JS) |
| Toast | `toast` | `showToast()`; optional `{ prose: true }`; `tone: 'amber'`; optional `centerScreen` |

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
| `ccyEditPen` | `page-wallet` `stitle-row-actions` (beside agent) | Edit currencies: reorder (drag), enable/disable (`+`/`−`), set main currency (★ on each row); active currencies sorted to top while editing |
| `contactShopBtn` | `page-contacts` | `openSelectedContactShop()` · Shop profile |
| `iTabCF` | `page-invest` | `setInvestTab('cf')` · Coverage Fund |
| `iTabLP` | `page-invest` | `setInvestTab('lp')` · Liquidity funds |
| `iTabMX` | `page-invest` | `setInvestTab('mx')` · Maximize (stake MINIMA) |
| `iTabMI` | `page-invest` | `setInvestTab('mi')` · My investment |
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
| `welcomeShowcaseHereBtn` | `welcomeSetupModal` | `goWelcomeFromShowcaseRoute('web')` · Keep exploring in this app |
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
| `seedSecurityAppModal` | `mback` `z-index:640` | **Combined** amber modal: coming version + Vault key / Seed phrase safety + community line | `openModal('seedSecurityAppModal')` (Security) · `openSeedPhrase()` | **OK** · backdrop |
| `stablesCharterComingModal` | `mback` `z-index:640` | Amber modal (same chrome as `seedSecurityAppModal`); header 📜 + **Stables Charter** (no “Stables” eyebrow); first draft on **GitHub** over **coming weeks** | `showStablesCharterComingNotice()` · Council **Read the Charter on GitHub** | **OK** · backdrop |
| `qrModal` | `mback` | Scan to pay (demo) | From send modal QR / scan helpers | `closeModal('qrModal')` |
| `agentActionModal` | `mback` | Activity / transaction detail shell | `openAgentActionModal` (JS) | `closeAgentActionModal()` · backdrop |
| `welcomeSetupModal` | `mback` | Steps: showcase intro → lang/welcome → tour (or nerd sub-step) → **web vs MiniDapp** → **currencies** + Save (`applyWelcomeSetup` closes; node path opens zip after) | Auto-open on load / Help → tours | `closeWelcomeSetup()` · backdrop |
| `seedPhraseSecurityModal` | `mback` | Vault key backup gate | ~300ms after welcome close → **`startVaultSecurityModalCountdown()`** (silent delay `VAULT_SECURITY_MODAL_DELAY_MS`, default 60s) → `scheduleSeedPhraseSecurityModal()` | `closeSeedPhraseSecurityModal()` · backdrop |
| `vaultHelpChoiceModal` | `mback` | Agent vs Telegram security help | `openVaultHelpChooser()` | `closeModal('vaultHelpChoiceModal')` |
| `merchantDisplay` | fullscreen `div` | Merchant pay screen | JS toggles display | Close Display |
| `drawer` | `dback` | More menu | `openMore()` | `closeMore` |
| `simDrawer` | `dback` | Portfolio simulator | Invest (JS) | `closeSim` |
| `toast` | `.toast` / `.toast--prose` / `.toast--center-screen` | Short messages; prose + `centerScreen` = viewport-centred multi-line | `showToast(...)` | implicit timeout |

**Injected UI**: Council comms / wallet activity / **exchange recent list** (`#exchangeRecentList`) may be filled from `assets/routes/activity-contacts.js` — not all rows live in static `index.html`. When that script defines modals or id’d controls, add rows here.

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
| 2026-03-19 | **Legal & notices** (`page-settings-legal`): More → **Community** (⚖️); **stablescouncil.org** + github.io + agent subdomain in-app. **Exchange** recent list: `activity-contacts.js` → `openExchangeDetail` / `repeatExchangeFromDetail`. |
| 2026-03-19 | **Ambassador copy simplification**: listing economics clarified (shop listing 16 Big Mac®; Ambassador listing 16 Big Mac®), with concise retrocession explanation and updated drawer text. |
| 2026-03-19 | **Ambassador CTA**: added **Become an ambassador** button on `page-ambassador`; opens modal: “All these parameters will be discussed within the community…” + Telegram join button (`AMBASSADOR_TOPICS_TELEGRAM_URL`). |
| 2026-03-19 | **Merchant rating framework scaffold**: `activity-contacts.js` adds signed/onchain-ready review schema, spend-weighted scoring, anti-spam guards (minimum spend + cooldown), and links from transaction detail, contacts, shop profile, and Shops cards. |
| 2026-03-19 | **Ambassador** / **My shop** copy: regional Ambassadors for listing; fully listed → same privileges + onboard others; Ambassador registration **8 Big Mac®** or via **first shop** (preview); merchant **16 Big Mac®** 50/50 kept on Ambassador page. |
| 2026-03-19 | Shops & Exchange (was Payments & Trade): `page-ambassador`, `page-my-shop`, `exchange`; Create Invoice section on **My shop**; `#shop-ambassador` → `my-shop`. |
| 2026-03-19 | **My shop**: **Webshop linking & QR**, **Merchant API kit** (GitHub org link); **Webhooks & callbacks** markup retained but **hidden** (`display:none`); drawer **My shop** ddesc: webshop kit (preview). |
| 2026-03-19 | Welcome language: globe + `appLangMenuWelcome` (no “Language” label); hidden `#welcomeLang` select; drawer top `drawer-lang-bar` + `#drawerLangGlobeBtn`. |
| 2026-03-19 | `welcome-modal-showcase-intro` pattern row; amber + `--fz-showcase-intro` (see `web_component_spec.md` v1.3). |
| 2026-03-19 | Welcome flow: `welcomeStepShowcaseIntro` + `welcomeUnderstandBtn` before `welcomeStepLang`. |
| 2026-03-19 | Showcase step: `#welcomeShowcaseCopy` amber (`welcome-modal-showcase-intro`); action-oriented MiniDapp button + copy; Ambassador page/drawer headlines trimmed. |
| 2026-03-19 | Welcome order: web/MiniDapp choice **before** currency step; `#welcomeCurrencyIntro` (body copy, not amber); `goWelcomeFromShowcaseRoute`; `applyWelcomeSetup` opens zip only when node route was chosen. |
| 2026-03-19 | Vault: `seedSecurityAppModal` single combined message (coming version + seed safety + community); `seedSecurityComingModal` removed. Wallet: `ccyEditPen` in `stitle-row-actions` beside agent. |
| 2026-03-19 | Council: **Stables Charter** section + GitHub link via `STABLES_CHARTER_URL` (`runtime-config.js`); `syncCouncilCharterLink()` on boot and when opening Council. |
| 2026-03-19 | Vault backup modal: `VAULT_SECURITY_MODAL_DELAY_MS` (default 60s); no countdown banner; no `#vaultBackupReminderMeta` line. |
| 2026-03-19 | Council: drop Treasury hint + liability block (moved to **Treasury**); charter → amber toast (draft soon). Treasury: MEXC spot for stress price (`MEXC_TICKER_URL`, `SIM_Winiwa_PRICE`); simulator copy tweaks. |
| 2026-03-19 | More drawer: `.drawer-test-faucet-card` merges “Testing Phase Only” banner + Get Test Wiwina row into one tappable amber card. |
| 2026-03-19 | Mint / Exchange / Invest alignment: removed **Reserve Status** block from **Mint Wables** (Treasury is single source); Exchange **Provide liquidity** button opens `invest` LP panel; LP naming unified to **Liquidity funds** with base selector `#lpBaseCcy` (Winiwa). |
| 2026-03-19 | LP UX pass: `#lpBaseCcy` now includes all currencies; graph labelled as current bucket liquidity; add-liquidity form separated below; LP includes direct CTA to open the selected pair on Exchange. |
| 2026-03-19 | Invest cleanup: removed top **My holdings** block; holdings view consolidated in simulator drawer titled **My bank holdings**. |
| 2026-03-19 | Invest tabs: **Liquidity Fund** (was Provide Liquidity); LP panel `pool-section-title` **Liquidity fund**; primary LP CTA **Deposit to Liquidity Fund**. |
| 2026-03-19 | Full tables: every `<button id>`, every modal/overlay root `id`, global chrome, settings toggles. |
| 2026-03-22 | Initial inventory + handshake link to single `<style>` source. |
| 2026-03-22 | Top bar `#syncNum`: **live** `chain.block` via `MDS.init` + `status` poll when MDS present; else showcase anchored estimate after brief wait. |
| 2026-03-22 | Treasury Winiwa spot: `refreshWiniwaSpotFromMexc` tries **MEXC** via `MDS.net.GET` (MiniDapp), then browser MEXC, then **CoinGecko** (`COINGECKO_MINIMA_URL` optional); updates `#minimaPriceNow` / `SIM_Winiwa_PRICE` / `RATES.Winiwa.USDw`. |
| 2026-03-22 | More drawer: **Community** section moved to immediately follow **Messages & Contacts** (before Preferences, Help, Faucet). |

| 2026-03-25 | Faucet / Winiwa: renamed menu card + page to **Get Winiwa** (removed testing banner/copy); Mint page now explains Winiwa->tokens conversion and links to **On/Off Ramp** for MINIMA acquisition; On/Off Ramp on-ramp now links to `faucet`. |
| 2026-03-22 | Top bar: **Only in node** when no MDS (no simulated block); `.sync-pill--placeholder`. Treasury stress: Winiwa price stack **above** `%` row, then slider. |
| 2026-03-22 | Treasury stress: Winiwa **6 dp** (`fmtWiniwaUSD6`); USD tick row above track; **%** tick row (`.treasury-slider-pct-row`) below track; thumb `#treasurySliderThumbPrice` above axis / `#treasurySliderThumbPct` below; removed `#protocolSliderPct`; `calcSlider` falls back to `#protocolSlider`. |
| 2026-03-30 | **Source path** → `prod_stables_app_v0.01.01/` (see `minidapp_version.md`). |
| 2026-03-31 | **Source path** → `prod_stables_app_v00.00.00.00.03/` (was `prod_stables_app_v00.00.02/`); v0.01.01 frozen to `3_archive/.../prod_stables_app_v0.01.01/`; `CHANGELOG.md` in active folder for release notes. |
| 2026-04-01 | Invest: **Maximize** tab (`panelMX`, `iTabMX`); Mint xWiniwa: `xwmLeverageChart*` below Mint CTA (dual axis USD + leverage). |
| 2026-03-23 | Currency defaults: `CNYw` is **on** by default in **Settings → Currencies to Display** and **Welcome → Preferred currencies**. |
| 2026-03-23 | CNY presentation copy/icon: `Renminbi Yuan`; primary card emoji in `CCY_META` uses `🐼` for parity with themed currency icons (🍁, 🦘, 🧀, etc.). |
| 2026-03-23 | Primary-currency default: `EURw` is now first/default (wallet initial shell + `BASE_CCY='EURw'`; welcome fallback prefers `EURw` when available). |
| 2026-03-24 | Treasury: **Concentration & trading depth** (xWiniwa vs Stables, demo Winiwa chain slice vs `WINIWA_24H_QUOTE_USD`); `MEXC_TICKER_URL` default → 24h ticker; `renderTreasuryConcentrationReview` on liability render + Treasury `calcSlider`. |
| 2026-03-24 | Invest **Coverage fund**: **Last 30 days perf** vs **Historical performance** sections; removed inner duplicate title and third under-graph line; **My available balances**; token/NAV under **Fund composition**. |
| 2026-03-25 | New `page-onoff-ramp` under **Shops & Exchange** in More; lists 3 exchanges (MEXC, LBank, XT.COM) and explicit on-ramp/off-ramp flows between fiat and Stables. |
| 2026-03-29 | More drawer **Preferences → Security** `ddesc`: Vault key: the only access to your bank (was Vault key only: access to your bank). |
| 2026-03-29 | **Feedback**: structured public JSON form (first section) + Telegram; `FEEDBACK_PUBLIC_DB_URL` in `runtime-config.js`; schema `assets/data/feedback_submission.v1.schema.json`. |
| 2026-03-30 | Phase 1 scaffold for pseudonymous validation/trust/retro added (non-UI): `assets/routes/trust-retro.js` + runtime config keys (`TRUST_*`, `RETRO_*`, `ABUSE_*`), script loaded in `index.html`. |
