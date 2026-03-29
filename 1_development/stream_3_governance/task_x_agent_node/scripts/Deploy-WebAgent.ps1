#Requires -Version 5.1
<#
.SYNOPSIS
  Copy web_agent.js to your server and restart the process (optional: git push first).

.DESCRIPTION
  1. Optional: stage + commit + push only task_x_agent_node/web_agent.js (use -GitPush).
  2. Loads deploy.local.ps1 from the task_x_agent_node folder if present (copy from deploy.local.ps1.example).
  3. scp web_agent.js to the server, then ssh to run your restart command.

  Requires OpenSSH Client (Windows: Settings → Apps → Optional features → OpenSSH Client).

.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1
.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1 -GitPush -Message "agent: /api/feedback"
.EXAMPLE
  .\scripts\Deploy-WebAgent.ps1 -WhatIf
#>
param(
    [switch] $GitPush,
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
        git add -- "1_development/stream_3_governance/task_x_agent_node/web_agent.js"
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

$remoteFile = ($global:STABLES_AGENT_REMOTE_DIR.TrimEnd("/\") + "/web_agent.js")
$scpTarget = "{0}:{1}" -f $global:STABLES_AGENT_SSH, $remoteFile

if ($WhatIf) {
    Write-Host "[WhatIf] scp `"$webAgent`" `"$scpTarget`"" -ForegroundColor Magenta
    Write-Host "[WhatIf] ssh $($global:STABLES_AGENT_SSH) `"cd $($global:STABLES_AGENT_REMOTE_DIR) && $($global:STABLES_AGENT_RESTART)`"" -ForegroundColor Magenta
    exit 0
}

Write-Host "Uploading web_agent.js → $scpTarget" -ForegroundColor Cyan
& scp $webAgent $scpTarget
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$remoteCmd = "cd $($global:STABLES_AGENT_REMOTE_DIR) && $($global:STABLES_AGENT_RESTART)"
Write-Host "Restarting: $($global:STABLES_AGENT_RESTART)" -ForegroundColor Cyan
& ssh $global:STABLES_AGENT_SSH $remoteCmd
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. Quick check from PowerShell:" -ForegroundColor Green
Write-Host '  curl -s https://agent.stablescouncil.org/health' -ForegroundColor Gray
Write-Host ""
