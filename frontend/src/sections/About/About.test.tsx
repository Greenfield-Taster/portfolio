import { render, screen, within } from '@testing-library/react'
import { About } from './About'
import { profile } from '../../data/profile'

describe('About', () => {
  it('lists both schools', () => {
    render(<About />)
    for (const item of profile.education) {
      expect(screen.getByText(item.school)).toBeInTheDocument()
    }
  })

  it('states the English level, because recruiters look for it', () => {
    render(<About />)
    expect(screen.getByText(/B2 — Duolingo certified/)).toBeInTheDocument()
  })

  it('states the work authorization', () => {
    render(<About />)
    expect(screen.getByText(new RegExp(profile.workAuthorization, 'i'))).toBeInTheDocument()
  })

  it('gives every school its own list item, not one blob of text', () => {
    render(<About />)

    const education = screen.getByText('Education').closest('dl') as HTMLElement
    const list = within(education).getByRole('list')
    expect(within(education).getAllByRole('listitem')).toHaveLength(profile.education.length)
    expect(list).toBeInTheDocument()
  })

  it('names the role she is hired for, not the title of one job', () => {
    render(<About />)

    // The card says what she does, which is a fact about her rather than
    // about her current employer — that belongs to the Experience section.
    expect(screen.getByText(profile.role)).toBeInTheDocument()
  })

  it('offers the CV from the profile card', () => {
    render(<About />)
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', profile.cvPath)
  })

  it('says where she works without pinning her to a street address', () => {
    render(<About />)
    expect(screen.getByText(/Europe/)).toBeInTheDocument()
  })
})
