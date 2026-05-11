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
  dashboardWithTask: { dashboardPage: DashboardPage; taskName: string }
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
    await use(dashboardPage)

    await dashboardPage.clearCache()
  },
  newTaskPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.visit()
    await loginPage.fillUserName(loginCredentials.validUser.username)
    await loginPage.fillPassword(loginCredentials.validUser.password)
    await loginPage.clickSubmit()
    const newTaskPage = await dashboardPage.clickButtonNewTask()
    await use(newTaskPage)

    await newTaskPage.clearCache()
  },
  logoutPage: async ({ page }, use) => {
    const logoutPage = new LogoutPage(page)

    await logoutPage.visit()
    await use(logoutPage)

    await logoutPage.clearCache()
  },
  dashboardWithTask: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.visit()
    await loginPage.fillUserName(loginCredentials.validUser.username)
    await loginPage.fillPassword(loginCredentials.validUser.password)
    await loginPage.clickSubmit()

    const newTaskPage = await dashboardPage.clickButtonNewTask()
    await newTaskPage.fillTaskTitle()
    const taskName = newTaskPage.taskName
    await newTaskPage.clickCreateTaskButton()

    await use({ dashboardPage, taskName })

    await dashboardPage.clearCache()
  },
})
