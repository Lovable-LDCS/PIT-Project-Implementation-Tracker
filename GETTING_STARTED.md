# Getting Started with PIT Project Management Platform

## 🌐 Easiest Option: GitHub Pages (Recommended!)

**No setup, no installation, no server - just click and use!**

👉 **[Launch App from GitHub Pages](https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/)** 👈

This is the easiest way to access your PM Platform:
- ✅ Works instantly - no configuration needed
- ✅ Always up-to-date with latest changes
- ✅ Access from any device with a browser
- ✅ No need to keep a local copy of files
- ✅ No need to run a server on your computer

### 🖱️ Direct File Access

Since this is a static app, you can also:

1. Download the repository as ZIP from GitHub
2. Extract to your preferred location
3. Open `src/frontend/index.html` directly in any web browser
4. No server needed for basic functionality!

## 💻 Alternative: Run Locally (Optional)

Only use this if you need to develop or customize the app. Otherwise, use GitHub Pages above!

### Quick Start - No Server Required!

The simplest way to run locally:

```bash
# Just open the HTML file directly!
open src/frontend/index.html  # macOS
xdg-open src/frontend/index.html  # Linux  
start src/frontend/index.html  # Windows
```

### Using a Local Server (Better for Development)

For a better development experience with proper URLs:

**Python (built-in to most systems):**
```bash
cd src/frontend
python3 -m http.server 8080
# Windows: python -m http.server 8080
```

**Node.js:**
```bash
npx serve src/frontend -p 8080
```

**PHP:**
```bash
php -S localhost:8080 -t src/frontend
```

Then open: http://localhost:8080

## 📁 About File Management

**Your files keep getting deleted? Here's what you need to know:**

- 🏠 **GitHub is your "home base"** - All files are safely stored there
- 💻 **Local folder is optional** - You only need it for development
- 🌐 **Use GitHub Pages** - No local files needed to run the app
- 🔄 **Sync when needed** - Use `git pull` if you want to update your local copy
- ✅ **Everything is backed up** - Your work is safe in GitHub, not dependent on local files

**Recommended approach:**
1. Use the **GitHub Pages link** for daily work (no local setup needed)
2. Only clone/sync files locally if you're making code changes
3. Don't worry about local file management - GitHub is the source of truth

## 🎯 Main Features

### Main Features Available

1. **Dashboard** - Project overview with KPIs
   - View overdue items
   - Track due soon items
   - Monitor completion rates
   - Filter by timeframe

2. **Projects** - Manage all your projects
   - Create new projects
   - Track project status
   - Filter by company/department

3. **Gantt Charts** - Visual timeline management
   - View project dependencies
   - Drag and drop timeline items
   - Add dependency links

4. **Timelines** - Track progress over time
   - Multiple timeline views
   - Test timeline features

5. **Work Items** - Task management
   - Create and assign tasks
   - Track completion status

6. **Evidence** - Documentation storage
   - Upload and manage evidence files
   - Link evidence to projects

7. **Reports** - Analytics and insights
   - Generate custom reports
   - Export data

8. **Permissions** - Access control
   - Role-based permissions
   - User management

9. **Additional Features**:
   - Audit Log - Track all changes
   - Notifications - Stay updated
   - Import/Export - Data portability
   - Templates - Reusable structures
   - Search - Find anything quickly

## 🔧 Development Tips

### No Build Process
- This is a **pure static app** - no compilation needed
- Changes to HTML/CSS/JS are immediately visible
- Just refresh your browser to see updates

### Browser DevTools
- Press F12 to open DevTools
- Use Console tab to debug JavaScript
- Use Network tab to verify all resources load
- Use Application tab to inspect LocalStorage

### Data Storage
- All data stored in browser's LocalStorage
- Each browser/device has independent data
- Clear browser data will reset the app
- Export data before clearing browser storage

## 📚 Architecture & Documentation

The project includes comprehensive documentation:

- **Architecture Docs**: `docs/architecture/` (25+ documents)
  - App Shell (ARC-APP-SHELL-001.md)
  - Dashboard (ARC-DASHBOARD-001.md)
  - Gantt (ARC-GANTT-001.md)
  - Timelines (ARC-TIMELINES-001.md)
  - RBAC (ARC-RBAC-*.md)
  - And many more...

- **QA Specifications**: `docs/qa/` (12+ documents)
  - Test specifications for each major component
  - Performance testing guidelines

## 🛠️ Development Notes

- **Pure Static**: HTML, CSS, and vanilla JavaScript only
- **No Backend**: All logic runs in the browser
- **No Build**: Changes are immediately visible
- **Hash Routing**: Navigation uses `#/page` format
- **LocalStorage**: Data persists in browser storage
- **Test IDs**: Elements have `data-testid` attributes for QA

See [docs/STATIC-ARCHITECTURE.md](docs/STATIC-ARCHITECTURE.md) for complete details.

## ⚡ Tips

1. **Refresh** your browser after making changes to see updates
2. Use **browser DevTools** (F12) to inspect and debug
3. Check the **console** for any JavaScript errors
4. The application uses **test IDs** (data-testid) for QA automation

## 🐛 Troubleshooting

**"python3 is not recognized" (Windows)**

On Windows, use `python` instead of `python3`:
```bash
python server/serve_static.py --port 8080
```

Or use the Windows batch script:
```bash
start-server.bat 8080
```

**"python is not recognized" (Any OS)**

Python is not installed or not in your PATH. Install Python:
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: Use `brew install python3` or download from python.org
- **Linux**: Use your package manager (e.g., `sudo apt install python3`)

**Port already in use?**

Windows:
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Use a different port
python server/serve_static.py --port 3000
```

macOS/Linux:
```bash
# Find what's using port 8080
lsof -i :8080

# Use a different port
python3 server/serve_static.py --port 3000
```

**Server not responding?**

Windows:
```bash
# Check if the process is running
tasklist | findstr python
```

macOS/Linux:
```bash
# Check if the process is running
ps aux | grep serve_static
```

**Can't access from browser?**
- Ensure you're using `http://` not `https://`
- Try `http://127.0.0.1:8080` instead of localhost
- Check firewall settings if accessing from another machine
- Make sure the server is still running in the terminal

## 📞 Next Steps

1. Explore the application at http://localhost:8080
2. Review the architecture docs in `docs/architecture/`
3. Check the QA specifications in `docs/qa/`
4. Start creating projects and testing features!

---

**Enjoy your Project Management Platform!** 🎉
