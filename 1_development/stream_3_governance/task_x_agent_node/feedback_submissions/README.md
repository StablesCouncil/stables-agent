# MiniDapp feedback (disk)

`POST /api/feedback` on the Stables web agent writes one JSON file per submission here (or under `FEEDBACK_SUBMISSIONS_DIR` on the server).

Sync these files into the public GitHub ledger (`feedback/submissions/` on `StablesCouncil.github.io`) on whatever schedule the Council uses.

**Automated option:** `task_x_public_feedback_ledger/tools/sync_feedback_to_github.mjs` (also on the Pages repo under `tools/`). Run daily via cron with `GITHUB_TOKEN` and the path to this folder. Do not commit secrets.
