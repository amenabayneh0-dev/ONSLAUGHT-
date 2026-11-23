import { Activity, CircleCheck, CircleX, Crosshair, Hourglass, MessageSquare, ShieldCheck, Users } from 'lucide-react'

/* =====================================================================
   RECRUITMENT CONFIG: edit this file to run recruitment.

   OPEN / CLOSED
     Set `status` to 'open' or 'closed' and rebuild/redeploy.
     When 'closed': the Apply Now button is disabled, the form is not shown,
     and `closedTitle` / `closedMessage` are displayed instead.
     (This is a front-end switch. To also block closed-period submissions at
     the database level, add a check to the Supabase insert policy.)

   REQUIREMENTS: add, edit or remove entries in `requirements`.
   EXPERIENCE OPTIONS: edit `experienceOptions` (value is what gets stored).
   MINIMUM AGE: `minAge` (default is a placeholder, set your own policy).
   ===================================================================== */

export const recruitment = {
  status: 'open', // 'open' | 'closed'
  description:
    'ONSLAUGHT ESPORTS is looking for dedicated PUBG players who want to compete seriously. Tell us about your gameplay, your experience and your goals.',
  closedTitle: 'Recruitment is currently closed',
  closedMessage:
    'We are not accepting new applications right now. Please check back later for updates.',
  minAge: 16,
}

export const requirements = [
  { icon: Activity, title: 'Active player', text: 'Play regularly and be available for practice and matches.' },
  { icon: MessageSquare, title: 'Good communication', text: 'Share clear, calm information and respect the call.' },
  { icon: Users, title: 'Teamwork', text: 'Put the squad’s result ahead of individual stats.' },
  { icon: ShieldCheck, title: 'Discipline', text: 'Show up on time, follow the plan and take feedback well.' },
  { icon: Crosshair, title: 'Competitive mindset', text: 'Play to win, learn from every loss and keep improving.' },
]

export const experienceOptions = [
  { value: 'none', label: 'No competitive experience yet' },
  { value: 'scrims', label: 'Scrims and custom rooms' },
  { value: 'online', label: 'Online tournaments' },
  { value: 'lan', label: 'Local or regional events' },
  { value: 'pro', label: 'Professional or franchise level' },
]

// Application lifecycle. New applications are always 'pending';
// 'accepted' / 'rejected' are set later by staff (admin tooling is a future phase).
export const applicationStatuses = {
  pending: { label: 'Pending', icon: Hourglass },
  accepted: { label: 'Accepted', icon: CircleCheck },
  rejected: { label: 'Rejected', icon: CircleX },
}
export const defaultStatus = 'pending'
