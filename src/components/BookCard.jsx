import React from 'react'
import { Link } from 'react-router-dom'

function BookCard({ product }) {
  const title = product?.name || product?.title || 'Untitled Book'
  const author = product?.author || product?.writer || product?.category || 'Featured edition'
  const price = Number(product?.price || 0).toFixed(2)
  const image = product?.image || product?.image_url || product?.cover_url || null
  const fallbackInitial = title.trim().charAt(0).toUpperCase() || 'B'

  return (
    <article className="book-card">
      <Link to={`/book/${product.id}`} className="book-card-link">
        <div className="book-card-cover">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="book-card-cover-fallback">{fallbackInitial}</div>
          )}
        </div>
      </Link>

      <div className="book-card-body">
        <Link to={`/book/${product.id}`} className="book-card-link">
          <h3 className="book-card-title">{title}</h3>
        </Link>

        <p className="book-card-meta">{author}</p>
        <p className="book-card-price">${price}</p>
      </div>
    </article>
  )
}

export default BookCard
