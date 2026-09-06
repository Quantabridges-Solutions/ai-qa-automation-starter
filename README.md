# AI-powered QA automation toolkit (Playwright)

End-to-end toolkit for **UI regression**, **API integration tests**, **AI-generated specs**, **passive security scanning (OWASP ZAP)**, **optional load checks (k6)**, and **CI** — so you can exercise a whole product surface from one repo.

**Maintained by [Qbs-Tech](https://qbs-tech.com)** — we help teams ship reliable software with QA automation and AI-assisted testing.

## What is included

| Layer | What you get |
|--------|----------------|
| **UI** | Playwright E2E across Chromium, Firefox, WebKit; resilient selector helpers |
| **API** | Playwright `request` specs against a configurable API base URL |
| **Security** | OWASP ZAP **baseline** scan (DAST-style passive checks) in CI and via Docker |
| **Performance** | Optional **k6** smoke script + manual GitHub workflow |
| **AI generation** | OpenAI-backed CLI for **UI** or **API** Playwright test files |
| **Environments** | `TEST_ENV` presets plus `BASE_URL` / `API_BASE_URL` overrides |
| **CI** | GitHub Actions: API job, UI job, ZAP, `npm audit` |

## Stack

- [Playwright](https://playwright.dev/)
- [OpenAI](https://platform.openai.com/) (optional, for `generate:tests`)
- [OWASP ZAP](https://www.zaproxy.org/) (Docker + `zaproxy/action-baseline`)
- [k6](https://k6.io/) (optional; local or `performance-k6` workflow)
- Node.js 20+
- Docker & GitHub Actions

## Repository layout

```
src/
  ai/generate-tests.ts    # AI test generator (UI + API modes)
  config/targets.ts       # Environment URL resolution
  helpers/resilient-page.ts
tests/
  ui/                     # Browser E2E specs
  api/                    # HTTP specs (no browser UI)
scripts/
  zap-baseline-docker.sh  # Local ZAP scan (Docker)
  k6/api-smoke.js         # Optional load smoke
.github/workflows/
  playwright.yml          # API + UI + ZAP + audit
  performance-k6.yml      # Manual k6 run
```

## Quick start

```bash
git clone https://github.com/Quantabridges-Solutions/ai-qa-automation-starter.git
cd ai-qa-automation-starter
npm install
npx playwright install

# Run everything Playwright knows about (UI + API projects)
npm test
```

Default targets: UI `https://example.com`, API `https://jsonplaceholder.typicode.com` (safe public demos).

## Commands

| Command | Description |
|--------|-------------|
| `npm test` | All Playwright projects (UI × 3 browsers + API) |
| `npm run test:ui` | UI specs only (Chromium, Firefox, WebKit) |
| `npm run test:api` | API specs only |
| `npm run test:security` | ZAP baseline via Docker against `SECURITY_TARGET_URL` or `BASE_URL` |
| `npm run test:ui:interactive` | Playwright UI mode (`playwright test --ui`) |
| `npm run test:ui:headed` | Headed Chromium UI run |
| `npm run test:ui:debug` | Debug Chromium UI run |
| `npm run generate:tests` | AI: generate **UI** spec (`tests/ui/…`, needs `OPENAI_API_KEY`) |
| `npm run generate:tests:api` | AI: generate **API** spec (`tests/api/…`) |
| `npm run report` | Open last HTML report |

## Environment variables

Copy `.env.example` to `.env` for local use. Never commit `.env`.

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | UI base URL (overrides `TEST_ENV` preset) |
| `API_BASE_URL` | API base for `tests/api/**` |
| `TEST_ENV` | `default` \| `local` \| `staging` \| `production` — picks preset URLs when explicit URLs are not set |
| `OPENAI_API_KEY` | Required for `generate:tests` / `generate:tests:api` |
| `OPENAI_MODEL` | Optional model id (default `gpt-4o-mini`) |
| `OUTPUT_PATH` | Where to write AI-generated file |
| `TEST_GEN_MODE` | `ui` (default) or `api` — used by `generate:tests` |
| `SECURITY_TARGET_URL` | Preferred URL for `npm run test:security` / ZAP compose service |
| `SKIP_WEBKIT` | Set to `1` to skip the WebKit UI project (e.g. Linux without `playwright install-deps`) |

On Linux, if WebKit fails after `npx playwright install`, install system libraries: `sudo npx playwright install-deps` (or `sudo env "PATH=$PATH" npx playwright install-deps` if `sudo` cannot find `npx`).

## AI test generation

```bash
export OPENAI_API_KEY=sk-...

# UI tests (default): writes tests/ui/ai-generated.spec.ts (gitignored)
npm run generate:tests -- "Check that / shows Example Domain in the heading"

# API tests: writes tests/api/ai-generated.api.spec.ts (gitignored)
npm run generate:tests:api -- "Cover GET /posts/1 and POST /posts for JSONPlaceholder"

# Custom output
OUTPUT_PATH=tests/ui/checkout.spec.ts npm run generate:tests -- "…"
```

## Self-healing / resilient UI selectors

Use the `resilientPage` fixture (`tests/fixtures.ts`) so locators prefer **role**, **label**, and **test-id**. See `src/helpers/resilient-page.ts`.

## Security scanning (pen-test style DAST)

- **CI**: the `security-zap` job in `.github/workflows/playwright.yml` runs [ZAP baseline](https://www.zaproxy.org/docs/docker/baseline/) against `https://example.com` by default (or `security_target` on `workflow_dispatch`). `fail_action` is `false` so informational findings do not block the starter; tighten this for your own app and policy.
- **Local / CI parity**: `npm run test:security` runs Docker `zap-baseline.py` and writes HTML + JSON under `security-reports/` (gitignored parent path; directory created by script).
- **Compose**: `docker compose --profile security run --rm zap-scan` with `SECURITY_TARGET_URL` set for your deployment.

ZAP performs **automated passive** checks (headers, cookies, known misconfigurations). It is not a substitute for a full manual penetration test or threat modeling.

## Optional load testing (k6)

```bash
# https://k6.io/docs/get-started/installation/
k6 run scripts/k6/api-smoke.js
# K6_API_BASE=https://api.staging.example.com k6 run scripts/k6/api-smoke.js
```

GitHub: run workflow **Performance smoke (k6)** manually.

## Docker

```bash
# Full Playwright suite (UI + API) in container
docker compose run --rm tests

# API-only container target
docker compose run --rm tests-api
```

## CI (GitHub Actions)

`playwright.yml` runs in parallel:

1. **api-tests** — Chromium only, `npm run test:api`
2. **ui-tests** — all browsers, `npm run test:ui`, Playwright HTML report on failure
3. **dependency-audit** — `npm audit --omit=dev`
4. **security-zap** — OWASP ZAP baseline

JUnit is uploaded when present under `test-results/junit.xml`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
