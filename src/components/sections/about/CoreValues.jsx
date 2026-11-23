import Section from '../../ui/Section.jsx'
import SectionHeading from '../../ui/SectionHeading.jsx'
import ValueCard from '../../ui/ValueCard.jsx'
import { values } from '../../../data/about.js'

export default function CoreValues() {
  return (
    <Section id="values" aria-labelledby="values-title">
      <SectionHeading id="values-title" intro="Four principles shape how we train, compete and treat each other.">
        Our Core Values
      </SectionHeading>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <ValueCard key={v.title} icon={v.icon} title={v.title} index={i}>{v.text}</ValueCard>
        ))}
      </div>
    </Section>
  )
}
