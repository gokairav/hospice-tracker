import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { ACTIVE_STATUSES, calculateAge, isAdmittedThisMonth } from '../../lib/leadConstants'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'

export default function MarketerLeads() {
  const { user, profile } = useAuth()
  const [leads, setLeads] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let isMounted = true

    async function load() {
      setLoading(true)
      setError('')

      const today = new Date().toISOString().slice(0, 10)

      const [leadsResult, remindersResult] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .eq('marketer_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('follow_up_reminders')
          .select('id, lead_id, note, leads(patient_first_name, patient_last_name)')
          .eq('marketer_id', user.id)
          .eq('completed', false)
          .eq('reminder_date', today),
      ])

      if (!isMounted) return

      if (leadsResult.error) {
        setError(leadsResult.error.message)
      } else {
        setLeads(leadsResult.data)
      }

      if (!remindersResult.error) {
        setReminders(remindersResult.data)
      }

      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      </div>
    )
  }

  const activeLeadsCount = leads.filter((l) => ACTIVE_STATUSES.includes(l.status)).length
  const admitsThisMonth = leads.filter(isAdmittedThisMonth).length

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-semibold text-slate-900">Hi, {profile?.full_name ?? 'there'}</h1>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <StatCard label="Active leads" value={activeLeadsCount} />
        <StatCard label="Admits this month" value={admitsThisMonth} />
        <StatCard label="Follow-ups due today" value={reminders.length} />
      </div>

      {reminders.length > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-sm font-semibold text-amber-800 mb-2">
            {reminders.length} follow-up{reminders.length > 1 ? 's' : ''} due today
          </p>
          <ul className="space-y-1">
            {reminders.map((r) => (
              <li key={r.id}>
                <Link to={`/marketer/leads/${r.lead_id}`} className="text-sm text-amber-900 underline">
                  {r.leads?.patient_first_name} {r.leads?.patient_last_name}
                  {r.note ? ` — ${r.note}` : ''}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {leads.length === 0 && !error && (
          <p className="text-sm text-slate-500 text-center py-10">
            No leads yet. Tap "Add lead" below to create your first one.
          </p>
        )}

        {leads.map((lead) => (
          <Link
            key={lead.id}
            to={`/marketer/leads/${lead.id}`}
            className="block bg-white rounded-xl border border-slate-200 p-3 active:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {lead.patient_first_name} {lead.patient_last_name}
                  {lead.patient_dob && (
                    <span className="text-slate-400 font-normal"> · {calculateAge(lead.patient_dob)}y</span>
                  )}
                </p>
                <p className="text-sm text-slate-500 truncate">{lead.primary_diagnosis || '—'}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {lead.location_name || '—'} · {lead.referral_source_name || '—'}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/marketer/leads/new"
        aria-label="Add lead"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl leading-none shadow-lg active:bg-slate-800"
      >
        +
      </Link>
    </div>
  )
}
