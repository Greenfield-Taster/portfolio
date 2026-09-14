import {
  siClaude,
  siCss,
  siDocker,
  siEslint,
  siExpress,
  siFigma,
  siFirebase,
  siFramer,
  siGit,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siI18next,
  siJavascript,
  siJsonwebtokens,
  siMedusa,
  siModelcontextprotocol,
  siMongodb,
  siMui,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siRadixui,
  siReact,
  siRedux,
  siSass,
  siShadcnui,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVite,
  siVuedotjs,
  siWebpack,
  siZod,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

export interface Tool {
  name: string
  path: string
  color: string | null
}

const ICONS: Record<string, SimpleIcon> = {
  'JavaScript': siJavascript,
  'TypeScript': siTypescript,
  'HTML5': siHtml5,
  'CSS3': siCss,
  'React': siReact,
  'React 19': siReact,
  'Redux': siRedux,
  'Redux Toolkit': siRedux,
  'Vue.js': siVuedotjs,
  'Three.js': siThreedotjs,
  'Tailwind CSS': siTailwindcss,
  'Sass': siSass,
  'SCSS/BEM': siSass,
  'Material UI': siMui,
  'shadcn/ui': siShadcnui,
  'Radix UI': siRadixui,
  'Framer Motion': siFramer,
  'i18next': siI18next,
  'Node.js': siNodedotjs,
  'Express': siExpress,
  'Express.js': siExpress,
  'MedusaJS': siMedusa,
  'JWT': siJsonwebtokens,
  'Zod': siZod,
  'Firebase': siFirebase,
  'PostgreSQL': siPostgresql,
  'MongoDB': siMongodb,
  'Docker': siDocker,
  'Git': siGit,
  'GitHub Actions': siGithubactions,
  'Vite': siVite,
  'Webpack': siWebpack,
  'ESLint': siEslint,
  'Postman': siPostman,
  'Figma': siFigma,
  'Claude AI': siClaude,
  'Gemini': siGooglegemini,
  'MCP Servers': siModelcontextprotocol,
}

const BY_NAME = new Map(
  Object.entries(ICONS).map(([name, icon]) => [name.toLowerCase(), icon])
)

const NEAR_BLACK = 0.05

function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

function toTool(icon: SimpleIcon): Tool {
  return {
    name: icon.title,
    path: icon.path,
    color: luminance(icon.hex) < NEAR_BLACK ? null : `#${icon.hex}`,
  }
}

export function findToolIcon(name: string): Tool | undefined {
  const icon = BY_NAME.get(name.toLowerCase())
  return icon && toTool(icon)
}
