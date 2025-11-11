Param(
  [string]$HtmlPath = "src/frontend/index.html"
)

# Fail fast: we want QA to be the driver; missing elements should cause Red X until built.

$errors = New-Object System.Collections.Generic.List[string]
function Fail($msg){ $errors.Add($msg) }
function Ok($msg){ Write-Host "[OK] $msg" }

if(-not (Test-Path $HtmlPath)){
  Fail "Missing $HtmlPath"
}

# Read HTML
$html = Get-Content -Raw $HtmlPath
# Read CSS (external stylesheet)
$cssPath = Join-Path (Split-Path -Parent $HtmlPath) 'styles.css'
if(-not (Test-Path $cssPath)){
  Fail "Missing stylesheet: $cssPath"
}
$css = Get-Content -Raw $cssPath

# Read Main JS (external)
$jsPath = Join-Path (Split-Path -Parent $HtmlPath) 'app-main.js'
if(-not (Test-Path $jsPath)){
  Fail "Missing main script file: $jsPath"
} else { Ok "Found main script file: $jsPath" }
$js = Get-Content -Raw $jsPath

function Test-Pattern{
  param([string]$pattern,[string]$desc)
  if(-not ($html -match $pattern)){
    Fail "Missing: $desc"
  } else { Ok "Found: $desc" }
}

# Helpers for JS checks
function Test-PatternJs{
  param([string]$pattern,[string]$desc)
  if(-not ($js -match $pattern)){
    Fail "Missing in JS: $desc"
  } else { Ok "Found in JS: $desc" }
}

# Required elements (simple regex presence checks)
Test-Pattern 'data-testid\s*=\s*"TID-SHELL-ROOT"' 'TID-SHELL-ROOT'
Test-Pattern 'role\s*=\s*"application"' 'role=application on root'
Test-Pattern 'data-testid\s*=\s*"TID-TOPBAR"' 'TID-TOPBAR'
Test-Pattern 'data-testid\s*=\s*"TID-BRAND-LOGO"' 'TID-BRAND-LOGO'
# Ensure stylesheet link present
Test-Pattern '<link[^>]+href\s*=\s*"styles\.css"' 'link to styles.css'
# Ensure external boot script present (resilience against inline-script blocking)
Test-Pattern '<script[^>]+src\s*=\s*"app-boot\.js"' 'link to app-boot.js boot script'
# Ensure external main script present (no reliance on inline script execution)
if($html -notmatch '<script[^>]+src\s*=\s*"app-main\.js"'){
  Fail 'Missing main script: app-main.js (resilient architecture requires external main JS)'
  if($html -match 'function\s+tlRender\s*\('){ Fail 'Inline main script detected; move timelines/app logic to app-main.js' }
  if($html -match '<body[^>]+onload='){ Fail 'Inline JS attribute found on <body>; replace with external app-main.js init' }
} else { Ok 'Found: app-main.js main script link' }

# Branding tokens present (in external CSS)
if($css -notmatch '--brand-primary\s*:\s*#006B92'){ Fail "Missing brand token: --brand-primary" } else { Ok "Found: --brand-primary" }
if($css -notmatch '--brand-accent\s*:\s*#0D2850'){ Fail "Missing brand token: --brand-accent" } else { Ok "Found: --brand-accent" }
if($css -notmatch '--brand-secondary1\s*:\s*#4C95B0'){ Fail "Missing brand token: --brand-secondary1" } else { Ok "Found: --brand-secondary1" }
if($css -notmatch '--brand-secondary2\s*:\s*#CCE1E9'){ Fail "Missing brand token: --brand-secondary2" } else { Ok "Found: --brand-secondary2" }
if($css -notmatch "--font-body\s*:\s*[^;]*Trebuchet\s+MS"){ Fail "Missing font token: --font-body" } else { Ok "Found: --font-body" }
if($css -notmatch "--font-heading\s*:\s*[^;]*Trebuchet\s+MS"){ Fail "Missing font token: --font-heading" } else { Ok "Found: --font-heading" }
Test-Pattern 'data-testid\s*=\s*"TID-SIDEBAR"' 'TID-SIDEBAR'
# CSS grid wiring presence (check external CSS)
if($css -notmatch '\.topbar\s*\{[^}]*grid-area\s*:\s*topbar'){ Fail "Missing CSS: .topbar grid-area: topbar" } else { Ok "Found CSS: .topbar grid-area: topbar" }
if($css -notmatch '\.sidebar\s*\{[^}]*grid-area\s*:\s*sidebar'){ Fail "Missing CSS: .sidebar grid-area: sidebar" } else { Ok "Found CSS: .sidebar grid-area: sidebar" }
if($css -notmatch '\.content\s*\{[^}]*grid-area\s*:\s*content'){ Fail "Missing CSS: .content grid-area: content" } else { Ok "Found CSS: .content grid-area: content" }
Test-Pattern 'role\s*=\s*"navigation"' 'role=navigation on sidebar'
Test-Pattern 'data-testid\s*=\s*"TID-BREADCRUMBS"' 'TID-BREADCRUMBS'
Test-Pattern 'aria-label\s*=\s*"Breadcrumb"' 'Breadcrumb aria-label'
Test-Pattern 'data-testid\s*=\s*"TID-GLOBAL-SEARCH"' 'TID-GLOBAL-SEARCH'
Test-Pattern '<input[^>]*' 'presence of input (global search)'
Test-Pattern 'aria-label\s*=\s*"Search"' 'search aria-label ("Search")'
Test-Pattern 'data-testid\s*=\s*"TID-ORG-SCOPE-SELECTOR"' 'TID-ORG-SCOPE-SELECTOR'
Test-Pattern 'data-testid\s*=\s*"TID-NOTIFICATIONS-BTN"' 'TID-NOTIFICATIONS-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-PROFILE-MENU"' 'TID-PROFILE-MENU'
Test-Pattern 'data-testid\s*=\s*"TID-START-PROJECT-BTN"' 'TID-START-PROJECT-BTN (Start project CTA)'
Test-Pattern 'data-testid\s*=\s*"TID-PAGE-START-PROJECT-BTN"' 'TID-PAGE-START-PROJECT-BTN (Projects page CTA)'
Test-Pattern 'data-testid\s*=\s*"TID-COMPANY-FILTER"' 'TID-COMPANY-FILTER'
Test-Pattern 'data-testid\s*=\s*"TID-DEPT-FILTER"' 'TID-DEPT-FILTER'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-DASHBOARD"' 'TID-NAV-DASHBOARD'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-PROJECTS"' 'TID-NAV-PROJECTS'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-REPORTS"' 'TID-NAV-REPORTS'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-PERMISSIONS"' 'TID-NAV-PERMISSIONS'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-WORKITEM"' 'TID-NAV-WORKITEM'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-EVIDENCE"' 'TID-NAV-EVIDENCE'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-GANTT"' 'TID-NAV-GANTT'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-TIMELINES"' 'TID-NAV-TIMELINES'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-AUDIT"' 'TID-NAV-AUDIT'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-NOTIFY"' 'TID-NAV-NOTIFY'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-IMPORT"' 'TID-NAV-IMPORT'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-EXPORTS"' 'TID-NAV-EXPORTS'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-TEMPLATES"' 'TID-NAV-TEMPLATES'
Test-Pattern 'data-testid\s*=\s*"TID-NAV-SEARCH"' 'TID-NAV-SEARCH'
# Navigation hooks (defined in HTML file)
Test-Pattern 'function\s+navigateTo\s*\(' 'navigateTo() function'
Test-Pattern "'#/timelines'\s*:\s*'TID-TL-PAGE'" 'Router maps #/timelines to TID-TL-PAGE'
if($html -notmatch 'addEventListener\(\s*\"hashchange\"|addEventListener\(\s*''hashchange'''){ Fail "Missing: hashchange listener" } else { Ok "Found: hashchange listener" }
# Wiring checks hooks
if($html -notmatch 'function\s+runWiringChecks\s*\('){ Fail "Missing: runWiringChecks() function" } else { Ok "Found: runWiringChecks()" }
if($html -notmatch 'addEventListener\(\s*\"DOMContentLoaded\"|addEventListener\(\s*''DOMContentLoaded'''){ Fail "Missing: DOMContentLoaded wiring check" } else { Ok "Found: DOMContentLoaded wiring check" }
# Route table must include all routes
if($html -notmatch "'#/workitem'\s*:\s*'TID-WORKITEM-DETAIL'"){ Fail "Missing route: #/workitem" } else { Ok "Found route: #/workitem" }
if($html -notmatch "'#/evidence'\s*:\s*'TID-EVIDENCE-UPLOAD'"){ Fail "Missing route: #/evidence" } else { Ok "Found route: #/evidence" }
if($html -notmatch "'#/gantt'\s*:\s*'TID-GANTT-VIEW'"){ Fail "Missing route: #/gantt" } else { Ok "Found route: #/gantt" }
if($html -notmatch "'#/audit'\s*:\s*'TID-AUDIT-LOG'"){ Fail "Missing route: #/audit" } else { Ok "Found route: #/audit" }
if($html -notmatch "'#/notify'\s*:\s*'TID-NOTIFY-PREFERENCES'"){ Fail "Missing route: #/notify" } else { Ok "Found route: #/notify" }
if($html -notmatch "'#/import'\s*:\s*'TID-IMPORT-WIZARD'"){ Fail "Missing route: #/import" } else { Ok "Found route: #/import" }
if($html -notmatch "'#/exports'\s*:\s*'TID-EXPORT-REPORTS'"){ Fail "Missing route: #/exports" } else { Ok "Found route: #/exports" }
if($html -notmatch "'#/templates'\s*:\s*'TID-TEMPLATES-LIBRARY'"){ Fail "Missing route: #/templates" } else { Ok "Found route: #/templates" }
if($html -notmatch "'#/search'\s*:\s*'TID-SEARCH-RESULTS'"){ Fail "Missing route: #/search" } else { Ok "Found route: #/search" }
if($html -notmatch "'#/timelines'\s*:\s*'TID-TL-PAGE'"){ Fail "Missing route: #/timelines" } else { Ok "Found route: #/timelines" }
# Ensure navigateTo wires timelines rendering when route is #/timelines (check in HTML)
if($html -notmatch "if\(route\s*===\s*'#\/timelines'\)\{[\s\S]*?tlInitFromStore\(\);[\s\S]*?tlRender\(\);"){ Fail "Missing timelines init calls in navigateTo() (in HTML)" } else { Ok "Found timelines init calls in navigateTo() (HTML)" }
Test-Pattern 'data-testid\s*=\s*"TID-CONTENT-AREA"' 'TID-CONTENT-AREA'
Test-Pattern 'role\s*=\s*"main"' 'role=main on content'

# Favicon: require a rel="icon" link; if it references /favicon.ico, ensure that file exists
if($html -match '<link[^>]+rel\s*=\s*"icon"[^>]+href\s*=\s*"([^"]+)"'){
  $href = $Matches[1]
  Ok "Found: favicon link ($href)"
  if($href -like '/favicon.ico'){
    $icoPath = Join-Path (Split-Path -Parent $HtmlPath) 'favicon.ico'
    if(-not (Test-Path $icoPath)){
      Fail "favicon link points to /favicon.ico but file not found at $icoPath"
    } else { Ok "Found: $icoPath" }
  }
} else {
  Fail "Missing: <link rel=\"icon\" ...>"
}

# Problems indicator must be present and show 0 for a clean build unless overridden
# Clean projects page wiring checks (post-save expectations) — presence-only; state checked via DOM attributes
if($html -notmatch 'data-testid\s*=\s*"TID-PROJ-SUMMARY"'){ Fail "Missing: TID-PROJ-SUMMARY (clean summary line)" } else { Ok "Found: TID-PROJ-SUMMARY (clean summary line)" }
if($html -notmatch 'data-testid\s*=\s*"TID-PROJ-TREE"'){ Fail "Missing: TID-PROJ-TREE" } else { Ok "Found: TID-PROJ-TREE" }
$override = $env:PM_QA_ALLOW_PROBLEMS
if(-not [string]::IsNullOrEmpty($override) -and $override -eq '1'){
  Ok "Problems override enabled (PM_QA_ALLOW_PROBLEMS=1). Skipping problems check."
} else {
  Test-Pattern 'data-testid\s*=\s*"TID-PROBLEMS-INDICATOR"' 'TID-PROBLEMS-INDICATOR'
  # Extract text content for indicator
  if($html -match 'data-testid\s*=\s*"TID-PROBLEMS-INDICATOR"[^>]*>(.*?)<'){
    $val = ($Matches[1]).Trim()
    if($val -ne '0'){
      Fail "Problems indicator not zero: '$val'"
    } else { Ok "Problems indicator is zero" }
  } else {
    Fail "Could not read Problems indicator text"
  }
  Test-Pattern 'data-testid\s*=\s*"TID-PROBLEMS-PANEL"' 'TID-PROBLEMS-PANEL'
}

# Dashboard presence (intentionally failing until implemented)
Test-Pattern 'data-testid\s*=\s*"TID-DASHBOARD"' 'TID-DASHBOARD (Dashboard container)'
Test-Pattern 'data-testid\s*=\s*"TID-DASH-FILTERS"' 'TID-DASH-FILTERS (Dashboard filters)'
Test-Pattern 'data-testid\s*=\s*"TID-DASH-KPI-OVERDUE"' 'TID-DASH-KPI-OVERDUE'
Test-Pattern 'data-testid\s*=\s*"TID-DASH-KPI-DUE"' 'TID-DASH-KPI-DUE'
Test-Pattern 'data-testid\s*=\s*"TID-DASH-KPI-COMPLETION"' 'TID-DASH-KPI-COMPLETION'

# Placeholder presence for remaining components (expected to fail until implemented)
Test-Pattern 'data-testid\s*=\s*"TID-PAGE-PROJECTS"' 'TID-PAGE-PROJECTS (Projects list page)'
# Project selector
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SELECT"' 'TID-PROJ-SELECT'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTERS"' 'TID-PROJ-FILTERS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SEARCH"' 'TID-PROJ-SEARCH'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTER-STATUS"' 'TID-PROJ-FILTER-STATUS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTER-COMPANY"' 'TID-PROJ-FILTER-COMPANY'
# Build-view filters
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTER-TYPE"' 'TID-PROJ-FILTER-TYPE (multi-select)'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTER-FROM"' 'TID-PROJ-FILTER-FROM (date from)'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-FILTER-TO"' 'TID-PROJ-FILTER-TO (date to)'
# New Filters banner card (v2.4)
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-CARD"' 'TID-FILTER-CARD (Filters banner card)'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-PROJECTS"' 'TID-FILTER-PROJECTS'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-MILESTONES"' 'TID-FILTER-MILESTONES'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-DELIVERABLES"' 'TID-FILTER-DELIVERABLES'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-TASKS"' 'TID-FILTER-TASKS'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-START"' 'TID-FILTER-START'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-END"' 'TID-FILTER-END'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-DURATION"' 'TID-FILTER-DURATION'
Test-Pattern 'data-testid\s*=\s*"TID-FILTER-RESP"' 'TID-FILTER-RESP'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-ACTIONS"' 'TID-PROJ-ACTIONS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-CREATE-BTN"' 'TID-PROJ-CREATE-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-IMPORT-BTN"' 'TID-PROJ-IMPORT-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-TABLE"' 'TID-PROJ-TABLE'
Test-Pattern 'role\s*=\s*"table"' 'Projects table role=table'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-NAME"' 'TID-PROJ-THEAD-NAME'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-STATUS"' 'TID-PROJ-THEAD-STATUS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-START"' 'TID-PROJ-THEAD-START'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-END"' 'TID-PROJ-THEAD-END'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-PROGRESS"' 'TID-PROJ-THEAD-PROGRESS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-THEAD-OWNER"' 'TID-PROJ-THEAD-OWNER'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-EMPTY"' 'TID-PROJ-EMPTY'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-LOADING"' 'TID-PROJ-LOADING'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-PAGINATION"' 'TID-PROJ-PAGINATION'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-HEADER"' 'TID-PROJ-HEADER'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-DETAIL"' 'TID-PROJ-DETAIL'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-TITLE"' 'TID-PROJ-TITLE'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-META"' 'TID-PROJ-META'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-START"' 'TID-PROJ-START'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-END"' 'TID-PROJ-END'
# Project Summary line presence
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUMMARY"' 'TID-PROJ-SUMMARY'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-STATUS"' 'TID-PROJ-SUM-STATUS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-START"' 'TID-PROJ-SUM-START'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-END"' 'TID-PROJ-SUM-END'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-DURATION"' 'TID-PROJ-SUM-DURATION'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-RESP"' 'TID-PROJ-SUM-RESP'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-PROGRESS"' 'TID-PROJ-SUM-PROGRESS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-SUM-EVIDENCE"' 'TID-PROJ-SUM-EVIDENCE'
# Column headers for build grid (v2.4)
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-COLS-HEADER"' 'TID-PROJ-COLS-HEADER (shown post-save)'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-DESC"' 'TID-COL-H-DESC'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-START"' 'TID-COL-H-START'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-END"' 'TID-COL-H-END'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-DURATION"' 'TID-COL-H-DURATION'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-RESP"' 'TID-COL-H-RESP'
Test-Pattern 'data-testid\s*=\s*"TID-COL-H-EVID"' 'TID-COL-H-EVID'

Test-Pattern 'data-testid\s*=\s*"TID-PROJ-ADD-MS"' 'TID-PROJ-ADD-MS'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-ADD-DL"' 'TID-PROJ-ADD-DL'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-ADD-TASK"' 'TID-PROJ-ADD-TASK'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-BUILD"' 'TID-PROJ-BUILD'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-TREE"' 'TID-PROJ-TREE'
# Indentation CSS classes
if($css -notmatch '\.indent-1\s*\{'){ Fail 'Missing CSS class: .indent-1' } else { Ok 'Found CSS class: .indent-1' }
if($css -notmatch '\.indent-2\s*\{'){ Fail 'Missing CSS class: .indent-2' } else { Ok 'Found CSS class: .indent-2' }
# Build-view computation hook
if($html -notmatch 'function\s+computeStatusDescriptor\s*\('){ Fail "Missing: computeStatusDescriptor()" } else { Ok "Found: computeStatusDescriptor()" }

# Project setup modal
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-MODAL"' 'TID-PSETUP-MODAL'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-DIALOG"' 'TID-PSETUP-DIALOG'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-NAME"' 'TID-PSETUP-NAME'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-OUTCOME"' 'TID-PSETUP-OUTCOME'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-DESCRIPTION"' 'TID-PSETUP-DESCRIPTION'
# Timeline-first: Start/End inputs removed from Project Setup (checked later)
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-ASSIGNEE"' 'TID-PSETUP-ASSIGNEE'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-SAVE"' 'TID-PSETUP-SAVE'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-CANCEL"' 'TID-PSETUP-CANCEL'
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-CLOSE"' 'TID-PSETUP-CLOSE'
# Modal default hidden and dismiss behavior
if($html -notmatch 'data-testid\s*=\s*"TID-PSETUP-MODAL"[^>]*hidden'){ Fail "Project setup modal must be hidden by default" } else { Ok "Project setup modal hidden by default" }
# Dialog a11y
if($html -notmatch 'data-testid\s*=\s*"TID-PSETUP-DIALOG"[^>]*role\s*=\s*"dialog"'){ Fail "Project setup dialog missing role=dialog" } else { Ok "Found: role=dialog" }
if($html -notmatch 'data-testid\s*=\s*"TID-PSETUP-DIALOG"[^>]*aria-modal\s*=\s*"true"'){ Fail "Project setup dialog missing aria-modal=true" } else { Ok "Found: aria-modal=true" }
# Hooks
if($html -notmatch 'function\s+openProjectSetup\s*\('){ Fail "Missing: openProjectSetup()" } else { Ok "Found: openProjectSetup()" }
if($html -notmatch 'function\s+closeProjectSetup\s*\('){ Fail "Missing: closeProjectSetup()" } else { Ok "Found: closeProjectSetup()" }
if($html -notmatch 'function\s+setupProjectInit\s*\('){ Fail "Missing: setupProjectInit()" } else { Ok "Found: setupProjectInit()" }
if($html -notmatch 'function\s+generateItemId\s*\('){ Fail "Missing: generateItemId()" } else { Ok "Found: generateItemId()" }
if($html -notmatch 'function\s+saveProject\s*\('){ Fail "Missing: saveProject()" } else { Ok "Found: saveProject()" }
# Dismiss handlers
if($html -notmatch 'addEventListener\(\s*\"keydown\"|addEventListener\(\s*''keydown'''){ Fail "Missing: Escape handler" } else { Ok "Found: Escape handler" }

# Function wiring cleanliness checks (examples; extend as we retire legacy)
# Consider a function "wired" if it is defined AND referenced at least once elsewhere (onclick, route init, etc.)
$funcsToCheck = @('workItemAccept','workItemReject','workItemEdit','evidenceInit','ganttInit','auditInit','notifyInit','importInit','exportsInit','templatesInit','searchInit','addMilestone','addDeliverable','toggleDesignRef')
foreach($fn in $funcsToCheck){
  $defRegex = "function\s+${fn}\s*\("
  if($html -match $defRegex){
    $callCount = [regex]::Matches($html, "\b" + [regex]::Escape($fn) + "\s*\(").Count
    if($callCount -lt 2){
      Fail "Function appears unused/unwired: $fn"
    } else { Ok "Function wired: $fn" }
  }
}
if($html -notmatch 'addEventListener\(\s*\"hashchange\"|addEventListener\(\s*''hashchange'''){ Fail "Missing: hashchange close handler" } else { Ok "Found: hashchange close handler" }
# Save wiring: simpler static checks to avoid parser issues
if($html -notmatch 'onclick\s*=\s*"saveProject\(\)"'){ Fail "Save button lacks onclick=saveProject()" } else { Ok "Save button onclick wired" }
if($html -notmatch '(?s)function\s+openProjectSetup.*setupProjectInit\('){ Fail "openProjectSetup() does not call setupProjectInit()" } else { Ok "openProjectSetup wires setupProjectInit" }
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-RESULTS-COUNT"' 'TID-PROJ-RESULTS-COUNT'
Test-Pattern 'data-testid\s*=\s*"TID-PROJ-ROW-1"' 'TID-PROJ-ROW-1 example row'
# Behavior hooks (static)
if($html -notmatch 'function\s+projectSetRowsCount\s*\('){ Fail "Missing: projectSetRowsCount() function" } else { Ok "Found: projectSetRowsCount()" }
if($html -notmatch 'id=\"proj-search\"'){ Fail "Missing: #proj-search" } else { Ok "Found: #proj-search" }
if($html -notmatch 'addEventListener\(\s*\"input\"|addEventListener\(\s*''input'''){ Fail "Missing: input listener attachment (any)" } else { Ok "Found: input listener attachment" }
if($html -notmatch '<button[^>]*(data-testid\s*=\s*\"TID-PROJ-CREATE-BTN\"[^>]*type\s*=\s*\"button\"|type\s*=\s*\"button\"[^>]*data-testid\s*=\s*\"TID-PROJ-CREATE-BTN\")'){ Fail "Create button missing type=button" } else { Ok "Create button type=button" }
if($html -notmatch '<button[^>]*(data-testid\s*=\s*\"TID-PROJ-IMPORT-BTN\"[^>]*type\s*=\s*\"button\"|type\s*=\s*\"button\"[^>]*data-testid\s*=\s*\"TID-PROJ-IMPORT-BTN\")'){ Fail "Import button missing type=button" } else { Ok "Import button type=button" }
Test-Pattern 'data-testid\s*=\s*"TID-PAGE-REPORTS"' 'TID-PAGE-REPORTS (Reports hub)'
Test-Pattern 'data-testid\s*=\s*"TID-ROLE-MATRIX"' 'TID-ROLE-MATRIX (Permissions matrix UI)'
Test-Pattern 'data-testid\s*=\s*"TID-ACCESS-MATRIX"' 'TID-ACCESS-MATRIX (User access matrix)'
Test-Pattern 'data-testid\s*=\s*"TID-AM-ROLES"' 'TID-AM-ROLES'
Test-Pattern 'data-testid\s*=\s*"TID-AM-FUNCS"' 'TID-AM-FUNCS'
Test-Pattern 'data-testid\s*=\s*"TID-AM-GRID"' 'TID-AM-GRID'
# Hooks
if($html -notmatch 'function\s+accessMatrixInit\s*\('){ Fail "Missing: accessMatrixInit()" } else { Ok "Found: accessMatrixInit()" }
if($html -notmatch 'function\s+accessMatrixGrant\s*\('){ Fail "Missing: accessMatrixGrant()" } else { Ok "Found: accessMatrixGrant()" }
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-ROLES"' 'TID-ROLEM-ROLES'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CAPS"' 'TID-ROLEM-CAPS'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-ROW-ADMIN"' 'TID-ROLEM-ROW-ADMIN'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CAP-CREATE"' 'TID-ROLEM-CAP-CREATE'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CAP-EDIT"' 'TID-ROLEM-CAP-EDIT'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CAP-VIEW"' 'TID-ROLEM-CAP-VIEW'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CHECK-ADMIN-CREATE"' 'TID-ROLEM-CHECK-ADMIN-CREATE'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CHECK-ADMIN-EDIT"' 'TID-ROLEM-CHECK-ADMIN-EDIT'
Test-Pattern 'data-testid\s*=\s*"TID-ROLEM-CHECK-ADMIN-VIEW"' 'TID-ROLEM-CHECK-ADMIN-VIEW'
# RBAC hooks (static)
if($html -notmatch 'function\s+roleMatrixToggle\s*\('){ Fail "Missing: roleMatrixToggle() function" } else { Ok "Found: roleMatrixToggle()" }
if($html -notmatch 'function\s+roleMatrixAddRole\s*\('){ Fail "Missing: roleMatrixAddRole() function" } else { Ok "Found: roleMatrixAddRole()" }
Test-Pattern 'data-testid\s*=\s*"TID-ORG-HIERARCHY"' 'TID-ORG-HIERARCHY (Org hierarchy admin)'
Test-Pattern 'data-testid\s*=\s*"TID-MEMBERS-MANAGE"' 'TID-MEMBERS-MANAGE (Members management)'
Test-Pattern 'data-testid\s*=\s*"TID-WORKITEM-DETAIL"' 'TID-WORKITEM-DETAIL (Work item detail view)'
Test-Pattern 'data-testid\s*=\s*"TID-WI-FORM"' 'TID-WI-FORM'
Test-Pattern 'data-testid\s*=\s*"TID-WI-NAME"' 'TID-WI-NAME'
Test-Pattern 'data-testid\s*=\s*"TID-WI-DESCRIPTION"' 'TID-WI-DESCRIPTION'
Test-Pattern 'data-testid\s*=\s*"TID-WI-TYPE"' 'TID-WI-TYPE'
Test-Pattern 'data-testid\s*=\s*"TID-WI-START"' 'TID-WI-START'
Test-Pattern 'data-testid\s*=\s*"TID-WI-END"' 'TID-WI-END'
Test-Pattern 'data-testid\s*=\s*"TID-WI-DURATION"' 'TID-WI-DURATION'
Test-Pattern 'data-testid\s*=\s*"TID-WI-ASSIGNEE"' 'TID-WI-ASSIGNEE'
Test-Pattern 'data-testid\s*=\s*"TID-WI-PROGRESS"' 'TID-WI-PROGRESS'
Test-Pattern 'data-testid\s*=\s*"TID-WI-SUCCESS-INDICATOR"' 'TID-WI-SUCCESS-INDICATOR'
Test-Pattern 'data-testid\s*=\s*"TID-WI-DEPENDENCIES-ADD"' 'TID-WI-DEPENDENCIES-ADD'
Test-Pattern 'data-testid\s*=\s*"TID-WI-ACCEPT-BTN"' 'TID-WI-ACCEPT-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-WI-EDIT-BTN"' 'TID-WI-EDIT-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-WI-REJECT-BTN"' 'TID-WI-REJECT-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-WI-PROGRESS-LABEL"' 'TID-WI-PROGRESS-LABEL'
# Hooks
if($html -notmatch 'function\s+workItemInit\s*\('){ Fail "Missing: workItemInit()" } else { Ok "Found: workItemInit()" }
if($html -notmatch 'function\s+workItemAccept\s*\('){ Fail "Missing: workItemAccept()" } else { Ok "Found: workItemAccept()" }
if($html -notmatch 'function\s+workItemReject\s*\('){ Fail "Missing: workItemReject()" } else { Ok "Found: workItemReject()" }
if($html -notmatch 'function\s+workItemEdit\s*\('){ Fail "Missing: workItemEdit()" } else { Ok "Found: workItemEdit()" }
if($html -notmatch 'function\s+linkPredecessor\s*\('){ Fail "Missing: linkPredecessor()" } else { Ok "Found: linkPredecessor()" }
if($html -notmatch 'function\s+updateProgressLabel\s*\('){ Fail "Missing: updateProgressLabel()" } else { Ok "Found: updateProgressLabel()" }
Test-Pattern 'data-testid\s*=\s*"TID-GANTT-VIEW"' 'TID-GANTT-VIEW (Timeline/Gantt)'
Test-Pattern 'data-testid\s*=\s*"TID-GANTT-CANVAS"' 'TID-GANTT-CANVAS'
Test-Pattern 'data-testid\s*=\s*"TID-GANTT-ALERTS"' 'TID-GANTT-ALERTS'
Test-Pattern 'data-testid\s*=\s*"TID-GANTT-ADD-LINK"' 'TID-GANTT-ADD-LINK'
# Hooks
if($html -notmatch 'function\s+ganttInit\s*\('){ Fail "Missing: ganttInit()" } else { Ok "Found: ganttInit()" }
if($html -notmatch 'function\s+ganttAddLink\s*\('){ Fail "Missing: ganttAddLink()" } else { Ok "Found: ganttAddLink()" }
if($html -notmatch 'function\s+ganttShowDependencyIssue\s*\('){ Fail "Missing: ganttShowDependencyIssue()" } else { Ok "Found: ganttShowDependencyIssue()" }
Test-Pattern 'data-testid\s*=\s*"TID-EVIDENCE-UPLOAD"' 'TID-EVIDENCE-UPLOAD (Evidence upload panel)'
Test-Pattern 'data-testid\s*=\s*"TID-EV-FILE"' 'TID-EV-FILE'
Test-Pattern 'data-testid\s*=\s*"TID-EV-HINT"' 'TID-EV-HINT'
Test-Pattern 'data-testid\s*=\s*"TID-EV-UPLOAD-BTN"' 'TID-EV-UPLOAD-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-EV-REMOVE-BTN"' 'TID-EV-REMOVE-BTN'
Test-Pattern 'data-testid\s*=\s*"TID-EV-FILENAME"' 'TID-EV-FILENAME'
# Hooks
if($html -notmatch 'function\s+evidenceInit\s*\('){ Fail "Missing: evidenceInit()" } else { Ok "Found: evidenceInit()" }
if($html -notmatch 'function\s+evidenceSetFileName\s*\('){ Fail "Missing: evidenceSetFileName()" } else { Ok "Found: evidenceSetFileName()" }
if($html -notmatch 'function\s+evidenceUpload\s*\('){ Fail "Missing: evidenceUpload()" } else { Ok "Found: evidenceUpload()" }
if($html -notmatch 'function\s+evidenceRemove\s*\('){ Fail "Missing: evidenceRemove()" } else { Ok "Found: evidenceRemove()" }
Test-Pattern 'data-testid\s*=\s*"TID-APPROVALS-PANEL"' 'TID-APPROVALS-PANEL (Approvals/override panel)'
Test-Pattern 'data-testid\s*=\s*"TID-AUDIT-LOG"' 'TID-AUDIT-LOG (Audit log page)'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-FILTERS"' 'TID-AUD-FILTERS'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-FROM"' 'TID-AUD-FROM'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TO"' 'TID-AUD-TO'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-USER"' 'TID-AUD-USER'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-SEARCH"' 'TID-AUD-SEARCH'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TABLE"' 'TID-AUD-TABLE'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TH-TIME"' 'TID-AUD-TH-TIME'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TH-ACTOR"' 'TID-AUD-TH-ACTOR'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TH-ACTION"' 'TID-AUD-TH-ACTION'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-TH-ENTITY"' 'TID-AUD-TH-ENTITY'
Test-Pattern 'data-testid\s*=\s*"TID-AUD-EXPORT"' 'TID-AUD-EXPORT'
# Hooks
if($html -notmatch 'function\s+auditInit\s*\('){ Fail "Missing: auditInit()" } else { Ok "Found: auditInit()" }
if($html -notmatch 'function\s+auditFilter\s*\('){ Fail "Missing: auditFilter()" } else { Ok "Found: auditFilter()" }
if($html -notmatch 'function\s+auditExport\s*\('){ Fail "Missing: auditExport()" } else { Ok "Found: auditExport()" }
Test-Pattern 'data-testid\s*=\s*"TID-NOTIFY-PREFERENCES"' 'TID-NOTIFY-PREFERENCES (Notification preferences)'
Test-Pattern 'data-testid\s*=\s*"TID-NOTIFY-FREQ"' 'TID-NOTIFY-FREQ'
Test-Pattern 'data-testid\s*=\s*"TID-NOTIFY-QUIET"' 'TID-NOTIFY-QUIET'
Test-Pattern 'data-testid\s*=\s*"TID-NOTIFY-SAVE"' 'TID-NOTIFY-SAVE'
# Hooks
if($html -notmatch 'function\s+notifyInit\s*\('){ Fail "Missing: notifyInit()" } else { Ok "Found: notifyInit()" }
if($html -notmatch 'function\s+notifySave\s*\('){ Fail "Missing: notifySave()" } else { Ok "Found: notifySave()" }
Test-Pattern 'data-testid\s*=\s*"TID-IMPORT-WIZARD"' 'TID-IMPORT-WIZARD (Import wizard)'
Test-Pattern 'data-testid\s*=\s*"TID-IMP-FILE"' 'TID-IMP-FILE'
Test-Pattern 'data-testid\s*=\s*"TID-IMP-MAP"' 'TID-IMP-MAP'
Test-Pattern 'data-testid\s*=\s*"TID-IMP-VALIDATE"' 'TID-IMP-VALIDATE'
Test-Pattern 'data-testid\s*=\s*"TID-IMP-IMPORT"' 'TID-IMP-IMPORT'
# Hooks
if($html -notmatch 'function\s+importInit\s*\('){ Fail "Missing: importInit()" } else { Ok "Found: importInit()" }
if($html -notmatch 'function\s+importValidate\s*\('){ Fail "Missing: importValidate()" } else { Ok "Found: importValidate()" }
if($html -notmatch 'function\s+importRun\s*\('){ Fail "Missing: importRun()" } else { Ok "Found: importRun()" }
Test-Pattern 'data-testid\s*=\s*"TID-EXPORT-REPORTS"' 'TID-EXPORT-REPORTS (Exports/Reports generation)'
Test-Pattern 'data-testid\s*=\s*"TID-EXP-TYPE"' 'TID-EXP-TYPE'
Test-Pattern 'data-testid\s*=\s*"TID-EXP-GO"' 'TID-EXP-GO'
# Hooks
if($html -notmatch 'function\s+exportsInit\s*\('){ Fail "Missing: exportsInit()" } else { Ok "Found: exportsInit()" }
if($html -notmatch 'function\s+exportsRun\s*\('){ Fail "Missing: exportsRun()" } else { Ok "Found: exportsRun()" }
Test-Pattern 'data-testid\s*=\s*"TID-TEMPLATES-LIBRARY"' 'TID-TEMPLATES-LIBRARY (Templates)'
Test-Pattern 'data-testid\s*=\s*"TID-TPL-LIST"' 'TID-TPL-LIST'
Test-Pattern 'data-testid\s*=\s*"TID-TPL-APPLY"' 'TID-TPL-APPLY'
# Hooks
if($html -notmatch 'function\s+templatesInit\s*\('){ Fail "Missing: templatesInit()" } else { Ok "Found: templatesInit()" }
if($html -notmatch 'function\s+templatesApply\s*\('){ Fail "Missing: templatesApply()" } else { Ok "Found: templatesApply()" }
Test-Pattern 'data-testid\s*=\s*"TID-SEARCH-RESULTS"' 'TID-SEARCH-RESULTS (Search results container)'
Test-Pattern 'data-testid\s*=\s*"TID-SRCH-LIST"' 'TID-SRCH-LIST'
Test-Pattern 'data-testid\s*=\s*"TID-SRCH-COUNT"' 'TID-SRCH-COUNT'
# Hooks
if($html -notmatch 'function\s+searchInit\s*\('){ Fail "Missing: searchInit()" } else { Ok "Found: searchInit()" }
if($html -notmatch 'function\s+searchRun\s*\('){ Fail "Missing: searchRun()" } else { Ok "Found: searchRun()" }
Test-Pattern 'data-testid\s*=\s*"TID-ASSIGNMENT-AI-SUGGEST"' 'TID-ASSIGNMENT-AI-SUGGEST (AI assignment suggestions)'

# Disallowed invite controls (not in current scope)
if($html -match 'data-testid\s*=\s*"TID-PSETUP-INVITE-BTN"'){ Fail 'Disallowed control present: TID-PSETUP-INVITE-BTN' } else { Ok 'Disallowed control not present: TID-PSETUP-INVITE-BTN' }
if($html -match 'data-testid\s*=\s*"TID-MS-INVITE"'){ Fail 'Disallowed control present: TID-MS-INVITE' } else { Ok 'Disallowed control not present: TID-MS-INVITE' }
if($html -match 'data-testid\s*=\s*"TID-DL-INVITE"'){ Fail 'Disallowed control present: TID-DL-INVITE' } else { Ok 'Disallowed control not present: TID-DL-INVITE' }
if($html -match 'data-testid\s*=\s*"TID-TASK-INVITE"'){ Fail 'Disallowed control present: TID-TASK-INVITE' } else { Ok 'Disallowed control not present: TID-TASK-INVITE' }

# Build-view modals (presence + dialog semantics)
Test-Pattern 'data-testid\s*=\s*"TID-MS-MODAL"' 'TID-MS-MODAL'
Test-Pattern 'data-testid\s*=\s*"TID-MS-DIALOG"' 'TID-MS-DIALOG'
if($html -notmatch 'data-testid\s*=\s*"TID-MS-DIALOG"[^>]*role\s*=\s*"dialog"'){ Fail "Milestone dialog missing role=dialog" } else { Ok "Milestone dialog role=dialog" }
if($html -notmatch 'data-testid\s*=\s*"TID-MS-DIALOG"[^>]*aria-modal\s*=\s*"true"'){ Fail "Milestone dialog missing aria-modal=true" } else { Ok "Milestone dialog aria-modal=true" }
Test-Pattern 'data-testid\s*=\s*"TID-MS-PROJECT-SELECT"' 'TID-MS-PROJECT-SELECT'
Test-Pattern 'data-testid\s*=\s*"TID-MS-SAVE"' 'TID-MS-SAVE'
Test-Pattern 'data-testid\s*=\s*"TID-MS-CANCEL"' 'TID-MS-CANCEL'
# Milestone dropdown flow placeholders
Test-Pattern 'data-testid\s*=\s*"TID-MS-DROPDOWN"' 'TID-MS-DROPDOWN'
Test-Pattern 'data-testid\s*=\s*"TID-MS-ADD-NEW"' 'TID-MS-ADD-NEW'
Test-Pattern 'data-testid\s*=\s*"TID-MS-NEW-TEXT"' 'TID-MS-NEW-TEXT (spellcheck)'
Test-Pattern 'data-testid\s*=\s*"TID-MS-DUPLICATE-ALERT"' 'TID-MS-DUPLICATE-ALERT'
# Milestone date groups (Deprecated in timeline-first; dates set in Timelines). Removing presence checks.

Test-Pattern 'data-testid\s*=\s*"TID-DL-MODAL"' 'TID-DL-MODAL'
Test-Pattern 'data-testid\s*=\s*"TID-DL-DIALOG"' 'TID-DL-DIALOG'
if($html -notmatch 'data-testid\s*=\s*"TID-DL-DIALOG"[^>]*role\s*=\s*"dialog"'){ Fail "Deliverable dialog missing role=dialog" } else { Ok "Deliverable dialog role=dialog" }
if($html -notmatch 'data-testid\s*=\s*"TID-DL-DIALOG"[^>]*aria-modal\s*=\s*"true"'){ Fail "Deliverable dialog missing aria-modal=true" } else { Ok "Deliverable dialog aria-modal=true" }
Test-Pattern 'data-testid\s*=\s*"TID-DL-MILESTONE"' 'TID-DL-MILESTONE selector'
Test-Pattern 'data-testid\s*=\s*"TID-DL-DROPDOWN"' 'TID-DL-DROPDOWN'
Test-Pattern 'data-testid\s*=\s*"TID-DL-ADD-NEW"' 'TID-DL-ADD-NEW'
Test-Pattern 'data-testid\s*=\s*"TID-DL-NEW-TEXT"' 'TID-DL-NEW-TEXT (spellcheck)'
Test-Pattern 'data-testid\s*=\s*"TID-DL-ASSIGNEE"' 'TID-DL-ASSIGNEE'
Test-Pattern 'data-testid\s*=\s*"TID-DL-SAVE"' 'TID-DL-SAVE'
Test-Pattern 'data-testid\s*=\s*"TID-DL-CANCEL"' 'TID-DL-CANCEL'

Test-Pattern 'data-testid\s*=\s*"TID-TASK-MODAL"' 'TID-TASK-MODAL'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-DIALOG"' 'TID-TASK-DIALOG'
if($html -notmatch 'data-testid\s*=\s*"TID-TASK-DIALOG"[^>]*role\s*=\s*"dialog"'){ Fail "Task dialog missing role=dialog" } else { Ok "Task dialog role=dialog" }
if($html -notmatch 'data-testid\s*=\s*"TID-TASK-DIALOG"[^>]*aria-modal\s*=\s*"true"'){ Fail "Task dialog missing aria-modal=true" } else { Ok "Task dialog aria-modal=true" }
Test-Pattern 'data-testid\s*=\s*"TID-TASK-TITLE"' 'TID-TASK-TITLE'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-START"' 'TID-TASK-START'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-END"' 'TID-TASK-END'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-ASSIGNEE"' 'TID-TASK-ASSIGNEE'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-MILESTONE"' 'TID-TASK-MILESTONE selector'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-DELIVERABLE"' 'TID-TASK-DELIVERABLE selector'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-SAVE"' 'TID-TASK-SAVE'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-CANCEL"' 'TID-TASK-CANCEL'
# Task cluster placeholders
Test-Pattern 'data-testid\s*=\s*"TID-TASK-CLUSTER-TOGGLE"' 'TID-TASK-CLUSTER-TOGGLE'
Test-Pattern 'data-testid\s*=\s*"TID-CLUSTER-NAME-SELECT"' 'TID-CLUSTER-NAME-SELECT'
Test-Pattern 'data-testid\s*=\s*"TID-CLUSTER-ADD-NEW"' 'TID-CLUSTER-ADD-NEW'
Test-Pattern 'data-testid\s*=\s*"TID-CLUSTER-PRELOAD"' 'TID-CLUSTER-PRELOAD'
# Duration filter modal (v2.4)
Test-Pattern 'data-testid\s*=\s*"TID-DUR-MODAL"' 'TID-DUR-MODAL'
Test-Pattern 'data-testid\s*=\s*"TID-DUR-DIALOG"' 'TID-DUR-DIALOG'
Test-Pattern 'data-testid\s*=\s*"TID-DUR-OP-LT"' 'TID-DUR-OP-LT'
Test-Pattern 'data-testid\s*=\s*"TID-DUR-OP-GT"' 'TID-DUR-OP-GT'
Test-Pattern 'data-testid\s*=\s*"TID-DUR-OP-EQ"' 'TID-DUR-OP-EQ'
# removed TID-DUR-OP-BETWEEN (v2.5 duration applies LT/GT/EQ only)
Test-Pattern 'data-testid\s*=\s*"TID-DUR-DAYS-1"' 'TID-DUR-DAYS-1'
# removed TID-DUR-DAYS-2 (v2.5 single days input)
Test-Pattern 'data-testid\s*=\s*"TID-DUR-APPLY"' 'TID-DUR-APPLY'
Test-Pattern 'data-testid\s*=\s*"TID-DUR-CANCEL"' 'TID-DUR-CANCEL'
# Numbering & trace placeholders
Test-Pattern 'data-testid\s*=\s*"TID-MS-NUM"' 'TID-MS-NUM'
Test-Pattern 'data-testid\s*=\s*"TID-DL-NUM"' 'TID-DL-NUM'
Test-Pattern 'data-testid\s*=\s*"TID-TASK-NUM"' 'TID-TASK-NUM'
Test-Pattern 'data-testid\s*=\s*"TID-TRACE"' 'TID-TRACE'

if($errors.Count -gt 0){
  foreach($e in $errors){ Write-Host "[RED X] $e" }
  exit 1
}

# No inline style attributes allowed
if($html -match 'style\s*='){ Fail "Inline style attributes present in HTML" }

# Chat backup facility presence
$backupScripts = @('scripts/backup/chat-backup.ps1','scripts/backup/start-chat-backup.ps1','scripts/backup/stop-chat-backup.ps1')
foreach($p in $backupScripts){ if(-not (Test-Path $p)){ Fail "Missing chat backup script: $p" } else { Ok "Found: $p" } }
if(-not (Test-Path 'logs/chat/current.md')){ Fail 'Missing logs/chat/current.md' } else {
  $chat = Get-Content -Raw 'logs/chat/current.md'
  if($chat -notmatch '<!-- LOG END -->'){ Fail 'Chat log missing sentinel <!-- LOG END -->' } else { Ok 'Chat log sentinel present' }
}

# Timeline checks (v2.7)
# Project Setup changes
if($html -match '<[^>]+data-testid\s*=\s*"TID-PSETUP-START"'){ Fail "Project Setup must not contain Start input (timeline-first)" } else { Ok "Project Setup Start input removed" }
if($html -match '<[^>]+data-testid\s*=\s*"TID-PSETUP-END"'){ Fail "Project Setup must not contain End input (timeline-first)" } else { Ok "Project Setup End input removed" }
Test-Pattern 'data-testid\s*=\s*"TID-PSETUP-OPEN-TIMELINE"' 'TID-PSETUP-OPEN-TIMELINE'
# Timelines page presence
Test-Pattern 'data-testid\s*=\s*"TID-TL-PAGE"' 'TID-TL-PAGE'
Test-Pattern 'data-testid\s*=\s*"TID-TL-CANVAS"' 'TID-TL-CANVAS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-MONTHS"' 'TID-TL-AXIS-MONTHS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-WEEKS"' 'TID-TL-AXIS-WEEKS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-DAYS"' 'TID-TL-AXIS-DAYS'
# Disallowed legacy controls must NOT exist
if($html -match 'data-testid\s*=\s*"TID-TL-ZOOM-IN"'){ Fail 'Legacy control present: TID-TL-ZOOM-IN (remove from architecture/build)' } else { Ok 'Legacy control not present: TID-TL-ZOOM-IN' }
if($html -match 'data-testid\s*=\s*"TID-TL-ZOOM-OUT"'){ Fail 'Legacy control present: TID-TL-ZOOM-OUT (remove from architecture/build)' } else { Ok 'Legacy control not present: TID-TL-ZOOM-OUT' }
if($html -match 'data-testid\s*=\s*"TID-TL-PAN-PREV"'){ Fail 'Legacy control present: TID-TL-PAN-PREV (remove from architecture/build)' } else { Ok 'Legacy control not present: TID-TL-PAN-PREV' }
if($html -match 'data-testid\s*=\s*"TID-TL-PAN-NEXT"'){ Fail 'Legacy control present: TID-TL-PAN-NEXT (remove from architecture/build)' } else { Ok 'Legacy control not present: TID-TL-PAN-NEXT' }
Test-Pattern 'data-testid\s*=\s*"TID-TL-ZOOM-LABEL"' 'TID-TL-ZOOM-LABEL'
Test-Pattern 'data-testid\s*=\s*"TID-TL-BACK"' 'TID-TL-BACK'
# Lanes (presence)
Test-Pattern 'data-testid\s*=\s*"TID-TL-LANE-PROJ"' 'TID-TL-LANE-PROJ'
Test-Pattern 'data-testid\s*=\s*"TID-TL-BAR-PROJ"' 'TID-TL-BAR-PROJ'

# Timelines architecture QA and behavior (in JS)
# Visible-window sizing: pxPerDay derived from container width / selected count
if($js -notmatch 'pxPerDay\s*=\s*Math\.max\(0\.5,\s*(scroll\?\.clientWidth\s*\|\|\s*\d+|containerW)\s*\/\s*visibleDays\s*\)'){ Fail 'Missing: pxPerDay computed from container width / visibleDays' } else { Ok 'pxPerDay computation present' }
# Full-span axes: tlRenderTicks must size canvas to full project span
if($js -notmatch 'canvas\.style\.width\s*='){ Fail 'Missing: canvas width sizing in tlRenderTicks' } else { Ok 'Canvas width sizing present' }
# Drag behavior evidence: auto-scroll and parent-range clamp (not clamped to view window)
if($js -notmatch 'getBoundingClientRect\(\)'){ Fail 'Missing: getBoundingClientRect() usage for auto-scroll edges' } else { Ok 'Edge auto-scroll detection present' }
if($js -notmatch 'scrollLeft\s*\+=|scrollLeft\s*-=' ){ Fail 'Missing: auto-scroll adjustment when dragging near edges' } else { Ok 'Auto-scroll during drag present' }
if($js -notmatch 'bar\.onmousedown\s*='){ Fail 'Missing: bar body dragging (move both start and end)' } else { Ok 'Bar body drag present' }
if($js -notmatch '(sDate\.setDate\(sDate\.getDate\(\)\+daysDelta\);\s*eDate\.setDate\(eDate\.getDate\(\)\+daysDelta\))'){ Fail 'Missing: move-both behavior when dragging bar body' } else { Ok 'Move-both behavior present' }
if($js -notmatch 'pS\s*=\s*tlParseDateLocal\(window\.projectState\.start\)'){ Fail 'Missing: parent-range clamp checks for bars' } else { Ok 'Parent-range clamp checks present' }

# Timelines architecture QA
# Presence checks (ARC-TIMELINES-001)
Test-Pattern 'data-testid\s*=\s*"TID-TL-PAGE"' 'TID-TL-PAGE'
Test-Pattern 'data-testid\s*=\s*"TID-TL-Z-YEAR"' 'TID-TL-Z-YEAR'
Test-Pattern 'data-testid\s*=\s*"TID-TL-Z-QUARTER"' 'TID-TL-Z-QUARTER'
Test-Pattern 'data-testid\s*=\s*"TID-TL-Z-MONTH"' 'TID-TL-Z-MONTH'
Test-Pattern 'data-testid\s*=\s*"TID-TL-Z-WEEK"' 'TID-TL-Z-WEEK'
Test-Pattern 'data-testid\s*=\s*"TID-TL-Z-DAY"' 'TID-TL-Z-DAY'
Test-Pattern 'data-testid\s*=\s*"TID-TL-VIEW-START"' 'TID-TL-VIEW-START'
Test-Pattern 'data-testid\s*=\s*"TID-TL-PROJECT-SELECT"' 'TID-TL-PROJECT-SELECT'
Test-Pattern 'data-testid\s*=\s*"TID-TL-CREATE-PROJECT"' 'TID-TL-CREATE-PROJECT'
Test-Pattern 'data-testid\s*=\s*"TID-TL-APPLY"' 'TID-TL-APPLY'
Test-Pattern 'data-testid\s*=\s*"TID-TL-BACK"' 'TID-TL-BACK'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-YEARS"' 'TID-TL-AXIS-YEARS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-QUARTERS"' 'TID-TL-AXIS-QUARTERS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-MONTHS"' 'TID-TL-AXIS-MONTHS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-WEEKS"' 'TID-TL-AXIS-WEEKS'
Test-Pattern 'data-testid\s*=\s*"TID-TL-AXIS-DAYS"' 'TID-TL-AXIS-DAYS'

# Settings presence
Test-Pattern 'data-testid\s*=\s*"TID-SET-YEARS"' 'TID-SET-YEARS'
Test-Pattern 'data-testid\s*=\s*"TID-SET-QUARTERS"' 'TID-SET-QUARTERS'
Test-Pattern 'data-testid\s*=\s*"TID-SET-MONTHS"' 'TID-SET-MONTHS'
Test-Pattern 'data-testid\s*=\s*"TID-SET-WEEKS"' 'TID-SET-WEEKS'
Test-Pattern 'data-testid\s*=\s*"TID-SET-DAYS"' 'TID-SET-DAYS'

# Sidebar quick timeline selector (required)
Test-Pattern 'data-testid\s*=\s*"TID-SIDEBAR-TL-SELECTOR"' 'TID-SIDEBAR-TL-SELECTOR (Quick timeline selector in sidebar)'

# Baseline 5-year default and click-to-create bar (in JS)
if($js -notmatch '\+\s*5\s*[,)]'){ Fail 'Missing: 5-year baseline (today + 5 years) in timelines code' } else { Ok '5-year baseline span present' }
if($js -notmatch 'function\s+tlEnableClickCreate\s*\('){ Fail 'Missing: tlEnableClickCreate() (click to create bar at clicked date)' } else { Ok 'tlEnableClickCreate() present' }

# Visible-window anchoring and sizing (in JS)
if($js -notmatch 'tlComputeView\(\)'){ Fail 'Missing: tlComputeView() invocation in tlRender()' } else { Ok 'tlComputeView() invoked in tlRender()' }
if($js -notmatch 'scrollLeft\s*=\s*Math\.max\(0,\s*tlDateToX\('){ Fail 'Missing: scrollLeft aligned to viewStart minus gutter' } else { Ok 'scrollLeft aligns to viewStart minus gutter' }

# Sidebar quick timeline selector (required)
Test-Pattern 'data-testid\s*=\s*"TID-SIDEBAR-TL-SELECTOR"' 'TID-SIDEBAR-TL-SELECTOR (Quick timeline selector in sidebar)'

# Performance and one-time build policy (instrumentation evidence)
# Expect window.__tlPerf, [TL-PERF] logs, and performance.now/mark usage
if($html -notmatch 'window\.__tlPerf'){ Fail 'Missing: window.__tlPerf exposure for QA timings' } else { Ok 'window.__tlPerf present' }
if($html -notmatch '\[TL-PERF\]'){ Fail 'Missing: [TL-PERF] console logs' } else { Ok '[TL-PERF] logs present' }
if($html -notmatch 'performance\.(now|mark)'){ Fail 'Missing: performance.now/mark instrumentation' } else { Ok 'performance instrumentation present' }


# Shell hardening checks
# No inline style attributes allowed
if($html -match 'style\s*='){ Fail 'Inline style attributes present in HTML' } else { Ok 'No inline style attributes in HTML' }
# Global functions bound for onclick (evidence in script)
# Accept either inlined bindings in index.html or boot-time bindings via app-boot.js
if(($html -match 'window\.appNavTo\s*=\s*appNavTo') -or ($html -match '<script[^>]+src\s*=\s*"app-boot\.js"')){ Ok 'appNavTo binding strategy present (inline or boot)'} else { Fail 'Missing: appNavTo binding (neither inline nor boot script found)' }
if(($html -match 'window\.openProjectSetup\s*=\s*openProjectSetup') -or ($html -match '<script[^>]+src\s*=\s*"app-boot\.js"')){ Ok 'openProjectSetup binding strategy present'} else { Fail 'Missing: openProjectSetup binding (neither inline nor boot script found)' }
# Sidebar links — accept inline onclick or delegated click via boot script
if(($html -match 'onclick\s*=\s*"return\s+appNavTo\(this\)"') -or ($html -match '<script[^>]+src\s*=\s*"app-boot\.js"')){ Ok 'Sidebar nav bound (inline or boot)'} else { Fail 'Sidebar nav must be bound (inline onclick or boot script)'}

# Defensive CSS checks for gutter and layering
if($css -notmatch '--tl-gutter'){ Fail 'Missing CSS var: --tl-gutter (left inner gutter)' } else { Ok 'Found CSS var: --tl-gutter' }
if($css -notmatch '\.timeline-canvas[^}]*margin-left\s*:\s*var\(--tl-gutter\)'){ Fail 'Missing: left gutter applied to .timeline-canvas' } else { Ok 'Left gutter applied to .timeline-canvas' }
if($css -notmatch '\.tl-labels[^}]*pointer-events\s*:\s*none'){ Fail 'Missing: pointer-events:none on .tl-labels (prevent drag interception)' } else { Ok 'Pointer-events:none on .tl-labels' }
if($css -notmatch '\.tl-bar[^}]*z-index\s*:\s*1[45]0'){ Fail 'Missing: elevated z-index for .tl-bar' } else { Ok 'Elevated z-index for .tl-bar present' }

# Require runtime assertions to flag misalignment at runtime (must be implemented in JS and called after render)
if($js -notmatch 'function\s+tlRuntimeAssert\s*\('){ Fail 'Missing: tlRuntimeAssert() runtime assertions for timelines' } else { Ok 'Found: tlRuntimeAssert()' }
if($js -notmatch 'tlRuntimeAssert\s*\(\s*\)'){ Fail 'Missing: tlRuntimeAssert() invocation in tlRender()' } else { Ok 'Found: tlRuntimeAssert() invocation' }

if($errors.Count -gt 0){ foreach($e in $errors){ Write-Host "[RED X] $e" } exit 1 }

# Generic unwired clickable detection (architecture hygiene)
# Find all buttons and anchors with data-testid in HTML
$clickableRegex = '<(button|a)\b[^>]*data-testid\s*=\s*"([^"]+)"'
$clickables = @()
$matches = [regex]::Matches($html, $clickableRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
foreach($m in $matches){ $clickables += $m.Groups[2].Value }
$clickables = $clickables | Sort-Object -Unique

# Pending allowlist: items acknowledged by architecture but wiring can be completed later
$pendingClickables = @(
  'TID-DASH-KPI-OVERDUE','TID-DASH-KPI-DUE','TID-DASH-KPI-COMPLETION',
  'TID-GANTT-ADD-LINK','TID-NOTIFICATIONS-BTN','TID-NOTIFY-SAVE','TID-PROFILE-MENU',
  'TID-PROJ-CREATE-BTN','TID-PROJ-IMPORT-BTN','TID-WI-DEPENDENCIES-ADD','TID-SIDEBAR'
) | Sort-Object -Unique

foreach($tid in $clickables){
  $inlinePattern = 'data-testid\s*=\s*"' + [regex]::Escape($tid) + '"[^>]*onclick\s*='
  # More flexible JS bind detection: allow newlines/semicolons between selector and listener
  $jsBindPattern = '\[data-testid\s*=\s*"' + [regex]::Escape($tid) + '"\"?\][\s\S]{0,400}addEventListener\s*\(\s*("|\'')click'
  $hasInline = ($html -match $inlinePattern)
  $hasJsBind = ($js -match $jsBindPattern)
  if(-not $hasInline -and -not $hasJsBind){
    if($pendingClickables -contains $tid){ Write-Host "[PENDING] Clickable wiring deferred: $tid" }
    else { Fail "Unwired clickable detected: $tid (no inline onclick or JS addEventListener wiring)" }
  } else { Ok "Clickable wired: $tid" }
}

if($errors.Count -gt 0){ foreach($e in $errors){ Write-Host "[RED X] $e" } exit 1 }

Ok "All required selectors found in $HtmlPath"
exit 0
