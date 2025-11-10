// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Admin Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Set admin role
    const roleSelector = page.locator('[data-testid="TID-ROLE-SELECTOR"]');
    await roleSelector.selectOption('Admin');
    await page.waitForTimeout(200);
  });

  test('Health Checker page renders correctly', async ({ page }) => {
    await page.goto('/#/health-checker');
    await page.waitForTimeout(200);
    
    // Check Health Checker root element
    const healthRoot = page.locator('[data-testid="TID-HEALTH-CHECKER-ROOT"]');
    await expect(healthRoot).toBeVisible();
    
    // Check Run QA button
    const runBtn = page.locator('[data-testid="TID-HEALTH-RUN-QA-BTN"]');
    await expect(runBtn).toBeVisible();
    
    // Check report display area
    const reportDisplay = page.locator('[data-testid="TID-HEALTH-REPORT-DISPLAY"]');
    await expect(reportDisplay).toBeVisible();
    
    // Check strict mode toggle
    const strictToggle = page.locator('[data-testid="TID-HEALTH-STRICT-MODE-TOGGLE"]');
    await expect(strictToggle).toBeVisible();
  });

  test('Health Checker strict mode toggle works', async ({ page }) => {
    await page.goto('/#/health-checker');
    
    const strictToggle = page.locator('[data-testid="TID-HEALTH-STRICT-MODE-TOGGLE"]');
    
    // Initial state (unchecked)
    await expect(strictToggle).not.toBeChecked();
    
    // Toggle on
    await strictToggle.click();
    await expect(strictToggle).toBeChecked();
    
    // Toggle off
    await strictToggle.click();
    await expect(strictToggle).not.toBeChecked();
  });

  test('Invite Members page renders', async ({ page }) => {
    await page.goto('/#/invite-members');
    
    const invitePage = page.locator('[data-testid="TID-INVITE-MEMBERS-PAGE"]');
    await expect(invitePage).toBeVisible();
    
    const emailsTextarea = page.locator('[data-testid="TID-INVITE-EMAILS"]');
    await expect(emailsTextarea).toBeVisible();
    
    const roleSelect = page.locator('[data-testid="TID-INVITE-ROLE"]');
    await expect(roleSelect).toBeVisible();
    
    const sendBtn = page.locator('[data-testid="TID-INVITE-SEND-BTN"]');
    await expect(sendBtn).toBeVisible();
  });

  test('Security Dashboard page renders', async ({ page }) => {
    await page.goto('/#/security-dashboard');
    
    const securityPage = page.locator('[data-testid="TID-SECURITY-DASHBOARD-PAGE"]');
    await expect(securityPage).toBeVisible();
    
    const securityStatus = page.locator('[data-testid="TID-SECURITY-STATUS"]');
    await expect(securityStatus).toBeVisible();
    
    const securityAccess = page.locator('[data-testid="TID-SECURITY-ACCESS"]');
    await expect(securityAccess).toBeVisible();
  });

  test('Settings page renders', async ({ page }) => {
    await page.goto('/#/settings');
    
    const settingsPage = page.locator('[data-testid="TID-SETTINGS-PAGE"]');
    await expect(settingsPage).toBeVisible();
    
    // Check for display settings inputs
    const yearsInput = page.locator('[data-testid="TID-SET-YEARS"]');
    await expect(yearsInput).toBeVisible();
    
    const saveBtn = page.locator('[data-testid="TID-SET-SAVE"]');
    await expect(saveBtn).toBeVisible();
  });
});
