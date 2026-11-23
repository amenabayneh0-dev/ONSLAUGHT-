import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { User } from 'lucide-react'
import Drawer from './Drawer.jsx'
import { Btn } from './ui.jsx'
import StatusIndicator from '../recruitment/StatusIndicator.jsx'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { downloadHref } from '../../admin/exporters.js'

export function ImageThumb({ src, className = 'h-12 w-10' }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`${className} inline-flex shrink-0 items-center justify-center overflow-hidden border border-ons-silver/25 bg-ons-black`}>
      {src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" /> : <User size={16} className="text-ons-silver/50" aria-hidden="true" />}
    </span>
  )
}

/** OPEN / CLOSED switch. The single place recruitment status is changed. */
export function RecruitmentToggle() {
  const { state, actions, toast } = useAdmin()
  const rec = state.settings.recruitment
  const open = rec.status === 'open'
  const set = (status) => {
    if (status === rec.status) return
    actions.set('settings', { ...state.settings, recruitment: { ...rec, status } }, `Recruitment set to ${status.toUpperCase()}`, 'status')
    toast(`Recruitment is now ${status.toUpperCase()} (draft)`)
  }
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusIndicator open={open} />
      <div role="group" aria-label="Recruitment status" className="inline-flex border border-ons-silver/30">
        {['open', 'closed'].map((s) => (
          <button key={s} type="button" aria-pressed={rec.status === s} onClick={() => set(s)} className={`px-5 py-2.5 text-sm font-semibold capitalize transition-colors ${rec.status === s ? 'silver-surface text-ons-black' : 'text-ons-silver hover:text-ons-white'}`}>{s}</button>
        ))}
      </div>
    </div>
  )
}

function CopyBtn({ text }) {
  const [done, setDone] = useState(false)
  return (
    <Btn onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000) } catch { /* clipboard blocked */ } }}>
      {done ? <Check size={15} /> : <Copy size={15} />} {done ? 'Copied' : 'Copy code'}
    </Btn>
  )
}

/** Shows paste-ready code for the website's data files, plus any uploaded images to save. */
export function ExportDialog({ open, onClose, title, data }) {
  return (
    <Drawer open={open} onClose={onClose} title={title} wide>
      <div className="space-y-8 p-6">
        <p className="text-sm leading-relaxed text-ons-silver">The live website reads its content from files in <code className="text-ons-white">src/data/</code>. Copy each block below into the file named above it, then rebuild and redeploy the site.</p>
        {data?.sections.map((s) => (
          <section key={s.title} aria-label={s.title}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-bold tracking-wide text-ons-white">{s.title}</h3>
              <code className="border border-ons-silver/30 px-2 py-1 text-xs text-ons-white">{s.target}</code>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ons-silver">{s.steps}</p>
            <pre tabIndex={0} className="mt-3 max-h-64 overflow-auto border border-ons-silver/20 bg-ons-black p-4 text-xs leading-relaxed text-ons-silver">{s.code}</pre>
            <div className="mt-3"><CopyBtn text={s.code} /></div>
          </section>
        ))}
        {data?.files.length > 0 && (
          <section aria-label="Image files">
            <h3 className="font-display text-2xl font-bold tracking-wide text-ons-white">Image files to save</h3>
            <p className="mt-2 text-sm leading-relaxed text-ons-silver">These images were uploaded in the dashboard. Download each one and place it at the path shown, so the code above can find it.</p>
            <ul className="mt-3 divide-y divide-ons-silver/15 border border-ons-silver/15">
              {data.files.map((f) => (
                <li key={f.path} className="flex items-center gap-3 p-3">
                  <ImageThumb src={f.dataUrl} />
                  <code className="min-w-0 flex-1 truncate text-xs text-ons-white">{f.path}</code>
                  <Btn onClick={() => downloadHref(f.name, f.dataUrl)}><Download size={15} /> Download</Btn>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Drawer>
  )
}

import { useRef } from 'react'
/** Keeps the last truthy value so a closing drawer does not go blank while it animates out. */
export function useHold(value) {
  const ref = useRef(value)
  if (value) ref.current = value
  return value || ref.current
}
