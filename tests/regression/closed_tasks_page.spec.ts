import { test } from '../../support/fixture'
import { paginationData, generateNonLastPageNumber } from '../../support/test-data/pagination_data'
import { closedTasksPageData } from '../../support/test-data/closed_tasks_page_data'

test.describe('Test Closed Tasks Page', () => {
  let paginationVisible: boolean

  test.beforeEach(async ({ closedTasksPage }) => {
    paginationVisible = await closedTasksPage.isPaginationVisible()
  })

  test.describe('Atomic Tests For Closed Tasks', () => {
    test('Check H1 On Page Closed Tasks', async ({ closedTasksPage }) => {
      await closedTasksPage.checkH1(closedTasksPageData.h1)
    })

    test('Check Only One H1 On Page Closed Tasks', async ({ closedTasksPage }) => {
      await closedTasksPage.checkOnlyOneH1()
    })

    test('Check All Closed Tasks Marked Complete', async ({ closedTasksPage }) => {
      await closedTasksPage.checkAllTasksMarkedComplete()
    })

    test('Check Pagination Hidden When Task Count Does Not Exceed Page Size', async ({
      closedTasksPage,
    }) => {
      test.skip(paginationVisible)
      await closedTasksPage.checkPaginationNotVisible()
    })

    test('Check Pagination Visible When Task Count Exceeds Page Size', async ({
      closedTasksPage,
    }) => {
      test.skip(!paginationVisible)
      await closedTasksPage.checkPaginationVisible()
    })
  })

  test.describe('E2E Test For Closed Tasks Page', () => {
    test('Sidebar Menu Collapse And Expand', async ({ closedTasksPage }) => {
      await closedTasksPage.checkOpenAndCloseSiteMenu()
    })
  })

  test.describe('E2E Test For Pagination Navigation', () => {
    test('Navigate To Random Page Shows Correct Page And Item Count', async ({
      closedTasksPage,
    }) => {
      test.skip(!paginationVisible)

      const totalPages = await test.step('Read total page count', async () => {
        return closedTasksPage.getTotalPages()
      })

      const targetPage = generateNonLastPageNumber(totalPages)

      await test.step('Navigate to a non-last page', async () => {
        await closedTasksPage.goToPage(targetPage)
      })

      await test.step('Verify current page and item count', async () => {
        await closedTasksPage.checkCurrentPage(targetPage)
        await closedTasksPage.checkItemCountOnPage(paginationData.pageSize)
      })

      await test.step('Verify tasks on this page are marked complete', async () => {
        await closedTasksPage.checkAllTasksMarkedComplete()
      })
    })
  })
})
