"""Pytest QA checks derived from ARC-APP-SHELL-001 (lightweight, stdlib only).

These tests validate the static evidence expected by the architecture:
- presence of key data-testid attributes in src/frontend/index.html
- no inline style attributes in the HTML
- presence of expected global function names used by onclick wiring
- presence of favicon link

This avoids PowerShell and uses pytest so it runs cross-platform.
"""
import re
import os


ROOT = os.path.dirname(os.path.dirname(__file__))
INDEX = os.path.join(ROOT, 'src', 'frontend', 'index.html')


def load_index():
    with open(INDEX, 'r', encoding='utf-8') as f:
        return f.read()


REQUIRED_TIDS = [
    'TID-SHELL-ROOT', 'TID-TOPBAR', 'TID-SIDEBAR', 'TID-BREADCRUMBS',
    'TID-GLOBAL-SEARCH', 'TID-ORG-SCOPE-SELECTOR', 'TID-NOTIFICATIONS-BTN',
    'TID-PROFILE-MENU', 'TID-COMPANY-FILTER', 'TID-DEPT-FILTER',
    'TID-NAV-DASHBOARD', 'TID-NAV-PROJECTS', 'TID-NAV-REPORTS', 'TID-NAV-PERMISSIONS',
    'TID-NAV-WORKITEM', 'TID-NAV-EVIDENCE', 'TID-NAV-GANTT', 'TID-NAV-AUDIT',
    'TID-NAV-NOTIFY', 'TID-NAV-IMPORT', 'TID-NAV-EXPORTS', 'TID-NAV-TEMPLATES',
    'TID-NAV-SEARCH', 'TID-CONTENT-AREA', 'TID-PROBLEMS-INDICATOR', 'TID-PROBLEMS-PANEL',
]


REQUIRED_FUNCTIONS = [
    'appNavTo', 'openProjectSetup', 'closeProjectSetup', 'saveProject',
    'tlSetZoom', 'tlRender', 'tlInitFromStore', 'runWiringChecks', 'computeStatusDescriptor'
]


def test_index_exists():
    assert os.path.exists(INDEX), f"Missing {INDEX}"


def test_required_tids_present():
    html = load_index()
    missing = [tid for tid in REQUIRED_TIDS if tid not in html]
    assert not missing, f"Missing required data-testid values in index.html: {missing}"


def test_no_inline_style_attributes():
    html = load_index()
    # detect style=" or style=' attribute usage in HTML
    if re.search(r"style\s*=\s*\"", html) or re.search(r"style\s*=\s*\'", html):
        # allow style occurrences inside <script> blocks (JS strings) but fail if attribute-like pattern outside scripts
        # crude approach: remove script blocks then search again
        stripped = re.sub(r"<script[\s\S]*?</script>", '', html, flags=re.IGNORECASE)
        assert not re.search(r"style\s*=\s*\"|style\s*=\s*\'", stripped), "Found inline style attributes in index.html"


def test_required_function_names_exist():
    html = load_index()
    # Also scan referenced JS files in same folder (app-main.js). If missing, rely on inline script presence.
    js_files = []
    js_files.append(os.path.join(ROOT, 'src', 'frontend', 'app-main.js'))
    contents = html
    for jf in js_files:
        if os.path.exists(jf):
            with open(jf, 'r', encoding='utf-8') as f:
                contents += '\n' + f.read()

    missing = []
    for name in REQUIRED_FUNCTIONS:
        pattern = re.compile(r"\bfunction\s+" + re.escape(name) + r"\b")
        pattern2 = re.compile(r"window\." + re.escape(name) + r"\b")
        pattern3 = re.compile(re.escape(name) + r"\s*=\s*function\b")
        pattern4 = re.compile(re.escape(name) + r"\s*\(")
        if not (pattern.search(contents) or pattern2.search(contents) or pattern3.search(contents) or pattern4.search(contents)):
            missing.append(name)

    assert not missing, f"Required function names not found (static scan): {missing}"


def test_favicon_present():
    html = load_index()
    assert '<link rel="icon"' in html or "rel='icon'" in html, "No favicon link found in index.html"
