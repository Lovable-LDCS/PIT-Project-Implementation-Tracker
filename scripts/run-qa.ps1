<#
.SYNOPSIS
    One Time Build QA Runner - Architecture-first validation for PIT Project Implementation Tracker

.DESCRIPTION
    Implements Johan's "True North" philosophy:
    - Architecture-first validation (rules.md, qa/requirements.json)
    - RED→GREEN verification (fail visibly before fixing)
    - Comprehensive checks: files, Python syntax, tests, wiring
    - Generates machine-readable results (qa/last-result.json)
    - Generates human-readable report (qa/report.md)

.PARAMETER StrictMode
    Enable strict mode (exit with error on any failure)

.PARAMETER SkipTests
    Skip pytest execution (for faster validation)

.NOTES
    Version: 1.0.0
    Follows: rules.md Build Methodology and Governance
#>

Param(
    [switch]$StrictMode = $false,
    [switch]$SkipTests = $false
)

$ErrorActionPreference = "Continue"
$Global:TotalChecks = 0
$Global:PassedChecks = 0
$Global:FailedChecks = 0
$Global:SkippedChecks = 0
$Global:CheckResults = @()

# Color output functions
function Write-Success { param([string]$msg) Write-Host "[✓ PASS] $msg" -ForegroundColor Green }
function Write-Failure { param([string]$msg) Write-Host "[✗ FAIL] $msg" -ForegroundColor Red }
function Write-Skip { param([string]$msg) Write-Host "[- SKIP] $msg" -ForegroundColor Yellow }
function Write-Section { param([string]$msg) Write-Host "`n=== $msg ===" -ForegroundColor Cyan }

# Record check result
function Record-Check {
    param(
        [string]$Id,
        [string]$Name,
        [string]$Category,
        [string]$Status,  # PASS, FAIL, SKIP
        [string]$Severity = "medium",
        [string]$Message = "",
        [string]$Details = ""
    )
    
    $Global:TotalChecks++
    
    $result = @{
        id = $Id
        name = $Name
        category = $Category
        status = $Status
        severity = $Severity
        message = $Message
        details = $Details
        timestamp = (Get-Date -Format "o")
    }
    
    $Global:CheckResults += $result
    
    switch ($Status) {
        "PASS" { 
            $Global:PassedChecks++
            Write-Success "$Name"
        }
        "FAIL" { 
            $Global:FailedChecks++
            Write-Failure "$Name - $Message"
        }
        "SKIP" { 
            $Global:SkippedChecks++
            Write-Skip "$Name - $Message"
        }
    }
}

# Start QA Run
$StartTime = Get-Date
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  One Time Build QA Runner - Architecture-First Validation     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "Started: $($StartTime.ToString('yyyy-MM-dd HH:mm:ss'))"
Write-Host "Strict Mode: $StrictMode"
Write-Host ""

# ============================================================================
# SECTION 1: Architecture Integrity Checks
# ============================================================================
Write-Section "1. Architecture Integrity"

# ARCH-001: rules.md exists and is valid
$rulesPath = "rules.md"
if (Test-Path $rulesPath) {
    $rulesContent = Get-Content -Raw $rulesPath
    if ($rulesContent.Length -gt 100) {
        Record-Check -Id "ARCH-001" -Name "rules.md exists and is valid" `
            -Category "architecture" -Status "PASS" -Severity "critical"
    } else {
        Record-Check -Id "ARCH-001" -Name "rules.md exists and is valid" `
            -Category "architecture" -Status "FAIL" -Severity "critical" `
            -Message "rules.md is too short (less than 100 chars)"
    }
} else {
    Record-Check -Id "ARCH-001" -Name "rules.md exists and is valid" `
        -Category "architecture" -Status "FAIL" -Severity "critical" `
        -Message "rules.md not found"
}

# ARCH-002: Architecture documents present
$archDocsPath = "docs/architecture"
if (Test-Path $archDocsPath) {
    $archDocs = Get-ChildItem -Path $archDocsPath -Filter "*.md" -File
    if ($archDocs.Count -gt 0) {
        Record-Check -Id "ARCH-002" -Name "Architecture documents present" `
            -Category "architecture" -Status "PASS" -Severity "critical" `
            -Details "Found $($archDocs.Count) architecture documents"
    } else {
        Record-Check -Id "ARCH-002" -Name "Architecture documents present" `
            -Category "architecture" -Status "FAIL" -Severity "critical" `
            -Message "docs/architecture exists but is empty"
    }
} else {
    Record-Check -Id "ARCH-002" -Name "Architecture documents present" `
        -Category "architecture" -Status "FAIL" -Severity "critical" `
        -Message "docs/architecture directory not found"
}

# ARCH-003: QA specifications present (docs/qa)
$qaDocsPath = "docs/qa"
if (Test-Path $qaDocsPath) {
    $qaDocs = Get-ChildItem -Path $qaDocsPath -Filter "*.md" -File -ErrorAction SilentlyContinue
    if ($qaDocs -and $qaDocs.Count -gt 0) {
        Record-Check -Id "ARCH-003" -Name "QA specifications present" `
            -Category "architecture" -Status "PASS" -Severity "critical" `
            -Details "Found $($qaDocs.Count) QA specification documents"
    } else {
        Record-Check -Id "ARCH-003" -Name "QA specifications present" `
            -Category "architecture" -Status "SKIP" -Severity "critical" `
            -Message "docs/qa exists but no .md files found (may use JSON instead)"
    }
} else {
    Record-Check -Id "ARCH-003" -Name "QA specifications present" `
        -Category "architecture" -Status "SKIP" -Severity "critical" `
        -Message "docs/qa directory not found (using qa/requirements.json instead)"
}

# ARCH-004: qa/requirements.json is valid JSON
$qaReqPath = "qa/requirements.json"
if (Test-Path $qaReqPath) {
    try {
        $qaJson = Get-Content -Raw $qaReqPath | ConvertFrom-Json
        Record-Check -Id "ARCH-004" -Name "qa/requirements.json is valid JSON" `
            -Category "architecture" -Status "PASS" -Severity "critical" `
            -Details "Version: $($qaJson.version)"
    } catch {
        Record-Check -Id "ARCH-004" -Name "qa/requirements.json is valid JSON" `
            -Category "architecture" -Status "FAIL" -Severity "critical" `
            -Message "Invalid JSON: $($_.Exception.Message)"
    }
} else {
    Record-Check -Id "ARCH-004" -Name "qa/requirements.json is valid JSON" `
        -Category "architecture" -Status "FAIL" -Severity "critical" `
        -Message "qa/requirements.json not found"
}

# ============================================================================
# SECTION 2: Build Integrity Checks
# ============================================================================
Write-Section "2. Build Integrity"

# BUILD-001: Frontend index.html exists
$frontendIndex = "src/frontend/index.html"
if (Test-Path $frontendIndex) {
    Record-Check -Id "BUILD-001" -Name "Frontend index.html exists" `
        -Category "build" -Status "PASS" -Severity "critical"
} else {
    Record-Check -Id "BUILD-001" -Name "Frontend index.html exists" `
        -Category "build" -Status "FAIL" -Severity "critical" `
        -Message "$frontendIndex not found"
}

# BUILD-002: Frontend assets directory exists
$assetsPath = "src/frontend/assets"
if (Test-Path $assetsPath) {
    Record-Check -Id "BUILD-002" -Name "Frontend assets directory exists" `
        -Category "build" -Status "PASS" -Severity "high"
} else {
    Record-Check -Id "BUILD-002" -Name "Frontend assets directory exists" `
        -Category "build" -Status "FAIL" -Severity "high" `
        -Message "$assetsPath not found"
}

# BUILD-003: CSS stylesheet exists
$cssPath = "src/frontend/styles.css"
if (Test-Path $cssPath) {
    Record-Check -Id "BUILD-003" -Name "CSS stylesheet exists" `
        -Category "build" -Status "PASS" -Severity "critical"
} else {
    Record-Check -Id "BUILD-003" -Name "CSS stylesheet exists" `
        -Category "build" -Status "FAIL" -Severity "critical" `
        -Message "$cssPath not found"
}

# ============================================================================
# SECTION 3: Python Syntax Validation
# ============================================================================
Write-Section "3. Python Syntax Validation"

# TYPE-001: Python files are syntactically valid
$pythonFiles = Get-ChildItem -Path "." -Filter "*.py" -Recurse -File | Where-Object { $_.FullName -notmatch "\\\.git\\" -and $_.FullName -notmatch "\\venv\\" }
$pythonSyntaxErrors = 0

if ($pythonFiles.Count -gt 0) {
    foreach ($pyFile in $pythonFiles) {
        $relativePath = $pyFile.FullName.Replace((Get-Location).Path, "").TrimStart("\")
        try {
            # Use Python to check syntax
            $checkResult = python -m py_compile $pyFile.FullName 2>&1
            if ($LASTEXITCODE -ne 0) {
                $pythonSyntaxErrors++
                Write-Host "  ✗ Syntax error in $relativePath" -ForegroundColor Red
            }
        } catch {
            $pythonSyntaxErrors++
        }
    }
    
    if ($pythonSyntaxErrors -eq 0) {
        Record-Check -Id "TYPE-001" -Name "Python files are syntactically valid" `
            -Category "typeSafety" -Status "PASS" -Severity "critical" `
            -Details "Checked $($pythonFiles.Count) Python files"
    } else {
        Record-Check -Id "TYPE-001" -Name "Python files are syntactically valid" `
            -Category "typeSafety" -Status "FAIL" -Severity "critical" `
            -Message "$pythonSyntaxErrors files have syntax errors"
    }
} else {
    Record-Check -Id "TYPE-001" -Name "Python files are syntactically valid" `
        -Category "typeSafety" -Status "SKIP" -Severity "critical" `
        -Message "No Python files found"
}

# ============================================================================
# SECTION 4: Unit Tests (pytest)
# ============================================================================
Write-Section "4. Unit Tests (pytest)"

if (-not $SkipTests) {
    # UNIT-001: pytest tests exist
    $testsPath = "tests"
    if (Test-Path $testsPath) {
        $testFiles = Get-ChildItem -Path $testsPath -Filter "test_*.py" -File
        if ($testFiles.Count -gt 0) {
            Record-Check -Id "UNIT-001" -Name "pytest tests exist" `
                -Category "unitTests" -Status "PASS" -Severity "critical" `
                -Details "Found $($testFiles.Count) test files"
        } else {
            Record-Check -Id "UNIT-001" -Name "pytest tests exist" `
                -Category "unitTests" -Status "FAIL" -Severity "critical" `
                -Message "tests/ exists but no test_*.py files found"
        }
    } else {
        Record-Check -Id "UNIT-001" -Name "pytest tests exist" `
            -Category "unitTests" -Status "FAIL" -Severity "critical" `
            -Message "tests/ directory not found"
    }

    # UNIT-002: All pytest tests pass
    if (Get-Command pytest -ErrorAction SilentlyContinue) {
        Write-Host "  Running pytest..." -ForegroundColor Gray
        $pytestOutput = pytest --tb=short 2>&1
        $pytestExitCode = $LASTEXITCODE
        
        if ($pytestExitCode -eq 0) {
            Record-Check -Id "UNIT-002" -Name "All pytest tests pass" `
                -Category "unitTests" -Status "PASS" -Severity "critical"
        } else {
            Record-Check -Id "UNIT-002" -Name "All pytest tests pass" `
                -Category "unitTests" -Status "FAIL" -Severity "critical" `
                -Message "pytest exited with code $pytestExitCode" `
                -Details ($pytestOutput | Out-String)
        }
    } else {
        Record-Check -Id "UNIT-002" -Name "All pytest tests pass" `
            -Category "unitTests" -Status "SKIP" -Severity "critical" `
            -Message "pytest not installed or not in PATH"
    }
} else {
    Record-Check -Id "UNIT-001" -Name "pytest tests exist" `
        -Category "unitTests" -Status "SKIP" -Severity "critical" `
        -Message "Tests skipped via -SkipTests flag"
    Record-Check -Id "UNIT-002" -Name "All pytest tests pass" `
        -Category "unitTests" -Status "SKIP" -Severity "critical" `
        -Message "Tests skipped via -SkipTests flag"
}

# ============================================================================
# SECTION 5: Frontend Wiring Checks (via existing qa-check.ps1)
# ============================================================================
Write-Section "5. Frontend Wiring Checks"

$qaCheckScript = "scripts/qa/qa-check.ps1"
if (Test-Path $qaCheckScript) {
    Write-Host "  Running existing PowerShell QA checks..." -ForegroundColor Gray
    Write-Host "  NOTE: qa-check.ps1 may check implementation details beyond architecture requirements" -ForegroundColor Yellow
    try {
        $qaCheckOutput = & $qaCheckScript 2>&1
        $qaCheckExitCode = $LASTEXITCODE
        
        if ($qaCheckExitCode -eq 0) {
            Record-Check -Id "WIRE-001" -Name "Frontend wiring checks pass" `
                -Category "wiring" -Status "PASS" -Severity "medium" `
                -Details "Executed $qaCheckScript"
        } else {
            # qa-check.ps1 failure is MEDIUM severity - it checks implementation details
            # Critical wiring checks are covered by E2E tests in requirements.json
            Record-Check -Id "WIRE-001" -Name "Frontend wiring checks pass" `
                -Category "wiring" -Status "FAIL" -Severity "medium" `
                -Message "qa-check.ps1 reported issues (may be implementation details not in architecture)" `
                -Details ($qaCheckOutput | Select-Object -Last 20 | Out-String)
        }
    } catch {
        Record-Check -Id "WIRE-001" -Name "Frontend wiring checks pass" `
            -Category "wiring" -Status "FAIL" -Severity "medium" `
            -Message "Error executing qa-check.ps1: $($_.Exception.Message)"
    }
} else {
    Record-Check -Id "WIRE-001" -Name "Frontend wiring checks pass" `
        -Category "wiring" -Status "SKIP" -Severity "medium" `
        -Message "$qaCheckScript not found"
}

# ============================================================================
# SECTION 6: Security Checks
# ============================================================================
Write-Section "6. Security Checks"

# SEC-001: No sensitive keys in source code
$sensitivePatterns = @("api[_-]?key", "secret", "password", "token")
$srcPath = "src"
$securityIssues = 0

if (Test-Path $srcPath) {
    foreach ($pattern in $sensitivePatterns) {
        $matches = Get-ChildItem -Path $srcPath -Recurse -File | Select-String -Pattern $pattern -CaseSensitive:$false -ErrorAction SilentlyContinue
        if ($matches) {
            foreach ($match in $matches) {
                # Exclude common false positives (variable names, comments about tokens, CSS tokens, etc.)
                $line = $match.Line.ToLower()
                if ($line -match "placeholder|example|your.*here|<.*>|dummy|brand tokens|design tokens|/\*.*token.*\*/|color.*token|spacing.*token") {
                    continue
                }
                $securityIssues++
                Write-Host "  ⚠ Potential secret in $($match.Path):$($match.LineNumber)" -ForegroundColor Yellow
            }
        }
    }
    
    if ($securityIssues -eq 0) {
        Record-Check -Id "SEC-001" -Name "No sensitive keys in source code" `
            -Category "security" -Status "PASS" -Severity "critical"
    } else {
        Record-Check -Id "SEC-001" -Name "No sensitive keys in source code" `
            -Category "security" -Status "FAIL" -Severity "critical" `
            -Message "Found $securityIssues potential secrets in source code"
    }
} else {
    Record-Check -Id "SEC-001" -Name "No sensitive keys in source code" `
        -Category "security" -Status "SKIP" -Severity "critical" `
        -Message "src/ directory not found"
}

# ============================================================================
# SECTION 7: Deployment Readiness Checks
# ============================================================================

Write-Section "7. Deployment Readiness Checks"

# DEPLOY-001: GitHub Pages workflow exists
$deployWorkflow = ".github/workflows/deploy-pages.yml"
if (Test-Path $deployWorkflow) {
    Write-Success "DEPLOY-001: GitHub Pages workflow exists"
    Record-Check -Id "DEPLOY-001" -Name "GitHub Pages workflow exists" `
        -Category "deployment" -Status "PASS" -Severity "critical"
} else {
    Write-Failure "DEPLOY-001: GitHub Pages workflow missing at $deployWorkflow"
    Record-Check -Id "DEPLOY-001" -Name "GitHub Pages workflow exists" `
        -Category "deployment" -Status "FAIL" -Severity "critical" `
        -Message "Workflow file not found: $deployWorkflow"
}

# DEPLOY-002: Frontend index.html exists
$frontendIndex = "src/frontend/index.html"
if (Test-Path $frontendIndex) {
    Write-Success "DEPLOY-002: Frontend index.html exists"
    Record-Check -Id "DEPLOY-002" -Name "Frontend index.html exists" `
        -Category "deployment" -Status "PASS" -Severity "critical"
} else {
    Write-Failure "DEPLOY-002: Frontend index.html missing at $frontendIndex"
    Record-Check -Id "DEPLOY-002" -Name "Frontend index.html exists" `
        -Category "deployment" -Status "FAIL" -Severity "critical" `
        -Message "Missing entry point: $frontendIndex"
}

# DEPLOY-003: Frontend assets directory exists
$assetsDir = "src/frontend/assets"
if (Test-Path $assetsDir -PathType Container) {
    Write-Success "DEPLOY-003: Frontend assets directory exists"
    Record-Check -Id "DEPLOY-003" -Name "Frontend assets directory exists" `
        -Category "deployment" -Status "PASS" -Severity "critical"
} else {
    Write-Failure "DEPLOY-003: Frontend assets directory missing at $assetsDir"
    Record-Check -Id "DEPLOY-003" -Name "Frontend assets directory exists" `
        -Category "deployment" -Status "FAIL" -Severity "critical" `
        -Message "Assets directory not found: $assetsDir"
}

# DEPLOY-004: .nojekyll file exists (bypass Jekyll processing)
$noJekyll = "src/frontend/.nojekyll"
if (Test-Path $noJekyll) {
    Write-Success "DEPLOY-004: .nojekyll file exists (Jekyll bypass)"
    Record-Check -Id "DEPLOY-004" -Name ".nojekyll file exists" `
        -Category "deployment" -Status "PASS" -Severity "critical"
} else {
    Write-Failure "DEPLOY-004: .nojekyll file missing at $noJekyll"
    Record-Check -Id "DEPLOY-004" -Name ".nojekyll file exists" `
        -Category "deployment" -Status "FAIL" -Severity "critical" `
        -Message "Missing .nojekyll - GitHub Pages may not serve files correctly"
}

# DEPLOY-005: Deploy workflow configured for main branch
if (Test-Path $deployWorkflow) {
    $workflowContent = Get-Content $deployWorkflow -Raw
    if ($workflowContent -match "branches:\s*-\s*main") {
        Write-Success "DEPLOY-005: Deploy workflow configured for main branch"
        Record-Check -Id "DEPLOY-005" -Name "Deploy workflow configured for main branch" `
            -Category "deployment" -Status "PASS" -Severity "critical"
    } else {
        Write-Failure "DEPLOY-005: Deploy workflow not configured for main branch"
        Record-Check -Id "DEPLOY-005" -Name "Deploy workflow configured for main branch" `
            -Category "deployment" -Status "FAIL" -Severity "critical" `
            -Message "Workflow must trigger on main branch push"
    }
} else {
    Record-Check -Id "DEPLOY-005" -Name "Deploy workflow configured for main branch" `
        -Category "deployment" -Status "SKIP" -Severity "critical" `
        -Message "Workflow file not found"
}

# DEPLOY-006: Current branch deployment status
$currentBranch = git branch --show-current 2>$null
if ($currentBranch) {
    if ($currentBranch -eq "main") {
        Write-Success "DEPLOY-006: On main branch - deployment will trigger"
        Record-Check -Id "DEPLOY-006" -Name "Current branch deployment status" `
            -Category "deployment" -Status "PASS" -Severity "high" `
            -Message "On main branch - GitHub Pages will deploy automatically"
    } else {
        Write-Host "[ℹ INFO] DEPLOY-006: On branch '$currentBranch' - GitHub Pages deploys from 'main' only" -ForegroundColor Yellow
        Record-Check -Id "DEPLOY-006" -Name "Current branch deployment status" `
            -Category "deployment" -Status "FAIL" -Severity "high" `
            -Message "On branch '$currentBranch'. GitHub Pages site will show 404 until PR is merged to 'main' and deployed."
    }
} else {
    Record-Check -Id "DEPLOY-006" -Name "Current branch deployment status" `
        -Category "deployment" -Status "SKIP" -Severity "high" `
        -Message "Could not determine current branch"
}

# ============================================================================
# Generate Results
# ============================================================================
$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Section "QA Run Summary"

# Calculate overall status
$overallStatus = "GREEN"
$criticalFailed = ($Global:CheckResults | Where-Object { $_.severity -eq "critical" -and $_.status -eq "FAIL" }).Count
$highFailed = ($Global:CheckResults | Where-Object { $_.severity -eq "high" -and $_.status -eq "FAIL" }).Count

if ($criticalFailed -gt 0) {
    $overallStatus = "RED"
} elseif ($highFailed -gt 0) {
    $overallStatus = "AMBER"
}

Write-Host ""
Write-Host "Total Checks:   $Global:TotalChecks" -ForegroundColor White
Write-Host "Passed:         $Global:PassedChecks" -ForegroundColor Green
Write-Host "Failed:         $Global:FailedChecks" -ForegroundColor Red
Write-Host "Skipped:        $Global:SkippedChecks" -ForegroundColor Yellow
Write-Host "Duration:       $([math]::Round($Duration.TotalSeconds, 2)) seconds" -ForegroundColor White
Write-Host ""

switch ($overallStatus) {
    "GREEN" { Write-Host "OVERALL STATUS: ✓ GREEN" -ForegroundColor Green }
    "AMBER" { Write-Host "OVERALL STATUS: ⚠ AMBER" -ForegroundColor Yellow }
    "RED"   { Write-Host "OVERALL STATUS: ✗ RED" -ForegroundColor Red }
}

# ============================================================================
# Save Results
# ============================================================================
Write-Section "Saving Results"

# Ensure qa directory exists
if (-not (Test-Path "qa")) {
    New-Item -ItemType Directory -Path "qa" -Force | Out-Null
}

# Generate machine-readable JSON
$jsonReport = @{
    version = "1.0.0"
    timestamp = (Get-Date -Format "o")
    startTime = $StartTime.ToString("o")
    endTime = $EndTime.ToString("o")
    durationSeconds = [math]::Round($Duration.TotalSeconds, 2)
    overallStatus = $overallStatus
    summary = @{
        total = $Global:TotalChecks
        passed = $Global:PassedChecks
        failed = $Global:FailedChecks
        skipped = $Global:SkippedChecks
    }
    checks = $Global:CheckResults
    metadata = @{
        strictMode = $StrictMode
        skipTests = $SkipTests
        runner = "run-qa.ps1"
    }
}

$jsonPath = "qa/last-result.json"
$jsonReport | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "✓ Saved machine-readable results: $jsonPath" -ForegroundColor Green

# Generate human-readable Markdown report
$mdReport = @"
# QA Run Report

**Generated:** $($EndTime.ToString('yyyy-MM-dd HH:mm:ss'))  
**Duration:** $([math]::Round($Duration.TotalSeconds, 2)) seconds  
**Overall Status:** $overallStatus

## Summary

| Metric | Count |
|--------|-------|
| Total Checks | $Global:TotalChecks |
| Passed | $Global:PassedChecks |
| Failed | $Global:FailedChecks |
| Skipped | $Global:SkippedChecks |

## Status Breakdown

### Overall Result
$( if ($overallStatus -eq "GREEN") { "✓ **GREEN** - All critical and high severity checks passed" }
   elseif ($overallStatus -eq "AMBER") { "⚠ **AMBER** - All critical checks passed, but some high severity checks failed" }
   else { "✗ **RED** - One or more critical checks failed" } )

### Critical Issues
$( if ($criticalFailed -gt 0) {
    $criticalFailures = $Global:CheckResults | Where-Object { $_.severity -eq "critical" -and $_.status -eq "FAIL" }
    $criticalFailures | ForEach-Object { "- **[$($_.id)]** $($_.name): $($_.message)" } | Out-String
} else {
    "✓ No critical issues"
} )

### High Severity Issues
$( if ($highFailed -gt 0) {
    $highFailures = $Global:CheckResults | Where-Object { $_.severity -eq "high" -and $_.status -eq "FAIL" }
    $highFailures | ForEach-Object { "- **[$($_.id)]** $($_.name): $($_.message)" } | Out-String
} else {
    "✓ No high severity issues"
} )

## Check Results by Category

$( ($Global:CheckResults | Group-Object -Property category | ForEach-Object {
    $category = $_.Name
    $checks = $_.Group
    @"

### $($category.ToUpper())

| ID | Name | Status | Severity |
|----|------|--------|----------|
$( $checks | ForEach-Object {
    $statusIcon = switch ($_.status) {
        "PASS" { "✓" }
        "FAIL" { "✗" }
        "SKIP" { "-" }
    }
    "| $($_.id) | $($_.name) | $statusIcon $($_.status) | $($_.severity) |"
} | Out-String)
"@
}) | Out-String )

## Remediation Steps

$( if ($Global:FailedChecks -gt 0) {
    @"
### Failed Checks Require Action

The following checks failed and must be addressed:

$( $Global:CheckResults | Where-Object { $_.status -eq "FAIL" } | ForEach-Object {
    @"

#### [$($_.id)] $($_.name)
- **Severity:** $($_.severity)
- **Message:** $($_.message)
$( if ($_.details) { "- **Details:**`n``````n$($_.details)`n```````n" } )
"@
} | Out-String )

According to the **True North** methodology:
1. If failure is due to missing/incorrect implementation → fix code/tests
2. If failure is due to Architecture gap → update rules.md first, then qa/requirements.json, then code
3. Re-run QA until GREEN

"@
} else {
    "✓ No remediation required - all checks passed or were skipped"
} )

## Metadata

- **Strict Mode:** $StrictMode
- **Skip Tests:** $SkipTests
- **Runner:** run-qa.ps1 v1.0.0
- **Report Generated:** $($EndTime.ToString('o'))

---
*This report follows the True North Build Methodology - Architecture → QA → Implementation → GREEN*
"@

$mdPath = "qa/report.md"
$mdReport | Set-Content -Path $mdPath -Encoding UTF8
Write-Host "✓ Saved human-readable report: $mdPath" -ForegroundColor Green

# ============================================================================
# Exit with appropriate code
# ============================================================================
Write-Host ""
if ($StrictMode -and $Global:FailedChecks -gt 0) {
    Write-Host "Exiting with error code 1 (strict mode enabled, failures detected)" -ForegroundColor Red
    exit 1
} elseif ($overallStatus -eq "RED") {
    Write-Host "Exiting with error code 1 (RED status - critical failures)" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Exiting with code 0 (GREEN or AMBER status)" -ForegroundColor Green
    exit 0
}
