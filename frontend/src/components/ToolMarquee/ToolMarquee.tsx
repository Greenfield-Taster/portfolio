import { stackGroups } from '../../data/stack'
import { findToolIcon } from '../../data/tools'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './ToolMarquee.scss'

// Every tool from the levelled groups, split across two rows. Ways of
// working stay out: the strip is the toolbox, not the method.
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

/**
 * The tools, drifting past in two rows going opposite ways. In each row two
 * identical copies sit end to end and the track slides by exactly one copy's
 * width before snapping back, which is what makes the loop seamless — the
 * second copy is under the cursor at the moment the first one leaves, so
 * there is nothing to see at the join.
 */
export function ToolMarquee() {
  const reduced = useReducedMotion()

  return (
    <div className="marquee" data-testid="tool-marquee">
      {ROWS.map((items, index) => (
        <div key={index} className="marquee__lane">
          {reduced ? (
            // Nothing moves, and nothing is duplicated: a still copy of the
            // list is the honest version of this for a reader who asked for
            // calm.
            <Row items={items} />
          ) : (
            <div className={`marquee__track marquee__track--${index % 2 ? 'back' : 'forth'}`}>
              <Row items={items} />
              {/* The understudy. It carries no information of its own, so it
                  is kept out of the accessibility tree rather than read out
                  twice. */}
              <Row items={items} hidden />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
