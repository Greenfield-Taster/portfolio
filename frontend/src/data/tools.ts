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

/**
 * A tool's logo, from Simple Icons. Importing each icon by name is what keeps
 * the bundle to the forty-odd paths the page draws rather than the whole set.
 */
export interface Tool {
  name: string
  /** SVG path data, drawn in a 0 0 24 24 viewBox. */
  path: string
  /**
   * The brand colour, or null for a brand whose colour is black: drawn as-is
   * it would vanish on the dark theme, so it takes the page's ink instead.
   */
  color: string | null
}

/**
 * Keyed by the names the stack data uses, spelled out entry by entry: a
 * loose match would hand 'GitHub Actions' the Git logo, and a reader would
 * never know the site was quietly wrong. A tool with no entry — Azure, SQL,
 * REST API — is shown as plain text.
 */
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

// Below this relative luminance a brand colour is black for all practical
// purposes — Three.js, Express, Radix — and disappears against the dark
// theme's near-black ground.
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

/** The logo for a tool, or nothing when the icon set has no drawing of it. */
export function findToolIcon(name: string): Tool | undefined {
  const icon = BY_NAME.get(name.toLowerCase())
  return icon && toTool(icon)
}
