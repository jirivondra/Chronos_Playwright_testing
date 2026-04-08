import { mergeTests } from '@playwright/test';
import { authFixtures } from './auth-fixtures';

export const test = mergeTests(authFixtures);

export { expect } from '@playwright/test';