import { useRef } from 'react'
import { Section } from '../../components/Section/Section'
import { Badge } from '../../components/Badge/Badge'
import { rolesNewestFirst, formatPeriod } from '../../data/select'
import { useTimelineProgress } from '../../hooks/useTimelineProgress'
import './Experience.scss'

export function Experience() {
  const timeline = useRef<HTMLDivElement>(null)
  const roles = rolesNewestFirst()

  useTimelineProgress(timeline)

  // Read off the data rather than written down: the span has to stay true as
  // roles are added at either end of the list.
  const earliest = roles[roles.length - 1]
  const span = `${earliest.start.slice(0, 4)} — present`

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Professional Experience"
      lede="Every role in full, newest first — what the work was and what came out of it."
    >
      <div className="xp">
        <aside className="xp__intro">
          <Badge>Journey</Badge>
          <p className="xp__count u-display">{roles.length} roles</p>
          <p className="xp__span">{span}</p>
        </aside>

        <div className="xp__timeline" ref={timeline}>
          <span className="xp__rail" aria-hidden="true">
            <span className="xp__rail-fill" />
          </span>

          <ul className="xp__list">
            {roles.map((role) => (
              <li key={role.id} className="xp__row" data-testid="role-row" data-reveal>
                <span className="xp__dot" data-timeline-marker aria-hidden="true" />

                <article className="xp__card">
                  <header className="xp__head">
                    <div>
                      <h3 className="xp__title">{role.title}</h3>
                      <p className="xp__company">
                        {role.company} <span>· {role.context}</span>
                      </p>
                    </div>
                    <p className="xp__period">{formatPeriod(role.start, role.end)}</p>
                  </header>

                  <p className="xp__summary u-prose">{role.summary}</p>

                  <ul className="xp__highlights">
                    {role.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>

                  <footer className="xp__foot">
                    <ul className="xp__stack">
                      {role.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="xp__location">{role.location}</p>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
