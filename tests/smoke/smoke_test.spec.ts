import { test } from '../../support/fixture'

test.use({ storageState: { cookies: [], origins: [] } })
import { loginPageData, loginCredentials } from '../../support/test-data/login_page_data'

test.describe('Smoke Test', () => {
  test.describe('E2E Test For Full Application Flow', () => {
    test('Full Application Flow', async ({ loginPage }) => {
      const dashboardPage = await test.step('Login', async () => {
        return loginPage.login(
          loginCredentials.validUser.username,
          loginCredentials.validUser.password
        )
      })

      await test.step('Verify dashboard', async () => {
        await dashboardPage.checkUrl(loginPageData.urlDashboard)
      })

      const { taskName, dashboardAfterCreate } = await test.step('Create new task', async () => {
        const newTaskPage = await dashboardPage.clickButtonNewTask()
        await newTaskPage.fillTaskTitle()
        const taskName = newTaskPage.taskName
        const dashboardAfterCreate = await newTaskPage.clickCreateTaskButton()
        return { taskName, dashboardAfterCreate }
      })

      await test.step('Toggle task to finished', async () => {
        await dashboardAfterCreate
          .checkTaskInOpenSection(taskName)
          .then((d) => d.toggleTask(taskName))
          .then((d) => d.checkTaskInFinishSection(taskName))
      })

      await test.step('Logout and return to login', async () => {
        const logoutPage = await dashboardAfterCreate.clickLogout()
        const loginPageAfterLogout = await logoutPage
          .checkReturnToLoginVisible()
          .then((l) => l.clickReturnToLogin())
        await loginPageAfterLogout.checkUrl(loginPageData.urlLoginPage)
      })
    })
  })
})
