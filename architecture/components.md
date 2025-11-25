# Component Architecture

## PIT - Project Implementation Tracker Components

**Version:** 1.0.0  
**Last Updated:** 2025-11-25  
**Status:** Active

---

## 1. Component Overview

This document defines all UI components that must be wired and functional in the PIT application. Components listed here are the **source of truth** for what must exist in the codebase.

### Component Categories

| Category | Description |
|----------|-------------|
| Shell | Global layout components |
| Navigation | Routing and menu components |
| Forms | Input and data entry components |
| Modals | Dialog and overlay components |
| Tables | Data display and grid components |
| Charts | Visualization components |
| Feedback | User notification components |

---

## 2. Shell Components

### 2.1 Application Shell

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Shell Root | `TID-SHELL-ROOT` | Root container for entire app | REQUIRED |
| Top Bar | `TID-TOPBAR` | Application header | REQUIRED |
| Sidebar | `TID-SIDEBAR` | Main navigation panel | REQUIRED |
| Content Area | `TID-CONTENT-AREA` | Main content region | REQUIRED |
| Breadcrumbs | `TID-BREADCRUMBS` | Navigation breadcrumb | REQUIRED |

### 2.2 Top Bar Components

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Preview Toggle | `TID-PREVIEW-TOGGLE` | Desktop/Mobile preview switcher | REQUIRED |
| Preview Mobile | `TID-PREVIEW-MOBILE` | Mobile preview button | REQUIRED |
| Preview Desktop | `TID-PREVIEW-DESKTOP` | Desktop preview button | REQUIRED |
| Reset Session | `TID-RESET-SESSION-BTN` | Session reset button | REQUIRED |

---

## 3. Navigation Components

### 3.1 Sidebar Navigation

| Component | Route | Test ID | Status |
|-----------|-------|---------|--------|
| Dashboard | `#/` | `TID-NAV-DASHBOARD` | REQUIRED |
| Implementation | `#/projects` | `TID-NAV-PROJECTS` | REQUIRED |
| Reports | `#/reports` | `TID-NAV-REPORTS` | REQUIRED |
| Permissions | `#/permissions` | `TID-NAV-PERMISSIONS` | REQUIRED |
| Evidence | `#/evidence` | `TID-NAV-EVIDENCE` | REQUIRED |
| Gantt | `#/gantt` | `TID-NAV-GANTT` | REQUIRED |
| Timelines | `#/timelines` | `TID-NAV-TIMELINES` | REQUIRED |
| Audit | `#/audit` | `TID-NAV-AUDIT` | REQUIRED |
| Notifications | `#/notify` | `TID-NAV-NOTIFY` | REQUIRED |
| Import | `#/import` | `TID-NAV-IMPORT` | REQUIRED |
| Templates | `#/templates` | `TID-NAV-TEMPLATES` | REQUIRED |
| Quality Assurance | `#/qa` | `TID-NAV-QA` | REQUIRED |

### 3.2 Admin-Only Navigation

| Component | Route | Test ID | Status |
|-----------|-------|---------|--------|
| Invite Members | `#/invite-members` | `TID-NAV-INVITE-MEMBERS` | ADMIN |
| Settings | `#/settings` | `TID-NAV-SETTINGS` | ADMIN |
| Security Dashboard | `#/security-dashboard` | `TID-NAV-SECURITY-DASHBOARD` | ADMIN |
| Health Checker | `#/health-checker` | `TID-NAV-HEALTH-CHECKER` | ADMIN |

### 3.3 Removed Navigation (Legacy)

The following navigation items have been **removed per architecture**:
- Work Item (`#/workitem`) - REMOVED
- Search (`#/search`) - REMOVED
- Exports (`#/exports`) - REMOVED
- Settings (public) (`#/settings`) - MOVED TO ADMIN

---

## 4. Form Components

### 4.1 Input Controls

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Text Input | `TID-INPUT-TEXT` | Standard text input | REQUIRED |
| Date Picker | `TID-INPUT-DATE` | Date selection control | REQUIRED |
| Select Dropdown | `TID-INPUT-SELECT` | Dropdown selection | REQUIRED |
| Checkbox | `TID-INPUT-CHECKBOX` | Boolean toggle | REQUIRED |
| Radio Group | `TID-INPUT-RADIO` | Single selection group | REQUIRED |
| Search Input | `TID-INPUT-SEARCH` | Searchable input field | REQUIRED |

### 4.2 Filter Controls

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Filter Bar | `TID-FILTER-BAR` | Main filter container | REQUIRED |
| Status Filter | `TID-FILTER-STATUS` | Project status dropdown | REQUIRED |
| Start Date Filter | `TID-FILTER-START` | Start date picker | REQUIRED |
| End Date Filter | `TID-FILTER-END` | End date picker | REQUIRED |
| Duration Filter | `TID-FILTER-DURATION-BTN` | Duration filter button | REQUIRED |
| Responsible Filter | `TID-FILTER-RESP` | Responsible person filter | REQUIRED |
| Progress Filter | `TID-FILTER-PROGRESS-BTN` | Progress filter button | REQUIRED |

---

## 5. Modal Components

### 5.1 Project Modals

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Project Setup | `TID-PSETUP-MODAL` | New/edit project dialog | REQUIRED |
| Project Leader | `TID-PSETUP-LEADER` | Leader selection dropdown | REQUIRED |
| Invite Section | `TID-PSETUP-INVITE-SECTION` | Team invitation area | REQUIRED |
| Open Timeline | `TID-PSETUP-OPEN-TIMELINE` | Timeline navigation button | REQUIRED |

### 5.2 Hierarchy Modals

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Milestone Modal | `TID-MS-MODAL` | Milestone setup dialog | REQUIRED |
| Milestone Text | `TID-MS-NEW-TEXT` | New milestone input | REQUIRED |
| Open Timeline (MS) | `TID-MS-OPEN-TIMELINE` | Timeline from milestone | REQUIRED |
| Deliverable Modal | `TID-DL-MODAL` | Deliverable setup dialog | REQUIRED |
| Task Modal | `TID-TASK-MODAL` | Task setup dialog | REQUIRED |
| Task Cluster Toggle | `TID-TASK-CLUSTER-TOGGLE` | Cluster grouping toggle | REQUIRED |
| Task Link Dropdown | `TID-TASK-LINK-DROPDOWN` | Task dependency selector | REQUIRED |
| Task Offset Days | `TID-TASK-OFFSET-DAYS` | Offset calculation field | REQUIRED |
| Task Duration Days | `TID-TASK-DUR-DAYS` | Duration calculation field | REQUIRED |

### 5.3 Filter Modals

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Duration Modal | `TID-DUR-MODAL` | Duration range filter | REQUIRED |
| Progress Modal | `TID-PROGRESS-MODAL` | Progress range filter | REQUIRED |

### 5.4 Member Modals

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Invite Modal | `TID-INVITE-MODAL` | Member invitation dialog | REQUIRED |
| Invite Name | `TID-INVITE-NAME` | Name input field | REQUIRED |
| Invite Email | `TID-INVITE-EMAIL` | Email input field | REQUIRED |

---

## 6. Table Components

### 6.1 Project Hierarchy Table

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Hierarchy Table | `TID-PROJ-HIERARCHY-TABLE` | Main project table | REQUIRED |
| Indicators Row | `TID-PROJ-INDICATORS` | Indicators container | REQUIRED |

### 6.2 Indicator Components

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Duration Indicator | `TID-IND-DURATION` | Duration with progress bar | REQUIRED |
| Milestones Count | `TID-IND-MS-COUNT` | Milestones count display | REQUIRED |
| Deliverables Count | `TID-IND-DL-COUNT` | Deliverables count display | REQUIRED |
| Tasks Count | `TID-IND-TASK-COUNT` | Tasks count display | REQUIRED |
| Team Size | `TID-IND-TEAM-SIZE` | Team member count | REQUIRED |
| Progress vs Plan | `TID-IND-PROGRESS-VS-PLAN` | Progress comparison | REQUIRED |
| Overall Progress | `TID-IND-OVERALL-PROGRESS` | Overall progress bar | REQUIRED |

### 6.3 Row Styles

| Row Type | CSS Class | Background Color |
|----------|-----------|-----------------|
| Project | `.row-project` | `#0D2850` |
| Milestone | `.row-milestone` | `#006B92` |
| Deliverable | `.row-deliverable` | `#4C95B0` |
| Task | `.row-task` | `#FFFFFF` |

---

## 7. Timeline Components

### 7.1 Timeline Page

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Timeline Page | `TID-TL-TEST-PAGE` | Main timeline container | REQUIRED |
| Timeline Canvas | `TID-TLT-CANVAS` | Drawing canvas | REQUIRED |
| Timeline Grid | `TID-TLT-GRID` | Grid overlay | REQUIRED |
| Timeline Labels | `TID-TLT-LABELS` | Label column | REQUIRED |
| Timeline Progress | `TID-TLT-PROGRESS` | Progress column | REQUIRED |

### 7.2 Timeline Zoom Controls

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Year Zoom | `TID-TLT-Z-YEAR` | Year axis toggle | REQUIRED |
| Quarter Zoom | `TID-TLT-Z-QUARTER` | Quarter axis toggle | REQUIRED |
| Month Zoom | `TID-TLT-Z-MONTH` | Month axis toggle | REQUIRED |
| Week Zoom | `TID-TLT-Z-WEEK` | Week axis toggle | REQUIRED |
| Day Zoom | `TID-TLT-Z-DAY` | Day axis toggle | REQUIRED |

### 7.3 Timeline Controls

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| View Start | `TID-TLT-VIEW-START` | Start date picker | REQUIRED |
| Project Select | `TID-TLT-PROJECT-SELECT` | Project dropdown | REQUIRED |
| Create Project | `TID-TLT-CREATE-PROJECT` | New project button | REQUIRED |
| Apply Button | `TID-TLT-APPLY-BTN` | Apply timeline button | REQUIRED |

### 7.4 Timeline Filters

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Show Projects | `TID-TLT-FSHOW-PROJ` | Projects visibility toggle | REQUIRED |
| Show Milestones | `TID-TLT-FSHOW-MS` | Milestones visibility toggle | REQUIRED |
| Show Deliverables | `TID-TLT-FSHOW-DL` | Deliverables visibility toggle | REQUIRED |
| Show Tasks | `TID-TLT-FSHOW-TASK` | Tasks visibility toggle | REQUIRED |
| Responsible Filter | `TID-TLT-FRESP` | Person filter | REQUIRED |

### 7.5 Timeline Axes

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Years Axis | `TID-TLT-AXIS-YEARS` | Year markers | REQUIRED |
| Quarters Axis | `TID-TLT-AXIS-QUARTERS` | Quarter markers | REQUIRED |
| Months Axis | `TID-TLT-AXIS-MONTHS` | Month markers | REQUIRED |
| Weeks Axis | `TID-TLT-AXIS-WEEKS` | Week markers | REQUIRED |
| Days Axis | `TID-TLT-AXIS-DAYS` | Day markers | REQUIRED |

### 7.6 Timeline Resizers

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Column Resizer | `TID-TLT-RESIZER` | Primary column resizer | REQUIRED |
| Secondary Resizer | `TID-TLT-RESIZER-2` | Secondary column resizer | REQUIRED |
| Date Resizer | `TID-TLT-DATE-RESIZER` | Date column width control | REQUIRED |

---

## 8. Health Checker Components

### 8.1 Admin Health Page

| Component | Test ID | Description | Status |
|-----------|---------|-------------|--------|
| Health Root | `TID-HEALTH-CHECKER-ROOT` | Health page container | ADMIN |
| Run QA Button | `TID-HEALTH-RUN-QA-BTN` | Execute QA checks | ADMIN |
| Report Display | `TID-HEALTH-REPORT-DISPLAY` | Results display area | ADMIN |
| Strict Mode Toggle | `TID-HEALTH-STRICT-MODE-TOGGLE` | Strict mode switch | ADMIN |

---

## 9. Data Persistence Components

### 9.1 Required Functions

| Function | Window Scope | Description | Status |
|----------|--------------|-------------|--------|
| `navigateTo` | `window.navigateTo` | Route navigation | REQUIRED |
| `appNavTo` | `window.appNavTo` | App navigation handler | REQUIRED |
| `tlRender` | `window.tlRender` | Timeline rendering | REQUIRED |
| `tlInitFromStore` | `window.tlInitFromStore` | Timeline state initialization | REQUIRED |
| `tlSetZoom` | `window.tlSetZoom` | Timeline zoom control | REQUIRED |
| `openProjectSetup` | `window.openProjectSetup` | Project setup modal | REQUIRED |
| `projectsUpsert` | `window.projectsUpsert` | Project data upsert | REQUIRED |
| `renderProjectHierarchy` | `window.renderProjectHierarchy` | Hierarchy rendering | REQUIRED |
| `saveMilestone` | `window.saveMilestone` | Milestone save handler | REQUIRED |
| `saveDeliverable` | `window.saveDeliverable` | Deliverable save handler | REQUIRED |
| `saveTask` | `window.saveTask` | Task save handler | REQUIRED |
| `saveTimelineChanges` | `window.saveTimelineChanges` | Timeline save handler | REQUIRED |

### 9.2 LocalStorage Keys

| Key | Description | Status |
|-----|-------------|--------|
| `projectState` | Project data persistence | REQUIRED |
| `roleContext` | Current user role | REQUIRED |
| `authContext` | Authentication state | REQUIRED |

---

## 10. Legacy Components (To Be Removed)

Components in this section are **legacy** and must be removed from the codebase:

| Component | Reason | Action |
|-----------|--------|--------|
| Work Item page | Superseded by Task | DELETE |
| Search page | Integrated into filters | DELETE |
| Exports page | Moved to Reports | DELETE |
| Old Timelines Matrix | Replaced by TL-TEST-PAGE | DELETE |

---

## 11. Wiring Validation

### 11.1 Wiring Rules

1. **All REQUIRED components** must be present in DOM when their page loads
2. **All Test IDs** must be present as `data-testid` attributes
3. **All navigation routes** must resolve to functional pages
4. **All event handlers** must be attached and functional
5. **All window functions** must be defined before use

### 11.2 Wiring Failure = RED Status

Per architecture rules, any wiring failure causes:
- QA status: **RED**
- Build: **BLOCKED**
- Deployment: **BLOCKED**

---

## 12. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-25 | Initial component architecture |

---

## Related Documents

- `architecture/rules.md` - Architecture rules
- `rules.md` (root) - Build methodology
- `qa/requirements.md` - QA validation rules
- `docs/architecture/` - Detailed component specs
