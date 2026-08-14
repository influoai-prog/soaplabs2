import { useEffect } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const usesTouchInput = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const usesCompactLayout = window.matchMedia('(max-width: 809.98px)').matches

    // Native touch scrolling is smoother and more reliable on mobile Safari.
    if (prefersReducedMotion || usesTouchInput || usesCompactLayout) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
    })

    let animationFrame
    const raf = (time) => {
      lenis.raf(time)
      animationFrame = requestAnimationFrame(raf)
    }

    animationFrame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animationFrame)
      lenis.destroy()
    }
  }, [])
}
