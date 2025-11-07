# QA System Documentation

## Overview

This document describes the comprehensive QA and Health Check system for the PIT Project Implementation Tracker.

## Architecture

The QA system follows the "True North" architecture-first principles defined in `rules.md`:

1. **Architecture First**: Requirements are defined before implementation
2. **Machine-Verifiable**: All checks are automated and can be run programmatically
3. **RED/GREEN Workflow**: Clear pass/fail criteria with detailed diagnostics
4. **Comprehensive Coverage**: Tests cover architecture, build, security, wiring, and more

## Components

### 1. Requirements Definition (`qa/requirements.json`)

The single source of truth for all QA requirements. Defines:
- Check categories (architecture, build, security, etc.)
- Individual checks with severity levels (critical, high, medium, low)
- Check types and targets
- Pass/fail criteria

### 2. QA Runner (`qa/run_qa.py`)

Python script that:
- Loads requirements from `qa/requirements.json`
- Executes all defined checks
- Generates color-coded terminal output
- Exports JSON reports to `qa/last-run-report.json`
- Supports strict mode via `QA_STRICT=1` environment variable

### 3. Health Checker UI (Admin Tool)

In-app health checker accessible at `#/health-checker` for admin users:
- One-click QA execution from the UI
- Human-readable report display
- Strict mode toggle
- Real-time status updates

## Usage

### Command Line

Run the QA suite from the command line:

```bash
# Normal mode
python3 qa/run_qa.py

# Strict mode (fail on missing/misconfigured envs)
QA_STRICT=1 python3 qa/run_qa.py
# or
python3 qa/run_qa.py --strict
```

### From the UI

1. Navigate to the application
2. Set your role to "Admin" using the role selector in the sidebar
3. Click on "Health Checker" in the Admin Tools section
4. Click "Run Health Check" button
5. View the detailed report

## QA Check Categories

### Architecture Compliance
- Verifies `rules.md` exists and is valid
- Ensures architecture documents are present
- Validates QA specifications exist
- Checks `qa/requirements.json` is valid JSON

### Environment
- Documents required environment variables
- Supports strict mode for production readiness

### Type Safety
- JavaScript syntax validation
- Static analysis for common errors

### Build Integrity
- Frontend files accessibility
- Required assets presence
- CSS stylesheet existence

### Unit Tests
- pytest test existence
- All tests passing

### E2E and Wiring Tests (Planned)
- Navigation tests
- Wiring validation
- Admin functionality tests

### Route Smoke Tests (Planned)
- All primary routes accessible
- No server errors

### Wiring Checks (Planned)
- Preview toggle functionality
- Admin tab visibility
- Admin routes responding

### State and Persistence
- RoleContext localStorage integration
- AuthContext localStorage integration
- Reset session functionality
- Admin gating logic

### UI/UX Consistency (Planned)
- Responsive layout (Desktop/Mobile)
- Required test IDs present

### Security
- No sensitive keys in source code
- Admin routes properly gated

### Health Checker
- Component existence checks
- Functional verification

## Status Codes

- **GREEN**: All checks pass
- **AMBER**: All critical checks pass, some high/medium checks fail
- **RED**: One or more critical checks fail

## Extending the QA System

### Adding a New Check

1. Add the check definition to `qa/requirements.json`:

```json
{
  "id": "NEW-001",
  "name": "Description of the check",
  "type": "check_type",
  "target": "path/to/target",
  "severity": "critical"
}
```

2. If the check type doesn't exist, implement it in `qa/run_qa.py`:

```python
def check_new_type(self, target: str) -> Tuple[bool, str]:
    """Check implementation"""
    # Your check logic here
    if condition_passes:
        return True, "Success message"
    return False, "Failure message"
```

3. Add the check type to the `run_check` method dispatcher

### Supported Check Types

Current implementation:
- `file_exists`: File presence check
- `directory_exists`: Directory presence check
- `directory_not_empty`: Directory has content
- `json_valid`: JSON syntax validation
- `js_syntax_check`: JavaScript syntax validation
- `pytest_run`: Execute pytest tests
- `documentation_check`: Pattern search in documentation
- `secret_scan`: Scan for potential secrets

Planned (currently return pending status):
- `playwright_test`: E2E tests with Playwright
- `route_smoke`: Route accessibility tests
- `wiring_runtime`: Runtime wiring validation
- `state_persistence`: State management tests
- `element_exists`: DOM element checks
- `admin_gating`: Admin access control tests
- `responsive_check`: Responsive layout tests
- `testid_check`: Test ID presence validation
- `access_control`: Access control verification
- `route_check`: Route rendering tests
- `static_analysis`: Advanced static analysis

## Integration with CI/CD

The QA runner can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run QA Checks
  run: |
    python3 -m pip install pytest
    python3 qa/run_qa.py
```

Exit codes:
- `0`: GREEN or AMBER (non-strict mode)
- `1`: RED (critical failure)

## Reports

Reports are exported to `qa/last-run-report.json` with structure:
- Timestamp
- Strict mode status
- Summary (total, passed, failed)
- Detailed results by category
- Individual check results with messages

## Admin Features

### Role Management
- Role selector in sidebar for testing
- Roles: None, User, Technician, Admin
- Persisted to localStorage

### Admin Gating
Admin access is granted if ANY of these conditions are met:
- Role selector is set to "Admin"
- User object has `role === 'Admin'`
- Email is in the admin list

### Reset Session
Clears all localStorage data and reloads the application

### Preview Mode
Toggle between Desktop and Mobile preview modes to test responsive behavior

## Future Enhancements

1. **Playwright E2E Tests**: Full browser automation tests
2. **Database Migration Checks**: Validate schema and migrations
3. **API Health Checks**: Test endpoint availability and responses
4. **Email Integration Tests**: Verify email provider configuration
5. **Performance Metrics**: Bundle size, load times, etc.
6. **Accessibility Tests**: Automated WCAG compliance checks
7. **Self-Healing**: Auto-correct based on QA signals
8. **Historical Trends**: Track QA status over time

## Troubleshooting

### QA Reports Not Loading in UI

If the Health Checker shows "QA Report Not Available":
1. Run `python3 qa/run_qa.py` from the command line
2. Ensure the report is generated at `qa/last-run-report.json`
3. Verify the file is accessible from the web server

### False Positives in Secret Scanning

If legitimate code is flagged:
1. Check if the pattern is in the exclusion list
2. Ensure examples use "your_" or "example" prefixes
3. Update the secret scan logic in `qa/run_qa.py`

### Strict Mode Failures

Strict mode is meant for production readiness:
1. Ensure all required environment variables are set
2. Verify database connectivity
3. Confirm all external service configurations

## Contributing

When adding new features:
1. Update architecture documents first
2. Add corresponding QA checks to `qa/requirements.json`
3. Implement the feature
4. Ensure QA passes (GREEN)
5. Submit PR with QA report

## References

- [rules.md](../rules.md) - Architecture governance
- [Architecture Documents](../docs/architecture/) - Component specifications
- [QA Specifications](../docs/qa/) - Test specifications
- [Requirements](qa/requirements.json) - Machine-readable requirements
