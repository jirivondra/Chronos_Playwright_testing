import { Page, Locator, expect } from '@playwright/test'
import { SiteBarMenu } from './common/site_bar_menu'
import type { DashboardPage } from './dashboard_page'
import dayjs from 'dayjs'

export class NewTaskPage extends SiteBarMenu {
  private readonly taskNameInput: Locator
  readonly taskName: string
  readonly createTaskButton: Locator

  constructor(page: Page) {
    super(page, '/edit-task.html?from=dashboard')
    this.taskNameInput = page.getByLabel('Task Title')
    this.taskName = `Test - ${dayjs().format('DD.MM.YYYY - HH:mm:ss.SSS')}`
    this.createTaskButton = page.getByRole('button', { name: 'Create Task' })
  }

  async fillTaskTitle(): Promise<this> {
    await this.taskNameInput.fill(this.taskName)
    return this
  }

  async checkCreateTaskButtonBehave(): Promise<this> {
    await expect.soft(this.createTaskButton).toBeDisabled()
    await this.fillTaskTitle()
    await expect.soft(this.createTaskButton).toBeEnabled()
    return this
  }

  async clickCreateTaskButton(): Promise<DashboardPage> {
    const { DashboardPage: DashboardPageCtor } = await import('./dashboard_page')
    await this.createTaskButton.click()
    await this.page.waitForURL('**/dashboard.html')
    return new DashboardPageCtor(this.page)
  }

  async checkCreateTaskPostRequest(): Promise<this> {
    const requestPromise = this.page.waitForRequest(/api\/tasks/)
    await this.createTaskButton.click()
    const request = await requestPromise
    expect(request.method()).toBe('POST')
    return this
  }
}
