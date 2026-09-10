import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './RotatingRole.scss'

interface RotatingRoleProps {
  roles: readonly string[]
  intervalMs?: number
}

export function RotatingRole({ roles, intervalMs = 3000 }: RotatingRoleProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || roles.length < 2) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % roles.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [reduced, roles, intervalMs])

  return (
    <p className="rotating-role">
      <span className="rotating-role__bar" aria-hidden="true" />
      {/* `key` on the text restarts the enter animation for each new role. */}
      <span className="rotating-role__text" aria-hidden="true" data-testid="rotating-role">
        <span key={index}>{roles[index]}</span>
      </span>
      <span className="u-visually-hidden">{roles.join(', ')}</span>
    </p>
  )
}
