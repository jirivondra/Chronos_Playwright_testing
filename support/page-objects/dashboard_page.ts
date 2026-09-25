import { Page, Locator, expect } from '@playwright/test'
import dayjs from 'dayjs'
import { OpenTask } from './common/open_task'
import type { NewTaskPage } from './new_task_page'
import { dashboardPageData } from '../test-data/dashboard_page_data'

export class DashboardPage extends OpenTask {
  readonly newTaskButton: Locator
  private readonly doneList: Locator
  private readonly doneListTaskTitle: Locator
  readonly pulseHeading: Locator
  private readonly pulseSubtitle: Locator
  private readonly pulsePercentage: Locator
  private readonly pulseCount: Locator
  readonly upcomingHeading: Locator
  private readonly upcomingList: Locator
  private readonly upcomingEmptyMessage: Locator
  private readonly dashboardTodosEndpoint: string
  private readonly pulseCountSuffix: string
  private readonly upcomingLabelToday: string
  private readonly upcomingLabelTomorrow: string
  private readonly calendarMonthLabel: Locator
  private readonly calendarCurrentMonthDays: Locator
  private readonly calendarTodayCell: Locator
  private readonly calcDisplay: Locator
  private readonly calcHistory: Locator
  private readonly calcError: Locator
  private readonly calcErrorMessage: Locator
  private readonly calcButton: Locator
  private readonly calcClearButton: Locator
  private readonly calcBackspaceButton: Locator

  constructor(page: Page) {
    super(page, '/dashboard.html')
    this.newTaskButton = page.getByRole('button', { name: 'New Task' })
    this.doneList = page.locator('#done-list')
    this.doneListTaskTitle = this.doneList.getByRole('heading', { level: 4 })
    this.pulseHeading = page.getByRole('heading', { name: "Today's Pulse" })
    this.pulseSubtitle = page.getByText(dashboardPageData.pulseSubtitle)
    this.pulsePercentage = page.locator('#pulse-pct')
    this.pulseCount = page.locator('#pulse-count')
    this.pulseCountSuffix = dashboardPageData.pulseCountSuffix
    this.upcomingHeading = page.getByRole('heading', { name: 'Upcoming' })
    this.upcomingList = page.locator('#upcoming-list')
    this.upcomingEmptyMessage = this.upcomingList.getByText(dashboardPageData.upcomingEmptyMessage)
    this.upcomingLabelToday = dashboardPageData.upcomingLabelToday
    this.upcomingLabelTomorrow = dashboardPageData.upcomingLabelTomorrow
    this.dashboardTodosEndpoint = '/todos'
    const calendarDaysContainer = page.locator('#cal-days')
    this.calendarMonthLabel = page.locator('#cal-month-label')
    this.calendarCurrentMonthDays = calendarDaysContainer.locator(
      'div.text-on-surface, div.bg-primary'
    )
    this.calendarTodayCell = calendarDaysContainer.locator('div.bg-primary')
    this.calcDisplay = page.locator('#w-display')
    this.calcHistory = page.locator('#w-history')
    this.calcError = page.locator('#w-error')
    this.calcErrorMessage = page.locator('#w-error-msg')
    this.calcButton = page.locator('#w-calc-btn')
    this.calcClearButton = page.locator('[data-action="clear"]')
    this.calcBackspaceButton = page.locator('[data-action="backspace"]')
  }

  private taskInFinishSection(taskName: string): Locator {
    return this.doneListTaskTitle.filter({ hasText: taskName })
  }

  private taskCheckbox(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).getByRole('checkbox')
  }

  private taskTitle(taskName: string): Locator {
    return this.taskGroup.filter({ hasText: taskName }).getByRole('heading')
  }

  private upcomingItem(taskName: string): Locator {
    return this.upcomingList.getByRole('button').filter({ hasText: taskName })
  }

  private calcDigitButton(digit: string): Locator {
    return this.page.getByRole('button', { name: digit, exact: true })
  }

  private calcOperatorButton(op: 'Add' | 'Subtract' | 'Multiply' | 'Divide'): Locator {
    return this.page.locator(`[data-wop="${op}"]`)
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

  async checkTaskMarkedComplete(taskName: string): Promise<this> {
    await expect.soft(this.taskCheckbox(taskName)).toBeChecked()
    await expect.soft(this.taskTitle(taskName)).toHaveClass(/line-through/)
    return this
  }

  async checkTaskMarkedIncomplete(taskName: string): Promise<this> {
    await expect.soft(this.taskCheckbox(taskName)).not.toBeChecked()
    await expect.soft(this.taskTitle(taskName)).not.toHaveClass(/line-through/)
    return this
  }

  async checkAllTasksInFinishSectionMarkedComplete(): Promise<this> {
    const tasks = await this.doneList.locator(this.taskGroup).all()
    for (const task of tasks) {
      await expect.soft(task.getByRole('checkbox')).toBeChecked()
      await expect.soft(task.getByRole('heading')).toHaveClass(/line-through/)
    }
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

  async checkPulseTextsVisible(): Promise<this> {
    await expect.soft(this.pulseHeading).toBeVisible()
    await expect.soft(this.pulseSubtitle).toBeVisible()
    return this
  }

  async checkPulseStats(): Promise<this> {
    await this.visit()
    const response = await this.get(this.dashboardTodosEndpoint)
    const todos = (await response.json()) as { completed: boolean }[]
    const total = todos.length
    const doneCount = todos.filter((t) => t.completed).length
    const pct = total ? Math.round((doneCount / total) * 100) : 0
    await expect.soft(this.pulsePercentage).toHaveText(`${pct}%`)
    await expect.soft(this.pulseCount).toHaveText(`${doneCount}/${total} ${this.pulseCountSuffix}`)
    return this
  }

  async checkUpcomingHeadingVisible(): Promise<this> {
    await expect(this.upcomingHeading).toBeVisible()
    return this
  }

  async countUpcomingTasks(): Promise<number> {
    const response = await this.get(this.dashboardTodosEndpoint)
    const todos = (await response.json()) as { completed: boolean; due_date?: string }[]
    const today = dayjs().format('YYYY-MM-DD')
    const weekAhead = dayjs().add(7, 'day').format('YYYY-MM-DD')
    return todos.filter(
      (t) => !t.completed && t.due_date && t.due_date >= today && t.due_date <= weekAhead
    ).length
  }

  async checkUpcomingEmpty(): Promise<this> {
    await expect.soft(this.upcomingEmptyMessage).toBeVisible()
    await expect.soft(this.upcomingEmptyMessage).toHaveText(dashboardPageData.upcomingEmptyMessage)
    return this
  }

  async checkUpcomingEmptyMessageNotShown(): Promise<this> {
    await expect(this.upcomingEmptyMessage).not.toBeVisible()
    return this
  }

  async createTaskWithDueDate(title: string, dueDate: string, completed = false): Promise<this> {
    await this.post(this.dashboardTodosEndpoint, { title, due_date: dueDate, completed })
    await this.visit()
    return this
  }

  private async checkUpcomingItemLabel(taskName: string, label: string): Promise<this> {
    const item = this.upcomingItem(taskName)
    await expect.soft(item).toBeVisible()
    await expect.soft(item).toContainText(label)
    return this
  }

  async checkTaskDueToday(taskName: string): Promise<this> {
    return this.checkUpcomingItemLabel(taskName, this.upcomingLabelToday)
  }

  async checkTaskDueTomorrow(taskName: string): Promise<this> {
    return this.checkUpcomingItemLabel(taskName, this.upcomingLabelTomorrow)
  }

  async checkTaskNotInUpcoming(taskName: string): Promise<this> {
    await expect(this.upcomingItem(taskName)).toHaveCount(0)
    return this
  }

  async checkUpcomingTaskNavigation(taskName: string): Promise<this> {
    await this.upcomingItem(taskName).click()
    await this.page.waitForURL(/task-detail\.html\?id=\d+&from=dashboard/)
    return this
  }

  async checkCalendarMonthLabel(): Promise<this> {
    await expect(this.calendarMonthLabel).toHaveText(dayjs().format('MMMM YYYY'))
    return this
  }

  async checkCalendarDaysForCurrentMonth(): Promise<this> {
    const daysInMonth = dayjs().daysInMonth()
    await expect(this.calendarCurrentMonthDays).toHaveCount(daysInMonth)
    await expect.soft(this.calendarCurrentMonthDays.first()).toHaveText('1')
    await expect.soft(this.calendarCurrentMonthDays.last()).toHaveText(`${daysInMonth}`)
    return this
  }

  async checkCalendarTodayHighlighted(): Promise<this> {
    await expect(this.calendarTodayCell).toHaveCount(1)
    await expect(this.calendarTodayCell).toHaveText(dayjs().format('D'))
    return this
  }

  async enterCalculatorNumber(value: string): Promise<this> {
    for (const digit of value) {
      await this.calcDigitButton(digit).click()
    }
    return this
  }

  private async selectCalculatorOperator(
    op: 'Add' | 'Subtract' | 'Multiply' | 'Divide'
  ): Promise<this> {
    await this.calcOperatorButton(op).click()
    return this
  }

  async selectCalculatorAdd(): Promise<this> {
    return this.selectCalculatorOperator('Add')
  }

  async selectCalculatorSubtract(): Promise<this> {
    return this.selectCalculatorOperator('Subtract')
  }

  async selectCalculatorMultiply(): Promise<this> {
    return this.selectCalculatorOperator('Multiply')
  }

  async selectCalculatorDivide(): Promise<this> {
    return this.selectCalculatorOperator('Divide')
  }

  async clickCalculate(): Promise<this> {
    await this.calcButton.click()
    return this
  }

  async clickCalculatorClear(): Promise<this> {
    await this.calcClearButton.click()
    return this
  }

  async clickCalculatorBackspace(): Promise<this> {
    await this.calcBackspaceButton.click()
    return this
  }

  async checkCalculatorDisplay(expected: string): Promise<this> {
    await expect(this.calcDisplay).toHaveText(expected)
    return this
  }

  async checkCalculatorHistory(expected: string): Promise<this> {
    await expect(this.calcHistory).toHaveText(expected)
    return this
  }

  async checkCalculatorErrorMessage(expected: string): Promise<this> {
    await expect.soft(this.calcError).toBeVisible()
    await expect.soft(this.calcErrorMessage).toHaveText(expected)
    return this
  }

  async checkCalculatorErrorHidden(): Promise<this> {
    await expect(this.calcError).not.toBeVisible()
    return this
  }
}
