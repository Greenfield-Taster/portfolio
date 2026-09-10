import type { ReactNode } from 'react'
import './Button.scss'

interface ButtonProps {
  variant?: 'fill' | 'ghost' | 'quiet'
  type?: 'button' | 'submit'
  href?: string
  onClick?: () => void
  download?: boolean
  disabled?: boolean
  children: ReactNode
}

export function Button({
  variant = 'fill',
  type = 'button',
  href,
  onClick,
  download,
  disabled,
  children,
}: ButtonProps) {
  const className = `btn btn--${variant}`

  if (href) {
    // `disabled` has no native meaning on an anchor — there is no attribute
    // that both blocks navigation and keeps the element keyboard-reachable
    // without extra plumbing (tabindex/aria-disabled/click-guard) that no
    // current call site needs. Rather than fake it with a half-measure that
    // looks disabled but still navigates, the anchor branch ignores the prop
    // until a real use case defines what "disabled link" should do here.
    const external = href.startsWith('http')
    return (
      <a
        className={className}
        href={href}
        download={download}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
