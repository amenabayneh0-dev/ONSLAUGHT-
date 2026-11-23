import { applicationStatuses } from '../../data/recruitment.js'

/** Application status chip (Pending / Accepted / Rejected), silver-only styling. */
export default function StatusBadge({ status, className = '' }) {
  const meta = applicationStatuses[status]
  if (!meta) return null
  const Icon = meta.icon
  const style =
    status === 'accepted' ? 'silver-surface border-transparent text-ons-black'
    : status === 'rejected' ? 'border-ons-silver/30 text-ons-silver/70 line-through decoration-ons-silver/50'
    : 'border-dashed border-ons-silver/60 text-ons-white'
  return (
    <span className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold ${style} ${className}`}>
      <Icon size={14} aria-hidden="true" /> {meta.label}
    </span>
  )
}
