import { useState } from 'react'
import { Section } from '../../components/Section/Section'
import { profile } from '../../data/profile'
import './About.scss'

// Kept in one place so the image and its fallback always announce the same
// thing to assistive tech, whichever one is actually on screen.
const PORTRAIT_ALT = `${profile.name}, full-stack developer`

export function About() {
  const [portraitFailed, setPortraitFailed] = useState(false)

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Who I am"
      lede="A full-stack developer who likes the unglamorous half of the job — the payment webhook that has to reconcile, the chat that has to survive a dropped connection, the gallery that has to stay fast at 350 photographs."
    >
      <div className="about" data-reveal>
        <div className="about__portrait">
          {portraitFailed ? (
            // No photo has shipped yet. Rather than let the browser draw a
            // broken-image icon, swap in a quiet placeholder that carries the
            // same accessible name the real photo would.
            <div className="about__portrait-fallback" role="img" aria-label={PORTRAIT_ALT}>
              AH
            </div>
          ) : (
            <img
              src="/portrait.jpg"
              alt={PORTRAIT_ALT}
              width={480}
              height={600}
              loading="lazy"
              onError={() => setPortraitFailed(true)}
            />
          )}
        </div>

        <dl className="about__facts">
          <div className="about__fact">
            <dt>Based in</dt>
            <dd>Ukraine · {profile.workAuthorization}</dd>
          </div>

          <div className="about__fact">
            <dt>Languages</dt>
            <dd>
              <ul className="about__fact-list">
                {profile.languages.map((l) => (
                  <li key={l.name}>{l.name} — {l.level}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="about__fact">
            <dt>Education</dt>
            <dd>
              <ul className="about__fact-list">
                {profile.education.map((e) => (
                  <li key={e.school}>
                    <strong>{e.school}</strong> · {e.degree} · {e.years}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  )
}
