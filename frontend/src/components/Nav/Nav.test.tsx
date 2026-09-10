import { render, screen, within } from '../../test/renderWithTheme'
import userEvent from '@testing-library/user-event'
import { Nav, NAV_ITEMS } from './Nav'
import { profile } from '../../data/profile'

beforeEach(() => {
  document.body.innerHTML = ''
  // jsdom reports a zero-height document, which reads as "scrolled to the very
  // bottom" and would mark the last section on every test regardless of where
  // the sections sit. Give the page a real height instead.
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 5000,
    configurable: true,
  })
  window.scrollY = 0
})

describe('Nav', () => {
  it('renders a link for every navigation item, and nothing more', () => {
    render(<Nav />)
    expect(NAV_ITEMS.length).toBeGreaterThan(0)

    const list = screen.getByRole('list')
    const links = within(list).getAllByRole('link')
    expect(links).toHaveLength(NAV_ITEMS.length)

    for (const item of NAV_ITEMS) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        `#${item.id}`
      )
    }
  })

  it('offers a theme switch', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: /switch to .* theme/i })).toBeInTheDocument()
  })

  it('is landmarked for screen readers', () => {
    render(<Nav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('downloads the CV straight from the header', () => {
    render(<Nav />)

    const resume = screen.getByRole('link', { name: /resume/i })
    expect(resume).toHaveAttribute('href', profile.cvPath)
    expect(resume).toHaveAttribute('download')
  })

  it('offers no way to send mail, because the site takes no messages', () => {
    render(<Nav />)

    const mailLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('mailto:'))
    expect(mailLinks).toEqual([])
  })

  it('marks the section being read as the current one', () => {
    const about = document.createElement('section')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: -50 }) as DOMRect
    document.body.append(about)

    render(<Nav />)

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')
  })

  it('marks Home while the hero is still on screen', () => {
    const hero = document.createElement('section')
    hero.id = 'top'
    hero.getBoundingClientRect = () => ({ top: -50 }) as DOMRect
    document.body.append(hero)

    const about = document.createElement('section')
    about.id = 'about'
    about.getBoundingClientRect = () => ({ top: 900 }) as DOMRect
    document.body.append(about)

    render(<Nav />)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'true')
    expect(
      screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))
    ).toHaveLength(1)
  })

  it('opens and closes the menu on a narrow screen', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    const toggle = screen.getByRole('button', { name: /menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('link', { name: 'Work' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
