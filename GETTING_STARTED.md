# Getting Started with PIT Project Management Platform

## 🚀 Quick Start

To run the application, you need to start the development server first.

### Step 1: Start the Server

Open a terminal/command prompt in the project directory and run:

**Windows (PowerShell or Command Prompt):**
```bash
python server/serve_static.py --port 8080
```

**macOS/Linux:**
```bash
python3 server/serve_static.py --port 8080
```

**Or use the convenience script:**
- **Windows**: Double-click `start-server.bat` or run `start-server.bat 8080`
- **macOS/Linux**: Run `./start-server.sh 8080`

You should see output like:
```
Serving /path/to/src/frontend at http://localhost:8080
```

### Step 2: Access the Application

Once the server is running, open your web browser and navigate to:
```
http://localhost:8080
```

**Important**: Keep the terminal window open while using the application. Press `Ctrl+C` to stop the server when done.

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

## 🔧 Server Management

### Stop the Server

If you started the server in a terminal window, simply press `Ctrl+C` in that terminal.

If the server is running in the background:
```bash
# Find the process
ps aux | grep "python3.*serve_static"

# Kill the process (replace PID with the actual process ID from above)
kill <PID>
```

### Check if Server is Running
```bash
# Check if port 8080 is in use
netstat -tulpn | grep 8080

# Or test with curl
curl -I http://localhost:8080

# Or check for the process
ps aux | grep "python3.*serve_static"
```

### Using a Different Port

If port 8080 is already in use, you can use a different port:
```bash
# Use port 3000 instead
python3 server/serve_static.py --port 3000

# Then access at http://localhost:3000
```

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

- The frontend is built with vanilla HTML, CSS, and JavaScript
- No build process required - changes are immediately visible
- Static files served from `src/frontend/`
- Port 8080 is configured as requested
- All navigation uses hash-based routing (#/page)

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
