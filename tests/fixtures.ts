import { test as base } from '@playwright/test';
import { ResilientPage } from '../src/helpers/resilient-page.js';

/**
 * Custom fixture that provides a page with self-healing/resilient selectors.
 * Use fixture.extend() in your tests to get resilientLocator().
 */
export const test = base.extend<{ resilientPage: ResilientPage }>({
  resilientPage: async ({ page }, use) => {
    const resilient = new ResilientPage(page);
    await use(resilient);
  },
});

export { expect } from '@playwright/test';
