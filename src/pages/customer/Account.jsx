import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../context/CartContext'

function Account() {
  const navigate = useNavigate()
  const { cartCount } = useCart()

  const currentUser = JSON.parse(
    localStorage.getItem('al-brr-current-user') || 'null'
  )

  const orders = JSON.parse(
    localStorage.getItem('al-brr-orders') || '[]'
  )

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="luxury-site">
        <Header />

        <main className="account-page">
          <div className="account-login-required">
            <p className="eyebrow">
              AL BRR PERFUMES
            </p>

            <h1>
              MY
              <br />
              <em>ACCOUNT</em>
            </h1>

            <p>
              Please sign in to access your account,
              cart and order history.
            </p>

            <div className="account-login-buttons">
              <Link
                to="/login"
                className="gold-button"
              >
                SIGN IN
              </Link>

              <Link
                to="/register"
                className="red-button"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Get only this user's orders
  const userOrders = orders.filter(
    (order) =>
      (
        order.userId &&
        currentUser.id &&
        order.userId === currentUser.id
      ) ||
      (
        order.customer?.email &&
        currentUser.email &&
        order.customer.email.toLowerCase() ===
          currentUser.email.toLowerCase()
      )
  )

  const handleLogout = () => {
    localStorage.removeItem('al-brr-current-user')
    navigate('/')
  }

  return (
    <div className="luxury-site">

      <Header />

      <main>

        {/* =========================
            ACCOUNT HERO
        ========================== */}

        <section className="account-hero">

          <div className="account-hero-inner">

            <p className="eyebrow">
              AL BRR PERFUMES
            </p>

            <h1>
              MY
              <br />
              <em>ACCOUNT</em>
            </h1>

            <p>
              Welcome back, {currentUser.name}.
            </p>

          </div>

        </section>


        {/* =========================
            ACCOUNT CONTENT
        ========================== */}

        <section className="account-section">

          <div className="account-layout">

            {/* =========================
                PROFILE CARD
            ========================== */}

            <div className="account-card">

              <div className="account-card-header">

                <div>

                  <p className="eyebrow">
                    YOUR PROFILE
                  </p>

                  <h2>
                    ACCOUNT
                    <br />
                    <em>INFORMATION</em>
                  </h2>

                </div>

              </div>


              {/* PROFILE INFORMATION */}

              <div className="account-info">

                <div>
                  <span>FULL NAME</span>
                  <strong>
                    {currentUser.name}
                  </strong>
                </div>

                <div>
                  <span>EMAIL ADDRESS</span>
                  <strong>
                    {currentUser.email}
                  </strong>
                </div>

                <div>
                  <span>PHONE NUMBER</span>
                  <strong>
                    {currentUser.phone}
                  </strong>
                </div>

              </div>


              {/* =========================
                  CART
              ========================== */}

              <div className="account-cart-link">

                <div>

                  <p className="eyebrow">
                    YOUR SHOPPING BAG
                  </p>

                  <h3>
                    MY <em>CART</em>
                  </h3>

                </div>

                <div className="account-cart-action">

                  <span>
                    {cartCount}{' '}
                    {cartCount === 1
                      ? 'ITEM'
                      : 'ITEMS'}
                  </span>

                  <Link
                    to="/cart"
                    className="gold-button"
                  >
                    VIEW CART
                  </Link>

                </div>

              </div>


              {/* LOGOUT */}

              <button
                type="button"
                className="account-logout"
                onClick={handleLogout}
              >
                LOG OUT
              </button>

            </div>


            {/* =========================
                ORDERS
            ========================== */}

            <div className="account-orders">

              <div className="account-orders-header">

                <div>

                  <p className="eyebrow">
                    YOUR HISTORY
                  </p>

                  <h2>
                    MY <em>ORDERS</em>
                  </h2>

                </div>

                <span className="orders-count">
                  {userOrders.length}
                </span>

              </div>


              {/* NO ORDERS */}

              {userOrders.length === 0 ? (

                <div className="account-no-orders">

                  <span>
                    ◯
                  </span>

                  <h3>
                    No orders yet.
                  </h3>

                  <p>
                    Your fragrance journey starts here.
                  </p>

                  <Link
                    to="/products"
                    className="gold-button"
                  >
                    EXPLORE PRODUCTS
                  </Link>

                </div>

              ) : (

                /* ORDERS LIST */

                <div className="account-order-list">

                  {userOrders
                    .slice()
                    .reverse()
                    .map((order) => (

                      <Link
                        key={order.id}
                        to={`/account/orders/${order.id}`}
                        className="account-order"
                      >

                        {/* ORDER */}

                        <div className="account-order-main">

                          <span className="account-order-label">
                            ORDER
                          </span>

                          <strong>
                            {order.id}
                          </strong>

                          <small>
                            {new Date(
                              order.createdAt || Date.now()
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </small>

                        </div>


                        {/* STATUS */}

                        <div className="account-order-status">

                          <span>
                            STATUS
                          </span>

                          <strong>
                            {order.orderStatus || 'Pending'}
                          </strong>

                        </div>


                        {/* TOTAL */}

                        <div className="account-order-total">

                          <span>
                            TOTAL
                          </span>

                          <strong>
                            ₹{order.total}
                          </strong>

                        </div>


                        {/* ARROW */}

                        <div className="account-order-arrow">
                          →
                        </div>

                      </Link>

                    ))}

                </div>

              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Account