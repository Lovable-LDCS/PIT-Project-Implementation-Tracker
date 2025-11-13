---
id: ARC-TIMELINES-TEST-001
title: Timelines Test - Comprehensive Timeline View Requirements
status: Draft v0.2
scope: Test-page-only requirements prior to promotion to main timelines
lastUpdated: 2025-11-13
---

## 1) Axes-to-grid alignment
- The left edge of the date rows (axes) MUST align exactly with the right edge of the Progress column.
- The axes must not overlap or extend into the Project descriptors or Progress columns.
- Axes width equals the width of the timeline canvas area (right of the Progress column).

## 2) Scroll synchronization
- Horizontal scrolling of the timeline area must also scroll the date rows container, keeping ticks aligned.
- Timeline bars MUST be draggable off-screen without hitting boundaries.
- Timeline canvas MUST extend at least 10 years beyond the visible viewport.
- When dragging timelines off-page, the viewport should scroll smoothly to follow the drag operation.

## 3) Axis filters & visual selection
- Year/Quarter/Month/Week/Day act as toggles (any combination). Selected buttons have a distinct visual state.
- **CRITICAL**: Only selected axes should be visible. If Year is selected alone, only Year axis shows. Quarters/Months/Weeks/Days must be hidden.
- Toggling an axis button must immediately show/hide that specific axis row.

## 4) Adjustable column widths (Excel-like)
- Each date axis (Year, Quarter, Month, Week, Day) MUST have adjustable column widths.
- User can drag column boundaries to resize individual date columns.
- **Proportional sizing**: When one date type column is resized, ALL date type columns resize proportionally.
  - Example: If Day column is increased by 50%, then Week, Month, Quarter, and Year columns all increase by 50%.
- Column width adjustments persist during the session.
- Minimum column width: 40px per date unit to prevent cramping.

## 5) Expand/Collapse per axis row
- Clicking a date row toggles a collapsed state that reduces its height and hides labels to alleviate cramping.
- Collapsed state does not affect underlying data or functionality.

## 6) Timeline start date
- Changing the "Timeline start date" input shifts the view and remains in sync with current view state.
- Timeline MUST extend from start date for at least 10 years into the future.

## 7) Zoom and fit functionality
- User must be able to zoom in/out to fit entire timeline on screen for export/reporting.
- Zoom controls should allow fitting all dates within the visible viewport.
- Zoom state should be adjustable independent of axis selection.

## 8) Bars interaction (test page scope)
- Bars are draggable and resizable. While dragging/resizing, dates update inline via tooltip.
- Snapping applies per the finest selected axis.
- **Progress overlay**: Timeline bars MUST display a lighter overlay showing progress percentage.
  - Progress overlay width = (progress % × bar width)
  - Overlay uses rgba(255,255,255,0.3) styling.
- Progress overlay must remain visible and functional at all times.

## 9) Filter dropdowns
- Filters at top must include searchable dropdowns for:
  - Project(s) selection
  - Timeline(s) selection (if multiple timelines exist)
  - Deliverable(s) selection
  - Task(s) selection
- Filters should support multi-select capability.
- Checkboxes for Show Project/Milestones/Deliverables/Tasks must filter visibility immediately.

## 10) Project setup workflow integration
- **"Set timeline…" button** in Project Setup modal navigates to Timeline page.
- After timeline is configured on Timeline page, user clicks **"Apply"** button.
- **"Apply" button** MUST be visible and functional on Timeline page.
- Clicking "Apply" returns user to Project Setup modal to continue project creation workflow.
- Timeline data must persist to window.projectState during workflow.
- After completing Project Setup and clicking "Save", project appears in Implementation page.

## 11) QA (in-app) coverage
- In-app QA must flag if:
  - Axes left edge != Progress right edge (misalignment) [CRITICAL]
  - Axes scroll not synchronized with timeline scroll [HIGH]
  - Quarters axis visible when only Year is selected [CRITICAL]
  - Any unselected axis is visible [CRITICAL]
  - Progress column < 80px [MEDIUM]
  - Timeline canvas width < 10 years from start date [HIGH]
  - Apply button missing on Timeline page when returnToModal is set [CRITICAL]
  - Progress overlay not visible on timeline bars [HIGH]
  - Date columns cannot be resized [HIGH]
- Only promote to main when in-app QA is GREEN for the Timelines Test component.

## 12) Acceptance Criteria
- [ ] Axes align precisely with Progress column right edge
- [ ] Only selected axes are visible (no unselected axes shown)
- [ ] Timeline bars can be dragged smoothly off-screen for 10+ years
- [ ] Date column widths are adjustable via drag
- [ ] All date columns resize proportionally when one is adjusted
- [ ] Progress overlay remains visible on all timeline bars
- [ ] Apply button appears on Timeline page during project setup workflow
- [ ] Apply button returns user to Project Setup modal
- [ ] All QA checks pass (GREEN status)
