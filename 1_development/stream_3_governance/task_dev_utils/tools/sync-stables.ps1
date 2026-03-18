<#
.SYNOPSIS
    Syncs the local Stables repository with GitHub (origin/main).
.DESCRIPTION
    Performs git add, git commit, and git push. 
    Uses a timestamped message if no message is provided.
#>

param(
    [string]$Message = "Manual sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

$ErrorActionPreference = "Stop"

# Resolve project root (4 levels up from 1_development/stream_3_governance/task_dev_utils/tools/)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName

Set-Location $ProjectRoot

Write-Host "Syncing Stables to GitHub..." -ForegroundColor Cyan

# Check for changes
$Status = git status --porcelain
if (-not $Status) {
    Write-Host "No changes to sync." -ForegroundColor Green
    exit 0
}

# Sync
try {
    git add .
    git commit -m $Message
    git push origin main
    Write-Host "Successfully pushed to GitHub." -ForegroundColor Green
} catch {
    Write-Host "Error during sync: $_" -ForegroundColor Red
    exit 1
}
