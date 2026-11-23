import { useId } from 'react'
import { motion } from 'framer-motion'

const base = 'inline-flex items-center justify-center gap-2 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50'
const variants = {
  primary: 'silver-surface px-4 py-2.5 text-ons-black enabled:hover:brightness-110',
  secondary: 'border border-ons-silver/40 px-4 py-2.5 text-ons-white enabled:hover:border-ons-silver enabled:hover:bg-ons-silver enabled:hover:text-ons-black',
  ghost: 'px-3 py-2 text-ons-silver enabled:hover:text-ons-white',
  danger: 'border border-dashed border-ons-white/70 px-4 py-2.5 text-ons-white enabled:hover:bg-ons-white enabled:hover:text-ons-black',
}

export function Btn({ variant = 'secondary', className = '', type = 'button', children, ...rest }) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</button>
}

export function IconBtn({ label, children, className = '', ...rest }) {
  return (
    <button type="button" aria-label={label} title={label} className={`flex h-9 w-9 items-center justify-center border border-ons-silver/25 text-ons-silver transition-colors duration-300 hover:border-ons-silver hover:bg-ons-silver hover:text-ons-black disabled:opacity-50 ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function Panel({ title, action, children, className = '', as = 'section' }) {
  const Tag = as
  const id = useId()
  return (
    <Tag aria-labelledby={title ? id : undefined} className={`border border-ons-silver/15 bg-ons-graphite ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-ons-silver/15 px-5 py-4">
          <h2 id={id} className="font-display text-2xl font-bold tracking-wide text-ons-white">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Tag>
  )
}

export function PageTitle({ title, intro, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="silver-text-bright pb-[0.1em] font-display text-5xl font-black leading-none tracking-wide sm:text-6xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-ons-silver">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="border border-dashed border-ons-silver/25 px-6 py-12 text-center">
      {Icon && <Icon size={36} strokeWidth={1.2} className="mx-auto text-ons-silver/60" aria-hidden="true" />}
      <p className="mt-4 font-display text-2xl font-bold tracking-wide text-ons-white">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-ons-silver">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Tabs({ tabs, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="mb-6 flex gap-2 overflow-x-auto border-b border-ons-silver/15">
      {tabs.map((t) => (
        <button key={t.key} role="tab" type="button" aria-selected={value === t.key} onClick={() => onChange(t.key)} className={`relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors ${value === t.key ? 'text-ons-white' : 'text-ons-silver hover:text-ons-white'}`}>
          {t.label}{t.count !== undefined && <span className="ml-2 text-ons-silver/60">{t.count}</span>}
          {value === t.key && <motion.span layoutId={`tab-${label}`} className="absolute inset-x-0 -bottom-px h-0.5 bg-ons-silver" />}
        </button>
      ))}
    </div>
  )
}

export const relTime = (iso) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
