import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { SoapMark } from '../branding/site-logo'
import { SoapLoaderMark } from '../branding/loading-logo'
import { useBooking } from '../booking/booking-provider'
import './navbar.css'

const links = [
  { label: 'Services', href: '#agency' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar({ isLoading = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCta, setShowCta] = useState(true)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { openBooking, bookingUrl } = useBooking()
  const isHome = pathname === '/'

  useEffect(() => {
    const pageCtas = Array.from(document.querySelectorAll(
      '.showcase-actions__button--book, .industries-header__action',
    ))

    if (!pageCtas.length) {
      setShowCta(true)
      return undefined
    }

    const proximity = 120
    const syncCta = () => {
      const isNearPageCta = pageCtas.some((cta) => {
        const rect = cta.getBoundingClientRect()
        return rect.bottom >= -proximity && rect.top <= window.innerHeight + proximity
      })

      setShowCta(!isNearPageCta)
    }

    syncCta()
    window.addEventListener('scroll', syncCta, { passive: true })
    window.addEventListener('resize', syncCta)

    return () => {
      window.removeEventListener('scroll', syncCta)
      window.removeEventListener('resize', syncCta)
    }
  }, [])

  const handleNavigation = (event, href) => {
    event.preventDefault()
    setIsOpen(false)

    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isHome) {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'start',
        })
        window.history.replaceState(
          window.history.state,
          '',
          `${window.location.pathname}${window.location.search}`,
        )
        return
      }
    }

    navigate('/', { state: { scrollTo: href } })
  }

  const className = [
    'nav-shell',
    isLoading && 'nav-shell--loading',
    isOpen && 'nav-shell--open',
    showCta && !isLoading && 'nav-shell--cta',
  ].filter(Boolean).join(' ')

  return (
    <>
      <div className={`mobile-boot-screen${isLoading ? ' mobile-boot-screen--active' : ''}`} aria-hidden="true">
        <div className="mobile-boot-screen__tile">
          <SoapLoaderMark />
        </div>
        <div className="mobile-boot-screen__wordmark">
          <strong>soap</strong>
          <span>Labs</span>
        </div>
      </div>
      <div className={`loading-wordmark${isLoading ? ' loading-wordmark--active' : ''}`} aria-hidden="true">
        <strong>soap</strong>
        <span>Labs</span>
      </div>
      <header className={className}>
        <a
          className="nav-brand"
          href="#top"
          aria-label="Soap Labs home"
          onClick={(event) => handleNavigation(event, '#top')}
        >
          <span className="brand__mark" aria-hidden="true">
            <span className="brand__mark-loader">
              <SoapLoaderMark />
            </span>
            <span className="brand__mark-header">
              <SoapMark />
            </span>
          </span>
          <span className="brand__wordmark">
            <strong>soap</strong>
            <span>Labs</span>
          </span>
        </a>

        <div className="nav-trailing">
          <nav className="nav-links" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavigation(event, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              className="nav-cta"
              href={bookingUrl}
              onClick={(event) => {
                setIsOpen(false)
                openBooking(event)
              }}
            >
              Book a call
            </a>
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </>
  )
}
