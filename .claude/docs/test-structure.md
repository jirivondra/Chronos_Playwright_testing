# Test structure (spec files)

## Template

```typescript
import { test, expect } from '../support/fixture'
import { dashboardPageData } from '../support/test-data/dashboard_page_data'

test.describe('Test Dashboard page', () => {

  test.describe('Atomic Tests For Header', () => {
    test('Check H1 On Page Dashboard', async ({ dashboardPage }) => {
      await dashboardPage.checkH1(dashboardPageData.h1)
    })

    test('Check Submit Button Visibility', async ({ dashboardPage }) => {
      await dashboardPage.checkSubmitButtonVisible()
    })
  })

  test.describe('E2E Test For Dashboard', () => {
    test('Full User Flow', async ({ dashboardPage }) => {
      await dashboardPage.doStep1()
      await dashboardPage.doStep2()
      await dashboardPage.checkResult()
    })
  })

})
```

## Rules

- Always import from `'../support/fixture'`, never directly from `'@playwright/test'`.
- Import `expect` from `'../support/fixture'` as well.

### Describe block structure

| Level | Format | Example |
|---|---|---|
| Outer | `'Test [Name] page'` | `'Test Login page'` |
| Inner — atomic | `'Atomic Tests For [Section]'` | `'Atomic Tests For Footer'` |
| Inner — E2E | `'E2E Test For [Page]'` | `'E2E Test For Login Page'` |

### Test naming

- Starts with a capital letter.
- Describes WHAT is being tested, not how.
- Examples: `'Check H1 On Page Login'`, `'Show And Hide Password'`, `'Login With Correct Credentials'`

### Direct `expect` in a spec file

Use `expect` directly in a spec file only when a page object method is not sufficient:

```typescript
// ok — count cannot be easily encapsulated
await expect(loginPage.contactIcons).toHaveCount(3)
```

All other assertions belong inside page object methods and are called via `this.actions`.
