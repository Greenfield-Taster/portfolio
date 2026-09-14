import { useEffect } from 'react'
import type { RefObject } from 'react'
import { computeScrollProgress } from '../lib/scrollProgress'
import { useReducedMotion } from './useReducedMotion'

/** Marks the element whose line is drawn, and the markers strung along it. */
const MARKER = '[data-timeline-marker]'

/**
 * Where on the screen the line's tip sits, as a fraction of the viewport.
 * Low on purpose: a card lights up as it arrives near the bottom of the
 * screen, so the reader never looks at an unlit card. Anchored at the middle
 * the line stopped short of whatever was being read.
 */
const ANCHOR = 0.8

/**
 * Draws a timeline as the reader scrolls through it: writes the travelled
 * fraction to `--timeline-progress` on the element, and flags each marker the
 * line has reached with `data-reached`.
 *
 * Everything here is written straight to the DOM rather than held in state.
 * This runs on every scroll frame, and re-rendering the whole timeline that
 * often to move one line would be paying React's price for a CSS variable.
 */
export function useTimelineProgress(ref: RefObject<HTMLElement | null>): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const markers = () => el.querySelectorAll<HTMLElement>(MARKER)

    // With reduced motion the line is simply drawn in full. It is decoration
    // that reports position; animating it against a stated preference buys
    // the reader nothing and costs them comfort.
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

      // The drawn line's leading edge always sits on the anchor, so testing a
      // marker against the same anchor is what keeps the two in step — no
      // second measurement of the line itself is needed.
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
    // Opening a role changes the timeline's height, which no scroll or resize
    // event reports. Without this the line would keep the length it had when
    // the section was last scrolled.
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
