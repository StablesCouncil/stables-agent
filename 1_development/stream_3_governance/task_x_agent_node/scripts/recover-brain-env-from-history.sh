#!/usr/bin/env bash
# Run ON THE VPS as root. Rebuilds task_stablesagent-brain-base/.env from
# /root/.bash_history (last sed/echo lines that touched those secrets).
# Does not print secret values.
set -eu
H=/root/.bash_history
OUT=/root/stables-agent/task_stablesagent-brain-base/.env
T_LINE=$(tac "$H" 2>/dev/null | grep "task_stablesagent-brain-base/.env" | grep "TELEGRAM_BOT_TOKEN" | head -1 || true)
# sed line shape: ...TELEGRAM_BOT_TOKEN=<token>/' ... — token has no /
T=$(printf '%s\n' "$T_LINE" | grep -oE '[0-9]{6,}:[A-Za-z0-9_-]{25,}' | tail -1 || true)
O_LINE=$(tac "$H" 2>/dev/null | grep "^echo 'OPENROUTER_API_KEY=" | head -1 || true)
O=$(printf '%s\n' "$O_LINE" | sed -n "s/^echo 'OPENROUTER_API_KEY=\([^']*\)'.*$/\1/p")
M_LINE=$(tac "$H" 2>/dev/null | grep "^echo 'MOLTBOOK_API_KEY=" | head -1 || true)
M=$(printf '%s\n' "$M_LINE" | sed -n "s/^echo 'MOLTBOOK_API_KEY=\([^']*\)'.*$/\1/p")
if [ -z "${T:-}" ] || [ -z "${O:-}" ]; then
  echo "RECOVER_FAIL: missing TELEGRAM or OPENROUTER in history" >&2
  exit 1
fi
umask 077
{
  echo "TELEGRAM_BOT_TOKEN=$T"
  echo "OPENROUTER_API_KEY=$O"
  [ -n "${M:-}" ] && echo "MOLTBOOK_API_KEY=$M"
} >"$OUT"
chmod 600 "$OUT"
echo "RECOVER_OK wrote $(wc -l <"$OUT") lines to $OUT"
cd /root/stables-agent/task_x_agent_node && pm2 restart stables-telegram-agent --update-env
sleep 2
if pm2 logs stables-telegram-agent --err --lines 12 --nostream 2>&1 | grep -q "TELEGRAM_BOT_TOKEN is not set"; then
  echo "RECOVER_WARN: bot still reports missing token — check history / token validity" >&2
  exit 2
fi
echo "RECOVER_OK no TELEGRAM_BOT_TOKEN missing in recent stderr"
