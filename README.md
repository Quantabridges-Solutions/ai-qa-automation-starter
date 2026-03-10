# AI-powered QA automation starter kit for Playwright tests

Starter kit for **Playwright** with **AI test generation** and **self-healing selectors**. Use it to bootstrap regression suites and generate tests from natural language or UI flows.

**Maintained by [Qbs-Tech](https://qbs-tech.com)** — we help teams ship reliable software with QA automation and AI-assisted testing.

## Features

- **Playwright** — cross-browser E2E tests (Chromium, Firefox, WebKit)
- **AI test generation** — generate Playwright tests from a short prompt (OpenAI)
- **Self-healing selectors** — resilient helpers (role, label, test-id) to reduce flakiness
- **Test generation from UI** — describe a flow in plain language and get a spec file
- **Regression automation** — example suite + Docker + GitHub Actions

## Stack

- [Playwright](https://playwright.dev/)
- [OpenAI](https://platform.openai.com/) (for AI-generated tests)
- Node.js 20+
- Docker & GitHub Actions

## Pushing to GitHub

- **Never commit `.env`** — it’s in `.gitignore`; use it only locally for `OPENAI_API_KEY` and other secrets.
- Copy `.env.example` to `.env` and fill in real values only on your machine or in CI secrets.
- Reports, `node_modules`, and build output are ignored so the repo stays clean and safe to push.

## Quick start

```bash
# Clone and install
git clone https://github.com/quantabridges/ai-qa-automation-starter.git
cd ai-qa-automation-starter
npm install

# Install browsers (one-time)
npx playwright install

# Run tests (default base URL: https://example.com)
npm test
```

## Commands

| Command | Description |
|--------|-------------|
| `npm test` | Run Playwright tests |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in debug mode |
| `npm run generate:tests` | Generate tests from AI (requires `OPENAI_API_KEY`) |
| `npm run report` | Open last HTML report |

## AI test generation

Set your OpenAI API key, then pass a prompt. The script writes a new Playwright spec file.

```bash
export OPENAI_API_KEY=sk-...

# Default: generates tests for example.com and writes tests/ai-generated.spec.ts
npm run generate:tests

# Custom prompt and output
OUTPUT_PATH=tests/my-feature.spec.ts npm run generate:tests -- "Login flow: go to /login, fill email and password, click Sign in, expect dashboard"
```

## Self-healing selectors

Use the `resilientPage` fixture so selectors prefer **role**, **label**, and **test-id** and survive many DOM/ID changes:

```ts
import { test, expect } from './fixtures.js';

test('submit form', async ({ resilientPage, page }) => {
  await page.goto('/form');
  await resilientPage.input('Email').fill('user@example.com');
  await resilientPage.button('Submit').click();
  await expect(page.getByRole('status')).toContainText('Success');
});
```

See `src/helpers/resilient-page.ts` for `button()`, `link()`, `input()`, and `byRoleAndName()`.

## Configuration

- **Base URL**: set `BASE_URL` (e.g. `https://your-app.com`) or leave default `https://example.com`.
- **Playwright**: edit `playwright.config.ts` for timeouts, projects, and reporters.
- **OpenAI**: only needed for `generate:tests`; use `.env` and add `.env` to `.gitignore` (already ignored).

## Docker

```bash
# Build and run tests in container
docker compose run --rm tests

# Or build and run manually
docker build -t ai-qa-starter .
docker run --rm ai-qa-starter
```

## CI (GitHub Actions)

The workflow in `.github/workflows/playwright.yml` runs on push/PR to `main` or `master`: installs deps, runs `npm test`, and uploads the HTML report on failure.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to report issues, suggest features, or submit pull requests.

## License

MIT — see [LICENSE](LICENSE).
