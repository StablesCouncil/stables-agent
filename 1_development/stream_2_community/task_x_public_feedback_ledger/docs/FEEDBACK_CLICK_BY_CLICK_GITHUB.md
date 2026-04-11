# Feedback: click-by-click until it appears on GitHub

This guide gets **one real submission** from the MiniDapp to **`feedback/submissions/`** on GitHub so you can open it in the browser.

Use **Path A** first (everything on your PC). **Path B** is when you test from the real MiniDapp on your phone or `file://` (hits the agent on the server; GitHub still needs a sync step unless you automate it).

---

## Before you start (30 seconds)

- You need **Node.js** installed (`node -v` in a terminal should show a version).
- For the **upload to GitHub** step you need a **GitHub token** from the **StablesCouncil** account with permission to write files in **`StablesCouncil/stablescouncil.github.io`**.  
  **Never** paste that token into chat, screenshots, or git commits. Only in your own terminal or a local env file on your machine.

---

# Path A — Full test on your computer (recommended)

You will open **two** terminal windows and **one** browser.

---

## Part 1 — Start the small “receive feedback” server (Terminal 1)

1. Open **PowerShell** or **Command Prompt**.
2. Go to the feedback ledger folder (adjust if your Stables folder is elsewhere):

   ```text
   cd C:\Users\Charles\Documents\Stables\1_development\stream_2_community\task_x_public_feedback_ledger
   ```

3. Start the server:

   ```text
   node tools/feedback_submit_server.mjs
   ```

4. Leave this window **open**. You should see a line like it is listening on port **8788**.  
   **Do not close** this window until you are done testing.

**What this does:** when the MiniDapp sends feedback, this program **writes a `.json` file** into:

`...\task_x_public_feedback_ledger\feedback\submissions\`

That is still **on your PC**, not GitHub yet.

---

## Part 2 — Serve the MiniDapp over HTTP (Terminal 2)

The app only auto-targets the local server when the page URL is **`localhost`** or **`127.0.0.1`**. Opening `index.html` as **file://** usually sends feedback to **production** instead, so use a tiny web server.

1. Open a **second** terminal.
2. Go to the active app folder:

   ```text
   cd C:\Users\Charles\Documents\Stables\1_development\stream_1_app\prod_stables_app_v00.00.00.00.03
   ```

3. If you do not have `serve` yet, once run:

   ```text
   npx --yes serve -l 5173
   ```

   (Or any free port; **5173** is just an example.)

4. Note the URL it prints. You want something like:

   `http://127.0.0.1:5173`

**Important:** use **`127.0.0.1`** or **`localhost`** in the address bar, not `file:///...`.

---

## Part 3 — In the browser (clicks only)

1. Open Chrome or Edge.
2. In the address bar, type the URL from Part 2, e.g. **`http://127.0.0.1:5173`**, press Enter.
3. If a welcome or overlay appears, dismiss or complete it until you see the main app shell.
4. Tap or click **More** (bottom bar, **⋯**).
5. Scroll the drawer and tap **Feedback** (or the row that opens the Feedback page).
6. Scroll to the **Public feedback** card.

Fill the form:

7. **Topic area:** choose one of the active options (e.g. **General concept**).
8. If extra dropdowns appear for that topic, pick something sensible.
9. **Feedback type:** should be **Comment** (only active option in current build).
10. **Title:** short line, e.g. `Test from local setup`.
11. **Details:** a sentence, e.g. `Checking GitHub pipeline.`
12. **Public ledger checkbox:** turn it **on** (required to send).
13. Optional fields (Minima address, public contact): leave blank unless you want them **public** on GitHub.

14. Click **Send**.

**What you should see:** a short success toast or a green “Added to the public ledger” style message. If you see an error about network or CORS, check Terminal 1 is still running and the URL is really `127.0.0.1` / `localhost`.

---

## Part 4 — Confirm the file on your PC (still not GitHub)

1. Open **File Explorer**.
2. Go to:

   `C:\Users\Charles\Documents\Stables\1_development\stream_2_community\task_x_public_feedback_ledger\feedback\submissions`

3. You should see a **new** file named like:

   `stables-feedback-2026-....json`

4. Double-click it or open in Notepad to check your title and body inside.

If there is **no** new file, stop here: fix Part 1–3 before uploading to GitHub.

---

## Part 5 — Push that folder’s files to GitHub (Terminal 3 or reuse Terminal 2)

The submit server does **not** push to GitHub by itself in this setup. Use the sync script.

1. Open a terminal (you can stop `serve` temporarily if you want, but you do not have to stop the **8788** server for this).
2. Set your token for **this session only** (PowerShell example — you type your real token instead of the placeholder):

   ```powershell
   $env:GITHUB_TOKEN = "ghp_YOUR_TOKEN_HERE"
   ```

3. Go to the ledger folder:

   ```text
   cd C:\Users\Charles\Documents\Stables\1_development\stream_2_community\task_x_public_feedback_ledger
   ```

4. Run (path is the **submissions** folder you checked in Part 4):

   ```text
   node tools/sync_feedback_to_github.mjs "C:\Users\Charles\Documents\Stables\1_development\stream_2_community\task_x_public_feedback_ledger\feedback\submissions"
   ```

5. Read the last line of output: it should say **`uploaded`** at least **1** (or **`skipped`** if that file was already uploaded before).

**What this does:** for each `.json` in that folder, if GitHub does not already have a file with the same path under **`feedback/submissions/`**, it **creates** it in repo **`StablesCouncil/stablescouncil.github.io`**.

---

## Part 6 — See it on GitHub (browser, clicks)

1. Open:  
   [https://github.com/StablesCouncil/stablescouncil.github.io/tree/main/feedback/submissions](https://github.com/StablesCouncil/stablescouncil.github.io/tree/main/feedback/submissions)

2. Refresh the page if it was already open.

3. Click your **`.json`** file name.

4. Click **Raw** (or view the file content) to read the JSON.

You have now **retrieved your feedback on GitHub**.

---

## Part 7 — Optional: the catalogue file `index.json`

After new files exist under **`feedback/submissions/`**, GitHub Actions can rebuild **`feedback/index.json`**.

1. In GitHub, open the **Actions** tab on **`StablesCouncil/stablescouncil.github.io`**.
2. Click workflow **Build feedback index**.
3. Click **Run workflow** → choose **`main`** → **Run workflow**.
4. When it finishes, open:  
   [https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/feedback/index.json](https://github.com/StablesCouncil/stablescouncil.github.io/blob/main/feedback/index.json)

Your submission should appear inside **`items`** (newest first).

---

# Path B — You use the real MiniDapp (phone or `file://`)

1. You fill **Feedback** and tap **Send** as usual.
2. The app posts to **`https://agent.stablescouncil.org/api/feedback`** (unless you changed config).
3. The JSON is saved on the **Vultr server** under **`feedback_submissions/`** next to **`web_agent.js`** (not automatically in GitHub).
4. To see it on GitHub you must either:
   - run **`sync_feedback_to_github.mjs` on the server** with the path to that folder and a token, or  
   - copy files manually into **`feedback/submissions/`** and commit, or  
   - set up **daily cron** as in `FEEDBACK_LEDGER_SETUP_STEPS.md`.

So: **Send works on the server first**; **GitHub is a deliberate second step** unless you automate it.

---

## Quick troubleshooting

| What happens | What to check |
|----------------|---------------|
| Send fails from browser | Terminal 1 running? URL `127.0.0.1` not `file://`? |
| No file in `submissions` on PC | Part 1 path correct? Any error in Terminal 1? |
| Sync says 401 / 403 | Token scopes; repo name **`stablescouncil.github.io`** (lowercase in API). |
| File on GitHub but not in `index.json` | Run **Build feedback index** workflow (Part 7). |

---

## One-line story

**Local:** MiniDapp → small server on your PC → **`feedback/submissions/*.json`** → **sync script + token** → **GitHub** → optional **index** workflow → **`index.json`**.
