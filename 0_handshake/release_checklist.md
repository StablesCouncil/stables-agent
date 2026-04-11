# Stables MiniDapp Release Checklist

Use this checklist before shipping any new MiniDapp version (`prod_stables_app_v*`).

## 1) Scope lock

- [ ] Confirm active version folder from `0_handshake/minidapp_version.md`.
- [ ] Confirm release target (`APP_BUILD_VERSION`, `dapp.conf`, zip naming).
- [ ] **Version label:** canonical **`vPM.Pn.TT.DD.SS`** (see `minidapp_version.md` + `.cursor/rules/stables-handshake.mdc` § Development versioning). Prod **minor** optional for small prod bumps; **prod major** bump **requires** **Pn → `00`**. Legacy four-segment / short forms only when **PM.Pn** are both **`00`**.
- [ ] Confirm which branch/commit is intended for release notes.

## 2) Surface-by-surface coverage (no misses)

For each surface below, check the UI and confirm a changelog bullet exists when user-visible behavior changed.

- [ ] Welcome / onboarding (including Customize your bank flow)
- [ ] Top bar / branding / profile identity
- [ ] Wallet, send/receive, amount inputs, activity
- [ ] Mint / burn (xWiniwa and Wables)
- [ ] Exchange / rates / calculators
- [ ] On/Off Ramp
- [ ] Spend / invoice / merchant flows
- [ ] Council / governance / treasury pages
- [ ] Legal & notices / privacy / security
- [ ] Links / feedback / help

## 3) Changelog quality gate

- [ ] Every changed surface has at least one `[version]` bullet.
- [ ] Bullets state user impact, not only technical implementation.
- [ ] Duplicates and iterative edits are consolidated into final wording.
- [ ] Terms and labels match current in-app copy.
- [ ] `CHANGELOG.md` section is ready to paste into release notes.

## 4) Functional sanity pass

- [ ] Navigation: key flows open correct pages/sections.
- [ ] New buttons/links work on desktop and touch behavior is acceptable.
- [ ] No broken anchors/scroll targets.
- [ ] Any "test/demo/no value" copy is intentionally present or removed.

## 5) Publishing readiness

- [ ] `APP_BUILD_VERSION` aligns with release notes.
- [ ] `latestPublishedVersion` policy is set as intended.
- [ ] `.mds.zip` naming and destination are correct.
- [ ] README release section ("What changed in this version") is updated from changelog when publishing.

## 6) Final sign-off

- [ ] Release notes reviewed for completeness and plain-language clarity.
- [ ] Critical legal/comms text reviewed.
- [ ] Go/no-go recorded.

