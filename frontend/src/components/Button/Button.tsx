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
