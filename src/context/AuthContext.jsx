import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const register = async (userData) => {
    const data = await authService.register(userData)
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
