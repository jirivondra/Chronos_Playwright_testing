import { Page } from '@playwright/test'
import { ApiHelper } from './api_helper'

export class BasePage extends ApiHelper {
  protected page: Page

  constructor(page: Page, path: string) {
    super(path)
    this.page = page
  }

  async visit(params = ''): Promise<this> {
    await this.page.goto(this.path + params)
    return this
  }

  async clearCache(): Promise<this> {
    await this.page.context().clearCookies()
    await this.page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    return this
  }

  async scrollToBottom(): Promise<this> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    return this
  }
}
