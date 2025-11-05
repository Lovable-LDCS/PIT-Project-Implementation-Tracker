#!/bin/bash
# Start the PIT Project Management Platform development server

PORT=${1:-8080}

echo "Starting PIT Project Management Platform on port $PORT..."
echo "Access the application at: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 server/serve_static.py --port "$PORT"
