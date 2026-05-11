import { test, expect } from '../../support/fixture'
import {
  loginPageData,
  loginCredentials,
  negativeLoginCases,
} from '../../support/test-data/login_page_data'
import { contactMeInfo } from '../../support/test-data/general'

test.describe('Test Login page', () => {
  test.describe('Atomic Tests For Login Form', () => {
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
  })

  test.describe('E2E Test For Login Page', () => {
    test('ToTop Button Full Flow', async ({ loginPage }) => {
      await loginPage
        .checkToTopButtonNotVisible()
        .then((l) => l.scrollToBottom())
        .then((l) => l.checkToTopButtonVisible())
        .then((l) => l.clickToTopButton())
        .then((l) => l.checkToTopButtonNotVisible())
    })

    test('Show And Hide Password', async ({ loginPage }) => {
      await loginPage
        .checkPasswordIsHidden()
        .then((l) => l.clickPasswordToggle())
        .then((l) => l.checkPasswordIsVisible())
        .then((l) => l.clickPasswordToggle())
        .then((l) => l.checkPasswordIsHidden())
    })

    test('Login With Correct Credentials', async ({ loginPage }) => {
      await loginPage
        .fillUserName(loginCredentials.validUser.username)
        .then((l) => l.fillPassword(loginCredentials.validUser.password))
        .then((l) => l.clickSubmit())
        .then((l) => l.checkUrl(loginPageData.urlDashboard))
    })
  })

  test.describe('Login Page - Negative Scenarios', () => {
    negativeLoginCases.forEach(({ description, username, password }) => {
      test(`Login With ${description} Stays On Login Page`, async ({ loginPage }) => {
        await loginPage
          .fillUserName(username)
          .then((l) => l.fillPassword(password))
          .then((l) => l.clickSubmit())
          .then((l) => l.checkUrl(loginPageData.urlLoginPage))
      })
    })
  })
})
