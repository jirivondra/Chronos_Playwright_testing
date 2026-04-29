import { Page, Locator } from '@playwright/test'
import { BasePage } from './base_page'

export class Header extends BasePage {
  protected readonly h1: Locator
  protected readonly h2: Locator

  constructor(page: Page, path: string) {
    super(page, path)

    this.h1 = this.page.getByRole('heading', { level: 1 })
    this.h2 = this.page.getByRole('heading', { level: 2 })
  }

  async checkH1(text: string) {
    await this.actions
      .assertVisible(this.h1)
      .then(a => a.assertCount(this.h1, 1))
      .then(a => a.assertText(this.h1, text))
  }

  async checkH2(text: string) {
    await this.actions.assertVisible(this.h2).then(a => a.assertText(this.h2, text))
  }
}
