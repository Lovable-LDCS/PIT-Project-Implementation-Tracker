---
id: ARC-TIMELINES-004
title: Timeline Enhanced Requirements - Proportional Sizing and Advanced Filtering
status: Requirements Captured
scope: Enhanced timeline functionality with proportional date sizing, advanced filters, and zoom-to-fit
date: 2025-11-13
extends: ARC-TIMELINES-003-CONSOLIDATION
---

## 1. Context & Goals

### Purpose
Capture enhanced timeline requirements for a production-ready, Excel-like timeline management system with advanced filtering, proportional date axis sizing, and export-friendly zoom controls.

### Key Enhancement Areas
1. **Incremental Date Axis Reveal**: Date axes appear/disappear as buttons are clicked
2. **Proportional Sizing**: Resizing any date column proportionally adjusts all others
3. **Advanced Filtering**: Searchable/selectable dropdowns for all timeline entities
4. **Zoom-to-Fit**: Fit entire timeline on-page for export/snapshot
5. **Collapse/Expand**: Excel-like row/column collapse without affecting underlying structure
6. **Visual Overview**: Clear, at-a-glance project status visualization

---

## 2. Detailed Requirements

### 2.1 Date Axis Behavior

#### 2.1.1 Incremental Reveal
**Requirement**: Clicking Year/Quarter/Month/Week/Day buttons should reveal those specific date axes.

**Current State**: Axes show cumulatively (Year shows Years, Quarter shows Years+Quarters, etc.)

**Enhanced Behavior**:
- **Click Year only**: Show Years axis only
- **Click Quarter only**: Show Quarters axis only  
- **Click Year + Month**: Show Years + Months (skip Quarters)
- **Click All**: Show all 5 axes
- **Click None**: Hide all axes (keep only timeline bars)

**Implementation Notes**:
```javascript
// State tracks which axes are active
state.activeAxes = new Set(['year']); // default

// Toggle behavior
function toggleAxis(axisName) {
  if (state.activeAxes.has(axisName)) {
    state.activeAxes.delete(axisName);
  } else {
    state.activeAxes.add(axisName);
  }
  renderAxes();
}
```

**Test IDs**: 
- Buttons: `TID-TLT-Z-YEAR`, `TID-TLT-Z-QUARTER`, `TID-TLT-Z-MONTH`, `TID-TLT-Z-WEEK`, `TID-TLT-Z-DAY`
- Axes: `TID-TLT-AXIS-YEARS`, `TID-TLT-AXIS-QUARTERS`, `TID-TLT-AXIS-MONTHS`, `TID-TLT-AXIS-WEEKS`, `TID-TLT-AXIS-DAYS`

**Acceptance Criteria**:
- ✅ Each button independently toggles its axis
- ✅ Multiple axes can be active simultaneously
- ✅ Selected buttons have visual indication (highlighted/pressed state)
- ✅ Deselecting all axes shows timeline bars without date axes

---

#### 2.1.2 Even Date Distribution
**Requirement**: Dates should be evenly distributed and fully visible across the page viewport.

**Behavior**:
- Calculate total timeline span (project start to end + buffer)
- Distribute date ticks evenly based on viewport width
- Ensure all date labels are readable (no overlap)
- Auto-adjust spacing when window resizes

**Algorithm**:
```javascript
function distributeEvenly(startDate, endDate, viewportWidth) {
  const totalDays = daysBetween(startDate, endDate);
  const pixelsPerDay = viewportWidth / totalDays;
  
  // Adaptive tick spacing based on zoom level
  const minTickSpacing = 60; // px
  const tickInterval = Math.ceil(minTickSpacing / pixelsPerDay);
  
  return { pixelsPerDay, tickInterval };
}
```

**Acceptance Criteria**:
- ✅ No overlapping date labels
- ✅ Dates span entire visible width
- ✅ Responsive to window resize
- ✅ Minimum readable spacing maintained

---

### 2.2 Zoom and Fit Controls

#### 2.2.1 Zoom-to-Fit Functionality
**Requirement**: Entire timeline display should be zoomable to fit all dates on-page for export/snapshot purposes.

**New Controls**:
- **Fit to Width** button: Scale timeline to fit viewport width exactly
- **Zoom In** button: Increase scale (show more detail, less span)
- **Zoom Out** button: Decrease scale (show less detail, more span)
- **Reset** button: Return to default scale (100%)

**UI Location**: Timeline toolbar, next to date axis buttons

**Implementation**:
```javascript
state.zoomLevel = 1.0; // default 100%

function fitToWidth() {
  const projectSpan = daysBetween(projectStart, projectEnd);
  const viewportWidth = scrollContainer.clientWidth;
  state.zoomLevel = viewportWidth / (projectSpan * basePixelsPerDay);
  render();
}

function zoomIn() { 
  state.zoomLevel *= 1.2; 
  render(); 
}

function zoomOut() { 
  state.zoomLevel *= 0.8; 
  render(); 
}
```

**Test IDs**:
- `TID-TLT-ZOOM-FIT`: Fit to width button
- `TID-TLT-ZOOM-IN`: Zoom in button
- `TID-TLT-ZOOM-OUT`: Zoom out button
- `TID-TLT-ZOOM-RESET`: Reset zoom button
- `TID-TLT-ZOOM-LEVEL`: Display current zoom % (e.g., "100%")

**Acceptance Criteria**:
- ✅ Fit to width shows entire project span in viewport
- ✅ Zoom in/out changes scale smoothly
- ✅ Zoom level displays current percentage
- ✅ Export captures visible timeline at current zoom
- ✅ Reset returns to default scale

---

### 2.3 Advanced Filtering System

#### 2.3.1 Searchable Filter Dropdowns
**Requirement**: Timeline page should have searchable/selectable dropdown filters for Projects, Milestones, Deliverables, and Tasks.

**Current State**: Simple checkboxes (Show project/milestones/deliverables/tasks)

**Enhanced State**: Multi-select dropdowns with search

**UI Design**:
```
┌─────────────────────────────────────────────────────┐
│ Filters:                                            │
│ [🔍 Projects ▼]  [🔍 Milestones ▼]  [🔍 Deliverables ▼]  [🔍 Tasks ▼] │
│                                                     │
│ Projects: "Alpha", "Beta" (2 selected)             │
│ Milestones: All (✓)                                │
│ Deliverables: "D1.1", "D1.2" (2 of 10 selected)    │
│ Tasks: Showing 25 of 150                           │
└─────────────────────────────────────────────────────┘
```

**Dropdown Features**:
- **Search box**: Type to filter list
- **Select All / Deselect All**: Quick toggles
- **Checkboxes**: Multi-select capability
- **Selected count**: Show "3 of 10 selected"
- **Apply button**: Apply filters (optional, can be instant)

**Test IDs**:
- `TID-TLT-FILTER-PROJECTS`: Projects filter dropdown
- `TID-TLT-FILTER-MILESTONES`: Milestones filter dropdown
- `TID-TLT-FILTER-DELIVERABLES`: Deliverables filter dropdown
- `TID-TLT-FILTER-TASKS`: Tasks filter dropdown
- `TID-TLT-FILTER-SEARCH`: Search input within dropdown
- `TID-TLT-FILTER-SELECT-ALL`: Select all checkbox
- `TID-TLT-FILTER-APPLY`: Apply filters button

**Data Population**:
```javascript
// Load all available items from project state
function populateFilters() {
  const projects = projectsLoad(); // All projects
  const milestones = projects.flatMap(p => p.milestones || []);
  const deliverables = milestones.flatMap(m => m.deliverables || []);
  const tasks = deliverables.flatMap(d => d.tasks || []);
  
  // Populate each dropdown with names/titles
  populateDropdown('TID-TLT-FILTER-PROJECTS', projects);
  populateDropdown('TID-TLT-FILTER-MILESTONES', milestones);
  populateDropdown('TID-TLT-FILTER-DELIVERABLES', deliverables);
  populateDropdown('TID-TLT-FILTER-TASKS', tasks);
}
```

**Acceptance Criteria**:
- ✅ All 4 filter dropdowns present
- ✅ Search filters list items instantly
- ✅ Multi-select allows multiple items
- ✅ Selected items highlighted
- ✅ Timeline updates to show only selected items
- ✅ "Select All" works correctly
- ✅ Dropdown shows count (e.g., "3 of 10 selected")

---

### 2.4 Proportional Date Column Sizing

#### 2.4.1 Linked Resize Behavior
**Requirement**: When resizing any date column (Year/Quarter/Month/Week/Day), all others should resize proportionally.

**Current State**: Resize handles exist but resize columns independently

**Enhanced Behavior**:
- Dragging Year column wider → All date columns scale proportionally
- Dragging Day column narrower → All date columns scale proportionally
- Maintain aspect ratio across all date axes
- Update `pixelsPerDay` globally when any axis is resized

**Implementation**:
```javascript
state.dateColumnScale = 1.0; // Global scale factor for all date columns

function onDateColumnResize(axis, delta) {
  // Calculate scale change based on delta
  const scaleFactor = 1 + (delta / currentWidth);
  
  // Apply to global scale
  state.dateColumnScale *= scaleFactor;
  
  // Update all axis widths proportionally
  state.pixelsPerDay *= scaleFactor;
  
  // Re-render all axes and bars
  render();
}
```

**Visual Feedback**:
- Show tooltip during resize: "Scaling all date columns: 120%"
- Cursor changes to resize cursor over any date axis
- All axes resize simultaneously (live preview)

**Test IDs**:
- `TID-TLT-DATE-RESIZE-HANDLE`: Generic resize handle for date columns
- `TID-TLT-SCALE-INDICATOR`: Display showing current scale (e.g., "100%")

**Acceptance Criteria**:
- ✅ Resizing any date axis affects all others proportionally
- ✅ Year/Quarter/Month/Week/Day maintain relative proportions
- ✅ Timeline bars scale accordingly
- ✅ Scale indicator shows current percentage
- ✅ Smooth resize with live preview

---

### 2.5 Collapse/Expand Functionality

#### 2.5.1 Row Collapse/Expand
**Requirement**: Excel-like collapse/expand for rows without affecting underlying sizes or functionality.

**Behavior**:
- **Collapse**: Hide child rows (e.g., collapse project hides all milestones/deliverables/tasks)
- **Expand**: Show child rows
- **Visual Indicator**: Arrow icon (▶ collapsed, ▼ expanded)
- **Keyboard**: Space or Enter to toggle when focused
- **Persistence**: Remember collapsed state in session

**Hierarchy**:
- Collapse **Project** → Hide all milestones, deliverables, tasks under it
- Collapse **Milestone** → Hide all deliverables, tasks under it
- Collapse **Deliverable** → Hide all tasks under it

**UI**:
```
▼ Project Alpha           [━━━━━━━━━━━━━━]
  ▼ Milestone 1           [━━━━━]
    ▶ Deliverable 1.1     [━━]
    ▼ Deliverable 1.2     [━━━]
      Task 1.2.1          [━]
      Task 1.2.2          [━]
```

**Test IDs**:
- `TID-TLT-ROW-COLLAPSE-BTN-{index}`: Collapse/expand button for row
- `TID-TLT-ROW-{kind}-{index}`: Row element (kind = proj|ms|dl|task)
- `TID-TLT-ROW-COLLAPSED-{index}`: Attribute when collapsed

**Implementation**:
```javascript
state.collapsedRows = new Set(); // Track collapsed row IDs

function toggleRowCollapse(rowId, rowKind) {
  if (state.collapsedRows.has(rowId)) {
    state.collapsedRows.delete(rowId);
  } else {
    state.collapsedRows.add(rowId);
  }
  render();
}

function isRowVisible(row) {
  // Check if any parent is collapsed
  if (row.parentId && state.collapsedRows.has(row.parentId)) {
    return false;
  }
  return true;
}
```

**Acceptance Criteria**:
- ✅ Collapse/expand buttons visible on rows with children
- ✅ Clicking button toggles visibility of child rows
- ✅ Visual indicator (arrow) shows collapsed/expanded state
- ✅ Collapsed rows persist during session
- ✅ No affect on timeline bar positions or dates
- ✅ Timeline bars remain accurate when rows collapsed

---

#### 2.5.2 Column Collapse/Expand
**Requirement**: Collapse/expand date axis rows based on active date type selections.

**Behavior**:
- Selecting only "Year" → Collapse Quarters, Months, Weeks, Days
- Selecting "Year + Month" → Show Years and Months, collapse others
- Visual height adjustment (collapsed axes take less space)

**Current Implementation**: Already partially implemented via axis visibility toggles

**Enhancement**: Add collapse animation and visual indicator

**Acceptance Criteria**:
- ✅ Deselected axes collapse smoothly
- ✅ Timeline grid height adjusts accordingly
- ✅ No disruption to timeline bars

---

### 2.6 Extended Timeline and Dragging

#### 2.6.1 10+ Year Extension
**Requirement**: Timeline must extend at least 10 years off-page with smooth dragging beyond viewport boundaries.

**Current State**: Timeline extends based on project dates

**Enhanced Requirement**:
- **Minimum Span**: Always render 10 years minimum, even for short projects
- **Buffer**: Add 2 years before project start, 8 years after project end
- **Infinite Scroll**: Allow dragging bars infinitely (or up to reasonable limit like 50 years)

**Implementation**:
```javascript
function computeTimelineSpan() {
  const projectStart = parseDate(window.projectState?.start || today());
  const projectEnd = parseDate(window.projectState?.end || addYears(today(), 1));
  
  // Ensure minimum 10 year span
  const minSpan = 10 * 365; // days
  const actualSpan = daysBetween(projectStart, projectEnd);
  
  if (actualSpan < minSpan) {
    // Extend end date to meet minimum
    projectEnd = addDays(projectStart, minSpan);
  }
  
  // Add buffer
  const timelineStart = addYears(projectStart, -2);
  const timelineEnd = addYears(projectEnd, 8);
  
  return { timelineStart, timelineEnd };
}
```

**Auto-Scroll Behavior** (Already Implemented):
- Dragging near right edge → Auto-scroll right
- Dragging near left edge → Auto-scroll left
- Speed proportional to distance from edge

**Acceptance Criteria**:
- ✅ Timeline canvas always at least 10 years wide
- ✅ Can drag timeline bars beyond initial viewport
- ✅ Auto-scroll activates near edges
- ✅ No blocking or edge limits during drag
- ✅ Smooth scrolling experience

---

#### 2.6.2 Timeline Start Date Control
**Requirement**: Timeline start date determined by date picker at top.

**Current State**: Date picker exists (`TID-TLT-VIEW-START`)

**Enhanced Behavior**:
- Changing date picker → Timeline view scrolls to that date
- Date picker shows current visible start date
- Updates as user scrolls timeline

**Implementation**:
```javascript
function onTimelineStartDateChange(newDate) {
  state.viewStart = parseDate(newDate);
  
  // Scroll timeline to make newDate visible at left edge
  const scrollPos = dateToX(state.viewStart);
  scrollContainer.scrollLeft = scrollPos;
  
  render();
}

// Sync date picker with scroll position
function onTimelineScroll() {
  const scrollLeft = scrollContainer.scrollLeft;
  const visibleStartDate = xToDate(scrollLeft);
  
  // Update date picker (debounced)
  datePickerInput.value = formatDate(visibleStartDate);
}
```

**Test IDs**:
- `TID-TLT-VIEW-START`: Date picker input
- `TID-TLT-VIEW-SYNC`: Indicator showing sync status

**Acceptance Criteria**:
- ✅ Date picker controls timeline view start
- ✅ Changing date scrolls timeline to that position
- ✅ Date picker updates when scrolling timeline
- ✅ Smooth transition when date changes

---

### 2.7 Project Progress Overlay (CRITICAL)

#### 2.7.1 Visual Progress Indication
**Requirement**: MUST preserve project progress column with lighter overlay on timeline bars proportionate to completion.

**Current State**: Implemented and functional

**Behavior**:
- **Progress Column**: Shows percentage (e.g., "45%")
- **Timeline Overlay**: Lighter shade covers completed portion of bar
- **Proportional**: 50% progress = 50% of bar covered
- **Visual Clarity**: Overlay color should be distinct but harmonious

**Example**:
```
Progress: 60%
Timeline bar: [████████████░░░░░░░░]
              ↑ 60% covered ↑ 40% remaining
```

**Color Scheme**:
- Base bar: Solid color (blue for projects, green for milestones, etc.)
- Progress overlay: Semi-transparent lighter shade (rgba with 0.4 alpha)

**Test IDs**:
- `TID-TLT-PROGRESS`: Progress column container
- `TID-TLT-PROGRESS-ROW-{index}`: Progress value for each row
- Bar overlay: `.overlay` class within bar element

**Acceptance Criteria**:
- ✅ Progress column always visible (not collapsible)
- ✅ Progress percentage displays for all rows
- ✅ Timeline bars show proportional overlay
- ✅ Overlay updates when progress changes
- ✅ Visual distinction between complete/incomplete portions

---

## 3. Implementation Priority

### Phase 1: Critical (Current Sprint) ✅
- [x] Basic date axis toggle
- [x] Simple filters (checkboxes)
- [x] Progress overlay preservation
- [x] Extended timeline support
- [x] Timeline start date control

### Phase 2: High Priority (Next Sprint)
- [ ] Proportional date column sizing
- [ ] Advanced filter dropdowns (searchable/multi-select)
- [ ] Row collapse/expand functionality
- [ ] Zoom-to-fit controls

### Phase 3: Medium Priority (Future)
- [ ] Export/snapshot functionality
- [ ] Keyboard shortcuts for zoom/collapse
- [ ] Timeline templates
- [ ] Print-friendly view

---

## 4. QA Requirements

### 4.1 New Test Cases

**TC-TL-010: Date Axis Toggle**
- Click each zoom button independently
- Verify only selected axes appear
- Verify button visual state (selected/unselected)

**TC-TL-011: Even Date Distribution**
- Create project spanning 5 years
- Verify dates span entire viewport width
- Resize window, verify dates redistribute

**TC-TL-012: Zoom-to-Fit**
- Create project with dates extending off-page
- Click "Fit to Width"
- Verify entire project visible

**TC-TL-013: Proportional Resize**
- Drag Year axis resize handle
- Verify all date axes scale proportionally
- Verify timeline bars scale accordingly

**TC-TL-014: Advanced Filters**
- Select multiple projects from dropdown
- Verify only selected items display
- Search in dropdown, verify filtering

**TC-TL-015: Row Collapse**
- Expand project with milestones
- Collapse project row
- Verify milestones hidden
- Expand project, verify milestones reappear

**TC-TL-016: Extended Timeline**
- Create short 1-month project
- Verify timeline extends at least 10 years
- Drag timeline bar far right (beyond 5 years)
- Verify no blocking, smooth scroll

**TC-TL-017: Progress Overlay**
- Create task with 75% progress
- Verify progress column shows "75%"
- Verify timeline bar 75% covered with overlay
- Change progress to 25%
- Verify bar updates proportionally

---

## 5. Acceptance Criteria Summary

### Must Have (Blocking) ✅
- ✅ Date axes toggle independently
- ✅ Progress overlay preserved and functional
- ✅ Timeline extends 10+ years
- ✅ Timeline start date picker controls view
- ✅ Filters allow showing/hiding timeline elements

### Should Have (High Priority)
- [ ] Proportional date column sizing
- [ ] Searchable filter dropdowns
- [ ] Row collapse/expand
- [ ] Zoom-to-fit functionality
- [ ] Even date distribution

### Nice to Have (Future)
- [ ] Export/snapshot
- [ ] Keyboard navigation
- [ ] Timeline templates
- [ ] Undo/redo

---

## 6. Rollout Plan

### Immediate (This PR)
- Document requirements in architecture
- Update QA requirements with new test cases
- Validate current implementation against requirements
- Identify gaps

### Next Sprint
- Implement proportional sizing
- Implement advanced filter dropdowns
- Implement row collapse/expand
- Add zoom-to-fit controls

### Future Sprints
- Add export functionality
- Add keyboard shortcuts
- Performance optimization for large timelines

---

## 7. Related Documents

- **ARC-TIMELINES-003**: Timeline Consolidation (current implementation)
- **ARC-TIMELINES-002**: Matrix-Based Timeline Design (original spec)
- **QA Requirements**: `qa/requirements.json` (timelinesCompliance section)

---

**Status**: Requirements Captured ✅  
**Next Step**: Prioritize and implement Phase 2 enhancements  
**Owner**: Development Team  
**Reviewers**: Product Owner, QA Lead, Architect
