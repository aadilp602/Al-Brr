import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function SearchResults() {
  return (
    <>
      <Header />

      <main>
        <section>
          <h1>Search Results</h1>
          <p>Find your favorite fragrances.</p>
        </section>

        <section>
          <input
            type="text"
            placeholder="Search perfumes..."
          />

          <div>
            <p>No products found.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default SearchResults