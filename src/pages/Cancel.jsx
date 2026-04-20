import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

function Cancel() {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>✕</div>
      <h2>Payment Cancelled</h2>
      <p>Your order was not completed. You can try again or return to shopping.</p>
      <div style={styles.actions}>
        <Link to={ROUTES.CART} style={styles.retryBtn}>Back to Cart</Link>
        <Link to={ROUTES.HOME} style={styles.homeBtn}>Continue Shopping</Link>
      </div>
    </div>
  )
}

const styles = {
  container: { textAlign: 'center', marginTop: '80px' },
  icon: { width: '70px', height: '70px', background: '#e94560', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' },
  actions: { display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' },
  retryBtn: { padding: '12px 24px', background: '#1a1a2e', color: '#fff', borderRadius: '4px' },
  homeBtn: { padding: '12px 24px', background: '#e94560', color: '#fff', borderRadius: '4px' },
}

export default Cancel
