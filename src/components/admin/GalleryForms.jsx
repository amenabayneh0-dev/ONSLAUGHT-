import { useRef, useState } from 'react'
import { AreaField, CheckField, ImageField, SelectField, TextField } from './fields.jsx'
import { Btn } from './ui.jsx'
import { videoCategories } from '../../data/media.js'
import { parseYouTubeId } from '../../lib/media.js'
import { slugify, uniqueId, validateCategory, validatePhoto, validateVideo, without } from '../../admin/validation.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'

const layouts = [{ value: 'normal', label: 'Normal' }, { value: 'wide', label: 'Wide (2 columns)' }, { value: 'tall', label: 'Tall (2 rows)' }, { value: 'feature', label: 'Feature (large)' }]
const Footer = ({ onClose, label }) => (
  <div className="sticky bottom-0 flex justify-end gap-3 border-t border-ons-silver/15 bg-ons-graphite p-4"><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" type="submit">{label}</Btn></div>
)

export function PhotoForm({ photo, onClose }) {
  const { state, actions, toast } = useAdmin()
  const editing = Boolean(photo?.id)
  const [v, setV] = useState(() => ({ title: photo?.title ?? '', category: photo?.category ?? state.categories[0]?.key ?? '', caption: photo?.caption ?? '', alt: photo?.alt ?? '', layout: photo?.layout ?? 'normal', src: photo?.src ?? '', sample: photo?.id ? !!photo.sample : false }))
  const [errors, setErrors] = useState({})
  const form = useRef(null)
  const set = (k) => (val) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => without(e, k)) }
  function submit(e) {
    e.preventDefault()
    const errs = validatePhoto(v, { categories: state.categories })
    setErrors(errs)
    if (Object.keys(errs).length) return form.current?.querySelector('[aria-invalid=true]')?.focus()
    const title = v.title.trim()
    actions.upsert('photos', {
      ...(editing ? photo : { thumb: null }),
      id: editing ? photo.id : uniqueId(`photo-${slugify(title)}`, state.photos.map((p) => p.id)),
      sample: v.sample, category: v.category, layout: v.layout, title, caption: v.caption.trim(),
      alt: v.alt.trim() || title, src: v.src.trim() || null,
    }, `${editing ? 'Updated' : 'Added'} photo "${title}"`)
    toast(`Photo "${title}" ${editing ? 'updated' : 'added'} (draft)`)
    onClose()
  }
  return (
    <form ref={form} onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 p-6">
        <TextField label="Title" required value={v.title} onChange={set('title')} error={errors.title} autoFocus />
        <ImageField label="Photograph" value={v.src} onChange={set('src')} error={errors.src} maxSize={1600} shape="aspect-video" hint="Leave empty to show a placeholder." />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Category" required value={v.category} onChange={set('category')} options={state.categories.map((c) => ({ value: c.key, label: c.label }))} error={errors.category} />
          <SelectField label="Tile size in the gallery" value={v.layout} onChange={set('layout')} options={layouts} />
        </div>
        <AreaField label="Caption" rows={3} maxLength={200} value={v.caption} onChange={set('caption')} error={errors.caption} hint="Shown in the full-screen viewer." />
        <TextField label="Alt text" value={v.alt} onChange={set('alt')} error={errors.alt} hint="Describes the image for screen readers. Defaults to the title." />
        <CheckField label="Sample / placeholder photo" checked={v.sample} onChange={set('sample')} hint="Shows a Sample badge. Untick for real photographs." />
      </div>
      <Footer onClose={onClose} label={editing ? 'Save changes' : 'Add photo'} />
    </form>
  )
}

export function VideoForm({ video, onClose }) {
  const { state, actions, toast } = useAdmin()
  const editing = Boolean(video?.id)
  const [v, setV] = useState(() => ({ title: video?.title ?? '', url: video?.url ?? '', description: video?.description ?? '', category: video?.category ?? 'best-kills', duration: video?.duration ?? '', sample: video?.id ? !!video.sample : false }))
  const [errors, setErrors] = useState({})
  const form = useRef(null)
  const set = (k) => (val) => { setV((s) => ({ ...s, [k]: val })); setErrors((e) => without(e, k)) }
  const ytId = parseYouTubeId(v.url)
  function submit(e) {
    e.preventDefault()
    const errs = validateVideo(v)
    setErrors(errs)
    if (Object.keys(errs).length) return form.current?.querySelector('[aria-invalid=true]')?.focus()
    const title = v.title.trim()
    actions.upsert('videos', {
      ...(editing ? video : {}), id: editing ? video.id : uniqueId(`video-${slugify(title)}`, state.videos.map((x) => x.id)),
      sample: v.sample, category: v.category, title, url: v.url.trim(), description: v.description.trim(), duration: v.duration.trim(),
    }, `${editing ? 'Updated' : 'Added'} video "${title}"`)
    toast(`Video "${title}" ${editing ? 'updated' : 'added'} (draft)`)
    onClose()
  }
  return (
    <form ref={form} onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 p-6">
        <TextField label="Title" required value={v.title} onChange={set('title')} error={errors.title} autoFocus />
        <TextField label="YouTube link" required value={v.url} onChange={set('url')} error={errors.url} placeholder="https://www.youtube.com/watch?v=…" hint={ytId ? `Valid link. Video ID: ${ytId}` : 'Paste a watch, youtu.be, shorts or embed link, or the 11-character video ID.'} />
        <SelectField label="Category" value={v.category} onChange={set('category')} options={Object.entries(videoCategories).map(([value, c]) => ({ value, label: c.label }))} />
        <AreaField label="Description" rows={3} maxLength={300} value={v.description} onChange={set('description')} error={errors.description} />
        <TextField label="Duration" value={v.duration} onChange={set('duration')} placeholder="e.g. 2:31" hint="Optional." />
        <CheckField label="Sample / placeholder video" checked={v.sample} onChange={set('sample')} hint="Shows a Sample badge. Untick for real videos." />
      </div>
      <Footer onClose={onClose} label={editing ? 'Save changes' : 'Add video'} />
    </form>
  )
}

export function CategoryForm({ category, onClose }) {
  const { state, actions, toast } = useAdmin()
  const editing = Boolean(category?.key)
  const [label, setLabel] = useState(category?.label ?? '')
  const [errors, setErrors] = useState({})
  function submit(e) {
    e.preventDefault()
    const errs = validateCategory({ label }, { categories: state.categories, editingKey: category?.key })
    setErrors(errs)
    if (Object.keys(errs).length) return
    const name = label.trim()
    if (editing) actions.set('categories', state.categories.map((c) => (c.key === category.key ? { ...c, label: name } : c)), `Renamed category "${category.label}" to "${name}"`)
    else actions.set('categories', [...state.categories, { key: uniqueId(slugify(name), state.categories.map((c) => c.key)), label: name }], `Added category "${name}"`, 'added')
    toast(`Category "${name}" ${editing ? 'renamed' : 'added'} (draft)`)
    onClose()
  }
  return (
    <form onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="flex-1 space-y-5 p-6">
        <TextField label="Category name" required value={label} onChange={(val) => { setLabel(val); setErrors({}) }} error={errors.label} autoFocus maxLength={24} />
        <p className="text-sm text-ons-silver">{editing ? 'Photos keep their category when you rename it.' : 'New categories get a generic icon. Add a specific icon in src/data/media.js after exporting.'}</p>
      </div>
      <Footer onClose={onClose} label={editing ? 'Save name' : 'Add category'} />
    </form>
  )
}
