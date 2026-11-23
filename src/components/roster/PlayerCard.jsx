import { motion } from 'framer-motion'
import { MapPin, Plus } from 'lucide-react'
import PlayerPhoto from './PlayerPhoto.jsx'
import PlayerStats from './PlayerStats.jsx'
import RoleBadge, { SampleBadge } from './RoleBadge.jsx'
import { spotlightMove } from '../../lib/spotlight.js'

export default function PlayerCard({ player, index = 0, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, delay: 0 } }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.07, ease: [0.22, 0.7, 0.2, 1] }}
      onMouseMove={spotlightMove}
      className="group relative flex flex-col overflow-hidden border border-ons-silver/15 bg-ons-graphite transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ons-silver/50"
    >
      <div className="relative">
        <PlayerPhoto player={player} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ons-graphite via-ons-graphite/10 to-transparent" />
        <div className="absolute left-4 top-4"><RoleBadge role={player.role} /></div>
        {player.sample && <div className="absolute right-4 top-4"><SampleBadge /></div>}
        <span aria-hidden="true" className="absolute bottom-2 left-4 font-display text-8xl font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(192,192,192,.55)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:#F5F5F5]">
          {String(player.number).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-4xl font-extrabold leading-none tracking-wide text-ons-white">
            {/* Stretched button: the whole card is clickable, with a real focusable control */}
            <button
              type="button"
              onClick={() => onOpen(player.id)}
              aria-haspopup="dialog"
              aria-label={`View profile of ${player.username}`}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {player.username}
            </button>
          </h3>
          <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-ons-silver/30 text-ons-silver transition-all duration-500 group-hover:rotate-90 group-hover:border-ons-silver group-hover:bg-ons-silver group-hover:text-ons-black">
            <Plus size={16} />
          </span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ons-silver">
          <MapPin size={14} aria-hidden="true" /> {player.country}
        </p>
        <p className="mb-6 mt-3 line-clamp-2 text-sm leading-relaxed text-ons-silver/90">{player.description}</p>
        <div className="mt-auto"><PlayerStats stats={player.stats} /></div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(340px circle at var(--x, 50%) var(--y, 50%), rgba(192,192,192,.13), transparent 70%)' }}
      />
      {/* Keyboard focus ring for the stretched button */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 border-2 border-transparent group-focus-within:has-[:focus-visible]:border-ons-silver" />
      <span aria-hidden="true" className="absolute left-0 top-0 h-4 w-4 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
    </motion.article>
  )
}
