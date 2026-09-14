import type { Project } from './types'

/**
 * Things built on my own time. The client work lives in Experience; these
 * are the projects with no client at all — made to use, or to learn from.
 */
export const projects: Project[] = [
  {
    id: 'contrlve',
    name: 'contrlve',
    tagline: 'A one-page site for a Ukrainian comedy show',
    art: 'marker',
    year: '2026',
    role: 'Design & build',
    summary:
      'A site for the show КОНТРЛВЕ, to replace the live contrlve.com.ua. The show’s logo is a line of selected text — Ctrl+V — and the whole page is built around that one idea.',
    highlights: [
      'React 19, Vite, TypeScript and Tailwind v4',
      'No animation library at all — every effect is CSS and IntersectionObserver',
      'All content lives in typed data files; a new episode is one line',
      'Static build on Cloudflare Pages, no backend',
    ],
    stack: ['React 19', 'Vite', 'TypeScript', 'Tailwind v4'],
    status: 'concept',
    links: { repo: 'https://github.com/Greenfield-Taster/contrlve' },
  },
  {
    id: 'woodtrick',
    name: 'woodtrick',
    tagline: 'A store redesign where every image is generated in code',
    art: 'puzzle',
    year: '2026',
    role: 'Design & build',
    summary:
      'A design concept for a wooden-puzzle store. The wordmark assembles itself out of ~560 laser-cut pieces, and the product page re-cuts a real 3D puzzle when you change its size.',
    highlights: [
      'Puzzle piece outlines cut procedurally — real tabs, blanks and undercut necks with matching edges',
      'Product artwork, plywood grain and knots all drawn to canvas at runtime: the repo carries no photography and no third-party models',
      'Quality tiers resolve at startup — high, low, and a still tier that honours prefers-reduced-motion',
      'Hero frame cost measured at 0.4 ms across 96 draw calls and ~935k triangles',
    ],
    stack: ['React 19', 'three', '@react-three/fiber', 'TypeScript', 'zustand'],
    status: 'concept',
    links: { repo: 'https://github.com/Greenfield-Taster/woodtrick' },
  },
  {
    id: 'launchkit',
    name: 'LaunchKit',
    tagline: 'Two npm CLI tools that scaffold a working app in one command',
    art: 'terminal',
    year: '2026',
    role: 'Author',
    summary:
      'Open-source generators for the projects I kept starting from scratch. Answer two questions — a name and one brand colour — and get a running app with a design system computed from that colour.',
    highlights: [
      'LaunchKit-Shop: a full e-commerce React 19 app with auth, cart and checkout',
      '170+ SCSS design tokens computed from a single hex value',
      'LaunchKit-Landing: one-page landings with dark/light themes, i18n and Framer Motion',
    ],
    stack: ['Node.js', 'React 19', 'SCSS', 'Framer Motion'],
    status: 'published',
    links: {
      repo: 'https://github.com/Greenfield-Taster/LaunchKit-Shop',
      npm: 'https://www.npmjs.com/package/@greenfield-taster/launchkit-shop',
    },
  },
]
