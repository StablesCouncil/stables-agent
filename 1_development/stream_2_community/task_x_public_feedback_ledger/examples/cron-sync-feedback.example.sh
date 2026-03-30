#!/usr/bin/env sh
# Example: daily cron on the Stables web agent host (Linux).
# 1. Copy sync_feedback_to_github.mjs to the server (same path as web_agent or any fixed dir).
# 2. Create /root/stables-agent/.env.feedback-sync (chmod 600) with:
#      export GITHUB_TOKEN=ghp_...
# 3. crontab -e:
#      15 3 * * * /root/stables-agent/scripts/cron-sync-feedback.sh >> /var/log/stables-feedback-sync.log 2>&1

set -eu
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Adjust: path to Node script on server
SYNC_JS="${SYNC_JS:-$SCRIPT_DIR/sync_feedback_to_github.mjs}"
# Adjust: where web_agent writes JSON (default in code: feedback_submissions next to web_agent.js)
SOURCE="${FEEDBACK_SUBMISSIONS_DIR:-/root/stables-agent/task_x_agent_node/feedback_submissions}"

if [ -f /root/stables-agent/.env.feedback-sync ]; then
  # shellcheck source=/dev/null
  . /root/stables-agent/.env.feedback-sync
fi

exec node "$SYNC_JS" "$SOURCE"
