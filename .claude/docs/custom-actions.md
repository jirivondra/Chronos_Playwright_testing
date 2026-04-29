# CustomActions

`CustomActions` is a thin wrapper around Playwright's `expect` assertions and locator interactions. Every page object has access to it via `this.actions` (initialised in `BasePage`).

## Purpose

- Centralises assertion calls — changing how an assertion works means changing it in one place.
- Makes page object methods more readable by using descriptive names instead of raw `expect` chains.
- Keeps Playwright internals out of page objects.

## Available methods

| Method | Playwright equivalent | Description |
|---|---|---|
| `assertVisible(locator)` | `expect(locator).toBeVisible()` | Asserts the element is visible in the DOM |
| `assertText(locator, text)` | `expect(locator).toHaveText(text)` | Asserts the element's text content equals `text` |
| `assertCount(locator, count)` | `expect(locator).toHaveCount(count)` | Asserts the number of matching elements |
| `assertAttribute(locator, attribute, value)` | `expect(locator).toHaveAttribute(attribute, value)` | Asserts an HTML attribute value |
| `assertUrl(page, url)` | `expect(page).toHaveURL(url)` | Asserts the current page URL |
| `clickElement(locator)` | `locator.click()` | Clicks the element |

## How to use

`this.actions` is available in every class that inherits from `BasePage` or below:

```ts
async checkH1(text: string) {
  await this.actions.assertVisible(this.h1)
  await this.actions.assertCount(this.h1, 1)
  await this.actions.assertText(this.h1, text)
}
```

Pass a `Locator` directly — locators are defined as class properties, not inline strings:

```ts
// correct — named locator from a class property
await this.actions.assertText(this.submitButton, 'Submit')

// incorrect — inline selector string
await this.actions.assertText(this.page.locator('.btn'), 'Submit')
```

## When to use CustomActions vs. direct Playwright calls

Use `this.actions` inside page objects for any assertion or click that maps to the methods above.

Use direct Playwright calls when you need behaviour that `CustomActions` does not cover (e.g. `fill`, `selectOption`, `waitForResponse`). Do not add logic to page objects that belongs in tests.

Never call `expect` directly in a test file — delegate assertions to page object methods that use `this.actions` internally.
