import type { StackGroup } from './types'

export const stackGroups: StackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    glyph: 'layout',
    level: 'expert',
    items: [
      'React 19', 'Redux Toolkit', 'Vue.js', 'Three.js', 'Tailwind CSS',
      'SCSS/BEM', 'Material UI', 'shadcn/ui', 'Radix UI', 'Framer Motion', 'i18next',
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    glyph: 'server',
    level: 'advanced',
    items: [
      'Node.js', 'Express.js', 'MedusaJS', 'REST API', 'WebSockets',
      'JWT', 'OAuth 2.0', 'Zod', 'Multer', 'Firebase',
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    glyph: 'braces',
    level: 'expert',
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    id: 'data-devops',
    title: 'Databases & DevOps',
    glyph: 'database',
    level: 'advanced',
    items: [
      'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'GitHub Actions',
      'Azure', 'Vite', 'Webpack', 'ESLint', 'Postman', 'Figma',
    ],
  },
  {
    id: 'ai',
    title: 'AI Tools',
    glyph: 'sparkles',
    level: 'advanced',
    items: ['Claude AI', 'ChatGPT', 'Gemini', 'MCP Servers', 'AI-assisted development workflows'],
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    glyph: 'compass',
    items: [
      'REST API Design', 'Agile/Scrum', 'Payment Integration',
      'SEO & JSON-LD', 'Responsive Design', 'Accessibility (WCAG)', 'CI/CD',
    ],
  },
]
