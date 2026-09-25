import { test } from '../../support/fixture'
import { loginPageData } from '../../support/test-data/login_page_data'
import {
  dashboardPageData,
  calculatorTestData,
  generateUpcomingDueDates,
  generateUpcomingTaskTitle,
} from '../../support/test-data/dashboard_page_data'

test.describe('Test Dashboard Page', () => {
  test.describe('Atomic Tests For Dashboard', () => {
    let openTaskCount: number

    test.beforeEach(async ({ dashboardPage }) => {
      openTaskCount = await dashboardPage.countOpenTasks()
    })

    test('Check New Task Button Visibility', async ({ dashboardPage }) => {
      await dashboardPage.checkNewTaskButtonIsVisible()
    })

    test('Check Empty Open Section', async ({ dashboardPage }) => {
      test.skip(openTaskCount > dashboardPageData.emptyListCount)
      await dashboardPage.checkEmptyOpenSection()
    })

    test('Check Expand Button Is Visible', async ({ dashboardPage }) => {
      test.skip(openTaskCount <= dashboardPageData.taskPreviewLimit)
      await dashboardPage.checkExpandButtonVisible()
    })

    test('Check Expand Button Is Not Visible', async ({ dashboardPage }) => {
      test.skip(openTaskCount > dashboardPageData.taskPreviewLimit)
      await dashboardPage.checkExpandButtonNotVisible()
    })

    test('Check All Open Tasks Marked Incomplete', async ({ dashboardPage }) => {
      await dashboardPage.checkAllTasksInOpenSectionMarkedIncomplete()
    })

    test('Check All Finished Tasks Marked Complete', async ({ dashboardPage }) => {
      await dashboardPage.checkAllTasksInFinishSectionMarkedComplete()
    })
  })

  test.describe('E2E Test For Dashboard Page', () => {
    test('Sidebar Menu Collapse And Expand', async ({ dashboardPage }) => {
      await dashboardPage.checkOpenAndCloseSiteMenu()
    })

    test('Click New Task Button Navigates To New Task Page', async ({ dashboardPage }) => {
      const newTaskPage = await dashboardPage.clickButtonNewTask()
      await newTaskPage.checkUrl(dashboardPageData.urlNewTaskPage)
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
    let taskName: string

    test.beforeEach(async ({ dashboardPage }) => {
      const newTaskPage = await dashboardPage.clickButtonNewTask()
      await newTaskPage.fillTaskTitle()
      taskName = newTaskPage.taskName
      await newTaskPage.clickCreateTaskButton()
    })

    test.afterEach(async ({ dashboardPage }) => {
      await dashboardPage.deleteTaskByTitle(taskName)
    })

    test('Toggle Task Between Open And Finish Sections', async ({ dashboardPage }) => {
      await test.step('Task is in open section', async () => {
        await dashboardPage.checkTaskInOpenSection(taskName)
        await dashboardPage.checkTaskMarkedIncomplete(taskName)
      })

      await test.step('Toggle to finished', async () => {
        await dashboardPage.toggleTask(taskName)
        await dashboardPage.checkTaskInFinishSection(taskName)
        await dashboardPage.checkTaskMarkedComplete(taskName)
      })

      await test.step('Toggle back to open', async () => {
        await dashboardPage.toggleTask(taskName)
        await dashboardPage.checkTaskInOpenSection(taskName)
        await dashboardPage.checkTaskMarkedIncomplete(taskName)
      })

      await test.step('Toggle to finished again', async () => {
        await dashboardPage.toggleTask(taskName)
        await dashboardPage.checkTaskInFinishSection(taskName)
        await dashboardPage.checkTaskMarkedComplete(taskName)
      })
    })
  })

  // Serial: Pulse reads total/done counts and Upcoming reads the due-date window across ALL
  // tasks in the shared backend, while "Upcoming Task Behavior" creates/deletes tasks via API.
  // Running these in parallel workers races the API mutation against the DOM snapshot the
  // other blocks assert against, producing flaky counts/messages.
  test.describe.serial('Serial Tests For Pulse And Upcoming Widgets', () => {
    test.describe("Atomic Tests For Today's Pulse", () => {
      test('Check Pulse Texts Visible', async ({ dashboardPage }) => {
        await dashboardPage.checkPulseTextsVisible()
      })

      test('Check Pulse Percentage Matches Task Completion', async ({ dashboardPage }) => {
        await dashboardPage.checkPulseStats()
      })
    })

    test.describe('Atomic Tests For Upcoming', () => {
      let upcomingCount: number

      test.beforeEach(async ({ dashboardPage }) => {
        upcomingCount = await dashboardPage.countUpcomingTasks()
      })

      test('Check Upcoming Heading Visible', async ({ dashboardPage }) => {
        await dashboardPage.checkUpcomingHeadingVisible()
      })

      test('Check Upcoming Empty Message', async ({ dashboardPage }) => {
        test.skip(upcomingCount > dashboardPageData.emptyListCount)
        await dashboardPage.checkUpcomingEmpty()
      })

      test('Check Upcoming Empty Message Not Shown When Tasks Exist', async ({ dashboardPage }) => {
        test.skip(upcomingCount <= dashboardPageData.emptyListCount)
        await dashboardPage.checkUpcomingEmptyMessageNotShown()
      })
    })

    test.describe('Atomic Tests For Upcoming Task Behavior', () => {
      let taskName: string

      test.afterEach(async ({ dashboardPage }) => {
        await dashboardPage.deleteTaskByTitle(taskName)
      })

      test('Task Due Today Appears With Today Label', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.today)
          .then((d) => d.checkTaskDueToday(taskName))
      })

      test('Task Due Tomorrow Appears With Tomorrow Label', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.tomorrow)
          .then((d) => d.checkTaskDueTomorrow(taskName))
      })

      test('Task Outside Seven Day Window Is Not Shown', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.outsideWindow)
          .then((d) => d.checkTaskNotInUpcoming(taskName))
      })

      test('Overdue Task Is Not Shown In Upcoming', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.overdue)
          .then((d) => d.checkTaskNotInUpcoming(taskName))
      })

      test('Completed Task With Due Date Is Not Shown In Upcoming', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.today, true)
          .then((d) => d.checkTaskNotInUpcoming(taskName))
      })

      test('Clicking Upcoming Task Navigates To Task Detail', async ({ dashboardPage }) => {
        taskName = generateUpcomingTaskTitle()
        const dates = generateUpcomingDueDates()
        await dashboardPage
          .createTaskWithDueDate(taskName, dates.today)
          .then((d) => d.checkUpcomingTaskNavigation(taskName))
      })
    })
  })

  test.describe('Atomic Tests For Calendar', () => {
    test('Check Calendar Month Label Matches Current Month', async ({ dashboardPage }) => {
      await dashboardPage.checkCalendarMonthLabel()
    })

    test('Check Calendar Shows Correct Number Of Days For Current Month', async ({
      dashboardPage,
    }) => {
      await dashboardPage.checkCalendarDaysForCurrentMonth()
    })

    test('Check Today Is Highlighted In Calendar', async ({ dashboardPage }) => {
      await dashboardPage.checkCalendarTodayHighlighted()
    })
  })

  test.describe('Atomic Tests For Calculator', () => {
    test('Add Two Numbers Shows Result And History', async ({ dashboardPage }) => {
      const { a, b, expected } = calculatorTestData.addition
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorAdd())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(expected))
        .then((d) =>
          d.checkCalculatorHistory(`${a} ${dashboardPageData.calculatorOperatorSymbols.Add} ${b} =`)
        )
    })

    test('Subtract Two Numbers Shows Result And History', async ({ dashboardPage }) => {
      const { a, b, expected } = calculatorTestData.subtraction
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorSubtract())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(expected))
        .then((d) =>
          d.checkCalculatorHistory(
            `${a} ${dashboardPageData.calculatorOperatorSymbols.Subtract} ${b} =`
          )
        )
    })

    test('Integer Result Displays Without Trailing Decimals', async ({ dashboardPage }) => {
      const { a, b, expected } = calculatorTestData.integerDivision
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorDivide())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(expected))
    })

    test('Decimal Result Displays Trimmed', async ({ dashboardPage }) => {
      const { a, b, expected } = calculatorTestData.decimalDivision
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorDivide())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(expected))
    })

    test('Division By Zero Shows Error Message', async ({ dashboardPage }) => {
      const { a } = calculatorTestData.integerDivision
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorDivide())
        .then((d) => d.enterCalculatorNumber('0'))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorErrorMessage(dashboardPageData.calculatorDivisionByZeroFault))
    })

    test('Clear Resets Display History And Error', async ({ dashboardPage }) => {
      const { a, b } = calculatorTestData.integerDivision
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorDivide())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.clickCalculatorClear())
        .then((d) => d.checkCalculatorDisplay('0'))
        .then((d) => d.checkCalculatorErrorHidden())
    })

    test('Backspace Removes Last Digit', async ({ dashboardPage }) => {
      await dashboardPage
        .enterCalculatorNumber(calculatorTestData.backspaceEntry)
        .then((d) => d.clickCalculatorBackspace())
        .then((d) => d.checkCalculatorDisplay(calculatorTestData.backspaceResult))
    })

    test('Chained Calculation Continues From Previous Result', async ({ dashboardPage }) => {
      const { a, b, expected } = calculatorTestData.addition
      await dashboardPage
        .enterCalculatorNumber(a)
        .then((d) => d.selectCalculatorAdd())
        .then((d) => d.enterCalculatorNumber(b))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(expected))
        .then((d) => d.selectCalculatorMultiply())
        .then((d) => d.enterCalculatorNumber(calculatorTestData.chainMultiplier))
        .then((d) => d.clickCalculate())
        .then((d) => d.checkCalculatorDisplay(calculatorTestData.chainedResult))
    })
  })

  test.describe('E2E Test For Calculator Chaining', () => {
    test('Repeated Chained Additions Then New Calculation', async ({ dashboardPage }) => {
      const step = calculatorTestData.repeatedAdditionStep

      await test.step('First addition', async () => {
        await dashboardPage
          .enterCalculatorNumber(step)
          .then((d) => d.selectCalculatorAdd())
          .then((d) => d.enterCalculatorNumber(step))
          .then((d) => d.clickCalculate())
          .then((d) => d.checkCalculatorDisplay(calculatorTestData.repeatedAdditionFirstResult))
      })

      await test.step('Chain another addition using the previous result', async () => {
        await dashboardPage
          .selectCalculatorAdd()
          .then((d) => d.enterCalculatorNumber(step))
          .then((d) => d.clickCalculate())
          .then((d) => d.checkCalculatorDisplay(calculatorTestData.repeatedAdditionSecondResult))
      })

      await test.step('New digit after a result starts a fresh calculation', async () => {
        const digit = calculatorTestData.freshStartDigit
        await dashboardPage
          .enterCalculatorNumber(digit)
          .then((d) => d.checkCalculatorDisplay(digit))
      })
    })
  })
})
