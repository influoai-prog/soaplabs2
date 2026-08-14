import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../../utilities/motion-settings'
import './hero.css'

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
      <h1 aria-label="There Is Money Leaking Out of Your Business">
        <span className="hero-title__clip">
          <motion.span className="hero-title__line" variants={line}>
            There’s Money Leaking
          </motion.span>
        </span>
        <span className="hero-title__clip">
          <motion.span className="hero-title__line" variants={line}>
            Out of Your Business
          </motion.span>
        </span>
      </h1>

      <motion.p className="hero-copy" variants={copy}>
        We find the costs, bottlenecks, and wasted hours dragging down your 
        margins then turn them into more profit and more room to grow.
      </motion.p>
    </motion.section>
  )
}
