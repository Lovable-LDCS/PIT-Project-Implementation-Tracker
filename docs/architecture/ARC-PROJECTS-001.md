---
id: ARC-PROJECTS-001
title: Projects Page (Summary-first → Build View)
status: Draft v2.6
scope: Clean Projects page with Project Summary, Project Filter, and Hierarchy model (Milestones, Deliverables, Clusters, Tasks) with aggregation and traceability.
---

1) Goals
- After saving a project, show only a clean Project Summary line (since no deeper data yet), plus the project title/meta.
- Top: Project selector (drop-down) to switch/filter projects (future multi-project support).
- Hierarchy model to be added iteratively: Milestones → Deliverables → Task Clusters → Tasks, with indentation, aggregation, and automatic status.
- Status descriptors are computed automatically from dates (non-manual).

2) Structure (DOM requirements)
- Container: data-testid="TID-PAGE-PROJECTS" (section)
- Project selector (filter): data-testid="TID-PROJ-SELECT"
- Actions bar: data-testid="TID-PROJ-ACTIONS" (contains primary actions, including Start/Create)
  - Required wiring: TID-PROJ-CREATE-BTN -> openProjectSetup(); TID-PROJ-IMPORT-BTN -> navigateTo('#/import'), importInit()
- Project header + detail (visible after Save): data-testid="TID-PROJ-DETAIL" (hidden by default)
  - Title (project name): data-testid="TID-PROJ-TITLE"
  - Meta row with start/end: data-testid="TID-PROJ-META"
  - Start label: data-testid="TID-PROJ-START"
  - End label: data-testid="TID-PROJ-END"
- Project Summary line (clean, visible post-save): data-testid="TID-PROJ-SUMMARY" (hidden by default)
  - Cells/fields:
    - Status: data-testid="TID-PROJ-SUM-STATUS"
    - Start Date: data-testid="TID-PROJ-SUM-START"
    - End Date: data-testid="TID-PROJ-SUM-END"
    - Duration: data-testid="TID-PROJ-SUM-DURATION"
    - Person responsible: data-testid="TID-PROJ-SUM-RESP"
    - Progress: data-testid="TID-PROJ-SUM-PROGRESS"
    - Evidence management: data-testid="TID-PROJ-SUM-EVIDENCE"
- Hierarchy controls (hidden in this phase; will be enabled later):
  - Add Milestone: data-testid="TID-PROJ-ADD-MS"
  - Add Deliverable: data-testid="TID-PROJ-ADD-DL"
  - Add Task: data-testid="TID-PROJ-ADD-TASK"
- Build surface container aligned under Summary (Status column): data-testid="TID-PROJ-BUILD" (hidden until first item added)
  - Contains hierarchical tree: data-testid="TID-PROJ-TREE"
  - Indentation classes: indent-1 (milestone), indent-2 (deliverable/cluster/task)
  - Number labels and trace codes placeholders per row: data-testid="TID-MS-NUM", "TID-DL-NUM", "TID-TASK-NUM", "TID-TRACE"
- Filters bar (for future build view): data-testid="TID-PROJ-FILTERS"
  - Item type multi-select: data-testid="TID-PROJ-FILTER-TYPE"
  - Date range From: data-testid="TID-PROJ-FILTER-FROM"
  - Date range To: data-testid="TID-PROJ-FILTER-TO"
- Legacy list elements (retained, hidden post-save):
  - Results count: data-testid="TID-PROJ-RESULTS-COUNT"
  - Table: data-testid="TID-PROJ-TABLE" role="table"
    - Columns (thead th[scope="col"] test IDs):
      - data-testid="TID-PROJ-THEAD-NAME"
      - data-testid="TID-PROJ-THEAD-STATUS"
      - data-testid="TID-PROJ-THEAD-STATUSDESC" (Status Description)
      - data-testid="TID-PROJ-THEAD-START"
      - data-testid="TID-PROJ-THEAD-END"
      - data-testid="TID-PROJ-THEAD-PROGRESS"
      - data-testid="TID-PROJ-THEAD-OWNER"
  - Empty state container: data-testid="TID-PROJ-EMPTY"
  - Loading skeleton container: data-testid="TID-PROJ-LOADING"
  - Pagination container: data-testid="TID-PROJ-PAGINATION"

3) Behavior & Semantics
- Create new project via modal; on Save:
  - Navigate to Projects page.
  - Show TID-PROJ-DETAIL with Title and Start/End and show TID-PROJ-SUMMARY populated.
  - Show TID-PROJ-COLS-HEADER (sticky allowed) even when there are no items yet.
  - Hide legacy list elements for a clean page.
- Project selector (TID-PROJ-SELECT): lists projects; selection filters current view.
- Filters behavior (multi-selects):
  - Projects: include items belonging to selected projects; no selection = all.
  - Milestones/Deliverables/Tasks (titles): selecting any includes those items and cascades down to their descendants for context; selecting tasks also includes their ancestors (deliverable/milestone) for context.
  - Responsible: include items whose responsible matches any selected names.
  - Duration: applies to tasks only; operator LT/EQ/GT against task duration in days; combines with other filters (logical AND).
- Adding items:
  - Milestone modal with dropdown (TID-MS-DROPDOWN) and “Add milestone” entry (TID-MS-ADD-NEW); selecting it reveals text input (TID-MS-NEW-TEXT, spellcheck=true). Duplicate detection alert (TID-MS-DUPLICATE-ALERT) asks to replace.
  - Deliverables: modal mirrors milestone pattern and drops dates. Fields:
  - Milestone selector: TID-DL-MILESTONE (choose which milestone)
  - Deliverable dropdown with Add pattern: TID-DL-DROPDOWN, TID-DL-ADD-NEW, TID-DL-NEW-TEXT (spellcheck)
  - Responsible: TID-DL-ASSIGNEE
  - On save, deliverable inserts under the selected milestone in the next available position; numbering updates accordingly (m.d). No date selectors in modal; dates aggregate from tasks.
- Tasks modal includes TID-TASK-CLUSTER-TOGGLE (Yes/No). If Yes: TID-CLUSTER-NAME-SELECT (with TID-CLUSTER-ADD-NEW) and TID-CLUSTER-PRELOAD. If No: add tasks individually.
- Work Item wiring: TID-WI-DEPENDENCIES-ADD -> linkPredecessor() placeholder acceptable
- Aggregation rules:
  - Cluster: Progress = avg of tasks; Start = earliest task start; End = latest task end; Responsible blank.
  - Milestone: aggregates from its deliverables (or tasks if direct children).
  - Deliverable: aggregates from its tasks/clusters.
- Numbering & Traceability:
  - Milestone: m; Deliverable: m.d; Task: m.d.t (display numbers)
  - Trace code: ProjectName-m.d.t
  - Continuous sequences maintained for tasks and clusters across project.

4) Status Descriptors (auto-computed)
- A function computeStatusDescriptor(startDate, endDate, today) must exist.
- Suggested logic (MVP):
  - If no dates: "No dates"
  - If today < start: "Not started"
  - If today > end: "Overdue"
  - Else if end - today <= 7 days: "Due soon"
  - Else: "On track"

5) Accessibility & Disallowed Controls
- All modals use role=dialog, aria-modal=true; Esc and overlay click dismiss.
- Buttons have type=button and labels.
- Multi-select has a label/aria-label.
- Disallowed (current scope): Invite buttons must not appear — TID-PSETUP-INVITE-BTN, TID-MS-INVITE, TID-DL-INVITE, TID-TASK-INVITE. QA fails RED if present.

6) Acceptance Criteria (QA checks)
- QA enforces addEventListener wiring for TID-PROJ-CREATE-BTN and TID-PROJ-IMPORT-BTN (or inline onclick).
- QA fails build if any disallowed invite buttons appear.
- Presence of elements listed in (2), including TID-PROJ-SELECT and indentation classes (.indent-1, .indent-2) in CSS.
- Project Summary line elements exist: TID-PROJ-SUMMARY, TID-PROJ-SUM-STATUS, TID-PROJ-SUM-START, TID-PROJ-SUM-END, TID-PROJ-SUM-DURATION, TID-PROJ-SUM-RESP, TID-PROJ-SUM-PROGRESS, TID-PROJ-SUM-EVIDENCE, TID-PROJ-SUM-NAME.
- Hierarchy placeholders present: TID-PROJ-ADD-MS, TID-PROJ-ADD-DL, TID-PROJ-ADD-TASK, TID-PROJ-TREE, and labels TID-MS-NUM, TID-DL-NUM, TID-TASK-NUM, TID-TRACE.
- Milestone modal placeholders present: TID-MS-PROJECT-SELECT (project selector), TID-MS-DROPDOWN, TID-MS-ADD-NEW, TID-MS-NEW-TEXT (spellcheck), TID-MS-DUPLICATE-ALERT. No date selectors or days/hours or responsible selector in the Milestone modal; responsibility defaults to project owner if no invite.
- Task modal placeholders present: TID-TASK-CLUSTER-TOGGLE, TID-CLUSTER-NAME-SELECT, TID-CLUSTER-ADD-NEW, TID-CLUSTER-PRELOAD.
- Behavior hooks present: computeStatusDescriptor function.
- Post-save:
  - TID-PROJ-DETAIL visible; TID-PROJ-TITLE matches project name.
  - TID-PROJ-SUMMARY visible and populated.
  - Legacy list and hierarchy hidden for a clean page.


v2.4 Additions and Overrides
- Add Filters banner card (multi-selects) at the top with test IDs: TID-FILTER-CARD, TID-FILTER-PROJECTS, TID-FILTER-MILESTONES, TID-FILTER-DELIVERABLES, TID-FILTER-TASKS, TID-FILTER-START, TID-FILTER-END, TID-FILTER-DURATION, TID-FILTER-RESP.
- Add Duration filter modal (TID-DUR-MODAL/TID-DUR-DIALOG) with operators TID-DUR-OP-LT/GT/EQ (tasks only), input TID-DUR-DAYS-1, actions TID-DUR-APPLY/TID-DUR-CANCEL.
- Add Column headers row (TID-PROJ-COLS-HEADER) with header cells TID-COL-H-DESC, TID-COL-H-START, TID-COL-H-END, TID-COL-H-DURATION, TID-COL-H-RESP, TID-COL-H-EVID.
- Hierarchy rows align to these columns; indentation classes apply within descriptor cell only. Row cells use: TID-ROW-DESC, TID-ROW-START, TID-ROW-END, TID-ROW-DUR, TID-ROW-RESP, TID-ROW-EVID.
- Milestone modal now includes date configuration groups with radio selectors (singular per group):
  - From group (TID-MS-FROM-GROUP): radio options TID-MS-FROM-SAME, TID-MS-FROM-DAYS, TID-MS-FROM-WEEKS, TID-MS-FROM-MONTHS, TID-MS-FROM-YEARS, TID-MS-FROM-PICK
  - To group (TID-MS-TO-GROUP): radio options TID-MS-TO-DAYS, TID-MS-TO-WEEKS, TID-MS-TO-MONTHS, TID-MS-TO-YEARS, TID-MS-TO-PICK
- Breadcrumbs: remove or hide redundant “Projects” label on the Projects page.
- Column headers row TID-PROJ-COLS-HEADER must be visible after Project save (do not require items to be present). Sticky header allowed.

