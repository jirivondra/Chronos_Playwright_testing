# Checking Multiple Elements Within a Container

Some assertions must hold for every element inside a container, not just one identified by name — e.g. verifying that every task currently shown in a list has the same visual state.

## Pattern

Scope a locator to the container, compose an already-defined locator inside it, then resolve it into an array of individual `Locator`s with `.all()`. `Locator.locator()` accepts either a selector string or another `Locator`, so an existing element locator gets reused instead of re-typed:

```ts
// taskGroup already matches every '.group' element on the page
protected readonly taskGroup: Locator = page.locator('.group')

async checkAllTasksInFinishSectionMarkedComplete(): Promise<this> {
  const tasks = await this.doneList.locator(this.taskGroup).all() // only '.group' elements inside #done-list
  for (const task of tasks) {
    await expect.soft(task.getByRole('checkbox')).toBeChecked()
    await expect.soft(task.getByRole('heading')).toHaveClass(/line-through/)
  }
  return this
}
```

`.all()` resolves the current matches into a plain `Locator[]` at that moment, so a normal `for...of` works — no manual indexing needed.

## Why not `expect(locator).toHaveText([...])`?

Playwright's web-first assertions can compare a multi-element locator against an array of expected values positionally (`toHaveText(['a', 'b'])`), but that only works for checking one property across all matches at once. Here each item needs two different properties checked together (checkbox state + title's CSS class), living on two different child elements — no single assertion call covers that, so iterate instead.

## Rules

- Scope to the container first (e.g. `this.doneList`), then compose an existing locator inside it — don't re-type the same CSS/role selector a second time.
- Use `await container.locator(existingLocator).all()` + `for...of` whenever checking more than one property per item.
- Use `expect.soft` inside the loop so one failing item doesn't stop the rest from being checked and reported.
- An empty container (`.all()` returns `[]`) is a vacuous pass — nothing to check is not a failure. Pair with a `conditional-skip.md`-style test if you also need to assert the container has items in a given state.
