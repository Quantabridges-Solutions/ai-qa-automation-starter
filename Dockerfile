# Build and run Playwright tests in CI. Use docker-compose or GitHub Actions.
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npx playwright install-deps

ENV CI=1
CMD ["npm", "run", "test"]
