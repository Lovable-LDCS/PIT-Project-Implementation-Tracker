---
id: ARC-RBAC-003
title: User Access Matrix (All-access baseline)
status: Draft v1.0
scope: Roles × Functions matrix with users as columns (baseline grants: allow all)
---

1) Structure (DOM)
- Container: data-testid="TID-ACCESS-MATRIX"
- Roles list (rows): data-testid="TID-AM-ROLES"
  - Roles: Main Admin, Company Admin, Project Lead, Milestone Lead, Deliverable Lead, Project Member
- Functions list (cols header): data-testid="TID-AM-FUNCS"
  - Use sidebar items as initial functions: Dashboard, Projects, Reports, Permissions, Work Item, Evidence, Gantt, Audit Log, Notifications, Import, Exports, Templates, Search
- Grid body: data-testid="TID-AM-GRID"
  - Checkboxes for each role×function cell

2) Hooks
- accessMatrixInit(), accessMatrixGrant(role, func, value)

3) Acceptance Criteria (QA)
- Presence of containers and grant checkboxes
- Hooks exist in script
