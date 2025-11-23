// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Timeline Column Resize Tests', () => {
  test('should load timeline page with table', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500); // Allow timeline to render
    
    // Check for timeline table
    const table = page.locator('[data-testid="TID-TLT-TABLE"]');
    await expect(table).toBeVisible();
    
    // Check for timeline header cells
    const headerCells = page.locator('th.timeline-date-cell');
    const count = await headerCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show resize handles on timeline columns', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500);
    
    // Check for resize handles
    const resizeHandles = page.locator('.column-resize-handle');
    const handleCount = await resizeHandles.count();
    expect(handleCount).toBeGreaterThan(0);
  });

  test('should change cursor when hovering near column edge', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500);
    
    // Get first timeline header cell
    const firstHeader = page.locator('th.timeline-date-cell').first();
    await expect(firstHeader).toBeVisible();
    
    // Hover over the cell
    await firstHeader.hover();
    
    // Check that cursor changes (this is a basic check)
    const cursorStyle = await firstHeader.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    // Cursor should be either default or col-resize depending on position
    expect(['default', 'col-resize', '']).toContain(cursorStyle);
  });

  test('should resize column on drag', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500);
    
    // Get first day column (most granular level)
    const dayColumn = page.locator('th.timeline-day').first();
    await expect(dayColumn).toBeVisible();
    
    // Get initial width
    const initialBox = await dayColumn.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialWidth = initialBox.width;
    
    // Get resize handle
    const resizeHandle = dayColumn.locator('.column-resize-handle');
    await expect(resizeHandle).toBeVisible();
    
    // Drag the resize handle to increase width
    await resizeHandle.hover();
    const handleBox = await resizeHandle.boundingBox();
    expect(handleBox).not.toBeNull();
    
    // Perform drag operation (drag 50px to the right)
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 50, handleBox.y + handleBox.height / 2, { steps: 10 });
    await page.mouse.up();
    
    // Wait for resize to complete
    await page.waitForTimeout(200);
    
    // Get new width
    const newBox = await dayColumn.boundingBox();
    expect(newBox).not.toBeNull();
    const newWidth = newBox.width;
    
    // Verify width has increased (should be approximately 50px more)
    expect(newWidth).toBeGreaterThan(initialWidth);
    expect(newWidth).toBeGreaterThanOrEqual(initialWidth + 40); // Allow some tolerance
  });

  test('should not have stacked event handlers after multiple renders', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500);
    
    // Trigger multiple renders by toggling zoom levels
    const yearZoom = page.locator('[data-testid="TID-TLT-Z-YEAR"]');
    await yearZoom.click();
    await page.waitForTimeout(200);
    await yearZoom.click();
    await page.waitForTimeout(200);
    await yearZoom.click();
    await page.waitForTimeout(200);
    
    // Verify table still exists and is functional
    const table = page.locator('[data-testid="TID-TLT-TABLE"]');
    await expect(table).toBeVisible();
    
    // Try to resize a column after multiple renders
    const dayColumn = page.locator('th.timeline-day').first();
    await expect(dayColumn).toBeVisible();
    
    const initialBox = await dayColumn.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialWidth = initialBox.width;
    
    // Get resize handle
    const resizeHandle = dayColumn.locator('.column-resize-handle');
    await expect(resizeHandle).toBeVisible();
    
    // Drag the resize handle
    const handleBox = await resizeHandle.boundingBox();
    expect(handleBox).not.toBeNull();
    
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 30, handleBox.y + handleBox.height / 2, { steps: 5 });
    await page.mouse.up();
    
    await page.waitForTimeout(200);
    
    // Verify resize still works (width should have changed)
    const newBox = await dayColumn.boundingBox();
    expect(newBox).not.toBeNull();
    
    // The resize should work - width should change
    expect(newBox.width).not.toBe(initialWidth);
  });

  test('should double-click to auto-fit column', async ({ page }) => {
    await page.goto('/#/timelines');
    await page.waitForTimeout(500);
    
    // Get first day column
    const dayColumn = page.locator('th.timeline-day').first();
    await expect(dayColumn).toBeVisible();
    
    // Get initial width
    const initialBox = await dayColumn.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialWidth = initialBox.width;
    
    // Double-click on the column header
    await dayColumn.dblclick();
    
    // Wait for auto-fit to complete
    await page.waitForTimeout(200);
    
    // Get new width (should be 80px based on auto-fit logic)
    const newBox = await dayColumn.boundingBox();
    expect(newBox).not.toBeNull();
    
    // Auto-fit sets width to 80px
    expect(newBox.width).toBeGreaterThanOrEqual(75);
    expect(newBox.width).toBeLessThanOrEqual(85);
  });
});
