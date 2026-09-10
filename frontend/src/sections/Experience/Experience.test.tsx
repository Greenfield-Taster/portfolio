import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Experience } from './Experience'
import { roles } from '../../data/experience'

describe('Experience', () => {
  it('lists every role', () => {
    render(<Experience />)
    for (const role of roles) {
      expect(screen.getByText(role.company)).toBeInTheDocument()
    }
  })

  it('puts the current role first', () => {
    render(<Experience />)
    const items = screen.getAllByTestId('role-row')
    expect(items[0]).toHaveTextContent('Kryla Nadii')
  })

  it('marks an ongoing role as Present', () => {
    render(<Experience />)
    expect(screen.getByText(/Jul 2026 — Present/)).toBeInTheDocument()
  })

  it('keeps details collapsed until asked', () => {
    render(<Experience />)
    expect(screen.getByRole('button', { name: /Kryla Nadii/ })).toBeInTheDocument()
    expect(
      screen.queryByText(/430\+ token SCSS design system/)
    ).not.toBeVisible()
  })

  it('reveals the highlights when a role is opened', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    await user.click(screen.getByRole('button', { name: /Kryla Nadii/ }))
    expect(
      screen.getByText(/430\+ token SCSS design system/)
    ).toBeInTheDocument()
  })

  it('exposes the open state to assistive technology', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const trigger = screen.getByRole('button', { name: /Kryla Nadii/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes an open role when its trigger is clicked again', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const trigger = screen.getByRole('button', { name: /Kryla Nadii/ })

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByText(/430\+ token SCSS design system/)
    ).not.toBeVisible()
  })

  it('closes the previously open role when a different role is opened', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const kryla = screen.getByRole('button', { name: /Kryla Nadii/ })
    const justSleep = screen.getByRole('button', { name: /Just Sleep/ })

    await user.click(kryla)
    expect(kryla).toHaveAttribute('aria-expanded', 'true')

    await user.click(justSleep)
    expect(justSleep).toHaveAttribute('aria-expanded', 'true')
    expect(kryla).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByText(/430\+ token SCSS design system/)
    ).not.toBeVisible()
    expect(screen.getByText(/Phone \+ OTP auth via TurboSMS/)).toBeVisible()
  })
})
