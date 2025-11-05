# PIT-Project-Implementation-Tracker

A comprehensive Project Management Platform for tracking project implementation, timelines, work items, and evidence.

## 🚀 Easiest Way to Access (No Setup Required!)

**GitHub Pages - Live Application:**
👉 **[Open App Now](https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/)** 👈

The application is automatically deployed to GitHub Pages. Just click the link above - no server setup needed!

### 🖱️ One-Click Launcher

Download and save [LAUNCH-APP.html](LAUNCH-APP.html) to your desktop for instant access:
1. Right-click the file in GitHub and "Save link as"
2. Save to your Desktop
3. Double-click anytime to launch the app!

The launcher provides:
- Quick access to GitHub Pages (no setup required)
- Option to open localhost if you prefer local development
- Built-in instructions and troubleshooting

## 💻 Local Development (Optional)

If you prefer to run the app locally on your machine:

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

## 📁 About Your Local Files

**Important:** Don't worry if files get deleted from your local folder!

- ✅ All project files are safely stored in **GitHub** (the source of truth)
- ✅ You can access the live app via **GitHub Pages** without any local files
- ✅ Your local folder is just a working copy for development
- ✅ Use `git pull` to sync the latest version from GitHub when needed

**Recommended workflow:**
1. Use the GitHub Pages link for daily use (no local files needed)
2. Only clone locally if you want to make changes to the code
3. All your work is safe in GitHub - local copies are optional

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
