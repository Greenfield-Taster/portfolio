import { stackGroups } from '../../data/stack'
import { findToolIcon } from '../../data/tools'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './ToolMarquee.scss'

const TOOLS = stackGroups.filter((group) => group.level).flatMap((group) => group.items)
const HALF = Math.ceil(TOOLS.length / 2)
const ROWS = [TOOLS.slice(0, HALF), TOOLS.slice(HALF)]

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

  return (
    <div className="marquee" data-testid="tool-marquee">
      {ROWS.map((items, index) => (
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
