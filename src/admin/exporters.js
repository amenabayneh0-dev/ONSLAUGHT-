import { isDataUrl } from './images.js'
import { SEED_VERSION } from './seed.js'

const js = (v) => JSON.stringify(v, null, 2)

/** Swaps an uploaded (data URL) image for a file path and records the file to download. */
function filePath(value, name, folder, files) {
  if (!isDataUrl(value)) return value
  const file = `${name}.jpg`
  files.push({ name: file, folder, path: `public/images/${folder}/${file}`, dataUrl: value })
  return `/images/${folder}/${file}`
}

/**
 * Each exporter returns { sections: [{ title, target, steps, code }], files: [...] }.
 * `code` is paste-ready for the named data file.
 */
export function exportPlayers(state) {
  const files = []
  const list = state.players.map((p) => ({ ...p, photo: filePath(p.photo, p.id, 'roster', files) }))
  return {
    files,
    sections: [{
      title: 'Players',
      target: 'src/data/players.js',
      steps: 'Replace the `export const players = [ ... ]` block at the bottom of the file with this code. (The `sample` helper above it can then be deleted.)',
      code: `export const players = ${js(list)}\n`,
    }],
  }
}

export function exportTournaments(state) {
  const files = []
  const list = state.tournaments.map((t) => ({ ...t, image: filePath(t.image, t.id, 'tournaments', files) }))
  const s = state.teamStats
  return {
    files,
    sections: [
      {
        title: 'Tournaments',
        target: 'src/data/achievements.js',
        steps: 'Replace the whole `export const tournaments = [ ... ].map(...)` statement (from that line down to the line before `export const teamStatsSample`) with this code.',
        code: `export const tournaments = ${js(list)}\n`,
      },
      {
        title: 'Team statistics',
        target: 'src/data/achievements.js',
        steps: 'Set `teamStatsSample` and the `value` of each entry in `teamStats` to match.',
        code: `export const teamStatsSample = ${s.sample ? 'true' : 'false'}\n\n// values for the teamStats entries:\n//   victories:    ${s.victoriesAuto ? "'auto'" : s.victories}\n//   matches:      ${s.matches}\n//   eliminations: ${s.eliminations}\n//   dinners:      ${s.dinners}\n//   appearances:  ${s.appearancesAuto ? "'auto'" : s.appearances}\n`,
      },
    ],
  }
}

export function exportMedia(state) {
  const files = []
  const photos = state.photos.map((p) => ({ ...p, src: filePath(p.src, p.id, 'gallery', files) || null, thumb: p.thumb || null }))
  return {
    files,
    sections: [
      { title: 'Photos', target: 'src/data/media.js', steps: 'Replace the `export const photos = [ ... ]` block with this code.', code: `export const photos = ${js(photos)}\n` },
      { title: 'Videos', target: 'src/data/media.js', steps: 'Replace the `export const videos = [ ... ]` block with this code.', code: `export const videos = ${js(state.videos)}\n` },
      {
        title: 'Categories',
        target: 'src/data/media.js',
        steps: 'Categories carry an icon, so add or rename entries in the `categories` list by hand. Keep `key` values identical to the ones photos use.',
        code: state.categories.map((c) => `{ key: '${c.key}', label: '${c.label.replace(/'/g, "\\'")}', icon: Images },`).join('\n') + '\n',
      },
    ],
  }
}

export function exportSettings(state) {
  const { clan, socials, recruitment, content } = state.settings
  return {
    files: [],
    sections: [
      { title: 'Clan information', target: 'src/data/site.js', steps: 'Update these values inside `export const site = { ... }`.', code: `name: ${js(clan.name)},\nfullName: ${js(clan.fullName)},\nshort: ${js(clan.short)},\nslogan: ${js(clan.slogan)},\ndescription: ${js(clan.description)},\n` },
      { title: 'Social links', target: 'src/data/site.js', steps: 'Set each `href` in `export const socials` (match by label).', code: socials.map((s) => `${s.label}: ${s.href || '(leave as "#")'}`).join('\n') + '\n' },
      { title: 'Recruitment', target: 'src/data/recruitment.js', steps: 'Update these values inside `export const recruitment = { ... }`.', code: `status: '${recruitment.status}',\ndescription: ${js(recruitment.description)},\nclosedTitle: ${js(recruitment.closedTitle)},\nclosedMessage: ${js(recruitment.closedMessage)},\nminAge: ${Number(recruitment.minAge)},\n` },
      { title: 'About page content', target: 'src/data/about.js', steps: 'Replace `export const story = [...]`, and update `statement` inside `mission` and `vision`.', code: `export const story = ${js(content.story.filter((p) => p.trim()))}\n\n// mission.statement:\n${js(content.missionStatement)}\n\n// vision.statement:\n${js(content.visionStatement)}\n` },
    ],
  }
}

export function exportBackup(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
}

export function parseBackup(text) {
  let o
  try { o = JSON.parse(text) } catch { return { error: 'That file is not valid JSON.' } }
  if (!o || o.version !== SEED_VERSION) return { error: 'This backup is from an incompatible version.' }
  for (const k of ['players', 'applications', 'tournaments', 'photos', 'videos', 'categories', 'activity']) if (!Array.isArray(o[k])) return { error: `The backup is missing "${k}".` }
  if (!o.settings?.clan || !o.settings?.recruitment || !o.teamStats) return { error: 'The backup is missing settings.' }
  const { exportedAt, ...state } = o
  void exportedAt
  return { state }
}

export function downloadText(name, text, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  downloadHref(name, url)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadHref(name, href) {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}
