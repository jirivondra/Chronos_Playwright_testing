import { test } from '../support/fixture'; 
import { loginPageData, loginCredentials } from '../support/test-data/login_page_data';

test.describe("Test Login page", () => {

  test.describe("Atomic Test For Login Page", () => {
    
    test('Check H1 On Page Login', async ({ loginPage }) => {
      await loginPage.checkH1(loginPageData.h1);
    });

    test('Check H2 On Page Login', async ({ loginPage }) => {
      await loginPage.checkH2(loginPageData.h2);
    });
  });

  test.describe("E2E Test For LogIn", () => {
    
    test('Login With Correct Credentials', async ({ loginPage }) => {
      await loginPage.fillUserName(loginCredentials.validUser.username);
      await loginPage.fillPassword(loginCredentials.validUser.password);
      await loginPage.clickSubmit();
      await loginPage.checkUrl(loginPageData.urlDashboard);
    });

  });
});