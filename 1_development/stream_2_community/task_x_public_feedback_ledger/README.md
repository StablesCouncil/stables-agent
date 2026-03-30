# Public feedback ledger (GitHub)

Structured JSON submissions from the MiniDapp **Feedback** page land here (during local tests) or in the Council’s public site repo (e.g. `StablesCouncil.github.io/feedback/submissions/`) when wired with a token.

## Layout

- `feedback/submissions/` — one `.json` file per submission (avoids merge conflicts in PRs).
- `tools/feedback_submit_server.mjs` — small Node server: **local file** mode by default; optional **GitHub Contents API** when `GITHUB_TOKEN` is set.

## Production (MiniDapp)

Shipped builds post to **`https://agent.stablescouncil.org/api/feedback`** (Stables `web_agent.js`). Files land on the agent host under `feedback_submissions/` until the Council syncs them to GitHub.

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
