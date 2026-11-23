import { Activity, ClipboardList, Medal, Trophy, Users } from 'lucide-react'
import { Panel, PageTitle, EmptyState, relTime } from '../../components/admin/ui.jsx'
import { RecruitmentToggle } from '../../components/admin/widgets.jsx'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'
import { useAdmin } from '../../admin/AdminProvider.jsx'
import { applicationStatuses } from '../../data/recruitment.js'
import { countByType } from '../../lib/records.js'

function Stat({ icon: Icon, label, value, href, note }) {
  return (
    <a href={href} className="group relative block border border-ons-silver/15 bg-ons-graphite p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ons-silver/50">
      <Icon size={20} strokeWidth={1.6} className="text-ons-silver transition-colors group-hover:text-ons-white" aria-hidden="true" />
      <p className="silver-text-bright mt-4 font-display text-6xl font-black leading-none" data-stat={label}><AnimatedNumber value={value} /></p>
      <p className="mt-2 text-sm text-ons-silver">{label}</p>
      {note && <p className="mt-1 text-xs text-ons-silver/60">{note}</p>}
    </a>
  )
}

export default function Overview() {
  const { state } = useAdmin()
  const apps = state.applications
  const counts = countByType(state.tournaments)
  const achievements = Object.values(counts).reduce((a, b) => a + b, 0)
  const by = (s) => apps.filter((a) => a.status === s).length

  return (
    <>
      <PageTitle title="Overview" intro="A snapshot of your draft website content and recent changes." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total players" value={state.players.length} href="/admin/players" />
        <Stat icon={ClipboardList} label="Pending applications" value={by('pending')} href="/admin/applications" note={`${apps.length} total`} />
        <Stat icon={Trophy} label="Total tournaments" value={state.tournaments.length} href="/admin/tournaments" />
        <Stat icon={Medal} label="Total achievements" value={achievements} href="/admin/tournaments" note="Podiums, MVP and special awards" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel title="Recent administrative activity" className="min-h-[18rem]">
          {state.activity.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet" text="Changes you make in the dashboard will be listed here." />
          ) : (
            <ol aria-label="Recent activity" className="divide-y divide-ons-silver/10">
              {state.activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <span className="text-ons-white">{a.text}</span>
                  <time dateTime={a.at} className="shrink-0 text-xs text-ons-silver">{relTime(a.at)}</time>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Recruitment"><RecruitmentToggle /></Panel>
          <Panel title="Applications by status">
            <ul className="space-y-4">
              {Object.entries(applicationStatuses).map(([key, meta]) => {
                const n = by(key)
                return (
                  <li key={key}>
                    <div className="mb-1.5 flex justify-between text-sm"><span className="text-ons-silver">{meta.label}</span><span className="font-semibold text-ons-white">{n}</span></div>
                    <div className="h-1.5 bg-ons-black"><div className="h-full bg-ons-silver transition-[width] duration-700" style={{ width: apps.length ? `${(n / apps.length) * 100}%` : 0 }} /></div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  )
}
