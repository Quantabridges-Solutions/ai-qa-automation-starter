# Security Policy

## Supported versions

We release security updates for the latest major version. Please upgrade to the newest release to receive security fixes.

## Reporting a vulnerability

If you believe you’ve found a security vulnerability, please report it responsibly:

- **Do not** open a public GitHub issue for security-sensitive bugs.
- Email **contact@qbs-tech.com** (or your preferred contact at [Qbs-Tech](https://qbs-tech.com)) with:
  - A short description of the issue
  - Steps to reproduce
  - Impact (e.g. exposure of secrets, privilege escalation)

We’ll acknowledge receipt and work with you to understand and address the issue. We appreciate your help in keeping this project and its users safe.

## Best practices for users

- **Never commit `.env`** or any file containing `OPENAI_API_KEY` or other secrets.
- Use GitHub Actions secrets (or your CI’s secret store) for API keys in automation.
- Keep dependencies up to date with `npm audit` and `npm update`.
