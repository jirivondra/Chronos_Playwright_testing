import { Page, Locator, expect } from '@playwright/test'
import { OpenTask } from './common/open_task'
import type { NewTaskPage } from './new_task_page'

export class DashboardPage extends OpenTask {
  readonly newTaskButton: Locator
  private readonly doneList: Locator
  private readonly doneListTaskTitle: Locator
  private readonly checkboxInput = 'input[type="checkbox"]'

  constructor(page: Page) {
    super(page, '/dashboard.html')
    this.newTaskButton = page.locator('#new-task-btn')
    this.doneList = page.locator('#done-list')
    this.doneListTaskTitle = this.doneList.locator('h4')
  }

  private taskInFinishSection(taskName: string): Locator {
    return this.doneListTaskTitle.filter({ hasText: taskName })
  }

  private taskCheckbox(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).locator(this.checkboxInput)
  }

  async checkNewTaskButtonIsVisible(): Promise<this> {
    await expect(this.newTaskButton).toBeVisible()
    return this
  }

  async toggleTask(taskName: string): Promise<this> {
    const response = this.page.waitForResponse((res) => res.url().includes('/todos') && res.ok())
    await this.taskCheckbox(taskName).click()
    await response
    return this
  }

  async checkTaskInFinishSection(taskName: string): Promise<this> {
    await expect(this.taskInFinishSection(taskName)).toBeVisible()
    return this
  }

  async clickButtonNewTask(): Promise<NewTaskPage> {
    const { NewTaskPage: NewTaskPageCtor } = await import('./new_task_page')
    await this.newTaskButton.click()
    return new NewTaskPageCtor(this.page)
  }

  async checkNewTaskNavigationRequest(): Promise<this> {
    const requestPromise = this.page.waitForRequest(/edit-task/)
    await this.newTaskButton.click()
    const request = await requestPromise
    expect.soft(request.url()).toContain('edit-task')
    expect.soft(request.method()).toBe('GET')
    return this
  }
}
