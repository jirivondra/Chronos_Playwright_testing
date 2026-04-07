import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base_page';
import { loginPageData } from '../../../support/test-data/login_page_data';


export class Header extends BasePage {
  constructor(page: Page, path: string) {
    super(page, path);
  }

  protected get h1(): Locator {
    return this.page.getByRole('heading', { level: 1, name: loginPageData.h1 });
  }

  protected get h2(): Locator {
    return this.page.getByRole('heading', { level: 2, name: loginPageData.h2 });
  }

  async checkVisibility(element: string) {
    await expect(this.page.locator(element)).toBeVisible();
  }

  async checkNumberOfElement(element: string, number: number) {
    await expect(this.page.locator(element)).toHaveCount(number);
  }

  async checkTextOfElement(element: string, text: string) {
    await expect(this.page.locator(element)).toHaveText(text);
  }

  async checkH1(text: string) {
    await expect(this.h1).toBeVisible();
    await expect(this.h1).toHaveCount(1);
    await expect(this.h1).toHaveText(text);
  }

  async checkH2(text: string) {
    await expect(this.h2).toBeVisible();
    await expect(this.h2).toHaveText(text);
  }
}