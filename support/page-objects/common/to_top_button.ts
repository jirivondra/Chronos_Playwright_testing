import { Page, Locator, expect } from '@playwright/test';
import { Footer } from './footer';

export class ToTopButton extends Footer {
  private readonly toTopButton: Locator;

  constructor(page: Page, path: string) {
    super(page, path);
    this.toTopButton = this.page.locator('#back-to-top');
  }

  async checkToTopButtonVisible() {
    await this.actions.assertVisible(this.toTopButton);
    await expect(this.toTopButton).toHaveCSS('opacity', '1');
  }

  async checkToTopButtonNotVisible() {
    await expect(this.toTopButton).toHaveCSS('opacity', '0');
  }

  async clickToTopButton() {
    await this.actions.clickElement(this.toTopButton);
  }
}
