import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { sanitizeObject } from '../utils/sanitize'
import { ROUTES } from '../utils/constants'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(sanitizeObject(form))
      navigate(ROUTES.HOME)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={8}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to={ROUTES.LOGIN}>Login</Link></p>
    </div>
  )
}

const styles = {
  container: { maxWidth: '400px', margin: '60px auto', padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' },
  input: { padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px' },
  btn: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', fontSize: '14px' },
}

export default Register
