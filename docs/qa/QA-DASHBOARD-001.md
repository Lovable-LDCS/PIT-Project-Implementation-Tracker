---
id: QA-DASHBOARD-001
title: QA Spec - Dashboard KPIs and Filters
status: Draft v1.0
component: ARC-DASHBOARD-001
---

Checks
- src/frontend/index.html must contain:
  - data-testid="TID-DASHBOARD"
  - data-testid="TID-DASH-FILTERS"
  - data-testid="TID-DASH-KPI-OVERDUE"
  - data-testid="TID-DASH-KPI-DUE"
  - data-testid="TID-DASH-KPI-COMPLETION"

Fail-fast
- If any selector is missing, print Red X and exit with code 1.
