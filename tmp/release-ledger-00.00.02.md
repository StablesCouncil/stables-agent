# Release Ledger - 00.00.02

Purpose: capture user-visible changes as they happen, then consolidate into `CHANGELOG.md`.

Status: prefilled from current 00.00.02 work.

## Coverage map (quick tick)

- [x] Welcome / onboarding (includes Customize your bank flow updates)
- [x] Branding / top bar identity
- [x] Mint / burn and charting
- [x] On/Off Ramp (diagram, steps, links, copy)
- [x] Legal / privacy / security
- [x] Inputs and wallet UX (availability labels, send/receive options)

## Captured items (working bullets)

### Welcome / onboarding

- Customize your bank path expanded in onboarding flow (personalization steps and later-skip options).
- Currencies selection improvements and continue flow refinements.

### Branding / identity

- Header/title/tagline personalization behavior updates.
- Tooltip/pill/version display and profile-driven title/subtitle adjustments.

### Mint / burn

- Mint xWiniwa leverage chart improvements and smoothing behavior.
- Cross-page links from On/Off Ramp to Mint Wables Mint/Burn sections.

### On/Off Ramp

- Off-ramp normalized to six steps to mirror on-ramp.
- Circular process illustration with icon references and optional bridge styling.
- Copy refinements: partner-exchange deposit wording and send MINIMA wording.
- Step 6 (Mint Stables) and step 1 (Burn to MINIMA) now open Mint sections.
- "Where to buy Minima" heading and updated helper text.
- Compact inline "Get Winiwa - No value" control beside step 4.

### Legal / privacy / security

- Minima dependencies section rewrite and title update.
- Privacy wording changed to local-device/no-visibility framing and OS caveat.
- Security section gained agent icon and legal summary framing improvements.
- Charter link handling routed through config-aware opener.

### Wallet / inputs / send/receive

- "Available" labels and MAX behavior extended to more forms.
- Send/Receive currency selectors show balances and refresh with wallet state.

## Consolidation notes for final release notes

- Merge iterative On/Off Ramp bullets into 3-4 clean release bullets.
- Keep legal text summary concise but precise (avoid over-claims).
- Ensure onboarding bullet explicitly includes "Customize your bank".
- Use plain language first; implementation details second.

