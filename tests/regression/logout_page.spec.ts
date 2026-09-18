import { test } from '../../support/fixture'
import { themeCases } from '../../support/test-data/visual_testing_data'

test.describe('Test Logout page', () => {
  themeCases.forEach(({ description, theme }) => {
    test.describe('Visual Tests For Logout Page', () => {
      test.use({ theme })

      test(`Logout Page Matches ${description} Snapshot`, async ({ logoutPage }) => {
        await logoutPage.checkFullPageSnapshot(`logout-page-${theme}.png`)
      })
    })
  })
})
