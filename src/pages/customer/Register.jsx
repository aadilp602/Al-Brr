import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Register() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
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

        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError('Please fill all fields.')
            return
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (!/^\d{10}$/.test(form.phone)) {
            setError('Please enter a valid 10 digit phone number.')
            return
        }

        const users = JSON.parse(
            localStorage.getItem('al-brr-users') || '[]'
        )

        const existingUser = users.find(
            (item) =>
                item.email.toLowerCase() === form.email.toLowerCase()
        )

        if (existingUser) {
            setError('An account with this email already exists.')
            return
        }

        const newUser = {
            id: `USR-${Date.now()}`,
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            createdAt: new Date().toISOString(),
        }

        localStorage.setItem(
            'al-brr-users',
            JSON.stringify([...users, newUser])
        )

        localStorage.setItem(
            'al-brr-current-user',
            JSON.stringify(newUser)
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
                        CREATE
                        <br />
                        <em>ACCOUNT</em>
                    </h1>

                    <p className="auth-description">
                        Create your account and keep your
                        fragrance journey in one place.
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
                                FULL NAME
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="auth-field">
                            <label>
                                EMAIL ADDRESS
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your email"
                            />
                        </div>

                        <div className="auth-field">
                            <label>
                                PHONE NUMBER
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)

                                    setForm({
                                        ...form,
                                        phone: value,
                                    })
                                }}
                                placeholder="10 digit phone number"
                                inputMode="numeric"
                                maxLength={10}
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
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div className="auth-field">
                            <label>
                                CONFIRM PASSWORD
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="gold-button auth-submit"
                        >
                            CREATE ACCOUNT
                        </button>

                    </form>

                    <p className="auth-switch">
                        Already have an account?
                        {' '}

                        <Link to="/login">
                            SIGN IN
                        </Link>
                    </p>

                </div>

            </main>

            <Footer />

        </div>
    )
}

export default Register