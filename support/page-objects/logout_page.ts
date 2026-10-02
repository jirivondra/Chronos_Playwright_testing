import { Page, Locator, expect } from '@playwright/test'
import { ToTopButton } from './common/to_top_button'
import { LoginPage } from './login_page'

export class LogoutPage extends ToTopButton {
  private readonly returnToLoginButton: Locator
  private readonly authStorageKey: string
  private readonly testAuthToken: string

  constructor(page: Page) {
    super(page, '/logout.html')
    this.returnToLoginButton = page.getByRole('link', { name: 'Return to Login' })
    this.authStorageKey = 'auth'
    this.testAuthToken = 'test-token'
  }

  async checkReturnToLoginVisible(): Promise<this> {
    await expect(this.returnToLoginButton).toBeVisible()
    return this
  }

  async simulateLoggedInSession(): Promise<this> {
    await this.page.context().addInitScript(
      ({ key, token }) => {
        sessionStorage.setItem(key, token)
      },
      { key: this.authStorageKey, token: this.testAuthToken }
    )
    await this.goto()
    return this
  }

  async checkSessionCleared(): Promise<this> {
    const authToken = await this.page.evaluate(
      (key) => sessionStorage.getItem(key),
      this.authStorageKey
    )
    expect(authToken).toBeNull()
    return this
  }

  async clickReturnToLogin(): Promise<LoginPage> {
    await this.returnToLoginButton.click()
    return new LoginPage(this.page)
  }
}
