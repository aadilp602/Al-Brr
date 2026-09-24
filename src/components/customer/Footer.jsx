import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <Link to="/" className="footer-brand">
          <span className="footer-brand-mark">AB</span>

          <span>
            <strong>AL BRR</strong>
            <small>PERFUMES</small>
          </span>
        </Link>

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