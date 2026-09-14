export interface SectionTop {
  id: string
  top: number
}

export interface ActiveSectionInput {
  sections: SectionTop[]
  probeY: number
  atBottom: boolean
}

export function pickActiveSection({
  sections,
  probeY,
  atBottom,
}: ActiveSectionInput): string | null {
  if (sections.length === 0) return null
  if (atBottom) return sections[sections.length - 1].id

  let active = sections[0].id
  for (const section of sections) {
    if (section.top <= probeY) active = section.id
  }
  return active
}
