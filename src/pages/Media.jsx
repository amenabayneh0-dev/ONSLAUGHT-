import { Info } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import MediaGallery from '../components/media/MediaGallery.jsx'
import VideoHighlights from '../components/media/VideoHighlights.jsx'
import { photos, videos } from '../data/media.js'

export default function Media() {
  const hasSample = photos.some((p) => p.sample) || videos.some((v) => v.sample)
  return (
    <>
      <PageHeader id="media-title" title="Media Center" intro="PUBG moments from ONSLAUGHT: team photographs, gameplay, tournaments and highlights." />

      {hasSample && (
        <div className="bg-ons-black pb-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div role="note" className="flex gap-3 border border-dashed border-ons-silver/40 bg-ons-black/60 p-4 text-sm leading-relaxed text-ons-silver">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>
                <strong className="font-semibold text-ons-white">Sample content.</strong> The photos and videos below are placeholders; no real ONSLAUGHT media is included. Add yours in <code className="text-ons-white">src/data/media.js</code> and put image files in <code className="text-ons-white">public/images/gallery/</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      <MediaGallery />
      <VideoHighlights />
    </>
  )
}
