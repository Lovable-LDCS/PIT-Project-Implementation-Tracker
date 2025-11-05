---
id: ARC-GANTT-001
title: Gantt / Timeline View
status: Draft v1.2
scope: Timeline view scaffold with dependency alerts and behavior hooks
---

1) Structure
- Container: data-testid="TID-GANTT-VIEW"
- Timeline canvas/container: data-testid="TID-GANTT-CANVAS"
- Dependency alert panel: data-testid="TID-GANTT-ALERTS"
- Add link button: data-testid="TID-GANTT-ADD-LINK" (type="button") — required wiring: ganttAddLink() placeholder acceptable

2) Behavior hooks
- ganttInit()
- ganttAddLink(predecessorId, successorId)
- ganttShowDependencyIssue(msg)

3) Acceptance Criteria (QA)
- Presence of all elements and hooks
- Add link button has type="button"
- QA detects addEventListener wiring for TID-GANTT-ADD-LINK or inline onclick
