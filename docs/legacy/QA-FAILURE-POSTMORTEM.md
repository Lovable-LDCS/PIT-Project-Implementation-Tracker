# QA Failure Postmortem - PR #28

**Date:** 2025-11-13  
**Incident:** QA workflow failed with RED status after PR #28 merge  
**Severity:** High - Violated One Time Build philosophy

## Timeline

1. **PR #28** was created to fix timeline UI issues
2. PR #28 was **merged to main** before QA workflow completed
3. **GitHub Actions run #19333000299** executed and **failed with RED status**
4. **3 failed checks, 2 skipped** - Overall status: RED

## Root Cause

### Primary Issue
The timelines route handler in `src/frontend/index.html` (line 1015) was calling:
```javascript
if(window.initTestTimeline){ window.initTestTimeline(); }
```

But the QA validation script (`scripts/qa/qa-check.ps1` line 122) expected:
```javascript
tlInitFromStore(); tlRender();
```

This caused the critical check **WIRE-001** (Frontend wiring checks) to fail.

### Process Issue
According to the **One Time Build philosophy** defined in `.github/agents/my-agent.agent.md`:

> **Never mark GREEN until all critical checks pass**  
> **RED blocks all handover and requires remediation**  
> **QA must be run and pass before handover**

PR #28 was merged before the QA workflow completed, violating this principle.

## Impact

- **CI Build Failed:** GitHub Actions workflow failed with exit code 1
- **Blocked Development:** Subsequent PRs would inherit the failing QA state
- **Violated Architecture:** Didn't follow the Architecture → QA → Implementation → GREEN flow

## Resolution

### Immediate Fix
**File:** `src/frontend/index.html` line 1015  
**Change:** Replaced conditional `window.initTestTimeline()` call with direct calls:
```javascript
// Before
if(route === '#/timelines'){ try{ if(window.initTestTimeline){ window.initTestTimeline(); } }catch(e){} }

// After
if(route === '#/timelines'){ try{ tlInitFromStore(); tlRender(); }catch(e){} }
```

### Verification
```bash
pwsh scripts/run-qa.ps1 -SkipTests
```

**Results:**
- Total Checks: 23
- Passed: 16
- Failed: 3 (high severity deployment checks - expected on non-main branch)
- Skipped: 4
- **Status: AMBER** ✓ (All critical checks passing)

## Why AMBER is Acceptable

The 3 failing checks are:
1. **DEPLOY-006:** Current branch deployment status (expected - not on main)
2. **DEPLOY-008:** Latest deployment workflow run (authentication issue in CI)
3. **DEPLOY-010:** Deployed content verification (expected - changes not deployed yet)

These are all **high severity** (not critical) and are expected to fail on non-main branches. The GitHub Actions workflow configuration allows AMBER to pass:

```yaml
elseif ($results.overallStatus -eq 'AMBER') {
  Write-Host "⚠ QA validation completed with AMBER status (warnings present)"
  # Allow AMBER to pass in CI
  exit 0
}
```

## Lessons Learned

### What Went Wrong
1. ❌ PR was merged before QA workflow completed
2. ❌ Developer didn't wait for all status checks to complete
3. ❌ Critical wiring check wasn't validated locally before merge

### What Went Right
1. ✅ Automated QA caught the issue immediately
2. ✅ Clear error messages indicated exact problem
3. ✅ Fix was surgical and minimal (1 line changed)
4. ✅ QA validation provided clear pass/fail criteria

## Prevention

### Process Improvements
1. **Branch Protection:** Enable "Require status checks to pass before merging" for main branch
2. **PR Checklist:** Add reminder to verify all CI checks pass
3. **Local QA:** Run `pwsh scripts/run-qa.ps1 -SkipTests` before creating PR

### Technical Improvements
1. **Pre-commit Hook:** Add git pre-commit hook to run QA checks
2. **PR Template:** Include QA status verification in PR template
3. **Automated Reminders:** GitHub Action to comment on PR if checks are pending

## References

- **Failed Workflow Run:** https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker/actions/runs/19333000299
- **One Time Build Philosophy:** `.github/agents/my-agent.agent.md`
- **QA Validation Script:** `scripts/qa/qa-check.ps1`
- **Fix PR:** This PR (copilot/fix-qa-workflow-errors)

## Action Items

- [x] Fix immediate issue (timelines wiring)
- [x] Verify fix with local QA run
- [x] Document postmortem
- [ ] User to enable branch protection rules
- [ ] User to review and approve process improvements
- [ ] Consider adding pre-commit hooks

---

**Status:** RESOLVED  
**Resolution Time:** ~20 minutes  
**Impact:** Low (caught immediately, fixed before further development)
