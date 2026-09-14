import { render, screen, within } from '@testing-library/react'
import { About } from './About'
import { profile } from '../../data/profile'

describe('About', () => {
  it('opens with the one-line intro and carries the full lede', () => {
    render(<About />)
    expect(screen.getByText(profile.intro)).toBeInTheDocument()
    expect(screen.getByText(profile.lede)).toBeInTheDocument()
  })

  it('states the English level, because recruiters look for it', () => {
    render(<About />)
    expect(screen.getByText(/B2 — Duolingo certified/)).toBeInTheDocument()
  })

  it('states the work authorization', () => {
    render(<About />)
    expect(screen.getByText(new RegExp(profile.workAuthorization, 'i'))).toBeInTheDocument()
  })

  it('says where she works without pinning her to a street address', () => {
    render(<About />)
    expect(screen.getByText(/Europe/)).toBeInTheDocument()
  })

  it('lists both schools, each as its own item', () => {
    render(<About />)

    const education = screen.getByRole('region', { name: 'Education' })
    const items = within(education).getAllByRole('listitem')
    expect(items).toHaveLength(profile.education.length)

    profile.education.forEach((item, index) => {
      expect(items[index]).toHaveTextContent(item.school)
      expect(items[index]).toHaveTextContent(item.degree)
      expect(items[index]).toHaveTextContent(item.years)
    })
  })

  it('ends with the strip of tools', () => {
    render(<About />)
    expect(screen.getByTestId('tool-marquee')).toBeInTheDocument()
  })
})
