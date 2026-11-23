import { useState } from 'react'
import { Film, Play } from 'lucide-react'
import { parseYouTubeId } from '../../lib/media.js'

const frame = 'relative aspect-video w-full overflow-hidden border border-ons-silver/25 bg-ons-black'

/**
 * YouTube player with a click-to-load facade: no YouTube code or cookies load
 * until the visitor presses play. Without a valid URL it shows a placeholder.
 */
export default function VideoPlayer({ video }) {
  const id = parseYouTubeId(video.url)
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)

  if (!id) {
    return (
      <div role="img" aria-label={`${video.title} (video placeholder, no YouTube link added yet)`} className={`${frame} texture-diagonal texture-glow flex flex-col items-center justify-center gap-4 text-ons-silver/60`}>
        <Film size={56} strokeWidth={0.9} aria-hidden="true" />
        <p className="px-6 text-center text-sm">Video placeholder. Add a YouTube link in <code className="text-ons-white">src/data/media.js</code>.</p>
      </div>
    )
  }

  if (playing) {
    return (
      <div className={frame}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${video.title}`} className={`${frame} group block text-left`}>
      {!thumbFailed && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" onError={() => setThumbFailed(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ons-black/80 via-ons-black/20 to-ons-black/30" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-ons-silver/60 bg-ons-black/60 text-ons-white backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-ons-silver group-hover:text-ons-black">
        <Play size={32} fill="currentColor" />
      </span>
    </button>
  )
}
