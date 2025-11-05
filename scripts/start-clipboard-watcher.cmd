@echo off
setlocal
set OUTDIR=%~dp0..\projects\_clipboard
if not exist "%OUTDIR%" mkdir "%OUTDIR%"
start "Clipboard Watcher" powershell -NoProfile -ExecutionPolicy Bypass -STA -File "%~dp0clipboard-watch.ps1" -OutDir "%OUTDIR%"
echo Started clipboard watcher saving to %OUTDIR%
