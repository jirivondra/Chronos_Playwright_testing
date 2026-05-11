import { Page, Locator, expect } from '@playwright/test'
import { SiteBarMenu } from './common/site_bar_menu'
import { NewTaskPage } from './new_task_page'

export class DashboardPage extends SiteBarMenu {
  protected newTaskButton: Locator
  private readonly openList: Locator
  private readonly doneList: Locator
  private readonly openListTaskTitle: Locator
  private readonly doneListTaskTitle: Locator
  private readonly taskGroup: Locator
  private readonly checkboxInput = 'input[type="checkbox"]'

  constructor(page: Page) {
    super(page, '/dashboard.html')
    this.newTaskButton = page.locator('#new-task-btn')
    this.openList = page.locator('#open-list')
    this.doneList = page.locator('#done-list')
    this.openListTaskTitle = this.openList.locator('h4')
    this.doneListTaskTitle = this.doneList.locator('h4')
    this.taskGroup = page.locator('.group')
  }

  private taskInOpenSection(taskName: string): Locator {
    return this.openListTaskTitle.filter({ hasText: taskName })
  }

  private taskInFinishSection(taskName: string): Locator {
    return this.doneListTaskTitle.filter({ hasText: taskName })
  }

  private taskCheckbox(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).locator(this.checkboxInput)
  }

  async checkNewTaskButtonIsVisible(): Promise<this> {
    await this.actions.assertVisible(this.newTaskButton)
    return this
  }

  async toggleTask(taskName: string): Promise<this> {
    await this.actions.clickElement(this.taskCheckbox(taskName))
    return this
  }

  async checkTaskInOpenSection(taskName: string): Promise<this> {
    await this.actions.assertVisible(this.taskInOpenSection(taskName))
    return this
  }

  async checkTaskInFinishSection(taskName: string): Promise<this> {
    await this.actions.assertVisible(this.taskInFinishSection(taskName))
    return this
  }

  async clickButtonNewTask(): Promise<NewTaskPage> {
    await this.actions.clickElement(this.newTaskButton)
    return new NewTaskPage(this.page)
  }

  async checkNewTaskNavigationRequest(): Promise<this> {
    const requestPromise = this.page.waitForRequest(/edit-task/)
    await this.actions.clickElement(this.newTaskButton)
    const request = await requestPromise
    expect(request.url()).toContain('edit-task')
    expect(request.method()).toBe('GET')
    return this
  }
}
