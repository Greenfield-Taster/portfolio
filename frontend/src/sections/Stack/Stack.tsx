import { Section } from '../../components/Section/Section'
import { stackGroups } from '../../data/stack'
import { findToolIcon } from '../../data/tools'
import './Stack.scss'

export function Stack() {
  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="Technical Stack"
      lede="Grouped the way I actually reach for them."
    >
      <div className="stack">
        {stackGroups.map((group, index) => (
          <section key={group.id} className="stack__group" data-reveal>
            <span className="stack__number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>

            <header className="stack__head">
              <h3 className="stack__title">{group.title}</h3>
              {/* Counted rather than written down, so it cannot drift from
                  the list underneath it. */}
              <p className="stack__count">{group.items.length} tools</p>
            </header>

            <ul className="stack__items">
              {group.items.map((item) => {
                const icon = findToolIcon(item)
                return (
                  <li key={item} data-testid="stack-item">
                    {icon && (
                      <svg
                        className="stack__logo"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d={icon.path} fill="currentColor" />
                      </svg>
                    )}
                    {item}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  )
}
