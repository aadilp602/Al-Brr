import { useState } from 'react'
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { useCart } from '../../context/CartContext'

function Header() {
  const { cartCount } = useCart()

  const navigate = useNavigate()
  const location = useLocation()

  const [accountOpen, setAccountOpen] = useState(false)

  const currentUser = JSON.parse(
    localStorage.getItem('al-brr-current-user') || 'null'
  )

  // =========================================
  // SCROLL TO HOME SECTION
  // =========================================

  const scrollToSection = (sectionId) => {
    const scroll = () => {
      const section = document.getElementById(sectionId)

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }

    if (location.pathname === '/') {
      navigate(`/#${sectionId}`)

      setTimeout(() => {
        scroll()
      }, 50)

      return
    }

    navigate(`/#${sectionId}`)

    setTimeout(() => {
      scroll()
    }, 200)
  }

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem('al-brr-current-user')

    setAccountOpen(false)

    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* =====================================
            LOGO + AL BRR
        ====================================== */}

        <Link
          to="/"
          className="brand brand-logo-link"
          aria-label="Al Brr Perfumes Home"
        >
          <img
            src="/images/al-brr-logo.png"
            alt="Al Brr Perfumes"
            className="header-brand-logo"
          />

          <span className="header-brand-name">
            <strong>AL BRR</strong>
          </span>
        </Link>

        {/* =====================================
            NAVIGATION
        ====================================== */}

        <nav className="main-nav">

          {/* NOIR */}

          <button
            type="button"
            className={
              location.pathname === '/' &&
              location.hash === '#noir'
                ? 'nav-section-link nav-active'
                : 'nav-section-link'
            }
            onClick={() => scrollToSection('noir')}
          >
            NOIR
          </button>

          {/* ROUGE */}

          <button
            type="button"
            className={
              location.pathname === '/' &&
              location.hash === '#rouge'
                ? 'nav-section-link nav-active'
                : 'nav-section-link'
            }
            onClick={() => scrollToSection('rouge')}
          >
            ROUGE
          </button>

          {/* STORY */}

          <button
            type="button"
            className={
              location.pathname === '/' &&
              location.hash === '#story'
                ? 'nav-section-link nav-active'
                : 'nav-section-link'
            }
            onClick={() => scrollToSection('story')}
          >
            STORY
          </button>

          {/* PRODUCTS */}

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'nav-active' : ''
            }
          >
            PRODUCTS
          </NavLink>

          {/* CONTACT */}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'nav-active' : ''
            }
          >
            CONTACT
          </NavLink>

          {/* =====================================
              PROFILE / ACCOUNT
          ====================================== */}

          <div className="account-dropdown">

            <button
              type="button"
              aria-label="Account"
              title={
                currentUser
                  ? currentUser.name
                  : 'Account'
              }
              className={
                location.pathname === '/account' ||
                location.pathname.startsWith('/account/') ||
                location.pathname === '/login' ||
                location.pathname === '/register' ||
                location.pathname === '/cart'
                  ? 'account-profile-button profile-active'
                  : 'account-profile-button'
              }
              onClick={() =>
                setAccountOpen(
                  (current) => !current
                )
              }
            >

              {/* LOGGED IN */}

              {currentUser ? (
                <span className="profile-initial">
                  {currentUser.name
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              ) : (

                /* LOGGED OUT */

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                  />

                  <path
                    d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"
                  />
                </svg>
              )}

            </button>

            {/* =====================================
                ACCOUNT DROPDOWN
            ====================================== */}

            {accountOpen && (
              <div className="account-dropdown-menu">

                {currentUser ? (

                  /* =============================
                     LOGGED IN USER
                  ============================== */

                  <>
                    <div className="account-dropdown-user">
                      <span>
                        WELCOME
                      </span>

                      <strong>
                        {currentUser.name}
                      </strong>
                    </div>

                    {/* MY ACCOUNT */}

                    <Link
                      to="/account"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      MY ACCOUNT
                    </Link>

                    {/* MY ORDERS */}

                    <Link
                      to="/account"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      MY ORDERS
                    </Link>

                    {/* CART */}

                    <Link
                      to="/cart"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      <span>
                        CART
                      </span>

                      {cartCount > 0 && (
                        <span className="dropdown-cart-count">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    <div className="dropdown-divider" />

                    {/* LOGOUT */}

                    <button
                      type="button"
                      className="dropdown-logout"
                      onClick={handleLogout}
                    >
                      LOG OUT
                    </button>
                  </>

                ) : (

                  /* =============================
                     LOGGED OUT USER
                  ============================== */

                  <>
                    <div className="account-dropdown-user">
                      <span>
                        AL BRR PERFUMES
                      </span>

                      <strong>
                        WELCOME
                      </strong>
                    </div>

                    {/* LOGIN */}

                    <Link
                      to="/login"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      SIGN IN
                    </Link>

                    {/* REGISTER */}

                    <Link
                      to="/register"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      CREATE ACCOUNT
                    </Link>

                    {/* CART */}

                    <Link
                      to="/cart"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      <span>
                        CART
                      </span>

                      {cartCount > 0 && (
                        <span className="dropdown-cart-count">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>

                )}

              </div>
            )}

          </div>

        </nav>

        {/* =====================================
            ORDER NOW
        ====================================== */}

        <Link
          to="/products"
          className="header-order-button"
        >
          <span>
            ◯
          </span>

          ORDER NOW
        </Link>

      </div>
    </header>
  )
}

export default Header