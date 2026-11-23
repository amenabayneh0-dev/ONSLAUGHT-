import Reveal from './Reveal.jsx'

/** Large metallic heading with optional intro line. `level` keeps the outline valid. */
export default function SectionHeading({ id, children, intro, level = 2, className = '' }) {
  const Tag = `h${level}`
  return (
    <Reveal className={className}>
      <Tag id={id} className="silver-text pb-[0.12em] font-display text-5xl font-black leading-[0.95] tracking-wide sm:text-6xl lg:text-7xl">
        {children}
      </Tag>
      {intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ons-silver">{intro}</p>}
    </Reveal>
  )
}
