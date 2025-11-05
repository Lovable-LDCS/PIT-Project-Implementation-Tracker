# PIT-Project-Implementation-Tracker

A comprehensive Project Management Platform for tracking project implementation, timelines, work items, and evidence.

## Quick Start

1. **Start the server** - Open a terminal/command prompt and run:
   
   **Windows (PowerShell/Command Prompt):**
   ```bash
   python server/serve_static.py --port 8080
   ```
   
   **macOS/Linux:**
   ```bash
   python3 server/serve_static.py --port 8080
   ```
   
   **Or use the convenience script:**
   - Windows: `start-server.bat 8080`
   - macOS/Linux: `./start-server.sh 8080`

2. **Access the application** - Open your browser and go to:
   ```
   http://localhost:8080
   ```

3. **Stop the server** - Press `Ctrl+C` in the terminal when done.

> 📖 For detailed instructions, troubleshooting, and features guide, see [GETTING_STARTED.md](GETTING_STARTED.md)

## Features

- **Dashboard**: View project KPIs, overdue items, and completion rates
- **Projects**: Manage and track multiple projects
- **Gantt Charts**: Visualize project timelines and dependencies
- **Timelines**: Track project progress over time
- **Work Items**: Manage tasks and assignments
- **Evidence**: Store and track project documentation
- **Reports**: Generate insights and analytics
- **Permissions**: Role-based access control
- **Audit Log**: Track changes and activities
- **Import/Export**: Data portability
- **Templates**: Reusable project structures

## Documentation

- See [README.dev.md](README.dev.md) for local development instructions
- Architecture documentation in [docs/architecture/](docs/architecture/)
- QA specifications in [docs/qa/](docs/qa/)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Python 3 (SimpleHTTPServer for development)
- **Testing**: pytest (for QA validation)
