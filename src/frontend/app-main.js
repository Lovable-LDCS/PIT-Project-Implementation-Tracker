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

  // Preview mode (Desktop/Mobile toggle)
  window.setPreviewMode = function(mode) {
    const root = document.querySelector('[data-testid="TID-SHELL-ROOT"]');
    if (!root) return;
    
    if (mode === 'mobile') {
      root.classList.add('mobile-preview');
      root.setAttribute('data-preview-mode', 'mobile');
      // Update button states
      document.querySelector('[data-testid="TID-PREVIEW-MOBILE"]')?.classList.add('active');
      document.querySelector('[data-testid="TID-PREVIEW-DESKTOP"]')?.classList.remove('active');
    } else {
      root.classList.remove('mobile-preview');
      root.setAttribute('data-preview-mode', 'desktop');
      // Update button states
      document.querySelector('[data-testid="TID-PREVIEW-DESKTOP"]')?.classList.add('active');
      document.querySelector('[data-testid="TID-PREVIEW-MOBILE"]')?.classList.remove('active');
    }
    
    console.log('Preview mode set to:', mode);
  };

  // Health Check Runner (calls backend QA system)
  window.runHealthCheck = async function() {
    const reportDisplay = document.getElementById('health-report-display');
    const strictMode = document.getElementById('strict-mode-toggle')?.checked || false;
    
    if (!reportDisplay) return;
    
    // Show loading state
    reportDisplay.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 2rem; margin-bottom: 16px;">⏳</div>
        <p style="font-size: 1.25rem; color: #64748b;">Running health checks...</p>
        <p style="font-size: 0.875rem; color: #94a3b8;">This may take a moment</p>
      </div>
    `;
    
    try {
      // In a real implementation, this would call a backend API
      // For now, we'll load the last QA report if available
      const response = await fetch('/qa/last-run-report.json');
      
      if (response.ok) {
        const report = await response.json();
        displayHealthReport(report);
      } else {
        // Fallback: show instructions to run QA
        reportDisplay.innerHTML = `
          <div class="filter-card" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">QA Report Not Available</h3>
            <p style="color: #78350f;">To run the full QA check suite, execute this command:</p>
            <pre style="background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 4px; overflow-x: auto;">python3 qa/run_qa.py</pre>
            <p style="color: #78350f; margin-bottom: 0;">The report will appear here once generated.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Health check error:', error);
      reportDisplay.innerHTML = `
        <div class="filter-card" style="background: #fee; border-left: 4px solid #ef4444;">
          <h3 style="color: #991b1b; margin-top: 0;">Error Running Health Check</h3>
          <p style="color: #7f1d1d;">${error.message}</p>
          <p style="color: #7f1d1d; margin-bottom: 0;">Please ensure the QA system is properly configured and accessible.</p>
        </div>
      `;
    }
  };

  // Display health report in UI
  function displayHealthReport(report) {
    const reportDisplay = document.getElementById('health-report-display');
    if (!reportDisplay) return;
    
    const summary = report.summary || { total: 0, passed: 0, failed: 0 };
    const status = summary.failed === 0 ? 'GREEN' : 'RED';
    const statusColor = status === 'GREEN' ? '#10b981' : '#ef4444';
    const statusIcon = status === 'GREEN' ? '✓' : '✗';
    
    let html = `
      <div class="filter-card" style="background: ${status === 'GREEN' ? '#d1fae5' : '#fee'}; border-left: 4px solid ${statusColor};">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="color: ${status === 'GREEN' ? '#065f46' : '#991b1b'}; margin: 0;">
            ${statusIcon} QA Status: ${status}
          </h3>
          <span style="color: #64748b; font-size: 0.875rem;">${report.timestamp || 'Unknown'}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Total Checks</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #1e293b;">${summary.total}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Passed</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">${summary.passed}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Failed</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">${summary.failed}</div>
          </div>
        </div>
        <p style="margin: 0; color: ${status === 'GREEN' ? '#065f46' : '#991b1b'};">
          ${status === 'GREEN' ? 'All systems operational. Architecture compliance verified.' : 'Some checks failed. Review details below.'}
        </p>
      </div>
    `;
    
    // Display category results
    if (report.checks) {
      html += '<div style="margin-top: 16px;">';
      
      for (const [category, results] of Object.entries(report.checks)) {
        const categoryFailed = results.filter(r => !r.passed).length;
        const categoryPassed = results.filter(r => r.passed).length;
        
        html += `
          <details class="filter-card" style="margin-bottom: 12px;" ${categoryFailed > 0 ? 'open' : ''}>
            <summary style="cursor: pointer; font-weight: bold; padding: 8px; background: #f1f5f9; border-radius: 4px;">
              ${category} (${categoryPassed}/${results.length} passed)
            </summary>
            <div style="padding: 12px 8px;">
        `;
        
        results.forEach(check => {
          const checkIcon = check.passed ? '✓' : '✗';
          const checkColor = check.passed ? '#10b981' : '#ef4444';
          
          html += `
            <div style="margin-bottom: 8px; padding: 8px; background: ${check.passed ? '#f0fdf4' : '#fef2f2'}; border-radius: 4px;">
              <div style="display: flex; align-items: start; gap: 8px;">
                <span style="color: ${checkColor}; font-weight: bold;">${checkIcon}</span>
                <div style="flex: 1;">
                  <div style="font-weight: 500; color: #1e293b;">${check.id}: ${check.name}</div>
                  <div style="font-size: 0.875rem; color: #64748b; margin-top: 4px;">${check.message}</div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">Severity: ${check.severity.toUpperCase()}</div>
                </div>
              </div>
            </div>
          `;
        });
        
        html += `
            </div>
          </details>
        `;
      }
      
      html += '</div>';
    }
    
    reportDisplay.innerHTML = html;
  }

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
