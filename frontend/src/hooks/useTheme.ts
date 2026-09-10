import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeProvider'

export type { Theme } from './ThemeProvider'

/**
 * Reads the one shared theme. Any number of components may call this and they
 * all see the same state and the same updates — which is the whole point:
 * before this was a context, a second caller got its own private copy that
 * never reacted to the toggle in the nav.
 *
 * Throws outside <ThemeProvider>, deliberately: a silent default would be the
 * exact failure mode this hook exists to rule out.
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useTheme must be called inside <ThemeProvider>')
  }
  return value
}
