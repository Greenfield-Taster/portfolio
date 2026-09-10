import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button with type="button" by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveAttribute(
      'type',
      'button'
    )
  })

  it('renders a button with type="submit" when requested', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute(
      'type',
      'submit'
    )
  })

  it('renders an anchor when href is given', () => {
    render(<Button href="#work">Jump</Button>)
    expect(screen.getByRole('link', { name: 'Jump' })).toHaveAttribute('href', '#work')
  })

  it('opens external links in a new tab, but not internal ones', () => {
    render(
      <>
        <Button href="https://github.com/example">External</Button>
        <Button href="#work">Internal</Button>
      </>
    )
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'target',
      '_blank'
    )
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'rel',
      'noreferrer'
    )
    expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute('target')
    expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute('rel')
  })

  it('calls onClick when the anchor variant is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button href="#work" onClick={onClick}>
        Jump
      </Button>
    )
    await user.click(screen.getByRole('link', { name: 'Jump' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is not disabled by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).not.toBeDisabled()
  })

  it('disables the rendered button when disabled is true', () => {
    render(<Button disabled>Sending…</Button>)
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  })

  it('blocks clicks on a disabled button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Sending…
      </Button>
    )
    await user.click(screen.getByRole('button', { name: 'Sending…' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
