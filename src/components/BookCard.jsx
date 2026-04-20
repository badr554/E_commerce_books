import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

function BookCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div style={styles.card}>
      <Link to={`/book/${product.id}`} style={styles.link}>
        <img
          src={product.image || 'https://via.placeholder.com/200x250'}
          alt={product.name}
          style={styles.image}
        />
      </Link>
      <div style={styles.body}>
        <Link to={`/book/${product.id}`} style={styles.titleLink}>
          <h3 style={styles.title}>{product.name}</h3>
        </Link>
        <p style={styles.price}>${product.price?.toFixed(2)}</p>
        <button onClick={() => addToCart(product)} style={styles.btn}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '220px' },
  link: { display: 'block' },
  image: { width: '100%', height: '220px', objectFit: 'cover' },
  body: { padding: '12px' },
  title: { fontSize: '15px', marginBottom: '8px' },
  titleLink: { display: 'block', color: 'inherit' },
  price: { color: '#e94560', fontWeight: 'bold', marginBottom: '10px' },
  btn: { width: '100%', padding: '8px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
}

export default BookCard
