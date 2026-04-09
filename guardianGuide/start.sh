#!/usr/bin/env bash
# GuardianGuide dev startup script
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== GuardianGuide Dev Server ==="

# 1. Start backend
echo "[backend] Starting FastAPI on :8080..."
cd "$ROOT/backend"
if [ ! -f .env ]; then
  echo "ERROR: backend/.env not found. Copy .env.example and fill in your keys."
  exit 1
fi
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!
echo "[backend] PID=$BACKEND_PID"

# 2. Start frontend
echo "[frontend] Starting Next.js on :3000..."
cd "$ROOT/frontend"
if [ ! -f .env.local ]; then
  echo "ERROR: frontend/.env.local not found."
  kill $BACKEND_PID
  exit 1
fi
npm run dev &
FRONTEND_PID=$!
echo "[frontend] PID=$FRONTEND_PID"

echo ""
echo "  Backend:  http://localhost:8080"
echo "  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
