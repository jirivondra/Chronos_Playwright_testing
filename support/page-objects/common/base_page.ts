import { Page, expect } from '@playwright/test'
import { ApiHelper } from './api_helper'

export class BasePage extends ApiHelper {
  protected page: Page

  constructor(page: Page, path: string) {
    super(path)
    this.page = page
  }

  async visit(params = '') {
    await this.page.goto(this.path + params)
  }

  async clearCache() {
    await this.page.context().clearCookies()
    await this.page.evaluate(() => localStorage.clear())
    await this.page.evaluate(() => sessionStorage.clear())
  }

  async click(selector: string) {
    await this.page.locator(selector).click()
  }

  async isVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  async checkUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  }
}
