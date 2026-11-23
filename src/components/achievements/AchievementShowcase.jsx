import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import AnimatedNumber from '../ui/AnimatedNumber.jsx'
import TrophyArt from './TrophyArt.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { spotlightMove } from '../../lib/spotlight.js'
import { achievementTypes, tournaments } from '../../data/achievements.js'
import { countByType, sortByDate, typesOf } from '../../lib/records.js'

function ShowcaseCard({ type, count, latest, sample, featured, index, onView }) {
  return (
    <motion.article
      onMouseMove={spotlightMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 0.7, 0.2, 1] }}
      className={`group relative flex flex-col overflow-hidden border border-ons-silver/15 bg-ons-graphite p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ons-silver/50 ${
        featured ? 'min-h-[30rem] justify-end sm:col-span-2 lg:col-span-1 lg:row-span-2' : 'min-h-[15rem] justify-end'
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), rgba(192,192,192,.14), transparent 70%)' }} />
      <div aria-hidden="true" className={`pointer-events-none absolute ${featured ? 'inset-x-0 top-0 h-3/5 bg-[radial-gradient(ellipse_at_50%_40%,rgba(192,192,192,.16),transparent_65%)]' : '-right-10 -top-10 h-44 w-44 bg-[radial-gradient(circle,rgba(192,192,192,.12),transparent_65%)]'}`} />
      <TrophyArt
        variant={type.art}
        label={type.artLabel}
        className={`pointer-events-none absolute transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3 ${
          featured ? 'left-1/2 top-8 h-56 w-48 -translate-x-1/2 group-hover:-translate-x-1/2' : 'right-6 top-6 h-24 w-20 opacity-90'
        }`}
      />
      <span aria-hidden="true" className="absolute left-0 top-0 h-4 w-4 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />

      <div className="relative">
        <div className="flex items-center gap-4">
          <p className={`silver-text-bright font-display font-black leading-none ${featured ? 'text-8xl' : 'text-7xl'}`}>
            <AnimatedNumber value={count} />
          </p>
          {sample && <SampleBadge />}
        </div>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-wide text-ons-white">{type.label}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ons-silver">{type.text}</p>
        <p className="mt-3 text-xs text-ons-silver/70">{latest ? `Latest: ${latest.name}` : 'No records yet'}</p>
        {count > 0 && (
          <button type="button" onClick={() => onView(type.key)} className="mt-5 inline-flex items-center gap-1 border-b border-ons-silver/50 pb-0.5 text-sm font-semibold text-ons-white transition-colors hover:border-ons-white">
            View records <ChevronRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.article>
  )
}

export default function AchievementShowcase({ onView }) {
  const counts = countByType(tournaments)
  const newest = sortByDate(tournaments, 'desc')
  return (
    <Section id="showcase" tone="graphite" texture aria-labelledby="showcase-title">
      <SectionHeading id="showcase-title" intro="Podium finishes, individual honors and standout moments.">Achievement Showcase</SectionHeading>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievementTypes.map((type, i) => {
          const related = newest.filter((t) => typesOf(t).has(type.key))
          return (
            <ShowcaseCard key={type.key} type={type} count={counts[type.key]} latest={related[0]} sample={related.some((t) => t.sample)} featured={i === 0} index={i} onView={onView} />
          )
        })}
      </div>
    </Section>
  )
}
