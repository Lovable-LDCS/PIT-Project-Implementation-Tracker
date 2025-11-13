Build Methodology and Governance (True North)

Status: Draft v1.0
Owner: Main Admin (Product Owner)
Applies to: Entire project (architecture, backend, frontend, data, QA, security, compliance)

Purpose
- Establish a single source of truth (“True North”) that governs how we design, implement, verify, and accept work.
- Guarantee alignment between Architecture, QA, Implementation, and UI Review.
- Prevent regressions by enforcing automated quality checks after every change.
- Ensure international security, privacy, and accessibility best practices from day one.

Core Principles
1) Architecture-first: We do not build features until their Architecture Component is complete and approved.
2) QA-as-gate: Every build runs automated QA. Failures block handover and release.
3) UI Review closes the loop: If UI review reveals gaps, we update Architecture first, then QA, then implementation.
4) Traceability: Every requirement maps to Architecture → QA → Code → Tests → Deployment evidence.
5) No regressions: A previously passing QA check must never be silently removed or degraded.
6) Compliance by design: Security, privacy, and accessibility are specified in Architecture and enforced by QA.
7) Hierarchical roll-up by design: Data models, APIs, and UI must support company → department → person → project drilldowns and roll-ups across the group.
8) QA validates FULL functionality: QA must verify complete app functionality and wiring, not just code availability. All components defined in Architecture must be wired and functional. Wiring failures are CRITICAL severity and cause RED status.
9) Legacy components must be removed: If Architecture states a component should not exist, it must be deleted from code and QA checks (nuked, not bypassed). If code has features not in Architecture, either add to Architecture or remove from code.
10) Architecture is comprehensive: Architecture (True North) contains ALL aspects: build requirements, functionality, UI/UX, wiring, routing, deployment, data flows, etc. If the app fails, either Architecture or QA is outdated - both must be updated to maintain alignment.

Artifacts (Canonical Sources)
A. Architecture Component (True North Spec)
- Location: docs/architecture/<component>.md (can begin in this rules.md until docs/ established)
- Content must include, at minimum:
  1. Context & Goals: scope, stakeholders, success metrics.
  2. Information Architecture: navigation map, route paths, breadcrumb rules.
  3. Page & Layout Blueprints:
     - Global shell: sidebars, top bars, footers; responsive breakpoints; collapsed/expanded states.
     - Each page: wireframe, sections, empty/loading/error/permission states.
     - Modals/drawers: triggers, size, focus management, close behavior, keyboard shortcuts (Esc), trap focus.
  4. UI Components:
     - Controls: buttons, selects, search, filters, date/time pickers, sliders, toggle, chips.
     - States: default/hover/active/disabled/loading; tooltips; help text; validation messages.
     - Accessibility: ARIA roles, labels, keyboard order, tab stops, skip links.
     - Visual tokens: color, spacing, typography; non-color cues for status (icons, text labels).
  5. Data & Wiring:
     - Data contracts: request/response schemas, field types, validation, examples.
     - State flows: diagrams for create/edit/accept/approve; optimistic vs confirmed updates.
     - Dependency rules: Gantt interactions, cycle prevention, critical path behavior.
     - Progress roll-ups: item → deliverable → milestone → project → company → group.
  6. Permissions:
     - Role × capability matrix for this component; scope inheritance; read-up/write-down rules.
     - Guarded actions: who can see/execute; audit requirements; approval workflows.
  7. Notifications:
     - Events, recipients, channels (email now; SMS/WhatsApp later), content templates.
  8. Compliance & Security:
     - OWASP ASVS controls, input/output validation, CSRF/CORS, auth scopes.
     - PII handling, evidence storage policy, retention, AV/DLP steps.
  9. Internationalization & Time:
     - Default locale (en-ZA), timezone handling (UTC stored), formatting rules.
  10. Telemetry & Audit:
     - Audit log entries to produce; chain-hash rules; metrics to emit.
  11. Acceptance Criteria:
     - BDD-style or structured list of verifiable outcomes with test IDs.
  12. Open Questions & Risks.

B. QA Specification (Automated, Machine-Checkable)
- Location: docs/qa/<component>.md (or .yml/.json for machine readability)
- Contents:
  1. Evidence Locators: exact file patterns, test IDs, route paths, ARIA attributes, API endpoints to verify existence/behavior.
  2. Test Plan: unit, integration, e2e, a11y, security, schema, performance thresholds.
  3. Red/Amber/Green Criteria: precise pass/fail thresholds; surfaces Red X on failure.
  4. Non-regression Rules: snapshot baselines, contract tests.
  5. CI mapping: which jobs run, artifacts produced (reports, coverage, screenshots).
  6. Wiring Validation: ALL routes, event handlers, and component interactions defined in Architecture must be verified as functional. Missing wiring = CRITICAL failure.
  7. Severity Guidelines:
     - CRITICAL: Architecture-defined functionality missing/broken, security issues, build failures, wiring failures
     - HIGH: Important features degraded, accessibility issues, performance degradation
     - MEDIUM: Nice-to-have features, cosmetic issues
     - Deployment checks on non-main branches use HIGH severity (not CRITICAL) to allow AMBER status
  8. Legacy Removal: QA must NOT check for components that Architecture explicitly removes. If Architecture says "remove X", QA check for X must also be removed.

C. Implementation (Code)
- Must reference Architecture and QA by IDs in PR descriptions and commits.
- All new/changed code must include tests that satisfy the QA specification.

D. Traceability Matrix
- Location: docs/traceability.json (or .csv)
- Maps requirement_id → architecture_id(s) → qa_id(s) → test_id(s) → commit(s)/PR(s) → build numbers.

Process (End-to-End Loop)
1) Author/Update Architecture
   - Create or refine the Architecture Component with complete detail (A.1–A.12).
   - Peer review and approval by Main Admin.
2) Generate/Update QA Specification
   - Translate acceptance criteria into machine-checkable QA (B.1–B.5).
   - Ensure evidence locators are explicit and stable.
3) Implementation
   - Build strictly to Architecture and QA. Do not improvise un-specified behaviors.
4) Automated QA (Every commit/PR and after merge)
   - Run full test suite: unit, integration, e2e, a11y, schema, security checks.
   - Verify ALL wiring and functionality defined in Architecture.
   - Any CRITICAL failure yields Red X. No handover.
   - AMBER status (high severity failures only) is acceptable for feature branch PRs but not for main branch deployments.
5) Fix Cycle on Failure
   - If failure is due to missing/incorrect implementation → fix code/tests.
   - If failure is due to Architecture gap or changed understanding → update Architecture first, then QA, then code.
   - If failure is due to legacy component still present → REMOVE (nuke) the component from code and QA checks.
   - NEVER bypass or downgrade QA check severity to hide issues.
6) UI Review (Manual)
   - Product Owner reviews deployed preview.
   - If UI is off: update Architecture to reflect correct requirement; update QA to fail; then implement fixes; rerun QA until Green.
7) Acceptance & Lock
   - Upon Green and UI approval, mark component version as accepted in traceability.
   - Proceed to next component.
8) Always Re-run QA
   - After every build/change without exception.

Definitions of “Evidence” (What QA Looks For)
- Existence Evidence: files, routes, components with specific names/paths; presence of test IDs; ARIA attributes; page titles; navigation items.
- Behavior Evidence: e2e flows (create/assign/accept/approve/upload evidence); state transitions; dependency scheduling; constraint validations.
- Security/Privacy Evidence: headers (CSP, HSTS), CSRF tokens, RLS policies; permissions enforced; audit entries created; AV/DLP scan logs.
- Accessibility Evidence: a11y test pass; no color-only cues; keyboard navigation; focus management.
- Performance Evidence: P50/P95 latencies; bundle size budgets; DB query counts within thresholds.
- Wiring Evidence: ALL routes map to correct pages; ALL event handlers are attached; ALL navigation links work; ALL functions called by routes exist and are wired correctly. Wiring failures are CRITICAL severity.
- Negative Evidence (Legacy Removal): Components that Architecture says to remove MUST NOT be present in code or QA checks.

Roles & Responsibilities
- Main Admin (Owner): approves Architecture, final UI acceptance; controls releases.
- Architect: authors Architecture Components; ensures completeness and consistency.
- Developers: implement to spec; write/maintain tests; never bypass QA.
- QA Engineer: maintains QA specs and CI; ensures failures produce clear Red X with diagnostics.
- Security/Compliance: reviews ASVS/POPIA/GDPR controls; monitors data leakage dashboard inputs.

Naming & Conventions
- Requirement IDs: REQ-<domain>-<number> (e.g., REQ-ROLLUP-001).
- Architecture IDs: ARC-<component>-<number>.
- QA IDs: QA-<component>-<number>.
- Test IDs/data-testid: TID-<component>-<number>.
- Commit messages: include related IDs (e.g., "ARC-ONBOARD-003 QA-ONBOARD-007").
- Branches: feature/<short-desc>-<REQID>.

Change Management
- Any scope change flows Architecture → QA → Implementation.
- Record in CHANGELOG with IDs and rationale.
- Maintain versioning for Architecture Components.

Non-Regression & Release Protection
- PRs blocked if:
  - Any QA Red X.
  - Coverage falls below threshold (e.g., 80% unit; 60% integration; critical flows covered by e2e).
  - Lint/format/security scans fail (secrets, licenses, vulnerabilities).
- Golden tests and API contract tests prevent breaking changes.

Security, Privacy, Accessibility (Baked-in)
- OWASP ASVS L1+ controls minimum; OWASP Top 10 scans; CSRF/CORS/CSP; rate limiting.
- POPIA/GDPR alignment: DSR workflows; data minimization; retention; breach notification plan.
- Audit: tamper-evident (hash-chained) logs for key events.
- Accessibility: WCAG 2.2 AA; keyboard-only usable; visible focus; screen reader labels; avoid color-only semantics.

QA Validation Philosophy (Critical Requirements)
1. QA Validates FULL Functionality, Not Just Code Availability
   - QA must verify that the application actually WORKS per architecture, not just that files exist
   - Wiring checks (routes, event handlers, navigation) are CRITICAL severity
   - If a route is defined in architecture but doesn't work in code → RED status, block merge
   - If a button exists but has no click handler → RED status, block merge
   - "Code exists" ≠ "App works" - QA must validate the latter

2. Legacy Components Must Be Removed (Nuked), Not Bypassed
   - If Architecture says "remove component X", then:
     a) Remove X from code (HTML, JS, CSS)
     b) Remove X from QA validation checks
     c) Document removal in architecture doc
   - NEVER bypass a failing check by downgrading severity or adding "may be implementation details" notes
   - NEVER keep dead code "just in case" - if not in Architecture, it must not exist

3. Architecture-QA-Code Alignment Must Be Perfect
   - If Architecture defines feature X:
     → QA must check for X with appropriate severity
     → Code must implement X
   - If Code has feature Y not in Architecture:
     → Either add Y to Architecture (if needed)
     → Or remove Y from Code (if not needed)
   - If QA checks for feature Z not in Architecture:
     → Either add Z to Architecture (if needed)
     → Or remove Z from QA checks (if not needed)
   - NEVER allow misalignment to persist

4. Severity Guidelines Are Strict
   - CRITICAL: Architecture-defined functionality missing/broken, security issues, build failures, WIRING FAILURES
   - HIGH: Important features degraded, accessibility issues, performance degradation
   - MEDIUM: Nice-to-have features, cosmetic issues
   - Exception: Deployment checks on non-main branches use HIGH (not CRITICAL) to allow AMBER status for PRs
   - NEVER downgrade severity to hide problems or make dashboards look better

5. Final Handover Must Be GREEN with Full Functionality
   - AMBER is acceptable for feature branch PRs (allows deployment failures on non-main branches)
   - AMBER is NOT acceptable for main branch or final handover
   - Final handover requires:
     → GREEN status (all critical checks pass)
     → Full functional application per architecture
     → All wiring validated and working
     → Zero legacy/undefined components remaining
     → Deployment successful (on main branch)

Hierarchical Roll-up Requirement (True North Rule)
- The platform must enable roll-up and drill-down views across:
  - Group (OrgGroup) → Company → Department → Person → Project/Milestone/Deliverable/Work Item.
- Dashboards and filters must support combinations (e.g., multiple companies, one department across companies, or a person across all assignments).
- All aggregation logic and constraints are specified in Architecture and verified by QA through API contract tests and e2e dashboards tests.

Documentation & File Structure
- rules.md (this file) at repo root.
- docs/architecture/ for component specs (source of truth).
- docs/qa/ for machine-checkable QA specs.
- docs/traceability.json for cross-references.
- tests/… for unit/integration/e2e/a11y.
- .github/workflows/ for CI jobs producing Green/Red results and reports.

Checklists
A) Architecture Completeness Checklist
- [ ] Navigation map and route paths
- [ ] Page wireframes (all states: empty/loading/error/forbidden)
- [ ] Modals/drawers: triggers, sizes, focus, keyboard
- [ ] Controls: states, labels, validation, help text
- [ ] Data contracts (schemas, examples)
- [ ] Dependency/scheduling rules and conflict handling
- [ ] Roll-up/aggregation logic and KPIs
- [ ] Permissions matrix for this component
- [ ] Notifications (events, templates)
- [ ] Compliance & security controls
- [ ] i18n/time rules
- [ ] Telemetry & audit entries
- [ ] Acceptance criteria with test IDs

B) QA Readiness Checklist
- [ ] Evidence locators defined (files, routes, test IDs, ARIA)
- [ ] Unit/integration/e2e/a11y/security tests planned
- [ ] Performance budgets defined
- [ ] CI jobs configured to fail with Red X and artifact logs/screenshots
- [ ] Contract tests for APIs
- [ ] Non-regression snapshots created

C) Pre-Merge Checklist
- [ ] All QA checks Green
- [ ] Coverage thresholds met
- [ ] No high/critical vulnerabilities
- [ ] Documentation updated (Architecture, QA, Traceability)

D) Release Checklist
- [ ] Changelog updated
- [ ] Audit & monitoring dashboards updated
- [ ] Feature flags toggled as specified

E) Deployment Verification Checklist
- [ ] GitHub Pages deployment workflow configured
- [ ] Environment protection rules validated (no blocking rules for main branch)
- [ ] Deployment permissions configured (pages: write, id-token: write)
- [ ] Deployment environment exists and is accessible
- [ ] .nojekyll file present (bypasses Jekyll processing)
- [ ] Build artifacts uploadable and deployable
- [ ] Deployment completes successfully without errors
- [ ] Live URL accessible (https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/)
- [ ] Application loads without 404 errors
- [ ] All critical routes functional on deployed site

Deployment Architecture Requirements
-----------------------------------------
**Purpose:** Guarantee that every GREEN build is automatically deployable and verifiably accessible to end users.

**Core Principle:** Deployment is NOT complete until the live application is accessible and functional. QA MUST verify actual deployment success, not just file existence.

**Deployment Prerequisites:**
1. **GitHub Pages Configuration**
   - Repository Settings → Pages → Source set to "GitHub Actions"
   - Custom domain configured (if applicable)
   - HTTPS enforced

2. **GitHub Environment Configuration**
   - Environment name: `github-pages`
   - Branch protection: `main` branch MUST be allowed to deploy
   - Required reviewers: NONE (or explicitly configured and documented)
   - Wait timer: NONE (or explicitly configured and documented)
   - Deployment branches: Only selected branches → `main`

3. **Workflow Requirements**
   - Workflow file: `.github/workflows/deploy-pages.yml`
   - Permissions: `contents: read`, `pages: write`, `id-token: write`
   - Environment declaration: `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`
   - Artifact upload path: `./src/frontend`
   - Deployment action: `actions/deploy-pages@v4`

4. **Static Site Requirements**
   - Entry point: `src/frontend/index.html`
   - Assets directory: `src/frontend/assets/`
   - Styles: `src/frontend/styles.css`
   - Jekyll bypass: `src/frontend/.nojekyll` (empty file)
   - Base path handling: All routes must work with repository subpath

5. **Deployment Verification**
   - Workflow must complete with SUCCESS status
   - GitHub deployment must show "Active" status
   - Live URL must return HTTP 200
   - index.html must load without errors
   - Critical test IDs must be present in deployed HTML

**QA Requirements for Deployment:**
- Check existence of all deployment prerequisite files
- Validate workflow configuration syntax and settings
- Verify environment configuration (via GitHub API or documentation)
- Test deployment workflow execution (actual run)
- Verify live URL accessibility (HTTP request to deployed URL)
- Validate critical UI elements present in deployed version

**Failure Modes and Detection:**
- Missing .nojekyll → Jekyll processing breaks JS/CSS → QA MUST detect
- Wrong artifact path → 404 errors → QA MUST detect via URL check
- Environment protection rules blocking → Workflow fails → QA MUST detect
- Incorrect permissions → Deployment rejected → QA MUST detect
- Network/DNS issues → URL inaccessible → QA MUST detect

**Deployment Evidence Required:**
- Workflow run ID and status (SUCCESS)
- GitHub deployment ID and status (Active)
- Live URL HTTP response code (200)
- Live URL response content includes expected test IDs
- Screenshot or HTML snapshot of deployed application

**Acceptance Criteria:**
- [ ] Deployment workflow completes successfully
- [ ] GitHub deployment shows Active status
- [ ] Live URL returns HTTP 200
- [ ] Application loads and displays correctly
- [ ] All critical routes accessible on deployed site
- [ ] No console errors on deployed site (checked via automated test)

Importing Rules from Other Projects
- Place external rules into docs/rules-inbox/ as separate files.
- Propose merges into rules.md via PR; tag with RULE-EXT-<source> IDs.
- Update Architecture/QA where applicable; add/modify tests accordingly.

Enforcement
- CI must run on every PR and on main; failing checks block merge.
- No manual overrides without an Architecture and QA update reviewed by Main Admin.
- Any exception requires an explicit waiver recorded in docs/waivers/ with expiry.

Amendment Process
- Propose changes via PR to rules.md with rationale.
- Main Admin approval required.

Appendix: Red X Semantics
- Red X indicates an unmet requirement. The root cause must be categorized as:
  - IMP: Implementation defect/missing code
  - ARCH: Architecture gap/ambiguity
  - QA: QA spec gap or false positive
- Resolution order: ARCH → QA → IMP, then rerun QA until Green.
