import type { ReactNode } from 'react'
import { sectionNumber } from '../../data/sections'
import './Section.scss'

interface SectionHeadProps {
  id: string
  eyebrow: string
  title: ReactNode
  lede?: string
}

export function SectionHead({ id, eyebrow, title, lede }: SectionHeadProps) {
  const number = sectionNumber(id)

  return (
    <header className="section__head" data-reveal>
      <p className="u-label section__eyebrow">
        {number && (
          <>
            <span className="section__number">{number}</span>
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
  )
}

interface SectionProps {
  id: string
  eyebrow?: string
  title?: ReactNode
  lede?: string
  children?: ReactNode
}

export function Section({ id, eyebrow = '', title, lede, children }: SectionProps) {
  const number = sectionNumber(id)

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      {number && <span className="section__ghost" aria-hidden="true">{number}</span>}

      <div className="section__inner">
        {title !== undefined && (
          <SectionHead id={id} eyebrow={eyebrow} title={title} lede={lede} />
        )}
        {children}
      </div>
    </section>
  )
}
