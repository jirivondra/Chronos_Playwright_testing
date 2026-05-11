import { test } from '../../support/fixture'
import { loginPageData } from '../../support/test-data/login_page_data'

test.describe('Test Dashboard Page', () => {
  test.describe('Atomic Tests For Dashboard', () => {
    test('Check New Task Button Visibility', async ({ dashboardPage }) => {
      await dashboardPage.checkNewTaskButtonIsVisible()
    })
  })

  test.describe('E2E Test For Dashboard Page', () => {
    test('Sidebar Menu Collapse And Expand', async ({ dashboardPage }) => {
      await dashboardPage.checkOpenAndClosseSiteMenu()
    })

    test('Click New Task Button Navigates To New Task Page', async ({ dashboardPage }) => {
      await dashboardPage.clickButtonNewTask()
    })

    test('New Task Button Triggers Navigation Request', async ({ dashboardPage }) => {
      await dashboardPage.checkNewTaskNavigationRequest()
    })
  })

  test.describe('E2E Test For Logout', () => {
    test('Logout Redirects To Logout Page', async ({ dashboardPage }) => {
      await dashboardPage.clickLogout().then((d) => d.checkUrl(loginPageData.urlLogoutPage))
    })
  })

  test.describe('E2E Test For Task Toggle', () => {
    test('Toggle Task Between Open And Finish Sections', async ({ dashboardWithTask }) => {
      const { dashboardPage, taskName } = dashboardWithTask
      await dashboardPage
        .checkTaskInOpenSection(taskName)
        .then((d) => d.toggleTask(taskName))
        .then((d) => d.checkTaskInFinishSection(taskName))
        .then((d) => d.toggleTask(taskName))
        .then((d) => d.checkTaskInOpenSection(taskName))
        .then((d) => d.toggleTask(taskName))
        .then((d) => d.checkTaskInFinishSection(taskName))
    })
  })
})
