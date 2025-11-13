# QA Run Report

**Generated:** 2025-11-13 09:34:01  
**Duration:** 1.35 seconds  
**Overall Status:** AMBER

## Summary

| Metric | Count |
|--------|-------|
| Total Checks | 23 |
| Passed | 16 |
| Failed | 3 |
| Skipped | 4 |

## Status Breakdown

### Overall Result
⚠ **AMBER** - All critical checks passed, but some high severity checks failed

### Critical Issues
✓ No critical issues

### High Severity Issues
- **[DEPLOY-006]** Current branch deployment status: On branch 'copilot/fix-architecture-qa-validation'. GitHub Pages site will show 404 until PR is merged to 'main' and deployed.
- **[DEPLOY-008]** Latest deployment workflow run succeeded: Could not retrieve workflow runs: 
- **[DEPLOY-010]** Deployed application contains expected content: Missing expected content: PIT - Project Implementation Tracker


## Check Results by Category


### ARCHITECTURE

| ID | Name | Status | Severity |
|----|------|--------|----------|
| ARCH-001 | rules.md exists and is valid | ✓ PASS | critical |
| ARCH-002 | Architecture documents present | ✓ PASS | critical |
| ARCH-003 | QA specifications present | ✓ PASS | critical |
| ARCH-004 | qa/requirements.json is valid JSON | ✓ PASS | critical |


### BUILD

| ID | Name | Status | Severity |
|----|------|--------|----------|
| BUILD-001 | Frontend index.html exists | ✓ PASS | critical |
| BUILD-002 | Frontend assets directory exists | ✓ PASS | high |
| BUILD-003 | CSS stylesheet exists | ✓ PASS | critical |


### DEPLOYMENT

| ID | Name | Status | Severity |
|----|------|--------|----------|
| DEPLOY-001 | GitHub Pages workflow exists | ✓ PASS | critical |
| DEPLOY-002 | Frontend index.html exists | ✓ PASS | critical |
| DEPLOY-003 | Frontend assets directory exists | ✓ PASS | critical |
| DEPLOY-004 | .nojekyll file exists | ✓ PASS | critical |
| DEPLOY-005 | Deploy workflow configured for main branch | ✓ PASS | critical |
| DEPLOY-006 | Current branch deployment status | ✗ FAIL | high |
| DEPLOY-007 | GitHub Pages environment allows main branch deployment | - SKIP | high |
| DEPLOY-008 | Latest deployment workflow run succeeded | ✗ FAIL | high |
| DEPLOY-009 | Live deployment URL is accessible | ✓ PASS | high |
| DEPLOY-010 | Deployed application contains expected content | ✗ FAIL | high |
| DEPLOY-011 | GitHub deployment status is Active | - SKIP | high |


### SECURITY

| ID | Name | Status | Severity |
|----|------|--------|----------|
| SEC-001 | No sensitive keys in source code | ✓ PASS | critical |


### TYPESAFETY

| ID | Name | Status | Severity |
|----|------|--------|----------|
| TYPE-001 | Python files are syntactically valid | ✓ PASS | critical |


### UNITTESTS

| ID | Name | Status | Severity |
|----|------|--------|----------|
| UNIT-001 | pytest tests exist | - SKIP | critical |
| UNIT-002 | All pytest tests pass | - SKIP | critical |


### WIRING

| ID | Name | Status | Severity |
|----|------|--------|----------|
| WIRE-001 | Frontend wiring checks pass | ✓ PASS | critical |



## Remediation Steps

### Failed Checks Require Action

The following checks failed and must be addressed:


#### [DEPLOY-006] Current branch deployment status
- **Severity:** high
- **Message:** On branch 'copilot/fix-architecture-qa-validation'. GitHub Pages site will show 404 until PR is merged to 'main' and deployed.


#### [DEPLOY-008] Latest deployment workflow run succeeded
- **Severity:** high
- **Message:** Could not retrieve workflow runs: 


#### [DEPLOY-010] Deployed application contains expected content
- **Severity:** high
- **Message:** Missing expected content: PIT - Project Implementation Tracker
- **Details:**
```nThe deployed page does not contain all expected test IDs and content. This may indicate an incorrect artifact upload path or Jekyll processing issues.
```



According to the **True North** methodology:
1. If failure is due to missing/incorrect implementation → fix code/tests
2. If failure is due to Architecture gap → update rules.md first, then qa/requirements.json, then code
3. Re-run QA until GREEN


## Metadata

- **Strict Mode:** False
- **Skip Tests:** True
- **Runner:** run-qa.ps1 v1.0.0
- **Report Generated:** 2025-11-13T09:34:01.1337070+00:00

---
*This report follows the True North Build Methodology - Architecture → QA → Implementation → GREEN*
