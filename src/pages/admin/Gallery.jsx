import { useState } from 'react'
import { Download, Film, Images, Pencil, Plus, Trash2 } from 'lucide-react'
import { Btn, EmptyState, IconBtn, PageTitle, Tabs } from '../../components/admin/ui.jsx'
import Drawer from '../../components/admin/Drawer.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { CategoryForm, PhotoForm, VideoForm } from '../../components/admin/GalleryForms.jsx'
import { ExportDialog, ImageThumb, useHold } from '../../components/admin/widgets.jsx'
import { SampleBadge } from '../../components/roster/RoleBadge.jsx'
import { videoCategories } from '../../data/media.js'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { exportMedia } from '../../admin/exporters.js'
import { parseYouTubeId } from '../../lib/media.js'

export default function Gallery() {
  const { state, actions, toast } = useAdmin()
  const [tab, setTab] = useState('photos')
  const [edit, setEdit] = useState(null) // { kind, item }
  const [del, setDel] = useState(null) // { kind, item }
  const [exporting, setExporting] = useState(false)
  const held = useHold(edit)
  const heldDel = useHold(del)
  const catLabel = (k) => state.categories.find((c) => c.key === k)?.label ?? k
  const inUse = (k) => state.photos.filter((p) => p.category === k).length

  const add = { photos: 'Add photo', videos: 'Add video', categories: 'Add category' }[tab]
  const kind = { photos: 'photo', videos: 'video', categories: 'category' }[tab]

  function confirmDelete() {
    const { kind: k, item } = del
    if (k === 'photo') { actions.remove('photos', item.id, `Deleted photo "${item.title}"`); toast(`Photo "${item.title}" deleted (draft)`) }
    if (k === 'video') { actions.remove('videos', item.id, `Deleted video "${item.title}"`); toast(`Video "${item.title}" deleted (draft)`) }
    if (k === 'category') { actions.set('categories', state.categories.filter((c) => c.key !== item.key), `Deleted category "${item.label}"`, 'deleted'); toast(`Category "${item.label}" deleted (draft)`) }
    setDel(null)
  }

  return (
    <>
      <PageTitle title="Gallery" intro="Manage photographs, YouTube videos, captions and gallery categories."
        actions={<><Btn onClick={() => setExporting(true)}><Download size={16} /> Export</Btn><Btn variant="primary" onClick={() => setEdit({ kind, item: {} })}><Plus size={16} /> {add}</Btn></>} />
      <Tabs label="Gallery sections" value={tab} onChange={setTab} tabs={[{ key: 'photos', label: 'Photos', count: state.photos.length }, { key: 'videos', label: 'Videos', count: state.videos.length }, { key: 'categories', label: 'Categories', count: state.categories.length }]} />

      {tab === 'photos' && (state.photos.length === 0 ? <EmptyState icon={Images} title="No photos yet" text="Add a photograph to the media gallery." /> : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.photos.map((p) => (
            <li key={p.id} data-photo={p.id} className="flex flex-col border border-ons-silver/15 bg-ons-graphite">
              <div className="relative"><ImageThumb src={p.src} className="aspect-video w-full" />{p.sample && <span className="absolute right-2 top-2"><SampleBadge /></span>}</div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{p.title}</p>
                <p className="mt-2 text-xs text-ons-silver">{catLabel(p.category)} · {p.layout}</p>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-ons-silver/90">{p.caption || 'No caption.'}</p>
                <div className="mt-4 flex gap-2"><IconBtn label={`Edit ${p.title}`} onClick={() => setEdit({ kind: 'photo', item: p })}><Pencil size={15} /></IconBtn><IconBtn label={`Delete ${p.title}`} onClick={() => setDel({ kind: 'photo', item: p })}><Trash2 size={15} /></IconBtn></div>
              </div>
            </li>
          ))}
        </ul>
      ))}

      {tab === 'videos' && (state.videos.length === 0 ? <EmptyState icon={Film} title="No videos yet" text="Add a YouTube link to the video highlights." /> : (
        <div className="border border-ons-silver/15 bg-ons-graphite"><ul>
          {state.videos.map((v) => {
            const id = parseYouTubeId(v.url)
            return (
              <li key={v.id} data-video={v.id} className="grid items-center gap-4 border-b border-ons-silver/10 px-5 py-4 last:border-0 md:grid-cols-[2fr_1.3fr_1.6fr_auto]">
                <p className="flex flex-wrap items-center gap-2 font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{v.title} {v.sample && <SampleBadge />}</p>
                <p className="text-sm text-ons-silver">{videoCategories[v.category]?.label}</p>
                <p className="truncate text-sm text-ons-silver">{id ? <span title={v.url}>youtube.com/watch?v={id}</span> : <span className="text-ons-silver/60">No link yet (placeholder)</span>}</p>
                <div className="flex gap-2"><IconBtn label={`Edit ${v.title}`} onClick={() => setEdit({ kind: 'video', item: v })}><Pencil size={15} /></IconBtn><IconBtn label={`Delete ${v.title}`} onClick={() => setDel({ kind: 'video', item: v })}><Trash2 size={15} /></IconBtn></div>
              </li>
            )
          })}
        </ul></div>
      ))}

      {tab === 'categories' && (
        <div className="border border-ons-silver/15 bg-ons-graphite"><ul>
          {state.categories.map((c) => (
            <li key={c.key} data-category={c.key} className="flex flex-wrap items-center gap-4 border-b border-ons-silver/10 px-5 py-4 last:border-0">
              <p className="font-display text-2xl font-extrabold leading-none tracking-wide text-ons-white">{c.label}</p>
              <code className="text-xs text-ons-silver">{c.key}</code>
              <span className="text-sm text-ons-silver">{inUse(c.key)} {inUse(c.key) === 1 ? 'photo' : 'photos'}</span>
              <div className="ml-auto flex items-center gap-2">
                <IconBtn label={`Rename ${c.label}`} onClick={() => setEdit({ kind: 'category', item: c })}><Pencil size={15} /></IconBtn>
                <IconBtn label={inUse(c.key) ? `${c.label} is in use and cannot be deleted` : `Delete ${c.label}`} disabled={inUse(c.key) > 0} onClick={() => setDel({ kind: 'category', item: c })}><Trash2 size={15} /></IconBtn>
              </div>
            </li>
          ))}
        </ul><p className="border-t border-ons-silver/15 px-5 py-3 text-xs text-ons-silver/70">A category can be deleted once no photos use it. &ldquo;All Media&rdquo; is built in.</p></div>
      )}

      <Drawer open={!!edit} onClose={() => setEdit(null)} title={held ? `${held.item?.id || held.item?.key ? 'Edit' : 'Add'} ${held.kind}` : ''}>
        {held?.kind === 'photo' && <PhotoForm key={held.item.id ?? 'new'} photo={held.item} onClose={() => setEdit(null)} />}
        {held?.kind === 'video' && <VideoForm key={held.item.id ?? 'new'} video={held.item} onClose={() => setEdit(null)} />}
        {held?.kind === 'category' && <CategoryForm key={held.item.key ?? 'new'} category={held.item} onClose={() => setEdit(null)} />}
      </Drawer>
      <ConfirmDialog open={!!del} title={`Delete ${heldDel?.kind ?? 'item'}?`} message={`"${heldDel?.item?.title ?? heldDel?.item?.label ?? ''}" will be removed from the draft.`} onCancel={() => setDel(null)} onConfirm={confirmDelete} />
      <ExportDialog open={exporting} onClose={() => setExporting(false)} title="Export media" data={exporting ? exportMedia(state) : null} />
    </>
  )
}
