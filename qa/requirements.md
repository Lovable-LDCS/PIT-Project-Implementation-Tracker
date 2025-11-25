# QA Requirements

## Validation Rules for Architecture Compliance

**Version:** 1.0.0  
**Last Updated:** 2025-11-25  
**Status:** Active

---

## Purpose

This document defines the validation rules and QA gates that enforce architecture compliance for the PIT (Project Implementation Tracker) application. All checks are designed to be machine-verifiable.

---

## 1. Architecture Compliance Rules

### 1.1 File Structure Validation

| Rule ID | Description | Severity |
|---------|-------------|----------|
| ARCH-001 | `rules.md` exists at repository root | CRITICAL |
| ARCH-002 | `architecture/` folder exists with required files | CRITICAL |
| ARCH-003 | `docs/architecture/` contains component specifications | CRITICAL |
| ARCH-004 | `qa/requirements.json` is valid JSON | CRITICAL |

### 1.2 Code Alignment

| Rule ID | Description | Severity |
|---------|-------------|----------|
| ARCH-010 | All routes in architecture exist in code | CRITICAL |
| ARCH-011 | All components in architecture are wired | CRITICAL |
| ARCH-012 | No legacy components remain in code | HIGH |
| ARCH-013 | Test IDs match architecture specification | CRITICAL |

---

## 2. UI/UX Consistency Gates

### 2.1 Visual Consistency

| Rule ID | Description | Severity |
|---------|-------------|----------|
| UI-001 | Responsive layout works at Desktop (1920×1080) | HIGH |
| UI-002 | Responsive layout works at Mobile (375×667) | HIGH |
| UI-003 | Color tokens match brand guidelines | MEDIUM |
| UI-004 | Typography follows style guide | MEDIUM |
| UI-005 | Spacing uses defined grid system | MEDIUM |

### 2.2 Navigation Consistency

| Rule ID | Description | Severity |
|---------|-------------|----------|
| NAV-001 | All sidebar links are functional | CRITICAL |
| NAV-002 | Breadcrumbs update correctly | HIGH |
| NAV-003 | Route changes update browser history | HIGH |
| NAV-004 | Deep linking works for all routes | HIGH |

---

## 3. User Feedback Expectations

### 3.1 Loading States

| Scenario | Expected Feedback | Severity |
|----------|-------------------|----------|
| Page load | Skeleton or spinner visible | HIGH |
| Data fetch | Loading indicator shown | HIGH |
| Form submission | Button shows loading state | HIGH |

### 3.2 Save Operations

| Scenario | Expected Feedback | Severity |
|----------|-------------------|----------|
| Saving data | Spinner visible | HIGH |
| Save success | Toast confirmation | HIGH |
| Save failure | Error toast with message | CRITICAL |

### 3.3 Error Handling

| Scenario | Expected Feedback | Severity |
|----------|-------------------|----------|
| API error | Toast with error details | CRITICAL |
| Validation error | Inline field message | HIGH |
| Network failure | Retry option shown | HIGH |
| Permission denied | Clear denial message | CRITICAL |

---

## 4. Component Wiring Checks

### 4.1 Route Wiring

All routes MUST:
1. Resolve to a valid page component
2. Render complete content (not empty container)
3. Be accessible via navigation
4. Support deep linking

**Wiring Failure = CRITICAL Severity**

### 4.2 Event Handler Wiring

All interactive elements MUST:
1. Have attached event handlers
2. Respond to user interaction
3. Produce expected side effects
4. Update UI appropriately

### 4.3 Function Availability

Required window functions:
- `navigateTo`
- `appNavTo`
- `tlRender`
- `tlInitFromStore`
- `openProjectSetup`
- `projectsUpsert`

**Missing function = CRITICAL Severity**

---

## 5. Workflow Validation

### 5.1 Project Creation Flow

| Step | Validation | Severity |
|------|------------|----------|
| 1 | Open project modal | CRITICAL |
| 2 | Fill required fields | HIGH |
| 3 | Save project | CRITICAL |
| 4 | Verify in hierarchy | CRITICAL |
| 5 | Data persisted | CRITICAL |

### 5.2 Timeline Configuration Flow

| Step | Validation | Severity |
|------|------------|----------|
| 1 | Navigate to timelines | CRITICAL |
| 2 | Select project | HIGH |
| 3 | Configure dates via drag | CRITICAL |
| 4 | Save changes | CRITICAL |
| 5 | Return to project | HIGH |

### 5.3 Member Invitation Flow

| Step | Validation | Severity |
|------|------------|----------|
| 1 | Open invite modal | CRITICAL |
| 2 | Enter member details | HIGH |
| 3 | Send invitation | HIGH |
| 4 | Confirmation shown | HIGH |

---

## 6. Data Integrity Expectations

### 6.1 Persistence Rules

| Rule | Description | Severity |
|------|-------------|----------|
| DATA-001 | Project data persists to localStorage | CRITICAL |
| DATA-002 | Role context persists across sessions | CRITICAL |
| DATA-003 | Auth context maintains state | CRITICAL |
| DATA-004 | Timeline changes save correctly | CRITICAL |

### 6.2 Data Validation

| Rule | Description | Severity |
|------|-------------|----------|
| DATA-010 | Required fields enforced | HIGH |
| DATA-011 | Date ranges validated | HIGH |
| DATA-012 | Progress values 0-100 | HIGH |
| DATA-013 | Unique IDs maintained | CRITICAL |

---

## 7. Deployment Readiness Checks

### 7.1 Pre-Deployment

| Check | Description | Severity |
|-------|-------------|----------|
| DEPLOY-001 | GitHub Pages workflow exists | CRITICAL |
| DEPLOY-002 | index.html present | CRITICAL |
| DEPLOY-003 | .nojekyll file exists | CRITICAL |
| DEPLOY-004 | All assets bundled | CRITICAL |
| DEPLOY-005 | No console errors | HIGH |

### 7.2 Post-Deployment

| Check | Description | Severity |
|-------|-------------|----------|
| DEPLOY-010 | Live URL accessible | CRITICAL |
| DEPLOY-011 | HTTP 200 response | CRITICAL |
| DEPLOY-012 | Test IDs in deployed HTML | CRITICAL |
| DEPLOY-013 | All routes functional | CRITICAL |

---

## 8. Security Expectations

### 8.1 Access Control

| Rule | Description | Severity |
|------|-------------|----------|
| SEC-001 | Admin routes hidden from non-admin | HIGH |
| SEC-002 | Role verification on protected actions | HIGH |
| SEC-003 | No sensitive data in localStorage | CRITICAL |

### 8.2 Code Security

| Rule | Description | Severity |
|------|-------------|----------|
| SEC-010 | No hardcoded secrets | CRITICAL |
| SEC-011 | No API keys in source | CRITICAL |
| SEC-012 | XSS prevention in place | HIGH |

---

## 9. Green/Red Evaluation Model

### 9.1 Status Definitions

| Status | Criteria |
|--------|----------|
| 🟢 **GREEN** | All CRITICAL and HIGH severity checks pass |
| 🟡 **AMBER** | All CRITICAL pass, some HIGH fail |
| 🔴 **RED** | Any CRITICAL check fails |

### 9.2 Severity Guidelines

| Severity | Definition | Examples |
|----------|------------|----------|
| **CRITICAL** | Core functionality broken | Wiring failure, route broken, data loss |
| **HIGH** | Important feature degraded | UI issue, accessibility problem |
| **MEDIUM** | Nice-to-have issue | Cosmetic, enhancement |

### 9.3 Resolution Priority

1. Fix all CRITICAL issues first
2. Fix HIGH issues before deployment
3. MEDIUM can be deferred with documentation

---

## 10. Build Handover Criteria

### 10.1 Handover Requirements

A build may be handed over ONLY when:

- [ ] All CRITICAL checks pass
- [ ] All HIGH checks pass (or documented exceptions)
- [ ] QA status is GREEN
- [ ] Deployment verification complete
- [ ] No JavaScript console errors
- [ ] All routes accessible
- [ ] Data persistence verified

### 10.2 Handover Blockers

**NO HANDOVER if:**
- Any CRITICAL check fails
- Wiring failures exist
- Routes return 404
- Console errors present
- Data loss risk identified

---

## 11. Continuous Validation

### 11.1 CI Integration

QA checks run on:
- Every commit to main
- Every PR before merge
- Scheduled nightly builds

### 11.2 Automated Reporting

Reports generated:
- `qa/report.md` - Human-readable summary
- `qa/last-result.json` - Machine-readable results
- `qa/handover.md` - UI verification checklist

---

## 12. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-25 | Initial QA requirements |

---

## Related Documents

- `qa/checklist.json` - Machine-readable checklist
- `qa/requirements.json` - Detailed check specifications
- `architecture/rules.md` - Architecture rules
- `rules.md` - Build methodology
