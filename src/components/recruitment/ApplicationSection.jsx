import { useState } from 'react'
import { CalendarCheck, FlaskConical, Lock, UserCheck } from 'lucide-react'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'
import Button from '../ui/Button.jsx'
import StatusIndicator from './StatusIndicator.jsx'
import ApplicationForm from './ApplicationForm.jsx'
import { clearSubmission, readSubmission } from '../../lib/application.js'
import { backendConnected } from '../../services/applications.js'
import { recruitment } from '../../data/recruitment.js'

const panel = 'relative border border-ons-silver/15 bg-ons-graphite p-6 sm:p-10'

function ClosedNotice() {
  return (
    <div className="py-6 text-center sm:py-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border border-ons-silver/30 text-ons-silver"><Lock size={28} strokeWidth={1.5} aria-hidden="true" /></div>
      <h3 className="mt-8 font-display text-4xl font-extrabold tracking-wide text-ons-white sm:text-5xl">{recruitment.closedTitle}</h3>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ons-silver">{recruitment.closedMessage}</p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Button href="/">Back to home</Button>
        <Button href="/roster" variant="ghost">Meet the roster</Button>
      </div>
    </div>
  )
}

function AlreadyApplied({ at, onReset }) {
  return (
    <div className="py-6 sm:py-10">
      <div className="flex h-16 w-16 items-center justify-center border border-ons-silver/30 text-ons-silver"><UserCheck size={28} strokeWidth={1.5} aria-hidden="true" /></div>
      <h3 className="mt-8 font-display text-4xl font-extrabold tracking-wide text-ons-white sm:text-5xl">You have already applied</h3>
      <p className="mt-4 max-w-md leading-relaxed text-ons-silver">
        An application was submitted from this browser on {new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}. To avoid duplicates, the form is hidden.
      </p>
      <button type="button" onClick={onReset} className="mt-8 border border-ons-silver/40 px-6 py-3 text-sm font-semibold text-ons-white transition-colors hover:bg-ons-silver hover:text-ons-black">
        Apply with a different PUBG ID
      </button>
    </div>
  )
}

export default function ApplicationSection() {
  const open = recruitment.status === 'open'
  const [previous, setPrevious] = useState(() => readSubmission())

  return (
    <Section id="apply" className="scroll-mt-20" aria-labelledby="apply-title">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="apply-title" intro={open ? 'Fill in the form. Fields marked * are required.' : 'Applications are currently unavailable.'}>Apply to ONS</SectionHeading>
          <StatusIndicator open={open} className="mt-8" />
          {open && (
            <ul className="mt-10 space-y-4 text-sm leading-relaxed text-ons-silver">
              <li className="flex gap-3"><CalendarCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> Have your PUBG ID and Discord username ready.</li>
              <li className="flex gap-3"><UserCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> Be accurate: use your real stats and experience.</li>
            </ul>
          )}
        </div>

        <Reveal className={panel}>
          <span aria-hidden="true" className="absolute left-0 top-0 h-4 w-4 border-l border-t border-ons-silver/70" />
          <span aria-hidden="true" className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-ons-silver/70" />
          {!open ? (
            <ClosedNotice />
          ) : previous ? (
            <AlreadyApplied at={previous.at} onReset={() => { clearSubmission(); setPrevious(null) }} />
          ) : (
            <>
              {!backendConnected && (
                <div role="note" className="mb-8 flex gap-3 border border-dashed border-ons-silver/40 bg-ons-black/60 p-4 text-sm leading-relaxed text-ons-silver">
                  <FlaskConical size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <p><strong className="font-semibold text-ons-white">Demo mode.</strong> No database is connected, so applications are checked but <strong className="font-semibold text-ons-white">not saved or sent</strong>. To connect Supabase, see <code className="text-ons-white">supabase/applications.sql</code> and <code className="text-ons-white">.env.example</code>.</p>
                </div>
              )}
              <ApplicationForm />
            </>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
