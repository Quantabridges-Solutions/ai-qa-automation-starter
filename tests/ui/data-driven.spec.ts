import { test, expect } from '@playwright/test';

const uiRoutes: ReadonlyArray<{ name: string; path: string; titlePattern: RegExp }> = [
  { name: 'home', path: '/', titlePattern: /example/i },
];

test.describe('Data-driven UI smoke', () => {
  for (const row of uiRoutes) {
    test(`loads ${row.name}`, async ({ page }) => {
      await page.goto(row.path);
      await expect(page).toHaveTitle(row.titlePattern);
    });
  }
});
