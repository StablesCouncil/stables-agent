# Stables Backup Process

**Canonical copy (governance):** this file lives under `2_current/stream_3_governance/prod_backup_and_bcp/`.  
**Executable scripts** are in `2_current/stream_3_governance/prod_backup_and_bcp/tools/` (this promoted tree). Optional thin wrappers remain under `1_development/.../task_dev_utils/tools/` for legacy Task Scheduler paths.

---

Backs up the project to the Vultr server. Aligned with the handshake structure, restoration protocol, and recent changes (Charter rename, brain base path, presentation, etc.).

**Business continuity (laptop loss, IDE chat restore):** see **`BCP.md`** in this folder.

The backup creates two artifacts per run:

- `Stables_core_YYYY-MM-DD_HHmm.zip` (project folders plus optional extra local paths; see below)
- `Stables_chat_delta_YYYY-MM-DD_HHmm.zip` (only changed Cursor/Antigravity chat files, unless `-ForceFullChat` or `-SkipBcpIde`)

---

## 1. Script Location

```
2_current/stream_3_governance/prod_backup_and_bcp/tools/backup-stables.ps1
```

The script **resolves the project root** from its own path (4 levels up from `tools/`), so it works from any working directory.

---

## 2. Task Scheduler Configuration (Stables Vultr Backup)

**If the task already exists** with a truncated or wrong path (e.g. `arles\backup-stables.ps1`), update it to the values below. The canonical script lives in `2_current/stream_3_governance/prod_backup_and_bcp/tools/` (you may keep using the thin wrapper under `task_dev_utils/tools/` if you prefer).

| Field | Value |
|-------|-------|
| **Program/script** | `powershell.exe` |
| **Add arguments** | `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" *> "C:\Users\Charles\Documents\Backup\Stables\scheduler_backup_log.txt"` |
| **Start in (optional)** | `C:\Users\Charles\Documents\Stables` |

> **Critical:** Fill in "Start in" with the project root. An empty "Start in" can cause path resolution issues.

**Full path if project is elsewhere:**

```
C:\Users\Charles\Documents\Stables
```

(or `H:\My Drive\Stables` if using Google Drive path)

---

## 3. What Gets Backed Up

### Core zip (`Stables_core_*.zip`)

| Folder | Purpose |
|--------|---------|
| `0_handshake` | Calibration, rules, master reference, session map, restoration protocol |
| `1_development` | Sandbox (brain base edits, agent code, drafts, all dev work) |
| `2_current` | **Source of Truth** (presentation, ledger, charter, brain, brand masters) |
| `3_archive` | Historical record |

**Always excluded (sensitive):** `prod_credentials` (entire folder), `.env` and all `.env.*` files.  
**Also excluded (bloat):** `node_modules`, `.git`, `.gemini`, `.agent`, `venv`, `__pycache__`, `.venv`, `env` (see script for full list).

### Extra paths (inside the core zip)

By default, `backup-stables.ps1` also **robocopies** one folder that lives **outside** the repo tree into the core zip under a generated top-level folder name (last three path segments, prefixed with `EXTRA_`), for example:

`C:\Users\Charles\Documents\Crypto\StablesLocal\Working files` → `EXTRA_Crypto_StablesLocal_Working_files\`

The same **sensitive and bloat exclusions** as the main tree apply. If the path does not exist on this PC, the script logs a warning and continues.

| Switch / parameter | Effect |
|--------------------|--------|
| `-ExtraBackupPaths @('D:\other')` | Replace the default list (pass multiple strings for several roots). |
| `-ExtraBackupPaths @()` | No extra paths. |
| `-SkipExtraBackupPaths` | Skip all extra-path copies regardless of defaults. |

Details: `BACKUP_SCRIPT_REFERENCE.md`.

### Chat delta zip (`Stables_chat_delta_*.zip`) — unless `-SkipBcpIde`

| Source on this PC | Inside the zip |
|--------------------|----------------|
| Cursor `%USERPROFILE%\.cursor\projects\<slug>\agent-transcripts\` | `cursor/agent-transcripts/...` |
| Antigravity `%USERPROFILE%\.gemini\antigravity\conversations\` | `antigravity/conversations/...` |

Only **changed** files since the last run are included (tracked in `tools/state/chat-state.json`), unless `-ForceFullChat`. Cursor **`assets`** are not included (path length + cache).

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
| **Naming** | `Stables_core_YYYY-MM-DD_HHmm.zip`, `Stables_chat_delta_YYYY-MM-DD_HHmm.zip` (and older `Stables_backup_*.zip` if present) |
| **Manifest** | Core zip contains `BACKUP_MANIFEST.txt` listing contents and key restore paths |

**Local copy:** Each run copies finished zips to `C:\Users\Charles\Documents\Backup\Stables\` (same timestamped filenames). Local zips are not pruned by default; use `-LocalRetentionZips N` to keep the newest N zips (e.g. `-LocalRetentionZips 14`).

**Retention (Vultr):** After each successful SSH reach to the server, `backup-stables.ps1` keeps only the **newest 14 `*.zip` files** in `/root/stables-backups` (by modification time). Older zips are deleted on the server so the disk does not fill. Override with **`-ServerRetentionZips N`** or disable with **`-SkipServerRetention`**. **Local** copies under `C:\Users\Charles\Documents\Backup\Stables` are not pruned by the script (prune manually or add a separate policy if you want).

**List backups on server:**

```bash
ssh root@140.82.36.166 "ls -la /root/stables-backups"
```

**Download a backup locally (examples):**

```bash
scp root@140.82.36.166:/root/stables-backups/Stables_core_2026-04-16_1244.zip .
scp root@140.82.36.166:/root/stables-backups/Stables_chat_delta_2026-04-16_1244.zip .
```

---

## 5. How to Find Things After Restore

| What you need | Path in core zip |
|---------------|------------------|
| **Ledger (restoration hash)** | `2_current\stream_3_governance\prod_project_ledger\ledger.md` |
| **Charter** | `2_current\stream_3_governance\prod_stables_charter\` |
| **Presentation (live site)** | `2_current\stream_2_community\prod_presentation_v02\` |
| **StablesAgent brain** | `2_current\stream_3_governance\prod_stablesagent-brain-base\` |
| **Handshake / rules** | `0_handshake\handshake.md`, `session_map.md` |
| **Brand masters** | `2_current\stream_1_app\prod_brand_masters\` |

Chat restore paths are in **`BCP.md`**.

---

## 6. Manual Run

```powershell
cd C:\Users\Charles\Documents\Stables
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1
```

**Test local-only (skip Vultr):**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -SkipVultr
```

**Skip GitHub (zip + Vultr only):**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -SkipGithub
```

**Skip Cursor + Antigravity chat zip:**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -SkipBcpIde
```

**Force full chat snapshot (ignore delta state for this run):**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -ForceFullChat
```

**Keep a different number of zips on Vultr (default 14):**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -ServerRetentionZips 30
```

**Do not delete old zips on Vultr from this script:**

```powershell
.\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1 -SkipServerRetention
```

---

## 7. Prerequisites

- **Git for Windows** (so `git.exe` exists under `C:\Program Files\Git\...`). The sync script resolves this path for Task Scheduler.
- **Git remote:** this repo uses a remote named **`backup`** pointing to the private Stables monorepo (`Charles0xhorizonxyz/stables`). There is no `origin` remote; use `git fetch backup` and `git log backup/main -1`.

### 7e. First-time GitHub remote setup (fresh machine or missing remote)

If `git remote -v` does not show a `backup` remote, run these steps once:

**Step 1 — Create the private repo on GitHub** (if it does not exist):

Go to [https://github.com/new](https://github.com/new), sign in as `Charles0xhorizonxyz`, create a **private** repo named `stables`. Do not initialise with a README (push the existing repo).

**Step 2 — Add the remote:**

```powershell
cd C:\Users\Charles\Documents\Stables
git remote add backup https://github.com/Charles0xhorizonxyz/stables.git
```

**Step 3 — Set the tracking config** (what `sync-stables.ps1` reads):

```powershell
git config branch.main.remote backup
```

**Step 4 — Configure the credential helper for the personal account URL**

`gh` CLI is authenticated as `StablesCouncilExec`. It cannot access private repos owned by `Charles0xhorizonxyz`. Override the credential helper for that URL prefix so Windows Credential Manager handles it instead:

```powershell
git config --global "credential.https://github.com/Charles0xhorizonxyz.helper" "manager"
```

**Step 5 — Initial push** (establishes full tracking ref; Windows Credential Manager will prompt for your PAT on first use and cache it):

```powershell
cd C:\Users\Charles\Documents\Stables
git push -u backup main
```

When prompted, enter `Charles0xhorizonxyz` as the username and a [fine-grained or classic PAT](https://github.com/settings/tokens) with **Contents: Read and write** on the `stables` repo as the password. Git Credential Manager stores it; future pushes (including Task Scheduler) are unattended.

**Verify:**

```powershell
git remote -v
git config branch.main.remote
git log backup/main -1
```

Expected: remote shows `backup https://github.com/Charles0xhorizonxyz/stables.git`, config returns `backup`, and the log shows the latest commit.
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

**`Recv failure: Connection was reset`** (HTTPS): almost always a **transient network** issue (Wi-Fi, VPN, firewall, antivirus TLS scanning), not a bad password or PAT. Run **`git push backup main`** again when the line is stable; the backup zip and Vultr upload already succeeded.
