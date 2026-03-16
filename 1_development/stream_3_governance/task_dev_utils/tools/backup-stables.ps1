<#
.SYNOPSIS
    Backs up the Stables project to the Vultr server. Aligned with handshake structure and restoration protocol.

.DESCRIPTION
    Creates a timestamped zip of all project folders (0_handshake, 1_development, 2_current, 3_archive),
    excluding sensitive data (prod_credentials, .env). SCPs to Vultr, writes a manifest.
    Run via Task Scheduler or manually. See BACKUP_README.md for Task Scheduler configuration.

.EXAMPLE
    .\backup-stables.ps1
#>

[CmdletBinding()]
param(
    [string]$VultrHost = "140.82.36.166",
    [string]$VultrUser = "root",
    [string]$BackupBaseOnServer = "/root/stables-backups",
    [string]$LocalBackupPath = "C:\Users\Charles\Documents\Backup\Stables",
    [switch]$SkipVultr = $false
)

$ErrorActionPreference = "Stop"

function Log { param($Msg) $dt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"; Write-Host "[$dt] $Msg" }

# Resolve project root: script is in task_dev_utils/tools/, so root is 4 levels up
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName

Log "Project root: $ProjectRoot"
if (-not (Test-Path (Join-Path $ProjectRoot "0_handshake"))) {
    throw "Project root not found. Expected 0_handshake at: $ProjectRoot"
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$ZipName = "Stables_backup_$Timestamp.zip"
$LocalZipPath = Join-Path $env:TEMP $ZipName

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

To list backups on server: ssh $VultrUser@$VultrHost "ls -la $BackupBaseOnServer"
"@ | Out-File -FilePath $ManifestPath -Encoding utf8

# Create zip using .NET (Compress-Archive has limitations with exclusions)
$TempDir = Join-Path $env:TEMP "stables_backup_temp_$Timestamp"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

$RoboExcludeDirs = "node_modules", ".git", ".gemini", ".agent", "prod_credentials", "venv", "__pycache__"
$RoboExcludeFiles = ".env", ".env.local", ".env.development.local", ".env.test.local", ".env.production.local"

try {
    foreach ($folder in $BackupFolders) {
        $Src = Join-Path $ProjectRoot $folder
        if (Test-Path $Src) {
            Log "Copying $folder..."
            $Dest = Join-Path $TempDir $folder
            New-Item -ItemType Directory -Path (Split-Path $Dest) -Force | Out-Null
            & robocopy $Src $Dest /E /XD $RoboExcludeDirs /XF $RoboExcludeFiles /NFL /NDL /NJH /NJS /NC /NS /NP 2>$null
        }
    }
    Copy-Item $ManifestPath (Join-Path $TempDir "BACKUP_MANIFEST.txt")
    Log "Compressing to zip (this may take several minutes)..."
    Compress-Archive -Path "$TempDir\*" -DestinationPath $LocalZipPath -Force
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
    $RemoteDest = "${VultrUser}@${VultrHost}:${BackupBaseOnServer}/"
    Log "Uploading to Vultr..."
    ssh "${VultrUser}@${VultrHost}" "mkdir -p $BackupBaseOnServer" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Log "WARNING: Cannot reach Vultr (ssh failed). Is SSH key set up? Run: ssh root@$VultrHost"
    } else {
        scp $LocalZipPath $RemoteDest
        if ($LASTEXITCODE -ne 0) {
            Log "WARNING: SCP upload failed. Local backup saved at: $LocalCopyPath"
        } else {
            Log "Backup complete. Stored at $BackupBaseOnServer/$ZipName on $VultrHost"
        }
    }
} else {
    Log "Skipped Vultr upload (-SkipVultr). Local backup at: $LocalCopyPath"
}

# Cleanup local zip
Remove-Item $LocalZipPath -Force -ErrorAction SilentlyContinue
