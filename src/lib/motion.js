export const easeOut = [0.22, 1, 0.36, 1]

export const revealContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

export const fadeUp = ({ distance = 24, duration = 0.7, delay = 0 } = {}) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: easeOut },
  },
})

export const maskedLine = ({ duration = 0.9, delay = 0 } = {}) => ({
  hidden: { y: '112%' },
  visible: {
    y: '0%',
    transition: { duration, delay, ease: easeOut },
  },
})

export const scaleIn = ({ scale = 0.9, duration = 0.58, delay = 0 } = {}) => ({
  hidden: { opacity: 0, scale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, delay, ease: easeOut },
  },
})

export const instantVisible = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
}

export const getMotionVariant = (reduceMotion, variant) => (
  reduceMotion ? instantVisible : variant
)
