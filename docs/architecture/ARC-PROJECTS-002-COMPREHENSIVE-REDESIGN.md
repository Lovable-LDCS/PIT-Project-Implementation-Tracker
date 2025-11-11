---
id: ARC-PROJECTS-002
title: Projects Page - Comprehensive Hierarchical Implementation Tracker
status: Draft v3.0
scope: Complete redesign of Projects page with modal-based creation, hierarchical table structure, color-coded levels, advanced filters, and full integration with Timeline matrix
date: 2025-11-11
supersedes: ARC-PROJECTS-001
---

## 1. Context & Goals

### Purpose
Provide a comprehensive project implementation tracking interface that supports:
- Hierarchical project structure (Project → Milestone → Deliverable → Task)
- Visual color-coding at each hierarchy level
- Rich filtering and search capabilities
- Timeline-based date selection using interactive sliders
- Team member invitation and assignment at all levels
- Automatic rollup of dates, progress, and status from child items

### Success Metrics
- All hierarchy levels visible and color-coded in a single table view
- Dates automatically aggregate from lowest level (tasks) up to highest (projects)
- Team members can be invited at any level via email
- Timeline integration provides visual date selection
- Status descriptors auto-compute based on date proximity

### Stakeholders
- Project Leaders: Create and manage projects
- Milestone Leads: Manage project milestones
- Deliverable Leads: Track specific deliverables
- Team Members: Execute and track tasks
- Admins: Oversee all projects across the organization

## 2. Information Architecture

### 2.1 Navigation
- **Primary Route**: `#/projects` (renamed from "Projects" to "Implementation" in sidebar)
- **Entry Points**:
  - Sidebar: "Implementation" navigation item (TID-NAV-PROJECTS)
  - Top bar: "Start a new project" button (TID-START-PROJECT-BTN)
  - Projects page: "+ Create" button (TID-PAGE-START-PROJECT-BTN)

### 2.2 Page States
1. **Empty State**: No projects created yet
   - Display: "0 results" with "+ Start a new project" button
   - No table or hierarchy shown
   
2. **Project Created State**: At least one project exists
   - Display: Project name as main heading
   - Show: Project indicators (duration, progress, team size, etc.)
   - Show: Filters bar
   - Show: Table headers
   - Show: Hierarchy tree (expandable)
   
3. **Loading State**: Data being fetched
   - Display: Loading indicator (TID-PROJ-LOADING)
   
4. **Error State**: Data fetch failed
   - Display: Error message with retry option

## 3. Page & Layout Blueprints

### 3.1 Global Layout
```
[Project Name Heading]
[Project Indicators: Duration | Progress | # Milestones | # Deliverables | # Tasks | Team Size | Progress vs Plan | Overall %]

[Filters Bar]
 - Project Status | Start Date | End Date | Duration | Responsible Person | Progress

[Table Headers]
 Project Descriptors | Start Date | End Date | Duration | Person Responsible | Progress

[Hierarchy Tree]
 └─ Project (Level 0) - Color: #0D2850
    ├─ Milestone 1 (Level 1) - Color: #006B92
    │  ├─ Deliverable 1.1 (Level 2) - Color: #4C95B0
    │  │  └─ Task 1.1.1 (Level 3) - Color: Default
    │  └─ Deliverable 1.2
    └─ Milestone 2
       └─ ...

[Action Buttons]
 + Milestone | + Deliverable | + Task
```

### 3.2 Project Indicators Row
Display above filters, showing high-level metrics:
- **Project Duration**: Start to end with progress bar
- **# Milestones**: Count of milestones
- **# Deliverables**: Count of deliverables  
- **# Tasks**: Count of tasks
- **Team Members**: Count of assigned people
- **Progress vs Plan %**: Comparison metric
- **Overall Progress %**: Weighted completion

Test IDs:
- Container: TID-PROJ-INDICATORS
- Individual metrics: TID-IND-DURATION, TID-IND-MS-COUNT, TID-IND-DL-COUNT, TID-IND-TASK-COUNT, TID-IND-TEAM-SIZE, TID-IND-PROGRESS-VS-PLAN, TID-IND-OVERALL-PROGRESS

### 3.3 Filters Bar
Multi-select and date-based filters with the following controls:

**Filter Controls**:
1. **Project Status** (TID-FILTER-STATUS)
   - Dropdown with options:
     - Not yet active
     - 5 days prior to active (countdown: -5, -4, -3, -2, -1)
     - Started (1/5, 2/5 days with progress bar)
     - Due day reached
     - Past due date (+1, +2, +3 days)
     - Critical (10+ days overdue)

2. **Start Date** (TID-FILTER-START) - Date picker

3. **End Date** (TID-FILTER-END) - Date picker

4. **Duration** (TID-FILTER-DURATION-BTN)
   - Opens modal with operators: >, <, =, >=, <=
   - Free text input for number of days
   - Modal test IDs: TID-DUR-MODAL, TID-DUR-DIALOG, TID-DUR-OP-LT, TID-DUR-OP-GT, TID-DUR-OP-EQ, TID-DUR-OP-LTE, TID-DUR-OP-GTE, TID-DUR-DAYS-1, TID-DUR-APPLY, TID-DUR-CANCEL

5. **Responsible Person** (TID-FILTER-RESP)
   - Multi-select dropdown with radio selectors
   - Type-as-you-go search functionality
   - Shows all team members assigned to any level

6. **Progress Filter** (TID-FILTER-PROGRESS-BTN)
   - Works like duration but factor is percentage (%)
   - Operators: >, <, =, >=, <=

### 3.4 Table Headers
Fixed header row that remains visible during scroll (sticky):
- **Project Descriptors** (TID-COL-H-DESC) - Color: #0D2850
- **Start Date** (TID-COL-H-START)
- **End Date** (TID-COL-H-END)
- **Duration** (TID-COL-H-DURATION)
- **Person Responsible** (TID-COL-H-RESP)
- **Progress** (TID-COL-H-PROGRESS)

Container: TID-PROJ-COLS-HEADER

### 3.5 Hierarchy Tree Structure

**Visual Hierarchy**:
- Indentation indicates parent-child relationships
- Color coding identifies level
- Expandable/collapsible sections
- Automatic numbering (1, 1.1, 1.1.1)

**Project Row** (Level 0):
- Color: #0D2850 (same as headers)
- Contains: Project name + planned duration (start/end in descriptor column)
- Columns populated from child milestones:
  - Start: Earliest milestone start
  - End: Latest milestone end
  - Responsible: Project lead
  - Progress: Average of all milestones
- If no milestones: "Project implementation not yet started"
- Test IDs: TID-PROJ-ROW-{index}, TID-PROJ-NAME-{index}

**Milestone Row** (Level 1):
- Color: #006B92
- Contains: Milestone name + planned duration
- Columns populated from child deliverables:
  - Start: Earliest deliverable start
  - End: Latest deliverable end
  - Responsible: Milestone lead (defaults to project lead if unassigned)
  - Progress: Average of all deliverables
- If no deliverables: "Milestone implementation not yet started"
- Test IDs: TID-MS-ROW-{index}, TID-MS-NAME-{index}
- "+ Add Deliverable" button appears beneath milestone name

**Deliverable Row** (Level 2):
- Color: #4C95B0
- Contains: Deliverable description (no planned duration in descriptor column)
- Columns populated from child tasks:
  - Start: Earliest task start
  - End: Latest task end
  - Responsible: Deliverable lead (defaults to milestone lead if unassigned)
  - Progress: Average of all tasks
- If no tasks: "No tasks assigned yet"
- Test IDs: TID-DL-ROW-{index}, TID-DL-NAME-{index}
- "+ Add Task" button appears beneath deliverable name

**Task Row** (Level 3):
- Color: Default (no special background)
- Contains: Task title with explicit start/end dates
- Columns:
  - Start: Explicitly set in task modal
  - End: Explicitly set in task modal
  - Responsible: Task assignee
  - Progress: Manually updated (0-100%)
- Test IDs: TID-TASK-ROW-{index}, TID-TASK-NAME-{index}

## 4. UI Components

### 4.1 Project Creation Modal

**Trigger**: Click "Start a new project" button
**Modal Test IDs**: TID-PSETUP-MODAL, TID-PSETUP-DIALOG

**Fields**:
1. **Project Name** (TID-PSETUP-NAME) - Required text input
2. **Project Leader** (TID-PSETUP-LEADER) - Dropdown (defaults to current user)
3. **Project Outcome** (TID-PSETUP-OUTCOME) - SMART outcome textarea
4. **Project Description** (TID-PSETUP-DESCRIPTION) - Textarea
5. **Set Timeline** (TID-PSETUP-OPEN-TIMELINE) - Button
   - Navigates to Timeline page (#/timelines)
   - User selects start/end dates using timeline sliders
   - Returns to modal with dates populated
6. **Invite Member** (TID-PSETUP-INVITE-SECTION) - Optional
   - **Select existing** (TID-PSETUP-MEMBER-SELECT): Dropdown with search
   - **Invite new** (TID-PSETUP-INVITE-NEW-BTN): Opens invite sub-modal
     - Name input (TID-INVITE-NAME)
     - Email input (TID-INVITE-EMAIL)
     - Send invitation (TID-INVITE-SEND)
   - New member receives email with signup link
   - Member allocated to this specific project only
   - Member inherits rights to assign milestones, deliverables, tasks for this project

**Actions**:
- Save (TID-PSETUP-SAVE): Creates project and navigates to Projects page
- Cancel (TID-PSETUP-CANCEL): Closes modal without saving
- Close (TID-PSETUP-CLOSE): X button, same as Cancel

**Behavior**:
- ESC key closes modal
- Click outside modal overlay closes modal
- If no assignee selected, defaults to current user (Admin)
- Timeline dates display in modal after timeline selection
- Modal has focus trap for accessibility

### 4.2 Milestone Creation Modal

**Trigger**: Click "+ Milestone" button in project view
**Modal Test IDs**: TID-MS-MODAL, TID-MS-DIALOG

**Fields**:
1. **Project** (TID-MS-PROJECT-SELECT) - Dropdown (if multiple projects exist)
2. **Edit in Timelines** (TID-MS-OPEN-TIMELINE) - Button to open timeline editor
3. **Milestone Name** (TID-MS-DROPDOWN) - Dropdown with options:
   - Choose existing... (shows previously created milestones)
   - "Add milestone..." (TID-MS-ADD-NEW) - triggers new input field
4. **New Milestone Input** (TID-MS-NEW-TEXT) - Text input with spellcheck
   - Only shown when "Add milestone..." selected
   - Label: TID-MS-NEW-LABEL
5. **Duplicate Alert** (TID-MS-DUPLICATE-ALERT) - Warning if name exists
   - "Milestone already exists. Replace?"
6. **Invite Member** (TID-MS-INVITE-SECTION) - Same pattern as project modal
   - Select existing or invite new
   - Member allocated to milestone with rights to assign deliverables and tasks
   - Defaults to project lead if not assigned

**Actions**:
- Save (TID-MS-SAVE): Adds milestone to project
- Cancel (TID-MS-CANCEL): Closes without saving
- Close (TID-MS-CLOSE): X button

**Behavior**:
- Milestone dates set via Timeline page (slider bars)
- Milestone colors: Bar and row use #006B92
- If no assignee: defaults to project lead
- Dates must fall within project start/end range
- Duplicate detection on save

### 4.3 Deliverable Creation Modal

**Trigger**: Click "+ Deliverable" button beneath milestone
**Modal Test IDs**: TID-DL-MODAL, TID-DL-DIALOG

**Fields**:
1. **Milestone** (TID-DL-MILESTONE) - Dropdown (required)
   - Must assign deliverable to a milestone
2. **Deliverable Name** (TID-DL-DROPDOWN) - Dropdown with options:
   - Choose existing...
   - "Add deliverable..." (TID-DL-ADD-NEW)
3. **New Deliverable Input** (TID-DL-NEW-TEXT) - Text input with spellcheck
   - Label: TID-DL-NEW-LABEL
4. **Person Responsible** (TID-DL-ASSIGNEE) - Dropdown
5. **Invite Member** (TID-DL-INVITE-SECTION)
   - Same pattern as above
   - Member allocated to deliverable with rights to assign tasks
   - Defaults to milestone lead if not assigned

**Actions**:
- Save (TID-DL-SAVE)
- Cancel (TID-DL-CANCEL)
- Close (TID-DL-CLOSE)

**Behavior**:
- NO start/end date pickers in modal
- Start/end automatically populated from child tasks:
  - Start = earliest task start
  - End = latest task end
- If no tasks: displays "No tasks assigned yet"
- Deliverable colors: Bar and row use #4C95B0
- Must be assigned to a milestone

### 4.4 Task Creation Modal

**Trigger**: Click "+ Task" button beneath deliverable
**Modal Test IDs**: TID-TASK-MODAL, TID-TASK-DIALOG

**Fields**:
1. **Deliverable** (TID-TASK-DELIVERABLE) - Dropdown (required)
2. **Task Cluster Toggle** (TID-TASK-CLUSTER-TOGGLE) - Yes/No toggle
   
   **If NO (single task)**:
   - Task Title (TID-TASK-TITLE)
   - Start Date (TID-TASK-START)
   - End Date (TID-TASK-END)
   - Person Responsible (TID-TASK-ASSIGNEE)
   
   **If YES (task cluster)**:
   - Task Cluster Name (TID-CLUSTER-NAME-SELECT) - Dropdown
     - Choose existing cluster template
     - "Add cluster..." (TID-CLUSTER-ADD-NEW)
   - Cluster displays pre-defined tasks (TID-CLUSTER-PRELOAD)
     - Example: "Implement a new procedure"
       1. Draft procedure
       2. Get approval and sign-off
       3. Communicate to stakeholders
       4. Obtain record of communication
       5. Place on internal repository
   - Can add tasks to cluster with "+" button
   - Can edit cluster if generic template selected

3. **Task Dependencies** (TID-TASK-LINK-DROPDOWN)
   - Dropdown linking this task to another task
   - Used for timeline calculations
   - If first task: defaults to milestone start date

4. **Time Calculation Fields**:
   - **Initial Date Display**: Shows linked task date or milestone start
   - **Offset from Initial** (TID-TASK-OFFSET-DAYS, TID-TASK-OFFSET-HOURS, TID-TASK-OFFSET-MINUTES)
     - "How long after the initial date do you want this task to start?"
     - Can be 00:00:00 (starts same time as linked task/milestone)
     - Adds to initial date to get actual start date
   - **Duration** (TID-TASK-DUR-DAYS, TID-TASK-DUR-HOURS, TID-TASK-DUR-MINUTES)
     - "Time duration to complete this task"
     - Can be 10 minutes (e.g., "Arrange a meeting")
     - Adds to start date to get end date

5. **Invite Member** (TID-TASK-INVITE-SECTION)
   - User only gets rights to manage assigned tasks
   - Can add evidence and update progress for their tasks

**Actions**:
- Save (TID-TASK-SAVE)
- Cancel (TID-TASK-CANCEL)
- Close (TID-TASK-CLOSE)

**Behavior**:
- Start/End dates calculated from:
  1. Linked task (or milestone if first task)
  2. Plus offset (days/hours/minutes)
  3. Plus duration for end date
- Task cluster templates pre-populate multiple tasks
- Each task in cluster is individually editable
- Progress tracked per task (0-100%)

## 5. Data & Wiring

### 5.1 Data Model

```javascript
Project {
  id: string,
  name: string,
  leader: string,
  outcome: string,
  description: string,
  start: date,      // Earliest milestone start
  end: date,        // Latest milestone end
  status: string,   // Auto-computed
  teamMembers: [string],
  milestones: [Milestone],
  createdBy: string,
  createdAt: timestamp
}

Milestone {
  id: string,
  projectId: string,
  title: string,
  start: date,      // Earliest deliverable start
  end: date,        // Latest deliverable end
  lead: string,     // Defaults to project leader
  status: string,   // Auto-computed
  deliverables: [Deliverable],
  color: "#006B92"
}

Deliverable {
  id: string,
  milestoneId: string,
  title: string,
  start: date,      // Earliest task start
  end: date,        // Latest task end
  lead: string,     // Defaults to milestone leader
  status: string,   // Auto-computed
  tasks: [Task],
  color: "#4C95B0"
}

Task {
  id: string,
  deliverableId: string,
  title: string,
  start: date,      // Explicitly set
  end: date,        // Calculated from start + duration
  assignee: string,
  progress: number, // 0-100
  linkedTaskId: string, // For dependency calculation
  offsetDays: number,
  offsetHours: number,
  offsetMinutes: number,
  durationDays: number,
  durationHours: number,
  durationMinutes: number,
  clusterId: string, // If part of cluster
  evidence: string   // File reference
}
```

### 5.2 Status Computation

Function: `computeStatusDescriptor(startDate, endDate, today = new Date())`

**Logic**:
```javascript
if (!startDate || !endDate) return "No dates";

const today = new Date();
const start = new Date(startDate);
const end = new Date(endDate);

// Future project
if (today < start) {
  const daysUntil = Math.ceil((start - today) / (1000*60*60*24));
  if (daysUntil <= 5) {
    return `Starting in ${daysUntil} days (countdown)`;
  }
  return "Not yet active";
}

// Past due
if (today > end) {
  const daysOver = Math.ceil((today - end) / (1000*60*60*24));
  if (daysOver >= 10) {
    return `Critical: ${daysOver} days overdue`;
  }
  return `${daysOver} days past due`;
}

// Active
const daysRemaining = Math.ceil((end - today) / (1000*60*60*24));
if (daysRemaining === 0) {
  return "Due today";
}
if (daysRemaining <= 5) {
  const totalDays = Math.ceil((end - start) / (1000*60*60*24));
  const elapsed = totalDays - daysRemaining;
  return `Started ${elapsed}/${totalDays} days (closing gap)`;
}

return "On track";
```

### 5.3 Date Aggregation Rules

**Upward Aggregation** (from children to parent):

1. **Task → Deliverable**:
   - Deliverable.start = MIN(Task.start for all tasks)
   - Deliverable.end = MAX(Task.end for all tasks)
   - Deliverable.progress = AVG(Task.progress for all tasks)

2. **Deliverable → Milestone**:
   - Milestone.start = MIN(Deliverable.start for all deliverables)
   - Milestone.end = MAX(Deliverable.end for all deliverables)
   - Milestone.progress = AVG(Deliverable.progress for all deliverables)

3. **Milestone → Project**:
   - Project.start = MIN(Milestone.start for all milestones)
   - Project.end = MAX(Milestone.end for all milestones)
   - Project.progress = AVG(Milestone.progress for all milestones)

**Downward Constraints** (parent limits children):

1. **Project → Milestone**:
   - Milestone.start >= Project.start
   - Milestone.end <= Project.end
   - Timeline slider enforces these bounds

2. **Milestone → Deliverable**:
   - Deliverable.start >= Milestone.start
   - Deliverable.end <= Milestone.end

3. **Deliverable → Task**:
   - Task.start >= Deliverable.start (if set)
   - Task.end <= Deliverable.end (if set)
   - First task in deliverable can default to Milestone.start

### 5.4 Team Member Invitation Flow

**Invitation Process**:
1. User clicks "Invite Member" in any modal
2. Enters name and email in invite sub-modal
3. System sends email with signup link
4. Email contains:
   - Project/Milestone/Deliverable/Task context
   - Unique signup token
   - Expiration (7 days)

**Signup Process**:
1. New member clicks link in email
2. Redirected to signup page with pre-filled context
3. Creates account (name, password, profile)
4. Automatically assigned to the item they were invited for
5. Granted appropriate permissions:
   - Project invite → Can manage milestones, deliverables, tasks for this project
   - Milestone invite → Can manage deliverables and tasks for this milestone
   - Deliverable invite → Can manage tasks for this deliverable
   - Task invite → Can update progress and add evidence for this task

**Permission Hierarchy**:
- Project Lead > Milestone Lead > Deliverable Lead > Task Assignee
- Higher levels can reassign lower levels
- Cannot escalate own permissions
- Admin can override all assignments

## 6. Permissions

### 6.1 Role × Capability Matrix

| Role | Create Project | Edit Project | View Project | Assign Members | Delete Items |
|------|---------------|--------------|--------------|----------------|--------------|
| Admin | ✓ | ✓ (all) | ✓ (all) | ✓ (all levels) | ✓ (all) |
| Project Lead | ✓ | ✓ (own) | ✓ (assigned) | ✓ (project level) | ✓ (own project) |
| Milestone Lead | ✗ | ✓ (own milestones) | ✓ (assigned) | ✓ (milestone level) | ✓ (own milestone) |
| Deliverable Lead | ✗ | ✓ (own deliverables) | ✓ (assigned) | ✓ (deliverable level) | ✓ (own deliverable) |
| Task Assignee | ✗ | ✓ (own tasks) | ✓ (assigned) | ✗ | ✗ |
| Viewer | ✗ | ✗ | ✓ (granted) | ✗ | ✗ |

### 6.2 Scope Inheritance

**Read-up Rule**: Users can view parent items of their assigned work
- Task assignee can view their deliverable, milestone, and project
- Deliverable lead can view their milestone and project
- Milestone lead can view their project

**Write-down Rule**: Users can modify child items they're responsible for
- Project lead can edit all milestones, deliverables, tasks in their project
- Milestone lead can edit all deliverables and tasks in their milestone
- Deliverable lead can edit all tasks in their deliverable

**No Lateral Access**: Users cannot view/edit sibling items unless explicitly granted
- Milestone lead cannot see other milestones in the project (unless granted)
- Task assignee cannot see other tasks in the deliverable (unless granted)

## 7. Notifications

### 7.1 Notification Events

**Project Level**:
- Project created
- Project deadline approaching (5 days, 1 day)
- Project overdue (1 day, 5 days, 10 days critical)
- Project completed
- New member invited to project

**Milestone Level**:
- Milestone created
- Milestone deadline approaching
- Milestone overdue
- Milestone completed
- Member assigned to milestone

**Deliverable Level**:
- Deliverable created
- Deliverable deadline approaching
- Deliverable overdue
- All tasks completed
- Member assigned to deliverable

**Task Level**:
- Task assigned
- Task deadline approaching (1 day)
- Task overdue
- Task completed
- Evidence uploaded
- Task dependency blocking

### 7.2 Notification Channels

**Current**: Email only

**Future**: SMS, WhatsApp, in-app notifications

**Email Template Structure**:
```
Subject: [PIT] {Event Type}: {Item Name}

Body:
Hi {RecipientName},

{Event Description}

Project: {ProjectName}
{Hierarchy Context}
Status: {Status}
Deadline: {Date}

{Action Required}

View Details: {DeepLink}

---
Project Implementation Tracker
```

## 8. Compliance & Security

### 8.1 OWASP ASVS Controls

- **Authentication**: User signup via email invitation link (token-based, 7-day expiration)
- **Authorization**: Role-based access control with scope inheritance
- **Input Validation**: 
  - Project/Milestone/Deliverable names: Max 200 chars, no SQL injection patterns
  - Email addresses: RFC 5322 validation
  - Dates: ISO 8601 format, range validation against parent constraints
- **CSRF Protection**: Token required for all state-changing operations
- **CORS**: Whitelist approved domains only
- **Rate Limiting**: Max 10 invitations per hour per user

### 8.2 PII Handling

**Personal Information Collected**:
- Name (required for invitation and signup)
- Email address (required for invitation and login)
- Project assignments (required for access control)

**Data Minimization**:
- No phone numbers collected unless SMS notifications enabled
- No physical addresses collected
- No financial information collected

**Retention Policy**:
- Active users: Retained while account active
- Inactive users: Flagged after 180 days, deleted after 365 days
- Completed projects: Archived after 90 days, deleted after 2 years

**Breach Notification**:
- Detect breach within 24 hours
- Notify affected users within 72 hours
- Regulatory notification per GDPR/POPIA requirements

### 8.3 Audit Logging

**Events to Log**:
- Project created/edited/deleted
- Member invited/accepted/removed
- Permission changes
- Data exports
- Failed login attempts
- Suspicious activities (rapid API calls, unusual access patterns)

**Audit Entry Structure**:
```javascript
{
  timestamp: ISO8601,
  actor: userId,
  action: "project.created",
  target: projectId,
  changes: {before: {}, after: {}},
  ipAddress: string,
  userAgent: string,
  hash: SHA256(previousHash + currentEntry) // Chain integrity
}
```

## 9. Internationalization & Time

### 9.1 Locale Settings

**Default Locale**: en-ZA (English - South Africa)

**Supported Locales** (future):
- en-US, en-GB, en-AU
- af-ZA (Afrikaans)
- zu-ZA (Zulu)

**Date Formatting**:
- Display: DD/MM/YYYY (en-ZA standard)
- Storage: ISO 8601 (YYYY-MM-DD)
- Time: 24-hour format preferred

### 9.2 Timezone Handling

**Storage**: All dates stored in UTC

**Display**: Converted to user's local timezone

**Calculation**: All date math performed in local time (as per Timeline requirements)

**Ambiguity Resolution**:
- Task offsets calculated in local time
- Duration calculations use calendar days (not 24-hour periods)
- Weekend/holiday handling: Not implemented in MVP, all days equal

## 10. Telemetry & Audit

### 10.1 Metrics to Track

**User Engagement**:
- Projects created per day/week/month
- Active users per project
- Time spent on Projects page
- Modal open/close rates
- Filter usage frequency

**System Health**:
- Page load time (target: <2s)
- API response time (target: <500ms)
- Error rates by endpoint
- Browser/device distribution

**Business Metrics**:
- Projects completed on time vs overdue
- Average project duration
- Average team size
- Task completion velocity
- Evidence upload rate

### 10.2 Chain-Hash Audit Log

**Implementation**:
- Each audit entry includes hash of previous entry
- Tampering detection: Recompute chain, compare hashes
- Stored in append-only structure
- Periodic snapshots for verification

## 11. Acceptance Criteria

### 11.1 Visual Acceptance

**Table Structure**:
- [ ] Project name displayed as main heading above table
- [ ] Project indicators row shows all 7 metrics
- [ ] Filters bar with all 6 filter controls
- [ ] Table headers with 6 columns, sticky on scroll
- [ ] Hierarchy tree with proper indentation
- [ ] Color coding:
  - Project rows: #0D2850
  - Milestone rows: #006B92
  - Deliverable rows: #4C95B0
  - Task rows: Default/white background

**Modals**:
- [ ] Project modal with all fields and "Set timeline" button
- [ ] Milestone modal with dropdown pattern and timeline button
- [ ] Deliverable modal with milestone selector
- [ ] Task modal with cluster toggle and time calculation fields
- [ ] All modals closable via ESC, X button, or outside click
- [ ] All modals have focus trap

**Buttons & Controls**:
- [ ] "+ Milestone" button appears under project
- [ ] "+ Deliverable" button appears under each milestone
- [ ] "+ Task" button appears under each deliverable
- [ ] "Invite Member" section in all modals
- [ ] Filter controls functional and wired

### 11.2 Functional Acceptance

**Data Flow**:
- [ ] Creating project navigates to Projects page with project displayed
- [ ] Dates aggregate upward from tasks → deliverables → milestones → project
- [ ] Status descriptors auto-compute based on dates
- [ ] Progress calculates as average of child items
- [ ] Responsible person defaults up hierarchy if not assigned

**Timeline Integration**:
- [ ] "Set timeline" button navigates to Timeline page (#/timelines)
- [ ] Timeline displays project with draggable slider
- [ ] Slider changes update start/end dates
- [ ] Return to modal shows updated dates
- [ ] Timeline page renamed to "Timelines" (not "Timelines (Test)")

**Invitation Flow**:
- [ ] Invite member opens sub-modal
- [ ] Email sent with signup link
- [ ] New user can sign up via link
- [ ] New user assigned to correct item level
- [ ] New user has appropriate permissions

**Filtering**:
- [ ] Status filter shows correct options and filters data
- [ ] Date range filters work (from/to)
- [ ] Duration filter modal opens and filters tasks
- [ ] Responsible person filter with search works
- [ ] Progress filter works
- [ ] Multiple filters combine with AND logic

### 11.3 Test IDs Required

**Page Level**:
- TID-PAGE-PROJECTS (section container)
- TID-PROJ-NAME-HEADING (main project name)
- TID-PROJ-INDICATORS (indicators row container)
- TID-IND-DURATION, TID-IND-MS-COUNT, TID-IND-DL-COUNT, TID-IND-TASK-COUNT, TID-IND-TEAM-SIZE, TID-IND-PROGRESS-VS-PLAN, TID-IND-OVERALL-PROGRESS

**Filters**:
- TID-FILTER-BAR (container)
- TID-FILTER-STATUS, TID-FILTER-START, TID-FILTER-END, TID-FILTER-DURATION-BTN, TID-FILTER-RESP, TID-FILTER-PROGRESS-BTN

**Table Headers**:
- TID-PROJ-COLS-HEADER
- TID-COL-H-DESC, TID-COL-H-START, TID-COL-H-END, TID-COL-H-DURATION, TID-COL-H-RESP, TID-COL-H-PROGRESS

**Hierarchy Rows**:
- TID-PROJ-ROW-{index}, TID-MS-ROW-{index}, TID-DL-ROW-{index}, TID-TASK-ROW-{index}
- TID-PROJ-NAME-{index}, TID-MS-NAME-{index}, TID-DL-NAME-{index}, TID-TASK-NAME-{index}

**Modals** (all existing test IDs retained, plus):
- TID-PSETUP-LEADER, TID-PSETUP-INVITE-SECTION, TID-PSETUP-MEMBER-SELECT, TID-PSETUP-INVITE-NEW-BTN
- TID-MS-INVITE-SECTION
- TID-DL-INVITE-SECTION
- TID-TASK-INVITE-SECTION, TID-TASK-LINK-DROPDOWN, TID-TASK-OFFSET-DAYS, TID-TASK-OFFSET-HOURS, TID-TASK-OFFSET-MINUTES, TID-TASK-DUR-DAYS, TID-TASK-DUR-HOURS, TID-TASK-DUR-MINUTES
- TID-INVITE-NAME, TID-INVITE-EMAIL, TID-INVITE-SEND

**Buttons**:
- TID-PROJ-ADD-MS-BTN, TID-PROJ-ADD-DL-BTN, TID-PROJ-ADD-TASK-BTN

## 12. Open Questions & Risks

### 12.1 Open Questions

1. **Q**: How should concurrent edits be handled when multiple users edit the same project?
   **A**: Not addressed in MVP. Future: Implement optimistic locking or conflict resolution UI

2. **Q**: Should there be a maximum depth to the hierarchy?
   **A**: Current spec: 4 levels (Project → Milestone → Deliverable → Task). No sub-tasks in MVP.

3. **Q**: How are deleted items handled (soft delete vs hard delete)?
   **A**: To be defined. Suggest soft delete with 30-day recovery window.

4. **Q**: Can a task belong to multiple deliverables?
   **A**: No in MVP. One task = one deliverable. Use task clusters for shared work patterns.

5. **Q**: What happens if a task cluster template is modified after being used?
   **A**: Template changes don't affect existing task instances. Only new uses get updated template.

### 12.2 Risks

1. **Performance**: Large projects (100+ milestones) may have slow render times
   - **Mitigation**: Implement virtualized scrolling, lazy load hierarchy levels

2. **Complexity**: Four-level hierarchy may be confusing for new users
   - **Mitigation**: Progressive disclosure, onboarding wizard, tooltips

3. **Data Integrity**: Date aggregation logic could produce unexpected results
   - **Mitigation**: Extensive testing, validation rules, user feedback on incorrect dates

4. **Email Deliverability**: Invitation emails may be filtered as spam
   - **Mitigation**: SPF/DKIM/DMARC configuration, whitelist instructions in docs

5. **Timezone Confusion**: Users in different timezones may see different dates
   - **Mitigation**: Display timezone in UI, use "local time" label, add timezone selector

---

**Document Version**: 3.0
**Last Updated**: 2025-11-11
**Author**: One Time Build Agent
**Approval Required**: Main Admin (Johan)
