# Council public archive: `archive_*.raw.dat` (frequent export)

**Audience:** Operator on the Council Minima archive VPS (SSH, root or `sudo`).  
**Goal:** Produce **dated** raw archive files (same family as community mirrors such as eurobuddha’s **`archive_YYYY-MM-DD.raw.dat`**) so others can **bootstrap or re-sync an archive node**, without publishing **MySQL dumps**.

**Authoritative Minima reference:** [Archive File Export](https://docs.minima.global/docs/user-guides/archive-node/archive-export) (official `exportraw` syntax) and [Run an Archive Node](https://docs.minima.global/docs/run-a-node/archive-node) (integrity check).

---

## 0. Publication order (Council GitHub first, website links second)

This matches a sensible rollout.

| Layer | What goes there |
|-------|------------------|
| **Council Git repo (this monorepo)** | Operator procedure (this file), **`tools/publish-archive-raw.sh`**, optional small **manifest template** or checksum notes. **Do not** commit **`*.raw.dat`** files (large binary churn breaks clones and exceeds normal GitHub limits). |
| **VPS (HTTPS)** | The actual **`archive_YYYY-MM-DD.raw.dat`**, **`.sha256`**, **`archive_latest.raw.dat`**, optional **`README.txt`** / **`index.html`** with genesis wording and integrity snippet. |
| **Website “All links” page** | Add a row under **Council** on **[`stablescouncil.org/links.html`](https://stablescouncil.org/links.html)** (source: **`StablesCouncil/stablescouncil.github.io`** repo, not the monorepo `3_archive/` mirror). Point to your public **`archive_latest.raw.dat`** (or directory index). Add this **after** the HTTPS mirror is live so links never 404. |

So: **land the mirror on the server and prove one good export**, merge the governance doc in Git, then add the **links page** entry when the public URL is final.

**Live Council VPS (2026-04-16 rollout):**

- Static file HTTP: **`http://140.82.36.166:8080/`** (Python **`http.server`**, systemd **`minima-archive-http.service`**, root **`/var/www/minima-archive`**). Large downloads use this origin until a TLS hostname is added.
- **GitHub Pages hub:** **`https://stablescouncil.org/minima-archive/`** (landing page in **`StablesCouncil/stablescouncil.github.io`**), linked from **`https://stablescouncil.org/links.html`** next to Council Telegram / Discord.
- **Devtools (same Pages repo):** **`https://stablescouncil.org/devtools/`** (index), **`https://stablescouncil.org/devtools/minima-archive/`** (same downloads, operator framing), **`https://stablescouncil.org/devtools/minima-query/`** (holdings query **UI preview**; needs a Council API + finalized SQL before it runs for real). All three are listed under **Devtools** on **`links.html`**.
- **`nginx`** install was deferred when **`apt`** was locked by unattended upgrades; you can switch to nginx + TLS later and disable the Python unit.

**First successful export (2026-04-18):** `archive action:exportraw` via **`MinimaRPCClient`** produced **`archive_2026-04-18.raw.dat`** (~**923 MB** on disk, blocks **1–1629388** in JSON response). **`publish-archive-raw.sh`** then published **`archive_latest.raw.dat`** + **`.sha256`**. Re-run on a schedule with **`tools/run-archive-export-on-vps.sh`** (VPS-only; reads **`-rpcpassword`** from **`systemctl show minima`**; prefer moving RPC auth to a root-only file and a wrapper that does not expose secrets in **`ps`** long term).

---

## 1. Prerequisites

- Node started with **`-archive`** (you already run an archive-class node).
- Enough **free disk** for a second copy while exporting (roughly **1–2 GB** class file today; grows with chain).
- Decide a **public web directory** on the VPS (example: **`/var/www/minima-archive/`**) served by **nginx** (or Apache) with **autoindex** or a static index page.

---

## 2. One-time checks

**Integrity (recommended before advertising a file):**

```text
archive action:integrity
```

Interpret **`start`**, **`errors`**, and **`recommend`** per Minima docs.

**Where `exportraw` writes:** It depends on **`file:`** and your **`-basefolder`** / **`-data`** settings. With **`-basefolder /root`**, a **basename-only** `file:archive_....raw.dat` often lands under **`/root`**. Prefer an **absolute path** under your public tree once you confirm your Minima version accepts it, for example:

```text
archive action:exportraw file:/var/www/minima-archive/.staging/archive_2026-04-16.raw.dat
```

Create staging first:

```bash
sudo mkdir -p /var/www/minima-archive/.staging
sudo chown root:root /var/www/minima-archive
```

After the first successful export, confirm the path with:

```bash
sudo find /var/www /root -maxdepth 4 -name '*.raw.dat' -mmin -120 2>/dev/null
```

---

## 3. Export command (core step)

From the **Terminal MiniDapp** (write permission) or any **RPC channel you already use** for `mysql action:…` (see `minima_mysql_full_archive_procedure.md`):

```text
archive action:exportraw file:/ABS/PATH/archive_YYYY-MM-DD.raw.dat
```

Use **UTC date** in the filename for stable ordering, e.g. **`archive_2026-04-16.raw.dat`**.

**Notes:**

- Export can take **minutes** and loads the node; schedule **off-peak** (e.g. nightly), not every minute.
- **Frequency:** daily or twice-daily is enough for “frequently updated”; hourly is usually unnecessary and heavier on disk I/O.

---

## 4. Automation (cron / systemd timer)

Minima **`minima.jar`** is a **long-running** process; cron jobs should talk to the **running** node via **RPC** (`-rpcenable`), not start a second JVM.

**Pattern:**

1. **Trigger** `archive action:exportraw` to a **staging path** (same directory as final, or `.staging/`).
2. **Verify** the file exists and size is plausible (non-zero, stable size over a short sleep).
3. **Publish:** move or copy into the public directory, write **SHA-256**, update a **`archive_latest.raw.dat`** symlink, **prune** old files.

The repo ships **`tools/publish-archive-raw.sh`** for steps **2–3** once the export file exists.

**One-shot on the VPS (export + publish):** run as root **`tools/run-archive-export-on-vps.sh`** (uses **`MinimaRPCClient`** to **`https://127.0.0.1:9005`**, then **`publish-archive-raw.sh`**). Optional: **`tools/run-minima-exportraw-once.py integrity`** for a quick RPC check (GET-style URL builder; **`MinimaRPCClient` path is canonical** if anything disagrees).

**RPC details** (URL, port, POST body, Basic Auth user) **vary by Minima version** and your flags (`-rpcssl`, custom `-port`). Capture the working pattern once from your environment (for example browser devtools while issuing the same command from Terminal MiniDapp), then put secrets only in a **root-only** file, for example **`/root/minima-archive-export.env`** (`chmod 600`), never in git.

**Password hygiene:** If **`-rpcpassword`** contains characters that break shell quoting or HTTP Basic Auth, use a **password file** and a small wrapper that reads it safely, or **rotate** to an alphanumeric RPC password documented in `minima_mysql_full_archive_procedure.md`.

**Scheduling (important):** nothing updates **`archive_YYYY-MM-DD.raw.dat`** by itself. Each new file appears only after **`run-archive-export-on-vps.sh`** (or a manual **`exportraw`**) completes successfully. Until you add a scheduler, the latest file stays on the last run date.

**Example cron on the VPS (not installed by default):** as root, `crontab -e`:

```cron
15 3 * * * /root/tools/run-archive-export-on-vps.sh >> /var/log/minima-archive-export-cron.log 2>&1
```

Adjust time and log path as needed. Use **`systemd` timers** instead if you prefer.

---

## 5. Web publishing (nginx sketch)

- **`alias`** the public directory; enable **`autoindex on`** only if you accept a bare directory listing (eurobuddha-style), or ship a **generated `index.html`** with links + SHA-256.
- Serve over **HTTPS** (Let’s Encrypt).
- Optional: **`Content-Type`** for `.raw.dat` as **`application/octet-stream`** so browsers download.

---

## 6. Public provenance (genesis coverage)

**Yes, mention it** on the public download page (or a small **`README.txt`** / **`index.html`** next to the files): operators need to know **how far back** an export can re-sync users.

If the Council archive node was **chain re-synced from genesis** (or otherwise verified to cover **from block 1**), state that plainly, for example:

> This mirror is produced from a Minima **archive** node that **covers the chain from genesis** (as of last integrity check). Re-sync depth is still defined by **Minima’s import rules** and the user’s own node state; see Minima user docs.

**Honesty guardrail:** pair the claim with evidence users can verify:

- Publish **occasional** output of **`archive action:integrity`** (for example the reported **`start`** block and **`recommend`** line, with a timestamp), or
- Add a **`manifest.json`** next to each dated file: export date, file name, **SHA-256**, and the **`start`** value from the last integrity run.

If the node is ever rebuilt from a **younger** snapshot, **update the public text the same day** so the genesis claim is never stale.

---

## 7. Retention

Keep **N** days of dated files on the VPS (script default **14**). **SQL dumps are out of scope** for this public mirror; do not place **`archivedb_*.sql`** in the same public directory unless Council explicitly approves the risk.

---

## 8. Related docs

- MySQL parity / autobackup: **`minima_mysql_full_archive_procedure.md`**
- Read-only analysts: **`mysql_readonly_access_procedure_community.md`**
- Helper script: **`tools/publish-archive-raw.sh`**

---

## 9. Security reminder

- Do **not** commit **`systemd` unit files`** or env snippets containing **`-rpcpassword`**.
- Prefer **`EnvironmentFile=`** with **`chmod 600`** on the VPS.
- If a password ever appeared in logs, support tickets, or chat, **rotate** it.

---

## Appendix A. `links.html` Council row (stablescouncil.org)

**Shipped:** **`links.html`** in **`StablesCouncil/stablescouncil.github.io`** includes a **Minima archive mirror** row (next to **Telegram Council** and **Discord**) pointing to **`https://stablescouncil.org/minima-archive/`**, which explains downloads and links to **`http://140.82.36.166:8080/`** for raw files.

**If you fork the layout:** reuse the same pattern: public **HTTPS** hub on Pages, large binaries on **Council VPS** (or TLS front-end later), never multi‑gig binaries inside git.

**Council copy freeze:** If the Pages repo is under a “no copy changes” rule, treat this as an **approved infrastructure link** (same class as GitHub). When in doubt, confirm with whoever owns **`github_pages_website_engineering.md`** freeze policy.
