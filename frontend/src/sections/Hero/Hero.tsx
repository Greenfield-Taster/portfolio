import { Button } from '../../components/Button/Button'
import { RotatingRole } from '../../components/RotatingRole/RotatingRole'
import { StatTile } from '../../components/StatTile/StatTile'
import { TypedLine } from '../../components/TypedLine/TypedLine'
import { profile } from '../../data/profile'
import { projectCount } from '../../data/select'
import './Hero.scss'

export function Hero() {
  // The project count is the floor, not the total: it counts the client work
  // in Experience plus the side projects, and the plus stands for the rest.
  const stats = [
    { value: profile.years, label: 'Years' },
    { value: String(profile.companies), label: 'Company' },
    { value: String(profile.clients), label: 'Clients' },
    { value: `${projectCount()}+`, label: 'Projects' },
    { value: String(profile.npmPackages), label: 'npm packages' },
  ]

  // Split on the first space only: the surname may be multi-word and belongs
  // on the second line whole. A single-token name keeps the one line it has.
  const firstSpace = profile.name.indexOf(' ')
  const firstName = firstSpace === -1 ? profile.name : profile.name.slice(0, firstSpace)
  const surname = firstSpace === -1 ? '' : profile.name.slice(firstSpace + 1)

  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <p className="hero__status">
          <span className="hero__pulse" aria-hidden="true" />
          <span>{profile.availability}</span>
          <span className="hero__divider" aria-hidden="true" />
          <span>{profile.workAuthorization}</span>
        </p>

        <p className="hero__greeting">Hi, I&rsquo;m</p>

        <h1 className="hero__name">
          <span data-testid="name-line">{firstName}</span>{' '}
          {surname ? <span data-testid="name-line">{surname}</span> : null}
        </h1>

        <RotatingRole roles={profile.roles} />

        <TypedLine text={profile.tagline} />

        <div className="hero__stats">
          {stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <div className="hero__cta" data-testid="hero-cta">
          <Button href="#projects">View projects</Button>
          <Button variant="ghost" href={profile.cvPath} download>
            Download CV
          </Button>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Skip to what I do">
        <span aria-hidden="true">&darr;</span>
      </a>
    </section>
  )
}
