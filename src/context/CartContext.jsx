import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { cartService } from '../services/cartService'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'

export const CartContext = createContext(null)

function getCartStorageKey(user) {
  return `${LOCAL_STORAGE_KEYS.CART}:${user?.id || 'guest'}`
}

function normalizeCartProduct(product) {
  if (!product) return null

  return {
    ...product,
    name: product?.name || product?.title || 'Untitled Book',
    author:
      product?.author || product?.writer || product?.category || 'Featured edition',
    image:
      product?.image || product?.image_url || product?.cover_url || null,
    image_url:
      product?.image_url || product?.image || product?.cover_url || null,
    cover_url:
      product?.cover_url || product?.image_url || product?.image || null,
    price:
      typeof product?.price === 'number'
        ? product.price
        : typeof product?.price_cents === 'number'
          ? product.price_cents / 100
          : 0,
    quantity: product?.quantity || 1,
    cartItemId: product?.cartItemId || product?.cart_item_id || null,
  }
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const storageKey = useMemo(() => getCartStorageKey(user), [user])

  useEffect(() => {
    if (authLoading) return

    const stored = localStorage.getItem(storageKey)

    if (!stored) {
      setCartItems([])
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setCartItems(Array.isArray(parsed) ? parsed : [])
    } catch {
      localStorage.removeItem(storageKey)
      setCartItems([])
    }
  }, [authLoading, storageKey])

  useEffect(() => {
    if (authLoading) return
    localStorage.setItem(storageKey, JSON.stringify(cartItems))
  }, [authLoading, cartItems, storageKey])

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      throw new Error('Please sign in to add books to your cart.')
    }

    const normalizedProduct = normalizeCartProduct(product)
    const response = await cartService.add(normalizedProduct.id, quantity)
    const cartItem = response?.cart || {}

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === normalizedProduct.id)

      if (existing) {
        return prev.map((item) =>
          item.id === normalizedProduct.id
            ? {
                ...item,
                quantity: cartItem.quantity || item.quantity + quantity,
                cartItemId: cartItem.id || item.cartItemId,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          ...normalizedProduct,
          quantity: cartItem.quantity || quantity,
          cartItemId: cartItem.id || null,
        },
      ]
    })

    return response
  }

  const removeFromCart = async (productId) => {
    const currentItem = cartItems.find(
      (item) => String(item.id) === String(productId)
    )

    if (currentItem?.cartItemId) {
      await cartService.remove(currentItem.cartItemId)
    }

    setCartItems((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    )
  }

  const updateQuantity = async (productId, nextQuantity) => {
    const currentItem = cartItems.find(
      (item) => String(item.id) === String(productId)
    )

    if (!currentItem) return

    if (nextQuantity <= 0) {
      return removeFromCart(productId)
    }

    const action = nextQuantity > currentItem.quantity ? 'increase' : 'decrease'

    if (!currentItem.cartItemId) {
      throw new Error('Cart item is missing its server identifier.')
    }

    const response = await cartService.update(currentItem.cartItemId, action)

    if (
      action === 'decrease' &&
      !response?.quantity &&
      String(nextQuantity) === '0'
    ) {
      setCartItems((prev) =>
        prev.filter((item) => String(item.id) !== String(productId))
      )
      return response
    }

    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: response?.quantity ?? nextQuantity }
          : item
      )
    )

    return response
  }

  const clearCart = async () => {
    const removableItems = cartItems.filter((item) => item.cartItemId)

    await Promise.allSettled(
      removableItems.map((item) => cartService.remove(item.cartItemId))
    )

    setCartItems([])
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
