import { render, screen, fireEvent, within } from '@testing-library/react'
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
    expect(screen.getByText(/EU work authorization/i)).toBeInTheDocument()
  })

  it('lists languages and education as distinct items, not one blob of text', () => {
    render(<About />)
    const [languageList, educationList] = screen.getAllByRole('list')

    const languageItems = within(languageList).getAllByRole('listitem')
    expect(languageItems.map((li) => li.textContent)).toEqual(
      profile.languages.map((l) => `${l.name} — ${l.level}`)
    )

    const educationItems = within(educationList).getAllByRole('listitem')
    expect(educationItems).toHaveLength(profile.education.length)
    for (const item of profile.education) {
      expect(within(educationList).getByText(item.school)).toBeInTheDocument()
    }
  })

  it('renders the portrait image with a fixed size and descriptive alt text', () => {
    render(<About />)
    const img = screen.getByRole('img', { name: `${profile.name}, full-stack developer` })
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', '/portrait.jpg')
    expect(img).toHaveAttribute('width', '480')
    expect(img).toHaveAttribute('height', '600')
  })

  it('shows a deliberate placeholder in place of the portrait once it fails to load', () => {
    render(<About />)
    const img = screen.getByRole('img', { name: `${profile.name}, full-stack developer` })

    fireEvent.error(img)

    // The broken <img> is replaced, not merely covered — a real failed <img>
    // would otherwise still show the browser's broken-image indicator.
    expect(document.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('AH')).toBeInTheDocument()
    // The placeholder still carries the same accessible name as the photo would.
    expect(
      screen.getByRole('img', { name: `${profile.name}, full-stack developer` })
    ).toBeInTheDocument()
  })
})
