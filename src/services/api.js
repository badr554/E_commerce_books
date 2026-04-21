import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://cary-nontumorous-unimpedingly.ngrok-free.dev/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error.response?.data

    if (payload?.message) {
      return Promise.reject(new Error(payload.message))
    }

    if (payload?.error) {
      return Promise.reject(new Error(payload.error))
    }

    if (payload?.errors && typeof payload.errors === 'object') {
      const firstError = Object.values(payload.errors).flat().find(Boolean)
      if (firstError) {
        return Promise.reject(new Error(firstError))
      }
    }

    return Promise.reject(
      error instanceof Error ? error : new Error('Request failed')
    )
  }
)

export default api
