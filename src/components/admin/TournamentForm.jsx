import { useRef, useState } from 'react'
import { AreaField, CheckField, ImageField, RepeatField, TextField } from './fields.jsx'
import { Btn } from './ui.jsx'
import { validateTournament, slugify, uniqueId, without } from '../../admin/validation.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'

const awardTypes = [{ value: 'mvp', label: 'MVP award' }, { value: 'special', label: 'Special achievement' }]

function toForm(t) {
  if (!t?.id) return { name: '', date: '', placement: '', teams: '', description: '', image: '', awards: [], sample: false }
  return { name: t.name, date: t.date.slice(0, 7), placement: String(t.placement), teams: String(t.teams), description: t.description ?? '', image: t.image ?? '', awards: (t.awards ?? []).map((a) => ({ type: a.type, label: a.label ?? '', player: a.player ?? '' })), sample: !!t.sample }
}

export default function TournamentForm({ tournament, onClose }) {
  const { state, actions, toast } = useAdmin()
  const editing = Boolean(tournament?.id)
  const [v, setV] = useState(() => toForm(tournament))
  const [errors, setErrors] = useState({})
  const form = useRef(null)
  const set = (k) => (val) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => without(e, k)) }

  function submit(e) {
    e.preventDefault()
    const errs = validateTournament(v, { editingId: tournament?.id })
    setErrors(errs)
    if (Object.keys(errs).length) return form.current?.querySelector('[aria-invalid=true]')?.focus()
    const name = v.name.trim()
    const saved = {
      ...(editing ? tournament : {}),
      id: editing ? tournament.id : uniqueId(slugify(name), state.tournaments.map((t) => t.id)),
      sample: v.sample, name, date: v.date, placement: Number(v.placement), teams: Number(v.teams),
      image: v.image.trim() || null, description: v.description.trim(),
      awards: v.awards.map((a) => ({ type: a.type, label: a.label.trim(), ...(a.player.trim() ? { player: a.player.trim() } : {}) })),
    }
    actions.upsert('tournaments', saved, `${editing ? 'Updated' : 'Added'} tournament ${name}`)
    toast(`${name} ${editing ? 'updated' : 'added'} (draft)`)
    onClose()
  }

  return (
    <form ref={form} onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="flex-1 space-y-8 p-6">
        <TextField label="Tournament name" required value={v.name} onChange={set('name')} error={errors.name} autoFocus />
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Date" type="month" required value={v.date} onChange={set('date')} error={errors.date} />
          <TextField label="Final placement" required value={v.placement} onChange={set('placement')} error={errors.placement} inputMode="numeric" hint="1 = champions" />
          <TextField label="Teams" required value={v.teams} onChange={set('teams')} error={errors.teams} inputMode="numeric" />
        </div>
        <AreaField label="Short description" rows={3} maxLength={300} value={v.description} onChange={set('description')} error={errors.description} />
        <ImageField label="Tournament image" value={v.image} onChange={set('image')} error={errors.image} maxSize={1200} shape="aspect-video" hint="Landscape (16:9) works best." />
        <RepeatField label="Awards" items={v.awards} onChange={set('awards')} addLabel="Add award" error={errors.awards} emptyText="No extra awards for this tournament."
          newItem={() => ({ type: 'mvp', label: '', player: '' })}
          fields={[{ key: 'type', label: 'Type', options: awardTypes }, { key: 'player', label: 'Player (optional)' }, { key: 'label', label: 'Label', wide: true }]} />
        <CheckField label="Sample / placeholder tournament" checked={v.sample} onChange={set('sample')} hint="Shows a Sample badge on the website. Untick once this is a real result." />
      </div>
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-ons-silver/15 bg-ons-graphite p-4">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" type="submit">{editing ? 'Save changes' : 'Add tournament'}</Btn>
      </div>
    </form>
  )
}
