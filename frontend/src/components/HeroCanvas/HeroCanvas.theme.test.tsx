import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test/renderWithTheme'
import { HeroCanvas } from './HeroCanvas'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

const refreshTheme = vi.fn()
const setPaused = vi.fn()
const destroy = vi.fn()
const mockCreateHeroScene = vi.fn(() => ({ destroy, setPaused, refreshTheme }))

vi.mock('../../three/heroScene', () => ({
  createHeroScene: mockCreateHeroScene,
}))

describe('HeroCanvas theme sync', () => {
  beforeEach(() => {
    refreshTheme.mockClear()
    setPaused.mockClear()
    destroy.mockClear()
    mockCreateHeroScene.mockClear()
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('refreshes its colours when another component toggles the theme', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ThemeToggle />
        <HeroCanvas />
      </>
    )

    await waitFor(() => expect(mockCreateHeroScene).toHaveBeenCalled())
    expect(refreshTheme).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /switch to .* theme/i }))

    await waitFor(() => expect(refreshTheme).toHaveBeenCalledTimes(1))
  })

  it('has the theme attribute already updated by the time it refreshes', async () => {
    const user = userEvent.setup()
    const seen: (string | undefined)[] = []
    refreshTheme.mockImplementation(() => {
      seen.push(document.documentElement.dataset.theme)
    })

    render(
      <>
        <ThemeToggle />
        <HeroCanvas />
      </>
    )
    await waitFor(() => expect(mockCreateHeroScene).toHaveBeenCalled())

    await user.click(screen.getByRole('button', { name: /switch to .* theme/i }))

    await waitFor(() => expect(seen).toEqual(['dark']))
    refreshTheme.mockImplementation(() => {})
  })

  it('does not refresh its colours when nothing about the theme changed', async () => {
    render(<HeroCanvas />)
    await waitFor(() => expect(mockCreateHeroScene).toHaveBeenCalled())

    document.documentElement.setAttribute('lang', 'uk')

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(refreshTheme).not.toHaveBeenCalled()
  })
})
