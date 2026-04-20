import React, { useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        style={styles.input}
      />
      <button type="submit" style={styles.btn}>Search</button>
    </form>
  )
}

const styles = {
  form: { display: 'flex', gap: '8px', marginBottom: '24px' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px' },
  btn: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
}

export default SearchBar
