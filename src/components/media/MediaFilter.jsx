import { categories } from '../../data/media.js'

export default function MediaFilter({ value, onChange, items }) {
  return (
    <div role="group" aria-label="Filter media by category" className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      {categories.map(({ key, label, icon: Icon }) => {
        const count = key === 'all' ? items.length : items.filter((p) => p.category === key).length
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`inline-flex shrink-0 items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              active ? 'silver-surface border-transparent text-ons-black' : 'border-ons-silver/25 text-ons-silver hover:border-ons-silver hover:text-ons-white'
            }`}
          >
            <Icon size={15} aria-hidden="true" /> {label}
            <span className={active ? 'text-ons-black/60' : 'text-ons-silver/50'}>{count}</span>
          </button>
        )
      })}
    </div>
  )
}
