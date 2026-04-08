import { Page, Locator } from '@playwright/test'
import { Header } from './header'

export class Footer extends Header {
  private readonly heading: Locator
  readonly contactIcons: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.heading = this.page.locator('footer p:has-text("Connect with me")')
    this.contactIcons = this.page.locator('footer a[aria-label]')
  }

  async checkHeadingVisible() {
    await this.actions.assertVisible(this.heading)
  }

  async checkContactIconLink(url: string) {
    await this.actions.assertVisible(this.contactIcons.and(this.page.locator(`[href="${url}"]`)))
  }
}
