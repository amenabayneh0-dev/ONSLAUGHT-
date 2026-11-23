import { useRef, useState } from 'react'
import { AreaField, ImageField, RepeatField, SelectField, TextField, CheckField } from './fields.jsx'
import { Btn } from './ui.jsx'
import { roles } from '../../data/players.js'
import { validatePlayer, slugify, uniqueId, without } from '../../admin/validation.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'

const roleOptions = Object.entries(roles).map(([value, r]) => ({ value, label: r.full }))
const blankAchievement = () => ({ title: '', event: '', year: '' })

function toForm(p, players) {
  if (p?.id) {
    return { username: p.username, number: String(p.number), role: p.role, country: p.country, description: p.description ?? '', bio: p.bio ?? '', kills: String(p.stats.kills), matches: String(p.stats.matches), mvps: String(p.stats.mvps), winRate: String(p.stats.winRate), photo: p.photo ?? '', achievements: (p.achievements ?? []).map((a) => ({ title: a.title ?? '', event: a.event ?? '', year: a.year ?? '' })), sample: !!p.sample }
  }
  const used = players.map((x) => Number(x.number))
  let n = 1
  while (used.includes(n)) n++
  return { username: '', number: String(n), role: 'assault', country: '', description: '', bio: '', kills: '0', matches: '0', mvps: '0', winRate: '0', photo: '', achievements: [], sample: false, ...p }
}

/** Add / edit a player. `player` with an id edits; without one it prefills a new player. */
export default function PlayerForm({ player, onClose }) {
  const { state, actions, toast } = useAdmin()
  const [v, setV] = useState(() => toForm(player, state.players))
  const [errors, setErrors] = useState({})
  const form = useRef(null)
  const editing = Boolean(player?.id)
  const set = (k) => (val) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => without(e, k)) }

  function submit(e) {
    e.preventDefault()
    const errs = validatePlayer(v, { players: state.players, editingId: player?.id })
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => form.current?.querySelector('[aria-invalid=true], [role=alert]')?.scrollIntoView({ block: 'center' }))
      form.current?.querySelector('[aria-invalid=true]')?.focus()
      return
    }
    const username = v.username.trim()
    const id = editing ? player.id : uniqueId(slugify(username), state.players.map((p) => p.id))
    const saved = {
      ...(editing ? player : { photoPosition: 'center top' }),
      id, sample: v.sample, username, number: Number(v.number), role: v.role, country: v.country.trim(),
      photo: v.photo.trim() || null, description: v.description.trim(), bio: v.bio.trim(),
      stats: { kills: Number(v.kills), matches: Number(v.matches), mvps: Number(v.mvps), winRate: Number(v.winRate) },
      achievements: v.achievements.filter((a) => a.title.trim()).map((a) => ({ title: a.title.trim(), event: a.event.trim(), year: a.year.trim() })),
    }
    actions.upsert('players', saved, `${editing ? 'Updated' : 'Added'} player ${username}`)
    toast(`${username} ${editing ? 'updated' : 'added'} (draft)`)
    onClose()
  }

  return (
    <form ref={form} onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="flex-1 space-y-8 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="PUBG username" required value={v.username} onChange={set('username')} error={errors.username} autoFocus />
          <TextField label="Player number" required value={v.number} onChange={set('number')} error={errors.number} inputMode="numeric" />
          <SelectField label="In-game role" required value={v.role} onChange={set('role')} options={roleOptions} error={errors.role} />
          <TextField label="Country" required value={v.country} onChange={set('country')} error={errors.country} />
        </div>
        <ImageField label="Player photograph" value={v.photo} onChange={set('photo')} error={errors.photo} maxSize={1100} hint="Portrait (4:5) works best." />
        <AreaField label="Short description" rows={2} maxLength={200} value={v.description} onChange={set('description')} error={errors.description} hint="Shown on the roster card." />
        <AreaField label="Biography" rows={5} maxLength={1500} value={v.bio} onChange={set('bio')} error={errors.bio} />
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-ons-white">Statistics</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Total kills" required value={v.kills} onChange={set('kills')} error={errors.kills} inputMode="numeric" />
            <TextField label="Matches played" required value={v.matches} onChange={set('matches')} error={errors.matches} inputMode="numeric" />
            <TextField label="MVP awards" required value={v.mvps} onChange={set('mvps')} error={errors.mvps} inputMode="numeric" />
            <TextField label="Win rate (%)" required value={v.winRate} onChange={set('winRate')} error={errors.winRate} inputMode="numeric" />
          </div>
        </fieldset>
        <RepeatField label="Achievements" items={v.achievements} onChange={set('achievements')} newItem={blankAchievement} addLabel="Add achievement" error={errors.achievements} emptyText="No achievements added."
          fields={[{ key: 'title', label: 'Title', wide: true }, { key: 'event', label: 'Event' }, { key: 'year', label: 'Year' }]} />
        <CheckField label="Sample / placeholder player" checked={v.sample} onChange={set('sample')} hint="Shows a Sample badge on the website. Untick once this is a real player." />
      </div>
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-ons-silver/15 bg-ons-graphite p-4">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" type="submit">{editing ? 'Save changes' : 'Add player'}</Btn>
      </div>
    </form>
  )
}
