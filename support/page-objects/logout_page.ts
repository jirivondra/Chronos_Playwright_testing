import { Page, Locator, expect } from '@playwright/test'
import { ToTopButton } from './common/to_top_button'
import { LoginPage } from './login_page'

export class LogoutPage extends ToTopButton {
  private readonly returnToLoginButton: Locator

  constructor(page: Page) {
    super(page, '/logout.html')
    this.returnToLoginButton = page.getByRole('link', { name: 'Return to Login' })
  }

  async checkReturnToLoginVisible(): Promise<this> {
    await expect(this.returnToLoginButton).toBeVisible()
    return this
  }

  async clickReturnToLogin(): Promise<LoginPage> {
    await this.returnToLoginButton.click()
    return new LoginPage(this.page)
  }
}
