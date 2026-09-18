export type ThemeTestCase = {
  description: string
  theme: 'light' | 'dark'
}

export const themeCases: ThemeTestCase[] = [
  { description: 'Light Mode', theme: 'light' },
  { description: 'Dark Mode', theme: 'dark' },
]
