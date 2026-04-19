<#
.SYNOPSIS
    Backs up Stables core + lightweight chat continuity artifacts.

.DESCRIPTION
    Creates a timestamped CORE zip of all project folders (0_handshake, 1_development, 2_current, 3_archive),
    excluding sensitive data and bulky caches. Optionally includes extra absolute paths (default: Crypto StablesLocal working folder). Creates a separate CHAT-DELTA zip with only changed chat files
    from Cursor agent-transcripts and Antigravity conversations (stateful incremental backup).
    Copies zips locally, uploads to Vultr (prunes older zips on server to keep newest N by default),
    then runs sync-stables.ps1 to push to GitHub.
    Operator docs: `2_current/stream_3_governance/prod_backup_and_bcp/BACKUP_README.md` (same folder tree as this script).

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
    [switch]$SkipGithub = $false,
    [switch]$SkipBcpIde = $false,
    [switch]$ForceFullChat = $false,
    [int]$ServerRetentionZips = 14,
    [switch]$SkipServerRetention = $false,
    [string[]]$ExtraBackupPaths = @('C:\Users\Charles\Documents\Crypto\StablesLocal\Working files'),
    [switch]$SkipExtraBackupPaths = $false,
    [int]$LocalRetentionZips = 0,
    [string]$PersonalGitHubPat = ""
)

$ErrorActionPreference = "Stop"

function Log { param($Msg) $dt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"; Write-Host "[$dt] $Msg" }

# Cursor names each workspace folder under .cursor/projects/<slug>; slug matches drive + path with hyphens.
function Get-CursorProjectSlug {
    param([string]$Root)
    try {
        $full = (Resolve-Path -LiteralPath $Root -ErrorAction Stop).ProviderPath
    } catch {
        return $null
    }
    if ($full -match '^([A-Za-z]):\\') {
        $drive = $Matches[1].ToLower()
        $tail = $full.Substring(3) -replace '\\', '-'
        return "$drive-$tail"
    }
    return $null
}

function Invoke-RoboMirror {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [string[]]$ExcludeDirs = @(),
        [string[]]$ExcludeFiles = @()
    )
    if (-not (Test-Path -LiteralPath $SourcePath)) { return $false }
    New-Item -ItemType Directory -Path (Split-Path $DestPath) -Force | Out-Null
    $RoboArgs = @($SourcePath, $DestPath, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/NP", "/R:0", "/W:0")
    if ($ExcludeDirs.Count -gt 0) { $RoboArgs += "/XD"; $RoboArgs += $ExcludeDirs }
    if ($ExcludeFiles.Count -gt 0) { $RoboArgs += "/XF"; $RoboArgs += $ExcludeFiles }
    & robocopy @RoboArgs 2>$null | Out-Null
    return $true
}

function Get-FileKey {
    param([string]$Base, [string]$FullPath)
    # PS 5.1 / .NET Framework does not expose Path.GetRelativePath.
    $baseNorm = $Base.TrimEnd('\') + '\'
    $baseUri = New-Object System.Uri($baseNorm)
    $fullUri = New-Object System.Uri($FullPath)
    $rel = $baseUri.MakeRelativeUri($fullUri).ToString()
    return [System.Uri]::UnescapeDataString($rel)
}

function Get-FileState {
    param([string]$Path)
    $i = Get-Item -LiteralPath $Path
    return @{
        lastWriteUtc = $i.LastWriteTimeUtc.ToString("o")
        length       = [string]$i.Length
    }
}

function Get-ExtraBackupDestName {
    param([string]$FullPath)
    $lp = (Resolve-Path -LiteralPath $FullPath -ErrorAction Stop).Path.TrimEnd('\')
    $segs = $lp -split '\\'
    $take = [Math]::Min(3, $segs.Count)
    if ($take -lt 1) { return "EXTRA_unknown" }
    $tail = ($segs[($segs.Count - $take)..($segs.Count - 1)] -join '_')
    $safe = ($tail -replace '[^a-zA-Z0-9_\-]+', '_')
    return "EXTRA_$safe"
}

# Explicit OpenSSH paths (for Task Scheduler context)
$SshExe = Join-Path $env:SystemRoot "System32\OpenSSH\ssh.exe"
$ScpExe = Join-Path $env:SystemRoot "System32\OpenSSH\scp.exe"

function Invoke-VultrBackupRetention {
    param([int]$KeepCount)
    if ($SkipServerRetention) { return }
    if ($KeepCount -lt 1) {
        Log "WARNING: ServerRetentionZips must be >= 1; skipping Vultr retention."
        return
    }
    $fromLine = $KeepCount + 1
    Log "Vultr retention: keeping newest $KeepCount zip(s) in $BackupBaseOnServer (mtime order)..."
    & $SshExe "${VultrUser}@${VultrHost}" "sh -c 'ls -1t $BackupBaseOnServer/*.zip 2>/dev/null | tail -n +$fromLine | xargs -r rm -f'" 2>&1 | Out-Null
}

# Resolve project root: script is in prod_backup_and_bcp/tools/, so root is 4 levels up
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName

Log "Project root: $ProjectRoot"
if (-not (Test-Path (Join-Path $ProjectRoot "0_handshake"))) {
    throw "Project root not found. Expected 0_handshake at: $ProjectRoot"
}
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$TimestampCompact = Get-Date -Format "yyyyMMddHHmmss"
$CoreZipName = "Stables_core_$Timestamp.zip"
$ChatZipName = "Stables_chat_delta_$Timestamp.zip"
$LocalCoreZipPath = Join-Path $env:TEMP $CoreZipName
$LocalChatZipPath = Join-Path $env:TEMP $ChatZipName
$StateDir = Join-Path $ScriptDir "state"
$ChatStatePath = Join-Path $StateDir "chat-state.json"
$RunLogPath = Join-Path $StateDir "backup-run-log.csv"
New-Item -ItemType Directory -Path $StateDir -Force | Out-Null

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
Core zip: $CoreZipName
Chat zip: $(if ($SkipBcpIde) { "SKIPPED (-SkipBcpIde)" } else { $ChatZipName })

CONTENTS (Handshake-aligned)
---------------------------
- 0_handshake: Calibration, rules, master reference, restoration protocol
- 1_development: Sandbox (drafts, brain base edits, agent code)
- 2_current: Source of Truth (presentation, ledger, charter, brain, brand masters)
- 3_archive: Historical record
- chat delta zip: only changed Cursor agent-transcripts + Antigravity conversations
$(if (-not $SkipExtraBackupPaths -and $ExtraBackupPaths -and $ExtraBackupPaths.Count -gt 0) {
"- extra paths (inside core zip): see BACKUP_MANIFEST.txt section EXTRA PATHS after run"
} else {
"- extra paths: SKIPPED (-SkipExtraBackupPaths or empty list)"
})

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

GOVERNANCE DOCS (operator)
--------------------------
2_current\stream_3_governance\prod_backup_and_bcp\  (BACKUP_README, BCP, BACKUP_SCRIPT_REFERENCE)

VULTR DESTINATION
-----------------
$BackupBaseOnServer/$CoreZipName
$BackupBaseOnServer/$ChatZipName (if generated)

LOCAL COPY (C:)
---------------
$LocalBackupPath/$CoreZipName
$LocalBackupPath/$ChatZipName (if generated)

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
    # ---------- CORE STAGING ----------
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

    if (-not $SkipExtraBackupPaths -and $ExtraBackupPaths -and $ExtraBackupPaths.Count -gt 0) {
        foreach ($extraRoot in $ExtraBackupPaths) {
            $er = if ($null -eq $extraRoot) { "" } else { "$extraRoot".Trim() }
            if ([string]::IsNullOrWhiteSpace($er)) { continue }
            if (-not (Test-Path -LiteralPath $er)) {
                Log "WARNING: Extra backup path missing (skip): $er"
                continue
            }
            try {
                $destName = Get-ExtraBackupDestName -FullPath $er
            } catch {
                Log "WARNING: Cannot resolve extra path (skip): $er"
                continue
            }
            $Dest = Join-Path $TempDir $destName
            Log "Copying extra path -> $destName ..."
            $RoboArgs = @($er, $Dest, "/E", "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/NP", "/R:0", "/W:0")
            if ($RoboExcludeDirs) { $RoboArgs += "/XD"; $RoboArgs += $RoboExcludeDirs }
            if ($RoboExcludeFiles) { $RoboArgs += "/XF"; $RoboArgs += $RoboExcludeFiles }
            & robocopy @RoboArgs 2>$null
        }
    }

    Copy-Item $ManifestPath (Join-Path $TempDir "BACKUP_MANIFEST.txt")
    if (-not $SkipExtraBackupPaths -and $ExtraBackupPaths -and $ExtraBackupPaths.Count -gt 0) {
        $mf = Join-Path $TempDir "BACKUP_MANIFEST.txt"
        Add-Content -LiteralPath $mf -Encoding utf8 -Value @(
            "",
            "EXTRA PATHS (robocopy into core zip)",
            "--------------------------------------"
        )
        foreach ($extraRoot in $ExtraBackupPaths) {
            $er = if ($null -eq $extraRoot) { "" } else { "$extraRoot".Trim() }
            if ([string]::IsNullOrWhiteSpace($er)) { continue }
            if (-not (Test-Path -LiteralPath $er)) { continue }
            try {
                $dn = Get-ExtraBackupDestName -FullPath $er
                Add-Content -LiteralPath $mf -Encoding utf8 -Value ('- {0} -> {1}' -f $er, $dn)
            } catch { }
        }
    }
    Log "Compressing CORE zip (this may take several minutes)..."
    try {
        Compress-Archive -Path "$TempDir\*" -DestinationPath $LocalCoreZipPath -Force
    } catch {
        Log "ERROR: CORE zip failed. If paths are extremely deep, enable Win32 long paths or prune deep archive trees."
        throw
    }

    # ---------- CHAT DELTA STAGING ----------
    $ChatTempDir = Join-Path $StageRoot "chat_$TimestampCompact"
    if (Test-Path $ChatTempDir) { Remove-Item -Path $ChatTempDir -Recurse -Force -ErrorAction SilentlyContinue }
    New-Item -ItemType Directory -Path $ChatTempDir -Force | Out-Null

    $ChatState = @{}
    if ((-not $ForceFullChat) -and (Test-Path -LiteralPath $ChatStatePath)) {
        try {
            $raw = Get-Content -LiteralPath $ChatStatePath -Raw
            if ($raw) { $ChatState = (ConvertFrom-Json $raw -AsHashtable) }
        } catch {
            Log "WARNING: chat-state.json unreadable, fallback to full chat snapshot."
            $ChatState = @{}
        }
    }
    if ($null -eq $ChatState) { $ChatState = @{} }

    $NextState = @{}
    $CopiedChatFiles = 0

    if (-not $SkipBcpIde) {
        $ChatSources = @()
        $slug = Get-CursorProjectSlug -Root $ProjectRoot
        if ($slug) {
            $cursorTranscripts = Join-Path $env:USERPROFILE ".cursor\projects\$slug\agent-transcripts"
            if (Test-Path -LiteralPath $cursorTranscripts) {
                $ChatSources += @{ name = "cursor"; base = $cursorTranscripts; dest = (Join-Path $ChatTempDir "cursor\agent-transcripts") }
                Log "BCP: indexing Cursor transcripts ($slug)..."
            } else {
                Log "WARNING: Cursor transcripts not found: $cursorTranscripts"
            }
        }
        $agConversations = Join-Path $env:USERPROFILE ".gemini\antigravity\conversations"
        if (Test-Path -LiteralPath $agConversations) {
            $ChatSources += @{ name = "antigravity"; base = $agConversations; dest = (Join-Path $ChatTempDir "antigravity\conversations") }
            Log "BCP: indexing Antigravity conversations..."
        } else {
            Log "WARNING: Antigravity conversations not found: $agConversations"
        }

        foreach ($src in $ChatSources) {
            New-Item -ItemType Directory -Path $src.dest -Force | Out-Null
            $files = Get-ChildItem -LiteralPath $src.base -Recurse -File -ErrorAction SilentlyContinue
            foreach ($f in $files) {
                $key = "$($src.name)/$(Get-FileKey -Base $src.base -FullPath $f.FullName)"
                $state = Get-FileState -Path $f.FullName
                $changed = $ForceFullChat
                if (-not $changed) {
                    if (-not $ChatState.ContainsKey($key)) { $changed = $true }
                    else {
                        $prev = $ChatState[$key]
                        if (($prev.lastWriteUtc -ne $state.lastWriteUtc) -or ($prev.length -ne $state.length)) { $changed = $true }
                    }
                }
                if ($changed) {
                    $destFile = Join-Path $src.dest (Get-FileKey -Base $src.base -FullPath $f.FullName)
                    New-Item -ItemType Directory -Path (Split-Path $destFile) -Force | Out-Null
                    Copy-Item -LiteralPath $f.FullName -Destination $destFile -Force
                    $CopiedChatFiles++
                }
                $NextState[$key] = $state
            }
        }

        if ($CopiedChatFiles -gt 0) {
            Log "Compressing CHAT-DELTA zip ($CopiedChatFiles changed files)..."
            Compress-Archive -Path "$ChatTempDir\*" -DestinationPath $LocalChatZipPath -Force
            $NextState | ConvertTo-Json -Depth 6 | Out-File -LiteralPath $ChatStatePath -Encoding utf8
        } else {
            Log "No chat changes since last run; skipping chat zip."
            if ($NextState.Count -gt 0) {
                $NextState | ConvertTo-Json -Depth 6 | Out-File -LiteralPath $ChatStatePath -Encoding utf8
            }
        }
    } else {
        Log "Skipped BCP IDE mirror (-SkipBcpIde)."
    }

    if (-not (Test-Path -LiteralPath $RunLogPath)) {
        "timestamp,coreZipBytes,chatZipBytes,chatFilesCopied,skipBcpIde,forceFullChat" | Out-File -LiteralPath $RunLogPath -Encoding utf8
    }
    $coreSize = if (Test-Path -LiteralPath $LocalCoreZipPath) { (Get-Item -LiteralPath $LocalCoreZipPath).Length } else { 0 }
    $chatSize = if (Test-Path -LiteralPath $LocalChatZipPath) { (Get-Item -LiteralPath $LocalChatZipPath).Length } else { 0 }
    "$Timestamp,$coreSize,$chatSize,$CopiedChatFiles,$SkipBcpIde,$ForceFullChat" | Add-Content -LiteralPath $RunLogPath

    Remove-Item -Path $ChatTempDir -Recurse -Force -ErrorAction SilentlyContinue
} finally {
    Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Test-Path $LocalCoreZipPath)) {
    throw "Core backup zip was not created."
}

Log "Core backup created: $LocalCoreZipPath"
if (Test-Path -LiteralPath $LocalChatZipPath) {
    Log "Chat delta backup created: $LocalChatZipPath"
}

# Copy to local backup folder on C:
New-Item -ItemType Directory -Path $LocalBackupPath -Force | Out-Null
$LocalCoreCopyPath = Join-Path $LocalBackupPath $CoreZipName
Copy-Item $LocalCoreZipPath $LocalCoreCopyPath -Force
Log "Local core copy saved to: $LocalCoreCopyPath"

$LocalChatCopyPath = $null
if (Test-Path -LiteralPath $LocalChatZipPath) {
    $LocalChatCopyPath = Join-Path $LocalBackupPath $ChatZipName
    Copy-Item $LocalChatZipPath $LocalChatCopyPath -Force
    Log "Local chat delta copy saved to: $LocalChatCopyPath"
}

# Local retention (optional): prune oldest zips in LocalBackupPath keeping newest N
if ($LocalRetentionZips -ge 1) {
    $localZips = Get-ChildItem -LiteralPath $LocalBackupPath -Filter "*.zip" -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending
    $toDelete = $localZips | Select-Object -Skip $LocalRetentionZips
    if ($toDelete) {
        foreach ($z in $toDelete) {
            Remove-Item -LiteralPath $z.FullName -Force -ErrorAction SilentlyContinue
            Log "Local retention: removed $($z.Name)"
        }
    }
    Log "Local retention: kept newest $LocalRetentionZips zip(s) in $LocalBackupPath"
}

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
            & $ScpExe $LocalCoreZipPath $RemoteDest
            if ($LASTEXITCODE -ne 0) {
                Log "WARNING: SCP upload failed for CORE zip with exit code $LASTEXITCODE. Local backup is still saved."
            } else {
                Log "Core backup uploaded to $BackupBaseOnServer/$CoreZipName on $VultrHost"
            }
            if ($LocalChatCopyPath) {
                & $ScpExe $LocalChatZipPath $RemoteDest
                if ($LASTEXITCODE -ne 0) {
                    Log "WARNING: SCP upload failed for CHAT zip with exit code $LASTEXITCODE. Local chat delta is still saved."
                } else {
                    Log "Chat delta uploaded to $BackupBaseOnServer/$ChatZipName on $VultrHost"
                }
            }
            # Prune once after all uploads so retention never races with an in-progress scp
            Invoke-VultrBackupRetention -KeepCount $ServerRetentionZips
        }
    }
} else {
    Log "Skipped Vultr upload (-SkipVultr). Local backups are saved."
}

# GitHub sync (after zip + upload so backups succeed even if Git fails)
if (-not $SkipGithub) {

    # One-time PAT store: if -PersonalGitHubPat is supplied, write it into Windows Credential Manager
    # via 'git credential approve' so the backup remote can push without an interactive prompt.
    # After the first successful run you do not need to pass this parameter again.
    if (-not [string]::IsNullOrWhiteSpace($PersonalGitHubPat)) {
        $GitExeForCred = $null
        foreach ($p in @(
            (Join-Path ${env:ProgramFiles} "Git\cmd\git.exe"),
            (Join-Path ${env:ProgramFiles} "Git\bin\git.exe"),
            (Join-Path ${env:ProgramFiles(x86)} "Git\cmd\git.exe")
        )) {
            if ($p -and (Test-Path $p)) { $GitExeForCred = $p; break }
        }
        if (-not $GitExeForCred) {
            $g = Get-Command git.exe -ErrorAction SilentlyContinue
            if ($g) { $GitExeForCred = $g.Source }
        }
        if ($GitExeForCred) {
            Log "Storing personal GitHub PAT in Windows Credential Manager (one-time setup)..."
            $credInput = "protocol=https`nhost=github.com`nusername=Charles0xhorizonxyz`npassword=$PersonalGitHubPat`n"
            $credInput | & $GitExeForCred credential approve
            if ($LASTEXITCODE -eq 0) {
                Log "PAT stored. Future runs do not need -PersonalGitHubPat."
            } else {
                Log "WARNING: git credential approve exited $LASTEXITCODE - PAT may not be stored."
            }
        } else {
            Log "WARNING: git.exe not found; cannot store PAT via credential approve."
        }
    }

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
Remove-Item $LocalCoreZipPath -Force -ErrorAction SilentlyContinue
Remove-Item $LocalChatZipPath -Force -ErrorAction SilentlyContinue
