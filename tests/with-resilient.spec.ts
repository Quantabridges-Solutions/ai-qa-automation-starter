import { test, expect } from './fixtures.js';

/**
 * Example using the self-healing/resilient selectors fixture.
 * These selectors prefer role/label/test-id and survive many DOM changes.
 */
test.describe('Resilient selectors example', () => {
  test('example.com has heading', async ({ resilientPage, page }) => {
    await page.goto('https://example.com');
    const heading = resilientPage.byRoleAndName('heading', 'Example Domain');
    await expect(heading).toBeVisible();
  });
});
