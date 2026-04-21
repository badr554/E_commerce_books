import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL ||
  'https://cary-nontumorous-unimpedingly.ngrok-free.dev/api'

const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function normalizeError(error) {
  const payload = error.response?.data

  if (payload?.message) {
    return new Error(payload.message)
  }

  if (payload?.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).flat().find(Boolean)
    if (firstError) return new Error(firstError)
  }

  return error instanceof Error ? error : new Error('Authentication failed')
}

function parseUser(value) {
  if (!value) return null
  if (typeof value === 'object') return value

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function extractToken(payload) {
  return (
    payload?.token ||
    payload?.plainTextToken ||
    payload?.access_token ||
    payload?.accessToken ||
    payload?.api_token ||
    payload?.data?.token ||
    payload?.data?.plainTextToken ||
    payload?.data?.access_token ||
    null
  )
}

function extractUser(payload) {
  return (
    parseUser(payload?.user) ||
    parseUser(payload?.data?.user) ||
    (payload?.name || payload?.email
      ? { name: payload.name, email: payload.email }
      : null)
  )
}

function normalizeAuthResponse(payload = {}) {
  const token = extractToken(payload)
  const user = extractUser(payload)
  const message = payload?.message || payload?.data?.message || null

  return {
    ...payload,
    message,
    token,
    user,
    authenticated: Boolean(token && user),
  }
}

function getUrlParams(url) {
  const parsedUrl = new URL(url)
  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ''))

  return {
    searchParams: parsedUrl.searchParams,
    hashParams,
  }
}

function readParam(searchParams, hashParams, ...keys) {
  for (const key of keys) {
    const value = searchParams.get(key) || hashParams.get(key)
    if (value) return value
  }

  return null
}

authApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(normalizeError(error))
)

export const authService = {
  login: async (credentials) =>
    normalizeAuthResponse(await authApi.post('/login', credentials)),
  register: async (userData) =>
    normalizeAuthResponse(await authApi.post('/register', userData)),
  logout: async () => ({ success: true }),
  getProfile: () => authApi.get('/user'),
  getGoogleAuthUrl: () => `${AUTH_API_BASE_URL}/auth/google`,
  parseOAuthResponseFromUrl: (url) => {
    const { searchParams, hashParams } = getUrlParams(url)
    const token = readParam(
      searchParams,
      hashParams,
      'token',
      'plainTextToken',
      'access_token',
      'api_token'
    )
    const user = parseUser(readParam(searchParams, hashParams, 'user'))
    const error = readParam(searchParams, hashParams, 'error')
    const message = readParam(searchParams, hashParams, 'message')
    const email = readParam(searchParams, hashParams, 'email')
    const name = readParam(searchParams, hashParams, 'name')

    return normalizeAuthResponse({
      token,
      user: user || (name || email ? { name, email } : null),
      error,
      message,
    })
  },
}
