import { LoginTestCase } from '../types/chronos/form-fields/login_form'

export const loginPageData = {
  h1: 'Chronos',
  h2: 'Welcome',
  urlDashboard: '/dashboard.html',
  urlLoginPage: '/login.html',
  urlLogoutPage: '/logout.html',
  invalidCredentialsMessage:
    'You have entered an incorrect username or password. Please check your login credentials.',
  backendUnreachableMessage:
    'Cannot connect to server. Make sure the backend is running on port 8000.',
  usernameFieldErrorMessage: 'Username must be at least 4 characters.',
  passwordFieldErrorMessage: 'Password must be at least 4 characters.',
  underMinLengthValue: 'ab',
}

export const loginCredentials = {
  validUser: {
    username: process.env.API_USERNAME ?? '',
    password: process.env.API_PASSWORD ?? '',
  },
  invalidUser: {
    username: 'wrong',
    password: 'wrong',
  },
}

export const negativeLoginCases: LoginTestCase[] = [
  { description: 'Invalid Credentials', username: 'wrong', password: 'wrong' },
  { description: 'Empty Credentials', username: '', password: '' },
  {
    description: 'Empty Username Only',
    username: '',
    password: loginCredentials.validUser.password,
  },
  {
    description: 'Empty Password Only',
    username: loginCredentials.validUser.username,
    password: '',
  },
]

export const invalidCredentialsCases: LoginTestCase[] = [
  {
    description: 'Wrong Username And Password',
    username: loginCredentials.invalidUser.username,
    password: loginCredentials.invalidUser.password,
  },
  {
    description: 'Wrong Password Only',
    username: loginCredentials.validUser.username,
    password: loginCredentials.invalidUser.password,
  },
  {
    description: 'Wrong Username Only',
    username: loginCredentials.invalidUser.username,
    password: loginCredentials.validUser.password,
  },
]
