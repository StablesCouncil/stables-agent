<#
.SYNOPSIS
    Syncs the local Stables repository with GitHub (private repo on branch main).

.DESCRIPTION
    Uses the remote configured for branch main (see `git config branch.main.remote`, e.g. `backup`),
    not a hardcoded `origin`. Stages changes, commits if needed, then pushes.

.PARAMETER Message
    Commit message when there are staged changes.

.PARAMETER AlsoPushWhenClean
    If the working tree is clean but local main is ahead of the remote tracking branch, push only (no new commit).
#>

param(
    [string]$Message = "Manual sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [switch]$AlsoPushWhenClean = $false
)

$ErrorActionPreference = "Stop"

function Resolve-GitExe {
    $candidates = @(
        (Join-Path ${env:ProgramFiles} "Git\cmd\git.exe"),
        (Join-Path ${env:ProgramFiles} "Git\bin\git.exe"),
        (Join-Path ${env:ProgramFiles(x86)} "Git\cmd\git.exe")
    )
    foreach ($p in $candidates) {
        if ($p -and (Test-Path $p)) { return $p }
    }
    $cmd = Get-Command git.exe -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source) { return $cmd.Source }
    return "git.exe"
}

$GitExe = Resolve-GitExe
if (-not (Test-Path -LiteralPath $GitExe)) {
    $g = Get-Command git.exe -ErrorAction SilentlyContinue
    if (-not $g) {
        Write-Host "ERROR: git.exe not found. Install Git for Windows or add git to PATH." -ForegroundColor Red
        exit 1
    }
    $GitExe = $g.Source
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName

Set-Location $ProjectRoot
Write-Host "Syncing Stables to GitHub (repo: $ProjectRoot)..." -ForegroundColor Cyan
Write-Host "Using git: $GitExe" -ForegroundColor DarkGray

function Invoke-Git {
    param([string[]]$GitArgs)
    & $GitExe @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed with exit code $LASTEXITCODE"
    }
}

function Write-PushFailureDiagnostics {
    param(
        [string]$RemoteName,
        [string]$FailureText = ""
    )
    $ft = if ($FailureText) { $FailureText } else { "" }
    $url = (& $GitExe config --get "remote.$RemoteName.url" 2>$null) | Out-String
    $url = $url.Trim()
    if (-not $url) { return }
    Write-Host "Remote URL: $url" -ForegroundColor DarkGray

    $networkish = $ft -match '(?i)recv failure|connection was reset|broken pipe|timed out|could not resolve|Failed to connect|10054|ECONNRESET|WSAECONNRESET|empty reply|TLS.*unexpected|SSL connection'
    $authish = $ft -match '(?i)\b401\b|\b403\b|Authentication failed|could not read (Username|Password)|SSL certificate problem|credential|logon failed|access denied'

    if ($url -match "^git@github\.com:") {
        $pathPart = ($url -replace "^git@github\.com:", "") -replace "\.git$", ""
        $httpsUrl = "https://github.com/$pathPart.git"
        if ($networkish) {
            Write-Host "DIAGNOSTIC: SSH session to GitHub dropped (network/VPN/firewall/antivirus or transient outage). Retry; if it repeats, try another network or HTTPS remote." -ForegroundColor Yellow
        } elseif ($ft -match '(?i)publickey|Permission denied') {
            Write-Host "DIAGNOSTIC: GitHub did not accept your SSH key for this shell (missing key, wrong key, or ssh-agent not loaded in Task Scheduler)." -ForegroundColor Yellow
        } else {
            Write-Host "DIAGNOSTIC: SSH remote (git@github.com). Check key, ssh-agent, and: ssh -T git@github.com" -ForegroundColor Yellow
        }
        Write-Host "  Option A — use HTTPS for automated pushes (Git Credential Manager + PAT):" -ForegroundColor Cyan
        Write-Host "    git remote set-url $RemoteName $httpsUrl" -ForegroundColor White
        Write-Host "  Option B — keep SSH: add public key to GitHub; ssh-add; test ssh -T git@github.com" -ForegroundColor Cyan
    } elseif ($url -match "^https://github\.com/") {
        if ($networkish) {
            Write-Host "DIAGNOSTIC: HTTPS connection to GitHub was cut mid-flight (Recv failure / reset). This is usually network (Wi-Fi, VPN, firewall, antivirus HTTPS inspection), not a bad PAT. Retry the push; try another network or VPN on/off." -ForegroundColor Yellow
        } elseif ($authish) {
            Write-Host "DIAGNOSTIC: HTTPS auth or TLS trust. Renew the PAT or re-sign in via Git Credential Manager; check proxy/SSL inspection certificates." -ForegroundColor Yellow
        } else {
            Write-Host "DIAGNOSTIC: HTTPS remote. If the error mentions reset/timeout/recv, treat as network; if 401/403/credential, treat as auth." -ForegroundColor Yellow
        }
    }
}

function Invoke-GitPush {
    param([string]$RemoteName, [string]$Branch)
    $out = & $GitExe @("push", $RemoteName, $Branch) 2>&1 | ForEach-Object { "$_" }
    if ($LASTEXITCODE -ne 0) {
        $joined = ($out | Where-Object { $_ }) -join "`n"
        Write-Host "ERROR: git push $RemoteName $Branch failed (exit $LASTEXITCODE)." -ForegroundColor Red
        if ($joined) { Write-Host $joined -ForegroundColor DarkRed }
        Write-PushFailureDiagnostics -RemoteName $RemoteName -FailureText $joined
        Write-Host "TIP: Run 'git remote -v' to confirm fetch/push URLs." -ForegroundColor DarkGray
        exit 1
    }
}

$MainBranch = "main"
$Remote = (& $GitExe config --get "branch.$MainBranch.remote").Trim()
if ([string]::IsNullOrWhiteSpace($Remote)) {
    Write-Host "WARNING: branch.$MainBranch.remote is not set; using origin." -ForegroundColor Yellow
    $Remote = "origin"
}
$RemoteTracking = "${Remote}/${MainBranch}"
Write-Host "Remote for push/fetch: $Remote (tracking ref: $RemoteTracking)" -ForegroundColor DarkGray

$Status = & $GitExe status --porcelain
if ($LASTEXITCODE -ne 0) { throw "git status failed with exit code $LASTEXITCODE" }

if ($Status) {
    Write-Host "Changes detected; staging and committing..." -ForegroundColor Yellow
    Invoke-Git @("add", ".")
    & $GitExe diff --cached --quiet 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Nothing staged after add (skip commit)." -ForegroundColor Yellow
    } else {
        Invoke-Git @("commit", "-m", $Message)
    }
    Invoke-GitPush -RemoteName $Remote -Branch $MainBranch
    Write-Host "Successfully pushed to GitHub ($Remote/$MainBranch)." -ForegroundColor Green
    exit 0
}

Write-Host "No working tree changes." -ForegroundColor Green

if ($AlsoPushWhenClean) {
    & $GitExe fetch $Remote 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: git fetch $Remote failed (exit $LASTEXITCODE); cannot check ahead count." -ForegroundColor Yellow
        exit 0
    }
    $ahead = & $GitExe rev-list --count "${RemoteTracking}..HEAD" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Could not compare to $RemoteTracking (exit $LASTEXITCODE). Push skipped." -ForegroundColor Yellow
        exit 0
    }
    if ([int]$ahead -gt 0) {
        Write-Host "Working tree clean but $ahead commit(s) ahead of $RemoteTracking; pushing..." -ForegroundColor Yellow
        Invoke-GitPush -RemoteName $Remote -Branch $MainBranch
        Write-Host "Push complete." -ForegroundColor Green
    } else {
        Write-Host "Nothing to push (not ahead of $RemoteTracking)." -ForegroundColor Green
    }
}

exit 0
