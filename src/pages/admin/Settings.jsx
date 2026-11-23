import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { Btn, PageTitle, Panel } from '../../components/admin/ui.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { AreaField, RepeatField, TextField } from '../../components/admin/fields.jsx'
import { ExportDialog, RecruitmentToggle } from '../../components/admin/widgets.jsx'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { downloadText, exportBackup, exportSettings, parseBackup } from '../../admin/exporters.js'
import { kb } from '../../admin/images.js'
import { STORAGE_LIMIT } from '../../admin/storage.js'
import { without, validateClan, validateContent, validateRecruitmentSettings, validateSocials } from '../../admin/validation.js'

function useSave(entityPatch, label) {
  const { state, actions, toast } = useAdmin()
  return (patch) => {
    actions.set('settings', { ...state.settings, ...entityPatch(state.settings, patch) }, label)
    toast(`${label} saved (draft)`)
  }
}

function ClanForm() {
  const { state } = useAdmin()
  const [v, setV] = useState({ ...state.settings.clan })
  const [errors, setErrors] = useState({})
  const save = useSave((s, p) => ({ clan: p }), 'Clan information')
  const set = (k) => (val) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => without(e, k)) }
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); const er = validateClan(v); setErrors(er); if (!Object.keys(er).length) save({ name: v.name.trim(), fullName: v.fullName.trim(), short: v.short.trim(), slogan: v.slogan.trim(), description: v.description.trim() }) }} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Clan name" required value={v.name} onChange={set('name')} error={errors.name} />
        <TextField label="Full name" required value={v.fullName} onChange={set('fullName')} error={errors.fullName} />
        <TextField label="Short name" required value={v.short} onChange={set('short')} error={errors.short} maxLength={6} />
      </div>
      <TextField label="Slogan" value={v.slogan} onChange={set('slogan')} error={errors.slogan} />
      <AreaField label="Description" rows={2} maxLength={200} value={v.description} onChange={set('description')} error={errors.description} />
      <Btn variant="primary" type="submit">Save clan information</Btn>
    </form>
  )
}

function SocialForm() {
  const { state } = useAdmin()
  const [rows, setRows] = useState(state.settings.socials.map((s) => ({ ...s })))
  const [errors, setErrors] = useState({})
  const save = useSave((s, p) => ({ socials: p }), 'Social links')
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); const er = validateSocials(rows); setErrors(er); if (!Object.keys(er).length) save(rows.map((r) => ({ label: r.label, href: r.href.trim() }))) }} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {rows.map((r, i) => <TextField key={r.label} label={r.label} value={r.href} onChange={(val) => { setRows(rows.map((x, j) => (j === i ? { ...x, href: val } : x))); setErrors((e) => without(e, i)) }} error={errors[i]} placeholder={`https://…`} hint="Leave empty to hide the link target for now." />)}
      </div>
      <Btn variant="primary" type="submit">Save social links</Btn>
    </form>
  )
}

function RecruitmentForm() {
  const { state } = useAdmin()
  const r = state.settings.recruitment
  const [v, setV] = useState({ description: r.description, closedTitle: r.closedTitle, closedMessage: r.closedMessage, minAge: String(r.minAge) })
  const [errors, setErrors] = useState({})
  const save = useSave((s, p) => ({ recruitment: { ...s.recruitment, ...p } }), 'Recruitment settings')
  const set = (k) => (val) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => without(e, k)) }
  return (
    <div className="space-y-6">
      <RecruitmentToggle />
      <form noValidate onSubmit={(e) => { e.preventDefault(); const er = validateRecruitmentSettings({ ...v, status: r.status }); setErrors(er); if (!Object.keys(er).length) save({ description: v.description.trim(), closedTitle: v.closedTitle.trim(), closedMessage: v.closedMessage.trim(), minAge: Number(v.minAge) }) }} className="space-y-5">
        <AreaField label="Recruitment description" required rows={3} maxLength={400} value={v.description} onChange={set('description')} error={errors.description} />
        <TextField label="Closed title" required value={v.closedTitle} onChange={set('closedTitle')} error={errors.closedTitle} />
        <AreaField label="Closed message" required rows={2} value={v.closedMessage} onChange={set('closedMessage')} error={errors.closedMessage} hint="Shown instead of the form when recruitment is CLOSED." />
        <TextField label="Minimum age" required value={v.minAge} onChange={set('minAge')} error={errors.minAge} inputMode="numeric" />
        <Btn variant="primary" type="submit">Save recruitment settings</Btn>
      </form>
    </div>
  )
}

function ContentForm() {
  const { state } = useAdmin()
  const c = state.settings.content
  const [v, setV] = useState({ story: c.story.map((text) => ({ text })), missionStatement: c.missionStatement, visionStatement: c.visionStatement })
  const [errors, setErrors] = useState({})
  const save = useSave((s, p) => ({ content: p }), 'Website content')
  const set = (k) => (val) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => without(e, k)) }
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); const story = v.story.map((s) => s.text); const er = validateContent({ ...v, story }); setErrors(er); if (!Object.keys(er).length) save({ story: story.filter((t) => t.trim()).map((t) => t.trim()), missionStatement: v.missionStatement.trim(), visionStatement: v.visionStatement.trim() }) }} className="space-y-6">
      <RepeatField label="Our Story paragraphs" items={v.story} onChange={set('story')} newItem={() => ({ text: '' })} addLabel="Add paragraph" error={errors.story} fields={[{ key: 'text', label: 'Paragraph', wide: true }]} emptyText="No paragraphs." />
      <AreaField label="Mission statement" required rows={2} value={v.missionStatement} onChange={set('missionStatement')} error={errors.missionStatement} />
      <AreaField label="Vision statement" required rows={3} value={v.visionStatement} onChange={set('visionStatement')} error={errors.visionStatement} />
      <Btn variant="primary" type="submit">Save website content</Btn>
    </form>
  )
}

function DraftTools() {
  const { state, actions, persist, toast } = useAdmin()
  const file = useRef(null)
  const [resetting, setResetting] = useState(false)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState('')
  const used = persist.bytes || JSON.stringify(state).length * 2

  async function pick(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    const r = parseBackup(await f.text())
    if (r.error) return setError(r.error)
    setError(''); setPending(r.state)
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1.5 flex justify-between text-sm"><span className="text-ons-silver">Draft storage used</span><span className="font-semibold text-ons-white">{kb(used)} of about {kb(STORAGE_LIMIT)}</span></div>
        <div className="h-1.5 bg-ons-black"><div className="h-full bg-ons-silver" style={{ width: `${Math.min(100, (used / STORAGE_LIMIT) * 100)}%` }} /></div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Btn onClick={() => { downloadText(`onslaught-admin-backup-${new Date().toISOString().slice(0, 10)}.json`, exportBackup(state)); toast('Backup downloaded') }}><Download size={16} /> Download backup</Btn>
        <input ref={file} type="file" accept="application/json,.json" onChange={pick} className="sr-only" aria-label="Choose backup file" tabIndex={-1} />
        <Btn onClick={() => file.current?.click()}><Upload size={16} /> Restore from backup</Btn>
        <Btn variant="danger" onClick={() => setResetting(true)}><RotateCcw size={16} /> Reset draft</Btn>
      </div>
      {error && <p role="alert" className="text-sm text-ons-white">{error}</p>}
      <p className="text-xs leading-relaxed text-ons-silver/70">A backup contains everything in this draft, including uploaded images and applicant details. Keep it private.</p>
      <ConfirmDialog open={resetting} title="Reset draft?" confirmLabel="Reset draft" message="All dashboard changes, uploaded images and notes will be discarded and the draft will return to what the website currently contains." onCancel={() => setResetting(false)} onConfirm={() => { actions.reset(); setResetting(false); toast('Draft reset to the website data') }} />
      <ConfirmDialog open={!!pending} title="Restore this backup?" confirmLabel="Restore" message="The current draft will be replaced by the contents of the backup file." onCancel={() => setPending(null)} onConfirm={() => { actions.replaceAll(pending, 'Restored draft from backup'); setPending(null); toast('Backup restored') }} />
    </div>
  )
}

export default function Settings() {
  const { state } = useAdmin()
  const [exporting, setExporting] = useState(false)
  return (
    <>
      <PageTitle title="Settings" intro="Clan information, social links, recruitment and website content." actions={<Btn onClick={() => setExporting(true)}><Download size={16} /> Export settings</Btn>} />
      <div className="space-y-6">
        <Panel title="Clan information"><ClanForm /></Panel>
        <Panel title="Social media links"><SocialForm /></Panel>
        <Panel title="Recruitment"><RecruitmentForm /></Panel>
        <Panel title="Website content"><ContentForm /></Panel>
        <Panel title="Draft and backup"><DraftTools /></Panel>
      </div>
      <ExportDialog open={exporting} onClose={() => setExporting(false)} title="Export settings" data={exporting ? exportSettings(state) : null} />
    </>
  )
}
