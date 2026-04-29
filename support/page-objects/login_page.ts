import { Page, Locator } from '@playwright/test'
import { ToTopButton } from './common/to_top_button'

export class LoginPage extends ToTopButton {
  protected userName: string
  protected password: string
  protected submitButton: string
  private readonly signInButton: Locator
  private readonly createAccountLink: Locator
  private readonly forgetAccessLink: Locator
  private readonly passwordInput: Locator
  private readonly passwordToggle: Locator
  private readonly passwordHiddenType: string
  private readonly passwordVisibleType: string

  constructor(page: Page) {
    super(page, '/login.html')
    this.userName = '#username'
    this.password = '#password'
    this.submitButton = 'button[type="submit"]'
    this.signInButton = this.page.locator(this.submitButton)
    this.createAccountLink = this.page.locator('a:has-text("Create Account")')
    this.forgetAccessLink = this.page.locator('a:has-text("Forgot Access?")')
    this.passwordInput = this.page.locator(this.password)
    this.passwordToggle = this.page.locator('#toggle-password')
    this.passwordHiddenType = 'password'
    this.passwordVisibleType = 'text'
  }

  async fillUserName(userName: string): Promise<this> {
    await this.page.locator(this.userName).fill(userName)
    return this
  }

  async fillPassword(password: string): Promise<this> {
    await this.page.locator(this.password).fill(password)
    return this
  }

  async checkSignInButtonVisible() {
    await this.actions.assertVisible(this.signInButton)
  }

  async checkCreateAccountVisible() {
    await this.actions.assertVisible(this.createAccountLink)
  }

  async checkForgotAccessVisible() {
    await this.actions.assertVisible(this.forgetAccessLink)
  }

  async checkPasswordIsHidden() {
    await this.actions.assertAttribute(this.passwordInput, 'type', this.passwordHiddenType)
  }

  async checkPasswordIsVisible() {
    await this.actions.assertAttribute(this.passwordInput, 'type', this.passwordVisibleType)
  }

  async clickPasswordToggle() {
    await this.actions.clickElement(this.passwordToggle)
  }

  async clickSubmit(): Promise<this> {
    await this.click(this.submitButton)
    return this
  }

  async login(userName: string, password: string, url: string) {
    await this.fillUserName(userName)
    await this.fillPassword(password)
    await this.clickSubmit()
    await this.checkUrl(url)
  }
}
