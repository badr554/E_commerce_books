import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)

    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
      }
    }

    if (!stored && token) {
      authService
        .getProfile()
        .then((profile) => {
          setUser(profile)
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(profile))
        })
        .catch(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
        })
        .finally(() => setLoading(false))

      return
    }

    setLoading(false)
  }, [])

  const persistSession = (authData) => {
    if (!authData?.authenticated) return authData

    setUser(authData.user)
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.USER,
      JSON.stringify(authData.user)
    )
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, authData.token)

    return authData
  }

  const login = async (credentials) => {
    const data = await authService.login(credentials)

    if (!data.authenticated) {
      throw new Error(data.message || 'Login response is missing token or user')
    }

    return persistSession(data)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
  }

  const register = async (userData) => {
    const data = await authService.register(userData)

    if (data.authenticated) {
      return persistSession(data)
    }

    return data
  }

  const completeOAuthLoginFromUrl = async (url) => {
    const data = authService.parseOAuthResponseFromUrl(url)

    if (data.error) {
      throw new Error(data.error)
    }

    if (!data.authenticated) return null

    return persistSession(data)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        completeOAuthLoginFromUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
