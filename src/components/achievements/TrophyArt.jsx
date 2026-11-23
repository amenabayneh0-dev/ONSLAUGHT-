import { useId } from 'react'

/** Original silver trophy illustrations: cup, medal (with numeral), star and gem. */
export default function TrophyArt({ variant = 'cup', label, className = '' }) {
  const id = useId().replace(/:/g, '')
  const g = `url(#g${id})`
  const d = `url(#d${id})`
  return (
    <svg viewBox="0 0 120 140" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset=".5" stopColor="#c0c0c0" />
          <stop offset="1" stopColor="#6a6a6a" />
        </linearGradient>
        <linearGradient id={`d${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8a8a8" />
          <stop offset="1" stopColor="#3f3f3f" />
        </linearGradient>
      </defs>

      {variant === 'cup' && (
        <>
          <path d="M32 26H16c0 24 9 36 24 40M88 26h16c0 24-9 36-24 40" stroke={g} strokeWidth="5" strokeLinecap="round" />
          <path d="M30 12h60v32c0 24-14 40-30 40S30 68 30 44z" fill={g} />
          <path d="M42 20v24c0 14 5 24 12 31" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 29l3.5 7.5 8.2 1-6 5.6 1.6 8.1L60 47l-7.3 4.2 1.6-8.1-6-5.6 8.2-1z" fill="#050505" fillOpacity=".5" />
          <path d="M54 84h12l3 24H51z" fill={d} />
          <path d="M34 108h52l6 16H28z" fill={g} />
          <rect x="26" y="124" width="68" height="8" rx="2" fill={d} />
        </>
      )}

      {variant === 'medal' && (
        <>
          <path d="M34 4h20l14 36H48zM86 4H66L52 40h20z" fill={d} />
          <circle cx="60" cy="90" r="38" fill={g} />
          <circle cx="60" cy="90" r="29" stroke="#050505" strokeOpacity=".35" strokeWidth="2" />
          <text x="60" y="108" textAnchor="middle" fontSize="50" fontWeight="900" fontFamily="'Big Shoulders Display', Impact, sans-serif" fill="#050505" fillOpacity=".7">{label}</text>
        </>
      )}

      {variant === 'star' && (
        <>
          <circle cx="60" cy="70" r="54" stroke={g} strokeWidth="3" />
          <circle cx="60" cy="70" r="46" stroke={d} strokeWidth="1.5" strokeDasharray="2 5" />
          <path d="M60 32L69 57.5 96 58.5 74.5 75 82 101 60 86 38 101 45.5 75 24 58.5 51 57.5Z" fill={g} />
        </>
      )}

      {variant === 'gem' && (
        <>
          <path d="M34 28h52l22 30-48 70L12 58z" fill={g} />
          <path d="M12 58h96M34 28l14 30 12-30 12 30 14-30M48 58l12 70 12-70" stroke="#050505" strokeOpacity=".35" strokeWidth="2" strokeLinejoin="round" />
          <path d="M60 4v10M52 9h16" stroke={g} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
