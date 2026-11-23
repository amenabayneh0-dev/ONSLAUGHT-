import { Camera, CirclePlay, MessageCircle, AtSign } from 'lucide-react'

export const site = {
  name: 'ONSLAUGHT',
  fullName: 'ONSLAUGHT ESPORTS',
  short: 'ONS',
  slogan: 'Built for the final circle.',
  description: 'A professional PUBG esports organization.',
  // Put your real photograph at public/images/hero.jpg (or change this path).
  heroImage: '/images/hero.jpg',
}

// Phase 01 only builds the homepage; other hrefs are ready for later phases.
export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Roster', href: '/roster' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Media', href: '/media' },
  { label: 'Recruitment', href: '/recruitment' },
  { label: 'Contact', href: '/contact' },
]

export const joinLink = { label: 'Join Us', href: '/recruitment' }

// Replace "#" with real profile URLs.
export const socials = [
  { label: 'Instagram', href: '#', icon: Camera },
  { label: 'YouTube', href: '#', icon: CirclePlay },
  { label: 'Discord', href: '#', icon: MessageCircle },
  { label: 'X', href: '#', icon: AtSign },
]
