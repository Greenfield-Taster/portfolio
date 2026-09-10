import { render, screen, within } from '../../test/renderWithTheme'
import { Nav, NAV_ITEMS } from './Nav'

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
})
