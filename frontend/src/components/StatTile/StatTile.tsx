import './StatTile.scss'

export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat" data-testid="stat-tile">
      <strong className="stat__value">{value}</strong>
      <span className="stat__label">{label}</span>
    </div>
  )
}
