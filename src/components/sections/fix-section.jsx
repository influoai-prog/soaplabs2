import { motion, useReducedMotion } from 'framer-motion'
import growBusinessFrame from '../../assets/grow-business-frame.svg'
import './fix-section.css'

const compactSquare = {
  x: 356,
  y: 338,
  width: 248,
  height: 248,
  rx: 38,
}

const shapePieces = [
  { x: 160.391, y: 171.285, width: 623.757, height: 410.452 },
  { x: 237.957, y: 420.145, width: 626.991, height: 332.893 },
  { x: -10.8945, y: 270.418, width: 188.553, height: 149.726 },
  { x: 399.133, y: 732.252, width: 153.037, height: 80.7928 },
  { x: 631.109, y: 728.572, width: 233.83, height: 105.258 },
  { x: 824.406, y: 504.648, width: 122.48, height: 81.9456 },
  { x: 864.945, y: 0, width: 81.9456, height: 81.9456 },
  { x: 396.043, y: 90.4961, width: 388.112, height: 113.524 },
  { x: 81.7272, y: 381.012, width: 80.7928, height: 290.6 },
  { x: 318.3402, y: 732.252, width: 80.7928, height: 169.808 },
  { x: 744.121, y: 171.285, width: 120.824, height: 171.287 },
  { x: 237.9492, y: 0, width: 80.7928, height: 183.235 },
]

const easeOut = [0.22, 1, 0.36, 1]

const titleVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, delay: 0.34, ease: easeOut },
  },
}

const dotsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.48, staggerChildren: 0.075 },
  },
}

const dotVariants = {
  hidden: { opacity: 0, scale: 0.45, y: 7 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
}

const finalArtworkVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0,
  },
}

const assemblyVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
  },
}

const pieceVariants = (piece, index) => ({
  hidden: {
    ...compactSquare,
    transition: {
      duration: 0.72,
      delay: (shapePieces.length - 1 - index) * 0.012,
      ease: easeOut,
    },
  },
  visible: {
    ...piece,
    rx: 18,
    transition: {
      duration: 1.35,
      delay: index * 0.025,
      ease: easeOut,
    },
  },
})

function GrowBusinessShape({ reduceMotion }) {
  return (
    <>
      {!reduceMotion && (
        <motion.svg
          className="fix-visual__shape fix-visual__shape--assembly"
          viewBox="-52 -22 1040 985"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          variants={assemblyVariants}
        >
          <g className="fix-visual__assembly-keyline">
            {shapePieces.map((piece, index) => (
              <motion.rect
                key={`keyline-${piece.x}-${piece.y}`}
                fill="none"
                stroke="#DADADA"
                strokeWidth="42"
                strokeLinejoin="round"
                variants={pieceVariants(piece, index)}
              />
            ))}
          </g>
          <g className="fix-visual__assembly-stroke">
            {shapePieces.map((piece, index) => (
              <motion.rect
                key={`stroke-${piece.x}-${piece.y}`}
                fill="none"
                stroke="#EFEFEF"
                strokeWidth="38"
                strokeLinejoin="round"
                variants={pieceVariants(piece, index)}
              />
            ))}
          </g>
          <g className="fix-visual__assembly-fill">
            {shapePieces.map((piece, index) => (
              <motion.rect
                key={`fill-${piece.x}-${piece.y}`}
                fill="#FFFFFF"
                variants={pieceVariants(piece, index)}
              />
            ))}
          </g>
        </motion.svg>
      )}

      <motion.img
        className="fix-visual__shape fix-visual__shape--final"
        src={growBusinessFrame}
        alt=""
        aria-hidden="true"
        variants={reduceMotion ? undefined : finalArtworkVariants}
      />
    </>
  )
}

export function FixSection() {
  const reduceMotion = useReducedMotion()

  const introLineVariants = {
    hidden: { y: reduceMotion ? '0%' : '112%' },
    visible: { y: '0%' },
  }

  return (
    <section
      className="fix-section"
      id="fix"
      aria-labelledby="fix-title"
    >
      <div className="fix-intro">
        <motion.div
          className="fix-intro__content"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.55 }}
        >
          <span className="fix-intro__eyebrow">Where we make the difference</span>

          <h2 id="fix-title" aria-label="Turn Waste Into Growth">
            <span className="fix-intro__clip">
              <motion.span
                className="fix-intro__line"
                variants={introLineVariants}
                transition={{ duration: 0.9, delay: 0.08, ease: easeOut }}
              >
                TURN WASTE
              </motion.span>
            </span>
            <span className="fix-intro__clip">
              <motion.span
                className="fix-intro__line fix-intro__line--accent"
                variants={introLineVariants}
                transition={{ duration: 0.9, delay: 0.24, ease: easeOut }}
              >
                INTO GROWTH
              </motion.span>
            </span>
          </h2>

          <motion.div
            className="fix-intro__graph"
            aria-hidden="true"
            variants={{
              hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 26 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.72, delay: 0.4, ease: easeOut }}
          >
            <div className="fix-intro__graph-labels">
              <span>Cost leakage</span>
              <span>Recovered capacity</span>
              <span>Growth</span>
            </div>

            <svg viewBox="0 0 880 190" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fix-line-gradient" x1="36" y1="0" x2="844" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#010205" />
                  <stop offset="0.58" stopColor="#ff80ad" />
                  <stop offset="1" stopColor="#ff80ad" />
                </linearGradient>
                <linearGradient id="fix-area-gradient" x1="0" y1="34" x2="0" y2="174" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ff80ad" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#ff80ad" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g className="fix-intro__graph-grid">
                <path d="M36 54H844" />
                <path d="M36 94H844" />
                <path d="M36 134H844" />
                <path d="M36 174H844" />
                <path d="M238 34V174" />
                <path d="M440 34V174" />
                <path d="M642 34V174" />
              </g>

              <motion.path
                className="fix-intro__graph-area"
                d="M36 158C118 157 165 151 238 143C329 133 359 126 440 112C526 97 572 86 642 69C725 49 778 35 844 20V174H36Z"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.8, delay: 0.78, ease: easeOut }}
              />
              <motion.path
                className="fix-intro__graph-line"
                d="M36 158C118 157 165 151 238 143C329 133 359 126 440 112C526 97 572 86 642 69C725 49 778 35 844 20"
                variants={{
                  hidden: { pathLength: reduceMotion ? 1 : 0 },
                  visible: { pathLength: 1 },
                }}
                transition={{ duration: reduceMotion ? 0 : 1.25, delay: 0.58, ease: easeOut }}
              />
              <g className="fix-intro__graph-points">
                <circle cx="36" cy="158" r="7" />
                <circle cx="440" cy="112" r="7" />
                <circle cx="844" cy="20" r="9" />
              </g>
            </svg>

            <div className="fix-intro__graph-metrics">
              <span><i />Less waste</span>
              <span><i />More capacity</span>
              <span><i />Higher margins</span>
            </div>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, delay: 0.48, ease: easeOut }}
          >
            Cleaner operations and less dependence on people holding everything together. We build the infrastructure your business needs to scale without adding more complexity.
          </motion.p>
        </motion.div>
      </div>

      <div className="fix-visual">
        <motion.div
          className="fix-visual__frame"
          initial={reduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          <GrowBusinessShape reduceMotion={reduceMotion} />
          <motion.h2
            className="fix-visual__title"
            variants={reduceMotion ? undefined : titleVariants}
          >
            Turn Waste<br />
            Into Growth
          </motion.h2>
          <motion.div
            className="fix-visual__dots"
            aria-hidden="true"
            variants={reduceMotion ? undefined : dotsVariants}
          >
            <motion.i variants={reduceMotion ? undefined : dotVariants} />
            <motion.i variants={reduceMotion ? undefined : dotVariants} />
            <motion.i variants={reduceMotion ? undefined : dotVariants} />
          </motion.div>
        </motion.div>

        <p className="fix-copy">
          Cleaner operations and less dependence on people holding everything together. We build the infrastructure your business needs to scale without adding more complexity.
        </p>
      </div>
    </section>
  )
}
