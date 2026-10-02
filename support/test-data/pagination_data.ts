import { faker } from '@faker-js/faker'

export const paginationData = {
  pageSize: 10,
}

export function generateRandomPageNumber(totalPages: number): number {
  return faker.number.int({ min: 1, max: totalPages })
}

export function generateNonLastPageNumber(totalPages: number): number {
  if (totalPages <= 1) return 1
  return faker.number.int({ min: 1, max: totalPages - 1 })
}
