import { Page, Locator } from '@playwright/test'
import { AppBar } from './app_bar'

export class SiteBarMenu extends AppBar {
  protected openMenuButton: Locator
  protected buttonOpenAndClosseSiteMenu: Locator
  protected appVerstionTitle: Locator
  protected appVerstion: Locator
  protected appVerstionTitleText: string

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
    this.buttonOpenAndClosseSiteMenu = page.locator('#toggle-icon')
    this.appVerstionTitle = page.locator('.sidebar-label.items-center')
    this.appVerstionTitleText = 'App version'
    this.appVerstion = page.getByText('App version')

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
    await this.actions.assertVisible(this.openMenuButton)
    return this
  }

  async checkVisibilityForCloseMenu(): Promise<this> {
    await this.actions.assertHidden(this.openMenuButton)
    return this
  }

  async checkOpenAndClosseSiteMenu(): Promise<this> {
    await this.checkVisibilityForOpenMenu()
    await this.checkLogoExpandedVisible()
    await this.checkVersionOfAppIsVisible()
    await this.checkNavExpandedVisible()
    await this.actions.clickElement(this.buttonOpenAndClosseSiteMenu)
    await this.checkLogoCollapsedHidden()
    await this.checkVersionOfAppIsNotVisible()
    await this.checkNavCollapsedVisible()
    await this.actions.clickElement(this.buttonOpenAndClosseSiteMenu)
    return this
  }

  async checkVersionTitle(): Promise<this> {
    await this.actions
      .assertVisible(this.appVerstionTitle)
      .then((a) => a.assertText(this.appVerstionTitle, this.appVerstionTitleText))
    return this
  }

  async checkVersionOfAppIsVisible(): Promise<this> {
    await this.actions.assertVisible(this.appVerstion)
    return this
  }

  async checkVersionOfAppIsNotVisible(): Promise<this> {
    await this.actions.assertHidden(this.appVerstion)
    return this
  }

  async checkLogoImageVisible(): Promise<this> {
    await this.actions.assertVisible(this.logoImage)
    return this
  }

  async checkLogoExpandedVisible(): Promise<this> {
    await this.actions
      .assertVisible(this.logoTitle)
      .then((a) => a.assertText(this.logoTitle, this.logoTitleText))
      .then((a) => a.assertVisible(this.logoSubtitle))
      .then((a) => a.assertText(this.logoSubtitle, this.logoSubtitleText))
    return this
  }

  async checkLogoCollapsedHidden(): Promise<this> {
    await this.actions.assertHidden(this.logoTitle).then((a) => a.assertHidden(this.logoSubtitle))
    return this
  }

  async checkNavExpandedVisible(): Promise<this> {
    await this.actions
      .assertVisible(this.navDashboardIcon)
      .then((a) => a.assertVisible(this.navDashboardLabel))
      .then((a) => a.assertVisible(this.navTasksIcon))
      .then((a) => a.assertVisible(this.navTasksLabel))
      .then((a) => a.assertVisible(this.navCalendarIcon))
      .then((a) => a.assertVisible(this.navCalendarLabel))
      .then((a) => a.assertVisible(this.navArchiveIcon))
      .then((a) => a.assertVisible(this.navArchiveLabel))
    return this
  }

  async checkNavCollapsedVisible(): Promise<this> {
    await this.actions
      .assertVisible(this.navDashboardIcon)
      .then((a) => a.assertHidden(this.navDashboardLabel))
      .then((a) => a.assertVisible(this.navTasksIcon))
      .then((a) => a.assertHidden(this.navTasksLabel))
      .then((a) => a.assertVisible(this.navCalendarIcon))
      .then((a) => a.assertHidden(this.navCalendarLabel))
      .then((a) => a.assertVisible(this.navArchiveIcon))
      .then((a) => a.assertHidden(this.navArchiveLabel))
    return this
  }
}
