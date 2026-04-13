@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "1_development\stream_3_governance\task_dev_utils\tools\sync-stables.ps1" -Message "One-click manual sync" -AlsoPushWhenClean
