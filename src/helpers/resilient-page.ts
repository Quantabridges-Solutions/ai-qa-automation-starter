import type { Page, Locator } from '@playwright/test';

/**
 * Self-healing selectors: try multiple strategies so tests survive DOM/ID changes.
 * Use role, text, and test-id first; fall back to CSS only when needed.
 */
export class ResilientPage {
  constructor(private readonly page: Page) {}

  /**
   * Find a button by label, role, or test id. Tries in order until one matches.
   */
  button(labelOrOptions: string | { testId?: string; role?: string }): Locator {
    if (typeof labelOrOptions === 'string') {
      return this.page.getByRole('button', { name: labelOrOptions }).or(
        this.page.locator(`button:has-text("${labelOrOptions}")`)
      );
    }
    if (labelOrOptions.testId) {
      return this.page.getByTestId(labelOrOptions.testId);
    }
    return this.page.getByRole('button');
  }

  /**
   * Find a link by text or test id.
   */
  link(textOrTestId: string): Locator {
    const byRole = this.page.getByRole('link', { name: textOrTestId });
    const byTestId = this.page.getByTestId(textOrTestId);
    return byRole.or(byTestId);
  }

  /**
   * Find an input by label, placeholder, or test id.
   */
  input(labelOrOptions: string | { testId?: string; placeholder?: string }): Locator {
    if (typeof labelOrOptions === 'string') {
      return this.page.getByLabel(labelOrOptions).or(
        this.page.getByPlaceholder(labelOrOptions)
      ).or(
        this.page.getByTestId(labelOrOptions)
      );
    }
    if (labelOrOptions.testId) {
      return this.page.getByTestId(labelOrOptions.testId);
    }
    if (labelOrOptions.placeholder) {
      return this.page.getByPlaceholder(labelOrOptions.placeholder);
    }
    return this.page.getByRole('textbox');
  }

  /**
   * Generic resilient locator: tries role+name, test-id, then aria-label, then text.
   */
  byRoleAndName(role: 'button' | 'link' | 'heading' | 'textbox' | 'checkbox', name: string): Locator {
    return this.page.getByRole(role, { name: new RegExp(name, 'i') }).or(
      this.page.getByTestId(name)
    ).or(
      this.page.locator(`[aria-label*="${name}"]`)
    );
  }
}
