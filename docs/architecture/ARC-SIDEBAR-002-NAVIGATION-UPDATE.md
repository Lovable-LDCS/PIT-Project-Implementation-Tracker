---
id: ARC-SIDEBAR-002
title: Sidebar Navigation - Updated Menu Structure and QA Integration
status: Draft v2.0
scope: Sidebar menu restructuring per user requirements - rename, remove, and wire QA dashboard
date: 2025-11-11
supersedes: ARC-APP-SHELL-001 (partially)
---

## 1. Context & Goals

### Purpose
Update the sidebar navigation to match the current application scope and user requirements:
- Rename items for clarity
- Remove unnecessary or out-of-scope items
- Wire QA Dashboard functionality
- Maintain clean, organized navigation structure

### Success Metrics
- Sidebar reflects accurate, useful navigation options
- No dead links or placeholders
- QA section fully wired and functional
- Clear separation between regular and admin-only items

## 2. Navigation Structure

### 2.1 Top Section (All Users)

**Dashboard** (Keep as-is)
- Label: "Dashboard"
- Route: `#/`
- Test ID: TID-NAV-DASHBOARD
- Purpose: Overview of all projects, KPIs, and status

**Implementation** (Renamed from "Projects")
- Label: "Implementation" (was "Projects")
- Route: `#/projects`
- Test ID: TID-NAV-PROJECTS (unchanged)
- Purpose: Main project tracking page with hierarchy
- **Rationale**: "Implementation" better reflects the purpose of tracking project execution

**Reports** (Keep)
- Label: "Reports"
- Route: `#/reports`
- Test ID: TID-NAV-REPORTS
- Purpose: Report generation hub (to be configured)
- **Status**: Leave for now, will be configured later

**Permissions** (Keep)
- Label: "Permissions"
- Route: `#/permissions`
- Test ID: TID-NAV-PERMISSIONS
- Purpose: Track permission change requests and escalations
- **Note**: Will track changes to project parameters that require authorization

**Work Item** (Remove)
- ❌ **REMOVE THIS ITEM**
- Reason: Not needed, functionality integrated into Projects/Implementation page
- Test ID to remove: TID-NAV-WORKITEM

**Evidence** (Keep for now)
- Label: "Evidence"
- Route: `#/evidence`
- Test ID: TID-NAV-EVIDENCE
- Purpose: Evidence upload and management
- **Note**: Leave for now, may be processed differently in future

**Gantt** (Keep for now)
- Label: "Gantt"
- Route: `#/gantt`
- Test ID: TID-NAV-GANTT
- Purpose: Full Gantt functionality
- **Status**: Will implement comprehensive Gantt going forward

**Timelines** (Renamed and consolidated)
- Label: "Timelines" (was "Timelines (Test)")
- Route: `#/timelines` (was `#/tl-test`)
- Test ID: TID-NAV-TIMELINES (unchanged)
- **Action Required**: 
  - Delete original `#/timelines` page
  - Rename `#/tl-test` route to `#/timelines`
  - Remove "Timelines (Test)" navigation item (TID-NAV-TL-TEST)
  - Update "Timelines" to point to redesigned timeline page

**Audit Log** (Keep)
- Label: "Audit Log"
- Route: `#/audit`
- Test ID: TID-NAV-AUDIT
- Purpose: Audit log viewing (to be configured)
- **Status**: Leave, still to be configured

**Notifications** (Keep for now)
- Label: "Notifications"
- Route: `#/notify`
- Test ID: TID-NAV-NOTIFY
- Purpose: Notification preferences
- **Status**: Leave for now

**Import** (Keep)
- Label: "Import"
- Route: `#/import`
- Test ID: TID-NAV-IMPORT
- Purpose: Import existing projects from elsewhere
- **Status**: Still to be configured

**Templates** (Keep for now)
- Label: "Templates"
- Route: `#/templates`
- Test ID: TID-NAV-TEMPLATES
- Purpose: Unknown at this time
- **Status**: Leave for now

**Search** (Remove)
- ❌ **REMOVE THIS ITEM**
- Reason: Filter and search functions available in relevant pages
- Test ID to remove: TID-NAV-SEARCH

**Quality Assurance** (Wire and create QA Dashboard)
- Label: "Quality Assurance"
- Route: `#/qa`
- Test ID: TID-NAV-QA
- Purpose: QA dashboard and tools
- **Action Required**: Wire existing QA page, create comprehensive QA dashboard

### 2.2 Admin Section (Admin-only, below divider)

**Divider**
- Visual separator (hr.admin-divider)
- Label: "Admin Tools" (div.admin-section-label)

**Invite Members** (Keep)
- Label: "Invite Members"
- Route: `#/invite-members`
- Test ID: TID-NAV-INVITE-MEMBERS
- Purpose: Admin tool to invite new team members
- **Admin-only**: Yes

**Security Dashboard** (Keep)
- Label: "Security Dashboard"
- Route: `#/security-dashboard`
- Test ID: TID-NAV-SECURITY-DASHBOARD
- Purpose: Security status and access control monitoring
- **Admin-only**: Yes

**Health Checker** (Keep)
- Label: "Health Checker"
- Route: `#/health-checker`
- Test ID: TID-NAV-HEALTH-CHECKER
- Purpose: System health and QA check runner
- **Admin-only**: Yes

## 3. Navigation Removal Details

### 3.1 Items to Remove

1. **Work Item** (TID-NAV-WORKITEM)
   - Remove from sidebar HTML
   - Remove route handler for `#/workitem`
   - Remove TID-WORKITEM-DETAIL section
   - **Justification**: Functionality merged into Projects page

2. **Search** (TID-NAV-SEARCH)
   - Remove from sidebar HTML
   - Remove route handler for `#/search`
   - Remove TID-SEARCH-RESULTS section
   - **Justification**: Search/filter available in relevant pages

3. **Timelines (Test)** (TID-NAV-TL-TEST)
   - Remove from sidebar HTML
   - Rename route `#/tl-test` to `#/timelines`
   - Remove old `#/timelines` route handler
   - Consolidate to single timeline experience
   - **Justification**: Test timeline is now the primary timeline

4. **Exports** (TID-NAV-EXPORTS) - If present
   - Check if this exists separately from Reports
   - If redundant, remove

### 3.2 Code Changes Required

**index.html changes**:
```html
<!-- REMOVE these nav items -->
<a href="#/workitem" data-testid="TID-NAV-WORKITEM" onclick="return appNavTo(this)">Work Item</a>
<a href="#/search" data-testid="TID-NAV-SEARCH" onclick="return appNavTo(this)">Search</a>
<a href="#/tl-test" data-testid="TID-NAV-TL-TEST" onclick="return appNavTo(this)">Timelines (Test)</a>

<!-- RENAME this nav item -->
<a href="#/projects" data-testid="TID-NAV-PROJECTS" onclick="return appNavTo(this)">Projects</a>
<!-- TO -->
<a href="#/projects" data-testid="TID-NAV-PROJECTS" onclick="return appNavTo(this)">Implementation</a>
```

**app-main.js or navigation routing changes**:
```javascript
// REMOVE these routes from navigateTo() function
'#/workitem': 'TID-WORKITEM-DETAIL',
'#/search': 'TID-SEARCH-RESULTS',

// CHANGE this route
'#/tl-test': 'TID-TL-TEST-PAGE',
// TO
'#/timelines': 'TID-TL-TEST-PAGE', // Use test timeline page as primary

// REMOVE old timelines route
'#/timelines': 'TID-TL-PAGE', // DELETE THIS
```

**Section removal**:
```html
<!-- REMOVE these sections from index.html -->
<section data-testid="TID-WORKITEM-DETAIL" hidden>...</section>
<section data-testid="TID-SEARCH-RESULTS" hidden>...</section>
<section data-testid="TID-TL-PAGE" hidden>...</section> <!-- Old timelines page -->

<!-- RENAME this section -->
<section data-testid="TID-TL-TEST-PAGE" hidden>...</section>
<!-- Optionally change test ID to TID-TL-PAGE for consistency -->
```

## 4. Quality Assurance Section

### 4.1 QA Dashboard Page Requirements

**Purpose**: Centralized dashboard for QA operations, test running, and health monitoring

**Route**: `#/qa`

**Test ID**: TID-QA-PAGE

**Components**:

1. **QA Test Runner Card**:
   - Component selector dropdown (TID-QA-COMPONENT)
     - Options: Timelines (Test), Dashboard, Projects, etc.
   - "Run QA tests" button (TID-QA-RUN)
   - Test counts: Tests run (TID-QA-RUN-COUNT), Passed (TID-QA-PASS-COUNT)
   - App performance indicator (TID-QA-PERF)

2. **Screenshot Tools Card**:
   - "Show latest clipboard image" button (TID-QA-SHOW-CLIP)
   - Clipboard URL display (TID-QA-CLIP-URL)
   - Image display (TID-QA-CLIP-IMG)
   - "Describe latest screenshot" button (TID-QA-DESCRIBE-CLIP)
   - Description status (TID-QA-CLIP-DESC-STATUS)
   - Description output (TID-QA-CLIP-DESC)

3. **Test Failure List**:
   - Container: TID-QA-FAIL-LIST
   - Displays failing tests with details
   - Links to relevant components

### 4.2 Integration with Health Checker

**Relationship**:
- QA Dashboard: Developer/QA-focused tools for testing components
- Health Checker: Admin-focused system health and architecture compliance

**Shared Functionality**:
- Both can trigger QA test runs
- Both display test results
- Health Checker has additional strict mode and architecture checks

**Separation**:
- QA Dashboard: Open to developers, component-level testing
- Health Checker: Admin-only, system-level health verification

## 5. UI/UX Requirements

### 5.1 Sidebar Organization

**Visual Structure**:
```
┌─────────────────────────┐
│ [Company Filter]        │
│ [Department Filter]     │
├─────────────────────────┤
│ Dashboard               │
│ Implementation          │ ← Renamed
│ Reports                 │
│ Permissions             │
│ Evidence                │
│ Gantt                   │
│ Timelines               │ ← Consolidated
│ Audit Log               │
│ Notifications           │
│ Import                  │
│ Templates               │
│ Quality Assurance       │ ← Wired
├─────────────────────────┤
│ ━━━━ Admin Tools ━━━━   │
│ Invite Members          │
│ Security Dashboard      │
│ Health Checker          │
├─────────────────────────┤
│ Role: [Admin ▼]         │
│ [Reset Session]         │
└─────────────────────────┘
```

**Items Removed**:
- ~~Work Item~~
- ~~Search~~
- ~~Timelines (Test)~~
- ~~Exports~~ (if redundant)

### 5.2 Active State Indication

**Current Route Highlighting**:
- Active link has `aria-current="page"`
- Visual styling: Bold text, highlight background, left border indicator
- Updates dynamically on navigation

**Keyboard Navigation**:
- Tab order follows visual order
- Focus visible on all navigation links
- Enter/Space activates link

## 6. Acceptance Criteria

### 6.1 Navigation Structure

- [ ] "Dashboard" remains first item
- [ ] "Projects" renamed to "Implementation"
- [ ] "Work Item" removed from sidebar
- [ ] "Search" removed from sidebar
- [ ] "Timelines (Test)" removed from sidebar
- [ ] "Timelines" navigates to redesigned timeline page (formerly test timeline)
- [ ] "Quality Assurance" link present and functional
- [ ] Admin section contains exactly 3 items: Invite Members, Security Dashboard, Health Checker
- [ ] Admin section hidden when role !== Admin
- [ ] Admin section visible when role === Admin

### 6.2 Route Functionality

- [ ] All remaining sidebar links navigate to correct routes
- [ ] No 404 errors or broken links
- [ ] Removed routes (`#/workitem`, `#/search`, `#/tl-test`) no longer accessible
- [ ] `#/timelines` route serves the redesigned timeline page
- [ ] Breadcrumb updates correctly for all routes
- [ ] Active state highlights correct navigation item

### 6.3 QA Dashboard

- [ ] QA page accessible via "Quality Assurance" sidebar link
- [ ] Page renders with test runner, screenshot tools, and failure list
- [ ] All test IDs present: TID-QA-PAGE, TID-QA-COMPONENT, TID-QA-RUN, etc.
- [ ] Component selector populated with available components
- [ ] "Run QA" button triggers test execution
- [ ] Test results display in UI
- [ ] Screenshot tools functional

### 6.4 Code Cleanup

- [ ] Removed navigation items deleted from HTML
- [ ] Removed routes deleted from JavaScript routing logic
- [ ] Removed page sections deleted from HTML
- [ ] No dead code or unused functions related to removed items
- [ ] No console errors after navigation changes
- [ ] Linting passes with no warnings about undefined routes

## 7. Testing Requirements

### 7.1 Manual Testing Checklist

- [ ] Click each sidebar link and verify correct page loads
- [ ] Verify "Implementation" (formerly "Projects") shows projects page
- [ ] Verify "Timelines" shows redesigned timeline (not test version)
- [ ] Verify "Quality Assurance" shows QA dashboard
- [ ] Verify removed items (Work Item, Search) are gone
- [ ] Test admin toggle (set role to Admin/User) and verify admin items show/hide
- [ ] Navigate via browser back/forward, verify sidebar highlights correct item
- [ ] Test keyboard navigation through sidebar links

### 7.2 Automated Tests

**Navigation Tests** (`tests/e2e/navigation.spec.js`):
```javascript
test('sidebar contains correct navigation items', async ({ page }) => {
  // Check renamed item
  await expect(page.locator('[data-testid="TID-NAV-PROJECTS"]')).toContainText('Implementation');
  
  // Check removed items don't exist
  await expect(page.locator('[data-testid="TID-NAV-WORKITEM"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="TID-NAV-SEARCH"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="TID-NAV-TL-TEST"]')).not.toBeVisible();
  
  // Check consolidated timelines
  await expect(page.locator('[data-testid="TID-NAV-TIMELINES"]')).toBeVisible();
  
  // Check QA section
  await expect(page.locator('[data-testid="TID-NAV-QA"]')).toBeVisible();
});

test('removed routes return 404 or redirect', async ({ page }) => {
  await page.goto('/#/workitem');
  // Should show error or redirect to dashboard
  await expect(page.locator('[data-testid="TID-WORKITEM-DETAIL"]')).not.toBeVisible();
  
  await page.goto('/#/search');
  await expect(page.locator('[data-testid="TID-SEARCH-RESULTS"]')).not.toBeVisible();
});

test('timelines route serves redesigned page', async ({ page }) => {
  await page.goto('/#/timelines');
  await expect(page.locator('[data-testid="TID-TL-TEST-PAGE"]')).toBeVisible(); // Or new test ID
  await expect(page.locator('[data-testid="TID-TL-PAGE"]')).not.toBeVisible(); // Old page should not exist
});
```

## 8. Migration Notes

### 8.1 Breaking Changes

**Routes**:
- `#/workitem` → Removed (redirect to `#/projects`)
- `#/search` → Removed (redirect to `#/`)
- `#/tl-test` → Removed (redirect to `#/timelines`)
- `#/timelines` → Now serves redesigned timeline page

**Deep Links**:
- Any external links to removed routes will break
- Update documentation with new route structure
- Consider redirect rules for old URLs

### 8.2 User Communication

**Change Notification**:
```
Navigation Update - November 2025

We've streamlined the sidebar navigation:

✓ "Projects" renamed to "Implementation" for clarity
✓ "Timelines" page redesigned with improved matrix view
✓ "Quality Assurance" section now available
✗ "Work Item" and "Search" removed (functionality integrated elsewhere)

Please update any bookmarks to old routes.
```

## 9. Open Questions

1. **Q**: Should we add a redirect for old routes or just return 404?
   **A**: Add temporary redirects for 30 days, then remove.

2. **Q**: Is "Exports" separate from "Reports"?
   **A**: Check implementation. If redundant, remove.

3. **Q**: Should QA Dashboard be admin-only?
   **A**: No, available to all users for now. May restrict later.

4. **Q**: What happens to existing "Work Item" data?
   **A**: Migrate to Projects page structure. Archive old work items.

## 10. Deployment Plan

### 10.1 Rollout Strategy

**Phase 1: Code Changes**
1. Update sidebar HTML (rename, remove items)
2. Update routing logic (remove old routes, redirect to new)
3. Remove unused page sections
4. Wire QA Dashboard

**Phase 2: Testing**
1. Run automated navigation tests
2. Manual QA of all sidebar links
3. Verify admin section visibility logic
4. Test on multiple browsers

**Phase 3: Deployment**
1. Deploy to staging environment
2. Stakeholder review and approval
3. Deploy to production
4. Monitor for errors/issues

**Phase 4: Cleanup**
1. Remove temporary redirects after 30 days
2. Archive old timeline code
3. Delete unused assets

### 10.2 Rollback Plan

If issues arise:
1. Revert sidebar HTML changes
2. Restore old routing logic
3. Restore removed page sections
4. Redeploy previous version

---

**Document Version**: 2.0
**Last Updated**: 2025-11-11
**Author**: One Time Build Agent
**Approval Required**: Main Admin (Johan)
