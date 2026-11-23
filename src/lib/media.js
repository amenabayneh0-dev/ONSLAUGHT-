const ID = /^[\w-]{11}$/

/** Accepts a YouTube watch / youtu.be / shorts / embed / live URL or a bare 11-character ID. Returns the ID or null. */
export function parseYouTubeId(input) {
  const s = String(input ?? '').trim()
  if (!s) return null
  if (ID.test(s)) return s
  try {
    const u = new URL(s)
    const host = u.hostname.replace(/^(www|m)\./, '')
    let id = null
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = u.pathname === '/watch' ? u.searchParams.get('v') : u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1]
    }
    return ID.test(id ?? '') ? id : null
  } catch {
    return null
  }
}

/** Tile layout classes for the dense grid, and the matching placeholder aspect ratio for the viewer. */
export const layoutClass = {
  normal: '',
  wide: 'col-span-2',
  tall: 'row-span-2',
  feature: 'col-span-2 row-span-2',
}
export const layoutRatio = { normal: 4 / 3, wide: 16 / 9, tall: 3 / 4, feature: 16 / 10 }
