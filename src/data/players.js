import { Compass, Crosshair, Gamepad2, Percent, ShieldPlus, Skull, Star, Swords, Zap } from 'lucide-react'

/* =====================================================================
   ROSTER DATA: the only file you need to edit to manage players.

   ADD a player:     copy one object in `players`, give it a unique `id`.
   EDIT a player:    change its fields.
   REMOVE a player:  delete its object.
   Order in the array = order on the site.

   Every player below is SAMPLE DATA. Names, numbers, countries, biographies,
   statistics and achievements are placeholders, not real people or results.
   When you replace a player with real information, set `sample: false` and
   its "Sample" labels disappear. When no sample players remain, the sample
   notice at the top of the roster page disappears too.

   PHOTOS: put images in public/images/roster/ and set e.g.
   photo: '/images/roster/yourname.jpg'  (portrait, 4:5, about 1000x1250).
   Leave `photo: null` to show the "Player photograph" placeholder.
   Optional `photoPosition` (CSS object-position) controls cropping.
   ===================================================================== */

// Supported roles (keys are used by players below).
export const roles = {
  igl: { label: 'IGL', full: 'In-Game Leader', icon: Compass, summary: 'Leads strategy, makes the in-game calls and keeps the squad on plan.' },
  assault: { label: 'Assault', full: 'Assault', icon: Swords, summary: 'Core fighter who takes and holds engagements for the squad.' },
  entry: { label: 'Entry Fragger', full: 'Entry Fragger', icon: Zap, summary: 'First into the fight, creating openings for teammates.' },
  sniper: { label: 'Sniper', full: 'Sniper', icon: Crosshair, summary: 'Long-range specialist who controls distance and picks off targets.' },
  support: { label: 'Support', full: 'Support', icon: ShieldPlus, summary: 'Enables the squad with utility, trades and cover.' },
}

// Statistic fields shown on cards and profiles.
export const statFields = [
  { key: 'kills', label: 'Total kills', short: 'Kills', icon: Skull, format: (n) => n.toLocaleString('en-US') },
  { key: 'matches', label: 'Matches played', short: 'Matches', icon: Gamepad2, format: (n) => n.toLocaleString('en-US') },
  { key: 'mvps', label: 'MVP awards', short: 'MVPs', icon: Star, format: (n) => n.toLocaleString('en-US') },
  { key: 'winRate', label: 'Win rate', short: 'Win rate', icon: Percent, format: (n) => `${n}%` },
]

const sampleBio =
  'Sample biography. Replace this text with the player’s real background, playstyle and journey with ONS. Two or three short paragraphs work well.'
const sampleAchievements = [
  { title: 'Sample achievement title', event: 'Tournament or event name', year: 'Year' },
  { title: 'Sample achievement title', event: 'Tournament or event name', year: 'Year' },
]

const sample = (n, role, description) => ({
  id: `sample-player-${n}`,
  sample: true,
  username: `PLAYER ${String(n).padStart(2, '0')}`,
  number: n,
  role,
  country: 'Country TBD',
  photo: null,
  photoPosition: 'center top',
  description,
  bio: sampleBio,
  // Rounded numbers on purpose: these are placeholders, not results.
  stats: { kills: n * 200, matches: n * 20 + 100, mvps: n + 5, winRate: 30 + n * 2 },
  achievements: sampleAchievements,
})

export const players = [
  sample(1, 'igl', 'Sample description. Explain how this player leads the squad and what they bring to ONS.'),
  sample(2, 'assault', 'Sample description. Describe this player’s playstyle, strengths and favorite weapons.'),
  sample(3, 'entry', 'Sample description. Describe how this player opens fights and creates space for the team.'),
  sample(4, 'sniper', 'Sample description. Describe this player’s range control and positioning.'),
  sample(5, 'support', 'Sample description. Describe how this player enables teammates and covers the squad.'),
  sample(6, 'assault', 'Sample description. Add a second assault player or delete this entry.'),
]
