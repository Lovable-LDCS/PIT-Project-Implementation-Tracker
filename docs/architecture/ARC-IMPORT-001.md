---
id: ARC-IMPORT-001
title: Import Wizard
status: Draft v1.1
scope: CSV/Excel import (structure + hooks)
---

1) Structure
- Container: data-testid="TID-IMPORT-WIZARD"
- File input: data-testid="TID-IMP-FILE"
- Mapping area: data-testid="TID-IMP-MAP"
- Validate button: data-testid="TID-IMP-VALIDATE" type="button"
- Import button: data-testid="TID-IMP-IMPORT" type="button"

2) Hooks
- importInit(), importValidate(), importRun()

3) Acceptance Criteria
- Presence and hooks exist
