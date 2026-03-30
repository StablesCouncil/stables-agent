# Trust / Validation / Retrocession Implementation Plan

Version context: `prod_stables_app_v0.01.01`
Date: 2026-03-30

## Current status snapshot

### Already done

1. Versioning and freeze
- `v0.2.11` frozen in `3_archive/stream_1_app/prod_stables_app_v0.2.11/`
- Active dev version renamed to `1_development/stream_1_app/prod_stables_app_v0.01.01/`
- Handshake/docs pointers updated to active version

2. Phase 1 technical scaffold
- Added `assets/routes/trust-retro.js`
- Added runtime keys in `assets/config/runtime-config.js`:
  - `TRUST_VALIDATIONS_KEY`, `TRUST_PROFILES_KEY`
  - `RETRO_EXPENSES_KEY`, `RETRO_WINDOWS_KEY`, `RETRO_SNAPSHOTS_KEY`
  - `ABUSE_SIGNALS_KEY`
- Added script include in `index.html` for `trust-retro.js`

3. First merchant validation UI slice
- Merchant profile action now includes `Validate participant`
- Modal + submit hook implemented:
  - `openMerchantValidationComposer(shopName)`
  - `submitMerchantValidation()`
- Uses trust scaffold API:
  - `StablesTrustRetro.issueMerchantValidation(...)`
  - `StablesTrustRetro.upsertTrustProfile(userId)`

### What is not done yet

- Trust score card in user profile
- Share trust action (QR/link/card)
- Expense submission form with in-scope/out-of-scope
- Retrocession eligibility summary panel
- Abuse/risk dashboard for governance

## Where the implemented UI currently is

The `Validate participant` button is not a top-level page item.
It appears inside the merchant profile modal.

Flow to see it:
1. Open app
2. Go to `Shops` (bottom tab)
3. Open any merchant profile (card click)
4. In the profile action row, you should see:
   - `Rate merchant`
   - `Validate participant`

Source references:
- `assets/routes/activity-contacts.js` (button in merchant profile body)
- Functions:
  - `openMerchantValidationComposer`
  - `submitMerchantValidation`

## Step-by-step delivery plan (next)

### Step 1 — Harden merchant validation MVP (current slice)
- Add clearer duplicate warning message in modal
- Show merchant-issued-today counter
- Add basic validation history list in merchant profile
Acceptance: one merchant -> one user only, with visible reason when blocked

### Step 2 — Trust Score visible in profile
- Add "Trust score" section to `page-settings-profile`
- Show:
  - score v1
  - unique validating merchant count
  - plain-language explanation
Acceptance: trust score updates after validation issuance

### Step 3 — Trust share action
- Add `Share trust signal` action in profile
- MVP share payload = aggregate signal only
Acceptance: user can share without exposing identity details

### Step 4 — Expense submission (in/out of scope)
- New form section (likely under Activity first)
- Line items with `in_scope` / `out_of_scope`
- Validation rules for minimum quality
Acceptance: valid structured submissions persist

### Step 5 — Retrocession eligibility summary
- Define active window object (MVP)
- Compute and render user summary:
  - in-scope total
  - cap applied yes/no
  - eligibility band + explanations
Acceptance: user sees understandable eligibility preview

### Step 6 — Basic anti-abuse visibility
- Record and display basic signals:
  - validation spikes
  - duplicate receipt heuristics
  - suspicious patterns
Acceptance: governance/debug view shows meaningful warnings

## MVP cutline (recommended)

Ship when all below are done:
- One-time merchant validation
- Trust score in profile
- Trust share action
- Expense form with in/out scope flags
- Eligibility summary card
- Duplicate + rate-limit baseline controls

## Notes

- Preserve pseudonymity: no mandatory KYC
- Mobile-first UI only
- Reuse current app patterns (modals, cards, local storage keys)
- Keep path to stronger governance controls in later phases
