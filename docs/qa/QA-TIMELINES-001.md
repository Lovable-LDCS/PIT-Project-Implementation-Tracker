---
id: QA-TIMELINES-001
title: QA - Timelines (Timeline-first Planner)
component: ARC-TIMELINES-001
status: Draft v1.2
---

Checks (Presence & Wiring)
- TID-TL-PAGE exists and is routable (router maps #/timelines to it)
- Toolbar controls present: TID-TL-Z-YEAR/QUARTER/MONTH/WEEK/DAY, TID-TL-VIEW-START, TID-TL-PROJECT-SELECT, TID-TL-CREATE-PROJECT, TID-TL-APPLY, TID-TL-BACK; default zoom is Month
- Filters present: TID-TL-FILTERS with toggles TID-TL-FSHOW-PROJ, TID-TL-FSHOW-MS, TID-TL-FSHOW-DL, TID-TL-FSHOW-TASK, and TID-TL-FRESP
- Two-pane grid present: .tl-labels, .tl-scroll; axes rows TID-TL-AXIS-YEARS/QUARTERS/MONTHS/WEEKS/DAYS; canvas TID-TL-CANVAS; lanes #tl-lanes; the visible window left edge must be flush-left (not hidden under descriptors) at initial render and after changing View start.
- Settings inputs present in Settings page and settingsSave persists pm_tl_settings in localStorage

Checks (Behavioral Evidence)
- Axis visibility follows cumulative rules based on window.tlState.zoom (Year: Years only; Quarter: Years+Quarters; Month: Years+Quarters+Months; Week: Years+Quarters+Months+Weeks; Day: all axes).
- Default baseline when no dates: pStart=today (local), pEnd=today+5 years. At Year zoom, 5 years is the shortest span and should roughly fit one page because only Years axis is populated.
- tlComputeView computes tlState.pxPerDay = .tl-scroll.clientWidth / visibleDays (>=0.5) and sets tlState.viewStart/viewEnd/viewDays; TID-TL-VIEW-START reflects tlState.viewStart.
- tlRender sizes canvas/axes across full project span and sets .tl-scroll.scrollLeft = tlDateToX(viewStart) - gutter; clicking on the canvas creates a project baseline bar if no project exists (default end = +1 month).
- tlRenderTicks renders tick labels across the entire project span for visible axes at the current zoom.
- Creating a project without end date results in a default end = start + 1 month so a visible bar is rendered. If no project exists, clicking on the canvas creates a bar at the clicked date with default duration (+1 month).
- Bars created with tlAddBar have handles, date labels at both ends, and update their left/width on drag with snapping by zoom; bars remain draggable and visible at all zooms; slider must not disappear. Bars are clamped to their parent ranges and can be dragged beyond the visible window (auto-scroll).
- Bars remain constrained within parent ranges
- Auto-scroll triggers when dragging near edges of .tl-scroll; bars remain slidable under all denominators
- Left labels column alignment: tl-header-spacer height matches header, .tl-axis-spacer rows match axis heights, .tl-lanes-spacer aligns first lane; no overlap where timeline start is hidden under the descriptors column.

Checks (Performance/One-time build policy)
- LocalStorage keys used: pm_tl_settings, pm_projects (no other app-specific keys). Sidebar quick selector exists: TID-SIDEBAR-TL-SELECTOR opens #/timelines.
- No duplicate function definitions for core timeline hooks
- Function wiring cleanliness: core timeline functions are defined and invoked at least once (navigateTo routes to timelines and calls tlInitFromStore + tlRender)
