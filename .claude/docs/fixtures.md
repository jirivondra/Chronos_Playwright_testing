# Fixtures

Fixtures extend Playwright's built-in `test` with page object instances. Each fixture instantiates a page object, navigates to the page before the test, and clears the cache after. Tests receive a ready-to-use page object without any setup boilerplate.

## Purpose

- Removes repetitive `new PageObject(page)` and `visit()` calls from every test.
- Guarantees a clean browser state after each test via `clearCache()`.
- Keeps test files focused on assertions, not setup.

## File structure

```
support/fixture/
  index.ts          — merges all fixture groups and re-exports test + expect
  auth-fixtures.ts  — fixtures for pages that require authentication or belong to the auth flow
```

## How to use in a test

Import `test` and `expect` from `support/fixture`, not from `@playwright/test` directly. The page object is injected by name as a destructured parameter:

```ts
import { test, expect } from '../support/fixture'

test('Check H1 On Page Login', async ({ loginPage }) => {
  await loginPage.checkH1('Sign in')
})
```

The fixture handles `visit()` before the test body runs and `clearCache()` after — the test itself only interacts with the page.

## How to add a new fixture

1. Create a new file in `support/fixture/` (e.g. `dashboard-fixtures.ts`).
2. Extend `base` from `@playwright/test` with a typed fixture object.
3. Inside the fixture body: instantiate the page object, call `visit()`, yield with `use()`, then call `clearCache()`.
4. Export the fixture group and add it to `mergeTests()` in `index.ts`.

```ts
// support/fixture/dashboard-fixtures.ts
import { test as base } from '@playwright/test'
import { DashboardPage } from '../page-objects/dashboard_page'

export type DashboardFixtures = {
  dashboardPage: DashboardPage
}

export const dashboardFixtures = base.extend<DashboardFixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page)

    await dashboardPage.visit()
    await use(dashboardPage)

    await dashboardPage.clearCache()
  },
})
```

```ts
// support/fixture/index.ts
import { mergeTests } from '@playwright/test'
import { authFixtures } from './auth-fixtures'
import { dashboardFixtures } from './dashboard-fixtures'

export const test = mergeTests(authFixtures, dashboardFixtures)

export { expect } from '@playwright/test'
```

## Lifecycle

```
[before test]  new PageObject(page)  →  visit()
[test body]    use(pageObject)       ← test receives instance here
[after test]   clearCache()
```

`clearCache()` runs even if the test fails, so the next test always starts with a clean state.

## Rules

- Always import `test` and `expect` from `support/fixture`, never from `@playwright/test`.
- Each fixture file contains one group of related page fixtures (auth, dashboard, etc.).
- The fixture body must follow the exact pattern: instantiate → `visit()` → `use()` → `clearCache()`.
- Do not put test logic or assertions inside a fixture — fixtures only prepare state.
- One fixture = one page object. Do not instantiate multiple page objects in a single fixture.
