# backup-stables.ps1 — parameters and operator presets

**Script path (execute from anywhere):**

```text
2_current/stream_3_governance/prod_backup_and_bcp/tools/backup-stables.ps1
```

**Full path (this machine):**

```text
C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1
```

**Governance docs (this folder):** `BACKUP_README.md`, `BCP.md`

---

## All parameters

| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `VultrHost` | string | `140.82.36.166` | SSH/SCP host |
| `VultrUser` | string | `root` | SSH user |
| `BackupBaseOnServer` | string | `/root/stables-backups` | Remote directory for zips + retention scope |
| `LocalBackupPath` | string | `C:\Users\Charles\Documents\Backup\Stables` | Local folder for finished zips |
| `SkipVultr` | switch | off | No SSH/SCP, no server retention |
| `SkipGithub` | switch | off | Do not run `sync-stables.ps1` after backup |
| `SkipBcpIde` | switch | off | No chat delta zip (Cursor + Antigravity incremental) |
| `ForceFullChat` | switch | off | Chat zip includes all tracked chat files this run (not delta-only) |
| `ServerRetentionZips` | int | `14` | On server: keep newest N `*.zip` files in `BackupBaseOnServer` (mtime order; **all** `*.zip` names count together) |
| `SkipServerRetention` | switch | off | Do not delete old zips on the server |

**Example (any directory):**

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" `
  -ServerRetentionZips 14 -SkipGithub:$false -SkipVultr:$false
```

---

## Four common run presets

### 1) Normal daily (default)

Core zip + chat delta (if changes) + local copy + Vultr + GitHub.

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1"
```

### 2) Local test (no Vultr, no GitHub)

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" -SkipVultr -SkipGithub
```

### 3) No chat layer (core only)

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" -SkipBcpIde
```

### 4) Weekly-style full chat baseline

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" -ForceFullChat
```

---

## Artifacts produced

| Artifact | When |
|----------|------|
| `Stables_core_YYYY-MM-DD_HHmm.zip` | Always (four roots + manifest) |
| `Stables_chat_delta_YYYY-MM-DD_HHmm.zip` | When chat files changed (or always if `-ForceFullChat`) unless `-SkipBcpIde` |

---

## Log and state paths (on this PC)

| File | Path |
|------|------|
| Chat delta state | `2_current/stream_3_governance/prod_backup_and_bcp/tools/state/chat-state.json` |
| Run log (CSV) | `2_current/stream_3_governance/prod_backup_and_bcp/tools/state/backup-run-log.csv` |
| Task Scheduler transcript (if configured) | `C:\Users\Charles\Documents\Backup\Stables\scheduler_backup_log.txt` |

**Note:** `state/*.json` and `*.csv` are runtime outputs; they may be committed if you want them in Git, or add to `.gitignore` later if you prefer them local-only.

---

## sync-stables.ps1 (GitHub only)

Path:

```text
2_current/stream_3_governance/prod_backup_and_bcp/tools/sync-stables.ps1
```

Typical manual sync:

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\sync-stables.ps1" -AlsoPushWhenClean -Message "Manual sync"
```

Repo root also has `push-to-github.bat` (runs sync with `-AlsoPushWhenClean`).
