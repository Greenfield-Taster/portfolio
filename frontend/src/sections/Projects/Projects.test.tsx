import { render, screen, within } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from '../../data/projects'

describe('Projects', () => {
  it('shows every side project, in the order the data lists them', () => {
    render(<Projects />)
    const cards = screen.getAllByTestId('project-card')

    expect(cards).toHaveLength(projects.length)
    cards.forEach((card, index) => {
      expect(
        within(card).getByRole('heading', { level: 3, name: projects[index].name })
      ).toBeInTheDocument()
    })
  })

  it('shows every highlight without asking the reader to open anything', () => {
    render(<Projects />)
    const cards = screen.getAllByTestId('project-card')

    projects.forEach((project, index) => {
      expect(within(cards[index]).getByText(project.summary)).toBeVisible()
      for (const highlight of project.highlights) {
        expect(within(cards[index]).getByText(highlight)).toBeVisible()
      }
    })
  })

  it('links each project to its code, in a new tab', () => {
    render(<Projects />)
    const cards = screen.getAllByTestId('project-card')

    projects.forEach((project, index) => {
      const link = within(cards[index]).getByRole('link', { name: /github/i })
      expect(link).toHaveAttribute('href', project.links.repo)
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('links a published package to npm as well', () => {
    render(<Projects />)
    const launchkit = projects.find((p) => p.id === 'launchkit')!
    const card = screen.getAllByTestId('project-card')[projects.indexOf(launchkit)]

    expect(within(card).getByRole('link', { name: /npm/i })).toHaveAttribute(
      'href',
      launchkit.links.npm
    )
  })

  it('keeps the cover art out of the accessibility tree', () => {
    render(<Projects />)
    for (const card of screen.getAllByTestId('project-card')) {
      expect(within(card).getByTestId('project-art')).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('says where each project stands in plain words', () => {
    render(<Projects />)
    expect(screen.getByText('On npm')).toBeInTheDocument()
    expect(screen.getAllByText('Design concept')).toHaveLength(2)
  })
})
