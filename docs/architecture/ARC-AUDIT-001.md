---
id: ARC-AUDIT-001
title: Audit Log Page
status: Draft v1.1
scope: Tamper-evident audit trail UI (structure + hooks)
---

1) Structure
- Container: data-testid="TID-AUDIT-LOG"
- Filters: data-testid="TID-AUD-FILTERS"
  - Date from: data-testid="TID-AUD-FROM"
  - Date to: data-testid="TID-AUD-TO"
  - User select: data-testid="TID-AUD-USER"
  - Search input: data-testid="TID-AUD-SEARCH"
- Table: data-testid="TID-AUD-TABLE" role="table"
  - Headers: TID-AUD-TH-TIME, TID-AUD-TH-ACTOR, TID-AUD-TH-ACTION, TID-AUD-TH-ENTITY
- Export button: data-testid="TID-AUD-EXPORT" type="button"

2) Hooks
- auditInit(), auditFilter(), auditExport()

3) Acceptance Criteria
- Presence of elements above and hooks in page script
