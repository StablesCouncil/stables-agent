# Handover: Adapt On/Off Ramp page (merchant-primary onboarding)

Paste this brief into the other chat as the task specification. The implementing agent should follow Stables workspace rules (`0_handshake/README.md`, `handshake.md`, `minidapp_version.md`, `web_component_spec.md` if UI changes).

---

## Calibration (mandatory)

1. Read `0_handshake/minidapp_version.md` and implement in the **active MiniDapp tree** (default for new work: **`1_development/stream_1_app/dapp/2-demo/`**). Port to **`1_development/stream_1_app/dapp/`** (showcase: **`1-showcase/`** + root **`assets/`**) only when changes are **synthetic-safe** and approved for both channels.
2. Confirm: **Calibration Active: Working on the basis of the Unified Handshake.**

---

## Constitutional / product intent (source of truth)

**Charter:** `1_development/stream_3_governance/prod_governance_papers/stables_charter.md`

- **Article IV.7 — Merchant-Led Fiat Exchange and Participant Onboarding** defines that the **primary** path between **local paper money** and **Stables** is **merchant-mediated exchange** (cash ↔ Stables at the point of commerce). Third-party licensed ramps remain **supplementary** (Annex **C.1**).

Your UI and copy should **lead with merchants**, then present **USDT / bridge / CEX / global ramps** as **secondary or optional** routes, not the default story.

---

## Files to touch

| Purpose | Path |
|--------|------|
| **Main UI** | `1_development/stream_1_app/dapp/2-demo/index.html` |
| **Changelog (required)** | `1_development/stream_1_app/dapp/2-demo/CHANGELOG.md` |
| **UI inventory (if structure changes)** | `1_development/stream_1_app/ui_inventory/app_ui_inventory.md` |
| **Mirror to showcase (if applicable)** | `1_development/stream_1_app/dapp/1-showcase/index.html` + root **`dapp/assets/`** as needed + **`dapp/CHANGELOG.md`** |

**Locate the page:** in `index.html`, search for `id="page-onoff-ramp"`, `navigate('onoff-ramp')`, and `openAgentExplain('On/Off Ramp:` … **update all agent explain strings** if step numbering or flow narrative changes.

---

## Functional and UX requirements

1. **Information hierarchy**
   - **First block:** Why **merchants** exchange cash for Stables (and back): benefits aligned with Charter **IV.7** (relationship, foot traffic, economics, local circulation, inclusion, two-way choice). Keep tone **institutional**, not promotional.
   - **Second block:** Why **participants** benefit (onboarding where they already shop, self-custody after wallet handoff, local exit to cash, pseudonymous / interaction-based trust framing **without** promising evasion of law).
   - **Then:** Existing **technical paths** (CEX, Minima DEX, optional **MxUSDT ↔ USDT** bridge `https://mxusd.global/`, etc.) as **“also available”** or **“other routes”**, clearly labeled so users are not pushed to global ramps first.

2. **Diagrams / steps**
   - If the page uses **numbered 6-step** on-ramp/off-ramp visuals, either:
     - add a **parallel “merchant path”** diagram (fewer steps: e.g. cash ↔ merchant ↔ Stables in wallet), **or**
     - renumber/relabel so the **merchant route is step 1** conceptually in copy even if technical steps stay below the fold.
   - Avoid implying the protocol **is** a money transmitter; merchants and third parties operate under **their own** compliance.

3. **Design**
   - If adding new panels/buttons: follow **`0_handshake/web_component_spec.md`** and existing **`stables.css`** patterns; **do not** invent new button classes (`btn-link` does not exist). Use design tokens from workspace rules (`--bg`, `--panel`, `--accent`, etc.).

4. **StablesAgent**
   - Adjust **`openAgentExplain(...)`** prompts on this page so the agent summary matches the **merchant-primary** story.

---

## Deliverables checklist

- [ ] `dapp/2-demo/index.html` updated: **On/Off Ramp** page reflects **IV.7** ordering and copy.
- [ ] `dapp/2-demo/CHANGELOG.md` entry with **user-visible** summary.
- [ ] `app_ui_inventory.md` updated if sections/titles or navigation meaningfully change.
- [ ] (Optional) Showcase port + changelog if requested and safe per `minidapp_version.md`.

---

## Full path for Charter (for copy alignment)

`c:\Users\Charles\Documents\Stables\1_development\stream_3_governance\prod_governance_papers\stables_charter.md`

Anchor for IV.7 (typical Markdown slug): `#iv7-merchant-led-fiat-exchange-and-participant-onboarding`

---

*Created for cross-chat handover. MiniDapp edits belong in demo first unless task is showcase-only.*
