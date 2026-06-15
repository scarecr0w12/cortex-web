#!/usr/bin/env bash
set -e

SERVICE_NAME="cortex-discord-bot"
PID_FILE="/tmp/$SERVICE_NAME.pid"
LOG_FILE="/var/log/$SERVICE_NAME.log"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

install_service() {
  echo "Installing systemd service..."
  cp "$SCRIPT_DIR/cortex-discord-bot.service" /etc/systemd/system/
  systemctl daemon-reload
  systemctl enable "$SERVICE_NAME"
  echo "Service installed. Run: $0 start"
}

start() {
  if systemctl --version &>/dev/null && [ -f "/etc/systemd/system/$SERVICE_NAME.service" ]; then
    systemctl start "$SERVICE_NAME"
    systemctl status "$SERVICE_NAME" --no-pager | head -10
    return
  fi
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Bot already running (PID $(cat "$PID_FILE"))"
    return
  fi
  mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || LOG_FILE="$SCRIPT_DIR/bot.log"
  cd "$SCRIPT_DIR"
  DOTENV_CONFIG_PATH=../.env nohup npx tsx src/index.ts >> "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  echo "Bot started (PID $!). Log: $LOG_FILE"
}

stop() {
  if systemctl --version &>/dev/null && [ -f "/etc/systemd/system/$SERVICE_NAME.service" ]; then
    systemctl stop "$SERVICE_NAME" && echo "Bot stopped via systemd" || true
    return
  fi
  if [ ! -f "$PID_FILE" ]; then
    echo "No PID file found. Try: pkill -f 'tsx src/index.ts'"
    return
  fi
  kill "$(cat "$PID_FILE")" 2>/dev/null && echo "Bot stopped" || echo "Bot not running"
  rm -f "$PID_FILE"
}

status() {
  if systemctl --version &>/dev/null && [ -f "/etc/systemd/system/$SERVICE_NAME.service" ]; then
    systemctl status "$SERVICE_NAME" --no-pager | head -20
    return
  fi
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Bot running (PID $(cat "$PID_FILE"))"
  else
    echo "Bot not running"
  fi
}

logs() {
  if [ -f "$LOG_FILE" ]; then
    tail -50 "$LOG_FILE"
  else
    journalctl -u "$SERVICE_NAME" --no-pager -n 50 2>/dev/null || echo "No logs found"
  fi
}

case "${1:-start}" in
  install) install_service ;;
  start) start ;;
  stop) stop ;;
  restart) stop; sleep 1; start ;;
  status) status ;;
  logs) logs ;;
  *)
    echo "Usage: $0 {install|start|stop|restart|status|logs}"
    exit 1
    ;;
esac
