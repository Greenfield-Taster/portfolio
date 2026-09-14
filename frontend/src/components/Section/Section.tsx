import type { ReactNode } from 'react'
import { sectionNumber } from '../../data/sections'
import './Section.scss'

interface SectionHeadProps {
  id: string
  eyebrow: string
  title: ReactNode
  lede?: string
}

/**
 * The head a section announces itself with: its number and label, the slash
 * mark, the title and an optional lede. Sections normally get it from
 * <Section> itself; one that wants the head somewhere else in its layout —
 * inside a sticky column, say — renders this on its own instead.
 */
export function SectionHead({ id, eyebrow, title, lede }: SectionHeadProps) {
  const number = sectionNumber(id)

  return (
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
  )
}

interface SectionProps {
  id: string
  eyebrow?: string
  /**
   * Leave the title out and the section draws no head of its own; the
   * children then carry a <SectionHead> with the same id, which is what the
   * section's accessible name points at.
   */
  title?: ReactNode
  lede?: string
  children?: ReactNode
}

export function Section({ id, eyebrow = '', title, lede, children }: SectionProps) {
  const number = sectionNumber(id)

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      {/* The same number again, as a watermark. It says nothing the eyebrow
          has not already said, so it is decoration and stays out of the
          accessibility tree and out of a text selection. */}
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
