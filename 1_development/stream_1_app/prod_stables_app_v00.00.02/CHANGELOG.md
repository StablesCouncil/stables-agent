# Changelog — Stables MiniDapp

**Purpose:** Every change worth telling users, Council, or social channels gets a line here **when you merge the change** into this version. At release, copy the section for that version into release notes, Telegram, and X.

**Format:** [Keep a Changelog](https://keepachangelog.com/) style. Use **Added**, **Changed**, **Fixed**, **Removed**, **Security** as needed. Dates in ISO (`YYYY-MM-DD`).

---

## [Unreleased]

Post–**v00.00.02** work in the active dev folder. **Do not** describe these items as part of showcase **v00.00.02** in public posts until this section is merged into a new released label and zip.

### Added

- **Receive modal QR:** Loads **`assets/qrcode.js`** and renders a **scannable QR** from receive currency, optional amount, and address. **Minima** encodes full **`Mx…`** plus optional amount line when **Node live**; demo currencies encode a short **Stables receive request** text (full **`Mx…`** only when the address is not truncated). Placeholder copy when the address is not ready yet.
- **Receive QR for phone cameras:** Inline QR is **larger** (~248px), **black on white**, with **padding** as a quiet zone. **Large QR for phone camera** (and **tap the QR**) opens an overlay with a **~320px** code plus short tips (brightness, steady hold). Closing **Receive** also closes the large-QR overlay.
- **MiniDapp hub: Scan to Pay camera:** **Scan to Pay** modal (**Use camera**) uses the Web **`getUserMedia`** video path (and **`BarcodeDetector`** when the WebView supports it, else **`jsQR`** from **`assets/jsQR.min.js`**). **MDS does not add a camera API**; whether the camera works depends on the **Minima app** granting camera to the MiniDapp **WebView**. On success, a full **`Mx…`** payload fills **Send** and opens the send modal. Copy explains hub vs paste fallback.
- **Scan to Pay camera (laptop webcam):** **getUserMedia** now **falls back** from rear camera (**environment**) to **user** (webcam / front), then generic video constraints, so **laptop webcams** can scan a **QR shown on a phone** (same decoder as phone-at-screen). Modal copy describes both directions.
- **Native MINIMA receive: Mx vs 0x:** **`getaddress`** is parsed into **`{ mx, hex }`** ( **`miniaddress` / `mxaddress` / deep JSON search** for **`Mx…`**, plus **`0x…`** script-style strings). **Receive** defaults to **Mx** when the node provides it; **Settings → Appearance → Native MINIMA receive format** switches to **0x hex** when you want that label. **Send** sanitization and **QR** accept **Mx** (including non-hex wallet alphabets) or **0x**. If the reply has **only 0x** while **Mx** is preferred, the hint under the address explains **Settings** / **Minima update**.

- **Receive (copy / QR expectations):** Receive modal **subtitle** and **hint** under the address now state that non-**MINIMA** **`Mx…`** lines are **showcase demos** (format-like only); **real native MINIMA** receive uses **Minima** + **Node live** **`getaddress`**. **+ New address** toast says **demo / not on-chain MINIMA**.

- **Send MINIMA: recipient parsing:** **`stablesSanitizeMinimaSendAddress`** no longer rejects valid **`Mx…`** pastes that include invisible Unicode (zero-width / BOM / non-breaking space), which could make Android show our old “paste a Minima address” style message even when the field looked correct. We strip those characters, extract the first **`Mx` + hex** run, and require the same minimum length as elsewhere. **Send** recipient field gets **`autocomplete` / `autocapitalize` / `spellcheck`** hints to reduce keyboard mangling. Modal copy notes that showcase demo receive strings may still be **rejected by the node** if they are not real on-chain addresses.

- **Receive tap-to-copy:** Showcase receive line was a shortened **`Mx…`** string and **+ New address** generated another shortened demo address, so clipboard matched the ellipsis form. Default demo address is now **full-length `Mx` + 64 hex**, **`data-full-address`** stays in sync for non-**MINIMA** currencies, and **`copyAddr`** falls back to the last full entry if the visible text still contains **`...`**.

- **Scan to Pay camera (Android / stuck on “Starting camera”):** **Permissions API** hint when the browser supports **`navigator.permissions.query` for `camera`** (blocked vs prompt). **7s** slow hint and **22s** hard stop with **Minima → Android Settings → Camera** steps if **getUserMedia** never completes (common when the host WebView does not finish permission). **video.play()** guarded with a **12s** timeout and cleanup.

- **Wallet: Winiwa (test) vs Minima (on-chain):** Two separate list rows and send/receive currencies: **WINIMA** = showcase **Winiwa (test)** balance (faucet, mint xWiniwa, demo send); **MINIMA** = native **Minima (on-chain)** from MDS **balance** (not stored in demo wallet JSON). **Send** with **Minima** still uses `send … tokenid:0x00` when **Node live**. **Receive** with **Minima** loads your address via MDS **`getaddress`** when live; **Winiwa** receive stays demo copy. Demo **Exchange** includes **MINIMA** alongside **Winiwa** (same spot math as Winiwa in `RATES`).
- **MiniDapp: on-chain MINIMA send:** With **MDS** active and **Node live**, **Send** with currency **Minima** runs `send address:… amount:… tokenid:0x00` on the node, then refreshes balance from MDS. **Winiwa** send stays **demo**. Other send currencies stay **demo** (local wallet simulation). `build/README.md` documents **zipping**, **installing** the `.mds.zip`, and hub vs `file://` usage.
- **Connect node (showcase):** Top bar **Connect node** opens a modal to load **`mds.js`** with optional **MDS host/port** (saved in localStorage). When MDS connects (MiniDapp hub or a working debug link), the header shows **live chain block height** and the **Minima (on-chain)** row shows **live balance** from the node. Browsers often block HTTPS pages from calling `http://127.0.0.1`; the modal explains using the Stables MiniDapp on the node as the reliable path.
- **Node connection trust cues:** **Node live** (green) only after the node answers **status** or **balance**; until then the pill shows **MDS starting…** (amber). **Block height** parsing accepts JSON-string payloads and **`chain.height`** as well as **`chain.block`**. The **Minima** currency row is **unhidden** when the node is live so on-chain MINIMA is visible without **Show more**; a short status line may still appear under the hero equivalent while block or balance is loading.
- **MDS reliability:** Polling also runs the Minima **`block`** command (tip) when **`status`** JSON shape varies; deep search for **`block` / `height` / `tip`** in nested objects; treats **`status: 1`** or **`"true"`** as success; **400ms** delay before the first pull; **`MDSFAIL`** from `mds.js` surfaces as **MDS issue** (red) with error in the button tooltip; add **`?MDS_LOGGING`** hint for console tracing.
- **MDS vs local file:** If **`MDS` never appears** (for example **`file:///…/index.html`**), an **amber banner** under the top bar explains that Minima does not inject MDS there; **Connect node** modal adds copy to use the **MiniDapp hub URL** or set **MDS host** to the node **LAN IP** (example **10.10.0.2**) and port **9003**. Banner hides once MDS **`inited`** fires.
- **MiniDapp hub auto-connect:** **`index.html`** now includes **`assets/lib/mds.js`** so the hub does not need to inject a global **`MDS`**. On **`http:` / `https:`** with a real **hostname** (hub URL), **`MDS.init`** runs automatically against that host (**`file://`** still uses **Connect node** + **DEBUG_HOST**). **`stablesIsMinidappHostedOrigin()`** gates auto-init vs debug; hint banner logic updated.
- **Connect node host field:** **Normalizes** pasted hub URLs (strips **`https://`**, path, and moves **:port** into the port field). Explains that **`mds.js` builds `https://HOST:PORT/mdscommand_/`**, so a full URL in **MDS host** was invalid. After a failed debug session, **reload** is prompted before reconnecting. **`MDS.DEBUG_*` is only set** when **`mds.js` was loaded via Connect** (not when MDS is injected by the hub).

### Changed

- **Receive modal:** **Add tip** and **Open merchant checkout (invoice)** only show when **Merchant** is on under **Settings → Appearance** (same gate as **My shop**).
- **Wallet hero:** Removed the extra **Minima / MINIMA** amount line between the principal **equivalent** and **Send / Receive** (balances stay in **Currencies**). The small **waiting for node** status line under the equivalent is unchanged when MDS is still catching up.
- **Top bar node status:** **Connect node** and the separate **block height** pill are merged into **one** control: **status dot** (red / amber / green) **+** label (**Connect**, **MDS starting…**, **MDS issue**, or **live block height**). Still opens **Connect node** on tap. A small **waiting for node** line may appear under the hero equivalent while block or balance details are still loading.
- **Vault currency dropdowns (one shared UI):** Exchange Send/Receive, Mint Wables **issue** and **reclaim**, **invoice** currency, **Send** / **Receive** modals, **coverage fund** deposit asset, and **LP quote** currency all use the same custom list: **code + live balance**, cyan-accent panel, active row, balance on the closed trigger, **no visible scrollbar** (still scrollable). Values stay on **hidden inputs** so existing helpers (`walletParseCcySel`, `populateCurrencySelect`, `syncCfDepositUI`, `populateLpBaseCurrencies`, etc.) keep working.

- **Help, Stables Academy:** subtitle under the page title now reads **Questionnaires, score tracking, certificates** (plural).

- **Social link previews (X / Discord / others):** Open Graph and Twitter Card meta on the showcase shell with canonical URL `https://stablescouncil.org/dapp/`, preview image `https://stablescouncil.org/brand/assets/twitter-header.png` (site brand header, not StablesAgent art), `twitter:site` (`@StablesCouncil`), `og:image` width/height 1500×500 to match that asset, and alt **Stables MiniDapp showcase** (no em dash).

- **Help → The Stables Academy** (first Help item): Security questionnaire (10 random from bank, 3 options, mandatory gate + minimum 6/10), retake cool-down, best score kept, optional demographics after quiz, anonymized public-DB consent, certificate + share; other topics listed as coming soon.
- **Stables Academy Security flow:** one question at a time; demographics and consent after the 10 knowledge questions; choice to show correctness **after each answer** or **only at the end**.

---

## [00.00.02] — 2026-04-02 (showcase published)

Released showcase build **v00.00.02** (“v2”). See `0_handshake/minidapp_version_log.md` for scope vs later dev-only features (**Academy is not in this release**).

### Changed

- Bumped `APP_BUILD_VERSION` / `dapp.conf` to `00.00.02` for the published showcase line (aligned with published zip when shipped).
- **Mint xWiniwa** chart now uses an **EMA-smoothed leverage trace** while preserving the same live endpoint value.
- **Legal & notices / Privacy** were consolidated: legal section retitled to **Minima dependencies**, copy clarified around architecture/device responsibility/self-custody framing, privacy wording shifted to **local-storage/no telemetry from this static copy**, and security/legal blocks gained clearer StablesAgent/Charter guidance via `openStablesCharterUrl()`.
- **On/Off Ramp** was rebuilt into a release-ready flow: mirrored **6-step on-ramp/off-ramp**, clearer venue/bridge ordering, section title **Where to buy Minima**, and a single **Paper ↔ Stables (And back)** visual with icon references and optional-step styling.
- **On/Off Ramp interactions** now deep-link key steps to Mint: **step 6 Mint Stables** opens Mint Wables mint block and **step 1 Burn to MINIMA** opens Burn Wables block.
- **On/Off Ramp copy/UI** finalized: step 1 partner-exchange wording, step 5 send-MINIMA wording, Stables hub simplified label, compact inline **Get Winiwa - No value** control beside step 4, and right-aligned long-label layout fixes.
- **Welcome personalisation** flow now keeps continuity: **Open Contacts** shows a same-style **later stage** notice and continues to Step 4, and **Step 4** no longer shows **I'll do that later**.
- **Welcome showcase intro** now adds a helper line under **I understand**: users can click outside the modal to skip the whole welcome process.
- **Welcome personalisation intro** is cleaner: removed the **Optional** badge and removed the intro **I'll do that later** button, keeping the modal-exit behaviour as the skip path.
- **Browser tab title** is now fixed to **Stables - BYOB** and no longer changes with personalised bank naming.
- **Top bar subtitle behavior** now defaults to **Be your own bank** and only switches to **By Stables/Minima** when a custom bank name is set.
- **My profile** now includes explicit mode controls: **Use my settings** and **Use default settings**, so users can keep profile data saved but switch branding behavior at any time.

### Added

- **Invest → Maximize** tab: copy and outbound links to stake MINIMA via the official Minima **Maximize** MiniDapp (MiniDapps hub + docs).
- **Mint xWiniwa**: chart **below** the Mint xWiniwa button: **three** traces — **Winiwa · USD** (spot), **xWiniwa · USD** (spot × leverage), **Leverage** (right axis from **CR% / (CR% − 100%)**, e.g. 130% → 130/30); historical leg interpolates **`CR_HIST_DATA`** with **today** = live `#protocolCRBig`; **Current leverage** row + `SIM_XWM` / mint math use same formula. ~365d CoinGecko Winiwa spot; hover/touch tooltip; tighter margins, taller plot.
- **Welcome → currencies/personalisation**: **Unselect all** next to **Select all**; **Save and continue** into optional personalisation (**Step 1–4 of 4**: bank name, profile picture, contacts onboarding, directory preview); **Finish** saves council profile (name + avatar when set) and closes welcome. Bank-name copy clarifies **private vs on transactions**, changeable anytime in **My profile**.
- **Branding**: MiniDapp **headline** / page **title** / default top bar tagline **By Stables on Minima** (replaces “Be your own bank” in those places). **Top bar** shows **My profile** picture and display name (or welcome bank name) when set; when the title is **personalised** (not the default **Stables** wordmark), the subtitle switches to **by Stables/Minima**. **Brand hover**: custom panel (cyan–purple gradient text, dark frame) **“My bank made possible by Stables on Minima”** replaces the old **Home** `title` tooltip; keyboard focus shows the same panel. **Touch (`hover: none`)**: tap the **tagline** to toggle that panel; tap the tooltip, outside the bar, or the logo/title row to dismiss / go home. Center pill **Showcase · v…** tracks **`APP_BUILD_VERSION`** from `runtime-config.js` (currently **00.00.02**).
- **Legal & notices**: **Minima dependencies** section (foundation + corporate independence + open networks + **unstoppable** framing + non-custodial seizure/blocking; not legal advice).
- **Amount inputs**: **Available** balance for the relevant asset next to **Exchange** (send + receive balance hint), **Send** / **Receive** modals, **Create invoice**, **Coverage fund** deposit amount, **Burn Wables** (per selected stable); **MAX** fills the field from that balance (where it already existed for mint / LP, unchanged). Labels refresh with **global UI** and currency changes.
- **Send / Receive modals**: currency **dropdown options** show **each enabled wallet currency with its balance** (`Code · amount`, tabular numbers, wider select). Refreshes whenever the wallet UI syncs.

---

## [0.01.01] — 2026-03-31 (frozen)

**Frozen snapshot:** `3_archive/stream_1_app/prod_stables_app_v0.01.01/`  
**Public:** Web Showcase at `https://stablescouncil.org/dapp/`; node package `Stables_v0.01.01.mds.zip` in `stablescouncil.github.io` → `dapp/latest-version/`.

### Added

- Full static Showcase app deployed under Pages `/dapp/` (replacing placeholder page).
- Versioned MiniDapp zip for node installs (`Stables_v0.01.01.mds.zip`).
- Structured **More → Feedback** on **web** (POST to Council feedback API); node path uses `MDS.net.POST` where applicable.
- Welcome / showcase copy: write mode vs read mode wording; toast styling for long errors.

### Changed

- Public site CTAs: **Test the showcase** → `stablescouncil.org/dapp/`; hero simplified (single primary CTA).
- Handshake / comms: X hashtag rules surfaced in `global_knowledge_base.md`, `session_map.md`, Cursor rule; `stables_master_reference` aligned with `handshake.md` §4.

### Fixed

- (Node) Feedback delivery still under investigation for some mobile nodes; web feedback path verified working.

### Known

- `latestPublishedVersion` in config tracks last **published** zip on GitHub; bump when shipping a new zip.
