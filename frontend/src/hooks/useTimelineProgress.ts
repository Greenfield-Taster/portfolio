import { useEffect } from 'react'
import type { RefObject } from 'react'
import { computeScrollProgress } from '../lib/scrollProgress'
import { useReducedMotion } from './useReducedMotion'

const MARKER = '[data-timeline-marker]'

const ANCHOR = 0.8

export function useTimelineProgress(ref: RefObject<HTMLElement | null>): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const markers = () => el.querySelectorAll<HTMLElement>(MARKER)

    if (reduced) {
      el.style.setProperty('--timeline-progress', '1')
      markers().forEach((marker) => marker.setAttribute('data-reached', 'true'))
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const anchor = window.innerHeight * ANCHOR

      el.style.setProperty(
        '--timeline-progress',
        String(
          computeScrollProgress({
            top: rect.top,
            height: rect.height,
            viewportHeight: window.innerHeight,
            anchor: ANCHOR,
          })
        )
      )

      markers().forEach((marker) => {
        const box = marker.getBoundingClientRect()
        const reachedIt = box.top + box.height / 2 <= anchor
        if (reachedIt) marker.setAttribute('data-reached', 'true')
        else marker.removeAttribute('data-reached')
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const resize = new ResizeObserver(schedule)
    resize.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resize.disconnect()
    }
  }, [ref, reduced])
}
