import { test as base } from '@playwright/test'
import { LoginPage } from '../page-objects/login_page'

export type AuthFixtures = {
  loginPage: LoginPage
}

export const authFixtures = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)

    await loginPage.visit()
    await use(loginPage)

    await loginPage.clearCache()
  },
})
