import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { ROUTES } from '../utils/constants'

function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <nav style={styles.nav}>
      <Link to={ROUTES.HOME} style={styles.logo}>ShopNow</Link>
      <div style={styles.links}>
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.CART}>Cart ({totalItems})</Link>
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN}>Login</Link>
            <Link to={ROUTES.REGISTER}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', background: '#1a1a2e', color: '#fff' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#e94560' },
  links: { display: 'flex', gap: '20px', alignItems: 'center', color: '#fff' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' },
}

export default Navbar
