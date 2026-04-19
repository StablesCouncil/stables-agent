# Site (generated public tree)

This folder is the **only** built copy of what ships at **`https://stablescouncil.org/`**: same paths as the GitHub Pages repo root (`index.html`, `links.html`, `circulareconomy/`, `dapp/`, `assets/`, `brand/`, …).

It is **generated** by `npm run sync:site` from **`../github_pages_root/`** and sibling **`../../dapp/`** (into **`site/dapp/`**). Do not edit files here; they are overwritten every sync. Edit sources only in **`../github_pages_root/`** (see **`CANONICAL_LAYOUT.md`** there).

## Browse locally

From the parent folder (`task_stablescouncil_github_io/`):

```bash
npx --yes serve site
```

Paths match production (for example `/links.html`, `/devtools/minima-query/` → `site/devtools/minima-query/index.html`, `/dapp/2-demo/`).

## Promoted mirror under `2_current`

After you validate the live site, run **`npm run promote:current`** (or **`powershell -File tools/promote-site-to-current.ps1`**) to mirror this folder into **`2_current/stream_1_app/prod_stablescouncil_github_pages_root/`** (same layout as the GitHub Pages repo root). Ship from **`site/`** or from that **`2_current`** folder into your **`stablescouncil.github.io`** clone.

## Ship to GitHub Pages

Copy the **contents** of this folder into the **root** of the **`StablesCouncil/stablescouncil.github.io`** working tree (not a `site/` subfolder on the server). The Pages repo root **is** this tree.

Git tracks only **`site/README.md`** here; generated files are listed in **`.gitignore`**. Run **`npm run sync:site`** after clone before ship or preview.
