#!/usr/bin/env node
/**
 * AI-powered test generation from UI or API descriptions.
 * Requires OPENAI_API_KEY. Writes a Playwright spec file.
 *
 * Modes: TEST_GEN_MODE=ui (default) | api
 */
import OpenAI from 'openai';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const SYSTEM_PROMPT_UI = `You are a QA engineer. Generate a single Playwright UI test file in TypeScript.

Rules:
- Use @playwright/test: test, expect.
- Use getByRole, getByLabel, getByPlaceholder, getByText, getByTestId when possible (resilient selectors).
- One describe block per scenario; clear test names.
- Use the app's base URL from Playwright config: navigate with page.goto('/') or relative paths when appropriate.
- Export only the test code: no extra explanation, no markdown code fence around the code.
- File must be valid TS and runnable with "npx playwright test <file>".
- Prefer data-testid for critical elements if the user mentions them.`;

const SYSTEM_PROMPT_API = `You are a QA engineer. Generate a single Playwright API integration test file in TypeScript.

Rules:
- Use @playwright/test: test, expect only — no browser, no page.goto.
- Use the async request fixture only: test('...', async ({ request }) => { ... }).
- Use request.get, request.post, request.put, request.patch, request.delete with paths relative to Playwright's configured API base URL (e.g. request.get('/posts/1')).
- Assert status codes, Content-Type when useful, and JSON body shape with expect().
- One describe block; clear test names.
- Export only the test code: no extra explanation, no markdown code fence around the code.
- File must be valid TS and runnable with "npx playwright test <file>".`;

function systemPromptForMode(mode: string): string {
  return mode === 'api' ? SYSTEM_PROMPT_API : SYSTEM_PROMPT_UI;
}

function defaultOutputPath(mode: string): string {
  if (mode === 'api') {
    return join(ROOT, 'tests', 'api', 'ai-generated.api.spec.ts');
  }
  return join(ROOT, 'tests', 'ui', 'ai-generated.spec.ts');
}

async function generateTests(
  userPrompt: string,
  outputPath: string,
  mode: string,
): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Set OPENAI_API_KEY to use AI test generation.');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  const system = systemPromptForMode(mode);
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? '';
  const code = raw.replace(/^```(?:ts|typescript)?\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  writeFileSync(outputPath, code, 'utf-8');
  console.log('Generated:', outputPath);
}

const mode = (process.env.TEST_GEN_MODE ?? 'ui').toLowerCase();
const userPrompt =
  process.argv.slice(2).join(' ') ||
  (mode === 'api'
    ? 'Generate tests for JSONPlaceholder: GET /posts/1 returns 200 and JSON with id, userId, title; POST /posts with title and body returns 201.'
    : 'Generate a simple test that goes to / and checks the page has an h1 with "Example Domain".');

const outPath = process.env.OUTPUT_PATH || defaultOutputPath(mode);

generateTests(userPrompt, outPath, mode).catch((err) => {
  console.error(err);
  process.exit(1);
});
