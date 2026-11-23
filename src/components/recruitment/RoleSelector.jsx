import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'
import { roles } from '../../data/players.js'

/** Radio-card selector for the preferred in-game role (native radios, so keyboard + screen readers work). */
export default function RoleSelector({ value, error, onChange, onBlur, disabled }) {
  return (
    <fieldset id="field-role" tabIndex={-1} disabled={disabled} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? 'field-role-error' : undefined} className="min-w-0 outline-none">
      <legend className="mb-2 text-sm font-semibold text-ons-white">
        Preferred in-game role <span aria-hidden="true" className="text-ons-silver">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(roles).map(([key, r]) => {
          const Icon = r.icon
          return (
            <label
              key={key}
              className={`group relative flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-sm font-semibold transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ons-silver ${
                value === key ? 'silver-surface border-transparent text-ons-black' : `bg-ons-black/70 text-ons-silver hover:border-ons-silver/60 hover:text-ons-white ${error ? 'border-ons-white' : 'border-ons-silver/25'}`
              }`}
            >
              <input type="radio" name="role" value={key} checked={value === key} onChange={() => onChange('role', key)} onBlur={() => onBlur('role')} className="sr-only" />
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" /> {r.label}
            </label>
          )
        })}
      </div>
      <div id="field-role-error" aria-live="polite">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex items-start gap-1.5 overflow-hidden pt-2 text-sm text-ons-white">
              <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </fieldset>
  )
}
