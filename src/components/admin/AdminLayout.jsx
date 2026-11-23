import { ClipboardList, ExternalLink, Images, LayoutDashboard, Settings, TriangleAlert, Trophy, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../ui/Logo.jsx'
import { useRouter } from '../../router.jsx'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { kb } from '../../admin/images.js'
import { STORAGE_LIMIT } from '../../admin/storage.js'

export const adminNav = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Players', href: '/admin/players', icon: Users },
  { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { label: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function NavItems({ vertical }) {
  const { path } = useRouter()
  const { state } = useAdmin()
  const pending = state.applications.filter((a) => a.status === 'pending').length
  return (
    <ul className={vertical ? 'space-y-1' : 'flex gap-1'}>
      {adminNav.map(({ label, href, icon: Icon }) => {
        const active = path === href
        return (
          <li key={href} className="shrink-0">
            <a href={href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${active ? 'bg-ons-silver text-ons-black' : 'text-ons-silver hover:bg-ons-graphite hover:text-ons-white'}`}>
              <Icon size={17} aria-hidden="true" /> {label}
              {href === '/admin/applications' && pending > 0 && <span className={`ml-auto px-1.5 text-xs ${active ? 'bg-ons-black text-ons-white' : 'border border-ons-silver/50 text-ons-white'}`} aria-label={`${pending} pending`}>{pending}</span>}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default function AdminLayout({ children }) {
  const { persist, toasts, epoch } = useAdmin()
  const { path } = useRouter()
  return (
    <div className="min-h-screen bg-ons-black text-ons-white lg:grid lg:grid-cols-[16rem_1fr]">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ons-silver focus:px-4 focus:py-2 focus:text-ons-black">Skip to content</a>

      <aside className="hidden border-r border-ons-silver/15 bg-ons-graphite lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-5">
          <Logo />
          <p className="mt-2 pl-10 text-xs font-semibold tracking-[0.3em] text-ons-silver">ADMIN</p>
          <nav aria-label="Admin" className="mt-10 flex-1"><NavItems vertical /></nav>
          <a href="/" className="flex items-center gap-2 border-t border-ons-silver/15 px-4 pt-5 text-sm text-ons-silver transition-colors hover:text-ons-white"><ExternalLink size={15} aria-hidden="true" /> View website</a>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-ons-silver/15 bg-ons-black/90 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-5 py-3"><Logo /><span className="text-xs font-semibold tracking-[0.3em] text-ons-silver">ADMIN</span></div>
          <nav aria-label="Admin" className="overflow-x-auto px-3 pb-2"><NavItems /></nav>
        </header>

        <div className="mx-auto max-w-6xl px-5 pt-6 lg:px-10 lg:pt-10">
          {persist.ok ? (
            <div role="note" className="flex gap-3 border border-dashed border-ons-silver/40 bg-ons-graphite/60 p-4 text-sm leading-relaxed text-ons-silver">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p><strong className="font-semibold text-ons-white">Draft mode.</strong> Changes are saved in this browser only and do <strong className="font-semibold text-ons-white">not</strong> change the live website. This dashboard has no login, so do not store private data here. Use each page&rsquo;s Export button to move changes into your site files.{persist.bytes > 0 && <span className="text-ons-silver/70"> Draft size: {kb(persist.bytes)} of about {kb(STORAGE_LIMIT)}.</span>}</p>
            </div>
          ) : (
            <div role="alert" className="flex gap-3 border border-ons-white p-4 text-sm leading-relaxed text-ons-white">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p><strong>Not saved.</strong> Browser storage is full or unavailable, so your latest changes exist only on this screen and will be lost on reload. Remove large images or export a backup from Settings now.</p>
            </div>
          )}
        </div>

        <motion.main key={`${path}-${epoch}`} id="admin-main" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </motion.main>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[95] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.p key={t.id} role={t.kind === 'error' ? 'alert' : 'status'} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`pointer-events-auto max-w-md border px-5 py-3 text-sm font-semibold shadow-xl ${t.kind === 'error' ? 'border-ons-white bg-ons-black text-ons-white' : 'border-ons-silver/50 bg-ons-graphite text-ons-white'}`}>
              {t.message}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
