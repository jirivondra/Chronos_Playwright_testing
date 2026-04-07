import { Page } from '@playwright/test';
import { BasePage } from './common/base_page';
import { expect } from '@playwright/test';
import { Header } from './common/header';

export class LoginPage extends Header {
  protected userName: string;
  protected password: string;
  protected submitButton: string;

  constructor(page: Page) {
    super(page, '/login.html');
    this.userName = '#username';
    this.password = '#password';
    this.submitButton = 'button[type="submit"]';
  }

  async fillUserName(userName: string) {
    await this.page.locator(this.userName).fill(userName);
  }

  async fillPassword(password: string) {
    await this.page.locator(this.password).fill(password);
  }

  async clickSubmit() {
    await this.page.locator(this.submitButton).click();
  }

  async isVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }
  
  async checkUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  async login(userName: string, password: string, url: string) {
    await this.fillUserName(userName);
    await this.fillPassword(password);
    await this.clickSubmit();
    await this.checkUrl(url);
  }
}