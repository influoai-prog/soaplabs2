import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../lib/motion'
import './Hero.css'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.18 },
  },
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const line = {
    hidden: { y: reduceMotion ? '0%' : '112%' },
    visible: {
      y: '0%',
      transition: { duration: reduceMotion ? 0 : 0.9, ease: easeOut },
    },
  }
  const copy = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: easeOut },
    },
  }

  return (
    <motion.section
      className="hero-section"
      id="service"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <h1 aria-label="We Find Where Money Is Being Wasted">
        <span className="hero-title__clip">
          <motion.span className="hero-title__line" variants={line}>
            We Find Where Money
          </motion.span>
        </span>
        <span className="hero-title__clip">
          <motion.span className="hero-title__line" variants={line}>
            Is Being Wasted
          </motion.span>
        </span>
      </h1>

      <motion.p className="hero-copy" variants={copy}>
        We come in, map your operations, and find exactly where money is slipping
        through. Then we build the fix.
      </motion.p>
    </motion.section>
  )
}
