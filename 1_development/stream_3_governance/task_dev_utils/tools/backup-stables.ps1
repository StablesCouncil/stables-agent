<#
.SYNOPSIS
    Backs up the Stables project to the Vultr server. Aligned with handshake structure and restoration protocol.

.DESCRIPTION
    Creates a timestamped zip of all project folders (0_handshake, 1_development, 2_current, 3_archive),
    excluding sensitive data (prod_credentials, .env). Copies zip locally, SCPs to Vultr, then runs
    sync-stables.ps1 to push to GitHub (uses branch.main.remote, e.g. backup). Run via Task Scheduler or manually.
    See BACKUP_README.md for Task Scheduler configuration.

.EXAMPLE
    .\backup-stables.ps1
#>

[CmdletBinding()]
param(
    [string]$VultrHost = "140.82.36.166",
    [string]$VultrUser = "root",
    [string]$BackupBaseOnServer = "/root/stables-backups",
    [string]$LocalBackupPath = "C:\Users\Charles\Documents\Backup\Stables",
    [switch]$SkipVultr = $false,
    [switch]$SkipGithub = $false
)

$ErrorActionPreference = "Stop"

function Log { param($Msg) $dt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"; Write-Host "[$dt] $Msg" }

# Explicit OpenSSH paths (for Task Scheduler context)
$SshExe = Join-Path $env:SystemRoot "System32\OpenSSH\ssh.exe"
$ScpExe = Join-Path $env:SystemRoot "System32\OpenSSH\scp.exe"

# Resolve project root: script is in task_dev_utils/tools/, so root is 4 levels up
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName

Log "Project root: $ProjectRoot"
if (-not (Test-Path (Join-Path $ProjectRoot "0_handshake"))) {
    throw "Project root not found. Expected 0_handshake at: $ProjectRoot"
}
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$TimestampCompact = Get-Date -Format "yyyyMMddHHmmss"
$ZipName = "Stables_backup_$Timestamp.zip"

$LocalZipPath = Join-Path $env:TEMP $ZipName

# Staging must use a SHORT path: deep trees under 3_archive can exceed Windows MAX_PATH (~260)
# when nested under AppData\Local\Temp\stables_backup_temp_..., breaking Compress-Archive.
$StageRoot = Join-Path $env:SystemDrive "_StablesBackupStage"

# Folders to backup (handshake Source of Truth + development + archive)
$BackupFolders = @(
    "0_handshake",
    "1_development",
    "2_current",
    "3_archive"
)

# Create manifest first
$ManifestPath = Join-Path $env:TEMP "backup_manifest_$Timestamp.txt"
@"
STABLES BACKUP MANIFEST
======================
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Project Root: $ProjectRoot
Zip: $ZipName

CONTENTS (Handshake-aligned)
---------------------------
- 0_handshake: Calibration, rules, master reference, restoration protocol
- 1_development: Sandbox (drafts, brain base edits, agent code)
- 2_current: Source of Truth (presentation, ledger, charter, brain, brand masters)
- 3_archive: Historical record

EXCLUDED (never backed up - sensitive)
-------------------------------------
- prod_credentials: Vault, encryption tools, account references
- .env: Agent tokens (Telegram, OpenRouter, Moltbook, X API)

KEY FILES TO FIND ON RESTORE
----------------------------
- Ledger: 2_current\stream_3_governance\prod_project_ledger\ledger.md
- Charter: 2_current\stream_3_governance\prod_stables_charter\
- Presentation: 2_current\stream_2_community\prod_presentation_v02\
- Brain Base: 2_current\stream_3_governance\prod_stablesagent-brain-base\
- Handshake: 0_handshake\handshake.md, session_map.md

VULTR DESTINATION
-----------------
$BackupBaseOnServer/$ZipName

LOCAL COPY (C:)
---------------
$LocalBackupPath/$ZipName

GITHUB
------
After this zip is created, the backup task runs sync-stables.ps1 (commit if dirty, else push if ahead of remote/main).

To list backups on server: ssh $VultrUser@$VultrHost "ls -la $BackupBaseOnServer"
"@ | Out-File -FilePath $ManifestPath -Encoding utf8

# Create zip using .NET (Compress-Archive has limitations with exclusions and long paths)
New-Item -ItemType Directory -Path $StageRoot -Force | Out-Null
$TempDir = Join-Path $StageRoot $TimestampCompact
if (Test-Path $TempDir) {
    Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

$RoboExcludeDirs = @("node_modules", ".git", ".gemini", ".agent", "prod_credentials", "venv", "__pycache__", ".venv", "env")
$RoboExcludeFiles = @(".env", ".env.local", ".env.development.local", ".env.test.local", ".env.production.local")

try {
    foreach ($folder in $BackupFolders) {
        $Src = Join-Path $ProjectRoot $folder
        if (Test-Path $Src) {
            Log "Copying $folder..."
            $Dest = Join-Path $TempDir $folder
            New-Item -ItemType Directory -Path (Split-Path $Dest) -Force | Out-Null
            
            # Using splatting-style argument construction for robust robocopy exclusion
            $RoboArgs = @($Src, $Dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/NP", "/R:0", "/W:0")
            if ($RoboExcludeDirs) { $RoboArgs += "/XD"; $RoboArgs += $RoboExcludeDirs }
            if ($RoboExcludeFiles) { $RoboArgs += "/XF"; $RoboArgs += $RoboExcludeFiles }
            
            & robocopy @RoboArgs 2>$null
        }
    }
    Copy-Item $ManifestPath (Join-Path $TempDir "BACKUP_MANIFEST.txt")
    Log "Compressing to zip (this may take several minutes)..."
    try {
        Compress-Archive -Path "$TempDir\*" -DestinationPath $LocalZipPath -Force
    } catch {
        Log "ERROR: Zip failed. If paths under 3_archive are extremely deep, enable Windows long paths (Group Policy: Enable Win32 long paths) or prune that archive tree."
        throw
    }
} finally {
    Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path $LocalZipPath)) {
    throw "Backup zip was not created."
}

Log "Backup created: $LocalZipPath"

# Copy to local backup folder on C:
New-Item -ItemType Directory -Path $LocalBackupPath -Force | Out-Null
$LocalCopyPath = Join-Path $LocalBackupPath $ZipName
Copy-Item $LocalZipPath $LocalCopyPath -Force
Log "Local copy saved to: $LocalCopyPath"

# SCP to Vultr (optional)
if (-not $SkipVultr) {
    if (-not (Test-Path $SshExe) -or -not (Test-Path $ScpExe)) {
        Log "WARNING: OpenSSH client not found at $SshExe / $ScpExe - skipping Vultr upload."
    } else {
        $RemoteDest = "${VultrUser}@${VultrHost}:${BackupBaseOnServer}/"
        Log "Uploading to Vultr..."
        & $SshExe "${VultrUser}@${VultrHost}" "mkdir -p $BackupBaseOnServer" 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Log "WARNING: Cannot reach Vultr (ssh failed, exit code $LASTEXITCODE). Is SSH key set up? Run: ssh root@$VultrHost"
        } else {
            & $ScpExe $LocalZipPath $RemoteDest
            if ($LASTEXITCODE -ne 0) {
                Log "WARNING: SCP upload failed with exit code $LASTEXITCODE. Local backup saved at: $LocalCopyPath"
            } else {
                Log "Backup complete. Stored at $BackupBaseOnServer/$ZipName on $VultrHost"
            }
        }
    }
} else {
    Log "Skipped Vultr upload (-SkipVultr). Local backup at: $LocalCopyPath"
}

# GitHub sync (after zip + upload so backups succeed even if Git fails)
if (-not $SkipGithub) {
    $SyncScript = Join-Path $ScriptDir "sync-stables.ps1"
    $Pwsh = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
    if (-not (Test-Path $SyncScript)) {
        Log "WARNING: sync-stables.ps1 not found at $SyncScript - skipping GitHub."
    } elseif (-not (Test-Path $Pwsh)) {
        Log "WARNING: powershell.exe not found at $Pwsh - skipping GitHub."
    } else {
        Log "Syncing to GitHub (branch.main.remote)..."
        & $Pwsh -NoProfile -ExecutionPolicy Bypass -File $SyncScript `
            -Message "Automated Backup Sync: $Timestamp" `
            -AlsoPushWhenClean
        if ($LASTEXITCODE -ne 0) {
            Log "WARNING: GitHub sync exited with code $LASTEXITCODE. Local and Vultr backups are still valid."
        } else {
            Log "GitHub sync finished successfully."
        }
    }
} else {
    Log "Skipped GitHub sync (-SkipGithub)."
}

# Cleanup local zip
Remove-Item $LocalZipPath -Force -ErrorAction SilentlyContinue
