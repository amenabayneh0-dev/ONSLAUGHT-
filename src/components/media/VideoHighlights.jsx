import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import VideoPlayer from './VideoPlayer.jsx'
import { SampleBadge } from '../roster/RoleBadge.jsx'
import { videoCategories, videos } from '../../data/media.js'
import { parseYouTubeId } from '../../lib/media.js'

export default function VideoHighlights() {
  const [activeId, setActiveId] = useState(videos[0]?.id)
  const current = videos.find((v) => v.id === activeId) ?? videos[0]
  if (!current) return null
  const cat = videoCategories[current.category]

  return (
    <Section id="videos" aria-labelledby="videos-title" className="scroll-mt-20">
      <SectionHeading id="videos-title" intro="Best kills, tournament highlights, squad gameplay and epic victories.">Video Highlights</SectionHeading>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <VideoPlayer key={current.id} video={current} />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {cat && <span className="inline-flex items-center gap-1.5 border border-ons-silver/40 px-2.5 py-1 text-[11px] font-semibold text-ons-white"><cat.icon size={12} aria-hidden="true" /> {cat.label}</span>}
                {current.sample && <SampleBadge />}
              </div>
              <h3 className="mt-4 font-display text-4xl font-extrabold leading-none tracking-wide text-ons-white sm:text-5xl">{current.title}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-ons-silver">{current.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul aria-label="All videos" className="max-h-[30rem] space-y-3 overflow-y-auto pr-1 [scrollbar-color:#444_transparent] [scrollbar-width:thin] lg:max-h-[38rem]">
          {videos.map((v) => {
            const c = videoCategories[v.category]
            const active = v.id === current.id
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`group relative flex w-full items-center gap-4 border p-3 text-left transition-colors duration-300 ${active ? 'border-ons-silver bg-ons-graphite' : 'border-ons-silver/15 hover:border-ons-silver/50 hover:bg-ons-graphite/60'}`}
                >
                  <span className={`absolute inset-y-0 left-0 w-0.5 bg-ons-silver transition-transform duration-300 ${active ? 'scale-y-100' : 'scale-y-0'}`} aria-hidden="true" />
                  <span aria-hidden="true" className={`texture-diagonal relative flex aspect-video w-28 shrink-0 items-center justify-center overflow-hidden border border-ons-silver/20 bg-ons-black sm:w-32 ${active ? 'text-ons-white' : 'text-ons-silver/60'}`}>
                    {parseYouTubeId(v.url) && <img src={`https://i.ytimg.com/vi/${parseYouTubeId(v.url)}/mqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                    <Play size={20} fill="currentColor" className="relative" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-xs text-ons-silver">{c && <c.icon size={12} aria-hidden="true" />} {c?.label}</span>
                    <span className="mt-1 block truncate font-display text-2xl font-extrabold leading-tight tracking-wide text-ons-white">{v.title}</span>
                    {v.duration && <span className="text-xs text-ons-silver/70">{v.duration}</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
