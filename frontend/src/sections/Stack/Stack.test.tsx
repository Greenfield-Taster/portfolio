import { render, screen, within } from '@testing-library/react'
import { Stack } from './Stack'
import { stackGroups } from '../../data/stack'

describe('Stack', () => {
  it('renders every group', () => {
    render(<Stack />)
    for (const group of stackGroups) {
      expect(screen.getByText(group.title)).toBeInTheDocument()
    }
  })

  it('renders every item in every group', () => {
    render(<Stack />)
    const total = stackGroups.reduce((sum, g) => sum + g.items.length, 0)
    expect(screen.getAllByTestId('stack-item')).toHaveLength(total)
  })

  it('groups items under their own heading for screen readers', () => {
    render(<Stack />)
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
  })

  it('says how well each group of tools is known', () => {
    render(<Stack />)

    for (const group of stackGroups) {
      const card = screen.getByTestId(`stack-group-${group.id}`)
      if (group.level) {
        expect(within(card).getByText(group.level, { exact: false })).toBeInTheDocument()
      } else {
        expect(within(card).queryByText(/expert|advanced/i)).not.toBeInTheDocument()
      }
    }
  })

  it('counts the tools in a group off the list rather than off a literal', () => {
    render(<Stack />)
    const frontend = stackGroups.find((g) => g.id === 'frontend')!
    const card = screen.getByTestId('stack-group-frontend')
    expect(within(card).getByText(`${frontend.items.length} tools`)).toBeInTheDocument()
  })

  it('draws a tool in its own brand colour where it has a logo', () => {
    render(<Stack />)
    const react = screen.getByText('React 19').closest('[data-testid="stack-item"]')!
    const logo = react.querySelector('svg')!
    expect(logo).toHaveAttribute('aria-hidden', 'true')
    expect(logo.style.color).not.toBe('')
  })

  it('keeps a tool with no logo as plain text rather than a broken image', () => {
    render(<Stack />)
    const item = screen.getByText('REST API').closest('[data-testid="stack-item"]')!
    expect(item.querySelector('svg, img')).toBeNull()
  })
})
