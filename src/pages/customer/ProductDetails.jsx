import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../context/CartContext'

const products = [
  {
    id: 'al-durrat',
    name: 'Al-Durrat',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · ARABIAN LUXURY',
    description:
      'A deep oriental fragrance with warm woods, amber and refined aromatic notes.',
    longDescription:
      'Al-Durrat is a rich and sophisticated fragrance created around deep oriental character. Warm woods, amber and aromatic notes come together to create a confident and memorable signature.',
    price: 599,
    size: '50 ML',
    family: 'Oriental · Woody',
  },
  {
    id: 'gen-z7',
    name: 'Gen-Z7',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · MODERN SIGNATURE',
    description:
      'Fresh, bold and energetic notes created for a confident everyday signature.',
    longDescription:
      'Gen-Z7 combines freshness and modern character in a fragrance designed for everyday confidence. Its energetic profile makes it easy to wear from day to night.',
    price: 599,
    size: '50 ML',
    family: 'Fresh · Aromatic',
  },
  {
    id: 'alfa-Men',
    name: 'Alfa-Men',
    category: 'Noir',
    gender: 'MEN',
    inspired: 'INSPIRED BY · DARK ELEGANCE',
    description:
      'A powerful blend of woody, spicy and sensual notes with lasting character.',
    longDescription:
      'Alfa-Men is built around a dark and sophisticated fragrance profile. Woody and spicy notes create depth while the sensual base gives the scent its distinctive character.',
    price: 599,
    size: '50 ML',
    family: 'Woody · Spicy',
  },
  {
    id: 'al-avriq',
    name: 'Al-Avriq',
    category: 'Rouge',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · ROSE & AMBER',
    description:
      'A graceful floral composition with soft rose, amber and elegant sweetness.',
    longDescription:
      'Al-Avriq brings together delicate floral notes and warm amber for an elegant and graceful fragrance. A beautiful choice for a refined everyday signature.',
    price: 599,
    size: '50 ML',
    family: 'Floral · Amber',
  },
  {
    id: 'saji-oudh',
    name: 'Saji Oudh',
    category: 'Rouge',
    gender: 'UNISEX',
    inspired: 'INSPIRED BY · ROYAL OUDH',
    description:
      'Rich oud blended with warm oriental notes for an unmistakable presence.',
    longDescription:
      'Saji Oudh celebrates the richness of traditional oud with warm oriental accords. Its deep character creates a luxurious and memorable presence.',
    price: 599,
    size: '50 ML',
    family: 'Oudh · Oriental',
  },
  {
    id: 'lucky-girl',
    name: 'Lucky Girl',
    category: 'Rouge',
    gender: 'WOMEN',
    inspired: 'INSPIRED BY · FEMININE CHARM',
    description:
      'A bright and beautiful fragrance with delicate floral and sweet notes.',
    longDescription:
      'Lucky Girl is a bright and feminine fragrance with soft floral and sweet notes. Its playful character makes it an effortless signature for everyday wear.',
    price: 599,
    size: '50 ML',
    family: 'Floral · Sweet',
  },
]

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find(
    (item) => item.id === id
  )

  if (!product) {
    return (
      <div className="luxury-site">

        <Header />

        <main className="product-not-found">

          <p className="eyebrow">
            AL BRR PERFUMES
          </p>

          <h1>
            PRODUCT
            <br />
            <em>NOT FOUND</em>
          </h1>

          <Link
            to="/products"
            className="gold-button"
          >
            BACK TO PRODUCTS
          </Link>

        </main>

        <Footer />

      </div>
    )
  }

  const isRouge = product.category === 'Rouge'

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 1800)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  return (
    <div className="luxury-site">

      <Header />

      <main>

        {/* PRODUCT HERO */}

        <section
          className={`product-details-section ${
            isRouge
              ? 'product-details-rouge'
              : ''
          }`}
        >

          <div className="product-details-inner">

            {/* IMAGE */}

            <div className="product-details-image">

              <span className="product-details-gender">
                {product.gender}
              </span>

              <div className="details-bottle">
                <span>
                  AL BRR
                </span>
              </div>

            </div>

            {/* INFO */}

            <div className="product-details-info">

              <Link
                to="/products"
                className="back-products"
              >
                ← BACK TO COLLECTION
              </Link>

              <p className="product-details-category">
                {product.category} COLLECTION
              </p>

              <h1>
                {product.name}
              </h1>

              <p className="product-details-inspired">
                {product.inspired}
              </p>

              <p className="product-details-description">
                {product.longDescription}
              </p>

              {/* META */}

              <div className="product-meta">

                <div>
                  <span>SIZE</span>
                  <strong>{product.size}</strong>
                </div>

                <div>
                  <span>FRAGRANCE FAMILY</span>
                  <strong>{product.family}</strong>
                </div>

                <div>
                  <span>GENDER</span>
                  <strong>{product.gender}</strong>
                </div>

              </div>

              {/* PRICE */}

              <div className="details-purchase">

                <div className="details-price">
                  ₹{product.price}
                </div>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(1, quantity - 1)
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(quantity + 1)
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="details-buttons">

                <button
                  type="button"
                  className="gold-button"
                  onClick={handleAddToCart}
                >
                  <span>◯</span>

                  {added
                    ? 'ADDED TO CART'
                    : 'ADD TO CART'}
                </button>

                <button
                  type="button"
                  className="red-button"
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </button>

              </div>

              {/* INFO */}

              <div className="product-delivery-note">
                <span>✦</span>
                Premium fragrance · Secure packaging
              </div>

            </div>

          </div>

        </section>

        {/* DESCRIPTION */}

        <section className="product-story">

          <div>

            <p className="eyebrow">
              THE AL BRR EXPERIENCE
            </p>

            <h2>
              A fragrance made to
              <br />
              become <em>your signature.</em>
            </h2>

          </div>

          <p>
            Every Al Brr fragrance is designed to
            bring a sense of luxury and confidence
            into everyday moments. Discover a scent
            that feels uniquely yours.
          </p>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default ProductDetails