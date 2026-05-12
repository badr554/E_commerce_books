import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import '../styles/Home.css'

function XssLab() {
  const [searchParams] = useSearchParams()
  const payload = searchParams.get('payload') || ''
  const labEnabled = import.meta.env.DEV

  if (!labEnabled) {
    return (
      <section className="home-feedback-panel home-feedback-error">
        <h1>XSS lab disabled</h1>
        <p>This intentionally vulnerable page is only available in local dev.</p>
        <Link to={ROUTES.HOME}>Back home</Link>
      </section>
    )
  }

  return (
    <section className="home-collection">
      <div className="home-collection-header">
        <h1 className="home-section-title">XSS vulnerable test page</h1>
      </div>

      <div className="home-security-alert">
        This page is intentionally vulnerable for local testing. Do not use this
        pattern in real app pages.
      </div>

      <div className="home-feedback-panel">
        <h2>Rendered unsafe payload</h2>
        <div dangerouslySetInnerHTML={{ __html: payload }} />
      </div>
    </section>
  )
}

export default XssLab
