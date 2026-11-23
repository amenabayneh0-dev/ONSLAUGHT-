import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import MediaImage from './MediaImage.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { categories } from '../../data/media.js'
import { layoutRatio } from '../../lib/media.js'

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 80, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, x: d * -80, scale: 0.98 }),
}
const arrow = 'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ons-silver/40 bg-ons-black/70 text-ons-white backdrop-blur-sm transition-colors hover:bg-ons-silver hover:text-ons-black disabled:hidden sm:h-14 sm:w-14'

/** Full-screen viewer. `index` is the position in `items`, or null when closed. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const open = index !== null && items[index] !== undefined
  const item = open ? items[index] : null
  const n = items.length
  const dir = useRef(1)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const latest = useRef({})

  const go = (delta) => {
    if (n < 2) return
    dir.current = delta
    onIndex((index + delta + n) % n)
  }
  latest.current = { go, onClose, n, onIndex }

  // Focus management + scroll lock; focus returns to the tile that opened the viewer.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      const { go, onClose, n, onIndex } = latest.current
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowRight') { e.preventDefault(); return go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); return go(-1) }
      if (e.key === 'Home' && n > 1) { dir.current = -1; return onIndex(0) }
      if (e.key === 'End' && n > 1) { dir.current = 1; return onIndex(n - 1) }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll('button:not([disabled])')]
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Warm the cache for the neighbouring photos so next/previous feel instant.
  useEffect(() => {
    if (!open) return
    ;[items[(index + 1) % n], items[(index - 1 + n) % n]].forEach((p) => {
      if (p?.src) new Image().src = p.src
    })
  }, [open, index, items, n])

  const cat = item && categories.find((c) => c.key === item.category)
  const ratio = layoutRatio[item?.layout] ?? 4 / 3

  // Portal: the gallery section is its own stacking context, which would otherwise keep
  // the viewer underneath the fixed site header.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // Clicking any empty area closes; the image, text and buttons do not.
          onClick={(e) => { if (!e.target.closest('button, figure, h2, p, span')) onClose() }}
          className="fixed inset-0 z-[70] flex flex-col bg-ons-black/95 backdrop-blur-md"
        >
          <p className="sr-only" aria-live="polite">{`${item.title}, ${index + 1} of ${n}`}</p>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-sm font-semibold text-ons-silver">
              <span className="text-ons-white">{index + 1}</span> / {n}
            </p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close viewer" className="flex h-11 w-11 items-center justify-center border border-ons-silver/40 text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black">
              <X size={20} />
            </button>
          </div>

          {/* Backdrop click closes; the stage itself does not */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 sm:px-24">
            <button type="button" onClick={() => go(-1)} disabled={n < 2} aria-label="Previous image" className={`${arrow} left-3 sm:left-6`}><ChevronLeft size={24} /></button>
            <button type="button" onClick={() => go(1)} disabled={n < 2} aria-label="Next image" className={`${arrow} right-3 sm:right-6`}><ChevronRight size={24} /></button>

            <AnimatePresence mode="popLayout" custom={dir.current} initial={false}>
              <motion.figure
                key={item.id}
                custom={dir.current}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
                drag={n > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -500) go(1)
                  else if (info.offset.x > 80 || info.velocity.x > 500) go(-1)
                }}
                className="flex max-h-full max-w-full cursor-grab items-center justify-center active:cursor-grabbing"
              >
                <MediaImage
                  item={item}
                  variant="full"
                  imgClassName="max-h-[calc(100svh-15rem)] max-w-full select-none object-contain sm:max-h-[calc(100svh-13rem)]"
                  className="border border-ons-silver/25"
                  placeholderStyle={{ aspectRatio: ratio, width: `min(88vw, calc((100svh - 15rem) * ${ratio}), 64rem)` }}
                />
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mx-auto w-full max-w-4xl px-6 pb-6 pt-4 text-center sm:pb-8">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
              {cat && <span className="inline-flex items-center gap-1.5 border border-ons-silver/40 px-2.5 py-1 text-[11px] font-semibold text-ons-white"><cat.icon size={12} aria-hidden="true" /> {cat.label}</span>}
              {item.sample && <SampleBadge />}
            </div>
            <h2 className="silver-text-bright font-display text-3xl font-black leading-none tracking-wide sm:text-4xl">{item.title}</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-ons-silver">{item.caption}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
