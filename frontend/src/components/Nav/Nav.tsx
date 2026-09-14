import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { useActiveSection } from '../../hooks/useActiveSection'
import { profile } from '../../data/profile'
import { SECTIONS } from '../../data/sections'
import './Nav.scss'

export const NAV_ITEMS = SECTIONS

const TRACKED_IDS = NAV_ITEMS.map((item) => item.id)

export function Nav() {
  const active = useActiveSection(TRACKED_IDS)
  const [menuOpen, setMenuOpen] = useState(false)
  const bar = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!bar.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="nav-bar" ref={bar}>
      <nav className="nav" aria-label="Main">
        <a className="nav__mark" href="#top" aria-label="Anastasiia Horbachova — back to top">
          AH<span aria-hidden="true">.</span>
        </a>
        <div className="nav__links" id="nav-links" data-open={menuOpen ? 'true' : 'false'}>
          <ul className="nav__list">
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
          <a className="nav__resume" href={profile.cvPath} download onClick={() => setMenuOpen(false)}>
            <Icon name="download" />
            Resume
          </a>
        </div>
        <div className="nav__actions">
          <ThemeToggle />
          <Button variant="ghost" href={profile.cvPath} download>
            <Icon name="download" />
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
