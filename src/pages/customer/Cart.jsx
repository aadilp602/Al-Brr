import { Link } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../context/CartContext'

function Cart() {
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  return (
    <div className="luxury-site">

      <Header />

      <main>

        {/* HERO */}

        <section className="cart-hero">
          <div className="cart-hero-inner">

            <p className="eyebrow">
              AL BRR PERFUMES
            </p>

            <h1>
              YOUR
              <br />
              <em>CART</em>
            </h1>

            <p>
              Review your selected fragrances
              before placing your order.
            </p>

          </div>
        </section>

        {/* CART */}

        <section className="cart-section">

          <div className="cart-container">

            {cart.length === 0 ? (

              /* EMPTY CART */

              <div className="cart-empty">

                <span className="cart-empty-icon">
                  ◯
                </span>

                <p className="eyebrow">
                  YOUR COLLECTION
                </p>

                <h2>
                  Your cart is <em>empty.</em>
                </h2>

                <p>
                  Discover a fragrance and add it
                  to your collection.
                </p>

                <Link
                  to="/products"
                  className="gold-button"
                >
                  EXPLORE PRODUCTS
                </Link>

              </div>

            ) : (

              /* CART WITH PRODUCTS */

              <div className="cart-layout">

                {/* PRODUCTS */}

                <div className="cart-products">

                  <div className="cart-top-row">

                    <div>
                      <p className="eyebrow">
                        YOUR SELECTION
                      </p>

                      <h2>
                        {cartCount}{' '}
                        {cartCount === 1
                          ? 'ITEM'
                          : 'ITEMS'}
                      </h2>
                    </div>

                    <button
                      type="button"
                      className="cart-clear-button"
                      onClick={clearCart}
                    >
                      CLEAR CART
                    </button>

                  </div>

                  {cart.map((item) => (

                    <article
                      className="cart-product"
                      key={item.id}
                    >

                      {/* IMAGE */}

                      <div className="cart-product-image">

                        <span>
                          {item.gender}
                        </span>

                        <div className="cart-bottle">
                          AL BRR
                        </div>

                      </div>

                      {/* INFO */}

                      <div className="cart-product-info">

                        <p className="cart-product-category">
                          {item.category} COLLECTION
                        </p>

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                        <div className="cart-product-meta">

                          <span>
                            {item.size || '50 ML'}
                          </span>

                          <span>
                            {item.family || 'Premium Fragrance'}
                          </span>

                        </div>

                      </div>

                      {/* PRICE + QUANTITY */}

                      <div className="cart-product-actions">

                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                        <div className="cart-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          REMOVE
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

                {/* SUMMARY */}

                <aside className="cart-summary">

                  <p className="eyebrow">
                    ORDER SUMMARY
                  </p>

                  <h2>
                    YOUR <em>ORDER</em>
                  </h2>

                  <div className="cart-summary-line">

                    <span>
                      Items
                    </span>

                    <strong>
                      {cartCount}
                    </strong>

                  </div>

                  <div className="cart-summary-line">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹{cartTotal}
                    </strong>

                  </div>

                  <div className="cart-summary-line">

                    <span>
                      Shipping
                    </span>

                    <strong>
                      FREE
                    </strong>

                  </div>

                  <div className="cart-summary-total">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹{cartTotal}
                    </strong>

                  </div>

                  <Link
                    to="/checkout"
                    className="gold-button cart-checkout-button"
                  >
                    PROCEED TO CHECKOUT
                  </Link>

                  <Link
                    to="/products"
                    className="cart-continue"
                  >
                    ← CONTINUE SHOPPING
                  </Link>

                </aside>

              </div>

            )}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Cart