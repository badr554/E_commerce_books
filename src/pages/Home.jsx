import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import { productService } from '../services/productService'
import { sanitizeInput } from '../utils/sanitize'
import '../styles/Home.css'

function normalizeProducts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function matchesQuery(product, query) {
  const haystack = [
    product?.name,
    product?.title,
    product?.author,
    product?.writer,
    product?.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const rawQuery = (searchParams.get('q') || '').trim().slice(0, 100)
  const query = sanitizeInput(rawQuery)

  useEffect(() => {
    setLoading(true)
    setError(null)

    productService
      .getAll()
      .then((response) => setProducts(normalizeProducts(response)))
      .catch(() => {
        setProducts([])
        setError('Failed to load books right now.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    if (!rawQuery) return products

    const normalizedQuery = rawQuery.toLowerCase()
    return products.filter((product) => matchesQuery(product, normalizedQuery))
  }, [products, rawQuery])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-hero-kicker">Curated shelves</p>
          <h1 className="home-hero-title">Books worth keeping.</h1>
          <p className="home-hero-description">
            A small, carefully chosen library of fiction, ideas, and
            beautifully made things shipped from our shop to your shelf.
          </p>
        </div>
      </section>

      <section className="home-collection">
        <div className="home-collection-header">
          <h2 className="home-section-title">
            {query ? `Results for "${query}"` : "This season's selection"}
          </h2>
          <span className="home-count">
            {loading ? 'Loading...' : `${filteredProducts.length} books`}
          </span>
        </div>

        {error && !products.length ? (
          <div className="home-feedback-panel home-feedback-error">
            <h3>We couldn&apos;t load the library</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="home-grid" aria-label="Loading books">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="home-skeleton-card">
                <div className="home-skeleton-image" />
                <div className="home-skeleton-line short" />
                <div className="home-skeleton-line" />
                <div className="home-skeleton-line price" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="home-feedback-panel">
            <h3>No books match your search.</h3>
            <p>Try a different title, author, or keyword from the header search.</p>
          </div>
        ) : (
          <div className="home-grid">
            {filteredProducts.map((product) => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
