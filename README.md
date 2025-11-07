# PIT - Project Implementation Tracker

A comprehensive project implementation and operations tracking system designed for large enterprises with multiple users and interfaces.

## 🚀 Quick Access

👉 **[Open App Now](https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/)** 👈

The application is automatically deployed to GitHub Pages. Just click the link above - no setup needed!

## Overview

PIT (Project Implementation Tracker) is a static web application for tracking project implementations and daily operations in large organizations.

### Key Features
- **Dashboard**: View project KPIs, overdue items, and completion rates
- **Projects**: Manage and track multiple projects with status, priority, and progress
- **Operations/Work Items**: Track daily operations and task assignments
- **User Management**: Multi-user support with role-based access
- **Reports & Analytics**: Generate insights and track completion rates
- **Evidence & Documentation**: Store and track project documentation

## Installation & Usage

### GitHub Pages (Recommended)
Access the live application at: https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/

### Local Development

**One-Click Launcher:**
1. Download [LAUNCH-APP.html](LAUNCH-APP.html)
2. Save to your Desktop
3. Double-click anytime to launch!

**Using Python Server:**

Windows:
```bash
python server/serve_static.py --port 8080
# Or use: start-server.bat 8080
```

macOS/Linux:
```bash
python3 server/serve_static.py --port 8080
# Or use: ./start-server.sh 8080
```

Access at: `http://localhost:8080`

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Python 3 (SimpleHTTPServer for development)
- **Deployment**: GitHub Pages
- **Testing**: pytest

## Architecture

### Multi-Interface Support
- Web browser interface (primary UI)
- Ability to add mobile interfaces
- Integration capabilities with enterprise systems

### Multi-User Support
- Concurrent user access
- Individual user accounts with roles
- Assignment tracking per user
- Role-based access control

### Enterprise Features
- Scalable architecture
- Environment-based configuration
- Comprehensive error handling

## Documentation

- **[QA Quick Start](QA_QUICK_START.md)** - Get started with the QA system
- **[QA System Documentation](docs/QA_SYSTEM.md)** - Complete QA and Health Checker guide
- [Getting Started Guide](GETTING_STARTED.md) - Comprehensive setup instructions
- [Developer Documentation](README.dev.md) - Development guidelines
- [Architecture Documentation](docs/architecture/) - System architecture
- [QA Specifications](docs/qa/) - Testing specifications
- [Rules & Governance](rules.md) - Architecture-first principles ("True North")

## Quality Assurance

This project follows an **architecture-first, QA-driven** workflow:

✅ **Current Status**: 🟢 GREEN (33/33 checks passing)

### Quick QA Check

```bash
# Run comprehensive QA
python3 qa/run_qa.py

# View results in the UI
# 1. Set role to "Admin" in sidebar
# 2. Click "Health Checker" under Admin Tools
# 3. Click "Run Health Check"
```

See **[QA_QUICK_START.md](QA_QUICK_START.md)** for complete guide.

## Contributing

Contributions are welcome! Please follow the architecture-first workflow:

1. **Update architecture** documents first (`docs/architecture/`)
2. **Update QA requirements** (`qa/requirements.json`)
3. **Implement** the feature
4. **Run QA** until GREEN: `python3 qa/run_qa.py`
5. **Submit PR** with QA report

See [rules.md](rules.md) for detailed governance.

## License

ISC

## Support

For enterprise support and customization, please contact the development team.
