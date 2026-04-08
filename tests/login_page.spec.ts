import { test, expect } from '../support/fixture'
import { loginPageData, loginCredentials } from '../support/test-data/login_page_data'
import { contactMeInfo } from '../support/test-data/general'

test.describe('Test Login page', () => {
  test.describe('Atomic Test For login form', () => {
    test('Check H1 On Page Login', async ({ loginPage }) => {
      await loginPage.checkH1(loginPageData.h1)
    })

    test('Check H2 On Page Login', async ({ loginPage }) => {
      await loginPage.checkH2(loginPageData.h2)
    })

    test('Check Sign In Button Visibility', async ({ loginPage }) => {
      await loginPage.checkSignInButtonVisible()
    })

    test('Check Create Account Link Visibility', async ({ loginPage }) => {
      await loginPage.checkCreateAccountVisible()
    })

    test('Check Forgot Access Link Visibility', async ({ loginPage }) => {
      await loginPage.checkForgotAccessVisible()
    })
  })

  test.describe('Atomic Tests For Footer', () => {
    test('Check Heading Visibility', async ({ loginPage }) => {
      await loginPage.checkHeadingVisible()
    })

    test('Check Contact Icons Count', async ({ loginPage }) => {
      await expect(loginPage.contactIcons).toHaveCount(3)
    })

    test('Check GitHub Icon Link', async ({ loginPage }) => {
      await loginPage.checkContactIconLink(contactMeInfo.github)
    })

    test('Check Email Icon Link', async ({ loginPage }) => {
      await loginPage.checkContactIconLink(contactMeInfo.email)
    })

    test('Check LinkedIn Icon Link', async ({ loginPage }) => {
      await loginPage.checkContactIconLink(contactMeInfo.linkdeIn)
    })

    test('Check Create Account Link Visibility', async ({ loginPage }) => {
      await loginPage.checkCreateAccountVisible()
    })
  })

  test.describe('E2E Test For LogIn Page', () => {
    test('ToTop Button Full Flow', async ({ loginPage }) => {
      await loginPage.checkToTopButtonNotVisible()
      await loginPage.scrollToBottom()
      await loginPage.checkToTopButtonVisible()
      await loginPage.clickToTopButton()
      await loginPage.checkToTopButtonNotVisible()
    })

    test('Show And Hide Password', async ({ loginPage }) => {
      await loginPage.checkPasswordIsHidden()
      await loginPage.clickPasswordToggle()
      await loginPage.checkPasswordIsVisible()
      await loginPage.clickPasswordToggle()
      await loginPage.checkPasswordIsHidden()
    })

    test('Login With Correct Credentials', async ({ loginPage }) => {
      await loginPage.fillUserName(loginCredentials.validUser.username)
      await loginPage.fillPassword(loginCredentials.validUser.password)
      await loginPage.clickSubmit()
      await loginPage.checkUrl(loginPageData.urlDashboard)
    })
  })
})
