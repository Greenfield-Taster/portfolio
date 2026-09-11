import type { FocusArea } from './types'

/**
 * Three cards under the About text. Each one names work she has actually
 * shipped — the integrations line is the Just Sleep storefront — so they read
 * as what she does rather than as a second copy of the Stack section.
 */
export const focusAreas: FocusArea[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: ['React 19', 'TypeScript', 'Redux Toolkit', 'SCSS', 'Three.js'],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: ['Node.js', 'MedusaJS v2', 'PostgreSQL', 'REST', 'WebSockets'],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: ['Payments', 'Delivery carriers', 'OAuth 2.0', 'Transactional email'],
  },
]
