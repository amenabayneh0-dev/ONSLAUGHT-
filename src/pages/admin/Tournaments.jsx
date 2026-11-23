import { useState } from 'react'
import { Download, Pencil, Plus, Sparkles, Star, Trash2, Trophy } from 'lucide-react'
import { Btn, EmptyState, IconBtn, PageTitle, Panel, Tabs } from '../../components/admin/ui.jsx'
import Drawer from '../../components/admin/Drawer.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import TournamentForm from '../../components/admin/TournamentForm.jsx'
import { CheckField, TextField } from '../../components/admin/fields.jsx'
import { ExportDialog, useHold } from '../../components/admin/widgets.jsx'
import { PlacementChip } from '../../components/achievements/TournamentCard.jsx'
import { SampleBadge } from '../../components/roster/RoleBadge.jsx'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'
import { achievementTypes } from '../../data/achievements.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { exportTournaments } from '../../admin/exporters.js'
import { validateTeamStats, without } from '../../admin/validation.js'
import { countByType, formatDate, ordinal, sortByDate } from '../../lib/records.js'

/** Inline placement editor: commits on blur/Enter, rejects impossible values. */
function PlacementInput({ t }) {
  const { actions, toast } = useAdmin()
  const [val, setVal] = useState(String(t.placement))
  const commit = () => {
    const n = Number(val)
    if (!/^\d+$/.test(val) || n < 1 || n > t.teams) {
      toast(`Placement must be between 1 and ${t.teams} for ${t.name}`, 'error')
      return setVal(String(t.placement))
    }
    if (n === t.placement) return
    actions.upsert('tournaments', { ...t, placement: n }, `Updated placement of ${t.name} to ${ordinal(n)}`)
    toast(`${t.name}: ${ordinal(n)} place (draft)`)
  }
  return (
    <input aria-label={`Placement for ${t.name}`} inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} className="w-16 border border-ons-silver/25 bg-ons-black px-2 py-2 text-center text-sm text-ons-white outline-none focus:border-ons-silver" />
  )
}

function TeamStatsForm() {
  const { state, actions, toast } = useAdmin()
  const s = state.teamStats
  const counts = countByType(state.tournaments)
  const [v, setV] = useState({ ...s, matches: String(s.matches), eliminations: String(s.eliminations), dinners: String(s.dinners), victories: String(s.victories), appearances: String(s.appearances) })
  const [errors, setErrors] = useState({})
  const set = (k) => (val) => { setV((x) => ({ ...x, [k]: val })); setErrors((e) => without(e, k)) }
  const submit = (e) => {
    e.preventDefault()
    const errs = validateTeamStats(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    actions.set('teamStats', { sample: v.sample, matches: Number(v.matches), eliminations: Number(v.eliminations), dinners: Number(v.dinners), victoriesAuto: v.victoriesAuto, victories: Number(v.victories) || 0, appearancesAuto: v.appearancesAuto, appearances: Number(v.appearances) || 0 }, 'Updated team statistics')
    toast('Team statistics saved (draft)')
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Total matches" required value={v.matches} onChange={set('matches')} error={errors.matches} inputMode="numeric" />
        <TextField label="Total eliminations" required value={v.eliminations} onChange={set('eliminations')} error={errors.eliminations} inputMode="numeric" />
        <TextField label="Chicken dinners" required value={v.dinners} onChange={set('dinners')} error={errors.dinners} inputMode="numeric" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <CheckField label="Tournament victories: calculate automatically" checked={v.victoriesAuto} onChange={set('victoriesAuto')} hint={`Currently ${counts.champions} (first-place finishes)`} />
          {!v.victoriesAuto && <TextField label="Tournament victories" required value={v.victories} onChange={set('victories')} error={errors.victories} inputMode="numeric" />}
        </div>
        <div className="space-y-3">
          <CheckField label="Tournament appearances: calculate automatically" checked={v.appearancesAuto} onChange={set('appearancesAuto')} hint={`Currently ${state.tournaments.length} (tournaments listed)`} />
          {!v.appearancesAuto && <TextField label="Tournament appearances" required value={v.appearances} onChange={set('appearances')} error={errors.appearances} inputMode="numeric" />}
        </div>
      </div>
      <CheckField label="Sample / placeholder statistics" checked={v.sample} onChange={set('sample')} hint="Shows a Sample badge on the website's Team Statistics. Untick once these are real." />
      <Btn variant="primary" type="submit">Save statistics</Btn>
    </form>
  )
}

export default function Tournaments() {
  const { state, actions, toast } = useAdmin()
  const [tab, setTab] = useState('tournaments')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [exporting, setExporting] = useState(false)
  const held = useHold(editing)
  const heldDelete = useHold(deleting)
  const list = sortByDate(state.tournaments, 'desc')
  const counts = countByType(state.tournaments)
  const awards = list.flatMap((t) => (t.awards ?? []).map((a, i) => ({ ...a, t, key: `${t.id}-${i}` })))

  return (
    <>
      <PageTitle title="Tournaments" intro="Manage tournament results, placements, achievements and team statistics."
        actions={<><Btn onClick={() => setExporting(true)}><Download size={16} /> Export</Btn><Btn variant="primary" onClick={() => setEditing({})}><Plus size={16} /> Add tournament</Btn></>} />
      <Tabs label="Tournament sections" value={tab} onChange={setTab} tabs={[{ key: 'tournaments', label: 'Tournaments', count: state.tournaments.length }, { key: 'achievements', label: 'Achievements & statistics' }]} />

      {tab === 'tournaments' && (list.length === 0 ? (
        <EmptyState icon={Trophy} title="No tournaments yet" text="Add a tournament to start the competitive record." action={<Btn variant="primary" onClick={() => setEditing({})}><Plus size={16} /> Add tournament</Btn>} />
      ) : (
        <div className="border border-ons-silver/15 bg-ons-graphite">
          <div aria-hidden="true" className="hidden grid-cols-[2.4fr_1fr_1.2fr_0.9fr_0.7fr_auto] gap-4 border-b border-ons-silver/15 px-5 py-3 text-xs font-semibold text-ons-silver md:grid"><span>Tournament</span><span>Date</span><span>Result</span><span>Placement</span><span>Teams</span><span className="w-[4.75rem]" /></div>
          <ul>
            {list.map((t) => (
              <li key={t.id} data-tournament={t.id} className="grid items-center gap-4 border-b border-ons-silver/10 px-5 py-4 last:border-0 md:grid-cols-[2.4fr_1fr_1.2fr_0.9fr_0.7fr_auto]">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{t.name} {t.sample && <SampleBadge />}</p>
                  {t.awards?.length > 0 && <p className="mt-1 text-xs text-ons-silver">{t.awards.map((a) => a.label).join(' · ')}</p>}
                </div>
                <p className="text-sm text-ons-silver">{formatDate(t.date)}</p>
                <div><PlacementChip placement={t.placement} /></div>
                <PlacementInput key={`${t.id}-${t.placement}`} t={t} />
                <p className="text-sm text-ons-silver">{t.teams}</p>
                <div className="flex gap-2">
                  <IconBtn label={`Edit ${t.name}`} onClick={() => setEditing(t)}><Pencil size={15} /></IconBtn>
                  <IconBtn label={`Delete ${t.name}`} onClick={() => setDeleting(t)}><Trash2 size={15} /></IconBtn>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {tab === 'achievements' && (
        <div className="space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {achievementTypes.map((a) => (
              <li key={a.key} className="border border-ons-silver/15 bg-ons-graphite p-5">
                <a.icon size={18} strokeWidth={1.6} className="text-ons-silver" aria-hidden="true" />
                <p className="silver-text-bright mt-3 font-display text-5xl font-black leading-none" data-achievement={a.key}><AnimatedNumber value={counts[a.key]} /></p>
                <p className="mt-2 text-sm text-ons-silver">{a.label}</p>
              </li>
            ))}
          </ul>
          <Panel title="Awards">
            {awards.length === 0 ? <p className="text-sm text-ons-silver">No MVP or special awards recorded. Add them when editing a tournament.</p> : (
              <ul className="divide-y divide-ons-silver/10">
                {awards.map((a) => (
                  <li key={a.key} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                    {a.type === 'mvp' ? <Star size={16} className="text-ons-silver" aria-hidden="true" /> : <Sparkles size={16} className="text-ons-silver" aria-hidden="true" />}
                    <span className="font-semibold text-ons-white">{a.label}{a.player ? `: ${a.player}` : ''}</span>
                    <span className="text-ons-silver">{a.t.name}</span>
                    <button type="button" onClick={() => setEditing(a.t)} className="ml-auto border-b border-ons-silver/50 text-xs text-ons-white hover:border-ons-white">Edit tournament</button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Team statistics"><TeamStatsForm /></Panel>
        </div>
      )}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={held?.id ? `Edit ${held.name}` : 'Add tournament'}>
        {held && <TournamentForm key={held.id ?? 'new'} tournament={held} onClose={() => setEditing(null)} />}
      </Drawer>
      <ConfirmDialog open={!!deleting} title="Delete tournament?" message={`${heldDelete?.name ?? ''} and its awards will be removed from the draft. Achievement counts update automatically.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { actions.remove('tournaments', deleting.id, `Deleted tournament ${deleting.name}`); toast(`${deleting.name} deleted (draft)`); setDeleting(null) }} />
      <ExportDialog open={exporting} onClose={() => setExporting(false)} title="Export tournaments" data={exporting ? exportTournaments(state) : null} />
    </>
  )
}
