import { useTheme } from '../../hooks/useTheme'
import './ThemeToggle.scss'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
    >
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
    </button>
  )
}
