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

## Visual Testing

Visual regression tests live alongside the functional tests in `tests/regression/*.spec.ts`, under their own `Visual Tests For [Page]` describe block (e.g. `login_page.spec.ts`). They compare a full-page screenshot against a committed baseline PNG per browser, stored in `tests/regression/*.spec.ts-snapshots/`. These run in CI (see CI/CD below), so their baselines are generated on Linux to match the CI runner exactly.

**Requires [Docker](https://www.docker.com/) running locally.** Baselines are named `-linux.png` regardless of your host OS — updating them always runs Playwright inside Docker's official image, never bare `npx playwright test` on the host, otherwise you'd produce a `-darwin.png`/`-win32.png` file CI can never match against. With the app running locally (`localhost:3000`/`localhost:8000`) and Docker running, regenerate the baseline for a spec file with:

```bash
task update-snapshots -- tests/regression/login_page.spec.ts
```

Review the diff first (`npm run test_report`) to confirm the change is intentional before updating. Commit the updated PNG(s) together with the change that caused them — a missing baseline isn't a silent gap, it makes the test fail loudly for anyone else ("A snapshot doesn't exist"), but only once you actually run the suite. Since the `*.spec.ts-snapshots/` folders aren't tracked until you `git add` them, double-check they're staged before pushing a new or updated visual test.

## Linting & Formatting

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run lint`         | Run ESLint on all files                 |
| `npm run lint-fix`     | Auto-fix ESLint issues                  |
| `npm run format`       | Format all files with Prettier          |
| `npm run format-check` | Check formatting without making changes |

Or using Taskfile:

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `task check`        | Run ESLint + Prettier check       |
| `task fix`          | Auto-fix with Prettier + ESLint   |
| `task format-check` | Check formatting with Prettier    |
| `task format-fix`   | Auto-fix formatting with Prettier |

## Browsers

Tests are configured to run on:

- **Chromium** (Desktop Chrome)
- **WebKit** (Desktop Safari)
- **Google Chrome**

## Scope

### Out of scope (planned for the future)

- **Mobile browsers** — testing on mobile viewports (e.g. Pixel 5, iPhone) is not currently covered. Mobile browser coverage is planned for a future iteration.

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
