#!/bin/bash
# Daily sync of anonymous interaction logs to StablesCouncil/stables-agent.
set -euo pipefail

AGENT_ROOT="${AGENT_ROOT:-/home/linuxuser/stables-agent}"
LOG_FILE="${LOG_FILE:-$AGENT_ROOT/task_x_agent_node/interaction_logs.csv}"
WEB_LOG_FILE="${WEB_LOG_FILE:-$AGENT_ROOT/task_x_agent_node/interaction_logs_web.csv}"
WORK_DIR="${WORK_DIR:-$AGENT_ROOT/stables-agent-sync}"
LOCK_FILE="${LOCK_FILE:-/tmp/stables-interaction-log-sync.lock}"

# Load optional server env files so cron does not need secrets in the crontab.
for env_file in \
    "$AGENT_ROOT/task_stablesagent-brain-base/.env" \
    "$AGENT_ROOT/task_x_agent_node/.env"
do
    if [ -f "$env_file" ]; then
        set -a
        # shellcheck disable=SC1090
        . <(sed 's/\r$//' "$env_file")
        set +a
    fi
done

if [ -z "${COUNCIL_GITHUB_TOKEN:-}" ]; then
    echo "ERROR: COUNCIL_GITHUB_TOKEN is not set in the environment or .env files." >&2
    exit 1
fi

if [ ! -f "$LOG_FILE" ]; then
    echo "ERROR: interaction log not found: $LOG_FILE" >&2
    exit 1
fi

if [ ! -f "$WEB_LOG_FILE" ]; then
    echo "WARN: web interaction log not found: $WEB_LOG_FILE" >&2
fi

(
    flock -n 9 || {
        echo "Another interaction log sync is already running; exiting."
        exit 0
    }

    REPO_URL="https://StablesCouncil:${COUNCIL_GITHUB_TOKEN}@github.com/StablesCouncil/stables-agent.git"

    if [ ! -d "$WORK_DIR/.git" ]; then
        rm -rf "$WORK_DIR"
        git clone "$REPO_URL" "$WORK_DIR"
    fi

    cd "$WORK_DIR"
    git remote set-url origin "$REPO_URL"
    git config user.name "Stables Council"
    git config user.email "StablesCouncil@protonmail.com"
    git pull --ff-only origin main

    mkdir -p "$WORK_DIR/agent"
    cp "$LOG_FILE" "$WORK_DIR/agent/interaction_logs_telegram.csv"
    if [ -f "$WEB_LOG_FILE" ]; then
        cp "$WEB_LOG_FILE" "$WORK_DIR/agent/interaction_logs_web.csv"
    fi

    node - "$LOG_FILE" "$WEB_LOG_FILE" "$WORK_DIR/agent/interaction_logs.csv" <<'NODE'
const fs = require("fs");
const [telegramPath, webPath, outPath] = process.argv.slice(2);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function readRows(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return [];
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  return rows.slice(1).filter((row) => row.length >= 3 && row[0]);
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

const rows = [...readRows(telegramPath), ...readRows(webPath)];
rows.sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]));

const header = ["Timestamp", "Anonymous Question", "AI Response"];
const output = [header, ...rows]
  .map((row) => row.slice(0, 3).map(csvEscape).join(","))
  .join("\n") + "\n";

fs.writeFileSync(outPath, output);
NODE

    git add agent/interaction_logs.csv agent/interaction_logs_telegram.csv agent/interaction_logs_web.csv
    if git diff --cached --quiet; then
        ahead="$(git rev-list --count origin/main..HEAD)"
        if [ "$ahead" -gt 0 ]; then
            echo "No new interaction log changes, but $ahead local commit(s) are pending push."
            git push origin main
            echo "Pending interaction log commit(s) pushed successfully."
            exit 0
        fi
        echo "No interaction log changes to sync."
        exit 0
    fi

    git commit -m "[LOGS] Daily sync of anonymous interaction logs"
    git push origin main
    echo "Interaction logs synced successfully."
) 9>"$LOCK_FILE"
