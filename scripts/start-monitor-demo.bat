@echo off
REM ---- QuotaQuest :: DEMO mode (synthetic data, no Claude logs needed) ----
setlocal
cd /d "%~dp0..\monitor"
node index.js --demo
