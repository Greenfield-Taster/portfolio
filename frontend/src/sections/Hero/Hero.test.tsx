import { render, screen } from '../../test/renderWithTheme'
import { Hero } from './Hero'
import { projects } from '../../data/projects'

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

  it('renders the surname in italic accent, keeping the full name as the heading text', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Anastasiia Horbachova')
    const em = heading.querySelector('em')
    expect(em).not.toBeNull()
    expect(em).toHaveTextContent('Horbachova')
  })

  it('says she is available', () => {
    render(<Hero />)
    expect(screen.getByText(/available for work/i)).toBeInTheDocument()
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
      '/Anastasiia_Horbachova_FullStack.pdf'
    )
  })

  it('links to the work section', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view selected work/i })).toHaveAttribute(
      'href',
      '#work'
    )
  })
})
