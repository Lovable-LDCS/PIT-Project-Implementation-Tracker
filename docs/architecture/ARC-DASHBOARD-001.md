---
id: ARC-DASHBOARD-001
title: Dashboard - Roll-up KPIs and Filters
status: Draft v1.1
owner: Main Admin
scope: Dashboard content inside the global shell
---

1) Context & Goals
- Provide an overview of performance with roll-up KPIs and filters across OrgGroup/Company/Department/Person/Project.

2) Layout
- Container data-testid="TID-DASHBOARD"
- Filters bar data-testid="TID-DASH-FILTERS"
- KPI cards:
  - Overdue items data-testid="TID-DASH-KPI-OVERDUE"
  - Due soon items data-testid="TID-DASH-KPI-DUE"
  - Completion rate data-testid="TID-DASH-KPI-COMPLETION"

3) Accessibility
- KPI cards are buttons/links with descriptive labels and aria-describedby counts.

4) Wiring Requirements
- Minimal acceptable wiring for KPI buttons (architecture-first):
  - TID-DASH-KPI-OVERDUE -> navigateTo('#/projects')
  - TID-DASH-KPI-DUE -> navigateTo('#/projects')
  - TID-DASH-KPI-COMPLETION -> navigateTo('#/projects')

5) Acceptance Criteria
- The following elements exist in the DOM:
  - TID-DASHBOARD, TID-DASH-FILTERS, TID-DASH-KPI-OVERDUE, TID-DASH-KPI-DUE, TID-DASH-KPI-COMPLETION
- QA confirms addEventListener wiring presence for the KPI buttons (or inline onclick).
