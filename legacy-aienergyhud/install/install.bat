@echo off
REM AI Energy HUD - one-click installer wrapper
setlocal
echo Launching AI Energy HUD installer...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
echo.
pause
