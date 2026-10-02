import { Page, Locator } from '@playwright/test'
import { ToTopButton } from './to_top_button'
import { LogoutPage } from '../logout_page'

export class AppBar extends ToTopButton {
  private readonly logoutButton: Locator
  private readonly logoutUrlPattern: string

  constructor(page: Page, path: string) {
    super(page, path)
    this.logoutButton = page.getByRole('link', { name: 'logout' })
    this.logoutUrlPattern = '**/logout.html'
  }

  async clickLogout(): Promise<LogoutPage> {
    await this.logoutButton.click()
    await this.page.waitForURL(this.logoutUrlPattern)
    return new LogoutPage(this.page)
  }
}
