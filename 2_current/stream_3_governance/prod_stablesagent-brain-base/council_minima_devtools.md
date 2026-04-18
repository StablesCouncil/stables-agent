# Council Minima dev tools (public website)

Canonical public URLs (custom domain `stablescouncil.org`):

- **Hub:** `https://stablescouncil.org/devtools/` — lists archive chain exports for archive nodes and the Minima address holdings explorer.
- **Archive downloads (devtools path):** `https://stablescouncil.org/devtools/minima-archive/` — same `archive_*.raw.dat` files as the public mirror; large files are served from Council VPS, not from GitHub.
- **Holdings query:** `https://stablescouncil.org/devtools/minima-query/` — operator-facing form and chart placeholder; the live query requires a Council-hosted API (GitHub Pages cannot reach MySQL directly).

**All links page:** Under the **Council** section there is a single row, **Minima dev tools** (wrench icon), pointing to the hub. Sub-tools are not listed separately on the links page.

**Site chrome:** The three devtools pages match other document deck pages: Stables header, right-hand rail (globe menu includes Full presentation, Minima dev tools, All links; share menu), **`main` → `div.container` → `div.title-block` (`h1` + `p.subtitle`)** for canonical title spacing and typography, panels below, footer, **`siteMapNav`** with roles **`devtools-hub`**, **`devtools-archive`**, **`devtools-query`**, and the StablesAgent floating button with embedded chat (when the agent service is online). See **`github_pages_website_engineering.md`** (document page uniformity).

**Governance runbooks** (Stables monorepo, not on the public site): operator export, MySQL read-only access, and archive scheduling live under `2_current/stream_3_governance/prod_minima_archive_admin/`.

When SQL and API design are finalised, update this file and the live HTML copy under `StablesCouncil/stablescouncil.github.io` so StablesAgent stays aligned after ingestion.
