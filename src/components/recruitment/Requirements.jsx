import { motion } from 'framer-motion'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import { spotlightMove } from '../../lib/spotlight.js'
import { requirements } from '../../data/recruitment.js'

export default function Requirements() {
  return (
    <Section id="requirements" tone="graphite" texture aria-labelledby="req-title">
      <SectionHeading id="req-title" intro="What we look for in every player who joins ONS.">Requirements</SectionHeading>
      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {requirements.map(({ icon: Icon, title, text }, i) => (
          <motion.li
            key={title}
            onMouseMove={spotlightMove}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 0.7, 0.2, 1] }}
            className={`group relative overflow-hidden border border-ons-silver/15 bg-ons-black p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ons-silver/50 ${i === requirements.length - 1 && requirements.length % 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), rgba(192,192,192,.15), transparent 70%)' }} />
            <span aria-hidden="true" className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-8 group-hover:w-8" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center border border-ons-silver/30 text-ons-silver transition-all duration-500 group-hover:border-ons-silver group-hover:bg-ons-silver group-hover:text-ons-black">
                <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
              </div>
              <h3 className="mt-8 font-display text-3xl font-extrabold leading-none tracking-wide text-ons-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ons-silver">{text}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
