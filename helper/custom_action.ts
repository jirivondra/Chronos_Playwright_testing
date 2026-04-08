import { Locator, expect } from '@playwright/test'

export class CustomActions {
  async assertVisible(locator: Locator) {
    await expect(locator).toBeVisible()
  }

  async assertText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text)
  }

  async assertCount(locator: Locator, count: number) {
    await expect(locator).toHaveCount(count)
  }

  async assertAttribute(locator: Locator, attribute: string, value: string) {
    await expect(locator).toHaveAttribute(attribute, value)
  }

  async clickElement(locator: Locator) {
    await locator.click()
  }
}
