import { render, screen, within } from '../../test/renderWithTheme'
import { Hero } from './Hero'
import { projects } from '../../data/projects'
import { profile } from '../../data/profile'

// Deliberately a different length than the real data (11 entries): if Hero
// ever hard-codes the projects stat instead of calling projectCount(), this
// mock makes that regression fail loudly instead of coincidentally passing.
vi.mock('../../data/projects', () => ({
  projects: Array.from({ length: 7 }, (_, i) => ({ id: `mock-project-${i}` })),
}))

describe('Hero', () => {
  it('renders the name as the single page heading', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /anastasiia horbachova/i })
    ).toBeInTheDocument()
  })

  it('breaks the name onto its own two lines', () => {
    render(<Hero />)
    const lines = within(screen.getByRole('heading', { level: 1 })).getAllByTestId('name-line')

    expect(lines.map((line) => line.textContent)).toEqual(['Anastasiia', 'Horbachova'])
  })

  it('says she is available', () => {
    render(<Hero />)
    expect(screen.getByText(/available for work/i)).toBeInTheDocument()
  })

  it('cycles her titles under the name', () => {
    render(<Hero />)
    expect(profile.roles.length).toBeGreaterThan(1)
    expect(screen.getByTestId('rotating-role')).toHaveTextContent(profile.roles[0])
  })

  it('carries the tagline in the terminal line', () => {
    render(<Hero />)
    expect(
      screen.getByText(profile.tagline, { selector: '.u-visually-hidden' })
    ).toBeInTheDocument()
  })

  it('shows four stat tiles', () => {
    render(<Hero />)
    expect(screen.getAllByTestId('stat-tile')).toHaveLength(4)
  })

  it('derives the project count from the data, not a literal', () => {
    render(<Hero />)
    expect(screen.getByText(String(projects.length))).toBeInTheDocument()
  })

  it('offers the CV as a download', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      profile.cvPath
    )
  })

  it('links to the work section', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute(
      'href',
      '#work'
    )
  })

  it('offers those two calls to action and nothing else', () => {
    render(<Hero />)
    const cta = within(screen.getByTestId('hero-cta')).getAllByRole('link')

    expect(cta.map((link) => link.textContent)).toEqual([
      'View projects',
      'Download CV',
    ])
  })
})
