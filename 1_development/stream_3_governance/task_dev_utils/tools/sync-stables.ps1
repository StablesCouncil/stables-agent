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
    Invoke-Git @("push", $Remote, $MainBranch)
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
        Invoke-Git @("push", $Remote, $MainBranch)
        Write-Host "Push complete." -ForegroundColor Green
    } else {
        Write-Host "Nothing to push (not ahead of $RemoteTracking)." -ForegroundColor Green
    }
}

exit 0
