@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "2_current\stream_3_governance\prod_backup_and_bcp\tools\sync-stables.ps1" -Message "One-click manual sync" -AlsoPushWhenClean
