# Getting Started with PIT Project Management Platform

## 🚀 Server is Running!

Your development server is currently running at:
**http://localhost:8080**

## 📋 Current Status

✅ Server Status: RUNNING
✅ Port: 8080
✅ Process ID: 3365
✅ Mode: Detached (will continue running)

## 🎯 How to Use

### Accessing the Application
Simply open your web browser and navigate to:
```
http://localhost:8080
```

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
If you need to stop the server:
```bash
# Find the process
ps aux | grep "python3.*serve_static"

# Kill the process (use the PID from above, currently 3365)
kill 3365
```

### Restart the Server
```bash
# Method 1: Using the convenience script
./start-server.sh 8080

# Method 2: Direct command
python3 server/serve_static.py --port 8080

# Method 3: Use a different port
python3 server/serve_static.py --port 3000
```

### Check if Server is Running
```bash
# Check if port 8080 is in use
netstat -tulpn | grep 8080

# Or test with curl
curl -I http://localhost:8080
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

**Port already in use?**
```bash
# Find what's using port 8080
lsof -i :8080

# Or use a different port
python3 server/serve_static.py --port 3000
```

**Server not responding?**
```bash
# Check if the process is running
ps aux | grep serve_static

# Check server logs
# The server prints output to the terminal where it was started
```

**Can't access from browser?**
- Ensure you're using `http://` not `https://`
- Try `http://127.0.0.1:8080` instead of localhost
- Check firewall settings if accessing from another machine

## 📞 Next Steps

1. Explore the application at http://localhost:8080
2. Review the architecture docs in `docs/architecture/`
3. Check the QA specifications in `docs/qa/`
4. Start creating projects and testing features!

---

**Enjoy your Project Management Platform!** 🎉
