#!/usr/bin/env bash
# Run on the Council archive VPS as root. Uses MinimaRPCClient + systemd ExecStart password parse.
set -euo pipefail

MINIMA_JAR="${MINIMA_JAR:-/root/minima.jar}"
RPC_HOST="${RPC_HOST:-https://127.0.0.1:9005}"
STAGING_ROOT="${STAGING_ROOT:-/var/www/minima-archive/.staging}"
DATE="$(date -u +%Y-%m-%d)"
OUT="${STAGING_ROOT}/archive_${DATE}.raw.dat"

mkdir -p "$STAGING_ROOT"

PW="$(
  python3 - <<'PY'
import re, subprocess
s = subprocess.check_output(
    ["systemctl", "show", "minima", "-p", "ExecStart", "--value"],
    text=True,
)
m = re.search(r"-rpcpassword\s+(.+?)\s+-rpcssl\b", s)
if not m:
    raise SystemExit("Could not parse -rpcpassword from minima.service")
print(m.group(1).strip())
PY
)"

echo "[$(date -Is)] Starting archive export to: $OUT"
# RPCClient reads commands from stdin; 'exit' leaves the node running.
{
  printf '%s\n' "archive action:exportraw file:${OUT}"
  printf '%s\n' "exit"
} | timeout 10800 java -cp "$MINIMA_JAR" org.minima.utils.MinimaRPCClient -password "$PW" -host "$RPC_HOST" \
  | tee "/var/log/minima-archive-export-${DATE}.log" | tail -n 40

if [[ ! -f "$OUT" ]]; then
  echo "[$(date -Is)] ERROR: expected file missing: $OUT" >&2
  exit 1
fi

echo "[$(date -Is)] Export file present: $(du -h "$OUT" | awk '{print $1}')"

MINIMA_PUBLIC_ARCHIVE_DIR="${MINIMA_PUBLIC_ARCHIVE_DIR:-/var/www/minima-archive}" \
  /root/tools/publish-archive-raw.sh "$OUT"

echo "[$(date -Is)] Done. Public dir:"
ls -la "${MINIMA_PUBLIC_ARCHIVE_DIR:-/var/www/minima-archive}" | head -20
