import { test as base } from '@playwright/test'
import { LoginPage } from '../page-objects/login_page'
import { DashboardPage } from '../page-objects/dashboard_page'
import { NewTaskPage } from '../page-objects/new_task_page'
import { LogoutPage } from '../page-objects/logout_page'
import { loginCredentials } from '../test-data/login_page_data'

export type AuthFixtures = {
  loginPage: LoginPage
  dashboardPage: DashboardPage
  newTaskPage: NewTaskPage
  logoutPage: LogoutPage
}

export const authFixtures = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)

    await loginPage.visit()
    await use(loginPage)

    await loginPage.clearCache()
  },
  dashboardPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.visit()
    await loginPage.fillUserName(loginCredentials.validUser.username)
    await loginPage.fillPassword(loginCredentials.validUser.password)
    await loginPage.clickSubmit()
    await page.waitForURL('**/dashboard.html')
    await use(dashboardPage)

    await dashboardPage.clearCache()
  },
  newTaskPage: async ({ dashboardPage }, use) => {
    const newTaskPage = await dashboardPage.clickButtonNewTask()

    await use(newTaskPage)

    await dashboardPage.deleteTaskByTitle(newTaskPage.taskName)
  },
  logoutPage: async ({ page }, use) => {
    const logoutPage = new LogoutPage(page)

    await logoutPage.visit()
    await use(logoutPage)

    await logoutPage.clearCache()
  },
})
