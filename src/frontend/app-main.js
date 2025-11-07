/* Main application logic */

// Application initialization
(function() {
  'use strict';

  // State and persistence management
  window.appState = {
    user: null,
    role: null,
    isAdmin: false
  };

  // Load state from localStorage
  function loadState() {
    try {
      const roleContext = localStorage.getItem('roleContext');
      const authContext = localStorage.getItem('authContext');
      
      if (roleContext) {
        const role = JSON.parse(roleContext);
        window.appState.role = role;
      }
      
      if (authContext) {
        const auth = JSON.parse(authContext);
        window.appState.user = auth;
      }
      
      updateAdminStatus();
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  // Save state to localStorage
  function saveState() {
    try {
      if (window.appState.role) {
        localStorage.setItem('roleContext', JSON.stringify(window.appState.role));
      }
      if (window.appState.user) {
        localStorage.setItem('authContext', JSON.stringify(window.appState.user));
      }
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  // Admin gating logic
  function updateAdminStatus() {
    const isAdmin = 
      window.appState.role === 'Admin' ||
      (window.appState.user && window.appState.user.role === 'Admin') ||
      (window.appState.user && isEmailInAdminList(window.appState.user.email));
    
    window.appState.isAdmin = isAdmin;
    updateAdminVisibility();
  }

  function isEmailInAdminList(email) {
    // TODO: Load admin list from settings/configuration
    const adminList = ['admin@example.com'];
    return email && adminList.includes(email.toLowerCase());
  }

  function updateAdminVisibility() {
    const adminElements = document.querySelectorAll('[data-admin-only]');
    adminElements.forEach(el => {
      if (window.appState.isAdmin) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });
  }

  // Reset session
  window.resetSession = function() {
    localStorage.removeItem('roleContext');
    localStorage.removeItem('authContext');
    window.appState = { user: null, role: null, isAdmin: false };
    updateAdminVisibility();
    location.reload();
  };

  // Set role (for testing/role selector)
  window.setRole = function(role) {
    window.appState.role = role;
    saveState();
    updateAdminStatus();
  };

  // Placeholder functions referenced in HTML
  window.saveProject = function() {
    console.log('saveProject called');
    if (typeof window.closeProjectSetup === 'function') {
      window.closeProjectSetup();
    }
  };

  window.runWiringChecks = function() {
    console.log('Running wiring checks...');
    // Placeholder for wiring checks
    return true;
  };

  window.computeStatusDescriptor = function(startDate, endDate, today = new Date()) {
    // Placeholder status computation
    if (!startDate || !endDate) return 'unknown';
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (today < start) return 'not-started';
    if (today > end) return 'overdue';
    return 'in-progress';
  };

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    loadState();
    
    // Set up hashchange listener for navigation
    window.addEventListener('hashchange', function() {
      const route = location.hash || '#/';
      if (typeof window.navigateTo === 'function') {
        window.navigateTo(route);
      }
    });
    
    // Trigger initial navigation
    const initialRoute = location.hash || '#/';
    if (typeof window.navigateTo === 'function') {
      window.navigateTo(initialRoute);
    }
  });

  console.log('app-main.js loaded');
})();
