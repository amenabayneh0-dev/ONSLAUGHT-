import { motion } from 'framer-motion'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import AnimatedNumber from '../ui/AnimatedNumber.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { resolveTeamStats } from '../../lib/records.js'
import { teamStatsSample, tournaments } from '../../data/achievements.js'

export default function TeamStats() {
  const stats = resolveTeamStats(tournaments)
  return (
    <Section id="team-stats" aria-labelledby="team-stats-title">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <SectionHeading id="team-stats-title">Team Statistics</SectionHeading>
        {teamStatsSample && <SampleBadge className="mb-3" />}
      </div>

      <motion.dl
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8 }}
        className="mt-14 grid grid-cols-2 border-y border-ons-silver/15 lg:grid-cols-5"
      >
        {stats.map(({ id, label, icon: Icon, value }, i) => (
          <div
            key={id}
            className={`group relative border-ons-silver/15 px-3 py-10 transition-colors duration-500 hover:bg-ons-graphite sm:px-7 lg:py-14 ${
              i % 2 === 1 ? 'border-l' : ''
            } ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l' : ''} ${i === stats.length - 1 && stats.length % 2 ? 'col-span-2 !border-l-0 lg:col-span-1 lg:!border-l' : ''}`}
          >
            <Icon size={22} strokeWidth={1.6} className="text-ons-silver/70 transition-colors duration-500 group-hover:text-ons-white" aria-hidden="true" />
            <dd className="silver-text-bright mt-5 font-display text-6xl font-black leading-none sm:text-7xl">
              <AnimatedNumber value={value} />
            </dd>
            <dt className="mt-3 text-sm text-ons-silver">{label}</dt>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ons-silver transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        ))}
      </motion.dl>
    </Section>
  )
}
