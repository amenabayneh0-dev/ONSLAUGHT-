import { players } from '../data/players.js'
import { tournaments, teamStatsSample } from '../data/achievements.js'
import { photos, videos, categories } from '../data/media.js'
import { recruitment } from '../data/recruitment.js'
import { site, socials } from '../data/site.js'
import { mission, story, vision } from '../data/about.js'

const clone = (v) => JSON.parse(JSON.stringify(v))

// Clearly marked sample applicants so the Applications screen is usable before a database exists.
const app = (n, status, role, kd, country, created, notes = '') => ({
  id: `app-sample-${n}`,
  sample: true,
  created_at: created,
  status,
  pubg_username: `APPLICANT_${n}`,
  pubg_id: `SAMPLE-ID-${1000 + n}`,
  age: 18 + n,
  country,
  preferred_role: role,
  kd_ratio: kd,
  competitive_experience: ['none', 'scrims', 'online', 'lan'][n % 4],
  previous_clan: n % 2 ? 'Sample Clan' : null,
  discord_username: `applicant_${n}`,
  additional_info: 'Sample application. Replace with real applications once a database is connected.',
  admin_notes: notes,
  reviewed_at: status === 'pending' ? null : created,
})

export const SEED_VERSION = 1

/** The starting draft: exactly what the public website currently shows. */
export function createSeed() {
  return {
    version: SEED_VERSION,
    players: clone(players),
    applications: [
      app(1, 'pending', 'sniper', 3.2, 'Country TBD', '2026-11-20T09:30:00Z'),
      app(2, 'pending', 'igl', 2.4, 'Country TBD', '2026-11-18T14:10:00Z'),
      app(3, 'accepted', 'assault', 4.1, 'Country TBD', '2026-11-10T11:00:00Z', 'Strong trial. Sample note.'),
      app(4, 'rejected', 'support', 1.1, 'Country TBD', '2026-11-05T16:45:00Z', 'Did not meet requirements. Sample note.'),
    ],
    tournaments: clone(tournaments),
    teamStats: { sample: teamStatsSample, matches: 240, eliminations: 1500, dinners: 30, victoriesAuto: true, victories: 0, appearancesAuto: true, appearances: 0 },
    photos: clone(photos),
    videos: clone(videos),
    categories: categories.filter((c) => c.key !== 'all').map(({ key, label }) => ({ key, label })),
    settings: {
      clan: { name: site.name, fullName: site.fullName, short: site.short, slogan: site.slogan, description: site.description },
      socials: socials.map(({ label, href }) => ({ label, href: href === '#' ? '' : href })),
      recruitment: { status: recruitment.status, description: recruitment.description, closedTitle: recruitment.closedTitle, closedMessage: recruitment.closedMessage, minAge: recruitment.minAge },
      content: { story: [...story], missionStatement: mission.statement, visionStatement: vision.statement },
    },
    activity: [],
  }
}
