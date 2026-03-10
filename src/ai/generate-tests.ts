#!/usr/bin/env node
/**
 * AI-powered test generation from UI description or recorded steps.
 * Requires OPENAI_API_KEY in env. Generates Playwright tests from a short prompt.
 */
import OpenAI from 'openai';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

const SYSTEM_PROMPT = `You are a QA engineer. Generate a single Playwright test file in TypeScript.

Rules:
- Use @playwright/test: test, expect.
- Use getByRole, getByLabel, getByPlaceholder, getByText, getByTestId when possible (resilient selectors).
- One describe block per scenario; clear test names.
- No page.goto in beforeEach unless the user asks for it; include navigation in tests when relevant.
- Export only the test code: no extra explanation, no markdown code fence around the code.
- File must be valid TS and runnable with "npx playwright test <file>".
- Prefer data-testid for critical elements if the user mentions them.`;

async function generateTests(userPrompt: string, outputPath: string): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Set OPENAI_API_KEY to use AI test generation.');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
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

const userPrompt = process.argv.slice(2).join(' ') ||
  'Generate a simple test that goes to https://example.com and checks the page has an h1 with "Example Domain".';
const outPath = process.env.OUTPUT_PATH || join(ROOT, 'tests', 'ai-generated.spec.ts');

generateTests(userPrompt, outPath).catch((err) => {
  console.error(err);
  process.exit(1);
});
