import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ message: 'Please sign in to continue.' }}
      />
    )
  }

  return children
}

export default ProtectedRoute
