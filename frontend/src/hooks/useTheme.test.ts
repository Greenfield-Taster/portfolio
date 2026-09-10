import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'
import { ThemeProvider } from './ThemeProvider'

function mockPrefersDark(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('dark') ? matches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockPrefersDark(false)
  })

  it('falls back to the system preference when nothing is stored', () => {
    mockPrefersDark(true)
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe('dark')
  })

  it('prefers a stored choice over the system preference', () => {
    mockPrefersDark(true)
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe('light')
  })

  it('stamps the chosen theme on the document element', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.setTheme('dark'))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('persists the choice so it survives a reload', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.toggle())
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggles back to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
  })

  it('survives localStorage throwing', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider })
    expect(result.current.theme).toBe('light')
    spy.mockRestore()
  })
})
