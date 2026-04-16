# Stables — Business Continuity Plan (BCP)

**Purpose:** Minimize work lost if this PC is stolen, damaged, or replaced. This doc splits **automated** recovery (repo + IDE chat continuity) from **manual** recovery (password managers and accounts you maintain yourself).

**Related:** `BACKUP_README.md` (how `backup-stables.ps1` runs), `0_handshake/restoration_protocol.md` (Git and ledger).

**Script path (execution):** `2_current/stream_3_governance/prod_backup_and_bcp/tools/backup-stables.ps1`

---

## 1. What “good” looks like after a laptop loss

| Priority | You can still… |
|----------|------------------|
| **P0** | Clone/pull the **Stables** private repo from **GitHub** (full history, normal workflow). |
| **P1** | Restore **latest core zip** plus **chat delta zips** (or a run made with `-ForceFullChat`) from local disk or Vultr. |
| **P2** | Sign in to **Bitwarden**, **Google**, GitHub, Vultr, and other services using your **manual** credential practice (not in daily zip). |

---

## 2. Backup tiers (what runs how often)

### Tier A — Daily (automated)

**Script:** `2_current/stream_3_governance/prod_backup_and_bcp/tools/backup-stables.ps1`

**Core zip (`Stables_core_*.zip`) includes:**

- **`0_handshake`**, **`1_development`**, **`2_current`**, **`3_archive`** (with script exclusions: see `BACKUP_README.md`).
- Does **not** include Git **`.git`** (file tree only). **History** stays on **GitHub** via `git push`.

**Chat delta zip (`Stables_chat_delta_*.zip`) includes** (unless `-SkipBcpIde`):

- **Cursor:** files under `%USERPROFILE%\.cursor\projects\<cursor-slug>\agent-transcripts\` (delta logic; use `-ForceFullChat` for a full snapshot). **`assets`** are not backed up (cache + MAX_PATH risk).
- **Antigravity:** files under `%USERPROFILE%\.gemini\antigravity\conversations\` (delta unless `-ForceFullChat`).

**Opt out of chat zip:** `-SkipBcpIde`

### Tier B — Manual (not daily, your rhythm)

**Examples:** Bitwarden vault export (encrypted), Google account recovery options, GitHub 2FA backup codes, API keys stored only in vault, Vultr SSH key backup.

These are **not** dynamic in the same way as code; back them up on a **calendar** you choose (monthly/quarterly), not via `backup-stables.ps1`.

---

## 3. Security notes for chat zips

Chat files can contain **snippets of secrets**, **tokens**, or **internal URLs**. Treat chat zips like **sensitive data**:

- Restrict who can read **local** `Backup\Stables\` copies.
- Protect **Vultr** SSH access; the server holds the same zips.
- Do **not** publish chat zip contents to a **public** repo.

---

## 4. Restore on a new laptop (minimal loss)

### 4.1 Stables project (authoritative)

1. Install **Git**, **Cursor**, optional **Antigravity**, **OpenSSH** as needed.
2. Clone the private repo:  
   `git clone https://github.com/Charles0xhorizonxyz/stables.git`  
   (or SSH if configured.)
3. Copy **manual** secrets from Bitwarden / your vault process; restore **`2_current/.../prod_credentials`** only per Council workflow (never commit secrets to public Git).

### 4.2 IDE chat history from backup zips

1. Unzip the latest **`Stables_core_*.zip`** into your chosen workspace folder (or rely on Git clone alone for code).
2. Apply **chat delta zips in chronological order** (oldest to newest) so you rebuild the latest transcript files. Each chat zip contains:
   - `cursor/agent-transcripts/...`
   - `antigravity/conversations/...`
3. **Cursor:** merge those `cursor/agent-transcripts` paths into  
   `%USERPROFILE%\.cursor\projects\<same-cursor-slug>\agent-transcripts\`  
   (quit Cursor first). Slug rule matches the backup script (example: `C:\Users\Charles\Documents\Stables` → `c-Users-Charles-Documents-Stables`).
4. **Antigravity:** merge `antigravity/conversations` into  
   `%USERPROFILE%\.gemini\antigravity\conversations\`  
   (quit Antigravity first).

If you ever took a **`-ForceFullChat`** zip, that single chat zip can stand in for “full baseline” for that day’s snapshot.

**Expectation:** Restores are **best effort**. IDE vendors can change formats; **GitHub + core zip + ordered chat deltas** is the practical recovery stack.

### 4.3 Verify

- Open the repo in Cursor; confirm recent transcripts appear if restore paths matched.
- `git status` clean on `main` after clone; run your usual smoke tests.

---

## 5. Gap analysis (honest limits)

| Item | Covered by daily backup? | Notes |
|------|---------------------------|--------|
| Stables four roots | Yes (core zip, minus script exclusions) | Root-only loose files at repo root are **not** in the four folders unless you move them. |
| Git history | No (in zip) | Use **GitHub clone**. |
| Cursor `assets` cache | No | Omitted on purpose (MAX_PATH + not needed for chat text). |
| Cursor global profile (all workspaces) | No | Only this repo’s transcripts in delta zip; extend script if you need globalStorage. |
| Antigravity outside `conversations` | No | Extend script if Google moves data. |
| OS, drivers, other apps | No | Reinstall. |

---

## 6. Ownership

**Maintainer:** Charles (Council). Update this file when backup script paths or restore steps change.

**Last updated:** 2026-04-16
