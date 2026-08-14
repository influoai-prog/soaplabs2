import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import './booking-provider.css'

const CAL_LINK = 'soaplabs/audit'
const CAL_URL = `https://cal.com/${CAL_LINK}`
const CAL_NAMESPACE = 'soaplabsAudit'
const CAL_CONTAINER_ID = 'soaplabs-cal-booking'

const BookingContext = createContext(null)
let calEmbedPromise

function loadCalEmbed() {
  if (calEmbedPromise) return calEmbedPromise
  if (window.Cal?.loaded) return Promise.resolve(window.Cal)

  calEmbedPromise = new Promise((resolve, reject) => {
    const queue = (api, args) => api.q.push(args)

    window.Cal = function calEmbedApi(...args) {
      const Cal = window.Cal

      if (!Cal.loaded) {
        Cal.ns = {}
        Cal.q = Cal.q || []

        const script = document.createElement('script')
        script.src = 'https://app.cal.com/embed/embed.js'
        script.async = true
        script.dataset.soaplabsCal = 'true'
        script.addEventListener('load', () => resolve(window.Cal), { once: true })
        script.addEventListener('error', reject, { once: true })
        document.head.appendChild(script)
        Cal.loaded = true
      }

      if (args[0] === 'init') {
        const namespaceApi = (...namespaceArgs) => queue(namespaceApi, namespaceArgs)
        const namespace = args[1]
        namespaceApi.q = namespaceApi.q || []

        if (typeof namespace === 'string') {
          Cal.ns[namespace] = namespaceApi
          queue(namespaceApi, args)
        } else {
          queue(Cal, args)
        }
        return
      }

      queue(Cal, args)
    }

    window.Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' })
  })

  return calEmbedPromise
}

function initializeCalEmbed() {
  return loadCalEmbed().then((Cal) => {
    if (!Cal) throw new Error('Cal.com embed could not be loaded')

    if (!Cal.ns?.[CAL_NAMESPACE]) Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' })

    const bookingCal = Cal.ns?.[CAL_NAMESPACE]
    if (!bookingCal) throw new Error('Cal.com embed could not be initialized')
    const container = document.getElementById(CAL_CONTAINER_ID)
    if (!container) throw new Error('Cal.com embed container is unavailable')

    bookingCal('ui', {
      theme: 'light',
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: {
        light: {
          'cal-brand': '#010205',
          'cal-brand-emphasis': '#292929',
          'cal-brand-text': '#ffffff',
          'cal-text': '#626262',
          'cal-text-emphasis': '#010205',
          'cal-text-subtle': '#747474',
          'cal-text-muted': '#969696',
          'cal-bg': '#ffffff',
          'cal-bg-emphasis': '#fff3f7',
          'cal-bg-subtle': '#f7f7f7',
          'cal-bg-muted': '#f1f1f1',
          'cal-border': '#e5e5e5',
          'cal-border-booker': '#efcad7',
          'cal-border-booker-width': '1px',
          'radius': '10px',
          'radius-md': '12px',
          'radius-xl': '18px',
          'radius-3xl': '24px',
        },
      },
    })

    container.replaceChildren()
    bookingCal('inline', {
      elementOrSelector: container,
      calLink: CAL_LINK,
      config: {
        layout: 'month_view',
        theme: 'light',
      },
    })
  })
}

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [embedStatus, setEmbedStatus] = useState('idle')
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const openBooking = useCallback((event) => {
    event?.preventDefault()
    triggerRef.current = event?.currentTarget ?? document.activeElement
    setHasOpened(true)
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus?.())
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    let active = true
    setEmbedStatus('loading')

    initializeCalEmbed()
      .then(() => {
        if (active) setEmbedStatus('ready')
      })
      .catch(() => {
        if (active) setEmbedStatus('error')
      })

    return () => {
      active = false
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeBooking()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeBooking, isOpen])

  return (
    <BookingContext.Provider value={{ openBooking, bookingUrl: CAL_URL }}>
      {children}
      {hasOpened && createPortal(
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              className="booking-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-title"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            >
              <button
                className="booking-modal__backdrop"
                type="button"
                aria-label="Close booking"
                onClick={closeBooking}
              />

              <motion.section
                className="booking-modal__panel"
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.99 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="booking-modal__header">
                  <div>
                    <span>Operational audit</span>
                    <h2 id="booking-modal-title">Book a call</h2>
                  </div>
                  <button
                    ref={closeButtonRef}
                    className="booking-modal__close"
                    type="button"
                    aria-label="Close booking"
                    onClick={closeBooking}
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </header>

                <div className="booking-modal__content">
                  {embedStatus === 'loading' ? (
                    <div className="booking-modal__loading" role="status">
                      <span aria-hidden="true" />
                      Loading available times…
                    </div>
                  ) : null}

                  {embedStatus === 'error' ? (
                    <div className="booking-modal__error">
                      <p>The calendar could not load here.</p>
                      <a href={CAL_URL} target="_blank" rel="noreferrer">
                        Open the booking page
                      </a>
                    </div>
                  ) : null}

                  <div
                    id={CAL_CONTAINER_ID}
                    className="booking-modal__calendar"
                    aria-hidden={embedStatus === 'error'}
                  />
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}
