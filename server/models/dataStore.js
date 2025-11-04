// In-memory data store for the application
// In a production environment, this would be replaced with a proper database

const { v4: uuidv4 } = require('uuid');

class DataStore {
  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.operations = new Map();
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  initializeDemoData() {
    // Create demo users
    const demoUsers = [
      { id: uuidv4(), name: 'Admin User', email: 'admin@company.com', role: 'admin' },
      { id: uuidv4(), name: 'Project Manager', email: 'pm@company.com', role: 'manager' },
      { id: uuidv4(), name: 'Team Lead', email: 'lead@company.com', role: 'lead' },
      { id: uuidv4(), name: 'Developer', email: 'dev@company.com', role: 'developer' }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Create demo projects
    const adminId = Array.from(this.users.values())[0].id;
    const demoProjects = [
      {
        id: uuidv4(),
        name: 'Infrastructure Upgrade',
        description: 'Upgrade company infrastructure to support increased load',
        status: 'in-progress',
        priority: 'high',
        createdBy: adminId,
        createdAt: new Date().toISOString(),
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        progress: 45
      },
      {
        id: uuidv4(),
        name: 'Customer Portal Development',
        description: 'Build new customer-facing portal with advanced features',
        status: 'planning',
        priority: 'medium',
        createdBy: adminId,
        createdAt: new Date().toISOString(),
        startDate: '2025-02-15',
        endDate: '2025-08-15',
        progress: 15
      }
    ];

    demoProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Create demo operations
    const demoOperations = [
      {
        id: uuidv4(),
        title: 'System Backup',
        description: 'Daily system backup completed successfully',
        type: 'maintenance',
        status: 'completed',
        assignedTo: adminId,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: uuidv4(),
        title: 'Security Audit',
        description: 'Quarterly security audit and vulnerability assessment',
        type: 'security',
        status: 'in-progress',
        assignedTo: adminId,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      }
    ];

    demoOperations.forEach(operation => {
      this.operations.set(operation.id, operation);
    });
  }

  // User methods
  getUsers() {
    return Array.from(this.users.values());
  }

  getUser(id) {
    return this.users.get(id);
  }

  createUser(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...userData,
      id: user.id,
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  // Project methods
  getProjects() {
    return Array.from(this.projects.values());
  }

  getProject(id) {
    return this.projects.get(id);
  }

  createProject(projectData) {
    const project = {
      id: uuidv4(),
      ...projectData,
      createdAt: new Date().toISOString(),
      status: projectData.status || 'planning',
      progress: projectData.progress || 0
    };
    this.projects.set(project.id, project);
    return project;
  }

  updateProject(id, projectData) {
    const project = this.projects.get(id);
    if (!project) return null;
    
    const updatedProject = {
      ...project,
      ...projectData,
      id: project.id,
      updatedAt: new Date().toISOString()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  deleteProject(id) {
    return this.projects.delete(id);
  }

  // Operation methods
  getOperations() {
    return Array.from(this.operations.values());
  }

  getOperation(id) {
    return this.operations.get(id);
  }

  getOperationsByDate(date) {
    return Array.from(this.operations.values()).filter(op => op.date === date);
  }

  createOperation(operationData) {
    const operation = {
      id: uuidv4(),
      ...operationData,
      createdAt: new Date().toISOString(),
      status: operationData.status || 'pending',
      date: operationData.date || new Date().toISOString().split('T')[0]
    };
    this.operations.set(operation.id, operation);
    return operation;
  }

  updateOperation(id, operationData) {
    const operation = this.operations.get(id);
    if (!operation) return null;
    
    const updatedOperation = {
      ...operation,
      ...operationData,
      id: operation.id,
      updatedAt: new Date().toISOString()
    };
    
    // Set completedAt if status changed to completed
    if (operationData.status === 'completed' && operation.status !== 'completed') {
      updatedOperation.completedAt = new Date().toISOString();
    }
    
    this.operations.set(id, updatedOperation);
    return updatedOperation;
  }

  deleteOperation(id) {
    return this.operations.delete(id);
  }
}

// Export singleton instance
module.exports = new DataStore();
