#Requires -Version 5.1
<#
.SYNOPSIS
  Copy web_agent.js (and optionally package.json) to your server, run npm install if needed, and restart.

.DESCRIPTION
  1. Optional: stage + commit + push task_x_agent_node files (use -GitPush).
  2. Loads deploy.local.ps1 from the task_x_agent_node folder (copy from deploy.local.ps1.example).
  3. scp web_agent.js to the server.
  4. If -NpmInstall is set, also scp package.json and run "npm install --omit=dev" remotely before restart.
  5. ssh to run your restart command.

  Requires OpenSSH Client (Windows: Settings → Apps → Optional features → OpenSSH Client).

.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1
.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1 -NpmInstall -GitPush -Message "agent: add mysql2"
.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1 -WhatIf
#>
param(
    [switch] $GitPush,
    [switch] $NpmInstall,
    [string] $Message = "chore(agent): deploy web_agent.js",
    [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
$scriptsDir = $PSScriptRoot
$agentDir = Split-Path $scriptsDir -Parent
$repoRoot = (Resolve-Path (Join-Path $agentDir "..\..\..")).Path
$webAgent = Join-Path $agentDir "web_agent.js"
$localConfig = Join-Path $agentDir "deploy.local.ps1"

if (-not (Test-Path -LiteralPath $webAgent)) {
    Write-Error "web_agent.js not found: $webAgent"
}

if (Test-Path -LiteralPath $localConfig) {
    Write-Host "Loading $localConfig" -ForegroundColor DarkGray
    . $localConfig
} else {
    Write-Host ""
    Write-Host "No deploy.local.ps1 yet — quickest path:" -ForegroundColor Yellow
    Write-Host "  1. Copy deploy.local.ps1.example → deploy.local.ps1 (same folder as web_agent.js)"
    Write-Host "  2. Edit the 3 variables (SSH user@host, remote path, restart command)"
    Write-Host "  3. Run this script again"
    Write-Host ""
    Write-Host "Or use git on the server only: push from PC → SSH → cd remote dir → git pull → restart." -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

if (-not $global:STABLES_AGENT_SSH -or -not $global:STABLES_AGENT_REMOTE_DIR -or -not $global:STABLES_AGENT_RESTART) {
    Write-Error "deploy.local.ps1 must set STABLES_AGENT_SSH, STABLES_AGENT_REMOTE_DIR, and STABLES_AGENT_RESTART"
}

if ($GitPush) {
    Push-Location $repoRoot
    try {
        git add -- "1_development/stream_3_governance/task_x_agent_node/web_agent.js" `
                   "1_development/stream_3_governance/task_x_agent_node/package.json" `
                   "1_development/stream_3_governance/task_x_agent_node/package-lock.json"
        git status --short -- "1_development/stream_3_governance/task_x_agent_node/web_agent.js"
        if ($WhatIf) {
            Write-Host "[WhatIf] Would: git commit and git push" -ForegroundColor Magenta
        } else {
            git diff --cached --quiet
            if ($LASTEXITCODE -ne 0) {
                git commit -m $Message
            } else {
                Write-Host "No staged changes for web_agent.js — skip commit." -ForegroundColor DarkYellow
            }
            git push
        }
    } finally {
        Pop-Location
    }
}

$remoteDir    = $global:STABLES_AGENT_REMOTE_DIR.TrimEnd("/\")
$remoteAgent  = "$remoteDir/web_agent.js"
$remotePkg    = "$remoteDir/package.json"
$scpAgent     = "{0}:{1}" -f $global:STABLES_AGENT_SSH, $remoteAgent
$scpPkg       = "{0}:{1}" -f $global:STABLES_AGENT_SSH, $remotePkg
$packageJson  = Join-Path $agentDir "package.json"

if ($WhatIf) {
    Write-Host "[WhatIf] scp `"$webAgent`" `"$scpAgent`"" -ForegroundColor Magenta
    if ($NpmInstall) {
        Write-Host "[WhatIf] scp `"$packageJson`" `"$scpPkg`"" -ForegroundColor Magenta
        Write-Host "[WhatIf] ssh $($global:STABLES_AGENT_SSH) `"cd $remoteDir && npm install --omit=dev`"" -ForegroundColor Magenta
    }
    Write-Host "[WhatIf] ssh $($global:STABLES_AGENT_SSH) `"cd $remoteDir && $($global:STABLES_AGENT_RESTART)`"" -ForegroundColor Magenta
    exit 0
}

Write-Host "Uploading web_agent.js → $scpAgent" -ForegroundColor Cyan
& scp $webAgent $scpAgent
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($NpmInstall) {
    Write-Host "Uploading package.json → $scpPkg" -ForegroundColor Cyan
    & scp $packageJson $scpPkg
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "Running npm install --omit=dev on server..." -ForegroundColor Cyan
    & ssh $global:STABLES_AGENT_SSH "cd $remoteDir && npm install --omit=dev"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$remoteCmd = "cd $remoteDir && $($global:STABLES_AGENT_RESTART)"
Write-Host "Restarting: $($global:STABLES_AGENT_RESTART)" -ForegroundColor Cyan
& ssh $global:STABLES_AGENT_SSH $remoteCmd
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. Quick checks:" -ForegroundColor Green
Write-Host '  curl -s https://agent.stablescouncil.org/health' -ForegroundColor Gray
Write-Host '  curl -s "https://agent.stablescouncil.org/api/devtools/archive-meta"' -ForegroundColor Gray
Write-Host ""
