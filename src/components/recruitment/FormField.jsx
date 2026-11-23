import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleAlert } from 'lucide-react'

export const inputClass = (error) =>
  `peer w-full border bg-ons-black/70 px-4 py-3.5 text-ons-white outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-ons-silver/40 focus-visible:outline-none focus:bg-ons-black focus:shadow-[0_0_0_3px_rgba(192,192,192,.14)] disabled:opacity-60 ${
    error ? 'border-ons-white' : 'border-ons-silver/25 hover:border-ons-silver/50 focus:border-ons-silver'
  }`

/**
 * Label + control + hint/error wrapper.
 * `children` is a function receiving the aria props for the control.
 */
export default function FormField({ id, label, required, hint, error, valid, counter, children }) {
  const describedBy = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ons-white">
        <span>
          {label}
          {required ? <span aria-hidden="true" className="text-ons-silver"> *</span> : <span className="font-normal text-ons-silver/60"> (optional)</span>}
        </span>
        {counter}
      </label>
      <div className="relative">
        {children({ id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
        {valid && !error && <Check size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ons-silver" />}
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-xs text-ons-silver/70">{hint}</p>}
      <div id={`${id}-error`} aria-live="polite">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-1.5 overflow-hidden pt-2 text-sm text-ons-white"
            >
              <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
