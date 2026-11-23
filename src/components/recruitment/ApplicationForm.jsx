import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, CircleAlert, LoaderCircle, Send } from 'lucide-react'
import FormField, { inputClass } from './FormField.jsx'
import RoleSelector from './RoleSelector.jsx'
import SubmitResult from './SubmitResult.jsx'
import { emptyValues, fieldOrder, saveSubmission, validateAll } from '../../lib/application.js'
import { submitApplication } from '../../services/applications.js'
import { experienceOptions } from '../../data/recruitment.js'

const failMessages = {
  duplicate: 'An application with this PUBG ID has already been submitted.',
  network: 'We could not reach the server. Check your connection and try again.',
  server: 'Something went wrong while submitting. Please try again in a moment.',
  bot: 'We could not submit this application. Please try again.',
}

export default function ApplicationForm() {
  const [values, setValues] = useState(emptyValues)
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | submitting | done
  const [result, setResult] = useState(null)
  const [failure, setFailure] = useState('')
  const lock = useRef(false) // blocks double submits even before React re-renders

  const errors = useMemo(() => validateAll(values), [values])
  const errorCount = Object.keys(errors).length
  const show = (name) => ((touched[name] || attempted) ? errors[name] : '')
  const valid = (name) => touched[name] && !errors[name] && String(values[name]).trim() !== ''
  const set = (name, value) => setValues((s) => ({ ...s, [name]: value }))
  const blur = (name) => setTouched((s) => ({ ...s, [name]: true }))
  const busy = phase === 'submitting'

  const bind = (name) => ({
    name,
    value: values[name],
    onChange: (e) => set(name, e.target.value),
    onBlur: () => blur(name),
    disabled: busy,
  })

  async function onSubmit(e) {
    e.preventDefault()
    if (lock.current) return
    setAttempted(true)
    setFailure('')
    if (values.website) return setFailure(failMessages.bot) // honeypot filled: not a person
    const first = fieldOrder.find((n) => errors[n])
    if (first) {
      document.getElementById(`field-${first}`)?.focus()
      return
    }
    lock.current = true
    setPhase('submitting')
    const res = await submitApplication(values)
    lock.current = false
    if (res.ok) {
      if (res.saved) saveSubmission({ at: Date.now(), pubgId: res.record.pubg_id })
      setResult(res)
      setPhase('done')
    } else {
      setPhase('idle')
      setFailure(failMessages[res.reason] ?? failMessages.server)
    }
  }

  if (phase === 'done' && result) {
    return <SubmitResult saved={result.saved} record={result.record} onBack={() => setPhase('idle')} />
  }

  const text = (name, label, extra = {}) => (
    <FormField id={`field-${name}`} label={label} required={!extra.optional} hint={extra.hint} error={show(name)} valid={valid(name)} counter={extra.counter}>
      {(aria) => <input {...aria} {...bind(name)} type="text" className={`${inputClass(show(name))} ${valid(name) ? 'pr-11' : ''}`} placeholder={extra.placeholder} autoComplete={extra.autoComplete ?? 'off'} inputMode={extra.inputMode} spellCheck={false} />}
    </FormField>
  )

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy}>
      <fieldset disabled={busy} className="grid gap-6 sm:grid-cols-2">
        {text('pubgUsername', 'PUBG username', { placeholder: 'Your in-game name' })}
        {text('pubgId', 'PUBG ID', { placeholder: 'Your PUBG ID', hint: 'Found in your PUBG profile.' })}
        {text('age', 'Age', { inputMode: 'numeric', placeholder: 'e.g. 20' })}
        {text('country', 'Country', { placeholder: 'e.g. Ethiopia', autoComplete: 'country-name' })}

        <div className="sm:col-span-2">
          <RoleSelector value={values.role} error={show('role')} onChange={(n, v) => { set(n, v); blur(n) }} onBlur={blur} disabled={busy} />
        </div>

        {text('kd', 'K/D ratio', { inputMode: 'decimal', placeholder: 'e.g. 3.45', hint: 'Your current season or lifetime K/D.' })}
        <FormField id="field-experience" label="Competitive experience" required error={show('experience')}>
          {(aria) => (
            <>
              <select {...aria} {...bind('experience')} className={`${inputClass(show('experience'))} appearance-none pr-11 ${values.experience ? '' : 'text-ons-silver/50'}`}>
                <option value="">Select your experience</option>
                {experienceOptions.map((o) => <option key={o.value} value={o.value} className="bg-ons-black text-ons-white">{o.label}</option>)}
              </select>
              <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ons-silver" />
            </>
          )}
        </FormField>

        {text('previousClan', 'Previous clan', { optional: true, placeholder: 'Clan or team name' })}
        {text('discord', 'Discord username', { placeholder: 'e.g. onslaught_player', hint: 'So we can contact you.' })}

        <div className="sm:col-span-2">
          <FormField
            id="field-additional" label="Additional information" error={show('additional')}
            counter={<span className={`text-xs font-normal ${values.additional.length > 1000 ? 'text-ons-white' : 'text-ons-silver/60'}`}>{values.additional.length}/1000</span>}
          >
            {(aria) => <textarea {...aria} {...bind('additional')} rows={5} className={`${inputClass(show('additional'))} resize-y`} placeholder="Playstyle, availability, goals, or anything else we should know." />}
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ons-silver">
            <input id="field-consent" name="consent" type="checkbox" checked={values.consent} onChange={(e) => { set('consent', e.target.checked); blur('consent') }} aria-invalid={show('consent') ? 'true' : undefined} aria-describedby={show('consent') ? 'field-consent-error' : undefined} className="peer sr-only" />
            <span aria-hidden="true" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border bg-ons-black transition-colors peer-checked:bg-ons-silver peer-checked:text-ons-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ons-silver peer-checked:[&>svg]:opacity-100 ${show('consent') ? 'border-ons-white' : 'border-ons-silver/50'}`}>
              <Check size={14} strokeWidth={3} className="opacity-0 transition-opacity" />
            </span>
            <span>I confirm the information above is accurate and agree to ONSLAUGHT ESPORTS storing it to review my application. <span aria-hidden="true">*</span></span>
          </label>
          <div id="field-consent-error" aria-live="polite">
            {show('consent') && <p className="flex items-start gap-1.5 pt-2 text-sm text-ons-white"><CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {errors.consent}</p>}
          </div>
        </div>

        {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} /></label>
        </div>
      </fieldset>

      <div className="mt-8 space-y-4">
        <AnimatePresence initial={false}>
          {(failure || (attempted && errorCount > 0)) && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex gap-3 border border-ons-white/70 p-4 text-sm text-ons-white">
              <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>{failure || `Please correct the ${errorCount} highlighted ${errorCount === 1 ? 'field' : 'fields'} and try again.`}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={busy}
          className="silver-surface inline-flex w-full items-center justify-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide text-ons-black transition duration-300 [clip-path:polygon(14px_0,100%_0,calc(100%-14px)_100%,0_100%)] enabled:hover:brightness-110 enabled:active:brightness-95 disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:min-w-64"
        >
          {busy ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> Submitting…</> : <><Send size={17} aria-hidden="true" /> Submit application</>}
        </button>
      </div>
    </form>
  )
}
