import { Page, Locator } from '@playwright/test'
import { ToTopButton } from './to_top_button'
import { LogoutPage } from '../logout_page'

export class AppBar extends ToTopButton {
  private readonly logoutButton: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.logoutButton = page.locator('//span[text()="logout"]')
  }

  async clickLogout(): Promise<LogoutPage> {
    await this.actions.clickElement(this.logoutButton)
    return new LogoutPage(this.page)
  }
}
