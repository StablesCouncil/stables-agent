# github_pages_root

**Single authoring tree** for the static site: **folder names and layout match** the [GitHub Pages](https://github.com/StablesCouncil/stablescouncil.github.io) repository **root** (and **`2_current/stream_1_app/prod_stablescouncil_github_pages_root/`** after promotion), except:

- **`dapp/`** is **not** stored here. It is authored at **`1_development/stream_1_app/dapp/`** and **overlaid** into **`site/dapp/`** on every **`npm run sync:site`**.

**Workflow:** edit HTML, CSS, and assets **here** → **`npm run sync:site`** → review **`../site/`** → **`npm run promote:current`** → review **`2_current/.../prod_stablescouncil_github_pages_root/`** → copy to your **`stablescouncil.github.io`** clone and push.

See **`CANONICAL_LAYOUT.md`** (required tree and naming) and **`ARCHIVE_POLICY.md`** (how **`3_archive/`** snapshots keep the **same** interior names).

## Recent layout (changelog)

- **2026-04-18:** Minima archive hub is **`devtools/minima-archive/`** (matches **`/devtools/minima-archive/`** online). There is **no** root **`minima-archive/`** folder in this tree (avoid duplicate URL surface). **`devtools/index.html`** lists the two tools using the same **tile** pattern as **`links.html`** (see **`assets/devtools-hub-tiles.css`**). **`devtools/minima-archive/index.html`** uses the same **full document chrome** as **`devtools/minima-query/`** (header, rail, **`devtools-pages.css`** panel, footer, StablesAgent FAB).
- **2026-04-19:** Archive page layout: centered panel, breadcrumb (cyan parent + gray **Archive**), lede with highlighted **`code`** / **cadence**, two-line **Download** button (`assets/devtools-pages.css`, **`body.devtools-archive-page`**).
