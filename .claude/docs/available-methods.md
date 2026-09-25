# Available Methods Reference

Complete reference of all page objects, their public locators, and public methods. Use this to know what is callable in tests without reading the source files.

## Inheritance chains

Two chains exist in this project:

```
ApiHelper → BasePage → Header → Footer → ToTopButton → AppBar → SiteBarMenu → OpenTask → DashboardPage
                                                                              └─ NewTaskPage

ApiHelper → BasePage → Header → Footer → ToTopButton → LoginPage
                                                      └─ LogoutPage
```

`DashboardPage` has the full chain — all methods from every class above are available on it.
`NewTaskPage` skips `OpenTask` — task-list methods are not available on it.
`LoginPage` and `LogoutPage` skip `AppBar`, `SiteBarMenu`, and `OpenTask`.

---

## ApiHelper

Base HTTP client. No Playwright dependency.

| Method       | Signature                                                                                       | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `apiRequest` | `(method: 'GET'\|'POST'\|'PUT'\|'DELETE', endpoint: string, body?: object) → Promise<Response>` | Public generic dispatcher — call from tests when no page object method exists |

`get`, `post`, `put`, `delete` are `protected` — only callable inside page object methods, not from tests.

---

## BasePage

Adds browser `page` instance and navigation. No assertion or interaction methods — those belong in subclasses.

| Method           | Signature                           | Description                                                 |
| ---------------- | ----------------------------------- | ----------------------------------------------------------- |
| `goto`           | `(params?: string) → Promise<this>` | Navigates to the page's path (optionally with query params) |
| `clearCache`     | `() → Promise<this>`                | Clears cookies, localStorage, sessionStorage                |
| `scrollToBottom` | `() → Promise<this>`                | Scrolls to bottom of page                                   |

---

## Header

First class in the chain that adds assertion methods. Adds `h1`/`h2` locators and URL check.

**Public locators** (usable directly with `expect()` in tests):

| Locator | Type      | Description          |
| ------- | --------- | -------------------- |
| `h1`    | `Locator` | First-level heading  |
| `h2`    | `Locator` | Second-level heading |

**Methods:**

| Method     | Signature                        | Description                                   |
| ---------- | -------------------------------- | --------------------------------------------- |
| `checkUrl` | `(url: string) → Promise<this>`  | Asserts current URL equals `url`              |
| `checkH1`  | `(text: string) → Promise<this>` | Soft-asserts h1 is visible, count=1, has text |
| `checkH2`  | `(text: string) → Promise<this>` | Soft-asserts h2 is visible and has text       |

---

## Footer

Adds footer heading and contact icon locators.

**Public locators:**

| Locator         | Type      | Description                          |
| --------------- | --------- | ------------------------------------ |
| `footerHeading` | `Locator` | "Connect with me" text in footer     |
| `contactIcons`  | `Locator` | All `<a aria-label>` links in footer |

**Methods:**

| Method                 | Signature                         | Description                                                    |
| ---------------------- | --------------------------------- | -------------------------------------------------------------- |
| `contactIconByLabel`   | `(label: string) → Locator`       | Returns the contact icon link matching a specific `aria-label` |
| `checkHeadingVisible`  | `() → Promise<this>`              | Asserts footer heading is visible                              |
| `checkContactIconLink` | `(label: string) → Promise<this>` | Asserts the contact icon with given `aria-label` is visible    |

---

## ToTopButton

Adds back-to-top button assertions and interaction.

| Method                       | Signature            | Description                                         |
| ---------------------------- | -------------------- | --------------------------------------------------- |
| `checkToTopButtonVisible`    | `() → Promise<this>` | Soft-asserts button is visible and has `opacity: 1` |
| `checkToTopButtonNotVisible` | `() → Promise<this>` | Asserts button has `opacity: 0`                     |
| `clickToTopButton`           | `() → Promise<this>` | Clicks the back-to-top button                       |

---

## AppBar

Adds top navigation bar with logout action.

| Method        | Signature                  | Description                                            |
| ------------- | -------------------------- | ------------------------------------------------------ |
| `clickLogout` | `() → Promise<LogoutPage>` | Clicks logout link — returns `LogoutPage` (chain ends) |

---

## SiteBarMenu

Adds sidebar menu with logo, navigation links, and app version.

| Method                          | Signature            | Description                                                                                         |
| ------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `checkMenuExpandedOnLoad`       | `() → Promise<this>` | Asserts menu is in expanded state on load: open button visible, logo and nav labels visible         |
| `checkVisibilityForOpenMenu`    | `() → Promise<this>` | Asserts open-menu button is visible                                                                 |
| `checkVisibilityForCloseMenu`   | `() → Promise<this>` | Asserts open-menu button is not visible                                                             |
| `checkOpenAndCloseSiteMenu`     | `() → Promise<this>` | Full open/close cycle: checks expanded state, collapses, checks collapsed state, expands again      |
| `checkVersionTitle`             | `() → Promise<this>` | Soft-asserts "App version" label is visible with correct text                                       |
| `checkVersionOfAppIsVisible`    | `() → Promise<this>` | Asserts app version element is visible                                                              |
| `checkVersionOfAppIsNotVisible` | `() → Promise<this>` | Asserts app version element is not visible                                                          |
| `checkLogoImageVisible`         | `() → Promise<this>` | Asserts sidebar logo image is visible                                                               |
| `checkLogoExpandedVisible`      | `() → Promise<this>` | Soft-asserts logo title ("Chronos") and subtitle ("Personal Space") are visible with correct text   |
| `checkLogoCollapsedHidden`      | `() → Promise<this>` | Soft-asserts logo title and subtitle are not visible                                                |
| `checkNavExpandedVisible`       | `() → Promise<this>` | Soft-asserts all 4 nav icons and labels are visible (Dashboard, Open Tasks, Closed Tasks, Calendar) |
| `checkNavCollapsedVisible`      | `() → Promise<this>` | Soft-asserts all 4 nav icons visible but labels not visible                                         |

---

## OpenTask

Adds open task list, expand button, and API-based task utilities.

**Public locators:**

| Locator                | Type      | Description                                          |
| ---------------------- | --------- | ---------------------------------------------------- |
| `openListEmptyMessage` | `Locator` | "No open tasks. Create one with + New Task." message |
| `expandOpenListButton` | `Locator` | "Show all" expand button in the open list            |

**Methods:**

| Method                             | Signature                            | Description                                                       |
| ---------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `clickExpandButton`                | `() → Promise<this>`                 | Clicks the expand open list button                                |
| `countOpenTasks`                   | `() → Promise<number>`               | Fetches `/todos` via API and returns count of non-completed tasks |
| `checkExpandButtonVisible`         | `() → Promise<this>`                 | Asserts expand button is visible                                  |
| `checkExpandButtonNotVisible`      | `() → Promise<this>`                 | Asserts expand button is not visible                              |
| `checkEmptyOpenSection`            | `() → Promise<this>`                 | Soft-asserts empty message is visible with correct text           |
| `deleteTaskByTitle`                | `(title: string) → Promise<void>`    | Deletes all tasks with matching title via API — used for teardown |
| `checkTaskInOpenSection`           | `(taskName: string) → Promise<this>` | Asserts task heading is visible in open list                      |
| `checkTaskHasEditAndDeleteButtons` | `(taskName: string) → Promise<this>` | Soft-asserts edit and delete buttons are visible for the task     |

---

## DashboardPage

**Fixture:** `dashboardPage` (authenticated), `unAuthDashboardPage` (no auth)
**Path:** `/dashboard.html`
**Extends:** `OpenTask` — has all methods from the full chain.

**Public locators:**

| Locator         | Type      | Description                         |
| --------------- | --------- | ----------------------------------- |
| `newTaskButton` | `Locator` | "New Task" button (`#new-task-btn`) |

**Own methods:**

| Method                          | Signature                            | Description                                                          |
| ------------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `checkNewTaskButtonIsVisible`   | `() → Promise<this>`                 | Asserts new task button is visible                                   |
| `toggleTask`                    | `(taskName: string) → Promise<this>` | Clicks the task checkbox and waits for `/todos` API response         |
| `checkTaskInFinishSection`      | `(taskName: string) → Promise<this>` | Asserts task heading is visible in done list                         |
| `clickButtonNewTask`            | `() → Promise<NewTaskPage>`          | Clicks new task button — returns `NewTaskPage` (chain ends)          |
| `checkNewTaskNavigationRequest` | `() → Promise<this>`                 | Asserts clicking new task button triggers GET request to `edit-task` |

---

## NewTaskPage

**Fixture:** `newTaskPage` (authenticated, depends on `dashboardPage`), `unAuthNewTaskPage` (no auth)
**Path:** `/edit-task.html?from=dashboard`
**Extends:** `SiteBarMenu` — does NOT have `OpenTask` methods (no task list on this page).

**Public properties:**

| Property           | Type      | Description                                                                         |
| ------------------ | --------- | ----------------------------------------------------------------------------------- |
| `taskName`         | `string`  | Auto-generated task title set on construction: `"Test - DD.MM.YYYY - HH:mm:ss.SSS"` |
| `createTaskButton` | `Locator` | "Create Task" button                                                                |

**Methods:**

| Method                        | Signature                     | Description                                                                                  |
| ----------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `fillTaskTitle`               | `() → Promise<this>`          | Fills the task title input with `this.taskName`                                              |
| `checkCreateTaskButtonBehave` | `() → Promise<this>`          | Soft-asserts button disabled before fill, enabled after fill                                 |
| `clickCreateTaskButton`       | `() → Promise<DashboardPage>` | Clicks create button, waits for redirect to dashboard — returns `DashboardPage` (chain ends) |
| `checkCreateTaskPostRequest`  | `() → Promise<this>`          | Asserts clicking create button triggers POST request to `/api/tasks`                         |

---

## LoginPage

**Fixture:** `loginPage` (no auth injection — tests the login form itself)
**Path:** `/login.html`
**Extends:** `ToTopButton` — has BasePage, Header, Footer, ToTopButton methods. No AppBar/SiteBarMenu.

**Public locators:**

| Locator             | Type      | Description                             |
| ------------------- | --------- | --------------------------------------- |
| `signInButton`      | `Locator` | Submit button (`button[type="submit"]`) |
| `createAccountLink` | `Locator` | "Create Account" link                   |
| `forgetAccessLink`  | `Locator` | "Forgot Access?" link                   |

**Methods:**

| Method                      | Signature                                                       | Description                                                          |
| --------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `fillUserName`              | `(userName: string) → Promise<this>`                            | Fills username input                                                 |
| `fillPassword`              | `(password: string) → Promise<this>`                            | Fills password input                                                 |
| `checkSignInButtonVisible`  | `() → Promise<this>`                                            | Asserts sign-in button is visible                                    |
| `checkCreateAccountVisible` | `() → Promise<this>`                                            | Asserts "Create Account" link is visible                             |
| `checkForgotAccessVisible`  | `() → Promise<this>`                                            | Asserts "Forgot Access?" link is visible                             |
| `checkPasswordIsHidden`     | `() → Promise<this>`                                            | Asserts password input has `type="password"`                         |
| `checkPasswordIsVisible`    | `() → Promise<this>`                                            | Asserts password input has `type="text"`                             |
| `clickPasswordToggle`       | `() → Promise<this>`                                            | Clicks the password visibility toggle                                |
| `clickSubmit`               | `() → Promise<this>`                                            | Clicks the sign-in button                                            |
| `login`                     | `(userName: string, password: string) → Promise<DashboardPage>` | Fills credentials and submits — returns `DashboardPage` (chain ends) |

---

## LogoutPage

**Fixture:** `logoutPage` (no auth injection)
**Path:** `/logout.html`
**Extends:** `ToTopButton` — has BasePage, Header, Footer, ToTopButton methods. No AppBar/SiteBarMenu.

| Method                      | Signature                 | Description                                        |
| --------------------------- | ------------------------- | -------------------------------------------------- |
| `checkReturnToLoginVisible` | `() → Promise<this>`      | Asserts "Return to Login" link is visible          |
| `clickReturnToLogin`        | `() → Promise<LoginPage>` | Clicks the link — returns `LoginPage` (chain ends) |

---

## Fixtures summary

| Fixture name          | Type            | Page object     | Auth                    | Notes                                                          |
| --------------------- | --------------- | --------------- | ----------------------- | -------------------------------------------------------------- |
| `loginPage`           | auth-fixtures   | `LoginPage`     | none                    | Login form tests — no token injected                           |
| `dashboardPage`       | auth-fixtures   | `DashboardPage` | token in sessionStorage | Standard authenticated tests                                   |
| `newTaskPage`         | auth-fixtures   | `NewTaskPage`   | via `dashboardPage`     | Depends on `dashboardPage`; teardown via `deleteTaskByTitle()` |
| `logoutPage`          | auth-fixtures   | `LogoutPage`    | none                    | Logout page tests — no token injected                          |
| `unAuthDashboardPage` | noauth-fixtures | `DashboardPage` | none                    | Redirect tests — no token                                      |
| `unAuthNewTaskPage`   | noauth-fixtures | `NewTaskPage`   | none                    | Redirect tests — no token                                      |

---

## Test data

| File                     | Exports              | Contents                                                                |
| ------------------------ | -------------------- | ----------------------------------------------------------------------- |
| `login_page_data.ts`     | `loginPageData`      | URLs, h1, h2 text                                                       |
| `login_page_data.ts`     | `loginCredentials`   | `validUser`, `invalidUser` (username/password)                          |
| `login_page_data.ts`     | `negativeLoginCases` | Array of `LoginTestCase` for data-driven negative login tests           |
| `dashboard_page_data.ts` | `dashboardPageData`  | `emptyListCount`, `taskPreviewLimit`, `emptyMessage`, `urlNewTaskPage`  |
| `general.ts`             | `contactMeInfo`      | Footer contact `{ label, href }` entries: `github`, `email`, `linkedIn` |

## Types

| File                                              | Exports                      | Description                                            |
| ------------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| `support/types/chronos/form-fields/login_form.ts` | `LoginForm`, `LoginTestCase` | Types for login form fields and data-driven test cases |
