import { Section } from '../../components/Section/Section'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { profile } from '../../data/profile'
import './About.scss'

export function About() {
  return (
    <Section id="about" eyebrow="About" title="About me" lede={profile.lede}>
      <div className="about" data-reveal>
        <article className="about__card">
          <Badge>Profile</Badge>

          <p className="about__name u-display">
            <span>Anastasiia</span>
            <span className="about__surname">Horbachova</span>
          </p>

          <dl className="about__card-facts">
            <div className="about__card-fact">
              <dt>Role</dt>
              <dd>
                <strong>{profile.role}</strong>
              </dd>
            </div>

            <div className="about__card-fact">
              <dt>Based</dt>
              <dd>
                <span>Europe · {profile.workAuthorization}</span>
              </dd>
            </div>

            <div className="about__card-fact">
              {/* 'Speaks' rather than 'Languages': it says the same thing in
                  the width the label column actually has. */}
              <dt>Speaks</dt>
              <dd>
                {profile.languages.map((language) => (
                  <span key={language.name}>{language.name} — {language.level}</span>
                ))}
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
              {'  '}stack: [<span className="about__code-str">&apos;React&apos;</span>, <span className="about__code-str">&apos;Node.js&apos;</span>, <span className="about__code-str">&apos;PostgreSQL&apos;</span>],{'\n'}
              {'  '}ships: <span className="about__code-str">&apos;requirements to deployment&apos;</span>,{'\n'}
              {'  '}available: <span className="about__code-bool">true</span>,{'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </div>
    </Section>
  )
}
