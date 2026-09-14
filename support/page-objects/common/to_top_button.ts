import { Page, Locator, expect } from '@playwright/test'
import { Footer } from './footer'

export class ToTopButton extends Footer {
  private readonly toTopButton: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.toTopButton = this.page.getByRole('button', { name: 'arrow_upward' })
  }

  async checkToTopButtonVisible(): Promise<this> {
    await expect.soft(this.toTopButton).toBeVisible()
    await expect.soft(this.toTopButton).toHaveCSS('opacity', '1')
    return this
  }

  async checkToTopButtonNotVisible(): Promise<this> {
    await expect(this.toTopButton).toHaveCSS('opacity', '0')
    return this
  }

  async clickToTopButton(): Promise<this> {
    await this.toTopButton.click()
    return this
  }
}
