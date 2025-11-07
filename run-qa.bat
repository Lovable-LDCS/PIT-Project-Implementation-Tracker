@echo off
REM Run QA Health Check
REM Usage: run-qa.bat [strict]

echo.
echo ========================================
echo PIT QA Health Check
echo ========================================
echo.

cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    python3 --version >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Python not found!
        echo Please install Python 3.x
        pause
        exit /b 1
    )
    set PYTHON_CMD=python3
) else (
    set PYTHON_CMD=python
)

REM Check if pytest is installed
%PYTHON_CMD% -m pytest --version >nul 2>&1
if errorlevel 1 (
    echo Installing pytest...
    %PYTHON_CMD% -m pip install pytest
)

REM Check for strict mode argument
if "%1"=="strict" (
    set QA_STRICT=1
    echo Running in STRICT MODE
    echo.
)

REM Run QA
%PYTHON_CMD% qa/run_qa.py

echo.
echo ========================================
echo QA Check Complete
echo ========================================
echo.
pause
