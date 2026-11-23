import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import Section from '../components/ui/Section.jsx'
import RoleFilter from '../components/roster/RoleFilter.jsx'
import PlayerCard from '../components/roster/PlayerCard.jsx'
import PlayerModal from '../components/roster/PlayerModal.jsx'
import { players } from '../data/players.js'

const ease = [0.22, 0.7, 0.2, 1]

export default function Roster() {
  const [role, setRole] = useState('all')
  const [activeId, setActiveId] = useState(null)

  const visible = useMemo(() => (role === 'all' ? players : players.filter((p) => p.role === role)), [role])
  const hasSample = players.some((p) => p.sample)

  // Profile navigation cycles through the players currently shown.
  const idx = visible.findIndex((p) => p.id === activeId)
  const active = idx >= 0 ? visible[idx] : null
  const prev = active && visible.length > 1 ? visible[(idx - 1 + visible.length) % visible.length] : null
  const next = active && visible.length > 1 ? visible[(idx + 1) % visible.length] : null
  const close = useCallback(() => setActiveId(null), [])

  return (
    <>
      <Section texture className="!pb-16 !pt-40 lg:!pb-20 lg:!pt-48" aria-labelledby="roster-title">
        <span aria-hidden="true" className="outline-text pointer-events-none absolute -bottom-10 right-0 -z-10 select-none font-display text-[clamp(10rem,32vw,26rem)] font-black leading-none">ONS</span>
        <motion.h1
          id="roster-title"
          initial={{ clipPath: 'inset(-10% 100% -10% -10%)', y: 20 }}
          animate={{ clipPath: 'inset(-10% -50% -10% -10%)', y: 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="silver-text silver-text-sheen inline-block whitespace-nowrap font-display text-[clamp(3.25rem,13vw,10rem)] font-black leading-[0.9] tracking-wide"
        >
          Our Roster
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.7 }} className="mt-8 max-w-xl text-lg leading-relaxed text-ons-silver">
          The players who represent ONS in competition. Select a player to view their profile.
        </motion.p>
      </Section>

      <Section id="players" tone="graphite" className="!pt-14 lg:!pt-16" aria-label="Players">
        {hasSample && (
          <div role="note" className="mb-10 flex gap-3 border border-dashed border-ons-silver/40 bg-ons-black/60 p-4 text-sm leading-relaxed text-ons-silver">
            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              <strong className="font-semibold text-ons-white">Sample data.</strong> Player names, numbers, photographs, statistics and achievements below are placeholders, not real people or results. Replace them in <code className="text-ons-white">src/data/players.js</code>.
            </p>
          </div>
        )}

        <RoleFilter value={role} onChange={setRole} players={players} />
        <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? 'player' : 'players'} shown</p>

        {visible.length ? (
          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => <PlayerCard key={p.id} player={p} index={i} onOpen={setActiveId} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="mt-14 border border-ons-silver/15 p-10 text-center text-ons-silver">No players in this role yet.</p>
        )}
      </Section>

      <PlayerModal player={active} prev={prev} next={next} onClose={close} onSelect={setActiveId} />
    </>
  )
}
