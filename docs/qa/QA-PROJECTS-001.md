---
id: QA-PROJECTS-001
title: QA - Projects Page (Build View)
component: ARC-PROJECTS-001
status: Draft v2.6
---

Checks (presence + behavior hooks)
- Filters banner (card) present:
  - data-testid="TID-FILTER-CARD"
  - data-testid="TID-FILTER-PROJECTS"
  - data-testid="TID-FILTER-MILESTONES"
  - data-testid="TID-FILTER-DELIVERABLES"
  - data-testid="TID-FILTER-TASKS"
  - data-testid="TID-FILTER-START"
  - data-testid="TID-FILTER-END"
  - data-testid="TID-FILTER-DURATION"
  - data-testid="TID-FILTER-RESP"
- Column headers row present and shown post-save:
  - data-testid="TID-PROJ-COLS-HEADER"
  - data-testid="TID-COL-H-DESC"
  - data-testid="TID-COL-H-START"
  - data-testid="TID-COL-H-END"
  - data-testid="TID-COL-H-DURATION"
  - data-testid="TID-COL-H-RESP"
  - data-testid="TID-COL-H-EVID"
- data-testid="TID-PAGE-PROJECTS"
- data-testid="TID-PROJ-SELECT"
- data-testid="TID-PROJ-ACTIONS"
- data-testid="TID-PROJ-DETAIL" (hidden by default)
- data-testid="TID-PROJ-TITLE"
- data-testid="TID-PROJ-META"
- data-testid="TID-PROJ-START"
- data-testid="TID-PROJ-END"
- data-testid="TID-PROJ-ADD-MS"
- data-testid="TID-PROJ-ADD-DL"
- data-testid="TID-PROJ-ADD-TASK"
- data-testid="TID-PROJ-BUILD"
- data-testid="TID-PROJ-TREE"
- Indentation CSS classes present: .indent-1, .indent-2
- Filters: data-testid="TID-PROJ-FILTERS", data-testid="TID-PROJ-FILTER-TYPE", data-testid="TID-PROJ-FILTER-FROM", data-testid="TID-PROJ-FILTER-TO"
- Project Summary line: data-testid="TID-PROJ-SUMMARY", plus cells TID-PROJ-SUM-STATUS, TID-PROJ-SUM-START, TID-PROJ-SUM-END, TID-PROJ-SUM-DURATION, TID-PROJ-SUM-RESP, TID-PROJ-SUM-PROGRESS, TID-PROJ-SUM-EVIDENCE
- Legacy list presence (for compatibility):
  - data-testid="TID-PROJ-RESULTS-COUNT"
  - data-testid="TID-PROJ-TABLE" with role="table"
  - data-testid="TID-PROJ-THEAD-NAME"
  - data-testid="TID-PROJ-THEAD-STATUS"
  - data-testid="TID-PROJ-THEAD-STATUSDESC"
  - data-testid="TID-PROJ-THEAD-START"
  - data-testid="TID-PROJ-THEAD-END"
  - data-testid="TID-PROJ-THEAD-PROGRESS"
  - data-testid="TID-PROJ-THEAD-OWNER"
  - data-testid="TID-PROJ-EMPTY"
  - data-testid="TID-PROJ-LOADING"
  - data-testid="TID-PROJ-PAGINATION"

Modals (dialog semantics)
- Milestone modal present: TID-MS-MODAL (hidden default), TID-MS-DIALOG role=dialog aria-modal=true, fields TID-MS-PROJECT-SELECT, TID-MS-INVITE; controls TID-MS-SAVE, TID-MS-CANCEL/Close; dropdown flow placeholders TID-MS-DROPDOWN, TID-MS-ADD-NEW, TID-MS-NEW-TEXT (spellcheck), TID-MS-DUPLICATE-ALERT. Milestone modal now includes date groups (presence-only):
  - From group: TID-MS-FROM-GROUP radio options TID-MS-FROM-SAME | TID-MS-FROM-DAYS | TID-MS-FROM-WEEKS | TID-MS-FROM-MONTHS | TID-MS-FROM-YEARS | TID-MS-FROM-PICK
  - To group: TID-MS-TO-GROUP radio options TID-MS-TO-DAYS | TID-MS-TO-WEEKS | TID-MS-TO-MONTHS | TID-MS-TO-YEARS | TID-MS-TO-PICK
- Deliverable modal present: TID-DL-MODAL, TID-DL-DIALOG, fields TID-DL-MILESTONE, TID-DL-DROPDOWN, TID-DL-ADD-NEW, TID-DL-NEW-TEXT (spellcheck), TID-DL-ASSIGNEE, TID-DL-INVITE; controls TID-DL-SAVE, TID-DL-CANCEL/Close. No date selectors in Deliverable modal.
- Task modal present: TID-TASK-MODAL, TID-TASK-DIALOG, fields TID-TASK-TITLE, TID-TASK-START, TID-TASK-END, TID-TASK-ASSIGNEE, TID-TASK-INVITE, selectors TID-TASK-MILESTONE, TID-TASK-DELIVERABLE; controls TID-TASK-SAVE, TID-TASK-CANCEL/Close
- Duration filter modal present: TID-DUR-MODAL, TID-DUR-DIALOG (role=dialog, aria-modal=true), operators TID-DUR-OP-LT/GT/EQ, input TID-DUR-DAYS-1, actions TID-DUR-APPLY, TID-DUR-CANCEL

Behavior hooks
- computeStatusDescriptor function exists in client script (status auto from dates)
- Numbering and trace labels placeholders present: TID-MS-NUM, TID-DL-NUM, TID-TASK-NUM, TID-TRACE
- Filters exist: TID-PROJ-FILTER-TYPE (multi), TID-PROJ-FILTER-FROM, TID-PROJ-FILTER-TO

Timeline checks (presence)
- Project Setup: Start/End inputs removed; TID-PSETUP-OPEN-TIMELINE present
- Timelines page: data-testid="TID-TL-PAGE", data-testid="TID-TL-CANVAS"
- Axis layers: data-testid="TID-TL-AXIS-MONTHS", data-testid="TID-TL-AXIS-WEEKS", data-testid="TID-TL-AXIS-DAYS"
- Controls: data-testid="TID-TL-ZOOM-IN", data-testid="TID-TL-ZOOM-OUT", data-testid="TID-TL-PAN-PREV", data-testid="TID-TL-PAN-NEXT", data-testid="TID-TL-ZOOM-LABEL", data-testid="TID-TL-BACK"
- Lanes at minimum: data-testid="TID-TL-LANE-PROJ", data-testid="TID-TL-BAR-PROJ"; if milestones exist: data-testid="TID-TL-LANE-MS-1" and data-testid="TID-TL-BAR-MS-1"

Post-save checks
- After saving a project, TID-PROJ-DETAIL becomes visible and TID-PROJ-TITLE matches the project name
- TID-PROJ-SUMMARY becomes visible and contains values for all columns
- Legacy list elements and hierarchy are hidden post-save for a clean page

