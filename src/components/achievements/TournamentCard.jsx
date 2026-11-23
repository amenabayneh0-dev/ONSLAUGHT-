import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Medal, Sparkles, Star, Trophy, Users } from 'lucide-react'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { spotlightMove } from '../../lib/spotlight.js'
import { formatDate, ordinal, placementLabel } from '../../lib/records.js'

const awardIcon = { mvp: Star, special: Sparkles }

export function PlacementChip({ placement, className = '' }) {
  const podium = placement <= 3
  const Icon = placement === 1 ? Trophy : Medal
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold ${podium ? 'silver-surface text-ons-black' : 'border border-ons-silver/40 bg-ons-black/70 text-ons-white'} ${className}`}>
      <Icon size={14} strokeWidth={2} aria-hidden="true" /> {placementLabel(placement)}
    </span>
  )
}

function TournamentImage({ t }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative aspect-video overflow-hidden bg-ons-black">
      {t.image && !failed ? (
        <img src={t.image} alt={`${t.name}`} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div aria-hidden="true" className="texture-diagonal texture-glow absolute inset-0 flex flex-col items-center justify-center gap-2 pb-10 text-ons-silver/60 transition-transform duration-700 group-hover:scale-105">
          <Trophy size={44} strokeWidth={1} />
          <span className="text-xs">Tournament image</span>
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ons-graphite via-ons-graphite/10 to-transparent" />
    </div>
  )
}

export default function TournamentCard({ t, index = 0 }) {
  return (
    <motion.article
      layout
      onMouseMove={spotlightMove}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, delay: 0 } }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.07, ease: [0.22, 0.7, 0.2, 1] }}
      className="group relative flex flex-col overflow-hidden border border-ons-silver/15 bg-ons-graphite transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ons-silver/50"
    >
      <div className="relative">
        <TournamentImage t={t} />
        <div className="absolute left-4 top-4"><PlacementChip placement={t.placement} /></div>
        {t.sample && <div className="absolute right-4 top-4"><SampleBadge /></div>}
        <span aria-hidden="true" className="absolute bottom-1 left-4 font-display text-7xl font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(192,192,192,.55)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:#F5F5F5]">
          {ordinal(t.placement)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ons-silver">
          <span className="inline-flex items-center gap-1.5"><Calendar size={14} aria-hidden="true" /> {formatDate(t.date)}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} aria-hidden="true" /> {t.teams} teams</span>
        </p>
        <h3 className="mt-3 font-display text-3xl font-extrabold leading-none tracking-wide text-ons-white">{t.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ons-silver/90">{t.description}</p>
        {t.awards?.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {t.awards.map((a, i) => {
              const Icon = awardIcon[a.type] ?? Star
              return (
                <li key={i} className="inline-flex items-center gap-1.5 border border-ons-silver/25 px-2.5 py-1 text-xs text-ons-silver">
                  <Icon size={12} aria-hidden="true" /> {a.label}{a.player ? `: ${a.player}` : ''}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(340px circle at var(--x, 50%) var(--y, 50%), rgba(192,192,192,.12), transparent 70%)' }} />
      <span aria-hidden="true" className="absolute left-0 top-0 h-4 w-4 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
    </motion.article>
  )
}
