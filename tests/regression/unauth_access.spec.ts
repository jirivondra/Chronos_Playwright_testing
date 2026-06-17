import { test } from '../../support/fixture'
import { loginPageData } from '../../support/test-data/login_page_data'

test.describe('Test Unauthenticated Access', () => {
  test.describe('E2E Test For Unauthenticated Access', () => {
    test('Dashboard Redirects To Login Page', async ({ unAuthDashboardPage }) => {
      await unAuthDashboardPage.checkUrl(loginPageData.urlLoginPage)
    })

    test('New Task Page Redirects To Login Page', async ({ unAuthNewTaskPage }) => {
      await unAuthNewTaskPage.checkUrl(loginPageData.urlLoginPage)
    })
  })
})
