# Feedback ledger: step-by-step setup

End state: MiniDapp **Send** → JSON on **agent server** → **daily sync** → **`feedback/submissions/`** on GitHub → **CI** rebuilds **`feedback/index.json`** → you read the index or raw files.

Do the steps in order. Check each box before moving on.

---

## Step 1 — Confirm the agent accepts feedback

1. On the machine where **Stables web agent** runs, confirm `web_agent.js` includes `POST /api/feedback` (already in repo).
2. Deploy/restart the agent if you changed it (e.g. `pm2 restart stables-web-agent` on Vultr).
3. Smoke test from any machine:
   ```bash
   curl -sS -X POST "https://agent.stablescouncil.org/api/feedback" \
     -H "Content-Type: application/json" \
     -d "{\"schema_version\":1,\"submitted_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"source\":{\"app_build\":\"test\",\"client\":\"curl\"},\"topic_domain\":\"general_concept\",\"topic_sub\":null,\"app_context\":{\"page_id\":null,\"section_hint\":null,\"element_hint\":null},\"kind\":\"comment\",\"title\":\"Smoke test\",\"body\":\"Ignore.\",\"consent_public_ledger\":true}"
   ```
4. Expect JSON with `"ok":true` and an `id` (filename).
5. On the server, confirm a new file under **`feedback_submissions/`** next to `web_agent.js` (or under **`FEEDBACK_SUBMISSIONS_DIR`** if you set it).

**Done when:** one test file appears on server disk.

---

## Step 2 — GitHub token for sync (server only)

1. Create a **classic PAT** or fine-grained token with **Contents: Read and write** on **`StablesCouncil/stablescouncil.github.io`** (or full `repo` for classic).
2. **Never** commit the token. Store it only on the server, e.g.:
   ```bash
   sudo install -m 600 /dev/null /root/stables-agent/.env.feedback-sync
   sudo nano /root/stables-agent/.env.feedback-sync
   ```
   Contents:
   ```sh
   export GITHUB_TOKEN=ghp_your_token_here
   ```
3. Optional: set defaults (script already defaults these):
   ```sh
   export GITHUB_FEEDBACK_OWNER=StablesCouncil
   export GITHUB_FEEDBACK_REPO=stablescouncil.github.io
   export GITHUB_FEEDBACK_PATH=feedback/submissions
   ```

**Done when:** token file exists, mode `600`, and you can `source` it in a shell without errors.

---

## Step 3 — Put the sync script on the server

1. From this repo, the script is:
   `task_x_public_feedback_ledger/tools/sync_feedback_to_github.mjs`
2. Same file also lives on GitHub:
   `https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/tools/sync_feedback_to_github.mjs`
3. On the server, copy it to a fixed path, e.g.:
   ```text
   /root/stables-agent/tools/sync_feedback_to_github.mjs
   ```
4. Ensure **Node 18+** is available (`node -v`).

**Done when:** `node /root/stables-agent/tools/sync_feedback_to_github.mjs` runs (it will error on missing `GITHUB_TOKEN` or missing source dir until Step 4 args are correct).

---

## Step 4 — First manual sync (prove GitHub)

1. `source /root/stables-agent/.env.feedback-sync`
2. Run (adjust **source path** to your real `feedback_submissions` folder):
   ```bash
   node /root/stables-agent/tools/sync_feedback_to_github.mjs \
     /root/stables-agent/task_x_agent_node/feedback_submissions
   ```
3. Check output: `uploaded` ≥ 1 for new files, `skipped` for files already on GitHub.
4. In browser:  
   [github.com/StablesCouncil/stablescouncil.github.io/tree/main/feedback/submissions](https://github.com/StablesCouncil/stablescouncil.github.io/tree/main/feedback/submissions)  
   Confirm the JSON files appear.

**Done when:** server files show up under **`feedback/submissions/`** on `main`.

---

## Step 5 — Index workflow on GitHub

1. Repo should already have `.github/workflows/feedback-index.yml` and `tools/build_feedback_index.mjs`.
2. After **Step 4**, either wait for the push to trigger the workflow, or run manually:  
   **Actions → Build feedback index → Run workflow**.
3. Confirm **`feedback/index.json`** exists on `main`:
   `https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/feedback/index.json`

**Done when:** `index.json` is present and lists your submissions in `items`.

---

## Step 6 — Daily cron

1. Create a small wrapper, e.g. `/root/stables-agent/scripts/cron-sync-feedback.sh`:
   ```sh
   #!/usr/bin/env sh
   set -eu
   . /root/stables-agent/.env.feedback-sync
   exec node /root/stables-agent/tools/sync_feedback_to_github.mjs \
     /root/stables-agent/task_x_agent_node/feedback_submissions
   ```
2. `chmod +x /root/stables-agent/scripts/cron-sync-feedback.sh`
3. `crontab -e` — example daily 03:15 UTC:
   ```cron
   15 3 * * * /root/stables-agent/scripts/cron-sync-feedback.sh >> /var/log/stables-feedback-sync.log 2>&1
   ```

**Done when:** next day you see new log lines and new files on GitHub after submissions.

---

## Step 7 — MiniDapp production URL

1. In shipped **`runtime-config.js`**, keep:
   - `FEEDBACK_SUBMIT_URL`: `https://agent.stablescouncil.org/api/feedback`
   - `FEEDBACK_PUBLIC_DB_URL`: GitHub tree URL for `feedback/` (already aligned in dev).
2. Rebuild/ship the MiniDapp zip if you changed config.

**Done when:** real users’ **Send** hits the same agent that writes to the folder you sync in Step 4–6.

---

## Step 8 — Query / consume

1. **Rollup:**  
   `https://raw.githubusercontent.com/StablesCouncil/stablescouncil.github.io/main/feedback/index.json`
2. Use `items` (sorted newest first) or `groups.by_topic_domain` / `by_kind` / `by_month`.
3. Full body: fetch `raw.githubusercontent.com/.../main/feedback/` + `file` from an item.

**Done when:** you can list and open submissions without browsing every file by hand.

---

## Troubleshooting

| Symptom | Check |
|--------|--------|
| `403` / `401` on sync | Token scope, repo name (`stablescouncil.github.io` lowercase in API). |
| `404` on GET before PUT | Normal for new files; script should still PUT. |
| Index not updating | Actions tab for failures; ensure push touched `feedback/submissions/**` or run workflow manually. |
| Nothing on server | Wrong `FEEDBACK_SUBMISSIONS_DIR` or agent not deployed / wrong host in MiniDapp. |

---

## Reference files (Stables dev tree)

| File | Role |
|------|------|
| `tools/sync_feedback_to_github.mjs` | Server → GitHub upload |
| `tools/build_feedback_index.mjs` | Build `index.json` |
| `examples/cron-sync-feedback.example.sh` | Cron template |
| `feedback/README.md` | Public-facing explanation (mirrored on GitHub) |
