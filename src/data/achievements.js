import { Award, Drumstick, Flag, Gamepad2, Medal, Skull, Sparkles, Star, Trophy } from 'lucide-react'

/* =====================================================================
   ACHIEVEMENTS DATA: the only file you need to edit on this page.

   TOURNAMENTS (`tournaments` below)
     ADD:     copy one object, give it a unique `id`.
     EDIT:    change its fields.   REMOVE: delete its object.
     Order does not matter; the page sorts by date.

     date        'YYYY-MM' or 'YYYY-MM-DD'
     placement   final position as a number (1, 2, 3, 4, ...)
     teams       number of participating teams
     image       '/images/tournaments/your-file.jpg' (16:9, about 1200x675)
                 or null to show the "Tournament image" placeholder
     awards      extra honors for that tournament, any of:
                 { type: 'mvp',     label: 'Tournament MVP', player: 'Name' }
                 { type: 'special', label: 'What happened' }
     sample      true = shows a "Sample" badge. Set false for real records.

   Champions / runner-up / third-place counts, the filters and the timeline
   are all calculated from this list automatically.

   TEAM STATISTICS (`teamStats` below)
     Use a number for a fixed value. Use 'auto' for tournament victories and
     appearances to calculate them from the tournament list above.
     Set `teamStatsSample` to false once the numbers are real.

   EVERYTHING BELOW IS SAMPLE DATA. Names, dates, placements, team counts and
   statistics are placeholders, not real tournaments or results.
   ===================================================================== */

export const tournaments = [
  { id: 't01', sample: true, name: 'Tournament Name 01', date: '2024-03', placement: 5, teams: 16, image: null, awards: [] },
  { id: 't02', sample: true, name: 'Tournament Name 02', date: '2024-06', placement: 3, teams: 20, image: null, awards: [] },
  { id: 't03', sample: true, name: 'Tournament Name 03', date: '2024-09', placement: 2, teams: 24, image: null, awards: [{ type: 'mvp', label: 'Sample MVP award', player: 'PLAYER 02' }] },
  { id: 't04', sample: true, name: 'Tournament Name 04', date: '2025-02', placement: 1, teams: 16, image: null, awards: [{ type: 'mvp', label: 'Sample MVP award', player: 'PLAYER 01' }] },
  { id: 't05', sample: true, name: 'Tournament Name 05', date: '2025-05', placement: 8, teams: 32, image: null, awards: [] },
  { id: 't06', sample: true, name: 'Tournament Name 06', date: '2025-08', placement: 1, teams: 20, image: null, awards: [{ type: 'special', label: 'Sample special achievement' }] },
  { id: 't07', sample: true, name: 'Tournament Name 07', date: '2025-11', placement: 4, teams: 24, image: null, awards: [] },
  { id: 't08', sample: true, name: 'Tournament Name 08', date: '2026-04', placement: 2, teams: 16, image: null, awards: [{ type: 'special', label: 'Sample special achievement' }] },
  { id: 't09', sample: true, name: 'Tournament Name 09', date: '2026-09', placement: 12, teams: 32, image: null, awards: [] },
].map((t) => ({
  ...t,
  description: 'Sample description. Summarize the format, the competition and how ONS performed.',
}))

export const teamStatsSample = true
export const teamStats = [
  { id: 'victories', label: 'Tournament victories', icon: Trophy, value: 'auto' },
  { id: 'matches', label: 'Total matches', icon: Gamepad2, value: 240 },
  { id: 'eliminations', label: 'Total eliminations', icon: Skull, value: 1500 },
  { id: 'dinners', label: 'Chicken dinners', icon: Drumstick, value: 30 },
  { id: 'appearances', label: 'Tournament appearances', icon: Flag, value: 'auto' },
]

// Achievement types: used by the showcase cards and the "Achievement" filter.
export const achievementTypes = [
  { key: 'champions', label: 'Champions', short: 'Champions', icon: Trophy, art: 'cup', text: 'First-place finishes.' },
  { key: 'runner-up', label: 'Runner-up', short: 'Runner-up', icon: Medal, art: 'medal', artLabel: '2', text: 'Second-place finishes.' },
  { key: 'third', label: 'Third place', short: 'Third place', icon: Award, art: 'medal', artLabel: '3', text: 'Podium finishes in third.' },
  { key: 'mvp', label: 'MVP awards', short: 'MVP', icon: Star, art: 'star', text: 'Individual MVP honors earned by ONS players.' },
  { key: 'special', label: 'Special achievements', short: 'Special', icon: Sparkles, art: 'gem', text: 'Standout moments and records beyond the final placement.' },
]

export const placementGroups = [
  { key: '1', label: '1st place' },
  { key: '2', label: '2nd place' },
  { key: '3', label: '3rd place' },
  { key: 'top10', label: 'Top 10' },
  { key: 'other', label: 'Other' },
]

