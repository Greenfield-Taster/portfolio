import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the site owner name as the page heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /anastasiia horbachova/i })
    ).toBeInTheDocument()
  })

  it('puts the scene behind the whole page rather than inside the hero', () => {
    render(<App />)

    // The landscape is the page's backdrop: it has to sit outside <main> so
    // that scrolling past the hero does not scroll it away. Nesting it back in
    // the hero would stop the sections below showing anything through them.
    const canvas = screen.getByTestId('hero-canvas')
    expect(canvas.closest('main')).toBeNull()
    expect(canvas.closest('.hero')).toBeNull()
  })
})
