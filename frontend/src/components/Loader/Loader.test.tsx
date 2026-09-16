import { render, screen, waitFor } from '@testing-library/react'
import gsap from 'gsap'
import { Loader } from './Loader'

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

beforeEach(() => {
  mockReduced(false)
})

afterEach(() => {
  gsap.globalTimeline.timeScale(1)
})

describe('Loader', () => {
  it('shows the initials and the portfolio label', () => {
    render(<Loader />)

    expect(screen.getByTestId('loader-initials')).toHaveTextContent('AH.')
    expect(screen.getByTestId('loader-label')).toHaveTextContent('PORTFOLIO')
  })

  it('draws the ten-by-eight backdrop grid', () => {
    render(<Loader />)

    expect(screen.getByTestId('loader-grid').children).toHaveLength(80)
  })

  it('stays out of the accessibility tree', () => {
    render(<Loader />)

    expect(screen.getByTestId('loader')).toHaveAttribute('aria-hidden', 'true')
  })

  it('never appears when the visitor asked to reduce motion', () => {
    mockReduced(true)
    render(<Loader />)

    expect(screen.queryByTestId('loader')).toBeNull()
  })

  it('leaves the page once the sequence has played', async () => {
    gsap.globalTimeline.timeScale(50)
    render(<Loader />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()

    await waitFor(() => expect(screen.queryByTestId('loader')).toBeNull(), { timeout: 5000 })
  })
})
