import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import emailjs from '@emailjs/browser'
import { Contact } from './Contact'
import * as validateLib from '../../lib/validate'

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}))

describe('Contact', () => {
  it('always shows the email address, so the form is never the only way through', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /horbachova\.site@gmail\.com/ })).toBeInTheDocument()
  })

  it('reports every empty field on submit', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(screen.getByText('Please add your name.')).toBeInTheDocument()
    expect(screen.getByText('Please add an email address so I can reply.')).toBeInTheDocument()
    expect(screen.getByText('Please write a short message.')).toBeInTheDocument()
  })

  it('keeps everything the visitor typed when validation fails, even for a field that is not empty', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.type(screen.getByLabelText(/name/i), 'Olena')
    // A malformed (non-empty) email exercises the "wrong, not missing" branch
    // of validation, distinct from the empty-field case covered above.
    await user.type(screen.getByLabelText(/email/i), 'olena@')
    await user.type(screen.getByLabelText(/message/i), 'I would like to work with you.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('That does not look like an email address.')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toHaveValue('Olena')
    expect(screen.getByLabelText(/email/i)).toHaveValue('olena@')
    expect(screen.getByLabelText(/message/i)).toHaveValue('I would like to work with you.')
  })

  it('ties each error to its field for screen readers', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('says plainly that the form is unavailable when it is not configured', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.type(screen.getByLabelText(/name/i), 'Olena')
    await user.type(screen.getByLabelText(/email/i), 'olena@example.com')
    await user.type(screen.getByLabelText(/message/i), 'I would like to work with you.')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(
      await screen.findByText(/form is not connected yet/i)
    ).toBeInTheDocument()
  })

  it('keeps everything the visitor typed when the form turns out to be unconfigured', async () => {
    const user = userEvent.setup()
    render(<Contact />)
    await user.type(screen.getByLabelText(/name/i), 'Olena')
    await user.type(screen.getByLabelText(/email/i), 'olena@example.com')
    await user.type(screen.getByLabelText(/message/i), 'I would like to work with you.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await screen.findByText(/form is not connected yet/i)
    expect(screen.getByLabelText(/name/i)).toHaveValue('Olena')
    expect(screen.getByLabelText(/email/i)).toHaveValue('olena@example.com')
    expect(screen.getByLabelText(/message/i)).toHaveValue('I would like to work with you.')
  })
})

describe('Contact double-submit guard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('never lets a second overlapping submit reach the send path', async () => {
    // Simulate a configured install (keys present) so the code actually
    // reaches the `sending` state instead of short-circuiting at
    // `unconfigured` — that is the state this guard exists to protect.
    vi.spyOn(validateLib, 'isConfigured').mockReturnValue(true)
    let releaseSend: () => void = () => {}
    vi.mocked(emailjs.send).mockReturnValue(
      new Promise((resolve) => {
        releaseSend = () => resolve(undefined as never)
      })
    )

    const user = userEvent.setup()
    render(<Contact />)
    await user.type(screen.getByLabelText(/name/i), 'Olena')
    await user.type(screen.getByLabelText(/email/i), 'olena@example.com')
    await user.type(screen.getByLabelText(/message/i), 'I would like to work with you.')

    const form = screen.getByLabelText(/name/i).closest('form') as HTMLFormElement

    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()

    // A disabled submit button blocks a second *click*, but not an implicit
    // form submission (e.g. Enter pressed in a focused text field), which
    // fires a plain submit event that never touches the button at all. Fire
    // that directly to prove the in-flight state guard — not the disabled
    // attribute — is what stops the second send.
    fireEvent.submit(form)

    expect(emailjs.send).toHaveBeenCalledTimes(1)
    releaseSend()
  })
})
