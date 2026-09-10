import type { ReactNode } from 'react'
import './Section.scss'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
}

export function Section({ id, eyebrow, title, lede, children }: SectionProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section__inner">
        <header className="section__head" data-reveal>
          <p className="u-label">{eyebrow}</p>
          <h2 id={`${id}-title`} className="section__title u-display">{title}</h2>
          {lede && <p className="section__lede u-prose">{lede}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
