import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Work } from './Work'
import { featuredProjects, compactProjects } from '../../data/select'

describe('Work', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('renders every project across both groups', () => {
    render(<Work />)
    const expected = featuredProjects().length + compactProjects().length
    expect(screen.getAllByTestId('project-card')).toHaveLength(expected)
  })

  it('shows CV projects before GitHub projects', () => {
    render(<Work />)
    const names = screen.getAllByTestId('project-card').map((c) => c.textContent ?? '')
    const justSleep = names.findIndex((t) => t.includes('Just Sleep'))
    const woodtrick = names.findIndex((t) => t.includes('woodtrick'))
    expect(justSleep).toBeLessThan(woodtrick)
  })

  it('shows CV projects before GitHub projects within the compact grid', () => {
    render(<Work />)
    const grid = screen.getByTestId('compact-grid')
    const cards = within(grid).getAllByTestId('project-card')

    const sourceByName = new Map(compactProjects().map((p) => [p.name, p.source]))
    const sources = cards.map((card) => {
      const name = [...sourceByName.keys()].find((n) => card.textContent?.includes(n))
      return name ? sourceByName.get(name) : undefined
    })

    expect(sources).not.toContain(undefined)
    const lastCv = sources.lastIndexOf('cv')
    const firstGithub = sources.indexOf('github')
    expect(lastCv).toBeGreaterThan(-1)
    expect(firstGithub).toBeGreaterThan(-1)
    expect(lastCv).toBeLessThan(firstGithub)
  })

  it('opens no panel by default', () => {
    render(<Work />)
    expect(screen.queryByTestId('project-panel')).not.toBeInTheDocument()
  })

  it('opens the panel when a card is activated', async () => {
    const user = userEvent.setup()
    render(<Work />)
    await user.click(screen.getByRole('button', { name: /open details for woodtrick/i }))
    expect(screen.getByTestId('project-panel')).toBeInTheDocument()
  })

  it('closes the panel on Escape', async () => {
    const user = userEvent.setup()
    render(<Work />)
    await user.click(screen.getByRole('button', { name: /open details for contrlve/i }))
    await user.keyboard('{Escape}')
    expect(screen.queryByTestId('project-panel')).not.toBeInTheDocument()
  })

  it('opens the project named in the address', () => {
    window.location.hash = '#work/launchkit'
    render(<Work />)
    expect(screen.getByTestId('project-panel')).toHaveTextContent('LaunchKit')
  })
})

describe('Work panel placement', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  const featuredGrid = () => document.querySelector('.work__featured')!
  const compactGrid = () => screen.getByTestId('compact-grid')
  const cardFor = (id: string) => document.getElementById(`work-card-${id}`)!.closest('.card')!
  const openButton = (name: string) =>
    screen.getByRole('button', { name: new RegExp(`open details for ${name}`, 'i') })

  it('puts a compact project’s panel inside the compact grid, right after its card', async () => {
    const user = userEvent.setup()
    render(<Work />)
    const compact = compactProjects()[2]

    await user.click(openButton(compact.name))

    const panel = screen.getByTestId('project-panel')
    expect(panel).toHaveTextContent(compact.name)
    expect(panel.parentElement).toBe(compactGrid())
    expect(cardFor(compact.id).nextElementSibling).toBe(panel)
  })

  it('puts a featured project’s panel inside the featured grid, right after its card', async () => {
    const user = userEvent.setup()
    render(<Work />)
    const featured = featuredProjects()[0]

    await user.click(openButton(featured.name))

    const panel = screen.getByTestId('project-panel')
    expect(panel).toHaveTextContent(featured.name)
    expect(panel.parentElement).toBe(featuredGrid())
    expect(cardFor(featured.id).nextElementSibling).toBe(panel)
  })

  it('never has more than one panel in the DOM', async () => {
    const user = userEvent.setup()
    render(<Work />)

    // featured first, then compact — the panel has to move to the new card,
    // across grids, not gain a second instance.
    const featured = featuredProjects()[0]
    await user.click(openButton(featured.name))
    expect(screen.getAllByTestId('project-panel')).toHaveLength(1)
    expect(cardFor(featured.id).nextElementSibling).toBe(screen.getByTestId('project-panel'))

    const compact = compactProjects()[0]
    await user.click(openButton(compact.name))
    expect(screen.getAllByTestId('project-panel')).toHaveLength(1)
    expect(cardFor(compact.id).nextElementSibling).toBe(screen.getByTestId('project-panel'))
    expect(featuredGrid().querySelector('[data-testid="project-panel"]')).toBeNull()
  })

  it('leaves the grids holding only cards when nothing is open', () => {
    render(<Work />)
    for (const grid of [featuredGrid(), compactGrid()]) {
      for (const child of grid.children) {
        expect(child).toHaveAttribute('data-testid', 'project-card')
      }
    }
  })

  it('places a deep-linked compact project right after its own card', () => {
    const compact = compactProjects()[3]
    window.location.hash = `#work/${compact.id}`
    render(<Work />)

    const panel = screen.getByTestId('project-panel')
    expect(panel).toHaveTextContent(compact.name)
    expect(panel.parentElement).toBe(compactGrid())
    expect(cardFor(compact.id).nextElementSibling).toBe(panel)
  })

  it('focuses the panel on open and returns focus to the card on close', async () => {
    const user = userEvent.setup()
    render(<Work />)
    const compact = compactProjects()[0]

    await user.click(
      screen.getByRole('button', { name: new RegExp(`open details for ${compact.name}`, 'i') })
    )
    expect(screen.getByTestId('project-panel')).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(document.getElementById(`work-card-${compact.id}`)).toHaveFocus()
  })

  it('returns focus to the right card after a deep link, too', async () => {
    const user = userEvent.setup()
    const compact = compactProjects()[1]
    window.location.hash = `#work/${compact.id}`
    render(<Work />)

    expect(screen.getByTestId('project-panel')).toHaveFocus()

    await user.click(screen.getByRole('button', { name: /close project details/i }))
    expect(document.getElementById(`work-card-${compact.id}`)).toHaveFocus()
  })
})
