import { Page, Locator, expect } from '@playwright/test'
import { AppBar } from './app_bar'

export class SiteBarMenu extends AppBar {
  protected openMenuButton: Locator
  protected buttonOpenAndCloseSiteMenu: Locator
  protected appVersionTitle: Locator
  protected appVersion: Locator
  protected appVersionTitleText: string

  private readonly logoImage: Locator
  private readonly logoTitle: Locator
  private readonly logoSubtitle: Locator
  private readonly logoTitleText: string
  private readonly logoSubtitleText: string

  private readonly navDashboardLabel: Locator
  private readonly navTasksLabel: Locator
  private readonly navCalendarLabel: Locator
  private readonly navArchiveLabel: Locator

  private readonly navDashboardIcon: Locator
  private readonly navTasksIcon: Locator
  private readonly navCalendarIcon: Locator
  private readonly navArchiveIcon: Locator

  constructor(page: Page, path: string) {
    super(page, path)
    this.openMenuButton = page.getByRole('button', { name: 'menu_open' })
    this.buttonOpenAndCloseSiteMenu = page.locator('#toggle-icon')
    this.appVersionTitle = page.locator('.sidebar-label.items-center')
    this.appVersionTitleText = 'App version'
    this.appVersion = page.getByText('App version')

    this.logoImage = page.locator('.sidebar-logo-link img')
    this.logoTitle = page.locator('.sidebar-logo-link h1')
    this.logoSubtitle = page.locator('.sidebar-logo-link p')
    this.logoTitleText = 'Chronos'
    this.logoSubtitleText = 'Personal Space'

    this.navDashboardLabel = page.locator('a[data-tip="Dashboard"] span.sidebar-label')
    this.navTasksLabel = page.locator('a[data-tip="Tasks"] span.sidebar-label')
    this.navCalendarLabel = page.locator('a[data-tip="Calendar"] span.sidebar-label')
    this.navArchiveLabel = page.locator('a[data-tip="Archive"] span.sidebar-label')

    this.navDashboardIcon = page.locator('a[data-tip="Dashboard"] span.material-symbols-outlined')
    this.navTasksIcon = page.locator('a[data-tip="Tasks"] span.material-symbols-outlined')
    this.navCalendarIcon = page.locator('a[data-tip="Calendar"] span.material-symbols-outlined')
    this.navArchiveIcon = page.locator('a[data-tip="Archive"] span.material-symbols-outlined')
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
    await this.buttonOpenAndCloseSiteMenu.click()
    await this.checkLogoCollapsedHidden()
    await this.checkVersionOfAppIsNotVisible()
    await this.checkNavCollapsedVisible()
    await this.buttonOpenAndCloseSiteMenu.click()
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
    await expect.soft(this.logoTitle).toBeVisible()
    await expect.soft(this.logoTitle).toHaveText(this.logoTitleText)
    await expect.soft(this.logoSubtitle).toBeVisible()
    await expect.soft(this.logoSubtitle).toHaveText(this.logoSubtitleText)
    return this
  }

  async checkLogoCollapsedHidden(): Promise<this> {
    await expect.soft(this.logoTitle).not.toBeVisible()
    await expect.soft(this.logoSubtitle).not.toBeVisible()
    return this
  }

  async checkNavExpandedVisible(): Promise<this> {
    await expect.soft(this.navDashboardIcon).toBeVisible()
    await expect.soft(this.navDashboardLabel).toBeVisible()
    await expect.soft(this.navTasksIcon).toBeVisible()
    await expect.soft(this.navTasksLabel).toBeVisible()
    await expect.soft(this.navCalendarIcon).toBeVisible()
    await expect.soft(this.navCalendarLabel).toBeVisible()
    await expect.soft(this.navArchiveIcon).toBeVisible()
    await expect.soft(this.navArchiveLabel).toBeVisible()
    return this
  }

  async checkNavCollapsedVisible(): Promise<this> {
    await expect.soft(this.navDashboardIcon).toBeVisible()
    await expect.soft(this.navDashboardLabel).not.toBeVisible()
    await expect.soft(this.navTasksIcon).toBeVisible()
    await expect.soft(this.navTasksLabel).not.toBeVisible()
    await expect.soft(this.navCalendarIcon).toBeVisible()
    await expect.soft(this.navCalendarLabel).not.toBeVisible()
    await expect.soft(this.navArchiveIcon).toBeVisible()
    await expect.soft(this.navArchiveLabel).not.toBeVisible()
    return this
  }
}
