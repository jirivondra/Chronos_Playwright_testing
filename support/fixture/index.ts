import { mergeTests } from '@playwright/test'
import { authFixtures } from './auth-fixtures'
import { noAuthFixtures } from './noauth-fixtures'

export const test = mergeTests(authFixtures, noAuthFixtures)

export { expect } from '@playwright/test'
