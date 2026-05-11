import { test } from '../../support/fixture'
import { loginPageData, loginCredentials } from '../../support/test-data/login_page_data'

test.describe('Smoke Test', () => {
  test('Full Application Flow', async ({ loginPage }) => {
    const dashboardPage = await loginPage.login(
      loginCredentials.validUser.username,
      loginCredentials.validUser.password,
      loginPageData.urlDashboard,
    )

    const newTaskPage = await dashboardPage.clickButtonNewTask()
    await newTaskPage.fillTaskTitle()
    const taskName = newTaskPage.taskName
    const dashboardAfterCreate = await newTaskPage.clickCreateTaskButton()

    await dashboardAfterCreate
      .checkTaskInOpenSection(taskName)
      .then(d => d.toggleTask(taskName))
      .then(d => d.checkTaskInFinishSection(taskName))

    const logoutPage = await dashboardAfterCreate.clickLogout()
    await logoutPage
      .checkReturnToLoginVisible()
      .then(l => l.clickReturnToLogin(loginPageData.urlLoginPage))
  })
})
