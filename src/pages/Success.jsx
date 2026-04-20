import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { ROUTES } from '../utils/constants'

function Success() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.icon}>✓</div>
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase. A confirmation email has been sent.</p>
      <Link to={ROUTES.HOME} style={styles.btn}>Continue Shopping</Link>
    </div>
  )
}

const styles = {
  container: { textAlign: 'center', marginTop: '80px' },
  icon: { width: '70px', height: '70px', background: '#4caf50', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' },
  btn: { display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: '#e94560', color: '#fff', borderRadius: '4px' },
}

export default Success
