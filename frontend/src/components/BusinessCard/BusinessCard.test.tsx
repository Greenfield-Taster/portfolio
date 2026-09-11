import { render, screen } from '@testing-library/react'
import { BusinessCard } from './BusinessCard'
import { profile } from '../../data/profile'

describe('BusinessCard', () => {
  it('carries the name and the role it belongs to', () => {
    render(<BusinessCard />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
    expect(screen.getByText(profile.role)).toBeInTheDocument()
  })

  it('makes the email address something you can actually send to', () => {
    render(<BusinessCard />)
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`
    )
  })

  it('shows the handle but links the full profile', () => {
    render(<BusinessCard />)

    // A card prints the account name; the address is what the link is for.
    const github = screen.getByRole('link', { name: 'Greenfield-Taster' })
    expect(github).toHaveAttribute('href', profile.github)

    const linkedin = screen.getByRole('link', { name: 'anastasiia-horbachova' })
    expect(linkedin).toHaveAttribute('href', profile.linkedin)
  })

  it('keeps the monogram out of the accessibility tree', () => {
    render(<BusinessCard />)

    // It is the name again, drawn as a device. Read out it would announce
    // two letters before the name they stand for.
    const mark = screen.getByText(/^AH/).closest('[aria-hidden]')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
  })
})
