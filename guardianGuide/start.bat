@echo off
REM GuardianGuide dev startup (Windows)

echo === GuardianGuide Dev Server ===

REM Start backend
echo [backend] Starting FastAPI on :8080...
cd /d "%~dp0backend"
if not exist .env (
    echo ERROR: backend\.env not found. Copy .env.example and fill in your keys.
    pause
    exit /b 1
)
start "GuardianGuide Backend" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080"

REM Start frontend
echo [frontend] Starting Next.js on :3000...
cd /d "%~dp0frontend"
start "GuardianGuide Frontend" cmd /k "npm run dev"

echo.
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:3000
echo.
echo Both servers started in separate windows.
pause
