---
id: QA-RBAC-002
title: QA - Permissions Matrix (Presence + hooks)
component: ARC-RBAC-002
status: Draft v1.1
---

Checks
- Script hooks must exist:
  - roleMatrixToggle
  - roleMatrixAddRole
- Presence
- data-testid="TID-ROLE-MATRIX"
- data-testid="TID-ROLEM-ROLES"
- data-testid="TID-ROLEM-CAPS"
- data-testid="TID-ROLEM-ROW-ADMIN"
- data-testid="TID-ROLEM-CAP-CREATE"
- data-testid="TID-ROLEM-CAP-EDIT"
- data-testid="TID-ROLEM-CAP-VIEW"
- data-testid="TID-ROLEM-CHECK-ADMIN-CREATE"
- data-testid="TID-ROLEM-CHECK-ADMIN-EDIT"
- data-testid="TID-ROLEM-CHECK-ADMIN-VIEW"
- A11y sanity: input[type=checkbox][data-testid^="TID-ROLEM-CHECK-"] present
