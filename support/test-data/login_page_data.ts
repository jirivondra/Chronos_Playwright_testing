export const loginPageData = {
  h1: 'Chronos',
  h2: 'Welcome',
  urlDashboard: '/dashboard.html',
  urlLoginPage: '/login.html',
  urlLogoutPage: '/logout.html',
}

export const loginCredentials = {
  validUser: {
    username: 'admin',
    password: 'secret',
  },
  invalidUser: {
    username: 'wrong',
    password: 'wrong',
  },
}

export const negativeLoginCases = [
  { description: 'Invalid Credentials', username: 'wrong', password: 'wrong' },
  { description: 'Empty Credentials', username: '', password: '' },
]
