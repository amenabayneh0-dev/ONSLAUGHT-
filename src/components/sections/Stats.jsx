import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useReducedMotion, motion } from 'framer-motion'
import { stats } from '../../data/stats.js'

const pad = (n) => String(Math.round(n)).padStart(2, '0')

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce || value === 0) {
      node.textContent = pad(value)
      return
    }
    node.textContent = pad(0)
    if (!inView) return
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.22, 0.7, 0.2, 1],
      onUpdate: (v) => (node.textContent = pad(v)),
    })
    return () => controls.stop()
  }, [inView, value, suffix, reduce, mv])

  return (
    <>
      <span ref={ref}>{pad(0)}</span>
      {suffix && <span className="ml-1 text-[0.4em] tracking-wide">{suffix.trim()}</span>}
    </>
  )
}

export default function Stats() {
  return (
    <section id="stats" aria-labelledby="stats-title" className="bg-ons-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 id="stats-title" className="max-w-md font-display text-3xl font-semibold tracking-wide text-ons-silver sm:text-4xl">
          The organization in numbers
        </h2>

        <motion.dl
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8 }}
          className="mt-14 grid grid-cols-2 border-y border-ons-silver/15 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <div
              key={s.id}
              className={`px-2 py-10 sm:px-8 lg:py-14 ${i % 2 === 1 ? 'border-l' : ''} ${
                i > 1 ? 'border-t lg:border-t-0' : ''
              } ${i > 0 ? 'lg:border-l' : ''} border-ons-silver/15 first:pl-2 lg:first:pl-0`}
            >
              <dd className="silver-text font-display text-6xl font-black leading-none sm:text-7xl xl:text-8xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-4 text-sm text-ons-silver">{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
