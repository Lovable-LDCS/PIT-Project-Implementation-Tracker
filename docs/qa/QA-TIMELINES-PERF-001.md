---
id: QA-TIMELINES-PERF-001
title: QA - Timelines Performance and One-Time Build Policy
component: ARC-TIMELINES-001
status: Draft v1.0
---

True north metrics
- Initial render of Timelines after navigation: under 100ms script execution for tlInitFromStore + tlRender (measured via performance.now markers)
- Drag frame budget: mousemove to bar update under 16ms average at Day/Week zoom (60fps target) for spans < 12 months
- Ticks render budget: under 50ms for Month zoom over 24 months; under 150ms for Day zoom over 62 days

Evidence (instrumentation requirements)
- Add performance marks: 'tl:init:start', 'tl:init:end', 'tl:render:start', 'tl:render:end', 'tl:ticks:start', 'tl:ticks:end'
- Log deltas to console with [TL-PERF] prefix
- Expose window.__tlPerf with last timings for QA harness to read

One-time build policy checks
- Single definition per core hook (tlInitFromStore, tlComputeView, tlRender, tlRenderTicks, tlUpdateAxisVisibility, tlAddBar); no duplicates
- LocalStorage use limited to pm_tl_settings and pm_projects
- Router maps #/timelines and calls tlInitFromStore then tlRender exactly once on navigation
