# STABLES WEB COMPONENT SPECIFICATION
**Version**: 1.3  
**Status**: MANDATORY — Load this file whenever building or editing any Stables web surface.  
**Shared CSS**: `1_development/stream_3_governance/task_x_agent_node/stables.css`  
**Reference implementation**: `https://stablescouncil.github.io/`  
**Tokens last verified against live site**: 2026-03-11

> **CRITICAL — READ BEFORE ANYTHING ELSE**
>
> The design tokens and button styles in this spec and in `stables.css` were extracted **directly from the live site** on 2026-03-11.
> They do NOT match the archived V1.0 file at `3_archive/stream_2_community/prod_old_presentations/`.
> Never derive tokens or button styles from archived files.
> If the live site is updated, re-fetch and update `stables.css` + this file together.

---

## PRIME DIRECTIVE

Every Stables web page MUST:
1. Link `stables.css` — never copy-paste or rewrite its rules locally.
2. Use only the classes defined here. Never invent new ones for elements already covered.
3. Use only the design tokens defined in `stables.css` (e.g. `var(--accent)`). Never hardcode a colour that has a token.
4. Load Inter from Google Fonts (already imported in `stables.css`).

### MiniDapp exception (shipped shell)

The **Stables MiniDapp** (`1_development/stream_1_app/prod_stables_app_v*/index.html`) embeds a large **`<style>`** block instead of linking `stables.css` for the full shell. That block is the **single executable source** for in-app layout rules (e.g. `.stitle-row`, `.app-page-header`, wallet/council cards). **Do not** duplicate competing rules in one-off files or per-page overrides for the same selectors.

| Role | File |
|------|------|
| **Law** (what to build, class contracts) | This spec (`web_component_spec.md`) |
| **Inventory** (every page + sections) | `0_handshake/app_ui_inventory.md` |
| **Executable CSS** (what the zip ships) | Active `prod_stables_app_*/index.html` `<style>` |
| **SPA mirror** (migration target) | `stables_spa` shared CSS / `SectionWithCaption` |

When you change a global pattern (e.g. title row alignment), change the **one** rule in the executable `<style>` (and mirror in `stables_spa` until unified). **Never** fix the same thing page-by-page with inline or local overrides.

---

## MINIDAPP / IN-APP SCREEN HEADER (prod Stables app)

**Rule**: At the top of every in-app screen, use the **same icon, title, and subtitle** as the **More** drawer row (`.ditem`) for that destination. For primary tabs that are **not** in the drawer, use the **bottom nav** icon + label, plus one short subtitle line that matches the screen purpose.

**Markup** (implemented in `prod_stables_app_v0.2.10/index.html`):

- Wrapper: `header.app-page-header`
- Icon: `div.dic` with the same emoji (or `agent.png` inside `.dic` if the menu row uses the agent image)
- Title: `div.app-page-header__title` — must match `.dname` (or the bottom-tab label)
- Subtitle: `div.app-page-header__sub` — must match `.ddesc` (or the agreed tab subtitle)

**Governance**: When you rename a destination in the More menu, update the matching page header in the same edit so they never drift.

**Exception**: The **Wallet** home screen has **no** `app-page-header`; the balance hero card is the primary focal layout.

---

## MINIDAPP SECTION + BOX + STABLESAGENT (prod Stables app)

**Rule**: Each logical block is a **section label + StablesAgent** row **immediately above** its **glass card** (no extra gap between the title row and the card).

1. **Wrapper**: `div.app-section.app-section--caption-bottom` around the pair. Uses `flex-direction: column` and **`gap: 0`** so the title row sits flush above the card. **DOM order**: `stitle-row` (or `pool-section-title` for invest) first, then the card. After a page header, add `app-section--caption-bottom--mt20` on the wrapper instead of `mt20` on `stitle-row`.
2. **Title row**: `div.stitle-row` inside the wrapper. Inside it: `div.stitle` (label text) **and** `button.agent-mini-btn` with `onclick="openAgentExplain('…')"` and `<img src="agent.png" alt="StablesAgent">`, side by side (title flexes; agent stays at the end of the row). **Alignment**: the row uses `align-items: flex-end` so label and agent sit on the **bottom** of that row’s band—**do not** override per screen.
3. **Content box**: `div.card` (or `.ex-card`, `.xwm-card`, `.cp-card`, `.lp-card`, `.treasury-snap-card`, etc.) **plus** `app-section-card`. **Do not** put `agent-mini-btn` inside the card when a section title exists in the outer row.
4. **In-card titles** (e.g. proposal / voting cards): `div.stitle-row.stitle-row--in-card` **first inside the box**, with `div.stitle-inline` (or `stitle-inline--sm`) plus the same `agent-mini-btn`; separator is a **bottom** border under the title row, not a gap above the card.

**Reference**: `1_development/stream_1_app/prod_stables_app_v0.2.10/index.html` (`.app-section--caption-bottom`, `.stitle-row`, `.agent-mini-btn`, `.app-section-card` in the page `<style>` block).

---

## WELCOME MODAL — SHOWCASE PREVIEW NOTICE (MiniDapp step 0)

**Rule**: The first welcome screen’s showcase paragraph uses the **standard showcase-intro format** only (no ad-hoc font sizes or colours on that block).

| Piece | Contract |
|-------|----------|
| **Class** | `welcome-modal-showcase-intro` on the text container (`#welcomeShowcaseIntroBody` in `prod_stables_app_v0.2.10/index.html`). |
| **Type** | `font-size: var(--fz-showcase-intro)` where `--fz-showcase-intro: calc(var(--fz-body) + 1px)`; `line-height: var(--lh-showcase-intro)` (1.55); `font-weight: 600`. |
| **Colour** | `#fbbf24` (amber; same emphasis family as Vault-key safety modals). |
| **Links** | `#welcomeShowcaseIntroBody a`: `color: var(--c)`, underline, inherit weight. |
| **Paragraphs** | Use `<p>` per sentence or thought inside `#welcomeShowcaseIntroBody`; spacing via `#welcomeShowcaseIntroBody p` / `:last-child` in executable CSS. |

**Executable source**: the `:root` tokens and rules live in the MiniDapp `<style>` block (`index.html`); do not duplicate elsewhere.

---

## NEW PAGE SHELL TEMPLATE

Every new Stables HTML page starts from this shell. Copy verbatim, change nothing except content.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>PAGE TITLE — Stables</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/png" href="https://stablescouncil.github.io/favicon.png" />
  <!-- Shared Stables design system — never duplicate its rules locally -->
  <link rel="stylesheet" href="stables.css" />
  <style>
    /* Page-specific overrides only — nothing that stables.css already covers */
  </style>
</head>
<body>
  <!-- content -->
</body>
</html>
```

---

## DESIGN TOKENS (Reference — defined in stables.css)

Source of truth: **live site** `https://stablescouncil.github.io/` (fetched 2026-03-11).  
Never derive these from an archived file — always confirm against the live source.

| Token | Value | Use for |
|-------|-------|---------|
| `--bg` | `#0b0f14` | Page background |
| `--panel` | `#101826` | Cards, panels |
| `--text` / `--text-primary` | `#e6edf3` | Primary text |
| `--muted` / `--text-secondary` | `#9fb0c0` | Secondary / body text |
| `--accent` / `--accent-cyan` | `#67e8f9` | Cyan — primary accent, links |
| `--accent-purple` | `#a78bfa` | Purple — growth sections |
| `--accent-amber` | `#fbbf24` | Amber — business sections |
| `--glow` | `rgba(103,232,249,0.15)` | Soft cyan glow |

---

## COMPONENTS

---

### 1. BUTTONS

**Rule**: Never style a button locally. Use these classes from `stables.css` only.  
**Shape**: `border-radius: 16px` — rounded rectangle (NOT pills).  
**Size**: `width: 220px`, `height: 64px`, `font-size: 16px`, `font-weight: 600`.  
**All buttons share**: `border: 1px solid rgba(103,232,249,0.3)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(103,232,249,0.15)`.  
**Hover (all)**: `translateY(-2px)` + stronger cyan glow, `border-color: rgba(103,232,249,0.5)`.

#### Primary button — cyan-to-purple gradient, light text
```html
<a class="btn btn-primary" href="URL">Label</a>
```
Background: `linear-gradient(135deg, rgba(103,232,249,0.3), rgba(167,139,250,0.3))`. Colour: `#e6edf3`.

#### Primary button with sub-label (e.g. "Coming Soon")
```html
<a class="btn btn-primary" href="#">
  Main Label
  <span class="btn-label">Coming Soon</span>
</a>
```

#### Secondary button — dark semi-transparent, cyan border, light text
```html
<a class="btn btn-secondary" href="URL">Label</a>
```
Background: `rgba(15,23,42,0.6)`. Colour: `#e6edf3`. Use for all non-primary actions.

#### Button group (wraps multiple buttons)
```html
<div class="buttons">
  <a class="btn btn-primary" href="#">Primary</a>
  <a class="btn btn-secondary" href="#">Secondary</a>
  <a class="btn btn-secondary" href="#">Secondary</a>
</div>
```

> **NEVER use `btn-link`** — it does not exist. The secondary class is `btn-secondary`.  
> **Mobile**: buttons stack to full width, centred.

---

### 2. BADGES

#### Standard badge (cyan)
```html
<div class="badge">FOR YOU</div>
```

#### Growth badge (purple)
```html
<div class="badge badge-growth">FOR GROWTH</div>
```

#### Business badge (amber)
```html
<div class="badge badge-business">FOR BUSINESS</div>
```

#### Built on MINIMA badge (inline link)
```html
<a class="minima-badge" href="https://minima.global">Built on <strong>MINIMA</strong></a>
```

---

### 3. TYPOGRAPHY

All heading and text styles are inherited from `stables.css`. Use semantic HTML.

| Element | Class | Result |
|---------|-------|--------|
| Large hero title | `<h1 class="hero-title">` | clamp 3–5.25rem, weight 800 |
| Section title | `<h2>` | clamp 2.5–4rem, weight 800 |
| Hero tagline | `<p class="hero-tagline">` | clamp 1.125–1.5rem, colour muted |
| Body paragraph | `<p>` | clamp 1–1.25rem, colour muted |
| Muted note | `<span style="opacity:.5">` | Use sparingly |

**Never set a font-family locally.** Inter is loaded globally by `stables.css`.

---

### 4. LAYOUT

#### Full-width container
```html
<div class="container">
  <!-- max 1400px, auto margins, fluid padding -->
</div>
```

#### Two-column split (stacks on mobile)
```html
<div class="split-layout">
  <div class="content-block"><!-- text side --></div>
  <div><!-- visual side --></div>
</div>
```

#### Reversed split (visual left, text right on desktop)
```html
<div class="split-layout reversed">
  ...
</div>
```

#### Mockup frame (dark card for UI previews)
```html
<div class="mockup-frame">
  <!-- UI preview content -->
</div>
```

---

### 5. BACKGROUND

Every page body uses a radial gradient glow over the base dark:
```css
background: radial-gradient(circle at top, rgba(103,232,249,0.15), transparent 55%), #0b0f14;
```
`stables.css` does NOT set this automatically — apply it to the `body` or the page wrapper in the page-specific `<style>` block.

---

### 6. PANEL / CARD (standard cards, shells, surfaces)

Use for all primary surfaces — the chat shell, info cards, mockup frames.

```css
background: var(--panel);                          /* #101826 */
border: 1px solid rgba(103, 232, 249, 0.3);        /* cyan border glow */
border-radius: 24px;
box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(103,232,249,0.15);
```

The live site uses `backdrop-filter: blur(12px)` on button elements; panels themselves are solid (`var(--panel)`), not blurred.

---

### 7. LINKS

Default link inside body text:
```css
color: var(--accent);
text-decoration: none;
```
On hover: `text-decoration: underline`.

**Never apply link colour to buttons.** Buttons must have an explicit `color` rule that cannot be overridden by a parent `a { color }` rule. In `stables.css`, `.btn-primary` and `.btn-secondary` both use `color: #e6edf3 !important` for this reason.

---

### 8. LANGUAGE / RTL SUPPORT

For pages with language switching:
```html
<html lang="en" dir="ltr">
```
RTL pages: `<html lang="ar" dir="rtl">`. RTL rules are already in `stables.css`.

---

## FORBIDDEN

- Hardcoding `#67e8f9`, `#0b0f14`, `#101826` etc. locally when a token exists.
- Using `btn-link` — it does not exist. Use `btn-secondary`.
- Defining `.btn`, `.badge`, or `.container` locally.
- Using any font other than Inter.
- Styling `<a>` globally in a way that affects button children.
- Using inline `style=""` for anything covered by this spec.
- Generating or approximating brand visuals — always extract from the master assets in `2_current/stream_1_app/prod_brand_masters/`.

---

## FILE LOCATIONS

| Asset | Path |
|-------|------|
| Shared CSS | `1_development/stream_3_governance/task_x_agent_node/stables.css` |
| Favicon | `https://stablescouncil.github.io/favicon.png` (remote) |
| Master symbol | `2_current/stream_1_app/prod_brand_masters/1_symbol_current.png` |
| Reference site | `https://stablescouncil.github.io/` |

---

## Document history

| Version | Change |
|---------|--------|
| 1.3 | MiniDapp welcome step 0: `.welcome-modal-showcase-intro` + `--fz-showcase-intro` / `--lh-showcase-intro` documented. |
| 1.2 | MiniDapp section + title-row alignment; inventory pointer. |
