import dayjs from 'dayjs'

export const dashboardPageData = {
  emptyListCount: 0,
  taskPreviewLimit: 10,
  emptyMessage: 'No open tasks. Create one with + New Task.',
  urlNewTaskPage: '/edit-task.html?from=dashboard',
  upcomingEmptyMessage: 'Nothing due in the next 7 days.',
  pulseSubtitle: 'Architectural focus status',
  pulseCountSuffix: 'TASKS COMPLETED',
  upcomingLabelToday: 'Today',
  upcomingLabelTomorrow: 'Tomorrow',
  calculatorDivisionByZeroFault: 'Division by zero is not allowed',
  calculatorOperatorSymbols: {
    Add: '+',
    Subtract: '−',
    Multiply: '×',
    Divide: '÷',
  },
}

export const calculatorTestData = {
  addition: { a: '5', b: '3', expected: '8' },
  subtraction: { a: '9', b: '4', expected: '5' },
  integerDivision: { a: '10', b: '2', expected: '5' },
  decimalDivision: { a: '7', b: '2', expected: '3.5' },
  chainMultiplier: '2',
  chainedResult: '16',
  repeatedAdditionStep: '5',
  repeatedAdditionFirstResult: '10',
  repeatedAdditionSecondResult: '15',
  freshStartDigit: '7',
  backspaceEntry: '12',
  backspaceResult: '1',
}

export function generateUpcomingDueDates() {
  const today = dayjs()
  return {
    today: today.format('YYYY-MM-DD'),
    tomorrow: today.add(1, 'day').format('YYYY-MM-DD'),
    outsideWindow: today.add(8, 'day').format('YYYY-MM-DD'),
    overdue: today.subtract(1, 'day').format('YYYY-MM-DD'),
  }
}

export function generateUpcomingTaskTitle() {
  return `Upcoming Test - ${dayjs().format('DD.MM.YYYY - HH:mm:ss.SSS')}`
}
