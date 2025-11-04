// API Base URL
const API_BASE = '/api';

// Current state
let currentUsers = [];
let currentProjects = [];
let currentOperations = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    setDefaultDate();
});

// Set default date for operations filter
function setDefaultDate() {
    const dateInput = document.getElementById('operationDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Load all data
async function loadAllData() {
    await Promise.all([
        loadUsers(),
        loadProjects(),
        loadOperations()
    ]);
    updateDashboard();
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Refresh data when switching tabs
    if (tabName === 'dashboard') {
        updateDashboard();
    }
}

// Dashboard functions
function updateDashboard() {
    // Update stats
    document.getElementById('totalProjects').textContent = currentProjects.length;
    document.getElementById('activeOperations').textContent = 
        currentOperations.filter(op => op.status === 'in-progress' || op.status === 'pending').length;
    document.getElementById('totalUsers').textContent = currentUsers.length;
    
    // Calculate completion rate
    const completedProjects = currentProjects.filter(p => p.status === 'completed').length;
    const rate = currentProjects.length > 0 
        ? Math.round((completedProjects / currentProjects.length) * 100) 
        : 0;
    document.getElementById('completionRate').textContent = rate + '%';
    
    // Show recent activity
    const recentActivity = document.getElementById('recentActivity');
    const activities = [];
    
    // Add recent projects
    currentProjects.slice(0, 3).forEach(project => {
        activities.push({
            text: `Project "${project.name}" is ${project.status}`,
            time: new Date(project.createdAt).toLocaleDateString()
        });
    });
    
    // Add recent operations
    currentOperations.slice(0, 3).forEach(operation => {
        activities.push({
            text: `Operation "${operation.title}" - ${operation.status}`,
            time: new Date(operation.createdAt).toLocaleDateString()
        });
    });
    
    recentActivity.innerHTML = activities.length > 0
        ? activities.map(activity => `
            <div class="activity-item">
                <strong>${activity.text}</strong>
                <br><small>${activity.time}</small>
            </div>
        `).join('')
        : '<p>No recent activity</p>';
}

// Users API
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        if (data.success) {
            currentUsers = data.data;
            displayUsers();
            populateUserSelects();
        }
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users');
    }
}

function displayUsers() {
    const usersList = document.getElementById('usersList');
    if (currentUsers.length === 0) {
        usersList.innerHTML = '<p>No users found. Add your first user!</p>';
        return;
    }
    
    usersList.innerHTML = currentUsers.map(user => `
        <div class="user-card">
            <div class="user-info">
                <strong>${user.name}</strong>
                <div class="user-email">${user.email}</div>
                <span class="user-role">${user.role || 'developer'}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-small" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteUser('${user.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function populateUserSelects() {
    const selects = document.querySelectorAll('#operationAssignedTo');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select User</option>' +
            currentUsers.map(user => 
                `<option value="${user.id}">${user.name}</option>`
            ).join('');
    });
}

function showUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    form.reset();
    
    if (userId) {
        const user = currentUsers.find(u => u.id === userId);
        if (user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role || 'developer';
            document.getElementById('userModalTitle').textContent = 'Edit User';
        }
    } else {
        document.getElementById('userModalTitle').textContent = 'New User';
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editUser(userId) {
    showUserModal(userId);
}

async function saveUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value
    };
    
    try {
        const url = userId ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`;
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        if (data.success) {
            closeModal('userModal');
            await loadUsers();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            await loadUsers();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Projects API
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        if (data.success) {
            currentProjects = data.data;
            displayProjects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Failed to load projects');
    }
}

function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    if (currentProjects.length === 0) {
        projectsList.innerHTML = '<p>No projects found. Create your first project!</p>';
        return;
    }
    
    projectsList.innerHTML = currentProjects.map(project => `
        <div class="item-card">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div>
                <span class="badge badge-${project.status}">${project.status}</span>
                <span class="badge badge-${project.priority}">${project.priority}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
            </div>
            <small>${project.progress || 0}% Complete</small>
            ${project.startDate ? `<p><small>Start: ${project.startDate} | End: ${project.endDate || 'TBD'}</small></p>` : ''}
            <div class="item-actions">
                <button class="btn btn-secondary btn-small" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    form.reset();
    
    if (projectId) {
        const project = currentProjects.find(p => p.id === projectId);
        if (project) {
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectStatus').value = project.status;
            document.getElementById('projectPriority').value = project.priority;
            document.getElementById('projectStartDate').value = project.startDate || '';
            document.getElementById('projectEndDate').value = project.endDate || '';
            document.getElementById('projectProgress').value = project.progress || 0;
            document.getElementById('projectModalTitle').textContent = 'Edit Project';
        }
    } else {
        document.getElementById('projectModalTitle').textContent = 'New Project';
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editProject(projectId) {
    showProjectModal(projectId);
}

async function saveProject(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const projectData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        status: document.getElementById('projectStatus').value,
        priority: document.getElementById('projectPriority').value,
        startDate: document.getElementById('projectStartDate').value,
        endDate: document.getElementById('projectEndDate').value,
        progress: parseInt(document.getElementById('projectProgress').value) || 0
    };
    
    if (!projectData.name || !projectData.description) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const url = projectId ? `${API_BASE}/projects/${projectId}` : `${API_BASE}/projects`;
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        if (data.success) {
            closeModal('projectModal');
            await loadProjects();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project');
    }
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            await loadProjects();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
    }
}

// Operations API
async function loadOperations() {
    try {
        const dateFilter = document.getElementById('operationDate')?.value;
        const url = dateFilter 
            ? `${API_BASE}/operations?date=${dateFilter}`
            : `${API_BASE}/operations`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
            currentOperations = data.data;
            displayOperations();
        }
    } catch (error) {
        console.error('Error loading operations:', error);
        alert('Failed to load operations');
    }
}

function displayOperations() {
    const operationsList = document.getElementById('operationsList');
    if (currentOperations.length === 0) {
        operationsList.innerHTML = '<p>No operations found for this date.</p>';
        return;
    }
    
    operationsList.innerHTML = currentOperations.map(operation => {
        const assignedUser = currentUsers.find(u => u.id === operation.assignedTo);
        const userName = assignedUser ? assignedUser.name : 'Unassigned';
        
        return `
            <div class="item-card">
                <h3>${operation.title}</h3>
                <p>${operation.description}</p>
                <div>
                    <span class="badge badge-${operation.type}">${operation.type}</span>
                    <span class="badge badge-${operation.status}">${operation.status}</span>
                </div>
                <p><small>Assigned to: ${userName}</small></p>
                <p><small>Date: ${operation.date}</small></p>
                ${operation.completedAt ? `<p><small>Completed: ${new Date(operation.completedAt).toLocaleString()}</small></p>` : ''}
                <div class="item-actions">
                    <button class="btn btn-secondary btn-small" onclick="editOperation('${operation.id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteOperation('${operation.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showOperationModal(operationId = null) {
    const modal = document.getElementById('operationModal');
    const form = document.getElementById('operationForm');
    form.reset();
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('operationFormDate').value = today;
    
    if (operationId) {
        const operation = currentOperations.find(o => o.id === operationId);
        if (operation) {
            document.getElementById('operationId').value = operation.id;
            document.getElementById('operationTitle').value = operation.title;
            document.getElementById('operationDescription').value = operation.description;
            document.getElementById('operationType').value = operation.type;
            document.getElementById('operationStatus').value = operation.status;
            document.getElementById('operationFormDate').value = operation.date;
            document.getElementById('operationAssignedTo').value = operation.assignedTo || '';
            document.getElementById('operationModalTitle').textContent = 'Edit Operation';
        }
    } else {
        document.getElementById('operationModalTitle').textContent = 'New Operation';
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function editOperation(operationId) {
    showOperationModal(operationId);
}

async function saveOperation(event) {
    event.preventDefault();
    
    const operationId = document.getElementById('operationId').value;
    const operationData = {
        title: document.getElementById('operationTitle').value,
        description: document.getElementById('operationDescription').value,
        type: document.getElementById('operationType').value,
        status: document.getElementById('operationStatus').value,
        date: document.getElementById('operationFormDate').value,
        assignedTo: document.getElementById('operationAssignedTo').value
    };
    
    if (!operationData.title || !operationData.description) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const url = operationId ? `${API_BASE}/operations/${operationId}` : `${API_BASE}/operations`;
        const method = operationId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operationData)
        });
        
        const data = await response.json();
        if (data.success) {
            closeModal('operationModal');
            await loadOperations();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving operation:', error);
        alert('Failed to save operation');
    }
}

async function deleteOperation(operationId) {
    if (!confirm('Are you sure you want to delete this operation?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/operations/${operationId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            await loadOperations();
            updateDashboard();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting operation:', error);
        alert('Failed to delete operation');
    }
}

// Modal functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        event.target.style.display = 'none';
    }
}
