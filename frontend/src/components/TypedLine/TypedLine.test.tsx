import { render, screen, act } from '@testing-library/react'
import { TypedLine } from './TypedLine'

const TEXT = 'Building React and Node applications'

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

describe('TypedLine', () => {
  it('types the line out one character at a time', () => {
    render(<TypedLine text={TEXT} speedMs={40} />)

    advance(40 * 8)
    const typed = screen.getByTestId('typed-line').textContent ?? ''

    expect(TEXT.startsWith(typed)).toBe(true)
    expect(typed.length).toBeGreaterThan(0)
    expect(typed.length).toBeLessThan(TEXT.length)
  })

  it('ends with the whole line', () => {
    render(<TypedLine text={TEXT} speedMs={40} />)

    advance(40 * (TEXT.length + 1))

    expect(screen.getByTestId('typed-line')).toHaveTextContent(TEXT)
  })

  it('shows the whole line at once when the visitor asked to reduce motion', () => {
    mockReduced(true)
    render(<TypedLine text={TEXT} speedMs={40} />)

    expect(screen.getByTestId('typed-line')).toHaveTextContent(TEXT)
  })

  it('gives assistive technology the finished line rather than the animation', () => {
    render(<TypedLine text={TEXT} speedMs={40} />)

    expect(screen.getByTestId('typed-line')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText(TEXT, { selector: '.u-visually-hidden' })).toBeInTheDocument()
  })
})
