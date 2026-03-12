#!/bin/bash
# Daily sync of interaction_logs.csv to StablesCouncil/stables-agent
set -eu

LOG_FILE="/root/stables-agent/task_x_agent_node/interaction_logs.csv"
# Use COUNCIL_GITHUB_TOKEN env var (set in crontab or .env). Never commit the token.
REPO_URL="https://StablesCouncil:${COUNCIL_GITHUB_TOKEN}@github.com/StablesCouncil/stables-agent.git"
WORK_DIR="/root/stables-agent-sync"

if [ ! -d "$WORK_DIR" ]; then
    git clone "$REPO_URL" "$WORK_DIR"
fi

cd "$WORK_DIR"
git config user.name "Stables Council"
git config user.email "StablesCouncil@protonmail.com"
git pull origin main

cp "$LOG_FILE" "$WORK_DIR/agent/interaction_logs.csv"

git add agent/interaction_logs.csv
git diff --cached --quiet && echo "No changes to sync." && exit 0

git commit --trailer "Made-with: Cursor" -m "[LOGS] Daily sync of anonymous interaction logs"
git push origin main
echo "Logs synced successfully."
