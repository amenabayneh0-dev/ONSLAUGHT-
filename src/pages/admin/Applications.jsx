import { useState } from 'react'
import { ClipboardList, Eye, FileInput, Search, UserPlus } from 'lucide-react'
import { Btn, EmptyState, IconBtn, PageTitle, Panel, relTime } from '../../components/admin/ui.jsx'
import Drawer from '../../components/admin/Drawer.jsx'
import PlayerForm from '../../components/admin/PlayerForm.jsx'
import { AreaField } from '../../components/admin/fields.jsx'
import { RecruitmentToggle, useHold } from '../../components/admin/widgets.jsx'
import StatusBadge from '../../components/recruitment/StatusBadge.jsx'
import RoleBadge, { SampleBadge } from '../../components/roster/RoleBadge.jsx'
import { applicationStatuses, experienceOptions } from '../../data/recruitment.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { parseApplicationJson } from '../../admin/validation.js'

const expLabel = (v) => experienceOptions.find((o) => o.value === v)?.label ?? v
const fmt = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')
const filters = [{ key: 'all', label: 'All' }, ...Object.entries(applicationStatuses).map(([key, m]) => ({ key, label: m.label }))]

function Detail({ app, onClose, onRoster }) {
  const { actions, toast } = useAdmin()
  const [notes, setNotes] = useState(app.admin_notes ?? '')
  const setStatus = (status) => {
    actions.upsert('applications', { ...app, status, reviewed_at: status === 'pending' ? null : new Date().toISOString() }, `${status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Reset to pending:'} application from ${app.pubg_username}`)
    toast(`${app.pubg_username}: ${applicationStatuses[status].label} (draft)`)
  }
  const saveNotes = () => {
    actions.upsert('applications', { ...app, admin_notes: notes.trim() }, `Updated notes on application from ${app.pubg_username}`)
    toast('Notes saved (draft)')
  }
  const rows = [
    ['PUBG username', app.pubg_username], ['PUBG ID', app.pubg_id], ['Age', app.age], ['Country', app.country],
    ['K/D ratio', app.kd_ratio], ['Competitive experience', expLabel(app.competitive_experience)], ['Previous clan', app.previous_clan || 'None'],
    ['Discord', app.discord_username], ['Submitted', fmt(app.created_at)], ['Reviewed', fmt(app.reviewed_at)],
  ]
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={app.status} /> <RoleBadge role={app.preferred_role} full /> {app.sample && <SampleBadge />}
      </div>
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map(([k, v]) => <div key={k} className="border-t border-ons-silver/15 pt-3"><dt className="text-xs text-ons-silver">{k}</dt><dd className="mt-1 text-sm font-semibold text-ons-white">{v}</dd></div>)}
        <div className="border-t border-ons-silver/15 pt-3 sm:col-span-2"><dt className="text-xs text-ons-silver">Additional information</dt><dd className="mt-1 whitespace-pre-wrap text-sm text-ons-white">{app.additional_info || 'None provided.'}</dd></div>
      </dl>

      <div className="space-y-3">
        <AreaField label="Administrator notes" rows={4} maxLength={1000} value={notes} onChange={setNotes} hint="Only visible in the dashboard." />
        <Btn onClick={saveNotes} disabled={notes.trim() === (app.admin_notes ?? '')}>Save notes</Btn>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-ons-silver/15 pt-6">
        <Btn variant="primary" onClick={() => setStatus('accepted')} disabled={app.status === 'accepted'}>Accept</Btn>
        <Btn variant="danger" onClick={() => setStatus('rejected')} disabled={app.status === 'rejected'}>Reject</Btn>
        {app.status !== 'pending' && <Btn variant="ghost" onClick={() => setStatus('pending')}>Reset to pending</Btn>}
        {app.status === 'accepted' && <Btn onClick={() => onRoster(app)}><UserPlus size={16} /> Add to roster</Btn>}
      </div>
    </div>
  )
}

function ImportForm({ onClose }) {
  const { state, actions, toast } = useAdmin()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const r = parseApplicationJson(text)
    if (r.error) return setError(r.error)
    const o = r.application
    if (state.applications.some((a) => a.pubg_id.toLowerCase() === String(o.pubg_id).toLowerCase())) return setError('An application with this PUBG ID already exists.')
    actions.upsert('applications', {
      id: actions.newId(), sample: false, created_at: o.created_at ?? new Date().toISOString(), status: 'pending',
      pubg_username: String(o.pubg_username), pubg_id: String(o.pubg_id), age: Number(o.age), country: String(o.country), preferred_role: o.preferred_role,
      kd_ratio: Number(o.kd_ratio), competitive_experience: o.competitive_experience, previous_clan: o.previous_clan ?? null,
      discord_username: String(o.discord_username), additional_info: o.additional_info ?? null, admin_notes: '', reviewed_at: null,
    }, `Imported application from ${o.pubg_username}`)
    toast('Application imported as Pending (draft)')
    onClose()
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5 p-6">
      <p className="text-sm leading-relaxed text-ons-silver">While no database is connected, applicants&rsquo; submissions are not stored anywhere. Paste the JSON from the application form&rsquo;s <strong className="text-ons-white">Copy application data</strong> button here to add it to the draft list.</p>
      <AreaField label="Application JSON" required rows={12} value={text} onChange={(v) => { setText(v); setError('') }} error={error} placeholder='{ "pubg_username": "…", "pubg_id": "…", … }' />
      <div className="flex justify-end gap-3"><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" type="submit">Import application</Btn></div>
    </form>
  )
}

export default function Applications() {
  const { state } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [viewId, setViewId] = useState(null)
  const [importing, setImporting] = useState(false)
  const [roster, setRoster] = useState(null)
  const app = state.applications.find((a) => a.id === viewId)
  const heldApp = useHold(app)
  const heldRoster = useHold(roster)

  const q = query.trim().toLowerCase()
  const list = [...state.applications].sort((a, b) => b.created_at.localeCompare(a.created_at))
    .filter((a) => (filter === 'all' || a.status === filter) && (!q || a.pubg_username.toLowerCase().includes(q) || a.discord_username.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)))
  const count = (k) => (k === 'all' ? state.applications.length : state.applications.filter((a) => a.status === k).length)

  return (
    <>
      <PageTitle title="Applications" intro="Review applicants, accept or reject them and keep private notes."
        actions={<Btn onClick={() => setImporting(true)}><FileInput size={16} /> Import application</Btn>} />

      <Panel title="Recruitment status" className="mb-6">
        <RecruitmentToggle />
        <p className="mt-3 text-xs text-ons-silver/70">When CLOSED, the website disables Apply Now and hides the form. This is a draft setting: copy it to <code className="text-ons-white">src/data/recruitment.js</code> from Settings → Export.</p>
      </Panel>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter applications by status" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className={`border px-4 py-2 text-sm font-semibold transition-colors ${filter === f.key ? 'silver-surface border-transparent text-ons-black' : 'border-ons-silver/25 text-ons-silver hover:border-ons-silver hover:text-ons-white'}`}>
              {f.label} <span className={filter === f.key ? 'text-ons-black/60' : 'text-ons-silver/50'}>{count(f.key)}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ons-silver" />
          <input aria-label="Search applications" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, Discord or country" className="w-full border border-ons-silver/25 bg-ons-black py-2.5 pl-9 pr-3 text-sm text-ons-white outline-none focus:border-ons-silver" />
        </div>
      </div>
      <p className="sr-only" role="status">{list.length} applications shown</p>

      {list.length === 0 ? (
        <EmptyState icon={ClipboardList} title={state.applications.length ? 'No applications match' : 'No applications yet'} text={state.applications.length ? 'Change the filter or search.' : 'Submitted applications will appear here once a database is connected, or import one manually.'} />
      ) : (
        <div className="border border-ons-silver/15 bg-ons-graphite">
          <ul>
            {list.map((a) => (
              <li key={a.id} data-application={a.id} className="grid items-center gap-4 border-b border-ons-silver/10 px-5 py-4 last:border-0 md:grid-cols-[2fr_1.2fr_0.6fr_1fr_1fr_auto]">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{a.pubg_username} {a.sample && <SampleBadge />}</p>
                  <p className="mt-1 truncate text-xs text-ons-silver">{a.pubg_id} · {a.country}</p>
                </div>
                <div><RoleBadge role={a.preferred_role} /></div>
                <p className="text-sm text-ons-silver">K/D {a.kd_ratio}</p>
                <p className="text-sm text-ons-silver">{relTime(a.created_at)}</p>
                <div><StatusBadge status={a.status} /></div>
                <IconBtn label={`View application from ${a.pubg_username}`} onClick={() => setViewId(a.id)}><Eye size={16} /></IconBtn>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Drawer open={!!app} onClose={() => setViewId(null)} title={heldApp ? `Application: ${heldApp.pubg_username}` : 'Application'}>
        {heldApp && <Detail key={heldApp.id} app={heldApp} onClose={() => setViewId(null)} onRoster={(a) => { setViewId(null); setRoster({ username: a.pubg_username, role: a.preferred_role, country: a.country }) }} />}
      </Drawer>
      <Drawer open={importing} onClose={() => setImporting(false)} title="Import application">
        {importing && <ImportForm onClose={() => setImporting(false)} />}
      </Drawer>
      <Drawer open={!!roster} onClose={() => setRoster(null)} title="Add to roster">
        {heldRoster && <PlayerForm key="roster-prefill" player={heldRoster} onClose={() => setRoster(null)} />}
      </Drawer>
    </>
  )
}
