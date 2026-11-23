import { roles } from '../../data/players.js'

export default function RoleFilter({ value, onChange, players }) {
  const options = [{ key: 'all', label: 'All players', count: players.length }].concat(
    Object.entries(roles).map(([key, r]) => ({ key, label: r.label, count: players.filter((p) => p.role === key).length })),
  )
  return (
    <div role="group" aria-label="Filter players by role" className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      {options.map((o) => {
        const active = value === o.key
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={`shrink-0 border px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              active ? 'silver-surface border-transparent text-ons-black' : 'border-ons-silver/25 text-ons-silver hover:border-ons-silver hover:text-ons-white'
            }`}
          >
            {o.label} <span className={active ? 'text-ons-black/60' : 'text-ons-silver/50'}>{o.count}</span>
          </button>
        )
      })}
    </div>
  )
}
