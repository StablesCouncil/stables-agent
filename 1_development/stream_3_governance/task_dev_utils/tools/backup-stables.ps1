# Forwarder — canonical script lives under `2_current` (prod). Keeps legacy paths working.
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Get-Item $ScriptDir).Parent.Parent.Parent.Parent.FullName
$Prod = Join-Path $RepoRoot "2_current\stream_3_governance\prod_backup_and_bcp\tools\backup-stables.ps1"
if (-not (Test-Path -LiteralPath $Prod)) {
    Write-Error "Prod backup script not found: $Prod"
    exit 1
}
& $Prod @args
exit $LASTEXITCODE
