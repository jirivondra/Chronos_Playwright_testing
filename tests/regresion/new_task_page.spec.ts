import { test, expect } from '../../support/fixture'

test.describe('Test New Task Page', () => {
  test.describe('Atomic Tests For Create Task Form', () => {
    test('Create Task Button Is Disabled Until Title Is Filled', async ({ newTaskPage }) => {
      await newTaskPage.checkCreateTaskButtonBehave()
    })
  })

  test.describe('E2E Test For New Task Page', () => {
    test('Create New Task', async ({ newTaskPage }) => {
      await newTaskPage
        .fillTaskTitle()
        .then(n => n.clickCreateTaskButton())
    })

    test.skip('Create Task Button Triggers POST Request', async ({ newTaskPage }) => {
      const request = await newTaskPage
        .fillTaskTitle()
        .then(n => n.clickCreateTaskButtonAndWaitForRequest(/api\/tasks/))
      expect(request.method()).toBe('POST')
    })
  })
})
