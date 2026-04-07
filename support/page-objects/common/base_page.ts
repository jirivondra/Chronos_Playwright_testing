import { Page } from '@playwright/test';
import { ApiHelper } from './api_helper';

export class BasePage extends ApiHelper {
  protected page: Page;

  constructor(page: Page, path: string) {
    super(path);
    this.page = page;
  }

  async visit(params = '') {
    await this.page.goto(this.path + params);
  }

  async clearCache() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => localStorage.clear());
    await this.page.evaluate(() => sessionStorage.clear());
  }
}