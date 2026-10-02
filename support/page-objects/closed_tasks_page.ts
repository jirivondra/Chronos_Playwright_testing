import { Page, Locator, expect } from '@playwright/test'
import { SiteBarMenu } from './common/site_bar_menu'
import { Pagination } from './common/pagination'

export class ClosedTasksPage extends SiteBarMenu {
  private readonly pagination: Pagination
  private readonly doneList: Locator
  private readonly taskGroup: Locator
  private readonly completedTaskClass: RegExp
  private readonly pageHeading: Locator

  constructor(page: Page) {
    super(page, '/finished-tasks.html')
    this.pagination = new Pagination(page)
    this.doneList = page.locator('#done-list')
    this.taskGroup = page.locator('.group')
    this.completedTaskClass = /line-through/
    // FIXME: finished-tasks.html renders two <h1> elements — the sidebar "Chronos" logo
    // and this page's own "Closed Tasks" heading. Only one <h1> per page is valid
    // semantic HTML; this should be fixed in the app (likely by demoting the logo to a
    // non-heading element or a lower heading level). Scoping to <main> works around it
    // until then — remove this override once the app only renders one <h1>.
    this.pageHeading = page.locator('main').getByRole('heading', { level: 1 })
  }

  async checkH1(text: string): Promise<this> {
    await expect.soft(this.pageHeading).toBeVisible()
    await expect.soft(this.pageHeading).toHaveCount(1)
    await expect.soft(this.pageHeading).toHaveText(text)
    return this
  }

  async checkItemCountOnPage(expected: number): Promise<this> {
    await expect(this.doneList.locator(this.taskGroup)).toHaveCount(expected)
    return this
  }

  async checkAllTasksMarkedComplete(): Promise<this> {
    const tasks = await this.doneList.locator(this.taskGroup).all()
    for (const task of tasks) {
      await expect.soft(task.getByRole('checkbox')).toBeChecked()
      await expect.soft(task.getByRole('heading')).toHaveClass(this.completedTaskClass)
    }
    return this
  }

  async isPaginationVisible(): Promise<boolean> {
    return this.pagination.isVisible()
  }

  async checkPaginationVisible(): Promise<this> {
    await this.pagination.checkVisible()
    return this
  }

  async checkPaginationNotVisible(): Promise<this> {
    await this.pagination.checkNotVisible()
    return this
  }

  async hasNextPage(): Promise<boolean> {
    return this.pagination.hasNextPage()
  }

  async hasPreviousPage(): Promise<boolean> {
    return this.pagination.hasPreviousPage()
  }

  async getTotalPages(): Promise<number> {
    return this.pagination.getTotalPages()
  }

  async getCurrentPage(): Promise<number> {
    return this.pagination.getCurrentPage()
  }

  async goToPage(pageNumber: number): Promise<this> {
    await this.pagination.goToPage(pageNumber)
    return this
  }

  async goToNextPage(): Promise<this> {
    await this.pagination.goToNextPage()
    return this
  }

  async goToPreviousPage(): Promise<this> {
    await this.pagination.goToPreviousPage()
    return this
  }

  async checkCurrentPage(pageNumber: number): Promise<this> {
    await this.pagination.checkCurrentPage(pageNumber)
    return this
  }
}
