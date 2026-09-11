import { render, screen, within } from '@testing-library/react'
import { About } from './About'
import { profile } from '../../data/profile'
import { focusAreas } from '../../data/focus'
import { rolesNewestFirst } from '../../data/select'

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

  it('lists languages and education as distinct items, not one blob of text', () => {
    render(<About />)

    const languageItems = profile.languages.map((l) => `${l.name} — ${l.level}`)
    for (const label of languageItems) {
      expect(screen.getByText(new RegExp(label.replace(/[-—]/g, '.')))).toBeInTheDocument()
    }

    const education = screen.getByText('Education').closest('dl') as HTMLElement
    const educationList = within(education).getByRole('list')
    expect(within(educationList).getAllByRole('listitem')).toHaveLength(profile.education.length)
  })

  it('names the job she holds now, read off the same list Experience uses', () => {
    render(<About />)
    const current = rolesNewestFirst()[0]

    // Hard-coding the running role here is the regression this guards: it
    // would go stale the moment a new one is added to the experience data.
    expect(screen.getByText(current.title)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(current.company))).toBeInTheDocument()
  })

  it('offers the CV from the profile card', () => {
    render(<About />)
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', profile.cvPath)
  })

  it('shows every focus area with what it is built from', () => {
    render(<About />)
    for (const area of focusAreas) {
      expect(screen.getByRole('heading', { name: area.title })).toBeInTheDocument()
      expect(screen.getByText(area.items.join(' · '))).toBeInTheDocument()
    }
  })
})
