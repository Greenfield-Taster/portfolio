import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeProvider'

export type { Theme } from './ThemeProvider'

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useTheme must be called inside <ThemeProvider>')
  }
  return value
}
