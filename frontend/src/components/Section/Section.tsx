import type { ReactNode } from 'react'
import { sectionNumber } from '../../data/sections'
import './Section.scss'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
}

export function Section({ id, eyebrow, title, lede, children }: SectionProps) {
  const number = sectionNumber(id)

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section__inner">
        <header className="section__head" data-reveal>
          <p className="u-label section__eyebrow">
            {number && (
              <>
                <span className="section__number">{number}</span>
                {/* Punctuation between the number and the label: it separates
                    them on screen and would only be noise read aloud. */}
                <span className="section__sep" aria-hidden="true">/</span>
              </>
            )}
            {eyebrow}
          </p>
          <div className="section__line">
            <span className="section__mark" aria-hidden="true" />
            <h2 id={`${id}-title`} className="section__title u-display">{title}</h2>
          </div>
          {lede && <p className="section__lede u-prose">{lede}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
