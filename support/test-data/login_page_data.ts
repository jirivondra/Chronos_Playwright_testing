import { LoginTestCase } from '../types/chronos/form-fields/login_form'

export const loginPageData = {
  h1: 'Chronos',
  h2: 'Welcome',
  urlDashboard: '/dashboard.html',
  urlLoginPage: '/login.html',
  urlLogoutPage: '/logout.html',
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
]
