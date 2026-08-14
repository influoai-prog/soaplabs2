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
          <h2 id="fix-title" aria-label="Turn Waste Into Rapid Growth">
            <span className="fix-intro__clip">
              <motion.span
                className="fix-intro__line"
                variants={introLineVariants}
                transition={{ duration: 0.9, delay: 0.08, ease: easeOut }}
              >
                Turn Waste
              </motion.span>
            </span>
            <span className="fix-intro__clip">
              <motion.span
                className="fix-intro__line fix-intro__line--accent"
                variants={introLineVariants}
                transition={{ duration: 0.9, delay: 0.24, ease: easeOut }}
              >
                Into Rapid Growth
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
              <span>Leakage</span>
              <span>Recovered value</span>
              <span>Growth</span>
            </div>

            <svg viewBox="0 0 880 190" preserveAspectRatio="none" shapeRendering="crispEdges">
              <g className="fix-intro__pixel-bars">
                <rect x="68" y="138" width="88" height="36" />
                <rect x="174" y="122" width="88" height="52" />
                <rect x="326" y="94" width="88" height="80" />
                <rect x="432" y="68" width="88" height="106" />
                <rect x="584" y="40" width="88" height="134" />
                <rect x="690" y="16" width="88" height="158" />
              </g>

              <motion.path
                className="fix-intro__pixel-line"
                d="M68 134H174V118H326V90H432V64H584V36H690V12H812"
                variants={{
                  hidden: { pathLength: reduceMotion ? 1 : 0 },
                  visible: { pathLength: 1 },
                }}
                transition={{ duration: reduceMotion ? 0 : 1.15, delay: 0.58, ease: easeOut }}
              />

              <path
                className="fix-intro__pixel-arrow"
                d="M806 2H842V-8L868 12L842 32V22H806Z"
              />
            </svg>

            <div className="fix-intro__graph-metrics">
              <span><strong>01</strong> Less waste</span>
              <span><strong>02</strong> More capacity</span>
              <span><strong>03</strong> Higher margins</span>
            </div>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, delay: 0.48, ease: easeOut }}
          >
            Cleaner operations and less dependence on key people. We build the systems your business needs to scale without added complexity.
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
            Into Rapid Growth
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
          Cleaner operations and less dependence on key people. We build the systems your business needs to scale without added complexity.
        </p>
      </div>
    </section>
  )
}
