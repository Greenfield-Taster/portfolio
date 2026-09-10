import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from '../hooks/ThemeProvider'

// useTheme throws outside its provider, on purpose. Components that read the
// theme therefore need one in tests too; this is the standard React Testing
// Library custom render, so a test file only has to change its import.
export function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: ThemeProvider, ...options })
}

export * from '@testing-library/react'
