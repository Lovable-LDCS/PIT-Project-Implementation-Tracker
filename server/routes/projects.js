const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');

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
    const { name, description, status, priority, createdBy, startDate, endDate } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Name and description are required' });
    }
    
    const project = dataStore.createProject({
      name,
      description,
      status,
      priority,
      createdBy,
      startDate,
      endDate
    });
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
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
