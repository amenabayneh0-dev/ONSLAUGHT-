import { useState } from 'react'
import { ChevronDown, Download, Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Btn, EmptyState, IconBtn, PageTitle } from '../../components/admin/ui.jsx'
import Drawer from '../../components/admin/Drawer.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import PlayerForm from '../../components/admin/PlayerForm.jsx'
import { ExportDialog, ImageThumb, useHold } from '../../components/admin/widgets.jsx'
import PlayerStats from '../../components/roster/PlayerStats.jsx'
import { SampleBadge } from '../../components/roster/RoleBadge.jsx'
import { roles } from '../../data/players.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { exportPlayers } from '../../admin/exporters.js'

const sel = 'border border-ons-silver/25 bg-ons-black px-3 py-2 text-sm text-ons-white outline-none focus:border-ons-silver'

export default function Players() {
  const { state, actions, toast } = useAdmin()
  const [editing, setEditing] = useState(null) // player | {} (new) | null
  const [deleting, setDeleting] = useState(null)
  const [open, setOpen] = useState(null) // expanded stats row id
  const [query, setQuery] = useState('')
  const [exporting, setExporting] = useState(false)
  const held = useHold(editing)
  const heldDelete = useHold(deleting)

  const q = query.trim().toLowerCase()
  const list = state.players.filter((p) => !q || p.username.toLowerCase().includes(q) || p.country.toLowerCase().includes(q))

  const changeRole = (p, role) => {
    actions.upsert('players', { ...p, role }, `Changed ${p.username}'s role to ${roles[role].full}`)
    toast(`${p.username} is now ${roles[role].full} (draft)`)
  }

  return (
    <>
      <PageTitle title="Players" intro="Add, edit and remove roster players, change roles and manage photographs."
        actions={<><Btn onClick={() => setExporting(true)}><Download size={16} /> Export</Btn><Btn variant="primary" onClick={() => setEditing({})}><Plus size={16} /> Add player</Btn></>} />

      <div className="relative mb-5 max-w-sm">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ons-silver" />
        <input aria-label="Search players" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by username or country" className={`${sel} w-full py-2.5 pl-9`} />
      </div>
      <p className="sr-only" role="status">{list.length} players shown</p>

      {list.length === 0 ? (
        <EmptyState icon={Users} title={state.players.length ? 'No players match your search' : 'No players yet'} text={state.players.length ? 'Try a different search.' : 'Add your first player to build the roster.'} action={!state.players.length && <Btn variant="primary" onClick={() => setEditing({})}><Plus size={16} /> Add player</Btn>} />
      ) : (
        <div className="border border-ons-silver/15 bg-ons-graphite">
          <div aria-hidden="true" className="hidden grid-cols-[2.2fr_1.3fr_1fr_1.6fr_auto] gap-4 border-b border-ons-silver/15 px-5 py-3 text-xs font-semibold text-ons-silver md:grid">
            <span>Player</span><span>Role</span><span>Country</span><span>Kills · Matches · MVPs · Win rate</span><span className="w-[7.5rem]" />
          </div>
          <ul>
            {list.map((p) => (
              <li key={p.id} data-player={p.id} className="border-b border-ons-silver/10 last:border-0">
                <div className="grid items-center gap-4 px-5 py-4 md:grid-cols-[2.2fr_1.3fr_1fr_1.6fr_auto]">
                  <div className="flex items-center gap-3">
                    <ImageThumb src={p.photo} />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{p.username} {p.sample && <SampleBadge />}</p>
                      <p className="mt-1 text-xs text-ons-silver">#{String(p.number).padStart(2, '0')}</p>
                    </div>
                  </div>
                  <select aria-label={`Role for ${p.username}`} value={p.role} onChange={(e) => changeRole(p, e.target.value)} className={sel}>
                    {Object.entries(roles).map(([k, r]) => <option key={k} value={k}>{r.full}</option>)}
                  </select>
                  <p className="text-sm text-ons-silver">{p.country}</p>
                  <p className="text-sm text-ons-silver">{p.stats.kills.toLocaleString('en-US')} · {p.stats.matches} · {p.stats.mvps} · {p.stats.winRate}%</p>
                  <div className="flex gap-2">
                    <IconBtn label={`${open === p.id ? 'Hide' : 'View'} statistics for ${p.username}`} aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)}><ChevronDown size={16} className={`transition-transform ${open === p.id ? 'rotate-180' : ''}`} /></IconBtn>
                    <IconBtn label={`Edit ${p.username}`} onClick={() => setEditing(p)}><Pencil size={15} /></IconBtn>
                    <IconBtn label={`Delete ${p.username}`} onClick={() => setDeleting(p)}><Trash2 size={15} /></IconBtn>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {open === p.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid gap-6 border-t border-ons-silver/10 bg-ons-black/40 p-5 lg:grid-cols-2">
                        <PlayerStats stats={p.stats} variant="large" />
                        <div>
                          <p className="text-sm font-semibold text-ons-white">Achievements</p>
                          {p.achievements?.length ? <ul className="mt-2 space-y-1 text-sm text-ons-silver">{p.achievements.map((a, i) => <li key={i}>{a.title} <span className="text-ons-silver/60">· {a.event} {a.year}</span></li>)}</ul> : <p className="mt-2 text-sm text-ons-silver/70">None added.</p>}
                          <p className="mt-4 text-sm text-ons-silver">{p.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={held?.id ? `Edit ${held.username}` : 'Add player'}>
        {held && <PlayerForm key={held.id ?? 'new'} player={held} onClose={() => setEditing(null)} />}
      </Drawer>
      <ConfirmDialog open={!!deleting} title="Delete player?" message={`${heldDelete?.username ?? ''} will be removed from the draft roster. You can restore it by resetting the draft or importing a backup.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { actions.remove('players', deleting.id, `Deleted player ${deleting.username}`); toast(`${deleting.username} deleted (draft)`); setDeleting(null) }} />
      <ExportDialog open={exporting} onClose={() => setExporting(false)} title="Export players" data={exporting ? exportPlayers(state) : null} />
    </>
  )
}
