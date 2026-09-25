import { Link } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

const noirProducts = [
  {
    name: 'Al-Durrat',
    gender: 'MEN',
    inspired: 'INSPIRED BY · ARABIAN LUXURY',
    description:
      'A deep oriental fragrance with warm woods, amber and refined aromatic notes.',
    price: '₹599',
  },
  {
    name: 'Gen-Z7',
    gender: 'MEN',
    inspired: 'INSPIRED BY · MODERN SIGNATURE',
    description:
      'Fresh, bold and energetic notes created for a confident everyday signature.',
    price: '₹599',
  },
  {
    name: 'Alfa-Men',
    gender: 'MEN',
    inspired: 'INSPIRED BY · DARK ELEGANCE',
    description:
      'A powerful blend of woody, spicy and sensual notes with lasting character.',
    price: '₹599',
  },
]

const rougeProducts = [
  {
    name: 'Al-Avriq',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · ROSE & AMBER',
    description:
      'A graceful floral composition with soft rose, amber and elegant sweetness.',
    price: '₹599',
  },
  {
    name: 'Saji Oudh',
    gender: 'UNISEX',
    inspired: 'INSPIRED BY · ROYAL OUDH',
    description:
      'Rich oud blended with warm oriental notes for an unmistakable presence.',
    price: '₹599',
  },
  {
    name: 'Lucky Girl',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · FEMININE CHARM',
    description:
      'A bright and beautiful fragrance with delicate floral and sweet notes.',
    price: '₹599',
  },
]

function ProductCard({ product, rouge = false }) {
  const productId = product.name
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <article
      className={`luxury-product-card ${
        rouge ? 'rouge-card' : ''
      }`}
    >
      <div className="product-image-box">
        {product.gender && (
          <span className="product-gender">
            {product.gender}
          </span>
        )}

        <div className="product-image-placeholder">
          AL BRR
        </div>
      </div>

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
            {product.price}
          </span>

          <Link
            to={`/products/${productId}`}
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

function Home() {
  return (
    <div className="luxury-site">

      {/* ================= HEADER ================= */}

      <Header />

      <main>

        {/* ================= HERO ================= */}

        <section className="hero-section">

          

          

          {/* DARK OVERLAY */}

          <div className="hero-overlay" />

          {/* HERO CONTENT */}

          <div className="hero-content">
            <p className="eyebrow">
              AL BRR PERFUMES · LUXURY EAU DE PARFUM
            </p>

            <h1>
              THE ESSENCE
              <br />
              <em>OF GOODNESS</em>
            </h1>

            <p className="hero-description">
              Discover a world of refined fragrance crafted for
              those who believe that every presence deserves
              a signature.
            </p>

            <div className="hero-buttons">
              <a
                href="#noir"
                className="gold-button"
              >
                EXPLORE NOIR
              </a>

              <a
                href="#rouge"
                className="red-button"
              >
                EXPLORE ROUGE
              </a>
            </div>
          </div>

        </section>


        {/* ================= TOP MARQUEE ================= */}

        <section className="marquee-section">
          <div className="marquee-track">
            <span>ARABIC LUXURY</span>
            <span>✦</span>

            <span>₹599 ONLY</span>
            <span>✦</span>

            <span>NOIR & ROUGE</span>
            <span>✦</span>

            <span>THE ESSENCE OF GOODNESS</span>
            <span>✦</span>

            <span>LUXURY EAU DE PARFUM</span>
            <span>✦</span>

            <span>ARABIC LUXURY</span>
            <span>✦</span>

            <span>₹599 ONLY</span>
            <span>✦</span>

            <span>NOIR & ROUGE</span>
            <span>✦</span>

            <span>THE ESSENCE OF GOODNESS</span>
            <span>✦</span>

            <span>LUXURY EAU DE PARFUM</span>
            <span>✦</span>
          </div>
        </section>


        {/* ================= NOIR ================= */}

        <section
          id="noir"
          className="collection-section"
        >
          <div className="collection-heading">
            <div>
              <p className="chapter-label">
                CHAPTER I
              </p>

              <h2>
                <em>NOIR</em>{' '}
                Collection
              </h2>
            </div>

            <p>
              Dark. Refined. Unforgettable.
              <br />
              Explore our signature collection
              of sophisticated fragrances.
            </p>
          </div>

          <div className="products-grid">
            {noirProducts.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </div>

          <div className="center-product-image">
            <div className="large-product-placeholder">
              AL BRR
            </div>
          </div>
        </section>


        {/* ================= ROUGE ================= */}

        <section
          id="rouge"
          className="collection-section rouge-section"
        >
          <div className="collection-heading">
            <div>
              <p className="chapter-label">
                CHAPTER II
              </p>

              <h2>
                <em>ROUGE</em>{' '}
                Collection
              </h2>
            </div>

            <p>
              Bold. Feminine. Magnetic.
              <br />
              A collection created around
              warmth, elegance and confidence.
            </p>
          </div>

          <div className="products-grid">
            {rougeProducts.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                rouge
              />
            ))}
          </div>
        </section>


        {/* ================= ROUGE MARQUEE ================= */}

        <section className="rouge-marquee-section">
          <div className="rouge-marquee-track">
            <span>THE ESSENCE OF GOODNESS</span>
            <span>✦</span>

            <span>AL BRR PERFUMES</span>
            <span>✦</span>

            <span>NOIR & ROUGE</span>
            <span>✦</span>

            <span>LUXURY EAU DE PARFUM</span>
            <span>✦</span>

            <span>₹599 ONLY</span>
            <span>✦</span>

            <span>THE ESSENCE OF GOODNESS</span>
            <span>✦</span>

            <span>AL BRR PERFUMES</span>
            <span>✦</span>

            <span>NOIR & ROUGE</span>
            <span>✦</span>

            <span>LUXURY EAU DE PARFUM</span>
            <span>✦</span>

            <span>₹599 ONLY</span>
            <span>✦</span>
          </div>
        </section>


        {/* ================= STORY ================= */}

        <section
          id="story"
          className="story-section"
        >

          <div className="story-row">
            <div className="story-number">
              01
            </div>

            <div>
              <h3>The Craft</h3>

              <p>
                Every Al Brr fragrance begins with
                carefully selected ingredients and
                a passion for creating scents that
                leave a lasting impression.
              </p>
            </div>
          </div>


          <div className="story-row story-row-reverse">
            <div>
              <h3>The Notes</h3>

              <p>
                From rich oud and warm amber to
                delicate florals and fresh accords,
                every note is chosen to create a
                balanced and memorable experience.
              </p>
            </div>

            <div className="story-number">
              02
            </div>
          </div>


          <div className="story-row">
            <div className="story-number">
              03
            </div>

            <div>
              <h3>The Promise</h3>

              <p>
                Luxury should feel accessible.
                Al Brr brings premium-inspired
                fragrances to you at a price
                designed for everyday indulgence.
              </p>
            </div>
          </div>

        </section>


        {/* ================= FINAL CTA ================= */}

        <section className="final-cta">
          <div>
            <p className="eyebrow">
              YOUR SIGNATURE AWAITS
            </p>

            <h2>
              Your signature scent is{' '}
              <em>₹599</em>{' '}
              away.
            </h2>
          </div>

          <Link
            to="/products"
            className="gold-button large-button"
          >
            <span>◯</span>
            ORDER NOW
          </Link>
        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Home