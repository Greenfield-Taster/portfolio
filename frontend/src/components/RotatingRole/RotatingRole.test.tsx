import { render, screen, act } from '@testing-library/react'
import { RotatingRole } from './RotatingRole'

const ROLES = ['Full-Stack Developer', 'React Developer', 'Node.js Developer']

function mockReduced(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduced-motion') ? matches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

beforeEach(() => {
  mockReduced(false)
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('RotatingRole', () => {
  it('starts on the first role', () => {
    render(<RotatingRole roles={ROLES} intervalMs={3000} />)

    expect(screen.getByTestId('rotating-role')).toHaveTextContent('Full-Stack Developer')
  })

  it('moves to the next role once the interval passes', () => {
    render(<RotatingRole roles={ROLES} intervalMs={3000} />)

    advance(3000)

    expect(screen.getByTestId('rotating-role')).toHaveTextContent('React Developer')
  })

  it('returns to the first role after the last one', () => {
    render(<RotatingRole roles={ROLES} intervalMs={3000} />)

    advance(3000 * ROLES.length)

    expect(screen.getByTestId('rotating-role')).toHaveTextContent('Full-Stack Developer')
  })

  it('holds still when the visitor asked to reduce motion', () => {
    mockReduced(true)
    render(<RotatingRole roles={ROLES} intervalMs={3000} />)

    advance(3000 * 4)

    expect(screen.getByTestId('rotating-role')).toHaveTextContent('Full-Stack Developer')
  })

  it('names every role once for assistive technology, without the churn', () => {
    render(<RotatingRole roles={ROLES} intervalMs={3000} />)

    // The animated node swaps text every few seconds; announcing each swap
    // would be noise, so it is hidden and one static line carries the roles.
    expect(screen.getByTestId('rotating-role')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText(ROLES.join(', '))).toBeInTheDocument()
  })
})
