# Page Objects

Page Object Model (POM) is a design pattern that separates page logic from the tests themselves. Each page of the application is represented by its own class that encapsulates selectors and actions.

## Purpose

- Prevents duplication — a selector is defined in one place.
- Tests are more readable; they work with user actions, not CSS selectors.
- When the UI changes, only the page object needs updating, not every test individually.

## How to create a new page object

1. Inherit from the closest existing class that shares the required functionality.
2. Define selectors as private/protected class properties.
3. Each public method corresponds to a single user action or assertion.
4. Page objects do not contain test logic (`test`, `expect` belong in tests).

## Assertions and interactions

Assertions and element interactions inside page objects are delegated to `CustomActions` via `this.actions` (available from `Header` downward). See [custom-actions.md](custom-actions.md) for available methods and usage guidance.

## Selectors: string vs Locator

A class property can hold either a CSS/selector **string** or a resolved **Locator**. The choice follows where the property is consumed:

| Type      | When to use                                                                                                    | Visibility                                               |
| --------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `string`  | Passed to `BasePage` methods (`click`, `isVisible`) or used to build a `Locator` via `this.page.locator()`     | `protected` when subclasses need it, otherwise `private` |
| `Locator` | Passed directly to `this.actions.*` methods (`assertVisible`, `assertText`, `assertAttribute`, `clickElement`) | `private readonly`                                       |

A `string` property can serve as the source for a sibling `Locator` property when both uses are needed:

```ts
protected submitButton: string = 'button[type="submit"]'         // for BasePage.click()
private readonly signInButton: Locator = this.page.locator(this.submitButton)  // for this.actions.*
```

Use `protected` on a `string` selector only when a subclass must reference or override it. Default to `private readonly` for `Locator` properties — they are never inherited.

## Rules

- Selectors are not magic strings scattered across methods — they are named class properties.
- One method = one user action or assertion.
- A new page object inherits from the closest existing class with shared functionality.
- Test logic does not belong in page objects.
