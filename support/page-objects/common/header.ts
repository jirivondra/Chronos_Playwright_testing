import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base_page'

export class Header extends BasePage {
  readonly h1: Locator
  readonly h2: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.h1 = this.page.getByRole('heading', { level: 1 })
    this.h2 = this.page.getByRole('heading', { level: 2 })
  }

  async checkUrl(url: string): Promise<this> {
    await expect(this.page).toHaveURL(url)
    return this
  }

  async checkH1(text: string): Promise<this> {
    await expect.soft(this.h1).toBeVisible()
    await expect.soft(this.h1).toHaveCount(1)
    await expect.soft(this.h1).toHaveText(text)
    return this
  }

  async checkH2(text: string): Promise<this> {
    await expect.soft(this.h2).toBeVisible()
    await expect.soft(this.h2).toHaveText(text)
    return this
  }
}
