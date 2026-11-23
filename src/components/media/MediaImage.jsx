import { useEffect, useState } from 'react'
import { categories } from '../../data/media.js'

const iconFor = (key) => categories.find((c) => c.key === key)?.icon

/**
 * Real image when `src` is set; otherwise a clearly labelled placeholder.
 * variant 'thumb' uses the small `thumb` file, 'full' uses `src`.
 */
export default function MediaImage({ item, variant = 'thumb', className = '', imgClassName = '', placeholderStyle }) {
  const [failed, setFailed] = useState(false)
  const url = variant === 'thumb' ? item.thumb || item.src : item.src
  useEffect(() => setFailed(false), [url])
  const Icon = iconFor(item.category)

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={item.alt || item.title}
        width={variant === 'full' ? item.width : undefined}
        height={variant === 'full' ? item.height : undefined}
        loading={variant === 'thumb' ? 'lazy' : 'eager'}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className={imgClassName}
      />
    )
  }
  return (
    <div role="img" aria-label={item.alt || item.title} style={placeholderStyle} className={`texture-diagonal texture-glow relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-ons-black text-ons-silver/50 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(192,192,192,.12),transparent_60%)]" />
      {Icon && <Icon strokeWidth={0.9} aria-hidden="true" className="relative h-1/3 max-h-28 w-1/3 max-w-28" />}
      <span className="relative text-xs">Photo placeholder</span>
    </div>
  )
}
