import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Loader.scss'

gsap.registerPlugin(ScrambleTextPlugin)

const COLUMNS = 10
const ROWS = 8
const CELLS = Array.from({ length: COLUMNS * ROWS }, (_, i) => i)

const INITIALS = 'AH.'
const LABEL = 'PORTFOLIO'

function cellTone(index: number): string {
  if (index % 7 === 0) return 'strong'
  if (index % 4 === 0) return 'mid'
  return 'faint'
}

export function Loader() {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const block = useRef<HTMLDivElement>(null)
  const initials = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    if (
      !root.current ||
      !grid.current ||
      !block.current ||
      !initials.current ||
      !label.current ||
      !fill.current
    ) {
      return
    }

    const cells = Array.from(grid.current.children)

    const tl = gsap.timeline({ onComplete: () => setShown(false) })
    tl.fromTo(
      cells,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(1.8)',
        stagger: { each: 0.018, grid: [ROWS, COLUMNS], from: 'center' },
      },
      0
    )
    tl.fromTo(
      block.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' },
      0.38
    )
    tl.to(
      initials.current,
      {
        duration: 0.75,
        ease: 'none',
        scrambleText: { text: INITIALS, chars: 'upperCase', speed: 1, revealDelay: 0 },
      },
      0.5
    )
    tl.to(
      label.current,
      {
        duration: 0.55,
        ease: 'none',
        scrambleText: { text: LABEL, chars: '!<>-_\\/[]{}—=+*^?#', speed: 1 },
      },
      0.6
    )
    tl.fromTo(fill.current, { width: '0%' }, { width: '100%', duration: 0.75, ease: 'expo.out' }, 0.85)
    tl.to(
      cells,
      {
        scale: 0,
        opacity: 0,
        rotate: 90,
        duration: 0.32,
        ease: 'expo.in',
        stagger: { each: 0.01, from: 'random' },
      },
      1.75
    )
    tl.to(root.current, { opacity: 0, duration: 0.3, ease: 'sine.in' }, 1.9)

    return () => {
      tl.kill()
    }
  }, [reduced])

  if (reduced || !shown) return null

  return (
    <div className="loader" ref={root} aria-hidden="true" data-testid="loader">
      <div className="loader__grid" ref={grid} data-testid="loader-grid">
        {CELLS.map((i) => (
          <div key={i} className="loader__cell" data-tone={cellTone(i)} />
        ))}
      </div>
      <div className="loader__block" ref={block}>
        <div className="loader__initials" ref={initials} data-testid="loader-initials">
          {INITIALS}
        </div>
        <div className="loader__label" ref={label} data-testid="loader-label">
          {LABEL}
        </div>
      </div>
      <div className="loader__bar">
        <div className="loader__fill" ref={fill} />
      </div>
    </div>
  )
}
