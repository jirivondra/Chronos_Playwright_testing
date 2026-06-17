# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests (headless)
npm test

# Run a single test file
npx playwright test tests/login_page.spec.ts

# Run a single test by name
npx playwright test --grep "Check H1 On Page Login"

# Run with browser visible
npm run test_headed

# Open Playwright UI (interactive test runner)
npm run test_ui

# Show HTML report from last run
npm run test_report

# Lint + format check (both at once)
task check

# Auto-fix lint and formatting
task fix
```

Environment variables are loaded from `.env` via `dotenv` in `playwright.config.ts`. Required vars: `BASE_URL`, `API_BASE_URL`, `API_USERNAME`, `API_PASSWORD`.

## Architecture

### Page Object inheritance chain

Two chains exist. `DashboardPage` uses the full chain; `LoginPage` and `LogoutPage` branch off at `ToTopButton`:

```
ApiHelper → BasePage → Header → Footer → ToTopButton → AppBar → SiteBarMenu → OpenTask → DashboardPage
                                                                              └─ NewTaskPage
                                                      └─ LoginPage
                                                      └─ LogoutPage
```

- **ApiHelper** (`support/page-objects/common/api_helper.ts`) — HTTP client (no Playwright dependency). Holds `path`, `baseApiUrl`, auth headers, and `get/post/put/delete/apiRequest` methods. All page objects can make API calls.
- **BasePage** — adds `Page` instance. Provides `visit()`, `clearCache()`, `scrollToBottom()`. No assertion or interaction methods.
- **Header** — first class with assertion methods. Adds public `h1`/`h2` locators, `checkUrl()`, `checkH1()`, `checkH2()`.
- **Footer** — adds footer heading and contact icon locators and assertions.
- **ToTopButton** — adds back-to-top button locators and assertions.
- **AppBar** — adds `clickLogout()` which returns `LogoutPage`.
- **SiteBarMenu** — adds sidebar logo, navigation links, and app version assertions.
- **OpenTask** — adds open task list, expand button, API-based `countOpenTasks()`, and `deleteTaskByTitle()` for teardown.
- **Concrete pages** (e.g. `DashboardPage`) — define page-specific selectors and expose user-action methods.

### Fixtures

`support/fixture/` extends Playwright's `test` with page object fixtures. Each fixture instantiates the page object, calls `visit()` before the test, and `clearCache()` after. Tests import `test` from `support/fixture` (not from `@playwright/test` directly).

### Test data

`support/test-data/` contains plain TypeScript objects with test data (no logic). Imported directly into test files. Use `faker` for dynamic/unique values and `dayjs` for date generation — both called inside factory functions, never at module level.

### Documentation

@.claude/docs/available-methods.md
@.claude/docs/page-objects.md
@.claude/docs/fluent-api.md
@.claude/docs/custom-actions.md
@.claude/docs/api-helper.md
@.claude/docs/fixtures.md
@.claude/docs/test-structure.md
@.claude/docs/test-data.md
@.claude/docs/data-driven-tests.md
@.claude/docs/conditional-skip.md
