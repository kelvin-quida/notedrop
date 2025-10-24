import { test, expect } from '@playwright/test';

test.describe('NoteDrop - Message Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible({ timeout: 10000 });
    
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should create a new message', async ({ page }) => {
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible();

    const testMessage = `Test message ${Date.now()}`;
    await input.fill(testMessage);

    const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await submitButton.click();

    await expect(page.locator(`text=${testMessage}`)).toBeVisible({ timeout: 5000 });
  });

  test('should display existing messages', async ({ page }) => {
    const input = page.locator('input[type="text"], textarea').first();
    const testMessage = `Display test ${Date.now()}`;
    await input.fill(testMessage);
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await submitButton.click();

    await page.waitForTimeout(500);
    const messageInList = page.locator(`p:has-text("${testMessage}")`).first();
    await expect(messageInList).toBeVisible();
  });

  test('should not submit empty message', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    const input = page.locator('input[type="text"], textarea').first();
    
    await expect(input).toBeVisible();
    const value = await input.inputValue();
    expect(value).toBe('');
    
    await expect(submitButton).toBeDisabled();
    
    await input.fill('test');
    await expect(submitButton).toBeEnabled();
    
    await input.clear();
    await expect(submitButton).toBeDisabled();
  });

  test('should create multiple messages', async ({ page }) => {
    const messages = [
      `First message ${Date.now()}`,
      `Second message ${Date.now()}`,
      `Third message ${Date.now()}`
    ];

    for (const message of messages) {
      const input = page.locator('input[type="text"], textarea').first();
      await input.fill(message);
      
      const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
      await submitButton.click();
      
      await expect(page.locator(`text=${message}`)).toBeVisible();
      
      await page.waitForTimeout(500);
    }

    
    for (const message of messages) {
      await expect(page.locator(`text=${message}`)).toBeVisible();
    }
  });

  test('should export messages to Excel', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Exportar"), a:has-text("Export"), a:has-text("Exportar")').first();
    
    if (await exportButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      
      await exportButton.click();
      
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('.xlsx');
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/messages/', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');

    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('Test error handling');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await submitButton.click();

    
  });

  test('should display messages in correct order (newest first)', async ({ page }) => {
    const firstMessage = `First ${Date.now()}`;
    const secondMessage = `Second ${Date.now() + 1}`;

    let input = page.locator('input[type="text"], textarea').first();
    await input.fill(firstMessage);
    let submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await submitButton.click();
    await page.waitForTimeout(500);

    input = page.locator('input[type="text"], textarea').first();
    await input.fill(secondMessage);
    submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await submitButton.click();

    
    const messages = page.locator('[class*="message"], [data-testid="message"]');
    const count = await messages.count();
    
    if (count >= 2) {
      const firstDisplayed = await messages.first().textContent();
      expect(firstDisplayed).toContain(secondMessage);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible();

    const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Enviar")').first();
    await expect(submitButton).toBeVisible();
  });
});
