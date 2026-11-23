import { motion } from 'framer-motion'
import Section from './Section.jsx'

const ease = [0.22, 0.7, 0.2, 1]

/** Page opening: wipe-in metallic title with a faint outlined ONS watermark. */
export default function PageHeader({ id, title, intro }) {
  return (
    <Section texture className="!pb-16 !pt-40 lg:!pb-20 lg:!pt-48" aria-labelledby={id}>
      <span aria-hidden="true" className="outline-text pointer-events-none absolute -bottom-10 right-0 -z-10 select-none font-display text-[clamp(10rem,32vw,26rem)] font-black leading-none">ONS</span>
      <motion.h1
        id={id}
        initial={{ clipPath: 'inset(-10% 100% -10% -10%)', y: 20 }}
        animate={{ clipPath: 'inset(-10% -50% -10% -10%)', y: 0 }}
        transition={{ duration: 1, ease, delay: 0.1 }}
        className="silver-text silver-text-sheen inline-block whitespace-nowrap font-display text-[clamp(3.25rem,13vw,10rem)] font-black leading-[0.9] tracking-wide"
      >
        {title}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.7 }} className="mt-8 max-w-xl text-lg leading-relaxed text-ons-silver">
        {intro}
      </motion.p>
    </Section>
  )
}
