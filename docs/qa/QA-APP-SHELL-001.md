---
id: QA-APP-SHELL-001
title: QA Spec - Global App Shell, Navigation, and Layout
status: Draft v1.0
component: ARC-APP-SHELL-001
---

Purpose
- Provide machine-checkable criteria and a PowerShell QA script to verify the shell UI exists and is accessible by presence of required test IDs, roles, and basic attributes.

Checks (presence and attributes)
- Verify src/frontend/index.html exists.
- Parse the HTML and check for required elements/attributes:
  - [TID-SHELL-ROOT][role=application]
  - [TID-TOPBAR]
  - [TID-SIDEBAR][role=navigation]
  - [TID-BREADCRUMBS] contains nav[aria-label="Breadcrumb"]
  - [TID-GLOBAL-SEARCH] input with label (aria-label or associated label)
  - [TID-ORG-SCOPE-SELECTOR]
  - [TID-NOTIFICATIONS-BTN]
  - [TID-PROFILE-MENU]
  - [TID-COMPANY-FILTER]
  - [TID-DEPT-FILTER]
  - [TID-NAV-DASHBOARD]
  - [TID-NAV-PROJECTS]
  - [TID-NAV-REPORTS]
  - [TID-CONTENT-AREA][role=main]
  - favicon link present: either <link rel="icon" href="/favicon.ico"> or a data URL favicon
  - [TID-PROBLEMS-INDICATOR] with text content "0" for a clean build
  - [TID-PROBLEMS-PANEL] element present (can be empty/hidden when zero)

Accessibility smoke
- Ensure all buttons/inputs have discernible text or aria-label.

Output
- On success: print a summary and exit 0.
- On failure: print Red X lines explaining which selectors failed and exit 1.

Automation
- Implement a PowerShell script at scripts/qa/qa-check.ps1 to run these checks locally and in CI.
