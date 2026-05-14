import { defineConfig, devices } from '@playwright/test';
import { getTargetConfig } from './src/config/targets.js';

const targets = getTargetConfig();
const isCI = !!process.env.CI;
const skipWebKit = process.env.SKIP_WEBKIT === '1' || process.env.SKIP_WEBKIT === 'true';

const uiProjects = [
  {
    name: 'ui-chromium',
    testMatch: 'ui/**/*.spec.ts',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'ui-firefox',
    testMatch: 'ui/**/*.spec.ts',
    use: { ...devices['Desktop Firefox'] },
  },
  ...(skipWebKit
    ? []
    : [
        {
          name: 'ui-webkit',
          testMatch: 'ui/**/*.spec.ts',
          use: { ...devices['Desktop Safari'] },
        },
      ]),
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [
        ['html', { open: 'never' }],
        ['list'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: targets.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    ...uiProjects,
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
      use: {
        baseURL: targets.apiBaseURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
  timeout: 30_000,
  expect: { timeout: 10_000 },
});
