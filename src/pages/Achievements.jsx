import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import TeamStats from '../components/achievements/TeamStats.jsx'
import AchievementShowcase from '../components/achievements/AchievementShowcase.jsx'
import RecordFilters from '../components/achievements/RecordFilters.jsx'
import TournamentCard from '../components/achievements/TournamentCard.jsx'
import PerformanceTimeline from '../components/achievements/PerformanceTimeline.jsx'
import { teamStatsSample, tournaments } from '../data/achievements.js'
import { filterTournaments, sortByDate, yearsOf } from '../lib/records.js'

const ALL = { year: 'all', placement: 'all', type: 'all' }

export default function Achievements() {
  const [filters, setFilters] = useState(ALL)
  const years = useMemo(() => yearsOf(tournaments), [])
  const filtered = useMemo(() => filterTournaments(tournaments, filters), [filters])
  const cards = useMemo(() => sortByDate(filtered, 'desc'), [filtered])
  const hasSample = teamStatsSample || tournaments.some((t) => t.sample)
  const reset = useCallback(() => setFilters(ALL), [])

  // Showcase cards jump to the history with that achievement type pre-selected.
  const viewRecords = useCallback((type) => {
    setFilters({ ...ALL, type })
    requestAnimationFrame(() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' }))
  }, [])

  return (
    <>
      <PageHeader id="achievements-title" title="Achievements" intro="Our competitive record: tournaments, results and the numbers behind them." />

      {hasSample && (
        <div className="bg-ons-black pb-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div role="note" className="flex gap-3 border border-dashed border-ons-silver/40 bg-ons-black/60 p-4 text-sm leading-relaxed text-ons-silver">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>
                <strong className="font-semibold text-ons-white">Sample data.</strong> Tournament names, dates, placements, team counts and statistics on this page are placeholders, not real results. Replace them in <code className="text-ons-white">src/data/achievements.js</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      <TeamStats />
      <AchievementShowcase onView={viewRecords} />

      <Section id="history" aria-labelledby="history-title" className="scroll-mt-20">
        <SectionHeading id="history-title" intro="Filter by year, final placement or achievement type.">Tournament History</SectionHeading>
        <div className="mt-12">
          <RecordFilters filters={filters} onChange={setFilters} years={years} shown={filtered.length} total={tournaments.length} onReset={reset} />
        </div>

        {cards.length ? (
          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cards.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10 border border-ons-silver/15 p-10 text-center text-ons-silver">
            <p>No records match the selected filters.</p>
            <button type="button" onClick={reset} className="mt-4 border border-ons-silver/40 px-5 py-2 text-sm font-semibold text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black">Reset filters</button>
          </div>
        )}
      </Section>

      <PerformanceTimeline list={filtered} />
    </>
  )
}
