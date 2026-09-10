import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

export function useLenis(): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    // `anchors` puts in-page links through the same smooth scroll as the
    // wheel. Without it the browser jumps straight to the target, and the
    // navigation's current-section mark snaps to the destination instead of
    // travelling across the sections on the way. The offset clears the fixed
    // nav pill, matching `scroll-padding-top` in the reset.
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: { offset: -104, duration: 1.6 },
    })
    let frame = 0

    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])
}
