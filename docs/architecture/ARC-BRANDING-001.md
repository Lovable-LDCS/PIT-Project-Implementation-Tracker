---
id: ARC-BRANDING-001
title: Branding - Colors, Fonts, and Logo
status: Draft v1.0
scope: Define brand tokens and logo placement for MVP
---

1) Tokens
- Colors:
  - Primary: #006B92
  - Accent: #0D2850
  - Secondary1: #4C95B0
  - Secondary2: #CCE1E9
- Fonts:
  - Body: Trebuchet MS
  - Headings: Trebuchet MS

2) Placement
- Top bar: accent background (#0D2850) with white text
- Sidebar: Secondary2 background (#CCE1E9)
- Active nav item: Primary background (#006B92) with white text
- Buttons:
  - Primary action: .btn.primary uses Primary background, white text

3) Logo
- data-testid="TID-BRAND-LOGO" in top bar left area
- src/frontend/assets/logo-placeholder.svg as default; replaceable by uploaded logo

4) QA
- Presence of TID-BRAND-LOGO element
- CSS variables for brand colors and fonts are defined
