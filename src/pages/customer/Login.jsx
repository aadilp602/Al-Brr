import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    const users = JSON.parse(
      localStorage.getItem('al-brr-users') || '[]'
    )

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === form.email.toLowerCase() &&
        item.password === form.password
    )

    if (!user) {
      setError('Invalid email or password.')
      return
    }

    localStorage.setItem(
      'al-brr-current-user',
      JSON.stringify(user)
    )

    navigate('/account')
  }

  return (
    <div className="luxury-site">

      <Header />

      <main className="auth-page">

        <div className="auth-container">

          <p className="eyebrow">
            AL BRR PERFUMES
          </p>

          <h1>
            WELCOME
            <br />
            <em>BACK</em>
          </h1>

          <p className="auth-description">
            Sign in to access your account,
            orders and fragrance collection.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="auth-field">
              <label>
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="auth-field">
              <label>
                PASSWORD
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="gold-button auth-submit"
            >
              SIGN IN
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account?
            {' '}

            <Link to="/register">
              CREATE ACCOUNT
            </Link>
          </p>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default Login