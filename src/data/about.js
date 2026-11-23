import { Crosshair, Handshake, Map, Radio, ShieldCheck, TrendingUp, Trophy, Users } from 'lucide-react'

export const story = [
  'ONSLAUGHT ESPORTS is a competitive PUBG organization built for players who take the game seriously. We bring dedicated players together under one banner, with clear standards for how we prepare, communicate and compete.',
  'Our approach is practical. We value honest feedback, consistent practice and a team culture where every player understands their role. We let our performance speak for us.',
]

export const mission = {
  statement: 'To compete at the highest standard we can reach, and to get better every time we play.',
  commitments: [
    { title: 'Competitive excellence', text: 'We prepare for every match to win it, not just to take part.' },
    { title: 'Teamwork', text: 'Strong coordination matters more than any single play.' },
    { title: 'Discipline', text: 'Steady routines, reliability and accountability.' },
    { title: 'Improvement', text: 'We review, learn and adjust after every match.' },
  ],
}

export const vision = {
  statement: 'To grow into a respected competitive esports organization, known for strong teams, professional conduct and players who never stop improving.',
  aims: [
    'Build well-coordinated, committed rosters',
    'Earn respect through conduct as much as results',
    'Give dedicated players room to develop',
  ],
}

export const values = [
  { icon: ShieldCheck, title: 'Discipline', text: 'We train with structure, show up on time and hold ourselves to the standards we set.' },
  { icon: Users, title: 'Teamwork', text: 'Every call, rotation and fight is shared. We win and lose as one squad.' },
  { icon: Handshake, title: 'Respect', text: 'For teammates, opponents, staff and the game. Professional conduct is non-negotiable.' },
  { icon: Trophy, title: 'Excellence', text: 'Good enough is never the target. We aim to raise our level in every scrim and every match.' },
]

export const identity = {
  statement: 'We do not rely on instinct alone. We compete through preparation and coordination.',
  items: [
    { icon: Crosshair, title: 'Competitive mindset', text: 'We play to win. Pressure is part of the job, and we prepare to stay composed in the final circle.' },
    { icon: Radio, title: 'Team coordination', text: 'Clear, calm communication and defined roles keep the squad moving as one unit.' },
    { icon: Map, title: 'Strategic gameplay', text: 'Drops, rotations and zone reads are planned, practiced and adapted to each match.' },
    { icon: TrendingUp, title: 'Dedication to improving', text: 'Every match is reviewed. We study mistakes, share what we learn and train to fix them.' },
  ],
}
