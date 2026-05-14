import { Page, Locator } from '@playwright/test'
import { SiteBarMenu } from './site_bar_menu'

export class OpenTask extends SiteBarMenu {
  private readonly openList: Locator
  protected readonly taskGroup: Locator
  private readonly openListEmptyMessage: Locator
  private readonly openListEmptyMessageText: string
  private readonly expandOpenListButton: Locator
  private readonly editButtonSelector: string
  private readonly deleteButtonSelector: string
  private readonly todosEndpoint: string

  constructor(page: Page, path: string) {
    super(page, path)
    this.openList = page.locator('#open-list')
    this.taskGroup = page.locator('.group')
    this.openListEmptyMessageText = 'No open tasks. Create one with + New Task.'
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
    await this.actions.clickElement(this.expandOpenListButton)
    return this
  }

  async countOpenTasks(): Promise<number> {
    const response = await this.get(this.todosEndpoint)
    const todos = (await response.json()) as { completed: boolean }[]
    return todos.filter((t) => !t.completed).length
  }

  async checkExpandButtonVisible(): Promise<this> {
    await this.actions.assertVisible(this.expandOpenListButton)
    return this
  }

  async checkExpandButtonNotVisible(): Promise<this> {
    await this.actions.assertHidden(this.expandOpenListButton)
    return this
  }

  async checkEmptyOpenSection(): Promise<this> {
    await this.actions
      .assertVisible(this.openListEmptyMessage)
      .then((a) => a.assertText(this.openListEmptyMessage, this.openListEmptyMessageText))
    return this
  }

  async checkTaskInOpenSection(taskName: string): Promise<this> {
    await this.actions.assertVisible(this.taskInOpenSection(taskName))
    return this
  }

  async checkTaskHasEditAndDeleteButtons(taskName: string): Promise<this> {
    await this.actions
      .assertVisible(this.taskEditButton(taskName))
      .then((a) => a.assertVisible(this.taskDeleteButton(taskName)))
    return this
  }
}
