# prod_backup_and_bcp

**Role:** Canonical **governance** copy of Stables backup and business continuity documentation.

**Execution path (canonical):** Runnable scripts and runtime state live here (promoted `prod_*` tree):

- `2_current/stream_3_governance/prod_backup_and_bcp/tools/backup-stables.ps1`
- `2_current/stream_3_governance/prod_backup_and_bcp/tools/sync-stables.ps1`
- `2_current/stream_3_governance/prod_backup_and_bcp/tools/state/` (`chat-state.json`, `backup-run-log.csv`)

**Legacy forwarders (optional):** Thin wrappers in `1_development/stream_3_governance/task_dev_utils/tools/` call the prod scripts so old Task Scheduler paths keep working.

**Read here first**

| File | Contents |
|------|----------|
| `BACKUP_SCRIPT_REFERENCE.md` | All script parameters, run presets, log paths |
| `BACKUP_README.md` | Full backup process, Task Scheduler, Vultr, troubleshooting |
| `BCP.md` | Business continuity and restore expectations |

The files under `1_development/.../task_dev_utils/docs/` for these topics are **stubs** that point to this folder.

## Maintenance (handshake note)

Default rule: agents draft in `1_development/` and you promote to `2_current/`. Because these **`.ps1`** tools are intentionally canonical here, **any script change** should still go through your normal review: draft in a `1_development` task copy or edit here only when you have explicitly allowed direct prod edits for this folder.
