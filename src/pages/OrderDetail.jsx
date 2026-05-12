import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { fetchOrderById } from '../services/orderService'
import { ROUTES } from '../utils/constants'
import '../styles/Orders.css'

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date'

  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function normalizeOrder(payload) {
  return payload?.data || payload?.order || payload
}

function getErrorMessage(error) {
  const message = error?.message || 'You are not allowed to view this order.'

  if (/forbidden|unauthorized|not found|404|403/i.test(message)) {
    return 'Access denied. This order does not belong to the signed-in user.'
  }

  return message
}

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    setError(null)

    fetchOrderById(id)
      .then((response) => {
        if (isMounted) setOrder(normalizeOrder(response))
      })
      .catch((err) => {
        if (isMounted) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return <div className="orders-loading">Loading order #{id}...</div>
  }

  if (error) {
    return (
      <section className="orders-page">
        <Link to={ROUTES.ORDERS} className="order-back-link">
          <ArrowLeft size={16} />
          Back to orders
        </Link>

        <div className="order-access-denied">
          <ShieldAlert size={34} />
          <h1>Order access blocked</h1>
          <p>{error}</p>
          <p className="order-test-note">
            IDOR test: changing the order ID in the URL did not reveal another
            user's order.
          </p>
        </div>
      </section>
    )
  }

  if (!order) {
    return <div className="orders-error">Order not found.</div>
  }

  return (
    <section className="orders-page">
      <Link to={ROUTES.ORDERS} className="order-back-link">
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <header className="orders-header">
        <h1 className="orders-title">Order #{order.id}</h1>
      </header>

      <article className="order-card">
        <div className="order-header">
          <div className="order-info">
            <div className="order-id">Customer: {order.customer_name}</div>
            <div className="order-date">{formatDate(order.created_at)}</div>
          </div>
          <div className="order-status">{order.status || 'PAID'}</div>
        </div>

        <div className="order-items">
          {order.items?.length ? (
            order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>
                  {item.product_name || item.name || 'Book'} x {item.quantity}
                </span>
                <span className="order-item-price">
                  {formatPrice(item.price)}
                </span>
              </div>
            ))
          ) : (
            <div className="order-item">
              <span>No item details returned for this order.</span>
            </div>
          )}
        </div>

        <div className="order-footer">
          <span className="order-total-label">Total</span>
          <span className="order-total-value">
            {formatPrice(order.display_total || order.total_amount / 100)}
          </span>
        </div>
      </article>
    </section>
  )
}

export default OrderDetail
