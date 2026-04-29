import { Locator, Page, expect } from '@playwright/test'

export class CustomActions {
  async assertUrl(page: Page, url: string): Promise<this> {
    await expect(page).toHaveURL(url)
    return this
  }

  async assertVisible(locator: Locator): Promise<this> {
    await expect(locator).toBeVisible()
    return this
  }

  async assertText(locator: Locator, text: string): Promise<this> {
    await expect(locator).toHaveText(text)
    return this
  }

  async assertCount(locator: Locator, count: number): Promise<this> {
    await expect(locator).toHaveCount(count)
    return this
  }

  async assertAttribute(locator: Locator, attribute: string, value: string): Promise<this> {
    await expect(locator).toHaveAttribute(attribute, value)
    return this
  }

  async clickElement(locator: Locator): Promise<this> {
    await locator.click()
    return this
  }
}
