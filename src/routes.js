import { lazy } from 'react'
import Home from './pages/Home.jsx'

// Every page except Home loads on demand, which keeps the first download small.
// Add new pages here in later phases. Unknown paths fall back to the first route.
const About = lazy(() => import('./pages/About.jsx'))
const Roster = lazy(() => import('./pages/Roster.jsx'))
const Achievements = lazy(() => import('./pages/Achievements.jsx'))
const Recruitment = lazy(() => import('./pages/Recruitment.jsx'))
const Media = lazy(() => import('./pages/Media.jsx'))

// Admin dashboard (not linked from the public navigation). `admin: true` swaps the public chrome for the dashboard layout.
const AdminOverview = lazy(() => import('./pages/admin/Overview.jsx'))
const AdminPlayers = lazy(() => import('./pages/admin/Players.jsx'))
const AdminApplications = lazy(() => import('./pages/admin/Applications.jsx'))
const AdminTournaments = lazy(() => import('./pages/admin/Tournaments.jsx'))
const AdminGallery = lazy(() => import('./pages/admin/Gallery.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'))

export const routes = [
  { path: '/', component: Home, title: 'ONSLAUGHT ESPORTS | Professional PUBG Organization' },
  { path: '/about', component: About, title: 'About | ONSLAUGHT ESPORTS' },
  { path: '/roster', component: Roster, title: 'Roster | ONSLAUGHT ESPORTS' },
  { path: '/achievements', component: Achievements, title: 'Achievements | ONSLAUGHT ESPORTS' },
  { path: '/recruitment', component: Recruitment, title: 'Recruitment | ONSLAUGHT ESPORTS' },
  { path: '/media', component: Media, title: 'Media | ONSLAUGHT ESPORTS' },
  { path: '/admin', component: AdminOverview, title: 'Admin | ONSLAUGHT ESPORTS', admin: true },
  { path: '/admin/players', component: AdminPlayers, title: 'Players | Admin', admin: true },
  { path: '/admin/applications', component: AdminApplications, title: 'Applications | Admin', admin: true },
  { path: '/admin/tournaments', component: AdminTournaments, title: 'Tournaments | Admin', admin: true },
  { path: '/admin/gallery', component: AdminGallery, title: 'Gallery | Admin', admin: true },
  { path: '/admin/settings', component: AdminSettings, title: 'Settings | Admin', admin: true },
]
