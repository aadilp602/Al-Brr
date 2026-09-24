import { Link, useParams } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function OrderDetails() {
  const { id } = useParams()

  const orders = JSON.parse(
    localStorage.getItem('al-brr-orders') || '[]'
  )

  const order = orders.find(
    (item) => item.id === id
  )

  if (!order) {
    return (
      <div className="luxury-site">

        <Header />

        <main className="order-not-found">

          <p className="eyebrow">
            AL BRR PERFUMES
          </p>

          <h1>
            ORDER
            <br />
            <em>NOT FOUND</em>
          </h1>

          <Link
            to="/products"
            className="gold-button"
          >
            EXPLORE PRODUCTS
          </Link>

        </main>

        <Footer />

      </div>
    )
  }

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="luxury-site">

      <Header />

      <main>

        <section className="order-details-hero">

          <div>

            <p className="eyebrow">
              ORDER DETAILS
            </p>

            <h1>
              {order.id}
            </h1>

            <p>
              Placed on {orderDate}
            </p>

          </div>

          <span className="order-status">
            {order.orderStatus}
          </span>

        </section>

        <section className="order-details-section">

          <div className="order-details-layout">

            {/* PRODUCTS */}

            <div className="order-products">

              <div className="order-section-heading">

                <p className="eyebrow">
                  YOUR FRAGRANCES
                </p>

                <h2>
                  Order Items
                </h2>

              </div>

              {order.items.map((item) => (

                <div
                  className="order-product"
                  key={item.id}
                >

                  <div className="order-product-image">
                    AL BRR
                  </div>

                  <div className="order-product-info">

                    <span>
                      {item.category}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                </div>

              ))}

            </div>

            {/* DETAILS */}

            <aside className="order-info-card">

              <p className="eyebrow">
                DELIVERY DETAILS
              </p>

              <h2>
                Shipping
              </h2>

              <div className="order-customer">

                <strong>
                  {order.customer.name}
                </strong>

                <span>
                  {order.customer.phone}
                </span>

                {order.customer.email && (
                  <span>
                    {order.customer.email}
                  </span>
                )}

                <p>
                  {order.customer.address}
                  <br />
                  {order.customer.city},{' '}
                  {order.customer.state}
                  <br />
                  {order.customer.pincode}
                </p>

              </div>

              <div className="order-payment">

                <div>
                  <span>
                    PAYMENT
                  </span>

                  <strong>
                    {order.paymentMethod === 'COD'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                  </strong>
                </div>

                <div>
                  <span>
                    PAYMENT STATUS
                  </span>

                  <strong>
                    {order.paymentStatus}
                  </strong>
                </div>

              </div>

              <div className="order-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹{order.total}
                </strong>

              </div>

            </aside>

          </div>

          <div className="order-actions">

            <Link
              to="/products"
              className="gold-button"
            >
              CONTINUE SHOPPING
            </Link>

            <Link
              to="/"
              className="continue-shopping"
            >
              ← BACK TO HOME
            </Link>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default OrderDetails