import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../../utilities/motion-settings'
import { ArrowIcon } from '../ui/arrow-icon'
import './testimonial-section.css'

const testimonials = [
  {
    quote:
      'Soap mapped where our margins were leaking, then built the operating system that closed the gaps. Within weeks, our team had fewer handoffs, clearer ownership, and more time for the work that actually grows the business.',
    name: 'Michael Kaizer',
    role: 'CEO of Basecamp Corp',
    avatar: '/images/michael-kaizer-avatar.png',
    accent: '#e9fe71',
  },
  {
    quote:
      'We had accepted duplicate work as part of scaling. Soap showed us it was a design problem, not a people problem, and replaced it with one simple workflow our whole team could trust.',
    name: 'Amelia Stone',
    role: 'COO of Northstar Labs',
    initials: 'AS',
    accent: '#ffc7dc',
  },
  {
    quote:
      'Their audit turned a vague sense of waste into a clear, prioritized plan. We knew what to fix first, why it mattered, and exactly how success would be measured.',
    name: 'Jon Bell',
    role: 'Founder of Fieldwork',
    initials: 'JB',
    accent: '#d9c7ff',
  },
  {
    quote:
      'Soap did not hand us another generic playbook. They learned how the business really moved, found the constraint costing us the most, and built around the way our people actually work.',
    name: 'Priya Nair',
    role: 'CEO of Pattern House',
    initials: 'PN',
    accent: '#c8e8ff',
  },
  {
    quote:
      'The biggest shift is confidence. We can see the operation clearly, make decisions faster, and keep improving the system without adding more tools or more meetings.',
    name: 'Theo Grant',
    role: 'Managing Director at Loom',
    initials: 'TG',
    accent: '#ffd9a8',
  },
]

const padIndex = (index) => String(index + 1).padStart(2, '0')

export function TestimonialSection() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const testimonial = testimonials[activeIndex]

  const move = useCallback((step) => {
    setDirection(step)
    setActiveIndex((current) => (current + step + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [move])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => move(1), 8000)
    return () => window.clearInterval(timer)
  }, [move])

  return (
    <section className="testimonial-section" id="testimonials" aria-labelledby="testimonial-heading">
      <motion.div
        className="testimonial-inner"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.28 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
      >
        <h2 className="sr-only" id="testimonial-heading">What clients say about Soap Labs</h2>

        <motion.div
          className="testimonial-stage"
          aria-live="polite"
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
          }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.blockquote
              key={activeIndex}
              className="testimonial-quote"
              custom={direction}
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: direction * -30 }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: easeOut }}
            >
              “ {testimonial.quote} ”
            </motion.blockquote>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="testimonial-footer"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: easeOut } },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="testimonial-person"
                key={testimonial.name}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.24 }}
              >
                <motion.div
                  className={`testimonial-avatar${testimonial.avatar ? ' testimonial-avatar--image' : ''}`}
                  style={{ '--avatar-accent': testimonial.accent }}
                  aria-hidden="true"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeOut }}
                >
                  {testimonial.avatar ? <img src={testimonial.avatar} alt="" /> : testimonial.initials}
                </motion.div>
                <div className="testimonial-person__copy">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="testimonial-controls"
            aria-label="Testimonial controls"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: easeOut } },
            }}
          >
            <button type="button" onClick={() => move(-1)} aria-label="Previous testimonial">
              <ArrowIcon direction="left" size={24} aria-hidden="true" />
            </button>
            <span className="testimonial-count" aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}>
              {padIndex(activeIndex)}/{String(testimonials.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => move(1)} aria-label="Next testimonial">
              <ArrowIcon direction="right" size={24} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
