# Webpages (human sources for static site pages)

Edit **hand-maintained HTML pages** here. Shared CSS, images, and **`CNAME`** live in **`../static/`** (single source). The **built** site (what matches the live URL tree) is **`../site/`**, produced only by **`npm run sync:site`**.

The **MiniDapp** tree is **not** here. It lives in **`../../dapp/`** (repo path **`1_development/stream_1_app/dapp/`**), the same shape as **`https://stablescouncil.org/dapp/`**.

There is **no** second copy of page HTML at the task folder root.

## Layout

| Area | On disk | Purpose |
|------|---------|---------|
| **Static site pages** | **`pages/<slug>/`** | One folder per route. Each holds **`index.html`**. Slugs mirror live names/stems: **`index`**, **`links`**, **`playing_field`**, **`qr-code`**, **`ambassadorsprogramdesc`**, **`circulareconomy`**, **`bankingsystem`**, **`minima-archive`**. |
| **MiniDapp (author here)** | **`../../dapp/`** | Same tree as **`/dapp/`** on the site: **`1_development/stream_1_app/dapp/`** (**`showcase/`**, **`demo/`**, **`dapp.conf`**, optional **`v00…/`** redirect stubs, …). |

## Map: `pages/` and `dapp/` → live URL → output under `../site/`

| Source | Live URL | Output path under `site/` |
|--------|----------|---------------------------|
| `pages/index/` | `/` | `site/index.html` |
| `pages/links/` | `/links.html` | `site/links.html` |
| `pages/playing_field/` | `/playing_field.html` | `site/playing_field.html` |
| `pages/qr-code/` | `/qr-code.html` | `site/qr-code.html` |
| `pages/ambassadorsprogramdesc/` | `/ambassadorsprogramdesc.html` | `site/ambassadorsprogramdesc.html` |
| `pages/circulareconomy/` | `/circulareconomy/` | `site/circulareconomy/` |
| `pages/bankingsystem/` | `/bankingsystem/` | `site/bankingsystem/` |
| `pages/minima-archive/` | `/minima-archive/` | `site/minima-archive/` |
| `../../dapp/` | `/dapp/`, `/dapp/1-showcase/`, `/dapp/2-demo/`, `/dapp/v00.00.00.00.03/`, `/dapp/v00.00.00.01.00/` (redirect stubs), … | `site/dapp/` |

### MiniDapp: where to edit

- **Path:** **`1_development/stream_1_app/dapp/`** (see **`../../dapp/README.md`**).
- **Showcase (web):** **`dapp/1-showcase/index.html`** (same relative **`../assets/`** layout as **`prod_stables_app_v00.00.00.00.03/showcase/index.html`**). Copy from that **`showcase/index.html`** when you cut a release, then run **`sync:site`**.
- **Demo (web):** **`dapp/2-demo/`** is mirrored from **`prod_stables_app_demo/`** (re-run **`robocopy`** without **`build/`** when the demo tree changes; see **`../../README.md`**).
- **Legacy URLs:** **`dapp/v00.00.00.00.03/`** and **`dapp/v00.00.00.01.00/`** are **redirect** stubs to **`showcase/`** and **`demo/`**.

## Sync

```bash
npm run sync:site
```

Runs **`tools/sync-site.mjs`**: merges **`../static/`** into **`../site/`**, copies **`webpages/pages/...`**, then copies **`../../dapp/`** into **`../site/dapp/`**.

Commit **`webpages/`**, **`../dapp/`**, **`static/`**, and **`tools/sync-site.mjs`** (and docs). **`site/*`** except **`site/README.md`** is ignored by Git; regenerate before ship or preview.

## Eleventy

Templates in **`../src/`**; **`npm run build`** writes to the task folder root only when templates emit files. Hand-maintained pages are **not** from Eleventy; use **`sync:site`** for the public tree.
