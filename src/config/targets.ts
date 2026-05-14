/**
 * Central targets for UI (Playwright page) and API (request context) tests.
 * Override with BASE_URL / API_BASE_URL, or pick a preset with TEST_ENV.
 */
export type TestEnvName = 'default' | 'local' | 'staging' | 'production';

export interface TargetConfig {
  readonly env: TestEnvName;
  /** Base URL for browser UI tests (Playwright `page.goto('/')`). */
  readonly baseURL: string;
  /** Base URL for API-only specs (`request.get('/path')`). */
  readonly apiBaseURL: string;
}

const FALLBACK_UI = 'https://example.com';
const FALLBACK_API = 'https://jsonplaceholder.typicode.com';

const PRESETS: Record<TestEnvName, Omit<TargetConfig, 'env'> & { env: TestEnvName }> = {
  default: { env: 'default', baseURL: FALLBACK_UI, apiBaseURL: FALLBACK_API },
  local: {
    env: 'local',
    baseURL: 'http://127.0.0.1:3000',
    apiBaseURL: 'http://127.0.0.1:8080',
  },
  staging: {
    env: 'staging',
    baseURL: 'https://staging.example.invalid',
    apiBaseURL: 'https://api-staging.example.invalid',
  },
  production: {
    env: 'production',
    baseURL: 'https://example.com',
    apiBaseURL: FALLBACK_API,
  },
};

function normalizeEnv(raw: string | undefined): TestEnvName {
  const v = (raw ?? 'default').toLowerCase();
  if (v === 'local' || v === 'staging' || v === 'production' || v === 'default') {
    return v;
  }
  return 'default';
}

/**
 * Resolves URLs for Playwright projects. Explicit env vars always win over presets.
 */
export function getTargetConfig(): TargetConfig {
  const env = normalizeEnv(process.env.TEST_ENV);
  const preset = PRESETS[env];

  return {
    env,
    baseURL: process.env.BASE_URL?.trim() || preset.baseURL,
    apiBaseURL: process.env.API_BASE_URL?.trim() || preset.apiBaseURL,
  };
}
