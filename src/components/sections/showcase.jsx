import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { easeOut } from '../../utilities/motion-settings'
import { ArrowIcon } from '../ui/arrow-icon'
import { Button } from '../ui/button'
import { useBooking } from '../booking/booking-provider'
import './showcase.css'

const FRAME = {
  width: 886.08,
  height: 519.42,
  padding: 24,
  radius: 50,
}

const PHASE = {
  expansionEnd: 0.72,
  colorShiftStart: 0.78,
}

const smoothStep = (value) => value * value * (3 - 2 * value)

function getViewport() {
  if (typeof window === 'undefined') return { width: 1440, height: 900 }

  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }
}

function useViewport() {
  const [viewport, setViewport] = useState(getViewport)

  useEffect(() => {
    let frameId

    const update = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => setViewport(getViewport()))
    }

    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', update)
    }
  }, [])

  return viewport
}

export function Showcase() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const viewport = useViewport()
  const { openBooking, bookingUrl } = useBooking()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '120px 0px' },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const compactLayout = viewport.width < 768
  const motionDisabled = shouldReduceMotion || compactLayout
  const framePadding = compactLayout ? 10 : FRAME.padding
  const gutter = compactLayout ? 8 : 32
  const availableFrameWidth = Math.max(0, viewport.width - gutter)
  const availableFrameHeight = Math.max(0, viewport.height - gutter)
  const desiredScreenWidth = FRAME.width - FRAME.padding * 2
  const startScreenWidth = Math.max(
    0,
    Math.min(
      desiredScreenWidth,
      availableFrameWidth - framePadding * 2,
      (availableFrameHeight - framePadding * 2) * (16 / 9),
    ),
  )
  const startScreenHeight = startScreenWidth * (9 / 16)
  const startFrameWidth = startScreenWidth + framePadding * 2
  const startFrameHeight = startScreenHeight + framePadding * 2
  const viewportContentWidth = Math.max(0, viewport.width - framePadding * 2)
  const viewportContentHeight = Math.max(0, viewport.height - framePadding * 2)
  const endScreenWidth = Math.min(viewportContentWidth, viewportContentHeight * (16 / 9))
  const endScreenHeight = endScreenWidth * (9 / 16)
  const expansionRange = [0, PHASE.expansionEnd]
  const easing = { ease: smoothStep }

  const frameWidth = useTransform(
    scrollYProgress,
    expansionRange,
    motionDisabled ? [viewport.width, viewport.width] : [startFrameWidth, viewport.width],
    easing,
  )
  const frameHeight = useTransform(
    scrollYProgress,
    expansionRange,
    motionDisabled ? [viewport.height, viewport.height] : [startFrameHeight, viewport.height],
    easing,
  )
  const frameRadius = useTransform(
    scrollYProgress,
    expansionRange,
    motionDisabled ? [0, 0] : [FRAME.radius, 0],
    easing,
  )
  const screenWidth = useTransform(
    scrollYProgress,
    expansionRange,
    motionDisabled ? [endScreenWidth, endScreenWidth] : [startScreenWidth, endScreenWidth],
    easing,
  )
  const screenHeight = useTransform(
    scrollYProgress,
    expansionRange,
    motionDisabled ? [endScreenHeight, endScreenHeight] : [startScreenHeight, endScreenHeight],
    easing,
  )
  const frameBackground = useTransform(
    scrollYProgress,
    [PHASE.colorShiftStart, 1],
    ['#f3f3f3', '#f6d0dd'],
    easing,
  )

  const frameStyle = motionDisabled
    ? { backgroundColor: '#f3f3f3' }
    : {
        width: frameWidth,
        height: frameHeight,
        borderRadius: frameRadius,
        backgroundColor: frameBackground,
      }
  const screenStyle = motionDisabled
    ? { width: '100%', height: 'auto' }
    : { width: screenWidth, height: screenHeight }

  return (
    <section className="showcase-wrap" id="agency">
      <div ref={sectionRef} className="showcase-scroll">
        <div className="showcase-stage">
          <div className="showcase-visual">
            <motion.div className="showcase-frame" style={frameStyle}>
              <motion.div className="showcase" style={screenStyle}>
                <video
                  ref={videoRef}
                  className="showcase__video"
                  src="/workflow-showcase.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
                <div className="showcase__hue-layer" aria-hidden="true" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="showcase-actions"
        initial={motionDisabled ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: easeOut } },
          }}
        >
          <Button className="showcase-actions__button showcase-actions__button--book" href={bookingUrl} onClick={openBooking} whileHover={{ scale: 1.01 }}>Book a call</Button>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: easeOut } },
          }}
        >
          <Button className="showcase-actions__button showcase-actions__button--explore" href="#process" variant="outline" whileHover={{ scale: 1.04 }}>
            Explore more
            <motion.span
              className="showcase-actions__arrow"
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, y: -8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.46, delay: 0.18, ease: easeOut },
                },
              }}
            >
              <ArrowIcon direction="down" size={22} />
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
