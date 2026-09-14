import { Section } from '../../components/Section/Section'
import { stackGroups } from '../../data/stack'
import { findToolIcon } from '../../data/tools'
import { StackGlyph } from './StackGlyph'
import './Stack.scss'

// Only the groups with a level are counted: they are the tool cards, and the
// closing strip of ways of working is not one more card in the run.
const NUMBERED = stackGroups.filter((group) => group.level)

export function Stack() {
  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="Technical Stack"
      lede="Grouped the way I actually reach for them."
    >
      <div className="stack">
        {stackGroups.map((group) => {
          const number = NUMBERED.indexOf(group) + 1

          return (
            <section
              key={group.id}
              className={`stack__group stack__group--${group.id}`}
              data-testid={`stack-group-${group.id}`}
              data-reveal
            >
              {number > 0 && (
                <span className="stack__number" aria-hidden="true">
                  {String(number).padStart(2, '0')}
                </span>
              )}

              <header className="stack__head">
                <span className="stack__glyph">
                  <StackGlyph name={group.glyph} />
                </span>

                <div className="stack__naming">
                  <h3 className="stack__title">{group.title}</h3>
                  {/* Counted rather than written down, so it cannot drift from
                      the list underneath it. */}
                  <p className="stack__count">
                    {group.items.length} {group.level ? 'tools' : 'practices'}
                  </p>
                </div>

                {group.level && (
                  <span className={`stack__level stack__level--${group.level}`}>
                    {group.level}
                  </span>
                )}
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
                          // A black brand mark takes the page's ink, through
                          // currentColor, rather than vanishing on dark.
                          style={{ color: icon.color ?? 'currentColor' }}
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
          )
        })}
      </div>
    </Section>
  )
}
