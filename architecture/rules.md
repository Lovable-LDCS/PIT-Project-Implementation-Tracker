# Architecture Rules

## True North – One-Time Build Framework

**Status:** Active  
**Version:** 1.0.0  
**Last Updated:** 2025-11-25  
**Owner:** Main Admin (Product Owner)

---

## Purpose

This document defines the high-level functional architecture for the PIT (Project Implementation Tracker) application. It serves as the **single source of truth** (True North) that governs:

- System design and component structure
- Page layouts and navigation flows
- UI/UX rules and consistency standards
- Build and deployment requirements
- Acceptance criteria for all functionality

---

## 1. Architecture Principles

### 1.1 Architecture-First Development

- All implementation must derive from approved architecture documents
- No features are built until architecture is complete and approved
- Changes to implementation require architecture updates first

### 1.2 Single Source of Truth

The architecture specification is canonical. If there is a conflict between code and architecture:
1. Architecture wins
2. Code must be updated to match architecture
3. Or architecture must be formally amended with approval

### 1.3 Complete Traceability

Every requirement must be traceable through:
- **Architecture** → **QA Specification** → **Implementation** → **Tests** → **Deployment**

---

## 2. Page Structure & Layout Definitions

### 2.1 Global Shell

| Component | Description | Test ID |
|-----------|-------------|---------|
| Top Bar | Application header with branding and global controls | `TID-TOPBAR` |
| Sidebar | Main navigation panel with collapsible menu | `TID-SIDEBAR` |
| Content Area | Main content rendering area | `TID-CONTENT-AREA` |
| Breadcrumbs | Navigation breadcrumb trail | `TID-BREADCRUMBS` |
| Shell Root | Root container for entire application | `TID-SHELL-ROOT` |

### 2.2 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Desktop | ≥1920px | Full layout with expanded sidebar |
| Tablet | 768px - 1919px | Collapsed sidebar, touch-optimized |
| Mobile | <768px | Stacked layout, hamburger menu |

### 2.3 Core Pages

| Route | Page | Description |
|-------|------|-------------|
| `#/` | Dashboard | Home/landing page |
| `#/projects` | Implementation | Project hierarchy management |
| `#/reports` | Reports | Reporting dashboard |
| `#/permissions` | Permissions | RBAC management |
| `#/evidence` | Evidence | Evidence attachment system |
| `#/gantt` | Gantt | Gantt chart view |
| `#/timelines` | Timelines | Timeline matrix view |
| `#/audit` | Audit | Audit log viewer |
| `#/notify` | Notifications | Notification management |
| `#/import` | Import | Data import functionality |
| `#/templates` | Templates | Template management |
| `#/qa` | Quality Assurance | QA dashboard |

---

## 3. Component Dependencies

### 3.1 Core Components

All core components are defined in `architecture/components.md` and include:
- Navigation components
- Form components
- Modal components
- Table/grid components
- Chart/visualization components

### 3.2 Wiring Requirements

- All components defined in architecture MUST be wired in code
- Components not defined in architecture MUST be removed (legacy cleanup)
- All routes MUST render functional pages

---

## 4. UX/UI Consistency Standards

### 4.1 Visual Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | `#0D2850` | Headers, primary actions |
| Secondary Color | `#006B92` | Milestone indicators |
| Accent Color | `#4C95B0` | Deliverable indicators |
| Background | `#FFFFFF` | Main content area |
| Text Primary | `#1A1A1A` | Main text |
| Text Secondary | `#666666` | Supporting text |

### 4.2 Typography

- **Font Family:** System fonts (San Francisco, Segoe UI, Roboto)
- **Base Size:** 16px
- **Heading Scale:** 1.25 ratio

### 4.3 Spacing

- **Base Unit:** 8px
- **Common Values:** 8px, 16px, 24px, 32px, 48px

---

## 5. Branding Guidelines

### 5.1 Application Identity

- **Name:** PIT - Project Implementation Tracker
- **Logo:** Located in `src/frontend/assets/`
- **Tagline:** "Architecture-driven project management"

### 5.2 Brand Colors

Consistent with Section 4.1 Visual Tokens.

---

## 6. System Behaviors

### 6.1 Navigation

- Hash-based routing (`#/route-name`)
- Deep linking supported
- State preservation across navigation

### 6.2 User Feedback

| Event | Feedback Type |
|-------|---------------|
| Saving | Spinner + toast confirmation |
| Loading | Skeleton/spinner |
| Errors | Toast notification + detailed message |
| Success | Toast confirmation |

### 6.3 Data Persistence

- localStorage for client-side state
- Session management via authContext/roleContext
- Automatic save on form completion

---

## 7. Launch Requirements

### 7.1 Pre-Launch Checklist

- [ ] No broken routes (all defined routes render)
- [ ] No 404 errors on navigation
- [ ] All critical test IDs present
- [ ] ESLint passes with zero errors
- [ ] All QA checks GREEN

### 7.2 Route Integrity

Every route in Section 2.3 MUST:
1. Resolve to a valid page
2. Render complete content
3. Be accessible via sidebar navigation

---

## 8. ESLint & Code Quality

### 8.1 Required Checks

- No syntax errors
- No undefined variables
- Consistent formatting
- No unused imports

### 8.2 Enforcement

- Pre-commit hooks (when configured)
- CI pipeline validation
- QA runner checks

---

## 9. Domain-Specific Rules

### 9.1 Project Hierarchy

```
Group → Company → Department → Person → Project → Milestone → Deliverable → Task
```

### 9.2 Roll-up Aggregation

- Progress rolls up from Task → Deliverable → Milestone → Project
- All hierarchy levels support drill-down views

### 9.3 Permission Model

Role-based access control with:
- Admin: Full access
- Manager: Department-level access
- Member: Project-level access
- Viewer: Read-only access

---

## 10. Acceptance Criteria Template

Each functional requirement MUST include:

```markdown
**Requirement ID:** REQ-XXX-###
**Description:** [What the feature does]
**Acceptance Criteria:**
1. Given [context], when [action], then [expected result]
2. ...

**Test IDs:**
- TID-XXX-001: [Test description]
- TID-XXX-002: [Test description]
```

---

## 11. True North Declaration

> **Architecture = Source of Truth**
>
> This document, along with `architecture/components.md` and related architecture files in `docs/architecture/`, defines what the application IS and MUST BE.
>
> All implementation, QA validation, and deployment verification derive from this architectural specification.
>
> Deviations are treated as defects to be corrected.

---

## 12. Version Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-25 | System | Initial creation |

---

## Related Documents

- `rules.md` (root) - Detailed build methodology
- `architecture/components.md` - Component specifications
- `qa/requirements.md` - QA validation rules
- `qa/checklist.json` - Machine-readable QA checklist
- `docs/architecture/` - Detailed architecture specs
- `docs/qa/` - Detailed QA specifications
