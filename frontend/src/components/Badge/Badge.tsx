import type { ReactNode } from 'react'
import './Badge.scss'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="badge">
      <span className="badge__dot" aria-hidden="true" />
      {children}
    </span>
  )
}
