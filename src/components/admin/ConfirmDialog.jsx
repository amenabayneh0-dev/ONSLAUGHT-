import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import { Btn } from './ui.jsx'

/** Confirmation for destructive actions. Focus starts on Cancel so Enter never deletes by accident. */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  const ref = useRef(null)
  const latest = useRef(onCancel)
  latest.current = onCancel

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    cancelRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); latest.current() }
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll('button')]
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => { window.removeEventListener('keydown', onKey, true); opener?.focus?.() }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="absolute inset-0 bg-ons-black/85 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
          <motion.div ref={ref} role="alertdialog" aria-modal="true" aria-label={title} initial={{ y: 16, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.25 }} className="relative w-full max-w-md border border-ons-silver/30 bg-ons-graphite p-7">
            <TriangleAlert size={28} strokeWidth={1.5} className="text-ons-white" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-wide text-ons-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ons-silver">{message}</p>
            <div className="mt-7 flex justify-end gap-3">
              <button ref={cancelRef} type="button" onClick={onCancel} className="border border-ons-silver/40 px-4 py-2.5 text-sm font-semibold text-ons-white transition-colors hover:border-ons-silver">Cancel</button>
              <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
