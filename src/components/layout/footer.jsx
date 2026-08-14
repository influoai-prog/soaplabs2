import { Link } from 'react-router-dom'
import { FooterSoapMark } from '../branding/footer-logo'
import './footer.css'

const footerLinks = [
  [
    { label: 'Service', href: '#service' },
    { label: 'Agency', href: '#agency' },
    { label: 'Process', href: '#process' },
  ],
  [
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
    { label: 'Book a call', href: '#contact' },
  ],
]

export function Footer() {
  return (
    <div className="site-footer-shell">
      <footer className="site-footer" aria-label="Footer">
        <div className="site-footer__top">
          <div className="site-footer__brand-column">
            <a className="site-footer__brand" href="#top" aria-label="Soap Labs home">
              <FooterSoapMark />
              <span className="site-footer__wordmark">
                <strong>soap</strong>
                <span>Labs</span>
              </span>
            </a>
            <p>Better operations. Less waste. More room to grow.</p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            {footerLinks.map((column, index) => (
              <div className="site-footer__link-column" key={index}>
                {column.map((link) => (
                  <a href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© Soap Labs 2026</span>
          <div className="site-footer__legal">
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms-of-service">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
