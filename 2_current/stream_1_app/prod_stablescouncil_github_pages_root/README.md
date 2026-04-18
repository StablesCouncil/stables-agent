# prod_stablescouncil_github_pages_root

**Purpose:** This folder is the **promoted** copy of the **GitHub Pages repository root** layout (what [stablescouncil.org](https://stablescouncil.org/) serves): `index.html`, `links.html`, `stables.css`, `assets/`, `brand/`, `dapp/`, `devtools/` (including **`devtools/minima-archive/`**), `CNAME`, and the rest of the flat tree. There is **no** top-level **`minima-archive/`** in the shipped tree.

**Authoring stays in dev:** Edit sources only under **`1_development/stream_1_app/task_stablescouncil_github_io/github_pages_root/`** and **`1_development/stream_1_app/dapp/`**. Run **`npm run sync:site`** there so **`site/`** is regenerated.

**Promotion (run when live matches what you want in `2_current`):**

1. From **`task_stablescouncil_github_io`**: `npm run sync:site`
2. Then: `powershell -NoProfile -ExecutionPolicy Bypass -File tools/promote-site-to-current.ps1`

**Ship to GitHub Pages:** Copy **this folder’s contents** (after promotion) into your **`stablescouncil.github.io`** working tree root, commit, push **`main`**.

**Note:** The script mirrors **`site/`** then restores this README so it is not replaced by **`site/README.md`**.

**Interior names** must stay aligned with **`1_development/.../github_pages_root/CANONICAL_LAYOUT.md`** and **`ARCHIVE_POLICY.md`** in that folder.
