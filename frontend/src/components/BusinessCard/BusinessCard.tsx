import { useRef } from 'react'
import { profile } from '../../data/profile'
import { handleFromUrl } from '../../lib/handle'
import { useCardTilt } from '../../hooks/useCardTilt'
import './BusinessCard.scss'

export function BusinessCard() {
  const card = useRef<HTMLDivElement>(null)
  useCardTilt(card)

  const lines = [
    { label: 'Email', text: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', text: handleFromUrl(profile.linkedin), href: profile.linkedin },
    { label: 'GitHub', text: handleFromUrl(profile.github), href: profile.github },
  ]

  return (
    // The scene holds the perspective; the card leans inside it.
    <div className="bcard" ref={card} data-testid="business-card">
      <article className="bcard__face">
        <div className="bcard__mark" aria-hidden="true">
          AH<span>.</span>
        </div>

        <div className="bcard__body">
          <p className="bcard__name u-display">{profile.name}</p>
          <p className="bcard__role">{profile.role}</p>

          <dl className="bcard__lines">
            {lines.map((line) => (
              <div key={line.label} className="bcard__line">
                <dt>{line.label}</dt>
                <dd>
                  <a href={line.href}>{line.text}</a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </div>
  )
}
