import type { StackGroup } from './types'

export const stackGroups: StackGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      'React 19', 'Redux Toolkit', 'Vue.js', 'Three.js', 'Tailwind CSS',
      'SCSS/BEM', 'Material UI', 'shadcn/ui', 'Radix UI', 'Framer Motion', 'i18next',
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      'Node.js', 'Express.js', 'MedusaJS', 'REST API', 'WebSockets',
      'JWT', 'OAuth 2.0', 'Zod', 'Multer', 'Firebase',
    ],
  },
  {
    id: 'data-devops',
    title: 'Databases & DevOps',
    items: [
      'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'GitHub Actions',
      'Azure', 'Vite', 'Webpack', 'ESLint', 'Postman', 'Figma',
    ],
  },
  {
    id: 'ai',
    title: 'AI Tools',
    items: ['Claude AI', 'ChatGPT', 'Gemini', 'MCP Servers', 'AI-assisted development workflows'],
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    items: [
      'REST API Design', 'Agile/Scrum', 'Payment Integration',
      'SEO & JSON-LD', 'Responsive Design', 'Accessibility (WCAG)', 'CI/CD',
    ],
  },
]
