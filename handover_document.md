# Handover Document: Stables Protocol Branding Unification

## Status: **ACTIVE — Pages ship 2026-04-17**

Branding and navigation parity are defined across the **seven** community-facing HTML nodes in the handover table (home through QR code).

**Last GitHub Pages push:** `StablesCouncil/stablescouncil.github.io` **`main`** commit **`0fa30b6`** (2026-04-17): Council **Discord** invite on **`links.html`** points to **`https://discord.gg/rTdqwRGPXR`**; Showcase tile path **`/dapp/1-showcase/`**; optional **`file:`** preview script aligned with monorepo **`sync:site`** output.

**Operator clone on this machine (canonical for push):** `C:\Users\Charles\Documents\stablescouncil.github.io` — keep **`main`** fast-forwarded to **`origin/main`** after each ship. A one-off temp clone under **`Documents\stablescouncil-pages-deploy`** was used for that push and **has been removed** to avoid two competing checkouts.

**If you had local-only Pages work:** it is preserved as **`git stash`** (WIP **qr-code** + untracked brand file) and branch **`recovery/pages-local-commits-2026-04-17`** (tip **`1a9a7f8`**, two commits that had diverged from GitHub). Cherry-pick or drop as Council decides; do not merge blindly without review.

**Earlier reference (2026-04-13):** **`6c328e0`** — **Brand PNG fix** (`brand/assets/logo-wordmark.png`, `logo-symbol.png`, `twitter-header.png` had been **0-byte** in the tree; restored from `_tmp_pages_clone/brand/assets/` and pushed). **`CNAME`** = **`stablescouncil.org`** landed in **`f7f6e45`**. Sandbox source: `1_development/stream_1_app/task_stablescouncil_github_io/`; optional archive publish clone: `3_archive/.../stablescouncil.github.io/` with **`git --git-dir=_embedded_git`**.

**Custom domain checklist (operators):** Repo root **`CNAME`** must match **GitHub → Settings → Pages → Custom domain** for `stablescouncil.org`. DNS at the registrar must follow [GitHub’s apex docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) (A/AAAA or ALIAS to Pages). After push, allow a few minutes, then **Enforce HTTPS** once the certificate provisions.

**Monorepo:** commit any updated files under `3_archive/.../stablescouncil.github.io/` if you version the mirror in the parent repo.

### Publication parity (operator checklist)

Council target: **dev**, **GitHub Pages `main`**, **public web**, and **`2_current`** describe the **same** shipped state after you validate (see **`0_handshake/handshake.md`** §1 **Publication parity**).

**Confusion guard (read once):** `git push` from the **Stables monorepo** does **not** change **`stablescouncil.org`**. That site is **`StablesCouncil/stablescouncil.github.io`**. The monorepo **`.gitignore`** excludes **`task_stablescouncil_github_io/`**, so its HTML never rides along on a Stables remote push. You always ship by copying **`site/`** into a **Pages** working tree, then pushing **`main`** there. **2026-04-17:** the **`backup`** and **`backup-ssh`** remotes (they pointed at **`Charles0xhorizonxyz/stables`**, which returned **404**) were **removed** from this monorepo to avoid mistaken pushes; add a new remote when a real backup repository exists.

1. **Edit in dev:** **`task_stablescouncil_github_io/`** (pages + **`static/`**) and **`stream_1_app/dapp/`** (MiniDapp web mirror). Run **`npm run sync:site`**; confirm **`site/`** locally.
2. **Ship:** copy **`site/`** contents into the Pages repo **root** (for example **`C:\Users\Charles\Documents\stablescouncil.github.io`**); push **`main`**; verify **`stablescouncil.org`** (and **`github.io`** if used).
3. **Record:** note **Pages `main` commit SHA** (and zip label if any) in this handover or Council log.
4. **Promote:** copy or merge the matching paths into **`2_current`** when you are ready so offline **current** matches live.
5. **Brain:** run **`ingest_knowledge.js`** only **after** brain markdown lives under **`2_current`**, per Knowledge Base Sync Rule.

**Drive map (dev):** **`1_development/stream_1_app/README.md`**.

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

**MiniDapp tree:** `…/dapp/` under **`stream_1_app/`** (path **`1_development/stream_1_app/dapp/`**) mirrors **`https://stablescouncil.org/dapp/`** with numbered channel folders **`1-showcase/`**, **`2-demo/`**, plus placeholder shells **`3-test/`**, **`4-prod/`**. **`npm run sync:site`** copies it to **`site/dapp/`**.

### MiniDapp channels: Live URL ↔ `C:\` paths

| Channel | Version (canonical) | Live URL | `C:\` paths (set-up) |
|---------|---------------------|----------|----------------------|
| **Showcase** | **`v00.00.00.00.03`** (short **`v00.00.03`**) | [stablescouncil.org/dapp/1-showcase/](https://stablescouncil.org/dapp/1-showcase/) | **MiniDapp source (author + hub zip):** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\dapp\` (**`1-showcase/`**, root **`assets/`**, **`dapp/build/README.md`**, **`CHANGELOG.md`**) — **Synced:** `…\task_stablescouncil_github_io\site\dapp\1-showcase\` — **Archived former tree:** `…\3_archive\stream_1_app\task_archived_prod_stables_app_v00_00_00_00_03_2026-04-15\prod_stables_app_v00.00.00.00.03\` |
| **Demo** | **`v00.00.00.01.00`** | [stablescouncil.org/dapp/2-demo/](https://stablescouncil.org/dapp/2-demo/) | **MiniDapp source (author + zip):** `C:\Users\Charles\Documents\Stables\1_development\stream_1_app\dapp\2-demo\` (**`CHANGELOG.md`**, **`build/README.md`**) — **Synced:** `…\task_stablescouncil_github_io\site\dapp\2-demo\` — **Archived former tree:** `…\3_archive\stream_1_app\task_archived_prod_stables_app_demo_2026-04-15\prod_stables_app_demo\` |

**Shared CSS, brand, CNAME:** edit **`…/static/`** (not the task folder root). Sync merges it into **`site/`** first.

See **`task_stablescouncil_github_io/webpages/README.md`** for the full map.

**Built public tree (generated, not an edit target):** **`task_stablescouncil_github_io/site/`** is the **only** full copy of the online file layout. **`npm run sync:site`** rebuilds it from **`webpages/`** + **`static/`** + sibling **`stream_1_app/dapp/`** (into **`site/dapp/`**). Ship its **contents** to the Pages repo root (see **`site/README.md`**). Git tracks only **`site/README.md`**; other files under **`site/`** are generated (see **`.gitignore`**).

**Mirror (optional, not the primary edit target for these six):**  
`2_current/stream_2_community/prod_presentation_v02/` still holds **`index.html`** and **`playing_field.html`** copies used elsewhere in the repo. When you change the home page or Playing Field for **stablescouncil.org**, edit the **`webpages/`** sources above first, run **`npm run sync:site`**, then copy **`site/index.html`** and **`site/playing_field.html`** into **`prod_presentation_v02/`** if that mirror must stay aligned.

### Edit path, archive push clone (no root duplicate)

| Role | Path | Why it exists |
|------|------|----------------|
| **Edit here (website / Pages sandbox)** | `1_development/stream_1_app/task_stablescouncil_github_io/` | **Authoring:** pages under **`webpages/pages/<slug>/`**, shared shipped files under **`static/`** (see **`webpages/README.md`**, **`static/README.md`**). **MiniDapp** is authored beside this folder: **`1_development/stream_1_app/dapp/`** (see **`dapp/README.md`**). **`npm run sync:site`** builds **`site/`** only (no duplicate HTML at this folder’s root). **Eleventy:** **`src/`**. Handshake: **`task_*`**, not **`prod_*`**. |
| **Push from here (archived nested repo)** | `3_archive/stream_1_app/task_archived_nested_repo_stablescouncil_github_io_2026-04-12/stablescouncil.github.io/` | Full **`StablesCouncil/stablescouncil.github.io`** clone; Git metadata is stored as **`_embedded_git/`** (not **`.git`**) so the parent repo can version the whole tree. Use **`git --git-dir=.../_embedded_git --work-tree=.../stablescouncil.github.io`** (see archive **`README.md`**), then merge in changes from the sandbox and push. |

**Do not** recreate **`1_development/stream_2_community/prod_stablescouncil_github_io/`** (old duplicate path, removed earlier).

**Ship workflow:** edit **`webpages/`**, **`static/`**, and (for MiniDapp) **`stream_1_app/dapp/`**, run **`npm run sync:site`**, then copy or robocopy the **contents** of **`site/`** (not the parent sandbox folder) into the **root** of the **archived** **`stablescouncil.github.io`** working tree, commit, and push from that repo. Alternatively clone **`StablesCouncil/stablescouncil.github.io`** elsewhere and copy **`site/`** contents the same way. **Never** re-add a second full tree at the **Stables** repo root unless Council explicitly chooses submodule layout again.

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

*Last update: **`dapp/`** web tree: channel folders **`1-showcase/`** … **`4-prod/`** ( **`dapp.conf`** **`web`** = **`1-showcase/index.html`** ); stub **`v00…/`** redirects only (2026-04-16). **Publication parity** checklist + **`stream_1_app/README.md`** drive map; **`global_knowledge_base`** layer 5 **`dapp/`** pointer. **MiniDapp channels** table uses full **`C:\`** paths. Public pages: **`webpages/pages/<slug>/`**; MiniDapp: **`stream_1_app/dapp/`**; shared: **`static/`**; **`npm run sync:site`** builds **`site/`** only. Optional **`prod_presentation_v02/`** mirror: copy **`site/index.html`** and **`site/playing_field.html`** after sync. Earlier: Handover table retargeted to **`task_stablescouncil_github_io/`** (2026-04-12).*
