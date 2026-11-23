import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import MediaImage from './MediaImage.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { categories } from '../../data/media.js'
import { layoutClass } from '../../lib/media.js'

export default function MediaTile({ item, index = 0, onOpen }) {
  const cat = categories.find((c) => c.key === item.category)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, delay: 0 } }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05, ease: [0.22, 0.7, 0.2, 1] }}
      className={layoutClass[item.layout] ?? ''}
    >
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        aria-haspopup="dialog"
        aria-label={`View ${item.title}`}
        className="group relative block h-full w-full overflow-hidden border border-ons-silver/15 bg-ons-graphite text-left transition-[border-color] duration-500 hover:border-ons-silver/60"
      >
        <MediaImage item={item} variant="thumb" className="h-full w-full pb-16 transition-transform duration-700 group-hover:scale-105" imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ons-black/90 via-ons-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-ons-silver/40 bg-ons-black/70 px-2.5 py-1 text-[11px] font-semibold text-ons-white backdrop-blur-sm">
          {cat && <cat.icon size={12} aria-hidden="true" />} {cat?.label}
        </span>
        {item.sample && <span className="absolute right-3 top-3"><SampleBadge /></span>}

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 transition-transform duration-500 group-hover:-translate-y-1">
          <span className="font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white sm:text-3xl">{item.title}</span>
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-ons-silver/40 text-ons-silver opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-ons-silver group-hover:text-ons-black">
            <Maximize2 size={15} />
          </span>
        </span>

        <span aria-hidden="true" className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ons-silver/70 transition-all duration-500 group-hover:h-8 group-hover:w-8" />
        <span aria-hidden="true" className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ons-silver/70 transition-all duration-500 group-hover:h-8 group-hover:w-8" />
      </button>
    </motion.div>
  )
}
