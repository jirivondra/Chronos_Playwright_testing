import { Page } from '@playwright/test'

export class Theme {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async inject(value: 'light' | 'dark'): Promise<void> {
    await this.page.addInitScript((t) => {
      localStorage.setItem('theme', t)
    }, value)
  }
}
