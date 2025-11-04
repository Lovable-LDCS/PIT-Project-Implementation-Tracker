const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const { 
  validateProjectStatus, 
  validateProjectPriority, 
  validateDate, 
  validateDateOrder,
  validateProgress 
} = require('../middleware/validators');

// Get all projects
router.get('/', (req, res) => {
  try {
    const projects = dataStore.getProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single project
router.get('/:id', (req, res) => {
  try {
    const project = dataStore.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const { name, description, status, priority, createdBy, startDate, endDate, progress } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Name and description are required' });
    }
    
    if (!validateProjectStatus(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be one of: planning, in-progress, on-hold, completed' });
    }
    
    if (!validateProjectPriority(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority. Must be one of: low, medium, high, critical' });
    }
    
    if (!validateDate(startDate) || !validateDate(endDate)) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }
    
    if (!validateDateOrder(startDate, endDate)) {
      return res.status(400).json({ success: false, error: 'End date must be after start date' });
    }
    
    if (!validateProgress(progress)) {
      return res.status(400).json({ success: false, error: 'Progress must be between 0 and 100' });
    }
    
    const project = dataStore.createProject({
      name,
      description,
      status,
      priority,
      createdBy,
      startDate,
      endDate,
      progress
    });
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const { status, priority, startDate, endDate, progress } = req.body;
    
    if (status && !validateProjectStatus(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be one of: planning, in-progress, on-hold, completed' });
    }
    
    if (priority && !validateProjectPriority(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority. Must be one of: low, medium, high, critical' });
    }
    
    if (!validateDate(startDate) || !validateDate(endDate)) {
      return res.status(400).json({ success: false, error: 'Invalid date format' });
    }
    
    if (!validateDateOrder(startDate, endDate)) {
      return res.status(400).json({ success: false, error: 'End date must be after start date' });
    }
    
    if (!validateProgress(progress)) {
      return res.status(400).json({ success: false, error: 'Progress must be between 0 and 100' });
    }
    
    const project = dataStore.updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
