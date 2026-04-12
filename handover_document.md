# Handover Document: Stables Protocol Branding Unification

## Status: **ACTIVE — local work only**

Branding and navigation parity are defined across **six** community-facing HTML nodes. **Do not push** to GitHub until you run an explicit ship checklist.

---

## Canonical files to edit (this workspace)

Paths are relative to the Stables repo root: `C:\Users\Charles\Documents\Stables\`.

| # | Node | Path on this machine (edit here) |
|---|------|-------------------------------------|
| 1 | **Home Page** | `2_current/stream_2_community/prod_presentation_v02/index.html` |
| 2 | **Playing Field** | `2_current/stream_2_community/prod_presentation_v02/playing_field.html` |
| 3 | **Website map** | `1_development/stream_1_app/prod_stablescouncil_github_io/links.html` |
| 4 | **Circular Economy** | `1_development/stream_1_app/prod_stablescouncil_github_io/circulareconomy/index.html` |
| 5 | **Banking System** | `1_development/stream_1_app/prod_stablescouncil_github_io/bankingsystem/index.html` |
| 6 | **Ambassador Program** | `1_development/stream_1_app/prod_stablescouncil_github_io/ambassadorsprogramdesc.html` |

### Two folders on purpose (no third)

| Role | Path | Why it exists |
|------|------|----------------|
| **Edit here** | `1_development/stream_1_app/prod_stablescouncil_github_io/` | Sandbox inside the private Stables repo: handshake-aligned place to change HTML/CSS before ship. |
| **Push from here** | `stablescouncil.github.io/` at repo root | This directory is its **own git repository** (`.git` inside it) for **`StablesCouncil/stablescouncil.github.io`**. GitHub only updates the live site when you **commit and push from this clone**. It is not a second “draft” tree by design; it is the **remote working copy**. |

**Do not** recreate **`1_development/stream_2_community/prod_stablescouncil_github_io/`**. That path was a duplicate and was removed to avoid confusion. If you see old notes pointing at `stream_2_community`, treat them as obsolete.

**Workflow:** edit and review under **`stream_1_app/prod_stablescouncil_github_io/`**; when you ship, copy changed files into **`stablescouncil.github.io/`** and push from there (or use another clone of the same public repo if you prefer, but keep **one** push target).

**Handshake rule (`0_handshake/README.md` pipeline, `handshake.md` §1):** new work starts under **`1_development/`**; the root Pages folder exists for **git remote + push**, not as a parallel sandbox.

**Canonical Pages sandbox in this workspace:**  
`1_development/stream_1_app/prod_stablescouncil_github_io/`  
(full mirror: `links.html`, `index.html`, `circulareconomy/`, `bankingsystem/`, `dapp/`, etc.)

**Synced (2026-04-12):** The full Pages tree was populated under **`stream_1_app/prod_stablescouncil_github_io/`** from the root **`stablescouncil.github.io/`** checkout (excluding `.git`). Step-1 chrome lives there: `links.html`, `stables.css`, `assets/site-chrome.css`. **2026-04-12:** Removed duplicate **`stream_2_community/prod_stablescouncil_github_io/`** so only the sandbox + push clone remain.

---

## Objective (feel only)

**Uniform website chrome:** one new **header** and one new **footer** (and shared supporting CSS), applied consistently across all six nodes so the set **feels** like one site.

**Content freeze (agreed):** Do **not** change copy, headings, body text, link targets, link order, diagrams, or interactive behaviour inside existing main content regions. Only add or adjust **layout wrappers**, **global header/footer**, **spacing** (e.g. offset for fixed header), **shared styles**, and **encoding fixes** where required for valid UTF-8 display of **existing** characters (no copy rewrites).

**No inherited chrome:** None of the current headers or footers on any page is the final design. We **design new** chrome that follows `web_component_spec.md` / tokens, using **one** page as the first implementation (template), then replicate the **same shell** to the other five without altering their inner content.

---

## Template page (first build)

**Chosen template:** **`links.html`** in **`1_development/stream_1_app/prod_stablescouncil_github_io/`** (**Website map**, node 3). Live URL still maps from the Pages repo (`stablescouncil.github.io`).

**Why this page first:** It is mostly a structured list inside a single main column; wrapping it in a new global header and footer is mechanically simpler than starting on the long presentation or heavy diagram pages. After the shell looks right here, the same HTML/CSS pattern is copied to the other five files with **content blocks left untouched**.

---

## Shared assets (agreed)

To avoid six divergent copies of the same rules, add **one** linked stylesheet under the Pages tree:

`stablescouncil.github.io/assets/site-chrome.css`

Each of the six HTML files will **link** `stables.css` (per spec) **and** `site-chrome.css`. Page-specific `<style>` blocks stay for **local layout only** (diagrams, scroll sections) until a later cleanup pass you approve.

**Confirmed:** Single linked file approach is the logic to implement.

---

## Rollout order (agreed)

1. Finish chrome on **`links.html`** (template).  
2. **`circulareconomy/index.html`** and **`bankingsystem/index.html`** (wrap existing body; remove duplicate global chrome CSS from those files as it migrates to `site-chrome.css`).  
3. **`prod_presentation_v02/index.html`** and **`playing_field.html`** (inject shell around existing full-page structure; trim only duplicated global rules).  
4. **`ambassadorsprogramdesc.html`** (working copy in `1_development/.../`, then mirror to `stablescouncil.github.io/`).

**Confirmed:** This rollout order is approved.

### Step 1 status (template)

Implemented in **`1_development/stream_1_app/prod_stablescouncil_github_io/`** (copy to the root **`stablescouncil.github.io/`** checkout when you push Pages):

- **`stables.css`** (from `task_x_agent_node`) and **`assets/site-chrome.css`** (global header/footer + share offsets).
- **`links.html`**: links both CSS files; `<main>` wrap; new `<header>` / `<footer>`; body classes `site-chrome-body links-page-body`.
- **Markup repair:** Telegram Council / Ambassador nested `<a>` fixed; Telegram row has placeholder title/description (review).
- **Encoding:** **Big Mac®**; footer meta `Stables | Built on Minima`.

Step 2 subpages use **`../stables.css`** and **`../assets/site-chrome.css`** relative to each folder.

---

## Reference

- **UI law:** `0_handshake/web_component_spec.md`, `0_handshake/visual_identity_spec.md`
- **Tokens:** link `stables.css` first; do not invent colours outside handshake tokens.

---

*Last update: Clarified two-folder Pages model; removed obsolete `stream_2_community/prod_stablescouncil_github_io/` duplicate (2026-04-12).*
