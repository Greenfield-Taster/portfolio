import { Section } from '../../components/Section/Section'
import { BusinessCard } from '../../components/BusinessCard/BusinessCard'
import { ToolMarquee } from '../../components/ToolMarquee/ToolMarquee'
import { profile } from '../../data/profile'
import './About.scss'

export function About() {
  // Quick facts, in the order a recruiter scans them. The card beside these
  // carries who she is and how to reach her; none of it is repeated here.
  const facts = [
    profile.workAuthorization,
    ...profile.languages.map((language) => `${language.name} — ${language.level}`),
  ]

  return (
    <Section id="about" eyebrow="About" title="About me" lede={profile.lede}>
      {/* Two rows: the card and the summary-as-code side by side at one
          height, then the facts and the schooling as one band under them. */}
      <div className="about" data-reveal>
        <BusinessCard />

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

        <div className="about__body">
          <ul className="about__facts">
            {facts.map((fact) => (
              <li key={fact} className="about__fact">{fact}</li>
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
                    <strong>{item.school}</strong>
                    <span>{item.degree} · {item.years}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </div>

        <ToolMarquee />
      </div>
    </Section>
  )
}
