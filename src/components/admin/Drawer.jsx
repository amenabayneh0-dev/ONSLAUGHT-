import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const focusable = 'button:not([disabled]), [href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Accessible right-hand panel: portal, focus trap, Escape, scroll lock, focus restore. */
export default function Drawer({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null)
  const latest = useRef(onClose)
  latest.current = onClose

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector('[data-autofocus]')?.focus() ?? ref.current?.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); return latest.current() }
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll(focusable)].filter((el) => el.offsetParent !== null)
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; opener?.focus?.() }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="absolute inset-0 bg-ons-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.7, 0.2, 1] }}
            className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-ons-silver/25 bg-ons-graphite ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-ons-silver/15 px-6 py-5">
              <h2 className="font-display text-3xl font-extrabold tracking-wide text-ons-white">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close panel" className="flex h-10 w-10 items-center justify-center border border-ons-silver/40 text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
