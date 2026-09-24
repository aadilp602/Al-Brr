import { Link, useParams } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function OrderSuccess() {
  const { id } = useParams()

  return (
    <div className="luxury-site">

      <Header />

      <main className="order-success">

        <div className="success-icon">
          ✓
        </div>

        <p className="eyebrow">
          AL BRR PERFUMES
        </p>

        <h1>
          ORDER
          <br />
          <em>CONFIRMED</em>
        </h1>

        <p className="success-message">
          Thank you for choosing Al Brr Perfumes.
          Your fragrance journey has officially begun.
        </p>

        <div className="success-order-id">

          <span>
            ORDER ID
          </span>

          <strong>
            {id}
          </strong>

        </div>

        <div className="success-buttons">

          <Link
            to={`/account/orders/${id}`}
            className="gold-button"
          >
            VIEW ORDER
          </Link>

          <Link
            to="/products"
            className="red-button"
          >
            CONTINUE SHOPPING
          </Link>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default OrderSuccess