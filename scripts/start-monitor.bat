@echo off
REM ---- QuotaQuest :: start the Node monitor ----
REM Reads your local Claude Code usage and updates state.json on an interval.
setlocal
cd /d "%~dp0..\monitor"
where node >nul 2>nul
if errorlevel 1 (
  echo [QuotaQuest] Node.js was not found on PATH. Install Node 18+ from https://nodejs.org
  pause
  exit /b 1
)
echo [QuotaQuest] Monitor starting... (close this window to stop)
node index.js %*
