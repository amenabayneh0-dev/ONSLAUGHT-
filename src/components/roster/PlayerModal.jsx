import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Trophy, X } from 'lucide-react'
import PlayerPhoto from './PlayerPhoto.jsx'
import PlayerStats from './PlayerStats.jsx'
import RoleBadge, { SampleBadge } from './RoleBadge.jsx'
import { roles } from '../../data/players.js'

const ease = [0.22, 0.7, 0.2, 1]
const navBtn = 'group flex items-center gap-3 border border-ons-silver/25 px-4 py-3 text-sm font-semibold text-ons-silver transition-colors duration-300 hover:border-ons-silver hover:text-ons-white'

export default function PlayerModal({ player, prev, next, onClose, onSelect }) {
  const open = Boolean(player)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const latest = useRef({})
  latest.current = { prev, next, onClose, onSelect }

  // Focus handling + scroll lock; focus returns to the card that opened the profile.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      const { prev, next, onClose, onSelect } = latest.current
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowLeft' && prev) return onSelect(prev.id)
      if (e.key === 'ArrowRight' && next) return onSelect(next.id)
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-ons-black/90 backdrop-blur-md"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${player.username} player profile`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease }}
            className="relative mx-auto min-h-full max-w-5xl border-ons-silver/25 bg-ons-graphite sm:my-10 sm:min-h-0 sm:border"
          >
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close player profile" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-ons-silver/40 bg-ons-black/80 text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black">
              <X size={20} />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease }}
                className="grid md:grid-cols-[0.85fr_1.15fr]"
              >
                <div className="relative md:min-h-full">
                  <PlayerPhoto player={player} className="aspect-[4/5] md:absolute md:inset-0 md:aspect-auto" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ons-graphite via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-ons-graphite" />
                  <span aria-hidden="true" className="absolute bottom-3 left-6 font-display text-[9rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(192,192,192,.6)]">
                    {String(player.number).padStart(2, '0')}
                  </span>
                </div>

                <div className="space-y-9 p-6 sm:p-10">
                  <header>
                    <div className="flex flex-wrap items-center gap-3 pr-12">
                      <RoleBadge role={player.role} full />
                      {player.sample && <SampleBadge />}
                    </div>
                    <h2 className="silver-text mt-5 font-display text-6xl font-black leading-[0.9] tracking-wide sm:text-7xl">{player.username}</h2>
                    <p className="mt-4 flex items-center gap-1.5 text-ons-silver"><MapPin size={15} aria-hidden="true" /> {player.country}</p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-ons-silver/80">{roles[player.role]?.summary}</p>
                  </header>

                  <section aria-labelledby="bio-h">
                    <h3 id="bio-h" className="font-display text-2xl font-bold tracking-wide text-ons-white">Biography</h3>
                    <p className="mt-3 leading-relaxed text-ons-silver">{player.bio}</p>
                  </section>

                  <section aria-labelledby="stats-h">
                    <h3 id="stats-h" className="mb-3 flex items-center gap-3 font-display text-2xl font-bold tracking-wide text-ons-white">
                      Statistics {player.sample && <SampleBadge />}
                    </h3>
                    <PlayerStats stats={player.stats} variant="large" />
                  </section>

                  <section aria-labelledby="ach-h">
                    <h3 id="ach-h" className="font-display text-2xl font-bold tracking-wide text-ons-white">Achievements</h3>
                    {player.achievements?.length ? (
                      <ul className="mt-3">
                        {player.achievements.map((a, i) => (
                          <li key={i} className="flex gap-4 border-t border-ons-silver/15 py-4 last:border-b">
                            <Trophy size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-ons-silver" aria-hidden="true" />
                            <div className="flex-1">
                              <p className="font-semibold text-ons-white">{a.title}</p>
                              <p className="text-sm text-ons-silver">{a.event}</p>
                            </div>
                            <span className="text-sm text-ons-silver">{a.year}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-ons-silver">No achievements added yet.</p>
                    )}
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between gap-4 border-t border-ons-silver/15 p-4 sm:px-10">
              {prev ? (
                <button type="button" onClick={() => onSelect(prev.id)} className={navBtn}>
                  <ChevronLeft size={18} /> <span className="hidden sm:inline">{prev.username}</span><span className="sm:hidden">Previous</span>
                </button>
              ) : <span />}
              {next ? (
                <button type="button" onClick={() => onSelect(next.id)} className={navBtn}>
                  <span className="hidden sm:inline">{next.username}</span><span className="sm:hidden">Next</span> <ChevronRight size={18} />
                </button>
              ) : <span />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
