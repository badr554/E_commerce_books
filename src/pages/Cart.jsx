import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../hooks/useCart'
import { ROUTES } from '../utils/constants'

function Cart() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2>Your cart is empty</h2>
        <Link to={ROUTES.HOME}>Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Shopping Cart</h2>
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      <div style={styles.summary}>
        <p style={styles.total}>Total: <strong>${totalPrice.toFixed(2)}</strong></p>
        <div style={styles.actions}>
          <button onClick={clearCart} style={styles.clearBtn}>Clear Cart</button>
          <button onClick={() => navigate(ROUTES.CHECKOUT)} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  summary: { marginTop: '24px', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  total: { fontSize: '18px', marginBottom: '16px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  clearBtn: { padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  checkoutBtn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
}

export default Cart
