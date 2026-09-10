import { useState } from 'react'
import { Section } from '../../components/Section/Section'
import { rolesNewestFirst, formatPeriod } from '../../data/select'
import './Experience.scss'

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(null)
  const roles = rolesNewestFirst()

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I have worked"
      lede="Six roles, most recent first. Open one to see what I actually built there."
    >
      <ul className="xp">
        {roles.map((role) => {
          const open = openId === role.id
          return (
            <li key={role.id} className="xp__row" data-testid="role-row" data-reveal>
              <button
                type="button"
                className="xp__trigger"
                aria-expanded={open}
                aria-controls={`xp-${role.id}`}
                onClick={() => setOpenId(open ? null : role.id)}
              >
                <span className="xp__company">{role.company}</span>
                <span className="xp__context">{role.context}</span>
                <span className="xp__title">{role.title}</span>
                <span className="xp__period">{formatPeriod(role.start, role.end)}</span>
                <span className="xp__chev" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>

              <div className="xp__detail" id={`xp-${role.id}`} hidden={!open}>
                <p className="xp__summary u-prose">{role.summary}</p>
                <ul className="xp__highlights">
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className="xp__stack">
                  {role.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="xp__location">{role.location}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
