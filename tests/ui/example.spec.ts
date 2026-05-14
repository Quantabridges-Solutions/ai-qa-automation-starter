import { test, expect } from '@playwright/test';

test.describe('Example UI regression', () => {
  test('homepage has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/example/i);
  });

  test('homepage is reachable', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });
});
