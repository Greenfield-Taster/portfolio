import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** How far the card leans at the very corner, in degrees. */
const MAX_TILT = 7

/**
 * Leans a card towards the cursor, the way a real one tips when you pick it
 * up. The angles go out as CSS variables so the transform itself stays in the
 * stylesheet, where the rest of the card's look lives.
 *
 * Skipped entirely for reduced motion and for coarse pointers: there is no
 * hover on a touch screen, so the effect would only ever fire on a tap and
 * read as the card flinching.
 */
export function useCardTilt(ref: RefObject<HTMLElement | null>): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let pending: { x: number; y: number } | null = null

    const apply = () => {
      frame = 0
      if (!pending) return
      const rect = el.getBoundingClientRect()
      // -0.5 to 0.5 across each axis, so the centre of the card is flat.
      const x = (pending.x - rect.left) / rect.width - 0.5
      const y = (pending.y - rect.top) / rect.height - 0.5

      // Pulling the cursor down tips the top away, hence the sign on X.
      el.style.setProperty('--tilt-x', `${(-y * MAX_TILT).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * MAX_TILT).toFixed(2)}deg`)
    }

    const onMove = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      frame = 0
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      onLeave()
    }
  }, [ref, reduced])
}
