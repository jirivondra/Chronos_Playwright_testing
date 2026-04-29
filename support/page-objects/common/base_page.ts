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

  async checkUrl(url: string) {
    await this.actions.assertUrl(this.page, url)
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  }
}
