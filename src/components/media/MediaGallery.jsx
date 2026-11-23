import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import MediaFilter from './MediaFilter.jsx'
import MediaTile from './MediaTile.jsx'
import Lightbox from './Lightbox.jsx'
import { photos } from '../../data/media.js'

export default function MediaGallery() {
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)

  const visible = useMemo(() => (filter === 'all' ? photos : photos.filter((p) => p.category === filter)), [filter])
  const index = activeId ? visible.findIndex((p) => p.id === activeId) : -1
  const open = (id) => setActiveId(id)
  const close = useCallback(() => setActiveId(null), [])
  const setIndex = useCallback((i) => setActiveId(visible[i]?.id ?? null), [visible])

  return (
    <Section id="gallery" tone="graphite" texture aria-labelledby="gallery-title" className="!pt-14 lg:!pt-16">
      <SectionHeading id="gallery-title" intro="Team photographs, gameplay, tournament moments, victories and behind-the-scenes. Select any image to view it full screen.">Photo Gallery</SectionHeading>

      <div className="mt-12"><MediaFilter value={filter} onChange={setFilter} items={photos} /></div>
      <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? 'item' : 'items'} shown</p>

      {visible.length ? (
        <motion.div layout className="mt-10 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:auto-rows-[14rem] lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => <MediaTile key={p.id} item={p} index={i} onOpen={open} />)}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="mt-14 border border-ons-silver/15 p-10 text-center text-ons-silver">No media in this category yet.</p>
      )}

      <Lightbox items={visible} index={index >= 0 ? index : null} onIndex={setIndex} onClose={close} />
    </Section>
  )
}
