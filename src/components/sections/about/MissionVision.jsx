import { Target, Telescope } from 'lucide-react'
import Section from '../../ui/Section.jsx'
import SectionHeading from '../../ui/SectionHeading.jsx'
import Reveal from '../../ui/Reveal.jsx'
import { mission, vision } from '../../../data/about.js'

const panel = 'border border-ons-silver/15 bg-ons-black/70 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-ons-silver/40 lg:p-12'

export default function MissionVision() {
  return (
    <Section id="mission" tone="graphite" texture aria-label="Mission and vision">
      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal className={`${panel} lg:col-span-3`}>
          <Target size={30} strokeWidth={1.5} className="text-ons-silver" aria-hidden="true" />
          <SectionHeading id="mission-title" level={2} className="mt-8">Our Mission</SectionHeading>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-ons-white">{mission.statement}</p>
          <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {mission.commitments.map((c) => (
              <div key={c.title} className="border-t border-ons-silver/20 pt-4">
                <dt className="font-display text-2xl font-bold tracking-wide text-ons-white">{c.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ons-silver">{c.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12} className={`${panel} lg:col-span-2`}>
          <Telescope size={30} strokeWidth={1.5} className="text-ons-silver" aria-hidden="true" />
          <SectionHeading id="vision-title" level={2} className="mt-8">Our Vision</SectionHeading>
          <p className="mt-6 text-xl leading-relaxed text-ons-white">{vision.statement}</p>
          <ul className="mt-10 space-y-4">
            {vision.aims.map((a) => (
              <li key={a} className="flex gap-4 border-t border-ons-silver/20 pt-4 text-sm leading-relaxed text-ons-silver">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-ons-silver" />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
