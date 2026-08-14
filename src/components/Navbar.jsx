import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { SoapMark } from './SoapMark'
import { SoapLoaderMark } from './SoapLoaderMark'
import './Navbar.css'

const links = [
  { label: 'Services', href: '#service' },
  { label: 'Works', href: '#agency' },
  { label: 'Process', href: '#process' },
]

export function Navbar({ isLoading = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'

  useEffect(() => {
    const marker = document.querySelector('[data-industries-end]')
    if (!marker) {
      setShowCta(true)
      return undefined
    }

    const syncCta = () => {
      const rect = marker.getBoundingClientRect()
      // Show once the industries bottom has entered (or passed) the viewport.
      setShowCta(rect.top <= window.innerHeight)
    }

    syncCta()

    const observer = new IntersectionObserver(syncCta, {
      threshold: [0, 0.01, 1],
      rootMargin: '0px',
    })

    observer.observe(marker)
    window.addEventListener('scroll', syncCta, { passive: true })
    window.addEventListener('resize', syncCta)

    return () => {
      observer.disconnect()
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
        window.history.replaceState(null, '', href)
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
              href="#contact"
              onClick={(event) => handleNavigation(event, '#contact')}
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
