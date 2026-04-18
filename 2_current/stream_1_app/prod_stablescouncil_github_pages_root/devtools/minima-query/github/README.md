# Minima holdings query — GitHub-side naming

**Where the page is edited in the Stables repo:** `2_current/stream_1_app/prod_stablescouncil_github_pages_root/` — copy **`assets/minima-holdings-query.js`** and **`devtools/minima-query/`** into [stablescouncil.github.io](https://github.com/StablesCouncil/stablescouncil.github.io) (same paths) and deploy for **stablescouncil.org** to pick up changes. If you only browse the live site, you will not see Stables-only edits until that sync runs.

This folder documents how **address labels** and **operator notes** on the [Minima holdings query](https://stablescouncil.org/devtools/minima-query/) page relate to **GitHub**.

- The on-page **Address naming** box collects a **public GitHub username**, an optional **label** for the Minima address shown in the chart panel, and optional **notes**. Nothing here is submitted automatically from static Pages; wire-up belongs on the Council API when ready.
- Use your **normal GitHub identity** for attribution. Do not put secrets, keys, or session tokens in issues or PRs.

When the Council publishes a concrete workflow (issue template, JSON schema, or PR path), add a short link here so operators have one place to look.

**Exchange presets:** The **Saved address** dropdown options from Council defaults are defined in **`assets/minima-holdings-query.js`** (`DEFAULT_PRESETS` or override `window.STABLES_MINIMA_HOLDINGS_PRESETS`). Per-browser saved rows are separate (`localStorage`). Replace any remaining placeholder exchange hex when known.

**Query string (holdings API):** `address`, optional `date_from` / `date_to` (YYYY-MM-DD, omitted when range is **All**), and `interval_type` one of `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR`.

**Repo:** [stablescouncil.github.io](https://github.com/StablesCouncil/stablescouncil.github.io) — path `devtools/minima-query/`.
