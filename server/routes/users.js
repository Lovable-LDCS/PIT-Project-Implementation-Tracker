const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const { validateEmail, validateUserRole } = require('../middleware/validators');

// Get all users
router.get('/', (req, res) => {
  try {
    const users = dataStore.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single user
router.get('/:id', (req, res) => {
  try {
    const user = dataStore.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    if (!validateUserRole(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be one of: admin, manager, lead, developer' });
    }
    
    const user = dataStore.createUser({ name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user
router.put('/:id', (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (email && !validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    if (role && !validateUserRole(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be one of: admin, manager, lead, developer' });
    }
    
    const user = dataStore.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
