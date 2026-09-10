import { profile } from '../../data/profile'
import './Footer.scss'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__name">{profile.name}</p>
        <ul className="footer__links">
          <li><a href={`mailto:${profile.email}`}>Email</a></li>
          <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        </ul>
        <p className="footer__legal">© {year} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
