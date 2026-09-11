import { Section } from '../../components/Section/Section'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { profile } from '../../data/profile'
import { focusAreas } from '../../data/focus'
import { rolesNewestFirst, formatPeriod } from '../../data/select'
import './About.scss'

export function About() {
  // The card states the job she holds now, so it reads the running role off
  // the same list the Experience section does rather than restating it.
  const current = rolesNewestFirst()[0]


  return (
    <Section
      id="about"
      eyebrow="About"
      title="Who I am"
      lede="A full-stack developer who likes the unglamorous half of the job — the payment webhook that has to reconcile, the chat that has to survive a dropped connection, the gallery that has to stay fast at 350 photographs."
    >
      <div className="about" data-reveal>
        <article className="about__card">
          <Badge>Profile</Badge>

          <p className="about__name u-display">
            <span>Anastasiia</span>
            <span className="about__surname">Horbachova</span>
          </p>

          <p className="about__card-lede">{profile.lede}</p>

          <dl className="about__card-facts">
            <div className="about__card-fact">
              <dt>Role</dt>
              <dd>
                <strong>{current.title}</strong>
                <span>{current.company} · {formatPeriod(current.start, current.end)}</span>
              </dd>
            </div>

            <div className="about__card-fact">
              <dt>Based</dt>
              <dd>
                <span>{current.location} · {profile.workAuthorization}</span>
              </dd>
            </div>
          </dl>

          <footer className="about__card-foot">
            <p className="about__open">
              <span className="about__open-dot" aria-hidden="true" />
              {profile.availability}
            </p>
            <Button variant="ghost" href={profile.cvPath} download>
              Resume
            </Button>
          </footer>
        </article>

        <div className="about__body">
          <ul className="about__facts">
            {profile.languages.map((language) => (
              <li key={language.name} className="about__fact">
                {language.name} — {language.level}
              </li>
            ))}
          </ul>

          <dl className="about__edu">
            <dt>Education</dt>
            <dd>
              {/* A list, not a run-on paragraph: two schools with their own
                  degrees and years need real item boundaries read aloud. */}
              <ul>
                {profile.education.map((item) => (
                  <li key={item.school}>
                    <strong>{item.school}</strong> · {item.degree} · {item.years}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>

          {/* Her own summary of the work, in the one notation a developer
              reading this page already knows how to skim. */}
          <pre className="about__code" aria-label="Summary of the work, as code">
            <code>
              <span className="about__code-key">const</span> anastasiia = {'{'}{'\n'}
              {'  '}role: <span className="about__code-str">&apos;{profile.role}&apos;</span>,{'\n'}
              {'  '}stack: [<span className="about__code-str">&apos;React&apos;</span>, <span className="about__code-str">&apos;Node.js&apos;</span>, <span className="about__code-str">&apos;PostgreSQL&apos;</span>],{'\n'}
              {'  '}ships: <span className="about__code-str">&apos;requirements to deployment&apos;</span>,{'\n'}
              {'  '}available: <span className="about__code-bool">true</span>,{'\n'}
              {'}'}
            </code>
          </pre>
        </div>

        <ul className="about__focus">
          {focusAreas.map((area, index) => (
            <li key={area.id} className="about__area">
              <span className="about__area-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="about__area-mark" aria-hidden="true" />
              <h3 className="about__area-title">{area.title}</h3>
              <p className="about__area-items">{area.items.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
