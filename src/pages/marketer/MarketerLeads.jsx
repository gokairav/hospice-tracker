import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import {
  ACTIVE_STATUSES,
  calculateAge,
  isAdmittedThisMonth,
  isAdmittedLastMonth,
  isCreatedInLastDays,
} from '../../lib/leadConstants'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { IconPeople, IconCheckBadge, IconBell, IconPhone, IconPlus } from '../../components/icons'

const PIPELINE_STAGES = [
  { status: 'new_lead', label: 'New', tint: 'blue' },
  { status: 'eval_scheduled', label: 'Evaluation', tint: 'purple' },
  { status: 'admitted', label: 'Admitted', tint: 'sage' },
]

const PIPELINE_TINTS = {
  blue: { bg: 'bg-blue-50', count: 'text-blue-700', label: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', count: 'text-purple-700', label: 'text-purple-600' },
  sage: { bg: 'bg-sage-50', count: 'text-sage-600', label: 'text-sage-600' },
}

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
          .select('id, lead_id, reminder_date, note, leads(patient_first_name, patient_last_name)')
          .eq('marketer_id', user.id)
          .eq('completed', false)
          .lte('reminder_date', today),
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-brand-500" />
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const overdueReminders = reminders.filter((r) => r.reminder_date < today)
  const dueTodayReminders = reminders.filter((r) => r.reminder_date === today)
  const priorities = [...overdueReminders, ...dueTodayReminders]

  const activeLeadsCount = leads.filter((l) => ACTIVE_STATUSES.includes(l.status)).length
  const newThisWeek = leads.filter((l) => isCreatedInLastDays(l, 7)).length

  const admitsThisMonth = leads.filter(isAdmittedThisMonth).length
  const admitsLastMonth = leads.filter(isAdmittedLastMonth).length
  const admitsDelta =
    admitsThisMonth > admitsLastMonth
      ? { direction: 'up', text: `+${admitsThisMonth - admitsLastMonth} vs last month` }
      : admitsThisMonth < admitsLastMonth
        ? { direction: 'down', text: `${admitsThisMonth - admitsLastMonth} vs last month` }
        : { text: 'Same as last month' }

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight">
        Hi, {profile?.full_name ?? 'there'}
      </h1>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <StatCard
          label="Active Leads"
          value={activeLeadsCount}
          icon={IconPeople}
          tint="brand"
          delta={newThisWeek > 0 ? { direction: 'up', text: `+${newThisWeek} this week` } : undefined}
        />
        <StatCard label="Admits MTD" value={admitsThisMonth} icon={IconCheckBadge} tint="sage" delta={admitsDelta} />
        <StatCard
          label="Follow-ups Today"
          value={dueTodayReminders.length}
          icon={IconBell}
          tint="clay"
          delta={overdueReminders.length > 0 ? { direction: 'down', text: `${overdueReminders.length} overdue` } : undefined}
        />
      </div>

      {priorities.length > 0 && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-warm-500">Today's Priorities</span>
          </div>
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm shadow-warm-100 divide-y divide-warm-100 overflow-hidden">
            {priorities.map((r) => {
              const overdue = r.reminder_date < today
              return (
                <Link
                  key={r.id}
                  to={`/marketer/leads/${r.lead_id}`}
                  className="flex items-center gap-3 px-3.5 py-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      overdue ? 'bg-clay-100 text-clay-700' : 'bg-gold-100 text-gold-700'
                    }`}
                  >
                    <IconPhone size={14} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-warm-900 truncate">
                      {r.leads?.patient_first_name} {r.leads?.patient_last_name}
                    </p>
                    {r.note && <p className="text-xs text-warm-500 truncate mt-0.5">{r.note}</p>}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-extrabold px-2 py-1 rounded-full ${
                      overdue ? 'bg-clay-100 text-clay-700' : 'bg-gold-100 text-gold-700'
                    }`}
                  >
                    {overdue ? 'Overdue' : 'Today'}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-warm-500">Pipeline Overview</span>
        </div>
        <div className="bg-white rounded-2xl border border-warm-200 shadow-sm shadow-warm-100 p-3 flex gap-2">
          {PIPELINE_STAGES.map((stage) => {
            const count = leads.filter((l) => l.status === stage.status).length
            const t = PIPELINE_TINTS[stage.tint]
            return (
              <div key={stage.status} className={`flex-1 rounded-xl text-center py-2.5 ${t.bg}`}>
                <div className={`text-lg font-extrabold font-heading ${t.count}`}>{count}</div>
                <div className={`text-[9.5px] font-bold uppercase tracking-wide mt-0.5 ${t.label}`}>{stage.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">
          {error}
        </div>
      )}

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-warm-500">Recent Leads</span>
        </div>
        <div className="space-y-2.5">
          {leads.length === 0 && !error && (
            <p className="text-sm text-warm-500 text-center py-10">
              No leads yet. Tap "Add lead" below to create your first one.
            </p>
          )}

          {leads.map((lead) => (
            <Link
              key={lead.id}
              to={`/marketer/leads/${lead.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-warm-200 shadow-sm shadow-warm-100 p-3 active:bg-warm-50"
            >
              <Avatar firstName={lead.patient_first_name} lastName={lead.patient_last_name} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-warm-900 truncate text-[13.5px]">
                  {lead.patient_first_name} {lead.patient_last_name}
                  {lead.patient_dob && (
                    <span className="text-warm-400 font-medium"> · {calculateAge(lead.patient_dob)}y</span>
                  )}
                </p>
                <p className="text-xs text-warm-500 truncate mt-0.5">
                  {lead.primary_diagnosis || '—'} · {lead.location_name || '—'}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </Link>
          ))}
        </div>
      </div>

      <div className="h-16" />

      <Link
        to="/marketer/leads/new"
        aria-label="Add lead"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-200 active:from-brand-600 active:to-brand-700"
      >
        <IconPlus size={26} strokeWidth={2.4} />
      </Link>
    </div>
  )
}
