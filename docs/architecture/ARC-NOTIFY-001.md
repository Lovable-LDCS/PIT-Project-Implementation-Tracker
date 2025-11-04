---
id: ARC-NOTIFY-001
title: Notification Preferences
status: Draft v1.2
scope: User notification settings (structure + hooks)
---

1) Structure
- Container: data-testid="TID-NOTIFY-PREFERENCES"
- Email frequency select: data-testid="TID-NOTIFY-FREQ"
- Quiet hours toggle/input: data-testid="TID-NOTIFY-QUIET"
- Save button: data-testid="TID-NOTIFY-SAVE" type="button"

2) Hooks & Wiring
- Hooks: notifyInit(), notifySave()
- Required wiring: TID-NOTIFICATIONS-BTN -> navigateTo('#/notify'); TID-NOTIFY-SAVE -> notifySave()

3) Acceptance Criteria
- Presence of elements above and hooks in page script
