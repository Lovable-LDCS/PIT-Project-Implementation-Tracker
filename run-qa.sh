#!/bin/bash
# Run QA Health Check
# Usage: ./run-qa.sh [strict]

echo ""
echo "========================================"
echo "PIT QA Health Check"
echo "========================================"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "ERROR: Python not found!"
    echo "Please install Python 3.x"
    exit 1
fi

# Check if pytest is installed
if ! $PYTHON_CMD -m pytest --version &> /dev/null; then
    echo "Installing pytest..."
    $PYTHON_CMD -m pip install pytest
fi

# Check for strict mode argument
if [ "$1" == "strict" ]; then
    export QA_STRICT=1
    echo "Running in STRICT MODE"
    echo ""
fi

# Run QA
$PYTHON_CMD qa/run_qa.py

EXIT_CODE=$?

echo ""
echo "========================================"
echo "QA Check Complete"
echo "========================================"
echo ""

exit $EXIT_CODE
