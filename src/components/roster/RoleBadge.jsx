import { roles } from '../../data/players.js'

export default function RoleBadge({ role, full = false, className = '' }) {
  const meta = roles[role]
  if (!meta) return null
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-2 border border-ons-silver/40 bg-ons-black/70 px-3 py-1.5 text-xs font-semibold text-ons-white backdrop-blur-sm ${className}`}>
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      {full ? meta.full : meta.label}
    </span>
  )
}

export function SampleBadge({ className = '' }) {
  return (
    <span className={`inline-flex border border-dashed border-ons-silver/50 bg-ons-black/70 px-2.5 py-1 text-[11px] font-semibold text-ons-silver backdrop-blur-sm ${className}`}>
      Sample
    </span>
  )
}
