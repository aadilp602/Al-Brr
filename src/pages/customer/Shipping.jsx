import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Shipping() {
  return (
    <>
      <Header />

      <main>
        <section>
          <h1>Shipping & Delivery</h1>

          <p>
            Information about order shipping and delivery.
          </p>
        </section>

        <section>
          <h2>Delivery Information</h2>

          <p>
            Your order will be processed and shipped
            according to the delivery details provided
            during checkout.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Shipping