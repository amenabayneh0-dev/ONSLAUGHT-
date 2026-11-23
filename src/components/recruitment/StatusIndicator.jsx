/** Recruitment OPEN / CLOSED pill. Open pulses; closed is a hollow, muted dot. */
export default function StatusIndicator({ open, className = '' }) {
  return (
    <p role="status" className={`inline-flex items-center gap-3 border px-4 py-2 text-sm font-semibold tracking-widest ${open ? 'border-ons-silver/50 text-ons-white' : 'border-ons-silver/25 text-ons-silver'} ${className}`}>
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {open && <span className="absolute inset-0 rounded-full bg-ons-white opacity-60 motion-safe:animate-ping" />}
        <span className={`relative h-2.5 w-2.5 rounded-full ${open ? 'bg-ons-white' : 'border border-ons-silver'}`} />
      </span>
      RECRUITMENT {open ? 'OPEN' : 'CLOSED'}
    </p>
  )
}
