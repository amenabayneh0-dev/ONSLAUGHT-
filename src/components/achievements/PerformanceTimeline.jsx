import { Fragment, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Calendar, Users } from 'lucide-react'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import { PlacementChip } from './TournamentCard.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { formatDate, ordinal, sortByDate, yearOf } from '../../lib/records.js'

export default function PerformanceTimeline({ list }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 65%'] })
  const items = sortByDate(list, 'asc')

  return (
    <Section id="timeline" aria-labelledby="timeline-title" className="scroll-mt-20">
      <SectionHeading id="timeline-title" intro="Every tournament in order, from the earliest to the most recent.">Performance Timeline</SectionHeading>

      {items.length === 0 ? (
        <p className="mt-14 border border-ons-silver/15 p-10 text-center text-ons-silver">No records match the selected filters.</p>
      ) : (
        <div ref={ref} className="relative mt-16">
          <div aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-ons-silver/15 md:left-1/2" />
          <motion.div aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-4 top-0 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-ons-white via-ons-silver to-ons-silver/40 md:left-1/2" />

          <ol className="relative">
            {items.map((t, i) => {
              const newYear = i === 0 || yearOf(items[i - 1]) !== yearOf(t)
              const right = i % 2 === 1
              const podium = t.placement <= 3
              return (
                <Fragment key={t.id}>
                  {newYear && (
                    <li aria-hidden="true" className="relative pb-8 pl-12 pt-6 md:pl-0 md:text-center">
                      <span className="relative inline-block bg-ons-black font-display text-transparent [-webkit-text-stroke:1px_rgba(192,192,192,.75)] text-6xl font-black leading-none md:px-6 md:text-7xl">{yearOf(t)}</span>
                    </li>
                  )}
                  <motion.li
                    initial={{ opacity: 0, x: right ? 32 : -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, ease: [0.22, 0.7, 0.2, 1] }}
                    className="relative pb-10 pl-12 md:grid md:grid-cols-2 md:pl-0"
                  >
                    <span aria-hidden="true" className={`absolute left-4 top-8 z-10 -translate-x-1/2 rounded-full border-2 md:left-1/2 ${podium ? 'h-4 w-4 border-ons-white bg-ons-silver shadow-[0_0_18px_rgba(192,192,192,.6)]' : 'h-3 w-3 border-ons-silver bg-ons-black'}`} />
                    <div className={`group border border-ons-silver/15 bg-ons-graphite p-6 transition-[border-color,transform] duration-500 hover:border-ons-silver/50 ${right ? 'md:col-start-2 md:ml-14' : 'md:col-start-1 md:mr-14'}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <PlacementChip placement={t.placement} />
                        <span className="font-display text-3xl font-black leading-none text-ons-white">{ordinal(t.placement)}</span>
                        {t.sample && <SampleBadge />}
                      </div>
                      <h3 className="mt-4 font-display text-3xl font-extrabold leading-none tracking-wide text-ons-white">{t.name}</h3>
                      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ons-silver">
                        <span className="inline-flex items-center gap-1.5"><Calendar size={14} aria-hidden="true" /> {formatDate(t.date)}</span>
                        <span className="inline-flex items-center gap-1.5"><Users size={14} aria-hidden="true" /> {t.teams} teams</span>
                      </p>
                      {t.awards?.length > 0 && <p className="mt-3 text-sm text-ons-silver/80">{t.awards.map((a) => a.label).join(' · ')}</p>}
                    </div>
                  </motion.li>
                </Fragment>
              )
            })}
          </ol>
        </div>
      )}
    </Section>
  )
}
