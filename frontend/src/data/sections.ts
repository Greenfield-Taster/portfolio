export const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const

const NUMBERED = SECTIONS.filter((section) => section.id !== 'top')

export function sectionNumber(id: string): string | null {
  const index = NUMBERED.findIndex((section) => section.id === id)
  return index === -1 ? null : String(index + 1).padStart(2, '0')
}
