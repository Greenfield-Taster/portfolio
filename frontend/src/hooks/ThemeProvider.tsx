import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (next: Theme) => void
  toggle: () => void
}

// Null default on purpose: a component that reads the theme outside the
// provider is a wiring mistake, and useTheme turns it into a loud error
// rather than a second, private copy of the state that never updates.
export const ThemeContext = createContext<ThemeContextValue | null>(null)

const KEY = 'theme'

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function persist(next: Theme) {
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // storage blocked — the theme still applies for this page view
  }
}

// Stamped synchronously from the setters rather than only from the effect
// below. Effects run child-first, so a consumer's own [theme] effect would
// otherwise fire while `data-theme` still held the previous value — and
// anything that reads a resolved CSS custom property there (the hero scene
// reads `--accent`) would pick up the old colour.
function stamp(next: Theme) {
  document.documentElement.dataset.theme = next
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStored() ?? systemTheme())

  // Covers the initial value; user-initiated changes have already stamped.
  useEffect(() => {
    stamp(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    stamp(next)
    persist(next)
  }, [])

  // Reads `theme` from the closure rather than using a functional update, so
  // that stamping and persisting stay out of the state updater — React is
  // free to call an updater more than once, and it must be pure.
  const toggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
