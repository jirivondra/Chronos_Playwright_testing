import { Page, Locator, expect } from '@playwright/test'
import { SiteBarMenu } from './site_bar_menu'
import { dashboardPageData } from '../../test-data/dashboard_page_data'

export class OpenTask extends SiteBarMenu {
  private readonly openList: Locator
  protected readonly taskGroup: Locator
  readonly openListEmptyMessage: Locator
  private readonly openListEmptyMessageText: string
  readonly expandOpenListButton: Locator
  private readonly editButtonSelector: string
  private readonly deleteButtonSelector: string
  private readonly todosEndpoint: string

  constructor(page: Page, path: string) {
    super(page, path)
    this.openList = page.locator('#open-list')
    this.taskGroup = page.locator('.group')
    this.openListEmptyMessageText = dashboardPageData.emptyMessage
    this.openListEmptyMessage = this.openList.getByText(this.openListEmptyMessageText)
    this.expandOpenListButton = this.openList.getByRole('button', { name: /Zobrazit všechny/ })
    this.editButtonSelector = '.edit-btn'
    this.deleteButtonSelector = '.delete-btn'
    this.todosEndpoint = '/todos'
  }

  protected taskInOpenSection(taskName: string): Locator {
    return this.openList.getByRole('heading', { name: taskName })
  }

  protected taskEditButton(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).locator(this.editButtonSelector)
  }

  protected taskDeleteButton(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).locator(this.deleteButtonSelector)
  }

  async clickExpandButton(): Promise<this> {
    await this.expandOpenListButton.click()
    return this
  }

  async countOpenTasks(): Promise<number> {
    const response = await this.get(this.todosEndpoint)
    const todos = (await response.json()) as { completed: boolean }[]
    return todos.filter((t) => !t.completed).length
  }

  async checkExpandButtonVisible(): Promise<this> {
    await expect(this.expandOpenListButton).toBeVisible()
    return this
  }

  async checkExpandButtonNotVisible(): Promise<this> {
    await expect(this.expandOpenListButton).not.toBeVisible()
    return this
  }

  async checkEmptyOpenSection(): Promise<this> {
    await expect.soft(this.openListEmptyMessage).toBeVisible()
    await expect.soft(this.openListEmptyMessage).toHaveText(this.openListEmptyMessageText)
    return this
  }

  async deleteTaskByTitle(title: string): Promise<void> {
    const response = await this.get(this.todosEndpoint)
    const todos = (await response.json()) as { id: number; title: string }[]
    const ids = todos.filter((t) => t.title === title).map((t) => t.id)
    await Promise.all(ids.map((id) => this.delete(`${this.todosEndpoint}/${id}`)))
  }

  async checkTaskInOpenSection(taskName: string): Promise<this> {
    await expect(this.taskInOpenSection(taskName)).toBeVisible()
    return this
  }

  async checkTaskHasEditAndDeleteButtons(taskName: string): Promise<this> {
    await expect.soft(this.taskEditButton(taskName)).toBeVisible()
    await expect.soft(this.taskDeleteButton(taskName)).toBeVisible()
    return this
  }
}
