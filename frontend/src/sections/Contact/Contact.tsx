import { useEffect, useState } from 'react'
import { Section } from '../../components/Section/Section'
import { Icon } from '../../components/Icon/Icon'
import { profile } from '../../data/profile'
import { projectCount } from '../../data/select'
import './Contact.scss'

type Copied = 'no' | 'yes' | 'failed'

/** How long "Copied" stays up before the button goes back to its offer. */
const COPIED_FOR = 2400

export function Contact() {
  const [copied, setCopied] = useState<Copied>('no')

  useEffect(() => {
    if (copied === 'no') return
    const timer = window.setTimeout(() => setCopied('no'), COPIED_FOR)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied('yes')
    } catch {
      // No clipboard — an old browser, or a page not allowed one. The address
      // is printed right there on the button; say so rather than fail quietly.
      setCopied('failed')
    }
  }

  // The same four numbers the hero opens with, for the reader who scrolled
  // straight to the bottom.
  const stats = [
    { value: profile.years, label: 'years' },
    { value: String(profile.clients), label: 'clients' },
    { value: `${projectCount()}+`, label: 'projects' },
    { value: String(profile.npmPackages), label: 'npm packages' },
  ]

  return (
    <Section id="contact" eyebrow="Contact" title="Get in touch">
      <div className="contact" data-reveal>
        <h3 className="contact__ask u-display">
          {/* Kept on one line so the compound never breaks at its own hyphen. */}
          Looking for a <span className="contact__nowrap">full-stack</span> developer?
        </h3>

        <div className="contact__grid">
          <div className="contact__main">
            <p className="u-label contact__label">Reach me at</p>

            <button type="button" className="contact__copy" onClick={copyEmail}>
              <span className="contact__email">{profile.email}</span>
              <span className="contact__hint" role="status">
                {copied === 'yes' && 'Copied to clipboard'}
                {copied === 'failed' && 'Copy is blocked here — select the address instead'}
                {copied === 'no' && (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Click to copy
                  </>
                )}
              </span>
            </button>

            <ul className="contact__pills">
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Icon name="github" />
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Icon name="linkedin" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>
                  <Icon name="mail" />
                  Email
                </a>
              </li>
              <li>
                <a href={profile.cvPath} download>
                  <Icon name="download" />
                  Download CV
                </a>
              </li>
            </ul>
          </div>

          <dl className="contact__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="contact__stat">
                <dd>{stat.value}</dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <p className="contact__close">Bring the brief — I&rsquo;ll take it from there.</p>
        <p className="contact__note">
          {profile.availability}: full-time roles and project work. {profile.workAuthorization}.
        </p>
      </div>
    </Section>
  )
}
