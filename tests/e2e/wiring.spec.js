// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Wiring Tests', () => {
  test('Preview toggle (Desktop/Mobile) works correctly', async ({ page }) => {
    await page.goto('/');
    
    const shellRoot = page.locator('[data-testid="TID-SHELL-ROOT"]');
    const mobileBtn = page.locator('[data-testid="TID-PREVIEW-MOBILE"]');
    const desktopBtn = page.locator('[data-testid="TID-PREVIEW-DESKTOP"]');
    
    // Verify buttons exist
    await expect(mobileBtn).toBeVisible();
    await expect(desktopBtn).toBeVisible();
    
    // Initial state (should be desktop)
    await expect(shellRoot).not.toHaveClass(/mobile-preview/);
    
    // Click mobile preview
    await mobileBtn.click();
    await page.waitForTimeout(100);
    
    // Verify mobile class applied
    await expect(shellRoot).toHaveClass(/mobile-preview/);
    
    // Click desktop preview
    await desktopBtn.click();
    await page.waitForTimeout(100);
    
    // Verify mobile class removed
    await expect(shellRoot).not.toHaveClass(/mobile-preview/);
  });

  test('Admin tabs visible when role is Admin', async ({ page }) => {
    await page.goto('/');
    
    // Set role to Admin
    const roleSelector = page.locator('[data-testid="TID-ROLE-SELECTOR"]');
    await roleSelector.selectOption('Admin');
    await page.waitForTimeout(200);
    
    // Check admin tabs are visible
    const adminTabs = [
      'TID-NAV-INVITE-MEMBERS',
      'TID-NAV-SETTINGS',
      'TID-NAV-SECURITY-DASHBOARD',
      'TID-NAV-HEALTH-CHECKER',
    ];
    
    for (const testId of adminTabs) {
      const tab = page.locator(`[data-testid="${testId}"]`);
      await expect(tab).toBeVisible();
    }
  });

  test('Admin tabs hidden when role is not Admin', async ({ page }) => {
    await page.goto('/');
    
    // Set role to User
    const roleSelector = page.locator('[data-testid="TID-ROLE-SELECTOR"]');
    await roleSelector.selectOption('User');
    await page.waitForTimeout(200);
    
    // Check admin section is hidden
    const adminSection = page.locator('[data-admin-only]');
    await expect(adminSection).toBeHidden();
  });

  test('Admin functionality pages respond correctly', async ({ page }) => {
    await page.goto('/');
    
    // Set role to Admin first
    const roleSelector = page.locator('[data-testid="TID-ROLE-SELECTOR"]');
    await roleSelector.selectOption('Admin');
    await page.waitForTimeout(200);
    
    const adminRoutes = [
      { hash: '#/invite-members', testId: 'TID-INVITE-MEMBERS-PAGE' },
      { hash: '#/security-dashboard', testId: 'TID-SECURITY-DASHBOARD-PAGE' },
      { hash: '#/health-checker', testId: 'TID-HEALTH-CHECKER-ROOT' },
    ];
    
    for (const route of adminRoutes) {
      await page.goto(`/${route.hash}`);
      await page.waitForTimeout(200);
      
      const element = page.locator(`[data-testid="${route.testId}"]`);
      await expect(element).toBeVisible({ timeout: 5000 });
      
      console.log(`✓ Admin route ${route.hash} accessible and responds`);
    }
  });

  test('Reset session button works', async ({ page }) => {
    await page.goto('/');
    
    // Set a role
    const roleSelector = page.locator('[data-testid="TID-ROLE-SELECTOR"]');
    await roleSelector.selectOption('Admin');
    await page.waitForTimeout(200);
    
    // Verify admin tabs are visible
    const adminSection = page.locator('[data-admin-only]');
    await expect(adminSection).toBeVisible();
    
    // Click reset session
    page.on('dialog', dialog => dialog.accept()); // Auto-accept any confirm dialogs
    const resetBtn = page.locator('[data-testid="TID-RESET-SESSION-BTN"]');
    await resetBtn.click();
    
    // Wait for reload
    await page.waitForLoadState('networkidle');
    
    // Verify session was reset (role should be back to default)
    const selectedValue = await roleSelector.inputValue();
    expect(['', 'User', 'None'].includes(selectedValue)).toBeTruthy();
  });
});
