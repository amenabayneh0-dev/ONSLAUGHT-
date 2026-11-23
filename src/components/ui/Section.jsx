/** Consistent page section: spacing, width, tone and optional texture. */
export default function Section({ id, tone = 'black', texture = false, className = '', children, ...rest }) {
  const bg = tone === 'graphite' ? 'bg-ons-graphite' : 'bg-ons-black'
  return (
    <section id={id} className={`relative isolate overflow-clip py-24 lg:py-32 ${bg} ${className}`} {...rest}>
      {texture && <div aria-hidden="true" className="texture-diagonal texture-glow absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">{children}</div>
    </section>
  )
}
