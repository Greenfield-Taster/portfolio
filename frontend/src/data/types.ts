export interface Role {
  id: string
  company: string
  context: string
  title: string
  location: string
  start: string
  end: string | null
  summary: string
  highlights: string[]
  stack: string[]
}

export type ProjectArt = 'marker' | 'puzzle' | 'terminal'

export type ProjectStatus = 'live' | 'published' | 'concept'

export interface Project {
  id: string
  name: string
  tagline: string
  art: ProjectArt
  year: string
  role: string
  summary: string
  highlights: string[]
  stack: string[]
  status: ProjectStatus
  links: { live?: string; repo?: string; npm?: string }
}

export type StackLevel = 'expert' | 'advanced'

export type StackGlyph = 'layout' | 'server' | 'braces' | 'database' | 'sparkles' | 'compass'

export interface StackGroup {
  id: string
  title: string
  glyph: StackGlyph
  level?: StackLevel
  items: string[]
}

export interface Profile {
  name: string
  role: string
  roles: string[]
  tagline: string
  availability: string
  workAuthorization: string
  intro: string
  lede: string
  email: string
  linkedin: string
  github: string
  cvPath: string
  siteUrl: string
  education: { school: string; degree: string; years: string }[]
  languages: { name: string; level: string }[]
  years: string
  companies: number
  clients: number
  npmPackages: number
}
