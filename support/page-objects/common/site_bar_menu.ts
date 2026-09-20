import { Page, Locator, expect } from '@playwright/test'
import { AppBar } from './app_bar'

export class SiteBarMenu extends AppBar {
  protected openMenuButton: Locator
  protected appVersionTitle: Locator
  protected appVersion: Locator
  protected appVersionTitleText: string

  private readonly logoImage: Locator
  private readonly logoSubtitle: Locator
  private readonly logoTitleText: string
  private readonly logoSubtitleText: string

  private readonly navDashboardLink: Locator
  private readonly navOpenTasksLink: Locator
  private readonly navClosedTasksLink: Locator
  private readonly navCalendarLink: Locator

  private readonly navDashboardLabel: Locator
  private readonly navOpenTasksLabel: Locator
  private readonly navClosedTasksLabel: Locator
  private readonly navCalendarLabel: Locator

  private readonly navDashboardIcon: Locator
  private readonly navOpenTasksIcon: Locator
  private readonly navClosedTasksIcon: Locator
  private readonly navCalendarIcon: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.openMenuButton = page.getByRole('button', { name: 'menu_open' })
    this.appVersionTitleText = 'App version'
    this.appVersionTitle = page.getByText(this.appVersionTitleText, { exact: true })
    this.appVersion = page.getByText('App version')

    this.logoImage = page.getByRole('img', { name: 'Chronos' })
    this.logoSubtitle = page.getByText('Personal Space')
    this.logoTitleText = 'Chronos'
    this.logoSubtitleText = 'Personal Space'

    this.navDashboardLink = page.getByRole('link', { name: 'Dashboard' })
    this.navOpenTasksLink = page.getByRole('link', { name: 'Open Tasks' })
    this.navClosedTasksLink = page.getByRole('link', { name: 'Closed Tasks' })
    this.navCalendarLink = page.getByRole('link', { name: 'Calendar' })

    this.navDashboardLabel = this.navDashboardLink.getByText('Dashboard', { exact: true })
    this.navOpenTasksLabel = this.navOpenTasksLink.getByText('Open Tasks', { exact: true })
    this.navClosedTasksLabel = this.navClosedTasksLink.getByText('Closed Tasks', { exact: true })
    this.navCalendarLabel = this.navCalendarLink.getByText('Calendar', { exact: true })

    this.navDashboardIcon = this.navDashboardLink.locator('span.material-symbols-outlined')
    this.navOpenTasksIcon = this.navOpenTasksLink.locator('span.material-symbols-outlined')
    this.navClosedTasksIcon = this.navClosedTasksLink.locator('span.material-symbols-outlined')
    this.navCalendarIcon = this.navCalendarLink.locator('span.material-symbols-outlined')
  }

  async checkMenuExpandedOnLoad(): Promise<this> {
    await this.checkVisibilityForOpenMenu()
    await this.checkLogoExpandedVisible()
    await this.checkNavExpandedVisible()
    return this
  }

  async checkVisibilityForOpenMenu(): Promise<this> {
    await expect(this.openMenuButton).toBeVisible()
    return this
  }

  async checkVisibilityForCloseMenu(): Promise<this> {
    await expect(this.openMenuButton).not.toBeVisible()
    return this
  }

  async checkOpenAndCloseSiteMenu(): Promise<this> {
    await this.checkVisibilityForOpenMenu()
    await this.checkLogoExpandedVisible()
    await this.checkVersionOfAppIsVisible()
    await this.checkNavExpandedVisible()
    await this.openMenuButton.click()
    await this.checkLogoCollapsedHidden()
    await this.checkVersionOfAppIsNotVisible()
    await this.checkNavCollapsedVisible()
    await this.openMenuButton.click()
    return this
  }

  async checkVersionTitle(): Promise<this> {
    await expect.soft(this.appVersionTitle).toBeVisible()
    await expect.soft(this.appVersionTitle).toHaveText(this.appVersionTitleText)
    return this
  }

  async checkVersionOfAppIsVisible(): Promise<this> {
    await expect(this.appVersion).toBeVisible()
    return this
  }

  async checkVersionOfAppIsNotVisible(): Promise<this> {
    await expect(this.appVersion).not.toBeVisible()
    return this
  }

  async checkLogoImageVisible(): Promise<this> {
    await expect(this.logoImage).toBeVisible()
    return this
  }

  async checkLogoExpandedVisible(): Promise<this> {
    await expect.soft(this.h1).toBeVisible()
    await expect.soft(this.h1).toHaveText(this.logoTitleText)
    await expect.soft(this.logoSubtitle).toBeVisible()
    await expect.soft(this.logoSubtitle).toHaveText(this.logoSubtitleText)
    return this
  }

  async checkLogoCollapsedHidden(): Promise<this> {
    await expect.soft(this.h1).not.toBeVisible()
    await expect.soft(this.logoSubtitle).not.toBeVisible()
    return this
  }

  async checkNavExpandedVisible(): Promise<this> {
    await expect.soft(this.navDashboardIcon).toBeVisible()
    await expect.soft(this.navDashboardLabel).toBeVisible()
    await expect.soft(this.navOpenTasksIcon).toBeVisible()
    await expect.soft(this.navOpenTasksLabel).toBeVisible()
    await expect.soft(this.navClosedTasksIcon).toBeVisible()
    await expect.soft(this.navClosedTasksLabel).toBeVisible()
    await expect.soft(this.navCalendarIcon).toBeVisible()
    await expect.soft(this.navCalendarLabel).toBeVisible()
    return this
  }

  async checkNavCollapsedVisible(): Promise<this> {
    await expect.soft(this.navDashboardIcon).toBeVisible()
    await expect.soft(this.navDashboardLabel).not.toBeVisible()
    await expect.soft(this.navOpenTasksIcon).toBeVisible()
    await expect.soft(this.navOpenTasksLabel).not.toBeVisible()
    await expect.soft(this.navClosedTasksIcon).toBeVisible()
    await expect.soft(this.navClosedTasksLabel).not.toBeVisible()
    await expect.soft(this.navCalendarIcon).toBeVisible()
    await expect.soft(this.navCalendarLabel).not.toBeVisible()
    return this
  }
}
