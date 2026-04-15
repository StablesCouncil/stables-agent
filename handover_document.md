# Handover Document: Stables Protocol Branding Unification

## Status: **ACTIVE — Pages ship 2026-04-13**

Branding and navigation parity are defined across the **seven** community-facing HTML nodes in the handover table (home through QR code).

**Last GitHub Pages push:** `StablesCouncil/stablescouncil.github.io` **`main`** commit **`6c328e0`** (2026-04-13). **Brand PNG fix:** `brand/assets/logo-wordmark.png`, `logo-symbol.png`, and `twitter-header.png` had been **0-byte files** in the working tree (broken images despite correct `/brand/assets/` URLs); restored from `_tmp_pages_clone/brand/assets/` and pushed. **`CNAME`** = **`stablescouncil.org`** landed in **`f7f6e45`**. Sandbox source: `1_development/stream_1_app/task_stablescouncil_github_io/`; publish clone: `3_archive/.../stablescouncil.github.io/` with **`git --git-dir=_embedded_git`**. Earlier same day: content sync **`afc3a1f`** after reset to **`origin/main`** (`dad99fe`) to avoid rebase conflicts.

**Custom domain checklist (operators):** Repo root **`CNAME`** must match **GitHub → Settings → Pages → Custom domain** for `stablescouncil.org`. DNS at the registrar must follow [GitHub’s apex docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) (A/AAAA or ALIAS to Pages). After push, allow a few minutes, then **Enforce HTTPS** once the certificate provisions.

**Monorepo:** commit any updated files under `3_archive/.../stablescouncil.github.io/` if you version the mirror in the parent repo.

---

## Canonical files to edit (this workspace)

Paths are relative to the Stables repo root: `C:\Users\Charles\Documents\Stables\`.

**Single sandbox for all public site pages (same tree the agent edits):**  
`1_development/stream_1_app/task_stablescouncil_github_io/`

Council handshake name today is **`task_stablescouncil_github_io`**. If you prefer a short working name (for example **`website`**), treat that as an alias for this path until Council renames the folder or adds a junction/symlink.

| # | Node | Human source (edit here) | After edit, run `npm run sync:site` so **`site/`** matches GitHub Pages root URLs |
|---|------|--------------------------|--------------------------------|
| 1 | **Home Page** (full presentation) | `…/webpages/pages/index/index.html` | → `site/index.html` |
| 2 | **Playing Field** | `…/webpages/pages/playing_field/index.html` | → `site/playing_field.html` |
| 3 | **All links** | `…/webpages/pages/links/index.html` | → `site/links.html` |
| 4 | **Circular Economy** | `…/webpages/pages/circulareconomy/index.html` | → `site/circulareconomy/` |
| 5 | **Banking System** | `…/webpages/pages/bankingsystem/index.html` | → `site/bankingsystem/` |
| 6 | **Ambassador Program** | `…/webpages/pages/ambassadorsprogramdesc/index.html` | → `site/ambassadorsprogramdesc.html` |
| 7 | **QR code** | `…/webpages/pages/qr-code/index.html` | → `site/qr-code.html` |

**MiniDapp tree:** `…/webpages/dapp/` mirrors **`/dapp/`** (`showcase/`, `demo/`, …). Sync copies it to **`site/dapp/`** only.

### MiniDapp channels: Live URL ↔ `C:\` paths

| Channel | Version (canonical) | Live URL | `C:\` paths (set-up) |
|---------|---------------------|----------|----------------------|
| **Showcase** | **`v00.00.00.00.03`** (short **`v00.00.03`**) | [stablescouncil.org/dapp/showcase/](https://stablescouncil.org/dapp/showcase/) · [stablescouncil.github.io/dapp/showcase/](https://stablescouncil.github.io/dapp/showcase/) | **MiniDapp source (build .mds.zip):** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\prod_stables_app_v00.00.00.00.03\` — **Web author (edit, then `npm run sync:site`):** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\task_stablescouncil_github_io\webpages\dapp\showcase\` — **Synced output:** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\task_stablescouncil_github_io\site\dapp\showcase\` |
| **Demo** | **`v00.00.00.01.00`** | [stablescouncil.org/dapp/demo/](https://stablescouncil.org/dapp/demo/) · [stablescouncil.github.io/dapp/demo/](https://stablescouncil.github.io/dapp/demo/) | **MiniDapp source:** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\prod_stables_app_demo\` — **Web author:** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\task_stablescouncil_github_io\webpages\dapp\demo\` — **Synced output:** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\task_stablescouncil_github_io\site\dapp\demo\` |

**Shared CSS, brand, CNAME:** edit **`…/static/`** (not the task folder root). Sync merges it into **`site/`** first.

See **`task_stablescouncil_github_io/webpages/README.md`** for the full map.

**Built public tree (generated, not an edit target):** **`task_stablescouncil_github_io/site/`** is the **only** full copy of the online file layout. **`npm run sync:site`** rebuilds it from **`webpages/`** + **`static/`**. Ship its **contents** to the Pages repo root (see **`site/README.md`**). Git tracks only **`site/README.md`**; other files under **`site/`** are generated (see **`.gitignore`**).

**Mirror (optional, not the primary edit target for these six):**  
`2_current/stream_2_community/prod_presentation_v02/` still holds **`index.html`** and **`playing_field.html`** copies used elsewhere in the repo. When you change the home page or Playing Field for **stablescouncil.org**, edit the **`webpages/`** sources above first, run **`npm run sync:site`**, then copy **`site/index.html`** and **`site/playing_field.html`** into **`prod_presentation_v02/`** if that mirror must stay aligned.

### Edit path, archive push clone (no root duplicate)

| Role | Path | Why it exists |
|------|------|----------------|
| **Edit here (website / Pages sandbox)** | `1_development/stream_1_app/task_stablescouncil_github_io/` | **Authoring:** pages under **`webpages/pages/<slug>/`**, **`webpages/dapp/`**, and shared shipped files under **`static/`** (see **`webpages/README.md`**, **`static/README.md`**). **`npm run sync:site`** builds **`site/`** only (no duplicate HTML or `dapp/` at this folder’s root). **Eleventy:** **`src/`**. Handshake: **`task_*`**, not **`prod_*`**. |
| **Push from here (archived nested repo)** | `3_archive/stream_1_app/task_archived_nested_repo_stablescouncil_github_io_2026-04-12/stablescouncil.github.io/` | Full **`StablesCouncil/stablescouncil.github.io`** clone; Git metadata is stored as **`_embedded_git/`** (not **`.git`**) so the parent repo can version the whole tree. Use **`git --git-dir=.../_embedded_git --work-tree=.../stablescouncil.github.io`** (see archive **`README.md`**), then merge in changes from the sandbox and push. |

**Do not** recreate **`1_development/stream_2_community/prod_stablescouncil_github_io/`** (old duplicate path, removed earlier).

**Ship workflow:** edit **`webpages/`** and **`static/`**, run **`npm run sync:site`**, then copy or robocopy the **contents** of **`site/`** (not the parent sandbox folder) into the **root** of the **archived** **`stablescouncil.github.io`** working tree, commit, and push from that repo. Alternatively clone **`StablesCouncil/stablescouncil.github.io`** elsewhere and copy **`site/`** contents the same way. **Never** re-add a second full tree at the **Stables** repo root unless Council explicitly chooses submodule layout again.

**Handshake (`0_handshake/README.md`, `handshake.md` §1):** new HTML/CSS work stays under **`1_development/`**; retiring the root nested repo was an **archive move**, not a delete.

**Synced (2026-04-12):** Pages tree merged into **`task_stablescouncil_github_io/`**; step-1 chrome: `links.html`, `stables.css`, `assets/site-chrome.css`. **2026-04-12:** Root **`stablescouncil.github.io/`** nested checkout **archived** under **`3_archive/...`**; monorepo **`git rm --cached stablescouncil.github.io`** applied so the parent index no longer tracks a root gitlink.

---

## Objective (feel only)

**Uniform website chrome:** one new **header** and one new **footer** (and shared supporting CSS), applied consistently across all six nodes so the set **feels** like one site.

**Content freeze (agreed):** Do **not** change copy, headings, body text, link targets, link order, diagrams, or interactive behaviour inside existing main content regions. Only add or adjust **layout wrappers**, **global header/footer**, **spacing** (e.g. offset for fixed header), **shared styles**, and **encoding fixes** where required for valid UTF-8 display of **existing** characters (no copy rewrites).

**No inherited chrome:** None of the current headers or footers on any page is the final design. We **design new** chrome that follows `web_component_spec.md` / tokens, using **one** page as the first implementation (template), then replicate the **same shell** to the other pages without altering their inner content.

---

## Template page (first build)

**Chosen template:** **`webpages/pages/links/index.html`** (ships as **`links.html`**) — **All links** hub, node 3. Live URL still maps from the Pages repo (`stablescouncil.github.io`).

**Why this page first:** It is mostly a structured list inside a single main column; wrapping it in a new global header and footer is mechanically simpler than starting on the long presentation or heavy diagram pages. After the shell looks right here, the same HTML/CSS pattern is copied to the other page files with **content blocks left untouched**.

---

## Shared assets (agreed)

To avoid six divergent copies of the same rules, add **one** linked stylesheet under the Pages tree:

`1_development/stream_1_app/task_stablescouncil_github_io/static/assets/site-chrome.css`

Each public HTML page will **link** `stables.css` (per spec) **and** `site-chrome.css`. Page-specific `<style>` blocks stay for **local layout only** (diagrams, scroll sections) until a later cleanup pass you approve.

**Confirmed:** Single linked file approach is the logic to implement.

---

## Rollout order (agreed)

1. Finish chrome on **`webpages/pages/links/index.html`** (template).  
2. **`webpages/pages/circulareconomy/index.html`** and **`webpages/pages/bankingsystem/index.html`** (wrap existing body; remove duplicate global chrome CSS from those files as it migrates to `site-chrome.css`).  
3. **`webpages/pages/index/index.html`** and **`webpages/pages/playing_field/index.html`** (inject shell around existing full-page structure; trim only duplicated global rules; sync **`prod_presentation_v02/`** if you still use that mirror).  
4. **`webpages/pages/ambassadorsprogramdesc/index.html`** (on ship, run **`npm run sync:site`**, mirror into the **archived** Pages checkout or your push clone and push).

**Confirmed:** This rollout order is approved.

### Step 1 status (template)

Implemented in **`1_development/stream_1_app/task_stablescouncil_github_io/`** (copy into the **archived** **`stablescouncil.github.io`** checkout or another clone before you push Pages):

- **`stables.css`** (from `task_x_agent_node`) and **`assets/site-chrome.css`** (global header/footer + share offsets).
- **`webpages/pages/links/index.html`** (synced to **`links.html`**): links both CSS files; `<main>` wrap; new `<header>` / `<footer>`; body classes `site-chrome-body links-page-body`.
- **Markup repair:** Telegram Council / Ambassador nested `<a>` fixed; Telegram row has placeholder title/description (review).
- **Encoding:** **Big Mac®**; footer meta `Stables | Built on Minima`.

Step 2 subpages use **`../stables.css`** and **`../assets/site-chrome.css`** relative to each folder.

---

## Reference

- **UI law:** `0_handshake/web_component_spec.md`, `0_handshake/visual_identity_spec.md`
- **Tokens:** link `stables.css` first; do not invent colours outside handshake tokens.

---

*Last update: **MiniDapp channels** table uses full **`C:\`** paths for showcase / demo (Live URL ↔ `prod_*` and **`webpages/dapp/`** / **`site/dapp/`**) (2026-04-15). Public pages are authored under **`webpages/pages/<slug>/`** and **`webpages/dapp/`**; shared shipped files under **`static/`**; **`npm run sync:site`** builds **`site/`** only. Optional **`prod_presentation_v02/`** mirror: copy **`site/index.html`** and **`site/playing_field.html`** after sync. Earlier: Handover table retargeted to **`task_stablescouncil_github_io/`** (2026-04-12).*
