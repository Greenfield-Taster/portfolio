import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('shows the current year so the notice never goes stale', () => {
    render(<Footer />)
    const year = String(new Date().getFullYear())
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('links to email, GitHub and LinkedIn', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:horbachova.site@gmail.com'
    )
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })
})
