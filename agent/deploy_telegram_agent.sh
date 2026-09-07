#!/bin/bash
set -eu

echo "=== Stables Telegram Agent Deploy ==="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[1/6] Ensuring base packages (git, curl, build tools)..."
if command -v apt >/dev/null 2>&1; then
  sudo apt update -y
  sudo apt install -y git curl build-essential
fi

echo "[2/6] Installing Node.js (if missing)..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
node -v

echo "[3/6] Installing Ollama and llama3.2 (if missing)..."
if ! command -v ollama >/dev/null 2>&1; then
  curl -fsSL https://ollama.com/install.sh | sh
fi

if ! ollama list | grep -q "llama3.2"; then
  ollama pull llama3.2
fi

echo "[4/6] Checking Telegram bot token in shared .env..."
BRAIN_ENV_DIR="$SCRIPT_DIR/../task_stablesagent-brain-base"
ENV_FILE="$BRAIN_ENV_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo ""
  echo "ERROR: .env file not found at:"
  echo "  $ENV_FILE"
  echo "Create it with at least:"
  echo "  TELEGRAM_BOT_TOKEN=your_bot_token_here"
  echo "Then re-run this script."
  exit 1
fi

if ! grep -q "TELEGRAM_BOT_TOKEN" "$ENV_FILE"; then
  echo ""
  echo "ERROR: TELEGRAM_BOT_TOKEN is missing in:"
  echo "  $ENV_FILE"
  echo "Add a line like:"
  echo "  TELEGRAM_BOT_TOKEN=your_bot_token_here"
  echo "Then re-run this script."
  exit 1
fi

echo "[5/6] Installing Node dependencies and building knowledge base..."
npm install
npm run ingest

echo "[6/6] Starting Telegram agent via pm2..."
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

if pm2 list | grep -q "stables-telegram-agent"; then
  pm2 restart stables-telegram-agent
else
  pm2 start telegram_agent.js --name stables-telegram-agent
fi

pm2 save

echo ""
echo "Done. The Stables Telegram Agent should now be running under pm2."
echo "You can check it with:"
echo "  pm2 status"
echo ""
echo "To enable pm2 on reboot, run (once):"
echo "  pm2 startup"
echo "and follow the on-screen instructions."

