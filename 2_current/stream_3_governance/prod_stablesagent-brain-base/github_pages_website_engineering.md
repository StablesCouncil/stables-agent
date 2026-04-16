# Stables public website: engineering and operations

**Audience:** StablesAgent, operators, and contributors who need **how the site is built, previewed, and shipped**, not marketing copy.

**Companion docs:** User-facing messaging stays in **`website_presentation.md`**. Protocol and economics stay in **`protocol_mechanics_spec.md`**, **`stables_master_reference.md`**, and **`comprehensive_knowledge_base.md`**. For the **authoritative file map and ship checklist** in the monorepo, use **`handover_document.md`** at the Stables repository root (Status block holds the latest **GitHub Pages** commit reference when maintained).

---

## 1. Live site and repos

- **Public site (custom domain):** `https://stablescouncil.org/`
- **GitHub Pages origin:** `https://stablescouncil.github.io/` (same deployment; custom domain is **`stablescouncil.org`** via **`CNAME`** in the Pages repo root).
- **Pages repository:** `StablesCouncil/stablescouncil.github.io` on **`main`**. Only the **root** of that repo is what GitHub Pages serves.
- **Council handshake task name for authoring:** **`task_stablescouncil_github_io`** (sandbox under **`1_development/stream_1_app/`**).

---

## 2. Canonical authoring layout (monorepo)

Authoring spans **two** sibling folders under **`1_development/stream_1_app/`** (paths relative to Stables repo root):

**`1_development/stream_1_app/task_stablescouncil_github_io/`** (static pages + build) and **`1_development/stream_1_app/dapp/`** (MiniDapp only).

| Layer | Path | Role |
|-------|------|------|
| **Human page sources** | **`task_stablescouncil_github_io/webpages/pages/<slug>/index.html`** | One folder per route; slugs include **`index`**, **`links`**, **`playing_field`**, **`qr-code`**, **`ambassadorsprogramdesc`**, **`circulareconomy`**, **`bankingsystem`**. |
| **MiniDapp web mirror** | **`1_development/stream_1_app/dapp/`** | Same folder layout as **`https://stablescouncil.org/dapp/`** (**`1-showcase/`**, **`2-demo/`**, **`3-test/`**, **`4-prod/`**, optional **`v00…/`** redirect stubs, …). |
| **Shared shipped assets** | **`static/`** | Shared CSS (including **`stables.css`** pattern from Council spec), **`assets/`** (e.g. **`site-chrome.css`**), brand files, **`CNAME`**, images used across pages. |
| **Built tree (generated)** | **`site/`** | **Only** output that matches the live URL layout. **Do not hand-edit** files here except **`site/README.md`** (tracked). Everything else under **`site/`** is produced by sync and is typically gitignored. |
| **Sync tool** | **`tools/sync-site.mjs`** | Implements the merge and copy rules. |

There is **no** duplicate **`index.html`** or **`dapp/`** at the **task folder root**; the root holds **`webpages/`**, **`static/`**, **`site/`**, and tooling.

**Eleventy:** templates may live under **`src/`** with **`npm run build`**; the **hand-maintained** public pages use **`npm run sync:site`** for the tree that ships to Pages.

---

## 3. Route map (source → live URL → `site/` output)

| Source | Typical live URL | Output under **`site/`** |
|--------|------------------|---------------------------|
| **`webpages/pages/index/`** | **`/`** | **`index.html`** |
| **`webpages/pages/links/`** | **`/links.html`** | **`links.html`** |
| **`webpages/pages/playing_field/`** | **`/playing_field.html`** | **`playing_field.html`** |
| **`webpages/pages/qr-code/`** | **`/qr-code.html`** | **`qr-code.html`** |
| **`webpages/pages/ambassadorsprogramdesc/`** | **`/ambassadorsprogramdesc.html`** | **`ambassadorsprogramdesc.html`** |
| **`webpages/pages/circulareconomy/`** | **`/circulareconomy/`** | **`circulareconomy/`** (directory) |
| **`webpages/pages/bankingsystem/`** | **`/bankingsystem/`** | **`bankingsystem/`** (directory) |
| **`stream_1_app/dapp/`** | **`/dapp/...`** | **`dapp/`** (copied by **`sync-site`** from **`../dapp/`**) |

Detail tables also live in **`task_stablescouncil_github_io/webpages/README.md`** and **`handover_document.md`**.

---

## 4. Build command

From **`task_stablescouncil_github_io/`**:

```bash
npm run sync:site
```

This runs **`node tools/sync-site.mjs`**, which **merges `static/` into `site/` first**, then copies **`webpages/`** into **`site/`** according to the route map. Always run sync after changing **`webpages/`** or **`static/`** before previewing the full site or copying to the Pages repo.

---

## 5. Ship workflow (GitHub Pages)

1. Edit **`webpages/`** and **`static/`** (and **`tools/`** if the pipeline changes).
2. Run **`npm run sync:site`** so **`site/`** is complete and consistent.
3. Copy **only the contents** of **`site/`** (not the parent sandbox folder name) into the **root** of the **`stablescouncil.github.io`** working tree, then commit and push **`main`**.

**Monorepo mirror:** A full clone with embedded git metadata may live under **`3_archive/stream_1_app/task_archived_nested_repo_stablescouncil_github_io_2026-04-12/stablescouncil.github.io/`** with **`_embedded_git/`**; the archive **`README.md`** documents **`git --git-dir`** / **`--work-tree`** usage. Operators may instead use a standalone clone of **`StablesCouncil/stablescouncil.github.io`** and copy **`site/`** the same way.

**Custom domain:** Repo root **`CNAME`** must match GitHub Pages custom domain settings for **`stablescouncil.org`**.

---

## 6. Local preview and `file://` behaviour

Opening **`index.html` (and other pages) directly from disk** uses the **`file:`** protocol. Relative paths that assume **`https://stablescouncil.org/`** may fail unless adjusted.

**Implemented pattern:** Main pages under **`webpages/pages/.../`** include a small script that runs on **`DOMContentLoaded`**: when the protocol is **`file:`**, it rewrites asset URLs (for example toward **`../../../static/`**), and **re-clones** linked stylesheets and scripts so CSS and JS **reload** after href/src changes. Agent and rail controls that depend on correct asset paths should therefore work under local file preview as well as on the live site.

**Shared chrome:** Global footer/header styling and spacing may be centralized in **`static/assets/site-chrome.css`** (linked from pages after sync). Design tokens and button classes follow **`0_handshake/web_component_spec.md`** and Council **`stables.css`** conventions.

---

## 7. Content and chrome policy (handover)

**Agreed constraint:** Do **not** change core copy, headings, body text, link targets, link order, diagrams, or interactive behaviour inside existing main content regions unless Council explicitly lifts the freeze. Safe changes: **layout wrappers**, **global header/footer**, **spacing**, **shared styles**, **encoding fixes** for existing characters, **asset path** fixes, and **pipeline** improvements.

**Objective:** One **uniform chrome** (header + footer + shared CSS) so all nodes **feel** like one site. **Template first:** **`links`** hub was chosen as the first shell template, then the same pattern rolls to other pages.

---

## 8. StablesAgent on the site

The public site exposes StablesAgent (FAB / avatar / chat entry points depending on page). **Knowledge** for answers comes from the Council brain pipeline (Markdown brain base → ingestion → **`llms.txt`** / vector store); see **`website_presentation.md`** for the public **`llms.txt`** URL and Telegram / X entry points.

When operators **update this engineering document** or other brain Markdown, they must promote from sandbox **`1_development/stream_3_governance/task_stablesagent-brain-base/`** to **`2_current/stream_3_governance/prod_stablesagent-brain-base/`** per handshake, then run the ingestion script in **`2_current/stream_3_governance/task_x_agent_node/`** (for example **`node ingest_knowledge.js`**) so **`llms.txt`** and embeddings stay current.

---

## 9. Quick operator checklist

1. Edit **`webpages/`** or **`static/`** in **`task_stablescouncil_github_io`**.  
2. Run **`npm run sync:site`**.  
3. Spot-check **`site/`** (or open synced HTML with the **`file:`** helper in place).  
4. Copy **`site/`** contents to **`stablescouncil.github.io`** repo root; commit; push **`main`**.  
5. Confirm **`CNAME`** and HTTPS when changing domain-related files.  
6. If brain docs changed: promote **`task_stablesagent-brain-base`** → **`prod_stablesagent-brain-base`**, then ingest.

---

## 10. Related files in the Stables repo (for humans and agents)

- **`handover_document.md`** — Status, seven-node table, ship workflow, archive path.  
- **`task_stablescouncil_github_io/webpages/README.md`** — Page and **`dapp`** map, sync command.  
- **`task_stablescouncil_github_io/static/README.md`** — Static assets policy.  
- **`task_stablescouncil_github_io/site/README.md`** — What **`site/`** is and that it is generated.  
- **`0_handshake/handshake.md`**, **`0_handshake/web_component_spec.md`**, **`0_handshake/session_map.md`** — Governance, UI tokens, task matrix.
