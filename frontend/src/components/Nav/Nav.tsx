import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { Button } from '../Button/Button'
import { profile } from '../../data/profile'
import './Nav.scss'

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const

export function Nav() {
  return (
    <header className="nav-bar">
      <nav className="nav" aria-label="Main">
        <a
          className="nav__mark"
          href="#top"
          aria-label="Anastasiia Horbachova — back to top"
        >
          AH
        </a>
        <ul className="nav__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <ThemeToggle />
          <Button variant="ghost" href={`mailto:${profile.email}`}>Let’s talk</Button>
        </div>
      </nav>
    </header>
  )
}
