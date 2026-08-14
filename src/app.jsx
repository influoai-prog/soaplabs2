import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SiteLayout } from './components/layout/site-layout'
import { Hero } from './components/sections/hero'
import { Showcase } from './components/sections/showcase'
import { IndustriesSection } from './components/sections/industries-section'
import { FixSection } from './components/sections/fix-section'
import { ProcessSection } from './components/sections/process-section'
import { TestimonialSection } from './components/sections/testimonial-section'
import { FAQSection } from './components/sections/faq-section'
import { LegalSection } from './components/sections/legal-section'
import './app.css'

const WHITE_SCREEN_MS = 300
const LOADING_MS = 900

function App() {
  const [isWhiteScreen, setIsWhiteScreen] = useState(
    () => !window.matchMedia('(max-width: 809.98px)').matches,
  )
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Soap Labs | Better Operations'
  }, [])

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 809.98px)').matches
    const orientation = window.screen?.orientation

    if (!isMobile || typeof orientation?.lock !== 'function') {
      return undefined
    }

    try {
      const lockRequest = orientation.lock('portrait-primary')
      lockRequest?.catch?.(() => {})
    } catch {
      // Browsers only allow orientation locking in supported display modes.
    }

    return () => {
      try {
        orientation.unlock?.()
      } catch {
        // Nothing to release when the browser rejected the lock.
      }
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compactLayout = window.matchMedia('(max-width: 809.98px)').matches
    document.documentElement.classList.add('is-loading')

    let whiteTimer
    if (compactLayout) {
      setIsWhiteScreen(false)
    } else {
      document.documentElement.classList.add('is-white-screen')
      whiteTimer = window.setTimeout(() => {
        setIsWhiteScreen(false)
        document.documentElement.classList.remove('is-white-screen')
      }, reducedMotion ? 0 : WHITE_SCREEN_MS)
    }

    const loadDelay = reducedMotion ? 40 : WHITE_SCREEN_MS + LOADING_MS

    const loadTimer = window.setTimeout(() => {
      setIsLoading(false)
      document.documentElement.classList.remove('is-loading')
    }, loadDelay)

    return () => {
      if (whiteTimer) window.clearTimeout(whiteTimer)
      window.clearTimeout(loadTimer)
      document.documentElement.classList.remove('is-loading')
      document.documentElement.classList.remove('is-white-screen')
    }
  }, [])

  useEffect(() => {
    const scrollTo = location.state?.scrollTo
    if (!scrollTo) return

    if (scrollTo === '#top') {
      window.scrollTo(0, 0)
    } else {
      const target = document.querySelector(scrollTo)
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }

    navigate('/', {
      replace: true,
      state: null,
    })
  }, [location.pathname, location.state?.scrollTo, navigate])

  return (
    <SiteLayout pageClassName={isLoading ? 'page--loading' : ''} navbarProps={{ isLoading }}>
      {isWhiteScreen ? <div className="boot-white" aria-hidden="true" /> : null}
      <Hero />

      <div className="proof-industries-flow">
        <section className="proof-section" id="contact">
          <Showcase />
        </section>

        <IndustriesSection />
      </div>
      <FixSection />
      <ProcessSection />
      <TestimonialSection />
      <FAQSection />
      <LegalSection />
    </SiteLayout>
  )
}

export default App
