import { Link } from 'react-router-dom'
import './legal-section.css'

export function LegalSection() {
  return (
    <section className="legal-section" aria-label="Legal">
      <div className="legal-section__item" id="privacy">
        <h2>Privacy</h2>
        <p>We only collect what we need and never sell your data.</p>
        <Link className="legal-section__link" to="/privacy-policy">
          Read policy
        </Link>
      </div>

      <div className="legal-section__item" id="terms">
        <h2>Terms</h2>
        <p>Work is delivered under a written agreement.</p>
        <Link className="legal-section__link" to="/terms-of-service">
          Read terms
        </Link>
      </div>
    </section>
  )
}
