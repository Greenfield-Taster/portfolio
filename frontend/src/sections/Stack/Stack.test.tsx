import { render, screen } from '@testing-library/react'
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
})
