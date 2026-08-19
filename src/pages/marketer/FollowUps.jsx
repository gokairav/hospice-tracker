import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'

function formatReminderDate(dateString) {
  // Parse as a plain date (no time/timezone) so "today" comparisons are stable
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export default function FollowUps() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [completingId, setCompletingId] = useState(null)

  useEffect(() => {
    if (!user) return
    let isMounted = true

    async function load() {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('follow_up_reminders')
        .select('id, reminder_date, note, completed, lead_id, leads(patient_first_name, patient_last_name)')
        .eq('marketer_id', user.id)
        .order('reminder_date', { ascending: true })

      if (!isMounted) return
      if (error) setError(error.message)
      else setReminders(data)
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [user])

  async function handleMarkComplete(id) {
    setCompletingId(id)
    const { error } = await supabase.from('follow_up_reminders').update({ completed: true }).eq('id', id)
    setCompletingId(null)

    if (error) {
      setError(error.message)
      return
    }
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: true } : r)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-brand-500" />
      </div>
    )
  }

  const active = reminders.filter((r) => !r.completed)
  const completed = reminders.filter((r) => r.completed)

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight mb-4">Follow-ups</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">{error}</div>
      )}

      {active.length === 0 ? (
        <p className="text-sm text-warm-500 text-center py-10">No upcoming follow-ups.</p>
      ) : (
        <ul className="space-y-2">
          {active.map((r) => (
            <ReminderRow
              key={r.id}
              reminder={r}
              onComplete={() => handleMarkComplete(r.id)}
              completing={completingId === r.id}
            />
          ))}
        </ul>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowCompleted((v) => !v)}
          className="text-sm font-medium text-warm-500"
        >
          {showCompleted ? '▾' : '▸'} Completed ({completed.length})
        </button>

        {showCompleted && (
          <ul className="mt-2 space-y-2">
            {completed.length === 0 ? (
              <p className="text-sm text-warm-400">No completed follow-ups yet.</p>
            ) : (
              completed.map((r) => <ReminderRow key={r.id} reminder={r} />)
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

function ReminderRow({ reminder, onComplete, completing }) {
  const overdue = !reminder.completed && isOverdue(reminder.reminder_date)

  return (
    <li className="bg-white rounded-xl border border-warm-200 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/marketer/leads/${reminder.lead_id}`} className="font-medium text-warm-900 underline">
            {reminder.leads?.patient_first_name} {reminder.leads?.patient_last_name}
          </Link>
          <p className={`text-sm mt-0.5 ${overdue ? 'text-clay-700 font-medium' : 'text-warm-500'}`}>
            {formatReminderDate(reminder.reminder_date)}
            {overdue && ' · Overdue'}
          </p>
          {reminder.note && <p className="text-sm text-warm-600 mt-1">{reminder.note}</p>}
        </div>
        {onComplete && (
          <button
            type="button"
            onClick={onComplete}
            disabled={completing}
            className="shrink-0 rounded-lg border border-warm-300 px-3 py-1.5 text-xs font-medium text-warm-700 disabled:opacity-60 active:bg-warm-50"
          >
            {completing ? 'Saving…' : 'Mark complete'}
          </button>
        )}
      </div>
    </li>
  )
}
