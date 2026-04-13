# Stables Backup Process

Backs up the project to the Vultr server. Aligned with the handshake structure, restoration protocol, and recent changes (Charter rename, brain base path, presentation, etc.).

---

## 1. Script Location

```
1_development/stream_3_governance/task_dev_utils/tools/backup-stables.ps1
```

The script **resolves the project root** from its own path (4 levels up from `tools/`), so it works from any working directory.

---

## 2. Task Scheduler Configuration (Stables Vultr Backup)

**If the task already exists** with a truncated or wrong path (e.g. `arles\backup-stables.ps1`), update it to the values below. The script now lives in `task_dev_utils/tools/`, not at the project root.

| Field | Value |
|-------|-------|
| **Program/script** | `powershell.exe` |
| **Add arguments** | `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\Charles\Documents\Stables\1_development\stream_3_governance\task_dev_utils\tools\backup-stables.ps1" *> "C:\Users\Charles\Documents\Backup\Stables\scheduler_backup_log.txt"` |
| **Start in (optional)** | `C:\Users\Charles\Documents\Stables` |

> **Critical:** Fill in "Start in" with the project root. An empty "Start in" can cause path resolution issues.

**Full path if project is elsewhere:**
```
C:\Users\Charles\Documents\Stables
```
(or `H:\My Drive\Stables` if using Google Drive path)

---

## 3. What Gets Backed Up

| Folder | Purpose |
|--------|---------|
| `0_handshake` | Calibration, rules, master reference, session map, restoration protocol |
| `1_development` | Sandbox (brain base edits, agent code, drafts, all dev work) |
| `2_current` | **Source of Truth** (presentation, ledger, charter, brain, brand masters) |
| `3_archive` | Historical record |

**Always excluded (sensitive):** `prod_credentials` (entire folder), `.env` and all `.env.*` files.  
**Also excluded (bloat):** `node_modules`, `.git`, `.gemini`, `.agent`.

---

## 3b. Where Sensitive Data Lives (Never Backed Up)

| Location | Contents |
|----------|----------|
| `2_current/stream_3_governance/prod_credentials/` | vault.md (accounts, bookmarks), encryption tools, StablesVault.ps1. Passwords belong in Bitwarden, not here. |
| `1_development/stream_3_governance/task_stablesagent-brain-base/.env` | Telegram bot token, OpenRouter API key, Moltbook API key, X Agent keys (API key, secret, access token, access secret). |

---

## 4. Where Backups Live on Vultr

| Location | Description |
|----------|-------------|
| **Path** | `/root/stables-backups/` |
| **Naming** | `Stables_backup_YYYY-MM-DD_HHmm.zip` (unique per run; previous backups are not overwritten) |
| **Manifest** | Each zip contains `BACKUP_MANIFEST.txt` listing contents and key restore paths |
| **Approx size** | ~400–800 MB per backup (zip compressed; ~1.2 GB before compression) |

**Local copy:** Each backup is also saved to `C:\Users\Charles\Documents\Backup\Stables\` on the C: drive (same timestamped filename).

**Retention:** All backups are kept (Vultr + local). Consider pruning old backups periodically to free disk space.

**List backups on server:**
```bash
ssh root@140.82.36.166 "ls -la /root/stables-backups"
```

**Download a backup locally:**
```bash
scp root@140.82.36.166:/root/stables-backups/Stables_backup_2026-03-15_2149.zip .
```

---

## 5. How to Find Things After Restore

| What you need | Path in backup |
|---------------|----------------|
| **Ledger (restoration hash)** | `2_current\stream_3_governance\prod_project_ledger\ledger.md` |
| **Charter** | `2_current\stream_3_governance\prod_stables_charter\` |
| **Presentation (live site)** | `2_current\stream_2_community\prod_presentation_v02\` |
| **StablesAgent brain** | `2_current\stream_3_governance\prod_stablesagent-brain-base\` |
| **Handshake / rules** | `0_handshake\handshake.md`, `session_map.md` |
| **Brand masters** | `2_current\stream_1_app\prod_brand_masters\` |

---

## 6. Manual Run

```powershell
cd C:\Users\Charles\Documents\Stables
.\1_development\stream_3_governance\task_dev_utils\tools\backup-stables.ps1
```

**Test local-only (skip Vultr):**
```powershell
.\1_development\stream_3_governance\task_dev_utils\tools\backup-stables.ps1 -SkipVultr
```

**Skip GitHub (zip + Vultr only):**
```powershell
.\1_development\stream_3_governance\task_dev_utils\tools\backup-stables.ps1 -SkipGithub
```

---

## 7. Prerequisites

- **Git for Windows** (so `git.exe` exists under `C:\Program Files\Git\...`). The sync script resolves this path for Task Scheduler.
- **Git remote:** whatever `git config branch.main.remote` returns (this repo uses **`backup`**). The URL is **whatever you set locally** (often `git@github.com:Charles0xhorizonxyz/stables.git` for SSH or `https://github.com/Charles0xhorizonxyz/stables.git` for HTTPS). There is no `origin` remote; use `git fetch backup` and `git log backup/main -1`.
- **OpenSSH:** built-in `ssh.exe` / `scp.exe` under `C:\Windows\System32\OpenSSH\`
- **SSH key auth** to `root@140.82.36.166` (or password when prompted)
- **robocopy** (built-in on Windows)

### 7a. GitHub step (daily with the scheduled task)

After the local zip is written and Vultr upload is attempted, `backup-stables.ps1` calls **`sync-stables.ps1`**:

- If there are **uncommitted changes:** `git add .`, `git commit -m "Automated Backup Sync: <timestamp>"`, `git push <remote> main` (remote = `branch.main.remote`, usually `backup`).
- If the tree is **clean** but `main` is **ahead of `<remote>/main`:** `git fetch <remote>` then `git push <remote> main` (no empty commit).

If `git push` fails (for example local `main` is behind the remote and needs a merge), the script logs a **WARNING** and exits non-zero from the Git step only; your zip files on disk and Vultr are already saved.

One-click manual sync (without full backup) still uses:

`push-to-github.bat` → `sync-stables.ps1 -Message "One-click manual sync"`.

### 7b. Scheduler user context

For Vultr upload to work (ssh keys available), configure the task to:

- Use account: `LITETOP\Charles`
- **Run only when user is logged on** (not “whether user is logged on or not”)
- Do **not** change the `backup-stables.ps1` arguments in the XML; update them via Task Scheduler UI if needed.

### 7c. Zip step: `Could not find a part of the path` / `CompressArchiveUnauthorizedAccessError`

Deep folders under **`3_archive`** can make **full path length** exceed the classic Windows **260-character** limit when files are first copied under a long temp path, then **`Compress-Archive`** runs. The backup script stages under a **short drive-root folder** (for example `C:\_StablesBackupStage\<timestamp>`) to avoid that. If zip still fails, enable **long paths** in Windows (Group Policy or registry `LongPathsEnabled`) or shorten/remove the deepest archived tree.

### 7d. GitHub: `Permission denied (publickey)`

If `git push backup main` fails with **`git@github.com: Permission denied (publickey)`**, your **`backup`** remote is using **SSH** and GitHub is not accepting any key from that shell (interactive PowerShell or Task Scheduler).

**Option A — HTTPS (simplest for scheduled sync):** point `backup` at HTTPS so Git Credential Manager can use a stored PAT:

```powershell
cd C:\Users\Charles\Documents\Stables
git remote set-url backup https://github.com/Charles0xhorizonxyz/stables.git
git push backup main
```

Create a [fine-grained or classic PAT](https://github.com/settings/tokens) with **Contents: Read and write** on that repo if prompted.

**Option B — SSH:** keep `git@github.com:...`, add the matching **public** key to GitHub (Settings → SSH keys), ensure **`ssh-agent`** has the private key loaded in the same context that runs the backup (`ssh-add`, and for Task Scheduler prefer “Run only when user is logged on” so your agent can see keys). Test with:

```powershell
ssh -T git@github.com
```

You should see a success message naming your GitHub user before relying on automated push.
