import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
