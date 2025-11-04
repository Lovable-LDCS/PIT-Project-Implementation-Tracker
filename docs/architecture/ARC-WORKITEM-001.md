---
id: ARC-WORKITEM-001
title: Work Item Detail View
status: Draft v1.1
scope: Action Item/Task detail view with basic behavior hooks
---

1) Structure
- Container: data-testid="TID-WORKITEM-DETAIL"
- Form: data-testid="TID-WI-FORM"
- Fields:
  - Name input: data-testid="TID-WI-NAME"
  - Description textarea: data-testid="TID-WI-DESCRIPTION"
  - Type select (Action Item/Task): data-testid="TID-WI-TYPE"
  - Planned start: data-testid="TID-WI-START"
  - Planned end: data-testid="TID-WI-END"
  - Duration (days/hours): data-testid="TID-WI-DURATION"
  - Assignee select: data-testid="TID-WI-ASSIGNEE"
  - Progress (0–100): data-testid="TID-WI-PROGRESS"
  - Success indicator: data-testid="TID-WI-SUCCESS-INDICATOR"
  - Add dependency control: data-testid="TID-WI-DEPENDENCIES-ADD"
- Actions:
  - Accept: data-testid="TID-WI-ACCEPT-BTN"
  - Edit: data-testid="TID-WI-EDIT-BTN"
  - Reject: data-testid="TID-WI-REJECT-BTN"
- Progress label: data-testid="TID-WI-PROGRESS-LABEL"

2) Behavior hooks
- workItemInit()
- workItemAccept(), workItemReject(), workItemEdit()
- linkPredecessor(id)
- updateProgressLabel(value) updates TID-WI-PROGRESS-LABEL

3) Acceptance Criteria (QA)
- Presence of all fields and actions
- Buttons have type="button"
- Functions listed in (2) exist in the page script
