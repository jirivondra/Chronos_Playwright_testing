import { Page, Locator, expect } from '@playwright/test'
import { ToTopButton } from './common/to_top_button'
import { DashboardPage } from './dashboard_page'

export class LoginPage extends ToTopButton {
  readonly signInButton: Locator
  readonly createAccountLink: Locator
  readonly forgetAccessLink: Locator
  private readonly userName: Locator
  private readonly passwordInput: Locator
  private readonly passwordToggle: Locator
  private readonly passwordHiddenType: string
  private readonly passwordVisibleType: string

  constructor(page: Page) {
    super(page, '/login.html')
    this.userName = this.page.getByLabel('Username')
    this.passwordInput = this.page.getByLabel('Password')
    this.signInButton = this.page.getByRole('button', { name: 'Sign In' })
    this.createAccountLink = this.page.getByRole('link', { name: 'Create Account' })
    this.forgetAccessLink = this.page.getByRole('link', { name: 'Forgot Access?' })
    this.passwordToggle = this.page.getByRole('button', { name: 'visibility' })
    this.passwordHiddenType = 'password'
    this.passwordVisibleType = 'text'
  }

  async fillUserName(userName: string): Promise<this> {
    await this.userName.fill(userName)
    return this
  }

  async fillPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password)
    return this
  }

  async checkSignInButtonVisible(): Promise<this> {
    await expect(this.signInButton).toBeVisible()
    return this
  }

  async checkCreateAccountVisible(): Promise<this> {
    await expect(this.createAccountLink).toBeVisible()
    return this
  }

  async checkForgotAccessVisible(): Promise<this> {
    await expect(this.forgetAccessLink).toBeVisible()
    return this
  }

  async checkPasswordIsHidden(): Promise<this> {
    await expect(this.passwordInput).toHaveAttribute('type', this.passwordHiddenType)
    return this
  }

  async checkPasswordIsVisible(): Promise<this> {
    await expect(this.passwordInput).toHaveAttribute('type', this.passwordVisibleType)
    return this
  }

  async clickPasswordToggle(): Promise<this> {
    await this.passwordToggle.click()
    return this
  }

  async clickSubmit(): Promise<this> {
    await this.signInButton.click()
    return this
  }

  async login(userName: string, password: string): Promise<DashboardPage> {
    await this.fillUserName(userName)
    await this.fillPassword(password)
    await this.clickSubmit()
    return new DashboardPage(this.page)
  }
}
