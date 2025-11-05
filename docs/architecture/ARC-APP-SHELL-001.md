---
id: ARC-APP-SHELL-001
title: Global App Shell, Navigation, and Layout
status: Draft v1.4
owner: Main Admin
scope: Frontend global shell for the Project Management platform
---

1) Context & Goals
- Provide a consistent, accessible global UI shell with: left navigation sidebar, top bar (search, notifications, profile), breadcrumbs, and a content area.
- Support hierarchical roll-ups and filters (OrgGroup → Company → Department → Person → Project)
- Define precise structure, states, ARIA, test IDs, and acceptance criteria to enable machine-checkable QA.

2) Information Architecture (Routes & Navigation)
- Navigation resiliency requirements (MVP):
  - All sidebar links must either rely on hashchange or explicitly call appNavTo(this) to force navigateTo(route).
  - Global functions used by onclick in HTML must be exposed on window after script load (e.g., window.appNavTo = appNavTo; window.openProjectSetup = openProjectSetup; etc.).
  - Route visibility: navigateTo(route) must show the corresponding page section and hide all others (by data-testid) and update aria-current on active nav.
- Primary routes (hash-based for MVP):
  - "#/" → Dashboard (group/company roll-up overview)
  - "#/projects" → Projects list
  - "#/reports" → Reports hub
  - "#/permissions" → Permissions matrix
  - "#/workitem" → Work Item Detail
  - "#/evidence" → Evidence Upload
  - "#/gantt" → Gantt View
  - "#/audit" → Audit Log
  - "#/notify" → Notification Preferences
  - "#/import" → Import Wizard
  - "#/exports" → Exports & Reports
  - "#/templates" → Templates Library
  - "#/search" → Search Results
- Global navigation (left sidebar):
  - Dashboard (TID-NAV-DASHBOARD)
  - Projects (TID-NAV-PROJECTS)
  - Reports (TID-NAV-REPORTS)
  - Permissions (TID-NAV-PERMISSIONS)
  - Work Item (TID-NAV-WORKITEM)
  - Evidence (TID-NAV-EVIDENCE)
  - Gantt (TID-NAV-GANTT)
  - Audit Log (TID-NAV-AUDIT)
  - Notifications (TID-NAV-NOTIFY)
  - Import (TID-NAV-IMPORT)
  - Exports (TID-NAV-EXPORTS)
  - Templates (TID-NAV-TEMPLATES)
  - Search (TID-NAV-SEARCH)
- Breadcrumbs (TID-BREADCRUMBS) shows current route context.

3) Layout (Shell Regions and Responsiveness)
- Root container: role="application", data-testid="TID-SHELL-ROOT".
- Top bar (TID-TOPBAR):
  - App title/brand area
  - Global search input (TID-GLOBAL-SEARCH) with accessible label
  - Org scope selector (TID-ORG-SCOPE-SELECTOR) [OrgGroup/Company/Department/Person]
  - Notifications button (TID-NOTIFICATIONS-BTN) with badge count
  - Profile menu (TID-PROFILE-MENU)
- Left sidebar (TID-SIDEBAR):
  - Collapsible; keyboard toggle button with aria-expanded
  - Navigation list with current item indicated via aria-current
  - Filter panel with Company (TID-COMPANY-FILTER), Department (TID-DEPT-FILTER)
- Content area (TID-CONTENT-AREA): main role, semantic headings
- Breadcrumbs (TID-BREADCRUMBS): nav[aria-label="Breadcrumb"] with list items
- Problems indicator and panel:
  - Top bar numeric indicator (TID-PROBLEMS-INDICATOR) shows the number of open UI/runtime problems detected (0 = none)
  - Problems panel (TID-PROBLEMS-PANEL) lists current problems, if any
- Navigation behavior (hash-based router):
  - Function navigateTo(route) exists; shows/hides relevant sections
  - Hashchange listener updates content and aria-current on nav links
  - Breadcrumb current label updates to the page label
- Responsive behavior:
  - ≥ 1200px: sidebar expanded
  - 768–1199px: sidebar collapsible; icons + tooltips
  - < 768px: sidebar off-canvas; hamburger toggle in top bar

4) UI Components and States
- Buttons: default/hover/active/disabled; focus ring visible; ARIA labels for icon buttons
- Inputs: labels or aria-label; validation message region with role="status"
- Notifications button: badge with aria-label including count
- Profile menu: opens a menu (listbox/aria roles) with items: Profile, Settings, Sign out
- Sidebar collapse: toggled by button with aria-controls referencing sidebar id

5) Accessibility Requirements (WCAG 2.2 AA)
- Keyboard navigation across all interactive elements (Tab/Shift+Tab)
- Focus management: opening menus/modals sets focus to first item; Esc closes
- Contrast ratio ≥ 4.5:1 for text; non-color cues for status
- ARIA:
  - role="application" on root, role="navigation" on sidebar, role="main" on content
  - aria-current on active nav
  - aria-labels for search, notifications, profile

6) Data & Wiring (MVP placeholders)
- No live API integration in this component; placeholders with data-testid to satisfy QA
- Filters are static for MVP; changing them logs to console and updates a placeholder label

7) Permissions (RBAC visibility only in MVP)
- All items visible; in later iterations, hide menu items based on role matrix

8) Notifications (MVP)
- Clicking notifications button shows a placeholder panel

9) Internationalization & Time
- Default locale en-ZA; strings hardcoded for MVP; i18n hooks later

10) Telemetry & Audit
- Console log placeholder for shell interactions (toggle sidebar, filter changes)

11) Visual Tokens (MVP baseline)
- Top bar height ~56px; sidebar width expanded 260px, collapsed 64px
- Colors: neutral light background; primary buttons blue; focus ring visible (e.g., #2563eb outline)

12) Button Click Wiring Requirements (MVP True North)
- All interactive buttons must be wired so a click invokes the intended action without JavaScript errors.
- For MVP, wiring is enforced via inline onclick attributes pointing to named functions, and those functions MUST be bound on window after script load.
- Critical buttons and expected handlers:
  - TID-START-PROJECT-BTN → onclick="openProjectSetup()"; window.openProjectSetup bound
  - TID-PSETUP-SAVE → onclick="saveProject()"; window.saveProject bound
  - TID-PSETUP-CANCEL, TID-PSETUP-CLOSE → onclick="closeProjectSetup()" bound
  - TID-TL-Z-YEAR/QUARTER/MONTH/WEEK/DAY → onclick="tlSetZoom('...')"; window.tlSetZoom bound
  - TID-TL-APPLY → onclick="tlApplyAndBack()"; window.tlApplyAndBack bound
  - TID-TL-BACK → onclick="backToProjects()"; window.backToProjects bound
  - TID-SET-SAVE → onclick="settingsSave()"; window.settingsSave bound
  - TID-DUR-APPLY → onclick="applyDurationFilter()"; TID-DUR-CANCEL → onclick="closeDurationModal()"
- Sidebar navigation links must include onclick="return appNavTo(this)"; window.appNavTo bound.
- No inline style attributes anywhere in HTML (presentation must be in CSS).

13) Acceptance Criteria (machine-checkable evidence)
- No inline style attributes in HTML; all presentation in CSS (QA enforces failure if style="..." is found).
- All functions used in HTML onclick must be defined and bound to window (e.g., window.appNavTo, window.openProjectSetup).
- Sidebar nav must include onclick="return appNavTo(this)" on each link (MVP) to ensure routing works even if hashchange is ignored.
- Route activation: navigateTo(route) must set aria-current on the active nav link and update breadcrumbs.
- Problems panel: problems indicator defaults to 0; any missing shell parts must raise entries in the problems list until resolved.
- Extension-origin console errors (e.g., "Unchecked runtime.lastError: The message port closed...") are allowed; app runtime must not emit ReferenceError for bound functions.

- Files exist:
  - src/frontend/index.html
- The HTML for the shell must include the following elements and attributes:
  - data-testid="TID-SHELL-ROOT" with role="application"
  - data-testid="TID-TOPBAR"
  - data-testid="TID-SIDEBAR" with role="navigation"
  - data-testid="TID-BREADCRUMBS" with nav[aria-label="Breadcrumb"]
  - data-testid="TID-GLOBAL-SEARCH" input with accessible label
  - data-testid="TID-ORG-SCOPE-SELECTOR"
  - data-testid="TID-NOTIFICATIONS-BTN"
  - data-testid="TID-PROFILE-MENU"
  - data-testid="TID-COMPANY-FILTER"
  - data-testid="TID-DEPT-FILTER"
  - data-testid="TID-NAV-DASHBOARD" with aria-current when Dashboard is active
  - data-testid="TID-NAV-PROJECTS"
  - data-testid="TID-NAV-REPORTS"
  - data-testid="TID-NAV-PERMISSIONS"
  - data-testid="TID-NAV-WORKITEM"
  - data-testid="TID-NAV-EVIDENCE"
  - data-testid="TID-NAV-GANTT"
  - data-testid="TID-NAV-AUDIT"
  - data-testid="TID-NAV-NOTIFY"
  - data-testid="TID-NAV-IMPORT"
  - data-testid="TID-NAV-EXPORTS"
  - data-testid="TID-NAV-TEMPLATES"
  - data-testid="TID-NAV-SEARCH"
  - data-testid="TID-CONTENT-AREA" with role="main"
  - A favicon <link rel="icon" ...> present using either a data URL or a path to /favicon.ico
- Accessibility checks:
  - All interactive elements are reachable via Tab order and have discernible labels
- Navigation behavior hooks (static):
  - navigateTo function exists
  - hashchange listener attached in script
  - runWiringChecks function exists and is invoked on DOMContentLoaded and after navigation
- Problems indicator checks:
  - TID-PROBLEMS-INDICATOR exists and displays "0" when no problems
  - TID-PROBLEMS-PANEL exists in the DOM (may be hidden when count is 0)
- CSS grid wiring:
  - .topbar has grid-area: topbar
  - .sidebar has grid-area: sidebar
  - .content has grid-area: content
- QA script: scripts/qa/qa-check.ps1 must validate presence of all test IDs and required roles/labels and fail with Red X if any are missing, including favicon link presence and Problems=0 unless explicitly overridden; it must also verify CSS grid-area wiring and the presence of runWiringChecks hooks.
- QA must also verify:
  - No inline style attributes are present in src/frontend/index.html
  - window bindings exist: appNavTo, openProjectSetup, closeProjectSetup, openMilestoneSetup, closeMilestoneSetup, openDeliverableSetup, closeDeliverableSetup, openTaskSetup, closeTaskSetup, openTimelines, backToProjects, tlSetZoom, tlApplyAndBack, settingsSave, closeDurationModal, applyDurationFilter
  - Critical buttons include the expected onclick attributes (as listed above)
  - Sidebar links include onclick="return appNavTo(this)"

13) Open Questions & Risks
- Navigation routing library choice (Next.js vs SPA) — deferred
- i18n library choice — deferred
- Theming library — deferred (MUI likely)
