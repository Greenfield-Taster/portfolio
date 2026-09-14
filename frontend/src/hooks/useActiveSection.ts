import { useEffect, useState } from 'react'
import { pickActiveSection } from '../lib/activeSection'

const PROBE_RATIO = 0.3
const BOTTOM_SLACK = 2

function measure(ids: readonly string[]): string | null {
  const sections = ids
    .map((id) => ({ id, el: document.getElementById(id) }))
    .filter((s): s is { id: string; el: HTMLElement } => s.el !== null)
    .map(({ id, el }) => ({ id, top: el.getBoundingClientRect().top }))

  const scrolled = window.scrollY + window.innerHeight
  const atBottom = scrolled >= document.documentElement.scrollHeight - BOTTOM_SLACK

  return pickActiveSection({
    sections,
    probeY: window.innerHeight * PROBE_RATIO,
    atBottom,
  })
}

export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setActive(measure(ids))
    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return active
}
