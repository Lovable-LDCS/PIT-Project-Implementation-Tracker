@echo off
setlocal
set PM_LOCAL_PORT=8080
REM Starts the local HTTP server minimized in a new window (background). Use stop-localhost.bat to stop.
start "PM Localhost" /MIN powershell -NoProfile -ExecutionPolicy Bypass -Command "python 'scripts/server/http_server.py'"
endlocal
