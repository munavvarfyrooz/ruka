#!/bin/bash

# WhatsApp Integration Management Script

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$SCRIPT_DIR/service.pid"
LOG_FILE="$SCRIPT_DIR/logs/service.log"

start() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Service is already running (PID: $PID)"
            return
        fi
    fi
    
    echo "Starting WhatsApp Integration Service..."
    cd "$SCRIPT_DIR"
    nohup node dist/index.js > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 2
    
    if ps -p $(cat "$PID_FILE") > /dev/null; then
        echo "Service started successfully (PID: $(cat "$PID_FILE"))"
        echo "Listening on port 3001"
    else
        echo "Failed to start service"
        rm -f "$PID_FILE"
    fi
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "Service is not running"
        return
    fi
    
    PID=$(cat "$PID_FILE")
    echo "Stopping WhatsApp Integration Service (PID: $PID)..."
    kill $PID 2>/dev/null
    rm -f "$PID_FILE"
    echo "Service stopped"
}

status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Service is running (PID: $PID)"
            echo "Port: 3001"
            echo "Webhook URLs:"
            echo "  Twilio: http://$(hostname -I | awk '{print $1}'):3001/webhook/whatsapp/twilio"
            echo "  Meta: http://$(hostname -I | awk '{print $1}'):3001/webhook/whatsapp/meta"
        else
            echo "Service is not running (stale PID file)"
            rm -f "$PID_FILE"
        fi
    else
        echo "Service is not running"
    fi
}

logs() {
    tail -f "$LOG_FILE"
}

test_instagram() {
    echo "Testing Instagram ad message..."
    curl -X POST http://localhost:3001/webhook/whatsapp/twilio \
      -H "Content-Type: application/json" \
      -d '{
        "From": "whatsapp:+919999999999",
        "Body": "Hi, I saw your Instagram ad",
        "ProfileName": "Test User"
      }' -s
    echo -e "\nCheck logs to see if it was processed"
}

test_regular() {
    echo "Testing regular message (should be ignored)..."
    curl -X POST http://localhost:3001/webhook/whatsapp/twilio \
      -H "Content-Type: application/json" \
      -d '{
        "From": "whatsapp:+918888888888",
        "Body": "Hi, I need help",
        "ProfileName": "Regular User"
      }' -s
    echo -e "\nCheck logs to see if it was ignored"
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        sleep 2
        start
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    test-ig)
        test_instagram
        ;;
    test-regular)
        test_regular
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|test-ig|test-regular}"
        echo ""
        echo "Commands:"
        echo "  start        - Start the WhatsApp integration service"
        echo "  stop         - Stop the service"
        echo "  restart      - Restart the service"
        echo "  status       - Check service status"
        echo "  logs         - Follow service logs"
        echo "  test-ig      - Test with Instagram ad message"
        echo "  test-regular - Test with regular message"
        exit 1
        ;;
esac