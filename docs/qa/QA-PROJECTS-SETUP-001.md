---
id: QA-PROJECTS-SETUP-001
title: QA - Project Setup (CTA + Modal)
component: ARC-PROJECTS-SETUP-001
status: Draft v1.4
---

Checks
- Presence: TID-START-PROJECT-BTN in top bar, TID-PAGE-START-PROJECT-BTN in Projects page, and TID-TL-CREATE-PROJECT in Timelines page toolbar
- Modal elements: TID-PSETUP-MODAL, TID-PSETUP-DIALOG, TID-PSETUP-NAME, TID-PSETUP-OUTCOME, TID-PSETUP-DESCRIPTION, TID-PSETUP-ASSIGNEE, TID-PSETUP-INVITE-BTN (timeline-first: no Start/End inputs)
- Actions: TID-PSETUP-SAVE, TID-PSETUP-CANCEL, TID-PSETUP-CLOSE (type=button)
- Modal default hidden attribute present
- Dismiss behavior hooks: overlay click closes, Escape closes, hashchange closes
- Dialog has role=dialog and aria-modal=true
- Hooks: openProjectSetup, closeProjectSetup, setupProjectInit, generateItemId, saveProject; Set timeline button navigates to #/timelines; Apply returns flow to modal for Invite member
- Wiring: setupProjectInit wires click handler to TID-PSETUP-SAVE (QA checks for the handler attribute data-wired). TID-PSETUP-OPEN-TIMELINE is positioned above TID-PSETUP-INVITE-BTN in markup
- Projects header container exists: TID-PROJ-HEADER
