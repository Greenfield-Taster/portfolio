import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './TypedLine.scss'

interface TypedLineProps {
  text: string
  speedMs?: number
}

export function TypedLine({ text, speedMs = 45 }: TypedLineProps) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const done = count >= text.length

  useEffect(() => {
    if (reduced) return
    setCount(0)

    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id)
          return current
        }
        return current + 1
      })
    }, speedMs)

    return () => window.clearInterval(id)
  }, [text, speedMs, reduced])

  const shown = reduced ? text : text.slice(0, count)

  return (
    <p className="typed-line">
      <span className="typed-line__prompt" aria-hidden="true">
        &gt;
      </span>
      <span className="typed-line__text" aria-hidden="true" data-testid="typed-line">
        {shown}
        <span className="typed-line__cursor" data-blink={reduced || done ? 'true' : 'false'} />
      </span>
      <span className="u-visually-hidden">{text}</span>
    </p>
  )
}
