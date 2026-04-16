# Stables — Business Continuity Plan (BCP)

**Purpose:** Minimize work lost if this PC is stolen, damaged, or replaced. This doc splits **automated** recovery (repo + IDE chat mirrors) from **manual** recovery (password managers and accounts you maintain yourself).

**Related:** `docs/BACKUP_README.md` (how `backup-stables.ps1` runs), `0_handshake/restoration_protocol.md` (Git and ledger).

---

## 1. What “good” looks like after a laptop loss

| Priority | You can still… |
|----------|------------------|
| **P0** | Clone/pull the **Stables** private repo from **GitHub** (full history, normal workflow). |
| **P1** | Restore **latest zip** from local disk, Vultr, or download: handshake trees + **`_bcp_ide_mirror`** (Cursor + Antigravity chat data for this machine profile). |
| **P2** | Sign in to **Bitwarden**, **Google**, GitHub, Vultr, and other services using your **manual** credential practice (not in daily zip). |

---

## 2. Backup tiers (what runs how often)

### Tier A — Daily (automated)

**Script:** `task_dev_utils/tools/backup-stables.ps1`

**Includes:**

- **`0_handshake`**, **`1_development`**, **`2_current`**, **`3_archive`** (with script exclusions: see `BACKUP_README.md`).
- **`_bcp_ide_mirror`** (when not skipped):
  - **Cursor (this repo):** Under `%USERPROFILE%\.cursor\projects\<cursor-slug>\` we mirror **`agent-transcripts`** (agent chat JSONL) and **`rules`** if present. We **do not** copy the **`assets`** folder (image cache with path-encoded names that break Windows `Compress-Archive` and are not needed to restore conversation text). Slug matches the Stables path (example: `C:\Users\Charles\Documents\Stables` → `c-Users-Charles-Documents-Stables`).
  - **Antigravity:** `%USERPROFILE%\.gemini\antigravity\`  
    Typical locations for **conversations** (for example `.pb` files under `conversations\`), **brain** data, and related IDE state (paths can change with Google updates).

**Does not include:** Git **`.git`** directory inside the zip (file tree only). **History** stays on **GitHub** via `git push`.

**Opt out of IDE mirror (smaller/faster zip):** `-SkipBcpIde`

### Tier B — Manual (not daily, your rhythm)

**Examples:** Bitwarden vault export (encrypted), Google account recovery options, GitHub 2FA backup codes, API keys stored only in vault, Vultr SSH key backup.

These are **not** dynamic in the same way as code; back them up on a **calendar** you choose (monthly/quarterly), not via `backup-stables.ps1`.

---

## 3. Security notes for IDE mirrors

Chat and IDE folders can contain **snippets of secrets**, **tokens**, or **internal URLs**. Treat zips like **sensitive data**:

- Restrict who can read **local** `Backup\Stables\` copies.
- Protect **Vultr** SSH access; the server holds the same zips.
- Do **not** publish zip contents or push `_bcp_ide_mirror` into a **public** repo (it lives only inside the **private** backup artifact unless you change process).

---

## 4. Restore on a new laptop (minimal loss)

### 4.1 Stables project (authoritative)

1. Install **Git**, **Cursor**, optional **Antigravity**, **OpenSSH** as needed.
2. Clone the private repo:  
   `git clone https://github.com/Charles0xhorizonxyz/stables.git`  
   (or SSH if configured.)
3. Copy **manual** secrets from Bitwarden / your vault process; restore **`2_current/.../prod_credentials`** only per Council workflow (never commit secrets to public Git).

### 4.2 IDE chat history from a backup zip

1. Unzip the latest `Stables_backup_*.zip`.
2. **Cursor:** Copy the backed-up folders  
   `_bcp_ide_mirror\cursor_project\<cursor-slug>\agent-transcripts\`  
   and, if you backed them up, `rules\`, into  
   `%USERPROFILE%\.cursor\projects\<same-cursor-slug>\`  
   (merge/replace; quit Cursor first). If the slug differs because the project path changed, rename the destination folder to match the **new** slug (derive from the new path using the same rule as the backup script: `drive-Rest-Of-Path-With-Hyphens`).
3. **Antigravity:** Copy  
   `_bcp_ide_mirror\antigravity\`  
   into  
   `%USERPROFILE%\.gemini\antigravity\`  
   (merge/replace; quit Antigravity first). If Google changes layout, prefer restoring `conversations` and `brain` subfolders per current docs.

**Expectation:** Restores are **best effort**. IDE vendors can change formats; keeping **Tier A** zips plus **GitHub** gives you both narrative (chat) and code truth.

### 4.3 Verify

- Open the repo in Cursor; confirm recent transcripts appear if restore paths matched.
- `git status` clean on `main` after clone; run your usual smoke tests.

---

## 5. Gap analysis (honest limits)

| Item | Covered by daily zip? | Notes |
|------|------------------------|--------|
| Stables four roots | Yes (minus script exclusions) | Root-only loose files at repo root are **not** in the four folders unless you move them. |
| Git history | No (in zip) | Use **GitHub clone**. |
| Cursor `assets` cache | No | Omitted on purpose (MAX_PATH + not needed for chat text). |
| Cursor global profile (all workspaces) | No | Only **agent-transcripts** + **rules** for this repo’s slug; extend script if you need globalStorage. |
| Antigravity outside `.gemini\antigravity` | No | Extend script if Google moves data. |
| OS, drivers, other apps | No | Reinstall. |

---

## 6. Ownership

**Maintainer:** Charles (Council). Update this file when backup script paths or restore steps change.

**Last updated:** 2026-04-16
