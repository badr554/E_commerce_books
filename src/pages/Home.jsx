import React, { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import { productService } from '../services/productService'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = async (query) => {
    if (!query) return
    setLoading(true)
    productService.search(query)
      .then(setProducts)
      .catch(() => setError('Search failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Our Products</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <BookCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Home
