---
id: ARC-TIMELINES-002
title: Timelines - Matrix-Based Timeline Creator with Interactive Sliders
status: Draft v2.0
scope: Complete timeline redesign with matrix layout, adjustable slider bars, multi-zoom display, and comprehensive project visualization
date: 2025-11-11
supersedes: ARC-TIMELINES-001
---

## 1. Context & Goals

### Purpose
Provide a visual, intuitive timeline creation and management system that:
- Uses a matrix layout (project names on vertical axis, calendar dates on horizontal axis)
- Supports timeline creation via adjustable slider bars (no manual date entry)
- Displays multiple time denominators simultaneously (Years, Quarters, Months, Weeks, Days)
- Enables zoom in/out to see different levels of detail
- Shows entire project duration across all hierarchy levels
- Allows filtering by project, team member, and item type

### Success Metrics
- Users can create complete project timelines without typing dates
- Timeline visualization shows clear start/end dates as slider bars are dragged
- Dates visible on slider bars during drag operations
- Zoom controls allow switching between year/quarter/month/week/day views
- Full project span visible with horizontal scroll
- Timeline sliders for milestones fit within parent project bounds (overlap allowed where appropriate)

### Stakeholders
- Project Leaders: Set project and milestone timelines
- Milestone Leads: Adjust milestone timing within project bounds
- Deliverable Leads: View deliverable timelines (auto-computed from tasks)
- Team Members: View task timelines
- Admins: Oversee all project timelines

## 2. Information Architecture

### 2.1 Navigation
- **Primary Route**: `#/timelines` (renamed from "Timelines (Test)")
- **Entry Points**:
  - Sidebar: "Timelines" navigation item (TID-NAV-TIMELINES)
  - Project modal: "Set timeline" button (TID-PSETUP-OPEN-TIMELINE)
  - Milestone modal: "Edit in Timelines" button (TID-MS-OPEN-TIMELINE)
  - Projects page: Direct link to timeline view

### 2.2 Mode Context

Timeline page operates in different contexts based on entry point:

**Project Creation Mode**:
- Triggered from "Start a new project" → "Set timeline"
- Shows: Empty timeline canvas
- User: Types project name (if not already typed in modal)
- User: Drags slider bar to set project duration
- Returns to: Project modal with dates populated

**Milestone Editing Mode**:
- Triggered from "+ Milestone" → "Edit in Timelines"
- Shows: Full project timeline with all existing milestones
- User: Can add/edit milestone slider bars
- All milestones must fit within project start/end
- Milestones can overlap
- Returns to: Projects page (or milestone modal if appropriate)

**General Timeline View Mode**:
- Triggered from sidebar "Timelines" navigation
- Shows: All projects with filtering capability
- User: Can view and navigate timelines
- User: Can filter by company, project, team member
- Read-only unless user has edit permissions

## 3. Page & Layout Blueprints

### 3.1 Timeline Matrix Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Toolbar]                                                       │
│  Year | Quarter | Month | Week | Day    [Date Picker]          │
├─────────────────┬───────────────────────────────────────────────┤
│                 │  Horizontal Calendar Axis                     │
│                 │  ┌───────┬───────┬───────┬───────┬──────┐    │
│                 │  │ 2025  │ Q1    │ Jan   │ W1-W4 │ 1-31 │    │
│                 │  │ 2026  │ Q2    │ Feb   │ W5-W8 │ ...  │    │
│                 │  │ ...   │ ...   │ ...   │ ...   │ ...  │    │
│ Project         │  └───────┴───────┴───────┴───────┴──────┘    │
│ Descriptors     │                                               │
│                 │  ┌──────────────────────────────────────┐    │
│ Project 1       │  │  [═══════ Project Bar ══════════]    │←─┐ │
│                 │  │     Start: 2025-01-15  End: 2025-12-31│  │ │
│                 │  └──────────────────────────────────────┘    │ │
│   Milestone 1   │    │  [═══ MS Bar ═══]                   │←─│─Draggable
│                 │    │     Start    End                     │  │ │
│   Milestone 2   │    │          [═══ MS Bar ═══]           │←─┘ │
│                 │    │             Start    End             │    │
│                 │    └──────────────────────────────────────┘    │
│                 │  [Scroll Bar ═══════════════════════════]     │
└─────────────────┴───────────────────────────────────────────────┘
```

### 3.2 Layout Zones

**Zone 1: Toolbar (Top)**
- Zoom controls (Year/Quarter/Month/Week/Day buttons)
- Date picker for setting timeline start date
- Project selector dropdown
- "Create project" button
- "Apply" button (saves changes and returns to previous page)
- "Back to projects" button

**Zone 2: Calendar Axis (Horizontal, Top of Timeline)**
- Three rows showing: Months | Weeks | Days (based on zoom level)
- Years, quarters displayed when zoomed out
- Clear visible separation between denominators
- Dates readable and not cramped
- Expands/collapses based on zoom selection

**Zone 3: Project Descriptors (Vertical, Left Side)**
- Fixed-width column (doesn't scroll horizontally)
- Lists project names and milestone names
- Indented hierarchy (milestones indented under projects)
- Resizable column width

**Zone 4: Timeline Canvas (Main Area)**
- Scrollable both horizontally and vertically
- Displays slider bars for projects and milestones
- Grid lines aligned with calendar axis
- Slider bars show start and end dates when being dragged
- Bars color-coded by level (Project: #0D2850, Milestone: #006B92)

**Zone 5: Filter Panel (Top Right or Collapsible Side)**
- Filter by: Project, Company, Department, Person, Date range
- Show/Hide: Projects, Milestones, Deliverables, Tasks
- Timeline filtering displays only matching items

## 4. UI Components

### 4.1 Zoom Controls

**Buttons** (Exclusive selection, only one active at a time):
- Year (TID-TL-Z-YEAR)
- Quarter (TID-TL-Z-QUARTER)
- Month (TID-TL-Z-MONTH)
- Week (TID-TL-Z-WEEK)
- Day (TID-TL-Z-DAY)

**Behavior**:
- Clicking a zoom level changes the calendar axis display
- Selected button highlighted with active state
- Timeline canvas re-renders to show appropriate detail level
- Scroll position maintained relative to current view focus

**Zoom Display Rules**:

1. **Year View**:
   - Display: Years row only
   - Each year shown as a segment
   - Suitable for 5+ year projects
   - Roughest granularity

2. **Quarter View**:
   - Display: Years + Quarters rows
   - Q1, Q2, Q3, Q4 shown under each year
   - Good for multi-year projects

3. **Month View** (Default):
   - Display: Years + Quarters + Months rows
   - Jan, Feb, Mar, etc. shown
   - Suitable for projects up to 2 years

4. **Week View**:
   - Display: Years + Quarters + Months + Weeks rows
   - W1, W2, W3, W4 shown under each month
   - Monday-aligned weeks
   - Good for projects up to 6 months

5. **Day View**:
   - Display: All 5 rows (Years + Quarters + Months + Weeks + Days)
   - Individual days (1-31) shown
   - Most detailed view
   - Suitable for projects up to 3 months

### 4.2 Timeline Start Date Picker

**Control**: Date input (TID-TL-VIEW-START)

**Purpose**: Set the starting point for the visible timeline window

**Behavior**:
- User selects a date from date picker
- Timeline automatically scrolls to show selected date at left edge
- Useful for jumping to specific project phases
- Date defaults to earliest project start date (or today if no projects)

### 4.3 Slider Bars

**Visual Appearance**:
- Rectangular bars spanning from start date to end date
- Color-coded by hierarchy level:
  - Project: #0D2850 (dark blue)
  - Milestone: #006B92 (medium blue)
  - Deliverable: #4C95B0 (light blue) [display only, not editable on timeline]
  - Task: Default [display only, not editable on timeline]
- Start date label on left edge of bar
- End date label on right edge of bar
- Drag handles on left (start) and right (end) edges
- Body of bar (middle) allows dragging entire bar (moves both dates together)

**Interactive Behaviors**:

1. **Create New Bar (Project Creation Mode)**:
   - Click anywhere on timeline canvas
   - Creates bar starting at clicked date
   - Default duration: 1 month
   - Bar immediately draggable

2. **Drag Start Handle** (Left edge):
   - Changes start date only
   - End date remains fixed
   - Bar width adjusts
   - Min width: 1 day
   - Cannot drag past end date
   - Date label updates in real-time during drag

3. **Drag End Handle** (Right edge):
   - Changes end date only
   - Start date remains fixed
   - Bar width adjusts
   - Min width: 1 day
   - Cannot drag before start date
   - Date label updates in real-time during drag

4. **Drag Bar Body** (Middle):
   - Moves both start and end dates
   - Duration (width) remains constant
   - Useful for shifting timeline without changing duration
   - Constrained by parent bounds (milestones can't go outside project)
   - Dates update in real-time during drag

5. **Snapping Behavior**:
   - Based on current zoom level:
     - Year: Snaps to January 1
     - Quarter: Snaps to quarter start (Jan 1, Apr 1, Jul 1, Oct 1)
     - Month: Snaps to month start (day 1)
     - Week: Snaps to Monday
     - Day: Exact day (no snapping)
   - Snapping occurs on mouseup (during drag shows smooth movement)

6. **Auto-scroll During Drag**:
   - When dragging near left/right edges of visible timeline
   - Canvas auto-scrolls to reveal more timeline
   - Scroll speed proportional to distance from edge
   - Edge threshold: 32px

7. **Visual Feedback During Drag**:
   - Bar slightly elevated (higher z-index)
   - Subtle shadow or glow
   - Date labels bold and larger
   - Cursor changes to grab/grabbing
   - Ghost outline shows original position

**Constraints**:

- **Project bars**: No constraints (can be any dates)
- **Milestone bars**: Must start >= project start and end <= project end
  - If dragged outside bounds, snaps to boundary
  - Visual indicator (red highlight) when approaching boundary
  - Can overlap with other milestones (intentional for parallel work)

### 4.4 Settings Integration

**Purpose**: Control display density and visible range

**Location**: Accessible via Settings page (#/settings)

**Settings Available**:
1. **Years visible** (TID-SET-YEARS): 1-20, default 5
2. **Quarters visible** (TID-SET-QUARTERS): 1-40, default 8
3. **Months visible** (TID-SET-MONTHS): 1-60, default 12
4. **Weeks visible** (TID-SET-WEEKS): 1-104, default 24
5. **Days visible** (TID-SET-DAYS): 1-62, default 31

**Behavior**:
- Settings stored in localStorage (key: `pm_tl_settings`)
- When user changes zoom level, timeline renders using these counts
- "Visible" means number of that denominator shown in viewport width
- Canvas extends beyond viewport to show full project span
- Horizontal scroll reveals additional timeline

**Example**:
- User sets "Months visible" to 24
- Switches to Month zoom
- Timeline renders 24 months fitted to current viewport width
- If project spans 36 months, user scrolls right to see months 25-36

### 4.5 Calendar Axis Display

**Purpose**: Provide clear date reference aligned with timeline canvas

**Structure**:
```
┌─────────────────────────────────────────────────────┐
│ 2025    │ 2026    │ 2027    │                       │ ← Years
├─────┬───┼─────┬───┼─────┬───┼───────────            │
│ Q1  │Q2 │ Q1  │Q2 │ Q1  │Q2 │                       │ ← Quarters
├─┬─┬─┼─┬─┼─┬─┬─┼─┬─┼─┬─┬─┼───┼───────────            │
│J│F│M│A│M│J│J│A│S│O│N│D│J│F│M│                       │ ← Months (abbreviated)
├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼                       │
│1│2│3│4│···                                          │ ← Weeks (W1, W2, W3...)
├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼                       │
││││││││││││││││││                                    │ ← Days (1-31)
└┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴─────────────────────┘
```

**Row Visibility Based on Zoom**:
- Year zoom: Years only
- Quarter zoom: Years + Quarters
- Month zoom: Years + Quarters + Months
- Week zoom: Years + Quarters + Months + Weeks
- Day zoom: All 5 rows

**Formatting**:
- Years: Full year (2025, 2026)
- Quarters: Q1, Q2, Q3, Q4 with year context
- Months: 3-letter abbreviation (Jan, Feb, Mar) or number (1, 2, 3) if cramped
- Weeks: W1, W2, W3, etc. (Monday-based, ISO 8601)
- Days: Day number (1-31)

**Alignment**:
- Calendar axis aligned with timeline canvas below
- Scroll synchronization: Axis scrolls horizontally with canvas
- Fixed height: Doesn't scroll vertically
- Grid lines drop down from axis markers to canvas

**Readability Requirements**:
- Minimum font size: 10px
- Label spacing: At least 4px between labels
- If labels would overlap: Alternate row display or hide less important denominators
- Never cramped or unreadable (user feedback requirement)

## 5. Data & Wiring

### 5.1 State Management

```javascript
window.tlState = {
  zoom: 'month',              // 'year' | 'quarter' | 'month' | 'week' | 'day'
  origin: Date,               // Start of visible timeline (month-aligned)
  viewStart: Date,            // User-selected view start (via date picker)
  viewEnd: Date,              // Calculated based on viewStart + visible count
  pxPerDay: Number,           // Pixels per day (calculated)
  viewDays: Number,           // Number of days in visible window
  autoZoom: Boolean,          // Enable velocity-based zoom adjust (default: false)
};

window.projectState = {
  id: String,
  name: String,
  start: String,              // ISO date string
  end: String,                // ISO date string
  milestones: [
    {
      id: String,
      title: String,
      start: String,
      end: String,
      deliverables: [...],    // Not editable on timeline
    }
  ],
  isDraft: Boolean            // True if created but not saved
};

window.tlSettings = {
  yearsVisible: 5,
  quartersVisible: 8,
  monthsVisible: 12,
  weeksVisible: 24,
  daysVisible: 31
};
```

### 5.2 Timeline Rendering Flow

**Initialization** (`tlInitFromStore()`):
1. Load projects from localStorage
2. Populate project selector dropdown
3. Load timeline settings from localStorage
4. Set origin to project start month (or today if no project)
5. Bind view start date picker
6. Call `tlRender()`

**View Computation** (`tlComputeView()`):
1. Get container width (`.tl-scroll.clientWidth`)
2. Calculate visible days based on:
   - Selected zoom level
   - Settings count for that denominator
3. Calculate `pxPerDay = containerWidth / visibleDays`
4. Store in `tlState.pxPerDay`
5. Calculate `viewEnd = viewStart + visibleDays`

**Rendering** (`tlRender()`):
1. Clear existing lanes and bars
2. Build hierarchy rows (projects, milestones)
3. Create labels column (left side, fixed)
4. Create lanes (timeline rows)
5. Add bars for each item with dates
6. Render calendar axis ticks
7. Update axis visibility based on zoom
8. Set canvas width to full project span
9. Scroll to viewStart position

**Date Conversion Functions**:
```javascript
// Convert local date string to x-coordinate on canvas
tlDateToX(dateString) {
  const date = parseLocalDate(dateString);
  const origin = new Date(tlState.origin.getFullYear(), tlState.origin.getMonth(), 1);
  const daysSinceOrigin = (date - origin) / (1000 * 60 * 60 * 24);
  return Math.round(daysSinceOrigin * tlState.pxPerDay);
}

// Convert x-coordinate to local date
tlXToDate(x) {
  const origin = new Date(tlState.origin.getFullYear(), tlState.origin.getMonth(), 1);
  const days = Math.round(x / tlState.pxPerDay);
  const date = new Date(origin);
  date.setDate(date.getDate() + days);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Parse local date string (YYYY-MM-DD) to Date object
parseLocalDate(dateString) {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Format Date object to local date string
formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

### 5.3 Drag Interaction Logic

```javascript
// Bar drag handling
function tlAddBar(kind, tid, start, end, laneIndex, msIndex, dlIndex, taskIndex) {
  const bar = createElement('div', 'tl-bar ' + kind);
  bar.setAttribute('data-testid', tid);
  
  // Position bar
  const xStart = tlDateToX(start);
  const xEnd = tlDateToX(end);
  bar.style.left = xStart + 'px';
  bar.style.width = Math.max(12, xEnd - xStart) + 'px';
  
  // Add date labels
  const lblStart = createElement('div', 'tl-label');
  lblStart.textContent = start;
  const lblEnd = createElement('div', 'tl-label');
  lblEnd.textContent = end;
  bar.appendChild(lblStart);
  bar.appendChild(lblEnd);
  
  // Add handles
  const handleStart = createElement('div', 'tl-handle start');
  const handleEnd = createElement('div', 'tl-handle end');
  bar.appendChild(handleStart);
  bar.appendChild(handleEnd);
  
  // Drag state
  let dragging = null;  // 'start' | 'end' | 'body'
  let startX = 0;
  let initialStart = parseLocalDate(start);
  let initialEnd = parseLocalDate(end);
  
  // Mouse down on handles
  handleStart.onmousedown = (e) => {
    dragging = 'start';
    startX = e.clientX;
    initialStart = parseLocalDate(start);
    e.preventDefault();
    e.stopPropagation();
  };
  
  handleEnd.onmousedown = (e) => {
    dragging = 'end';
    startX = e.clientX;
    initialEnd = parseLocalDate(end);
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Mouse down on bar body
  bar.onmousedown = (e) => {
    if (e.target === bar) {
      dragging = 'body';
      startX = e.clientX;
      initialStart = parseLocalDate(start);
      initialEnd = parseLocalDate(end);
      e.preventDefault();
    }
  };
  
  // Global mouse move
  document.onmousemove = (e) => {
    if (!dragging) return;
    
    const dx = e.clientX - startX;
    const daysDelta = Math.round(dx / tlState.pxPerDay);
    
    if (daysDelta === 0) return;
    
    let newStart = new Date(initialStart);
    let newEnd = new Date(initialEnd);
    
    if (dragging === 'start') {
      newStart.setDate(newStart.getDate() + daysDelta);
      if (newStart >= initialEnd) newStart = new Date(initialEnd.getTime() - 86400000); // Min 1 day
    } else if (dragging === 'end') {
      newEnd.setDate(newEnd.getDate() + daysDelta);
      if (newEnd <= initialStart) newEnd = new Date(initialStart.getTime() + 86400000); // Min 1 day
    } else if (dragging === 'body') {
      newStart.setDate(newStart.getDate() + daysDelta);
      newEnd.setDate(newEnd.getDate() + daysDelta);
    }
    
    // Apply snapping based on zoom
    newStart = snapDate(newStart, tlState.zoom);
    newEnd = snapDate(newEnd, tlState.zoom);
    
    // Apply constraints for milestones
    if (kind === 'ms' && projectState) {
      const pStart = parseLocalDate(projectState.start);
      const pEnd = parseLocalDate(projectState.end);
      if (newStart < pStart) newStart = pStart;
      if (newEnd > pEnd) newEnd = pEnd;
    }
    
    // Update visuals
    start = formatLocalDate(newStart);
    end = formatLocalDate(newEnd);
    bar.style.left = tlDateToX(start) + 'px';
    bar.style.width = Math.max(12, tlDateToX(end) - tlDateToX(start)) + 'px';
    lblStart.textContent = start;
    lblEnd.textContent = end;
    
    // Update data model
    if (kind === 'proj') {
      projectState.start = start;
      projectState.end = end;
    } else if (kind === 'ms' && typeof msIndex === 'number') {
      projectState.milestones[msIndex].start = start;
      projectState.milestones[msIndex].end = end;
    }
    
    // Auto-scroll near edges
    autoScrollTimeline(e);
  };
  
  // Global mouse up
  document.onmouseup = () => {
    dragging = null;
  };
  
  // Add bar to canvas
  document.getElementById('tl-lanes').appendChild(bar);
}

// Snap date to zoom level
function snapDate(date, zoom) {
  if (zoom === 'year') {
    return new Date(date.getFullYear(), 0, 1);
  } else if (zoom === 'quarter') {
    const month = Math.floor(date.getMonth() / 3) * 3;
    return new Date(date.getFullYear(), month, 1);
  } else if (zoom === 'month') {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  } else if (zoom === 'week') {
    const day = date.getDay();
    const delta = (day + 6) % 7; // Days since Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() - delta);
    return monday;
  } else {
    return date; // Day zoom, no snapping
  }
}

// Auto-scroll timeline when dragging near edges
function autoScrollTimeline(event) {
  const scrollPane = document.querySelector('.tl-scroll');
  if (!scrollPane) return;
  
  const rect = scrollPane.getBoundingClientRect();
  const edgeThreshold = 32;
  
  if (event.clientX > rect.right - edgeThreshold) {
    const scrollSpeed = Math.ceil((event.clientX - (rect.right - edgeThreshold)) / 2);
    scrollPane.scrollLeft += scrollSpeed;
  } else if (event.clientX < rect.left + edgeThreshold) {
    const scrollSpeed = Math.ceil(((rect.left + edgeThreshold) - event.clientX) / 2);
    scrollPane.scrollLeft -= scrollSpeed;
  }
}
```

## 6. Permissions

**Viewing Timelines**:
- All users can view timelines for projects they're assigned to
- Viewers have read-only access

**Editing Timelines**:
- Project leads can edit project and milestone timelines
- Milestone leads can edit their milestone timelines (within project bounds)
- Deliverable/Task timelines are display-only (auto-computed from tasks)

**Timeline Access Matrix**:

| Role | View All | Edit Project Bar | Edit Milestone Bars | Create New Project via Timeline |
|------|----------|------------------|---------------------|--------------------------------|
| Admin | ✓ | ✓ (all) | ✓ (all) | ✓ |
| Project Lead | ✓ (assigned) | ✓ (own) | ✓ (own project) | ✓ |
| Milestone Lead | ✓ (assigned) | ✗ | ✓ (own) | ✗ |
| Deliverable Lead | ✓ (assigned) | ✗ | ✗ | ✗ |
| Task Assignee | ✓ (assigned) | ✗ | ✗ | ✗ |
| Viewer | ✓ (granted) | ✗ | ✗ | ✗ |

## 7. Notifications

**Timeline Changes**:
- Project timeline changed (start/end shifted)
- Milestone timeline changed
- Timeline conflict detected (milestone outside project bounds)
- Timeline completion milestone reached (project start date arrived)

**Notification Recipients**:
- Project lead (for project timeline changes)
- Milestone lead (for milestone timeline changes)
- All team members (for major timeline shifts)

## 8. Compliance & Security

**Data Storage**:
- Timeline state stored in localStorage (client-side only in MVP)
- Server persistence in future versions
- No PII in timeline data beyond user assignments

**Audit Events**:
- Timeline created
- Timeline edited (with before/after dates)
- Timeline deleted
- Timeline exported

## 9. Internationalization & Time

**Date Display**:
- Timeline uses local time (not UTC)
- Dates formatted per user locale (DD/MM/YYYY for en-ZA)
- Calendar axis shows local month names

**Timezone Handling**:
- All date calculations performed in local time
- No timezone conversion (all users assumed same timezone in MVP)
- Future: Timezone selector for multi-region teams

## 10. Telemetry & Audit

**Metrics to Track**:
- Timeline views per project
- Zoom level usage distribution
- Average drag duration (usability metric)
- Timeline edits per session
- Settings adjustments (years visible, etc.)
- Performance: Render time for timelines with many items

## 11. Acceptance Criteria

### 11.1 Visual Acceptance

**Layout**:
- [ ] Matrix layout visible: Project names on left, calendar on top, timeline canvas in main area
- [ ] Calendar axis shows correct denominators based on zoom:
  - Year: Years only
  - Quarter: Years + Quarters
  - Month: Years + Quarters + Months
  - Week: Years + Quarters + Months + Weeks
  - Day: All 5 rows
- [ ] Dates readable and not cramped at all zoom levels
- [ ] Full project span visible via horizontal scroll
- [ ] Slider bars color-coded: Project #0D2850, Milestone #006B92

**Slider Bars**:
- [ ] Start and end dates visible on bar edges
- [ ] Drag handles visible on left and right edges
- [ ] Dates update in real-time during drag
- [ ] Visual feedback (shadow/glow) when dragging
- [ ] Bars snap to appropriate boundaries on release

**Timeline Navigation**:
- [ ] "Timelines" sidebar item navigates to #/timelines (NOT #/tl-test)
- [ ] "Timelines (Test)" removed from sidebar
- [ ] Date picker sets view start correctly
- [ ] Zoom buttons switch between views correctly

### 11.2 Functional Acceptance

**Timeline Creation**:
- [ ] Click "Set timeline" in project modal navigates to timeline page
- [ ] Typed project name appears in timeline (or "Untitled Project")
- [ ] Click on canvas creates new project slider bar
- [ ] Default duration: 1 month from clicked date
- [ ] Bar immediately draggable after creation

**Slider Bar Interaction**:
- [ ] Drag left handle changes start date only
- [ ] Drag right handle changes end date only
- [ ] Drag bar body moves both dates (constant duration)
- [ ] Dates snap to zoom-appropriate boundaries
- [ ] Milestone bars constrained within project bounds
- [ ] Milestone bars can overlap (intentional)
- [ ] Auto-scroll when dragging near edges

**Date Integration**:
- [ ] "Apply" button saves dates and returns to modal/projects page
- [ ] Dates appear in project modal after timeline editing
- [ ] Dates appear in milestone rows on projects page
- [ ] Dates aggregate correctly for deliverables and tasks

**Settings Integration**:
- [ ] Settings page has year/quarter/month/week/day visibility controls
- [ ] Changing settings affects timeline display
- [ ] Settings persist in localStorage
- [ ] Timeline uses settings to calculate viewport fill

### 11.3 Test IDs Required

**Page**:
- TID-TL-PAGE (section container)
- TID-TL-TOOLBAR (toolbar container)

**Zoom Controls**:
- TID-TL-Z-YEAR, TID-TL-Z-QUARTER, TID-TL-Z-MONTH, TID-TL-Z-WEEK, TID-TL-Z-DAY

**Navigation**:
- TID-TL-VIEW-START (date picker)
- TID-TL-PROJECT-SELECT (project dropdown)
- TID-TL-CREATE-PROJECT (create button)
- TID-TL-APPLY (apply button)
- TID-TL-BACK (back button)

**Calendar Axis**:
- TID-TL-AXIS-YEARS
- TID-TL-AXIS-QUARTERS
- TID-TL-AXIS-MONTHS
- TID-TL-AXIS-WEEKS
- TID-TL-AXIS-DAYS

**Timeline Canvas**:
- TID-TL-CANVAS (main canvas container)
- #tl-lanes (lanes container ID)
- TID-TL-LANE-PROJ-{index}, TID-TL-LANE-MS-{index}
- TID-TL-BAR-PROJ-{index}, TID-TL-BAR-MS-{index}

**Filters**:
- TID-TL-FILTERS (container)
- TID-TL-FSHOW-PROJ, TID-TL-FSHOW-MS, TID-TL-FSHOW-DL, TID-TL-FSHOW-TASK
- TID-TL-FRESP (responsible person filter)

**Disallowed (Must Not Exist)**:
- TID-TL-ZOOM-IN
- TID-TL-ZOOM-OUT
- TID-TL-PAN-PREV
- TID-TL-PAN-NEXT

### 11.4 Performance Acceptance

- [ ] Timeline renders in < 2 seconds for projects with 100 milestones
- [ ] Drag interaction feels smooth (60 FPS)
- [ ] Zoom changes complete in < 500ms
- [ ] Horizontal scroll is smooth (no jank)
- [ ] Date labels update without flicker during drag

## 12. Open Questions & Risks

### 12.1 Open Questions

1. **Q**: Should milestones auto-distribute when created (even spacing)?
   **A**: No. User positions manually via drag. No auto-layout.

2. **Q**: Can users create milestones directly on timeline without modal?
   **A**: MVP: No. Use "+ Milestone" button, then edit in timeline. Future: Click-to-create.

3. **Q**: How to handle very long project names in left column?
   **A**: Truncate with ellipsis, show full name on hover tooltip.

4. **Q**: Should timeline show weekend days differently (grayed out)?
   **A**: Not in MVP. All days equal. Future: Configurable non-working days.

5. **Q**: Can milestones extend beyond project bounds with warning?
   **A**: No. Hard constraint. Milestone bars clamped to project bounds.

### 12.2 Risks

1. **Performance**: Many overlapping bars may cause slow rendering
   - **Mitigation**: Virtualize rows, limit visible bars, optimize render loop

2. **Usability**: Small screens may find timeline cramped
   - **Mitigation**: Responsive design, mobile-specific timeline view, pinch-to-zoom

3. **Data Loss**: Dragging without saving could lose changes
   - **Mitigation**: Auto-save draft state to localStorage, confirmation prompt on navigate away

4. **Confusion**: Users may not understand zoom vs settings
   - **Mitigation**: Tooltip help text, onboarding guide, clear labels

5. **Accessibility**: Drag interaction not keyboard-accessible
   - **Mitigation**: Provide keyboard shortcuts (arrow keys to adjust dates), alternative date picker UI

---

**Document Version**: 2.0
**Last Updated**: 2025-11-11
**Author**: One Time Build Agent
**Approval Required**: Main Admin (Johan)
