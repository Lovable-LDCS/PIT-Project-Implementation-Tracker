# QA Quick Start Guide

This project implements a comprehensive QA and architecture-first workflow system as specified in `rules.md`.

## Quick Start

### 1. Run QA Checks (Command Line)

```bash
# Install dependencies
pip3 install pytest

# Run the QA suite
python3 qa/run_qa.py

# Run in strict mode (for production readiness)
QA_STRICT=1 python3 qa/run_qa.py
```

### 2. Access Health Checker (UI)

1. Open the application in a browser
2. In the sidebar, set **Role** to **Admin**
3. Click **Health Checker** under Admin Tools
4. Click **🔍 Run Health Check** button
5. Review the detailed report

### 3. Test Admin Features

**Admin-Only Pages** (visible when role = Admin):
- Invite Members (`#/invite-members`)
- Security Dashboard (`#/security-dashboard`)  
- Health Checker (`#/health-checker`)

**Test Different Roles:**
1. Use the role selector in the sidebar
2. Choose: None, User, Technician, or Admin
3. Observe which features are visible

**Reset Session:**
- Click "Reset Session" button to clear all localStorage and reload

### 4. Test Preview Mode

In the header, use the Preview toggle:
- Click **🖥️ Desktop** for desktop view
- Click **📱 Mobile** for mobile preview (375px width with centered layout)

## QA System Overview

### Architecture-First Principles (True North)

1. **Architecture → QA → Implementation**: Never code before architecture is defined
2. **Machine-Verifiable**: All requirements in `qa/requirements.json`
3. **RED/GREEN Workflow**: Clear pass/fail with diagnostics
4. **No Partial Handovers**: Only handover when QA is GREEN
5. **Legacy Code Policy**: If not wired (not in UI), it must be deleted

### Status Codes

- 🟢 **GREEN**: All checks pass → Ready to deploy
- 🟡 **AMBER**: Critical checks pass, some high/medium fail → Review needed
- 🔴 **RED**: Critical check(s) failed → Must fix before proceeding

### Current QA Status

✅ **GREEN** - 33/33 checks passing

## Key Components

### `qa/requirements.json`
Single source of truth for all QA requirements. Defines:
- 33 automated checks across 12 categories
- Severity levels: critical, high, medium, low
- Check types and targets
- RED/GREEN criteria

### `qa/run_qa.py`
Python-based QA runner that:
- Executes all checks from requirements.json
- Provides color-coded terminal output
- Exports JSON reports
- Supports strict mode

### Health Checker UI
In-app admin tool for non-technical users:
- One-click health check execution
- Human-readable reports (no code)
- Component-level diagnostics
- Strict mode toggle

## QA Check Categories

| Category | Checks | Status |
|----------|--------|--------|
| Architecture Compliance | 4 | ✓ |
| Environment Variables | 1 | ✓ |
| Type Safety (JS) | 2 | ✓ |
| Build Integrity | 3 | ✓ |
| Unit Tests | 2 | ✓ |
| E2E Tests | 3 | Pending* |
| Route Smoke Tests | 1 | Pending* |
| Wiring Checks | 3 | Pending* |
| State & Persistence | 4 | Pending* |
| UI/UX Consistency | 3 | Pending* |
| Security Baseline | 2 | ✓ |
| Health Checker | 5 | Pending* |

\* Structure defined, Playwright implementation needed for full runtime validation

## Workflow

### For Non-Technical Users

1. **Request a feature** in plain English
2. **Agent updates** architecture (`docs/architecture/`) and QA (`qa/requirements.json`)
3. **Agent implements** the feature
4. **Agent runs QA** until GREEN
5. **You verify** via UI only
6. If issues found, you report in English → agent fixes → QA → GREEN

### For Developers/Agents

1. **Update architecture first** (`docs/architecture/ARC-*.md`)
2. **Update QA requirements** (`qa/requirements.json`)
3. **Implement feature**
4. **Run QA**: `python3 qa/run_qa.py`
5. **Fix until GREEN**
6. **Commit with QA report**

### For CI/CD

```yaml
# GitHub Actions example
- name: Install dependencies
  run: pip install pytest

- name: Run QA Checks
  run: python3 qa/run_qa.py
```

Exit code 0 = GREEN/AMBER, 1 = RED

## Admin Features

### State Management

**RoleContext & AuthContext:**
- Automatically persisted to localStorage
- Restored on page load
- Cleared with "Reset Session"

**Admin Gating** (any of these grants admin access):
1. Role selector = "Admin"
2. `user.role === "Admin"`
3. Email in admin list

### Preview Mode

Test responsive behavior without browser DevTools:
- Desktop preview (normal view)
- Mobile preview (375px centered, with borders)

## Documentation

- **`docs/QA_SYSTEM.md`** - Complete system documentation
- **`rules.md`** - Architecture governance and True North principles
- **`docs/architecture/`** - Component specifications
- **`docs/qa/`** - QA specifications

## Extending the QA System

### Add a New Check

1. Define in `qa/requirements.json`:
```json
{
  "id": "NEW-001",
  "name": "My new check",
  "type": "file_exists",
  "target": "path/to/file",
  "severity": "critical"
}
```

2. If new check type needed, add to `qa/run_qa.py`

3. Run QA to verify

## Troubleshooting

**Health Checker shows "QA Report Not Available":**
- Run `python3 qa/run_qa.py` to generate report
- Ensure `qa/last-run-report.json` exists
- Check file is accessible from web server

**Tests failing:**
- Review error output for specific check ID
- Check `qa/last-run-report.json` for details
- Fix issue and re-run

**Stuck in "Technician" role:**
- Click "Reset Session" in sidebar
- Reload page
- Set desired role

## Support

For issues or questions:
1. Check `docs/QA_SYSTEM.md` for detailed documentation
2. Review `qa/last-run-report.json` for diagnostic info
3. Contact the development team

---

**Remember**: The QA system ensures quality through automation. Always run QA before considering work "done". GREEN = Ready. RED = Not ready.
