import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    // Vitest defaults to 5s. The contact-form tests type into three fields
    // through userEvent, which advances a real timer per keystroke, and on a
    // loaded machine that lands close enough to the default to fail on timing
    // rather than on behaviour. Raised so a slow run reports slow, not broken.
    testTimeout: 20_000,
  },
})
