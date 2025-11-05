---
id: ARC-WIRING-001
title: UI Wiring Policy — Required, Disallowed, and Pending
status: Draft v1.0
scope: Architecture-first clickables wiring, disallowed controls, and "pending-ok" policy enforced by QA
---

1) Purpose
- Ensure a consistent, architecture-first approach to wiring UI clickables (buttons/anchors) across the application.
- Provide a single place to declare:
  - Required wiring targets for the current scope ("Keep" list)
  - Disallowed controls that must not appear in the build (until explicitly re-scoped)
  - The temporary "pending-ok" policy for items acknowledged but not yet implemented (must be cleared before handover)

2) Required Clickables (Keep list) — minimal acceptable wiring
- Dashboard
  - TID-DASH-KPI-OVERDUE: navigateTo('#/projects')
  - TID-DASH-KPI-DUE: navigateTo('#/projects')
  - TID-DASH-KPI-COMPLETION: navigateTo('#/projects')
- Notifications/Settings
  - TID-NOTIFICATIONS-BTN: navigateTo('#/notify')
  - TID-PROFILE-MENU: navigateTo('#/settings')
  - TID-NOTIFY-SAVE: notifySave()
- Gantt
  - TID-GANTT-ADD-LINK: ganttAddLink() placeholder acceptable
- Projects
  - TID-PROJ-CREATE-BTN: openProjectSetup()
  - TID-PROJ-IMPORT-BTN: navigateTo('#/import') then importInit()
- Work Item
  - TID-WI-DEPENDENCIES-ADD: linkPredecessor() placeholder acceptable

Notes:
- Handlers may be placeholders that log or open a stub, provided the addEventListener binding exists (no dead buttons).
- Final behaviors can evolve; QA checks for wiring presence, not business logic completeness.

3) Disallowed Controls (out of scope now)
- Invite buttons must not appear in the build until the flow is fully specified and approved:
  - TID-PSETUP-INVITE-BTN
  - TID-MS-INVITE
  - TID-DL-INVITE
  - TID-TASK-INVITE
- QA fails RED if any of these reappear in index.html.

4) Pending-OK Policy (temporary)
- Definition: A small, explicit allowlist of clickables that are acknowledged by architecture but not yet wired may be marked as [PENDING] by QA without failing the build.
- Goals:
  - Keep the build GREEN during staged delivery while surfacing gaps early.
  - Ensure all pendings are resolved (wired) before handover.
- QA Behavior:
  - Generic unwired-clickable detector scans all <button> and <a> with data-testid.
  - If a clickable has no inline onclick and no JS addEventListener wiring in app-main.js, QA either:
    - Logs [PENDING] for IDs in the allowlist; or
    - Fails the build for all others.
- Current pending allowlist:
  - TID-SIDEBAR (structural navigation container; not a user-action clickable)
- Process:
  - Additions to the pending allowlist require explicit approval in architecture review.
  - The allowlist must be driven to empty before handover.

5) Evidence & QA
- QA (scripts/qa/qa-check.ps1) enforces:
  - All required clickables above are detected as wired via addEventListener or inline onclick.
  - Disallowed controls are absent (build fails if present).
  - Pending allowlist items log [PENDING] and do not fail.
- Runtime assertions and Problems panel remain in place to surface misalignment during manual testing.

6) Versioning & Ownership
- Changes to this policy and the keep/disallow/pending sets must be versioned in this doc and reflected in QA script updates in the same change.
