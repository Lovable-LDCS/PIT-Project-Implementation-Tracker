// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    
    // Check for shell root
    const shellRoot = page.locator('[data-testid="TID-SHELL-ROOT"]');
    await expect(shellRoot).toBeVisible();
    
    // Check for topbar
    const topbar = page.locator('[data-testid="TID-TOPBAR"]');
    await expect(topbar).toBeVisible();
    
    // Check for sidebar
    const sidebar = page.locator('[data-testid="TID-SIDEBAR"]');
    await expect(sidebar).toBeVisible();
    
    // Check for content area
    const contentArea = page.locator('[data-testid="TID-CONTENT-AREA"]');
    await expect(contentArea).toBeVisible();
    
    // Check for breadcrumbs
    const breadcrumbs = page.locator('[data-testid="TID-BREADCRUMBS"]');
    await expect(breadcrumbs).toBeVisible();
  });

  test('should navigate to all primary routes', async ({ page }) => {
    await page.goto('/');
    
    const routes = [
      { hash: '#/', testId: 'TID-DASHBOARD', name: 'Dashboard' },
      { hash: '#/projects', testId: 'TID-PAGE-PROJECTS', name: 'Projects' },
      { hash: '#/reports', testId: 'TID-PAGE-REPORTS', name: 'Reports' },
      { hash: '#/permissions', testId: 'TID-ROLE-MATRIX', name: 'Permissions' },
      { hash: '#/workitem', testId: 'TID-WORKITEM-DETAIL', name: 'Work Item' },
      { hash: '#/evidence', testId: 'TID-EVIDENCE-UPLOAD', name: 'Evidence' },
      { hash: '#/gantt', testId: 'TID-GANTT-VIEW', name: 'Gantt' },
      { hash: '#/audit', testId: 'TID-AUDIT-LOG', name: 'Audit' },
      { hash: '#/notify', testId: 'TID-NOTIFY-PREFERENCES', name: 'Notify' },
      { hash: '#/import', testId: 'TID-IMPORT-WIZARD', name: 'Import' },
      { hash: '#/exports', testId: 'TID-EXPORT-REPORTS', name: 'Exports' },
      { hash: '#/templates', testId: 'TID-TEMPLATES-LIBRARY', name: 'Templates' },
      { hash: '#/search', testId: 'TID-SEARCH-RESULTS', name: 'Search' },
    ];
    
    for (const route of routes) {
      await page.goto(`/${route.hash}`);
      await page.waitForTimeout(200); // Allow navigation to settle
      
      const element = page.locator(`[data-testid="${route.testId}"]`);
      await expect(element).toBeVisible({ timeout: 5000 });
      
      console.log(`✓ Route ${route.hash} -> ${route.name} accessible`);
    }
  });

  test('should update aria-current on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to projects
    await page.click('[data-testid="TID-NAV-PROJECTS"]');
    await page.waitForTimeout(200);
    
    const projectsLink = page.locator('[data-testid="TID-NAV-PROJECTS"]');
    await expect(projectsLink).toHaveAttribute('aria-current', 'page');
  });
});
