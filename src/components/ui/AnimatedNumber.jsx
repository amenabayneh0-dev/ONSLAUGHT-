import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion'

const defaultFormat = (n) => n.toLocaleString('en-US')

/** Counts up from 0 once scrolled into view. Shows the final value instantly for reduced motion. */
export default function AnimatedNumber({ value, format = defaultFormat, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduce) {
      node.textContent = format(value)
      return
    }
    if (!inView) return
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.22, 0.7, 0.2, 1],
      onUpdate: (v) => (node.textContent = format(Math.round(v))),
    })
    return () => controls.stop()
  }, [inView, value, reduce, mv]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{format(0)}</span>
}
