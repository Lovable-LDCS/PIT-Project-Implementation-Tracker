---
id: ARC-TIMELINES-001
title: Timelines - Timeline-first Planner and Viewer
status: Draft v1.3
scope: Two-pane timeline-first creation/editing with multi-scale axes, visible-window sizing, snapping, and filters
---

1) Goals
- Timeline-first creation: projects and milestones are created/edited by dragging a slider bar on a calendar grid.
- True north policy: one time build, QA-driven; architecture defines technical requirements, QA enforces evidence in app.
- Multi-scale zoom with cumulative axes visibility: Year, Quarter, Month, Week, Day. Default zoom = Month.
- Visible-window sizing: selected denominator (Year/Quarter/Month/Week/Day) fills the visible page width (.tl-scroll client width). The whole project remains scrollable beyond the visible window via the bottom scrollbar.
- View start anchoring: visible window begins at a selected start date. The left edge of the visible window is flush-left in the timeline pane and is kept visible by an inner left gutter (CSS var --tl-gutter) so drags don’t cross over the labels column.
- Default baseline (no dates yet): pStart = today (local date), pEnd = today + 5 years. This is the shortest span (5 years) and should generally fit within one screen at Year zoom because only the Years axis is populated at that zoom. Quarters/Months/Weeks/Days add detail progressively and extend the visible window to fill the same width with their respective counts.
- Bars are clickable/creatable: clicking a date on the canvas creates the project bar at that date with a default duration (start = clicked day; end = +1 month), then the slider can be dragged/resized.
- Bars are draggable/resizable with snapping per zoom; auto-scroll near edges; local-time date math; parent-range clamping; body drag moves both start and end.
- Frozen left labels; scrollable right canvas; alignment maintained via spacers. Left labels have pointer-events: none to avoid intercepting drags; bars/handles/axes use elevated z-index to remain on top.
- Sidebar quick selector: a visible timeline selector exists in the sidebar to open the timeline-first planner.

2) DOM Structure
- Page container: data-testid="TID-TL-PAGE"
- Toolbar controls:
  - Zoom mode buttons only: TID-TL-Z-YEAR, TID-TL-Z-QUARTER, TID-TL-Z-MONTH, TID-TL-Z-WEEK, TID-TL-Z-DAY
  - View start: TID-TL-VIEW-START (type=date)
  - Project select: TID-TL-PROJECT-SELECT
  - Create project CTA: TID-TL-CREATE-PROJECT
  - Apply: TID-TL-APPLY
  - Back: TID-TL-BACK
- Disallowed (legacy) controls: TID-TL-ZOOM-IN, TID-TL-ZOOM-OUT, TID-TL-PAN-PREV, TID-TL-PAN-NEXT (must not appear in the build)
- Filters: TID-TL-FILTERS with toggles TID-TL-FSHOW-PROJ/TL-FSHOW-MS/TL-FSHOW-DL/TL-FSHOW-TASK and TID-TL-FRESP
- Two-pane grid:
  - Frozen labels: .tl-labels with header spacer: TID-TL-HEADER-SPACER, axis spacers: .tl-axis-spacer, lanes spacer: .tl-lanes-spacer
  - Scrollable pane: .tl-scroll
  - Axes rows: TID-TL-AXIS-YEARS/QUARTERS/MONTHS/WEEKS/DAYS
  - Canvas: TID-TL-CANVAS containing lanes: #tl-lanes and bars

3) Technical Requirements

3.1 Zoom Denominators and Axis Behavior
- Zoom modes: Year, Quarter, Month, Week, Day
- Cumulative axes visibility by zoom:
  - Year: Years only (primary grid). Quarters/Months/Weeks/Days hidden.
  - Quarter: Years + Quarters.
  - Month: Years + Quarters + Months.
  - Week: Years + Quarters + Months + Weeks.
  - Day: Years + Quarters + Months + Weeks + Days (fully extended).
- Progressive detail:
  - Year zoom: shows only year ticks; intended to roughly fit a 5-year baseline within one page width on typical displays.
  - Quarter zoom: slightly expands visible detail to include 4 quarters per year.
  - Month zoom: expands to include months aligned under quarters and years.
  - Week zoom: expands further to weeks (Monday-aligned).
  - Day zoom: fully extended with daily ticks.

3.2 Default Baseline and Project Span
- If project dates are missing:
  - pStart = today (local date)
  - pEnd = pStart + 5 years
- Axes (for any zoom) render across the full project span [pStart..pEnd].
- The visible window always fills the current .tl-scroll width based on the selected zoom’s count.

3.3 Visible-window sizing and Anchoring
- For the active zoom, compute px-per-day so: pxPerDay = .tl-scroll.clientWidth / visibleDays (min clamp 0.5 px/d)
- The visible window spans:
  - Year: yearsVisible (default 5)
  - Quarter: quartersVisible (default 8)
  - Month: monthsVisible (default 12)
  - Week: weeksVisible (default 24)
  - Day: daysVisible (default 31)
- View start: controlled by TID-TL-VIEW-START; tlRender aligns .tl-scroll.scrollLeft = tlDateToX(viewStart) - gutter (CSS var --tl-gutter)

3.4 Dragging and Snapping
- Start handle moves start; end handle moves end; dragging the bar body moves both start and end together.
- Snap points: Year→Jan 1, Quarter→quarter start (Jan/Apr/Jul/Oct), Month→day=1, Week→Monday, Day→exact day.
- Bars auto-scroll .tl-scroll when dragged near edges and remain constrained within parent ranges (not clamped to the visible window).

3.5 Layout & Layering
- Frozen left labels column: .tl-labels (pointer-events: none) with sticky header and axis spacers.
- Scrollable right canvas: .tl-scroll; canvas and axes widths sized to cover the full project span.
- Left inner gutter: CSS var --tl-gutter applied to .timeline-canvas; bars, handles, and labels have elevated z-index to avoid being covered by labels.

- Cumulative axes visibility
  - Year: Years only
  - Quarter: Years+Quarters
  - Month: Years+Quarters+Months
  - Week: Years+Quarters+Months+Weeks
  - Day: Years+Quarters+Months+Weeks+Days
- Axes rendering spans entire project (or a 5-year default baseline if no dates)
  - If no project dates: pStart = today (local date), pEnd = today + 5 years.
  - Quarters anchor to quarter starts; weeks anchor to Monday; days use local date
- Visible-window sizing
  - Settings-driven counts: yearsVisible, quartersVisible, monthsVisible, weeksVisible, daysVisible persisted in localStorage key pm_tl_settings
  - For the active zoom, compute px-per-day so that the selected count fills the current visible width of .tl-scroll (no arbitrary paddings)
  - The canvas/axes widths cover the full project span; scrolling reveals entire duration beyond the visible window
- View start anchoring
  - TID-TL-VIEW-START controls tlState.viewStart; tlComputeView sets px-per-day so the selected count fills the viewport and keeps origin anchored at project start
  - A CSS inner left gutter (var --tl-gutter) visually separates the scroll pane from the labels, avoiding pointer overlap
  - tlRender must set .tl-scroll.scrollLeft to tlDateToX(viewStart) minus the CSS gutter so the visible window aligns exactly with the selected start date at the left edge.
- Drag/resizing behavior for bars
  - Convert dx to days using current px-per-day
  - Snap to boundaries by zoom (Year: Jan 1; Quarter: quarter start; Month: 1st; Week: Monday; Day: exact day)
  - Handles: start-handle moves start, end-handle moves end, clicking and dragging on the bar body moves both start and end together.
  - Clamp within parent range (proj contains milestones; milestones contain deliverables; deliverables/tasks within their parent). Bars are not clamped to the visible window; users can drag past the current view (auto-scroll keeps up).
  - Auto-scroll when near left/right edges while dragging
- Local-date correctness: all date math uses local time constructs to avoid UTC drift
- Alignment and layout
  - Left labels column remains sticky
  - Header and axis/lanes spacers align left and right pane rows

4) Settings
- Settings page inputs: TID-SET-YEARS, TID-SET-QUARTERS, TID-SET-MONTHS, TID-SET-WEEKS, TID-SET-DAYS
- settingsSave writes pm_tl_settings
- settingsGet merges defaults and saved values

5) Architecture hooks (QA enforces presence)
- Core functions must exist in app-main.js (not inline), and router must call tlInitFromStore and tlRender on #/timelines.
- tlComputeView must: set tlState.projectStart/projectEnd, compute tlState.viewStart/viewEnd, and compute pxPerDay based on .tl-scroll width / visibleDays.
- tlRender must: call tlComputeView, render lanes/bars, call tlUpdateAxisVisibility and tlRenderTicks, and set .tl-scroll.scrollLeft = tlDateToX(viewStart).
- tlRenderTicks must: size canvas/axes width to full project span and render tick labels across the entire span for visible axes.

- tlInitFromStore, tlComputeView, tlRender, tlRenderTicks, tlUpdateAxisVisibility, tlSetZoom, tlAddBar, tlBindViewStartInput, tlEnableClickCreate
- Navigation helpers: openTimelines(mode), backToProjects()
- Sidebar quick selector: element TID-SIDEBAR-TL-SELECTOR that opens #/timelines
- Wiring policy linkage: see ARC-WIRING-001 for pending-ok policy and required vs disallowed controls.

6) Acceptance Criteria (QA references: QA-TIMELINES-001)
- All DOM test IDs present
- Axis visibility conforms to zoom mode
- Selecting View start and zoom applies visible-window sizing across full visible width
- 5-year baseline visible when project dates absent
- Bars draggable with snapping; dates update labels; clamped to parent ranges
- Frozen left column aligns with bar lanes across zooms
