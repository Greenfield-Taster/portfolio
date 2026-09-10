import { useState } from 'react'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { Button } from '../Button/Button'
import { useActiveSection } from '../../hooks/useActiveSection'
import { profile } from '../../data/profile'
import './Nav.scss'

export const NAV_ITEMS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const

// Hoisted so the identity stays stable across renders: useActiveSection keeps
// it in an effect dependency list, and a fresh array every render would tear
// the scroll listener down and rebuild it on each state change.
const TRACKED_IDS = NAV_ITEMS.map((item) => item.id)

export function Nav() {
  const active = useActiveSection(TRACKED_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="nav-bar">
      <nav className="nav" aria-label="Main">
        <a className="nav__mark" href="#top" aria-label="Anastasiia Horbachova — back to top">
          AH<span aria-hidden="true">.</span>
        </a>

        <ul className="nav__links" id="nav-links" data-open={menuOpen ? 'true' : 'false'}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <ThemeToggle />
          <Button variant="ghost" href={profile.cvPath} download>
            Resume
          </Button>
          <button
            type="button"
            className="nav__menu"
            aria-expanded={menuOpen}
            aria-controls="nav-links"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  )
}
