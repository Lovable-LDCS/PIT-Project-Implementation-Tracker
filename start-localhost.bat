@echo off
setlocal
set PM_LOCAL_PORT=8080
REM Starts the local HTTP server in the current window (Ctrl+C will stop). Use stop-localhost.bat to stop background instances.
python "scripts\server\http_server.py"
endlocal
