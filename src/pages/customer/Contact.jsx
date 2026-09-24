import { useState } from 'react'
import Header from '../../components/customer/Header'
import Footer from '../../components/customer/Footer'

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

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

    setSubmitted(false)
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 10)

    setForm((current) => ({
      ...current,
      phone: value,
    }))

    setErrors((current) => ({
      ...current,
      phone: '',
    }))

    setSubmitted(false)
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = 'Enter a valid email address'
    }

    if (
      form.phone &&
      !/^[0-9]{10}$/.test(form.phone)
    ) {
      newErrors.phone =
        'Enter a valid 10 digit mobile number'
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const message = {
      id: `MSG-${Date.now()}`,
      ...form,
      createdAt: new Date().toISOString(),
      status: 'New',
    }

    const existingMessages = JSON.parse(
      localStorage.getItem('al-brr-contact-messages') ||
        '[]'
    )

    localStorage.setItem(
      'al-brr-contact-messages',
      JSON.stringify([
        message,
        ...existingMessages,
      ])
    )

    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })

    setErrors({})
    setSubmitted(true)
  }

  return (
    <div className="luxury-site">

      <Header />

      <main>

        {/* =========================
            CONTACT HERO
        ========================== */}

        <section className="contact-hero">

          <div className="contact-hero-inner">

            <p className="eyebrow">
              AL BRR PERFUMES · CUSTOMER CARE
            </p>

            <h1>
              GET IN
              <br />
              <em>TOUCH</em>
            </h1>

            <p className="contact-hero-description">
              Questions about your order, our fragrances
              or anything else? We are here to help.
            </p>

          </div>

        </section>


        {/* =========================
            CONTACT CONTENT
        ========================== */}

        <section className="contact-section">

          <div className="contact-layout">

            {/* =========================
                LEFT SIDE
            ========================== */}

            <div className="contact-info">

              <p className="eyebrow">
                CONTACT US
              </p>

              <h2>
                WE'D LOVE TO
                <br />
                <em>HEAR FROM YOU.</em>
              </h2>

              <p className="contact-intro">
                Whether you need help choosing your
                signature fragrance or have a question
                about an existing order, send us a
                message and our team will assist you.
              </p>


              <div className="contact-details">

                <div className="contact-detail">

                  <span className="contact-number">
                    01
                  </span>

                  <div>
                    <span className="contact-label">
                      EMAIL
                    </span>

                    <strong>
                      support@albrrperfumes.com
                    </strong>
                  </div>

                </div>


                <div className="contact-detail">

                  <span className="contact-number">
                    02
                  </span>

                  <div>
                    <span className="contact-label">
                      CUSTOMER SUPPORT
                    </span>

                    <strong>
                      Monday — Saturday
                    </strong>

                    <small>
                      10:00 AM — 7:00 PM
                    </small>
                  </div>

                </div>


                <div className="contact-detail">

                  <span className="contact-number">
                    03
                  </span>

                  <div>
                    <span className="contact-label">
                      LOCATION
                    </span>

                    <strong>
                      India
                    </strong>

                    <small>
                      Online fragrance store
                    </small>
                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                CONTACT FORM
            ========================== */}

            <div className="contact-form-wrapper">

              <div className="contact-form-heading">

                <span>✦</span>

                <div>
                  <p className="eyebrow">
                    SEND A MESSAGE
                  </p>

                  <h2>
                    How can we
                    <br />
                    <em>help?</em>
                  </h2>
                </div>

              </div>


              {submitted && (
                <div className="contact-success">
                  <span>✓</span>

                  <div>
                    <strong>
                      MESSAGE RECEIVED
                    </strong>

                    <p>
                      Thank you for contacting Al Brr
                      Perfumes. We'll get back to you
                      soon.
                    </p>
                  </div>
                </div>
              )}


              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                <div className="contact-form-grid">

                  {/* NAME */}

                  <div className="contact-field">

                    <label>
                      FULL NAME *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />

                    {errors.name && (
                      <small className="contact-error">
                        {errors.name}
                      </small>
                    )}

                  </div>


                  {/* EMAIL */}

                  <div className="contact-field">

                    <label>
                      EMAIL ADDRESS *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />

                    {errors.email && (
                      <small className="contact-error">
                        {errors.email}
                      </small>
                    )}

                  </div>


                  {/* PHONE */}

                  <div className="contact-field">

                    <label>
                      MOBILE NUMBER
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      placeholder="10 digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                    />

                    {errors.phone && (
                      <small className="contact-error">
                        {errors.phone}
                      </small>
                    )}

                  </div>


                  {/* SUBJECT */}

                  <div className="contact-field">

                    <label>
                      SUBJECT *
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />

                    {errors.subject && (
                      <small className="contact-error">
                        {errors.subject}
                      </small>
                    )}

                  </div>


                  {/* MESSAGE */}

                  <div className="contact-field contact-field-full">

                    <label>
                      MESSAGE *
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="6"
                    />

                    {errors.message && (
                      <small className="contact-error">
                        {errors.message}
                      </small>
                    )}

                  </div>

                </div>


                <button
                  type="submit"
                  className="gold-button contact-submit"
                >
                  <span>◯</span>
                  SEND MESSAGE
                </button>

              </form>

            </div>

          </div>

        </section>


        {/* =========================
            BOTTOM MESSAGE
        ========================== */}

        <section className="contact-bottom">

          <span>✦</span>

          <p>
            THE ESSENCE OF
            <em> GOODNESS</em>
          </p>

          <span>✦</span>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Contact