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
| **Add arguments** | `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\Charles\Documents\Stables\1_development\stream_3_governance\task_dev_utils\tools\backup-stables.ps1"` |
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

---

## 7. Prerequisites

- **OpenSSH:** `ssh` and `scp` in PATH (Windows 10+)
- **SSH key auth** to `root@140.82.36.166` (or password when prompted)
- **robocopy** (built-in on Windows)
