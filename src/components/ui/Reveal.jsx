import { motion } from 'framer-motion'

/** Fades content in once as it scrolls into view. */
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </Tag>
  )
}
