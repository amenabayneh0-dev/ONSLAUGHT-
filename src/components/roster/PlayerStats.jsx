import { statFields } from '../../data/players.js'

/** compact: 4 across for cards. large: 2x2 for profiles. */
export default function PlayerStats({ stats, variant = 'compact' }) {
  if (variant === 'large') {
    return (
      <dl className="grid grid-cols-2 gap-px border border-ons-silver/15 bg-ons-silver/15">
        {statFields.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="bg-ons-graphite p-5">
            <dt className="flex items-center gap-2 text-sm text-ons-silver">
              <Icon size={15} aria-hidden="true" /> {label}
            </dt>
            <dd className="mt-2 font-display text-5xl font-black leading-none text-ons-white">{format(stats[key])}</dd>
          </div>
        ))}
      </dl>
    )
  }
  return (
    <dl className="grid grid-cols-4 divide-x divide-ons-silver/15 border-t border-ons-silver/15">
      {statFields.map(({ key, short, format }) => (
        <div key={key} className="px-1 py-4 text-center first:pl-0 last:pr-0">
          <dd className="font-display text-xl font-extrabold leading-none text-ons-white sm:text-2xl">{format(stats[key])}</dd>
          <dt className="mt-1.5 text-[11px] text-ons-silver">{short}</dt>
        </div>
      ))}
    </dl>
  )
}
