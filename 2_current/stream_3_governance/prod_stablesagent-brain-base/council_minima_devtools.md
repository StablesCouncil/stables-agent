# Council Minima dev tools (public website)

Canonical public URLs (custom domain `stablescouncil.org`):

- **Hub:** `https://stablescouncil.org/devtools/` — lists the two current tools: archive chain exports and the address holdings query (preview).
- **Archive downloads (devtools path):** `https://stablescouncil.org/devtools/minima-archive/` — same `archive_*.raw.dat` files as the public mirror; large files are served from Council VPS, not from GitHub.
- **Holdings query (preview UI):** `https://stablescouncil.org/devtools/minima-query/` — static preview only until a Council-hosted API exists; GitHub Pages cannot query MySQL directly.

**All links page:** Under the **Council** section there is a single row, **Minima dev tools** (wrench icon), pointing to the hub. Sub-tools are not listed separately on the links page.

**Site chrome:** The three devtools pages use the same shell as other council pages: Stables header, right-hand rail (globe menu includes Full presentation, Minima dev tools, All links; share menu), footer, site map prev/next, and the StablesAgent floating button with embedded chat (when the agent service is online).

**Governance runbooks** (Stables monorepo, not on the public site): operator export, MySQL read-only access, and archive scheduling live under `2_current/stream_3_governance/prod_minima_archive_admin/`.

When SQL and API design are finalised, update this file and the live HTML copy under `StablesCouncil/stablescouncil.github.io` so StablesAgent stays aligned after ingestion.
