import { Page } from '@playwright/test'
import { ApiHelper } from './api_helper'
import { CustomActions } from '../../../helper/custom_action'

export class BasePage extends ApiHelper {
  protected page: Page
  protected actions: CustomActions

  constructor(page: Page, path: string) {
    super(path)
    this.page = page
    this.actions = new CustomActions()
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

  async click(selector: string): Promise<this> {
    await this.page.locator(selector).click()
    return this
  }

  async checkUrl(url: string): Promise<this> {
    await this.actions.assertUrl(this.page, url)
    return this
  }

  async scrollToBottom(): Promise<this> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    return this
  }
}
