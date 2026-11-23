import { motion } from 'framer-motion'

/** Dark card with a silver spotlight that follows the cursor, corner brackets and a lifting icon. */
export default function ValueCard({ icon: Icon, title, children, index = 0 }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <motion.article
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 0.7, 0.2, 1] }}
      className="group relative overflow-hidden border border-ons-silver/15 bg-ons-black p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ons-silver/50 lg:p-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(340px circle at var(--x, 50%) var(--y, 50%), rgba(192,192,192,.16), transparent 70%)' }}
      />
      <span aria-hidden="true" className="absolute left-0 top-0 h-4 w-4 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-ons-silver/70 transition-all duration-500 group-hover:h-10 group-hover:w-10" />

      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center border border-ons-silver/30 text-ons-silver transition-all duration-500 group-hover:-translate-y-1 group-hover:border-ons-silver group-hover:bg-ons-silver group-hover:text-ons-black">
          <Icon size={26} strokeWidth={1.6} />
        </div>
        <h3 className="mt-14 font-display text-4xl font-extrabold tracking-wide text-ons-white">{title}</h3>
        <p className="mt-4 leading-relaxed text-ons-silver">{children}</p>
      </div>
    </motion.article>
  )
}
