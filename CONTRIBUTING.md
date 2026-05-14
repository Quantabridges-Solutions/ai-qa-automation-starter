# Contributing to AI QA Automation Starter

Thanks for your interest in contributing. This project is maintained by [Qbs-Tech](https://qbs-tech.com).

## How to contribute

- **Bug reports & feature requests** — Open a [GitHub Issue](https://github.com/quantabridges/ai-qa-automation-starter/issues).
- **Code changes** — Open a pull request against `main`. Keep PRs focused and include a short description.

## Development setup

```bash
git clone https://github.com/quantabridges/ai-qa-automation-starter.git
cd ai-qa-automation-starter
npm install
npx playwright install
cp .env.example .env   # add OPENAI_API_KEY if you want to run generate:tests
npm test

# If WebKit fails on Linux (missing system libraries), either:
#   sudo npx playwright install-deps
# or temporarily: SKIP_WEBKIT=1 npm test
```

## Code and PR guidelines

- Use TypeScript; follow the existing style (ESM, `src/` for scripts, `tests/` for specs).
- For AI-related changes, ensure `npm run generate:tests` and `npm run generate:tests:api` still work with a sample prompt.
- Put browser specs under `tests/ui/` and HTTP-only specs under `tests/api/`.
- New UI tests should prefer resilient selectors (see `src/helpers/resilient-page.ts` and `tests/ui/with-resilient.spec.ts`).
- Keep the default base URL as `https://example.com` so the starter runs out of the box without config.

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers this project.
