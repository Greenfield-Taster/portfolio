import { Section } from '../../components/Section/Section'
import { ToolMarquee } from '../../components/ToolMarquee/ToolMarquee'
import { profile } from '../../data/profile'
import './About.scss'

/** A string value inside the code block, quoted the way the code would quote it. */
function Str({ children }: { children: string }) {
  return <span className="about__code-str">&apos;{children}&apos;</span>
}

export function About() {
  const english = profile.languages.find((language) => language.name === 'English')
  const ukrainian = profile.languages.find((language) => language.name === 'Ukrainian')

  return (
    <Section id="about" eyebrow="About" title="About me" lede={profile.intro}>
      <div className="about">
        {/* The story beside the facts: the paragraph on the left, and on the
            right the same person as an object literal — the one notation a
            developer reading this page already knows how to skim. */}
        <div className="about__intro" data-reveal>
          <p className="about__text">{profile.lede}</p>

          <pre className="about__code" aria-label="Summary, as code">
            <code>
              <span className="about__code-key">const</span> anastasiia = {'{'}{'\n'}
              {'  '}available: <span className="about__code-bool">true</span>,{'\n'}
              {'  '}location: <Str>Europe</Str>,{'\n'}
              {'  '}workPermit: <Str>{profile.workAuthorization}</Str>,{'\n'}
              {'  '}focus: <Str>React &amp; Node</Str>,{'\n'}
              {'  '}ships: <Str>requirements to deployment</Str>,{'\n'}
              {english && <>{'  '}english: <Str>{english.level}</Str>,{'\n'}</>}
              {ukrainian && <>{'  '}ukrainian: <Str>{ukrainian.level}</Str>,{'\n'}</>}
              {'}'}
            </code>
          </pre>
        </div>

        <section className="about__edu" aria-labelledby="about-edu-title" data-reveal>
          <h3 id="about-edu-title" className="u-label about__edu-title">Education</h3>
          <ul className="about__schools">
            {profile.education.map((item, index) => (
              <li key={item.school} className="about__school">
                <span className="about__school-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="about__school-mark" aria-hidden="true" />
                <strong className="about__degree">{item.degree}</strong>
                <span className="about__school-name">{item.school}</span>
                <span className="about__school-years">{item.years}</span>
              </li>
            ))}
          </ul>
        </section>

        <ToolMarquee />
      </div>
    </Section>
  )
}
