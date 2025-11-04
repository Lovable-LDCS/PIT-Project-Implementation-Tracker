# PIT - Project Implementation Tracker

A comprehensive project implementation and operations tracking system designed for large enterprises with multiple users and interfaces.

## Overview

PIT (Project Implementation Tracker) is a full-stack web application that enables organizations to:
- Track multiple project implementations
- Monitor day-to-day operations
- Manage team members and assignments
- View real-time dashboards and analytics
- Support multiple concurrent users

## Features

### 🎯 Project Management
- Create and manage project implementations
- Track project status (Planning, In Progress, On Hold, Completed)
- Set priority levels (Low, Medium, High, Critical)
- Monitor project progress with visual indicators
- Define start and end dates for projects

### 📋 Daily Operations Tracking
- Record and track daily operations
- Categorize operations by type (Maintenance, Security, Deployment, Monitoring, Support)
- Assign operations to team members
- Filter operations by date
- Track operation status and completion

### 👥 User Management
- Multi-user support with role-based access
- User roles: Developer, Team Lead, Manager, Admin
- Track user assignments and responsibilities

### 📊 Dashboard & Analytics
- Real-time statistics overview
- Project completion rates
- Active operations monitoring
- Recent activity feed
- Visual data representation

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: In-memory data store (easily replaceable with database)
- **API**: RESTful API architecture

## Installation

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

4. Configure the `.env` file with your settings:
```
PORT=3000
NODE_ENV=development
```

## Usage

### Starting the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### API Endpoints

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Operations
- `GET /api/operations` - Get all operations
- `GET /api/operations?date=YYYY-MM-DD` - Get operations by date
- `GET /api/operations/:id` - Get single operation
- `POST /api/operations` - Create new operation
- `PUT /api/operations/:id` - Update operation
- `DELETE /api/operations/:id` - Delete operation

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Health Check
- `GET /api/health` - System health check

## Architecture

### Multi-Interface Support
The application provides a flexible architecture that supports:
- Web browser interface (primary UI)
- RESTful API for third-party integrations
- Ability to add mobile interfaces
- Integration with enterprise systems via API

### Multi-User Support
- Concurrent user access
- Individual user accounts with roles
- Assignment tracking per user
- User-specific actions and history

### Enterprise Features
- Scalable architecture
- RESTful API design
- Easy database integration
- Environment-based configuration
- Comprehensive error handling
- CORS support for cross-origin requests

## Data Models

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

### Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Configure appropriate PORT
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server/index.js --name pit-tracker
```

### Database Integration
The current implementation uses an in-memory data store. To integrate with a database:
1. Replace the `DataStore` class in `server/models/dataStore.js`
2. Implement database-specific methods (MongoDB, PostgreSQL, etc.)
3. Add database connection configuration to `.env`

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

ISC

## Support

For enterprise support and customization, please contact the development team.

