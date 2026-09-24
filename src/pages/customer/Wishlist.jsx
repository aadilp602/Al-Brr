import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Wishlist() {
  return (
    <>
      <Header />

      <main>
        <section>
          <h1>My Wishlist</h1>
          <p>Save your favorite perfumes for later.</p>
        </section>

        <section>
          <h2>Wishlist Items</h2>

          <div>
            <p>Your wishlist is empty.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Wishlist