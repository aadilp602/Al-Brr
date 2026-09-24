import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

const products = [
  {
    id: 'al-durrat',
    name: 'Al-Durrat',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · ARABIAN LUXURY',
    description:
      'A deep oriental fragrance with warm woods, amber and refined aromatic notes.',
    price: 599,
  },
  {
    id: 'gen-z7',
    name: 'Gen-Z7',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · MODERN SIGNATURE',
    description:
      'Fresh, bold and energetic notes created for a confident everyday signature.',
    price: 599,
  },
  {
    id: 'alfa-x',
    name: 'Alfa-X',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · DARK ELEGANCE',
    description:
      'A powerful blend of woody, spicy and sensual notes with lasting character.',
    price: 599,
  },
  {
    id: 'al-avriq',
    name: 'Al-Avriq',
    category: 'Rouge',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · ROSE & AMBER',
    description:
      'A graceful floral composition with soft rose, amber and elegant sweetness.',
    price: 599,
  },
  {
    id: 'saji-oudh',
    name: 'Saji Oudh',
    category: 'Rouge',
    gender: 'UNISEX',
    inspired: 'INSPIRED BY · ROYAL OUDH',
    description:
      'Rich oud blended with warm oriental notes for an unmistakable presence.',
    price: 599,
  },
  {
    id: 'lucky-girl',
    name: 'Lucky Girl',
    category: 'Rouge',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · FEMININE CHARM',
    description:
      'A bright and beautiful fragrance with delicate floral and sweet notes.',
    price: 599,
  },
]

function ProductCard({ product }) {
  return (
    <article
      className={`luxury-product-card ${
        product.category === 'Rouge' ? 'rouge-card' : ''
      }`}
    >
      <Link
        to={`/products/${product.id}`}
        className="product-image-box"
      >
        <span className="product-gender">
          {product.gender}
        </span>

        <div className="product-image-placeholder">
          AL BRR
        </div>
      </Link>

      <div className="product-card-content">

        <p className="product-inspired">
          {product.inspired}
        </p>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-card-bottom">

          <span className="product-price">
            ₹{product.price}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="gold-button"
          >
            <span>◯</span>
            BUY NOW
          </Link>

        </div>

      </div>
    </article>
  )
}

function Products() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      const matchesCategory =
        category === 'All' ||
        product.category === category

      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [category, search])

  return (
    <div className="luxury-site">

      <Header />

      <main>

        {/* PAGE HERO */}

        <section className="products-page-hero">

          <div className="products-page-hero-inner">

            <p className="eyebrow">
              AL BRR PERFUMES · COLLECTION
            </p>

            <h1>
              OUR
              <br />
              <em>FRAGRANCES</em>
            </h1>

            <p>
              Discover the complete Al Brr collection.
              <br />
              Luxury-inspired fragrances starting at ₹599.
            </p>

          </div>

        </section>

        {/* FILTER AREA */}

        <section className="products-page-section">

          <div className="products-toolbar">

            <div className="category-buttons">

              {['All', 'Noir', 'Rouge'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={
                    category === item
                      ? 'filter-button active'
                      : 'filter-button'
                  }
                >
                  {item}
                </button>
              ))}

            </div>

            <div className="product-search">

              <input
                type="text"
                placeholder="SEARCH FRAGRANCE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          {/* PRODUCT COUNT */}

          <div className="products-result-header">

            <p>
              {filteredProducts.length} FRAGRANCES
            </p>

            <span>
              ₹599 EACH
            </span>

          </div>

          {/* PRODUCTS */}

          {filteredProducts.length > 0 ? (

            <div className="products-grid">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          ) : (

            <div className="products-empty">

              <p>NO FRAGRANCE FOUND</p>

              <button
                type="button"
                className="gold-button"
                onClick={() => {
                  setCategory('All')
                  setSearch('')
                }}
              >
                RESET FILTER
              </button>

            </div>

          )}

        </section>

        {/* BOTTOM CTA */}

        <section className="products-bottom-cta">

          <p className="eyebrow">
            THE ESSENCE OF GOODNESS
          </p>

          <h2>
            Find the fragrance
            <br />
            that becomes <em>you.</em>
          </h2>

          <Link
            to="/"
            className="gold-button"
          >
            BACK TO HOME
          </Link>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Products