import Section from '../../ui/Section.jsx'
import SectionHeading from '../../ui/SectionHeading.jsx'
import Reveal from '../../ui/Reveal.jsx'
import { story } from '../../../data/about.js'

export default function Story() {
  return (
    <Section id="story" aria-labelledby="story-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <SectionHeading id="story-title">Our Story</SectionHeading>
        <Reveal delay={0.12} className="space-y-6 border-l border-ons-silver/20 pl-6 text-lg leading-relaxed text-ons-silver sm:pl-10">
          {story.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-xl text-ons-white' : ''}>{p}</p>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
