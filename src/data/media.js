import { Clapperboard, Crosshair, Crown, Images, Skull, Trophy, Users } from 'lucide-react'

/* =====================================================================
   MEDIA DATA: the only file you edit to manage the gallery and videos.

   PHOTOS (`photos`)
     ADD:      copy one entry, give it a unique `id`.
     REPLACE:  put your image in public/images/gallery/ and set `src`
               (and ideally `thumb`). Remove `sample: true`.
     REMOVE:   delete the entry.   Order here = order on the page.

     category  'team' | 'gameplay' | 'tournaments' | 'victories' | 'behind'
     title     short heading shown on the tile and in the viewer
     caption   one or two sentences shown in the viewer
     alt       describes the image for screen readers
     src       '/images/gallery/your-photo.jpg'  full size, shown in the viewer
     thumb     '/images/gallery/your-photo-thumb.jpg'  small version for the grid
               (optional; falls back to src, but a thumbnail loads much faster)
     width, height   the full image's pixel size (optional, avoids layout shift)
     layout    'normal' | 'wide' | 'tall' | 'feature'   tile size in the grid
     sample    true shows a "Sample" badge and the placeholder look.

   IMAGE TIPS: JPG/WebP, full size at most ~2000px wide and under ~400 KB,
   thumbnail ~800px wide and under ~120 KB (squoosh.app is a free tool).
   With no `src`, a clearly marked placeholder is shown (no fake photos).

   VIDEOS (`videos`)
     Paste any YouTube link into `url` (watch, youtu.be, shorts or embed links,
     or just the 11-character ID). Leave `url: ''` to show a placeholder.
     Videos load only after the visitor presses play (faster pages, better privacy).

   EVERYTHING BELOW IS SAMPLE CONTENT: no real ONSLAUGHT media is included.
   ===================================================================== */

// Gallery filters. 'all' is built in; the rest match `category` on photos.
export const categories = [
  { key: 'all', label: 'All Media', icon: Images },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'gameplay', label: 'Gameplay', icon: Crosshair },
  { key: 'tournaments', label: 'Tournaments', icon: Trophy },
  { key: 'victories', label: 'Victories', icon: Crown },
  { key: 'behind', label: 'Behind the Scenes', icon: Clapperboard },
]

const photo = (n, category, layout, title) => ({
  id: `photo-${String(n).padStart(2, '0')}`,
  sample: true,
  category,
  layout,
  title,
  caption: 'Sample caption. Describe the moment, who is in it and where it happened.',
  alt: `${title} (placeholder, no photograph added yet)`,
  src: null,
  thumb: null,
})

export const photos = [
  photo(1, 'team', 'feature', 'Team photograph 01'),
  photo(2, 'gameplay', 'wide', 'Gameplay screenshot 01'),
  photo(3, 'tournaments', 'normal', 'Tournament moment 01'),
  photo(4, 'victories', 'tall', 'Victory celebration 01'),
  photo(5, 'behind', 'normal', 'Behind the scenes 01'),
  photo(6, 'team', 'normal', 'Team photograph 02'),
  photo(7, 'gameplay', 'normal', 'Gameplay screenshot 02'),
  photo(8, 'tournaments', 'wide', 'Tournament moment 02'),
  photo(9, 'victories', 'normal', 'Victory celebration 02'),
  photo(10, 'team', 'tall', 'Team photograph 03'),
  photo(11, 'gameplay', 'normal', 'Gameplay screenshot 03'),
  photo(12, 'tournaments', 'tall', 'Tournament moment 03'),
  photo(13, 'behind', 'wide', 'Behind the scenes 02'),
]

// Video groups, shown as labels on each video.
export const videoCategories = {
  'best-kills': { label: 'Best kills', icon: Skull },
  tournament: { label: 'Tournament highlights', icon: Trophy },
  squad: { label: 'Squad gameplay', icon: Users },
  victories: { label: 'Epic victories', icon: Crown },
}

const video = (n, category, title) => ({
  id: `video-${String(n).padStart(2, '0')}`,
  sample: true,
  category,
  title,
  description: 'Sample description. Say what happens in this clip and when it was played.',
  url: '', // paste a YouTube link here
  duration: '',
})

export const videos = [
  video(1, 'best-kills', 'Best kills 01'),
  video(2, 'tournament', 'Tournament highlights 01'),
  video(3, 'squad', 'Squad gameplay 01'),
  video(4, 'victories', 'Epic victory 01'),
  video(5, 'best-kills', 'Best kills 02'),
  video(6, 'tournament', 'Tournament highlights 02'),
  video(7, 'squad', 'Squad gameplay 02'),
  video(8, 'victories', 'Epic victory 02'),
]
