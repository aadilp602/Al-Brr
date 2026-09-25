import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* =====================================
            FOOTER BRAND
        ====================================== */}

        <Link
          to="/"
          className="footer-brand footer-logo-brand"
          aria-label="Al Brr Perfumes Home"
        >
          <img
            src="/images/al-brr-logo.png"
            alt="Al Brr Perfumes"
            className="footer-brand-logo"
          />

          <span className="footer-brand-name">
            AL BRR
          </span>
        </Link>


        {/* =====================================
            FOOTER RIGHT
        ====================================== */}

        <div className="footer-right">
          <p>
            THE ESSENCE OF GOODNESS
          </p>

          <span>
            © 2026 AL BRR PERFUMES
          </span>
        </div>

      </div>
    </footer>
  )
}

export default Footer