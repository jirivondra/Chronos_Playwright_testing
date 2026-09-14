import { Page, Locator, expect } from '@playwright/test'
import { Header } from './header'

export class Footer extends Header {
  protected readonly footer: Locator
  readonly footerHeading: Locator
  readonly contactIcons: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.footer = this.page.locator('footer')
    this.footerHeading = this.footer.getByText('Connect with me')
    this.contactIcons = this.contactIconByLabel('GitHub')
      .or(this.contactIconByLabel('Email'))
      .or(this.contactIconByLabel('LinkedIn'))
  }

  contactIconByLabel(label: string): Locator {
    return this.footer.getByRole('link', { name: label, exact: true })
  }

  async checkHeadingVisible(): Promise<this> {
    await expect(this.footerHeading).toBeVisible()
    return this
  }

  async checkContactIconLink(label: string): Promise<this> {
    await expect(this.contactIconByLabel(label)).toBeVisible()
    return this
  }
}
