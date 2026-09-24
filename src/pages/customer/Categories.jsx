import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Categories() {
  return (
    <>
      <Header />

      <main>
        {/* Page Header */}
        <section>
          <h1>Shop By Category</h1>

          <p>
            Explore fragrances by category.
          </p>
        </section>

        {/* Categories */}
        <section>
          <h2>Categories</h2>

          <div>
            <p>Categories will appear here.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Categories