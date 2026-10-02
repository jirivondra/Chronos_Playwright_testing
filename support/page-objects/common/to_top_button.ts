import { Page, Locator, expect } from '@playwright/test'
import { Footer } from './footer'

export class ToTopButton extends Footer {
  private readonly toTopButton: Locator
  private readonly visibleOpacity: string
  private readonly hiddenOpacity: string

  constructor(page: Page, path: string) {
    super(page, path)
    this.toTopButton = this.page.getByRole('button', { name: 'arrow_upward' })
    this.visibleOpacity = '1'
    this.hiddenOpacity = '0'
  }

  async checkToTopButtonVisible(): Promise<this> {
    await expect.soft(this.toTopButton).toBeVisible()
    await expect.soft(this.toTopButton).toHaveCSS('opacity', this.visibleOpacity)
    return this
  }

  async checkToTopButtonNotVisible(): Promise<this> {
    await expect(this.toTopButton).toHaveCSS('opacity', this.hiddenOpacity)
    return this
  }

  async clickToTopButton(): Promise<this> {
    await this.toTopButton.click()
    return this
  }
}
