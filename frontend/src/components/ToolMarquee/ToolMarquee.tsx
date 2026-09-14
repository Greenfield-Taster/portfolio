import { stackGroups } from '../../data/stack'
import { findToolIcon } from '../../data/tools'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './ToolMarquee.scss'

const TOOLS = stackGroups.filter((group) => group.level).flatMap((group) => group.items)

function splitRows(count: number): string[][] {
  const size = Math.ceil(TOOLS.length / count)
  return Array.from({ length: count }, (_, i) => TOOLS.slice(i * size, (i + 1) * size))
}

const WIDE_ROWS = splitRows(2)
const NARROW_ROWS = splitRows(4)

function Chip({ name }: { name: string }) {
  const icon = findToolIcon(name)
  return (
    <li className="marquee__chip">
      {icon && (
        <svg
          className="marquee__logo"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          style={{ color: icon.color ?? 'currentColor' }}
        >
          <path d={icon.path} fill="currentColor" />
        </svg>
      )}
      {name}
    </li>
  )
}

function Row({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((name) => (
        <Chip key={name} name={name} />
      ))}
    </ul>
  )
}

export function ToolMarquee() {
  const reduced = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 640px)')
  const rows = narrow ? NARROW_ROWS : WIDE_ROWS

  return (
    <div className="marquee" data-testid="tool-marquee">
      {rows.map((items, index) => (
        <div key={index} className="marquee__lane">
          {reduced ? (
            <Row items={items} />
          ) : (
            <div className={`marquee__track marquee__track--${index % 2 ? 'back' : 'forth'}`}>
              <Row items={items} />
              <Row items={items} hidden />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
