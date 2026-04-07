import { test } from "@playwright/test";
import { LoginPage } from "../support/page-objects/login_page";
import { loginPageData, loginCredentials } from "../support/test-data/login_page_data";

let loginPage: LoginPage;

test.describe("Test Login page", () => {

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.visit();
  });

  test.describe("Atomic Test For Login Page", () => {
    test('Check H1 On Page Login', async () => {
      await loginPage.checkH1(loginPageData.h1);
    });

    test('Check H2 On Page Login', async () => {
      await loginPage.checkH2(loginPageData.h2);
    });
  });

  test.describe("E2E Test For LogIn", () => {
    test('Login With Correct Credentials', async () => {
      await loginPage.fillUserName(loginCredentials.validUser.username);
      await loginPage.fillPassword(loginCredentials.validUser.password);
      await loginPage.clickSubmit();
      await loginPage.checkUrl(loginPageData.urlDashboard);
    });
  });
});