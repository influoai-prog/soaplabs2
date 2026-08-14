import { motion, useReducedMotion } from 'framer-motion'
import { ArrowIcon } from '../ui/arrow-icon'
import { Button } from '../ui/button'
import './process-section.css'

const easeOut = [0.22, 1, 0.36, 1]

const steps = [
  {
    number: '01',
    label: 'Discover',
    title: 'Audit work',
    description: 'We follow the work, not the org chart, to expose where time, margin, and momentum disappear.',
    direction: 'right',
    className: 'process-card--one',
  },
  {
    number: '02',
    label: 'Prioritize',
    title: 'Map leaks',
    description: 'Every leak is ranked by impact, effort, and urgency so the smartest move becomes obvious.',
    direction: 'right',
    className: 'process-card--two',
  },
  {
    number: '03',
    label: 'Plan',
    title: 'Design fix',
    description: 'We turn the findings into a practical roadmap with clear owners, outcomes, and milestones.',
    direction: 'down',
    className: 'process-card--three',
  },
  {
    number: '04',
    label: 'Build',
    title: 'Create systems',
    description: 'Processes, automations, and tools are built around how your team actually needs to work.',
    direction: 'left',
    className: 'process-card--four',
  },
  {
    number: '05',
    label: 'Launch',
    title: 'Prove it',
    description: 'A focused first release gets into real hands fast, creating evidence before complexity.',
    direction: 'left',
    className: 'process-card--five',
  },
  {
    number: '06',
    label: 'Improve',
    title: 'Scale up',
    description: 'We measure the change, refine the system, and expand the gains across the business.',
    direction: 'down',
    className: 'process-card--six',
  },
]

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const arrowOffset = {
  right: { x: -12, y: 0 },
  left: { x: 12, y: 0 },
  down: { x: 0, y: -12 },
}

// Different entrance animations for variety
const getCardVariants = (index, reduceMotion) => {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1, scale: 1, y: 0, x: 0, rotateX: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        rotateX: 0,
        transition: { duration: 0 },
      },
    }
  }

  // Alternate animation patterns for visual interest
  const patterns = [
    // Pattern 1: Fade up with slight scale
    {
      hidden: { opacity: 0, y: 40, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          ease: easeOut,
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    // Pattern 2: Fade from right with rotation
    {
      hidden: { opacity: 0, x: 30, y: 20, rotateY: -8 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        transition: {
          duration: 0.85,
          ease: easeOut,
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    // Pattern 3: Fade from left with lift
    {
      hidden: { opacity: 0, x: -30, y: 20, scale: 0.96 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.85,
          ease: easeOut,
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
  ]

  return patterns[index % 3]
}

export function ProcessSection() {
  const reduceMotion = useReducedMotion()

  const innerItem = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: easeOut },
    },
  }

  const titleLine = {
    hidden: { y: reduceMotion ? '0%' : '120%', opacity: reduceMotion ? 1 : 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.85, ease: easeOut, delay: 0.1 },
    },
  }

  const ctaCard = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 50, scale: reduceMotion ? 1 : 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.9,
        ease: easeOut,
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.25,
      },
    },
  }

  return (
    <section className="process-section" id="process">
      <motion.div
        className="process-board"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        <div className="process-grid">
          {steps.map((step, index) => (
            <motion.article
              className={`process-card ${step.className}`}
              key={step.number}
              variants={getCardVariants(index, reduceMotion)}
            >
              <motion.div className="process-card__topline" variants={innerItem}>
                <span className="process-card__number">{step.number}</span>
                <span className="process-card__label">{step.label}</span>
              </motion.div>

              <div className="process-card__copy">
                <h3>
                  <span className="process-card__title-clip">
                    <motion.span className="process-card__title-line" variants={titleLine}>
                      {step.title}
                    </motion.span>
                  </span>
                </h3>
                <motion.p variants={innerItem}>{step.description}</motion.p>
              </div>


            </motion.article>
          ))}

          <motion.div className="process-cta" variants={ctaCard}>
            <div className="process-cta__copy">
              <motion.span variants={innerItem}>Ready when you are</motion.span>
              <h3>
                <span className="process-card__title-clip">
                  <motion.span className="process-card__title-line" variants={titleLine}>
                    Let&apos;s find what your business is leaving on the table.
                  </motion.span>
                </span>
              </h3>
            </div>
            <motion.div className="process-cta__button-wrap" variants={innerItem}>
              <Button href="#contact" variant="outline" className="process-cta__button">
                See our plans
                <ArrowIcon direction="right" size={24} aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
