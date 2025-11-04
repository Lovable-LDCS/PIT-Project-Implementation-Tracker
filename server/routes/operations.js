const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');

// Get all operations
router.get('/', (req, res) => {
  try {
    const { date } = req.query;
    let operations;
    
    if (date) {
      operations = dataStore.getOperationsByDate(date);
    } else {
      operations = dataStore.getOperations();
    }
    
    res.json({ success: true, data: operations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single operation
router.get('/:id', (req, res) => {
  try {
    const operation = dataStore.getOperation(req.params.id);
    if (!operation) {
      return res.status(404).json({ success: false, error: 'Operation not found' });
    }
    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new operation
router.post('/', (req, res) => {
  try {
    const { title, description, type, status, assignedTo, date } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }
    
    const operation = dataStore.createOperation({
      title,
      description,
      type,
      status,
      assignedTo,
      date
    });
    
    res.status(201).json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update operation
router.put('/:id', (req, res) => {
  try {
    const operation = dataStore.updateOperation(req.params.id, req.body);
    if (!operation) {
      return res.status(404).json({ success: false, error: 'Operation not found' });
    }
    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete operation
router.delete('/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteOperation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Operation not found' });
    }
    res.json({ success: true, message: 'Operation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
