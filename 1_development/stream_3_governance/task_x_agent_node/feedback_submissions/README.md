# MiniDapp feedback (disk)

`POST /api/feedback` on the Stables web agent writes one JSON file per submission here (or under `FEEDBACK_SUBMISSIONS_DIR` on the server).

Sync these files into the public GitHub ledger (`feedback/submissions/` on the site repo) on whatever schedule the Council uses. Do not commit secrets.
