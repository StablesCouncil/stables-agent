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
| `ExtraBackupPaths` | string[] | `C:\Users\Charles\Documents\Crypto\StablesLocal\Working files` | Absolute folders merged into the **core** zip under `EXTRA_*` names; missing paths are skipped with a warning |
| `SkipExtraBackupPaths` | switch | off | Do not copy any `ExtraBackupPaths` entries |
| `LocalRetentionZips` | int | `0` (disabled) | Keep only the newest N `*.zip` files in `LocalBackupPath` after copying; `0` = no pruning |
| `PersonalGitHubPat` | string | `""` (disabled) | **One-time setup.** Pass a PAT for `Charles0xhorizonxyz` on first run; the script stores it in Windows Credential Manager via `git credential approve` so all future runs (including Task Scheduler) push silently. Do not pass on subsequent runs. |

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

### 5) One-time GitHub credential setup (run once, then never again)

Stores your `Charles0xhorizonxyz` PAT in Windows Credential Manager so the backup remote can push silently on all future runs including Task Scheduler. Replace `ghp_YOURPAT` with your actual PAT (repo / Contents read+write scope).

```powershell
& "C:\Users\Charles\Documents\Stables\2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1" -PersonalGitHubPat "ghp_YOURPAT"
```

After this run succeeds, omit `-PersonalGitHubPat` on all future runs.

---

## Artifacts produced

| Artifact | When |
|----------|------|
| `Stables_core_YYYY-MM-DD_HHmm.zip` | Always (four repo roots + optional `EXTRA_*` paths + manifest) |
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
