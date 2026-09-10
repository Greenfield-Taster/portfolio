import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { HeroCanvas } from '../../components/HeroCanvas/HeroCanvas'
import { StatTile } from '../../components/StatTile/StatTile'
import { profile } from '../../data/profile'
import { projectCount } from '../../data/select'
import './Hero.scss'

export function Hero() {
  const stats = [
    { value: profile.years, label: 'Years' },
    { value: String(profile.companies), label: 'Companies' },
    { value: String(projectCount()), label: 'Projects' },
    { value: String(profile.npmPackages), label: 'npm packages' },
  ]

  // Split on the first space only: "Anastasiia" stays roman, everything
  // after it (the surname — possibly multi-word) renders in the accent
  // italic. A single-token name (no space) falls back to plain text.
  const firstSpace = profile.name.indexOf(' ')
  const firstName = firstSpace === -1 ? profile.name : profile.name.slice(0, firstSpace)
  const surname = firstSpace === -1 ? '' : profile.name.slice(firstSpace + 1)

  return (
    <section className="hero" id="top">
      <HeroCanvas />
      <div className="hero__inner">
        <Badge>{profile.availability}</Badge>

        <p className="u-label hero__eyebrow">
          {profile.role} · {profile.workAuthorization}
        </p>

        <h1 className="hero__name u-display">
          {surname ? (
            <>
              {firstName} <em>{surname}</em>
            </>
          ) : (
            firstName
          )}
        </h1>

        <p className="hero__lede u-prose">{profile.lede}</p>

        <div className="hero__stats">
          {stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <div className="hero__cta">
          <Button href="#work">View selected work</Button>
          <Button variant="ghost" href={profile.cvPath} download>Download CV</Button>
          <Button variant="quiet" href="#contact">Get in touch</Button>
        </div>
      </div>
    </section>
  )
}
