@echo off
REM Start the PIT Project Management Platform development server

if "%1"=="" (
    set PORT=8080
) else (
    set PORT=%1
)

echo Starting PIT Project Management Platform on port %PORT%...
echo Access the application at: http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python server/serve_static.py --port %PORT%
