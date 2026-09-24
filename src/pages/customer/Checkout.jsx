import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../context/CartContext'

function Checkout() {
  const navigate = useNavigate()

  const {
    cart,
    cartCount,
    cartTotal,
    clearCart,
  } = useCart()

  // Logged-in customer
  const currentUser = JSON.parse(
    localStorage.getItem('al-brr-current-user') || 'null'
  )

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)

    setForm((current) => ({
      ...current,
      phone: value,
    }))

    setErrors((current) => ({
      ...current,
      phone: '',
    }))
  }

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)

    setForm((current) => ({
      ...current,
      pincode: value,
    }))

    setErrors((current) => ({
      ...current,
      pincode: '',
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10 digit mobile number'
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = 'Enter a valid email'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = 'Enter a valid 6 digit pincode'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!cart.length) {
      return
    }

    if (!validate()) {
      return
    }

    const orderId = `ABR-${Date.now().toString().slice(-8)}`

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),

      // Connect order with logged-in account
      userId: currentUser?.id || null,

      customer: {
        ...form,
        userId: currentUser?.id || null,
      },

      paymentMethod,

      paymentStatus: 'Pending',

      orderStatus: 'Pending',

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        gender: item.gender,
        price: item.price,
        quantity: item.quantity,
      })),

      itemCount: cartCount,

      subtotal: cartTotal,

      shipping: 0,

      total: cartTotal,
    }

    const existingOrders = JSON.parse(
      localStorage.getItem('al-brr-orders') || '[]'
    )

    localStorage.setItem(
      'al-brr-orders',
      JSON.stringify([
        order,
        ...existingOrders,
      ])
    )

    localStorage.setItem(
      'al-brr-last-order',
      JSON.stringify(order)
    )

    clearCart()

    navigate(`/order-success/${orderId}`)
  }

  if (!cart.length) {
    return (
      <div className="luxury-site">
        <Header />

        <main className="checkout-empty">
          <p className="eyebrow">
            AL BRR PERFUMES
          </p>

          <h1>
            YOUR CART IS
            <br />
            <em>EMPTY</em>
          </h1>

          <p>
            Add a fragrance before proceeding
            to checkout.
          </p>

          <Link
            to="/products"
            className="gold-button"
          >
            EXPLORE FRAGRANCES
          </Link>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="luxury-site">
      <Header />

      <main>

        {/* HERO */}

        <section className="checkout-hero">

          <div>
            <p className="eyebrow">
              AL BRR PERFUMES · SECURE CHECKOUT
            </p>

            <h1>
              COMPLETE
              <br />
              <em>YOUR ORDER</em>
            </h1>
          </div>

        </section>

        {/* CHECKOUT */}

        <section className="checkout-section">

          <form
            className="checkout-layout"
            onSubmit={handleSubmit}
          >

            {/* CUSTOMER DETAILS */}

            <div className="checkout-form">

              <div className="checkout-heading">

                <span>01</span>

                <div>
                  <p className="eyebrow">
                    DELIVERY
                  </p>

                  <h2>
                    Your Details
                  </h2>
                </div>

              </div>

              <div className="checkout-fields">

                {/* NAME */}

                <div className="checkout-field full">

                  <label>
                    FULL NAME *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                  {errors.name && (
                    <small>{errors.name}</small>
                  )}

                </div>

                {/* PHONE */}

                <div className="checkout-field">

                  <label>
                    MOBILE NUMBER *
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="10 digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                  />

                  {errors.phone && (
                    <small>{errors.phone}</small>
                  )}

                </div>

                {/* EMAIL */}

                <div className="checkout-field">

                  <label>
                    EMAIL
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />

                  {errors.email && (
                    <small>{errors.email}</small>
                  )}

                </div>

                {/* ADDRESS */}

                <div className="checkout-field full">

                  <label>
                    ADDRESS *
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Flat / Street / Area"
                    rows="4"
                  />

                  {errors.address && (
                    <small>{errors.address}</small>
                  )}

                </div>

                {/* CITY */}

                <div className="checkout-field">

                  <label>
                    CITY *
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                  {errors.city && (
                    <small>{errors.city}</small>
                  )}

                </div>

                {/* STATE */}

                <div className="checkout-field">

                  <label>
                    STATE *
                  </label>

                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                  {errors.state && (
                    <small>{errors.state}</small>
                  )}

                </div>

                {/* PINCODE */}

                <div className="checkout-field">

                  <label>
                    PINCODE *
                  </label>

                  <input
                    name="pincode"
                    type="tel"
                    value={form.pincode}
                    onChange={handlePincodeChange}
                    placeholder="6 digit pincode"
                    inputMode="numeric"
                    maxLength={6}
                  />

                  {errors.pincode && (
                    <small>{errors.pincode}</small>
                  )}

                </div>

              </div>

              {/* PAYMENT */}

              <div className="checkout-heading payment-heading">

                <span>02</span>

                <div>
                  <p className="eyebrow">
                    PAYMENT
                  </p>

                  <h2>
                    Payment Method
                  </h2>
                </div>

              </div>

              <div className="payment-options">

                {/* COD */}

                <label
                  className={
                    paymentMethod === 'COD'
                      ? 'payment-option active'
                      : 'payment-option'
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={
                      paymentMethod === 'COD'
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span className="payment-radio">
                    {paymentMethod === 'COD'
                      ? '✓'
                      : ''}
                  </span>

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order arrives
                    </small>
                  </div>

                </label>

                {/* ONLINE */}

                <label
                  className={
                    paymentMethod === 'ONLINE'
                      ? 'payment-option active'
                      : 'payment-option'
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={
                      paymentMethod === 'ONLINE'
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span className="payment-radio">
                    {paymentMethod === 'ONLINE'
                      ? '✓'
                      : ''}
                  </span>

                  <div>
                    <strong>
                      Online Payment
                    </strong>

                    <small>
                      Payment gateway integration
                      can be connected later
                    </small>
                  </div>

                </label>

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <aside className="checkout-summary">

              <p className="eyebrow">
                YOUR ORDER
              </p>

              <h2>
                Order
                <br />
                <em>Summary</em>
              </h2>

              <div className="checkout-items">

                {cart.map((item) => (

                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.quantity} × ₹{item.price}
                      </span>

                    </div>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                  </div>

                ))}

              </div>

              <div className="checkout-total-row">

                <span>
                  SUBTOTAL
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

              <div className="checkout-total-row">

                <span>
                  SHIPPING
                </span>

                <strong>
                  FREE
                </strong>

              </div>

              <div className="checkout-grand-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

              <button
                type="submit"
                className="gold-button place-order-button"
              >
                <span>◯</span>
                PLACE ORDER
              </button>

              <Link
                to="/cart"
                className="back-cart"
              >
                ← BACK TO CART
              </Link>

            </aside>

          </form>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Checkout