import { Page, Locator } from '@playwright/test'
import { SiteBarMenu } from './common/site_bar_menu'
import { OpenTask } from './common/open_task'
import { Pagination } from './common/pagination'

export class OpenTasksPage extends SiteBarMenu {
  private readonly openTask: OpenTask
  private readonly pagination: Pagination
  readonly openListEmptyMessage: Locator
  readonly expandOpenListButton: Locator

  constructor(page: Page) {
    super(page, '/open-tasks.html')
    this.openTask = new OpenTask(page)
    this.pagination = new Pagination(page)
    this.openListEmptyMessage = this.openTask.openListEmptyMessage
    this.expandOpenListButton = this.openTask.expandOpenListButton
  }

  async clickExpandButton(): Promise<this> {
    await this.openTask.clickExpandButton()
    return this
  }

  async countOpenTasks(): Promise<number> {
    return this.openTask.countOpenTasks()
  }

  async checkExpandButtonVisible(): Promise<this> {
    await this.openTask.checkExpandButtonVisible()
    return this
  }

  async checkExpandButtonNotVisible(): Promise<this> {
    await this.openTask.checkExpandButtonNotVisible()
    return this
  }

  async checkEmptyOpenSection(): Promise<this> {
    await this.openTask.checkEmptyOpenSection()
    return this
  }

  async deleteTaskByTitle(title: string): Promise<void> {
    await this.openTask.deleteTaskByTitle(title)
  }

  async checkTaskInOpenSection(taskName: string): Promise<this> {
    await this.openTask.checkTaskInOpenSection(taskName)
    return this
  }

  async checkTaskHasEditAndDeleteButtons(taskName: string): Promise<this> {
    await this.openTask.checkTaskHasEditAndDeleteButtons(taskName)
    return this
  }

  async checkAllTasksInOpenSectionMarkedIncomplete(): Promise<this> {
    await this.openTask.checkAllTasksInOpenSectionMarkedIncomplete()
    return this
  }

  async checkItemCountOnPage(expected: number): Promise<this> {
    await this.openTask.checkItemCountOnPage(expected)
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
