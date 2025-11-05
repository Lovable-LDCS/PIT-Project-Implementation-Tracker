---
id: ARC-EVIDENCE-001
title: Evidence Upload Panel
status: Draft v1.1
scope: Single evidence per leaf item with basic behavior hooks
---

1) Structure
- Container: data-testid="TID-EVIDENCE-UPLOAD"
- File input: data-testid="TID-EV-FILE" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.mp4"
- Evidence hint text: data-testid="TID-EV-HINT"
- Upload button: data-testid="TID-EV-UPLOAD-BTN" (type="button")
- Remove button: data-testid="TID-EV-REMOVE-BTN" (type="button")
- File name label: data-testid="TID-EV-FILENAME"

2) Behavior hooks
- evidenceInit()
- evidenceSetFileName(name)
- evidenceUpload()
- evidenceRemove()

3) Acceptance Criteria (QA)
- Presence of all elements
- Buttons have type="button"
- Functions listed in (2) exist in page script
