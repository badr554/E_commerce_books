import React from 'react'
import { useCart } from '../hooks/useCart'

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div style={styles.row}>
      <img
        src={item.image || 'https://via.placeholder.com/80x80'}
        alt={item.name}
        style={styles.image}
      />
      <div style={styles.info}>
        <p style={styles.name}>{item.name}</p>
        <p style={styles.price}>${item.price?.toFixed(2)}</p>
      </div>
      <div style={styles.controls}>
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <p style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
      <button onClick={() => removeFromCart(item.id)} style={styles.remove}>✕</button>
    </div>
  )
}

const styles = {
  row: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #eee' },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  info: { flex: 1 },
  name: { fontWeight: 'bold' },
  price: { color: '#888', fontSize: '14px' },
  controls: { display: 'flex', alignItems: 'center', gap: '8px' },
  subtotal: { fontWeight: 'bold', minWidth: '60px', textAlign: 'right' },
  remove: { background: 'none', border: 'none', cursor: 'pointer', color: '#e94560', fontSize: '16px' },
}

export default CartItem
