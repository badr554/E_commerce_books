import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { paymentService } from '../services/paymentService'
import { ROUTES } from '../utils/constants'
import '../styles/Checkout.css'

const SHIPPING_FIELDS = [
  { name: 'name', label: 'Full name', maxLength: 100, autoComplete: 'name' },
  {
    name: 'address',
    label: 'Street address',
    maxLength: 200,
    autoComplete: 'street-address',
  },
  { name: 'city', label: 'City', maxLength: 80, autoComplete: 'address-level2' },
  {
    name: 'postal',
    label: 'Postal code',
    maxLength: 20,
    autoComplete: 'postal-code',
  },
  {
    name: 'country',
    label: 'Country',
    maxLength: 60,
    autoComplete: 'country-name',
  },
]

const INITIAL_FORM = {
  name: '',
  address: '',
  city: '',
  postal: '',
  country: '',
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function validateForm(form) {
  const nextErrors = {}

  if (!form.name.trim()) nextErrors.name = 'Full name is required.'
  if (!form.address.trim()) nextErrors.address = 'Street address is required.'
  if (!form.city.trim()) nextErrors.city = 'City is required.'
  if (!form.postal.trim()) nextErrors.postal = 'Postal code is required.'
  if (!form.country.trim()) nextErrors.country = 'Country is required.'

  return nextErrors
}

function Checkout() {
  const { cartItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      return { ...prev, [field]: null }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { url } = await paymentService.createCheckoutSession(cartItems)
      if (!url) {
        throw new Error('No checkout URL returned.')
      }
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-empty">
        <div className="checkout-empty-card">
          <span className="checkout-empty-badge">Checkout</span>
          <h1 className="checkout-empty-title">Your cart is empty</h1>
          <p className="checkout-empty-text">
            Add a few books to your cart first, then come back here to complete
            your order.
          </p>
          <div className="checkout-empty-actions">
            <button
              type="button"
              className="checkout-secondary-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Go back
            </button>
            <Link to={ROUTES.HOME} className="checkout-primary-link">
              Browse books
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="checkout-hero">
        <span className="checkout-eyebrow">Secure checkout</span>
        <h1 className="checkout-title">Review your order and shipping details</h1>
        <p className="checkout-description">
          Complete your shipping information, review your books, and continue to
          secure payment.
        </p>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-main-panel">
          <div className="checkout-panel-header">
            <div>
              <h2>Shipping details</h2>
              <p>Use the address where you want your order delivered.</p>
            </div>
            <div className="checkout-panel-icon">
              <MapPin size={18} />
            </div>
          </div>

          <div className="checkout-benefits">
            <div className="checkout-benefit">
              <Truck size={18} />
              <span>Fast delivery updates</span>
            </div>
            <div className="checkout-benefit">
              <ShieldCheck size={18} />
              <span>Protected checkout flow</span>
            </div>
            <div className="checkout-benefit">
              <LockKeyhole size={18} />
              <span>Encrypted payment redirect</span>
            </div>
          </div>

          <div className="checkout-fields">
            {SHIPPING_FIELDS.map((field) => (
              <div
                key={field.name}
                className={`checkout-field ${
                  field.name === 'address' ? 'checkout-field-full' : ''
                }`}
              >
                <label className="checkout-label" htmlFor={field.name}>
                  {field.label}
                </label>
                <input
                  id={field.name}
                  className={`checkout-input ${
                    errors[field.name] ? 'has-error' : ''
                  }`}
                  type="text"
                  value={form[field.name]}
                  maxLength={field.maxLength}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(errors[field.name])}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={loading}
                />
                {errors[field.name] && (
                  <p className="checkout-field-error">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {error && <p className="checkout-error-banner">{error}</p>}
        </div>

        <aside className="checkout-summary-panel">
          <div className="checkout-summary-header">
            <div>
              <h2>Order summary</h2>
              <p>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in
                your cart
              </p>
            </div>
            <div className="checkout-panel-icon">
              <CreditCard size={18} />
            </div>
          </div>

          <ul className="checkout-summary-list">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-summary-item">
                <div className="checkout-summary-copy">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-meta">
                    Qty {item.quantity}
                  </span>
                </div>
                <span className="checkout-item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Shipping</span>
              <span>Calculated at payment</span>
            </div>
            <div className="checkout-total-row total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-primary-button"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Pay now'}
          </button>

          <Link to={ROUTES.CART} className="checkout-back-link">
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <p className="checkout-note">
            Final payment is handled securely on the next step after Stripe
            checkout opens.
          </p>
        </aside>
      </form>
    </section>
  )
}

export default Checkout
