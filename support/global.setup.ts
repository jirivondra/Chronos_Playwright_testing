import { test as setup } from '@playwright/test'
import { mkdirSync } from 'fs'
import { LoginPage } from './page-objects/login_page'
import { loginCredentials } from './test-data/login_page_data'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  mkdirSync('playwright/.auth', { recursive: true })

  const loginPage = new LoginPage(page)
  await loginPage.visit()
  await loginPage.login(
    loginCredentials.validUser.username,
    loginCredentials.validUser.password
  )
  await page.waitForURL('**/dashboard.html')
  await page.context().storageState({ path: authFile })
})
