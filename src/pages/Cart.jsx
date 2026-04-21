import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import CartItem from '../components/CartItem'
import { useCart } from '../hooks/useCart'
import { ROUTES } from '../utils/constants'
import '../styles/Cart.css'

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function Cart() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClearCart = async () => {
    setError(null)
    setLoading(true)

    try {
      await clearCart()
    } catch (err) {
      setError(err.message || 'Could not clear your cart right now.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-empty-page">
        <div className="cart-empty-card">
          <span className="cart-empty-badge">Your cart</span>
          <h1 className="cart-empty-title">Nothing here yet.</h1>
          <p className="cart-empty-text">
            Add a few titles you love, and they&apos;ll appear here ready for
            checkout.
          </p>
          <div className="cart-empty-actions">
            <Link to={ROUTES.HOME} className="cart-primary-link">
              Continue browsing
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">Your cart</h1>
      </header>

      <div className="cart-layout">
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="cart-summary-panel">
          <div className="cart-summary-header">
            <h2>Order summary</h2>
          </div>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <div className="cart-summary-row muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button
            type="button"
            className="cart-primary-button"
            onClick={() => navigate(ROUTES.CHECKOUT)}
            disabled={loading}
          >
            Proceed to checkout
          </button>

          <button
            type="button"
            className="cart-secondary-button"
            onClick={handleClearCart}
            disabled={loading}
          >
            <ShoppingBag size={18} />
            <span>{loading ? 'Clearing...' : 'Clear cart'}</span>
          </button>

          {error && <p className="cart-inline-error">{error}</p>}

          <Link to={ROUTES.HOME} className="cart-back-link">
            <span>Continue shopping</span>
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default Cart
