import { roles } from '../data/players.js'
import { experienceOptions } from '../data/recruitment.js'
import { parseYouTubeId } from '../lib/media.js'
import { validImageRef } from './images.js'

const t = (v) => String(v ?? '').trim()
const isInt = (v) => /^\d+$/.test(t(v))
export const slugify = (s) => t(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'
export const uniqueId = (base, existingIds) => { let id = base, n = 2; while (existingIds.includes(id)) id = `${base}-${n++}`; return id }
const urlOk = (v) => { try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false } }

export function validatePlayer(v, { players, editingId }) {
  const e = {}
  const others = players.filter((p) => p.id !== editingId)
  const name = t(v.username)
  if (!name) e.username = 'Enter a username.'
  else if (name.length < 2 || name.length > 30) e.username = 'Username must be 2 to 30 characters.'
  else if (others.some((p) => p.username.toLowerCase() === name.toLowerCase())) e.username = 'Another player already uses this username.'
  if (!t(v.number)) e.number = 'Enter a player number.'
  else if (!isInt(v.number) || Number(v.number) > 99) e.number = 'Use a whole number from 0 to 99.'
  else if (others.some((p) => Number(p.number) === Number(v.number))) e.number = 'Another player already has this number.'
  if (!roles[v.role]) e.role = 'Choose a role.'
  if (!t(v.country)) e.country = 'Enter a country.'
  else if (t(v.country).length > 56) e.country = 'Keep the country under 56 characters.'
  if (t(v.description).length > 200) e.description = 'Keep the short description under 200 characters.'
  if (t(v.bio).length > 1500) e.bio = 'Keep the biography under 1500 characters.'
  for (const k of ['kills', 'matches', 'mvps']) if (!isInt(v[k])) e[k] = 'Use a whole number, 0 or more.'
  if (!isInt(v.winRate) || Number(v.winRate) > 100) e.winRate = 'Use a whole number from 0 to 100.'
  if (!validImageRef(t(v.photo))) e.photo = 'Use an uploaded image, a /path/to/image.jpg, or an https:// link.'
  if (v.achievements.some((a) => (t(a.event) || t(a.year)) && !t(a.title))) e.achievements = 'Every achievement needs a title.'
  return e
}

export function validateTournament(v, { editingId }) {
  const e = {}
  if (!t(v.name)) e.name = 'Enter the tournament name.'
  else if (t(v.name).length > 80) e.name = 'Keep the name under 80 characters.'
  if (!/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/.test(t(v.date))) e.date = 'Choose a month and year.'
  if (!isInt(v.placement) || Number(v.placement) < 1) e.placement = 'Use a whole number, 1 or more.'
  if (!isInt(v.teams) || Number(v.teams) < 1) e.teams = 'Use a whole number, 1 or more.'
  else if (isInt(v.placement) && Number(v.placement) > Number(v.teams)) e.placement = 'Placement cannot be higher than the number of teams.'
  if (t(v.description).length > 300) e.description = 'Keep the description under 300 characters.'
  if (!validImageRef(t(v.image))) e.image = 'Use an uploaded image, a /path/to/image.jpg, or an https:// link.'
  if (v.awards.some((a) => !t(a.label))) e.awards = 'Every award needs a label.'
  void editingId
  return e
}

export function validatePhoto(v, { categories }) {
  const e = {}
  if (!t(v.title)) e.title = 'Enter a title.'
  else if (t(v.title).length > 60) e.title = 'Keep the title under 60 characters.'
  if (!categories.some((c) => c.key === v.category)) e.category = 'Choose a category.'
  if (t(v.caption).length > 200) e.caption = 'Keep the caption under 200 characters.'
  if (t(v.alt).length > 150) e.alt = 'Keep the alt text under 150 characters.'
  if (!validImageRef(t(v.src))) e.src = 'Use an uploaded image, a /path/to/image.jpg, or an https:// link.'
  return e
}

export function validateVideo(v) {
  const e = {}
  if (!t(v.title)) e.title = 'Enter a title.'
  else if (t(v.title).length > 80) e.title = 'Keep the title under 80 characters.'
  if (!t(v.url)) e.url = 'Paste a YouTube link.'
  else if (!parseYouTubeId(v.url)) e.url = 'That is not a valid YouTube link or video ID.'
  if (t(v.description).length > 300) e.description = 'Keep the description under 300 characters.'
  return e
}

export function validateCategory(v, { categories, editingKey }) {
  const e = {}
  const label = t(v.label)
  if (!label) e.label = 'Enter a name.'
  else if (label.length > 24) e.label = 'Keep the name under 24 characters.'
  else if (categories.some((c) => c.key !== editingKey && c.label.toLowerCase() === label.toLowerCase())) e.label = 'A category with this name already exists.'
  return e
}

export function validateClan(v) {
  const e = {}
  if (!t(v.name)) e.name = 'Enter the clan name.'
  if (!t(v.fullName)) e.fullName = 'Enter the full name.'
  if (!t(v.short) || t(v.short).length > 6) e.short = 'Enter a short name of up to 6 characters.'
  if (t(v.slogan).length > 80) e.slogan = 'Keep the slogan under 80 characters.'
  if (t(v.description).length > 200) e.description = 'Keep the description under 200 characters.'
  return e
}

export function validateSocials(rows) {
  const e = {}
  rows.forEach((r, i) => { if (t(r.href) && !urlOk(t(r.href))) e[i] = 'Enter a full link starting with https://' })
  return e
}

export function validateRecruitmentSettings(v) {
  const e = {}
  if (!['open', 'closed'].includes(v.status)) e.status = 'Choose open or closed.'
  if (t(v.description).length < 10 || t(v.description).length > 400) e.description = 'Use 10 to 400 characters.'
  if (!t(v.closedTitle)) e.closedTitle = 'Enter a title for the closed message.'
  if (!t(v.closedMessage)) e.closedMessage = 'Enter the closed message.'
  if (!isInt(v.minAge) || Number(v.minAge) < 10 || Number(v.minAge) > 30) e.minAge = 'Use a whole number from 10 to 30.'
  return e
}

export function validateContent(v) {
  const e = {}
  if (!v.story.some((p) => t(p))) e.story = 'Add at least one paragraph.'
  if (t(v.missionStatement).length < 10) e.missionStatement = 'Enter the mission statement.'
  if (t(v.visionStatement).length < 10) e.visionStatement = 'Enter the vision statement.'
  return e
}

export function validateTeamStats(v) {
  const e = {}
  for (const k of ['matches', 'eliminations', 'dinners']) if (!isInt(v[k])) e[k] = 'Use a whole number, 0 or more.'
  if (!v.victoriesAuto && !isInt(v.victories)) e.victories = 'Use a whole number, 0 or more.'
  if (!v.appearancesAuto && !isInt(v.appearances)) e.appearances = 'Use a whole number, 0 or more.'
  return e
}

/** Checks a pasted application (the JSON from the site's "Copy application data" button). */
export function parseApplicationJson(text) {
  let o
  try { o = JSON.parse(text) } catch { return { error: 'That is not valid JSON.' } }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return { error: 'Expected a single application object.' }
  const missing = ['pubg_username', 'pubg_id', 'age', 'country', 'preferred_role', 'kd_ratio', 'competitive_experience', 'discord_username'].filter((k) => o[k] === undefined || o[k] === '')
  if (missing.length) return { error: `Missing fields: ${missing.join(', ')}.` }
  if (!roles[o.preferred_role]) return { error: `Unknown role "${o.preferred_role}".` }
  if (!experienceOptions.some((x) => x.value === o.competitive_experience)) return { error: `Unknown experience "${o.competitive_experience}".` }
  return { application: o }
}

/** Returns a copy of an errors object without one key (used to clear an error as the user edits). */
export const without = (errors, key) => { const next = { ...errors }; delete next[key]; return next }
