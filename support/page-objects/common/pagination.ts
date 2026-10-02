import { Page, Locator, expect } from '@playwright/test'

export class Pagination {
  private readonly container: Locator
  private readonly activePageButton: Locator
  private readonly nextButton: Locator
  private readonly previousButton: Locator

  constructor(page: Page) {
    this.container = page.locator('#pagination')
    this.activePageButton = this.container.locator('button.bg-primary')
    this.nextButton = this.container.getByRole('button', { name: 'chevron_right' })
    this.previousButton = this.container.getByRole('button', { name: 'chevron_left' })
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible()
  }

  async checkVisible(): Promise<this> {
    await expect(this.container).toBeVisible()
    return this
  }

  async checkNotVisible(): Promise<this> {
    await expect(this.container).not.toBeVisible()
    return this
  }

  async hasNextPage(): Promise<boolean> {
    return this.nextButton.isVisible()
  }

  async hasPreviousPage(): Promise<boolean> {
    return this.previousButton.isVisible()
  }

  async getTotalPages(): Promise<number> {
    const texts = await this.container.getByRole('button').allTextContents()
    const pageNumbers = texts.map(Number).filter((n) => !Number.isNaN(n))
    return Math.max(...pageNumbers)
  }

  async getCurrentPage(): Promise<number> {
    const text = await this.activePageButton.textContent()
    return Number(text)
  }

  async goToPage(pageNumber: number): Promise<this> {
    let current = await this.getCurrentPage()
    while (current !== pageNumber) {
      if (pageNumber > current) {
        await this.goToNextPage()
      } else {
        await this.goToPreviousPage()
      }
      current = await this.getCurrentPage()
    }
    return this
  }

  async goToNextPage(): Promise<this> {
    await this.nextButton.click()
    return this
  }

  async goToPreviousPage(): Promise<this> {
    await this.previousButton.click()
    return this
  }

  async checkCurrentPage(pageNumber: number): Promise<this> {
    await expect(this.activePageButton).toHaveText(String(pageNumber))
    return this
  }
}
