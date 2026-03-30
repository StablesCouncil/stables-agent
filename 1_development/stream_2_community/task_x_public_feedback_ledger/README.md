# Public feedback ledger (GitHub)

Structured JSON submissions from the MiniDapp **Feedback** page land here (during local tests) or in the Council’s public site repo (e.g. `StablesCouncil.github.io/feedback/submissions/`) when wired with a token.

**Step-by-step (server → GitHub → index → cron):** [docs/FEEDBACK_LEDGER_SETUP_STEPS.md](docs/FEEDBACK_LEDGER_SETUP_STEPS.md)

## Layout

- `feedback/submissions/` — one `.json` file per submission (avoids merge conflicts in PRs).
- `feedback/index.json` — **generated** rollup: all submissions sorted and grouped (see below). Do not hand-edit.
- `tools/feedback_submit_server.mjs` — small Node server: **local file** mode by default; optional **GitHub Contents API** when `GITHUB_TOKEN` is set.
- `tools/build_feedback_index.mjs` — scans `submissions/` and writes `index.json` for aggregate / sort / group.

## Aggregate, group, sort

Raw storage stays as many small JSON files. For **one file to query in tools or a future UI**, rebuild the index:

```bash
cd task_x_public_feedback_ledger
node tools/build_feedback_index.mjs
```

Optional paths:

```bash
node tools/build_feedback_index.mjs ./feedback/submissions ./feedback/index.json
```

`index.json` includes:

- `items` — every submission as a light row (`file`, `submitted_at`, `topic_domain`, `kind`, `title`, …), **sorted newest first**.
- `groups.by_topic_domain` — map of topic → list of `file` paths under `feedback/`.
- `groups.by_kind` — map of kind → list of paths.
- `groups.by_month` — map of `YYYY-MM` → list of paths.

Consumers: fetch `https://raw.githubusercontent.com/StablesCouncil/StablesCouncil.github.io/main/feedback/index.json`, then filter `items` or use `groups` to list paths and load full JSON from `raw/.../feedback/<file>`.

**GitHub Actions:** copy `examples/github-workflow-feedback-index.yml` into the Pages repo (and commit `tools/build_feedback_index.mjs` there) so `index.json` updates whenever `feedback/submissions/` changes.

## Production (MiniDapp)

Shipped builds post to **`https://agent.stablescouncil.org/api/feedback`** (Stables `web_agent.js`). Files land on the agent host under `feedback_submissions/` until the Council syncs them to GitHub.

## Daily sync server → GitHub (optional)

`tools/sync_feedback_to_github.mjs` uploads **new** `*.json` files from the server folder to **`feedback/submissions/`** on `StablesCouncil.github.io` via the GitHub Contents API. Files already present on GitHub are skipped (idempotent).

```bash
export GITHUB_TOKEN=ghp_...   # repo Contents write
node tools/sync_feedback_to_github.mjs /path/to/feedback_submissions
```

Cron example: `examples/cron-sync-feedback.example.sh`. After new files appear on `main`, the **Build feedback index** workflow rebuilds `feedback/index.json`.

## Local test (no GitHub token)

From this folder:

```bash
node tools/feedback_submit_server.mjs
```

1. In `prod_stables_app_v0.2.11/assets/config/runtime-config.js`, set `FEEDBACK_SUBMIT_URL` to `http://127.0.0.1:8788/api/feedback` (see comment there).
2. Serve the MiniDapp over **http** (not `file://`), e.g. `npx serve` from `prod_stables_app_v0.2.11`, so the browser can call the submit API.
3. Open Feedback, fill the form, **Send**. A new file should appear under `feedback/submissions/`.

## GitHub upload (optional)

Set env vars and run the same server; POSTs will create files via the API instead of writing locally:

- `GITHUB_TOKEN` — classic PAT with `repo` scope (or fine-grained: Contents read/write on the target repo). **Never commit this.**
- `GITHUB_FEEDBACK_OWNER` — e.g. `StablesCouncil`
- `GITHUB_FEEDBACK_REPO` — e.g. `StablesCouncil.github.io`
- `GITHUB_FEEDBACK_PATH` — default `feedback/submissions`

## Promotion

When satisfied, copy `feedback/` into the live GitHub Pages repo (or merge this tree) and point `FEEDBACK_PUBLIC_DB_URL` in `runtime-config.js` at that folder on GitHub.

**Public README on GitHub Pages:** the live repo has **`feedback/README.md`** explaining the ledger, `index.json`, CI, and consumption URLs. Source copy in this task: `feedback/README.md` (keep in sync when the public doc changes).
