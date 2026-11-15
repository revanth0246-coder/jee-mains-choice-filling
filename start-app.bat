@echo off
title JEE College Finder 2026 - JoSAA Choice Filling Studio
echo ========================================================
echo   Starting JEE College Finder 2026 & JoSAA SeatMatrix
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Opening JoSAA College Finder in your default browser...
start "" "%~dp0index.html"

echo [2/2] Launching local Vite web server...
start "" http://localhost:5173/
cmd /c "npm run dev -- --host 0.0.0.0 --port 5173"

pause
