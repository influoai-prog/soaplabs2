import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { ArrowIcon } from '../ui/arrow-icon'
import './booking-provider.css'

const CAL_LINK = 'soaplabs/audit'
const CAL_URL = `https://cal.com/${CAL_LINK}`
const CAL_NAMESPACE = 'soaplabsAudit'
const CAL_CONTAINER_ID = 'soaplabs-cal-booking'

const INITIAL_ANSWERS = {
  company: '',
  industry: '',
  revenue: '',
  teamSize: '',
  challenge: '',
  desiredOutcome: '',
  priority: '',
  urgency: '',
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
      hideEventTypeDetails: true,
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
          'cal-bg-emphasis': '#fff0f5',
          'cal-bg-subtle': '#f7f7f7',
          'cal-bg-muted': '#f1f1f1',
          'cal-border': '#dedede',
          'cal-border-booker': '#dedede',
          'cal-border-booker-width': '1px',
          'radius': '10px',
          'radius-md': '12px',
          'radius-xl': '16px',
          'radius-3xl': '20px',
        },
      },
    })

    const notes = [
      `Business: ${answers.company}`,
      `Industry: ${answers.industry}`,
      `Annual revenue: ${answers.revenue}`,
      `Team size: ${answers.teamSize}`,
      `Primary priority: ${answers.priority}`,
      `Timing: ${answers.urgency}`,
      answers.desiredOutcome ? `Desired outcome: ${answers.desiredOutcome}` : null,
    ].filter(Boolean).join('\n')

    const config = {
      layout: 'month_view',
      theme: 'light',
      title: answers.challenge,
      notes,
    }

    container.replaceChildren()
    bookingCal('inline', {
      elementOrSelector: container,
      calLink: CAL_LINK,
      config,
    })
  })
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
              aria-label="Book an evolution audit"
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
                className={`booking-modal__panel booking-modal__panel--step-${step}`}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  ref={closeButtonRef}
                  className="booking-modal__close"
                  type="button"
                  aria-label="Close booking"
                  onClick={closeBooking}
                >
                  <X size={16} strokeWidth={3.2} aria-hidden="true" />
                </button>

                <div className={`booking-modal__content booking-modal__content--step-${step}`}>
                  {step === 1 ? (
                    <div className="booking-questionnaire">
                      <form className="booking-form" onSubmit={advanceStep}>
                        <div className="booking-form__row">
                          <label>
                            <span>Business name</span>
                            <input
                              autoComplete="organization"
                              name="company"
                              onChange={updateAnswer}
                              placeholder="Your company"
                              required
                              type="text"
                              value={answers.company}
                            />
                          </label>

                          <label>
                            <span>Industry</span>
                            <input
                              name="industry"
                              onChange={updateAnswer}
                              placeholder="e.g. Healthcare"
                              required
                              type="text"
                              value={answers.industry}
                            />
                          </label>
                        </div>

                        <label>
                          <span>Annual revenue</span>
                          <select name="revenue" onChange={updateAnswer} required value={answers.revenue}>
                            <option value="" disabled>Select a range</option>
                            <option value="Below $250k">Below $250k</option>
                            <option value="$250k–$500k">$250k–$500k</option>
                            <option value="$500k–$1m">$500k–$1m</option>
                            <option value="$1m–$3m">$1m–$3m</option>
                            <option value="$3m–$10m">$3m–$10m</option>
                            <option value="$10m+">$10m+</option>
                          </select>
                        </label>

                        <label>
                          <span>Team size</span>
                          <select name="teamSize" onChange={updateAnswer} required value={answers.teamSize}>
                            <option value="" disabled>Select a range</option>
                            <option value="1–5 people">1–5 people</option>
                            <option value="6–15 people">6–15 people</option>
                            <option value="16–50 people">16–50 people</option>
                            <option value="51–150 people">51–150 people</option>
                            <option value="151+ people">151+ people</option>
                          </select>
                        </label>

                        <button className="booking-form__primary" type="submit">
                          Continue
                          <ArrowIcon direction="right" size={16} aria-hidden="true" />
                        </button>
                      </form>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="booking-questionnaire">
                      <form className="booking-form" onSubmit={advanceStep}>
                        <label>
                          <span>Biggest operational problem</span>
                          <textarea
                            name="challenge"
                            onChange={updateAnswer}
                            placeholder="What is costing the most time, money, or capacity?"
                            required
                            rows="3"
                            value={answers.challenge}
                          />
                        </label>

                        <div className="booking-form__row">
                          <label>
                            <span>Primary priority</span>
                            <select name="priority" onChange={updateAnswer} required value={answers.priority}>
                              <option value="" disabled>Select one</option>
                              <option value="Reduce costs">Reduce costs</option>
                              <option value="Improve margins">Improve margins</option>
                              <option value="Reclaim team time">Reclaim team time</option>
                              <option value="Create capacity">Create capacity</option>
                              <option value="Simplify systems">Simplify systems</option>
                            </select>
                          </label>

                          <label>
                            <span>Timing</span>
                            <select name="urgency" onChange={updateAnswer} required value={answers.urgency}>
                              <option value="" disabled>Select one</option>
                              <option value="As soon as possible">As soon as possible</option>
                              <option value="Within 30 days">Within 30 days</option>
                              <option value="Within 90 days">Within 90 days</option>
                              <option value="Exploring options">Exploring options</option>
                            </select>
                          </label>
                        </div>

                        <label>
                          <span>What would a win look like? <em>Optional</em></span>
                          <input
                            name="desiredOutcome"
                            onChange={updateAnswer}
                            placeholder="More margin, reclaimed time, extra capacity…"
                            type="text"
                            value={answers.desiredOutcome}
                          />
                        </label>

                        <div className="booking-form__actions">
                          <button className="booking-form__back" type="button" onClick={() => setStep(1)}>
                            <ArrowLeft size={17} strokeWidth={2} aria-hidden="true" />
                            Back
                          </button>
                          <button className="booking-form__primary" type="submit">
                            See available times
                            <ArrowIcon direction="right" size={16} aria-hidden="true" />
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
