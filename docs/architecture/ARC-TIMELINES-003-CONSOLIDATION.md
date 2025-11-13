---
id: ARC-TIMELINES-003
title: Timelines Consolidation - Single Unified Timeline Implementation
status: Implemented
scope: Consolidation of duplicate timeline implementations into single feature-complete version
date: 2025-11-13
supersedes: ARC-TIMELINES-002 (partial), ARC-TIMELINES-TEST-001
---

## 1. Context & Goals

### Purpose
Consolidate the duplicate timeline implementations (TID-TL-PAGE and TID-TL-TEST-PAGE) into a single, feature-complete timeline page that combines the best features from both versions.

### Problem Statement
The application previously had two timeline implementations:
1. **Old Timelines** (TID-TL-PAGE): Had filters but less functional date axis rendering
2. **Timelines (Test)** (TID-TL-TEST-PAGE): Had superior rendering, project progress overlay, resizable columns, but lacked filters

This caused:
- User confusion with duplicate sidebar navigation items
- Maintenance burden maintaining two separate codebases
- Inconsistent user experience

### Solution
- Remove old Timelines page (TID-TL-PAGE) completely
- Enhance Timelines Test page with filter functionality
- Make it the primary timeline implementation
- Update all references and documentation

## 2. Implementation Changes

### 2.1 Page Consolidation

**Removed:**
- `<section data-testid="TID-TL-PAGE">` - Entire old timeline page
- Associated old timeline code in `timelines.js` (kept for reference but not loaded)

**Enhanced:**
- `<section data-testid="TID-TL-TEST-PAGE">` - Now the primary timeline page
- Added filters section with checkboxes for Show project/milestones/deliverables/tasks
- Added project selector dropdown
- Added Create project button

### 2.2 Test ID Mapping

Route `#/timelines` now maps to `TID-TL-TEST-PAGE` (already was, now explicitly documented)

**Active Test IDs:**
- Toolbar: `TID-TLT-Z-YEAR`, `TID-TLT-Z-QUARTER`, `TID-TLT-Z-MONTH`, `TID-TLT-Z-WEEK`, `TID-TLT-Z-DAY`
- Controls: `TID-TLT-VIEW-START`, `TID-TLT-PROJECT-SELECT`, `TID-TLT-CREATE-PROJECT`
- Grid: `TID-TLT-GRID`, `TID-TLT-LABELS`, `TID-TLT-PROGRESS`, `TID-TLT-CANVAS`
- Axes: `TID-TLT-AXIS-YEARS`, `TID-TLT-AXIS-QUARTERS`, `TID-TLT-AXIS-MONTHS`, `TID-TLT-AXIS-WEEKS`, `TID-TLT-AXIS-DAYS`
- Filters: `TID-TLT-FSHOW-PROJ`, `TID-TLT-FSHOW-MS`, `TID-TLT-FSHOW-DL`, `TID-TLT-FSHOW-TASK`, `TID-TLT-FRESP`
- Resizers: `TID-TLT-RESIZER`, `TID-TLT-RESIZER-2`

**Deprecated Test IDs (removed):**
- All `TID-TL-*` test IDs from old timeline (except TID-TL-TEST-PAGE itself)

### 2.3 Feature Preservation

**Retained from Test Version:**
- ✅ Project progress column with visual progress percentage
- ✅ Progress overlay on timeline bars (lighter cover showing completion)
- ✅ Resizable columns (drag handles between labels/progress/timeline)
- ✅ Superior date axis rendering with proper alignment
- ✅ Real-time date tooltips during drag operations
- ✅ Smooth dragging beyond viewport boundaries
- ✅ Persistent timeline data (saves to project state)
- ✅ Multi-year timeline support (10+ years)

**Added from Old Version:**
- ✅ Filter checkboxes (Show project/milestones/deliverables/tasks)
- ✅ Responsible person filter dropdown
- ✅ Project selector dropdown
- ✅ Create project button in toolbar

## 3. Navigation & UI Changes

### 3.1 Sidebar Navigation

**Before:**
```
Timelines
Timelines (Test)
```

**After:**
```
Timelines
```
Single unified navigation item.

### 3.2 Breadcrumbs Fix

**Before:**
- All pages showed "Dashboard" in breadcrumbs
- Sidebar highlighting stuck on Dashboard

**After:**
- Breadcrumbs properly show current page title
- Sidebar highlighting correctly follows navigation
- `aria-current="page"` dynamically set on active nav item

### 3.3 Navigation Function Update

Updated `navigateTo()` function to:
1. Map route to page title using `routeTitles` object
2. Properly set breadcrumbs for all pages
3. Remove hardcoded `aria-current` from Dashboard
4. Dynamically apply `aria-current` to active nav item

## 4. Architecture Compliance

### 4.1 Key Features (Per Requirements)

✅ **Date Bar Display**: Multiple time denomination axes (Year/Quarter/Month/Week/Day) render above timeline grid

✅ **Evenly Distributed Dates**: Date ticks calculated and positioned based on project span

✅ **Zoomable Display**: Zoom buttons toggle visibility of different time axes

✅ **Column/Row Manipulation**: Drag handles allow resizing of label and progress columns proportionally

✅ **Timeline Extension**: Timeline canvas extends 10+ years, drag operations work beyond viewport

✅ **Timeline Start Date**: Controlled by date picker at top (`TID-TLT-VIEW-START`)

✅ **Project Progress Overlay**: Visual progress bar overlay on timeline sliders

✅ **Filters**: Show/hide project types, filter by responsible person

### 4.2 Acceptance Criteria

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Single timeline page | ✅ | TID-TL-PAGE removed |
| Filters functional | ✅ | Filter checkboxes update row visibility |
| Date axes visible | ✅ | All 5 axes render conditionally |
| Column resizing works | ✅ | Two resize handles with drag handlers |
| Progress overlay visible | ✅ | Overlay div with progress-based width |
| Sidebar highlights correctly | ✅ | aria-current dynamically applied |
| Breadcrumbs show page title | ✅ | routeTitles map used |

## 5. File Changes Summary

### 5.1 Modified Files

**src/frontend/index.html**
- Removed: `<section data-testid="TID-TL-PAGE">` (lines ~724-767)
- Modified: Enhanced `<section data-testid="TID-TL-TEST-PAGE">` with filters
- Modified: Navigation breadcrumbs and `navigateTo()` function
- Removed: Hardcoded `aria-current="page"` from Dashboard nav

**src/frontend/timelines-test.js**
- Modified: `buildRows()` - Added filter checkbox support
- Modified: `bindToolbar()` - Added filter and project selector bindings
- Added: Filter change handlers to trigger re-render

**qa/requirements.json**
- Updated: All timeline test IDs from `TID-TL-*` to `TID-TLT-*`
- Updated: timelinesCompliance section with correct test IDs
- Added: TL-007 check for resizers
- Added: TL-009 check for progress overlay

### 5.2 Files Not Modified (Preserved)

**src/frontend/timelines.js**
- Status: Preserved but not loaded/used
- Reason: Historical reference, not part of active codebase

## 6. QA Requirements

### 6.1 Critical Checks

1. **TL-001**: Route `#/timelines` exists and navigates correctly
2. **TL-002**: Zoom buttons (Year/Quarter/Month/Week/Day) present
3. **TL-003**: Timeline controls (date picker, project selector) present
4. **TL-004**: Grid elements (canvas, labels, progress column) render
5. **TL-005**: Filter controls present and functional
6. **TL-006**: Date axes render correctly for all 5 levels
7. **TL-007**: Column resizers exist and function
8. **TL-008**: Navigation from project modal works
9. **TL-009**: Progress overlay visible on timeline bars

### 6.2 Visual Checks

- Breadcrumbs show "Timelines" when on timeline page
- Sidebar "Timelines" item highlighted when active
- Date axes align with progress column right edge
- Timeline bars show progress overlay
- Drag handles visible on bars and column dividers

## 7. Migration Notes

### 7.1 For Users

- No action required - timeline functionality preserved
- Sidebar navigation simplified (one timeline item)
- Enhanced with filters previously unavailable

### 7.2 For Developers

- Use `TID-TLT-*` test IDs for all timeline element selectors
- Old `TID-TL-*` test IDs deprecated and removed
- Timeline state managed through `timelines-test.js`
- Project data loaded from `window.projectState`

## 8. Future Enhancements

### 8.1 Planned Improvements

- [ ] Add export functionality (snapshot/report)
- [ ] Add print-friendly view
- [ ] Add zoom fit-to-page feature
- [ ] Add timeline templates
- [ ] Add dependency links between tasks
- [ ] Add critical path highlighting

### 8.2 Performance Optimization

- [ ] Virtual scrolling for large project counts
- [ ] Debounced rendering during rapid filter changes
- [ ] Canvas-based rendering for smoother large timelines

## 9. Rollback Plan

If critical issues discovered:

1. Revert commits: Restore `TID-TL-PAGE` section
2. Update routing: Map `#/timelines` back to `TID-TL-PAGE`
3. Restore old test IDs in `qa/requirements.json`
4. Update sidebar navigation to show both items

Estimated rollback time: 15 minutes

## 10. Approval

**Architect**: ✅ Consolidation improves maintainability
**QA Lead**: ⏳ Pending QA run (expecting GREEN)
**Product Owner**: ⏳ Pending user verification

---

**Status**: Implementation complete, QA pending
**Next Step**: Run full QA suite to verify GREEN status
