---
id: ARC-PROJECTS-SETUP-001
title: Project Setup - New Project CTA and Modal
status: Draft v1.3
scope: Timeline-first project creation modal; three entry points; returns to modal post-timeline for member invite
---

1) Entry points
- Top bar CTA: data-testid="TID-START-PROJECT-BTN" (primary button in blue bar)
- Projects page CTA: data-testid="TID-PAGE-START-PROJECT-BTN" (visible in Projects page header/empty state)
- Timelines page CTA: data-testid="TID-TL-CREATE-PROJECT" (visible on Timelines toolbar)

2) Modal structure (DOM)
- Modal container (overlay): data-testid="TID-PSETUP-MODAL" (hidden by default)
- Modal dialog: data-testid="TID-PSETUP-DIALOG" role="dialog" aria-modal="true"
- Fields:
  - Project name: data-testid="TID-PSETUP-NAME"
  - Project outcome: data-testid="TID-PSETUP-OUTCOME"
  - Project description: data-testid="TID-PSETUP-DESCRIPTION"
  - Assignee (default current user): data-testid="TID-PSETUP-ASSIGNEE"
  - Invite new member button: data-testid="TID-PSETUP-INVITE-BTN"
- Timeline-first policy: there are NO Start/End date inputs in this modal; dates are set visually in Timelines via a slider bar.
- Timeline button placement & flow:
  - Set timeline button: data-testid="TID-PSETUP-OPEN-TIMELINE" is positioned bottom-right, directly above the Invite member button, to reflect workflow.
  - Clicking Set timeline navigates to Timelines (#/timelines), opens the timeline-first creator where the project bar can be created/edited.
  - After Apply on Timelines, navigation returns to this modal so the user can click Invite member.
- Textareas (Outcome, Description) span full width of dialog, support scrollbars and vertical resize
- Actions:
  - Save: data-testid="TID-PSETUP-SAVE" (type=button)
  - Cancel: data-testid="TID-PSETUP-CANCEL" (type=button)
  - Close (X): data-testid="TID-PSETUP-CLOSE" (type=button)
- Dismiss behavior: modal is hidden by default and closes on Cancel, Close (X), overlay click, Escape key, and on route change (hashchange)

3) Behavior hooks (client only for MVP)
- openProjectSetup(), closeProjectSetup(), setupProjectInit()
- on save: navigate to Projects page, set project header to project name, append a row to the projects table, update results count, hide empty state
- generateItemId(kind, parentPath) returns a human-readable code

4) Numbering guidance
- Human labels: M1, M2, ...; D1 under each milestone; Tasks T1 under each deliverable
- Composite identifier for traceability: <ProjectCode>.M<index>.D<index>.T<index> (stored in metadata later)

5) Acceptance Criteria (QA)
- Presence of entry CTA in top bar and Projects page body (empty state CTA)
- Presence of modal fields and action buttons
- Modal has hidden attribute by default
- Hooks exist in script, including saveProject()
- Dismiss controls present: Cancel and Close (X)
- Overlay click and Escape close handlers present
- Hashchange handler closes modal
- Dialog element has role="dialog" and aria-modal="true"
- Projects page contains a header container data-testid="TID-PROJ-HEADER" for the active project name
