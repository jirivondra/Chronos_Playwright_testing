# Fluent API

Fluent API is implemented in `CustomActions` (`helper/custom_action.ts`). Every method returns `Promise<this>`, allowing assertions and interactions to be chained together instead of writing separate `await` expressions.

## Purpose

- Makes page object methods more readable — a sequence of assertions is written as a single expression.
- Eliminates repeated `await this.actions` calls.

## How to use chaining in a page object

`this.actions` is available in every class that inherits from `Header` or below. Because each method returns `Promise<this>`, you can chain them with `.then()`:

```ts
async checkH1(text: string) {
  await this.actions
    .assertVisible(this.h1)
    .then(a => a.assertCount(this.h1, 1))
    .then(a => a.assertText(this.h1, text))
}
```

## How to write custom chainable methods in a page object

Every page object method that should support chaining must have a return type of `Promise<this>` and explicitly return `return this`.

```ts
async fillUserName(userName: string): Promise<this> {
  await this.page.locator(this.userName).fill(userName)
  return this
}
```

## Example usage in a test

```ts
await loginPage
  .visit()
  .then(p => p.fillUserName('admin'))
  .then(p => p.fillPassword('secret'))
  .then(p => p.clickLoginButton())
  .then(p => p.checkUrl('/dashboard'))
```

## Rules

- Custom page object methods must explicitly return `return this`, otherwise chaining will not work.
- Chaining works via `.then()` on the returned `Promise<this>`.
