import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Contact } from './Contact'
import { profile } from '../../data/profile'

describe('Contact', () => {
  it('prints the email address and links it, so it is reachable without the clipboard', () => {
    render(<Contact />)
    expect(screen.getByRole('button', { name: new RegExp(profile.email) })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`
    )
  })

  it('copies the address on a click and says so', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    await user.click(screen.getByRole('button', { name: new RegExp(profile.email) }))

    expect(await screen.findByText('Copied to clipboard')).toBeInTheDocument()
    expect(await navigator.clipboard.readText()).toBe(profile.email)
  })

  it('says plainly when the clipboard is not available', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('blocked'))
    render(<Contact />)

    await user.click(screen.getByRole('button', { name: new RegExp(profile.email) }))

    expect(await screen.findByText(/select the address instead/i)).toBeInTheDocument()
  })

  it('links out to GitHub and LinkedIn in a new tab', () => {
    render(<Contact />)
    for (const [name, href] of [
      ['GitHub', profile.github],
      ['LinkedIn', profile.linkedin],
    ]) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('offers the CV as a download', () => {
    render(<Contact />)
    const cv = screen.getByRole('link', { name: /download cv/i })
    expect(cv).toHaveAttribute('href', profile.cvPath)
    expect(cv).toHaveAttribute('download')
  })

  it('repeats the three numbers from the profile', () => {
    render(<Contact />)
    expect(screen.getByText(profile.years)).toBeInTheDocument()
    expect(screen.getByText(String(profile.clients))).toBeInTheDocument()
    expect(screen.getByText(String(profile.npmPackages))).toBeInTheDocument()
  })

  it('takes no messages of its own', () => {
    render(<Contact />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(document.querySelector('form')).toBeNull()
  })
})
