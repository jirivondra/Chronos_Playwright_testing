import { Page, Locator, expect } from '@playwright/test'
import { SiteBarMenu } from './common/site_bar_menu'
import { DashboardPage } from './dashboard_page'
import dayjs from 'dayjs'

export class NewTaskPage extends SiteBarMenu {
  private readonly taskNameInput: Locator
  readonly taskName: string
  private createTaskButton: Locator

  constructor(page: Page) {
    super(page, '/edit-task.html?from=dashboard')
    this.taskNameInput = page.getByLabel('Task Title')
    this.taskName = `Test - ${dayjs().format('DD.MM.YYYY - HH:mm:ss.SSS')}`
    this.createTaskButton = page.getByRole('button', { name: 'Create Task' })
  }

  async fillTaskTitle(): Promise<this> {
    await this.actions.fillText(this.taskNameInput, this.taskName)
    return this
  }

  async checkCreateTaskButtonBehave(): Promise<this> {
    await this.actions.assertDisabled(this.createTaskButton)
    await this.fillTaskTitle()
    await this.actions.assertEnabled(this.createTaskButton)
    return this
  }

  async clickCreateTaskButton(): Promise<DashboardPage> {
    await this.actions.clickElement(this.createTaskButton)
    await this.page.waitForURL('**/dashboard.html')
    await this.page.waitForLoadState('networkidle')
    return new DashboardPage(this.page)
  }

  async checkCreateTaskPostRequest(): Promise<this> {
    const requestPromise = this.page.waitForRequest(/api\/tasks/)
    await this.actions.clickElement(this.createTaskButton)
    const request = await requestPromise
    expect(request.method()).toBe('POST')
    return this
  }
}
