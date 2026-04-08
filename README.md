# Chronos Playwright Testing

Automated end-to-end tests for the Chronos application built with [Playwright](https://playwright.dev/).

## Requirements

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm

## Installation

```bash
npm install
npx playwright install
```

## Running Tests

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm test`            | Run all tests in headless mode               |
| `npm run test_headed` | Run tests with the browser open              |
| `npm run test_ui`     | Open Playwright UI for interactive debugging |
| `npm run test_report` | Show the HTML report from the last run       |

## Linting & Formatting

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `npm run lint`           | Run ESLint on all files                  |
| `npm run lint-fix`       | Auto-fix ESLint issues                   |
| `npm run format`         | Format all files with Prettier           |
| `npm run format-check`   | Check formatting without making changes  |

## Browsers

Tests are configured to run on:

- **Chromium**
- **Firefox**

## Project Structure

```
.
├── support/
│   ├── page-objects/       # Page Object models
│   │   └── common/         # Shared components
│   └── test-data/          # Test data
├── tests/                  # Test files (*.spec.ts)
├── playwright.config.ts    # Playwright configuration
└── tsconfig.json
```

## CI/CD

On CI environments, tests run with:

- 1 worker (sequentially)
- 2 retries on failure
- `test.only` forbidden
