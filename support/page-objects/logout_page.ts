import { Page, Locator } from '@playwright/test'
import { ToTopButton } from './common/to_top_button'

export class LogoutPage extends ToTopButton {
  private readonly returnToLoginButton: Locator

  constructor(page: Page) {
    super(page, '/logout.html')
    this.returnToLoginButton = page.getByRole('link', { name: 'Return to Login' })
  }

  async checkReturnToLoginVisible(): Promise<this> {
    await this.actions.assertVisible(this.returnToLoginButton)
    return this
  }

  async clickReturnToLogin(url: string): Promise<this> {
    await this.actions.clickElement(this.returnToLoginButton)
    await this.checkUrl(url)
    return this
  }
}
