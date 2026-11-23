import Section from '../../ui/Section.jsx'
import SectionHeading from '../../ui/SectionHeading.jsx'
import Reveal from '../../ui/Reveal.jsx'
import Button from '../../ui/Button.jsx'
import { identity } from '../../../data/about.js'

export default function CompetitiveIdentity() {
  return (
    <Section id="identity" tone="graphite" texture aria-labelledby="identity-title">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="identity-title" intro={identity.statement}>Competitive Identity</SectionHeading>
        </div>
        <ul>
          {identity.items.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="group flex gap-6 border-t border-ons-silver/20 py-8 last:border-b">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-ons-silver/30 text-ons-silver transition-all duration-500 group-hover:bg-ons-silver group-hover:text-ons-black">
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-3xl font-extrabold tracking-wide text-ons-white transition-transform duration-500 group-hover:translate-x-1">{title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-ons-silver">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border border-ons-silver/15 bg-ons-black p-8 sm:flex-row sm:items-center lg:p-12">
        <p className="max-w-md font-display text-4xl font-extrabold leading-tight tracking-wide text-ons-white">Ready to compete with ONS?</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/recruitment">Join ONS</Button>
          <Button href="/roster" variant="ghost">Explore Our Team</Button>
        </div>
      </Reveal>
    </Section>
  )
}
