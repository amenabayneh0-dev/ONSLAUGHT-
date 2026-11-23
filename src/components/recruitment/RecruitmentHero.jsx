import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Section from '../ui/Section.jsx'
import Button from '../ui/Button.jsx'
import StatusIndicator from './StatusIndicator.jsx'
import { recruitment } from '../../data/recruitment.js'

const ease = [0.22, 0.7, 0.2, 1]

export default function RecruitmentHero() {
  const open = recruitment.status === 'open'
  const toForm = (e) => {
    e.preventDefault()
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <Section texture className="!pb-20 !pt-40 lg:!pb-28 lg:!pt-48" aria-labelledby="recruit-title">
      <span aria-hidden="true" className="outline-text pointer-events-none absolute -bottom-10 right-0 -z-10 select-none font-display text-[clamp(10rem,32vw,26rem)] font-black leading-none">ONS</span>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <StatusIndicator open={open} />
      </motion.div>

      <motion.h1
        id="recruit-title"
        initial={{ clipPath: 'inset(-10% 100% -10% -10%)', y: 20 }}
        animate={{ clipPath: 'inset(-10% -50% -10% -10%)', y: 0 }}
        transition={{ duration: 1, ease, delay: 0.15 }}
        className="silver-text silver-text-sheen mt-8 inline-block font-display text-[clamp(3.5rem,13vw,10.5rem)] font-black uppercase leading-[0.88] tracking-wide"
      >
        Join the<br />Onslaught
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.75 }} className="mt-8 max-w-xl text-lg leading-relaxed text-ons-silver">
        {recruitment.description}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.95 }} className="mt-10">
        {open ? (
          <Button href="#apply" onClick={toForm}>Apply Now</Button>
        ) : (
          <button type="button" disabled aria-disabled="true" className="inline-flex cursor-not-allowed items-center gap-2 border border-ons-silver/25 px-8 py-3.5 text-sm font-semibold text-ons-silver/60">
            <Lock size={15} aria-hidden="true" /> Applications closed
          </button>
        )}
      </motion.div>
    </Section>
  )
}
