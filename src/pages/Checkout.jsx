import React, { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { paymentService } from '../services/paymentService'

function Checkout() {
  const { cartItems, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)
    try {
      const { url } = await paymentService.createCheckoutSession(cartItems)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>
      <div style={styles.summary}>
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.row}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={styles.total}>
          <strong>Total</strong>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={handlePayment} disabled={loading} style={styles.btn}>
        {loading ? 'Redirecting...' : 'Pay Now'}
      </button>
    </div>
  )
}

const styles = {
  container: { maxWidth: '600px', margin: '0 auto' },
  summary: { background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' },
  total: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '18px' },
  btn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '12px' },
}

export default Checkout
