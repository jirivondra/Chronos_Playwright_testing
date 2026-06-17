import { Page, Locator, expect } from '@playwright/test'
import { Header } from './header'

export class Footer extends Header {
  readonly footerHeading: Locator
  readonly contactIcons: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.footerHeading = this.page.locator('footer').getByText('Connect with me')
    this.contactIcons = this.page.locator('footer a[aria-label]')
  }

  contactIconByUrl(url: string): Locator {
    return this.contactIcons.and(this.page.locator(`[href="${url}"]`))
  }

  async checkHeadingVisible(): Promise<this> {
    await expect(this.footerHeading).toBeVisible()
    return this
  }

  async checkContactIconLink(url: string): Promise<this> {
    await expect(this.contactIconByUrl(url)).toBeVisible()
    return this
  }
}
