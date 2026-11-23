import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Info } from 'lucide-react'
import Button from '../ui/Button.jsx'
import StatusBadge from './StatusBadge.jsx'
import { roles } from '../../data/players.js'

const rows = (r) => [
  ['PUBG username', r.pubg_username],
  ['Preferred role', roles[r.preferred_role]?.full],
  ['Discord', r.discord_username],
]

/**
 * Result after a valid submission.
 * saved === true  : the application really was stored by the backend.
 * saved === false : demo mode. Validated only; NOT saved or sent. The copy says so plainly.
 */
export default function SubmitResult({ saved, record, onBack }) {
  const head = useRef(null)
  const [copied, setCopied] = useState(false)
  useEffect(() => head.current?.focus(), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 0.7, 0.2, 1] }} className="py-4">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 16 }} className={`flex h-16 w-16 items-center justify-center ${saved ? 'silver-surface text-ons-black' : 'border border-dashed border-ons-silver/60 text-ons-silver'}`}>
        {saved ? <Check size={32} strokeWidth={2.2} /> : <Info size={30} strokeWidth={1.6} />}
      </motion.div>

      <h3 ref={head} tabIndex={-1} className="silver-text-bright mt-8 font-display text-5xl font-black leading-none tracking-wide outline-none sm:text-6xl">
        {saved ? 'Application submitted' : 'Validated, but not sent'}
      </h3>
      <p className="mt-5 max-w-lg leading-relaxed text-ons-silver">
        {saved
          ? 'Your application has been saved. You will be contacted on Discord if there is a next step.'
          : 'Your application passed validation, but it was not saved or sent. No database is connected to this site yet, so nothing has been recorded.'}
      </p>

      <dl className="mt-8 divide-y divide-ons-silver/15 border-y border-ons-silver/15">
        {rows(record).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-ons-silver">{k}</dt><dd className="font-semibold text-ons-white">{v}</dd></div>
        ))}
        <div className="flex items-center justify-between gap-6 py-3 text-sm">
          <dt className="text-ons-silver">{saved ? 'Status' : 'Status once saved'}</dt>
          <dd><StatusBadge status={record.status} /></dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {!saved && (
          <>
            <Button href="#back" onClick={(e) => { e.preventDefault(); onBack() }}>Back to the form</Button>
            <button type="button" onClick={copy} className="inline-flex items-center justify-center gap-2 border border-ons-silver/40 px-6 py-3.5 text-sm font-semibold text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black">
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy application data'}
            </button>
          </>
        )}
        {saved && <Button href="/">Back to home</Button>}
      </div>
    </motion.div>
  )
}
