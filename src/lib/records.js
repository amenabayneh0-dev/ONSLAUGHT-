import { teamStats } from '../data/achievements.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const yearOf = (t) => Number(t.date.slice(0, 4))
export const placementKey = (n) => (n <= 3 ? String(n) : n <= 10 ? 'top10' : 'other')

export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function formatDate(d) {
  const [y, m, day] = d.split('-')
  return [day && Number(day), m && MONTHS[Number(m) - 1], y].filter(Boolean).join(' ')
}

/** Every achievement type a tournament belongs to (placement-based + awards). */
export function typesOf(t) {
  const s = new Set((t.awards ?? []).map((a) => a.type))
  if (t.placement === 1) s.add('champions')
  if (t.placement === 2) s.add('runner-up')
  if (t.placement === 3) s.add('third')
  return s
}

export const sortByDate = (list, dir = 'asc') =>
  [...list].sort((a, b) => (dir === 'asc' ? 1 : -1) * a.date.localeCompare(b.date))

export function filterTournaments(list, { year, placement, type }) {
  return list.filter(
    (t) =>
      (year === 'all' || yearOf(t) === Number(year)) &&
      (placement === 'all' || placementKey(t.placement) === placement) &&
      (type === 'all' || typesOf(t).has(type)),
  )
}

export const yearsOf = (list) => [...new Set(list.map(yearOf))].sort((a, b) => b - a)

/** Counts for the showcase cards. Awards count individually (a tournament can have several). */
export function countByType(list) {
  const awards = (type) => list.reduce((n, t) => n + (t.awards ?? []).filter((a) => a.type === type).length, 0)
  return {
    champions: list.filter((t) => t.placement === 1).length,
    'runner-up': list.filter((t) => t.placement === 2).length,
    third: list.filter((t) => t.placement === 3).length,
    mvp: awards('mvp'),
    special: awards('special'),
  }
}

/** Resolves 'auto' team statistics from the tournament list. */
export function resolveTeamStats(list) {
  const auto = { victories: list.filter((t) => t.placement === 1).length, appearances: list.length }
  return teamStats.map((s) => ({ ...s, value: s.value === 'auto' ? auto[s.id] ?? 0 : s.value }))
}

export function placementLabel(n) {
  return n === 1 ? 'Champions' : n === 2 ? 'Runner-up' : n === 3 ? 'Third place' : n <= 10 ? 'Top 10' : 'Placed'
}
