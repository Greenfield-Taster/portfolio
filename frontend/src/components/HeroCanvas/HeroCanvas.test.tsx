import { render, screen } from '../../test/renderWithTheme'
import { HeroCanvas } from './HeroCanvas'

describe('HeroCanvas', () => {
  it('hides the decoration from assistive technology', () => {
    render(<HeroCanvas />)
    expect(screen.getByTestId('hero-canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders without throwing when WebGL is unavailable', () => {
    expect(() => render(<HeroCanvas />)).not.toThrow()
  })
})
