import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { productService } from '../services/productService'
import '../styles/BookDetail.css'

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function getBookImage(product) {
  return (
    product?.image ||
    product?.image_url ||
    product?.cover_url ||
    'https://via.placeholder.com/720x960'
  )
}

function getBookTitle(product) {
  return product?.name || product?.title || 'Untitled Book'
}

function getBookAuthor(product) {
  return product?.author || product?.writer || product?.category || 'Unknown author'
}

function getBookDescription(product) {
  return (
    product?.description ||
    'A thoughtfully curated title from our collection, selected for readers who love discovering memorable stories and beautifully crafted books.'
  )
}

function getStockLabel(product) {
  if (typeof product?.stock === 'number') {
    return `${product.stock} in stock`
  }

  if (typeof product?.quantity === 'number') {
    return `${product.quantity} in stock`
  }

  return 'In stock'
}

function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('Book not found.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    productService
      .getById(id)
      .then(setProduct)
      .catch(() => setError('Failed to load book details.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    setActionError(null)
    setAdding(true)

    try {
      await addToCart(product)
      navigate('/cart')
    } catch (err) {
      const message = err.message || 'Could not add this book to your cart.'

      if (/sign in|login/i.test(message)) {
        navigate('/login', {
          state: { message: 'Please sign in to add books to your cart.' },
        })
        return
      }

      setActionError(message)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <section className="book-detail-page">
        <div className="book-detail-status">Loading book details...</div>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="book-detail-page">
        <div className="book-detail-status error">
          <h1>We couldn&apos;t open this book</h1>
          <p>{error || 'The requested book could not be found.'}</p>
          <div className="book-detail-status-actions">
            <button
              type="button"
              className="book-detail-secondary-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Go back
            </button>
            <Link to="/" className="book-detail-primary-link">
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="book-detail-page">
      <button
        type="button"
        className="book-detail-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="book-detail-layout">
        <div className="book-detail-cover-panel">
          <img
            src={getBookImage(product)}
            alt={`Cover of ${getBookTitle(product)}`}
            className="book-detail-cover"
          />
        </div>

        <div className="book-detail-content">
          <h1 className="book-detail-title">{getBookTitle(product)}</h1>
          <p className="book-detail-author">by {getBookAuthor(product)}</p>
          <p className="book-detail-price">{formatPrice(product.price)}</p>
          <p className="book-detail-description">{getBookDescription(product)}</p>

          <div className="book-detail-actions">
            <button
              type="button"
              className="book-detail-primary-button"
              onClick={handleAddToCart}
              disabled={adding}
            >
              <ShoppingCart size={18} />
              <span>{adding ? 'Adding...' : 'Add to cart'}</span>
            </button>
            <span className="book-detail-stock">{getStockLabel(product)}</span>
          </div>

          {actionError && <p className="book-detail-description">{actionError}</p>}
        </div>
      </div>
    </section>
  )
}

export default BookDetail
