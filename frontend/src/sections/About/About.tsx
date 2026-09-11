import { Section } from '../../components/Section/Section'
import { ToolMarquee } from '../../components/ToolMarquee/ToolMarquee'
import { profile } from '../../data/profile'
import './About.scss'

export function About() {
  return (
    <Section id="about" eyebrow="About" title="About me" lede={profile.lede}>
      <div className="about" data-reveal>
        <article className="about__card">
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
              <dt>Works</dt>
              <dd>
                <span>{profile.workAuthorization}</span>
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
              reading this page already knows how to skim. Every key here is
              something the card beside it does not already say. */}
          <pre className="about__code" aria-label="Summary of the work, as code">
            <code>
              <span className="about__code-key">const</span> anastasiia = {'{'}{'\n'}
              {'  '}available: <span className="about__code-bool">true</span>,{'\n'}
              {'  '}location: <span className="about__code-str">&apos;Europe&apos;</span>,{'\n'}
              {'  '}focus: <span className="about__code-str">&apos;React &amp; Node&apos;</span>,{'\n'}
              {'  '}ships: <span className="about__code-str">&apos;requirements to deployment&apos;</span>,{'\n'}
              {'}'}
            </code>
          </pre>
        </div>

        <ToolMarquee />
      </div>
    </Section>
  )
}
