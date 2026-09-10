import { Section } from '../../components/Section/Section'
import { stackGroups } from '../../data/stack'
import './Stack.scss'

export function Stack() {
  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="What I work with"
      lede="Grouped the way I actually reach for them."
    >
      <div className="stack">
        {stackGroups.map((group) => (
          <section key={group.id} className="stack__group" data-reveal>
            <h3 className="stack__title">{group.title}</h3>
            <ul className="stack__items">
              {group.items.map((item) => (
                <li key={item} data-testid="stack-item">{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  )
}
