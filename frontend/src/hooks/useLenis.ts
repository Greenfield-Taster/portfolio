import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

export function useLenis(): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    // In-page links still go through Lenis so its internal scroll position
    // stays in step with the page, but `immediate` lands them in a single
    // frame. Picking a section from the nav is navigation, not a journey: the
    // reader asked to be somewhere else, not to watch the way there.
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: { immediate: true },
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
