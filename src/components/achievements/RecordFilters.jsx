import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { achievementTypes, placementGroups } from '../../data/achievements.js'

function Group({ label, value, options, onChange }) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-3 text-sm font-semibold text-ons-white">{label}</p>
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {[{ key: 'all', label: 'All' }, ...options].map((o) => {
          const active = value === o.key
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.key)}
              className={`shrink-0 border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                active ? 'silver-surface border-transparent text-ons-black' : 'border-ons-silver/25 text-ons-silver hover:border-ons-silver hover:text-ons-white'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RecordFilters({ filters, onChange, years, shown, total, onReset }) {
  const dirty = Object.values(filters).some((v) => v !== 'all')
  const set = (k) => (v) => onChange({ ...filters, [k]: v })
  return (
    <div className="border border-ons-silver/15 bg-ons-black/60 p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 font-display text-2xl font-bold tracking-wide text-ons-white">
          <SlidersHorizontal size={20} aria-hidden="true" /> Filter records
        </p>
        <div className="flex items-center gap-4">
          <p role="status" className="text-sm text-ons-silver">Showing {shown} of {total}</p>
          {dirty && (
            <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 border border-ons-silver/30 px-3 py-1.5 text-sm text-ons-silver transition-colors hover:border-ons-silver hover:text-ons-white">
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
        <Group label="Year" value={filters.year} onChange={set('year')} options={years.map((y) => ({ key: String(y), label: String(y) }))} />
        <Group label="Placement" value={filters.placement} onChange={set('placement')} options={placementGroups} />
        <Group label="Achievement" value={filters.type} onChange={set('type')} options={achievementTypes.map((t) => ({ key: t.key, label: t.short }))} />
      </div>
    </div>
  )
}
