import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'al-brr-admin-session'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      setError('Admin credentials are not configured.')
      return
    }

    if (
      email.trim().toLowerCase() !==
        adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      setError('Invalid email or password.')
      return
    }

    const session = {
      authenticated: true,
      email: adminEmail,
      loginAt: new Date().toISOString(),
    }

    sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify(session)
    )

    navigate('/admin', {
      replace: true,
    })
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-brand-mark">
            AB
          </div>

          <p>AL BRR</p>
          <span>PERFUMES</span>
        </div>

        <div className="admin-login-heading">
          <p>SECURE ADMINISTRATION</p>

          <h1>Admin Login</h1>

          <span>
            Sign in to access the Al Brr administration
            panel.
          </span>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-login-field">
            <label>Email Address</label>

            <input
              type="email"
              autoComplete="username"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              required
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              required
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
          >
            Sign In
          </button>
        </form>

        <div className="admin-login-footer">
          <span>AL BRR PERFUMES</span>
          <p>Private Administration</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin