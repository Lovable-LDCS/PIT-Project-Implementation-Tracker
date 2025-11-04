---
id: ARC-TIMELINES-TEST-001
title: Timelines Test - Axes and Grid Alignment
status: Draft v0.1
scope: Test-page-only requirements prior to promotion to main timelines
---

1) Axes-to-grid alignment
- The left edge of the date rows (axes) must align exactly with the right edge of the Progress column.
- The axes must not overlap or extend into the Project descriptors or Progress columns.
- Axes width equals the width of the timeline canvas area (right of the Progress column).

2) Scroll synchronization
- Horizontal scrolling of the timeline area must also scroll the date rows container, keeping ticks aligned.

3) Axis filters & visual selection
- Year/Quarter/Month/Week/Day act as toggles (any combination). Selected buttons have a distinct visual state.

4) Expand/Collapse per axis row
- Clicking a date row toggles a collapsed state that reduces its height and hides labels to alleviate cramping.

5) Timeline start date
- Changing the "Timeline start date" input shifts the view and remains in sync with current view state.

6) Bars interaction (test page scope)
- Bars are draggable and resizable. While dragging/resizing, dates update inline.
- Snapping applies per the finest selected axis.

7) QA (in-app) coverage
- In-app QA must flag if:
  - Axes left edge != Progress right edge (misalignment)
  - Axes scroll not synchronized with timeline scroll
  - Quarters axis not visible after toggle
  - Progress column < 80px
- Only promote to main when in-app QA is GREEN for the Timelines Test component.
