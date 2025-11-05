# PIT - Project Implementation Tracker

A comprehensive project implementation and operations tracking system designed for large enterprises with multiple users and interfaces.

## 🚀 Quick Access Options

### Option 1: GitHub Pages (No Setup Required!)
👉 **[Open App Now](https://lovable-ldcs.github.io/PIT-Project-Implementation-Tracker/)** 👈

The Python-based application is automatically deployed to GitHub Pages. Just click the link above - no server setup needed!

### Option 2: Node.js Full-Stack Application
For enterprise environments requiring RESTful APIs and advanced backend capabilities, we provide a complete Node.js implementation.

## Overview

PIT (Project Implementation Tracker) provides two implementation options:

### 🐍 Python Implementation (Frontend-focused)
- Static HTML/CSS/JavaScript frontend
- Python SimpleHTTPServer for local development
- GitHub Pages deployment ready
- Ideal for quick deployment and access

### 🟢 Node.js Implementation (Full-Stack)
- Express.js REST API backend
- Comprehensive multi-user support with role-based access
- In-memory data store (database-ready architecture)
- Enterprise-grade features
- Ideal for large organizations requiring APIs and integrations

## Features

### Core Features (Both Implementations)
- **Dashboard**: View project KPIs, overdue items, and completion rates
- **Projects**: Manage and track multiple projects with status, priority, and progress
- **Operations/Work Items**: Track daily operations and task assignments
- **User Management**: Multi-user support with role-based access
- **Reports & Analytics**: Generate insights and track completion rates
- **Evidence & Documentation**: Store and track project documentation

### Additional Features (Node.js Implementation)
- **RESTful API**: Full API access for integrations
- **Real-time Operations**: Day-to-day operations tracking with date filtering
- **Advanced User Roles**: Admin, Manager, Lead, Developer roles
- **API Health Monitoring**: System health check endpoints
- **Input Validation**: Comprehensive server-side validation
- **Security Hardening**: ReDoS-safe validation, rate limiting guidance

## Installation & Usage

### Python Implementation (GitHub Pages)

**One-Click Launcher:**
1. Download [LAUNCH-APP.html](LAUNCH-APP.html)
2. Save to your Desktop
3. Double-click anytime to launch!

**Local Development:**

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

### Node.js Implementation

1. Clone the repository:
```bash
git clone https://github.com/Lovable-LDCS/PIT-Project-Implementation-Tracker.git
cd PIT-Project-Implementation-Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Configure the `.env` file:
```
PORT=3000
NODE_ENV=development
```

5. Start the application:
```bash
npm start        # Production mode
npm run dev      # Development mode
```

Access at: `http://localhost:3000`

## API Documentation (Node.js Implementation)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Operations
- `GET /api/operations` - Get all operations
- `GET /api/operations?date=YYYY-MM-DD` - Get operations by date
- `GET /api/operations/:id` - Get single operation
- `POST /api/operations` - Create new operation
- `PUT /api/operations/:id` - Update operation
- `DELETE /api/operations/:id` - Delete operation

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - System health check

## Technology Stack

### Python Implementation
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Server**: Python 3 (SimpleHTTPServer for development)
- **Deployment**: GitHub Pages
- **Testing**: pytest

### Node.js Implementation
- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: In-memory data store (database-ready)
- **API**: RESTful architecture
- **Validation**: Server-side input validation with security hardening

## Architecture

### Multi-Interface Support
Both implementations provide flexible architecture:
- Web browser interface (primary UI)
- RESTful API for third-party integrations (Node.js)
- Ability to add mobile interfaces
- Integration with enterprise systems

### Multi-User Support
- Concurrent user access
- Individual user accounts with roles
- Assignment tracking per user
- Role-based access control

### Enterprise Features
- Scalable architecture
- Environment-based configuration
- Comprehensive error handling
- CORS support for cross-origin requests (Node.js)

## Data Models (Node.js Implementation)

### Project
```javascript
{
  id: string,
  name: string,
  description: string,
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed',
  priority: 'low' | 'medium' | 'high' | 'critical',
  progress: number (0-100),
  startDate: string,
  endDate: string,
  createdBy: string,
  createdAt: string,
  updatedAt: string
}
```

### Operation
```javascript
{
  id: string,
  title: string,
  description: string,
  type: 'maintenance' | 'security' | 'deployment' | 'monitoring' | 'support',
  status: 'pending' | 'in-progress' | 'completed' | 'failed',
  date: string,
  assignedTo: string,
  createdAt: string,
  completedAt: string,
  updatedAt: string
}
```

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'developer' | 'lead' | 'manager' | 'admin',
  createdAt: string,
  updatedAt: string
}
```

## Deployment

### Python Implementation
Automatically deployed to GitHub Pages. Access via the link at the top of this README.

### Node.js Implementation
1. Set `NODE_ENV=production` in `.env`
2. Configure appropriate PORT
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server/index.js --name pit-tracker
```

### Database Integration (Node.js)
The current implementation uses an in-memory data store. To integrate with a database:
1. Replace the `DataStore` class in `server/models/dataStore.js`
2. Implement database-specific methods (MongoDB, PostgreSQL, etc.)
3. Add database connection configuration to `.env`

## Documentation

- [Getting Started Guide](GETTING_STARTED.md) - Comprehensive setup instructions
- [Developer Documentation](README.dev.md) - Development guidelines
- [Architecture Documentation](docs/architecture/) - System architecture
- [QA Specifications](docs/qa/) - Testing specifications

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

ISC

## Support

For enterprise support and customization, please contact the development team.
