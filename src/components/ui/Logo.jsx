import { site } from '../../data/site.js'

export default function Logo({ className = '' }) {
  return (
    <a href="/" aria-label={`${site.fullName} home`} className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="ons-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2f2f2" />
            <stop offset=".55" stopColor="#c0c0c0" />
            <stop offset="1" stopColor="#7a7a7a" />
          </linearGradient>
        </defs>
        <path d="M5 27 16 4l11 23-11-7z" fill="url(#ons-mark)" />
      </svg>
      <span className="font-display text-2xl font-extrabold leading-none tracking-[0.14em] text-ons-white">
        {site.name}
      </span>
    </a>
  )
}
