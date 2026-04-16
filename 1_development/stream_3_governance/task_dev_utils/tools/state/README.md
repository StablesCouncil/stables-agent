# State folder (legacy)

**Canonical runtime state** for chat deltas and backup CSV logs is now:

`2_current/stream_3_governance/prod_backup_and_bcp/tools/state/`

If you still see `chat-state.json` or `backup-run-log.csv` here, they are leftovers from before the move. The prod `backup-stables.ps1` no longer reads this folder. You may delete these files manually after confirming the copies under `prod_backup_and_bcp/tools/state/`.
