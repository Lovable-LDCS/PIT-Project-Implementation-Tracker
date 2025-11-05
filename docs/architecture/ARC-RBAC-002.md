---
id: ARC-RBAC-002
title: Permissions Matrix - Roles × Capabilities (Structure)
status: Draft v1.0
scope: Matrix UI with roles on rows and capabilities on columns; checkboxes to toggle permissions (placeholder behavior)
---

1) Structure (DOM requirements)
- Container: data-testid="TID-ROLE-MATRIX"
- Roles list container: data-testid="TID-ROLEM-ROLES"
- Capabilities header row container: data-testid="TID-ROLEM-CAPS"
- At least one role row with data-testid="TID-ROLEM-ROW-ADMIN"
- At least three capability headers with test IDs:
  - TID-ROLEM-CAP-CREATE
  - TID-ROLEM-CAP-EDIT
  - TID-ROLEM-CAP-VIEW
- At least three corresponding checkboxes for ADMIN row:
  - data-testid="TID-ROLEM-CHECK-ADMIN-CREATE"
  - data-testid="TID-ROLEM-CHECK-ADMIN-EDIT"
  - data-testid="TID-ROLEM-CHECK-ADMIN-VIEW"

2) Accessibility
- Checkboxes must be focusable and have labels associated via for/id or aria-label.
- Focus order: from first capability header to first checkbox and row continues left-to-right.

3) Acceptance Criteria
- All elements above exist (presence-level).
- Behavior hooks present (static verification):
  - A function named roleMatrixToggle(role, cap) exists
  - A function named roleMatrixAddRole(name) exists (placeholder)
  - Keyboard interaction: checkboxes are reachable via Tab order (implicit)
