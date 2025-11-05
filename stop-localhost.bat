@echo off
setlocal
REM Stops the background server started by start-localhost-bg.bat using its PID file.
set PIDFILE=scripts\server\.pids\http-server.pid
if exist "%PIDFILE%" (
  for /f "usebackq tokens=*" %%a in ("%PIDFILE%") do set SRV_PID=%%a
  echo Stopping server PID %SRV_PID% ...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try{ Stop-Process -Id %SRV_PID% -Force -ErrorAction Stop; Write-Host 'Stopped PID %SRV_PID%' }catch{ Write-Host 'Could not stop PID %SRV_PID%:' $_.Exception.Message }"
  del /f /q "%PIDFILE%" >nul 2>&1
) else (
  echo No PID file found. Server may not be running.
)
endlocal
