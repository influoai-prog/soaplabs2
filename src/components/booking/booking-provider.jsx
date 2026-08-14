import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import './booking-provider.css'

const CAL_LINK = 'soaplabs/audit'
const CAL_URL = `https://cal.com/${CAL_LINK}`
const CAL_NAMESPACE = 'soaplabsAudit'
const CAL_CONTAINER_ID = 'soaplabs-cal-booking'

const INITIAL_ANSWERS = {
  name: '',
  email: '',
  phone: '',
  challenge: '',
  notes: '',
}

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

function initializeCalEmbed(answers) {
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
          'cal-bg-emphasis': '#f7f7f7',
          'cal-bg-subtle': '#f7f7f7',
          'cal-bg-muted': '#f1f1f1',
          'cal-border': '#dedede',
          'cal-border-booker': '#dedede',
          'cal-border-booker-width': '1px',
          'radius': '4px',
          'radius-md': '6px',
          'radius-xl': '8px',
          'radius-3xl': '10px',
        },
      },
    })

    const config = {
      layout: 'month_view',
      theme: 'light',
      name: answers.name,
      email: answers.email,
      title: answers.challenge,
      notes: answers.notes,
    }

    if (answers.phone) config.attendeePhoneNumber = answers.phone

    container.replaceChildren()
    bookingCal('inline', {
      elementOrSelector: container,
      calLink: CAL_LINK,
      config,
    })
  })
}

function BookingProgress({ step }) {
  const labels = ['Details', 'Priorities', 'Schedule']

  return (
    <ol className="booking-progress" aria-label={`Booking step ${step} of 3`}>
      {labels.map((label, index) => {
        const itemStep = index + 1
        return (
          <li
            className={itemStep === step ? 'is-current' : itemStep < step ? 'is-complete' : ''}
            key={label}
          >
            <span>0{itemStep}</span>
            <strong>{label}</strong>
          </li>
        )
      })}
    </ol>
  )
}

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [embedStatus, setEmbedStatus] = useState('idle')
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const openBooking = useCallback((event) => {
    event?.preventDefault()
    triggerRef.current = event?.currentTarget ?? document.activeElement
    setHasOpened(true)
    setStep(1)
    setEmbedStatus('idle')
    setIsOpen(true)
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus?.())
  }, [])

  const updateAnswer = useCallback((event) => {
    const { name, value } = event.target
    setAnswers((current) => ({ ...current, [name]: value }))
  }, [])

  const advanceStep = useCallback((event) => {
    event.preventDefault()
    setStep((current) => Math.min(current + 1, 3))
  }, [])

  useEffect(() => {
    if (!isOpen || step !== 3) return undefined

    let active = true
    setEmbedStatus('loading')

    initializeCalEmbed(answers)
      .then(() => {
        if (active) setEmbedStatus('ready')
      })
      .catch(() => {
        if (active) setEmbedStatus('error')
      })

    return () => {
      active = false
    }
  }, [answers, isOpen, step])

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
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              <button
                className="booking-modal__backdrop"
                type="button"
                aria-label="Close booking"
                onClick={closeBooking}
              />

              <motion.section
                className="booking-modal__panel"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="booking-modal__header">
                  <div className="booking-modal__identity">
                    <span>Soap Labs</span>
                    <h2 id="booking-modal-title">Evolution audit</h2>
                  </div>
                  <BookingProgress step={step} />
                  <button
                    ref={closeButtonRef}
                    className="booking-modal__close"
                    type="button"
                    aria-label="Close booking"
                    onClick={closeBooking}
                  >
                    <X size={19} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </header>

                <div className={`booking-modal__content booking-modal__content--step-${step}`}>
                  {step === 1 ? (
                    <div className="booking-questionnaire">
                      <div className="booking-questionnaire__intro">
                        <span>01 / Your details</span>
                        <h3>Start with the basics.</h3>
                        <p>A few details now means less friction when you choose a time.</p>
                      </div>

                      <form className="booking-form" onSubmit={advanceStep}>
                        <label>
                          <span>Your name</span>
                          <input
                            autoComplete="name"
                            name="name"
                            onChange={updateAnswer}
                            placeholder="Full name"
                            required
                            type="text"
                            value={answers.name}
                          />
                        </label>

                        <label>
                          <span>Work email</span>
                          <input
                            autoComplete="email"
                            name="email"
                            onChange={updateAnswer}
                            placeholder="you@company.com"
                            required
                            type="email"
                            value={answers.email}
                          />
                        </label>

                        <label>
                          <span>Phone number <em>Optional</em></span>
                          <input
                            autoComplete="tel"
                            name="phone"
                            onChange={updateAnswer}
                            placeholder="Include country code"
                            type="tel"
                            value={answers.phone}
                          />
                        </label>

                        <button className="booking-form__primary" type="submit">
                          Continue
                          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                        </button>
                      </form>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="booking-questionnaire">
                      <div className="booking-questionnaire__intro">
                        <span>02 / Your priorities</span>
                        <h3>Where is the drag?</h3>
                        <p>Give us enough context to make the first conversation useful.</p>
                      </div>

                      <form className="booking-form" onSubmit={advanceStep}>
                        <label>
                          <span>Biggest operational problem</span>
                          <textarea
                            autoFocus
                            name="challenge"
                            onChange={updateAnswer}
                            placeholder="What is costing the most time, money, or capacity?"
                            required
                            rows="4"
                            value={answers.challenge}
                          />
                        </label>

                        <label>
                          <span>Anything else we should know? <em>Optional</em></span>
                          <textarea
                            name="notes"
                            onChange={updateAnswer}
                            placeholder="Team size, current systems, urgency, or useful context"
                            rows="3"
                            value={answers.notes}
                          />
                        </label>

                        <div className="booking-form__actions">
                          <button className="booking-form__back" type="button" onClick={() => setStep(1)}>
                            <ArrowLeft size={17} strokeWidth={2} aria-hidden="true" />
                            Back
                          </button>
                          <button className="booking-form__primary" type="submit">
                            See available times
                            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="booking-schedule">
                      <div className="booking-schedule__bar">
                        <button type="button" onClick={() => setStep(2)}>
                          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                          Edit answers
                        </button>
                        <p>Choose a 30-minute time that works for you.</p>
                      </div>

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
                  ) : null}
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
